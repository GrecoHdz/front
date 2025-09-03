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
  const isLoggingOut = ref(false); // Bandera para controlar si se está cerrando sesión

  // Cookie para almacenar la información del usuario
  const userCookie = useCookie<User | null>('user', {
    maxAge: 60 * 60 * 24 * 7, // 7 días
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const setUser = (userData: User | null): User | null => {
    // Si se está eliminando el usuario, limpiar el estado y las cookies
    if (!userData) {
      user.value = null;
      tokenCookie.value = null;
      userCookie.value = null;
      return null;
    }

    // Asegurarse de que los campos requeridos estén presentes
    const updatedUser: User = { 
      ...userData,
      // Mapear id_rol a role si es necesario
      role: userData.role || (userData.id_rol ? roleMap[userData.id_rol] : 'usuario'),
    };
    
    // Actualizar el estado reactivo
    user.value = updatedUser;
    
    // Guardar en la cookie solo los datos esenciales
    const { id_usuario, nombre, role } = updatedUser;
    userCookie.value = { id_usuario, nombre, role } as User;
    
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
        credentials: 'include',
        body: {
          identidad: credentials.identidad,
          password: credentials.password
        }
      }) as { token: string; user: any; message?: string };
      
      console.log('Respuesta del login:', response);
      
      if (response?.token && response.user) {
        // Establecer el token y el usuario
        setToken(response.token);
        
        // setUser manejará la lógica de roles y guardado
        const userData = {
          ...response.user,
          id_usuario: response.user.id_usuario
        };
        
        console.log('Datos del usuario para guardar:', userData);
        setUser(userData);
        
        return { 
          success: true, 
          user: userData 
        };
      }
      
      return { 
        success: false, 
        error: response?.message || 'Error en la autenticación' 
      };
      
    } catch (error: any) {
      // No mostrar el error en consola para errores 400 (credenciales incorrectas)
      if (error.statusCode !== 400) {
        console.error('Error en login:', error);
      }
      
      // Mensaje más amigable para el usuario
      const errorMessage = error.statusCode === 400 
        ? 'Usuario o contraseña incorrectos'
        : 'Error al intentar iniciar sesión. Por favor, inténtalo de nuevo.';
        
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    // 1. Marcar que estamos cerrando sesión
    isLoggingOut.value = true;
    
    // 2. Guardar el token actual antes de limpiarlo
    const currentToken = token.value;
    
    // 3. Limpiar el estado local
    setToken(null);
    user.value = null;
    
    // 3. Limpiar cookies locales
    useCookie('user').value = null;
    
    try {
      // 4. Si teníamos un token, intentar notificar al backend
      if (currentToken) {
        const config = useRuntimeConfig();
        // Usar fetch directamente en lugar de $fetch para evitar interceptores
        await fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          }
        });
      }
    } catch (error) {
      console.warn('Advertencia durante cierre de sesión (puede ignorarse):', error);
    } finally {
      // 5. Redirigir al inicio
      navigateTo('/');
    }
  }
// --- INIT AUTH 
const initAuth = async (isPublicRoute: boolean = false): Promise<boolean> => {
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
  
  // 2. No intentar refrescar el token en rutas públicas
  if (isPublicRoute) {
    isInitialized.value = true;
    return isAuthenticated.value; // Retornar el estado actual sin intentar refresh
  }
  
  // 3. Solo intentar refresh token si hay un token
  if (token.value) {
    try {
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        isInitialized.value = true;
        return true;
      }
    } catch (error) {
      console.error('❌ Error al intentar autenticar con refresh token:', error);
    }
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

// Definir un tipo personalizado para el error
interface ApiError extends Error {
  statusCode?: number;
  response?: {
    status?: number;
    data?: any;
  };
  [key: string]: any;
}

// --- REFRESH TOKEN 
const refreshToken = async (): Promise<boolean> => {
  // Si ya hay una operación de refresh en curso, devolvemos esa promesa
  if (_refreshPromise) { 
    return _refreshPromise;
  }
  
  // Si se está cerrando sesión, no intentar renovar el token
  if (isLoggingOut.value) {
    return false;
  }
  
  _refreshPromise = (async () => {
    try {
      const config = useRuntimeConfig();
      
      // No verificamos la existencia del refresh token ya que es HTTP Only
      // Simplemente intentamos la petición y manejamos la respuesta
      
      // Usamos fetch directamente para tener más control sobre los errores
      const response = await fetch(`${config.public.apiBase}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // No mostrar errores en la consola para respuestas no exitosas
        // El catch manejará la respuesta
      }).then(async (res) => {
        // Solo procesamos la respuesta si es exitosa
        if (res.ok) {
          return await res.json();
        }
        // Para respuestas no exitosas, devolvemos null
        return null;
      }).catch(() => null); // En caso de error de red, devolvemos null

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
      
    } catch (error: unknown) {
      // Hacer type assertion al tipo ApiError
      const apiError = error as ApiError;
      
      // No mostrar error en consola para códigos 401 (No autorizado) ya que es el comportamiento esperado
      if (apiError.statusCode !== 401 && apiError.response?.status !== 401) {
        console.error('❌ Error al renovar el token:', apiError);
      }
      // Limpiar el estado en caso de error
      await logout();
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
