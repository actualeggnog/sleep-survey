const CACHE_NAME = 'sleep-tracker-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Instantly activate the new version
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim()); // Take control of all open tabs immediately
});

// Network-first strategy: Try fetching fresh code, fall back to cache if offline
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clone and update cache with the fresh response
        const resClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return response;
      })
      .catch(() => caches.match(e.request)) // Fallback to cache when offline
  );
});
