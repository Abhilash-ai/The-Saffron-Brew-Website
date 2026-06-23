const CACHE_NAME = 'saffron-brew-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/src/menuData.js',
  '/favicon.svg',
  '/assets/hero_cafe.png',
  '/assets/saffron_latte.png',
  '/assets/caramel_latte.png',
  '/assets/berry_pancakes.png',
  '/assets/choco_fudge.png',
  '/assets/gallery_barista.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
