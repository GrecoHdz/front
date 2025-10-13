<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"> 
    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          
          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <svg class="h-12 w-12 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <!-- Title -->
          <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Cuenta Deshabilitada
          </h2>

          <!-- Description -->
          <div class="mt-4 space-y-2">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Lo sentimos, tu cuenta ha sido deshabilitada.
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Si crees que esto es un error, por favor contacta al administrador.
            </p>
          </div>

          <!-- Button -->
          <div class="mt-8">
            <button 
              @click="goToHome" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Volver al Inicio
            </button>
          </div> 
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'

const router = useRouter()
const auth = useAuthStore()

const goToHome = () => { 
  router.push('/')
}
</script>

<style scoped>
/* Efecto de hover sutil en el botón */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Efecto de focus accesible */
button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Transición suave para el tema oscuro */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
