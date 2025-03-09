// src/sw.js
var CACHE_NAME = "cache-v1";
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(
      (cacheNames) => Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  false ? event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      event.waitUntil(
        updateCacheAndNotify(event.request, cachedResponse ? cachedResponse.clone() : cachedResponse)
      );
      return cachedResponse || fetch(event.request);
    })
  ) : fetch(event.request);
});
var FILES_TO_CACHE = false ? [
  "./index.html",
  "./app.min.css",
  "./app.min.js",
  "./manifest.json",
  "./sw.min.js"
] : [];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});
//# sourceMappingURL=sw.js.map
