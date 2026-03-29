const CACHE_NAME = 'pastificio-v1';
const ASSETS = [
  '/Lavori-Antico-Pastificio-Umbro/lavori_pastificio.html',
  '/Lavori-Antico-Pastificio-Umbro/report_pastificio.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase e Google Fonts — sempre dalla rete
  if (e.request.url.includes('firebase') || e.request.url.includes('googleapis')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Tutto il resto — rete prima, poi cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
