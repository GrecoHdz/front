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
      :message="'Cargando programa de referidos...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderReferir />

      <!-- Content Container with max-w-2xl -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Hero Section -->
            <section class="px-6 py-6">
              <div class="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-3xl p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                
                <div class="relative text-center">
                  <div class="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span class="text-4xl">💰</span>
                  </div>
                  <h1 class="text-3xl font-black mb-3">¡Gana Dinero Refiriendo!</h1>
                  <p class="text-white/90 font-medium mb-6">
                    Invita a tus amigos y familiares a HogarSeguro y recibe <span class="font-black">L. {{ referralReward }}</span> por cada persona que se una
                  </p>
                  
                  <!-- Stats -->
                  <div class="grid grid-cols-3 gap-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                      <div class="text-2xl font-black">{{ stats.totalReferrals }}</div>
                      <div class="text-xs text-white/80">Referidos</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                      <div class="text-2xl font-black">L. {{ stats.totalEarnings.toLocaleString('es-HN') }}</div>
                      <div class="text-xs text-white/80">Ganado</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                      <div class="text-2xl font-black">L. {{ stats.availableBalance.toLocaleString('es-HN') }}</div>
                      <div class="text-xs text-white/80">Disponible</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tu Código de Referido -->
            <section class="px-6 mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div class="text-center mb-6">
                  <div class="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span class="text-white text-2xl">🔗</span>
                  </div>
                  <h2 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Tu Código de Referido</h2>
                  <p class="text-gray-600 dark:text-gray-400">Comparte tu código único y empieza a ganar</p>
                </div>

                <!-- Código -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl mb-4 border border-blue-200 dark:border-blue-800">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">TU CÓDIGO</p>
                      <p class="text-2xl font-black text-blue-800 dark:text-blue-200 font-mono">{{ userReferralCode }}</p>
                    </div>
                    <button 
                      @click="copyReferralCode"
                      class="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Enlace de referido -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl mb-6">
                  <p class="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">ENLACE DE INVITACIÓN</p>
                  <div class="flex items-center space-x-3">
                    <div class="flex-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <p class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ referralLink }}</p>
                    </div>
                    <button 
                      @click="copyReferralLink"
                      class="bg-gray-500 hover:bg-gray-600 text-white p-3 rounded-xl transition-all duration-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Botones de compartir -->
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="shareWhatsApp"
                    class="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <span class="text-xl">📱</span>
                    <span class="font-bold">WhatsApp</span>
                  </button>
                  <button 
                    @click="shareGeneral"
                    class="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <span class="text-xl">🔗</span>
                    <span class="font-bold">Compartir</span>
                  </button>
                </div>
              </div>
            </section>

            <!-- Cómo Funciona -->
            <section class="px-6 mb-6">
              <h2 class="text-xl font-black text-gray-900 dark:text-white mb-4">¿Cómo Funciona?</h2>
              <div class="space-y-3">
                <div v-for="(step, index) in howItWorksSteps" :key="`step-${index}`"
                     class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-start space-x-4">
                    <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span class="text-white font-black text-sm">{{ index + 1 }}</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{{ step.title }}</h3>
                      <p class="text-gray-600 dark:text-gray-400 text-sm">{{ step.description }}</p>
                    </div>
                    <div class="text-2xl">{{ step.icon }}</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Retirar Ganancias -->
            <section v-if="stats.availableBalance > 0" class="px-6 mb-6">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white relative overflow-hidden">
                <div class="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div class="relative">
                  <div class="flex items-center space-x-4 mb-4">
                    <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <span class="text-white text-2xl">💳</span>
                    </div>
                    <div>
                      <h2 class="text-2xl font-black">Retirar Ganancias</h2>
                      <p class="text-white/90">Disponible: L. {{ stats.availableBalance.toLocaleString('es-HN') }}</p>
                    </div>
                  </div>
                  
                  <button 
                    @click="showWithdrawModal = true"
                    :disabled="stats.availableBalance < minWithdrawAmount"
                    class="w-full py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-black text-lg rounded-xl transition-all duration-300 hover:bg-white/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {{ stats.availableBalance >= minWithdrawAmount ? 'Retirar Ahora' : `Mínimo L. ${minWithdrawAmount.toLocaleString('es-HN')}` }}
                  </button>
                </div>
              </div>
            </section>

            <!-- Historial de Referidos -->
            <section class="px-6 mb-6">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-black text-gray-900 dark:text-white">Tus Referidos</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ referralHistory.length }} personas</span>
              </div>
              
              <div v-if="referralHistory.length === 0" class="text-center py-8">
                <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span class="text-3xl">👥</span>
                </div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">Aún no tienes referidos</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">Comparte tu código y empieza a ganar dinero</p>
              </div>

              <div v-else class="space-y-3">
                <div v-for="referral in displayedReferrals" :key="`referral-${referral.id}`"
                     class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                        <span class="text-white text-xl">👤</span>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 dark:text-white">{{ referral.name }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">{{ formatDate(referral.date) }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="flex items-center space-x-2">
                        <span class="text-xs font-bold px-2.5 py-1 rounded-full"
                              :class="getReferralStatusColor(referral.status)">
                          {{ referral.status }}
                        </span>
                        <span v-if="referral.status === 'Completado'" class="text-green-600 dark:text-green-400 font-bold text-sm">
                          +L. {{ referral.reward.toLocaleString('es-HN') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Ver más botón -->
                <button v-if="referralHistory.length > 5 && !showAllReferrals" 
                        @click="showAllReferrals = true"
                        class="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Ver todos ({{ referralHistory.length - 5 }} más)
                </button>
              </div>
            </section>

            <!-- Términos y Condiciones -->
            <section class="px-6 mb-6">
              <div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                <div class="flex items-start space-x-3">
                  <div class="text-amber-500 text-xl flex-shrink-0">📋</div>
                  <div>
                    <h3 class="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">Términos del Programa</h3>
                    <ul class="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                      <li v-for="term in referralTerms" :key="term" class="flex items-start space-x-2">
                        <span class="text-amber-500 text-xs mt-0.5">•</span>
                        <span>{{ term }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <FootersFooter />
    </div>

    <!-- Modal de Retiro -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showWithdrawModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showWithdrawModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeWithdrawModal"
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
            v-if="showWithdrawModal"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-lg">
                    💳
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">Retirar Ganancias</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Disponible: L. {{ stats.availableBalance.toLocaleString('es-HN') }}</p>
                  </div>
                </div>
                <button @click="closeWithdrawModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <form @submit.prevent="processWithdraw" class="space-y-4">
                <!-- Monto -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Monto a retirar
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">L.</span>
                    <input
                      v-model="withdrawForm.amount"
                      type="number"
                      :min="minWithdrawAmount"
                      :max="stats.availableBalance"
                      class="w-full pl-8 pr-4 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                      placeholder="0.00"
                    >
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mínimo: L. {{ minWithdrawAmount.toLocaleString('es-HN') }}
                  </p>
                </div>

                <!-- Método de pago -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Método de pago
                  </label>
                  <select 
                    v-model="withdrawForm.method"
                    class="w-full px-4 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled>Selecciona un método</option>
                    <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
                      {{ method.label }}
                    </option>
                  </select>
                </div>

                <!-- Detalles del método -->
                <div v-if="withdrawForm.method">
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {{ getPaymentMethodLabel }}
                  </label>
                  <input
                    v-model="withdrawForm.details"
                    type="text"
                    class="w-full px-4 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    :placeholder="getPaymentMethodPlaceholder"
                  >
                </div>

                <!-- Botón de envío -->
                <button 
                  type="submit"
                  :disabled="!isWithdrawFormValid || isProcessingWithdraw"
                  class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="!isProcessingWithdraw">
                    Solicitar Retiro
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                </button>
              </form>
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
  title: 'HogarSeguro - Programa de Referidos',
  meta: [
    { name: 'description', content: 'Gana dinero refiriendo amigos a HogarSeguro - Programa de referidos' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Pasos de cómo funciona
const howItWorksSteps = [
  {
    title: 'Comparte tu código',
    description: 'Envía tu código único a amigos y familiares',
    icon: '📱'
  },
  {
    title: 'Ellos se registran',
    description: 'Tus contactos se registran usando tu código de referido',
    icon: '✍️'
  },
  {
    title: 'Contratan un servicio',
    description: 'Cuando soliciten su primer servicio, ambos ganan',
    icon: '🏠'
  },
  {
    title: 'Recibes tu recompensa',
    description: 'Ganas dinero que puedes retirar inmediatamente',
    icon: '💰'
  }
]

// Términos del programa
const referralTerms = [
  'Recibes L. 50 por cada persona que se registre con tu código',
  'El pago se realiza cuando tu referido complete su primer servicio',
  'Puedes retirar tus ganancias con un mínimo de L. 100',
  'Los retiros se procesan en 24-48 horas hábiles',
  'No hay límite en la cantidad de personas que puedes referir'
]

// Métodos de pago
const paymentMethods = [
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'mobile_money', label: 'Billetera Móvil' },
  { value: 'cash_pickup', label: 'Retiro en Efectivo' }
]

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga
const isLoading = ref(true)

// Datos del usuario
const userData = ref({
  id: null,
  identidad: '',
  nombre: 'Invitado',
  email: '',
  ...(userCookie.value || {})
})

// Configuración del programa
const referralReward = ref(50)
const minWithdrawAmount = ref(100)

// Estadísticas
const stats = ref({
  totalReferrals: 5,
  totalEarnings: 250,
  availableBalance: 150
})

// Código de referido del usuario
const userReferralCode = ref('')

// Estados de modales
const showWithdrawModal = ref(false)

// Estados de formularios
const withdrawForm = ref({
  amount: '',
  method: '',
  details: ''
})
const isProcessingWithdraw = ref(false)

// Estados de vista
const showAllReferrals = ref(false)

// Historial de referidos (datos de ejemplo)
const referralHistory = ref([
  {
    id: 1,
    name: 'María González',
    date: '2024-12-15',
    status: 'Completado',
    reward: 50
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    date: '2024-12-12',
    status: 'Pendiente',
    reward: 50
  },
  {
    id: 3,
    name: 'Ana López',
    date: '2024-12-10',
    status: 'Completado',
    reward: 50
  },
  {
    id: 4,
    name: 'Luis Martínez',
    date: '2024-12-08',
    status: 'Completado',
    reward: 50
  },
  {
    id: 5,
    name: 'Carmen Flores',
    date: '2024-12-05',
    status: 'Completado',
    reward: 50
  },
  {
    id: 6,
    name: 'Roberto Silva',
    date: '2024-12-01',
    status: 'Completado',
    reward: 50
  }
])

// Estados de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// =========================
// COMPUTED PROPERTIES
// =========================

const referralLink = computed(() => {
  return `https://hogarseguro.hn/registro?ref=${userReferralCode.value}`
})

const displayedReferrals = computed(() => {
  return showAllReferrals.value ? referralHistory.value : referralHistory.value.slice(0, 5)
})

const isWithdrawFormValid = computed(() => {
  return withdrawForm.value.amount && 
         withdrawForm.value.method && 
         withdrawForm.value.details &&
         parseFloat(withdrawForm.value.amount) >= minWithdrawAmount.value &&
         parseFloat(withdrawForm.value.amount) <= stats.value.availableBalance
})

const getPaymentMethodLabel = computed(() => {
  const method = paymentMethods.find(m => m.value === withdrawForm.value.method)
  switch (withdrawForm.value.method) {
    case 'bank_transfer':
      return 'Número de cuenta bancaria'
    case 'mobile_money':
      return 'Número de teléfono'
    case 'cash_pickup':
      return 'Número de identidad'
    default:
      return 'Detalles'
  }
})

const getPaymentMethodPlaceholder = computed(() => {
  switch (withdrawForm.value.method) {
    case 'bank_transfer':
      return 'Ej: 1234567890'
    case 'mobile_money':
      return 'Ej: +504 9999-9999'
    case 'cash_pickup':
      return 'Ej: 0801-1990-12345'
    default:
      return 'Ingresa los detalles'
  }
})

// =========================
// FUNCIONES UTILITARIAS
// =========================

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getReferralStatusColor = (status) => {
  const colors = {
    'Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Pendiente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

// =========================
// FUNCIONES DE CARGA DE DATOS
// =========================

const loadReferralData = async () => {
  try {
    const user = useCookie('user').value
    if (!user?.id_usuario) return

    // Cargar datos del programa de referidos del usuario
    // const response = await $fetch(`/referidos/usuario/${user.id_usuario}`, {
    //   baseURL: config.public.apiBase,
    //   headers: {
    //     'Authorization': `Bearer ${auth.token}`
    //   }
    // })

    // Simular datos mientras no tengamos la API
    userReferralCode.value = `HR${user.id_usuario.toString().padStart(6, '0')}`
    
  } catch (error) {
    console.error('Error al cargar datos de referidos:', error)
    // Generar código de respaldo
    const user = useCookie('user').value
    userReferralCode.value = user?.id_usuario ? `HR${user.id_usuario.toString().padStart(6, '0')}` : 'HR000001'
  }
}

// =========================
// FUNCIONES DE COMPARTIR
// =========================

const copyReferralCode = async () => {
  try {
    await navigator.clipboard.writeText(userReferralCode.value)
    showSuccess('¡Código copiado!', 'El código se copió al portapapeles')
  } catch (error) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = userReferralCode.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showSuccess('¡Código copiado!', 'El código se copió al portapapeles')
  }
}

const copyReferralLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    showSuccess('¡Enlace copiado!', 'El enlace se copió al portapapeles')
  } catch (error) {
    const textArea = document.createElement('textarea')
    textArea.value = referralLink.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showSuccess('¡Enlace copiado!', 'El enlace se copió al portapapeles')
  }
}

const shareWhatsApp = () => {
  const message = `¡Hola! 👋 Te invito a conocer HogarSeguro, el mejor servicio de reparaciones para tu hogar. 

🏠 Servicios profesionales
💰 Precios justos
⚡ Atención rápida

Usa mi código de referido: ${userReferralCode.value}

Regístrate aquí: ${referralLink.value}

¡Ambos ganamos cuando te registres! 🎉`

  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
}

const shareGeneral = async () => {
  const shareData = {
    title: 'HogarSeguro - Servicios para tu hogar',
    text: `¡Únete a HogarSeguro con mi código ${userReferralCode.value} y ambos ganamos!`,
    url: referralLink.value
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (error) {
      copyReferralLink()
    }
  } else {
    copyReferralLink()
  }
}

// =========================
// FUNCIONES DE MODALES
// =========================

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
  withdrawForm.value = {
    amount: '',
    method: '',
    details: ''
  }
}

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

const processWithdraw = async () => {
  try {
    isProcessingWithdraw.value = true
    
    const amount = parseFloat(withdrawForm.value.amount)
    
    if (amount < minWithdrawAmount.value) {
      throw new Error(`El monto mínimo es L. ${minWithdrawAmount.value}`)
    }
    
    if (amount > stats.value.availableBalance) {
      throw new Error('Monto superior al saldo disponible')
    }

    // Simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí iría la llamada real a la API
    // const response = await $fetch('/referidos/retirar', {
    //   method: 'POST',
    //   baseURL: config.public.apiBase,
    //   headers: {
    //     'Authorization': `Bearer ${auth.token}`
    //   },
    //   body: {
    //     amount: amount,
    //     method: withdrawForm.value.method,
    //     details: withdrawForm.value.details
    //   }
    // })

    // Actualizar balance localmente
    stats.value.availableBalance -= amount
    
    showSuccess('¡Retiro solicitado!', 'Tu solicitud se procesará en 24-48 horas')
    closeWithdrawModal()
    
  } catch (error) {
    console.error('Error al procesar retiro:', error)
    showError(error.message || 'Error al procesar el retiro')
  } finally {
    isProcessingWithdraw.value = false
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
      message: options.message || options.title,
      type: options.type || 'info',
      duration: options.duration || 5000
    }
  })
}

const showSuccess = (title, message) => {
  showToast({
    type: 'success',
    message: message ? `${title}\n${message}` : title,
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

// =========================
// INICIALIZACIÓN
// =========================

onMounted(async () => {
  try {
    await loadReferralData()
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    showError('Error al cargar los datos. Por favor, recargue la página.')
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
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
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

/* Animaciones adicionales */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Force mobile layout */
body {
  overflow-x: hidden;
}

.fixed.inset-0 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
 