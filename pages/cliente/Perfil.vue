<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <!-- Toast Notification -->
      <Toast
        v-if="toast.show"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="toast.show = false"
      />
      
      <!-- Loading Spinner -->
      <LoadingSpinner 
        :loading="isLoading || isLoggingOut" 
        :message="isLoggingOut ? 'Cerrando sesión...' : 'Cargando Perfil...'"
      />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
    <HeadersHeaderPerfil/>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-6 pb-6">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-6">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-4xl text-white mb-4 shadow-lg">
            {{ userInitials }}
          </div>
          <h2 class="text-xl font-black text-gray-900 dark:text-white">{{ user.nombre }}</h2>
          <p class="text-emerald-600 dark:text-emerald-400 font-medium">{{ user.email }}</p>
        </div>

        <!-- Membership Status -->
        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400">🏆</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Membresía activa hasta</p>
                  <p class="text-sm font-bold text-blue-900 dark:text-white">{{ membershipEndDate }}</p>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-3">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" :style="`width: ${membershipProgress}%`"></div>
              </div>
            </div>
            <button 
              @click="renovarMembresia"
              class="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Renovar Ahora
            </button>
          </div>
        </div>

        <!-- User Stats -->
        <div class="grid grid-cols-2 gap-3 mb-6 pt-3">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span class="text-blue-600 dark:text-blue-400">📅</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Registrado el</p>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatShortDate(user.fecha_registro) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span class="text-purple-600 dark:text-purple-400">🏙️</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.ciudad || 'No especificada' }}</p>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Información Personal</h3>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Tu nombre completo"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="tu@email.com"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="+504 9999-9999"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
            <div class="relative">
              <select
                v-model="user.id_ciudad"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white appearance-none pr-10"
              >
                <option :value="null" disabled>Selecciona una ciudad</option>
                <option v-for="ciudad in ciudades" :key="ciudad.id_ciudad" :value="ciudad.id_ciudad">
                  {{ ciudad.nombre }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <button 
              @click="isPasswordModalOpen = true"
              type="button"
              class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              <p class="text-sm font-medium">Cambiar Contraseña</p>
            </button>
          </div>
          
          <!-- Modal de Cambio de Contraseña -->
          <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
              <button 
                @click="isPasswordModalOpen = false"
                type="button"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Cerrar modal"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Cambiar Contraseña</h3>
              
              <form @submit.prevent="updatePassword" class="space-y-4">
              <!-- Campo de usuario oculto para accesibilidad -->
              <div class="sr-only">
                <label for="username">Nombre de usuario</label>
                <input 
                  id="username"
                  type="text" 
                  :value="user.email"
                  name="username"
                  autocomplete="username"
                  class="hidden"
                  aria-hidden="true"
                >
              </div>
                <div class="space-y-2">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label>
                  <input 
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password" 
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu contraseña actual"
                    autocomplete="current-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-2">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                  <input 
                    id="newPassword"
                    v-model="newPassword"
                    type="password" 
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-2">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password" 
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Confirma tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                  >
                  <p v-if="passwordMismatch" class="text-sm text-red-600 dark:text-red-400">Las contraseñas no coinciden</p>
                </div>
                
                <button 
                  type="submit"
                  :disabled="isUpdatingPassword || passwordMismatch"
                  class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isUpdatingPassword">Actualizando...</span>
                  <span v-else>Actualizar Contraseña</span>
                </button>
              </form>
            </div>
          </div>
          
          <div class="flex flex-col space-y-3 pt-2">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-indigo-400"
            >
              <span v-if="isSaving">Guardando...</span>
              <span v-else>Actualizar Perfil</span>
            </button>
            
            <button 
              v-if="newPassword || currentPassword || confirmPassword"
              @click="updatePassword"
              class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      <!-- Legal & About -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Legal y más</h3>
        
        <div class="space-y-3">
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Términos y condiciones</p>
          </button>
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Política de privacidad</p>
          </button>
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Acerca de HogarSeguro</p>
          </button>
          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200 flex items-center justify-between"
            :class="{'opacity-70 cursor-not-allowed': isLoggingOut}"
          >
            <span class="text-sm font-medium text-red-600 dark:text-red-400">Cerrar sesión</span>
            <LoadingSpinner v-if="isLoggingOut" class="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div> 
    <FootersFooter />  
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
const config = useRuntimeConfig()

// SEO and Meta
useHead({
  title: 'HogarSeguro - Perfil',
  meta: [
    { name: 'description', content: 'Perfil de usuario de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Autenticación
const auth = useAuthStore()
const router = useRouter()

// Estados de carga
const isLoading = ref(true)
const isLoggingOut = ref(false)

// Estados del formulario de contraseña
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isPasswordModalOpen = ref(false)
const isUpdatingPassword = ref(false)
// Referencia reactiva para almacenar las ciudades
const ciudades = ref([])

// Cargar ciudades desde la API
const cargarCiudades = async () => {
  try {
    const data = await $fetch('/ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })
    
    if (Array.isArray(data)) {
      ciudades.value = data.map(ciudad => ({
        id_ciudad: ciudad.id_ciudad,
        nombre: ciudad.nombre_ciudad
      }))
    }
  } catch (error) {
    console.error('Error al cargar las ciudades:', error)
    showError('Error', 'No se pudieron cargar las ciudades')
  }
}

// Datos originales del usuario para comparar cambios
const originalUserData = ref(null);

// Estado para controlar la carga
const isSaving = ref(false);

// Datos del usuario con valores por defecto seguros
const user = ref({
  id_usuario: null,
  nombre: '',
  email: '',
  telefono: '',
  id_ciudad: null,
  ciudad: '',
  fecha_registro: new Date().toISOString(),
  id_rol: null,
  role: 'usuario',
  rol_nombre: 'Usuario',
  membership: {
    status: 'inactiva',
    endDate: new Date().toISOString()
  }
})

const userData = computed(() => auth.user || {})
const userCookie = useCookie('user')

// Obtener datos del usuario desde la API
const fetchUserData = async () => {
  try {
    const userId = auth.user?.id_usuario
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario')
      return false
    }
     
    
    const data = await $fetch(`/usuarios/id/${userId}`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!data) {
      throw new Error('No se recibieron datos del usuario')
    }
    
    // Crear un objeto seguro para actualizar el store
    const safeUserData = {
      ...data,
      nombre: data.nombre || 'Invitado',
      id_usuario: data.id_usuario || userId,
      id_rol: data.id_rol || null,
      id_ciudad: data.id_ciudad || data.ciudad?.id_ciudad || null,
      ciudad: data.ciudad?.nombre_ciudad || data.ciudad || '',
      rol_nombre: data.rol?.nombre_rol || data.rol_nombre || 'Usuario',
      membership: data.membership || {
        status: 'inactiva',
        endDate: new Date().toISOString()
      },
      role: data.role || 'usuario'
    }
    
    
    
    // Actualizar el estado local del usuario
    user.value = {
      ...user.value,
      ...safeUserData,
      fecha_registro: safeUserData.fecha_registro || new Date().toISOString(),
      rol_nombre: safeUserData.rol_nombre || 'Usuario'
    }
    
    
    
    // Actualizar el store de autenticación
    if (auth) {
      await auth.setUser(safeUserData)
    }
    
    return true
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error)
    showError('Error', 'No se pudieron cargar los datos del perfil')
  } finally {
    isLoading.value = false
  }
}

// Cargar datos del perfil
const cargarDatosPerfil = async () => {
  try {
    // Verificar autenticación
    if (!auth.isAuthenticated) {
      const isAuthInitialized = await auth.initAuth()
      if (!isAuthInitialized) {
        await router.push('/acceso')
        return false
      }
    }

    // Verificar que el usuario esté autenticado
    if (!auth.user?.id_usuario) {
      console.error('No se pudo obtener el ID del usuario autenticado')
      return false
    }

    // Cargar ciudades y datos del usuario en paralelo
    await Promise.all([
      cargarCiudades(),
      fetchUserData()
    ])
    
    console.log('Datos del perfil cargados correctamente')
    return true
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
    showError('Error', 'No se pudo cargar la información del perfil')
    return false
  } finally {
    isLoading.value = false
  }
}

// Verificar si hay cambios en los campos del perfil
const hasChanges = computed(() => {
  if (!originalUserData.value) return false;
  
  return (
    user.value.nombre !== originalUserData.value.nombre ||
    user.value.email !== originalUserData.value.email ||
    user.value.telefono !== originalUserData.value.telefono ||
    user.value.id_ciudad !== originalUserData.value.id_ciudad
  );
});

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarDatosPerfil();
  // Guardar una copia de los datos originales
  if (user.value) {
    originalUserData.value = { ...user.value };
  }
})



// Función para manejar el cierre de sesión
const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.logout();
    // La redirección se manejará en el watch de auth.user
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    toast.value = {
      show: true,
      message: 'Error al cerrar sesión. Por favor, inténtalo de nuevo.',
      type: 'error',
      duration: 3000
    };
  } finally {
    isLoggingOut.value = false;
  }
}

// Computed property para verificar si las contraseñas coinciden
const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value;
});

// List of major cities in Honduras
const hondurasCities = [
  'Tegucigalpa',
  'San Pedro Sula',
  'Choloma',
  'La Ceiba',
  'El Progreso',
  'Choluteca',
  'Comayagua',
  'Puerto Cortés',
  'La Lima',
  'Danlí',
  'Siguatepeque',
  'Juticalpa',
  'Tocoa',
  'Villanueva',
  'Tela',
  'Santa Rosa de Copán',
  'Olanchito',
  'San Lorenzo',
  'Cofradía',
  'La Paz'
] 

// Get user role name
const userRole = computed(() => {
  if (!userData.value.role) return 'Invitado'
  
  const roles = {
    'admin': 'Administrador',
    'cliente': 'Cliente',
    'tecnico': 'Técnico',
    'usuario': 'Usuario'
  }
  
  return roles[userData.value.role.toLowerCase()] || 'Usuario'
})

// Computed properties
const userInitials = computed(() => {
  if (!user.value?.nombre) return '?'
  try {
    return user.value.nombre
      .split(' ')
      .filter(Boolean) // Eliminar cadenas vacías
      .map(n => n[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2)
  } catch (error) {
    console.error('Error al generar las iniciales:', error)
    return '?'
  }
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

// Format date to short version (DD/MM/YYYY)
const formatShortDate = (dateString) => {
  if (!dateString) return '--/--/----'
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

// Save profile function
// Estado para controlar la notificación
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
});

const showToast = (options) => {
  toast.value = {
    show: true,
    message: options.message,
    type: options.type || 'info',
    duration: options.duration || 5000
  };
};

const saveProfile = async () => {
  try {
    const config = useRuntimeConfig();
    
    // Datos que se enviarán al backend
    const userData = {
      nombre: user.value.nombre,
      email: user.value.email,
      telefono: user.value.telefono,
      id_ciudad: user.value.id_ciudad
    };
    
    console.log('Enviando datos al backend:', JSON.stringify(userData, null, 2));
    
    const response = await $fetch(`/usuarios/${user.value.id_usuario}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      body: userData
    });
    
    // Actualizar los datos originales con los nuevos valores
    originalUserData.value = { ...user.value };
    
    // Mostrar notificación de éxito
    showToast({
      type: 'success',
      message: '¡Perfil actualizado correctamente!',
      duration: 3000
    });
    
  } catch (error) {
    // Obtener el mensaje de error del servidor
    const responseData = error.data || {};
    let errorMessage = 'Error al guardar el perfil';
    
    // Determinar el mensaje de error a mostrar
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error === 'Error de validación' && responseData.field) {
      errorMessage = responseData.message || `Error en el campo ${responseData.field}`;
    }
    
    // Mostrar el mismo mensaje en consola
    console.error('Error al guardar el perfil:', errorMessage);
    
    // Mostrar el mensaje de error en el toast
    showToast({
      type: 'error',
      message: errorMessage,
      duration: 5000
    });
  } finally {
    isSaving.value = false;
  }
}

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showError('Error', 'Las contraseñas no coinciden')
    return
  }
  
  try {
    // In a real app, you would make an API call to update the password
    // Example:
    // await api.put(`/usuarios/${user.value.id_usuario}/password`, {
    //   currentPassword: currentPassword.value,
    //   newPassword: newPassword.value
    // })
    
    // Clear password fields after successful update
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    
    showSuccess('¡Contraseña actualizada!', 'Tu contraseña ha sido cambiada exitosamente.')
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error)
    showError('Error', 'No se pudo actualizar la contraseña. Verifica tu contraseña actual e inténtalo de nuevo.')
  }
}

// Helper functions for notifications
const showSuccess = (title, message) => {
  // In a real app, use a toast notification library
  alert(`${title}: ${message}`)
}

const showError = (title, message) => {
  // In a real app, use a toast notification library
  alert(`❌ ${title}: ${message}`)
}

// Membership functions
const renovarMembresia = () => {
  // In a real app, this would open a payment modal or redirect to payment page
  alert('Redirigiendo al proceso de renovación de membresía...')
}
const membershipEndDate = computed(() => {
  if (!user.value?.membership?.endDate) return 'No disponible'
  
  try {
    return new Date(user.value.membership.endDate).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch (error) {
    console.error('Error al formatear la fecha de membresía:', error)
    return 'Fecha inválida'
  }
})

const membershipProgress = computed(() => user.value.membership.progress)

// Dark mode toggle
const darkMode = ref(false)

// Watch for dark mode changes
watch(darkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // Save preference to localStorage
  localStorage.setItem('darkMode', newVal)
})
 
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>