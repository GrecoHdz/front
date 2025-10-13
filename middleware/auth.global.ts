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

export default defineNuxtRouteMiddleware(async (to) => {
  console.log('🔍 [auth.global] Verificando acceso para ruta:', to.path);
  
  // 1. Definir rutas públicas
  const publicPaths = ['/', '/registro', '/auth', '/acceso-denegado', '/usuario-deshabilitado'];
  
  // 2. Permitir acceso a rutas públicas
  if (publicPaths.includes(to.path)) {
    console.log('✅ [auth.global] Ruta pública, acceso permitido');
    return;
  }
  
  // 3. Obtener store de autenticación
  const auth = useAuthStore();
  
  // 4. Verificar autenticación básica
  if (!auth.token) {
    console.log('🔒 [auth.global] No hay token, redirigiendo a login');
    return navigateTo('', { replace: true });
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
    
    console.log('✅ [auth.global] Datos del usuario:', userData);

    //verificar si el usuario esta deshabilitado
    if (userData.estado === 'deshabilitado') {
      console.log('🚫 [auth.global] Usuario deshabilitado, redirigiendo a usuario deshabilitado');
      return navigateTo('/usuario-deshabilitado', { replace: true });
    }
    
    // 6. Verificar rol y ruta
    const userRole = (userData.rol?.nombre_rol?.toLowerCase() as UserRole) || 'usuario';
    console.log('🔍 [auth.global] Rol del usuario:', userRole);
    
    const rolePaths: Record<UserRole, string> = {
      'admin': '/admin',
      'tecnico': '/tecnico',
      'usuario': '/cliente'
    };
    
    const rolePath = rolePaths[userRole as UserRole] || '/acceso-denegado';
    
    console.log('🔍 [auth.global] Ruta esperada para el rol:', rolePath);
    
    // 7. Verificar si la ruta comienza con el prefijo del rol
    if (!to.path.startsWith(rolePath)) {
      console.log(`⛔ [auth.global] Ruta no permitida para el rol ${userRole}`);
      return navigateTo('/acceso-denegado', { replace: true });
    }
    
    console.log('✅ [auth.global] Acceso permitido a', to.path);
    
  } catch (error) {
    console.error('❌ [auth.global] Error al verificar autenticación:', error);
    return navigateTo('/', { replace: true });
  }
});