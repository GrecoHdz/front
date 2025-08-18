import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';

interface User {
  id_usuario: number;
  id_rol: number;
  nombre: string;
  identidad: string;
  email: string;
  telefono: string;
  fecha_registro?: string;
  role: string; // Nombre del rol en minúsculas (ej: 'admin', 'usuario', 'tecnico')
  rol_nombre?: string; // Nombre del rol con formato (ej: 'Admin', 'Usuario', 'Tecnico')
  [key: string]: any;
}

interface LoginCredentials {
  identidad: string;
  password: string;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: any;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const token = useCookie('token');
  const isAuthenticated = computed(() => !!token.value);

  // Acciones
  const setUser = (userData: User | null) => {
    user.value = userData;
    // Si se está eliminando el usuario, limpiar también las cookies
    if (!userData && process.client) {
      useCookie('user').value = null;
    }
  };

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    // La cookie se manejará automáticamente por el navegador
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const config = useRuntimeConfig();
      console.log('Iniciando login con:', credentials);
      
      const response = await $fetch('/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: {
          identidad: credentials.identidad,
          password: credentials.password
        }
      }) as { token: string; user: any; message?: string };
      
      console.log('Respuesta del servidor:', response);
      
      if (response?.token) {
        setToken(response.token);
        
        if (response.user) {
          // Asegurarse de que el usuario tenga el campo role
          const userData = response.user;
          if (!userData.role && userData.id_rol) {
            userData.role = roleMap[userData.id_rol] || 'usuario';
          }
          
          console.log('Usuario autenticado:', userData);
          setUser(userData);
          
          // Guardar el usuario en una cookie para persistencia
          useCookie('user').value = JSON.stringify(userData);
          
          return { success: true, user: userData };
        }
      }
      
      return { 
        success: false, 
        error: response?.message || 'Error en la autenticación' 
      };
      
    } catch (error: any) {
      console.error('Error en login:', error);
      const errorMessage = error.data?.message || error.message || 'Error en la autenticación';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setToken(null);
    user.value = null;
    // Limpiar cookies
    useCookie('user').value = null;
    navigateTo('/');
  };

  const checkAuth = async () => {
    // Si no hay token, verificar si hay un usuario en las cookies
    if (!token.value) {
      const storedUser = useCookie('user').value;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verificar si el token está a punto de expirar (menos de 5 minutos)
          if (token.value) {
            try {
              const payload = JSON.parse(atob(token.value.split('.')[1]));
              const exp = payload.exp * 1000;
              const now = Date.now();
              
              // Si el token expira en menos de 5 minutos, intentar renovarlo
              if (exp - now < 5 * 60 * 1000) {
                return await refreshToken();
              }
            } catch (e) {
              console.error('Error al verificar expiración del token:', e);
            }
          }
          
          return true;
        } catch (e) {
          console.error('Error al parsear usuario guardado:', e);
          useCookie('user').value = null;
          return false;
        }
      }
      return false;
    }
    
    // Si hay token, verificar con el servidor
    try {
      const config = useRuntimeConfig();
      const userData = await $fetch('/auth/me', {
        baseURL: config.public.apiBase,
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      }) as User;
      
      if (userData) {
        // Asegurarse de que el usuario tenga el campo role
        if (!userData.role && userData.id_rol) {
          userData.role = roleMap[userData.id_rol] || 'usuario';
        }
        
        setUser(userData);
        
        // Actualizar el usuario en las cookies
        useCookie('user').value = JSON.stringify(userData);
        
        return true;
      }
    } catch (error: any) {
      console.error('Error al verificar autenticación:', error);
      
      // Si el token es inválido o ha expirado, intentar renovarlo
      if (error.statusCode === 401) {
        return await refreshToken();
      }
      
      // Limpiar datos de autenticación inválidos
      setToken(null);
      setUser(null);
    }
    
    return false;
  };
  
  // Función para renovar el token de acceso
  const refreshToken = async () => {
    try {
      const config = useRuntimeConfig();
      const refreshTokenCookie = useCookie('refreshToken');
      
      if (!refreshTokenCookie.value) {
        throw new Error('No hay refresh token disponible');
      }
      
      const response = await $fetch('/auth/refresh-token', {
        method: 'POST',
        baseURL: config.public.apiBase,
        body: {
          refreshToken: refreshTokenCookie.value
        }
      }) as { token: string; user: User };
      
      if (response.token) {
        setToken(response.token);
        
        if (response.user) {
          // Asegurarse de que el usuario tenga el campo role
          const userData = response.user;
          if (!userData.role && userData.id_rol) {
            userData.role = roleMap[userData.id_rol] || 'usuario';
          }
          
          setUser(userData);
          useCookie('user').value = JSON.stringify(userData);
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error al renovar el token:', error);
      // Si hay un error al renovar, limpiar todo
      setToken(null);
      setUser(null);
      useCookie('refreshToken').value = null;
      useCookie('user').value = null;
    }
    
    return false;
  };

  // Mapeo de IDs de rol a nombres de rol (en minúsculas)
  const roleMap: Record<number, string> = {
    1: 'admin',
    2: 'tecnico',
    3: 'usuario'
  };
  
  // Mapeo de nombres de rol a IDs (para referencia)
  const roleToIdMap: Record<string, number> = {
    'admin': 1,
    'tecnico': 2,
    'usuario': 3
  };

  // Getters
  const userRole = computed(() => {
    if (!user.value) return null;
    
    // 1. Verificar si tenemos el campo 'role' directamente
    if (user.value.role) {
      return user.value.role.toLowerCase();
    }
    
    // 2. Si no, verificar si tenemos 'rol_nombre'
    if (user.value.rol_nombre) {
      return user.value.rol_nombre.toLowerCase();
    }
    
    // 3. Si no, intentar mapear desde id_rol
    if (user.value.id_rol) {
      return roleMap[user.value.id_rol] || null;
    }
    
    return null;
  });
  
  const userName = computed(() => user.value?.nombre || null);
  const userId = computed(() => user.value?.id_usuario || null);
  
  // Verificar si el usuario tiene un rol específico
  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!userRole.value) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.some(role => 
      userRole.value?.toLowerCase() === role.toLowerCase()
    );
  };

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    
    // Getters
    userRole,
    userName,
    userId,
    
    // Acciones
    setUser,
    setToken,
    login,
    logout,
    checkAuth,
    hasRole
  };
});
