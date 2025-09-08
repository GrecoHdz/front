<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Cargando Dashboard...'"
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
      <HeadersHeaderDashboard />

      <!-- Content Container with max-w-2xl -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Toast Component -->
        <Toast 
          v-if="toast.show"
          :message="toast.message" 
          :type="toast.type"
          @close="toast.show = false"
        />
      <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
      <div class="pb-24">
        <!-- Main Content -->
        <main class="pb-4">
      
      <!-- Welcome Section -->
      <section class="px-6 py-6">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl"></div>
          
          <div class="relative">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-2xl">👋</span>
              </div>
              <div>
                <h2 class="text-2xl font-black text-gray-900 dark:text-white">
                  ¡Hola, {{ shortName }}!
                </h2>
                <p class="text-gray-600 dark:text-gray-400">Bienvenido de vuelta a HogarSeguro</p>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-2xl">
              <p class="text-emerald-800 dark:text-emerald-200 font-medium text-center">
                🏠 Tu hogar está protegido con HogarSeguro
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="px-6 mb-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-xl">📊</span>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Servicios</p>
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ statsData.totalServices }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-xl">💰</span>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Crédito</p>
                <p class="text-2xl font-black text-gray-900 dark:text-white">L. {{ statsData.credit.toLocaleString('es-HN') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Progress Section - New Design -->
      <section class="px-6 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <!-- Header with gradient -->
          <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-6 text-white relative">
            <div class="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-2xl font-black">Tu Progreso</h3>
                <div class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <span v-if="isLoadingProgress" class="text-sm font-bold">Cargando...</span>
                  <span v-else class="text-sm font-bold">Mes {{ statsData.membershipMonths }}</span>
                </div>
              </div>
              
              <!-- Progress Circle -->
              <div class="flex items-center justify-center mb-4">
                <div class="relative w-32 h-32">
                  <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-white/20" stroke="currentColor" stroke-width="3" fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="text-yellow-300" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"
                          :stroke-dasharray="progressCircle"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div v-if="isLoadingProgress" class="text-2xl font-black text-white">--/6</div>
                      <div v-else class="text-2xl font-black text-white">{{ progressCount }}/6</div>
                      <div class="text-xs text-white/80">Beneficios</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p class="text-center text-white/90 font-medium">
                {{ progressMessage }}
              </p>
            </div>
          </div>

          <!-- Benefits Cards -->
          <div class="p-6">
            <div v-if="loadingBenefits" class="grid grid-cols-2 gap-3">
              <div v-for="i in 4" :key="`skeleton-${i}`" 
                   class="h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
            </div>
            
            <div v-else-if="benefitsError" class="text-center py-4 text-red-500">
              {{ benefitsError }}
              <button @click="fetchBeneficios" class="mt-2 text-sm text-blue-600 hover:underline">
                Reintentar
              </button>
            </div>
            
            <div v-else-if="benefitsToShow.length === 0" class="text-center py-4 text-gray-500">
              No hay beneficios disponibles en este momento.
            </div>
            
            <div v-else class="grid grid-cols-2 gap-3">
              <div v-for="(benefit, index) in benefitsToShow" :key="`benefit-${benefit.month}`"
                   class="p-4 rounded-2xl border-2 transition-all duration-300"
                   :class="getBenefitStyle(benefit.month)">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                       :class="getBenefitIconStyle(benefit.month)">
                    {{ getBenefitIcon(benefit.month) }}
                  </div>
                  <span class="text-xs font-bold"
                        :class="getBenefitTextStyle(benefit.month)">
                    Mes {{ benefit.month }}
                  </span>
                </div>
                <p class="text-sm font-semibold leading-tight"
                   :class="getBenefitTitleStyle(benefit.month)">
                  {{ benefit.title }}
                </p>
              </div>
            </div>
            
            <!-- Membresía -->
            <div class="mt-4 p-4 rounded-2xl border transition-colors duration-300"
              :class="{
                'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': isMembershipActive,
                'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': isMembershipPending,
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800': isMembershipExpired,
                'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700': isMembershipInactive
              }">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      :class="{
                        'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400': isMembershipActive,
                        'bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400': isMembershipPending,
                        'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400': isMembershipExpired,
                        'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400': isMembershipInactive
                      }">
                      <span v-if="isMembershipActive">🏆</span>
                      <span v-else-if="isMembershipPending">⏳</span>
                      <span v-else-if="isMembershipExpired">⚠️</span>
                      <span v-else>🔒</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium"
                        :class="{
                          'text-blue-800 dark:text-blue-200': isMembershipActive,
                          'text-amber-800 dark:text-amber-200': isMembershipPending,
                          'text-red-800 dark:text-red-200': isMembershipExpired,
                          'text-gray-800 dark:text-gray-200': isMembershipInactive
                        }">
                        {{ isMembershipActive ? 'Membresía activa hasta' : 
                           isMembershipPending ? 'Membresía pendiente' :
                           isMembershipExpired ? 'Membresía vencida' : 'Estado de la membresía' }}
                      </p>
                      <p class="text-sm font-bold truncate"
                        :class="{
                          'text-blue-900 dark:text-white': isMembershipActive,
                          'text-amber-900 dark:text-amber-100': isMembershipPending,
                          'text-red-900 dark:text-red-100': isMembershipExpired,
                          'text-gray-900 dark:text-gray-100': isMembershipInactive
                        }">
                        {{ isMembershipActive ? membershipEndDate : membershipStatus }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Barra de progreso -->
                  <div v-if="!isMembershipInactive" class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
                    <div 
                      class="h-2 rounded-full transition-all duration-500 ease-in-out"
                      :class="{
                        'bg-gradient-to-r from-green-500 to-emerald-600': membershipProgress < 80,
                        'bg-gradient-to-r from-amber-400 to-orange-500': membershipProgress >= 80 && membershipProgress < 95,
                        'bg-gradient-to-r from-red-500 to-pink-600': membershipProgress >= 95
                      }"
                      :style="`width: ${membershipProgress}%`"
                    ></div>
                  </div>
                  
                  <div v-if="!isMembershipInactive" class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Inicio: {{ membershipStartDate }}</span>
                    <span v-if="membershipProgress > 0 && membershipProgress < 100">{{ membershipProgress }}% completado</span>
                    <span v-else-if="membershipProgress >= 100">Expirada</span>
                  </div>
                </div>
                
                <button 
                  @click="renovarMembresia"
                  class="w-full sm:w-auto px-4 py-2 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md whitespace-nowrap self-center sm:self-auto flex items-center justify-center"
                  :class="{
                    'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed': isMembershipActive,
                    'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5': isMembershipExpired || isMembershipInactive,
                    'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed': isMembershipPending,
                    'opacity-80': !isMembershipExpired && !isMembershipInactive
                  }"
                  :disabled="!isMembershipExpired && !isMembershipInactive"
                >
                  <svg v-if="isMembershipExpired || isMembershipInactive" class="w-4 h-4 mr-2 animate-pulse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ isMembershipActive ? 'Membresía Activa' : isMembershipPending ? 'Pendiente' : isMembershipInactive ? 'Activar ahora' : 'Renovar Ahora' }}
                </button>
              </div>
              
              <!-- Información adicional para debug -->
              <div v-if="false" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                <p>ID: {{ membershipData.id }}</p>
                <p>Estado: {{ membershipData.status }}</p>
                <p>Progreso: {{ membershipProgress }}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Service Request -->
      <section class="px-6 mb-6">
        <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="relative">
            <h3 class="text-2xl font-black mb-4 flex items-center space-x-2">
              <span>🚀</span>
              <span>Solicitar Servicio</span>
            </h3>
            
            <form @submit.prevent="handleRequestService" class="space-y-4">
              <div>
                <select v-model="serviceFormData.type" 
                        :disabled="isLoadingServices"
                        class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 disabled:opacity-70 disabled:cursor-not-allowed">
                  <option value="" disabled class="text-gray-900">
                    {{ isLoadingServices ? 'Cargando servicios...' : 'Selecciona un servicio' }}
                  </option>
                  <option v-for="service in servicesList" :key="`service-${service.id}`" :value="service.name" class="text-gray-900">
                    {{ service.icon }} {{ service.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <textarea v-model="serviceFormData.description" 
                         placeholder="Describe el problema o servicio que necesitas..."
                         class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none h-24"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <input v-model="serviceFormData.colonia" 
                         type="text"
                         placeholder="Colonia"
                         class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                </div>
                <div>
                  <input v-model="serviceFormData.direccion" 
                         type="text"
                         placeholder="Dirección precisa"
                         class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                </div>
              </div>

              <button type="submit" 
                      class="w-full py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-black text-lg rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                Solicitar Ahora
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Recent Services -->
      <section class="px-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-black text-gray-900 dark:text-white">Servicios Recientes</h3>
          <button class="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline">
            Ver todos
          </button>
        </div>
        <div class="space-y-3">
          <div v-for="service in recentServicesDisplay" :key="`recent-${service.id}`"
               class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl">
                  {{ service.icon }}
                </div>
                <div>
                  <p class="font-bold text-gray-900 dark:text-white">{{ service.title }}</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.date }}</p>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                      :class="getStatusColor(service.status)">
                  {{ service.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="px-6 mb-6">
        <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 gap-4">
          <button class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-xl">🏠</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-sm">Ver Servicios</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Historial completo</p>
              </div>
            </div>
          </button>
          
          <button class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-xl">👤</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-sm">Mi Perfil</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Configuración</p>
              </div>
            </div>
          </button>
          
          <button class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-xl">💬</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-sm">Soporte</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Ayuda 24/7</p>
              </div>
            </div>
          </button>
          
          <button class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                <span class="text-white text-xl">💰</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-sm">Referir</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Ganá dinero</p>
              </div>
            </div>
          </button>
        </div>
      </section>
      </main>
      </div> <!-- Close pb-24 div -->
      </div> <!-- Close max-w-2xl container -->

      <FootersFooter /> 
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

// Obtener la configuración
const config = useRuntimeConfig()

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de control de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Autenticación
const auth = useAuthStore()
const router = useRouter() 
const isLoading = ref(true) 
const beneficios = ref([])
const loadingBenefits = ref(false)
const benefitsError = ref(null) 
const isLoadingProgress = ref(false)

// Datos del usuario
const userCookie = useCookie('user')
const userData = ref({
  id: null,
  identidad: '',
  nombre: 'Invitado',
  email: '',
  role: '',
  rol_nombre: 'Invitado',
  // Mantener compatibilidad con el resto del código
  name: 'Invitado',
  ...(userCookie.value || {})
})

// Estados y datos de membresía
const membershipData = ref({
  id: null,
  status: 'inactiva',
  progress: 0,
  startDate: null,
  endDate: null
})

// Verificar autenticación al cargar el componente
onMounted(async () => { 
  try {
    await fetchMembershipProgress()
    await fetchMembershipData()
  } catch (error) {
    // Solo mostrar error si no es un error de "no encontrado"
    if (error?.response?._data?.status !== 'not_found') {
      console.error('Error al cargar datos de membresía:', error)
    }
  } finally {
    isLoading.value = false
  }
})

// Asegurar que name siempre tenga un valor
userData.value.name = userData.value.nombre || userData.value.name

// Obtener solo los dos primeros nombres
const shortName = computed(() => {
  if (!userData.value.nombre) return 'Invitado'
  const names = userData.value.nombre.split(' ')
  return names.length > 2 ? `${names[0]} ${names[1]}` : userData.value.nombre
})

const statsData = ref({
  totalServices: 0,
  credit: 0,
  membershipMonths: 0
})

// Función para obtener el progreso de la membresía
const fetchMembershipProgress = async () => {
  try {
    isLoadingProgress.value = true
    
    // Obtener el id_usuario de la cookie
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData || !userData.id_usuario) {
      return // No mostrar error en consola
    }

    const response = await $fetch(`/membresia/progreso/${userData.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      // No lanzar excepción para códigos de estado 404
      ignoreResponseError: true
    }).catch(() => null) // Capturar cualquier error sin mostrarlo

    if (response?.status === 'success') {
      // Actualizar el progreso de la membresía
      statsData.value.membershipMonths = response.mesesProgreso || 0
      // Actualizar el crédito con el monto total de la respuesta
      statsData.value.credit = response.montoTotal || 0
    }
  } catch (error) {
    // No hacer nada con el error, solo asegurarse de que no se muestre en consola
  } finally {
    isLoadingProgress.value = false
  }
}

// Función para obtener datos completos de la membresía
const fetchMembershipData = async () => {
  try {
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData || !userData.id_usuario) {
      membershipData.value = { status: 'inactiva', progress: 0 }
      return
    }

    const response = await $fetch(`/membresia/${userData.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response && response.status === 'success' && response.data) {
      const membresia = response.data
      const fechaInicio = new Date(membresia.fecha)
      const fechaVencimiento = new Date(fechaInicio)
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 30)
      
      // Calcular progreso
      const hoy = new Date()
      const totalDias = (fechaVencimiento - fechaInicio) / (1000 * 60 * 60 * 24)
      const diasTranscurridos = (hoy - fechaInicio) / (1000 * 60 * 60 * 24)
      const progreso = Math.min(100, Math.max(0, Math.round((diasTranscurridos / totalDias) * 100)))
      
      // Actualizar estado a 'vencida' si la membresía está expirada
      if (progreso >= 100 && membresia.estado === 'activa') {
        membresia.estado = 'vencida'
      }
      
      membershipData.value = {
        id: membresia.id_membresia,
        status: membresia.estado,
        progress: progreso,
        startDate: fechaInicio,
        endDate: fechaVencimiento
      }
      
      return response
    } else if (response?.status === 'not_found') {
      membershipData.value = { status: 'inactiva', progress: 0 }
      return { status: 'not_found' }
    } else {
      throw new Error('Formato de respuesta inesperado')
    }
  } catch (error) {
    if (error.response?._data?.status === 'not_found') {
      membershipData.value = { status: 'inactiva', progress: 0 }
      return { status: 'not_found' }
    }
    
    console.error('Error al obtener datos de la membresía:', error)
    membershipData.value = { status: 'inactiva', progress: 0 }
    throw error
  }
}

// Computed para mapear los beneficios al formato esperado por la UI
const benefitsToShow = computed(() => {
  return beneficios.value.map(beneficio => ({
    month: beneficio.mes_requerido,
    title: beneficio.tipo_beneficio,
    active: currentMonth.value >= beneficio.mes_requerido
  }))
})

// Computed para obtener el mes actual relativo al inicio de la membresía
const currentMonth = computed(() => {
  if (!membershipData.value?.fecha_inicio) return 0
  const startDate = new Date(membershipData.value.fecha_inicio)
  const now = new Date()
  const months = (now.getFullYear() - startDate.getFullYear()) * 12
  return months + now.getMonth() - startDate.getMonth()
})

// Computed properties para la membresía
const isMembershipActive = computed(() => {
  return membershipData.value.status === 'activa'
})

const isMembershipPending = computed(() => {
  return membershipData.value.status === 'pendiente'
})

const isMembershipExpired = computed(() => {
  return membershipData.value.status === 'vencida' || 
         (membershipData.value.status === 'activa' && membershipData.value.progress >= 100)
})

const isMembershipInactive = computed(() => {
  return !membershipData.value.status || membershipData.value.status === 'inactiva'
})

const membershipProgress = computed(() => membershipData.value.progress || 0)

const membershipEndDate = computed(() => {
  if (!membershipData.value.endDate) return 'Fecha no disponible'
  
  return new Date(membershipData.value.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const membershipStartDate = computed(() => {
  if (!membershipData.value.startDate) return 'N/A';
  
  return new Date(membershipData.value.startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
})

const membershipStatus = computed(() => {
  const status = membershipData.value.status || 'inactiva'
  
  const statusMap = {
    'activa': 'Activa',
    'pendiente': 'Pendiente de verificación',
    'vencida': 'Vencida',
    'inactiva': 'Sin membresía'
  }
  
  return statusMap[status] || 'Sin membresía'
})

const serviceFormData = ref({
  type: '',
  description: '',
  colonia: '',
  direccion: ''
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Services data
const servicesList = ref([])
const isLoadingServices = ref(false)

// Cargar servicios desde la API
const fetchServices = async () => {
  try {
    isLoadingServices.value = true
    const data = await $fetch('/servicios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (Array.isArray(data)) {
      servicesList.value = data.map(service => ({
        id: service.id_servicio,
        name: service.nombre,
        description: service.descripcion,
        icon: getServiceIcon(service.nombre)
      }))
    }
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showToast('No se pudieron cargar los servicios. Intente nuevamente.', 'error')
  } finally {
    isLoadingServices.value = false
  }
}

// Get appropriate icon based on service name
const getServiceIcon = (serviceName) => {
  const name = serviceName.toLowerCase()
  if (name.includes('plom')) return '🚰'
  if (name.includes('electric') || name.includes('eléctric')) return '💡'
  if (name.includes('pintur')) return '🎨'
  if (name.includes('carpinter')) return '🔨'
  if (name.includes('jardín') || name.includes('jardin')) return '🌱'
  if (name.includes('limpiez')) return '🧹'
  if (name.includes('aire') || name.includes('clima')) return '❄️'
  return '🔧'
}

// Fetch services and benefits when component mounts
onMounted(async () => {
  await fetchServices()
  await fetchBeneficios()
})

// Static data arrays
const membershipBenefits = [
  { month: 1, title: 'Visita técnica gratis + 10% descuento' },
  { month: 2, title: 'Crédito acumulable activado' },
  { month: 3, title: 'Limpieza de aire gratuita' },
  { month: 6, title: 'Mano de obra 100% gratuita' }
]

const recentServicesData = ref([
  {
    id: 1001,
    title: 'Reparación de aire acondicionado',
    description: 'El aire no enfría correctamente en la sala principal',
    date: '15 Dic 2024',
    status: 'Completado',
    cost: 450,
    icon: '❄️'
  },
  {
    id: 1002,
    title: 'Instalación de lámpara',
    description: 'Instalar lámpara LED en comedor',
    date: '12 Dic 2024',
    status: 'En progreso',
    cost: 150,
    icon: '💡'
  },
  {
    id: 1003,
    title: 'Fuga en cocina',
    description: 'Pequeña fuga en el grifo de la cocina',
    date: '10 Dic 2024',
    status: 'En camino',
    cost: 200,
    icon: '🔧'
  }
])

// Computed properties to avoid hydration issues
const progressCircle = computed(() => {
  const progress = Math.min(statsData.value.membershipMonths, 6) / 6 * 100
  return `${progress}, 100`
})

const progressCount = computed(() => {
  return Math.min(statsData.value.membershipMonths, 6)
})

const progressMessage = computed(() => {
  const month = statsData.value.membershipMonths
  if (month >= 6) return '¡Has desbloqueado todos los beneficios!'
  if (month >= 3) return 'Ya tienes limpieza de aire gratis'
  if (month >= 2) return 'Tu crédito ya se está acumulando'
  if (month >= 1) return 'Ya tienes descuentos disponibles'
  return 'Empieza a acumular beneficios con tu membresía'
})
 

const recentServicesDisplay = computed(() => {
  return recentServicesData.value.slice(0, 3)
})

// Fetch beneficios desde la API
const fetchBeneficios = async () => {
  loadingBenefits.value = true
  benefitsError.value = null
  
  try {
    const response = await $fetch('/membresiabeneficios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    beneficios.value = response
  } catch (error) {
    console.error('Error al cargar beneficios:', error)
    benefitsError.value = 'No se pudieron cargar los beneficios. Intente más tarde.'
  } finally {
    loadingBenefits.value = false
  }
}

// Methods for styling
const getBenefitStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
    'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
}

const getBenefitIconStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'bg-green-500 text-white' : 
    'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
}

const getBenefitIcon = (month) => {
  return statsData.value.membershipMonths >= month ? '✓' : month.toString()
}

const getBenefitTextStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'text-green-700 dark:text-green-300' : 
    'text-gray-600 dark:text-gray-400'
}

const getBenefitTitleStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'text-green-800 dark:text-green-200' : 
    'text-gray-700 dark:text-gray-300'
}

const getStatusColor = (status) => {
  const colors = {
    'Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'En progreso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'En camino': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Programado': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

// Event handlers
const handleRequestService = async () => {
  try {
    if (!serviceFormData.value.type || !serviceFormData.value.description || 
        !serviceFormData.value.colonia || !serviceFormData.value.direccion) {
      throw new Error('Por favor completa todos los campos requeridos')
    }

    // Obtener datos del usuario de la cookie
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData) {
      throw new Error('No se pudo obtener la información del usuario. Por favor inicia sesión nuevamente.')
    }
     
    
    // Verificar que id_ciudad esté presente
    if (!userData.id_ciudad) {
      throw new Error('No se pudo determinar la ciudad del usuario. Por favor contacte al soporte.')
    }

    // Encontrar el servicio seleccionado para obtener su ID
    const selectedService = servicesList.value.find(s => s.name === serviceFormData.value.type)
    if (!selectedService) {
      throw new Error('No se pudo encontrar el servicio seleccionado')
    }

    // Preparar los datos para enviar al backend
    const requestData = {
      id_usuario: Number(userData.id_usuario),
      id_servicio: Number(selectedService.id),
      id_ciudad: Number(userData.id_ciudad),
      colonia: serviceFormData.value.colonia,
      direccion_precisa: serviceFormData.value.direccion,
      descripcion: serviceFormData.value.description,
      visita_pagada: 1,
      estado: 'pendiente_asignacion'
    }

    // Hacer la petición al backend
    const response = await $fetch('/solicitudservicio', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    // Agregar el servicio a la lista local
    const newService = {
      id: response.id_solicitud_servicio || Date.now(),
      title: serviceFormData.value.type,
      description: serviceFormData.value.description,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pendiente',
      cost: 0, // El costo se determinará más adelante
      icon: selectedService.icon
    }
    
    recentServicesData.value.unshift(newService)
    
    // Reset form
    serviceFormData.value = { 
      type: '', 
      description: '', 
      colonia: '', 
      direccion: '' 
    }
    
    showToast('¡Solicitud enviada! Te contactaremos pronto.', 'success')
  } catch (error) {
    console.error('Error al enviar la solicitud de servicio:', error)
    showToast('No se pudo enviar la solicitud. Por favor, inténtalo mas tarde.', 'error')
  }
}

const renovarMembresia = () => {
  // Redirigir a la página de perfil con el hash #membresia
  navigateTo('/cliente/perfil#membresia')
}

const handleRenovarMembresia = () => {
  renovarMembresia()
}

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  }
  
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

// Dark mode support - wrapped in ClientOnly to avoid hydration issues
onMounted(() => {
  // Only run on client side
  if (process.client) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

html {
  scroll-behavior: smooth;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>