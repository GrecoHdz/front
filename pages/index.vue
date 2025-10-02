<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile Header -->
    <header class="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>
      
      <div class="relative px-6 py-6">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span class="text-emerald-600 font-bold text-lg">🏠</span>
                </div>
              </div>
            </div>
            <div>
              <h1 class="text-2xl font-black text-white tracking-tight">
                HogarSeguro
              </h1>
              <p class="text-emerald-100 text-sm font-medium">Tu casa es tu refugio</p>
            </div>
          </div>
          <button 
            @click="showLoginModal = true"
            class="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/30 transition-all duration-300"
          >
            Ingresar
          </button>
        </div>

        <!-- Hero Content -->
        <div class="text-center text-white">
          <h2 class="text-4xl font-black mb-4 leading-tight">
            Tu casa es tu<br>
            <span class="text-yellow-300">refugio</span>
          </h2>
          <p class="text-xl text-emerald-100 font-medium mb-6">
            Pero cuando algo se arruina<br>el estrés comienza...
          </p>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative -mt-6 pb-28">
      
      <!-- Problem Cards -->
      <section class="px-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 border border-gray-100 dark:border-gray-700">
          <div class="grid grid-cols-2 gap-4">
            <div v-for="problem in problems" :key="problem.id" 
                 class="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800">
              <div class="text-3xl mb-2">{{ problem.icon }}</div>
              <p class="text-red-700 dark:text-red-300 text-sm font-semibold text-center">{{ problem.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Solution Statement -->
      <section class="px-6 mb-8">
        <div class="text-center"> 
          <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed px-4">
            <strong class="text-emerald-600 dark:text-emerald-400">HogarSeguro</strong> es la primera plataforma en Honduras que te da 
            <span class="font-bold text-gray-900 dark:text-white">mantenimiento, descuentos y asistencia técnica</span> 
            en un solo lugar, a cambio de una membresía mensual accesible.
          </p>
        </div>
      </section>

      <!-- Pricing Hero -->
      <section class="px-6 mb-8">
        <div class="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
          <!-- Background decoration -->
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          
          <div class="relative text-center">
            <div class="text-6xl mb-4">🎁</div>
            <h3 class="text-2xl font-black mb-2">¿Qué recibís como miembro?</h3>
            <div class="flex items-center justify-center space-x-3 mb-6">
              <span class="text-lg opacity-90">Por solo</span>
              <div class="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                <span class="text-4xl font-black text-yellow-300">L. 250</span>
                <span class="text-lg opacity-90 ml-2">/mes</span>
              </div>
            </div>
            <p class="text-lg opacity-90 font-medium">obtendrás increíbles beneficios:</p>
          </div>
        </div>
      </section>

      <!-- Benefits Grid -->
      <section class="px-6 mb-8">
        <div class="space-y-4">
          <div v-for="(benefit, index) in membershipBenefits" :key="benefit.id" 
               class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
               :class="getCardColor(index)">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg" 
                     :class="getIconBg(index)">
                  {{ index + 1 }}
                </div>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  {{ benefit.title }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-2">
                  {{ benefit.description }}
                </p>
                <div v-if="benefit.savings" class="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                  💰 {{ benefit.savings }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile App Feature -->
      <section class="px-6 mb-8">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div class="relative">
            <div class="flex items-center space-x-3 mb-4">
              <div class="text-4xl">📱</div>
              <h4 class="font-black text-xl">Todo desde tu celular</h4>
            </div>
            <p class="text-blue-100 leading-relaxed">
              Solicitá cualquier servicio con solo <span class="font-bold text-yellow-300">3 clics</span>. 
              Recibí confirmación, técnico asignado y seguimiento en tiempo real.
            </p>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section class="px-6 mb-8">
        <div class="text-center mb-6">
          <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-2">
            ¿Qué servicios cubrimos?
          </h3>
          <div class="text-4xl mb-4">🛠️</div>
        </div>
        <div class="grid grid-cols-1 gap-4">
          <div v-for="service in services" :key="service.id"
               class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300">
                {{ service.icon }}
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {{ service.name }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  {{ service.description }}
                </p>
              </div>
              <div class="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- No Emergencies Section -->
      <section class="px-4 py-6">
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div class="text-center mb-4">
            <h3 class="text-xl font-bold mb-2">🧠 ¿Y si no tengo emergencias?</h3>
            <p class="text-lg font-semibold">¡Mucho mejor!</p>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex items-start space-x-2">
              <span>✨</span>
              <span>Tu membresía no se pierde. Cada mes acumula como crédito.</span>
            </div>
            <div class="flex items-start space-x-2">
              <span>💰</span>
              <span>Si después de 3 meses querés hacer una reparación de L. 750, podés cubrirla con tus créditos acumulados.</span>
            </div>
            <div class="flex items-start space-x-2">
              <span>🏦</span>
              <span>Es como un seguro que se convierte en ahorro real.</span>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="px-6 mb-8">
        <div class="text-center mb-6">
          <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-2">
            ¿Cómo funciona?
          </h3>
          <div class="text-4xl">🚀</div>
        </div>
        <div class="space-y-4">
          <div v-for="(step, index) in howItWorks" :key="step.id"
               class="relative bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0 relative">
                <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {{ index + 1 }}
                </div>
                <div v-if="index < howItWorks.length - 1" class="absolute top-12 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-b from-emerald-500 to-transparent"></div>
              </div>
              <div class="flex-1 pt-2">
                <h4 class="font-bold text-gray-900 dark:text-white mb-1">
                  {{ step.title }}
                </h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- No Membership Warning -->
      <section class="px-6 mb-8">
        <div class="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div class="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full"></div>
          <div class="relative">
            <h3 class="text-xl font-black mb-4 flex items-center space-x-2">
              <span>💬</span>
              <span>¿Y si no quiero pagar membresía?</span>
            </h3>
            <p class="text-pink-100 mb-4">Podés usar la app sin membresía, pero:</p>
            <div class="space-y-3">
              <div v-for="limitation in noMembershipLimitations" :key="limitation.id" 
                   class="flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                <span class="text-yellow-300 text-lg">{{ limitation.icon }}</span>
                <span class="text-sm">{{ limitation.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="px-6 mb-8">
        <div class="text-center mb-6">
          <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-2">
            ¿Por qué confiar en nosotros?
          </h3>
          <div class="text-4xl">🛡️</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div class="grid grid-cols-1 gap-4">
            <div v-for="trust in trustFeatures" :key="trust.id" 
                 class="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl">
                {{ trust.icon }}
              </div>
              <span class="font-semibold text-gray-900 dark:text-white">{{ trust.title }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="px-6 mb-8">
        <div class="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
          <div class="relative text-center">
            <div class="text-5xl mb-4">🔐</div>
            <h3 class="text-2xl font-black mb-4">En resumen...</h3>
            <div class="text-xl font-bold mb-6 text-yellow-300">
              HogarSeguro = Tranquilidad + Ahorro + Comodidad
            </div>
            <div class="space-y-3 mb-8 text-sm">
              <div class="flex items-center space-x-3 justify-center">
                <span class="text-green-400 text-lg">✔️</span>
                <span>Nunca más busqués técnicos por Facebook sin saber si son buenos</span>
              </div>
              <div class="flex items-center space-x-3 justify-center">
                <span class="text-green-400 text-lg">✔️</span>
                <span>No esperés días por una cita</span>
              </div>
              <div class="flex items-center space-x-3 justify-center">
                <span class="text-green-400 text-lg">✔️</span>
                <span>Protegé tu casa como se merece</span>
              </div>
            </div>
            <button 
              @click="showLoginModal = true"
              class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Unirme a HogarSeguro
            </button>
          </div>
        </div>
      </section>
    </main>
 

    <!-- Login/Register Modal -->
    <!-- Overlay de carga mientras se verifica la autenticación -->
<LoadingSpinner 
  v-if="isCheckingAuth"
  :loading="true" 
  class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
/>

<!-- Modal de Login/Registro -->
<div v-if="showLoginModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto">
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span class="text-white text-2xl">🏠</span>
            </div>
            <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {{ isLogin ? 'Bienvenido de vuelta' : 'Únete a HogarSeguro' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ isLogin ? 'Ingresa a tu cuenta' : 'Crea tu cuenta gratuita' }}
            </p>
          </div>

          <form @submit.prevent="handleAuth" class="space-y-6" :autocomplete="isLogin ? 'on' : 'on'">
            <!-- Campos adicionales para registro -->
            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input 
                v-model="form.nombre"
                type="text" 
                class="w-full px-4 py-4 text-base border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="formErrors.nombre ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                placeholder="Tu nombre completo"
                :required="!isLogin"
                autocomplete="name"
                @input="form.nombre = form.nombre.replace(/[0-9]/g, ''); formErrors.nombre = ''"
                @keydown="preventNumberInput"
              />
            </div>

            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input 
                v-model="form.email"
                type="email" 
                class="w-full px-4 py-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="tu@email.com"
                :required="!isLogin"
                autocomplete="email"
              />
            </div>

            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input 
                v-model="form.telefono"
                type="tel" 
                class="w-full px-4 py-4 text-base border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="{'border-red-500': formErrors.telefono, 'border-gray-200 dark:border-gray-600': !formErrors.telefono}"
                placeholder="Ej: +504 9999-9999"
                :required="!isLogin"
                autocomplete="tel"
                @input="form.telefono = form.telefono.replace(/[^0-9+\s-]/g, ''); formErrors.telefono = ''"
                @keydown="preventLetterInput"
              />
            </div>

            <div v-if="!isLogin" class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">Ciudad</label>
              <div class="relative">
                <select
                  v-model="form.ciudad"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white appearance-none pr-10"
                  required
                >
                  <option value="" disabled>Selecciona una ciudad</option>
                  <option v-for="ciudad in ciudades" :key="ciudad.id" :value="ciudad.nombre">
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

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Número de Identidad
              </label>
              <input 
                v-model="form.identidad"
                type="text" 
                class="w-full px-4 py-4 text-base border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="formErrors.identidad ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                placeholder="Ej: 0801199912345"
                required
                autocomplete="username"
                @input="form.identidad = form.identidad.replace(/\D/g, ''); formErrors.identidad = ''"
                @keydown="preventLetterInput"
                maxlength="15"
                minlength="13"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input 
                v-model="form.password"
                type="password" 
                class="w-full px-4 py-4 text-base border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="formErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                :placeholder="isLogin ? 'Ingresa tu contraseña' : 'Crea una contraseña segura'"
                required
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                @input="formErrors.password = ''"
              />
              <p v-if="formErrors.password" class="mt-1 text-sm text-red-500">{{ formErrors.password }}</p>
            </div>

            <button 
              type="submit"
              class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {{ isLogin ? '🚀 Ingresar' : '✨ Crear Cuenta' }}
            </button>
          </form>

          <div class="mt-8 text-center">
            <button 
              @click="isLogin = !isLogin"
              class="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-all duration-200"
            >
              {{ isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión' }}
            </button>
          </div>

          <div class="mt-6 text-center">
            <button 
              @click="showLoginModal = false" 
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
 
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <LoadingSpinner 
      v-if="isLoading || authStatus"
      :loading="isLoading"
      :success="authStatus === 'success'"
      :error="authStatus === 'error'"
      :message="loadingMessage"
      :error-message="authStatus === 'error' ? loadingMessage : ''"
    />

    <!-- Toast Notification -->
    <Toast 
      v-if="toast.show"
      ref="toastRef"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { navigateTo } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import Toast from '~/components/ui/Toast.vue';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';

// API base URL
const config = useRuntimeConfig()
const apiBase = config.public.apiBase

// Reactive data
const showLoginModal = ref(false)
const showSuccess = ref(false)
const isLogin = ref(true)
const isLoading = ref(true) // Iniciar en true para mostrar el spinner mientras se verifica la autenticación
const isCheckingAuth = ref(true) // Nuevo estado para controlar la verificación de autenticación
const authStatus = ref('') // '', 'success', 'error'
const formErrors = ref({})

// Validation functions
const validateForm = () => {
  const errors = {}
  
  if (!isLogin.value) {
    // Validar nombre completo (mínimo 2 palabras)
    if (!form.value.nombre || form.value.nombre.trim().split(' ').filter(Boolean).length < 2) {
      errors.nombre = 'Por favor ingresa tu nombre completo (mínimo 2 palabras)'
    }
    
    // Validar teléfono (código de país + número)
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/
    if (!form.value.telefono || !phoneRegex.test(form.value.telefono)) {
      errors.telefono = 'Ingresa un número de teléfono válido (ej: +504 9999-9999)'
    }
    
    // Validar número de identidad (13 dígitos)
    const identidadRegex = /^\d{13}$/
    if (!identidadRegex.test(form.value.identidad)) {
      errors.identidad = 'El número de identidad debe tener 13 dígitos'
    }
  }
  
  // Validar contraseña (mínimo 6 caracteres)
  if (form.value.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Estado para el número de teléfono
const phoneNumber = ref('')

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
        id: ciudad.id_ciudad,
        nombre: ciudad.nombre_ciudad
      }))
    }
  } catch (error) { 
  }
}

// Verificar autenticación al cargar la página
const checkAuthStatus = async () => {
  try {
    const authStore = useAuthStore()
    const isAuthenticated = await authStore.checkAuth()
    
    if (isAuthenticated) {
      // Si está autenticado, redirigir al dashboard correspondiente
      const dashboardPath = '/cliente/DashboardCliente' // Ruta por defecto
      navigateTo(dashboardPath, { replace: true })
    }
  } catch (error) { 
  } finally {
    isCheckingAuth.value = false
    isLoading.value = false
  }
}

// Cargar ciudades y verificar autenticación al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarCiudades(),
    checkAuthStatus()
  ])
  
  // Código existente para el modo oscuro
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
})

const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  identidad: '',
  password: '',
  confirmPassword: '',
  ciudad: ''
})

// Mock data for login
const mockUsers = [
  { email: 'cliente@test.com', password: '123456', role: 'cliente', name: 'Juan Pérez' },
  { email: 'tecnico@test.com', password: '123456', role: 'tecnico', name: 'Carlos López' },
  { email: 'admin@test.com', password: '123456', role: 'admin', name: 'Admin HogarSeguro' }
]

// Problems data
const problems = [
  { id: 1, icon: '💧', text: 'Una fuga de agua' },
  { id: 2, icon: '❄️', text: 'El aire deja de enfriar' },
  { id: 3, icon: '⚡', text: 'Se va la luz' },
  { id: 4, icon: '🧺', text: 'Se daña la lavadora' }
]

// Complete membership benefits data
const membershipBenefits = [
  {
    id: 1,
    title: 'Visita técnica gratis',
    description: 'Olvídate de pagar L. 150 cada vez: te enviamos al técnico sin costo.',
    savings: 'Ahorro: L. 150 por visita'
  },
  {
    id: 2,
    title: '10% de descuento en todos los servicios',
    description: 'Descuento aplicado automáticamente en cualquier trabajo.',
    savings: ''
  },
  {
    id: 3,
    title: 'Crédito acumulable',
    description: 'A los 2 meses, lo abonado en membresía se convierte en saldo a tu favor para tu próximo servicio.',
    savings: ''
  },
  {
    id: 4,
    title: 'Limpieza de aire gratis',
    description: 'Al 3er mes, disfruta de una limpieza profesional de tu aire acondicionado sin pagar mano de obra. Tu aire funcionará mejor, consumirá menos energía y te evitará reparaciones costosas.',
    savings: ''
  },
  {
    id: 5,
    title: 'Mano de obra 100% gratuita',
    description: 'Al 6to mes, tu mano de obra no cuesta nada: solo cubres materiales si los hay.',
    savings: ''
  },
  {
    id: 6,
    title: 'Atención prioritaria',
    description: '¿Emergencia en casa? ¡Te atendemos antes que a los demás!',
    savings: ''
  }
]

// Complete services data
const services = [
  { 
    id: 1, 
    name: 'Fontanería', 
    description: 'fugas, grifos, tuberías', 
    icon: '🔧' 
  },
  { 
    id: 2, 
    name: 'Electricidad residencial', 
    description: 'apagones, instalación de lámparas, breakers', 
    icon: '💡' 
  },
  { 
    id: 3, 
    name: 'Cámaras de seguridad', 
    description: 'instalación y mantenimiento', 
    icon: '🎥' 
  },
  { 
    id: 4, 
    name: 'Aires acondicionados', 
    description: 'limpieza, reparación, instalación', 
    icon: '❄️' 
  },
  { 
    id: 5, 
    name: 'Electrodomésticos', 
    description: 'lavadoras, refris, estufas, secadoras', 
    icon: '🧊' 
  },
  { 
    id: 6, 
    name: 'Pintura', 
    description: 'mantenimiento de interiores y exteriores', 
    icon: '🎨' 
  }
]

// How it works data
const howItWorks = [
  { id: 1, title: 'Registrate en la plataforma (gratis)', description: 'Crea tu cuenta sin costo alguno' },
  { id: 2, title: 'Elegí si querés pagar la membresía mensual', description: 'Decide si quieres los beneficios de membresía' },
  { id: 3, title: 'Accedé a todos los beneficios desde el primer día', description: 'Disfruta inmediatamente de las ventajas' },
  { id: 4, title: 'Solicitá servicios cuando los necesités', description: 'Pide ayuda cuando tu hogar lo requiera' },
  { id: 5, title: 'Acumulá crédito mes a mes si no lo usás', description: 'Tu dinero se convierte en ahorro real' }
]

// No membership limitations
const noMembershipLimitations = [
  { id: 1, icon: '❌', text: 'Los precios serán más altos' },
  { id: 2, icon: '❌', text: 'No tenés limpieza gratis' },
  { id: 3, icon: '❌', text: 'Pagás por cada visita técnica, incluso si no se hace el trabajo' }
]

// Trust features data
const trustFeatures = [
  { id: 1, title: 'Técnicos verificados y capacitados', icon: '✅' },
  { id: 2, title: 'Garantía de servicio en todos los trabajos', icon: '🛡️' },
  { id: 3, title: 'Fotos y calificaciones de cada técnico antes de agendar', icon: '⭐' },
  { id: 4, title: 'Registro de todo tu historial de servicios', icon: '📋' },
  { id: 5, title: 'Soporte directo desde la app o WhatsApp', icon: '📞' }
]

// Helper functions for styling
const getCardColor = (index) => {
  const colors = [
    'border-l-4 border-l-blue-500',
    'border-l-4 border-l-green-500',
    'border-l-4 border-l-purple-500',
    'border-l-4 border-l-orange-500',
    'border-l-4 border-l-pink-500',
    'border-l-4 border-l-teal-500'
  ]
  return colors[index % colors.length]
}

const getIconBg = (index) => {
  const bgs = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-teal-500'
  ]
  return bgs[index % bgs.length]
}

// Methods
// Obtener instancia del store de autenticación
const authStore = useAuthStore()

const handleAuth = async () => {
  // Resetear estado
  authStatus.value = ''
  formErrors.value = {}
  
  // Validar formulario
  if (!validateForm()) {
    showToast('Por favor completa correctamente todos los campos', 'error')
    return
  }
  
  // Validar formato de identidad (min 13 dígitos max 15 dígitos)
  if (form.value.identidad && !/^\d{13,15}$/.test(form.value.identidad)) {
    showToast('El número de identidad debe tener entre 13 y 15 dígitos', 'error')
    return
  }
  
  isLoading.value = true
  
  try {
    if (isLogin.value) {
      // Lógica de login
      try {
        // Usar el store de autenticación para el login
        const loginResult = await authStore.login({
          identidad: form.value.identidad,
          password: form.value.password
        }); 
        
        if (loginResult?.success) {
          // Mostrar estado de éxito en el spinner
          authStatus.value = 'success';
          
          // Esperar para mostrar el estado de éxito
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Cerrar modal y redirigir
          showLoginModal.value = false;
          showSuccess.value = true;
          
          // Redirigir al dashboard según el rol
          const userRole = authStore.userRole;
          if (userRole === 'admin') {
            navigateTo('/admin/DashboardAdmin');
          } else if (userRole === 'tecnico') {
            navigateTo('/tecnico/DashboardTecnico');
          } else {
            navigateTo('/cliente/DashboardCliente');
          }
        } else {
          throw new Error(loginResult?.error || 'Error en las credenciales');
        }
      } catch (loginError) {
        authStatus.value = 'error';
        const errorMessage = loginError.response?._data?.message || loginError.message || 'Error de autenticación';
        loadingMessage.value = errorMessage;
        
        setTimeout(() => {
          isLoading.value = false;
          authStatus.value = '';
          loadingMessage.value = '';
        }, 5000);
        return;
      }
    } else {
      // Lógica de registro
      try {
        const registerData = {
          nombre: form.value.nombre,
          email: form.value.email,
          telefono: form.value.telefono,
          identidad: form.value.identidad,
          password_hash: form.value.password, // Cambiado de password a password_hash
          id_ciudad: ciudades.value.find(c => c.nombre === form.value.ciudad)?.id || 1
        }; 
        
        // Realizar la petición de registro directamente en el componente
        const response = await fetch(`${apiBase}/usuarios`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerData)
        });
        
        const data = await response.json(); 
        
        if (!response.ok) {
          // Crear un objeto de error con toda la información disponible
          const error = new Error(data.message || 'Error en el registro');
          error.response = response;
          error.data = data;
          error.statusCode = response.status;
          
          // Incluir el mensaje SQL si está disponible
          if (data.sqlMessage) {
            error.message = data.sqlMessage;
          }
          
          // Si hay un campo específico con error, resaltarlo en el formulario
          if (data.field) {
            formErrors.value[data.field] = error.message;
          }
          
          throw error;
        }
        
        // Si el registro fue exitoso
        showToast('¡Registro exitoso! Por favor inicia sesión.', 'success');
        
        // Cambiar a pestaña de login
        isLogin.value = true;
        
        // Limpiar errores
        formErrors.value = {};
        
        // Limpiar el formulario
        form.value = {
          nombre: '',
          email: '',
          telefono: '',
          identidad: '',
          password: ''
        };
      } catch (error) { 
        
        // Si hay una respuesta del servidor, extraer el mensaje de error
        if (error.response?.data) {
          const responseData = error.response.data;
          
          // Usar el mensaje del backend si está disponible
          const errorMessage = responseData.message || 
                             'Error en el registro. Por favor, inténtalo de nuevo.';
          
          // Si hay un campo específico con error, resaltarlo
          if (responseData.field) {
            formErrors.value[responseData.field] = errorMessage;
          }
          
          // Si hay errores de validación, mostrarlos en los campos correspondientes
          if (responseData.validationErrors) {
            responseData.validationErrors.forEach(err => {
              if (err.field) {
                formErrors.value[err.field] = err.message;
              }
            });
          }
          
          // Mostrar el mensaje de error al usuario
          showToast(errorMessage, 'error');
          
        } else if (error.message) {
          // Si no hay respuesta del servidor pero hay un mensaje de error
          showToast(error.message, 'error');
        } else {
          // Mensaje genérico si no hay información de error
          showToast('Error al procesar la solicitud. Por favor, inténtalo de nuevo.', 'error');
        }
      }
    }
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      isLoading.value = false;
      authStatus.value = '';
    }, 3000);
  } finally {
    // Asegurarse de que el loading se desactive
    if (authStatus.value !== 'success') {
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    } else {
      isLoading.value = false;
    }
  }
}

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'error',
  duration: 5000,
  timeoutId: null
})

// Loading message state
const loadingMessage = ref('')

// Show toast function
const showToast = (message, type = 'error', duration = 5000) => {
  // Limpiar timeout anterior si existe
  if (toast.value.timeoutId) {
    clearTimeout(toast.value.timeoutId)
  }

  // Actualizar el estado del toast
  toast.value = {
    show: true,
    message,
    type,
    duration,
    timeoutId: null
  }

  // Configurar el cierre automático
  if (duration > 0) {
    toast.value.timeoutId = setTimeout(() => {
      toast.value.show = false
    }, duration)
  }
}

// Alias para compatibilidad con el código existente
const showCustomAlert = (message) => {
  showToast(message, 'error')
}

// Funciones de validación de teclado
const preventNumberInput = (e) => {
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
  }
}

const preventLetterInput = (e) => {
  // Permitir teclas de control (backspace, delete, tab, etc.)
  if ([8, 9, 13, 27, 46].includes(e.keyCode) || 
      // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode))) {
    return;
  }
  
  // Permitir números y teclas especiales para teléfono
  if (e.target.name === 'telefono' && ['+', '-', ' '].includes(e.key)) {
    return;
  }
  
  // Solo permitir números
  if ((e.key < '0' || e.key > '9') && e.keyCode !== 8) {
    e.preventDefault();
  }
}

// Dark mode support
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
  
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleColorSchemeChange = (event) => {
    if (event.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Agregar el event listener
  darkModeMediaQuery.addEventListener('change', handleColorSchemeChange)
  
  // Limpiar el event listener cuando el componente se desmonte
  return () => {
    darkModeMediaQuery.removeEventListener('change', handleColorSchemeChange)
  }
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Smooth animations */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Glass morphism effect */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Custom scrollbar */
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

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}

/* Ensure proper mobile touch targets */
button, input {
  min-height: 44px;
}

/* Prevent zoom on input focus */
input {
  font-size: 16px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.slide-in-up {
  animation: slideInUp 0.6s ease-out;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Shadow utilities */
.shadow-glow {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
}

#app {
  min-height: 100vh;
}
</style>