// auth.global.ts 
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

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // 🔹 Evitar bucles: no procesar si ya estamos en acceso-denegado o login
  if (to.path === '/acceso-denegado' || to.path === '/') {
    return;
  }

  // Inicializar autenticación (solo una vez)
  if (!auth.isInitialized) {
    await auth.initAuth();
  }

  // 🔹 VERIFICAR SI EL USUARIO ESTÁ DESHABILITADO
  if (auth.user?.estado === 'deshabilitado') {
    await auth.logout();
    return navigateTo('/', { replace: true });
  }
  
  // Verificar autenticación
  let isAuthenticated = false;
  
  try {
    isAuthenticated = await auth.checkAuth();
  } catch (error) {
    console.error('Error en checkAuth:', error);
    isAuthenticated = false;
  }

  // Rutas públicas
  const publicPaths = [
    '/acceso-denegado', 
    '/auth',
    '/',
    '/login',
    '/registro'
  ];

  const normalizedPath = to.path.toLowerCase();
  const isPublicPath = publicPaths.some(publicPath =>
    normalizedPath === publicPath.toLowerCase() ||
    normalizedPath.startsWith(publicPath.toLowerCase() + '/')
  );

  if (isPublicPath) {
    // Si está autenticado y trata de entrar a login → redirigir al dashboard
    if (isAuthenticated && normalizedPath === '/') {
      return navigateTo(getDashboardPath(auth), { replace: true });
    }
    return;
  }

  // Para rutas protegidas: si no está autenticado → login
  if (!isAuthenticated) {
    return navigateTo('/', { replace: true });
  }

  // 🔹 Verificación de roles ANTES de mostrar contenido
  if (to.path.startsWith('/admin') && !auth.hasRole('admin')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }

  if (to.path.startsWith('/tecnico') && !auth.hasRole('tecnico')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }

  if (to.path.startsWith('/cliente') && !auth.hasRole('usuario')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }

  // Verificar roles específicos en meta
  if (to.meta?.roles) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    if (!auth.hasRole(requiredRoles)) {
      return navigateTo('/acceso-denegado', { replace: true });
    }
  }

  // Si llega aquí → autenticado y con permisos
});