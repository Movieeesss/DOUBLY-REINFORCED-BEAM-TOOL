// Service Worker required for Chrome Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Service worker must have a fetch handler to be valid
});
