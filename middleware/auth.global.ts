// Middleware de autenticación global para Nuxt 3
// Se ejecuta tanto en el servidor como en el cliente
import { useAuthStore } from './auth.store';

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();
  const token = process.client ? localStorage.getItem('token') : useCookie('token').value;
  
  // Lista de rutas públicas (en minúsculas para comparación)
  const publicPaths = ['/','/acceso-denegado'];
  
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
    // Si hay token, redirigir al dashboard según el rol
    if (token) {
      // Si ya tenemos los datos del usuario en el store, redirigir según su rol
      if (auth.user) {
        if (auth.hasRole('admin')) {
          return navigateTo('/admin/DashboardAdmin');
        } else if (auth.hasRole('tecnico')) {
          return navigateTo('/tecnico/DashboardTecnico');
        } else {
          return navigateTo('/cliente/DashboardCliente');
        }
      } else {
        // Si no tenemos los datos del usuario, intentar obtenerlos
        try {
          await auth.checkAuth();
          if (auth.user) {
            if (auth.hasRole('admin')) {
              return navigateTo('/admin/DashboardAdmin');
            } else if (auth.hasRole('tecnico')) {
              return navigateTo('/tecnico/DashboardTecnico');
            } else {
              return navigateTo('/cliente/DashboardCliente');
            }
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          // En caso de error, redirigir al login
          auth.logout();
          return navigateTo('/');
        }
      }
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
  
  // Verificar roles si la ruta los requiere
  if (to.meta.roles) {
    // Asegurarse de que el usuario esté autenticado
    if (!auth.isAuthenticated) {
      return navigateTo('/');
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    const hasPermission = auth.hasRole(requiredRoles);
    
    if (!hasPermission) {
      return navigateTo('/acceso-denegado');
    }
  }
  
  // Si hay token, verificar si está expirado (solo en cliente)
  if (process.client) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      
      if (Date.now() >= exp) {
        localStorage.removeItem('token');
        auth.logout();
        return navigateTo('/');
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      auth.logout();
      localStorage.removeItem('token');
      return navigateTo('/');
    }
  }
  
  // Si llegamos aquí, el token es válido o estamos en el servidor
  // No hacer nada, permitir la navegación
});
