import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
// The PWA shell (manifest, icons) is authored in the folder this test sits in (since October 30, 2026; it used to live only in
// the public checkout). publish.cjs copies it with the release.
const pwaRoot = root;
const localAsset = (name, base = pwaRoot) => {
  assert.equal(typeof name, 'string');
  assert.ok(name.length && !/^(?:[a-z]+:|\/|\\)/i.test(name), 'asset must be relative');
  const path = resolve(base, name);
  assert.ok(path.startsWith(base + sep), 'asset must stay inside its source folder');
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
      // Check the actual authoring page's dependencies; the publish checkout deliberately
      // stays unchanged during local-only previews. Never validate an old deployed script.
      new Script(readFileSync(localAsset(src.replace(/\?.*$/, ''), root), 'utf8'), { filename: src });   // firehouse-models.js?v=<BUILD>
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
  const srcs = order.map(a => a.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]?.replace(/\?.*$/, '') ?? null);   // data/rb.js?h=<stamp>
  const gameScript = srcs.lastIndexOf(null);
  for (const [i, src] of srcs.entries()) {
    if (src && /^(?:data|vendor)\//.test(src)) assert.ok(i < gameScript, `${src} must precede the game script`);
  }
  // Each extracted global is declared exactly once, in its own file, and no longer in index.html.
  for (const name of ['ADDR', 'RB', 'AB', 'LMKS', 'NAVGEO', 'LANDCOVER', 'BTYPE', 'RREF', 'PFDBOX', 'PFDRUN', 'CLEARANCE', 'NARROW', 'INST', 'ROADW']) {
    const file = name === 'LANDCOVER' && srcs.includes('data/landcover-packed.js') ? 'data/landcover-packed.js' : `data/${name.toLowerCase()}.js`;   // v20t: the packed land file
    if (!srcs.includes(file)) continue;
    assert.doesNotMatch(html, new RegExp(`^const ${name}\\s*=`, 'm'), `${name} should live in ${file}`);
    // The authoring copy, as above: a new data file is not in the publish checkout until release.
    assert.match(readFileSync(localAsset(file, root), 'utf8'), new RegExp(`^const ${name}\\s*=`));
  }
});

// Audit B13 (November 4, 2026): every data / vendor / assets script carries ?h=<the first 10 hex of the sha256 of its contents,
// carriage returns left out>, so a changed file is a new address (a phone fetches it at once) and an unchanged one is kept across
// releases by sw.js (DATA). The authoring folder's stamp-data.cjs writes them; a stale stamp would serve the old file.
test('every data, vendor and assets script carries its contents stamp', () => {
  const tags = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]).filter(s => /^(?:data|vendor|assets)\//.test(s));
  assert.ok(tags.length >= 10, 'expected the data scripts');
  for (const t of tags) {
    const file = t.replace(/\?.*$/, ''), h = (t.match(/[?&]h=([0-9a-f]+)/) || [])[1];
    const want = createHash('sha256').update(readFileSync(localAsset(file, root)).toString('latin1').replace(/\r/g, ''), 'latin1').digest('hex').slice(0, 10);
    assert.equal(h, want, `${file} is stamped ${h || '(none)'} but its contents are ${want}: run node stamp-data.cjs`);
  }
});

test('the department data is never a script tag of the page (members only, November 3, 2026)', () => {
  // data/pfdbox.js, pfdrun.js, pfdlook.js and pfdaddr.js come from the PFD's books and lists. On the site they are fetched in area
  // pieces from the private members' bucket once signed in (PFDT in the game script); a local server writes the first two in itself
  // (the inline loader before the game script, which acts on localhost / 127.0.0.1 / [::1] only).
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc\s*=\s*["']?data\/pfd/i, 'no <script src="data/pfd..."> in index.html');
  const loader = html.match(/<script>\/\* 🔐 THE DEPARTMENT DATA[\s\S]*?<\/script>/);
  assert.ok(loader, 'the local loader is in index.html');
  assert.match(loader[0], /if\(!\/\^\(localhost\|127\\\.0\\\.0\\\.1\|/, 'and it acts on a local server only');
});

test('the firehouse models load under the BUILD, before the game', () => {
  // sw.js serves firehouse-models.js cache-first: only a new address (?v=<BUILD>) makes a release fetch it fresh (October 19, 2026).
  const tag = html.match(/<script src="firehouse-models\.js\?v=([^"]+)"><\/script>/), build = html.match(/const BUILD="([^"]+)"/);
  assert.ok(tag, 'index.html loads firehouse-models.js?v=<BUILD>');
  assert.equal(tag[1], build[1], 'the ?v of firehouse-models.js must be the BUILD (bump both at a release)');
  const models = readFileSync(localAsset('firehouse-models.js', root), 'utf8');
  assert.match(models, /^'use strict';/, 'the game script is strict, so are its models');
  assert.ok(models.split('\n').every(l => l.length < 8000), 'no giant lines in firehouse-models.js');
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
  new Script(readFileSync(localAsset('sw.js', root), 'utf8'), { filename: 'sw.js' });
});

test('Local manifest references PNG icons with matching dimensions', () => {
  const manifest = JSON.parse(readFileSync(localAsset('manifest.json'), 'utf8'));
  assert.equal(manifest.name, 'Know Your Local');   // the full name (owner, October 30, 2026); "Local" is its short form
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
