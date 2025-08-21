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
                      ¡Hola, {{ currentUser?.name || 'Técnico' }}!
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

          <!-- Servicios Asignados -->
          <section class="px-6 mb-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-black text-gray-900 dark:text-white">Servicios Asignados</h3>
              <button @click="refreshServices" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">Cargando servicios...</p>
            </div>
            
            <div v-else-if="services.length === 0" class="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No hay servicios asignados</h4>
              <p class="text-gray-500 dark:text-gray-400">No tienes servicios asignados por el momento.</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="service in services" :key="service.id" 
                   class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="font-bold text-gray-900 dark:text-white">{{ service.title }}</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ service.location }}
                    </p>
                  </div>
                  <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(service.status)}`">
                    {{ formatStatus(service.status) }}
                  </span>
                </div>
                
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span class="text-sm text-gray-600 dark:text-gray-300">{{ service.date }}</span>
                  </div>
                  
                  <button @click="viewServiceDetails(service.id)" 
                          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="px-6 mb-6">
            <h3 class="text-xl font-black text-gray-900 dark:text-white mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-2 gap-4">
              <button @click="updateAvailability" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Actualizar Disponibilidad</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Gestiona tu horario</p>
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

    <FootersFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/middleware/auth.store'

//Autenticacion
const auth = useAuthStore()

const router = useRouter();
const currentUser = ref(auth.user);

// Verificar rol de técnico
onMounted(() => {
  if (!auth.isAuthenticated || auth.user.role !== 'Tecnico') {
    router.push('/acceso-denegado');
  }
  fetchServices();
});

// Datos de ejemplo para servicios asignados
const loading = ref(false);
const services = ref([
  {
    id: 1,
    title: 'Reparación de tubería',
    location: 'Col. Palmira, Tegucigalpa',
    date: 'Hoy, 2:00 PM',
    status: 'pending',
    description: 'Fuga de agua en el baño principal',
    client: 'Juan Pérez',
    phone: '+504 9999-9999'
  },
  {
    id: 2,
    title: 'Mantenimiento eléctrico',
    location: 'Col. Florencia, Tegucigalpa',
    date: 'Mañana, 9:00 AM',
    status: 'scheduled',
    description: 'Revisión de instalación eléctrica',
    client: 'María López',
    phone: '+504 8888-8888'
  },
  {
    id: 3,
    title: 'Reparación de techo',
    location: 'Col. Las Brisas, Tegucigalpa',
    date: '15 Ago, 10:00 AM',
    status: 'completed',
    description: 'Goteras en el techo de la sala',
    client: 'Carlos Martínez',
    phone: '+504 7777-7777'
  }
]);

// Estadísticas
const stats = ref({
  activeServices: 2,
  rating: 4.8,
  completedServices: 24,
  responseTime: '2h 15m'
});

// Obtener servicios del API
const fetchServices = async () => {
  try {
    loading.value = true;
    // Aquí iría la llamada a tu API
    // const response = await $fetch('/api/technician/services');
    // services.value = response.data;
    loading.value = false;
  } catch (error) {
    console.error('Error al cargar servicios:', error);
    loading.value = false;
  }
};

// Actualizar disponibilidad
const updateAvailability = () => {
  // Lógica para actualizar disponibilidad
  console.log('Actualizando disponibilidad');
};

// Ver reportes
const viewReports = () => {
  // Navegar a la página de reportes
  router.push('/tecnico/reportes');
};

// Ver detalles del servicio
const viewServiceDetails = (serviceId) => {
  // Navegar a la página de detalles del servicio
  router.push(`/tecnico/servicios/${serviceId}`);
};

// Actualizar lista de servicios
const refreshServices = () => {
  fetchServices();
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
