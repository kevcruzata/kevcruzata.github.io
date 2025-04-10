const CACHE_NAME = "kev-site-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/javascript/script.js",
  "/images/404-cats.png",
  "/images/background1.jpg",
  "/images/background2.jpg",
  "/images/background3.jpg",
  "/images/construction-cats.png",
  "/images/profile-pic.png",
  "/images/thumbnail-catculator.png",
  "/images/thumbnail-cats.png",
  "/images/thumbnail-cs50x.png",
  "/images/thumbnail-github.png",
  "/images/thumbnail-website.png",
  "/icons/favicon.png",
];

// Install: Pre-cache static assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate new SW immediately
});

// Activate: Clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of open pages
});

// Fetch: Respond with cached asset or fetch from network
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ⛔ Don't cache requests like manifest or dev tools
  if (
    url.pathname.endsWith("manifest.json") ||
    url.pathname.includes("hot-update") ||
    url.pathname.includes("sockjs-node")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Optional: return fallback HTML for failed navigations
          if (event.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});
