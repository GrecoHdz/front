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
                <p class="text-2xl font-black text-gray-900 dark:text-white">L. {{ statsData.credit }}</p>
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
                  <span class="text-sm font-bold">Mes {{ statsData.membershipMonths }}</span>
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
                      <div class="text-2xl font-black text-white">{{ progressCount }}/6</div>
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
            <div class="grid grid-cols-2 gap-3">
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
            <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-400">🏆</span>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Membresía activa hasta</p>
                      <p class="text-sm font-bold text-blue-900 dark:text-white">30 de Agosto, 2024</p>
                    </div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-3">
                    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" style="width: 65%"></div>
                  </div>
                </div>
                <button 
                  @click="handleRenovarMembresia"
                  class="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Renovar Ahora
                </button>
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
                        class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                  <option value="" disabled class="text-gray-900">Selecciona un servicio</option>
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
                ✨ Solicitar Ahora
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
                <p class="font-bold text-gray-900 dark:text-white text-sm">Membresía</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Gestionar plan</p>
              </div>
            </div>
          </button>
        </div>
      </section>
      </main>
      </div> <!-- Close pb-24 div -->
      </div> <!-- Close max-w-2xl container -->

      <FootersFooter />

      <!-- Success Messages -->
      <ClientOnly>
        <div v-if="notification.show" class="fixed top-6 left-6 right-6 z-50">
          <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">✅</div>
              <div>
                <p class="font-black text-lg">{{ notification.title }}</p>
                <p class="text-green-100 text-sm">{{ notification.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

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

// Verificar autenticación al cargar el componente
onMounted(async () => { 
    isLoading.value = false 
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
  totalServices: 12,
  credit: 500,
  membershipMonths: 4
})

const serviceFormData = ref({
  type: '',
  description: '',
  colonia: '',
  direccion: ''
})

const notification = ref({
  show: false,
  title: '',
  description: ''
})

// Static data arrays
const membershipBenefits = [
  { month: 1, title: 'Visita técnica gratis + 10% descuento' },
  { month: 2, title: 'Crédito acumulable activado' },
  { month: 3, title: 'Limpieza de aire gratuita' },
  { month: 6, title: 'Mano de obra 100% gratuita' }
]

const servicesList = [
  { id: 1, name: 'Fontanería', icon: '🔧' },
  { id: 2, name: 'Electricidad', icon: '💡' },
  { id: 3, name: 'Aires A/C', icon: '❄️' },
  { id: 4, name: 'Electrodomésticos', icon: '🧊' },
  { id: 5, name: 'Pintura', icon: '🎨' },
  { id: 6, name: 'Cámaras', icon: '🎥' }
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
  return 'Sigue acumulando beneficios cada mes'
})

const benefitsToShow = computed(() => {
  return membershipBenefits.slice(0, 4)
})

const recentServicesDisplay = computed(() => {
  return recentServicesData.value.slice(0, 3)
})

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
const handleRequestService = () => {
  if (serviceFormData.value.type && serviceFormData.value.description && 
      serviceFormData.value.colonia && serviceFormData.value.direccion) {
    
    const serviceIcon = servicesList.find(s => s.name === serviceFormData.value.type)?.icon || '🔧'
    
    const newService = {
      id: Date.now(),
      title: serviceFormData.value.type,
      description: serviceFormData.value.description,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Programado',
      cost: Math.floor(Math.random() * 500) + 100,
      icon: serviceIcon
    }
    
    recentServicesData.value.unshift(newService)
    
    // Reset form
    serviceFormData.value = { 
      type: '', 
      description: '', 
      colonia: '', 
      direccion: '' 
    }
    
    showNotification('¡Servicio solicitado!', 'Te contactaremos pronto para confirmar los detalles')
  }
}

const handleRenovarMembresia = () => {
  showNotification('¡Renovación iniciada!', 'Serás redirigido al portal de pagos')
}

const showNotification = (title, description) => {
  notification.value = { 
    show: true, 
    title, 
    description 
  }
  
  setTimeout(() => {
    notification.value.show = false
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