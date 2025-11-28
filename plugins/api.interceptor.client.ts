// plugins/api.interceptor.client.ts
import { useAuthStore } from '~/middleware/auth.store'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    config: any;
  }> = [];

  const processQueue = (error: any = null, token: string | null = null) => {
    failedQueue.forEach(promise => {
      error ? promise.reject(error) : promise.resolve(token);
    });
    failedQueue = [];
  };

  const fetchWithInterceptor = async (url: string, options: any = {}) => {
    const fetchOptions = {
      ...options,
      baseURL: config.public.apiBase,
      credentials: 'include' as RequestCredentials,
      headers: { ...options.headers },
    };

    const excludedPaths = ['/registro', '/auth', '/usuario-deshabilitado','/reset-password', '/forgot-password'];
    const isExcluded = excludedPaths.some(path => url.includes(path));
    
    if (authStore.token) {
      fetchOptions.headers.Authorization = `Bearer ${authStore.token}`;
    } else if (!isExcluded) {
      try {
        const refreshed = await authStore.refreshToken();
        if (refreshed && authStore.token) {
          fetchOptions.headers.Authorization = `Bearer ${authStore.token}`;
        } else {
          throw new Error('No se pudo renovar la sesión');
        }
      } catch (error) {
        throw error;
      }
    }

    try {
      return await $fetch(url, fetchOptions);
    } catch (error: any) {
      const status = error?.response?.status;
      
      if (status !== 401 || isExcluded) {
        throw error;
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              fetchOptions.headers.Authorization = `Bearer ${token}`;
              resolve($fetch(url, fetchOptions));
            },
            reject,
            config: { url, options: fetchOptions }
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshed = await authStore.refreshToken();

        if (refreshed && authStore.token) {
          const newToken = authStore.token;
          processQueue(null, newToken);
          fetchOptions.headers.Authorization = `Bearer ${newToken}`;
          return await $fetch(url, fetchOptions);
        } else {
          throw new Error('No se pudo renovar el token');
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.clearAuthState();
        await navigateTo('/', { replace: true });
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }
  };

  return {
    provide: { api: fetchWithInterceptor }
  };
});