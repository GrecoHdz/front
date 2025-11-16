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
        
        <!-- Componente de notificaciones -->
        <NotificationsDropdown />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '~/middleware/auth.store'
import { computed } from 'vue';
import NotificationsDropdown from '~/components/ui/NotificationsDropdown.vue';

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