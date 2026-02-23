<template>
  <!-- Toast Notifications -->
  <Toast 
    v-if="toast.show"
    :message="toast.message"
    :type="toast.type"
    :duration="toast.duration"
    @close="toast.show = false"
  />

  <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading"
    />
  
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
        <!-- Componente de notificaciones -->
        <NotificationsDropdown 
          @notification-click="onNotificationClick"
        />

      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';
import Toast from '~/components/ui/Toast.vue';
import NotificationsDropdown from '~/components/ui/NotificationsDropdown.vue';
import { useRuntimeConfig, useNuxtApp } from '#imports';
import { useRouter } from 'vue-router'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue' 


// ===== CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const isLoading = ref(false)


// Toast state
const toast = reactive({
  show: false,
  message: '',
  type: 'success',
  duration: 3000
});

// Mostrar notificación toast
const showToast = (message, type = 'success', duration = 3000) => {
  toast.message = message;
  toast.type = type;
  toast.duration = duration;
  toast.show = true;
};

// Manejar clic en notificación
const onNotificationClick = async (notification) => {
  // Activar loading spinner
  isLoading.value = true;

  try {
    const response = await $api('/notificaciones/marcar/individual', {
      method: 'PUT',
      body: {
        id_destinatario_notificacion: notification.id
      }
    }); 

  } catch (error) {
    // Log del error completo
    console.error('❌ Error al marcar notificación:', {
      message: error.message,
      error
    });

    showToast('Error al marcar notificación', 'error', 3000);
    
    // Desactivar loading en caso de error
    isLoading.value = false;
    return; // Salir de la función si hay error
  }
  
  // Navegación por tipo de notificación 
  try {
    if (notification.titulo === 'CashBack Recibido') {
      await navigateTo('/admin/Marketplace');
    } else if (notification.titulo === 'Pago de Paquete Aceptado') {
      await navigateTo('/admin/Marketplace');
    } else if (notification.titulo === 'Pago de Paquete Rechazado') {
      await navigateTo('/admin/Marketplace');
    } else if (notification.tipo === 'servicios') {
      await navigateTo('/admin/ServiciosAdmin');
    } else if (notification.tipo === 'membresia') { 
      await navigateTo('/admin/ReportesAdmin');
    } else if (notification.tipo === 'financieros') { 
      await navigateTo('/admin/ReportesAdmin');
    } else if (notification.tipo === 'usuario') { 
      await navigateTo('/admin/UsuariosAdmin');
    } else if (notification.tipo === 'paquetes') { 
      await navigateTo('/admin/ServiciosAdmin');
    } else if (notification.tipo === 'ticket') { 
      await navigateTo('/admin/DashboardAdmin');
    }
  } finally {
    // Asegurarse de que el loading siempre se desactive
    isLoading.value = false;
  }
};
</script>