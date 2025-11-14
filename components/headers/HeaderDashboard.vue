<template>
    <!-- Toast Notifications -->
    <Toast 
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
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
          <div class="relative z-50">
            <button 
              @click="toggleNotifications" 
              class="relative px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Notificaciones</span>
              <span v-if="unreadCount > 0" 
                    class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            
            <!-- Menú de notificaciones -->
            <div v-if="showNotifications" class="fixed right-4 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-200 ease-in-out">
              <!-- Encabezado -->
              <div class="bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-4">
                <div class="flex items-start justify-between">
                  <div class="space-y-1">
                    <h3 class="text-sm font-semibold text-white tracking-wide">Notificaciones Recientes</h3>
                    <p class="text-xs text-white/90 font-medium">
                      {{ unreadCount }} {{ unreadCount === 1 ? 'notificación' : 'notificaciones' }} sin leer
                    </p>
                  </div>
                  <button 
                    @click="showNotifications = false" 
                    class="p-1 -mt-1 -mr-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Cerrar notificaciones"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
              </div>
              </div>
              
              
              <!-- Lista de notificaciones -->
              <div class="max-h-96 overflow-y-auto">
                <!-- Estado de carga -->
                <div v-if="loading" class="p-6 text-center">
                  <div class="animate-pulse space-y-3">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
                
                <!-- Mensaje de error -->
                <div v-else-if="error" class="p-4 text-center text-red-500 text-sm">
                  <div class="inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ error }}
                  </div>
                </div>
                
                <!-- Sin notificaciones -->
                <div v-else-if="allNotificaciones.length === 0" class="p-6 text-center">
                  <div class="text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p class="text-sm">No hay notificaciones nuevas</p>
                  </div>
                </div>
                
                <!-- Lista de notificaciones -->
                <div v-else class="divide-y divide-gray-100">
                  <div v-for="(notif, index) in allNotificaciones" :key="index"
                       class="group px-4 py-3 transition-colors duration-150 cursor-pointer"
                       :class="{
                         'bg-emerald-50': !notif.leido,
                         'hover:bg-gray-50': notif.leido,
                         'border-l-4 border-emerald-500': !notif.leido
                       }">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 mt-0.5">
                        <div class="h-8 w-8 rounded-full flex items-center justify-center"
                             :class="{
                               'bg-emerald-100': !notif.leido,
                               'bg-gray-100': notif.leido
                             }">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{
                            'text-emerald-600': !notif.leido,
                            'text-gray-400': notif.leido
                          }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path v-if="!notif.leido" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-3 flex-1">
                        <p class="text-sm font-medium transition-colors" :class="{
                          'text-gray-900 group-hover:text-emerald-600': !notif.leido,
                          'text-gray-500': notif.leido
                        }">
                          {{ notif.titulo }}
                        </p>
                        <p class="mt-1 text-xs" :class="{
                          'text-gray-500': !notif.leido,
                          'text-gray-400': notif.leido
                        }">
                          {{ formatFecha(notif.fecha) }}
                        </p>
                      </div> 
                    </div>
                  </div>
                  
                  <!-- Controles de paginación -->
                  <div v-if="totalPages > 1" class="p-2 border-t">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <button 
                          v-if="unreadCount > 0"
                          @click.stop="marcarTodasComoLeidas"
                          class="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                          :class="{
                            'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 hover:from-emerald-100 hover:to-teal-100 border border-emerald-100': !loading,
                            'bg-gray-100 text-gray-400 cursor-not-allowed': loading
                          }"
                          :disabled="loading"
                        >
                          <svg v-if="loading" class="animate-spin h-3.5 w-3.5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Marcar todo como leído</span>
                        </button>
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click.stop="prevPage" 
                          :disabled="currentPage === 1"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100 transition-colors"
                          :class="{ 'cursor-not-allowed': currentPage === 1 }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span class="px-2 text-xs font-medium text-gray-500">
                          {{ currentPage }} / {{ totalPages }}
                        </span>
                        <button 
                          @click.stop="nextPage" 
                          :disabled="!hasNextPage"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-500 hover:bg-gray-100 transition-colors"
                          :class="{ 'cursor-not-allowed': !hasNextPage }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
               
            </div>
          </div>
        </div>
      </div>
    </header>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';
import { useRuntimeConfig } from '#app';
import Toast from '~/components/ui/Toast.vue';

const config = useRuntimeConfig();
const auth = useAuthStore();

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

// Estados
const showFilters = ref(false);
const showNotifications = ref(false);
const allNotificaciones = ref([]);
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalItems = ref(0);
const totalPages = ref(1);
const itemsPerPage = 3; // Mostrar 3 notificaciones por página

// Cache
const cache = ref({
  notifications: {},
  lastUpdated: null,
  CACHE_DURATION: 30000 // 30 segundos de caché
});

// Computed properties
const hasPrevPage = computed(() => currentPage.value > 1);
const hasNextPage = computed(() => currentPage.value < totalPages.value);

// Contador de notificaciones no leídas
const unreadCount = ref(0);

const toggleFilters = () => {
  showFilters.value = !showFilters.value;
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  
  if (showNotifications.value) {
    await obtenerNotificaciones(1);
  }
};

const obtenerNotificaciones = async (page = 1, forceRefresh = false) => {
  if (!auth.user?.id_usuario) return;
  
  const now = Date.now();
  const cacheKey = `page-${page}`;
  const isCacheValid = cache.value.lastUpdated && 
                      (now - cache.value.lastUpdated) < cache.value.CACHE_DURATION;
  
  // Retornar datos en caché si son válidos y no se fuerza actualización
  if (isCacheValid && cache.value.notifications[cacheKey] && !forceRefresh) {
    const cached = cache.value.notifications[cacheKey];
    allNotificaciones.value = cached.data;
    totalItems.value = cached.pagination.total;
    currentPage.value = page;
    totalPages.value = cached.pagination.totalPages;
    unreadCount.value = cached.unreadCount;
    return;
  }
  
  try {
    loading.value = true;
    error.value = null;
    
    const response = await $fetch(`/notificaciones/usuario/${auth.user.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      params: {
        page,
        limit: itemsPerPage
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response.success) {
      console.log('Notificaciones recibidas del servidor:', response);
      
      // Actualizar caché
      cache.value.notifications[cacheKey] = {
        data: response.data,
        pagination: response.pagination,
        unreadCount: response.unreadCount,
        timestamp: now
      };
      cache.value.lastUpdated = now;
      
      // Actualizar estado
      allNotificaciones.value = response.data;
      totalItems.value = response.pagination.total;
      currentPage.value = page;
      totalPages.value = response.pagination.totalPages;
      
      if (typeof response.unreadCount !== 'undefined') {
        unreadCount.value = response.unreadCount;
      }
    }
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    error.value = 'No se pudieron cargar las notificaciones';
  } finally {
    loading.value = false;
  }
};

// Formatear fecha a un formato legible
const formatFecha = (fechaString) => {
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Marcar todas las notificaciones como leídas
const marcarTodasComoLeidas = async () => {
  if (unreadCount.value === 0) return;
  
  try {
    loading.value = true;
    
    const requestData = {
      id_usuario: auth.user?.id_usuario
    };
    
    console.log('=== ENVIANDO PETICIÓN ===');
    console.log('URL:', `${config.public.apiBase}/notificaciones/marcar/leidas`);
    console.log('Método: PUT');
    console.log('Headers:', {
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth.token?.substring(0, 20)}...`,
      'Content-Type': 'application/json'
    });
    console.log('Body:', requestData);
    
    const response = await $fetch('/notificaciones/marcar/leidas', {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log('=== RESPUESTA DEL SERVIDOR ===');
    console.log('Status:', response.success ? 'Éxito' : 'Error');
    console.log('Mensaje:', response.message);
    console.log('Datos completos:', response);

    if (response.success) {
      // Invalidar caché
      cache.value = {
        notifications: {},
        lastUpdated: null,
        CACHE_DURATION: 30000
      };
      
      // Actualizar el estado local
      allNotificaciones.value.forEach(notif => {
        notif.leido = true;
      });
      
      // Actualizar contador
      unreadCount.value = 0;
      
      // Forzar actualización desde el servidor
      await obtenerNotificaciones(currentPage.value, true);
      
      if (response.updatedCount > 0) {
        showToast(
          `Se marcaron ${response.updatedCount} notificaciones como leídas`,
          'success',
          3000
        );
      }
    }
  } catch (err) {
    console.error('Error al marcar todas como leídas:', err);
    showToast(
      'Error al marcar las notificaciones como leídas',
      'error',
      3000
    );
  } finally {
    loading.value = false;
  }
};


// Navegación de páginas
const nextPage = async () => {
  if (hasNextPage.value) {
    await obtenerNotificaciones(currentPage.value + 1);
  }
};

const prevPage = async () => {
  if (hasPrevPage.value) {
    await obtenerNotificaciones(currentPage.value - 1);
  }
};

const goToPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await obtenerNotificaciones(page);
  }
};

// Obtener notificaciones al montar el componente
onMounted(() => {
  if (auth.user?.id_usuario) {
    obtenerNotificaciones();
  }
});
</script>