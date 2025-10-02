//auth.store.ts
import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports'; 

let _refreshPromise: Promise<boolean> | null = null;

interface User {
  id_usuario: number;
  id_rol: number;
  id_ciudad: number;  
  nombre: string;
  identidad: string;
  email: string;
  telefono: string;
  fecha_registro: string;
  role: string;
  estado: string;
  [key: string]: any;
}

interface LoginCredentials {
  identidad: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!tokenCookie.value);
  const isInitialized = ref(false);
 
  // Cookies
  const tokenCookie = useCookie('token', {
    maxAge: 60 * 15, // 15 minutos
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const userCookie = useCookie<string | null>('user', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const token = tokenCookie;

  // 🔹 Función para limpiar todas las cookies y estado
  const clearAuthState = () => {
    user.value = null;
    tokenCookie.value = null;
    userCookie.value = null;
  };

  const setUser = (userData: User | null): User | null => {
    if (!userData) {
      clearAuthState();
      return null;
    }

    // Obtener datos del token si está disponible
    const tokenData = token.value ? JSON.parse(atob(token.value.split('.')[1])) : null;
    
    // Verificar estado del usuario desde el token
    if (tokenData?.estado === 'deshabilitado') {
      clearAuthState();
      return null;
    }

    const updatedUser: User = { 
      ...userData,
      id_ciudad: userData.id_ciudad || 1,
      role: tokenData?.role || userData.role || 'usuario',
      estado: tokenData?.estado || 'activo'
    }; 
    
    const minimalUserData = {
      id_usuario: updatedUser.id_usuario,
      nombre: updatedUser.nombre,
      role: updatedUser.role,
      id_ciudad: updatedUser.id_ciudad
    }; 
    
    userCookie.value = JSON.stringify(minimalUserData);
    user.value = updatedUser;
    
    return updatedUser;
  };

  const setToken = (newToken: string | null) => {
    tokenCookie.value = newToken;
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const config = useRuntimeConfig();  
      
      const response = await $fetch('/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        body: {
          identidad: credentials.identidad,
          password: credentials.password
        }
      }) as { token: string; user: any; message?: string; disabled?: boolean };
      
      // 🔹 VERIFICAR SI LA CUENTA ESTÁ DESHABILITADA
      if (response?.disabled) {
        clearAuthState();
        return { 
          success: false, 
          error: response.message || 'Cuenta deshabilitada',
          disabled: true
        };
      }

      if (response?.token) {
        setToken(response.token);
        
        if (response.user) {
          const userData = {
            ...response.user, 
            id_ciudad: response.user.id_ciudad
          };
          
          setUser(userData);
          
          return { success: true, user: userData };
        }
      }
      
      return { 
        success: false, 
        error: response?.message || 'Error en la autenticación' 
      };
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      // 🔹 Manejar cuenta deshabilitada
      if (error.data?.disabled) {
        clearAuthState();
        return {
          success: false,
          error: error.data?.message || 'Cuenta deshabilitada',
          disabled: true
        };
      }

      const errorMessage = error.data?.message || error.message || 'Error en la autenticación';
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      const config = useRuntimeConfig();
      await $fetch('/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      clearAuthState();
      navigateTo('/');
    }
  };

  // --- INIT AUTH 
  const initAuth = async (): Promise<void> => {
    if (isInitialized.value) return;
    
    // Restaurar usuario desde cookie si existe
    if (userCookie.value) {
      try {
        const userData = typeof userCookie.value === 'string' 
          ? JSON.parse(userCookie.value) 
          : userCookie.value;
        
        // 🔹 VERIFICAR ESTADO
        if (userData.estado === 'deshabilitado') {
          clearAuthState();
          isInitialized.value = true;
          return;
        }

        if (userData.role && !userData.rol_nombre) {
          userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Error al analizar la cookie de usuario:', error);
        clearAuthState();
      }
    }
    
    isInitialized.value = true;
  };

  interface AuthMeResponse {
    id_usuario?: number;
    id?: number;
    id_rol?: number;
    role?: string;
    nombre?: string;
    identidad?: string;
    email?: string;
    telefono?: string;
    estado?: string;
    disabled?: boolean;
    [key: string]: any;
  }

  // --- CHECK AUTH
  const checkAuth = async (): Promise<boolean> => {
    // 🔹 Verificar si el usuario está deshabilitado
    if (user.value?.estado === 'deshabilitado') {
      await logout();
      return false;
    }

    // 🔹 Si no hay token, intentar refrescar con refresh token (HTTP-Only)
    if (!token.value) {
      try {
        return await refreshToken();
      } catch {
        await logout();
        return false;
      }
    }
    
    // Si hay token pero no refresh token, intentar renovar la sesión
    const refreshTokenCookie = useCookie('refreshToken');
    if (!refreshTokenCookie.value) {
      try {
        return await refreshToken();
      } catch (error) {
        console.error('Error al renovar sesión sin refresh token:', error);
        // No hacemos logout aquí para permitir que el usuario siga navegando
        // mientras el access token siga siendo válido
        return true;
      }
    }

    try {
      // Verificar expiración del token
      let tokenExpiresIn = Infinity;
      let shouldRefresh = false;

      try {
        const payload = JSON.parse(atob(token.value.split('.')[1]));
        const exp = payload.exp * 1000;
        tokenExpiresIn = exp - Date.now();

        // 🔹 VERIFICAR ESTADO EN EL TOKEN
        if (payload.estado === 'deshabilitado') {
          await logout();
          return false;
        }

        // Si el token expiró, refrescar
        if (tokenExpiresIn <= 0) {
          return await refreshToken();
        }

        // Si está por expirar (menos de 2 minutos), refrescar
        shouldRefresh = tokenExpiresIn < 2 * 60 * 1000;
      } catch {
        // Si no se puede decodificar, refrescar
        shouldRefresh = true;
      }

      // Refrescar si es necesario
      if (shouldRefresh) {
        return await refreshToken();
      }

      // Verificar con /auth/me si no hay datos de usuario
      if (!user.value || !user.value.id_usuario) {
        const config = useRuntimeConfig();
        const response = await $fetch<AuthMeResponse>("/auth/me", {
          baseURL: config.public.apiBase,
          headers: { Authorization: `Bearer ${token.value}` },
          credentials: "include",
          retry: 0,
          timeout: 5000
        });

        // 🔹 VERIFICAR SI ESTÁ DESHABILITADO
        if (response?.disabled || response?.estado === 'deshabilitado') {
          await logout();
          return false;
        }

        if (response && (response.id_usuario || response.id)) {
          const userData: Partial<User> = {
            ...response,
            id_usuario: response.id_usuario || response.id,
            role: response.role,
            nombre: response.nombre,
            identidad: response.identidad,
            email: response.email,
            telefono: response.telefono,
            id_rol: response.id_rol,
            id_ciudad: response.id_ciudad,
            estado: response.estado || 'activo'
          };

          if (userData.role && !userData.rol_nombre) {
            userData.rol_nombre =
              userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
          }

          setUser(userData as User);
        }
      }

      return true;
    } catch (error: any) {
      // 🔹 Si el error es por cuenta deshabilitada
      if (error.data?.disabled || error.statusCode === 403) {
        await logout();
        return false;
      }

      // Intentar refrescar el token
      try {
        return await refreshToken();
      } catch {
        await logout();
        return false;
      }
    }
  };

  // --- REFRESH TOKEN 
  const refreshToken = async (): Promise<boolean> => {
    if (_refreshPromise) { 
      return _refreshPromise;
    }
    
    _refreshPromise = (async () => {
      try {
        const config = useRuntimeConfig();
        
        const headers: Record<string, string> = {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        };
        
        // Si hay un token, incluirlo en el encabezado
        if (token.value) {
          headers['Authorization'] = `Bearer ${token.value}`;
        }
        
        const response = await $fetch('/auth/refresh-token', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers,
          retry: 0,
          timeout: 10000
        }) as any;

        if (response?.token) {
          // Verificar el estado del usuario desde el token
          const tokenData = JSON.parse(atob(response.token.split('.')[1]));
          
          // 🔹 VERIFICAR SI LA CUENTA ESTÁ DESHABILITADA
          if (tokenData.estado === 'deshabilitado') {
            clearAuthState();
            return false;
          }
          
          setToken(response.token);
          
          if (response.user) {
            // Asegurarse de que el rol esté en minúsculas
            const userRole = (response.user.role || tokenData.role || 'usuario').toLowerCase();
            
            const userData = { 
              ...response.user,
              role: userRole,
              id_ciudad: response.user.id_ciudad || 1
            };
            
            setUser(userData);
          }
          
          return true;
        }

        console.error('No se recibió un token válido en la respuesta');
        return false;
        
      } catch (error: any) {
        console.error('Error al renovar el token:', error); 
        
        // 🔹 Manejar cuenta deshabilitada o token inválido
        if (error.data?.disabled || error.statusCode === 403) {
          clearAuthState();
        }
        
        return false;
      } finally {
        _refreshPromise = null;
      }
    })();

    return _refreshPromise;
  };

  // Getters
  const userRole = computed(() => {
    if (!user.value) return null;
    
    if (user.value.role) {
      return user.value.role.toLowerCase();
    }
    
    if (user.value.rol_nombre) {
      return user.value.rol_nombre.toLowerCase();
    }
    
    if (user.value.id_rol) {
      return user.value.id_rol || null;
    }
    
    return null;
  });
  
  const userName = computed(() => user.value?.nombre || null);
  const userId = computed(() => user.value?.id_usuario || null);
  
  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user.value || !user.value.role) return false;
    
    const userRole = user.value.role.toLowerCase();
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.some(role => role.toLowerCase() === userRole);
    }
    
    return userRole === requiredRole.toLowerCase();
  };

  return {
    user,
    token,
    isAuthenticated,
    isInitialized: computed(() => isInitialized.value),
    setUser,
    setToken,
    login,
    logout,
    initAuth,
    checkAuth,
    refreshToken,
    hasRole,
    userRole,
    userName,
    userId
  };
});