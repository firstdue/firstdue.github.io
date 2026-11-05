// Know Your Local (Philly Fire Dispatch) — PWA service worker.
// The game HTML is network-first: every online launch fetches the latest build (Netlify serves it
// must-revalidate + ETag, so an unchanged file returns a fast 304). Falls back to cache when offline.
// The baked data (data/*.js) and the three.js bundle are stale-while-revalidate: served from cache so
// launch does not re-download ~9MB of unchanged data, then refreshed in the background for the next
// launch. Icons/manifest are cache-first (fast). Cross-origin requests (CARTO / Esri map tiles) pass
// straight to the network, uncached. Bump CACHE to force old caches to purge on the next launch.
// STAMPED FILES (audit B13, November 4, 2026): index.html loads every data / vendor / assets script as
// <file>?h=<its contents' fingerprint> (stamp-data.cjs). That address never changes its contents, so it is
// cache-first in DATA, a cache a release does NOT purge: an unchanged file is never downloaded again, and a
// changed one is a new address, fetched at once (no launch on the old copy). Storing a new stamp of a file
// drops that file's older stamps.
const CACHE = 'local-shell-v121';  // v23f: a first-time sign-up's code accepted; the sign-in card says why an email did not go.
const DATA = 'local-data-v1';   // stamped files, kept across releases (bump only to throw every one away)

self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k !== CACHE && k !== DATA; }).map(function (k) { return caches.delete(k); }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // map tiles etc. → default network handling

  var isDoc = req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');

  if (!isDoc && url.searchParams.has('h')) {
    // a stamped file: its address names its contents, so a cached copy is always the right one
    e.respondWith((async function () {
      var c = await caches.open(DATA);
      var cached = await c.match(req);
      if (cached) return cached;
      var res = await fetch(req);
      if (res && res.status === 200) {
        await c.put(req, res.clone());
        var old = (await c.keys()).filter(function (k) { var u = new URL(k.url); return u.pathname === url.pathname && u.search !== url.search; });
        await Promise.all(old.map(function (k) { return c.delete(k); }));
      }
      return res;
    })());
    return;
  }
  if (isDoc) {
    // network-first — always try for the freshest game, revalidating against the server
    e.respondWith((async function () {
      try {
        // by ADDRESS (November 4, 2026): Chrome ignores cache:'no-cache' on a forwarded navigation request and answered from its
        // HTTP cache, so for 10 minutes after any launch (GitHub's max-age=600) a new release was served the OLD page (measured).
        var res = await fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' });
        if (res && res.status === 200) { var c = await caches.open(CACHE); await c.put(req, res.clone()); }
        return res;
      } catch (_) {
        return (await caches.match(req)) || (await caches.match('./index.html')) || Response.error();
      }
    })());
  } else if (/\/(?:data|vendor)\//.test(url.pathname)) {
    // baked data + library — stale-while-revalidate: instant launch, refreshed for the next one
    e.respondWith((async function () {
      var cached = await caches.match(req);
      // Keep the cache write inside the fetch lifetime. Fire-and-forget writes lost large
      // data/library responses before an offline reload in the Blender slice browser test.
      var network = fetch(req).then(async function (res) {
        if (res && res.status === 200) { var c = await caches.open(CACHE); await c.put(req, res.clone()); }
        return res;
      });
      if (cached) { e.waitUntil(network.catch(function () {})); return cached; }
      return network;
    })());
  } else {
    // static assets (icons/manifest) — cache-first for speed
    e.respondWith((async function () {
      var cached = await caches.match(req);
      if (cached) return cached;
      var res = await fetch(req);
      if (res && res.status === 200) { var c = await caches.open(CACHE); await c.put(req, res.clone()); }
      return res;
    })());
  }
});
