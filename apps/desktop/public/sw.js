// Installability only: never cache the authenticated HTML, API responses,
// gateway traffic, plugin code, or user content.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

// Notifications created by the renderer (including Safari's required
// ServiceWorkerRegistration path) return to the relevant Hermes view.
self.addEventListener('notificationclick', event => {
  event.notification.close()
  const target = event.notification.data?.url || '#/'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windows => {
      const existing = windows[0]

      if (existing) {
        return existing.navigate(target).then(client => client?.focus())
      }

      return self.clients.openWindow(target)
    })
  )
})
