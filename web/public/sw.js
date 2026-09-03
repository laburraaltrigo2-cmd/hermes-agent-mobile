// Hermes is an authenticated, server-backed application. This deliberately
// minimal worker enables installation without caching HTML, credentials, API
// responses, WebSocket traffic, or plugin code. That guarantees every launch
// receives a fresh dashboard session token from the Hermes backend.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
