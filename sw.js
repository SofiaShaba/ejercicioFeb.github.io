const CACHE_NAME = 'v1_cache1_BCH_PWA';

var urlsToCache = [
  '/index.html',
  '/main.js',
  '/sw.js',
  '/manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache)
        .then(() => { self.skipWaiting() })
        .catch(err => console.log('Hubo un error', err))
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhiteList = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheNames) => {
            if (cacheWhiteList.indexOf(cacheNames) == -1) {
              return cache.delete(cacheNames);
            }
          })
        );
      })
      .then(self.clients.claim())
  );
});