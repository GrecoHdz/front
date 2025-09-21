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
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Cargando panel administrativo...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderDashboard />

      <!-- Content Container -->
      <div class="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Hero Section -->
            <section class="px-6 py-6">
              <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-3xl p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <div class="relative">
                  <div class="flex items-center justify-between mb-6">
                    <div>
                      <div class="flex items-center space-x-4 mb-4">
                        <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span class="text-4xl">👨‍💼</span>
                        </div>
                        <div>
                          <h1 class="text-3xl font-black">Panel Administrativo</h1>
                          <p class="text-white/90 font-medium">Bienvenido, {{ adminName }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                        <span class="text-sm font-bold">{{ getCurrentTime }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div class="text-2xl font-black">{{ stats.totalUsers }}</div>
                      <div class="text-xs text-white/80">Usuarios Totales</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div class="text-2xl font-black">{{ stats.pendingServices }}</div>
                      <div class="text-xs text-white/80">Servicios Pendientes</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div class="text-2xl font-black">{{ stats.activeMemberships }}</div>
                      <div class="text-xs text-white/80">Membresías Activas</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <div class="text-2xl font-black">L. {{ stats.monthlyRevenue.toLocaleString('es-HN') }}</div>
                      <div class="text-xs text-white/80">Ingresos del Mes</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Quick Actions -->
            <section class="px-6 mb-6">
              <h2 class="text-xl font-black text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  v-for="action in quickActions" 
                  :key="action.id"
                  @click="navigateToAction(action.route)"
                  class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left hover:scale-105"
                >
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
                         :class="action.bgColor">
                      <span class="text-2xl">{{ action.icon }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white text-sm">{{ action.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ action.description }}</p>
                  </div>
                  <div v-if="action.badge" class="mt-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                          :class="action.badgeColor">
                      {{ action.badge }}
                    </span>
                  </div>
                </button>
              </div>
            </section>

            <!-- Pending Reviews -->
            <section class="px-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-black text-gray-900 dark:text-white">Revisiones Pendientes</h2>
                <button @click="refreshPendingItems" class="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
                  🔄 Actualizar
                </button>
              </div>
              
              <!-- Pending Memberships -->
              <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-4">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <span class="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mr-3">
                      💳
                    </span>
                    Membresías Pendientes de Aprobación
                  </h3>
                  <span class="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-3 py-1 rounded-full text-sm font-bold">
                    {{ pendingMemberships.length }} pendientes
                  </span>
                </div>
                
                <div v-if="pendingMemberships.length === 0" class="text-center py-8">
                  <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span class="text-2xl">✅</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400">No hay membresías pendientes de revisión</p>
                </div>

                <div v-else class="space-y-3">
                  <div v-for="membership in displayedMemberships" :key="membership.id"
                       class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <span class="text-blue-600 dark:text-blue-400">👤</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 dark:text-white">{{ membership.userName }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            Comprobante: {{ membership.voucher }} - L. {{ membership.amount.toLocaleString('es-HN') }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(membership.date) }}</p>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button 
                          @click="approveMembership(membership.id)"
                          class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          ✓ Aprobar
                        </button>
                        <button 
                          @click="rejectMembership(membership.id)"
                          class="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          ✗ Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button v-if="pendingMemberships.length > 3 && !showAllMemberships" 
                          @click="showAllMemberships = true"
                          class="w-full py-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">
                    Ver todas ({{ pendingMemberships.length - 3 }} más)
                  </button>
                </div>
              </div>

              <!-- Pending Services -->
              <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <span class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-3">
                      🔧
                    </span>
                    Servicios Pendientes de Asignación
                  </h3>
                  <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                    {{ pendingServices.length }} pendientes
                  </span>
                </div>
                
                <div v-if="pendingServices.length === 0" class="text-center py-8">
                  <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span class="text-2xl">✅</span>
                  </div>
                  <p class="text-gray-600 dark:text-gray-400">No hay servicios pendientes de asignación</p>
                </div>

                <div v-else class="space-y-3">
                  <div v-for="service in displayedServices" :key="service.id"
                       class="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                          <span class="text-orange-600 dark:text-orange-400">{{ service.icon }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 dark:text-white">{{ service.type }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">
                            {{ service.client }} - {{ service.location }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(service.date) }}</p>
                        </div>
                      </div>
                      <div class="flex space-x-2">
                        <button 
                          @click="assignTechnician(service.id)"
                          class="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          👨‍🔧 Asignar
                        </button>
                        <button 
                          @click="viewServiceDetails(service.id)"
                          class="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors"
                        >
                          👁 Ver
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button v-if="pendingServices.length > 3 && !showAllServices" 
                          @click="showAllServices = true"
                          class="w-full py-2 text-blue-600 dark:text-blue-400 font-bold text-sm hover:underline">
                    Ver todos ({{ pendingServices.length - 3 }} más)
                  </button>
                </div>
              </div>
            </section>

            <!-- Recent Activity -->
            <section class="px-6 mb-6">
              <h2 class="text-xl font-black text-gray-900 dark:text-white mb-4">Actividad Reciente</h2>
              <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div class="space-y-4">
                  <div v-for="activity in recentActivities" :key="activity.id"
                       class="flex items-start space-x-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                         :class="activity.iconBg">
                      <span :class="activity.iconColor">{{ activity.icon }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ getRelativeTime(activity.timestamp) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- System Status -->
            <section class="px-6 mb-6">
              <h2 class="text-xl font-black text-gray-900 dark:text-white mb-4">Estado del Sistema</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">Rendimiento</h3>
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span class="text-sm text-green-600 dark:text-green-400 font-medium">Operativo</span>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div v-for="metric in performanceMetrics" :key="metric.name">
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-600 dark:text-gray-400">{{ metric.name }}</span>
                        <span class="font-medium text-gray-900 dark:text-white">{{ metric.value }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <div 
                          class="h-2 rounded-full transition-all duration-500"
                          :class="getMetricColor(metric.value)"
                          :style="`width: ${metric.value}%`"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Resumen de Hoy</h3>
                  <div class="space-y-3">
                    <div v-for="summary in dailySummary" :key="summary.label"
                         class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <span class="text-xl">{{ summary.icon }}</span>
                        <span class="text-sm text-gray-600 dark:text-gray-400">{{ summary.label }}</span>
                      </div>
                      <span class="text-lg font-bold text-gray-900 dark:text-white">{{ summary.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <FootersFooterAdmin />
    </div>

    <!-- Assignment Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showAssignmentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showAssignmentModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="showAssignmentModal = false"
          ></div>
        </Transition>

        <!-- Modal Content -->
        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showAssignmentModal"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-lg">
                    👨‍🔧
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">Asignar Técnico</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Selecciona un técnico disponible</p>
                  </div>
                </div>
                <button @click="showAssignmentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <div class="space-y-3">
                <div v-for="tech in availableTechnicians" :key="tech.id"
                     @click="selectTechnician(tech.id)"
                     class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-400">👷</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 dark:text-white">{{ tech.name }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ tech.speciality }}</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <span class="text-xs px-2 py-1 rounded-full"
                              :class="tech.available ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'">
                          {{ tech.available ? 'Disponible' : 'Ocupado' }}
                        </span>
                        <span class="text-xs text-gray-500">⭐ {{ tech.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Panel Administrativo',
  meta: [
    { name: 'description', content: 'Panel de administración de HogarSeguro - Gestión completa del sistema' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Acciones rápidas
const quickActions = [
  {
    id: 'users',
    title: 'Gestionar Usuarios',
    description: 'Ver y administrar usuarios',
    icon: '👥',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    route: '/admin/usuarios',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'services',
    title: 'Gestionar Servicios',
    description: 'Asignar y supervisar servicios',
    icon: '🔧',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    route: '/admin/servicios',
    badge: '12 pendientes',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  },
  {
    id: 'memberships',
    title: 'Membresías',
    description: 'Aprobar pagos y membresías',
    icon: '💳',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    route: '/admin/membresias',
    badge: '5 pendientes',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    id: 'reports',
    title: 'Reportes',
    description: 'Estadísticas y análisis',
    icon: '📊',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    route: '/admin/reportes',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'technicians',
    title: 'Técnicos',
    description: 'Gestionar equipo técnico',
    icon: '👷',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    route: '/admin/tecnicos',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'config',
    title: 'Configuración',
    description: 'Ajustes del sistema',
    icon: '⚙️',
    bgColor: 'bg-gray-100 dark:bg-gray-700/30',
    route: '/admin/configuracion',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'support',
    title: 'Soporte',
    description: 'Tickets de soporte',
    icon: '🎧',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    route: '/admin/soporte',
    badge: '3 nuevos',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Métricas del negocio',
    icon: '📈',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    route: '/admin/analytics',
    badge: null,
    badgeColor: ''
  }
]

// Técnicos disponibles (ejemplo)
const availableTechnicians = ref([
  {
    id: 1,
    name: 'Carlos Rodríguez',
    speciality: 'Plomería y Electricidad',
    available: true,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Ana López',
    speciality: 'Aire Acondicionado',
    available: true,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Miguel Torres',
    speciality: 'Carpintería',
    available: false,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Sofia Hernández',
    speciality: 'Pintura y Acabados',
    available: true,
    rating: 4.6
  }
])

// Métricas de rendimiento
const performanceMetrics = ref([
  { name: 'CPU', value: 45 },
  { name: 'Memoria', value: 62 },
  { name: 'Almacenamiento', value: 78 },
  { name: 'Red', value: 91 }
])

// Resumen diario
const dailySummary = ref([
  { icon: '👥', label: 'Nuevos usuarios', value: '12' },
  { icon: '🔧', label: 'Servicios completados', value: '28' },
  { icon: '💰', label: 'Ingresos', value: 'L. 15,420' },
  { icon: '⭐', label: 'Calificación promedio', value: '4.8' }
])

// =========================
// VARIABLES REACTIVAS
// =========================

// Estados de carga
const isLoading = ref(true)

// Estados de vista
const showAllMemberships = ref(false)
const showAllServices = ref(false)
const showAssignmentModal = ref(false)
const selectedServiceId = ref(null)

// Datos del admin
const adminName = computed(() => {
  return userCookie.value?.nombre || 'Administrador'
})

// Estadísticas principales
const stats = ref({
  totalUsers: 1247,
  pendingServices: 23,
  activeMemberships: 156,
  monthlyRevenue: 45600
})

// Membresías pendientes
const pendingMemberships = ref([
  {
    id: 1,
    userName: 'Juan Pérez',
    voucher: 'TXN123456',
    amount: 199,
    date: '2024-12-18T10:30:00Z'
  },
  {
    id: 2,
    userName: 'María García',
    voucher: 'TXN789012',
    amount: 199,
    date: '2024-12-18T09:15:00Z'
  },
  {
    id: 3,
    userName: 'Carlos López',
    voucher: 'TXN345678',
    amount: 199,
    date: '2024-12-17T16:45:00Z'
  },
  {
    id: 4,
    userName: 'Ana Rodríguez',
    voucher: 'TXN901234',
    amount: 199,
    date: '2024-12-17T14:20:00Z'
  },
  {
    id: 5,
    userName: 'Luis Martínez',
    voucher: 'TXN567890',
    amount: 199,
    date: '2024-12-17T11:30:00Z'
  }
])

// Servicios pendientes
const pendingServices = ref([
  {
    id: 1,
    type: 'Reparación de Plomería',
    client: 'Pedro Sánchez',
    location: 'Col. Palmira',
    date: '2024-12-18T08:00:00Z',
    icon: '🚰'
  },
  {
    id: 2,
    type: 'Instalación Eléctrica',
    client: 'Carmen Flores',
    location: 'Col. Lomas del Mayab',
    date: '2024-12-18T07:30:00Z',
    icon: '💡'
  },
  {
    id: 3,
    type: 'Aire Acondicionado',
    client: 'Roberto Silva',
    location: 'Col. San Rafael',
    date: '2024-12-17T19:45:00Z',
    icon: '❄️'
  },
  {
    id: 4,
    type: 'Pintura Interior',
    client: 'Elena Vásquez',
    location: 'Col. Centroamérica',
    date: '2024-12-17T18:20:00Z',
    icon: '🎨'
  }
])

// Actividades recientes
const recentActivities = ref([
  {
    id: 1,
    title: 'Nuevo usuario registrado',
    description: 'María González se registró en la plataforma',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    icon: '👤',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 2,
    title: 'Servicio completado',
    description: 'Reparación de plomería en Col. Palmira finalizada',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    icon: '✅',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 3,
    title: 'Membresía aprobada',
    description: 'Pago de Carlos Rodríguez verificado y aprobado',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: '💳',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    id: 4,
    title: 'Nuevo ticket de soporte',
    description: 'Ana López reportó un problema con su servicio',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    icon: '🎧',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400'
  }
])

// Estados de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// =========================
// COMPUTED PROPERTIES
// =========================

const getCurrentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('es-HN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
})

const displayedMemberships = computed(() => {
  return showAllMemberships.value ? pendingMemberships.value : pendingMemberships.value.slice(0, 3)
})

const displayedServices = computed(() => {
  return showAllServices.value ? pendingServices.value : pendingServices.value.slice(0, 3)
})

// =========================
// FUNCIONES UTILITARIAS
// =========================

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRelativeTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) {
    return `hace ${minutes} minutos`
  } else if (hours < 24) {
    return `hace ${hours} horas`
  } else {
    return timestamp.toLocaleDateString('es-ES')
  }
}

const getMetricColor = (value) => {
  if (value >= 80) return 'bg-red-500'
  if (value >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
}

// =========================
// FUNCIONES DE NAVEGACIÓN
// =========================

const navigateToAction = (route) => {
  // Por ahora simular navegación
  showInfo(`Navegando a ${route}`)
}

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

const approveMembership = async (membershipId) => {
  try {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remover de la lista
    const index = pendingMemberships.value.findIndex(m => m.id === membershipId)
    if (index > -1) {
      const membership = pendingMemberships.value[index]
      pendingMemberships.value.splice(index, 1)
      showSuccess('Membresía aprobada', `La membresía de ${membership.userName} ha sido aprobada`)
      
      // Actualizar estadísticas
      stats.value.activeMemberships++
    }
  } catch (error) {
    showError('Error al aprobar la membresía')
  }
}

const rejectMembership = async (membershipId) => {
  try {
    // Simular llamada a API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Remover de la lista
    const index = pendingMemberships.value.findIndex(m => m.id === membershipId)
    if (index > -1) {
      const membership = pendingMemberships.value[index]
      pendingMemberships.value.splice(index, 1)
      showSuccess('Membresía rechazada', `La membresía de ${membership.userName} ha sido rechazada`)
    }
  } catch (error) {
    showError('Error al rechazar la membresía')
  }
}

const assignTechnician = (serviceId) => {
  selectedServiceId.value = serviceId
  showAssignmentModal.value = true
}

const selectTechnician = async (technicianId) => {
  try {
    // Simular asignación
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const service = pendingServices.value.find(s => s.id === selectedServiceId.value)
    const technician = availableTechnicians.value.find(t => t.id === technicianId)
    
    if (service && technician) {
      // Remover servicio de pendientes
      const index = pendingServices.value.findIndex(s => s.id === selectedServiceId.value)
      pendingServices.value.splice(index, 1)
      
      showSuccess('Técnico asignado', `${technician.name} ha sido asignado al servicio de ${service.client}`)
      
      // Actualizar estadísticas
      stats.value.pendingServices--
    }
    
    showAssignmentModal.value = false
    selectedServiceId.value = null
  } catch (error) {
    showError('Error al asignar técnico')
  }
}

const viewServiceDetails = (serviceId) => {
  showInfo(`Ver detalles del servicio #${serviceId}`)
}

const refreshPendingItems = async () => {
  try {
    // Simular recarga de datos
    await new Promise(resolve => setTimeout(resolve, 1500))
    showSuccess('Datos actualizados')
  } catch (error) {
    showError('Error al actualizar los datos')
  }
}

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

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

const showSuccess = (title, message) => {
  const toastMessage = message ? `${title}\n${message}` : title
  
  showToast({
    message: toastMessage,
    type: 'success',
    duration: 5000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  
  showToast({
    message: typeof message === 'string' ? message : 'Ocurrió un error inesperado',
    type: 'error',
    duration: 8000
  })
}

const showInfo = (message) => {
  showToast({
    message,
    type: 'info',
    duration: 5000
  })
}

// =========================
// INICIALIZACIÓN
// =========================

onMounted(async () => {
  try {
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Aquí cargarías los datos reales desde las APIs
    // await loadDashboardData()
    
  } catch (error) {
    console.error('Error al cargar el dashboard:', error)
    showError('Error al cargar los datos del dashboard')
  } finally {
    isLoading.value = false
  }
})

// Dark mode support
onMounted(() => {
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
/* Animaciones para modales */
.backdrop-enter-active {
  transition: opacity 0.3s ease-out;
}

.backdrop-leave-active {
  transition: opacity 0.2s ease-in;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.modal-content-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Estilos generales */
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
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
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