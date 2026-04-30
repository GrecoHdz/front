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

    // URL final a la que el usuario debe llegar (ej: /cliente/DashboardCliente)
    const targetUrl = event.notification.data.url || '/';

    // Siempre abrimos `/` con el destino como query param `?redirect=...`
    // Esto garantiza que el middleware del home ejecute la lógica de restauración
    // de sesión (refresh token) ANTES de redirigir a la ruta protegida.
    // Si abriéramos la ruta protegida directamente, el token expirado causaría
    // un 401 en fetchUser() y se perdería la sesión.
    const redirectUrl = targetUrl !== '/'
        ? new URL('/?redirect=' + encodeURIComponent(targetUrl), self.registration.scope).href
        : new URL('/', self.registration.scope).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Buscar una ventana ya abierta de la PWA
            let client = null;
            for (let i = 0; i < windowClients.length; i++) {
                if (windowClients[i].url.startsWith(self.registration.scope)) {
                    client = windowClients[i];
                    break;
                }
            }

            if (client && 'focus' in client) {
                client.focus();
                // Navegar a la URL de destino (la ventana ya tiene la sesión activa)
                if ('navigate' in client && client.url !== new URL(targetUrl, self.location.origin).href) {
                    client.navigate(targetUrl);
                }
                return;
            }

            // Si no hay ventana abierta, abrir en `/` con redirect para restaurar sesión
            if (clients.openWindow) {
                return clients.openWindow(redirectUrl);
            }
        })
    );
});
