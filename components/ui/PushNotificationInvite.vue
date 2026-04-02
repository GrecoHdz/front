<template>
  <transition
    enter-active-class="transition ease-out duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="isVisible" 
      class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
    >
      <!-- Animación de fondo -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div 
        class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col items-center text-center gap-6"
      >
        <!-- Icono Principal -->
        <div class="relative">
          <div class="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 scale-150"></div>
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center text-5xl shadow-lg border border-white/20 relative z-10 animate-bounce-slow">
            🔔
          </div>
        </div>
        
        <div class="space-y-3 relative z-10">
          <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">
            ¡Mantente siempre <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">conectado!</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-base px-2">
            Necesitas activar las notificaciones para recibir actualizaciones en tiempo real sobre tus servicios y reportes.
          </p>
        </div>
        
        <div class="w-full space-y-4 pt-2 relative z-10">
          <button 
            @click="handleSubscribe"
            class="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-5 rounded-3xl text-lg font-extrabold hover:translate-y-[-2px] hover:shadow-xl hover:shadow-emerald-500/20 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 group"
          >
            <span>Activar Notificaciones</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          
          <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
            Es obligatorio para continuar usando el sistema
          </p>
        </div>

        <!-- Decoración interior -->
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { usePushNotifications } from '~/composables/usePushNotifications';

const { isSupported, isSubscribed, permission, isChecking, subscribe, checkSubscription } = usePushNotifications();

const isVisible = computed(() => {
  // Solo mostramos si:
  // 1. No está cargando/revisando
  // 2. El navegador soporta notificaciones
  // 3. NO está suscrito
  // 4. El permiso NO ha sido denegado manualmente en el navegador
  return !isChecking.value &&
         isSupported.value && 
         !isSubscribed.value && 
         permission.value !== 'denied';
});

const handleSubscribe = async () => {
  try {
    await subscribe();
  } catch (error) {
    console.error('Error al suscribirse:', error);
  }
};

onMounted(async () => {
  // Timeout de seguridad de 5 segundos para que no bloquee en iOS
  const timeout = new Promise((resolve) => setTimeout(resolve, 5000));
  try {
    await Promise.race([checkSubscription(), timeout]);
  } catch (error) {
    console.warn('⚠️ [PushNotificationInvite] checkSubscription tardó demasiado o falló:', error);
  }
});
</script>

<style scoped>
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>

