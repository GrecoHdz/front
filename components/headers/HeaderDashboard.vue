<template>
    <!-- Mobile Header -->
    <header class="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>
      
      <div class="relative px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div class="w-5 h-5 bg-white rounded-lg flex items-center justify-center">
                <span class="text-emerald-600 font-bold text-xs">🏠</span>
              </div>
            </div>
            <div>
              <h1 class="text-lg font-black text-white">Dashboard</h1>
              <p class="text-emerald-100 text-xs">Panel de control</p>
            </div>
          </div>
          <button @click="toggleNotifications" class="px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-all duration-300">
            Notificaciones
          </button>
        </div>
      </div>
    </header>
</template>

<script setup>
import { ref } from 'vue';

const showFilters = ref(false);
const showNotifications = ref(false);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};
</script>