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

test('all inline scripts compile without external script dependencies', () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  assert.ok(scripts.length >= 2, 'expected embedded library and game scripts');
  for (const [i, [, attributes, source]] of scripts.entries()) {
    assert.doesNotMatch(attributes, /\bsrc\s*=/i, 'keep scripts embedded');
    assert.doesNotMatch(attributes, /\btype\s*=\s*["']module["']/i, 'update checker if adopting modules');
    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1];
    if (type === 'application/ld+json' || type === 'application/json') JSON.parse(source);
    else new Script(source, { filename: `index.html:inline-script-${i + 1}` });
  }
});

test('PWA references exist and service worker compiles', () => {
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
