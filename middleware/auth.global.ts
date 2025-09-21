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

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  // Inicializar autenticación (en server y client)
  await auth.initAuth();
  
  // Verificar autenticación inicial
  let isAuthenticated = await auth.checkAuth();
  
  // Si no hay token de acceso pero hay cookie de usuario, considerar autenticado
  if (!isAuthenticated && auth.user) {
    isAuthenticated = true;
    // Intentar renovar el token en segundo plano
    if (process.client) {
      auth.refreshToken().catch(console.error);
    }
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
    // Si está logueado (o se pudo renovar el token) y trata de entrar a login o registro → al dashboard
    if (isAuthenticated && (normalizedPath === '/')) {
      return navigateTo(getDashboardPath(auth), { replace: true });
    }
    return;
  }

  // Para rutas protegidas: si no está autenticado → login
  if (!isAuthenticated) {
    return navigateTo('/', { replace: true });
  }

  // --- 🔹 Verificación de roles ANTES de mostrar nada ---
  if (to.path.startsWith('/admin') && !auth.hasRole('admin')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }

  if (to.path.startsWith('/tecnico') && !auth.hasRole('tecnico')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }

  if (to.path.startsWith('/cliente') && !auth.hasRole('usuario')) {
    return navigateTo('/acceso-denegado', { replace: true });
  }

  if (to.meta?.roles) {
    const requiredRoles = Array.isArray(to.meta.roles) ? to.meta.roles : [to.meta.roles];
    if (!auth.hasRole(requiredRoles)) {
      return navigateTo('/acceso-denegado', { replace: true });
    }
  }

  // Si llega aquí → autenticado y con permisos
});

