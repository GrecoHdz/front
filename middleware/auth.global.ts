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
  // Usar nextTick para asegurar que la hidratación haya terminado
  if (process.client) {
    setTimeout(() => {
      const currentPath = window.location.pathname;
      if (currentPath !== path) {
        window.location.href = path;
      }
    }, 50);
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // Solo ejecutar en el cliente
  if (process.server) return;
  
  const auth = useAuthStore();
  
  // Lista de rutas públicas (en minúsculas para comparación)
  const publicPaths = [
    '/acceso-denegado', 
    '/auth'
  ];
  
  // Normalizar la ruta actual para comparación
  const normalizedPath = to.path.toLowerCase();
  
  // Verificar si la ruta actual está en la lista de rutas públicas
  const isPublicPath = publicPaths.some(publicPath => 
    normalizedPath === publicPath.toLowerCase() || 
    normalizedPath.startsWith(publicPath.toLowerCase() + '/')
  );
  
  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    return;
  }
  
  // Inicializar la autenticación
  const isAuthenticated = await auth.initAuth();
  
  // Si es la ruta raíz (login)
  if (to.path === '/') {
    // Si el usuario está autenticado, redirigir al dashboard correspondiente
    if (isAuthenticated) {
      safeRedirect(getDashboardPath(auth));
    }
    return;
  }
  
  // Si la ruta no es pública y el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return navigateTo('/');
  }
  
  // Verificar roles según la ruta
  if (to.path.startsWith('/admin') && !auth.hasRole('admin')) {
    return navigateTo('/acceso-denegado');
  }
  
  if (to.path.startsWith('/tecnico') && !(auth.hasRole('tecnico') || auth.hasRole('admin'))) {
    return navigateTo('/acceso-denegado');
  }
  
  if (to.path.startsWith('/cliente') && !auth.hasRole(['usuario', 'tecnico', 'admin'])) {
    return navigateTo('/acceso-denegado');
  }
  
  // Verificar roles personalizados en meta si existen
  if (to.meta?.roles) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    const hasPermission = auth.hasRole(requiredRoles);
    
    if (!hasPermission) {
      return navigateTo('/acceso-denegado');
    }
  }
  
  // Si llegamos aquí, el usuario está autenticado y tiene los permisos necesarios
  // No hacer nada, permitir la navegación
});
