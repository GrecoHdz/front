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
      class="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl"
    >
      <!-- Animación de fondo -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1s;"></div>
      </div>

      <div 
        class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden flex flex-col items-center text-center gap-6"
      >
        <!-- Icono Principal -->
        <div class="relative">
          <div class="absolute inset-0 bg-blue-500 blur-2xl opacity-20 scale-150"></div>
          <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center text-5xl shadow-lg border border-white/20 relative z-10 animate-bounce-slow">
            📲
          </div>
        </div>
        
        <div class="space-y-3 relative z-10">
          <h2 class="text-2xl font-black text-slate-800 dark:text-white leading-tight">
            {{ $t('pwa.install_invite.title') }} <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">{{ $t('pwa.install_invite.subtitle') }}</span>
          </h2>
          <p class="text-slate-500 dark:text-slate-400 text-base px-2">
            {{ isIOS ? $t('pwa.install_invite.message_ios') : $t('pwa.install_invite.message_android') }}
          </p>
        </div>
        
        <div class="w-full space-y-4 pt-2 relative z-10">
          <!-- Botón para Android/Chrome -->
          <button 
            v-if="!isIOS"
            @click="handleInstall"
            class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-5 rounded-3xl text-lg font-extrabold hover:translate-y-[-2px] hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 group"
          >
            <span>{{ $t('pwa.install_invite.cta') }}</span>
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <!-- Instrucciones para iOS (Safari no soporta beforeinstallprompt) -->
          <div v-else class="space-y-4">
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-sm text-blue-700 dark:text-blue-300 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Toca el icono de <strong>Compartir</strong> <svg class="inline w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 15V3m0 0l-4 4m4-4l4 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
              </div>
              <div class="flex items-center gap-3">
                <span class="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Selecciona <strong>"Agregar al inicio"</strong> <svg class="inline w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/><path d="M12 8v8m-4-4h8" stroke-width="2" stroke-linecap="round"/></svg></span>
              </div>
            </div>
          </div>
          
          <p class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
            {{ $t('pwa.install_invite.mandatory') }}
          </p>
        </div>

        <!-- Decoración interior -->
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { usePWA } from '~/composables/usePWA';

const { isInstalled, isIOS, canInstall, installApp } = usePWA();
const showDelayed = ref(false);

const isVisible = computed(() => {
  // Mostramos si:
  // 1. NO está instalada
  // 2. Ya pasaron los segundos de cortesía (para no asustar)
  // 3. Si es Android, solo si 'canInstall' es true (el navegador dio permiso)
  // 4. Si es iOS, siempre (porque no tenemos el evento 'canInstall')
  return !isInstalled.value && showDelayed.value && (isIOS.value || canInstall.value);
});

const handleInstall = async () => {
  await installApp();
};

onMounted(() => {
  // Retraso de 2 segundos para que el usuario vea la web antes del bloqueo
  setTimeout(() => {
    showDelayed.value = true;
  }, 2000);
});

// Emitimos un evento cuando se instale para que el componente de notificaciones sepa que puede salir
const emit = defineEmits(['installed']);
watch(isInstalled, (newVal) => {
  if (newVal) {
    emit('installed');
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
