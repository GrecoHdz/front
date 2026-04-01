<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Pantalla de Puente para Facebook/Instagram -->
    <div v-if="isIAB" class="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
        <span class="text-6xl mb-6">🌐</span>
        <h1 class="text-xl font-black mb-8 max-w-xs leading-snug text-white">
            Para una mejor experiencia ábrelo en tu navegador
        </h1>
        <a
            :href="getExternalBrowserLink()"
            class="w-full max-w-sm py-5 bg-blue-600 text-white font-black rounded-3xl shadow-2xl shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3"
            target="_blank"
        >
            🚀 Abrir en mi navegador
        </a>
    </div>


    <!-- Contenido normal de la app -->
    <div v-show="!isIAB">
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