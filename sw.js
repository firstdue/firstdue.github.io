// Learn Your Engine Local — PWA service worker.
// The game HTML is network-first: every online launch fetches the latest build (Netlify serves it
// must-revalidate + ETag, so an unchanged file returns a fast 304). Falls back to cache when offline.
// The baked data (data/*.js) and the three.js bundle are stale-while-revalidate: served from cache so
// launch does not re-download ~9MB of unchanged data, then refreshed in the background for the next
// launch. Icons/manifest are cache-first (fast). Cross-origin requests (CARTO / Esri map tiles) pass
// straight to the network, uncached. Bump CACHE to force old caches to purge on the next launch.
const CACHE = 'local-shell-v41';  // v20d: paved ground — terrain tinted toward concrete by local building density (per-fragment).

self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return; // map tiles etc. → default network handling

  var isDoc = req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');

  if (isDoc) {
    // network-first — always try for the freshest game, revalidating against the server
    e.respondWith((async function () {
      try {
        var res = await fetch(req, { cache: 'no-cache' });
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
