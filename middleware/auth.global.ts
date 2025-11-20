// auth.global.ts 
import { useAuthStore } from './auth.store';

// Definir tipos para la respuesta del usuario
type UserRole = 'admin' | 'tecnico' | 'usuario';

interface UserResponse {
  id_usuario: number;
  id_ciudad: number;
  nombre: string;
  rol?: {
    nombre_rol: string;
  };
  estado?: string;
  [key: string]: any; // Para propiedades adicionales
}

// Variable para controlar si ya estamos en proceso de redirección
let isRedirecting = false;

export default defineNuxtRouteMiddleware(async (to) => {
  // Evitar múltiples redirecciones simultáneas
  if (isRedirecting) return;
  
  // Ruta actual
  const currentPath = to.path;
  console.log('🔍 [auth.global] Verificando acceso para:', currentPath);
  
  // 1. Obtener store de autenticación primero
  const auth = useAuthStore();
  
  // 2. Definir rutas públicas
  const publicPaths = ['/', '/registro', '/auth', '/acceso-denegado', 'usuario-deshabilitado'];
  
  // 3. Intentar renovar el token si no existe o está expirado
  if (!auth.token) {
    console.log('🔄 [auth.global] No hay token, intentando renovar...');
    const refreshed = await auth.refreshToken();
    
    // Si estamos en una ruta pública y no se pudo renovar, permitir acceso
    if (publicPaths.includes(currentPath)) {
      console.log('✅ [auth.global] Ruta pública, acceso permitido');
      return;
    }
    
    // Si no se pudo renovar y no es ruta pública, redirigir a login
    if (!refreshed) {
      console.log('❌ [auth.global] No se pudo renovar el token');
      if (currentPath !== '') {
        isRedirecting = true;
        return navigateTo('', { replace: true });
      }
      return;
    }
    
    console.log('✅ [auth.global] Token renovado exitosamente');
  }
  
  // 4. Si es una ruta pública, permitir acceso
  if (publicPaths.includes(currentPath)) {
    console.log('✅ [auth.global] Ruta pública, acceso permitido');
    return;
  }
  
  // 5. Verificar si el usuario está autenticado
  if (!auth.user) {
    console.log('🔄 [auth.global] Cargando datos del usuario...');
    try {
      await auth.fetchUser();
    } catch (error) {
      console.error('❌ [auth.global] Error al cargar usuario:', error);
      isRedirecting = true;
      return navigateTo('', { replace: true });
    }
  }
  
  // 5. Obtener datos del usuario
  try {
    const config = useRuntimeConfig();
    console.log('🔍 [auth.global] Obteniendo datos del usuario...');
    
    const userData = await $fetch<UserResponse>('/auth/me', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    console.log('✅ [auth.global] Datos del usuario obtenidos');

    // Verificar si el usuario está deshabilitado
    if (userData.estado === 'deshabilitado') {
      console.log('🚫 [auth.global] Usuario deshabilitado, redirigiendo...');
      return navigateTo('/usuario-deshabilitado', { replace: true });
    }
    
    // 6. Actualizar el usuario en el store
    const userRole = (userData.rol?.nombre_rol?.toLowerCase() as UserRole) || 'usuario';
    console.log('🔍 [auth.global] Rol del usuario:', userRole);
    
    // 7. Verificar si la ruta es válida para el rol
    const rolePath = `/${userRole}`;
    const isRouteValid = to.path.startsWith(rolePath);
    
    if (!isRouteValid) {
      console.log(`⛔ [auth.global] Ruta no permitida para el rol ${userRole}`);
      const dashboardPath = auth.redirectToDashboard();
      console.log(`🔄 [auth.global] Redirigiendo a dashboard: ${dashboardPath}`);
      return navigateTo(dashboardPath, { replace: true });
    }
    
    console.log('✅ [auth.global] Acceso permitido a', to.path);
    
  } catch (error) {
    console.error('❌ [auth.global] Error al verificar autenticación:', error);
    return navigateTo('/', { replace: true });
  }
});