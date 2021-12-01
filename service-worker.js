/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-0ceb29b';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./bylo_nas_pet_001.html","./bylo_nas_pet_005.html","./bylo_nas_pet_006.html","./bylo_nas_pet_002.html","./bylo_nas_pet_007.html","./colophon.html","./bylo_nas_pet_009.html","./bylo_nas_pet_008.html","./favicon.png","./index.html","./manifest.json","./resources.html","./scripts/bundle.js","./style/style.min.css","./resources/image001.jpg","./resources/image002.jpg","./resources/index.xml","./resources/obalka.jpg","./resources/upoutavka_eknihy.jpg"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
