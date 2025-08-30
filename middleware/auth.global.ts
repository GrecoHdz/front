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
    '/auth',
    '/' // Añadir ruta de login como pública
  ];
  
  // Normalizar la ruta actual para comparación
  const normalizedPath = to.path.toLowerCase();
  
  // Verificar si la ruta actual está en la lista de rutas públicas
  const isPublicPath = publicPaths.some(publicPath => 
    normalizedPath === publicPath.toLowerCase() || 
    normalizedPath.startsWith(publicPath.toLowerCase() + '/')
  );
  
  // Inicializar la autenticación (esto ya no redirige automáticamente)
  await auth.initAuth();
  
  // Verificar autenticación
  const isAuthenticated = await auth.checkAuth();
  
  // Si es la ruta raíz (login)
  if (to.path === '/') {
    // Si el usuario está autenticado, redirigir al dashboard correspondiente
    if (isAuthenticated) {
      return navigateTo(getDashboardPath(auth), { replace: true });
    }
    return; // Permitir acceso a la página de login
  }
  
  // Si es una ruta pública, permitir acceso
  if (isPublicPath) {
    return;
  }
  
  // Si la ruta no es pública y el usuario no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log(' Acceso no autorizado, redirigiendo a login...');
    return navigateTo('/', { replace: true });
  }
  
  // Verificar roles según la ruta
  if (to.path.startsWith('/admin') && !auth.hasRole('admin')) {
    console.log(' Usuario no tiene permiso de administrador');
    return navigateTo('/acceso-denegado', { replace: true });
  }
  
  if (to.path.startsWith('/tecnico') && !(auth.hasRole('tecnico') || auth.hasRole('admin'))) {
    console.log(' Usuario no tiene permiso de técnico');
    return navigateTo('/acceso-denegado', { replace: true });
  }
  
  if (to.path.startsWith('/cliente') && !auth.hasRole(['usuario', 'tecnico', 'admin'])) {
    console.log(' Usuario no tiene permiso de cliente');
    return navigateTo('/acceso-denegado', { replace: true });
  }
  
  // Verificar roles personalizados en meta si existen
  if (to.meta?.roles) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    const hasPermission = auth.hasRole(requiredRoles);
    
    if (!hasPermission) {
      console.log(` Usuario no tiene los roles requeridos: ${requiredRoles.join(', ')}`);
      return navigateTo('/acceso-denegado', { replace: true });
    }
  }
  
  console.log(' Acceso autorizado a', to.path);
  // Si llegamos aquí, el usuario está autenticado y tiene los permisos necesarios
  // No hacer nada, permitir la navegación
});
