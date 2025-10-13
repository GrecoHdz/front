<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"> 
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          
          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30">
            <svg class="h-12 w-12 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <!-- Title -->
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Acceso Denegado
          </h2>

          <!-- Description -->
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            No tienes los permisos necesarios para acceder a esta página.
          </p>

          <!-- Button -->
          <div class="mt-8">
            <button 
              @click="goToDashboard" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Aceptar
            </button>
          </div>

          <!-- Additional Help -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              ¿Crees que es un error? 
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Contactar al soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store' 
import { onMounted, ref } from 'vue'

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(true)

// Verificar autenticación al cargar la página
onMounted(async () => {
  try {
    // Verificar si el usuario está autenticado
    const isAuth = await auth.checkAuth()
    console.log('🔍 [acceso-denegado] Estado de autenticación:', isAuth)
    
    if (!isAuth) {
      console.log('🔒 [acceso-denegado] Usuario no autenticado, redirigiendo a login')
      return router.push('/')
    }
    
    console.log('👤 [acceso-denegado] Usuario autenticado:', auth.user)
  } catch (error) {
    console.error('❌ [acceso-denegado] Error al verificar autenticación:', error)
    router.push('/')
  } finally {
    isLoading.value = false
  }
})

const goToDashboard = async () => {
  try {
    // Verificar autenticación nuevamente antes de redirigir
    const isAuth = await auth.checkAuth()
    if (!isAuth) {
      console.warn('⚠️ [acceso-denegado] Sesión expirada, redirigiendo a login')
      return router.push('/')
    }

    const role = auth.user?.role?.toLowerCase()
    console.log('🔍 [acceso-denegado] Rol del usuario:', role, 'Usuario completo:', JSON.stringify(auth.user, null, 2))

    if (!role) {
      console.warn('⚠️ [acceso-denegado] No se pudo determinar el rol del usuario')
      return router.push('/')
    }

    const dashboardPath = {
      'admin': '/admin/DashboardAdmin',
      'tecnico': '/tecnico/DashboardTecnico',
      'usuario': '/cliente/DashboardCliente'
    }[role]

    if (dashboardPath) {
      console.log(`🔄 [acceso-denegado] Redirigiendo a ${dashboardPath}`)
      return router.push(dashboardPath)
    }

    console.warn('⚠️ [acceso-denegado] Ruta no definida para el rol:', role)
    router.push('/')
  } catch (error) {
    console.error('❌ [acceso-denegado] Error al redirigir:', error)
    router.push('/')
  }
}
</script>

<style scoped>
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
