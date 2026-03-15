const CACHE_NAME = "export-marketing-hub-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./index.html?v=20260316-1",
  "./styles.css?v=20260316-1",
  "./app.js?v=20260316-1",
  "./manifest.webmanifest?v=20260316-1"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }
  const requestUrl = new URL(event.request.url);
  const isShellAsset =
    requestUrl.origin === self.location.origin &&
    (requestUrl.pathname.endsWith("/") ||
      requestUrl.pathname.endsWith("/index.html") ||
      requestUrl.pathname.endsWith("/app.js") ||
      requestUrl.pathname.endsWith("/styles.css") ||
      requestUrl.pathname.endsWith("/manifest.webmanifest"));

  if (isShellAsset) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
