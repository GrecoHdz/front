<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col"> 

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 text-center">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <!-- Icon -->
          <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 dark:bg-red-900/30">
            <svg class="h-12 w-12 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
            <button @click="goToDashboard" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
              </span>
              Volver al Inicio
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
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDashboard = () => {
  router.push('/');
};

// Dark mode support
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style scoped>
/* Animación para el icono */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
