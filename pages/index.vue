<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO Head -->
    <Head>
      <title>HogarSeguro - Mantenimiento del Hogar en Honduras</title>
      <meta name="description" content="HogarSeguro es la primera plataforma en Honduras que te da mantenimiento, descuentos y asistencia técnica en un solo lugar. Membresía mensual desde L. 250." />
      <meta name="keywords" content="mantenimiento hogar, Honduras, fontanería, electricidad, aires acondicionados, electrodomésticos, pintura, cámaras seguridad" />
      <meta property="og:title" content="HogarSeguro - Tu hogar protegido" />
      <meta property="og:description" content="Mantenimiento, descuentos y asistencia técnica en un solo lugar. Tu casa es tu refugio." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

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

          <form @submit.prevent="handleAuth" class="space-y-6">
            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input 
                v-model="form.name"
                type="text" 
                class="w-full px-4 py-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input 
                v-model="form.email"
                type="email" 
                class="w-full px-4 py-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input 
                v-model="form.password"
                type="password" 
                class="w-full px-4 py-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                placeholder="••••••••"
                required
              />
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

          <!-- Mock Users Info -->
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
            <p class="text-xs text-gray-600 dark:text-gray-400 mb-3 font-bold text-center">Usuarios de prueba:</p>
            <div class="text-xs space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700 dark:text-gray-300"><strong>Cliente:</strong></span>
                <span class="text-gray-600 dark:text-gray-400 font-mono">cliente@test.com / 123456</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700 dark:text-gray-300"><strong>Técnico:</strong></span>
                <span class="text-gray-600 dark:text-gray-400 font-mono">tecnico@test.com / 123456</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700 dark:text-gray-300"><strong>Admin:</strong></span>
                <span class="text-gray-600 dark:text-gray-400 font-mono">admin@test.com / 123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="showSuccess" class="fixed top-6 left-6 right-6 z-50">
      <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-2xl">
        <div class="flex items-center space-x-3">
          <div class="text-2xl">🎉</div>
          <div>
            <p class="font-black text-lg">¡Bienvenido a HogarSeguro!</p>
            <p class="text-green-100 text-sm">Tu hogar está ahora protegido</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// SEO and Meta
useHead({
  title: 'HogarSeguro - Mantenimiento del Hogar en Honduras',
  meta: [
    { name: 'description', content: 'HogarSeguro es la primera plataforma en Honduras que te da mantenimiento, descuentos y asistencia técnica en un solo lugar. Membresía mensual desde L. 250.' },
    { name: 'keywords', content: 'mantenimiento hogar, Honduras, fontanería, electricidad, aires acondicionados, electrodomésticos, pintura, cámaras seguridad' },
    { property: 'og:title', content: 'HogarSeguro - Tu hogar protegido' },
    { property: 'og:description', content: 'Mantenimiento, descuentos y asistencia técnica en un solo lugar. Tu casa es tu refugio.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Reactive data
const showLoginModal = ref(false)
const showSuccess = ref(false)
const isLogin = ref(true)

const form = ref({
  name: '',
  email: '',
  password: ''
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

// Router
const router = useRouter()

// Methods
const handleAuth = () => {
  if (isLogin.value) {
    // Login logic
    const user = mockUsers.find(u => u.email === form.value.email && u.password === form.value.password)
    if (user) {
      showLoginModal.value = false
      showSuccess.value = true
      // Redirect to dashboard after showing success message
      setTimeout(() => {
        showSuccess.value = false
        router.push('/DashboardCliente')
      }, 2000)
      console.log('Login successful:', user)
    } else {
      showCustomAlert('Credenciales incorrectas. Intenta con los usuarios de prueba.')
    }
  } else {
    // Register logic
    showLoginModal.value = false
    showSuccess.value = true
    // Redirect to dashboard after showing success message
    setTimeout(() => {
      showSuccess.value = false
      router.push('/DashboardCliente')
    }, 2000)
    console.log('Registration successful:', form.value)
  }
  
  // Reset form
  form.value = { name: '', email: '', password: '' }
}

// Custom alert function
const showCustomAlert = (message) => {
  const alertDiv = document.createElement('div')
  alertDiv.className = 'fixed top-6 left-6 right-6 z-50 bg-red-500 text-white p-4 rounded-2xl shadow-2xl'
  alertDiv.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <span class="text-xl">⚠️</span>
        <span class="font-bold">${message}</span>
      </div>
      <button onclick="this.closest('.fixed').remove()" class="text-white hover:text-red-200 ml-4">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  `
  document.body.appendChild(alertDiv)
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove()
    }
  }, 5000)
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
</style>