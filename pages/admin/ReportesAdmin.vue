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

    <!-- Modal con Detalles Dinámico -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetailsModal"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[85vw] max-w-2xl max-h-[85vh] overflow-y-auto relative z-10">
          <!-- Encabezado del Modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="getModalIconClass()">
                  <span class="text-lg">{{ getModalIcon() }}</span>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ getModalTitle() }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">ID: #{{ getModalId() }}</p>
                </div>
              </div>
              <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
    
          <!-- Contenido del Modal -->
          <div class="p-4 space-y-4">
            <!-- Información del Pago -->
            <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ getPaymentInfoTitle() }}
              </h4>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">N° Comprobante</p>
                  <p class="font-medium">{{ selectedItem?.num_comprobante || 'N/A' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Monto</p>
                  <p class="font-medium text-blue-600 dark:text-blue-400">{{ formatCurrency(getItemAmount()) }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Fecha</p>
                  <p class="font-medium">{{ formatDate(selectedItem?.fecha) }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Estado</p>
                  <span :class="getStatusBadgeClass(selectedItem?.estado)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ selectedItem?.estado || 'Pendiente' }}
                  </span>
                </div>
                
                <!-- Campos específicos para Servicios -->
                <template v-if="modalType === 'services'">
                  <div>
                    <p class="text-gray-500 dark:text-gray-400">Mano de Obra</p>
                    <p class="font-medium">{{ formatCurrency(selectedItem?.monto_manodeobra) }}</p>
                  </div>
                  <div>
                    <p class="text-gray-500 dark:text-gray-400">Materiales</p>
                    <p class="font-medium">{{ formatCurrency(selectedItem?.monto_materiales) }}</p>
                  </div>
                  <div v-if="selectedItem?.descuento_membresia">
                    <p class="text-gray-500 dark:text-gray-400">Descuento Membresía</p>
                    <p class="font-medium text-green-600">-{{ formatCurrency(selectedItem?.descuento_membresia) }}</p>
                  </div>
                  <div v-if="selectedItem?.credito_usado">
                    <p class="text-gray-500 dark:text-gray-400">Crédito Usado</p>
                    <p class="font-medium text-green-600">-{{ formatCurrency(selectedItem?.credito_usado) }}</p>
                  </div>
                </template>
                
                <!-- Campo específico para Retiros -->
                <template v-if="modalType === 'withdrawals'">
                  <div class="col-span-2">
                    <p class="text-gray-500 dark:text-gray-400">Descripción</p>
                    <p class="font-medium">{{ selectedItem?.descripcion || 'Retiro de fondos' }}</p>
                  </div>
                </template>
              </div>
            </div>
    
            <!-- Información del Usuario -->
            <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información del {{ getUserType() }}
              </h4>
              <div class="space-y-2 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Nombre</p>
                  <p class="font-medium">{{ getUserName() }}</p>
                </div>
                <div v-if="getUserPhone()">
                  <p class="text-gray-500 dark:text-gray-400">Teléfono</p>
                  <p class="font-medium">{{ getUserPhone() }}</p>
                </div>
                <div v-if="getUserEmail()">
                  <p class="text-gray-500 dark:text-gray-400">Email</p>
                  <p class="font-medium">{{ getUserEmail() }}</p>
                </div>
              </div>
            </div>

            <!-- Información del Servicio (solo para Servicios y Visitas) -->
            <div v-if="hasServiceInfo()" class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Información del Servicio
              </h4>
              <div class="space-y-2 text-sm">
                <div v-if="getServiceName()">
                  <p class="text-gray-500 dark:text-gray-400">Servicio</p>
                  <p class="font-medium">{{ getServiceName() }}</p>
                </div>
                <div v-if="getServiceDescription()">
                  <p class="text-gray-500 dark:text-gray-400">Descripción</p>
                  <p class="font-medium">{{ getServiceDescription() }}</p>
                </div>
                <div v-if="getServiceLocation()">
                  <p class="text-gray-500 dark:text-gray-400">Ubicación</p>
                  <p class="font-medium">{{ getServiceLocation() }}</p>
                </div>
                <div v-if="getTechnicianName()">
                  <p class="text-gray-500 dark:text-gray-400">Técnico</p>
                  <p class="font-medium">{{ getTechnicianName() }}</p>
                </div>
              </div>
            </div>

            <!-- Comentarios (solo para Servicios) -->
            <div v-if="modalType === 'services' && selectedItem?.comentario" class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Comentarios
              </h4>
              <div class="text-sm">
                <p class="text-gray-700 dark:text-gray-300">{{ selectedItem.comentario }}</p>
              </div>
            </div>
    
            <!-- Información Bancaria -->
            <div class="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
              <h4 class="font-medium text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Información Bancaria
              </h4>
              <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="col-span-2">
                  <p class="text-gray-500 dark:text-gray-400">Banco</p>
                  <p class="font-medium">{{ selectedItem?.cuenta?.banco || 'No especificado' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Tipo de Cuenta</p>
                  <p class="font-medium">{{ selectedItem?.cuenta?.tipo || 'No especificado' }}</p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">N° de Cuenta</p>
                  <p class="font-medium">{{ selectedItem?.cuenta?.num_cuenta || 'No disponible' }}</p>
                </div>
                <div class="col-span-2">
                  <p class="text-gray-500 dark:text-gray-400">Beneficiario</p>
                  <p class="font-medium">{{ selectedItem?.cuenta?.beneficiario || 'No especificado' }}</p>
                </div>
              </div>
            </div>
          </div>
    
          <!-- Pie del Modal -->
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex justify-end gap-3">
            <button 
              @click="closeDetailsModal" 
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cerrar
            </button>
            <!-- Botón Ver Servicio - Solo mostrar cuando hay información del servicio -->
            <button 
              v-if="shouldShowServiceButton()"
              @click.stop="openServiceDetail(getServiceDetails())"
              class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-800/40 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Servicio
            </button>
            <button 
              v-if="selectedItem?.estado === 'Pendiente' || selectedItem?.estado === 'pendiente'"
              @click="approveItem" 
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Aprobar Pago
            </button>
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
      <div v-if="showServiceDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
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
                  <h3 class="text-sm sm:text-lg font-black text-gray-900 dark:text-white">{{ selectedService?.servicio?.nombre }}</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService?.id_solicitud }}</p>
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
                <p class="font-bold text-blue-800 dark:text-blue-200 text-sm">{{ selectedService?.cliente?.nombre }}</p>
              </div>
            </div>

            <!-- Location -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Ubicación</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService?.colonia }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-xs">{{ selectedService?.direccion_precisa }}, {{ selectedService?.ciudad?.nombre }}</p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Descripción del Problema</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService?.descripcion }}</p>
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
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ formatCurrency(selectedService.cotizacion.total) }}</p>
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
                <p v-if="selectedService.calificacion.comentario" class="text-yellow-700 dark:text-yellow-300 text-sm">{{ selectedService.calificacion.comentario }}</p>
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
                  L. {{ formatCurrency(platformStats.totalRevenue) }}
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
                  L. {{ formatCurrency(platformStats.membershipRevenue) }}
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
                  L. {{ formatCurrency(platformStats.visitRevenue) }}
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
                  L. {{ formatCurrency(platformStats.serviceRevenue) }}
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
                  L. {{ formatCurrency(platformStats.totalWithdrawals) }}
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
                  L. {{ formatCurrency(platformStats.totalCommissions) }}
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
            <div v-for="transaction in visibleTransactions" :key="transaction.id_movimiento"
                 class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 sm:space-x-3"> 
                  <div :class="getTransactionIconClass(transaction.tipo)" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                    <span class="text-[8px] text-white text-xs sm:text-sm">{{ getTransactionIcon(transaction.tipo) }}</span>
                  </div>
                  <div>
                    <p class="text-[6px]font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ getTransactionTitle(transaction) }}</p>
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
                    {{ transaction.tipo === 'ingreso' ? '+' : (transaction.tipo === 'ingreso_referido' ? '' : '-') }}L. {{ formatCurrency(transaction.monto) }}
                  </p>
                  <p class="text-[10px]" :class="getStatusColor(transaction.estado, transaction.tipo)">
                    {{ transaction.estado }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Paginación - Siempre visible cuando hay transacciones -->
            <div v-if="transactions.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Mostrando {{ transactions.length }} de {{ transactionsPagination.total }} transacciones
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
                    :disabled="currentTransactionPage >= transactionsPagination.totalPages || isLoadingTransactions"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'opacity-50 cursor-not-allowed': currentTransactionPage >= transactionsPagination.totalPages }"
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
                    <p class="text-sm font-bold text-green-600 dark:text-green-400">+L. {{ formatCurrency(transactionsSummary.totalIngresos) }}</p>
                  </div>
                </div>

                <!-- Separador -->
                <div class="h-8 w-px bg-gray-200 dark:bg-gray-600"></div>

                <!-- Retiros -->
                <div class="flex items-center space-x-2">
                  <span class="text-red-500">💳</span>
                  <div>
                    <p class="text-xs text-gray-600 dark:text-gray-300">Retiros</p>
                    <p class="text-sm font-bold text-red-600 dark:text-red-400">-L. {{ formatCurrency(transactionsSummary.totalRetiros) }}</p>
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
      
            <!-- Resumen mensual integrado -->
            <div class="p-2">
              <div class="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div class="text-sm font-bold text-green-600 dark:text-green-400">{{ getMonthlyStats().approved }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Aprobados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ getMonthlyStats().rejected }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Rechazados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ monthlyStats[activeTab]?.pendientes || 0 }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Pendientes</div>
                </div>
                <div>
                  <div class="text-[12px] font-bold text-blue-600 dark:text-blue-400">L. {{ formatCurrency(getMonthlyStats().total) }}</div>
                  <div class="text-[8px] text-gray-600 dark:text-gray-400">Total {{ getSelectedMonthName() }}</div>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Filtros por estado con 4 opciones -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <div class="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
              <button 
                v-for="filter in [
                  { id: 'all', label: '📋Todos', 
                    count: (monthlyStats[activeTab]?.aprobados || 0) + (monthlyStats[activeTab]?.rechazados || 0) + (monthlyStats[activeTab]?.pendientes || 0), 
                    color: 'blue' },
                  { id: 'pending', label: '⏳Pendientes', 
                    count: monthlyStats[activeTab]?.pendientes || 0, 
                    color: 'yellow' },
                  { id: 'approved', label: '✅Aprobados', 
                    count: monthlyStats[activeTab]?.aprobados || 0, 
                    color: 'green' },
                  { id: 'rejected', label: '❌Rechazados', 
                    count: monthlyStats[activeTab]?.rechazados || 0, 
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
      
            <div v-else-if="getCurrentTabData().length === 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center border border-dashed border-gray-200 dark:border-gray-600">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Sin {{ getEmptyMessage() }}</h3>
              <p class="text-[11px] text-gray-600 dark:text-gray-400">No hay {{ getEmptyMessage() }} {{ getStatusFilterText() }}</p>
            </div>
      
            <template v-else>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="item in getCurrentTabData()" :key="item.id"
                     :class="getItemCardClass(item.status)"
                     class="rounded-lg p-2 shadow-sm border text-[11px]">
                  <div class="mb-2">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-1.5">
                        <div :class="getItemIconClass(item.status)" class="w-5 h-5 rounded flex items-center justify-center">
                          <span :class="getItemIconTextClass(item.status)" class="text-[10px]">{{ getItemIcon() }}</span>
                        </div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-[10px] truncate">{{ getItemTitle(item) }}</h3>
                      </div>
                      <p :class="getItemAmountClass(item.status)" class="font-bold text-[10px] whitespace-nowrap">L. {{ formatCurrency(item.amount) }}</p>
                    </div> 
                  </div>
                  <button @click="showItemDetails(item)" 
                          class="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] px-2 py-1 rounded font-medium transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Sección de Reportería -->
      <section class="px-2 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-2 sm:mb-3">
          <h2 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Reportes</h2>
        </div>

        <!-- Selector de fechas para reportes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow border border-gray-100 dark:border-gray-700">
          <h3 class="text-xs font-semibold text-gray-900 dark:text-white mb-2">Período del Reporte</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Desde</label>
              <input 
                type="date"
                v-model="reportDateFrom"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Hasta</label>
              <input 
                type="date"
                v-model="reportDateTo"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-2">
          <div v-for="report in availableReports" :key="report.id"
               class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow border border-gray-100 dark:border-gray-700">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-start gap-2 min-w-0">
                <div :class="report.iconClass" class="w-8 h-8 sm:w-9 sm:h-9 rounded flex-shrink-0 flex items-center justify-center">
                  <span class="text-base">{{ report.icon }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm leading-tight">{{ report.title }}</h3>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-1">{{ report.description }}</p>
                </div>
              </div>
              <button @click="generateReport(report)" :disabled="report.generating"
                      class="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-[11px] px-2 py-1.5 rounded font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                <span v-if="report.generating" class="animate-spin text-[10px]">⏳</span>
                <span v-else class="text-[9px]">PDF ⬇️</span>
              </button>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-center text-[10px] sm:text-xs mt-2">
              <div v-for="metric in report.metrics" :key="metric.label" class="bg-gray-50 dark:bg-gray-700/50 p-1 rounded">
                <p class="font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-[9px] sm:text-[10px]">{{ metric.label }}</p>
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
import { defineComponent, ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import { useHead, useCookie } from '#imports';
import { useAuthStore } from '~/middleware/auth.store'; 
import { jsPDF } from 'jspdf';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import Toast from '~/components/ui/Toast.vue'; 
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import autoTable from 'jspdf-autotable';

const router = useRouter();
const route = useRoute();

// ===== VARIABLES DE CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Reportes',
  meta: [
    { name: 'description', content: 'Reportes del sistema HogarSeguro - Administrar solicitudes, asignaciones y seguimiento' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const currentUser = ref({ nombre: 'Admin Principal' })
const isLoading = ref(false)
const isLoadingData = ref(false)
const isLoadingTransactions = ref(false)
const selectedChart = ref('earnings')
const activeTab = ref('membership')
const selectedPeriod = ref('1')
const selectedMonthTransactions = ref('') // Para la sección de transacciones
const selectedMonthPayments = ref('') // Para la sección de pagos y retiros
const statusFilter = ref('all') // 'all', 'pending', 'approved', 'rejected'
const showDetailsModal = ref(false)
const selectedItem = ref(null)
const modalType = ref('') // 'membership', 'visits', 'services', 'withdrawals'

// Data arrays and cache
const membershipPayments = ref([])
const visitPayments = ref([])
const servicePayments = ref([])
const withdrawals = ref([])

// Cache for payments and withdrawals data
const paymentsCache = ref({})
const monthlyStats = ref({
  membership: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  visits: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  services: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 },
  withdrawals: { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 }
})

// Variables para fechas de filtros (todas inician vacías)
const platformDateFrom = ref('')
const platformDateTo = ref('')

// Variables para reportería (todas inician vacías)
const reportDateFrom = ref('')
const reportDateTo = ref('')

// Variables de paginación para transacciones
const currentTransactionPage = ref(1)
const offset = ref(0) // Ahora es una referencia reactiva

// Caché para transacciones
const transactionsCache = ref({})

// ===== DATOS REACTIVOS =====
const executiveSummary = reactive({
  totalTechnicians: 156,
  monthlyServices: 1247,
  averageSatisfaction: 94.2,
  responseTime: 2.3,
  monthlyRevenue: 480760,
  totalRevenue: 3247890,
  monthlyCommissions: 89760,
  totalCommissions: 623450,
  monthlyWithdrawals: 145320,
  totalWithdrawals: 876540,
  monthlyReferrals: 25640,
  totalReferrals: 156780
})

const platformStats = reactive({
  totalRevenue: 480760,
  membershipRevenue: 125430,
  visitRevenue: 234560,
  serviceRevenue: 120770,
  totalWithdrawals: 145320,
  totalCommissions: 89760
})

const transactions = ref([])
const transactionsSummary = ref({
  totalIngresos: '0.00',
  totalRetiros: '0.00'
})
const transactionsPagination = ref({
  total: 0,
  page: 1,
  limit: 5,
  totalPages: 0
}) 
const visibleTransactionsCount = ref(5)
const hasMoreTransactions = ref(true)

// Variables de notificaciones
const toast = reactive({
  show: false,
  message: '',
  type: 'info',
  duration: 3000
});

// Service detail modal
const showServiceDetailModal = ref(false);
const selectedService = ref(null);

// Open service detail modal
const openServiceDetail = (service) => {
  selectedService.value = service;
  showServiceDetailModal.value = true;
};

// Close service detail modal
const closeServiceDetailModal = () => {
  showServiceDetailModal.value = false;
  setTimeout(() => {
    selectedService.value = null;
  }, 300);
};

// Get service type color
const getServiceTypeColor = (serviceType) => {
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
};

// Get service type icon
const getServiceTypeIcon = (serviceType) => {
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
};

// ===== FUNCIONES PARA CARGAR DATOS REALES =====
const loadMembershipPayments = async () => {
  try {
    const cacheKey = `membership-${selectedMonthPayments.value || 'all'}`
    
    // Verificar si los datos están en caché
    if (paymentsCache.value[cacheKey]) {
      const { data, stats } = paymentsCache.value[cacheKey]
      membershipPayments.value = data
      if (stats) {
        monthlyStats.value.membership = stats
      }
      return
    }
    
    let url = '/membresia'
    
    // Agregar filtro de fecha si está seleccionado
    if (selectedMonthPayments.value) {
      const params = new URLSearchParams()
      params.append('month', selectedMonthPayments.value)
      url += `?${params.toString()}`
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response.success) {
      if (response.data) {
        // Transformar datos para compatibilidad con el frontend
        const transformedData = response.data.map(item => ({
          ...item,
          id: item.id_membresia,
          status: mapApiStatusToFrontend(item.estado),
          amount: item.monto,
          date: item.fecha,
          plan: 'Membresía Premium',
          user: item.usuario?.nombre || 'Usuario desconocido'
        }))
        
        // Actualizar datos y caché
        membershipPayments.value = transformedData
        
        // Almacenar en caché
        paymentsCache.value[cacheKey] = {
          data: transformedData,
          stats: response.estadisticas ? {
            aprobados: response.estadisticas.aprobados || 0,
            rechazados: response.estadisticas.rechazados || 0,
            pendientes: response.estadisticas.pendientes || 0,
            total: response.estadisticas.total || 0
          } : null
        }
        
        // Actualizar estadísticas
        if (response.estadisticas) {
          monthlyStats.value.membership = {
            aprobados: response.estadisticas.aprobados || 0,
            rechazados: response.estadisticas.rechazados || 0,
            pendientes: response.estadisticas.pendientes || 0,
            total: response.estadisticas.total || 0
          }
        }
      } else {
        membershipPayments.value = []
        paymentsCache.value[cacheKey] = { data: [], stats: null }
      }
    } else {
      membershipPayments.value = []
    }
  } catch (error) {
    console.error('Error al cargar pagos de membresía:', error)
    showToast('Error al cargar los pagos de membresía', 'error')
    membershipPayments.value = []
  }
}

const loadVisitPayments = async () => {
  try {
    const cacheKey = `visits-${selectedMonthPayments.value || 'all'}`
    
    // Verificar si los datos están en caché
    if (paymentsCache.value[cacheKey]) {
      const { data, stats } = paymentsCache.value[cacheKey]
      visitPayments.value = data
      if (stats) {
        monthlyStats.value.visits = stats
      }
      return
    }
    
    let url = '/pagovisita'
    
    // Agregar filtro de fecha si está seleccionado
    if (selectedMonthPayments.value) {
      const params = new URLSearchParams()
      params.append('month', selectedMonthPayments.value)
      url += `?${params.toString()}`
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response.success) {
      if (response.data) {
        // Transformar datos para compatibilidad con el frontend
        const transformedData = response.data.map(item => ({
          ...item,
          id: item.id_pagovisita,
          status: mapApiStatusToFrontend(item.estado),
          amount: item.monto,
          date: item.fecha,
          service: item.solicitud?.servicio?.nombre || 'Servicio de visita',
          client: item.usuario?.nombre || 'Cliente desconocido',
          technician: item.solicitud?.tecnico?.nombre || 'Sin asignar'
        }))
        
        // Actualizar datos y caché
        visitPayments.value = transformedData
        
        // Almacenar en caché
        paymentsCache.value[cacheKey] = {
          data: transformedData,
          stats: response.estadisticas ? {
            aprobados: response.estadisticas.aprobados || 0,
            rechazados: response.estadisticas.rechazados || 0,
            pendientes: response.estadisticas.pendientes || 0,
            total: response.estadisticas.total || 0
          } : null
        }
        
        // Actualizar estadísticas
        if (response.estadisticas) {
          monthlyStats.value.visits = {
            aprobados: response.estadisticas.aprobados || 0,
            rechazados: response.estadisticas.rechazados || 0,
            pendientes: response.estadisticas.pendientes || 0,
            total: response.estadisticas.total || 0
          }
        }
      } else {
        visitPayments.value = []
        paymentsCache.value[cacheKey] = { data: [], stats: null }
      }
    } else {
      visitPayments.value = []
    }
  } catch (error) {
    console.error('Error al cargar pagos de visitas:', error)
    showToast('Error al cargar los pagos de visitas', 'error')
    visitPayments.value = []
  }
}

const loadServicePayments = async () => {
  try {
    const cacheKey = `services-${selectedMonthPayments.value || 'all'}`
    
    // Verificar si los datos están en caché
    if (paymentsCache.value[cacheKey]) {
      const { data, stats } = paymentsCache.value[cacheKey]
      servicePayments.value = data
      if (stats) {
        monthlyStats.value.services = stats
      }
      return
    }
    
    let url = '/cotizacion'
    
    // Agregar filtro de fecha si está seleccionado
    if (selectedMonthPayments.value) {
      const params = new URLSearchParams()
      params.append('month', selectedMonthPayments.value)
      url += `?${params.toString()}`
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response.success) {
      if (response.data) {
        // Transformar datos para compatibilidad con el frontend
        const transformedData = response.data.map(item => ({
          ...item,
          id: item.id_cotizacion,
          status: mapApiStatusToFrontend(item.estado),
          amount: item.monto_total,
          date: item.fecha,
          service: item.solicitud?.servicio?.nombre || 'Servicio',
          client: item.solicitud?.cliente?.nombre || 'Cliente desconocido',
          technician: item.solicitud?.tecnico?.nombre || 'Sin asignar',
          category: item.solicitud?.servicio?.categoria || 'general'
        }))
        
        // Actualizar datos y caché
        servicePayments.value = transformedData
        
        // Almacenar en caché
        paymentsCache.value[cacheKey] = {
          data: transformedData,
          stats: response.estadisticas ? {
            aprobados: response.estadisticas.aprobados || 0,
            rechazados: response.estadisticas.rechazados || 0,
            pendientes: response.estadisticas.pendientes || 0,
            total: response.estadisticas.total || 0
          } : null
        }
        
        // Actualizar estadísticas
        if (response.estadisticas) {
          monthlyStats.value.services = {
            aprobados: response.estadisticas.aprobados || 0,
            rechazados: response.estadisticas.rechazados || 0,
            pendientes: response.estadisticas.pendientes || 0,
            total: response.estadisticas.total || 0
          }
        }
      } else {
        servicePayments.value = []
        paymentsCache.value[cacheKey] = { data: [], stats: null }
      }
    } else {
      servicePayments.value = []
    }
  } catch (error) {
    console.error('Error al cargar pagos de servicios:', error)
    showToast('Error al cargar los pagos de servicios', 'error')
    servicePayments.value = []
  }
}

const loadWithdrawals = async () => {
  try {
    const cacheKey = `withdrawals-${selectedMonthPayments.value || 'all'}`
    
    // Verificar si los datos están en caché
    if (paymentsCache.value[cacheKey]) {
      const { data, stats } = paymentsCache.value[cacheKey]
      withdrawals.value = data
      if (stats) {
        monthlyStats.value.withdrawals = stats
      }
      return
    }
    
    let url = '/movimientos/retiros'
    
    // Agregar filtro de fecha si está seleccionado
    if (selectedMonthPayments.value) {
      const params = new URLSearchParams()
      params.append('month', selectedMonthPayments.value)
      url += `?${params.toString()}`
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response.movimientos) {
      // Transformar datos para compatibilidad con el frontend
      const transformedData = response.movimientos.map(item => ({
        ...item,
        id: item.id_movimiento,
        status: mapApiStatusToFrontend(item.estado),
        amount: item.monto,
        date: item.fecha,
        technician: item.nombre_usuario || 'Técnico desconocido',
        bankDetails: item.descripcion || 'Retiro de fondos'
      }));
      
      // Actualizar datos y caché
      withdrawals.value = transformedData;
      
      // Almacenar en caché
      paymentsCache.value[cacheKey] = {
        data: transformedData,
        stats: response.estadisticas ? {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        } : null
      };
      
      // Actualizar estadísticas
      if (response.estadisticas) {
        monthlyStats.value.withdrawals = {
          aprobados: response.estadisticas.aprobados || 0,
          rechazados: response.estadisticas.rechazados || 0,
          pendientes: response.estadisticas.pendientes || 0,
          total: response.estadisticas.total || 0
        };
      }
    } else {
      withdrawals.value = [];
      paymentsCache.value[cacheKey] = { data: [], stats: null };
    }
  } catch (error) {
    console.error('Error al cargar retiros:', error)
    showToast('Error al cargar los retiros', 'error')
    withdrawals.value = []
  }
}

// Función para mapear estados de la API al frontend
const mapApiStatusToFrontend = (apiStatus) => {
  const statusMap = {
    'pendiente': 'Pendiente',
    'aprobado': 'Aprobado', 
    'rechazado': 'Rechazado',
    'confirmado': 'Aprobado',
    'activa': 'Aprobado',
    'expirada': 'Rechazado',
    'cancelado': 'Rechazado',
    'Pendiente': 'Pendiente',
    'Completado': 'Aprobado'
  }
  
  return statusMap[apiStatus] || 'Pendiente'
}

const loadTabData = async () => {
  isLoadingData.value = true
  
  try {
    switch (activeTab.value) {
      case 'membership':
        await loadMembershipPayments()
        break
      case 'visits':
        await loadVisitPayments()
        break
      case 'services':
        await loadServicePayments()
        break
      case 'withdrawals':
        await loadWithdrawals()
        break
    }
  } catch (error) {
    console.error('Error al cargar datos de la pestaña:', error)
    showToast('Error al cargar los datos', 'error')
  }
  
  isLoadingData.value = false
}

// ===== NUEVAS FUNCIONES PARA MODAL DINÁMICO =====

// Función para determinar el tipo de modal basado en los datos
const determineModalType = (item) => {
  if (item?.id_membresia) return 'membership'
  if (item?.id_pagovisita) return 'visits'
  if (item?.id_cotizacion) return 'services'
  if (item?.id_movimiento && item?.tipo === 'retiro') return 'withdrawals'
  return modalType.value || 'membership' // fallback
}

// Funciones para el encabezado del modal
const getModalIconClass = () => {
  const type = determineModalType(selectedItem.value)
  switch (type) {
    case 'membership': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    case 'visits': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'services': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    case 'withdrawals': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    default: return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
  }
}

const getModalIcon = () => {
  const type = determineModalType(selectedItem.value)
  switch (type) {
    case 'membership': return '💳'
    case 'visits': return '🏠'
    case 'services': return '🛠️'
    case 'withdrawals': return '💸'
    default: return '📄'
  }
}

const getModalTitle = () => {
  const type = determineModalType(selectedItem.value)
  switch (type) {
    case 'membership': return 'Detalles del Pago de Membresía'
    case 'visits': return 'Detalles del Pago de Visita'
    case 'services': return 'Detalles del Pago de Servicio'
    case 'withdrawals': return 'Detalles del Retiro'
    default: return 'Detalles del Item'
  }
}

const getModalId = () => {
  if (!selectedItem.value) return 'N/A'
  const item = selectedItem.value
  return item.id_membresia || item.id_pagovisita || item.id_cotizacion || item.id_movimiento || 'N/A'
}

const getPaymentInfoTitle = () => {
  const type = determineModalType(selectedItem.value)
  switch (type) {
    case 'membership': return 'Información del Pago de Membresía'
    case 'visits': return 'Información del Pago de Visita'
    case 'services': return 'Información del Pago de Servicio'
    case 'withdrawals': return 'Información del Retiro'
    default: return 'Información del Pago'
  }
}

const getItemAmount = () => {
  if (!selectedItem.value) return 0
  return selectedItem.value.monto || selectedItem.value.monto_total || selectedItem.value.amount || 0
}

// Funciones para información del usuario
const getUserType = () => {
  const type = determineModalType(selectedItem.value)
  return type === 'withdrawals' ? 'Técnico' : 'Usuario'
}

const getUserName = () => {
  if (!selectedItem.value) return 'No disponible'
  const item = selectedItem.value
  
  // Para retiros, usar nombre_usuario directamente
  if (item.nombre_usuario) return item.nombre_usuario
  
  // Para otros casos, usar estructura anidada usuario
  return item.usuario?.nombre || item.user?.nombre || item.cliente?.nombre || 'No disponible'
}

const getUserPhone = () => {
  if (!selectedItem.value) return ''
  const item = selectedItem.value
  return item.usuario?.telefono || item.user?.telefono || item.cliente?.telefono || ''
}

const getUserEmail = () => {
  if (!selectedItem.value) return ''
  const item = selectedItem.value
  return item.usuario?.email || item.user?.email || item.cliente?.email || ''
}

// Funciones para información del servicio
const hasServiceInfo = () => {
  const type = determineModalType(selectedItem.value)
  return (type === 'services' || type === 'visits') && selectedItem.value?.solicitud
}

const getServiceName = () => {
  if (!selectedItem.value?.solicitud) return ''
  return selectedItem.value.solicitud.servicio?.nombre || ''
}

const getServiceDescription = () => {
  if (!selectedItem.value?.solicitud) return ''
  return selectedItem.value.solicitud.descripcion || ''
}

const getServiceLocation = () => {
  if (!selectedItem.value?.solicitud) return ''
  const solicitud = selectedItem.value.solicitud
  const parts = []
  if (solicitud.colonia) parts.push(solicitud.colonia)
  if (solicitud.direccion_precisa) parts.push(solicitud.direccion_precisa)
  if (solicitud.ciudad?.nombre) parts.push(solicitud.ciudad.nombre)
  return parts.join(', ')
}

const getTechnicianName = () => {
  if (!selectedItem.value?.solicitud?.tecnico) return ''
  return selectedItem.value.solicitud.tecnico.nombre || ''
}

// Función para determinar si mostrar el botón "Ver Servicio"
const shouldShowServiceButton = () => {
  return hasServiceInfo() && selectedItem.value?.solicitud
}

// Función para obtener los detalles del servicio para el modal secundario
const getServiceDetails = () => {
  if (!selectedItem.value?.solicitud) return null
  return {
    ...selectedItem.value.solicitud,
    servicio: selectedItem.value.solicitud.servicio,
    cliente: selectedItem.value.solicitud.cliente,
    ciudad: selectedItem.value.solicitud.ciudad,
    id_solicitud: selectedItem.value.solicitud.id_solicitud
  }
}

// ===== REPORTES DISPONIBLES =====
const availableReports = ref([
  {
    id: 1,
    title: 'Reporte Financiero Mensual',
    description: 'Resumen completo de ingresos y gastos',
    icon: '💰',
    iconClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    generating: false,
    metrics: [
      { label: 'Ingresos', value: 'L. 480,760' },
      { label: 'Comisiones', value: 'L. 89,760' },
      { label: 'Crecimiento', value: '+18.5%' }
    ]
  },
  {
    id: 2,
    title: 'Reporte de Usuarios y Técnicos',
    description: 'Estadísticas de registros y actividad',
    icon: '👥',
    iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    generating: false,
    metrics: [
      { label: 'Nuevos', value: '247' },
      { label: 'Técnicos', value: '156' },
      { label: 'Activos', value: '89.2%' }
    ]
  },
  {
    id: 3,
    title: 'Reporte de Servicios Detallado',
    description: 'Análisis completo por categorías y regiones',
    icon: '🛠️',
    iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    generating: false,
    metrics: [
      { label: 'Completados', value: '1,247' },
      { label: 'Pendientes', value: '89' },
      { label: 'Satisfacción', value: '94.2%' }
    ]
  },
  {
    id: 4,
    title: 'Reporte de Transacciones',
    description: 'Detalle de todos los movimientos financieros',
    icon: '📊',
    iconClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    generating: false,
    metrics: [
      { label: 'Transacciones', value: '2,847' },
      { label: 'Retiros', value: '342' },
      { label: 'Volumen', value: 'L. 1.2M' }
    ]
  }
])

// ===== CONSTANTES =====
const availableCharts = [
  { id: 'earnings', name: '📈 Ingresos Mensuales' },
  { id: 'serviceTypes', name: '🛠️ Servicios por Tipo' },
  { id: 'services', name: '📊 Servicios por Mes' },
  { id: 'users', name: '👥 Crecimiento de Usuarios' },
  { id: 'cities', name: '🏙️ Servicios por Ciudad' }
]

// Función para generar etiquetas de meses dinámicas
const generateMonthLabels = () => {
  const labels = []
  const currentDate = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    labels.push(date.toLocaleDateString('es-ES', { month: 'short' }))
  }
  
  return labels
}

// Datos para gráficos
const earningsData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Ingresos Mensuales', 
    borderColor: '#10B981',
    backgroundColor: 'rgba(22, 248, 173, 0.26)',
    tension: 0.4,
    fill: true
  }]
})

const serviceTypesData = reactive({
  labels: ['Electricidad', 'Plomería', 'Climatización', 'Carpintería', 'Pintura', 'Limpieza'],
  datasets: [{
    data: [387, 245, 198, 156, 98, 67],
    backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
    borderWidth: 0
  }]
})

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
})

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
})

const citiesData = reactive({
  labels: ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Choluteca', 'Comayagua'],
  datasets: [{
    data: [387, 245, 156, 98, 67],
    backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4'],
    borderWidth: 0
  }]
})

// ===== COMPUTED PROPERTIES =====
const transactionsPerPage = 5; // Definir el número de transacciones por página

const visibleTransactions = computed(() => {
  // No necesitamos hacer slice aquí ya que el backend ya maneja la paginación
  return transactions.value;
})

const totalTransactionPages = computed(() => {
  return transactionsPagination.value.totalPages || 1;
})

const getChartTitle = () => {
  const chartTitles = {
    earnings: 'Ingresos Mensuales',
    serviceTypes: 'Distribución de Servicios por Tipo', 
    services: 'Servicios Realizados por Mes',
    users: 'Crecimiento de Usuarios',
    cities: 'Servicios por Ciudad'
  }
  return chartTitles[selectedChart.value] || 'Gráfico'
}

// ===== FUNCIONES DE UTILIDAD =====
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0'
  return parseFloat(value).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0'
  return parseInt(value).toLocaleString()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getStatusColor = (status, tipo) => {
  const statusLower = (status || '').toLowerCase();
  
  // Si es un ingreso por referido, siempre mostrar en azul
  if (tipo === 'ingreso_referido') {
    return 'text-blue-400';
  }
  
  // Si es un retiro completado, mostrar en rojo
  if (tipo === 'retiro' && statusLower === 'completado') {
    return 'text-red-400';
  }
  
  // Para otros tipos, usar la lógica normal
  switch (statusLower) {
    case 'completado': 
    case 'confirmado':
    case 'aprobado': return 'text-green-500';
    case 'pendiente': return 'text-yellow-500';
    case 'rechazado': return 'text-red-500';
    case 'cancelado': return 'text-red-400';
    case 'en proceso': return 'text-blue-500';
    case 'activa': return 'text-green-500';
    case 'expirada': return 'text-gray-500';
    default: return 'text-gray-500';
  }
}

const getStatusBadgeClass = (status) => {
  const statusLower = (status || '').toLowerCase()
  switch (statusLower) {
    case 'aprobado':
    case 'confirmado':
    case 'activa': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'rechazado':
    case 'cancelado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'expirada': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    case 'pendiente': 
    default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
}

const getTransactionIcon = (type) => {
  switch (type) {
    case 'ingreso': 
    case 'ingreso_referido': return '💰'
    case 'retiro': return '💳'
    case 'commission': return '💰'
    case 'withdrawal': return '💳'
    case 'refund': return '↩️'
    default: return '💸'
  }
}

const getTransactionIconClass = (type) => {
  switch (type) {
    case 'ingreso':
    case 'ingreso_referido': return 'bg-green-500'
    case 'retiro': return 'bg-red-500'
    case 'commission': return 'bg-green-500'
    case 'withdrawal': return 'bg-red-500'
    case 'refund': return 'bg-yellow-500'
    default: return 'bg-blue-500'
  }
}

const getTransactionAmountClass = (type, estado) => {
  const estadoLower = estado?.toLowerCase() || '';
  
  // Mostrar en amarillo para transacciones pendientes (tanto ingresos como retiros)
  if (estadoLower === 'pendiente') {
    return 'text-yellow-600 dark:text-yellow-400';
  }
  
  // Para otros casos, mantener la lógica de colores por tipo
  if (type === 'ingreso' || type === 'commission') {
    return 'text-green-600 dark:text-green-400';
  } else if (type === 'ingreso_referido') {
    return 'text-blue-600 dark:text-blue-400'; // Color azul para ingresos por referido
  } else {
    return 'text-red-600 dark:text-red-400'; // Color rojo para retiros
  }
}

// Nuevas funciones para mostrar información condicional en transacciones
const getTransactionTitle = (transaction) => {
  switch (transaction.tipo) {
    case 'ingreso':
      return transaction.servicio || transaction.descripcion || 'Ingreso por servicio'
    case 'ingreso_referido':
      return transaction.descripcion || 'Ingreso por referido'
    default:
      return transaction.descripcion || 'Transacción'
  }
}

const getTransactionSubtitle = (transaction) => {
  const parts = [];
  
  // Agregar información específica según el tipo de transacción
  switch (transaction.tipo) {
    case 'ingreso':
      if (transaction.colonia) parts.push(transaction.colonia);
      break;
    case 'ingreso_referido':
      return transaction.id_usuario || transaction.nombre_usuario || 'Usuario referido';
  }
  
  // Si no hay información específica, usar nombre de usuario o 'Usuario'
  if (parts.length === 0 && transaction.nombre_usuario && transaction.nombre_usuario !== 'Usuario') {
    parts.push(transaction.nombre_usuario);
  }
  
  return parts.join(' • ');
}

// Funciones para el footer de transacciones
const getBalanceClass = () => {
  const balance = parseFloat(transactionsSummary.value.totalIngresos) - parseFloat(transactionsSummary.value.totalRetiros)
  return balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
}

const getNetBalance = () => {
  // Asegurarse de que los valores sean números
  const ingresos = parseFloat(transactionsSummary.value.totalIngresos) || 0;
  const retiros = parseFloat(transactionsSummary.value.totalRetiros) || 0;
  const balance = Number((ingresos - retiros).toFixed(2));
  const prefix = balance >= 0 ? '+' : '-';
  return `${prefix}L. ${formatCurrency(Math.abs(balance))}`;
}

// Funciones de paginación
const nextPage = () => {
  const nextPage = currentTransactionPage.value + 1; 
  
  if (nextPage <= transactionsPagination.value.totalPages) {
    loadTransactions(nextPage);
  } 
};

const previousPage = () => {
  const prevPage = currentTransactionPage.value - 1;
  
  if (prevPage >= 1) {
    loadTransactions(prevPage);
  } 
};

// ===== FUNCIONES DE GRÁFICOS =====
let chart = null;

// Funciones para cargar datos de diferentes endpoints
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
    
    if (response.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      // Actualizar los datos del gráfico
      window.currentChart.data.labels = labels;
      window.currentChart.data.datasets[0].data = valores;
      
      // Colores para los segmentos del gráfico
      const colors = [
        '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B',
        '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#8B5CF6'
      ];
      
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
    
    if (response.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      // Actualizar los datos del gráfico
      window.currentChart.data.labels = labels;
      window.currentChart.data.datasets[0].data = valores;
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
    
    if (response.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      // Actualizar los datos del gráfico
      window.currentChart.data.labels = labels;
      window.currentChart.data.datasets[0].data = valores;
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
    
    if (response.success && response.data && window.currentChart) {
      const { labels, data: valores } = response.data;
      
      // Actualizar los datos del gráfico
      window.currentChart.data.labels = labels;
      window.currentChart.data.datasets[0].data = valores;
      
      // Colores para ciudades
      const colors = ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4'];
      window.currentChart.data.datasets[0].backgroundColor = colors;
      window.currentChart.update();
    }
  } catch (error) {
    console.error('Error al cargar datos de servicios por ciudad:', error);
    showToast('Error al cargar los datos del gráfico de servicios por ciudad', 'error');
  }
};

const createChart = async () => {
  if (!selectedChart.value) {
    console.error('No se ha seleccionado ningún gráfico');
    return;
  } 
  
  // Destruir el gráfico anterior si existe
  if (window.currentChart) {
    window.currentChart.destroy();
  }
  
  // Obtener el canvas
  const canvas = document.getElementById(`chart-${selectedChart.value}`);
  if (!canvas) {
    console.error('No se encontró el elemento canvas para el gráfico:', `chart-${selectedChart.value}`);
    return;
  }

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
                font: {
                  size: 11,
                  family: 'sans-serif',
                  weight: 500
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 6,
                boxHeight: 6
              }
            },
            tooltip: {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              titleColor: isDark ? '#F9FAFB' : '#111827',
              bodyColor: isDark ? '#D1D5DB' : '#4B5563',
              borderColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.8)',
              borderWidth: 1,
              padding: 10,
              titleFont: {
                size: 12,
                weight: 'bold'
              },
              bodyFont: {
                size: 12
              },
              callbacks: {
                label: function(context) {
                  return 'L. ' + context.raw.toLocaleString('es-HN');
                }
              }
            },
            datalabels: {
              display: false // Desactivar etiquetas dentro de las barras
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                },
                callback: function(value) {
                  return 'L. ' + (value/1000) + 'K';
                }
              },
              grid: {
                color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderDash: [4, 4]
              }
            },
            x: {
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                }
              },
              grid: {
                display: false
              }
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
            backgroundColor: [
              '#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B',
              '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#8B5CF6'
            ],
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
                font: {
                  size: 10,
                  family: 'sans-serif',
                  weight: 500
                },
                padding: 12,
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 6,
                boxHeight: 6
              }
            },
            tooltip: {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              titleColor: isDark ? '#F9FAFB' : '#111827',
              bodyColor: isDark ? '#D1D5DB' : '#4B5563',
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
            datalabels: {
              display: true,
              color: '#FFFFFF',
              font: {
                weight: 'bold',
                size: 11,
                family: 'sans-serif'
              },
              formatter: (value, context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return percentage > 8 ? `${value}\n(${percentage}%)` : percentage > 4 ? `${percentage}%` : '';
              },
              textAlign: 'center',
              anchor: 'center',
              align: 'center'
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
              labels: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 11,
                  family: 'sans-serif',
                  weight: 500
                }
              }
            },
            tooltip: {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              titleColor: isDark ? '#F9FAFB' : '#111827',
              bodyColor: isDark ? '#D1D5DB' : '#4B5563'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                }
              },
              grid: {
                color: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'
              }
            },
            x: {
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                }
              },
              grid: {
                display: false
              }
            }
          }
        }
      };
      break;
      
    default:
      console.warn('Tipo de gráfico no soportado:', selectedChart.value);
      return;
  }
  
  // Crear el gráfico con la configuración
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
};

const updateChart = (chartData) => {
  if (window.currentChart && chartData) {
    window.currentChart.data.labels = chartData.etiquetas || [];
    window.currentChart.data.datasets[0].data = chartData.datos || [];
    window.currentChart.update();
  }
};

const updatePlatformStats = async () => {
  try { 
    // Construir URL base
    let url = '/movimientos/reporte/ingresos'
    
    // Agregar parámetros solo si existen valores
    const params = new URLSearchParams()
    
    if (platformDateFrom.value || platformDateTo.value) {
      // Si hay al menos una fecha, usar el mes de la fecha de inicio o mes actual
      const mesActual = platformDateFrom.value ? 
        `${platformDateFrom.value.substring(0, 7)}` : 
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      params.append('mesActual', mesActual)
      
      if (platformDateFrom.value) {
        params.append('fechaInicio', platformDateFrom.value)
      }
      if (platformDateTo.value) {
        params.append('fechaFin', platformDateTo.value)
      }
    } else {
      // Si no hay fechas específicas, usar mes actual
      const mesActual = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
      params.append('mesActual', mesActual)
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    const fullUrl = `${config.public.apiBase}${url}`
    
    // Hacer la petición al endpoint
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response.success && response.data) {
      const data = response.data.resumen;
      
      // Actualizar las estadísticas con los datos del servidor
      platformStats.totalRevenue = data.ingresosTotales || 0;
      platformStats.membershipRevenue = data.ingresosMembresias || 0;
      platformStats.visitRevenue = data.ingresosVisitas || 0;
      platformStats.serviceRevenue = data.ingresosServicios || 0;
      platformStats.totalWithdrawals = data.retiros || 0;
      platformStats.totalCommissions = data.comisiones || 0;
      
      // Si hay datos de gráfico, actualizar el gráfico
      if (response.data.grafico) {
        updateChart(response.data.grafico);
      }
      
      showToast('Datos actualizados correctamente', 'success');
    } else {
      console.warn('⚠️ La respuesta no tiene éxito o no contiene datos:', response);
    }
  } catch (error) {
    console.error('❌ Error al cargar estadísticas:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.request?.responseURL
    });
    showToast('Error al cargar las estadísticas', 'error');
  }  
};

// ===== FUNCIONES DE FILTROS ADAPTADAS PARA DATOS REALES =====
const getAllItems = () => {
  switch (activeTab.value) {
    case 'membership': return membershipPayments.value
    case 'visits': return visitPayments.value
    case 'services': return servicePayments.value
    case 'withdrawals': return withdrawals.value
    default: return []
  }
}

const getPendingItems = () => {
  return getAllItems().filter(item => item.status === 'Pendiente')
}

const getApprovedItems = () => {
  return getAllItems().filter(item => item.status === 'Aprobado')
}

const getRejectedItems = () => {
  return getAllItems().filter(item => item.status === 'Rechazado')
}

const setStatusFilter = async (filter) => {
  statusFilter.value = filter
  await nextTick()
  if (getCurrentTabData().length === 0) {
    await loadTabData()
  }
}

const getStatusFilterText = () => {
  switch (statusFilter.value) {
    case 'pending': return 'pendientes'
    case 'approved': return 'aprobados'
    case 'rejected': return 'rechazados'
    default: return ''
  }
}

// ===== FUNCIONES DE PESTAÑAS =====
const getCurrentTabData = () => {
  let items = getAllItems()
  
  switch (statusFilter.value) {
    case 'pending': return getPendingItems()
    case 'approved': return getApprovedItems()
    case 'rejected': return getRejectedItems()
    default: return items
  }
}

const getLoadingMessage = () => {
  switch (activeTab.value) {
    case 'membership': return 'pagos de membresía'
    case 'visits': return 'pagos de visitas'
    case 'services': return 'pagos de servicios'
    case 'withdrawals': return 'retiros solicitados'
    default: return 'datos'
  }
}

const getEmptyMessage = () => {
  switch (activeTab.value) {
    case 'membership': return 'pagos de membresía'
    case 'visits': return 'pagos de visitas'
    case 'services': return 'pagos de servicios'
    case 'withdrawals': return 'retiros pendientes'
    default: return 'elementos'
  }
}

const updateSelectedMonth = async (type = 'payments') => {
  if (type === 'transactions') {
    // Limpiar caché cuando cambia el filtro de fecha de transacciones
    transactionsCache.value = {};
    currentTransactionPage.value = 1; // Reset a la primera página
    
    // Forzar recarga de transacciones con el nuevo filtro de fecha
    await loadTransactions(1);
  } else {
    // Recargar datos de las pestañas de pagos
    await loadTabData();
  }
}

const getSelectedMonthName = (type = 'payments') => {
  const monthValue = type === 'transactions' ? selectedMonthTransactions.value : selectedMonthPayments.value;
  if (!monthValue) return 'Seleccionar mes'
  const date = new Date(monthValue + '-01')
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

const getMonthlyStats = () => {
  const stats = monthlyStats.value[activeTab.value] || { aprobados: 0, rechazados: 0, pendientes: 0, total: 0 }
  return {
    approved: stats.aprobados || 0,
    rejected: stats.rechazados || 0,
    total: stats.total || 0
  }
}

const getItemCardClass = (status) => {
  const baseClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
  
  switch (status) {
    case 'Aprobado': return baseClass + ' border-l-4 border-l-green-500'
    case 'Rechazado': return baseClass + ' border-l-4 border-l-red-500'
    case 'Pendiente':
    default: return baseClass + ' border-l-4 border-l-yellow-500'
  }
}

const getItemIconClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'bg-green-100 dark:bg-green-900/30'
    case 'Rechazado': return 'bg-red-100 dark:bg-red-900/30'
    case 'Pendiente':
    default: return 'bg-yellow-100 dark:bg-yellow-900/30'
  }
}

const getItemIconTextClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'text-green-600 dark:text-green-400'
    case 'Rechazado': return 'text-red-600 dark:text-red-400'
    case 'Pendiente':
    default: return 'text-yellow-600 dark:text-yellow-400'
  }
}

const getItemIcon = () => {
  switch (activeTab.value) {
    case 'membership': return '💳'
    case 'visits': return '🏠'
    case 'services': return '🛠️'
    case 'withdrawals': return '💳'
    default: return '📄'
  }
}

const getItemAmountClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'text-green-600 dark:text-green-400'
    case 'Rechazado': return 'text-red-600 dark:text-red-400'
    case 'Pendiente':
    default: return 'text-yellow-600 dark:text-yellow-400'
  }
}

const getItemTitle = (item) => {
  let title;
  switch (activeTab.value) {
    case 'membership': title = item.plan || 'Membresía'; break;
    case 'visits': title = item.service || 'Visita'; break;
    case 'services': title = item.serviceName || 'Servicio'; break;
    case 'withdrawals': title = item.technician || 'Retiro'; break;
    default: return 'Item';
  }
  return title.length > 12 ? `${title.substring(0, 12)}...` : title;
}

// ===== FUNCIONES DE MODAL =====
const showItemDetails = (item) => {
  selectedItem.value = item
  modalType.value = activeTab.value
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedItem.value = null
  modalType.value = ''
}

const approveItem = () => {
  if (!selectedItem.value) return
  
  const itemType = modalType.value === 'membership' ? 'pago de membresía' : 
                   modalType.value === 'visits' ? 'pago de visita' : 
                   modalType.value === 'services' ? 'pago de servicio' : 'retiro'
  
  // Cambiar estado en lugar de eliminar
  selectedItem.value.status = 'Aprobado'
  selectedItem.value.reviewedAt = new Date().toISOString()
  
  showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} aprobado correctamente`, 'success')
  closeDetailsModal()
}

// ===== FUNCIONES DE REPORTERÍA MEJORADA =====
const generateReport = async (report) => {
  report.generating = true
  
  try {
    // Simular tiempo de generación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Crear instancia de jsPDF con configuración profesional
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Asignar autoTable a la instancia de jsPDF
    doc.autoTable = autoTable;
    
    // Configuración de colores y estilo
    const primaryColor = [93, 92, 222]
    const secondaryColor = [107, 114, 128]
    const accentColor = [16, 185, 129]
    const errorColor = [239, 68, 68]
    
    // ===== HEADER PROFESIONAL =====
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(0, 0, 210, 35, 'F')
    
    // Logo y título principal
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('HOGAR SEGURO', 20, 20)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('SISTEMA DE GESTIÓN ADMINISTRATIVO', 20, 25)
    doc.text('Reportes y Análisis Empresarial', 20, 30)
    
    // Fecha y período en el header
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 130, 20)
    doc.text(`Período: ${formatDate(reportDateFrom.value)} - ${formatDate(reportDateTo.value)}`, 130, 25)
    doc.text(`Usuario: Admin Principal`, 130, 30)
    
    // ===== TÍTULO DEL REPORTE =====
    doc.setTextColor(0, 0, 0)
    doc.setFillColor(248, 250, 252)
    doc.rect(0, 35, 210, 20, 'F')
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(report.title.toUpperCase(), 20, 47)
    
    // Línea decorativa
    doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setLineWidth(0.8)
    doc.line(20, 51, 190, 51)
    
    let currentY = 65
    
    // ===== CONTENIDO ESPECÍFICO POR REPORTE =====
    switch (report.id) {
      case 1: // Reporte Financiero
        // Resumen ejecutivo
        doc.setFillColor(accentColor[0], accentColor[1], accentColor[2])
        doc.rect(20, currentY, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('RESUMEN EJECUTIVO FINANCIERO', 25, currentY + 5)
        currentY += 15
        
        // Tabla de ingresos
        const financialData = [
          ['CONCEPTO', 'MONTO (L.)', 'PORCENTAJE'],
          ['Ingresos por Membresías', formatCurrency(platformStats.membershipRevenue), '26.1%'],
          ['Ingresos por Visitas', formatCurrency(platformStats.visitRevenue), '48.8%'],
          ['Ingresos por Servicios', formatCurrency(platformStats.serviceRevenue), '25.1%'],
          ['TOTAL INGRESOS', formatCurrency(platformStats.totalRevenue), '100.0%'],
          ['', '', ''],
          ['Retiros Procesados', formatCurrency(platformStats.totalWithdrawals), '-30.2%'],
          ['Comisiones Pagadas', formatCurrency(platformStats.totalCommissions), '-18.7%'],
          ['BALANCE NETO', formatCurrency(platformStats.totalRevenue - platformStats.totalWithdrawals - platformStats.totalCommissions), '51.1%']
        ]
        
        autoTable(doc, {
          startY: currentY,
          head: [financialData[0]],
          body: financialData.slice(1),
          theme: 'grid',
          headStyles: {
            fillColor: primaryColor,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { cellWidth: 80, fontStyle: 'bold' },
            1: { cellWidth: 50, halign: 'right' },
            2: { cellWidth: 30, halign: 'center' }
          },
          margin: { left: 20, right: 20 }
        })
        
        currentY = doc.lastAutoTable.finalY + 15
        
        // Análisis financiero
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('ANÁLISIS DE RENDIMIENTO', 20, currentY)
        currentY += 8
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const analysisText = [
          '• Los ingresos por visitas representan el 48.8% del total, siendo la principal fuente de ingresos.',
          '• Las membresías contribuyen con el 26.1%, mostrando un crecimiento estable.',
          '• Los servicios adicionales generan el 25.1% restante.',
          '• El balance neto positivo del 51.1% indica una operación rentable.',
          '• Se recomienda optimizar los costos de comisiones para mejorar la rentabilidad.'
        ]
        
        analysisText.forEach(text => {
          doc.text(text, 25, currentY)
          currentY += 6
        })
        break
        
      case 2: // Reporte de Usuarios
        doc.setFillColor(59, 130, 246)
        doc.rect(20, currentY, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('ESTADÍSTICAS DE USUARIOS Y TÉCNICOS', 25, currentY + 5)
        currentY += 15
        
        // Métricas de usuarios
        const userMetrics = [
          ['MÉTRICA', 'VALOR', 'TENDENCIA'],
          ['Total de Técnicos Activos', formatNumber(executiveSummary.totalTechnicians), '+12.5%'],
          ['Servicios del Mes', formatNumber(executiveSummary.monthlyServices), '+8.3%'],
          ['Satisfacción Promedio', `${executiveSummary.averageSatisfaction}%`, '+2.1%'],
          ['Tiempo de Respuesta', `${executiveSummary.responseTime} horas`, '-15.2%'],
          ['Retención de Técnicos', '87.3%', '+5.1%'],
          ['Nuevos Registros', '247', '+18.7%']
        ]
        
        autoTable(doc, {
          startY: currentY,
          head: [userMetrics[0]],
          body: userMetrics.slice(1),
          theme: 'grid',
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          margin: { left: 20, right: 20 }
        })
        
        currentY = doc.lastAutoTable.finalY + 15
        
        // Recomendaciones
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text('RECOMENDACIONES ESTRATÉGICAS', 20, currentY)
        currentY += 8
        
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const recommendations = [
          '• Mantener el programa de capacitación continua para técnicos.',
          '• Implementar incentivos adicionales para mejorar la retención.',
          '• Desarrollar un sistema de reconocimiento por desempeño.',
          '• Crear programas de referidos para técnicos destacados.'
        ]
        
        recommendations.forEach(text => {
          doc.text(text, 25, currentY)
          currentY += 6
        })
        break
        
      case 3: // Reporte de Servicios
        doc.setFillColor(139, 92, 246)
        doc.rect(20, currentY, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('ANÁLISIS DETALLADO DE SERVICIOS', 25, currentY + 5)
        currentY += 15
        
        // Tabla de servicios por categoría
        const serviceData = [
          ['CATEGORÍA', 'SERVICIOS', 'INGRESOS (L.)', 'PROMEDIO'],
          ['Electricidad', '387', '89,450', '231'],
          ['Plomería', '245', '67,890', '277'],
          ['Climatización', '198', '78,560', '397'],
          ['Carpintería', '156', '45,230', '290'],
          ['Pintura', '98', '23,450', '239'],
          ['Limpieza', '67', '18,670', '279'],
          ['TOTAL', '1,151', '323,250', '281']
        ]
        
        autoTable(doc, {
          startY: currentY,
          head: [serviceData[0]],
          body: serviceData.slice(1),
          theme: 'grid',
          headStyles: {
            fillColor: [139, 92, 246],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            0: { cellWidth: 50, fontStyle: 'bold' },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 40, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' }
          },
          margin: { left: 20, right: 20 }
        })
        break
        
      case 4: // Reporte de Transacciones
        doc.setFillColor(245, 158, 11)
        doc.rect(20, currentY, 170, 8, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('RESUMEN DE TRANSACCIONES Y MOVIMIENTOS', 25, currentY + 5)
        currentY += 15
        
        // Resumen de transacciones usando datos reales
        const transactionSummaryData = [
          ['TIPO DE TRANSACCIÓN', 'CANTIDAD', 'MONTO TOTAL (L.)', 'PROMEDIO (L.)'],
          ['Pagos de Membresía', membershipPayments.value.length.toString(), formatCurrency(platformStats.membershipRevenue), formatCurrency(membershipPayments.value.length > 0 ? platformStats.membershipRevenue / membershipPayments.value.length : 0)],
          ['Pagos por Visitas', visitPayments.value.length.toString(), formatCurrency(platformStats.visitRevenue), formatCurrency(visitPayments.value.length > 0 ? platformStats.visitRevenue / visitPayments.value.length : 0)],
          ['Pagos por Servicios', servicePayments.value.length.toString(), formatCurrency(platformStats.serviceRevenue), formatCurrency(servicePayments.value.length > 0 ? platformStats.serviceRevenue / servicePayments.value.length : 0)],
          ['Retiros Procesados', pendingWithdrawals.value.filter(w => w.status === 'Aprobado').length.toString(), formatCurrency(platformStats.totalWithdrawals), formatCurrency(pendingWithdrawals.value.length > 0 ? platformStats.totalWithdrawals / pendingWithdrawals.value.length : 0)],
          ['Comisiones Pagadas', '456', formatCurrency(platformStats.totalCommissions), '197']
        ]
        
        autoTable(doc, {
          startY: currentY,
          head: [transactionSummaryData[0]],
          body: transactionSummaryData.slice(1),
          theme: 'grid',
          headStyles: {
            fillColor: [245, 158, 11],
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 9
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252]
          },
          columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
          },
          margin: { left: 20, right: 20 }
        })
        break
    }
    
    // ===== FOOTER PROFESIONAL =====
    doc.setFillColor(75, 85, 99)
    doc.rect(0, 270, 210, 27, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('HOGAR SEGURO - Sistema de Gestión Administrativo', 20, 280)
    doc.text('Este reporte fue generado automáticamente por el sistema.', 20, 285)
    doc.text(`Confidencial - Solo para uso interno | Página 1 de 1`, 20, 290)
    
    // Información de contacto
    doc.text('soporte@hogarseguro.hn | +504 2234-5678', 130, 280)
    doc.text('Tegucigalpa, Honduras', 130, 285)
    doc.text(`ID Reporte: RPT-${Date.now().toString().slice(-6)}`, 130, 290)
    
    // Descargar el PDF con nombre optimizado
    const fileName = `HogarSeguro_${report.title.replace(/\s+/g, '_')}_${reportDateFrom.value}_${reportDateTo.value}.pdf`
    doc.save(fileName)
    
    showToast(`${report.title} generado correctamente`, 'success')
    
  } catch (error) {
    console.error('Error al generar reporte:', error)
    showToast('Error al generar el reporte PDF', 'error')
  } finally {
    report.generating = false
  }
}

// ===== FUNCIONES DE TOAST =====
const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

const getCacheKey = (page) => {
  return `${selectedMonthTransactions.value || 'all'}-${page}`;
}

const loadTransactions = async (page = 1) => {
  // Verificar si ya tenemos esta página en caché
  const cacheKey = getCacheKey(page);
  if (transactionsCache.value[cacheKey]) {
    const cachedData = transactionsCache.value[cacheKey];
    transactions.value = cachedData.data;
    transactionsSummary.value = cachedData.summary;
    transactionsPagination.value = cachedData.pagination;
    currentTransactionPage.value = page;
    return;
  }
  
  isLoadingTransactions.value = true;
  
  try {
    const limit = 5;
    
    // Construir URL base con paginación
    let url = `/movimientos?page=${page}&limit=${limit}`;
    
    // Solo agregar filtro de fecha si hay una fecha seleccionada
    if (selectedMonthTransactions.value) {
      // El backend espera el parámetro 'fecha' en formato YYYY-MM
      const fechaFormateada = selectedMonthTransactions.value;
      url += `&fecha=${fechaFormateada}`;
    }
    
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response.success) {
      const transactionsData = response.data?.movimientos || response.data || [];
      const summary = response.summary || response.data?.summary || response.data?.resumen;
      const summaryData = {
        totalIngresos: parseFloat(summary?.totalIngresos || '0').toFixed(2),
        totalRetiros: parseFloat(summary?.totalRetiros || '0').toFixed(2)
      };
      
      const paginationData = response.pagination || response.data?.pagination || {};
      const totalItems = paginationData.total || transactionsData.length;
      const totalPages = paginationData.totalPages || Math.ceil(totalItems / limit) || 1;
      const paginationInfo = { 
        total: totalItems, 
        page: page, 
        limit: limit, 
        totalPages: totalPages 
      };
      
      // Actualizar los datos reactivos
      transactions.value = transactionsData;
      transactionsSummary.value = summaryData;
      transactionsPagination.value = paginationInfo;
      currentTransactionPage.value = page;
      
      // Guardar en caché
      transactionsCache.value[getCacheKey(page)] = {
        data: [...transactionsData],
        summary: { ...summaryData },
        pagination: { ...paginationInfo },
        timestamp: Date.now()
      };
      
      // Limpiar caché antiguo (más de 1 hora)
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      Object.keys(transactionsCache.value).forEach(key => {
        if (transactionsCache.value[key].timestamp < oneHourAgo) {
          delete transactionsCache.value[key];
        }
      });
      
      // Forzar actualización de la UI
      await nextTick();
    } else {
      console.warn('⚠️ La respuesta no fue exitosa:', response);
      transactions.value = [];
      transactionsSummary.value = { 
        totalIngresos: '0.00', 
        totalRetiros: '0.00' 
      };
      transactionsPagination.value = {
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1
      };
      currentTransactionPage.value = 1;
    }
  } catch (error) {
    console.error('❌ Error al cargar transacciones:', error);
    showToast('Error al cargar las transacciones', 'error');
    
    // Limpiar datos en caso de error
    transactions.value = [];
    transactionsSummary.value = { 
      totalIngresos: '0.00', 
      totalRetiros: '0.00' 
    };
    transactionsPagination.value = {
      total: 0,
      page: 1,
      limit: 5,
      totalPages: 1
    };
    currentTransactionPage.value = 1;
  } finally {
    isLoadingTransactions.value = false;
  }
}

const setActiveTab = (tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  statusFilter.value = 'all' // Reset filter when changing tabs
  loadTabData()
}

// ===== WATCHERS =====
watch(selectedChart, async (newVal) => { 
  // Esperar a que el DOM se actualice
  await nextTick();
  
  // Crear el gráfico
  createChart();
  
  // Cargar los datos específicos del gráfico seleccionado
  switch (newVal) {
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
});

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  Chart.register(...registerables, DataLabelsPlugin)
  
  // Configurar tema oscuro
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  
  // Escuchar cambios en el tema del sistema
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (event.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  });

  // Cargar datos iniciales
  await nextTick();
  createChart();
  
  // Cargar datos iniciales sin filtros de fecha
  await updatePlatformStats();
  await loadTransactions();
  
  loadTabData();
  
  isLoading.value = false;
})

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

/* Estilos para transiciones de modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style> 