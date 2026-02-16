<template>
  <transition
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="opacity-0 -translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200 transform"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-4"
  >
    <div 
      v-if="isVisible" 
      class="mx-4 mt-4 mb-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 shadow-lg border border-emerald-400/20 relative overflow-hidden group"
    >
      <!-- Decoración de fondo -->
      <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/30 shadow-inner">
          🔔
        </div>
        
        <div class="flex-1 min-w-0">
          <h4 class="text-white font-bold text-sm sm:text-base leading-tight">¡Mantente al día!</h4>
          <p class="text-emerald-50 text-xs sm:text-sm line-clamp-1 opacity-90">Activa las notificaciones para no perderte nada.</p>
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="handleSubscribe"
            class="bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all active:scale-95 shadow-sm whitespace-nowrap"
          >
            Activar
          </button>
          
          <button 
            @click="dismiss"
            class="text-emerald-100 hover:text-white p-1 transition-colors"
            title="Cerrar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePushNotifications } from '~/composables/usePushNotifications';

const { isSupported, isSubscribed, permission, isChecking, subscribe, checkSubscription } = usePushNotifications();
const isDismissed = ref(false);

const isVisible = computed(() => {
  return !isChecking.value &&
         isSupported.value && 
         !isSubscribed.value && 
         permission.value !== 'denied' && 
         !isDismissed.value;
});

const handleSubscribe = async () => {
  await subscribe();
};

const dismiss = () => {
  isDismissed.value = true;
  // Opcional: Guardar en localStorage para que no aparezca en X días
  if (process.client) {
    localStorage.setItem('push_invite_dismissed', Date.now().toString());
  }
};

onMounted(async () => {
  await checkSubscription();
  
  // Verificar si fue descartado hace poco (ej: 3 días)
  /*if (process.client) {
    const lastDismissed = localStorage.getItem('push_invite_dismissed');
    if (lastDismissed) {
      const threeDays = 3 * 24 * 60 * 60 * 1000;
      if (Date.now() - parseInt(lastDismissed) < threeDays) {
        isDismissed.value = true;
      }
    }
  }*/
});
</script>
