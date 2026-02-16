import { ref } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';

export const usePushNotifications = () => {
    const isSupported = ref(false);
    const permission = ref('default');
    const isSubscribed = ref(false);
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    if (process.client) {
        isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window;
        permission.value = Notification.permission;
    }

    const urlBase64ToUint8Array = (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const checkSubscription = async () => {
        if (!process.client || !isSupported.value) return;

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            isSubscribed.value = !!subscription;

            // Si ya tiene permiso y no está suscrito, preguntar automáticamente? No, mejor manual.
            if (Notification.permission === 'granted' && !subscription) {
                // Podríamos intentar resuscribir, pero mejor dejar al usuario
            }
        } catch (error) {
            console.error('Error verificando suscripción push:', error);
        }
    };

    const subscribe = async () => {
        if (!isSupported.value) {
            alert('Tu navegador no soporta notificaciones push.');
            return;
        }

        try {
            // 1. Request permission
            const result = await Notification.requestPermission();
            permission.value = result;

            if (result !== 'granted') {
                alert('Necesitas dar permiso para recibir notificaciones.');
                return;
            }

            // 2. Get VAPID key
            // Ajustar ruta si es necesaria
            const response = await $api('/notificaciones/vapid-key', {
                baseURL: config.public.apiBase
            });

            const vapidPublicKey = response.key;

            if (!vapidPublicKey) throw new Error('No se pudo obtener la llave VAPID');

            // 3. Subscribe to Push Manager
            const registration = await navigator.serviceWorker.ready;

            // Unsubscribe existing if any (to clean up) or just use existing?
            // Mejor usar existing si existe.
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                });
            }

            // 4. Send subscription to Backend
            if (auth.user && auth.user.id_usuario) {
                await $api('/notificaciones/suscripcion', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    body: {
                        endpoint: subscription.endpoint,
                        keys: subscription.toJSON().keys,
                        user_agent: navigator.userAgent,
                        id_usuario: auth.user.id_usuario
                    }
                });

                isSubscribed.value = true;
                alert('¡Notificaciones activadas con éxito!');
            } else {
                console.error('No hay usuario autenticado para asociar la suscripción');
            }

        } catch (error) {
            console.error('Error al suscribirse a push:', error);
            alert('Ocurrió un error al activar notificaciones: ' + error.message);
        }
    };

    const unsubscribe = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await subscription.unsubscribe();
            }

            if (auth.user) {
                const userId = auth.user.id_usuario;

                try {
                    await $api(`/notificaciones/suscripcion?id_usuario=${userId}`, {
                        method: 'DELETE',
                        baseURL: config.public.apiBase,
                        body: {
                            id_usuario: userId
                        }
                    });
                } catch (fetchError) {
                    console.error('Error al eliminar suscripción en el servidor:', fetchError);
                    throw fetchError;
                }
            }

            isSubscribed.value = false;
        } catch (error) {
            console.error('Error al desactivar notificaciones push:', error);
            throw error;
        }
    };

    const dismissInvite = () => {
        if (process.client) {
            localStorage.setItem('push_invite_dismissed', Date.now().toString());
        }
    };

    return {
        isSupported,
        permission,
        isSubscribed,
        subscribe,
        unsubscribe,
        checkSubscription,
        dismissInvite
    };
};

