/* Service worker — permite estudar sem rede (metrô, avião, sinal ruim).
   Estratégia: rede primeiro, cache como reserva. Assim o conteúdo nunca
   fica preso numa versão velha, mas continua disponível offline.        */

const CACHE = 'bd-estudo-v2';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data-core.js',
  './js/data-cards.js',
  './js/data-quiz.js',
  './js/extra-cards.js',
  './js/extra-quiz.js',
  './js/data-oficina.js',
  './js/aula06.js',
  './js/aula06-estudo.js',
  './js/diagrams.js',
  './js/db.js',
  './js/app.js',
  './js/auth.js',
  /* O motor do SQLite precisa estar no cache, senão o login não abre
     offline — e sem login não há progresso para ler.                  */
  './assets/vendor/sql-wasm.js',
  './assets/vendor/sql-wasm.wasm'
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
