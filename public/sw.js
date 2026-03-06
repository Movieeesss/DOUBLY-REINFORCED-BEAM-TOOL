// Simple Service Worker to enable PWA installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Required to stay active
});
