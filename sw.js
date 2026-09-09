/* Service worker — permite estudar sem rede (metrô, avião, sinal ruim).
   Estratégia: rede primeiro, cache como reserva. Assim o conteúdo nunca
   fica preso numa versão velha, mas continua disponível offline.        */

const CACHE = 'bd-estudo-v1';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data-core.js',
  './js/data-cards.js',
  './js/data-quiz.js',
  './js/data-oficina.js',
  './js/diagrams.js',
  './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.ok && new URL(e.request.url).origin === location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
