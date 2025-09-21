<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO Head -->
    <Head>
      <title>HogarSeguro - Panel de Técnico</title>
      <meta name="description" content="Panel de control de Técnico - Gestiona tus servicios y asignaciones" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <HeadersHeaderDashboard />

    <!-- Content Container -->
    <div class="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
      <div class="pb-24">
        <!-- Main Content -->
        <main class="pb-4">
          <!-- Welcome Section -->
          <section class="px-6 py-6">
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <!-- Background decoration -->
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
              <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
              
              <div class="relative">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span class="text-white text-2xl">👨‍🔧</span>
                  </div>
                  <div>
                    <h2 class="text-2xl font-black text-gray-900 dark:text-white">
                      ¡Hola, {{ currentUser?.nombre || 'Técnico' }}!
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400">Bienvenido al panel de técnico</p>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl">
                  <p class="text-blue-800 dark:text-blue-200 font-medium text-center">
                    🛠️ Gestiona tus servicios asignados
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Stats Cards -->
          <section class="px-6 mb-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                    <span class="text-white text-xl">📋</span>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Servicios Activos</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.activeServices }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <span class="text-white text-xl">⭐</span>
                  </div>
                  <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Calificación</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.rating }}/5</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Servicios Recientes -->
          <section class="px-4 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">Servicios Recientes</h3>
              <NuxtLink to="/tecnico/ServiciosTecnico" class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                Ver todos
              </NuxtLink>
            </div>
            
            <div v-if="loading" class="py-8 flex justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
            
            <div v-else-if="services.length === 0" class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700">
              <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-1">Sin servicios</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">No hay servicios asignados</p>
            </div>
            
            <div v-else class="space-y-3">
              <div v-for="service in services.slice(0, 2)" :key="service.id" 
                   class="group bg-white dark:bg-gray-800 rounded-xl p-4 hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200 cursor-pointer"
                   @click="viewServiceDetails(service.id)">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <span class="text-blue-500 text-lg">🔧</span>
                      </div>
                      <div class="min-w-0">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ service.title }}</h4>
                        <div class="flex items-center mt-1">
                          <span :class="`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(service.status)}`">
                            {{ formatStatus(service.status) }}
                          </span>
                          <span class="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatRelativeDate(service.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button @click.stop="viewServiceDetails(service.id)" class="text-gray-400 hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <NuxtLink v-if="services.length > 2" to="/tecnico/ServiciosTecnico" class="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2">
                Ver {{ services.length - 2 }} más
              </NuxtLink>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="px-6 mb-6">
            <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-2 gap-4">
              <button @click="updateAvailability" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="isAvailable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-5 w-5" 
                      :class="isAvailable ? 'text-green-500' : 'text-red-500'"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path 
                        v-if="isAvailable"
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                      <path 
                        v-else
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div class="w-full">
                    <p class="font-medium text-gray-900 dark:text-white">
                      {{ isAvailable ? 'Disponible' : 'No disponible' }}
                    </p>
                    <div class="flex items-center justify-between mt-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ isAvailable ? 'Activo para nuevos trabajos' : 'No disponible temporalmente' }}
                      </span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          :checked="isAvailable"
                          @change="updateAvailability"
                          class="sr-only peer"
                        >
                        <div 
                          class="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          :class="isAvailable 
                            ? 'bg-green-500 after:border-green-500' 
                            : 'bg-red-500 after:border-red-500'"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </button>
              
              <button @click="viewReports" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Ver Reportes</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Estadísticas y métricas</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>

    <FootersFooterTecnico />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/middleware/auth.store';
import { useNuxtApp } from '#app';
const config = useRuntimeConfig();

//Autenticacion
const auth = useAuthStore()

const router = useRouter();
const currentUser = ref(auth.user);

// Verificar rol de técnico
onMounted(() => { 
  fetchServices();
});

// Datos para servicios asignados
const loading = ref(false);
const services = ref([]);

// Estadísticas
const stats = ref({
  activeServices: 0,
  rating: 4.8,
  completedServices: 0,
  responseTime: '2h 15m'
});

// Obtener servicios del API
const fetchServices = async () => {
  try {
    loading.value = true;
    
    // Obtener el ID del usuario técnico autenticado
    const userId = auth.user?.id_usuario;
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario');
    }
    
    // Hacer la petición a la API para obtener las estadísticas
    const response = await $fetch(`/solicitudservicio/tecnico/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    // Actualizar las estadísticas con los datos de la API
    stats.value = {
      ...stats.value,
      activeServices: response.activas,
      completedServices: response.finalizadas
    };
    
    // Si hay servicios, actualizar la lista de servicios
    if (response.solicitudes && response.solicitudes.length > 0) {
      services.value = response.solicitudes.map(servicio => ({
        id: servicio.id_solicitud,
        title: servicio.servicio?.nombre || 'Servicio sin nombre',
        location: servicio.colonia || 'Ubicación no especificada',
        date: servicio.fecha_solicitud,
        status: servicio.estado,
        description: servicio.descripcion || 'Sin descripción',
        client: servicio.nombre_cliente || 'Cliente no especificado',
        phone: servicio.telefono_contacto || 'Sin teléfono'
      }));
    }
    
  } catch (error) {
    console.error('Error al cargar servicios:', error);
    // Mostrar mensaje de error al usuario
    useNuxtApp().$toast.error('Error al cargar los servicios. Intente de nuevo más tarde.');
  } finally {
    loading.value = false;
  }
};

// Estado de disponibilidad
const isAvailable = ref(true);

// Actualizar disponibilidad
const updateAvailability = async () => {
  try {
    // Invertir el estado actual
    isAvailable.value = !isAvailable.value;
    
    // Aquí iría la llamada a la API para actualizar la disponibilidad
    // await $fetch('/api/technician/availability', {
    //   method: 'POST',
    //   body: { available: isAvailable.value }
    // });
    
    console.log('Disponibilidad actualizada:', isAvailable.value ? 'Disponible' : 'No disponible');
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error);
    // Revertir el cambio si hay un error
    isAvailable.value = !isAvailable.value;
  }
};

// Ver reportes
const viewReports = () => {
  // Navegar a la página de reportes
  router.push('/tecnico/reportes');
};

// Ver detalles del servicio
const viewServiceDetails = (serviceId) => {
  // Navegar a la página de detalles del servicio
  router.push(`/tecnico/ServiciosTecnico/${serviceId}`);
};

// Actualizar lista de servicios
const refreshServices = () => {
  fetchServices();
};

// Formatear fecha relativa (ej: "Hace 2 días")
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Sin fecha';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Hoy';
  } else if (diffInDays === 1) {
    return 'Ayer';
  } else if (diffInDays < 7) {
    return `Hace ${diffInDays} días`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};

// Formatear estado
const formatStatus = (status) => {
  const statusMap = {
    'pending': 'Pendiente',
    'scheduled': 'Programado',
    'in_progress': 'En progreso',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  };
  return statusMap[status] || status;
};

// Clases para el badge de estado
const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'in_progress': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

// Dark mode support
onMounted(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
