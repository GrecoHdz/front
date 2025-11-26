<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const auth = useAuthStore();
const router = useRouter()
const route = useRoute()
const isLoading = ref(false)

// Determine active tab based on current route
const activeTab = computed(() => {
  const path = route.path.toLowerCase()
  if (path.includes('dashboard')) return 'inicio'
  if (path.includes('servicios')) return 'servicios'
  if (path.includes('metricas')) return 'metricas'
  if (path.includes('perfil')) return 'perfil'
  return 'inicio' // default
})

const navigateTo = async (path) => {
  try {
    isLoading.value = true
    
    // Small delay to allow UI to update before navigation
    await new Promise(resolve => setTimeout(resolve, 50))
    
    // Navigate to the new route
    await router.push(path)
  } catch (error) {
    console.error('Error en la navegación:', error)
  } finally {
    // Shorter delay to ensure smooth transition
    setTimeout(() => {
      isLoading.value = false
    }, 200)
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
            class="flex flex-col items-center space-y-1 group"
            :class="{ 'text-emerald-600': activeTab === 'inicio', 'text-gray-500 dark:text-gray-400': activeTab !== 'inicio' }"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                 :class="{ 'bg-emerald-100 dark:bg-emerald-900/30': activeTab === 'inicio', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'inicio' }">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Inicio</span>
          </button>
          <button 
            @click="navigateTo('/tecnico/ServiciosTecnico')" 
            class="flex flex-col items-center space-y-1 group"
            :class="{ 'text-blue-600': activeTab === 'servicios', 'text-gray-500 dark:text-gray-400': activeTab !== 'servicios' }"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                 :class="{ 'bg-blue-100 dark:bg-blue-900/30': activeTab === 'servicios', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'servicios' }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Servicios</span>
          </button>
          <button 
            @click="navigateTo('/tecnico/MetricasTecnico')" 
            class="flex flex-col items-center space-y-1 group"
            :class="{ 'text-blue-600': activeTab === 'metricas', 'text-gray-500 dark:text-gray-400': activeTab !== 'metricas' }"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                 :class="{ 'bg-blue-100 dark:bg-blue-900/30': activeTab === 'metricas', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'metricas' }">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span class="text-xs font-bold">Métricas</span>
          </button>
          <button 
            @click="navigateTo('/tecnico/PerfilTecnico')" 
            class="flex flex-col items-center space-y-1 group"
            :class="{ 'text-blue-600': activeTab === 'perfil', 'text-gray-500 dark:text-gray-400': activeTab !== 'perfil' }"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                 :class="{ 'bg-blue-100 dark:bg-blue-900/30': activeTab === 'perfil', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'perfil' }">
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