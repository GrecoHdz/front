// auth.global.ts 
import { useAuthStore } from './auth.store';

type UserRole = 'admin' | 'tecnico' | 'usuario';

interface UserResponse {
  id_usuario: number;
  id_ciudad: number;
  nombre: string;
  rol?: {
    nombre_rol: string;
  };
  estado?: string;
  [key: string]: any;
}

export default defineNuxtRouteMiddleware(async (to) => {
  // 0. Obtener instancias y rutas
  const auth = useAuthStore();
  const currentPath = to.path;
  const publicPaths = ['/', '/registro', '/auth', '/acceso-denegado', '/usuario-deshabilitado'];
  
  // 1. Si es una ruta pública, permitir acceso
  if (publicPaths.includes(currentPath)) {
    console.log('✅ [auth.global] Ruta pública, acceso permitido');
    return;
  }

  // 2. Obtener el dashboard correspondiente al rol
  const getDashboardPath = (role: string | undefined): string => {
    switch (role?.toLowerCase()) {
      case 'admin': return '/admin/DashboardAdmin';
      case 'tecnico': return '/tecnico/DashboardTecnico';
      case 'usuario': return '/cliente/DashboardCliente';
      default: return '/';
    }
  };

  // 3. Verificar si hay token
  if (!auth.token) {
    console.log('🔄 [auth.global] No hay token, intentando renovar...');
    try {
      const refreshed = await auth.refreshToken();
      
      if (!refreshed) {
        console.log('❌ [auth.global] No se pudo renovar el token, redirigiendo a login');
        if (currentPath !== '/') {
          return navigateTo('/', { replace: true });
        }
        return;
      }
      console.log('✅ [auth.global] Token renovado exitosamente');
    } catch (error) {
      console.error('❌ [auth.global] Error al renovar token:', error);
      return navigateTo('/', { replace: true });
    }
  }

  // 4. Si no hay usuario, intentar cargarlo
  if (!auth.user) {
    try {
      await auth.fetchUser();
    } catch (error) {
      console.error('❌ [auth.global] Error al cargar usuario:', error);
      return navigateTo('/', { replace: true });
    }
  }

  // 5. Verificar si el usuario está deshabilitado
  if (auth.user?.estado === 'deshabilitado') {
    console.log('🚫 [auth.global] Usuario deshabilitado, redirigiendo...');
    if (currentPath !== '/usuario-deshabilitado') {
      return navigateTo('/usuario-deshabilitado', { replace: true });
    }
    return;
  }

  // 6. Obtener el rol del usuario
  const userRole = (auth.user?.rol?.nombre_rol?.toLowerCase() as UserRole) || 'usuario';
  console.log('🔍 [auth.global] Rol del usuario:', userRole);
  
  // 7. Obtener el dashboard correspondiente al rol
  const dashboardPath = getDashboardPath(userRole);
  
  // 8. Si ya está en su dashboard, permitir acceso
  if (currentPath === dashboardPath) {
    console.log('✅ [auth.global] Usuario ya en su dashboard');
    return;
  }

  // 9. Definir rutas permitidas por rol
  const allowedPaths: Record<UserRole, string[]> = {
    admin: ['/admin', '/perfil', '/admin/DashboardAdmin'],
    tecnico: ['/tecnico', '/perfil', '/tecnico/DashboardTecnico'],
    usuario: ['/cliente', '/perfil', '/cliente/DashboardCliente']
  };

  // 10. Verificar si la ruta actual está permitida para el rol
  const isPathAllowed = allowedPaths[userRole]?.some(path => 
    currentPath === path || currentPath.startsWith(path + '/')
  );

  // 11. Si la ruta no está permitida, redirigir al dashboard
  if (!isPathAllowed) {
    console.log(`⛔ [auth.global] Ruta no permitida, redirigiendo a: ${dashboardPath}`);
    return navigateTo(dashboardPath, { replace: true });
  }

  console.log('✅ [auth.global] Acceso permitido a', currentPath);
});