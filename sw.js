const CACHE_NAME = 'pharma-atlas-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './drugs.html',
    './companies.html',
    './ingredients.html',
    './drug.html',
    './company.html',
    './ingredient.html',
    './assets/styles.css',
    './assets/app.js',
    './data/drugs.json',
    './data/companies.json',
    './data/ingredients.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Return cached response if found
            if (response) {
                return response;
            }
            // Otherwise fetch from network
            return fetch(event.request);
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
