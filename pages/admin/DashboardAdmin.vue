<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO Head -->
    <Head>
      <title>HogarSeguro - Panel de Administración</title>
      <meta name="description" content="Panel de administración de HogarSeguro - Gestión del sistema" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>

    <HeadersHeaderDashboard />

    <!-- Content Container -->
    <div class="max-w-6xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <div class="pb-24">
        <!-- Main Content -->
        <main class="pb-4">
          <!-- Welcome Section -->
          <section class="px-6 py-6">
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
              <div class="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
              
              <div class="relative">
                <div class="flex items-center space-x-4 mb-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <span class="text-white text-2xl">👨‍💼</span>
                  </div>
                  <div>
                    <h2 class="text-2xl font-black text-gray-900 dark:text-white">
                      ¡Bienvenido, {{ currentUser.name }}!
                    </h2>
                    <p class="text-gray-600 dark:text-gray-400">Panel de administración de HogarSeguro</p>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl">
                  <p class="text-blue-800 dark:text-blue-200 font-medium text-center">
                    🛠️ Supervisa y gestiona todos los aspectos del sistema
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Stats Cards -->
          <section class="px-6 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Usuarios Totales</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.totalUsers }}</p>
                    <p class="text-sm text-green-500 flex items-center mt-1">
                      <span class="inline-block mr-1">↑</span>
                      <span>{{ stats.userGrowth }}% este mes</span>
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                    <span class="text-blue-600 dark:text-blue-400 text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Servicios Activos</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.activeServices }}</p>
                    <p class="text-sm text-blue-500 mt-1">{{ stats.pendingServices }} pendientes</p>
                  </div>
                  <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                    <span class="text-green-600 dark:text-green-400 text-2xl">🔧</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Ingresos Mensuales</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">L. {{ formatNumber(stats.monthlyRevenue) }}</p>
                    <p class="text-sm text-purple-500 flex items-center mt-1">
                      <span class="inline-block mr-1">↑</span>
                      <span>{{ stats.revenueGrowth }}% vs mes anterior</span>
                    </p>
                  </div>
                  <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
                    <span class="text-purple-600 dark:text-purple-400 text-2xl">💰</span>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">Soporte</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ stats.openTickets }}</p>
                    <p class="text-sm text-yellow-500 mt-1">{{ stats.highPriorityTickets }} prioridad alta</p>
                  </div>
                  <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center">
                    <span class="text-yellow-600 dark:text-yellow-400 text-2xl">🆘</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Main Content Area -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 mb-6">
            <!-- Recent Activity -->
            <div class="lg:col-span-2">
              <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Actividad Reciente</h3>
                </div>
                <div class="divide-y divide-gray-100 dark:divide-gray-700">
                  <div v-for="(activity, index) in recentActivities" :key="index" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" :class="getActivityIconBg(activity.type)">
                        <span class="text-white">{{ getActivityIcon(activity.type) }}</span>
                      </div>
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.description }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ formatTimeAgo(activity.timestamp) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
                  <button class="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Ver toda la actividad
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div>
              <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">Acciones Rápidas</h3>
                </div>
                <div class="p-4 space-y-3">
                  <button 
                    v-for="(action, index) in quickActions" 
                    :key="index"
                    @click="navigateTo(action.route)"
                    class="w-full flex items-center p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center mr-3" :class="action.bgColor">
                      <span class="text-lg">{{ action.icon }}</span>
                    </div>
                    <div class="text-left">
                      <p class="font-medium text-gray-900 dark:text-white">{{ action.title }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ action.description }}</p>
                    </div>
                  </button>
                </div>
              </div>

              <!-- System Status -->
              <div class="mt-6 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-6">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Estado del Sistema</h3>
                  <div class="space-y-4">
                    <div v-for="(system, index) in systemStatus" :key="index" class="flex items-center justify-between">
                      <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full mr-3" :class="system.status === 'Operativo' ? 'bg-green-500' : 'bg-red-500'"></div>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ system.name }}</span>
                      </div>
                      <span class="text-xs px-2 py-1 rounded-full" :class="system.status === 'Operativo' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'">
                        {{ system.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <FootersFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Datos de ejemplo para el panel de administración
const currentUser = ref({
  name: 'Administrador',
  role: 'Administrador Principal'
});

const stats = ref({
  totalUsers: 1, // Inicializado en 1 para incluir al administrador
  userGrowth: 12.5,
  activeServices: 0,
  pendingServices: 0,
  monthlyRevenue: 0,
  revenueGrowth: 8.3,
  openTickets: 0,
  highPriorityTickets: 0
});

const recentActivities = ref([
  {
    type: 'user',
    title: 'Nuevo usuario registrado',
    description: 'Juan Pérez se ha registrado en la plataforma',
    timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutos atrás
  },
  {
    type: 'service',
    title: 'Nuevo servicio solicitado',
    description: 'Limpieza de drenaje solicitada por María López',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutos atrás
  },
  {
    type: 'payment',
    title: 'Pago recibido',
    description: 'Se ha recibido un pago de L. 1,200.00',
    timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 horas atrás
  },
  {
    type: 'support',
    title: 'Ticket de soporte cerrado',
    description: 'Se ha cerrado el ticket #4567',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 horas atrás
  }
]);

const quickActions = [
  {
    title: 'Agregar Usuario',
    description: 'Crear una nueva cuenta de usuario',
    icon: '👤',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    route: '/admin/usuarios/nuevo'
  },
  {
    title: 'Ver Reportes',
    description: 'Generar reportes del sistema',
    icon: '📊',
    bgColor: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    route: '/admin/reportes'
  },
  {
    title: 'Gestionar Servicios',
    description: 'Administrar servicios solicitados',
    icon: '🔧',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    route: '/admin/servicios'
  },
  {
    title: 'Configuración',
    description: 'Ajustes del sistema',
    icon: '⚙️',
    bgColor: 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400',
    route: '/admin/configuracion'
  }
];

const systemStatus = [
  { name: 'Servidor Web', status: 'Operativo' },
  { name: 'Base de Datos', status: 'Operativo' },
  { name: 'Servicio de Correo', status: 'Operativo' },
  { name: 'Copia de Seguridad', status: 'Pendiente' }
];

// Métodos
const getActivityIcon = (type) => {
  const icons = {
    user: '👥',
    service: '🔧',
    payment: '💰',
    support: '🆘'
  };
  return icons[type] || '🔔';
};

const getActivityIconBg = (type) => {
  const colors = {
    user: 'bg-blue-500',
    service: 'bg-green-500',
    payment: 'bg-yellow-500',
    support: 'bg-red-500'
  };
  return colors[type] || 'bg-gray-500';
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `hace ${interval} años`;
  if (interval === 1) return 'hace un año';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `hace ${interval} meses`;
  if (interval === 1) return 'hace un mes';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `hace ${interval} días`;
  if (interval === 1) return 'ayer';
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `hace ${interval} hora${interval > 1 ? 's' : ''}`;
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `hace ${interval} minuto${interval > 1 ? 's' : ''}`;
  
  return 'hace unos segundos';
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('es-HN').format(num);
};

const navigateTo = (route) => {
  router.push(route);
};

// Simular carga de datos
const fetchStats = async () => {
  // En una implementación real, aquí harías una llamada a tu API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalUsers: 1247,
        userGrowth: 12.5,
        activeServices: 42,
        pendingServices: 8,
        monthlyRevenue: 125430,
        revenueGrowth: 8.3,
        openTickets: 15,
        highPriorityTickets: 3
      });
    }, 800);
  });
};

// Inicialización
onMounted(async () => {
  const data = await fetchStats();
  stats.value = data;
});
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>
