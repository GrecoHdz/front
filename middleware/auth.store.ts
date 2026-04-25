// auth.store.ts 
import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';

let _refreshPromise: Promise<boolean> | null = null;

// ─── Helpers para PWA (localStorage refresh token) ───────────────────────────
const PWA_RT_KEY = 'pwa_refresh_token';

const isPWAMode = (): boolean => {
  if (!process.client) return false;
  
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
                     
  // En algunos navegadores móviles, al abrir desde notificación no se detecta standalone de inmediato
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  return isStandalone || isMobile;
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
  const isFetched = ref(false); // Indica si los datos vienen del servidor en esta sesión

  const clearAuthState = () => {
    user.value = null;
    isFetched.value = false; // Resetear al limpiar estado
    tokenCookie.value = null;
    userCookie.value = null;
    
    // Forzar la eliminación de cookies a nivel de documento para evitar race conditions
    if (process.client) {
      const cookieOptions = "; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      const extraOptions = process.env.NODE_ENV === 'production' ? "; SameSite=None; Secure" : "";
      
      document.cookie = "token=" + cookieOptions + extraOptions;
      document.cookie = "user=" + cookieOptions + extraOptions;
      document.cookie = "refreshToken=" + cookieOptions + extraOptions;
      
      // Intentar también sin las opciones extra por si acaso
      document.cookie = "token=" + cookieOptions;
      document.cookie = "user=" + cookieOptions;
      document.cookie = "refreshToken=" + cookieOptions;
    }
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
      
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      let timeoutId;
      if (controller) {
        timeoutId = setTimeout(() => controller.abort(), 2000);
      }
      
      try {
        await $fetch('/auth/logout', {
          method: 'POST',
          baseURL: config.public.apiBase,
          credentials: 'include',
          headers: pwaToken ? { 'X-Refresh-Token': pwaToken } : {},
          signal: controller ? controller.signal : undefined
        });
      } catch (err) {
        console.error('Server logout error:', err);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
      
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Limpiar TODO el estado local SIEMPRE
      if (process.client) {
        localStorage.setItem('just_logged_out', 'true');
      }
      savePWARefreshToken(null);
      clearAuthState();
      
      // Redirección forzada para limpiar memoria y estado
      if (process.client) {
        setTimeout(() => {
          window.location.href = '/';
        }, 50);
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

      isFetched.value = true; // Marcar como datos validados por el servidor
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
        if (pwaToken) {
          headers['X-Refresh-Token'] = pwaToken;
          if (isPWAMode()) {
            console.log('📱 [AuthStore] Modo PWA detectado: enviando refresh token');
          } else {
            console.log('📱 [AuthStore] Enviando refresh token de localStorage como fallback');
          }
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
            isFetched.value = true; // El refresh token también trae datos frescos
            // No llamar a fetchUser() aquí si la respuesta ya trae al usuario,
            // para evitar race conditions y peticiones innecesarias
          } else {
            // Solo si la respuesta no trae al usuario, intentamos cargarlo
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
    isFetched: computed(() => isFetched.value),
    userName,
    userId
  };
});