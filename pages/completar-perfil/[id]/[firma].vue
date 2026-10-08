<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="flex justify-center mb-4">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <!-- <img src="/pwa-192x192.png" alt="MiSeguro" class="w-full h-full object-contain" /> -->
        </div>
      </div>
      <h2 class="text-center text-2xl font-black tracking-tight text-gray-900 dark:text-white">
        MiSeguro
      </h2>
      <p class="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
        Completar Perfil de Cliente
      </p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <!-- Loading state -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 py-10 px-6 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 text-center">
        <div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-sm font-bold text-gray-600 dark:text-gray-300">Verificando enlace...</p>
      </div>

      <!-- Invalid state (404 / firma fallida) -->
      <div v-else-if="invalid" class="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-red-100 dark:border-red-900/30 text-center">
        <div class="w-14 h-14 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ⚠️
        </div>
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">Enlace no disponible</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
          El enlace para completar tu perfil es inválido o no existe.
        </p>
        <nuxt-link
          to="/"
          class="w-full inline-flex justify-center items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
          Ir a Inicio
        </nuxt-link>
      </div>

      <!-- Ya completado state -->
      <div v-else-if="yaCompletado" class="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center">
        <div class="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✅
        </div>
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">¡Perfil Completo!</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Tu perfil ya cuenta con una contraseña asignada. Redirigiendo...
        </p>
        <nuxt-link
          to="/auth/login"
          class="w-full inline-flex justify-center items-center px-4 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all">
          Iniciar Sesión
        </nuxt-link>
      </div>

      <!-- Formulario para ingresar contraseña -->
      <div v-else class="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
        <div class="mb-6 text-center">
          <p class="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">¡Bienvenido(a)!</p>
          <h3 class="text-xl font-black text-gray-900 dark:text-white">{{ clienteNombre }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Crea tu contraseña para ingresar a ProHogar</p>
        </div>

        <form @submit.prevent="guardar" class="space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Nueva Contraseña
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                minlength="6"
                placeholder="Mínimo 6 caracteres"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                :disabled="saving"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="6"
              placeholder="Repite la contraseña"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :disabled="saving"
            />
          </div>

          <div v-if="errorMessage" class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-xl text-xs font-semibold">
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="saving || !isFormValid"
            class="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span v-if="saving" class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ saving ? 'Guardando...' : 'Guardar y Iniciar Sesión' }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: false
})

// SEO and Meta
useHead({
  title: 'MiSeguro - Completar Perfil',
  meta: [
    { name: 'description', content: 'Completa tu perfil y crea tu contraseña para acceder a MiSeguro' }, 
    { name: 'keywords', content: 'MiSeguro, Completar Perfil' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()

const idParam = route.params.id
const firmaParam = route.params.firma

const loading = ref(true)
const invalid = ref(false)
const yaCompletado = ref(false)
const clienteNombre = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const saving = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  return password.value && password.value.length >= 6 && password.value === confirmPassword.value
})

const { $api } = useNuxtApp()

onMounted(async () => {
  console.log(`🔍 [CompletarPerfil] URL cargada con id: "${idParam}" y firma: "${firmaParam}"`)
  
  if (!idParam || !firmaParam) {
    console.warn('⚠️ [CompletarPerfil] Faltan parámetros en la URL.')
    loading.value = false
    invalid.value = true
    return
  }

  try {
    console.log(`📡 [CompletarPerfil] Solicitando GET /auth/completar-perfil/${idParam}/${firmaParam}...`)
    const res = await $api(`/auth/completar-perfil/${idParam}/${firmaParam}`, {
      method: 'GET'
    })

    console.log('✅ [CompletarPerfil] Respuesta recibida del servidor:', res)

    if (!res) {
      console.warn('⚠️ [CompletarPerfil] Respuesta vacía del servidor (posible 404).')
      invalid.value = true
    } else {
      clienteNombre.value = res.nombre || 'Cliente'
      console.log(`👤 [CompletarPerfil] Cliente: "${clienteNombre.value}" | necesita_password: ${res.necesita_password}`)
      
      if (res.necesita_password === false) {
        console.warn('⚠️ [CompletarPerfil] El usuario ya tiene contraseña asignada (password_hash NOT NULL).')
        yaCompletado.value = true
        setTimeout(() => {
          router.replace('/auth/login')
        }, 2500)
      } else {
        console.log('✨ [CompletarPerfil] password_hash está en NULL. Formulario habilitado para crear contraseña.')
        yaCompletado.value = false
      }
    }
  } catch (err) {
    console.error('❌ [CompletarPerfil] Error al validar enlace:', err)
    invalid.value = true
  } finally {
    loading.value = false
  }
})

import { useAuthStore } from '~/middleware/auth.store'

const authStore = useAuthStore()

const guardar = async () => {
  if (!isFormValid.value) {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Las contraseñas no coinciden'
    } else {
      errorMessage.value = 'La contraseña debe tener al menos 6 caracteres'
    }
    return
  }

  saving.value = true
  errorMessage.value = ''

  console.log(`📡 [CompletarPerfil] Enviando POST /auth/completar-perfil/${idParam}/${firmaParam}...`)

  try {
    const res = await $api(`/auth/completar-perfil/${idParam}/${firmaParam}`, {
      method: 'POST',
      body: { password: password.value }
    })

    console.log('✅ [CompletarPerfil] Respuesta del guardado:', res)

    if (res && res.success) {
      if (res.token) {
        authStore.setToken(res.token)
      }
      if (res.user) {
        authStore.setUser(res.user)
      }

      const role = res.user?.role || res.user?.rol?.nombre_rol?.toLowerCase() || 'cliente'
      const targetRoute = role === 'tecnico' ? '/tecnico/DashboardTecnico' : '/cliente/DashboardCliente'
      console.log(`🚀 [CompletarPerfil] Sesión establecida. Redirigiendo a dashboard: ${targetRoute}`)
      
      window.location.href = targetRoute
    } else {
      errorMessage.value = res?.message || 'No se pudo guardar la contraseña'
    }
  } catch (err) {
    console.error('❌ [CompletarPerfil] Error al guardar contraseña:', err)
    const backendMsg = err?.data?.message || err?.data?.error || err?.message
    if (backendMsg && backendMsg.includes('ya completado')) {
      yaCompletado.value = true
      setTimeout(() => {
        router.replace('/auth/login')
      }, 2500)
    } else {
      errorMessage.value = backendMsg || 'Error al guardar la contraseña. Revisa la conexión.'
    }
  } finally {
    saving.value = false
  }
}
</script>
