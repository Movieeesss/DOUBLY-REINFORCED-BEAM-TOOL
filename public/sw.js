// Service Worker to enable PWA Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Required to be present for install criteria
});
