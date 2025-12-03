<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <!-- Toast Notification -->
    <Toast 
      v-if="toast.show"
      :key="toast.message + Date.now()"
      :message="toast.message" 
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />
      
      <!-- Loading Spinner -->
      <LoadingSpinner 
        :loading="isLoading || isLoggingOut"
      />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
    <HeadersHeaderPerfil/>

    <!-- Main Content -->
    <div class="max-w-xl mx-auto px-3 sm:px-6 pb-4 sm:pb-6">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
        <div class="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl text-white mb-3 sm:mb-4 shadow-lg">
            {{ userInitials }}
          </div>
          <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{{ user.nombre }}</h2>
          <p class="text-emerald-600 dark:text-emerald-400 font-medium text-sm sm:text-base">{{ user.email }}</p>
        </div>

        <!-- User Stats -->
        <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6 pt-2 sm:pt-3">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-base">📅</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Registrado el</p>
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatShortDate(user.fecha_registro) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <span class="text-purple-600 dark:text-purple-400 text-sm sm:text-base">🏙️</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.ciudad || 'No especificada' }}</p>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Información Personal</h3>
        
        <div class="space-y-3 sm:space-y-4">
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Tu nombre completo"
            >
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="tu@email.com"
            >
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="+504 9999-9999"
            >
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
            <div class="relative">
              <multiselect
                v-model="user.ciudadSeleccionada"
                :options="ciudades"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Seleccionar ciudad"
                label="nombre"
                track-by="id_ciudad"
                class="multiselect-custom"
                :class="{ 'multiselect--active': user.ciudadSeleccionada }"
                :select-label="''"
                :deselect-label="''"
                :selected-label="''"
                :no-options="loadingCiudades ? 'Cargando ciudades...' : 'No hay ciudades disponibles'"
                :no-result="'No se encontraron resultados'"
                :loading="loadingCiudades"
                :disabled="loadingCiudades || !ciudades.length"
                :custom-label="getCityLabel"
                @search-change="$event && $event.stopPropagation()"
                @search-focus="(e) => e && e.target && e.target.blur()"
                @touchstart.native.stop
                @click.native.stop
                :options-limit="100"
              >
                <template #singleLabel="{ option }">
                  <span class="text-xs truncate">{{ getCityLabel(option) }}</span>
                </template>
              </multiselect>
            </div>
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <button 
              @click="isPasswordModalOpen = true"
              type="button"
              class="w-full text-left p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg sm:rounded-xl transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              <p class="text-xs sm:text-sm font-medium">Cambiar Contraseña</p>
            </button>
          </div>
          
          <!-- Modal de Cambio de Contraseña -->
          <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md relative">
              <button 
                @click="isPasswordModalOpen = false"
                type="button"
                class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Cerrar modal"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Cambiar Contraseña</h3>
              
              <form @submit.prevent="updatePassword" class="space-y-3 sm:space-y-4">
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
                <div class="space-y-1.5 sm:space-y-2">
                  <label for="currentPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label>
                  <input 
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password" 
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu contraseña actual"
                    autocomplete="current-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1.5 sm:space-y-2">
                  <label for="newPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                  <input 
                    id="newPassword"
                    v-model="newPassword"
                    type="password" 
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1.5 sm:space-y-2">
                  <label for="confirmPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password" 
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Confirma tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                  >
                  <p v-if="passwordMismatch" class="text-xs sm:text-sm text-red-600 dark:text-red-400">Las contraseñas no coinciden</p>
                </div>
                
                <button 
                  type="submit"
                  :disabled="isUpdatingPassword || passwordMismatch"
                  class="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <span v-if="isUpdatingPassword">Actualizando...</span>
                  <span v-else>Actualizar Contraseña</span>
                </button>
              </form>
            </div>
          </div>
          
          <div class="flex flex-col space-y-2 sm:space-y-3 pt-2">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-indigo-400 text-sm sm:text-base"
            >
              <span v-if="isSaving">Guardando...</span>
              <span v-else>Actualizar Perfil</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Legal & About -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Legal y más</h3>
        
        <div class="space-y-2 sm:space-y-3">
          <button class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Términos y condiciones</p>
          </button>
          <button class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Política de privacidad</p>
          </button>
          <button class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Acerca de HogarSeguro</p>
          </button>
          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center justify-between"
            :class="{'opacity-70 cursor-not-allowed': isLoggingOut}"
          >
            <span class="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Cerrar sesión</span>
            <LoadingSpinner v-if="isLoggingOut" class="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div> 
    <FootersFooterTecnico />
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect'

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const router = useRouter()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Perfil',
  meta: [
    { name: 'description', content: 'Perfil de usuario de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'keywords', content: 'Perfil, usuario, servicios, membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isLoggingOut = ref(false)
const isSaving = ref(false)
const isUpdatingPassword = ref(false)
const isPasswordModalOpen = ref(false)

// Campos de contraseña
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Datos
const ciudades = ref([])
const loadingCiudades = ref(false)
const originalUserData = ref(null)

// Datos del usuario con valores por defecto seguros
const user = ref({
  id_usuario: null,
  nombre: '',
  email: '',
  telefono: '',
  id_ciudad: null,
  ciudad: '',
  ciudadSeleccionada: null,
  fecha_registro: new Date().toISOString(),
  id_rol: null,
  role: 'usuario',
  rol_nombre: 'Usuario',
})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// ===== COMPUTED PROPERTIES =====
const userInitials = computed(() => {
  if (!user.value?.nombre) return '?'
  try {
    return user.value.nombre
      .split(' ')
      .filter(Boolean)
      .map(n => n[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2)
  } catch (error) {
    console.error('Error al generar las iniciales:', error)
    return '?'
  }
})

const hasChanges = computed(() => {
  if (!originalUserData.value) return false;
  
  return (
    user.value.nombre !== originalUserData.value.nombre ||
    user.value.email !== originalUserData.value.email ||
    user.value.telefono !== originalUserData.value.telefono ||
    user.value.id_ciudad !== originalUserData.value.id_ciudad
  );
})

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value;
})

// ===== FUNCIONES DE UTILIDAD =====
const formatShortDate = (dateString) => {
  if (!dateString) return '--/--/----'
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const showToast = (options) => {
  toast.value.show = false;
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    };
  });
}

const showSuccess = (title, message) => { 
  const toastMessage = message ? `${title} \n${message}` : title;
  
  showToast({
    message: toastMessage,
    type: 'success',
    duration: 5000
  });  
}

const showError = (title, message) => {
  const errorMessage = message || title;
  console.error('Error:', errorMessage);
  
  showToast({
    message: errorMessage,
    type: 'error',
    duration: 8000
  });
}

// ===== FUNCIONES DE CARGA DE DATOS =====
const cargarCiudades = async () => {
  try {
    loadingCiudades.value = true
    const data = await $api('/ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
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
  } finally {
    loadingCiudades.value = false
  }
}

// Función para obtener la etiqueta de la ciudad
const getCityLabel = (option) => {
  if (!option) return ''
  return option.nombre || ''
}

const fetchUserData = async () => {
  try {
    if (!userCookie.value?.id_usuario) {
      console.error('No se pudo obtener el ID del usuario')
      return false
    }
    
    const data = await $api(`/usuarios/id/${userCookie.value.id_usuario}`, {
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
    
    const safeUserData = {
      ...data,
      nombre: data.nombre || 'Invitado',
      id_usuario: data.id_usuario || userId,
      id_rol: data.id_rol || null,
      id_ciudad: data.id_ciudad || data.ciudad?.id_ciudad || null,
      ciudad: data.ciudad?.nombre_ciudad || data.ciudad || '',
      rol_nombre: data.rol?.nombre_rol || data.rol_nombre || 'Usuario',
      role: data.role || 'usuario'
    }
    
    user.value = {
      ...user.value,
      ...safeUserData,
      fecha_registro: safeUserData.fecha_registro || new Date().toISOString(),
      rol_nombre: safeUserData.rol_nombre || 'Usuario'
    }
    
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

const cargarDatosPerfil = async () => {
  try {
    await Promise.all([
      cargarCiudades(),
      fetchUserData()
    ])
    
    return true
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
    showError('Error', 'No se pudo cargar la información del perfil')
    return false
  } finally {
    isLoading.value = false
  }
}

// ===== FUNCIONES DE ACCIONES =====
const saveProfile = async () => {
  try {
    const userData = {
      nombre: user.value.nombre,
      email: user.value.email,
      telefono: user.value.telefono,
      id_ciudad: user.value.id_ciudad
    }; 
    
    const response = await $api(`/usuarios/${userCookie.value.id_usuario}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      body: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    originalUserData.value = { ...user.value };
    
    userCookie.value = {
      ...userCookie.value,
      nombre: user.value.nombre, 
      id_ciudad: user.value.id_ciudad
    } 
    
    showToast({
      type: 'success',
      message: '¡Perfil actualizado correctamente!',
      duration: 1500
    });
    
  } catch (error) {
    console.error('❌ Error en saveProfile:', error)
    
    const responseData = error.data || {};
    let errorMessage = 'Error al guardar el perfil';
    
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error === 'Error de validación' && responseData.field) {
      errorMessage = responseData.message || `Error en el campo ${responseData.field}`;
    } else if (error.statusCode === 500) {
      errorMessage = 'Error interno del servidor. Por favor, intente nuevamente.';
    }
    
    console.error('❌ Error al guardar el perfil:', errorMessage);
    
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
    showToast({
      type: 'error',
      message: 'Las contraseñas no coinciden',
      duration: 3000
    });
    return;
  }
  
  if (!currentPassword.value || !newPassword.value) {
    showToast({
      type: 'error',
      message: 'Por favor completa todos los campos',
      duration: 3000
    });
    return;
  }
  
  try {
    const response = await $api(`/usuarios/cambio-clave/${userCookie.value.id_usuario}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    }); 
    
    isPasswordModalOpen.value = false;
    
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    
    showToast({
      type: 'success',
      message: '¡Contraseña actualizada correctamente!',
      duration: 3000
    });
    
  } catch (error) {
    let errorMessage = 'Error al actualizar la contraseña. Verifica tu contraseña actual.';
    
    if (error.statusCode === 400) {
      if (error.data?.error === 'Contraseña actual incorrecta') {
        errorMessage = 'La contraseña actual es incorrecta. Por favor, inténtalo de nuevo.';
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
    } else if (error.statusCode === 404) {
      errorMessage = 'Usuario no encontrado. Por favor, recarga la página e intenta de nuevo.';
    } else if (!navigator.onLine) {
      errorMessage = 'No hay conexión a internet. Por favor, verifica tu conexión.';
    }
    
    showToast({
      type: 'error',
      message: errorMessage,
      duration: 5000
    });
    
    currentPassword.value = '';
  }
}

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.logout();
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

// ===== WATCHERS =====
// Watch para sincronizar id_ciudad con ciudadSeleccionada
watch(() => user.value.id_ciudad, (newId) => {
  if (newId && ciudades.value.length > 0) {
    const ciudadSeleccionada = ciudades.value.find(c => c.id_ciudad === newId);
    if (ciudadSeleccionada) {
      user.value.ciudadSeleccionada = ciudadSeleccionada;
      user.value.ciudad = ciudadSeleccionada.nombre;
    }
  } else {
    user.value.ciudadSeleccionada = null;
    user.value.ciudad = null;
  }
});

// Watch para sincronizar ciudadSeleccionada con id_ciudad
watch(() => user.value.ciudadSeleccionada, (newCiudad) => {
  if (newCiudad) {
    user.value.id_ciudad = newCiudad.id_ciudad;
    user.value.ciudad = newCiudad.nombre;
  } else {
    user.value.id_ciudad = null;
    user.value.ciudad = null;
  }
});

// ===== INICIALIZACIÓN =====
const checkAuthAndLoad = async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) { 
      window.location.reload()
      return
    }
    
    await cargarDatosPerfil()
    
    if (user.value) {
      originalUserData.value = { ...user.value }
    }
  } catch (error) { 
    window.location.reload() 
  }
}

onMounted(() => {
  checkAuthAndLoad()
})

</script>

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pulse-icon {
  animation: pulse 2s infinite;
  display: inline-block;
}

/* Animaciones del Modal */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.25s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animaciones del Backdrop */
.backdrop-enter-active {
  transition: all 0.3s ease-out;
}

.backdrop-leave-active {
  transition: all 0.25s ease-in;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Animaciones del Contenido del Modal */
.modal-content-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Animaciones del Slide Down */
.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-down-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  max-height: 0;
}

/* Mejoras visuales adicionales */
.border-3 {
  border-width: 3px;
}

/* Efecto de glassmorphism sutil */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animación de hover mejorada para botones */
button:hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sombra mejorada para el modal */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Dark mode adjustments */
.dark .shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Estilos personalizados para Multiselect - Exact match to index.vue */
.multiselect-custom {
  min-width: 140px !important;
  font-size: 0.75rem !important;
}

.multiselect-custom .multiselect__tags {
  min-height: 36px !important;
  background-color: rgb(249 250 251) !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  padding: 6px 30px 6px 10px !important;
  transition: all 0.2s ease !important;
}

.dark .multiselect-custom .multiselect__tags {
  background-color: rgb(55 65 81) !important;
  border-color: rgb(75 85 99) !important;
}

.multiselect-custom .multiselect__tags:focus-within {
  border-color: rgb(16 185 129) !important;
  box-shadow: 0 0 0 2px rgb(16 185 129) !important;
}

.dark .multiselect-custom .multiselect__tags:focus-within {
  border-color: rgb(16 185 129) !important;
  box-shadow: 0 0 0 2px rgb(16 185 129) !important;
}

.multiselect-custom .multiselect__single {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__single {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__input {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.75rem !important;
  min-height: 20px !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__input {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__input::placeholder {
  color: rgb(156 163 175) !important;
}

.multiselect-custom .multiselect__placeholder {
  margin: 0 !important;
  padding: 0 !important;
  color: rgb(156 163 175) !important;
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
  margin-top: 1px !important;
}

.multiselect-custom .multiselect__select {
  height: 100% !important;
  width: 1.5rem !important;
  right: 0 !important;
  top: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  padding: 0 !important;
}

.multiselect-custom .multiselect__select:before {
  border-color: rgb(156 163 175) transparent transparent !important;
  border-style: solid !important;
  border-width: 5px 5px 0 !important;
  margin-top: 0 !important;
  top: 55% !important;
}

.dark .multiselect-custom .multiselect__select:before {
  border-color: rgb(156 163 175) transparent transparent !important;
}

.multiselect-custom .multiselect__content-wrapper {
  background-color: white !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  margin-top: 0.25rem !important;
  z-index: 50 !important;
  min-width: 100% !important;
  width: auto !important;
}

.dark .multiselect-custom .multiselect__content-wrapper {
  background-color: rgb(31 41 55) !important;
  border-color: rgb(55 65 81) !important;
}

.multiselect-custom .multiselect__option {
  font-size: 0.75rem !important;
  color: rgb(17 24 39) !important;
  padding: 8px 12px !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__option {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--highlight {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--selected {
    background-color: #4b5563;
    color: #f9fafb;
}

.dark .multiselect-custom .multiselect__option--selected {
    background-color: #4b5563;
    color: #f9fafb;
}

.multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
    background-color: #4b5563;
    color: #f9fafb;
}

.dark .multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
    background-color: #4b5563;
    color: #f9fafb;
}
</style>