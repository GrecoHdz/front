// Middleware de autenticación global para Nuxt 3
// Se ejecuta tanto en el servidor como en el cliente

export default defineNuxtRouteMiddleware((to) => {
  const token = process.client ? localStorage.getItem('token') : useCookie('token').value;
  
  // Lista de rutas públicas (en minúsculas para comparación)
  const publicPaths = ['/'];
  
  // Normalizar la ruta actual para comparación
  const normalizedPath = to.path.toLowerCase();
  
  // Verificar si la ruta actual está en la lista de rutas públicas
  const isPublicPath = publicPaths.some(publicPath => {
    const normalizedPublicPath = publicPath.toLowerCase();
    return normalizedPath === normalizedPublicPath || 
           normalizedPath.startsWith(normalizedPublicPath + '/');
  });
  
  // Si es la ruta raíz
  if (to.path === '/') {
    // Si hay token, redirigir al dashboard
    if (token) {
      return navigateTo('/cliente/DashboardCliente');
    }
    // Si no hay token, permitir acceso (es la página de login)
    return;
  }
  
  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    return;
  }
  
  // Si es una ruta protegida y no hay token, redirigir al login
  if (!token) {
    return navigateTo('/');
  }
  
  // Si hay token, verificar si está expirado (solo en cliente)
  if (process.client) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      
      if (Date.now() >= exp) {
        localStorage.removeItem('token');
        return navigateTo('/');
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      localStorage.removeItem('token');
      return navigateTo('/');
    }
  }
  
  // Si llegamos aquí, el token es válido o estamos en el servidor
  // No hacer nada, permitir la navegación
});
