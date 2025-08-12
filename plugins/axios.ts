export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const router = useRouter();
  
  // Configuración global de axios
  const $api = $fetch.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json',
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
    async onResponseError({ response }) {
      // Manejar errores de autenticación
      if (response.status === 401) {
        if (process.client) {
          localStorage.removeItem('token');
          await router.push('/');
        }
      }
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
