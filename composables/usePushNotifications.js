import { ref } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';

export const usePushNotifications = () => {
    const isSupported = ref(false);
    const permission = ref('default');
    const isSubscribed = ref(false);
    const isChecking = ref(true);
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    if (process.client) {
        // En iOS Safari (WKWebView / in-app browsers) la API Notification puede no existir
        const hasNotificationAPI = typeof Notification !== 'undefined';
        isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window && hasNotificationAPI;
        permission.value = hasNotificationAPI ? Notification.permission : 'denied';

        // Optimistic check from localStorage to avoid flashes
        const savedStatus = localStorage.getItem('push_subscribed_status');
        if (savedStatus !== null) {
            isSubscribed.value = savedStatus === 'true';
            // We still want to check but if it's true, we avoid showing the invite
        }
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
        if (!process.client || !isSupported.value) {
            isChecking.value = false;
            return;
        }

        try {
            isChecking.value = true;
            // Usar un timeout de seguridad para que no bloquee en iOS
            const readyPromise = navigator.serviceWorker.ready;
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('serviceWorker.ready timeout')), 5000)
            );
            const registration = await Promise.race([readyPromise, timeoutPromise]);
            const subscription = await registration.pushManager.getSubscription();
            const status = !!subscription;
            isSubscribed.value = status;

            // Persist for next load
            localStorage.setItem('push_subscribed_status', status.toString());

            // Si ya tiene permiso y no está suscrito, preguntar automáticamente? No, mejor manual.
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted' && !subscription) {
                // Podríamos intentar resuscribir, pero mejor dejar al usuario
            }
        } catch (error) {
            console.error('Error verificando suscripción push:', error);
        } finally {
            isChecking.value = false;
        }
    };

    const subscribe = async () => {
        if (!isSupported.value) {
            return { success: false, error: 'supported' };
        }

        try {
            // 1. Request permission
            const result = await Notification.requestPermission();
            permission.value = result;

            if (result !== 'granted') {
                return { success: false, error: 'denied' };
            }

            // 2. Get VAPID key
            const response = await $api('/notificaciones/vapid-key', {
                baseURL: config.public.apiBase
            });

            const vapidPublicKey = response.key;

            if (!vapidPublicKey) throw new Error('No se pudo obtener la llave VAPID');

            // 3. Subscribe to Push Manager
            const registration = await navigator.serviceWorker.ready;
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
                localStorage.setItem('push_subscribed_status', 'true');
                return { success: true };

            } else {
                throw new Error('No user authenticated');
            }

        } catch (error) {
            console.error('Error al suscribirse a push:', error);
            return { success: false, error: error.message };
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
            localStorage.setItem('push_subscribed_status', 'false');
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
        isChecking,
        subscribe,
        unsubscribe,
        checkSubscription,
        dismissInvite
    };
};
