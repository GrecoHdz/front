import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';
let _refreshPromise: Promise<boolean> | null = null;

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
  const isAuthenticated = computed(() => !!tokenCookie.value);
  const isInitialized = ref(false);

  // Acciones
  // Cookie para almacenar los datos del usuario
  const userCookie = useCookie<string | null>('user', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

const setUser = (userData: User | null): User | null => {
  // Update reactive state
  user.value = userData;
  
  // If removing the user, clear cookies
  if (!userData) {
    tokenCookie.value = null;
    userCookie.value = null;
    return null;  // Explicitly return null
  }

  // Ensure required fields are present
  const updatedUser: User = { ...userData };
  
  if (!updatedUser.role && updatedUser.id_rol) {
    updatedUser.role = roleMap[updatedUser.id_rol] || 'usuario';
  }
  
  if (!updatedUser.rol_nombre && updatedUser.role) {
    updatedUser.rol_nombre = updatedUser.role.charAt(0).toUpperCase() + updatedUser.role.slice(1);
  }
  
  // Update user cookie (convert to JSON string)
  userCookie.value = JSON.stringify(updatedUser);
  
  // Return the updated user
  return updatedUser;
};

  // Cookie para el token de acceso 
const tokenCookie = useCookie('token', {
  maxAge: 60 * 60 * 24, // 1 día
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});
const token = tokenCookie; // usar 'token' en el resto del store como antes


  const setToken = (newToken: string | null) => {
    // Actualizar el estado reactivo
    tokenCookie.value = newToken;
    
    // Actualizar la cookie del token
    if (newToken) {
      tokenCookie.value = newToken;
    } else {
      tokenCookie.value = null;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const config = useRuntimeConfig();
      
      // Hacer la petición con credentials: 'include' para manejar las cookies
      const response = await $fetch('/auth/login', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include', // Importante para enviar/recibir cookies
        body: {
          identidad: credentials.identidad,
          password: credentials.password
        }
      }) as { token: string; user: any; message?: string };
      
      if (response?.token) {
        setToken(response.token);
        
        if (response.user) {
          // Asegurarse de que el usuario tenga el campo role
          const userData = response.user;
          if (!userData.role && userData.id_rol) {
            userData.role = roleMap[userData.id_rol] || 'usuario';
          }
          
          // Asegurarse de que el rol_nombre esté definido
          if (!userData.rol_nombre && userData.role) {
            userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
          }
           
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
      // Llamar al endpoint de logout en el backend
      await $fetch('/auth/logout', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include' // Importante para manejar las cookies
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar el estado local independientemente del resultado
      setToken(null);
      user.value = null;
      // Limpiar la cookie del usuario
      useCookie('user').value = null;
      // Redirigir al inicio
      navigateTo('/');
    }
  };

// --- INIT AUTH 
const initAuth = async (): Promise<boolean> => {
  if (isInitialized.value) return isAuthenticated.value; 
  
  // 1. Restaurar usuario desde cookie si existe
  if (userCookie.value) {
    try {
      // Verificar si ya es un objeto
      const userData = typeof userCookie.value === 'string' 
        ? JSON.parse(userCookie.value) 
        : userCookie.value;
        
      
      setUser(userData); 
    } catch (e) {
      console.error('❌ Error al procesar usuario de la cookie:', e, 'Valor de la cookie:', userCookie.value);
      userCookie.value = null;
    }
  }
  
  // 2. Siempre intentar con refresh token primero (no podemos verificar HTTP Only) 
  try {
    const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
      isInitialized.value = true;
      return true;
    }
  } catch (error) {
    console.error('❌ Error al intentar autenticar con refresh token:', error);
    // Continuar con el flujo normal si falla
  }
  
  
  
  // 3. Si el refresh token falla, intentar con el token de acceso (si existe)
  if (token.value) {
    try {
      // Validar el token de acceso directamente sin intentar refresh
      const config = useRuntimeConfig();
      const response = await $fetch('/auth/me', {
        baseURL: config.public.apiBase,
        headers: { 'Authorization': `Bearer ${token.value}` },
        retry: 0,
        timeout: 10000,
        credentials: 'include'
      }) as any;

      if (response && (response.id_usuario || response.id)) {
        // Normalizar datos del usuario
        const userData = { ...response };
        if (!userData.id_usuario && userData.id) {
          userData.id_usuario = userData.id;
        }
        if (!userData.role && userData.id_rol) {
          userData.role = roleMap[userData.id_rol] || 'usuario';
        }
        if (!userData.rol_nombre && userData.role) {
          userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
        }

        setUser(userData);
        isInitialized.value = true;
        return true;
      }
    } catch (error) {
      console.error('❌ Error al verificar token de acceso:', error);
    }
  }
  
  // 4. Si ambos métodos fallan, limpiar la sesión
  isInitialized.value = true;
  await logout();
  return false;
};

// --- CHECK AUTH 
const checkAuth = async (): Promise<boolean> => {
  
  // 1. Si hay un token de acceso, verificar su estado
  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      const expiresIn = exp - now;
      
      // Intentar obtener la información del usuario para forzar la verificación del refresh token
      const config = useRuntimeConfig();
      try {
        const userInfo = await $fetch('/auth/me', {
          baseURL: config.public.apiBase,
          headers: { 'Authorization': `Bearer ${token.value}` },
          credentials: 'include',
          retry: 0,
          timeout: 10000
        });
        
        
        // Si el token es válido por al menos 5 minutos, está bien
        if (expiresIn > 300000) {
          return true;
        }
        
      } catch (error) {
        console.error('❌ Error al verificar el refresh token:', error);
        const refreshed = await refreshToken();
        if (refreshed) return true;
      }
      
      // Si el token está por expirar (menos de 5 minutos), intentar renovarlo
      if (expiresIn > 0) { 
        const refreshed = await refreshToken();
        if (refreshed) {
          return true;
        }
      }
    } catch (e) {
      console.error('❌ Error al verificar token:', e);
    }
  }
  
  // 2. Si no hay token o no se pudo renovar, intentar con refresh token 
  const refreshed = await refreshToken();
  
  // 3. Si el refresh falló, limpiar todo el estado de autenticación
  if (!refreshed) {
    await logout();
    return false;
  }
  
  return true;
};

// Función para obtener la fecha de expiración del refresh token
const getRefreshTokenExpiration = async (): Promise<number | null> => {
  try {
    const config = useRuntimeConfig();
    const response = await $fetch('/auth/me', {
      baseURL: config.public.apiBase,
      headers: { 'Authorization': `Bearer ${token.value}` },
      credentials: 'include',
      // No lanzar error para manejar la respuesta manualmente
      retry: 0,
      timeout: 10000
    }) as any;

    // Si el backend devuelve la fecha de expiración del refresh token
    if (response?.refreshTokenExpiration) {
      return new Date(response.refreshTokenExpiration).getTime();
    }
  } catch (error) {
    console.error('❌ Error al verificar expiración del refresh token:', error);
  }
  return null;
};

// --- REFRESH TOKEN 
const refreshToken = async (): Promise<boolean> => {
  // Si ya hay una operación de refresh en curso, devolvemos esa promesa
  if (_refreshPromise) { 
    return _refreshPromise;
  }
  
  _refreshPromise = (async () => {
    try {
      const config = useRuntimeConfig();
      
      // No verificamos la existencia del refresh token ya que es HTTP Only
      // Simplemente intentamos la petición y manejamos la respuesta
      
      const response = await $fetch('/auth/refresh-token', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        retry: 0,
        timeout: 10000
      }) as any;

      // Si recibimos un nuevo token
      if (response?.token) {
        setToken(response.token);
        
        // Si también recibimos datos del usuario, actualizarlos
        if (response.user) {
          const userData: any = { ...response.user };
          
          // Normalizar ID de usuario
          if (!userData.id_usuario && userData.id) {
            userData.id_usuario = userData.id;
          }
          
          // Asegurar que el rol esté correctamente asignado
          if (!userData.role && userData.id_rol) {
            userData.role = roleMap[userData.id_rol] || 'usuario';
          }
          
          if (!userData.rol_nombre && userData.role) {
            userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
          }
          
          setUser(userData);
        }
        
        return true;
      }

      return false;
      
    } catch (error: any) {
      console.error('❌ Error al renovar el token:', error);
      
      // No hacer logout aquí, solo devolver false
      // El logout se manejará en el flujo principal si es necesario
      if (error.statusCode === 401) {
      } else {
      }
      
      return false;
    } finally {
      // Limpiar la promesa para permitir futuros intentos de refresh
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
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
    isInitialized: computed(() => isInitialized.value),
    
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
    initAuth,
    refreshToken,
    hasRole
  };

  // Inicializar el estado al cargar el store
  if (process.client) {
    initAuth();
  }
});
