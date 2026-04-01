<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Pantalla de Puente para Facebook/Instagram -->
    <div v-if="isIAB && showIABNotice" class="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
        <!-- Logo animado y advertencia -->
        <div class="mb-8 relative">
            <div class="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center animate-pulse">
                <span class="text-5xl">🌐</span>
            </div>
            <div class="absolute -bottom-2 -right-2 bg-amber-500 text-white p-2 rounded-full border-4 border-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
        </div>

        <h1 class="text-2xl font-black mb-4">¡Para una mejor experiencia!</h1>
        <p class="text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto text-sm">
            Facebook limita algunas funciones de seguridad.
            <br><br>
            <strong class="text-white">Abre nuestra comunidad en tu navegador nativo</strong> para evitar errores al cargar tu perfil o información.
        </p>

        <!-- Botón según plataforma -->
        <a 
            :href="getExternalBrowserLink()"
            class="w-full max-w-sm py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center space-x-3 mb-6"
            target="_blank"
        >
            <span class="text-lg">🚀 Abrir en mi navegador</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>

        <!-- Instrucciones para iOS si está en iPhone -->
        <div v-if="isIOS" class="mt-4 p-5 bg-gray-800/40 rounded-3xl border border-gray-700/50 text-xs text-gray-300 backdrop-blur-md">
            <p class="flex items-center justify-center gap-2 mb-3">
                <span class="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[10px]">1</span>
                <span>Pulsa los 3 puntos <span class="font-bold text-white ml-1">...</span></span>
            </p>
            <p class="flex items-center justify-center gap-2">
                <span class="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-[10px]">2</span>
                <span>Elige <span class="text-blue-400 font-bold ml-1">"Abrir en el navegador"</span></span>
            </p>
        </div>

        <!-- Continuar de todas formas -->
        <button 
            @click="showIABNotice = false" 
            class="mt-12 text-gray-600 dark:text-gray-500 text-xs hover:text-white transition-colors underline underline-offset-4"
        >
            Continuar en Facebook (No recomendado)
        </button>
    </div>

    <!-- Contenido normal de la app -->
    <div v-show="!isIAB || !showIABNotice">
      <LoadingSpinner 
        :loading="isLoading"
        class="fixed inset-0 z-50"
      />  
      <NuxtLayout>
        <NuxtPage/>
      </NuxtLayout>
      <Analytics />
    </div>
  </div>
</template>

<style>
/* Estilos críticos para modo oscuro */
:root {
  color-scheme: dark;
  background-color: #111827;
  color: white;
}

html, body, #__nuxt {
  background-color: #111827;
  color: white;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

/* Asegurar que el spinner tenga fondo oscuro */
:deep(.bg-white) {
  background-color: #111827 !important;
}

:deep(.bg-gray-800) {
  background-color: #111827 !important;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { Analytics } from '@vercel/analytics/nuxt';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import { useIABDetector } from '~/composables/useIABDetector';

const isLoading = ref(true);
const showIABNotice = ref(true);
const { isIAB, isIOS, getExternalBrowserLink } = useIABDetector();

// Configuración del tema oscuro
useHead({
  html: { 
    class: 'dark',
    'data-theme': 'dark',
    style: 'color-scheme: dark; background-color: #111827;',
    'data-n-head': 'ssr'
  },
  body: {
    class: 'bg-gray-900 text-white',
    style: 'background-color: #111827; color: white;',
    'data-theme': 'dark',
    'data-n-head': 'ssr'
  },
  meta: [
    { name: 'theme-color', content: '#111827' },
    { name: 'color-scheme', content: 'dark' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
});

onMounted(() => {
  if (process.client) {
    // Aplicar modo oscuro inmediatamente para evitar parpadeos
    const applyDarkMode = () => {
      const html = document.documentElement;
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#111827';
    };

    // Ocultar el spinner de forma proactiva
    const hideSpinner = () => {
      setTimeout(() => {
        isLoading.value = false;
      }, 300);
    };

    applyDarkMode();
    hideSpinner();
  }
});
</script>