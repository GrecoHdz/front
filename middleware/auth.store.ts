import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
  const token = ref(process.client ? localStorage.getItem('token') : null);
  const isAuthenticated = computed(() => !!token.value);

  // Acciones
  const setUser = (userData: User | null) => {
    user.value = userData;
    // Si se está eliminando el usuario, limpiar también del localStorage
    if (!userData && process.client) {
      localStorage.removeItem('user');
    }
  };

  const setToken = (newToken: string | null) => {
    token.value = newToken;
    if (process.client) {
      if (newToken) {
        localStorage.setItem('token', newToken);
      } else {
        localStorage.removeItem('token');
      }
    }
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
          
          // Guardar el usuario en localStorage para persistencia
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
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
    if (process.client) {
      localStorage.removeItem('token');
    }
    navigateTo('/login');
  };

  const checkAuth = async () => {
    if (!token.value) {
      // Intentar cargar el usuario desde localStorage si hay token
      if (process.client) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            return true;
          } catch (e) {
            console.error('Error al parsear usuario guardado:', e);
            localStorage.removeItem('user');
          }
        }
      }
      return false;
    }
    
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
        
        // Actualizar el usuario en localStorage
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // Limpiar datos de autenticación inválidos
      setToken(null);
      setUser(null);
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
