<template>
  <div>
    <!-- Full Width Header with Technician Theme -->
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
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
              <div class="w-5 h-5 bg-white rounded-lg flex items-center justify-center">
                <span class="text-emerald-600 font-bold text-xs">👨‍🔧</span>
              </div>
            </div>
            <div>
              <h1 class="text-lg font-black text-white">Servicios Asignados</h1>
              <div class="flex items-center space-x-2">
                <p class="text-emerald-100 text-xs">{{ totalServices }} servicios</p>
                <span class="w-1 h-1 bg-emerald-200 rounded-full"></span>
                <div class="flex items-center space-x-1"> 
                  <span class="text-emerald-100 text-xs">Técnico {{ auth.user?.nombre || 'a' }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2"> 
            
            <!-- Filter Toggle Button -->
            <button @click="toggleFilters" 
                    class="p-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all duration-300"
                    :class="{ 'bg-white/30': showFilters }">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 7V4z"/>
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
        
        <!-- Service Status Filter -->
        <div class="grid grid-cols-2 gap-2 mb-3">
          <button 
            v-for="filter in serviceFilters" 
            :key="filter.key"
            @click="$emit('filter-change', filter.key)"
            class="py-2 px-3 rounded-lg font-bold text-xs transition-all duration-300 flex items-center justify-center space-x-1"
            :class="currentFilter === filter.key 
              ? 'bg-emerald-500 text-white shadow-md' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'"
          >
            <span class="text-sm">{{ filter.icon }}</span>
            <span>{{ filter.label }}</span>
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
                :class="selectedServiceTypesArray.includes(service.name) 
                  ? 'bg-teal-500 text-white' 
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
                ? 'bg-cyan-500 text-white' 
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
import { defineProps, defineEmits, computed } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';

// Filtros de servicio
const serviceFilters = [
  { key: 'all', label: 'Todos', icon: '📋' },
  { key: 'asignado', label: 'Asignados', icon: '👨‍🔧' },
  { key: 'finalizado', label: 'Finalizados', icon: '✅' }
]

// Asegurar que selectedServiceTypes siempre sea un array
const selectedServiceTypesArray = computed(() => Array.isArray(props.selectedServiceTypes) ? props.selectedServiceTypes : [])

// Períodos de fecha
const datePeriods = [
  { key: 'all', label: 'Todo' },
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' }
]

const props = defineProps({
  totalServices: {
    type: Number,
    default: 0
  },
  showFilters: {
    type: Boolean,
    default: false
  },
  serviceTypes: {
    type: Array,
    default: () => []
  },
  currentFilter: {
    type: String,
    default: 'all'
  },
  currentDateFilter: {
    type: String,
    default: 'all'
  },
  isLoadingServiceTypes: {
    type: Boolean,
    default: false
  },
  selectedServiceTypes: {
    type: Array,
    default: () => []
  },

});

const auth = useAuthStore();
const emit = defineEmits([
  'toggle-filters',
  'update:currentFilter',
  'search',
  'refresh',
  'service-type-toggle'
]);

// Computed para el estado de disponibilidad
const toggleFilters = () => {
  emit('toggle-filters');
};


</script>

<style scoped>
/* Custom animations for the header */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Gradient border effect */
.gradient-border {
  background: linear-gradient(45deg, #10b981, #06b6d4, #3b82f6);
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Filter button hover effects */
.filter-button {
  position: relative;
  overflow: hidden;
}

.filter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.filter-button:hover::before {
  left: 100%;
}

/* Status indicator animation */
.status-indicator {
  animation: pulse 2s infinite;
}

/* Backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button active states */
.active-filter {
  transform: scale(0.95);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Mobile-first responsive design */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }
  
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.25rem;
  }
}

/* Dark mode enhancements */
.dark .bg-white\/20 {
  background-color: rgba(255, 255, 255, 0.1);
}

.dark .border-white\/30 {
  border-color: rgba(255, 255, 255, 0.2);
}

/* Focus states for accessibility */
button:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}

.dark button:focus {
  outline-color: rgba(96, 165, 250, 0.5);
}

/* Loading animation */
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

.animate-pulse {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
}

.dark .animate-pulse {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200px 100%;
}
</style>