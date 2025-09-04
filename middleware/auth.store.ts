import { defineStore } from 'pinia';
import { ref, computed, useCookie } from '#imports';

// Mapeo de IDs de rol a nombres de rol (en minúsculas)
const roleMap: Record<number, string> = {
  1: 'admin',
  2: 'tecnico',
  3: 'usuario',
  4: 'cliente'
};

let _refreshPromise: Promise<boolean> | null = null;

interface User {
  id_usuario: number;
  id_rol: number;
  id_ciudad: number;  // Añadido id_ciudad
  nombre: string;
  identidad: string;
  email: string;
  telefono: string;
  fecha_registro: string;
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
  const updatedUser: User = { 
    ...userData,
    // Asegurar que los campos requeridos tengan valores por defecto
    id_ciudad: userData.id_ciudad || 1, // Valor por defecto de 1 si no está definido
    role: userData.role || (userData.id_rol ? roleMap[userData.id_rol] : 'usuario')
  };
  
  // Guardar solo la información necesaria en la cookie
  const minimalUserData = {
    id_usuario: updatedUser.id_usuario,
    nombre: updatedUser.nombre,
    role: updatedUser.role,
    id_ciudad: updatedUser.id_ciudad
  };
  
  console.log('Guardando datos del usuario en la cookie:', minimalUserData);
  
  // Update user cookie with minimal data
  userCookie.value = JSON.stringify(minimalUserData);
  
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
      
      console.log('Iniciando proceso de login...');
      
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
      
      console.log('Respuesta del servidor:', response);
      
      if (response?.token) {
        setToken(response.token);
        
        if (response.user) {
          console.log('Datos del usuario recibidos del servidor:', response.user);
          
          // Asegurarse de que el usuario tenga los campos requeridos
          const userData = {
            ...response.user,
            // Asegurar que id_ciudad tenga un valor por defecto si no está presente
            id_ciudad: response.user.id_ciudad || 1,
            // Asegurar que el rol esté correctamente establecido
            role: response.user.role || (response.user.id_rol ? roleMap[response.user.id_rol] : 'usuario')
          };
          
          console.log('Datos del usuario después de procesar:', userData);
          
          // Guardar el usuario en el estado y en las cookies
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
const initAuth = async (): Promise<void> => {
  if (isInitialized.value) return;
  
  // 1. Restaurar usuario desde cookie si existe
  if (userCookie.value) {
    try {
      // Verificar si ya es un objeto
      const userData = typeof userCookie.value === 'string' 
        ? JSON.parse(userCookie.value) 
        : userCookie.value;
      
      // Asegurar que el rol tenga el formato correcto
      if (userData.role && !userData.rol_nombre) {
        userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Error al analizar la cookie de usuario:', error);
      userCookie.value = null;
    }
  }
  
  isInitialized.value = true;
};

// Interfaz para la respuesta de /auth/me
interface AuthMeResponse {
  id_usuario?: number;
  id?: number;
  id_rol?: number;
  role?: string;
  nombre?: string;
  identidad?: string;
  email?: string;
  telefono?: string;
  [key: string]: any; // Para propiedades adicionales
}

// --- CHECK AUTH 
const checkAuth = async (): Promise<boolean> => {
  // 1. Si no hay token, intentar con refresh token
  if (!token.value) {
    try {
      return await refreshToken();
    } catch (error) {
      console.error('Error al intentar autenticar con refresh token:', error);
      await logout();
      return false;
    }
  }
  
  // 2. Verificar si el token está a punto de expirar o si no hay datos de usuario
  try {
    // Primero verificar si tenemos datos de usuario
    const shouldRefreshDueToMissingUserData = !user.value || !user.value.id_usuario;
    
    // Luego verificar expiración del token
    let shouldRefreshDueToTokenExpiry = false;
    let tokenExpiresIn = Infinity;
    
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]));
      const exp = payload.exp * 1000; // Convertir a milisegundos
      const now = Date.now();
      tokenExpiresIn = exp - now;
      
      // Si el token expiró o está a punto de expirar (menos de 5 minutos)
      shouldRefreshDueToTokenExpiry = tokenExpiresIn < 5 * 60 * 1000;
      
      // Si el token ya expiró, forzar renovación
      if (tokenExpiresIn <= 0) {
        console.log('Token expirado, intentando renovar...');
        return await refreshToken();
      }
    } catch (e) {
      console.error('Error al verificar expiración del token:', e);
      shouldRefreshDueToTokenExpiry = true;
    }
    
    // Si falta información del usuario o el token está por expirar, intentar renovar
    if (shouldRefreshDueToMissingUserData || shouldRefreshDueToTokenExpiry) {
      console.log('Faltan datos de usuario o el token está por expirar, intentando renovar...');
      try {
        // Si el token está por expirar pronto, forzar renovación
        if (tokenExpiresIn < 5 * 60 * 1000) {
          return await refreshToken();
        }
        
        // Si faltan datos de usuario pero el token es válido, intentar obtener los datos
        if (shouldRefreshDueToMissingUserData) {
          console.log('Obteniendo datos del usuario...');
          const config = useRuntimeConfig();
          const response = await $fetch<AuthMeResponse>('/auth/me', {
            baseURL: config.public.apiBase,
            headers: { 'Authorization': `Bearer ${token.value}` },
            credentials: 'include',
            retry: 0,
            timeout: 5000
          });
          
          if (response && (response.id_usuario || response.id)) {
            // Actualizar datos del usuario sin renovar el token
            const userData: Partial<User> = { 
              ...response,
              id_usuario: response.id_usuario || response.id as number,
              role: response.role || (response.id_rol ? (roleMap[response.id_rol] || 'usuario') : 'usuario'),
              nombre: response.nombre || '',
              identidad: response.identidad || '',
              email: response.email || '',
              telefono: response.telefono || '',
              id_rol: response.id_rol || 1
            };
            
            if (userData.role && !userData.rol_nombre) {
              userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
            }
            
            setUser(userData as User);
            return true;
          }
        }
      } catch (error) {
        console.error('Error al renovar la sesión o obtener datos del usuario:', error);
        // Si falla, intentar renovar con refresh token
        return await refreshToken();
      }
    }
    
    // 3. Verificar el token con el servidor
    try {
      const config = useRuntimeConfig();
      const response = await $fetch<AuthMeResponse>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: { 'Authorization': `Bearer ${token.value}` },
        credentials: 'include',
        retry: 0,
        timeout: 5000
      });
      
      // Si la respuesta incluye datos de usuario, actualizarlos
      if (response && (response.id_usuario || response.id)) {
        const userData: Partial<User> = { 
          ...response,
          // Asegurar que id_usuario tenga valor
          id_usuario: response.id_usuario || response.id as number,
          // Asegurar que role tenga valor
          role: response.role || (response.id_rol ? (roleMap[response.id_rol] || 'usuario') : 'usuario'),
          // Incluir otros campos necesarios para el tipo User
          nombre: response.nombre || '',
          identidad: response.identidad || '',
          email: response.email || '',
          telefono: response.telefono || '',
          // Si falta id_rol, usar un valor por defecto (1 para usuario normal)
          id_rol: response.id_rol || 1
        };
        
        // Asegurar que el rol tenga el formato correcto
        if (userData.role && !userData.rol_nombre) {
          userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
        }
        
        setUser(userData as User);
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar el token con el servidor:', error);
      // Si falla la verificación, intentar con refresh token
      try {
        return await refreshToken();
      } catch (e) {
        console.error('Error al renovar el token después de fallo de verificación:', e);
        return false;
      }
    }
  } catch (error) {
    console.error('Error en checkAuth:', error);
    return false;
  }
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
      const response = await $fetch('/auth/refresh-token', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Debug': 'true' // Para identificar peticiones de depuración
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

      console.error('No se recibió un token válido en la respuesta');
      return false;
      
    } catch (error: any) {
      console.error('Error al renovar el token:', error); 
       
      if (error.statusCode === 401) { 
      } else {
        const errorMsg = error.data?.message || error.message || 'Error desconocido';
        console.error('Error al renovar el token:', errorMsg);
      }
      
      return false;
    } finally {
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
    
    // Acciones
    setUser,
    setToken,
    login,
    logout,
    initAuth,
    checkAuth,
    refreshToken,
    hasRole,
    
    // Getters
    userRole,
    userName,
    userId
  };

  // Inicializar el estado al cargar el store
  if (process.client) {
    initAuth();
  }
});
