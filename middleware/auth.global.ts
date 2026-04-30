// auth.global.ts
import { useAuthStore } from './auth.store';

// Comprueba si un JWT (formato header.payload.signature) ya expiró
const isJwtExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Margen de 30 s para compensar diferencias de reloj entre cliente y servidor
    return payload.exp * 1000 - Date.now() < 30_000;
  } catch {
    return true; // Si no se puede decodificar, tratar como expirado
  }
};

type UserRole = 'admin' | 'tecnico' | 'usuario' | 'sa';

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
  const publicPaths = [
    '/',
    '/registro',
    '/auth',
    '/usuario-deshabilitado',
    '/reset-password',
    '/forgot-password'
  ];

  console.log(`🔍 [Middleware] Ruta: ${currentPath} | Token: ${!!auth.token} | Fresh: ${auth.isFetched}`);

  // Verificar si la ruta actual es una ruta de restablecimiento de contraseña
  const isResetPasswordPath = currentPath.startsWith('/reset-password/');

  // Obtener el dashboard correspondiente al rol
  const getDashboardPath = (role: string | undefined): string => {
    switch (role?.toLowerCase()) {
      case 'admin': return '/admin/DashboardAdmin';
      case 'tecnico': return '/tecnico/DashboardTecnico';
      case 'usuario': return '/cliente/DashboardCliente';
      case 'sa': return '/admin/DashboardAdmin';
      default: return '/';
    }
  };

  // 1. Si es una ruta pública o de restablecimiento de contraseña, permitir acceso
  if (publicPaths.includes(currentPath) || isResetPasswordPath) {
    // Helper local: leer el destino del query param enviado por el service worker
    const getRedirectTarget = (): string | null => {
      if (!process.client) return null;
      const redirectParam = to.query.redirect as string | undefined;
      if (redirectParam && redirectParam.startsWith('/')) return redirectParam;
      return null;
    };

    if (currentPath === '/') {
      // ── Caso A: Hay token en memoria ─────────────────────────────────────────
      if (auth.token) {
        console.log('🏠 [Middleware] Usuario en home con token. Verificando rol...');

        // Si el token está expirado, refrescar primero (evita 401 en fetchUser)
        if (isJwtExpired(auth.token as string)) {
          console.log('⏰ [Middleware/Home] Token expirado. Intentando refresh...');
          const refreshed = await auth.refreshToken();
          if (!refreshed) {
            // El RT también expiró: mostrar login
            console.warn('⚠️ [Middleware/Home] Refresh falló. Mostrando login.');
            return; // Dejamos que se muestre la página de login (/)
          }
        } else if (!auth.isFetched) {
          // Token válido pero datos no refrescados
          try {
            console.log('📡 [Middleware] Refrescando datos del usuario...');
            await auth.fetchUser();
          } catch (e) {
            console.error('❌ [Middleware] Error al refrescar usuario:', e);
            return;
          }
        }

        if (auth.user) {
          const redirectTarget = getRedirectTarget();
          const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';
          const targetDashboard = redirectTarget || getDashboardPath(userRole);
          console.log(`🚀 [Middleware] Redirigiendo a: ${targetDashboard} (Rol: ${userRole})`);
          if (targetDashboard !== '/') {
            return navigateTo(targetDashboard, { replace: true });
          }
        }
      }

      // ── Caso B: Sin token → intentar restaurar desde RT ──────────────────────
      else {
        const userCookieVal = useCookie('user').value;
        let hasPWAToken = false;

        if (process.client) {
          hasPWAToken = !!localStorage.getItem('pwa_refresh_token');
          // Si acabamos de hacer logout explícito, no intentamos revivir la sesión
          if (localStorage.getItem('just_logged_out') === 'true') {
            localStorage.removeItem('just_logged_out');
            return;
          }
        }

        if (userCookieVal || hasPWAToken) {
          try {
            console.log('🔄 [Middleware] Intentando restaurar sesión proactivamente en home...');
            const refreshed = await auth.refreshToken();
            if (refreshed && auth.user) {
              const redirectTarget = getRedirectTarget();
              const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';
              const targetDashboard = redirectTarget || getDashboardPath(userRole);
              console.log(`🚀 [Middleware] Sesión restaurada, redirigiendo a: ${targetDashboard}`);
              if (targetDashboard !== '/') {
                return navigateTo(targetDashboard, { replace: true });
              }
            }
          } catch (e) {
            console.error('❌ [Middleware] Falló restauración proactiva:', e);
          }
        }
      }
    }

    return;
  }




  // 3. Verificar si hay token
  if (!auth.token) {
    try {
      const refreshed = await auth.refreshToken();

      if (!refreshed) {
        if (currentPath !== '/') {
          return navigateTo('/', { replace: true });
        }
        return;
      }
    } catch (error) {
      console.error('❌ [auth.global] Error al renovar token:', error);
      return navigateTo('/', { replace: true });
    }
  }

  // 4. Si el token existe pero está expirado, refrescar primero antes de llamar a fetchUser.
  // Sin este check, fetchUser recibe un 401 y borra la sesión aunque el RT sea válido.
  // auth.token es el valor del cookie (string), no un Ref.
  if (auth.token && isJwtExpired(auth.token as string)) {
    console.log('⏰ [Middleware] Token expirado detectado. Intentando refresh antes de fetchUser...');
    const refreshed = await auth.refreshToken();
    if (!refreshed) {
      console.warn('⚠️ [Middleware] Refresh falló tras token expirado. Redirigiendo a login.');
      return navigateTo('/', { replace: true });
    }
  }

  // 5. Si no hay usuario o los datos son de cookie (no fetched), intentar cargarlos
  if (auth.token && (!auth.user || !auth.isFetched)) {
    try {
      await auth.fetchUser();
    } catch (error) {
      console.error('❌ [auth.global] Error al validar usuario:', error);
      if (!publicPaths.includes(currentPath)) {
        return navigateTo('/', { replace: true });
      }
    }
  }

  // 6. Verificar si el usuario está deshabilitado
  if (auth.user?.estado === 'deshabilitado') {
    if (currentPath !== '/usuario-deshabilitado') {
      return navigateTo('/usuario-deshabilitado', { replace: true });
    }
    return;
  }

  // 7. Obtener el rol del usuario
  const userRole = (auth.user?.role?.toLowerCase() as UserRole) || 'usuario';

  // 8. Obtener el dashboard correspondiente al rol
  const dashboardPath = getDashboardPath(userRole);

  // 9. Si ya está en su dashboard, permitir acceso
  if (currentPath === dashboardPath) {
    return;
  }

  // 10. Definir rutas permitidas por rol
  const allowedPaths: Record<UserRole, string[]> = {
    admin: ['/admin'],
    tecnico: ['/tecnico'],
    usuario: ['/cliente'],
    sa: ['/admin']
  };

  // 11. Verificar si la ruta actual está permitida para el rol
  const isPathAllowed = allowedPaths[userRole]?.some(path =>
    currentPath === path || currentPath.startsWith(path + '/')
  );

  // 12. Si la ruta no está permitida, redirigir al dashboard
  if (!isPathAllowed) {
    return navigateTo(dashboardPath, { replace: true });
  }
});