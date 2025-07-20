// Service Worker for Realm of Darkness
const CACHE_NAME = "realm-of-darkness-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "assets/images/Darkness 192.png",
  "assets/images/Darkness 512.png",
  "assets/images/blood.jpeg",
  "assets/images/shadow.jpeg",
  "assets/images/jumpscare1.jpeg",
  "assets/images/jumpscare2.jpeg",
  "assets/images/jumpscare3.jpeg",
  "assets/images/jumpscare4.jpeg",
  "assets/images/jumpscare5.jpeg",
  "assets/images/jumpscare6.jpeg",
  "assets/images/jumpscare7.jpeg",
  "assets/images/jumpscare8.jpeg",
  "assets/images/jumpscare9.jpeg",
  "assets/images/jumpscare10.jpeg",
  "assets/sounds/creepy-loop.mp3",
  "assets/sounds/scream.mp3"
];
// Install Event
self.addEventListener("install", event => {
  self.skipWaiting(); // Activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Caching app shell...");
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error("Cache install error:", err))
  );
});
// Activate Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log("Removing old cache:", key);
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});
// Fetch Event
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.destination === "image") {
          return caches.match("assets/images/shadow.jpeg"); // Fallback image
        }
      });
    })
  );
});