// Chronicle PWA Service Worker v10.17 - Firebase
const CACHE_NAME = 'chronicle-v10.17';
const ASSETS_TO_CACHE = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './library.jpg',
  './background.jpg',
  './death3.jpg',
  './death5.jpg',
  './death6.jpg',
  './death7.jpg',
  './death8.jpg',
  './death9.jpg',
  './death10.jpg',
  './death11.jpg',
  './death12.jpg',
  './death13.jpg',
  './death14.jpg',
  './death15.jpg',
  './death16.jpg',
  './death17.jpg',
  './death18.jpg',
  './death19.jpg',
  './death20.jpg',
  './death21.jpg'
];

// Install event - cache assets (but NOT index.html - always fetch fresh)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching app assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.log('Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - ALWAYS get fresh index.html from network
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;

  // Skip PeerJS/WebSocket
  if (url.hostname.includes('peerjs.com') || url.protocol === 'wss:' || url.protocol === 'ws:') return;

  // ALWAYS fetch index.html from network
  if (url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For other assets, use cache-first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
