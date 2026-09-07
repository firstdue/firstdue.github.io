import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
// The authoring folder intentionally keeps its PWA shell in the public checkout.
const pwaRoot = existsSync(resolve(root, 'ship.js')) ? resolve(root, 'gh-pages-deploy') : root;
const localAsset = (name) => {
  assert.equal(typeof name, 'string');
  assert.ok(name.length && !/^(?:[a-z]+:|\/|\\)/i.test(name), 'asset must be relative');
  const path = resolve(pwaRoot, name);
  assert.ok(path.startsWith(pwaRoot + sep), 'asset must stay inside the PWA folder');
  return path;
};

test('complete game document has a mobile viewport and build tag', () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<title>[^<]*Philly Fire Dispatch[^<]*<\/title>/i);
  assert.match(html, /<meta\b[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i);
  assert.match(html, /<\/body>\s*<\/html>\s*$/i);
  assert.equal([...html.matchAll(/const BUILD\s*=\s*["']v\d+[a-z]["']/g)].length, 1);
});

// The library and the baked data live in vendor/ and data/ so that index.html stays small enough to
// read, diff and edit on a phone. They are plain classic scripts loaded before the game script, so
// their top-level `const` bindings are in scope for it exactly as when they were inline.
test('every script compiles, and external scripts are local files loaded before the game', () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  assert.ok(scripts.length >= 2, 'expected library and game scripts');
  let sawExternal = false;
  for (const [i, [, attributes, source]] of scripts.entries()) {
    assert.doesNotMatch(attributes, /\btype\s*=\s*["']module["']/i, 'update checker if adopting modules');
    assert.doesNotMatch(attributes, /\b(?:defer|async)\b/i, 'data must execute before the game script');
    const src = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
    if (src) {
      sawExternal = true;
      assert.equal(source.trim(), '', 'a script with src must have no body');
      new Script(readFileSync(localAsset(src), 'utf8'), { filename: src });
      continue;
    }
    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1];
    if (type === 'application/ld+json' || type === 'application/json') JSON.parse(source);
    else new Script(source, { filename: `index.html:inline-script-${i + 1}` });
  }
  assert.ok(sawExternal, 'expected the extracted vendor/data scripts');
});

test('extracted data loads before the game script that reads it', () => {
  const order = [...html.matchAll(/<script\b([^>]*)>/gi)].map(m => m[1]);
  const srcs = order.map(a => a.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1] ?? null);
  const gameScript = srcs.lastIndexOf(null);
  for (const [i, src] of srcs.entries()) {
    if (src && /^(?:data|vendor)\//.test(src)) assert.ok(i < gameScript, `${src} must precede the game script`);
  }
  // Each extracted global is declared exactly once, in its own file, and no longer in index.html.
  for (const name of ['ADDR', 'RB', 'AB', 'LMKS', 'NAVGEO', 'LANDCOVER']) {
    const file = `data/${name.toLowerCase()}.js`;
    if (!srcs.includes(file)) continue;
    assert.doesNotMatch(html, new RegExp(`^const ${name}\\s*=`, 'm'), `${name} should live in ${file}`);
    assert.match(readFileSync(localAsset(file), 'utf8'), new RegExp(`^const ${name}\\s*=`));
  }
});

test('index.html stays small enough to edit on a phone', () => {
  // The whole point of the extraction: a 10MB file with multi-megabyte lines crashes mobile clients
  // when rendered as a diff. Keep the game file itself modest and free of giant lines.
  assert.ok(html.length < 1_500_000, `index.html is ${html.length} bytes; keep baked data in data/`);
  const worst = html.split('\n').reduce((a, l) => Math.max(a, l.length), 0);
  assert.ok(worst < 8_000, `longest line is ${worst} chars; wrap it or move it to data/`);
});

test('PWA references exist and service worker compiles', () => {
  // GitHub Pages runs Jekyll, which filters some paths out of the published site. The game now
  // depends on data/ and vendor/ being served verbatim, so .nojekyll is load-bearing, not cosmetic.
  assert.ok(existsSync(localAsset('.nojekyll')), '.nojekyll must exist so Pages publishes data/ and vendor/');
  assert.match(html, /<link\b[^>]*rel=["']manifest["'][^>]*href=["']manifest.json["']/i);
  assert.match(html, /serviceWorker\.register\(["']sw\.js["']\)/);
  new Script(readFileSync(localAsset('sw.js'), 'utf8'), { filename: 'sw.js' });
});

test('Local manifest references PNG icons with matching dimensions', () => {
  const manifest = JSON.parse(readFileSync(localAsset('manifest.json'), 'utf8'));
  assert.equal(manifest.name, 'Local');
  assert.equal(manifest.short_name, 'Local');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2);
  for (const size of ['192x192', '512x512']) {
    assert.ok(manifest.icons.some(icon => icon.sizes === size), `missing ${size} icon`);
  }
  assert.ok(manifest.icons.some(icon => icon.purpose?.split(/\s+/).includes('maskable')));
  for (const icon of manifest.icons) {
    const png = readFileSync(localAsset(icon.src));
    assert.equal(icon.type, 'image/png');
    assert.ok(png.length >= 24, `${icon.src} is truncated`);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.subarray(12, 16).toString(), 'IHDR');
    assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
  }
});
