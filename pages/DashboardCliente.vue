<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO Head -->
    <Head>
      <title>HogarSeguro - Dashboard</title>
      <meta name="description" content="Panel de control de HogarSeguro - Gestiona tus servicios y membresía" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

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
                  ¡Hola, {{ currentUser.name }}!
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
                <p class="text-2xl font-black text-gray-900 dark:text-white">{{ userStats.totalServices }}</p>
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
                <p class="text-2xl font-black text-gray-900 dark:text-white">L. {{ userStats.credit }}</p>
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
                  <span class="text-sm font-bold">Mes {{ userStats.membershipMonths }}</span>
                </div>
              </div>
              
              <!-- Progress Circle -->
              <div class="flex items-center justify-center mb-4">
                <div class="relative w-32 h-32">
                  <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-white/20" stroke="currentColor" stroke-width="3" fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="text-yellow-300" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"
                          :stroke-dasharray="`${(Math.min(userStats.membershipMonths, 6) / 6) * 100}, 100`"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-2xl font-black text-white">{{ Math.min(userStats.membershipMonths, 6) }}/6</div>
                      <div class="text-xs text-white/80">Beneficios</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p class="text-center text-white/90 font-medium">
                {{ getProgressMessage() }}
              </p>
            </div>
          </div>

          <!-- Benefits Cards -->
          <div class="p-6">
            <div class="grid grid-cols-2 gap-3">
              <div v-for="(benefit, index) in membershipBenefits.slice(0, 4)" :key="benefit.month"
                   class="p-4 rounded-2xl border-2 transition-all duration-300"
                   :class="userStats.membershipMonths >= benefit.month ? 
                     'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
                     'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'">
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                       :class="userStats.membershipMonths >= benefit.month ? 
                         'bg-green-500 text-white' : 
                         'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'">
                    {{ userStats.membershipMonths >= benefit.month ? '✓' : benefit.month }}
                  </div>
                  <span class="text-xs font-bold"
                        :class="userStats.membershipMonths >= benefit.month ? 
                          'text-green-700 dark:text-green-300' : 
                          'text-gray-600 dark:text-gray-400'">
                    Mes {{ benefit.month }}
                  </span>
                </div>
                <p class="text-sm font-semibold leading-tight"
                   :class="userStats.membershipMonths >= benefit.month ? 
                     'text-green-800 dark:text-green-200' : 
                     'text-gray-700 dark:text-gray-300'">
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
                  @click="renovarMembresia"
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
            
            <form @submit.prevent="requestService" class="space-y-4">
              <div>
                <select v-model="serviceForm.type" 
                        class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                  <option value="" disabled class="text-gray-900">Selecciona un servicio</option>
                  <option v-for="service in services" :key="service.id" :value="service.name" class="text-gray-900">
                    {{ service.icon }} {{ service.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <textarea v-model="serviceForm.description" 
                          placeholder="Describe el problema o servicio que necesitas..."
                          class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none h-24">
                </textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <input v-model="serviceForm.colonia" 
                         type="text"
                         placeholder="Colonia"
                         class="w-full px-4 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                </div>
                <div>
                  <input v-model="serviceForm.direccion" 
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
          <div v-for="service in recentServices.slice(0, 3)" :key="service.id"
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

    <Footer />

    <!-- Success Messages -->
    <div v-if="showSuccessMessage" class="fixed top-6 left-6 right-6 z-50">
      <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">✅</div>
          <div>
            <p class="font-black text-lg">{{ successMessage.title }}</p>
            <p class="text-green-100 text-sm">{{ successMessage.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de control de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Reactive data
const showSuccessMessage = ref(false)

// Mock current user - esto vendría de tu sistema de autenticación
const currentUser = ref({
  id: 1,
  name: 'Juan Pérez',
  email: 'cliente@test.com',
  memberSince: 'Enero 2024'
})

const serviceForm = ref({
  type: '',
  description: '',
  colonia: '',
  direccion: ''
})

const successMessage = ref({
  title: '',
  description: ''
})

// Mock data
const userStats = ref({
  totalServices: 12,
  credit: 500,
  membershipMonths: 4
})

const membershipBenefits = [
  { month: 1, title: 'Visita técnica gratis + 10% descuento' },
  { month: 2, title: 'Crédito acumulable activado' },
  { month: 3, title: 'Limpieza de aire gratuita' },
  { month: 6, title: 'Mano de obra 100% gratuita' }
]

const services = [
  { id: 1, name: 'Fontanería', icon: '🔧' },
  { id: 2, name: 'Electricidad', icon: '💡' },
  { id: 3, name: 'Aires A/C', icon: '❄️' },
  { id: 4, name: 'Electrodomésticos', icon: '🧊' },
  { id: 5, name: 'Pintura', icon: '🎨' },
  { id: 6, name: 'Cámaras', icon: '🎥' }
]

const recentServices = ref([
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

// Methods
const getProgressMessage = () => {
  const month = userStats.value.membershipMonths
  if (month >= 6) return '¡Has desbloqueado todos los beneficios!'
  if (month >= 3) return 'Ya tienes limpieza de aire gratis'
  if (month >= 2) return 'Tu crédito ya se está acumulando'
  return 'Sigue acumulando beneficios cada mes'
}

const getNextBenefit = () => {
  const month = userStats.value.membershipMonths
  if (month < 2) return 'Crédito acumulable'
  if (month < 3) return 'Limpieza de aire gratuita'
  if (month < 6) return 'Mano de obra 100% gratuita'
  return 'Todos los beneficios desbloqueados'
}

const getNextBenefitMonths = () => {
  const month = userStats.value.membershipMonths
  if (month < 2) return 2 - month
  if (month < 3) return 3 - month
  if (month < 6) return 6 - month
  return 0
}

const requestService = () => {
  if (serviceForm.value.type && serviceForm.value.description && serviceForm.value.colonia && serviceForm.value.direccion) {
    const newService = {
      id: Date.now(),
      title: serviceForm.value.type,
      description: serviceForm.value.description,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Programado',
      cost: Math.floor(Math.random() * 500) + 100,
      icon: services.find(s => s.name === serviceForm.value.type)?.icon || '🔧'
    }
    
    recentServices.value.unshift(newService)
    serviceForm.value = { type: '', description: '', colonia: '', direccion: '' }
    showSuccess('¡Servicio solicitado!', 'Te contactaremos pronto para confirmar los detalles')
  }
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

const showSuccess = (title, description) => {
  successMessage.value = { title, description }
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 4000)
}

// Dark mode support
onMounted(() => {
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