<template>
  <header class="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
    <!-- Patrón de cuadrícula sutil -->
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
              <span class="text-emerald-600 font-bold text-xs">👥</span>
            </div>
          </div>
          <div>
            <h1 class="text-lg font-black text-white">Gestión de Usuarios</h1>
            <p class="text-emerald-100 text-xs">Panel de administración</p>
          </div>
        </div>
        
        <!-- Botón de notificaciones -->
        <button 
          @click="$emit('toggle-notifications')" 
          class="relative px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Notificaciones</span>
          <span v-if="unreadCount > 0" 
                class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'
import { computed } from 'vue';

const auth = useAuthStore();
const user = computed(() => auth.user || {});

const props = defineProps({
  unreadCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['toggle-notifications']);
</script>