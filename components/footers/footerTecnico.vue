<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/middleware/auth.store';

const auth = useAuthStore();

// Depuración: Mostrar información del usuario y su rol
onMounted(() => { 
});

import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const router = useRouter()
const isLoading = ref(false)

const navigateTo = async (path) => {
  try {
    // Mostrar el spinner
    isLoading.value = true
    
    // Pequeño retraso para asegurar que se muestre el spinner
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Navegar a la ruta
    await router.push(path)
  } catch (error) {
    console.error('Error en la navegación:', error)
  } finally {
    // Ocultar el spinner después de un pequeño retraso
    // para asegurar una transición suave
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
}
</script>

<template>
    <!-- LoadingSpinner para navegación -->
    <LoadingSpinner 
      v-if="isLoading"
      :loading="isLoading"
      :hideDefaultMessage="true"
      class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
    />
    
    <nav class="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40">
      <div class="px-6 py-4 ">
        <div class="flex justify-around items-center ">
          <button 
            @click="navigateTo('/tecnico/DashboardTecnico')" 
            class="flex flex-col items-center space-y-1 text-emerald-600 ">
            <div class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Inicio</span>
          </button>
          <button 
            @click="navigateTo('/tecnico/ServiciosTecnico')" 
            class="flex flex-col items-center space-y-1 text-blue-600">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Servicios</span>
          </button>
          <button 
            @click="navigateTo('/tecnico/MetricasTecnico')" 
            class="flex flex-col items-center space-y-1 text-blue-600">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Métricas</span>
          </button>
           <button 
            @click="navigateTo('/tecnico/PerfilTecnico')" 
            class="flex flex-col items-center space-y-1 text-blue-600">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Perfil</span>
          </button>
        </div>
      </div>
    </nav>
</template>