// auth.store.ts 
import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';

let _refreshPromise: Promise<boolean> | null = null;

// ─── Helpers para PWA (localStorage refresh token) ───────────────────────────
const PWA_RT_KEY = 'pwa_refresh_token';

const isPWAMode = (): boolean => {
  if (!process.client) return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

const savePWARefreshToken = (token: string | null) => {
  if (!process.client) return;
  if (token) {
    localStorage.setItem(PWA_RT_KEY, token);
  } else {
    localStorage.removeItem(PWA_RT_KEY);
  }
};

const getPWARefreshToken = (): string | null => {
  if (!process.client) return null;
  return localStorage.getItem(PWA_RT_KEY);
};

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
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  const userCookie = useCookie<string | null>('user', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
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

    // Normalizar el rol y asegurar que siempre tenga un valor por defecto
    const normalizedUser: User = {
      ...userData,
      role: (userData.rol?.nombre_rol?.toLowerCase() || userData.role || 'usuario'),
      estado: userData.estado || 'activo'
    };

    user.value = normalizedUser;

    // Guardar datos mínimos en la cookie
    const minimalUserData = {
      id_usuario: normalizedUser.id_usuario,
      nombre: normalizedUser.nombre,
      id_ciudad: normalizedUser.id_ciudad,
      role: normalizedUser.role,
      estado: normalizedUser.estado
    };
    userCookie.value = JSON.stringify(minimalUserData);

    return normalizedUser;
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
      }) as { token: string; user: User; refreshToken?: string; disabled?: boolean; message?: string };

      if (response.token) {
        setToken(response.token);
        // Guardar refresh token en localStorage si estamos en modo PWA
        if (response.refreshToken) {
          savePWARefreshToken(response.refreshToken);
        }
        if (response.user) setUser(response.user);
        return { success: true, user: response.user };
      }

      return { success: false, error: response.message || 'Error en la autenticación' };

    } catch (error: any) {
      clearAuthState();
      return {
        success: false,
        error: error.data?.message || error.message || 'Error en la autenticación',
        status: error.response?.status || error.statusCode || error.status
      };
    }
  };

  const logout = async () => {
    try {
      const config = useRuntimeConfig();
      const pwaToken = getPWARefreshToken();
      
      // Intentar logout en el servidor (no bloqueante para el resto del proceso)
      await $fetch('/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: pwaToken ? { 'X-Refresh-Token': pwaToken } : {}
      }).catch(err => console.error('Server logout error:', err));
      
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Limpiar TODO el estado local SIEMPRE
      savePWARefreshToken(null);
      clearAuthState();
      
      // Redirección forzada para limpiar memoria
      if (process.client) {
        window.location.href = '/';
      } else {
        await navigateTo('/', { replace: true });
      }
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
        role: response.rol?.nombre_rol?.toLowerCase() || 'usuario',
        estado: response.estado
      };

      return setUser(normalizedUser);
    } catch (err) {
      clearAuthState();
      return null;
    }
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      if (!token.value) {
        return await refreshToken();
      }

      // Intentar decodificar token
      let tokenPayload: any;
      try {
        tokenPayload = JSON.parse(atob(token.value.split('.')[1]));
      } catch {
        return await refreshToken();
      }

      const tokenExpiresIn = tokenPayload.exp * 1000 - Date.now();

      // Si el token está por expirar (menos de 2 min) o ya expiró
      if (tokenExpiresIn <= 0 || tokenExpiresIn < 2 * 60 * 1000) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          clearAuthState();
          return false;
        }
      }

      // Obtener usuario actualizado
      const fetchedUser = await fetchUser();

      if (!fetchedUser) {
        clearAuthState();
        return false;
      }

      return true;
    } catch (err) {
      clearAuthState();
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (_refreshPromise) return _refreshPromise;

    _refreshPromise = (async () => {
      try {
        const config = useRuntimeConfig();
        const headers: Record<string, string> = {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        };

        // 📱 PWA Fallback: enviar refresh token por header si la cookie no está disponible
        const pwaToken = getPWARefreshToken();
        if (isPWAMode() && pwaToken) {
          headers['X-Refresh-Token'] = pwaToken;
          console.log('📱 [AuthStore] Modo PWA: enviando refresh token por header');
        }

        const response = await $fetch('/auth/refresh-token', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers
        }) as { token?: string; refreshToken?: string; user?: any };

        if (response?.token) {
          setToken(response.token);

          // Actualizar el refresh token en localStorage si el backend devuelve uno nuevo
          if (response.refreshToken) {
            savePWARefreshToken(response.refreshToken);
          }

          // Normalizar los datos del usuario
          if (response.user) {
            const normalizedUser = {
              ...response.user,
              role: response.user.rol?.nombre_rol?.toLowerCase() || 'usuario',
              estado: response.user.estado || 'activo'
            };
            setUser(normalizedUser);
            await fetchUser();
          }

          return true;
        }

        return false;
      } catch (err) {
        // Solo limpiar el estado si NO estamos en modo PWA (para no perder el RT almacenado)
        if (!isPWAMode()) {
          clearAuthState();
        } else {
          clearAuthState();
          savePWARefreshToken(null); // RT inválido, limpiar también
        }
        return false;
      } finally {
        _refreshPromise = null;
      }
    })();

    return _refreshPromise;
  };

  const userName = computed(() => user.value?.nombre || null);
  const userId = computed(() => user.value?.id_usuario || null);


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
    clearAuthState,
    fetchUser,
    userName,
    userId
  };
});