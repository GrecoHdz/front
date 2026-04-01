<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- LoadingSpinner con fondo oscuro -->
    <LoadingSpinner 
      :loading="isLoading"
      class="fixed inset-0 z-50"
    />  
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <Analytics />
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

const isLoading = ref(true);

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
      // Un pequeño retraso para asegurar que la transición sea suave
      setTimeout(() => {
        isLoading.value = false;
      }, 300);
    };

    applyDarkMode();
    
    // En Nuxt/Vue, onMounted ya garantiza que el componente está listo.
    // No necesitamos esperar a que todos los recursos externos (window.load) carguen,
    // ya que eso puede fallar o tardar demasiado en navegadores embebidos como el de Facebook.
    hideSpinner();
  }
});
</script>