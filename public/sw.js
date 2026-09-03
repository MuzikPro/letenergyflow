/*
 * Let Energy Flow — offline service worker.
 *
 * Deliberately dependency-free and privacy-preserving:
 *  - caches only same-origin app assets;
 *  - never contacts a third party;
 *  - never stores or transmits learner progress (that stays in localStorage).
 */
/*
 * The cache name carries the build id handed over at registration
 * (`sw.js?v=…`), so each deploy gets its own cache and `activate` can clear the
 * one before it. A constant name meant the cleanup below never matched
 * anything and old assets stayed cached indefinitely.
 *
 * `dev` is the fallback for a worker loaded without the query — only reachable
 * by opening sw.js directly, since the app always registers it with one.
 */
const PREFIX = 'lef-shell-';
const CACHE = PREFIX + (new URL(self.location.href).searchParams.get('v') || 'dev');
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            // Only ours: another app on this origin keeps its own caches.
            .filter((k) => k.startsWith(PREFIX) && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never cache or proxy cross-origin

  // Navigations: network first so a rebuilt app is picked up, cache as offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then((r) => r || caches.match('./'))),
    );
    return;
  }

  // Hashed build assets: cache first, fill on miss.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
