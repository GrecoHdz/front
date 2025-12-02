<template>
  <div class="relative" ref="dropdownContainer">
    <!-- Botón de notificaciones -->
    <button 
      @click="toggleNotifications" 
      class="relative px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-1"
      :class="{ 'bg-white/30': showNotifications }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span>Notificaciones</span>
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>
    
    <!-- Menú desplegable de notificaciones -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      leave-active-class="transition duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <!-- Backdrop para el dropdown -->
      <div 
        v-if="showNotifications" 
        style="position: fixed; left: 0; top: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.2); z-index: 999999;"
        @click="closeDropdown"
      />
    </Transition>
    
    <Transition
      enter-active-class="transition duration-200 ease-out"
      leave-active-class="transition duration-150 ease-in"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
    >
      <div 
        v-if="showNotifications" 
        style="position: fixed; right: 16px; top: 64px; left: auto; width: 320px; background-color: white; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; transform: transition: all 0.2s ease-in-out; z-index: 1000000;"
      >
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
              @click="closeDropdown"
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
          <div v-else-if="allNotifications.length === 0" class="p-6 text-center">
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <p class="text-sm">No hay notificaciones nuevas</p>
            </div>
          </div>
          
          <!-- Lista de notificaciones -->
          <div v-else class="divide-y divide-gray-100">
            <div 
              v-for="(notif, index) in allNotifications" 
              :key="index"
              class="group px-4 py-3 transition-colors duration-150 cursor-pointer"
              :class="{
                'bg-emerald-50': !notif.leido,
                'hover:bg-gray-50': notif.leido,
                'border-l-4 border-emerald-500': !notif.leido
              }" 
            >
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-0.5">
                  <div 
                    class="h-8 w-8 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-emerald-100': !notif.leido,
                      'bg-gray-100': notif.leido
                    }"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4" 
                      :class="{
                        'text-emerald-600': !notif.leido,
                        'text-gray-400': notif.leido
                      }" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path v-if="!notif.leido" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3 flex-1">
                  <p 
                    class="text-sm font-medium transition-colors" 
                    :class="{
                      'text-gray-900 group-hover:text-emerald-600': !notif.leido,
                      'text-gray-500': notif.leido
                    }"
                  >
                    {{ notif.titulo }}
                  </p>
                  <p 
                    class="mt-1 text-xs" 
                    :class="{
                      'text-gray-500': !notif.leido,
                      'text-gray-400': notif.leido
                    }"
                  >
                    {{ formatFecha(notif.fecha) }}
                  </p>
                </div> 
              </div>
            </div>
            
            <!-- Controles de paginación -->
            <div v-if="allNotifications.length > 0" class="p-2 border-t">
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
    </Transition>
  </div>

  <!-- Modal de aviso de pagos pendientes -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to">
    <div v-if="showPaymentAdModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to"
      >
        <div 
          v-if="showPaymentAdModal"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closePaymentAdModal"
        ></div>
      </Transition>

      <!-- Contenido del modal con animación -->
      <Transition
        name="modal-content"
        enter-active-class="modal-content-enter-active"
        leave-active-class="modal-content-leave-active"
        enter-from-class="modal-content-enter-from"
        leave-to-class="modal-content-leave-to"
      >
        <div 
          v-if="showPaymentAdModal"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto relative z-10"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-lg">
                  💳
                </div>
                <div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">Aviso Importante</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Pagos Pendientes</p>
                </div>
              </div>
              <button @click="closePaymentAdModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido principal del modal -->
          <div class="p-4">
            <!-- Icono de advertencia -->
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
            </div>

            <!-- Mensaje principal -->
            <div class="text-center mb-6">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Notamos que tienes un pago pendiente. Recuerda que los pagos deben realizarse únicamente a las cuentas oficiales de HogarSeguro.
              </p>
            </div>

            <!-- Advertencia importante -->
            <div class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <div class="flex items-start space-x-2">
                <svg class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <p class="text-xs text-red-700 dark:text-red-300">
                    Cualquier pago realizado en efectivo a técnicos, terceros o a cuentas no autorizadas no será reconocido por la plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/middleware/auth.store';
import { useRuntimeConfig } from '#imports';

const props = defineProps({
  // Permite personalizar el número de notificaciones por página
  itemsPerPage: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['notification-click']);
// ===== Configuración =====
const { $api } = useNuxtApp();
const auth = useAuthStore();
const config = useRuntimeConfig();

// ===== ESTADO DEL MODAL DE ANUNCIO DE PAGO =====
const showPaymentAdModal = ref(false);

// Estados reactivos
const showNotifications = ref(false);
const loading = ref(false);
const error = ref(null);
const allNotifications = ref([]);
const currentPage = ref(1);
const totalItems = ref(0);
const unreadCount = ref(0);

// Cache
const cache = ref({
  notifications: {},
  lastUpdated: null,
  CACHE_DURATION: 30000 // 30 segundos de caché
});

// Computed properties
const totalPages = computed(() => {
  // Asegurarse de que siempre sea al menos 1
  const pages = Math.ceil(totalItems.value / props.itemsPerPage);
  return Math.max(1, pages);
});

const hasNextPage = computed(() => {
  return currentPage.value < totalPages.value;
});

// Métodos
const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  
  if (showNotifications.value) {
    await obtenerNotificaciones(1);
  }
};

const dropdownContainer = ref(null);

const closeDropdown = () => {
  showNotifications.value = false;
};

const handleClickOutside = (event) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  if (auth.user?.id_usuario) {
    obtenerNotificaciones();
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const obtenerNotificaciones = async (page = 1, forceRefresh = false) => {
  if (!auth.user?.id_usuario) return;
  
  const now = Date.now();
  const cacheKey = `page-${page}`;
  const isCacheValid = cache.value.lastUpdated && 
                      (now - cache.value.lastUpdated) < cache.value.CACHE_DURATION;
  
  // Usar caché si es válido y no se fuerza actualización
  if (isCacheValid && cache.value.notifications[cacheKey] && !forceRefresh) {
    const cached = cache.value.notifications[cacheKey];
    allNotifications.value = cached.data;
    totalItems.value = cached.pagination.total;
    currentPage.value = page;
    unreadCount.value = cached.unreadCount;
    return;
  }
  
  try {
    loading.value = true;
    error.value = null; 
    
    // Construir ruta con parámetros de consulta
    const url = `/notificaciones/usuario/${auth.user.id_usuario}?page=${page}&limit=${props.itemsPerPage}`;
    
    const response = await $api(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response && response.success) {
      // Asegurarse de que response.pagination existe y tiene el total
      const total = response.pagination?.total || response.data?.length || 0;
      
      // Actualizar caché
      cache.value.notifications[cacheKey] = {
        data: response.data,
        pagination: {
          ...response.pagination,
          total: total
        },
        unreadCount: response.unreadCount || 0,
        timestamp: now
      };
      cache.value.lastUpdated = now;
      
      // Actualizar estado
      allNotifications.value = response.data || [];
      totalItems.value = total;
      currentPage.value = page;
      
      if (typeof response.unreadCount !== 'undefined') {
        unreadCount.value = response.unreadCount;
      }
      
      // ===== VERIFICACIÓN AUTOMÁTICA DE PAGOS PENDIENTES =====
      // Verificar si hay servicios con pagos pendientes usando el nuevo endpoint
      await verificarPagosPendientes();
      
      // Forzar la actualización del DOM
      await nextTick(); 
    }
  } catch (err) {
    console.error('Error al obtener notificaciones:', err);
    error.value = 'No se pudieron cargar las notificaciones';
  } finally {
    loading.value = false;
  }
};

const marcarTodasComoLeidas = async () => {
  if (unreadCount.value === 0) return;
  
  try {
    loading.value = true;
    
    const requestData = {
      id_usuario: auth.user?.id_usuario
    };
    
    const response = await $api('/notificaciones/marcar/leidas', {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (response.success) {
      // Invalidar caché
      cache.value = {
        notifications: {},
        lastUpdated: null,
        CACHE_DURATION: 30000
      };
      
      // Actualizar estado local
      allNotifications.value.forEach(notif => {
        notif.leido = true;
      });
      
      // Actualizar contador
      unreadCount.value = 0;
      
      // Forzar actualización desde el servidor
      await obtenerNotificaciones(currentPage.value, true);
    }
  } catch (err) {
    console.error('Error al marcar todas como leídas:', err);
  } finally {
    loading.value = false;
  }
};

const nextPage = async () => {
  if (hasNextPage.value) {
    await obtenerNotificaciones(currentPage.value + 1);
  }
};

const prevPage = async () => {
  if (currentPage.value > 1) {
    await obtenerNotificaciones(currentPage.value - 1);
  }
};

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

// ===== FUNCIONES DEL MODAL DE ANUNCIO DE PAGO =====
const openPaymentAdModal = () => {
  showPaymentAdModal.value = true;
};

const closePaymentAdModal = () => {
  showPaymentAdModal.value = false;
};

// ===== VERIFICACIÓN DE PAGOS PENDIENTES =====
const verificarPagosPendientes = async () => {
  try {
    const response = await $api(`/solicitudservicio/pagos-pendientes/${auth.user.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (response && response.success && response.hasPendingPayments) {
      setTimeout(() => {
        openPaymentAdModal();
      }, 1000); // Esperar 1 segundo para que el usuario vea la página
    }
  } catch (error) {
    console.error('Error al verificar pagos pendientes:', error);
  }
};

</script>
