// Middleware de autenticación global para Nuxt 3
// Se ejecuta tanto en el servidor como en el cliente
import { useAuthStore } from './auth.store';
import { useRouter } from 'vue-router';

export default defineNuxtRouteMiddleware(async (to) => {
  // Solo ejecutar en el cliente
  if (process.server) return;
  
  const auth = useAuthStore();
  const token = useCookie('token').value;
  const userCookie = useCookie('user');
  const router = useRouter();
  
  // Lista de rutas públicas (en minúsculas para comparación)
  const publicPaths = ['/acceso-denegado'];
  
  // Normalizar la ruta actual para comparación
  const normalizedPath = to.path.toLowerCase();
  
  // Verificar si la ruta actual está en la lista de rutas públicas
  const isPublicPath = publicPaths.some(publicPath => 
    normalizedPath === publicPath.toLowerCase() || 
    normalizedPath.startsWith(publicPath.toLowerCase() + '/')
  );
  
  // Función para manejar la redirección después de la hidratación
  const safeRedirect = (path: string) => {
    // Usar nextTick para asegurar que la hidratación haya terminado
    process.client && setTimeout(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== path) {
        window.location.href = path;
      }
    }, 50);
  };
  
  // Si es la ruta raíz (login)
  if (to.path === '/') {
    // Si ya hay un token, redirigir después de la hidratación
    if (token) {
      // Si ya tenemos los datos del usuario en el store, redirigir según su rol
      if (auth.user) {
        safeRedirect(getDashboardPath(auth));
      } 
      // Si hay cookie de usuario pero no está en el store, intentar restaurar la sesión
      else if (userCookie.value) {
        try {
          const userData = typeof userCookie.value === 'string' 
            ? JSON.parse(userCookie.value) 
            : userCookie.value;
            
          if (userData && typeof userData === 'object') {
            auth.setUser(userData);
            safeRedirect(getDashboardPath(auth));
          } else {
            console.error('Formato de cookie de usuario inválido');
            userCookie.value = null;
          }
        } catch (e) {
          console.error('Error al procesar la cookie de usuario:', e);
          userCookie.value = null;
        }
      }
      // Si no hay datos de usuario, intentar verificar la autenticación
      else {
        try {
          const isAuthenticated = await auth.checkAuth();
          if (isAuthenticated && auth.user) {
            return redirectToDashboard(auth);
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          // No hacer logout automáticamente, solo limpiar datos inválidos
          auth.setToken(null);
          auth.setUser(null);
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
  
  // Verificar si el token ha expirado
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      
      // Si el token ha expirado, limpiar y redirigir
      if (Date.now() >= exp) {
        auth.setToken(null);
        auth.setUser(null);
        return navigateTo('/');
      }
    } catch (error) {
      console.error('Error al verificar el token:', error);
      auth.setToken(null);
      auth.setUser(null);
      return navigateTo('/');
    }
  }
  
  // Verificar roles si la ruta los requiere
  if (to.meta?.roles) {
    // Si no tenemos los datos del usuario, intentar cargarlos
    if (!auth.user) {
      try {
        const isAuthenticated = await auth.checkAuth();
        if (!isAuthenticated) {
          return navigateTo('/');
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return navigateTo('/');
      }
    }
    
    // Verificar si el usuario tiene los roles requeridos
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    const hasPermission = auth.hasRole(requiredRoles);
    
    if (!hasPermission) {
      return navigateTo('/acceso-denegado');
    }
  }
  
  // Función auxiliar para obtener la ruta del dashboard según el rol
  function getDashboardPath(auth: any): string {
    if (auth.hasRole('admin')) {
      return '/admin/DashboardAdmin';
    } else if (auth.hasRole('tecnico')) {
      return '/tecnico/DashboardTecnico';
    } else {
      return '/cliente/DashboardCliente';
    }
  }
  
  // Función para redirección segura después de la hidratación
  function redirectToDashboard(auth: any) {
    const path = getDashboardPath(auth);
    safeRedirect(path);
  }
  
  // Si llegamos aquí, el token es válido o estamos en el servidor
  // No hacer nada, permitir la navegación
});
