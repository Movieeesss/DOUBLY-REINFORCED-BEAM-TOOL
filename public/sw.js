// Service Worker required for PWA Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Service worker must have a fetch handler
});
