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
    // [DEBUG] Log para confirmar que el interceptor se ejecuta
    console.log(`📡 [Interceptor] Request: ${url}`);

    const fetchOptions = {
      ...options,
      baseURL: config.public.apiBase,
      credentials: 'include' as RequestCredentials,
      headers: { ...options.headers },
    };

    // Rutas que no deben disparar el intento de refresh si fallan o no tienen token
    const excludedPaths = [
      '/auth/login',
      '/auth/refresh-token',
      '/auth/logout',
      '/registro',
      '/usuario-deshabilitado',
      '/reset-password',
      '/forgot-password'
    ];

    const isExcluded = excludedPaths.some(path => url.includes(path));

    // 1. Si tenemos token, lo agregamos
    if (authStore.token) {
      fetchOptions.headers.Authorization = `Bearer ${authStore.token}`;
    } else if (!isExcluded) {
      // Si no tenemos token, intentamos recuperarlo proactivamente
      // (Por ejemplo, si hubo un hard refresh y hay cookie HttpOnly pero no state)
      try {
        if (!authStore.token) {
          console.log('🔍 [Interceptor] No hay token en memoria, verificando si podemos refrescar...');
          const refreshed = await authStore.refreshToken();
          if (refreshed && authStore.token) {
            console.log('✅ [Interceptor] Token recuperado proactivamente antes de la petición');
            fetchOptions.headers.Authorization = `Bearer ${authStore.token}`;
          }
        }
      } catch (error) {
        console.warn('⚠️ [Interceptor] Fallo refresh proactivo:', error);
      }
    }

    try {
      return await $fetch(url, fetchOptions);
    } catch (error: any) {
      const status = error?.response?.status || error?.statusCode || error?.status;

      console.log(`❌ [Interceptor] Error catch en ${url}. Status: ${status}`, error);

      // Si el error no es 401 (usamos != para permitir "401" string) o es una ruta excluida
      if (status != 401 || isExcluded) {
        throw error;
      }

      console.log(`🔒 [Interceptor] Error 401 CONFIRMADO en ${url}. Iniciando lógica de renovación...`);

      // Evitar bucle si la URL falla es justamente la de refresh
      if (url.includes('/auth/refresh-token')) {
        console.warn('⚠️ [Interceptor] Error 401 en refresh-token, abortando.');
        throw error;
      }

      if (isRefreshing) {
        console.log('⏳ [Interceptor] Renovación en curso, encolando petición...');
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              // Actualizar el header con el nuevo token
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
        console.log('🔄 [Interceptor] Ejecutando refreshToken()...');
        const refreshed = await authStore.refreshToken();

        if (refreshed && authStore.token) {
          console.log('✅ [Interceptor] Renovación exitosa. Reintentando peticiones fallidas...');
          const newToken = authStore.token;
          processQueue(null, newToken);

          // Reintentar la petición original con el nuevo token
          fetchOptions.headers.Authorization = `Bearer ${newToken}`;
          return await $fetch(url, fetchOptions);
        } else {
          console.error('❌ [Interceptor] refreshToken devolvió false');
          throw new Error('No se pudo renovar la sesión');
        }
      } catch (refreshError: any) {
        console.error('❌ [Interceptor] Excepción grave al renovar:', refreshError);

        // Si falló la renovación, deslogueamos
        if (refreshError?.message === 'No se pudo renovar la sesión' || refreshError?.statusCode === 401) {
          processQueue(refreshError, null);
          authStore.clearAuthState();
          console.log('👋 [Interceptor] Redirigiendo al login por fallo en renovación');
          await navigateTo('/', { replace: true });
        }

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