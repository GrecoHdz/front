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
      console.log('Iniciando login con:', credentials);
      
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
          // Asegurarse de que el usuario tenga el campo role
          const userData = response.user;
          if (!userData.role && userData.id_rol) {
            userData.role = roleMap[userData.id_rol] || 'usuario';
          }
          
          // Asegurarse de que el rol_nombre esté definido
          if (!userData.rol_nombre && userData.role) {
            userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
          }
          
          console.log('Usuario autenticado:', userData);
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

  console.log('🔐 Inicializando autenticación...');

  // Restaurar user desde cookie si existe
  if (userCookie.value) {
    try {
      const userData = JSON.parse(userCookie.value);
      setUser(userData);
      console.log('👤 Usuario restaurado desde la cookie');
    } catch (e) {
      console.error('❌ Error al parsear usuario de la cookie:', e);
      userCookie.value = null;
      isInitialized.value = true;
      return false;
    }
  }

  // Si hay token, verificar si es válido
  if (token.value) {
    console.log('🔑 Token de acceso encontrado, verificando validez...');
    const isValid = await checkAuth();
    if (isValid) {
      isInitialized.value = true;
      console.log('✅ Token válido, usuario autenticado');
      return true;
    }
  }

  // Si no hay token o es inválido, intentar con refresh token
  console.log('🔄 No hay token de acceso o es inválido, intentando con refresh token...');
  try {
    const refreshSuccess = await refreshToken();
    if (refreshSuccess) {
      isInitialized.value = true;
      console.log('✅ Sesión restaurada exitosamente usando refresh token');
      return true;
    }
  } catch (error) {
    console.error('❌ Error al intentar renovar con refresh token:', error);
  }

  const tokenMsg = '🔑 Token encontrado, verificando validez...';
  console.log(tokenMsg);
  alert(tokenMsg);
  
  try {
    // 1. Primero intentamos validar el token actual
    const tokenValid = await checkAuth();
    
    if (tokenValid && user.value) {
      isInitialized.value = true;
      const successMsg = '✅ Sesión válida restaurada (token)';
      console.log(successMsg);
      alert(successMsg);
      return true;
    }

    // 2. Si el token no es válido, intentamos refrescarlo
    const refreshMsg = '🔄 Token no válido, intentando refrescar...';
    console.log(refreshMsg);
    alert(refreshMsg);
    
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      isInitialized.value = true;
      const refreshSuccessMsg = '✅ Sesión restaurada mediante refresh token';
      console.log(refreshSuccessMsg);
      alert(refreshSuccessMsg);
      return true;
    }

    // 3. Si no se pudo refrescar, limpiamos la sesión
    const errorMsg = '⚠️ No se pudo restaurar la sesión';
    console.log(errorMsg);
    alert(errorMsg);
    
    await logout();
    return false;
    
  } catch (error) {
    const errorMsg = '❌ Error en initAuth: ' + (error instanceof Error ? error.message : String(error));
    console.error(errorMsg);
    alert(errorMsg);
    
    await logout();
    return false;
  }

  // Intentar renovar con refresh token
  console.log('🔄 Intentando renovar con refresh token...');
  const refreshed = await refreshToken();
  if (refreshed && user.value) {
    isInitialized.value = true;
    console.log('✅ Sesión renovada exitosamente (refresh)');
    return true;
  }

  // Si llegamos aquí, ninguno funcionó -> cerrar sesión una sola vez
  console.warn('⚠️ No se pudo restaurar la sesión. Ejecutando logout una sola vez.');
  await logout();
  isInitialized.value = true;
  return false;
};

// --- CHECK AUTH 
const checkAuth = async (): Promise<boolean> => {
  const checkAuthMsg = '🔍 Verificando autenticación (checkAuth) ...';
  console.log(checkAuthMsg);
  alert(checkAuthMsg);

  if (!token.value) {
    const noTokenMsg = '🔑 No hay token para verificar';
    console.log(noTokenMsg);
    alert(noTokenMsg);
    return false;
  }

  // Validación local de expiración
  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]));
    const exp = payload.exp * 1000;
    const now = Date.now();
    const expiresIn = exp - now;
    
    const tokenInfo = `Token expira en: ${Math.round(expiresIn / 1000)} segundos`;
    console.log(tokenInfo);
    alert(tokenInfo);

    // Si ya expiró o está a punto de expirar (en menos de 1 minuto)
    if (now >= exp - 60000) {
      const refreshMsg = '⏳ Token expirado o próximo a expirar, intentando refresh...';
      console.log(refreshMsg);
      alert(refreshMsg);
      return await refreshToken();
    }
  } catch (e) {
    const errorMsg = '❌ Error al parsear token en checkAuth: ' + (e instanceof Error ? e.message : String(e));
    console.error(errorMsg);
    alert(errorMsg);
    return false;
  }

  // Confirmar token con backend
  try {
    const config = useRuntimeConfig();
    const validatingMsg = '🔐 Validando token con el backend...';
    console.log(validatingMsg);
    alert(validatingMsg);
    
    const response = await $fetch('/auth/me', {
      baseURL: config.public.apiBase,
      headers: { 'Authorization': `Bearer ${token.value}` },
      retry: 0,
      timeout: 10000, // 10 segundos de timeout
      credentials: 'include' // Importante para manejar cookies
    }) as any;

    console.log('🔍 Respuesta de /auth/me:', response);

    if (response && (response.id_usuario || response.id)) {
      // Si el backend devolvió un refresh token, actualizarlo
      if (response.refreshToken) {
        console.log('🔄 Se recibió un nuevo refresh token del servidor');
        // Actualizar la cookie del refresh token
        const refreshTokenCookie = useCookie('refreshToken', {
          maxAge: 60 * 60 * 24 * 7, // 7 días
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        refreshTokenCookie.value = response.refreshToken;
      }

      // Normalizar id_usuario si backend devuelve id
      const userData = { ...response };
      if (!userData.id_usuario && userData.id) {
        userData.id_usuario = userData.id;
      }

      // Asegurarse de que el rol esté correctamente asignado
      if (!userData.role && userData.id_rol) {
        userData.role = roleMap[userData.id_rol] || 'usuario';
      }
      if (!userData.rol_nombre && userData.role) {
        userData.rol_nombre = userData.role.charAt(0).toUpperCase() + userData.role.slice(1);
      }

      // Actualizar el estado del usuario
      setUser(userData);
      
      const successMsg = `✅ Usuario autenticado correctamente (${userData.nombre || userData.identidad})`;
      console.log(successMsg);
      alert(successMsg);
      return true;
    }

    const invalidUserMsg = '⚠️ /auth/me no devolvió un usuario válido';
    console.warn(invalidUserMsg);
    alert(invalidUserMsg);
    return false;
    
  } catch (error: any) {
    const status = error?.status || error?.statusCode;
    const errorMsg = `❌ Error al verificar token en backend (${status}): ${error?.message || error}`;
    console.error(errorMsg);
    alert(errorMsg);
    
    // Si el error es 401 (Unauthorized) intentamos refrescar el token
    if (status === 401) {
      const refreshMsg = '🔄 Token inválido o expirado, intentando refresh...';
      console.log(refreshMsg);
      alert(refreshMsg);
      return await refreshToken();
    }
    
    // Para otros errores (como problemas de red), asumimos que el token podría ser válido
    // pero no podemos verificar en este momento. Mejor asumir que no está autenticado.
    const networkErrorMsg = '⚠️ No se pudo verificar el token con el backend, asumiendo no autenticado';
    console.warn(networkErrorMsg);
    alert(networkErrorMsg);
    return false;
  }
};

// --- REFRESH TOKEN 
const refreshToken = async (): Promise<boolean> => {
  // Si ya hay una operación de refresh en curso, devolvemos esa promesa
  if (_refreshPromise) {
    const msg = '⏳ Operación de refresh ya en curso, esperando resultado...';
    console.log(msg);
    return _refreshPromise;
  }

  console.log('🔄 Intentando renovar token de acceso...');

  _refreshPromise = (async () => {
    try {
      const config = useRuntimeConfig();
      
      const response = await $fetch('/auth/refresh-token', {
        method: 'POST',
        baseURL: config.public.apiBase,
        credentials: 'include', // Importante para enviar cookies HTTP Only
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        // No reintentar automáticamente para evitar bucles
        retry: 0,
        // Timeout de 10 segundos
        timeout: 10000
      }) as any;

      console.log('🔁 Respuesta de renovación de token:', response);

      // Si recibimos un nuevo token
      if (response?.token) {
        setToken(response.token);
        console.log('✅ Token de acceso renovado exitosamente');
        
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
          console.log('👤 Datos de usuario actualizados');
        }
        
        return true;
      }

      console.error('❌ No se recibió un token válido en la respuesta');
      return false;
      
    } catch (error: any) {
      console.error('❌ Error al renovar el token:', error);
      
      // Si hay un error 401, el refresh token es inválido o ha expirado
      if (error.statusCode === 401) {
        console.log('⚠️ El refresh token es inválido o ha expirado');
        await logout();
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
