// auth.store.ts 
import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports'; 

let _refreshPromise: Promise<boolean> | null = null;

interface User {
  id_usuario: number;
  id_rol?: number;
  id_ciudad: number;  
  nombre: string; 
  role: string;
  estado: string;
  [key: string]: any;
}

interface LoginCredentials {
  identidad: string;
  password: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
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
  const isAuthenticated = computed(() => !!token.value);
  const isInitialized = ref(false);

  const clearAuthState = () => {
    user.value = null;
    tokenCookie.value = null;
    userCookie.value = null;
  };

  const setUser = (userData: User | null) => {
    if (!userData) {
      clearAuthState();
      return null;
    }

    const updatedUser: User = { ...userData };
    user.value = updatedUser;

    // Guardar datos mínimos en la cookie
    const minimalUserData = {
      id_usuario: updatedUser.id_usuario,
      nombre: updatedUser.nombre,
      id_ciudad: updatedUser.id_ciudad
    };
    userCookie.value = JSON.stringify(minimalUserData);

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
        body: credentials
      }) as { token: string; user: User; disabled?: boolean; message?: string };

      if (response.token) {
        setToken(response.token);
        if (response.user) setUser(response.user);
        return { success: true, user: response.user };
      }

      return { success: false, error: response.message || 'Error en la autenticación' };

    } catch (error: any) {
      console.error('Error en login:', error);
      clearAuthState();
      return { success: false, error: error.data?.message || error.message || 'Error en la autenticación' };
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
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      clearAuthState();
      navigateTo('/');
    }
  };

  const initAuth = async () => {
    if (isInitialized.value) return;

    if (userCookie.value) {
      try {
        const userData = JSON.parse(userCookie.value);
        setUser(userData);
      } catch {
        clearAuthState();
      }
    }

    isInitialized.value = true;
  };

  // Obtener datos completos del usuario desde /auth/me
  const fetchUser = async (): Promise<User | null> => {
    if (!token.value) return null;
  
    try {
      const config = useRuntimeConfig();
      const response = await $fetch<User>('/auth/me', {
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
  
      // 🔹 Normalizar el rol y estado
      const normalizedUser: User = {
        ...response,
        role: response.rol?.nombre_rol?.toLowerCase() ||'usuario',
        estado: response.estado
      };
  
      return setUser(normalizedUser);
    } catch (err) {
      console.error('Error al obtener usuario con /auth/me:', err);
      clearAuthState();
      return null;
    }
  };
  
  const checkAuth = async (): Promise<boolean> => {
    try {
      if (!token.value) {
        console.warn('⚠️ [auth] No hay token, intentando refresh...');
        return await refreshToken();
      }
  
      // Intentar decodificar token
      let tokenPayload: any;
      try {
        tokenPayload = JSON.parse(atob(token.value.split('.')[1]));
      } catch {
        console.warn('⚠️ [auth] Token inválido, intentando refresh...');
        return await refreshToken();
      }
  
      const tokenExpiresIn = tokenPayload.exp * 1000 - Date.now();
  
      // Si el token está por expirar (menos de 2 min) o ya expiró
      if (tokenExpiresIn <= 0 || tokenExpiresIn < 2 * 60 * 1000) {
        console.log('🔄 [auth] Token expirado o a punto de expirar, refrescando...');
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearAuthState(); 
          return false;
        }
      }
  
      // Obtener usuario actualizado
      const fetchedUser = await fetchUser();
  
      if (!fetchedUser) {
        console.warn('⚠️ [auth] No se pudo obtener usuario. Limpiando estado...');
        clearAuthState();
        return false;
      } 
  
      return true;
    } catch (err) {
      console.error('❌ [auth] Error en checkAuth:', err);
      clearAuthState(); 
      return false;
    }
  };  

  const refreshToken = async (): Promise<boolean> => {
    if (_refreshPromise) return _refreshPromise;

    _refreshPromise = (async () => {
      try {
        const config = useRuntimeConfig();
        const headers: Record<string, string> = { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' };
        if (token.value) headers['Authorization'] = `Bearer ${token.value}`;

        const response = await $fetch('/auth/refresh-token', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers
        }) as { token?: string; user?: User };

        if (response?.token) {
          setToken(response.token);
          if (response.user) setUser(response.user);
          return true;
        }

        return false;
      } catch (err) {
        console.error('Error al renovar token:', err);
        clearAuthState();
        return false;
      } finally {
        _refreshPromise = null;
      }
    })();

    return _refreshPromise;
  };

  const userRole = computed(() => user.value?.role?.toLowerCase() || null);
  const userName = computed(() => user.value?.nombre || null);
  const userId = computed(() => user.value?.id_usuario || null);

  const hasRole = (requiredRole: string | string[]): boolean => {
    if (!user.value || !user.value.role) return false;
    const role = user.value.role.toLowerCase();
    return Array.isArray(requiredRole)
      ? requiredRole.some(r => r.toLowerCase() === role)
      : role === requiredRole.toLowerCase();
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
    fetchUser,
    hasRole,
    userRole,
    userName,
    userId
  };
});
