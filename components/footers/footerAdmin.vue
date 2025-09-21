<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const router = useRouter()
const isLoading = ref(false)
const activeTab = ref('dashboard')

const navigateTo = async (path, tabName) => {
  try {
    isLoading.value = true
    activeTab.value = tabName
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.push(path)
  } catch (error) {
    console.error('Error en la navegación:', error)
  } finally {
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
    <div class="px-4 py-3">
      <div class="flex justify-around items-center">
        <!-- Dashboard -->
        <button 
          @click="navigateTo('/admin/DashboardAdmin', 'dashboard')" 
          class="flex flex-col items-center space-y-1 group"
          :class="{ 'text-indigo-600 dark:text-indigo-400': activeTab === 'dashboard', 'text-gray-500 dark:text-gray-400': activeTab !== 'dashboard' }"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               :class="{ 'bg-indigo-100 dark:bg-indigo-900/30': activeTab === 'dashboard', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'dashboard' }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </div>
          <span class="text-xs font-medium">Dashboard</span>
        </button>

        <!-- Usuarios -->
        <button 
          @click="navigateTo('/admin/usuarios', 'usuarios')" 
          class="flex flex-col items-center space-y-1 group"
          :class="{ 'text-indigo-600 dark:text-indigo-400': activeTab === 'usuarios', 'text-gray-500 dark:text-gray-400': activeTab !== 'usuarios' }"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               :class="{ 'bg-indigo-100 dark:bg-indigo-900/30': activeTab === 'usuarios', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'usuarios' }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          </div>
          <span class="text-xs font-medium">Usuarios</span>
        </button>

        <!-- Servicios -->
        <button 
          @click="navigateTo('/admin/servicios', 'servicios')" 
          class="flex flex-col items-center space-y-1 group"
          :class="{ 'text-indigo-600 dark:text-indigo-400': activeTab === 'servicios', 'text-gray-500 dark:text-gray-400': activeTab !== 'servicios' }"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               :class="{ 'bg-indigo-100 dark:bg-indigo-900/30': activeTab === 'servicios', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'servicios' }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-xs font-medium">Servicios</span>
        </button>

        <!-- Reportes -->
        <button 
          @click="navigateTo('/admin/reportes', 'reportes')" 
          class="flex flex-col items-center space-y-1 group"
          :class="{ 'text-indigo-600 dark:text-indigo-400': activeTab === 'reportes', 'text-gray-500 dark:text-gray-400': activeTab !== 'reportes' }"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               :class="{ 'bg-indigo-100 dark:bg-indigo-900/30': activeTab === 'reportes', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'reportes' }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span class="text-xs font-medium">Reportes</span>
        </button>

        <!-- Configuración -->
        <button 
          @click="navigateTo('/admin/configuracion', 'configuracion')" 
          class="flex flex-col items-center space-y-1 group"
          :class="{ 'text-indigo-600 dark:text-indigo-400': activeTab === 'configuracion', 'text-gray-500 dark:text-gray-400': activeTab !== 'configuracion' }"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
               :class="{ 'bg-indigo-100 dark:bg-indigo-900/30': activeTab === 'configuracion', 'bg-gray-100 dark:bg-gray-800': activeTab !== 'configuracion' }">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <span class="text-xs font-medium">Configuración</span>
        </button>
      </div>
    </div>
  </nav>
</template>