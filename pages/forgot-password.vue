<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        ¿Olvidaste tu contraseña?
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              :disabled="loading"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Enviando...' : 'Enviar enlace de restablecimiento' }}
            </button>
          </div>
        </form>

        <!-- Mensaje de éxito -->
        <div v-if="success" class="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
          <p>{{ success }}</p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-800 rounded-md">
          <p>{{ error }}</p>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                ¿Recordaste tu contraseña?
              </span>
            </div>
          </div>

          <div class="mt-6">
            <nuxt-link
              to="/login"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Volver al inicio de sesión
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth', // Asume que tienes un layout para páginas de autenticación
  auth: false, // No requiere autenticación
  
  data() {
    const config = useRuntimeConfig()
    return {
      email: '',
      loading: false,
      error: null,
      success: null,
      apiBase: config.public.apiBase
    }
  },
  
  methods: {
    async handleSubmit() {
      this.loading = true
      this.error = null
      this.success = null
      
      try {
        const response = await $fetch('/auth/forgot-password', {
          baseURL: this.apiBase,
          method: 'POST',
          body: JSON.stringify({ email: this.email }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        this.success = response.message || 'Se ha enviado un enlace de restablecimiento a tu correo electrónico.'
        this.email = ''
      } catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error)
        
        // Mostrar mensaje de error específico si el correo no existe
        if (error.statusCode === 404 || error.data?.message?.includes('No se encontró ningún usuario')) {
          this.error = 'No existe ninguna cuenta asociada a este correo electrónico.'
        } 
      } finally {
        this.loading = false
      }
    }
  },
  
  head() {
    return {
      title: 'Restablecer contraseña - ProHogar'
    }
  }
}
</script>
