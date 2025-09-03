// Middleware de autenticación global para Nuxt 3
// Se ejecuta tanto en el servidor como en el cliente
import { useAuthStore } from './auth.store';

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
function safeRedirect(path: string) {
  // Solo en el cliente
  if (process.client) {
    // Usar un pequeño retraso para asegurar que la hidratación haya terminado
    setTimeout(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== path) {
        navigateTo(path, { external: true });
      }
    }, 50);
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Solo ejecutar en el cliente para evitar problemas de hidratación
  if (process.server) return;
  
  const auth = useAuthStore();
  
  // Lista de rutas públicas (en minúsculas para comparación)
  const publicPaths = [
    '/acceso-denegado', 
    '/auth',
    '/',
    '/login',
    '/registro'
  ];
  
  // Normalizar la ruta actual para comparación
  const normalizedPath = to.path.toLowerCase();
  
  // Verificar si la ruta actual está en la lista de rutas públicas
  const isPublicPath = publicPaths.some(publicPath => 
    normalizedPath === publicPath.toLowerCase() || 
    normalizedPath.startsWith(publicPath.toLowerCase() + '/')
  );
  
  // Inicializar la autenticación sin forzar verificación
  await auth.initAuth();
  
  // Si es una ruta pública
  if (isPublicPath) {
    // Verificar autenticación (esto intentará renovar el token si es necesario)
    const isAuthenticated = await auth.checkAuth();
    
    // Si el usuario está autenticado (tiene token válido o pudo renovarlo)
    // y está en una ruta pública (login, registro, etc.), redirigir al dashboard
    if (isAuthenticated && (normalizedPath === '/' || normalizedPath === '/login' || normalizedPath === '/registro')) {
      const dashboardPath = getDashboardPath(auth);
      if (process.client) {
        // En el cliente, usar replace para evitar problemas de navegación
        window.location.replace(dashboardPath);
      } else {
        return navigateTo(dashboardPath, { replace: true });
      }
    }
    return;
  }
  
  // Para rutas protegidas, verificar autenticación
  const isAuthenticated = await auth.checkAuth();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return safeRedirect('/');
  }
  
  // Si llegamos aquí, el usuario está autenticado
  
  // Verificar si está en la ruta raíz y redirigir al dashboard correspondiente
  if (to.path === '/') {
    return navigateTo(getDashboardPath(auth), { replace: true });
  }
  
  // Verificar roles según la ruta
  if (to.path.startsWith('/admin') && !auth.hasRole('admin')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }
  
  if (to.path.startsWith('/tecnico') && !(auth.hasRole('tecnico') || auth.hasRole('admin'))) {
    return navigateTo('/acceso-denegado', { replace: true });
  }
  
  if (to.path.startsWith('/cliente') && !auth.hasRole(['usuario', 'tecnico', 'admin'])) {
    return navigateTo('/acceso-denigado', { replace: true });
  }
  
  // Verificar roles personalizados en meta si existen
  if (to.meta?.roles) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    const hasPermission = auth.hasRole(requiredRoles);
    
    if (!hasPermission) {
      return navigateTo('/acceso-denigado', { replace: true });
    }
  }
  // Si llegamos aquí, el usuario está autenticado y tiene los permisos necesarios
});
