<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
    <LoadingSpinner v-if="isLoading" :loading="isLoading" />

    <HeadersHeaderDashboard 
      @availability-change="handleAvailabilityChange"
    />

    <!-- Content Container -->
    <div class="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative pb-20 sm:pb-0">
      <div class="pb-24">
        <main class="pb-4">
          <!-- Welcome Section -->
          <section class="px-4 sm:px-6 py-4 sm:py-6">
            <div class="bg-dark dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <!-- Background decoration -->
              <div class="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl sm:blur-2xl"></div>
              <div class="absolute -bottom-6 -left-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-lg sm:blur-xl"></div>
              
              <div class="relative">
                <div class="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center">
                    <span class="text-white text-xl sm:text-2xl">👋</span>
                  </div>
                  <div class="min-w-0">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                      ¡Hola, {{ currentUser?.nombre || 'Técnico' }}!
                    </h2>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Bienvenido al panel</p>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-2 sm:p-3 rounded-xl">
                  <p class="text-blue-800 dark:text-blue-200 font-medium text-sm sm:text-base text-center">
                    🛠️ Gestiona tus servicios asignados
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Stats Cards -->
          <section class="px-3 sm:px-6 mb-6">
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <!-- Tarjeta de Servicios Activos -->
              <!-- Tarjeta de Servicios Activos -->
              <div class="bg-dark dark:bg-gray-800 rounded-xl p-2 sm:p-3 shadow border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span class="text-white text-sm sm:text-lg">📋</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 truncate">Servicios</p>
                    <p class="text-base sm:text-xl font-black text-gray-900 dark:text-white">{{ stats.activeServices }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Tarjeta de Calificación -->
              <div class="bg-dark dark:bg-gray-800 rounded-xl p-2 sm:p-3 shadow border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-2">
                  <div class="w-7 h-7 sm:w-9 sm:h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span class="text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">⭐</span>
                  </div>
                  <div class="min-w-0">
                  <p class="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 truncate">Calificación</p>
                    <p class="text-base sm:text-xl font-black text-gray-900 dark:text-white">{{ averageRating }}</p> 
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Servicios Recientes -->
          <section class="px-4 sm:px-6 mb-6">
            <div class="flex justify-between items-center mb-3 sm:mb-4">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Servicios Recientes</h3>
              <NuxtLink to="/tecnico/ServiciosTecnico" class="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors whitespace-nowrap ml-2">
                Ver todos
              </NuxtLink>
            </div>
            
            <div v-if="loading" class="py-8 flex justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
            
            <div v-else-if="services.length === 0" class="bg-dark dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-100 dark:border-gray-700">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Sin servicios</h4>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No hay servicios asignados</p>
            </div>
            
            <div class="space-y-2 sm:space-y-3">
              <div v-for="service in services.slice(0, 3)" :key="service.id" 
                   @click="$router.push('/tecnico/ServiciosTecnico')"
                   class="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start space-x-2 sm:space-x-3">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span class="text-blue-500 text-base sm:text-lg">🔧</span>
                      </div>
                      <div class="min-w-0">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ service.title }}</h4>
                        <div class="flex items-center flex-wrap gap-x-1.5 text-gray-500 dark:text-gray-400 mt-0.5">
                          <span class="text-xs truncate max-w-[120px] xs:max-w-[180px] sm:max-w-full">
                            {{ formatStatus(service.location) }}
                          </span>
                          <span class="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>
                          <span class="text-[11px] xs:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {{ formatRelativeDate(service.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button @click.stop="$router.push('/tecnico/ServiciosTecnico')" class="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0 ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <NuxtLink v-if="services.length > 3" to="/tecnico/ServiciosTecnico" class="block text-center text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2">
                Ver {{ services.length - 3 }} más
              </NuxtLink>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="px-4 sm:px-6 mb-6">
            <h3 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <button @click="updateAvailability" :disabled="loadingAvailability" class="bg-dark dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed h-full">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center" :class="isAvailable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
                    <div v-if="loadingAvailability" class="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-400 border-t-transparent"></div>
                    <svg 
                      v-else
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4 sm:h-5 sm:w-5" 
                      :class="isAvailable ? 'text-green-500' : 'text-red-500'"
                      fill="none" 
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path 
                        v-if="isAvailable"
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                      <path 
                        v-else
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div class="w-full min-w-0">
                    <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {{ isAvailable ? 'Activo para trabajos' : 'No disponible' }}
                    </p>
                    <div class="flex items-center justify-between mt-1 sm:mt-2">
                      <span class="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate pr-1">
                        {{ isAvailable ? 'Activo para trabajos' : 'No disponible' }}
                      </span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          class="sr-only peer"
                          :checked="isAvailable"
                          @change="updateAvailability"
                          :disabled="loadingAvailability"
                        >
                        <div 
                          class="w-9 h-5 sm:w-11 sm:h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all"
                          :class="isAvailable 
                            ? 'bg-green-500 after:border-green-500' 
                            : 'bg-red-500 after:border-red-500'"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </button>
              
              <button @click="viewReports" class="bg-dark dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left h-full">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">Ver Reportes</p>
                    <p class="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate">Estadísticas</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>

    <FootersFooterTecnico />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

// SEO and Meta
useHead({
  title: 'HogarSeguro - Panel Técnico',
  meta: [
    { name: 'description', content: 'Panel de Técnico - Gestiona tus servicios y asignaciones' },
    { name: 'keywords', content: 'HogarSeguro, Panel Técnico, Técnico, Servicios, Asignaciones' },  
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// ===== CONFIGURACIÓN Y AUTENTICACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const currentUser = ref(auth.user)

// ===== VARIABLES DE ESTADO =====
const loading = ref(false)
const loadingAvailability = ref(false)
const isLoading = ref(false) // Para el spinner de carga general
const services = ref([])
const isAvailable = ref(false)

// Estadísticas y reseñas
const stats = ref({
  activeServices: 0,
  rating: 0,
  completedServices: 0
})

// Reseñas del técnico
const reviews = ref([])

// Variables de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// ===== FUNCIONES DE UTILIDAD =====
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Fecha inválida'
  
  const now = new Date()
  const diffInMs = now - date
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Hoy'
  } else if (diffInDays === 1) {
    return 'Ayer'
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} días`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`
  } else {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

const formatStatus = (status) => {
  const statusMap = {
    'pendiente_pago': 'Pendiente de Pago',
    'pendiente_asignacion': 'Pendiente de Asignación',
    'asignado': 'Asignado',
    'pendiente_pagocotizacion': 'Pendiente de Pago de Cotización',
    'en_proceso': 'En Proceso',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'pendiente_pago': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'pendiente_asignacion': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'asignado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'pendiente_pagocotizacion': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'en_proceso': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// ===== FUNCIONES DE TOAST =====
const showToast = (options) => {
  toast.value.show = false
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    }
  })
}

const showSuccess = (message) => {
  showToast({
    message: message,
    type: 'success',
    duration: 5000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  
  showToast({
    message: message,
    type: 'error',
    duration: 8000
  })
}

// ===== FUNCIONES DE CARGA DE DATOS =====
const fetchServices = async () => {
  try {
    loading.value = true
    
    const userCookieValue = useCookie('user').value
    
    const response = await $fetch(`/solicitudservicio/tecnico/${userCookieValue.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    stats.value = {
      ...stats.value,
      activeServices: response.activas,
      completedServices: response.finalizadas
    }
    
    if (response.solicitudes && response.solicitudes.length > 0) {
      services.value = response.solicitudes.map(servicio => ({
        id: servicio.id_solicitud,
        title: servicio.servicio?.nombre || 'Servicio sin nombre',
        location: servicio.colonia || 'Ubicación no especificada',
        date: servicio.fecha_solicitud,
        status: servicio.estado,
        description: servicio.descripcion || 'Sin descripción',
        client: servicio.nombre_cliente || 'Cliente no especificado',
        phone: servicio.telefono_contacto || 'Sin teléfono'
      }))
    }
    
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showError('Error al cargar los servicios. Intente de nuevo más tarde.')
  } finally {
    loading.value = false
  }
}

const fetchAvailability = async () => {
  loadingAvailability.value = true
  try {
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    const response = await $fetch(`/usuarios/id/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    // Actualizar el estado local basado en el valor de 'estado' del backend
    isAvailable.value = response.estado === 'activo'
    return response.estado === 'activo'
    
  } catch (error) {
    showError('Error al cargar el estado de disponibilidad. Intente de nuevo más tarde.')
    throw error
  } finally {
    loadingAvailability.value = false
  }
}

// ===== FUNCIONES DE DISPONIBILIDAD =====
const updateAvailability = async () => {
  try {
    loadingAvailability.value = true
    
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    // Invertir el estado actual
    const newStatus = isAvailable.value ? 'inactivo' : 'activo'
    
    await $fetch(`/usuarios/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        estado: newStatus
      })
    })
    
    // Actualizar el estado local
    isAvailable.value = newStatus === 'activo'
    
    showSuccess(`Estado actualizado a: ${newStatus === 'activo' ? 'Disponible' : 'No disponible'}`)
    
  } catch (error) {
    showError('Error al actualizar la disponibilidad. Intente de nuevo.')
  } finally {
    loadingAvailability.value = false
  }
}

// ===== MANEJADOR DE CAMBIO DE DISPONIBILIDAD =====
const handleAvailabilityChange = async () => {
  try {
    loadingAvailability.value = true
    await updateAvailability()
  } catch (error) {
    // El error ya se maneja en updateAvailability
  } finally {
    loadingAvailability.value = false
  }
}

// Obtener reseñas del técnico
const fetchReviews = async (loadMore = false) => {
  try {
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    const response = await $fetch(`/calificaciones/usuario/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    // Mapear la respuesta de la API al formato esperado
    const loadedReviews = response.data || []
    
    if (!loadMore) {
      reviews.value = loadedReviews
    } else {
      reviews.value = [...reviews.value, ...loadedReviews]
    }
    
    // Actualizar la calificación promedio en las estadísticas
    if (reviews.value.length > 0) {
      const totalRating = reviews.value.reduce((sum, review) => sum + review.calificacion, 0)
      stats.value.rating = parseFloat((totalRating / reviews.value.length).toFixed(1))
    } else {
      stats.value.rating = 0.0
    }
    
  } catch (error) {
    console.error('Error al cargar las reseñas:', error)
  }
}

// Calcular calificación promedio
const averageRating = computed(() => {
  if (reviews.value.length === 0) return '0.0'
  
  const totalRating = reviews.value.reduce((sum, review) => sum + review.calificacion, 0)
  const average = totalRating / reviews.value.length
  return average.toFixed(1)
})

// ===== FUNCIONES DE NAVEGACIÓN =====
const viewReports = async () => { 
  try {
    isLoading.value = true 
    await router.push('/tecnico/MetricasTecnico')
  } catch (error) {
    console.error('Error al navegar a las métricas:', error)
    showError('Error al cargar las métricas. Intente de nuevo.')
  } finally {
    isLoading.value = false
  }
}

// ===== INICIALIZACIÓN =====
onMounted(() => { 
  fetchServices()
  fetchAvailability()
  fetchReviews(false)
})

</script>

<style scoped>
/* Estilos específicos del componente */
</style>