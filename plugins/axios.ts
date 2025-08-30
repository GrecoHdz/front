import { useAuthStore } from '~/middleware/auth.store';

// Variable para evitar múltiples intentos de refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });
  failedQueue = [];
};

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const authStore = useAuthStore();
  
  // Configuración global de axios
  const $api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include', // Importante para manejar cookies HTTP-Only
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    onRequest({ options }) {
      // Añadir el token a las peticiones si existe
      if (process.client) {
        const token = localStorage.getItem('token');
        if (token) {
          options.headers = new Headers(options.headers);
          options.headers.set('Authorization', `Bearer ${token}`);
        }
      }
    },
    async onResponseError({ request, response, options }) {
      const originalRequest = request;
      
      // Si el error es 401 y no es una solicitud de refresh-token
      if (response.status === 401 && !originalRequest.toString().includes('refresh-token')) {
        if (isRefreshing) {
          // Si ya se está refrescando el token, encolar la petición
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              // Reintentar la petición original con el nuevo token
              return $fetch(originalRequest, options);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        try {
          // Intentar renovar el token
          const refreshSuccess = await authStore.refreshToken();
          
          if (refreshSuccess) {
            // Procesar cola de peticiones pendientes
            processQueue();
            
            // Reintentar la petición original con el nuevo token
            const newToken = localStorage.getItem('token');
            if (newToken) {
              options.headers = new Headers(options.headers);
              options.headers.set('Authorization', `Bearer ${newToken}`);
              return $fetch(originalRequest, options);
            }
          }
          
          // Si el refresh falla, redirigir al login
          await authStore.logout();
          await router.push('/');
          return Promise.reject(response);
          
        } catch (error) {
          // Si hay un error en el refresh, limpiar todo y redirigir
          processQueue(error);
          await authStore.logout();
          await router.push('/');
          return Promise.reject(error);
          
        } finally {
          isRefreshing = false;
        }
      }
      
      // Para otros errores, rechazar normalmente
      return Promise.reject(response);
    }
  });

  // Hacer que $api esté disponible globalmente
  return {
    provide: {
      api: $api
    }
  };
});
