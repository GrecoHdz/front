<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Toast Notification -->
    <Toast 
      v-if="toast.show"
      :key="toast.message + Date.now()"
      :message="toast.message" 
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />
    
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading"
    />

<!-- Modal de Detalles del Pago -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to"
>
  <div
    v-if="showDetailsModal && selectedPayment"
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
  >
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetailsModal"></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10 text-[12px] sm:text-xs md:text-base"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-black text-gray-900 dark:text-white">Detalles del Pago</h3>
              <div class="flex items-center space-x-2">
                <p class="text-gray-600 dark:text-gray-400">ID: #{{ selectedPayment.id || 'N/A' }}</p>
                <span class="text-gray-400">•</span>
               <p class="text-gray-600 dark:text-gray-400">{{ formatDate(selectedPayment.fecha) || 'N/A' }}</p>
              </div>
            </div>
          </div>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 space-y-4">
        <!-- Información del Pago -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información del Pago</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Monto</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(selectedPayment.amount || selectedPayment.monto || 0) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Comprobante</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedPayment.num_comprobante || 'No especificado' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Nombre</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedPayment.nombre_usuario || selectedPayment.usuario?.nombre || 'N/A' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <span
                :class="getStatusBadgeClass(selectedPayment.estado)"
                class="inline-flex items-center px-2 py-0.5 rounded-full font-medium"
              >
                {{ selectedPayment.estado || selectedPayment.estado || 'Pendiente' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Información Bancaria -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información Bancaria</h4>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Banco:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.banco || 'No especificado' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Número de Cuenta:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.num_cuenta || 'N/A' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Beneficiario:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.beneficiario || 'N/A' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500 dark:text-gray-400">Tipo de Cuenta:</span>
              <span class="font-medium text-gray-900 dark:text-white text-right">
                {{ selectedPayment.cuenta?.tipo || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="sticky bottom-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-end gap-2 sm:gap-3 rounded-b-xl sm:rounded-b-2xl"
      >
        <button
          v-if="selectedPayment.solicitud"
          @click="openServiceDetail(selectedPayment.solicitud)"
          class="px-3 py-2 font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Ver Servicio
        </button>
        <button
          v-if="selectedPayment.estado === 'pendiente' || selectedPayment.estado === 'Pendiente' || selectedPayment.estado === 'pagado'"
          @click="rejectPayment(selectedPayment.id)"
          class="px-3 py-2 font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Rechazar
        </button>
        <button
          v-if="selectedPayment.estado === 'pendiente' || selectedPayment.estado === 'Pendiente' || selectedPayment.estado === 'pagado'"
          @click="approvePayment(selectedPayment.id)"
          class="px-3 py-2 font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
        >
          Aprobar
        </button>
      </div>
    </div>
  </div>
</Transition>

<!-- Modal de Detalles del Retiro -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to"
>
  <div
    v-if="showWithdrawalModal && selectedWithdrawal"
    class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
  >
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeWithdrawalModal"></div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10 text-[12px] sm:text-xs md:text-base"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
            <div>
              <h3 class="font-black text-gray-900 dark:text-white">Detalles del Retiro</h3>
              <p class="text-gray-600 dark:text-gray-400">ID: #{{ selectedWithdrawal.id || 'N/A' }}</p>
            </div>
          </div>
          <button
            @click="closeWithdrawalModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-3 sm:p-4 space-y-4">
        <!-- Información del Retiro -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información del Retiro</h4>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Monto</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(selectedWithdrawal.monto || 0) }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
              <div class="inline-block">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap" :class="getStatusBadgeClass(selectedWithdrawal.estado)">
                  {{ selectedWithdrawal.estado || 'Pendiente' }}
                </span>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Fecha</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ formatDate(selectedWithdrawal.fecha) || 'N/A' }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p class="text-gray-500 dark:text-gray-400 mb-1">Solicitado por</p>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ selectedWithdrawal.nombre_usuario || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Información Bancaria -->
        <div>
          <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información Bancaria</h4>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <pre class="whitespace-pre-wrap font-sans text-gray-800 dark:text-gray-200 text-sm">{{ selectedWithdrawal.descripcion || 'No hay información bancaria disponible' }}</pre>
          </div>
        </div>

        <!-- Acciones -->
        <div class="pt-2 flex justify-end space-x-2">
          <template v-if="selectedWithdrawal.estado === 'pendiente' || selectedWithdrawal.estado === 'Pendiente'">
            <button
              @click="rejectPayment(selectedWithdrawal.id_movimiento)"
              class="py-1.5 px-3 sm:py-2 sm:px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Rechazar</span>
            </button>
            <button
              @click="approvePayment(selectedWithdrawal.id_movimiento)"
              class="py-1.5 px-3 sm:py-2 sm:px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Aprobar</span>
            </button>
          </template>
          <button
            v-else
            @click="closeWithdrawalModal"
            class="py-1.5 px-3 sm:py-2 sm:px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</Transition>


    <!-- Service Detail Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showServiceDetailModal && selectedService" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeServiceDetailModal"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center"
                     :class="getServiceTypeColor(selectedService?.servicio?.nombre)">
                  <span class="text-sm sm:text-base">{{ getServiceTypeIcon(selectedService?.servicio?.nombre) }}</span>
                </div>
                <div>
                  <h3 class="text-sm sm:text-lg font-black text-gray-900 dark:text-white">{{ selectedService?.servicio?.nombre || 'Servicio' }}</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService?.id_solicitud || 'N/A' }}</p>
                </div>
              </div>
              <button @click="closeServiceDetailModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-3 sm:p-4 space-y-4"> 
            <!-- Client Info -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Información del Cliente</h4>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p class="font-bold text-blue-800 dark:text-blue-200 text-sm">{{ selectedService?.cliente?.nombre || selectedPayment?.cliente?.nombre || 'Cliente no disponible' }}</p>
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">{{ selectedService?.cliente?.telefono || selectedPayment?.cliente?.telefono || '' }}</p>
              </div>
            </div>

            <!-- Location -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Ubicación</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService?.colonia || 'Ubicación no disponible' }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-xs">{{ selectedService?.direccion_precisa || '' }}{{ selectedService?.direccion_precisa && selectedService?.ciudad?.nombre ? ', ' : '' }}{{ selectedService?.ciudad?.nombre || '' }}</p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Descripción del Problema</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService?.descripcion || 'Sin descripción disponible' }}</p>
              </div>
            </div>

            <!-- Technician -->
            <div v-if="selectedService?.tecnico?.nombre">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Técnico Asignado</h4>
              <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <p class="font-bold text-green-800 dark:text-green-200 text-sm">{{ selectedService.tecnico.nombre }}</p>
              </div>
            </div>

            <!-- Cotizacion -->
            <div v-if="selectedService?.cotizacion && ['en_proceso', 'pendiente_pagoservicio', 'verificando_pagoservicio', 'finalizado', 'calificado'].includes(selectedService.estado)">
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Cotización</h4>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ formatCurrency(selectedService.cotizacion?.total || 0) }}</p>
              </div>
            </div>
            
            <!-- Comments -->
            <div v-if="selectedService?.comentario">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Comentarios</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService.comentario }}</p>
              </div>
            </div>

            <!-- Rating if exists -->
            <div v-if="selectedService?.calificacion?.calificacion">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Calificación</h4>
              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <div class="flex items-center mb-2">
                  <span class="text-yellow-500 mr-2">⭐</span>
                  <span class="font-bold text-yellow-800 dark:text-yellow-200">{{ selectedService.calificacion.calificacion }}/5</span>
                </div>
                <p v-if="selectedService.calificacion?.comentario" class="text-yellow-700 dark:text-yellow-300 text-sm">{{ selectedService.calificacion.comentario }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Header --> 
    <HeadersHeaderReportesAdmin />

    <!-- Content Container -->
    <div class="max-w-xl mx-auto bg-white dark:bg-gray-900 min-h-screen pb-20">
      
      <!-- Estadísticas de la Plataforma con Filtro (Fusionado con Ingresos) -->
      <section class="px-2 sm:px-4 py-3 sm:py-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-lg font-black text-gray-900 dark:text-white whitespace-nowrap">
            Estadísticas Financieras
          </h2>
        </div>
        
        <!-- Filtros de fecha para estadísticas -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow border border-gray-100 dark:border-gray-700">
          <h3 class="text-xs font-semibold text-gray-900 dark:text-white mb-2">Período de Análisis</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Desde</label>
              <input 
                type="date"
                v-model="platformDateFrom"
                @change="updatePlatformStats"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Hasta</label>
              <input 
                type="date"
                v-model="platformDateTo"
                @change="updatePlatformStats"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:gap-3">
          <!-- Ingresos Totales -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span class="text-green-600 dark:text-green-400 text-sm sm:text-lg">💰</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Totales
                </p>
              </div>
            </div>
          </div>

          <!-- Ingresos por Membresía -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span class="text-purple-600 dark:text-purple-400 text-sm sm:text-lg">💳</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.membershipRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Membresía
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Por Visita -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-lg">🏠</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.visitRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Por Visita
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Servicios -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <span class="text-yellow-600 dark:text-yellow-400 text-sm sm:text-lg">🛠️</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.serviceRevenue || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Servicios
                </p>
              </div>
            </div>
          </div>
      
          <!-- Retiros Totales -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <span class="text-red-600 dark:text-red-400 text-sm sm:text-lg">💸</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalWithdrawals || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Retiros Totales
                </p>
              </div>
            </div>
          </div>

          <!-- Comisiones Técnicos -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <span class="text-indigo-600 dark:text-indigo-400 text-sm sm:text-lg">🏆</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  {{ formatCurrency(platformStats.totalCommissions || 0) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Comisiones
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Selector de Gráficos -->
      <section class="px-3 sm:px-4 mb-3 sm:mb-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Análisis de Datos</h2>
          <select v-model="selectedChart" 
                  class="px-2 sm:px-3 py-1.5 sm:py-2 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option v-for="chart in availableCharts" :key="chart.id" :value="chart.id">
              {{ chart.name }}
            </option>
          </select>
        </div>
      </section>

      <!-- Contenedor de Gráficos -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-2">
            {{ getChartTitle() }}
          </h3>
          <div class="relative w-full" style="padding-bottom: 60%;">
            <div class="absolute inset-0">
              <canvas :id="'chart-' + selectedChart" class="w-full h-full"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección de Transacciones -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Transacciones</h2>
          <!-- Selector de mes (igual que el de pestañas) -->
          <input 
            type="month"
            v-model="selectedMonthTransactions"
            @change="updateSelectedMonth('transactions')"
            class="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>

        <div class="space-y-2">
          <div v-if="isLoadingTransactions" class="text-center py-6 sm:py-8">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cargando transacciones...</p>
          </div>

          <div v-else-if="transactions.length === 0" class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Sin transacciones</h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No hay transacciones registradas para la fecha seleccionada</p>
          </div>

          <template v-else>
            <div v-for="transaction in visibleTransactions" :key="transaction.id_movimiento || transaction.id"
                 class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 sm:space-x-3"> 
                  <div :class="getTransactionIconClass(transaction.tipo)" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs sm:text-sm">{{ getTransactionIcon(transaction.tipo) }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ getTransactionTitle(transaction) }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      <template v-if="transaction.id_solicitud">#{{ transaction.id_solicitud }}</template>
                      <template v-if="transaction.id_solicitud && getTransactionSubtitle(transaction)"> • </template>
                      <template v-if="getTransactionSubtitle(transaction)">{{ getTransactionSubtitle(transaction) }}</template>
                      <template v-if="transaction.id_solicitud || getTransactionSubtitle(transaction)"> • </template>
                      {{ formatDate(transaction.fecha) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p :class="getTransactionAmountClass(transaction.tipo, transaction.estado)" class="font-bold text-[12px] sm:text-base">
                    {{ transaction.tipo === 'ingreso' ? '+' : (transaction.tipo === 'ingreso_referido' ? '' : '-') }}{{ formatCurrency(transaction.monto || 0) }}
                  </p>
                  <p class="text-[10px]" :class="getStatusColor(transaction.estado, transaction.tipo)">
                    {{ transaction.estado || 'Sin estado' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Paginación - Siempre visible cuando hay transacciones -->
            <div v-if="transactions.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ transactions.length }} de {{ transactionsPagination.total || 0 }}
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="previousPage" 
                    :disabled="currentTransactionPage <= 1 || isLoadingTransactions"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentTransactionPage <= 1 }"
                    aria-label="Página anterior"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    Página {{ currentTransactionPage }} de {{ transactionsPagination.totalPages || 1 }}
                  </span>
                  
                  <button 
                    @click="nextPage" 
                    :disabled="currentTransactionPage >= (transactionsPagination.totalPages || 1) || isLoadingTransactions"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentTransactionPage >= (transactionsPagination.totalPages || 1) }"
                    aria-label="Página siguiente"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Footer con totales -->
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-3 mt-4 border border-gray-200 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <!-- Ingresos -->
                <div class="flex items-center space-x-2">
                  <span class="text-green-500">💰</span>
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-300">Ingresos</p>
                    <p class="text-sm font-bold text-green-600 dark:text-green-400">+{{ formatCurrency(transactionsSummary.totalIngresos || 0) }}</p>
                  </div>
                </div>

                <!-- Separador -->
                <div class="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

                <!-- Retiros -->
                <div class="flex items-center space-x-2">
                  <span class="text-red-500">💳</span>
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-300">Retiros</p>
                    <p class="text-sm font-bold text-red-600 dark:text-red-400">-{{ formatCurrency(transactionsSummary.totalRetiros || 0) }}</p>
                  </div>
                </div>

                <!-- Separador -->
                <div class="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

                <!-- Balance Neto -->
                <div class="text-right">
                  <p class="text-xs text-gray-600 dark:text-gray-300">Balance Neto</p>
                  <p class="text-sm font-bold" :class="getBalanceClass()">
                    {{ getNetBalance() }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>

      <!-- Pagos y Retiros con pestañas REDISEÑADA -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
          <!-- Header con título y selector de mes -->
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-black text-gray-900 dark:text-white">Gestión de Pagos y Retiros</h2>
            <input 
              type="month"
              v-model="selectedMonthPayments"
              @change="updateSelectedMonth('payments')"
              class="px-2 py-1 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
      
          <!-- Pestañas principales -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-3">
            <div class="flex border-b border-gray-200 dark:border-gray-600">
              <button 
                v-for="tab in [
                  { id: 'membership', label: '💳 Membresía' },
                  { id: 'visits', label: '🏠 Visitas' },
                  { id: 'services', label: '🛠️ Servicios' },
                  { id: 'withdrawals', label: '💸 Retiros' }
                ]"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                :class="{
                  'bg-blue-600 text-white border-blue-600': activeTab === tab.id,
                  'text-gray-700 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400': activeTab !== tab.id
                }"
                class="flex-1 px-2 py-2 text-[11px] font-medium border-b-2 transition-colors"
              >
                {{ tab.label }}
              </button>
            </div>
      
            <!-- Resumen mensual integrado (CONTADORES DINÁMICOS) -->
            <div class="p-2">
              <div class="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div class="text-sm font-bold text-green-600 dark:text-green-400">{{ totalMonthlyStats[activeTab]?.aprobados || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Aprobados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ totalMonthlyStats[activeTab]?.rechazados || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Rechazados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ totalMonthlyStats[activeTab]?.pendientes || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Pendientes</div>
                </div>
                <div>
                  <div class="text-[12px] font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(totalMonthlyStats[activeTab]?.total || 0) }}</div>
                  <div class="text-[8px] text-gray-600 dark:text-gray-400">Total</div>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Filtros por estado con 4 opciones - Usando initialStats que se establece una sola vez -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <div class="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
              <button 
                v-for="filter in [
                  { id: 'all', label: '📋Todos', 
                    count: (totalMonthlyStats[activeTab]?.aprobados || 0) + 
                           (totalMonthlyStats[activeTab]?.rechazados || 0) + 
                           (totalMonthlyStats[activeTab]?.pendientes || 0), 
                    color: 'blue' },
                  { id: 'pending', label: '⏳Pendientes', 
                    count: totalMonthlyStats[activeTab]?.pendientes || 0, 
                    color: 'yellow' },
                  { id: 'approved', label: '✅Aprobados', 
                    count: totalMonthlyStats[activeTab]?.aprobados || 0, 
                    color: 'green' },
                  { id: 'rejected', label: '❌Rechazados', 
                    count: totalMonthlyStats[activeTab]?.rechazados || 0, 
                    color: 'red' }
                ]"
                :key="filter.id"
                @click="setStatusFilter(filter.id)"
                :class="{
                  'bg-blue-600 text-white': statusFilter === 'all' && filter.id === 'all',
                  'bg-yellow-600 text-white': statusFilter === 'pending' && filter.id === 'pending',
                  'bg-green-600 text-white': statusFilter === 'approved' && filter.id === 'approved',
                  'bg-red-600 text-white': statusFilter === 'rejected' && filter.id === 'rejected',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': statusFilter !== filter.id
                }"
                class="px-2 py-1 text-[10px] font-medium transition-colors"
                :title="filter.id === 'all' ? 'Todos' : 
                       filter.id === 'pending' ? 'Pendientes' :
                       filter.id === 'approved' ? 'Aprobados' : 'Rechazados'"
              >
                {{ filter.label }} ({{ filter.count }})
              </button>
            </div>
          </div>
      
          <div class="space-y-1.5">
            <div v-if="isLoadingData" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-1.5 text-[11px] text-gray-600 dark:text-gray-400">Cargando {{ getLoadingMessage() }}...</p>
            </div>
      
            <div v-if="getCurrentTabData().length === 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center border border-dashed border-gray-200 dark:border-gray-600">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Sin {{ getEmptyMessage() }}</h3>
              <p class="text-[11px] text-gray-600 dark:text-gray-400">No hay {{ getEmptyMessage() }} {{ getStatusFilterText() }}</p>
            </div>
            
            <template v-else>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="item in getCurrentTabData()" :key="item.id || item.id_membresia || item.id_pagovisita || item.id_cotizacion || item.id_movimiento"
                     :class="getItemCardClass(item.status || item.estado)"
                     class="rounded-lg p-2 shadow-sm border text-[11px]">
                  <div class="mb-2">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-1.5">
                        <div :class="getItemIconClass(item.status || item.estado)" class="w-5 h-5 rounded flex items-center justify-center">
                          <span :class="getItemIconTextClass(item.status || item.estado)" class="text-[10px]">{{ getItemIcon() }}</span>
                        </div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-[10px] truncate">{{ getItemTitle(item) }}</h3>
                      </div>
                      <p :class="getItemAmountClass(item.status || item.estado)" class="font-bold text-[10px] whitespace-nowrap">{{ formatCurrency(item.amount || item.monto || item.monto_total || 0) }}</p>
                    </div> 
                  </div>
                  <button @click="showItemDetails(item)" 
                          class="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] px-2 py-1 rounded font-medium transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </template>
            
            <!-- Paginación -->
            <div v-if="getCurrentTabData().length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Mostrando {{ getCurrentTabData().length }} registros
                </div>
                <div class="flex items-center space-x-2">
                  <button 
                    @click="previousPaymentsPage" 
                    :disabled="currentPaymentsPage <= 1 || isLoadingData"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPaymentsPage <= 1 }"
                    aria-label="Página anterior"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {{ pagination.page }} de {{ pagination.totalPages }}
                  </span>
                  
                  <button 
                    @click="nextPaymentsPage" 
                    :disabled="!pagination.hasMore || isLoadingData"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': !pagination.hasMore }"
                    aria-label="Página siguiente"
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
      </section>

      <!-- Sección de Reportería -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
          <!-- Header con título y selector de mes -->
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-black text-gray-900 dark:text-white">Reportes</h2>
            <input 
              type="month"
              v-model="selectedMonthReports"
              @change="updateSelectedMonth('reports')"
              class="px-2 py-1 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
          
        <div class="grid grid-cols-1 gap-2 sm:gap-3">
          <div v-for="report in availableReports" :key="report.id"
               class="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-2 sm:p-3 shadow-sm hover:shadow transition-shadow">
            <div class="flex justify-between items-start h-full">
              <div class="pr-1 sm:pr-2 flex-1 min-w-0">
                <h3 class="text-[12px] sm:text-xs font-medium text-gray-900 dark:text-white mb-0.5 line-clamp-1">{{ report.title }}</h3>
                <p class="text-[12px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ report.description }}</p>
              </div>
              <button 
                @click="generateReport(report)" 
                :disabled="report.generating"
                class="flex-shrink-0 text-[12px] sm:text-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors flex items-center justify-center h-6 sm:h-7 min-w-[40px] sm:min-w-[50px] shadow-sm"
              >
                <span v-if="report.generating" class="animate-spin">⏳</span>
                <span v-else class="leading-none">PDF</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      <!-- Footer -->
      <FootersFooterAdmin />
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useHead, useCookie, useRuntimeConfig } from '#imports';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'; 
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
// Configuración del plugin de PDF
const { $pdf } = useNuxtApp();
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import Toast from '~/components/ui/Toast.vue'; 

const router = useRouter();
const route = useRoute();
const config = useRuntimeConfig();
const auth = useAuthStore();
const userCookie = useCookie('user');

// SEO and Meta
useHead({
  title: 'HogarSeguro - Reportes',
  meta: [
    { name: 'description', content: 'Reportes del sistema HogarSeguro - Administrar solicitudes, asignaciones y seguimiento' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
});

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(false);
const isLoadingData = ref(false);
const isLoadingTransactions = ref(false);
const selectedChart = ref('earnings');
const activeTab = ref('membership');
const selectedMonthTransactions = ref('');
const selectedMonthPayments = ref('');
const selectedMonthReports = ref(new Date().toISOString().slice(0, 7));
const statusFilter = ref('all');
const showDetailsModal = ref(false);
const showWithdrawalModal = ref(false);
const selectedPayment = ref(null);
const selectedWithdrawal = ref(null);
const showServiceDetailModal = ref(false);
const selectedService = ref(null);
const initialStats = ref({
  aprobados: 0,
  rechazados: 0,
  pendientes: 0,
  total: 0,
  totalMoney: 0
});

// Data arrays
const membershipPayments = ref([]);
const visitPayments = ref([]);
const servicePayments = ref([]);
const withdrawals = ref([]);
const transactions = ref([]);

// Cache para datos
const paymentsCache = ref({});
const transactionsCache = ref({});
const monthlyStatsCache = ref({});
const filterCountsCache = ref({});

// Estadísticas mensuales FIJAS (sin filtros)
const totalMonthlyStats = ref({
  membership: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  visits: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  services: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  withdrawals: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 }
});

// Variables para fechas
const platformDateFrom = ref('');
const platformDateTo = ref('');

// Variables de paginación
const currentTransactionPage = ref(1);
const currentPaymentsPage = ref(1);
const paymentsPerPage = 4;

// ===== DATOS REACTIVOS =====
const platformStats = reactive({
  totalRevenue: 0,
  membershipRevenue: 0,
  visitRevenue: 0,
  serviceRevenue: 0,
  totalWithdrawals: 0,
  totalCommissions: 0
});

const transactionsSummary = ref({
  totalIngresos: '0.00',
  totalRetiros: '0.00'
});
const transactionsPagination = ref({
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 1
});

const pagination = ref({
  total: 0,
  page: 1,
  totalPages: 1,
  hasMore: false
});

// Variables de notificaciones
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  duration: 3000
});

// ===== FUNCIONES DE UTILIDAD =====
const formatCurrency = (value) => {
  try {
    if (value === undefined || value === null || isNaN(value)) return 'L. 0.00';
    const number = parseFloat(value);
    return `L. ${number.toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  } catch (error) {
    console.error('Error formateando moneda:', error);
    return 'L. 0.00';
  }
};

const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

const mapApiStatusToFrontend = (apiStatus) => {
  try {
    if (!apiStatus) return 'Pendiente';
    
    // Convertir a minúsculas para manejo insensible a mayúsculas
    const statusLower = String(apiStatus).toLowerCase().trim();
    
    const statusMap = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado', 
      'aceptado': 'Aprobado',
      'pagado': 'Pendiente',
      'rechazado': 'Rechazado',
      'confirmado': 'Aprobado',
      'activa': 'Aprobado',
      'vencida': 'Aprobado',
      'rechazada': 'Rechazado',
      'expirada': 'Rechazado',
      'cancelado': 'Rechazado',
      'pendiente': 'Pendiente',
      'completado': 'Aprobado'
    };
    
    return statusMap[statusLower] || 'Pendiente';
  } catch (error) {
    console.error('Error mapeando estado:', error);
    return 'Pendiente';
  }
};

// ===== FUNCIONES DE CARGA DE DATOS CON FILTROS POR ESTADO =====
const loadMembershipPayments = async (page = 1) => {
  // Store initial stats if not already set
  if (page === 1 && !initialStats.value.total && totalMonthlyStats.value?.membership) {
    const stats = totalMonthlyStats.value.membership;
    
    initialStats.value = {
      aprobados: stats.aprobados || 0,
      rechazados: stats.rechazados || 0,
      pendientes: stats.pendientes || 0,
      total: (stats.aprobados || 0) + 
             (stats.rechazados || 0) + 
             (stats.pendientes || 0),
      totalMoney: stats.total || 0
    }; 
  }
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `membership-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `membership-${selectedMonthPayments.value || 'all'}-counts`;
    
    membershipPayments.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'approved': ['activa', 'vencida'],
        'pending': ['pendiente'],
        'rejected': ['rechazada', 'rechazado']
      };
      
      const estadosFiltro = estadoMap[statusFilter.value] || [statusFilter.value];
      estadosFiltro.forEach(estado => {
        if (estado) {
          params.append('estado', estado);
        }
      });
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.membership = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    
    // Verificar si los datos están en caché
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      membershipPayments.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    params.append('offset', offset);
    
    const url = `/membresia?${params.toString()}`;
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    }); 

    if (response?.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      
      const mapApiStatusToFrontend = (apiStatus) => {
        const statusMap = {
          'activa': 'Aprobado',
          'vencida': 'Aprobado',
          'pendiente': 'Pendiente',
          'rechazada': 'Rechazado',
        };
        
        // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas
        const statusLower = (apiStatus || '').toLowerCase();
        return statusMap[statusLower] || 'Pendiente';
      };
      
      // Procesar los ítems para mapear los estados
      const processedItems = items.map(item => ({
        ...item,
        id: item.id_membresia,
        // Mapear los estados al formato del frontend
        estado: mapApiStatusToFrontend(item.estado),
        // Asegurar que existan las propiedades necesarias
        monto: item.monto || 0,
        fecha: item.fecha || new Date().toISOString(),
        usuario: item.usuario || { nombre: 'Usuario no disponible', telefono: '' },
        cuenta: item.cuenta || { banco: 'No especificado', beneficiario: '', num_cuenta: '', tipo: '' },
        // Propiedades adicionales para consistencia con otros tipos de pago
        amount: item.monto || 0,
        date: item.fecha,
        status: mapApiStatusToFrontend(item.estado)
      }));
      
      membershipPayments.value = processedItems;
      
      // Procesar estadísticas
      const stats = response.estadisticas ? {
        aprobados: response.estadisticas.aprobados || 0,
        rechazados: response.estadisticas.rechazados || 0,
        pendientes: response.estadisticas.pendientes || 0,
        total: response.estadisticas.total || 0
      } : {
        aprobados: 0,
        rechazados: 0,
        pendientes: 0,
        total: 0
      };
      
      // Actualizar estadísticas
      totalMonthlyStats.value.membership = { ...stats };
      
      // Guardar en caché las estadísticas totales
      monthlyStatsCache.value[`membership-${selectedMonthPayments.value || 'all'}`] = { ...stats };
      
      // Guardar contadores de filtros
      if (statusFilter.value === 'all' || !statusFilter.value) {
        filterCountsCache.value[statsCacheKey] = { ...stats };
      }
      
      const totalItems = response.total || items.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      // Guardar en caché los datos
      paymentsCache.value[cacheKey] = {
        data: [...processedItems],
        pagination: { ...pagination.value }
      };
      
      // Si es la primera página, guardar también las estadísticas
      if (page === 1) {
        paymentsCache.value[cacheKey].stats = { ...stats };
      }
      
    } else {
      membershipPayments.value = [];
    }
  } catch (error) {
    console.error('Error al cargar pagos de membresías:', error);
    showToast('Error al cargar los pagos de membresías', 'error');
    console.error('Error al cargar pagos de membresía:', error);
    showToast('Error al cargar los pagos de membresía', 'error');
    membershipPayments.value = [];
  }
};

const loadVisitPayments = async (page = 1) => {
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `visits-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `visits-${selectedMonthPayments.value || 'all'}-counts`;
    
    visitPayments.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'pending': 'Pendiente',
        'approved': 'Aprobado',
        'rejected': 'Rechazado'
      };
      const estado = estadoMap[statusFilter.value] || statusFilter.value;
      if (estado) {
        params.append('estado', estado);
      }
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.visits = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    params.append('offset', offset);
    
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      visitPayments.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    const url = `/pagovisita?${params.toString()}`;
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      const transformedData = items.map(item => ({
        ...item,
        id: item.id_pagovisita,
        status: mapApiStatusToFrontend(item.estado),
        amount: item.monto || 0,
        date: item.fecha,
        service: item.solicitud?.servicio?.nombre || 'Servicio de visita',
        client: item.usuario?.nombre || 'Cliente desconocido',
        technician: item.solicitud?.tecnico?.nombre || 'Sin asignar'
      }));
      
      visitPayments.value = transformedData;
      
      // Actualizar estadísticas TOTALES
      if (response.estadisticas_totales) {
        const stats = {
          aprobados: response.estadisticas_totales.aprobados || 0,
          rechazados: response.estadisticas_totales.rechazados || 0,
          pendientes: response.estadisticas_totales.pendientes || 0,
          total: response.estadisticas_totales.total || 0
        };
        
        totalMonthlyStats.value.visits = { ...stats };
        
        // Guardar en caché las estadísticas
        if (!monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`]) {
          monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`] = { ...stats };
        }
        
        // Guardar contadores de filtros
        filterCountsCache.value[statsCacheKey] = { ...stats };
      } else if (response.estadisticas) {
        const stats = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
        
        if (statusFilter.value === 'all') {
          totalMonthlyStats.value.visits = { ...stats };
          
          // Guardar en caché las estadísticas solo si no hay filtro de estado
          if (!monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`]) {
            monthlyStatsCache.value[`visits-${selectedMonthPayments.value || 'all'}`] = { ...stats };
          }
          
          // Guardar contadores de filtros
          filterCountsCache.value[statsCacheKey] = { ...stats };
        }
      }
      
      const totalItems = response.total || items.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      if (!selectedMonthPayments.value) {
        paymentsCache.value[cacheKey] = { 
          data: [...transformedData],
          stats: response.estadisticas_totales || response.estadisticas || null,
          pagination: { ...pagination.value }
        };
      }
    } else {
      visitPayments.value = [];
    }
  } catch (error) {
    console.error('Error al cargar pagos de visitas:', error);
    showToast('Error al cargar los pagos de visitas', 'error');
    visitPayments.value = [];
  }
};

const loadServicePayments = async (page = 1) => {
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `services-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `services-${selectedMonthPayments.value || 'all'}-counts`;
    
    servicePayments.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'pending': 'pagado',
        'approved': 'confirmado',
        'rejected': 'rechazado'
      };
      const estado = estadoMap[statusFilter.value] || statusFilter.value;
      if (estado) {
        params.append('estado', estado);
      }
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.services = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    params.append('offset', offset);
    
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      servicePayments.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    const url = `/cotizacion?${params.toString()}`;
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : [response.data];
      
      const transformedData = items.map(item => { 
        const serviceName = (item.solicitud && item.solicitud.servicio && item.solicitud.servicio.nombre) 
          ? item.solicitud.servicio.nombre 
          : 'Servicio';
        
        return {
          ...item,
          id: item.id_cotizacion,
          status: mapApiStatusToFrontend(item.estado),
          amount: item.monto_total || 0,
          date: item.fecha,
          service: serviceName,
          client: item.solicitud?.cliente?.nombre || 'Cliente desconocido',
          technician: item.solicitud?.tecnico?.nombre || 'Sin asignar',
          category: item.solicitud?.servicio?.categoria || 'general'
        };
      });
      
      servicePayments.value = transformedData;
      
      // Actualizar estadísticas TOTALES
      if (response.estadisticas_totales) {
        const stats = {
          aprobados: response.estadisticas_totales.aprobados || 0,
          rechazados: response.estadisticas_totales.rechazados || 0,
          pendientes: response.estadisticas_totales.pendientes || 0,
          total: response.estadisticas_totales.total || 0
        };
        
        totalMonthlyStats.value.services = { ...stats };
        
        // Guardar en caché las estadísticas
        if (!monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`]) {
          monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`] = { ...stats };
        }
        
        // Guardar contadores de filtros
        filterCountsCache.value[statsCacheKey] = { ...stats };
      } else if (response.estadisticas) {
        const stats = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
        
        if (statusFilter.value === 'all') {
          totalMonthlyStats.value.services = { ...stats };
          
          // Guardar en caché las estadísticas solo si no hay filtro de estado
          if (!monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`]) {
            monthlyStatsCache.value[`services-${selectedMonthPayments.value || 'all'}`] = { ...stats };
          }
          
          // Guardar contadores de filtros
          filterCountsCache.value[statsCacheKey] = { ...stats };
        }
      }
      
      const totalItems = response.total || items.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      if (!selectedMonthPayments.value) {
        paymentsCache.value[cacheKey] = { 
          data: [...transformedData],
          stats: response.estadisticas_totales || response.estadisticas || null,
          pagination: { ...pagination.value }
        };
      }
    } else {
      servicePayments.value = [];
    }
  } catch (error) {
    console.error('Error al cargar pagos de servicios:', error);
    showToast('Error al cargar los pagos de servicios', 'error');
    servicePayments.value = [];
  }
};

const loadWithdrawals = async (page = 1) => {
  try {
    const limit = paymentsPerPage;
    const offset = (page - 1) * limit;
    const cacheKey = `withdrawals-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${page}-${limit}`;
    const statsCacheKey = `withdrawals-${selectedMonthPayments.value || 'all'}-counts`;
    
    withdrawals.value = [];
    
    const params = new URLSearchParams();
    
    if (selectedMonthPayments.value) {
      params.append('month', selectedMonthPayments.value);
    }
    
    // Agregar filtro de estado
    if (statusFilter.value && statusFilter.value !== 'all') {
      const estadoMap = {
        'pending': 'pendiente',
        'approved': 'completado',
        'rejected': 'rechazado'
      };
      const estado = estadoMap[statusFilter.value] || statusFilter.value;
      if (estado) {
        params.append('estado', estado);
      }
      
      // Usar contadores en caché si solo cambia el filtro de estado
      if (filterCountsCache.value[statsCacheKey]) {
        totalMonthlyStats.value.withdrawals = { ...filterCountsCache.value[statsCacheKey] };
      }
    }
    
    params.append('limit', limit);
    params.append('offset', offset);
    
    if (paymentsCache.value[cacheKey]) {
      const { data, pagination: cachedPagination } = paymentsCache.value[cacheKey];
      withdrawals.value = data || [];
      
      // No actualizar estadísticas desde caché de paginación
      // Las estadísticas vendrán de filterCountsCache
      
      if (cachedPagination) {
        pagination.value = { ...cachedPagination };
      }
      
      return;
    }
    
    const url = `/movimientos/retiros?${params.toString()}`;
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.movimientos) {
      const items = Array.isArray(response.movimientos) ? response.movimientos : [response.movimientos];
      
      const transformedData = items.map(item => ({
        ...item,
        id: item.id_movimiento,
        status: mapApiStatusToFrontend(item.estado),
        amount: item.monto || 0,
        date: item.fecha,
        technician: item.nombre_usuario || 'Técnico desconocido',
        bankDetails: item.descripcion || 'Retiro de fondos'
      }));
      
      withdrawals.value = transformedData;
      
      // Actualizar estadísticas TOTALES
      if (response.estadisticas_totales) {
        const stats = {
          aprobados: response.estadisticas_totales.aprobados || 0,
          rechazados: response.estadisticas_totales.rechazados || 0,
          pendientes: response.estadisticas_totales.pendientes || 0,
          total: response.estadisticas_totales.total || 0
        };
        
        totalMonthlyStats.value.withdrawals = { ...stats };
        
        // Guardar en caché las estadísticas
        if (!monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`]) {
          monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`] = { ...stats };
        }
        
        // Guardar contadores de filtros
        filterCountsCache.value[statsCacheKey] = { ...stats };
      } else if (response.estadisticas) {
        const stats = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
        
        if (statusFilter.value === 'all') {
          totalMonthlyStats.value.withdrawals = { ...stats };
          
          // Guardar en caché las estadísticas solo si no hay filtro de estado
          if (!monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`]) {
            monthlyStatsCache.value[`withdrawals-${selectedMonthPayments.value || 'all'}`] = { ...stats };
          }
          
          // Guardar contadores de filtros
          filterCountsCache.value[statsCacheKey] = { ...stats };
        }
      }
      
      const totalItems = response.total || items.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      
      pagination.value = {
        total: totalItems,
        page: page,
        totalPages: totalPages,
        hasMore: (offset + items.length) < totalItems
      };
      
      if (!selectedMonthPayments.value) {
        paymentsCache.value[cacheKey] = { 
          data: [...transformedData],
          stats: response.estadisticas_totales || response.estadisticas || null,
          pagination: { ...pagination.value }
        };
      }
    } else {
      withdrawals.value = [];
    }
  } catch (error) {
    console.error('Error al cargar retiros:', error);
    showToast('Error al cargar los retiros', 'error');
    withdrawals.value = [];
  }
};

// ===== RESTO DE FUNCIONES SIN CAMBIOS SIGNIFICATIVOS =====
const loadTransactions = async (page = 1) => {
  try {
    const cacheKey = getCacheKey(page);
    
    if (transactionsCache.value[cacheKey]) {
      const cachedData = transactionsCache.value[cacheKey];
      transactions.value = cachedData.data || [];
      transactionsSummary.value = cachedData.summary || { totalIngresos: '0.00', totalRetiros: '0.00' };
      transactionsPagination.value = cachedData.pagination || { total: 0, page: 1, limit: 5, totalPages: 1 };
      currentTransactionPage.value = page;
      return;
    }
    
    isLoadingTransactions.value = true;
    
    const limit = 5;
    let url = `/movimientos?page=${page}&limit=${limit}`;
    
    if (selectedMonthTransactions.value) {
      url += `&fecha=${selectedMonthTransactions.value}`;
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success) {
      const transactionsData = response.data?.movimientos || response.data || [];
      const summary = response.summary || response.data?.summary || response.data?.resumen || {};
      const summaryData = {
        totalIngresos: parseFloat(summary.totalIngresos || '0').toFixed(2),
        totalRetiros: parseFloat(summary.totalRetiros || '0').toFixed(2)
      };
      
      const paginationData = response.pagination || response.data?.pagination || {};
      const totalItems = paginationData.total || transactionsData.length;
      const totalPages = paginationData.totalPages || Math.ceil(totalItems / limit) || 1;
      
      const paginationInfo = {
        total: totalItems,
        page: paginationData.page || page,
        limit: limit,
        totalPages: totalPages,
        hasMore: (paginationData.page || page) < totalPages
      };
      
      transactions.value = transactionsData;
      transactionsSummary.value = summaryData;
      transactionsPagination.value = paginationInfo;
      currentTransactionPage.value = page;
      
      transactionsCache.value[getCacheKey(page)] = {
        data: [...transactionsData],
        summary: { ...summaryData },
        pagination: { ...paginationInfo },
        timestamp: Date.now()
      };
      
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      Object.keys(transactionsCache.value).forEach(key => {
        if (transactionsCache.value[key]?.timestamp < oneHourAgo) {
          delete transactionsCache.value[key];
        }
      });
      
      await nextTick();
    } else {
      transactions.value = [];
      transactionsSummary.value = { totalIngresos: '0.00', totalRetiros: '0.00' };
      transactionsPagination.value = { total: 0, page: 1, limit: 5, totalPages: 1 };
      currentTransactionPage.value = 1;
    }
  } catch (error) {
    console.error('Error al cargar transacciones:', error);
    showToast('Error al cargar las transacciones', 'error');
    
    transactions.value = [];
    transactionsSummary.value = { totalIngresos: '0.00', totalRetiros: '0.00' };
    transactionsPagination.value = { total: 0, page: 1, limit: 5, totalPages: 1 };
    currentTransactionPage.value = 1;
  } finally {
    isLoadingTransactions.value = false;
  }
};

const getCacheKey = (page) => {
  return `${selectedMonthTransactions.value || 'all'}-${page}`;
};

// ===== FUNCIONES DE NAVEGACIÓN Y CONTROL =====
const getCurrentTabData = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return membershipPayments.value;
      case 'visits': return visitPayments.value;
      case 'services': return servicePayments.value;
      case 'withdrawals': return withdrawals.value;
      default: return [];
    }
  } catch (error) {
    console.error('Error obteniendo datos de pestaña actual:', error);
    return [];
  }
};

// Track if initial stats have been set and store the initial values
const initialStatsSet = ref(false);
const initialMonthlyStats = ref(null);

const loadTabData = async (page = 1) => {
  try {
    isLoadingData.value = true;
    currentPaymentsPage.value = page;
    
    // Resetear la paginación
    if (page === 1) {
      pagination.value = {
        page: 1,
        total: 0,
        totalPages: 1,
        hasMore: false
      };
      
      // Set initial stats only once when loading first page and not set yet
      if (totalMonthlyStats.value?.membership && !initialStatsSet.value) {
        const stats = totalMonthlyStats.value.membership;
        initialMonthlyStats.value = { ...totalMonthlyStats.value };
        initialStats.value = {
          aprobados: stats.aprobados || 0,
          rechazados: stats.rechazados || 0,
          pendientes: stats.pendientes || 0,
          total: (stats.aprobados || 0) + (stats.rechazados || 0) + (stats.pendientes || 0)
        };
        initialStatsSet.value = true; 
      }
      
      // Restore initial stats if they were already set
      if (initialStatsSet.value && initialMonthlyStats.value) {
        totalMonthlyStats.value = { ...initialMonthlyStats.value };
      }
    }
    
    const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}`;
    const filterCacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-counts`;
    
    // Restaurar estadísticas desde caché si existen
    if (monthlyStatsCache.value[cacheKey]) {
      totalMonthlyStats.value[activeTab.value] = { ...monthlyStatsCache.value[cacheKey] };
    }
    
    // Restaurar contadores de filtros desde caché si existen
    if (filterCountsCache.value[filterCacheKey]) {
      const cachedCounts = filterCountsCache.value[filterCacheKey];
      // Actualizar solo si no hay filtro de mes o si el mes coincide
      if (!selectedMonthPayments.value || cacheKey.includes(selectedMonthPayments.value)) {
        Object.assign(totalMonthlyStats.value[activeTab.value], cachedCounts);
      }
    }
    
    // Verificar si los datos completos están en caché
    const fullCacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-${page}-${paymentsPerPage}`;
    const hasFullCachedData = paymentsCache.value[fullCacheKey] !== undefined;
    
    // Determinar si necesitamos cargar datos del servidor
    const hasNoCachedData = !monthlyStatsCache.value[cacheKey] || !filterCountsCache.value[filterCacheKey];
    const monthChanged = selectedMonthPayments.value && !paymentsCache.value[`${activeTab.value}-${selectedMonthPayments.value}-${page}-${paymentsPerPage}`];
    const statusChanged = statusFilter.value !== 'all';
    
    // Cargar datos si:
    // 1. No hay datos en caché
    // 2. Cambió el mes y no hay caché para ese mes
    // 3. Es la primera página y no hay caché
    // 4. Cambió el filtro de estado (para forzar recarga de datos filtrados)
    const shouldFetchData = hasNoCachedData || monthChanged || (page === 1 && !hasFullCachedData) || statusChanged;
    
    switch (activeTab.value) {
      case 'membership':
        await loadMembershipPayments(page);
        break;
      case 'visits':
        await loadVisitPayments(page);
        break;
      case 'services':
        await loadServicePayments(page);
        break;
      case 'withdrawals':
        await loadWithdrawals(page);
        break;
    }
  } catch (error) {
    console.error('Error al cargar datos de la pestaña:', error);
    showToast('Error al cargar los datos', 'error');
  } finally {
    isLoadingData.value = false;
  }
};

const setStatusFilter = (filter) => {
  statusFilter.value = filter;
  currentPaymentsPage.value = 1;
  loadTabData(1);
};

const setActiveTab = async (tab) => {
  try {
    if (activeTab.value === tab) return;
    
    // Guardar los datos actuales en caché antes de cambiar de pestaña
    if (activeTab.value) {
      const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}`;
      
      // Guardar estadísticas mensuales
      monthlyStatsCache.value[cacheKey] = { ...totalMonthlyStats.value[activeTab.value] };
      
      // Guardar contadores de filtros
      filterCountsCache.value[cacheKey] = {
        aprobados: totalMonthlyStats.value[activeTab.value]?.aprobados || 0,
        rechazados: totalMonthlyStats.value[activeTab.value]?.rechazados || 0,
        pendientes: totalMonthlyStats.value[activeTab.value]?.pendientes || 0,
        total: totalMonthlyStats.value[activeTab.value]?.total || 0
      };
    }
    
    activeTab.value = tab;
    statusFilter.value = 'all';
    currentPaymentsPage.value = 1;
    
    // Cargar datos de la nueva pestaña
    await loadTabData(1);
    
    // Actualizar initialStats con los datos de la nueva pestaña
    if (totalMonthlyStats.value?.[tab]) {
      const stats = totalMonthlyStats.value[tab];
      initialStats.value = {
        aprobados: stats.aprobados || 0,
        rechazados: stats.rechazados || 0,
        pendientes: stats.pendientes || 0,
        total: (stats.aprobados || 0) + (stats.rechazados || 0) + (stats.pendientes || 0),
        totalMoney: stats.total || 0
      };
    }
  } catch (error) {
    console.error('Error estableciendo pestaña activa:', error);
  }
};

const updateSelectedMonth = async (type = 'payments') => {
  try {
    if (type === 'transactions') {
      transactionsCache.value = {};
      currentTransactionPage.value = 1;
      await loadTransactions(1);
    } else {
      // Limpiar la caché de estadísticas mensuales cuando cambia el mes
      if (selectedMonthPayments.value) {
        const cacheKey = `${activeTab.value}-${selectedMonthPayments.value}`;
        const filterCacheKey = `${activeTab.value}-${selectedMonthPayments.value}-counts`;
        delete monthlyStatsCache.value[cacheKey];
        delete filterCountsCache.value[filterCacheKey];
      }
      // Resetear el filtro de estado al cambiar de mes
      statusFilter.value = 'all';
      await loadTabData();
    }
  } catch (error) {
    console.error('Error actualizando mes seleccionado:', error);
  }
};

// ===== FUNCIONES DE PAGINACIÓN =====
const nextPage = () => {
  try {
    const nextPageNum = currentTransactionPage.value + 1;
    
    if (nextPageNum <= (transactionsPagination.value?.totalPages || 1)) {
      loadTransactions(nextPageNum);
    }
  } catch (error) {
    console.error('Error en nextPage:', error);
  }
};

const previousPage = () => {
  try {
    const prevPageNum = currentTransactionPage.value - 1;
    
    if (prevPageNum >= 1) {
      loadTransactions(prevPageNum);
    }
  } catch (error) {
    console.error('Error en previousPage:', error);
  }
};

const previousPaymentsPage = () => {
  if (currentPaymentsPage.value > 1) {
    const prevPage = currentPaymentsPage.value - 1;
    loadTabData(prevPage).then(() => {
      const container = document.querySelector('.grid\\.grid-cols-2\\.gap-1\\.5');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

const nextPaymentsPage = () => {
  if (pagination.value.hasMore) {
    const nextPage = currentPaymentsPage.value + 1;
    loadTabData(nextPage).then(() => {
      const container = document.querySelector('.grid\\.grid-cols-2\\.gap-1\\.5');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
};

// ===== FUNCIONES DE UI Y HELPERS =====
const getSelectedMonthName = (type = 'payments') => {
  try {
    let monthValue;
    if (type === 'transactions') {
      monthValue = selectedMonthTransactions.value;
    } else if (type === 'payments') {
      monthValue = selectedMonthPayments.value;
    } else if (type === 'reports') {
      monthValue = selectedMonthReports.value;
    } else {
      monthValue = new Date().toISOString().slice(0, 7);
    }
    
    if (!monthValue) return 'Seleccionar mes';
    const date = new Date(monthValue + '-01');
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  } catch (error) {
    console.error('Error al formatear el mes:', error);
    return 'Mes inválido';
  }
};

const getLoadingMessage = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return 'pagos de membresía';
      case 'visits': return 'pagos de visitas';
      case 'services': return 'pagos de servicios';
      case 'withdrawals': return 'retiros solicitados';
      default: return 'datos';
    }
  } catch (error) {
    console.error('Error obteniendo mensaje de carga:', error);
    return 'datos';
  }
};

const getEmptyMessage = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return 'pagos de membresía';
      case 'visits': return 'pagos de visitas';
      case 'services': return 'pagos de servicios';
      case 'withdrawals': return 'retiros pendientes';
      default: return 'elementos';
    }
  } catch (error) {
    console.error('Error obteniendo mensaje vacío:', error);
    return 'elementos';
  }
};

const getStatusFilterText = () => {
  try {
    switch (statusFilter.value) {
      case 'pending': return 'pendientes';
      case 'approved': return 'aprobados';
      case 'rejected': return 'rechazados';
      default: return '';
    }
  } catch (error) {
    console.error('Error obteniendo texto de filtro:', error);
    return '';
  }
};

// ===== FUNCIONES DE ESTILOS Y CLASES =====
const getStatusBadgeClass = (status) => {
  try {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'pagado': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'aprobado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'aceptado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'confirmado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'completado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'activa': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'rechazado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'rechazada': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'expirada': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
      case 'pendiente': 
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de estado:', error);
    return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
  }
};

const getStatusColor = (status, tipo) => {
  try {
    const statusLower = (status || '').toLowerCase();
    
    if (tipo === 'ingreso_referido' && statusLower === 'completado') {
      return 'text-blue-400';
    } else if (tipo === 'ingreso_referido' && statusLower === 'pendiente') {
      return 'text-yellow-400';
    }
    
    if (tipo === 'retiro' && statusLower === 'completado') {
      return 'text-red-400';
    }
    
    switch (statusLower) {
      case 'pagado': return 'text-yellow-500';
      case 'completado': return 'text-green-500';
      case 'calificado': return 'text-green-500';
      case 'aceptado': return 'text-green-500';
      case 'aprobado': return 'text-green-500';
      case 'pendiente': return 'text-yellow-500';
      case 'rechazado': return 'text-red-500';
      case 'cancelado': return 'text-red-400';
      case 'en proceso': return 'text-blue-500';
      case 'activa': return 'text-green-500';
      case 'expirada': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  } catch (error) {
    console.error('Error obteniendo color de estado:', error);
    return 'text-gray-500';
  }
};

const getItemCardClass = (status) => {
  try {
    const baseClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600';
    
    switch (status) {
      case 'Aprobado': return baseClass + ' border-l-4 border-l-green-500';
      case 'Rechazado': return baseClass + ' border-l-4 border-l-red-500';
      case 'Aceptado': return baseClass + ' border-l-4 border-l-green-500';
      case 'Pagado': return baseClass + ' border-l-4 border-l-yellow-500';
      case 'Pendiente':
      default: return baseClass + ' border-l-4 border-l-yellow-500';
    }
  } catch (error) {
    console.error('Error obteniendo clase de tarjeta:', error);
    return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 border-l-4 border-l-yellow-500';
  }
};

const getItemIconClass = (status) => {
  try {
    switch (status) {
      case 'Aprobado': return 'bg-green-100 dark:bg-green-900/30';
      case 'Aceptado': return 'bg-green-100 dark:bg-green-900/30';
      case 'Pagado': return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'Rechazado': return 'bg-red-100 dark:bg-red-900/30'; 
      case 'Pendiente':
      default: return 'bg-yellow-100 dark:bg-yellow-900/30';
    }
  } catch (error) {
    console.error('Error obteniendo clase de icono:', error);
    return 'bg-yellow-100 dark:bg-yellow-900/30';
  }
};

const getItemIconTextClass = (status) => {
  try {
    switch (status) {
      case 'Aprobado': return 'text-green-600 dark:text-green-400';
      case 'Aceptado': return 'text-green-600 dark:text-green-400';
      case 'Pagado': return 'text-yellow-600 dark:text-yellow-400';
      case 'Rechazado': return 'text-red-600 dark:text-red-400';
      case 'Pendiente':
      default: return 'text-yellow-600 dark:text-yellow-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de texto de icono:', error);
    return 'text-yellow-600 dark:text-yellow-400';
  }
};

const getItemIcon = () => {
  try {
    switch (activeTab.value) {
      case 'membership': return '💳';
      case 'visits': return '🏠';
      case 'services': return '🛠️';
      case 'withdrawals': return '💳';
      default: return '📄';
    }
  } catch (error) {
    console.error('Error obteniendo icono de item:', error);
    return '📄';
  }
};

const getItemAmountClass = (status) => {
  try {
    if (!status) return 'text-gray-600 dark:text-gray-400';
    
    // Manejar tanto estados en mayúsculas como en minúsculas
    const statusStr = String(status).toLowerCase().trim();
    
    switch (statusStr) {
      case 'aprobado':
      case 'aceptado':
      case 'aprobada':
      case 'completado':
      case 'aceptada':
        return 'text-green-600 dark:text-green-400';
      case 'rechazado':
      case 'rechazada':
        return 'text-red-600 dark:text-red-400';
      case 'pendiente':
      case 'pagado':
      case 'pendiente de pago':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de monto:', error);
    return 'text-gray-600 dark:text-gray-400';
  }
};

const getItemTitle = (item) => {
  try {
    if (!item) return 'Item';
    
    let title;
    switch (activeTab.value) {
      case 'membership': title = item.plan || 'Membresía'; break;
      case 'visits': title = item.service || 'Visita'; break;
      case 'services': title = item.service || item.serviceName || 'Servicio'; break;
      case 'withdrawals': title = item.technician || 'Retiro'; break;
      default: return 'Item';
    }
    return title.length > 15 ? `${title.substring(0, 15)}...` : title;
  } catch (error) {
    console.error('Error obteniendo título de item:', error);
    return 'Item';
  }
};

// Funciones de transacciones
const getTransactionIcon = (type) => {
  try {
    switch (type) {
      case 'ingreso': 
      case 'ingreso_referido': return '💰';
      case 'retiro': return '💳';
      case 'commission': return '💰';
      case 'withdrawal': return '💳';
      case 'refund': return '↩️';
      default: return '💸';
    }
  } catch (error) {
    console.error('Error obteniendo icono de transacción:', error);
    return '💸';
  }
};

const getTransactionIconClass = (type) => {
  try {
    switch (type) {
      case 'ingreso':
      case 'ingreso_referido': return 'bg-green-500';
      case 'retiro': return 'bg-red-500';
      case 'commission': return 'bg-green-500';
      case 'withdrawal': return 'bg-red-500';
      case 'refund': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  } catch (error) {
    console.error('Error obteniendo clase de icono de transacción:', error);
    return 'bg-blue-500';
  }
};

const getTransactionAmountClass = (type, estado) => {
  try {
    const estadoLower = (estado || '').toLowerCase();
    
    if (estadoLower === 'pendiente') {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    
    if (type === 'ingreso' || type === 'commission') {
      return 'text-green-600 dark:text-green-400';
    } else if (type === 'ingreso_referido') {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      return 'text-red-600 dark:text-red-400';
    }
  } catch (error) {
    console.error('Error obteniendo clase de monto de transacción:', error);
    return 'text-gray-600 dark:text-gray-400';
  }
};

const getTransactionTitle = (transaction) => {
  try {
    if (!transaction) return 'Transacción';
    
    switch (transaction.tipo) {
      case 'ingreso':
        return transaction.servicio || transaction.descripcion || 'Ingreso por servicio';
      case 'ingreso_referido':
        return transaction.descripcion || 'Ingreso por referido';
      case 'retiro':
        return 'Retiro de fondos'; // Siempre muestra este texto para retiros
      default:
        return transaction.descripcion || 'Transacción';
    }
  } catch (error) {
    console.error('Error obteniendo título de transacción:', error);
    return 'Transacción';
  }
};

const getTransactionSubtitle = (transaction) => {
  try {
    if (!transaction) return '';
    
    const parts = [];
    
    switch (transaction.tipo) {
      case 'ingreso':
        if (transaction.colonia) parts.push(transaction.colonia);
        break;
      case 'ingreso_referido':
        return transaction.id_usuario || transaction.nombre_usuario || 'Usuario referido';
    }
    
    if (parts.length === 0 && transaction.nombre_usuario && transaction.nombre_usuario !== 'Usuario') {
      parts.push(transaction.nombre_usuario);
    }
    
    return parts.join(' • ');
  } catch (error) {
    console.error('Error obteniendo subtítulo de transacción:', error);
    return '';
  }
};

const getBalanceClass = () => {
  try {
    const ingresos = parseFloat(transactionsSummary.value?.totalIngresos || 0);
    const retiros = parseFloat(transactionsSummary.value?.totalRetiros || 0);
    const balance = ingresos - retiros;
    return balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  } catch (error) {
    console.error('Error obteniendo clase de balance:', error);
    return 'text-gray-600 dark:text-gray-400';
  }
};

const getNetBalance = () => {
  try {
    const ingresos = parseFloat(transactionsSummary.value?.totalIngresos || 0);
    const retiros = parseFloat(transactionsSummary.value?.totalRetiros || 0);
    const balance = Number((ingresos - retiros).toFixed(2));
    const prefix = balance >= 0 ? '+' : '-';
    return `${prefix}${formatCurrency(Math.abs(balance))}`;
  } catch (error) {
    console.error('Error calculando balance neto:', error);
    return '0';
  }
};

// ===== FUNCIONES DE MODAL =====
const showItemDetails = (item) => {
  try {
    if (item.tipo === 'retiro') {
      selectedWithdrawal.value = item;
      showWithdrawalModal.value = true;
    } else {
      selectedPayment.value = item;
      showDetailsModal.value = true;
    }
    document.body.style.overflow = 'hidden';
  } catch (error) {
    console.error('Error al mostrar detalles del ítem:', error);
    showToast('Error al cargar los detalles', 'error');
  }
};

const closeDetailsModal = () => {
  try {
    showDetailsModal.value = false;
    selectedPayment.value = null;
  } catch (error) {
    console.error('Error cerrando modal:', error);
  }
};

const closeWithdrawalModal = () => {
  try {
    showWithdrawalModal.value = false;
    selectedWithdrawal.value = null;
    document.body.style.overflow = 'auto';
  } catch (error) {
    console.error('Error cerrando modal de retiro:', error);
  }
};

const openServiceDetail = (service) => {
  try {
    if (!service) return;
    selectedService.value = service;
    showServiceDetailModal.value = true;
  } catch (error) {
    console.error('Error abriendo detalle de servicio:', error);
  }
};

const closeServiceDetailModal = () => {
  try {
    showServiceDetailModal.value = false;
    setTimeout(() => {
      selectedService.value = null;
    }, 300);
  } catch (error) {
    console.error('Error cerrando modal de servicio:', error);
  }
};

const getServiceTypeColor = (serviceType) => {
  try {
    const colors = {
      'plomeria': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'electricidad': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      'carpinteria': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'pintura': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'limpieza': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      'jardineria': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      'albañileria': 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return colors[serviceType?.toLowerCase()] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  } catch (error) {
    console.error('Error obteniendo color de tipo de servicio:', error);
    return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getServiceTypeIcon = (serviceType) => {
  try {
    const icons = {
      'plomeria': '🚰',
      'electricidad': '💡',
      'carpinteria': '🪚',
      'pintura': '🎨',
      'limpieza': '🧹',
      'jardineria': '🌿',
      'albañileria': '🧱'
    };
    return icons[serviceType?.toLowerCase()] || '🔧';
  } catch (error) {
    console.error('Error obteniendo icono de tipo de servicio:', error);
    return '🔧';
  }
};

// ===== FUNCIONES DE GRÁFICOS =====
let chart = null;

const availableCharts = [
  { id: 'earnings', name: '📈 Ingresos Mensuales' },
  { id: 'serviceTypes', name: '🛠️ Servicios por Tipo' },
  { id: 'services', name: '📊 Servicios por Mes' },
  { id: 'users', name: '👥 Crecimiento de Usuarios' },
  { id: 'cities', name: '🏙️ Servicios por Ciudad' }
];

const generateMonthLabels = () => {
  try {
    const labels = [];
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      labels.push(date.toLocaleDateString('es-ES', { month: 'short' }));
    }
    
    return labels;
  } catch (error) {
    console.error('Error generando etiquetas de mes:', error);
    return [];
  }
};

const earningsData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Ingresos Mensuales', 
    borderColor: '#10B981',
    backgroundColor: 'rgba(22, 248, 173, 0.26)',
    tension: 0.4,
    fill: true
  }]
});

const getChartTitle = () => {
  try {
    const chartTitles = {
      earnings: 'Ingresos Mensuales',
      serviceTypes: 'Distribución de Servicios por Tipo', 
      services: 'Servicios Realizados por Mes',
      users: 'Crecimiento de Usuarios',
      cities: 'Servicios por Ciudad'
    };
    return chartTitles[selectedChart.value] || 'Gráfico';
  } catch (error) {
    console.error('Error obteniendo título de gráfico:', error);
    return 'Gráfico';
  }
};

const updatePlatformStats = async () => {
  try { 
    let url = '/movimientos/reporte/ingresos';
    const params = new URLSearchParams();
    
    if (platformDateFrom.value || platformDateTo.value) {
      const mesActual = platformDateFrom.value ? 
        `${platformDateFrom.value.substring(0, 7)}` : 
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      params.append('mesActual', mesActual);
      
      if (platformDateFrom.value) {
        params.append('fechaInicio', platformDateFrom.value);
      }
      if (platformDateTo.value) {
        params.append('fechaFin', platformDateTo.value);
      }
    } else {
      const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      params.append('mesActual', mesActual);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data) {
      const data = response.data.resumen;
      
      platformStats.totalRevenue = data.ingresosTotales || 0;
      platformStats.membershipRevenue = data.ingresosMembresias || 0;
      platformStats.visitRevenue = data.ingresosVisitas || 0;
      platformStats.serviceRevenue = data.ingresosServicios || 0;
      platformStats.totalWithdrawals = data.retiros || 0;
      platformStats.totalCommissions = data.comisiones || 0;
      
      if (response.data.grafico) {
        updateChart(response.data.grafico);
      }
      
    }
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
  }  
};

const createChart = async () => {
  try {
    if (!selectedChart.value) return;
    
    if (window.currentChart) {
      window.currentChart.destroy();
    }
    
    const canvas = document.getElementById(`chart-${selectedChart.value}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
     
    let config = {};
    
    switch (selectedChart.value) {
      case 'earnings':
        config = {
          type: 'bar',
          data: earningsData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  font: { size: 11, family: 'sans-serif', weight: 500 }
                }
              },
              tooltip: {
                backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
                titleColor: isDark ? '#F9FAFB' : '#111827',
                bodyColor: isDark ? '#D1D5DB' : '#4B5563',
                callbacks: {
                  label: function(context) {
                    return 'L. ' + context.raw.toLocaleString('es-HN');
                  }
                }
              },
              datalabels: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  callback: function(value) {
                    return 'L. ' + (value/1000) + 'K';
                  }
                },
                grid: {
                  color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'
                }
              },
              x: {
                ticks: { color: isDark ? '#9CA3AF' : '#6B7280' },
                grid: { display: false }
              }
            }
          }
        };
        break;
      
      case 'serviceTypes':
      case 'cities':
        config = {
          type: 'doughnut',
          data: {
            labels: [],
            datasets: [{
              data: [],
              backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
              borderWidth: 0
            }]
          },
          plugins: [DataLabelsPlugin],
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%',
            plugins: {
              legend: {
                display: true,
                position: 'right',
                labels: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  font: { size: 10 }
                }
              },
              datalabels: {
                display: true,
                color: '#FFFFFF',
                font: { weight: 'bold', size: 11 },
                formatter: (value, context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return percentage > 8 ? `${value}\n(${percentage}%)` : percentage > 4 ? `${percentage}%` : '';
                }
              }
            }
          }
        };
        break;

      case 'services':
      case 'users':
        config = {
          type: 'line',
          data: selectedChart.value === 'services' ? servicesData : usersData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { color: isDark ? '#9CA3AF' : '#6B7280' }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: isDark ? '#9CA3AF' : '#6B7280' },
                grid: { color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }
              },
              x: {
                ticks: { color: isDark ? '#9CA3AF' : '#6B7280' },
                grid: { display: false }
              }
            }
          }
        };
        break;
    }
    
    window.currentChart = new Chart(ctx, config);
    
    // Cargar datos según el tipo de gráfico
    switch (selectedChart.value) {
      case 'earnings':
        if (platformDateFrom.value || platformDateTo.value) {
          await updatePlatformStats();
        }
        break;
      case 'serviceTypes':
        await loadServiceTypesData();
        break;
      case 'services':
        await loadServicesPerMonthData();
        break;
      case 'users':
        await loadUserGrowthData();
        break;
      case 'cities':
        await loadServicesByCityData();
        break;
    }
  } catch (error) {
    console.error('Error creando gráfico:', error);
  }
};

const updateChart = (chartData) => {
  try {
    if (window.currentChart && chartData) {
      window.currentChart.data.labels = chartData.etiquetas || [];
      window.currentChart.data.datasets[0].data = chartData.datos || [];
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error actualizando gráfico:', error);
  }
};

// ===== FUNCIONES DE CARGA DE DATOS DE GRÁFICOS =====
const loadServiceTypesData = async () => {
  try { 
    const response = await $fetch('/solicitudservicio/grafica/servicios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      
      const colors = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
      window.currentChart.data.datasets[0].backgroundColor = colors;
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por tipo:', error);
    showToast('Error al cargar los datos del gráfico de servicios', 'error');
  }
};
const loadServicesPerMonthData = async () => {
  try { 
    const response = await $fetch('/solicitudservicio/grafica/servicios-por-mes', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por mes:', error);
    showToast('Error al cargar los datos del gráfico de servicios por mes', 'error');
  }
};

const loadUserGrowthData = async () => {
  try { 
    const response = await $fetch('/usuarios/grafica/crecimiento-usuarios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de crecimiento de usuarios:', error);
    showToast('Error al cargar los datos del gráfico de crecimiento de usuarios', 'error');
  }
};

const loadServicesByCityData = async () => {
  try { 
    const response = await $fetch('/solicitudservicio/grafica/servicios-por-ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response?.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      window.currentChart.data.labels = labels || [];
      window.currentChart.data.datasets[0].data = valores || [];
      
      const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4'];
      window.currentChart.data.datasets[0].backgroundColor = colors;
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por ciudad:', error);
    showToast('Error al cargar los datos del gráfico de servicios por ciudad', 'error');
  }
};

// ===== COMPUTED PROPERTIES =====
const visibleTransactions = computed(() => {
  try {
    return transactions.value || [];
  } catch (error) {
    console.error('Error en visibleTransactions:', error);
    return [];
  }
});

// ===== REPORTES =====
const servicesData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Servicios Realizados',
    data: [85, 92, 78, 105, 98, 112, 125, 118, 132, 145, 158, 167],
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
});

const usersData = reactive({
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [{
    label: 'Usuarios Registrados',
    data: [150, 280, 420, 650, 890, 1200],
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
});
const availableReports = ref([
  {
    id: 1,
    title: 'Reporte Financiero Mensual',
    description: 'Resumen completo de ingresos y Retiros',
    icon: '💰',
    iconClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    generating: false
  },
  {
    id: 2,
    title: 'Reporte de Servicios Detallado',
    description: 'Análisis completo de todos los servicios',
    icon: '🛠️',
    iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    generating: false
  },
  {
    id: 3,
    title: 'Reporte de Usuarios',
    description: 'Resumen de todos los Usuarios',
    icon: '👥',
    iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    generating: false
  },
]); 

const generateReport = async (report) => {
  try {
    report.generating = true;
    
    const config = useRuntimeConfig();
    const auth = useAuthStore();

    // 🗓️ 1️⃣ Obtener mes y año seleccionados
    const hasSelectedMonth = !!selectedMonthReports.value;
    const selectedMonth = selectedMonthReports.value;
    
    // Solo incluir el parámetro month si se seleccionó un mes
    const monthParam = hasSelectedMonth ? `?month=${selectedMonth}` : '';
    
    // Configurar título del reporte
    let reportTitle = 'Reporte General';
    let monthName = '';
    let year = '';
    let month = ''; // Declarar month en el scope exterior
    
    if (hasSelectedMonth) {
      [year, month] = selectedMonth.split('-').map(Number);
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      monthName = monthNames[month - 1];
      reportTitle = `Reporte de ${monthName} ${year}`;
    } 

    // 📦 2️⃣ Obtener datos base comunes
    const [membershipRes, visitRes, withdrawalsRes, quotationRes, usersRes] = await Promise.all([
      $fetch(`/membresia${monthParam}`, {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${auth.token}` }
      }).then(res => { 
        return res;
      }).catch(err => {
        console.error('❌ Error en /membresia:', err);
        throw err;
      }),
      $fetch(`/pagovisita${monthParam}`, {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${auth.token}` }
      }).then(res => { 
        return res;
      }).catch(err => {
        console.error('❌ Error en /pagovisita:', err);
        throw err;
      }),
      $fetch(`/movimientos/retiros${monthParam}`, {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${auth.token}` }
      }).then(res => { 
        return res;
      }).catch(err => {
        console.error('❌ Error en /movimientos/retiros:', err);
        throw err;
      }),
      $fetch(`/cotizacion${monthParam}`, {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${auth.token}` }
      }).then(res => { 
        return res;
      }).catch(err => {
        console.error('❌ Error en /cotizacion:', err);
        throw err;
      }),
      $fetch(`/usuarios${monthParam}`, {
        baseURL: config.public.apiBase,
        headers: { 'Authorization': `Bearer ${auth.token}` }
      }).then(res => { 
        return res;
      }).catch(err => {
        console.error('❌ Error en /usuarios:', err);
        throw err;
      })
    ]);

    // 🔄 3️⃣ Normalizar data
    const processData = (data, label) => ({
      label,
      total: parseFloat(data?.estadisticas?.total || 0),
      data: data?.data || [],
      stats: data?.estadisticas || {}
    });
    const usersData = {
  label: 'Usuarios',
  total: usersRes?.estadisticas?.total || 0,
  data: usersRes?.data || [],
  stats: usersRes?.estadisticas || {}
};


    const membershipData = processData(membershipRes, 'Membresías');
    const visitData = processData(visitRes, 'Visitas Técnicas');
    const quotationData = processData(quotationRes, 'Cotizaciones');
    const withdrawalsData = processData(withdrawalsRes, 'Retiros');

    const serviceData = processData(quotationRes, 'Servicios'); // 👈 Cotizaciones se consideran "servicios" en el reporte financiero

    // 💰 4️⃣ Cálculos de balance
    const ingresosTotales = membershipData.total + visitData.total + serviceData.total;
    const retirosTotales = withdrawalsData.total;
    const balanceNeto = ingresosTotales - retirosTotales;

    // 🧾 5️⃣ Crear documento PDF usando el plugin $pdf
    const { $pdf } = useNuxtApp();
    const doc = await $pdf.create();
    const colorPrincipal = [93, 92, 222];
    const colorSecundario = [75, 85, 99];

    // 🏷️ Encabezado
    doc.setFillColor(...colorPrincipal);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('HOGAR SEGURO', 15, 12);
    doc.setFontSize(9);
    doc.text(`Reporte: ${report.title}`, 15, 18);
    doc.text(hasSelectedMonth 
      ? `Período: ${monthName}`
      : 'Período: General (Todos los meses)', 15, 23);

    // 📚 6️⃣ Seleccionar tipo de reporte
    switch (report.id) {

      // ===== REPORTE FINANCIERO =====
      case 1:
        await generarReporteFinanciero(doc, {
          membershipData,
          visitData,
          serviceData,
          withdrawalsData,
          mesNombre: monthName,
          year,
          balanceNeto
        });
        break;

      // ===== REPORTE DE SERVICIOS =====
      case 2: {
        // Solo en este reporte se usa /solicitudservicio
        const serviceUrl = hasSelectedMonth 
          ? `/solicitudservicio?month=${selectedMonth}`
          : '/solicitudservicio'; 
        
        const serviceRes = await $fetch(serviceUrl, {
          baseURL: config.public.apiBase,
          headers: { Authorization: `Bearer ${auth.token}` }
        }).then(res => { 
          return res;
        }).catch(err => {
          console.error('❌ Error en /solicitudservicio:', err);
          throw err;
        });
        const serviceData = processData(serviceRes, 'Servicios');
        await generarReporteServiciosDetallado(doc, serviceData);
        break;
      }

      // ===== REPORTE DE USUARIOS =====
      case 3:
        await generarReporteUsuarios(doc, { usersData, mesNombre: monthName, year });
        break;

      // ===== REPORTE DE TRANSACCIONES =====
      case 4:
        await generarReporteTransacciones(doc, membershipData, visitData, withdrawalsData);
        break;

      default:
        showToast('Tipo de reporte no reconocido', 'error');
    }

    // 📄 7️⃣ Footer con número de página
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      const [r, g, b] = colorSecundario;
      doc.setFillColor(r, g, b);
      doc.rect(0, 280, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const title = typeof report.title === 'string' ? report.title : 'Reporte';
      const reportTitle = hasSelectedMonth 
        ? `HOGAR SEGURO - ${title} - ${monthName} ${year}`
        : `HOGAR SEGURO - ${title} - Reporte General`;
      doc.text(reportTitle, 20, 287);
      doc.text(`Página ${i} de ${totalPages}`, 190, 287, { align: 'right' });
    }

    // 🖨️ 8️⃣ Mostrar PDF
    const fileName = hasSelectedMonth 
      ? `${report.title.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`
      : `${report.title.replace(/\s+/g, '_')}_General.pdf`;
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
    showToast(`Reporte ${report.title} generado correctamente`, 'success');

  } catch (error) {
    console.error('Error al generar reporte:', error);
    showToast('Error al generar el reporte', 'error');
  } finally {
    report.generating = false;
  }
};

// ===== REPORTE FINANCIERO =====
const generarReporteFinanciero = async (doc, { membershipData, visitData, serviceData, withdrawalsData, mesNombre, year, balanceNeto }) => {
  // Usar autoTable del documento
  let currentY = 40;

  // 🎯 Título
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);
  doc.text('REPORTE FINANCIERO MENSUAL', 10, currentY);
  currentY += 6;

  // 📊 Calcular porcentajes
  const totalIngresos = membershipData.total + visitData.total + serviceData.total;
  const calcPorcentaje = (valor) => totalIngresos > 0 ? ((valor / totalIngresos) * 100).toFixed(1) + '%' : '0%';

  // 📋 Tabla resumen de totales
  doc.autoTable({
    startY: currentY,
    head: [['Concepto', 'Total (HNL)', 'Porcentaje (%)']],
    body: [
      ['Membresías', formatCurrency(membershipData.total), calcPorcentaje(membershipData.total)],
      ['Visitas Técnicas', formatCurrency(visitData.total), calcPorcentaje(visitData.total)],
      ['Servicios', formatCurrency(serviceData.total), calcPorcentaje(serviceData.total)],
      ['Retiros', formatCurrency(withdrawalsData.total), '-'],
      ['Balance Neto', formatCurrency(balanceNeto), '-']
    ],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 70 }, 1: { halign: 'right' }, 2: { halign: 'center' } },
    margin: { left: 10, right: 10 }
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // 📋 Detalle de Ingresos
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(12);
  doc.text('Detalle de Ingresos', 10, currentY);
  currentY += 8;

  const membresiasFiltradas = membershipData.data
    .filter(m => m.estado?.toLowerCase() !== 'pendiente')
    .map(m => [formatDate(m.fecha), 'Membresía', m.usuario?.nombre || m.usuario?.cliente?.nombre || '-', formatCurrency(m.monto)]);

  const visitasFiltradas = visitData.data
    .filter(v => !['pendiente', 'rechazado'].includes(v.estado?.toLowerCase()))
    .map(v => [formatDate(v.fecha), 'Visita', v.cliente?.nombre || v.client || v.usuario?.nombre || '-', formatCurrency(v.monto)]);

  const serviciosFiltrados = serviceData.data
    .filter(s => s.estado?.toLowerCase() !== 'pendiente')
    .map(s => [formatDate(s.fecha), 'Servicio', s.solicitud?.cliente?.nombre || '-', formatCurrency(s.monto_total || 0)]);

  // Calculate totals from original data instead of formatted strings
  const totalMembresias = membershipData.data
    .filter(m => m.estado?.toLowerCase() !== 'pendiente')
    .reduce((sum, m) => sum + (parseFloat(m.monto) || 0), 0);
    
  const totalVisitas = visitData.data
    .filter(v => !['pendiente', 'rechazado'].includes(v.estado?.toLowerCase()))
    .reduce((sum, v) => sum + (parseFloat(v.monto) || 0), 0);
    
  const totalServicios = serviceData.data
    .filter(s => s.estado?.toLowerCase() !== 'pendiente')
    .reduce((sum, s) => sum + (parseFloat(s.monto_total) || 0), 0);
    
  const totalIngresosTabla = totalMembresias + totalVisitas + totalServicios;

  const hayDatos = membresiasFiltradas.length > 0 || visitasFiltradas.length > 0 || serviciosFiltrados.length > 0;

  doc.autoTable({
    startY: currentY,
    head: [['Fecha', 'Tipo', 'Cliente', 'Monto']],
    body: hayDatos
      ? [
          ...membresiasFiltradas,
          ...visitasFiltradas,
          ...serviciosFiltrados,
          [
            { content: 'TOTAL INGRESOS', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(totalIngresosTabla), styles: { fontStyle: 'bold' } }
          ]
        ]
      : [[{ content: 'No hay datos disponibles', colSpan: 4, styles: { fontStyle: 'italic', halign: 'center', textColor: [100, 100, 100] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 30 }, 2: { cellWidth: 'auto' }, 3: { halign: 'right', cellWidth: 30 } },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto'
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // 📋 Detalle de Retiros
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(12);
  doc.text('Detalle de Retiros', 10, currentY);
  currentY += 8;

  const retirosFiltrados = withdrawalsData.data
    .filter(r => r.estado?.toLowerCase() !== 'pendiente')
    .map(r => [
      formatDate(r.fecha),
      r.nombre_usuario || '-',
      r.descripcion?.replace(/\n/g, ' ') || 'Sin descripción',
      formatCurrency(r.monto),
      r.estado
    ]);

  const totalRetiros = withdrawalsData.data.reduce((sum, r) => sum + (parseFloat(r.monto) || 0), 0);
  const hayRetiros = retirosFiltrados.length > 0;

  doc.autoTable({
    startY: currentY,
    head: [['Fecha', 'Usuario', 'Descripción', 'Monto', 'Estado']],
    body: hayRetiros
      ? [
          ...retirosFiltrados,
          [
            { content: 'TOTAL RETIROS', colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
            { content: formatCurrency(totalRetiros), styles: { fontStyle: 'bold' } }
          ]
        ]
      : [[{ content: 'No hay retiros disponibles', colSpan: 5, styles: { fontStyle: 'italic', halign: 'center', textColor: [100, 100, 100] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto'
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // 📄 Resumen Final
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(33, 33, 33);
  doc.text('Resumen Final', 10, currentY);
  currentY += 6;

  doc.autoTable({
    startY: currentY,
    head: [['Total Ingresos', 'Total Retiros', 'Balance Neto']],
    body: [[
      formatCurrency(totalIngresos),
      formatCurrency(withdrawalsData.total),
      formatCurrency(balanceNeto)
    ]],
    theme: 'grid',
    headStyles: { fillColor: [75, 85, 99], textColor: 255, fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    margin: { left: 10, right: 10 }
  });
};

// ===== REPORTE DE USUARIOS =====
const generarReporteUsuarios = async (doc, { usersData, mesNombre, year }) => {
  // Usar autoTable del documento
  const autoTable = (options) => doc.autoTable(options);
  let currentY = 40;

  // 🔹 Título principal
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);
  doc.text('REPORTE DE USUARIOS', 10, currentY);
  currentY += 8;

  // ============================================================
  // 1️⃣ TABLA DE CLIENTES
  // ============================================================
  const clientes = usersData.data.filter(u => u.rol?.nombre_rol?.toLowerCase() === 'usuario');
  const totalClientes = clientes.length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(93, 92, 222);
  doc.text('Clientes Registrados', 10, currentY);
  currentY += 8;

  const clientesBody = clientes.map(c => [
    formatDate(c.fecha_registro),
    c.nombre,
    c.telefono || '-',
    c.ciudad?.nombre_ciudad || '-',
    c.estado,
    c.total_servicios_cliente || 0,
    c.total_membresias || 0
  ]);

  if (clientesBody.length > 0) {
    const totalServicios = clientes.reduce((sum, c) => sum + (parseInt(c.total_servicios_cliente) || 0), 0);
    const totalMembresias = clientes.reduce((sum, c) => sum + (parseInt(c.total_membresias) || 0), 0);
    
    clientesBody.push([
      { content: `Total clientes: ${totalClientes}`, colSpan: 5, styles: { fontStyle: 'bold' } },
      { content: totalServicios.toString(), styles: { halign: 'right', fontStyle: 'bold' } },
      { content: totalMembresias.toString(), styles: { halign: 'right', fontStyle: 'bold' } }
    ]);
  }

  doc.autoTable({
    startY: currentY,
    head: [['Fecha Registro', 'Nombre', 'Teléfono', 'Ciudad', 'Estado', 'Servicios', 'Membresías']],
    body: clientesBody.length
      ? clientesBody
      : [[{ content: 'No hay clientes registrados en este período', colSpan: 7, styles: { halign: 'center', fontStyle: 'italic', textColor: [120, 120, 120] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 35 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 25 },
      5: { cellWidth: 22, halign: 'right' },
      6: { cellWidth: 25, halign: 'right' }
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto'
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // ============================================================
  // 2️⃣ TABLA DE TÉCNICOS
  // ============================================================
  const tecnicos = usersData.data.filter(u =>
    ['técnico', 'tecnico'].includes(u.rol?.nombre_rol?.toLowerCase())
  );
  const totalTecnicos = tecnicos.length;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(93, 92, 222);
  doc.text('Técnicos Registrados', 10, currentY);
  currentY += 8;

  const tecnicosBody = tecnicos.map(t => [
    formatDate(t.fecha_registro),
    t.nombre,
    t.telefono || '-',
    t.ciudad?.nombre_ciudad || '-',
    t.estado,
    t.total_servicios_tecnico || 0
  ]);

  if (tecnicosBody.length > 0) {
    const totalServiciosTecnicos = tecnicos.reduce((sum, t) => sum + (parseInt(t.total_servicios_tecnico) || 0), 0);
    
    tecnicosBody.push([
      { content: `Total técnicos: ${totalTecnicos}`, colSpan: 5, styles: { fontStyle: 'bold' } },
      { content: totalServiciosTecnicos.toString(), styles: { halign: 'right', fontStyle: 'bold' } }
    ]);
  }

  doc.autoTable({
    startY: currentY,
    head: [['Fecha Registro', 'Nombre', 'Teléfono', 'Ciudad', 'Estado', 'Servicios']],
    body: tecnicosBody.length
      ? tecnicosBody
      : [[{ content: 'No hay técnicos registrados en este período', colSpan: 6, styles: { halign: 'center', fontStyle: 'italic', textColor: [120, 120, 120] } }]],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 53 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20, halign: 'right' }
    },
    margin: { left: 10, right: 10 },
    pageBreak: 'auto'
  });

  currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  // ============================================================
  // 3️⃣ ESTADÍSTICAS GENERALES (dividida en 2 columnas)
  // ============================================================
  const stats = usersData.stats || {};
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(93, 92, 222);
  doc.text('Estadísticas Generales (Actuales)', 10, currentY);
  currentY += 6;

  const statsCol1 = [
    ['Usuarios activos', stats.activos || 0],
    ['Usuarios inactivos', stats.inactivos || 0],
    ['Usuarios deshabilitados', stats.deshabilitados || 0],
    ['Total de usuarios', stats.total || 0]
  ];

  const statsCol2 = [
    ['Usuarios que solicitaron servicios', stats.usuarios_que_solicitaron_servicios || 0],
    ['Usuarios con membresía', stats.usuarios_con_membresia || 0],
    ['Técnicos activos', stats.tecnicos_activos || 0]
  ];

  // 🟦 Primera columna
  doc.autoTable({
    startY: currentY,
    head: [['Métrica', 'Cantidad']],
    body: statsCol1,
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 1.5 },
    margin: { left: 10 },
    tableWidth: 85,
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 30, halign: 'right' } }
  });

  // 🟩 Segunda columna (a la derecha)
  doc.autoTable({
    startY: currentY,
    head: [['Métrica', 'Cantidad']],
    body: statsCol2,
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8, cellPadding: 1.5 },
    margin: { left: 110 },
    tableWidth: 85,
    columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 30, halign: 'right' } }
  });
};


// ===== REPORTE DE SERVICIOS DETALLADO =====
const generarReporteServiciosDetallado = async (doc, serviceData) => {
  // Usar autoTable del documento
  const autoTable = (options) => doc.autoTable(options);
  const servicios = Array.isArray(serviceData?.data) ? serviceData.data : [];
  
  // Verificar si hay datos para mostrar
  if (servicios.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(120, 120, 120); // Color gris
    doc.text('No hay datos disponibles para el período seleccionado.', 14, 40);
    doc.setTextColor(0, 0, 0); // Restaurar color negro por defecto
    return;
  }
  
  const TERMINADOS = ['finalizado', 'calificado', 'cancelado'];

  // 📊 Clasificación
  const serviciosActivosConPago = servicios.filter(
    s => s.pagoVisita?.monto != null && !TERMINADOS.includes(s.estado)
  );
  const serviciosActivosSinPago = servicios.filter(
    s => (s.pagoVisita == null || s.pagoVisita.monto == null) && !TERMINADOS.includes(s.estado)
  );
  const serviciosTerminados = servicios.filter(s => TERMINADOS.includes(s.estado));

  // 🧩 Helpers
  const formatValue = (v) => v ?? '-';
  const obtenerUbicacion = (s) => {
    const colonia = s?.colonia?.trim() || '';
    const ciudad = s?.ciudad?.nombre?.trim() || '';
    if (colonia && ciudad) return `${colonia} - ${ciudad}`;
    return colonia || ciudad || '-';
  };
  const montoFila_ConPago = (s) => (parseFloat(s?.cotizacion?.total || 0) + parseFloat(s?.pagoVisita?.monto || 0));
  const montoFila_SinPago = (s) => parseFloat(s?.cotizacion?.total || 0);
  const montoFila_Terminado = (s) => (parseFloat(s?.cotizacion?.total || 0) + parseFloat(s?.pagoVisita?.monto || 0));

  let currentY = 40;

  // ========= 1️⃣ SERVICIOS ACTIVOS CON PAGO DE VISITA =========
  if (serviciosActivosConPago.length) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 92, 222);
    doc.setFontSize(13);
    doc.text('SERVICIOS ACTIVOS CON PAGO DE VISITA', 10, currentY);
    currentY += 6;

    const headers = ['Fecha Solicitud', 'Cliente', 'Técnico', 'Servicio', 'Ubicación', 'Estado', 'Monto Total'];
    const rows = serviciosActivosConPago.map(s => ([
      formatDate(s.fecha_solicitud),
      formatValue(s.cliente?.nombre),
      formatValue(s.tecnico?.nombre),
      formatValue(s.servicio?.nombre),
      obtenerUbicacion(s),
      formatValue(s.estado),
      formatCurrency(montoFila_ConPago(s))
    ]));

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: rows, // 🔹 sin fila de total general
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto'
    });

    currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  }

  // ========= 2️⃣ SERVICIOS ACTIVOS SIN PAGO DE VISITA =========
  if (serviciosActivosSinPago.length) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 92, 222);
    doc.setFontSize(13);
    doc.text('SERVICIOS ACTIVOS SIN PAGO DE VISITA', 10, currentY);
    currentY += 6;

    const headers = ['Fecha Solicitud', 'Cliente', 'Técnico', 'Servicio', 'Ubicación', 'Estado', 'Monto Total'];
    const rows = serviciosActivosSinPago.map(s => ([
      formatDate(s.fecha_solicitud),
      formatValue(s.cliente?.nombre),
      formatValue(s.tecnico?.nombre),
      formatValue(s.servicio?.nombre),
      obtenerUbicacion(s),
      formatValue(s.estado),
      formatCurrency(montoFila_SinPago(s))
    ]));

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: rows, // 🔹 sin fila de total general
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto'
    });

    currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  }

  // ========= 3️⃣ SERVICIOS TERMINADOS =========
  if (serviciosTerminados.length) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(93, 92, 222);
    doc.setFontSize(13);
    doc.text('SERVICIOS TERMINADOS', 10, currentY);
    currentY += 6;

    const headers = ['Fecha Solicitud', 'Cliente', 'Técnico', 'Servicio', 'Ubicación', 'Estado', 'Monto Total'];
    const rows = serviciosTerminados.map(s => ([
      formatDate(s.fecha_solicitud),
      formatValue(s.cliente?.nombre),
      formatValue(s.tecnico?.nombre),
      formatValue(s.servicio?.nombre),
      obtenerUbicacion(s),
      formatValue(s.estado),
      formatCurrency(montoFila_Terminado(s))
    ]));

    const totalTabla = serviciosTerminados.reduce((sum, s) => sum + montoFila_Terminado(s), 0);
    const totalRow = [
      { content: 'TOTAL GENERAL', colSpan: headers.length - 1, styles: { halign: 'right', fontStyle: 'bold' } },
      { content: formatCurrency(totalTabla), styles: { fontStyle: 'bold' } }
    ];

    doc.autoTable({
      startY: currentY,
      head: [headers],
      body: [...rows, totalRow],
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto'
    });

    currentY = doc.lastAutoTable.finalY + 10;
  
  // Agregar nueva página si es necesario
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  }

  // ========= 4️⃣ DESGLOSE POR TIPO DE SERVICIO =========
  const contadorPorServicio = servicios.reduce((acc, s) => {
    const nombre = s?.servicio?.nombre ? String(s.servicio.nombre).trim() : 'Sin servicio';
    acc[nombre] = (acc[nombre] || 0) + 1;
    return acc;
  }, {});

  const desgloseRows = Object.keys(contadorPorServicio).map(nombre => [nombre, contadorPorServicio[nombre]]);

  if (desgloseRows.length) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(93, 92, 222);
    doc.text('DESGLOSE POR TIPO DE SERVICIO', 10, currentY);
    currentY += 6;

    doc.autoTable({
      startY: currentY,
      head: [['Servicio', 'Cantidad']],
      body: desgloseRows,
      theme: 'grid',
      headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 9 },
      margin: { left: 10, right: 10 },
      pageBreak: 'auto'
    });
  }
};


// ===== REPORTE DE TRANSACCIONES =====
const generarReporteTransacciones = async (doc, membershipData, visitData, withdrawalsData) => {
  // Usar autoTable del documento
  const autoTable = (options) => doc.autoTable(options);
  const data = [
    ...(membershipData?.data || []).map((m) => ({
      tipo: 'Membresía',
      fecha: m?.fecha || new Date().toISOString(),
      descripcion: `Pago de membresía - ${m?.usuario?.nombre || 'Sin nombre'}`,
      monto: parseFloat(m?.monto || 0),
      estado: m?.estado || 'Pendiente'
    })),
    ...(visitData?.data || []).map((v) => ({
      tipo: 'Visita',
      fecha: v?.fecha || new Date().toISOString(),
      descripcion: `Pago visita - ${v?.solicitud?.servicio?.nombre || 'Servicio'}`,
      monto: parseFloat(v?.monto || 0),
      estado: v?.estado || 'Pendiente'
    })),
    ...(withdrawalsData?.data || []).map((r) => ({
      tipo: 'Retiro',
      fecha: r?.fecha || new Date().toISOString(),
      descripcion: r?.descripcion || 'Retiro de fondos',
      monto: -Math.abs(parseFloat(r?.monto || 0)),
      estado: r?.estado || 'Pendiente'
    }))
  ].filter(Boolean);

  let currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 40;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(93, 92, 222);
  doc.setFontSize(14);
  doc.text('REPORTE DE TRANSACCIONES', 10, currentY);
  currentY += 6;

  const headers = ['Fecha', 'Tipo', 'Descripción', 'Estado', 'Monto']; // monto al final
  const rows = data.map((t) => [
    formatDate(t.fecha),
    t.tipo,
    t.descripcion,
    t.estado,
    formatCurrency(t.monto)
  ]);

  const total = data.reduce((sum, t) => sum + (t.monto || 0), 0);
  const totalRow = [
    { content: 'TOTAL GENERAL', colSpan: headers.length - 1, styles: { halign: 'right', fontStyle: 'bold' } },
    { content: formatCurrency(total), styles: { fontStyle: 'bold' } }
  ];

  doc.autoTable({
    startY: currentY,
    head: [headers],
    body: [...rows, totalRow],
    theme: 'grid',
    headStyles: { fillColor: [93, 92, 222], textColor: 255, fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    margin: { left: 10, right: 10 }
  });
};

// ===== FUNCIONES DE APROBACION o RECHAZO DE PAGOS =====
const approvePayment = async (id) => {
  try {
    const payment = activeTab.value === 'withdrawals' ? selectedWithdrawal.value : selectedPayment.value;
    let response;
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    };

    // Obtener el ID del usuario para notificaciones
    let idUsuario;
    
    // Manejar diferentes estructuras de pago según el tipo
    if (activeTab.value === 'withdrawals') {
      // Para retiros
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario;
    } else if (activeTab.value === 'membership') {
      // Para membresías
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario || payment?.id_cliente;
    } else if (activeTab.value === 'visits' || activeTab.value === 'services') {
      // Para pagos de visitas y servicios - buscar en múltiples ubicaciones
      idUsuario = payment?.solicitud?.cliente?.id_usuario || 
                  payment?.solicitud?.cliente?.id_cliente ||
                  payment?.cliente?.id_usuario || 
                  payment?.cliente?.id_cliente ||
                  payment?.usuario?.id_usuario ||
                  payment?.id_usuario ||
                  payment?.id_cliente;
    } 

    switch (activeTab.value) {
      case 'membership':
        // Update membership status
        response = await $fetch(`/membresia/${payment.id_membresia || payment.id}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers,
          body: { estado: 'activa' }
        });

        // Add credit for the user with the membership amount

        const creditRequestBody = {
          id_usuario: idUsuario,
          monto_credito: payment.monto
        }; 
        
        const creditResponse = await $fetch('/credito', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: creditRequestBody
        }); 
        break;

      case 'visits':
        // Usar el endpoint correcto de confirmación de pago de visita
        response = await $fetch('/pagovisita/confirmar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers,
          body: {
            id_solicitud: payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id,
            id_cotizacion: payment.id_cotizacion || payment.cotizacion?.id || payment.cotizacion?.id_cotizacion
          }
        });

        // Notificar al admin de servicio pendiente
        if (response?.success) {
          try {
            await $fetch('/notificaciones/enviar', {
              baseURL: config.public.apiBase,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
              },
              body: JSON.stringify({
                titulo: 'Asignación Pendiente',
                 nombre_rol: 'sa'
              })
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al técnico:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
          try {
            await $fetch('/notificaciones/enviar', {
              baseURL: config.public.apiBase,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
              },
              body: JSON.stringify({
                titulo: 'Asignación Pendiente',
                 nombre_rol: 'admin'
              })
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al técnico:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
        }
        break;

      case 'services':
        // Usar el endpoint correcto de aceptación de pago de servicio
        const solicitudId = payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id;
        const cotizacionId = payment.id_cotizacion || 
                           payment.cotizacion?.id || 
                           payment.cotizacion?.id_cotizacion ||
                           payment.cotizaciones?.[0]?.id ||
                           payment.cotizaciones?.[0]?.id_cotizacion;

        // Aprobar el pago del servicio
        response = await $fetch('/pagoservicio/aceptar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers,
          body: {
            id_solicitud: solicitudId,
            id_cotizacion: cotizacionId
          }
        });

        // Notificar al técnico sobre el pago recibido
        if (response?.success && payment.solicitud?.tecnico?.id_usuario) {
          try {
            await $fetch('/notificaciones/enviar', {
              baseURL: config.public.apiBase,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
              },
              body: JSON.stringify({
                titulo: 'Pago de servicio recibido',
                id_usuario: payment.solicitud.tecnico.id_usuario
              })
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al técnico:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
        }
        
        break;

      case 'withdrawals':
        const withdrawalId = payment.id_movimiento || payment.id;
        response = await $fetch(`/movimientos/${withdrawalId}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers,
          body: { estado: 'completado' }
        });
        break;
    }

    if (activeTab.value === 'withdrawals') {
      if (selectedWithdrawal.value) {
        selectedWithdrawal.value.estado = 'completado';
      }
      closeWithdrawalModal();
    } else {
      closeDetailsModal();
    }

    showToast('Pago aprobado correctamente', 'success');

    // Notificar al cliente sobre el pago aprobado
    try {
      let titulo = '';
      if (activeTab.value === 'withdrawals') {
        titulo = 'Retiro Aprobado';
      } else if (activeTab.value === 'visits') {
        titulo = 'Pago de Visita Aprobado';
      } else if (activeTab.value === 'membership') {
        titulo = 'Pago de Membresía Aprobado';
      } else if (activeTab.value === 'services') {
        titulo = 'Pago de Servicio Aprobado';
      }

      if (idUsuario) {
        await $fetch('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo,
            id_usuario: idUsuario
          })
        });
      }
    } catch (notifError) {
      console.error('❌ Error al enviar notificación de pago aprobado:', notifError);
    }

    const currentPage = currentPaymentsPage.value;
    const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${currentPage}-${paymentsPerPage}`;
    if (paymentsCache.value[cacheKey]) delete paymentsCache.value[cacheKey];

    await loadTabData(currentPage);
    await updatePlatformStats();

  } catch (error) {
    console.error('❌ Error aprobando pago:', error);
    showToast(error.response?._data?.message || 'Error al aprobar el pago', 'error');
  }
};

const rejectPayment = async (id) => {
  try {
    const payment = activeTab.value === 'withdrawals' ? selectedWithdrawal.value : selectedPayment.value;
    let response;
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    };

    // Obtener el ID del usuario para notificaciones
    let idUsuario;
    
    // Manejar diferentes estructuras de pago según el tipo
    if (activeTab.value === 'withdrawals') {
      // Para retiros
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario;
    } else if (activeTab.value === 'membership') {
      // Para membresías
      idUsuario = payment?.usuario?.id_usuario || payment?.id_usuario || payment?.id_cliente;
    } else if (activeTab.value === 'visits' || activeTab.value === 'services') {
      // Para pagos de visitas y servicios - buscar en múltiples ubicaciones
      idUsuario = payment?.solicitud?.cliente?.id_usuario || 
                  payment?.solicitud?.cliente?.id_cliente ||
                  payment?.cliente?.id_usuario || 
                  payment?.cliente?.id_cliente ||
                  payment?.usuario?.id_usuario ||
                  payment?.id_usuario ||
                  payment?.id_cliente;
    }

    switch (activeTab.value) {
      case 'membership':
        response = await $fetch(`/membresia/${payment.id_membresia || payment.id}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers,
          body: { estado: 'rechazada' }
        });
        break;

      case 'visits':
        // Usar el endpoint correcto de denegación de pago de visita
        response = await $fetch('/pagovisita/denegar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers,
          body: {
            id_solicitud: payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id,
            id_cotizacion: payment.id_cotizacion || payment.cotizacion?.id || payment.cotizacion?.id_cotizacion,
            id_usuario: idUsuario
          }
        });

        // Actualizar el estado de la solicitud a pendiente_pagovisita
        try {
          await $fetch(`/solicitudservicio/${payment.solicitud?.id_solicitud || payment.id_solicitud || payment.id}`, {
            baseURL: config.public.apiBase,
            method: 'PUT',
            headers,
            body: { estado: 'pendiente_pagovisita' }
          });
        } catch (error) {
          console.error('Error al actualizar el estado de la solicitud:', error);
        }
        break;

      case 'services':
        // Usar el endpoint correcto de denegación de pago de servicio
        const solicitudId = payment.id_solicitud || payment.solicitud?.id_solicitud || payment.id;
        const cotizacionId = payment.id_cotizacion || 
                           payment.cotizacion?.id || 
                           payment.cotizacion?.id_cotizacion ||
                           payment.cotizaciones?.[0]?.id ||
                           payment.cotizaciones?.[0]?.id_cotizacion;

        response = await $fetch('/pagoservicio/denegar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers,
          body: {
            id_solicitud: solicitudId,
            id_cotizacion: cotizacionId,
            id_usuario: idUsuario
          }
        });
        break;

      case 'withdrawals':
        const withdrawalId = payment.id_movimiento || payment.id;
        response = await $fetch(`/movimientos/${withdrawalId}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers,
          body: { estado: 'rechazado' }
        });
        break;
    }

    if (activeTab.value === 'withdrawals') {
      if (selectedWithdrawal.value) {
        selectedWithdrawal.value.estado = 'rechazado';
      }
      closeWithdrawalModal();
    } else {
      closeDetailsModal();
    }

    showToast('Pago rechazado correctamente', 'success');

    // Notificar al cliente sobre el pago rechazado
    try {
      let titulo = '';
      if (activeTab.value === 'withdrawals') {
        titulo = 'Retiro Rechazado';
      } else if (activeTab.value === 'visits') {
        titulo = 'Pago de Visita Rechazado';
      } else if (activeTab.value === 'membership') {
        titulo = 'Pago de Membresía Rechazado';
      } else if (activeTab.value === 'services') {
        titulo = 'Pago de Servicio Rechazado';
      }

      if (idUsuario) {
        await $fetch('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo,
            id_usuario: idUsuario
          })
        });
      }
    } catch (notifError) {
      console.error('❌ Error al enviar notificación de pago rechazado:', notifError);
    }

    const currentPage = currentPaymentsPage.value;
    const cacheKey = `${activeTab.value}-${selectedMonthPayments.value || 'all'}-${statusFilter.value || 'all'}-${currentPage}-${paymentsPerPage}`;
    if (paymentsCache.value[cacheKey]) delete paymentsCache.value[cacheKey];

    await loadTabData(currentPage);

  } catch (error) {
    console.error('❌ Error rechazando pago:', error);
    showToast(error.response?._data?.message || 'Error al rechazar el pago', 'error');
  }
};

 
// ===== FUNCIONES DE TOAST =====
const showToast = (message, type = 'info') => {
  try {
    toast.show = true;
    toast.message = message;
    toast.type = type;
    setTimeout(() => {
      toast.show = false;
    }, 5000);
  } catch (error) {
    console.error('Error mostrando toast:', error);
  }
};

// ===== WATCHERS =====
watch(selectedChart, async (newVal) => { 
  try {
    await nextTick();
    createChart();
    
    if (newVal === 'earnings') {
      if (platformDateFrom.value || platformDateTo.value) {
        await updatePlatformStats();
      }
    }
  } catch (error) {
    console.error('Error en watcher de selectedChart:', error);
  }
});

// ===== LIFECYCLE HOOKS =====
// Watch for changes to initialStats
watch(initialStats, (newVal) => {
}, { immediate: true, deep: true });

onMounted(async () => {
  try {
    Chart.register(...registerables, DataLabelsPlugin);
    
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });

    await loadTabData();
    createChart();
    await updatePlatformStats();
    
    // Set initial stats after first load
    if (totalMonthlyStats.value?.membership) {
      const stats = totalMonthlyStats.value.membership;
      initialStats.value = {
        aprobados: stats.aprobados || 0,
        rechazados: stats.rechazados || 0,
        pendientes: stats.pendientes || 0,
        total: (stats.aprobados || 0) + (stats.rechazados || 0) + (stats.pendientes || 0),
        totalMoney: stats.total || 0
      };
    }    
    await loadTransactions();
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error en onMounted:', error);
    isLoading.value = false;
  }
});

</script>

<style>
[v-cloak] {
  display: none !important;
}

.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>