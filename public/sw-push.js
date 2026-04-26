self.addEventListener('push', (event) => {

    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Nueva notificación';
    const options = {
        body: data.body || '',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        data: data.data || {},
        vibrate: [100, 50, 100],
        actions: [
            {
                action: 'open',
                title: 'Ver detalles'
            }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Find any open window for our PWA
            let client = null;
            for (let i = 0; i < windowClients.length; i++) {
                if (windowClients[i].url.startsWith(self.registration.scope)) {
                    client = windowClients[i];
                    break;
                }
            }

            if (client && 'focus' in client) {
                client.focus();
                // Navigate if the target URL is different from current
                if ('navigate' in client && client.url !== (new URL(urlToOpen, self.location.origin).href)) {
                    client.navigate(urlToOpen);
                }
                return;
            }

            // If not open, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
