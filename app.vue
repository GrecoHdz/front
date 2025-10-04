<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useHead } from '#imports'

// Forzar modo oscuro en el servidor y cliente
useHead({
  html: {
    class: 'dark',
    'data-theme': 'dark',
    style: 'color-scheme: dark; background-color: #111827;'
  },
  body: {
    class: 'bg-gray-900 text-white',
    style: 'background-color: #111827; color: white;',
    'data-theme': 'dark'
  },
  meta: [
    { name: 'theme-color', content: '#111827' },
    { name: 'color-scheme', content: 'dark' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
})

// Asegurar que el modo oscuro se aplique en el cliente
if (process.client) {
  // Forzar modo oscuro en el elemento html
  document.documentElement.classList.add('dark')
  document.documentElement.style.colorScheme = 'dark'
  document.documentElement.style.backgroundColor = '#111827'
  document.documentElement.setAttribute('data-theme', 'dark')
  
  // Aplicar estilos al body
  document.body.classList.add('bg-gray-900', 'text-white')
  document.body.style.backgroundColor = '#111827'
  
  // Forzar tema oscuro en localStorage para consistencia
  localStorage.setItem('theme', 'dark')
  
  // Asegurar que los estilos se mantengan incluso si hay cambios dinámicos
  const observer = new MutationObserver((mutations) => {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark')
    }
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
    childList: false,
    subtree: false
  })
}
</script>
