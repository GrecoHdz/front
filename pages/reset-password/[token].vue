<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Header con gradiente -->
    <header class="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
      <!-- Patrón de fondo -->
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      <div class="relative px-4 py-8 text-center">
        <div class="flex justify-center mb-4">
          <div class="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
            <div class="w-10 h-10 bg-white rounded-md flex items-center justify-center">
              <span class="text-emerald-600 font-bold text-lg">🔒</span>
            </div>
          </div>
        </div>
        <h1 class="text-2xl font-black text-white mb-2">
          Restablecer Contraseña
        </h1>
        <p class="text-emerald-100">Ingresa tu nueva contraseña</p>
      </div>
    </header>

    <main class="relative -mt-4 pb-20 px-4">
      <div v-if="!isTokenValid" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center">
        <div class="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Enlace inválido o expirado</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">El enlace de restablecimiento no es válido o ha expirado.</p>
        <nuxt-link 
          to="/" 
          class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </nuxt-link>
      </div>
      
      <div v-else class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Contraseña -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Nueva Contraseña
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                :class="{ 'opacity-70': loading }"
                :disabled="loading"
                placeholder="••••••••"
              >
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                :disabled="loading"
              >
                <span v-if="showPassword">👁️</span>
                <span v-else>👁️‍🗨️</span>
              </button>
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Mínimo 6 caracteres</p>
          </div>

          <!-- Confirmar Contraseña -->
          <div>
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              :class="{ 'opacity-70': loading }"
              :disabled="loading"
              placeholder="••••••••"
            >
          </div>

          <!-- Mensajes de error/éxito -->
          <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 rounded-lg text-sm">
            {{ error }}
          </div>

          <div v-if="success" class="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 rounded-lg text-sm">
            {{ success }}
          </div>

          <!-- Botón de envío -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            :class="{
              'opacity-70 cursor-not-allowed': loading || !isFormValid,
              'transform hover:-translate-y-0.5': !loading && isFormValid
            }"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
            <span v-else>Restablecer Contraseña</span>
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false,
      loading: false,
      error: null,
      success: null,
      isTokenValid: false,
      token: ''
    }
  },
  
  computed: {
    isFormValid() {
      return this.password && 
             this.password.length >= 6 && 
             this.password === this.confirmPassword
    }
  },
  
  async mounted() {
    // Forzar modo oscuro
    document.documentElement.classList.add('dark')
    
    // Obtener el token de la URL
    this.token = this.$route.params.token;
    console.log('Token en mounted:', this.token);
    
    if (!this.token) {
      this.error = 'Token no proporcionado';
      this.isTokenValid = false;
      return;
    }
    
    // Verificar el token
    await this.verifyToken();
  },
  
  methods: {
    async verifyToken() {
      try {
        this.loading = true;
        const config = useRuntimeConfig();
        
        // Verificar si el token es válido
        const response = await $fetch(`/auth/verify-reset-token/${this.token}`, {
          baseURL: config.public.apiBase,
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        this.isTokenValid = response.valid || false;
        
        if (!this.isTokenValid) {
          this.error = 'El enlace de restablecimiento no es válido o ha expirado.';
        }
        
      } catch (error) {
        console.error('Error al verificar el token:', error);
        this.error = 'Error al verificar el enlace de restablecimiento. Por favor, inténtalo de nuevo.';
        this.isTokenValid = false;
      } finally {
        this.loading = false;
      }
    },
    
    async handleSubmit() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }
      
      if (this.password.length < 6) {
        this.error = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.success = null;
      
      try {
        const config = useRuntimeConfig();
        
        const data = await $fetch(`/auth/reset-password/${this.token}`, {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: JSON.stringify({ 
            password: this.password,
            token: this.token
          }),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        this.success = data.message || '¡Contraseña actualizada exitosamente!';
        
        // Redirigir a la página de inicio después de 3 segundos
        setTimeout(() => {
          this.$router.push('/');
        }, 3000);
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        this.error = error.data?.message || 'Ocurrió un error al intentar restablecer la contraseña. Por favor, inténtalo de nuevo.';
      } finally {
        this.loading = false;
      }
    }
  },
  
  head() {
    return {
      title: 'Restablecer Contraseña - HogarSeguro',
      meta: [
        { hid: 'description', name: 'description', content: 'Restablece tu contraseña de HogarSeguro' }
      ]
    }
  }
}
</script>

<style scoped>
/* Estilos personalizados para la página de restablecimiento */
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Animación de entrada */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
