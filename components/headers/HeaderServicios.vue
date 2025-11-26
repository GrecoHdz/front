<template>
  <div>
    <!-- Full Width Header -->
    <header class="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
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
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div class="w-5 h-5 bg-white rounded-lg flex items-center justify-center">
                <span class="text-blue-600 font-bold text-xs">🛠️</span>
              </div>
            </div>
            <div>
              <h1 class="text-lg font-black text-white">Mis Servicios</h1>
              <p class="text-blue-100 text-xs">{{ totalServices }} servicios solicitados</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">

           <!-- Componente de notificaciones -->
        <NotificationsDropdown 
          @notification-click="onNotificationClick"
        />

            <!-- Botón de filtros -->
            <button @click="toggleFilters" 
                    class="p-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Filter Section -->
    <div v-if="showFilters" class="bg-white dark:bg-gray-800 shadow-lg">
      <div class="max-w-2xl mx-auto px-4 py-4">
        <h3 class="font-black text-gray-900 dark:text-white mb-3 text-sm">Filtrar por:</h3>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <button 
            v-for="filter in serviceFilters" 
            :key="filter.key"
            @click="$emit('filter-change', filter.key)"
            class="py-2 px-3 rounded-lg font-bold text-xs transition-all duration-300"
            :class="currentFilter === filter.key 
              ? 'bg-blue-500 text-white shadow-md' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            {{ filter.label }}
          </button>
        </div>
        
        <!-- Service Type Filter -->
        <div class="mb-3">
          <h4 class="font-bold text-gray-700 dark:text-gray-300 text-xs mb-2">Tipo de servicio:</h4>
          <div v-if="isLoadingServiceTypes" class="flex flex-wrap gap-1">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-20"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-16"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-24"></div>
          </div>
          <div v-else class="flex flex-wrap gap-1">
            <template v-for="(service, index) in serviceTypes" :key="index">
              <button 
                v-if="service && service.active !== false"
                @click="$emit('service-type-toggle', service.name)"
                class="px-2 py-1 rounded-lg text-xs font-bold transition-all duration-300"
                :class="selectedServiceTypes.includes(service.name) 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
                :title="service.description || ''"
              >
                <span v-if="service.icon">{{ service.icon }} </span>
                {{ service.name || 'Servicio' }}
              </button>
            </template>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div>
          <h4 class="font-bold text-gray-700 dark:text-gray-300 text-xs mb-2">Período:</h4>
          <div class="grid grid-cols-3 gap-1">
            <button 
              v-for="period in datePeriods" 
              :key="period.key"
              @click="$emit('date-filter-change', period.key)"
              class="py-1 px-2 rounded-lg text-xs font-bold transition-all duration-300"
              :class="currentDateFilter === period.key 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
            >
              {{ period.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import NotificationsDropdown from '~/components/ui/NotificationsDropdown.vue';
import { useRuntimeConfig } from '#imports';
import { useRouter } from 'vue-router'

// ===== CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const props = defineProps({
  totalServices: {
    type: Number,
    default: 0
  },
  showFilters: {
    type: Boolean,
    default: false
  },
  serviceFilters: {
    type: Array,
    default: () => []
  },
  serviceTypes: {
    type: Array,
    default: () => []
  },
  datePeriods: {
    type: Array,
    default: () => []
  },
  currentFilter: {
    type: String,
    default: ''
  },
  currentDateFilter: {
    type: String,
    default: ''
  },
  selectedServiceTypes: {
    type: Array,
    default: () => []
  },
  isLoadingServiceTypes: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'toggle-filters',
  'filter-change',
  'service-type-toggle',
  'date-filter-change'
]);

const toggleFilters = () => {
  emit('toggle-filters');
};

// Manejar clic en notificación
const onNotificationClick = async (notification) => {
  // Log del objeto notificación recibido
  console.log('🔔 Notificación clickeada:', notification);

  // Log de lo que se enviará al backend
  console.log('📤 Datos enviados al backend:', {
    url: `${config.public.apiBase}/notificaciones/marcar/individual`,
    method: 'PUT',
    body: {
      id_destinatario_notificacion: notification.id
    },
    token: auth.token ? 'TOKEN_PRESENTE' : 'SIN_TOKEN'
  });

  try {
    const response = await $fetch('/notificaciones/marcar/individual', {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        id_destinatario_notificacion: notification.id
      }
    });

    // Log de la respuesta del backend
    console.log('📥 Respuesta del backend (marcar notificación):', response);

  } catch (error) {
    // Log del error completo
    console.error('❌ Error al marcar notificación:', {
      message: error.message,
      error
    });

    showToast('Error al marcar notificación', 'error', 3000);
  }
  
  // Ejemplo de cómo podrías manejar diferentes tipos de notificaciones
  if (notification.tipo === 'servicios') {
    navigateTo('/cliente/Servicios');
  } else if (notification.tipo === 'membresia') { 
    navigateTo('/cliente/DashboardCliente');
  } else if (notification.tipo === 'financieros') { 
    navigateTo('/cliente/Servicios');
  }
};
</script>