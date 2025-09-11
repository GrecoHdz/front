<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
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
      :message="'Cargando Servicios...'"
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
     
     <HeadersHeaderServicios 
       :total-services="totalServices"
       :show-filters="showFilters"
       :service-filters="serviceFilters"
       :service-types="serviceTypes"
       :date-periods="datePeriods"
       :current-filter="currentFilter"
       :current-date-filter="currentDateFilter"
       :selected-service-types="selectedServiceTypes"
       :is-loading-service-types="isLoadingServiceTypes"
       @toggle-filters="showFilters = !showFilters"
       @filter-change="currentFilter = $event"
       @service-type-toggle="toggleServiceTypeFilter($event)"
       @date-filter-change="currentDateFilter = $event"
     />

    <!-- Content Container with max-w-2xl -->
    <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
      <div class="pb-24">
        <!-- Main Content -->
        <main class="pb-4">
          
          <!-- Stats Overview -->
          <section class="px-4 py-4">
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-xl font-black text-blue-600 dark:text-blue-400 mb-1">{{ totalServices }}</div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Total</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div class="text-xl font-black text-green-600 dark:text-green-400 mb-1">{{ completedServices }}</div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Completados</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div class="text-xl font-black text-orange-600 dark:text-orange-400 mb-1">{{ pendingServices }}</div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Pendientes</p>
            </div>
          </div>
        </section> 

        <!-- Services List -->
        <section class="px-4">
          <div class="space-y-3">
            <div v-for="service in filteredServices" :key="service.id"
                 @click="openServiceModal(service)"
                 class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative">

              
              <!-- Service Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-xl">
                    {{ service.icon }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white text-base">{{ service.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ service.date }} • #{{ formatDateDDMMYY() }}{{ service.id }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full" :class="getStatusColor(service.status)">
                      {{ service.status }}
                    </span>
                    <span v-if="service.rawStatus === 'pendiente_pago' && service.pagar_visita" class="inline-flex items-center px-3 py-1.5 rounded border border-amber-300 dark:border-amber-600 text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 shadow-sm hover:shadow transition-all duration-200 group">
                      <svg class="w-4 h-4 mr-1.5 text-amber-500 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      Pago Pendiente
                    </span>
                  </div>
                </div>
              </div>

              <!-- Location and Schedule -->
              <div class="space-y-2 mb-3">
                <!-- Extended Location -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p class="text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">📍 UBICACIÓN</p>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-semibold">{{ service.fullLocation.colonia }}</p>
                  <p class="text-blue-700 dark:text-blue-300 text-xs">{{ service.fullLocation.direccion }}</p>
                </div> 
              </div>
              
              <!-- Service Description -->
              <p class="text-gray-700 dark:text-gray-300 text-sm mb-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                {{ service.description }}
              </p> 

              <!-- Action Buttons -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500 dark:text-gray-400 text-xs">{{ getTimeAgo(service.rawDate) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">Ver detalles</span>
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredServices.length === 0" class="text-center py-8">
            <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span class="text-3xl">🔍</span>
            </div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">No hay servicios</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">No se encontraron servicios con los filtros seleccionados</p>
            <button @click="resetFilters" class="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Limpiar filtros
            </button>
          </div>
        </section>
        </main>
      </div> <!-- Close pb-24 div -->
    </div> <!-- Close max-w-2xl container -->

    <FootersFooter /> 
  </div>
</div>

    <!-- Service Detail Modal with Transitions -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showServiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop con animación -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to"
        >
          <div 
            v-if="showServiceModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeServiceModal"
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
            v-if="showServiceModal"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Encabezado del modal -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-lg">
                    {{ selectedService.icon }}
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">{{ selectedService.title }}</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Número de referencia #{{ formatDateDDMMYY() }}{{ selectedService.id }}
                    </p>
                  </div>
                </div>
                <button @click="closeServiceModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contenido principal del modal -->
            <div class="p-4">
        <!-- 1. Seguimiento del Servicio -->
        <div v-if="selectedService.rawStatus !== 'cancelado'" class="mb-6">
          <h4 class="text-base font-black text-gray-900 dark:text-white mb-4">Seguimiento del Servicio</h4>

          <!-- Timeline Steps -->
          <div class="space-y-3">
            <div v-for="(step, index) in serviceSteps" :key="step.id"
                 class="flex items-start space-x-3">
              <div class="flex-shrink-0 relative">
                <div class="w-8 h-8 rounded-full flex items-center justify-center border-2"
                     :class="getStepStatus(step.id, selectedService.status).class">
                  <span class="text-xs font-bold" :class="getStepStatus(step.id, selectedService.status).textClass">
                    {{ getStepStatus(step.id, selectedService.status).icon }}
                  </span>
                </div>
                <div v-if="index < serviceSteps.length - 1" 
                     class="absolute top-8 left-1/2 transform -translate-x-1/2 w-px h-4"
                     :class="getCurrentStepNumber(selectedService.status) > step.id ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"></div>
              </div>
              <div class="flex-1 pb-4">
                <p class="font-bold text-gray-900 dark:text-white text-sm">{{ step.title }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">{{ step.description }}</p>
                
                <!-- Cotización pendiente de aprobación -->
                <div v-if="step.id === 3 && selectedService.status === 'Cotización Pendiente'" class="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 class="text-yellow-800 dark:text-yellow-200 font-bold mb-2 text-sm">🔍 Diagnóstico del Técnico</h5>
                  <p class="text-yellow-700 dark:text-yellow-300 text-xs mb-3 bg-white dark:bg-yellow-900/30 p-2 rounded">
                    {{ selectedService.diagnosis }}
                  </p>
                  
                  <div class="bg-white dark:bg-yellow-900/30 p-2 rounded mb-3">
                    <h6 class="text-yellow-800 dark:text-yellow-200 font-bold text-xs mb-2">💰 Cotización de Mano de Obra</h6>
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-yellow-700 dark:text-yellow-300 text-xs">Mano de obra:</span>
                      <span class="text-yellow-800 dark:text-yellow-200 font-bold text-xs">L. {{ selectedService.laborCost }}</span>
                    </div>
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-yellow-700 dark:text-yellow-300 text-xs">Materiales (estimado):</span>
                      <span class="text-yellow-800 dark:text-yellow-200 font-bold text-xs">L. {{ selectedService.materialsCost }}</span>
                    </div>
                    <hr class="border-yellow-300 dark:border-yellow-700 my-1">
                    <div class="flex justify-between items-center">
                      <span class="text-yellow-800 dark:text-yellow-200 font-bold text-xs">Total estimado:</span>
                      <span class="text-yellow-800 dark:text-yellow-200 font-bold text-sm">L. {{ selectedService.quotedPrice }}</span>
                    </div>
                  </div>
                  
                  <div class="flex space-x-2">
                    <button @click="acceptQuotation" class="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600 transition-colors">
                      ✅ Aceptar
                    </button>
                    <button @click="rejectQuotation" class="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Técnico Asignado -->
        <div v-if="selectedService.technician && selectedService.rawStatus === 'asignado'" class="mb-6">
          <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Técnico Asignado</h4>
          <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-xl">👨‍🔧</span>
              </div>
              <div>
                <h5 class="font-bold text-emerald-800 dark:text-emerald-200">{{ selectedService.technician.name }}</h5>
                <div class="flex items-center space-x-1">
                  <span class="text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4 fill-current" :class="{ 'text-yellow-400': i <= selectedService.technician.rating, 'text-gray-300 dark:text-gray-600': i > selectedService.technician.rating }" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <span class="text-emerald-600 dark:text-emerald-400 text-xs font-bold">({{ selectedService.technician.reviews }})</span>
                </div>
              </div>
            </div>
            <div class="bg-white dark:bg-emerald-900/30 p-2 rounded-lg">
              <p class="text-emerald-800 dark:text-emerald-200 text-xs font-bold mb-1">Servicio a realizar:</p>
              <p class="text-emerald-700 dark:text-emerald-300 text-xs">{{ selectedService.serviceDescription || selectedService.description }}</p>
            </div>
          </div>
        </div>

        <!-- Mensaje de Servicio Cancelado -->
        <div v-if="selectedService.rawStatus === 'cancelado'" class="mb-6">
          <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-l-4 border-red-500">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Servicio Cancelado</h3>
                <div class="mt-1 text-sm text-red-700 dark:text-red-300">
                  <p v-if="selectedService.comentario">{{ selectedService.comentario }}</p>
                  <p v-else>Este servicio ha sido cancelado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Acciones - Solo se muestra si hay acciones disponibles -->
        <div v-if="hasActions" class="mb-4">
          <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Acciones</h4>
          <div class="space-y-2">
            <!-- Botón de Cancelar - Visible solo en estados específicos -->
            <div v-if="['pendiente_asignacion', 'asignado', 'cotizacion_pendiente', 'cotizacion_aprobada', 'cotizacion_rechazada'].includes(selectedService.rawStatus)" class="mb-3">
              <button 
                @click="confirmarCancelar"
                class="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-lg">❌</span>
                  <span class="font-bold text-red-800 dark:text-red-200 text-sm">
                    {{ getCancelButtonText }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- Acciones para Pendiente de Pago (aunque el estado muestre 'Solicitud Recibida') -->
            <div v-if="selectedService.rawStatus === 'pendiente_pago' && selectedService.pagar_visita" class="space-y-2">
              <button 
                @click="openVisitPaymentModal(selectedService)"
                class="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-lg">💳</span>
                  <span class="font-bold text-amber-800 dark:text-amber-200 text-sm">Pagar Visita</span>
                </div>
                <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Acciones para Cotización Pendiente -->
            <div v-if="selectedService.status === 'Cotización Pendiente'">
              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg mb-2">
                <p class="text-yellow-800 dark:text-yellow-200 text-xs font-bold text-center">
                  ⏳ Esperando tu decisión sobre la cotización
                </p>
              </div>
              <button class="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">💬</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Contactar técnico</span>
                </div>
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div> 

            <!-- Acciones para Servicio Completado o Finalizado -->
            <div v-if="selectedService.rawStatus === 'completado' || selectedService.rawStatus === 'finalizado'">
              <!-- Botón de Pagar Visita si está pendiente -->
              <div v-if="selectedService.pagar_visita" class="mb-4">
                <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mb-2">
                  <p class="text-yellow-800 dark:text-yellow-200 text-xs font-bold text-center">
                    ⏳ Tiene un pago pendiente por la visita del técnico
                  </p>
                </div>
                <button 
                  @click="openVisitPaymentModal(selectedService)"
                  class="w-full flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors mb-3"
                >
                  <div class="flex items-center space-x-2">
                    <span class="text-lg">💳</span>
                    <span class="font-bold text-amber-800 dark:text-amber-200 text-sm">Pagar Visita</span>
                  </div>
                  <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              
              <!-- Botón de Pagar Servicio -->
              <button 
                @click="openPaymentModal"
                class="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors mb-3"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-lg">💰</span>
                  <span class="font-bold text-green-800 dark:text-green-200 text-sm">Pagar Servicio</span>
                </div>
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              
              <!-- Botón de Reportar Problema -->
              <button 
                @click="reportarProblema"
                class="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-lg">⚠️</span>
                  <span class="font-bold text-red-800 dark:text-red-200 text-sm">Reportar Problema</span>
                </div>
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>

            </div>
          </div>
        </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Visit Payment Modal with Transitions -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showVisitPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop con animación -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to"
        >
          <div 
            v-if="showVisitPaymentModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeVisitPaymentModal"
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
            v-if="showVisitPaymentModal"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Encabezado del modal -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-lg">
                    💳
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">Pagar Visita</h3> 
                    <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService.id }}</p>
                  </div> 
                </div>
                <button @click="closeVisitPaymentModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contenido principal del modal -->
            <div class="p-4">
              <!-- Service Summary -->
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
                <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-2">Pago de la Visita</h4>
                <div class="flex items-center space-x-3 mb-2">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm">
                    {{ selectedService.icon }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedService.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ selectedService.date }}</p>
                  </div>
                </div>
              </div>

              <!-- Payment Breakdown -->
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4">
                <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-3">💰 Desglose de Pago</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between items-center">
                    <span class="text-blue-700 dark:text-blue-300">Visita del Técnico:</span>
                    <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ visitCost }}</span>
                  </div> 
                  <hr class="border-blue-300 dark:border-blue-700">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200">Total a pagar:</span>
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-lg">L. {{ visitCost }}</span>
                  </div>
                </div>
              </div>

              <!-- Cuenta Bancaria -->
              <div class="space-y-3 mb-4">
                <label for="bank-account" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cuenta bancaria
                </label>
                <div v-if="isLoadingAccounts" class="py-8 flex flex-col items-center justify-center">
                  <div class="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando cuentas...</p>
                </div>
                <div v-else class="space-y-4">
                  <select
                    id="bank-account"
                    v-model="selectedAccount"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200"
                    :disabled="bankAccounts.length === 0"
                  >
                    <option value="" disabled selected>Selecciona una cuenta</option>
                    <option 
                      v-for="account in bankAccounts" 
                      :key="account.id_cuenta" 
                      :value="account.id_cuenta"
                      class="py-2"
                    >
                      🏦 {{ account.banco }}
                    </option>
                  </select>

                  <!-- Detalles de la cuenta seleccionada -->
                  <div 
                    v-if="getSelectedAccount" 
                    class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Detalles de la cuenta:</h4>
                    <div class="space-y-2">
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Banco:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.banco }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Titular:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.titular }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Número de cuenta:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.numero_cuenta }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Tipo de cuenta:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.tipo_cuenta }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Input para el número de comprobante -->
                  <div class="space-y-2">
                    <label for="comprobante" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número de comprobante de transferencia
                    </label>
                    <input
                      id="comprobante"
                      v-model="comprobante"
                      type="text"
                      class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Ingresa el número de comprobante"
                    >
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Realiza la transferencia a la cuenta seleccionada e ingresa el número de comprobante.
                    </p>
                  </div>
                </div>

                <!-- Botón de pago -->
                <div class="mt-6">
                  <button 
                    @click="processVisitPayment"
                    :disabled="!selectedAccount || !comprobante || isProcessingPayment"
                    class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <span v-if="!isProcessingPayment">
                      Procesar Pago - L. {{ visitCost }}
                    </span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  </button>
                </div> 
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

<!-- Payment Modal with Transitions -->
  <!-- Payment Modal with Transitions -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to"
      >
        <div 
          v-if="showPaymentModal"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closePaymentModal"
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
          v-if="showPaymentModal"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-lg">
                  💳
                </div>
                <div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">Pagar Servicio</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido principal del modal -->
          <div class="p-4">
            <!-- Resumen del Servicio -->
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
              <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-2">Resumen del Servicio</h4>
              <div class="flex items-center space-x-3 mb-2">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm">
                  {{ selectedService.icon }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedService.title }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ selectedService.date }}</p>
                </div>
              </div>
            </div>

            <!-- Desglose de Pago -->
            <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4">
              <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-3">💰 Desglose de Pago</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-blue-700 dark:text-blue-300">Servicio de {{ selectedService.title }}:</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ selectedService.amount || '0.00' }}</span>
                </div>
                <div v-if="selectedService.visit_cost" class="flex justify-between items-center">
                  <span class="text-blue-700 dark:text-blue-300">Costo de visita:</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ selectedService.visit_cost }}</span>
                </div>
                <hr class="border-blue-300 dark:border-blue-700">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-blue-800 dark:text-blue-200">Total a pagar:</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200 text-lg">L. {{ (parseFloat(selectedService.amount || 0) + parseFloat(selectedService.visit_cost || 0)).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Sección de Cuenta Bancaria -->
            <div class="space-y-3 mb-4">
              <label for="bank-account" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Cuenta bancaria
              </label>
              <div v-if="isLoadingAccounts" class="py-8 flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando cuentas...</p>
              </div>
              <div v-else class="space-y-4">
                <select
                  id="bank-account"
                  v-model="selectedAccount"
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200"
                  :disabled="bankAccounts.length === 0"
                >
                  <option value="" disabled selected>Selecciona una cuenta</option>
                  <option 
                    v-for="account in bankAccounts" 
                    :key="account.id_cuenta" 
                    :value="account.id_cuenta"
                    class="py-2"
                  >
                    🏦 {{ account.banco }}
                  </option>
                </select>

                <!-- Detalles de la cuenta seleccionada -->
                <div 
                  v-if="getSelectedAccount" 
                  class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Detalles de la cuenta:</h4>
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Banco:</span>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.banco }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Titular:</span>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.titular }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Número de cuenta:</span>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.numero_cuenta }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Tipo de cuenta:</span>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.tipo_cuenta }}</span>
                    </div>
                  </div>
                </div>

                <!-- Input para el número de comprobante -->
                <div class="space-y-2">
                  <label for="comprobante" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de comprobante de transferencia
                  </label>
                  <input
                    id="comprobante"
                    v-model="comprobante"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200"
                    placeholder="Ingresa el número de comprobante"
                  >
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Realiza la transferencia a la cuenta seleccionada e ingresa el número de comprobante.
                  </p>
                </div>
              </div>

              <!-- Botón de pago -->
              <div class="mt-6">
                <button 
                  @click="processPayment"
                  :disabled="!selectedAccount || !comprobante || isProcessingPayment"
                  class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span v-if="!isProcessingPayment">
                    Procesar Pago - L. {{ (parseFloat(selectedService.amount || 0) + parseFloat(selectedService.visit_cost || 0)).toFixed(2) }}
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Modal de Cancelación con Transiciones -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to"
      >
        <div 
          v-if="showCancelModal"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="closeCancelModal"
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
          v-if="showCancelModal"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl flex items-center justify-center text-lg">
                  ✖
                </div>
                <div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">
                    {{ cancelModalTexts[selectedService.rawStatus]?.title || 'Cancelar Servicio' }}
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closeCancelModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido principal del modal -->
          <div class="p-4">
            <div class="space-y-4">
              <div class="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl mb-4">
                <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  {{ cancelModalTexts[selectedService.rawStatus]?.message || '¿Estás seguro de que deseas cancelar este servicio?' }}
                </p>
              </div>

              <div class="space-y-3">
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Por favor, indícanos el motivo de la cancelación:
                </p>
                <textarea 
                  v-model="cancelAdditionalInfo" 
                  rows="4" 
                  class="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Describe el motivo de la cancelación..."
                ></textarea>
                <p v-if="!cancelAdditionalInfo.trim()" class="text-xs text-red-500 dark:text-red-400">
                  Por favor, proporciona un motivo para la cancelación.
                </p>
              </div>
            </div>
          </div>

          <!-- Pie del modal -->
          <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 px-4 py-3 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl flex justify-end space-x-3 backdrop-blur-sm">
            <button 
              @click="closeCancelModal" 
              class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Volver atrás
            </button>
            <button 
              @click="cancelarSolicitud" 
              :disabled="!cancelAdditionalInfo.trim() || isCancelling"
              class="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              <span v-if="!isCancelling">
                Confirmar cancelación
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cancelando...
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition> 

</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// Obtener la configuración
const config = useRuntimeConfig()

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de Servicios - Gestiona tus servicios y membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Autenticación
const auth = useAuthStore()
const router = useRouter() 
const isLoading = ref(true) 

// Datos del usuario
const userCookie = useCookie('user')
const userData = ref({
  id: null,
  identidad: '',
  nombre: 'Invitado',
  email: '',
  role: '',
  rol_nombre: 'Invitado',
  // Mantener compatibilidad con el resto del código
  name: 'Invitado',
  ...(userCookie.value || {})
})

// Variables para datos de la API
const servicesData = ref({
  solicitudes: [],
  total: 0,
  finalizadas: 0,
  pendientes: 0,
  canceladas: 0
})

// Estado para controlar las notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// Función para cargar los servicios desde la API
const loadServices = async () => {
  try {
    const userCookieValue = useCookie('user').value
    if (!userCookieValue?.id_usuario) {
      console.error('No se encontró ID de usuario')
      return
    }

    const response = await $fetch(`/solicitudservicio/usuario/${userCookieValue.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('token').value}`
      }
    })

    servicesData.value = response

    // Mapear los datos a la estructura que usa el componente
    allServices.value = response.solicitudes.map(solicitud => mapApiServiceToLocal(solicitud))
    
  } catch (error) {
    console.error('Error cargando servicios:', error)
    showSuccess('Error al cargar los servicios')
  }
}

// Función para mapear los datos de la API a la estructura local
const mapApiServiceToLocal = (apiService) => { 
  
  return {
    id: apiService.id_solicitud,
    serviceId: apiService.id_servicio,
    title: apiService.servicio?.nombre || 'Servicio General',
    icon: getServiceIcon(apiService.id_servicio),
    status: mapApiStatusToLocal(apiService.estado),
    rawStatus: apiService.estado, // Guardar el estado original de la API
    rawDate: apiService.fecha_solicitud,
    date: formatDate(apiService.fecha_solicitud),
    fullLocation: {
      colonia: apiService.colonia,
      direccion: apiService.direccion_precisa
    },
    description: apiService.descripcion, 
    pagar_visita: apiService.pagar_visita == 1,  
    serviceDescription: apiService.descripcion,
    diagnosis: 'Diagnóstico pendiente...',
    technician: apiService.estado === 'asignado' ? {
      name: 'Técnico Asignado',
      rating: 4.8,
      reviews: 127
    } : null
  }
}

// Función para obtener el ícono del servicio
const getServiceIcon = () => {
  return '🛠️' // Ícono de herramientas para todos los servicios
}

// Función para mapear el estado de la API al estado local
const mapApiStatusToLocal = (apiStatus) => {
  const statusMap = {
    'pendiente_pago': 'Pendiente de Pago',
    'pendiente_asignacion': 'En Espera de Técnico',
    'asignado': 'Técnico Asignado',
    'pendiente_pagocotizacion': 'Pendiente de Pago de Cotización',
    'en_proceso': 'Servicio en Curso',
    'finalizado': 'Servicio Completado',
    'cancelado': 'Cancelado'
  }
  return statusMap[apiStatus] || 'Estado Desconocido'
}

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }
  return date.toLocaleDateString('es-ES', options)
}

const formatDateDDMMYY = () => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = String(now.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

// Obtener el costo de la visita
const fetchVisitCost = async () => {
  isLoadingVisitCost.value = true;
  try {
    const data = await $fetch('/config/valor/visita_tecnico', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (data) {
      visitCost.value = data.valor;
    }
  } catch (error) {
    console.error('Error al obtener el costo de la visita:', error);
  } finally {
    isLoadingVisitCost.value = false;
  }
};

// Verificar autenticación al cargar el componente
onMounted(async () => { 
  try {
    // Cargar servicios y tipos de servicio en paralelo
    await Promise.all([
      loadServices(),
      loadServiceTypes()
    ])
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    showError('Error al cargar los datos. Por favor, recargue la página.')
  } finally {
    isLoading.value = false
  }
})

// Reactive data
const showServiceModal = ref(false) 
const cancelReason = ref('')
const cancelAdditionalInfo = ref('')
const showPaymentModal = ref(false)
const showVisitPaymentModal = ref(false)
const selectedServiceId = ref(null)
const showFilters = ref(false)
const currentFilter = ref('all')
const currentDateFilter = ref('all')
const selectedServiceTypes = ref([])
const showSuccessMessage = ref(false)
const successMessage = ref('')
const showCancelModal = ref(false) 

// Estado para el proceso de pago
const isLoadingAccounts = ref(false)
const bankAccounts = ref([])
const selectedAccount = ref('')
const comprobante = ref('')
const isProcessingPayment = ref(false)

// Costo de la visita
const visitCost = ref(0)
const isLoadingVisitCost = ref(false)

// Service filters
const serviceFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completados' },
  { key: 'cancelled', label: 'Cancelados' }
]

// Tipos de servicio cargados desde la API
const serviceTypes = ref([])
const isLoadingServiceTypes = ref(false)

// Función para cargar los tipos de servicio desde la API
const loadServiceTypes = async () => {
  try {
    isLoadingServiceTypes.value = true
    const data = await $fetch('/servicios/activos', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    // Mapear la respuesta de la API al formato esperado por el componente
    serviceTypes.value = data.map(service => ({
      id: service.id_servicio,
      name: service.nombre,
      description: service.descripcion,
      active: service.estado
    }))
  } catch (error) {
    console.error('Error al cargar tipos de servicio:', error)
    showError('No se pudieron cargar los tipos de servicio')
  } finally {
    isLoadingServiceTypes.value = false
  }
}

const datePeriods = [
  { key: 'all', label: 'Todo' },
  { key: 'week', label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'quarter', label: 'Últimos 3m' }
]

// Service steps
const serviceSteps = [
  { id: 1, title: 'Solicitud recibida', description: 'Tu solicitud ha sido registrada' },
  { id: 2, title: 'Técnico asignado', description: 'Se asignó el mejor técnico' },
  { id: 3, title: 'Diagnóstico y Cotización', description: 'Evaluación y cotización' },
  { id: 4, title: 'Servicio en Curso', description: 'Trabajo en progreso' },
  { id: 5, title: 'Servicio Completado', description: 'Servicio finalizado' }
]

// Services data (ahora se llena desde la API)
const allServices = ref([])

// Computed properties actualizadas para usar los datos de la API
const totalServices = computed(() => servicesData.value.total || allServices.value.length)
const completedServices = computed(() => servicesData.value.finalizadas || allServices.value.filter(s => s.status === 'Servicio Completado').length)
const pendingServices = computed(() => servicesData.value.pendientes || allServices.value.filter(s => !['Servicio Completado', 'Cancelado'].includes(s.status)).length)

const selectedService = computed(() => {
  if (!selectedServiceId.value) return {}
  return allServices.value.find(s => s.id === selectedServiceId.value) || {}
})

const filteredServices = computed(() => {
  let filtered = [...allServices.value]
  
  if (currentFilter.value !== 'all') {
    if (currentFilter.value === 'pending') {
      filtered = filtered.filter(s => !['Servicio Completado', 'Cancelado'].includes(s.status))
    } else if (currentFilter.value === 'completed') {
      filtered = filtered.filter(s => s.status === 'Servicio Completado')
    } else if (currentFilter.value === 'cancelled') {
      filtered = filtered.filter(s => s.status === 'Cancelado')
    }
  }
  
  if (selectedServiceTypes.value.length > 0 && Array.isArray(serviceTypes.value)) {
    filtered = filtered.filter(s => {
      // Buscar el tipo de servicio por nombre
      return selectedServiceTypes.value.some(typeName => 
        serviceTypes.value.some(st => st && st.name === typeName && st.name === s.title)
      )
    })
  }
  
  return filtered
})

// Methods
const openServiceModal = (service) => {
  selectedServiceId.value = service.id
  showServiceModal.value = true
}

const closeServiceModal = () => {
  showServiceModal.value = false
}

const openVisitPaymentModal = async (service) => {
  selectedServiceId.value = service.id
  showVisitPaymentModal.value = true
  await fetchBankAccounts()
  await fetchVisitCost()
}

const closeVisitPaymentModal = () => {
  showVisitPaymentModal.value = false
  selectedAccount.value = ''
  comprobante.value = ''
  isProcessingPayment.value = false
}

const fetchBankAccounts = async () => {
  isLoadingAccounts.value = true;
  try {
    const data = await $fetch('/cuentas', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (data) {
      // Mapear los datos para que coincidan con la estructura esperada por el template
      bankAccounts.value = data.map(account => ({
        id_cuenta: account.id_cuenta,
        banco: account.banco,
        numero_cuenta: account.num_cuenta,
        tipo_cuenta: account.tipo,
        titular: account.beneficiario || 'Titular no especificado',
        activo: account.activo === 1
      }));
      
      // No seleccionar ninguna cuenta por defecto
      selectedAccount.value = '';
    }
  } catch (error) {
    console.error('Error al obtener cuentas bancarias:', error);
    showError('Error', 'No se pudieron cargar las cuentas bancarias');
  } finally {
    isLoadingAccounts.value = false;
  }
};

const openPaymentModal = async () => {
  try {
    showPaymentModal.value = true
    await fetchBankAccounts()
  } catch (error) {
    console.error('Error al cargar cuentas bancarias:', error)
    showError('No se pudieron cargar las cuentas bancarias. Intente nuevamente.')
  }
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedAccount.value = ''
  comprobante.value = ''
  isProcessingPayment.value = false
}

// Determinar si hay acciones disponibles para el servicio actual
const hasActions = computed(() => {
  if (!selectedService.value) return false;
  
  const status = selectedService.value.rawStatus;
  
  // Estados donde hay acciones disponibles
  const statesWithActions = [
    'pendiente_asignacion',
    'asignado',
    'cotizacion_pendiente',
    'cotizacion_aprobada',
    'cotizacion_rechazada'
  ];
  
  // Verificar si el estado actual tiene acciones
  if (statesWithActions.includes(status)) return true;
  
  // Mostrar acciones si el servicio está completado o finalizado (con o sin pago pendiente)
  if (status === 'completado' || status === 'finalizado') return true;
  
  // Verificar si hay que mostrar el botón de pago de visita para otros estados
  if (status === 'pendiente_pago' && selectedService.value.pagar_visita) return true;
  
  return false;
});

// Obtener la cuenta seleccionada
const getSelectedAccount = computed(() => {
  if (!selectedAccount.value) return null;
  return bankAccounts.value.find(acc => acc.id_cuenta === selectedAccount.value) || null;
}) 

const processVisitPayment = async () => {
  if (!selectedAccount.value) {
    showError('Error', 'Por favor selecciona una cuenta bancaria');
    return;
  }
  
  if (!comprobante.value?.trim()) {
    showError('Error', 'Por favor ingresa el número de comprobante');
    return;
  }

  isProcessingPayment.value = true;
  
  try {
    // Obtener el ID del usuario de la cookie 'user'
    const userData = useCookie('user').value;
    if (!userData?.id_usuario) {
      throw new Error('No se pudo identificar al usuario');
    }
    
    const requestData = {
      id_usuario: userData.id_usuario,
      id_solicitud: selectedService.value.id,
      id_cuenta: selectedAccount.value,
      monto: visitCost.value,
      num_comprobante: comprobante.value.trim(),
      fecha: new Date(Date.now() - (6 * 60 * 60 * 1000)).toISOString() // Ajuste a UTC-6
    };
    
    // Obtener el token de autenticación
    const authToken = useCookie('token').value;
    
    // Enviar pago de visita
    await $fetch('/pagovisita', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: requestData
    });
    
    // Actualizar el estado de la solicitud a 'pendiente_asignacion' 
    const token = useCookie('token').value;
    
    try {
      const response = await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
        method: 'PUT',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'pendiente_asignacion' })
      }); 
    } catch (updateError) {
      console.error('Error al actualizar el estado de la solicitud:', updateError);
      // Lanzar el error para que sea manejado por el catch principal
      throw new Error(`Error al actualizar el estado de la solicitud: ${updateError.message}`);
    }
    
    // Cerrar el modal y actualizar datos
    closeVisitPaymentModal();
    await loadServices();
    
    // Mostrar notificación de éxito
    showSuccess(
      '¡Pago Enviado!',
      'Una vez se verifique el pago, se le asignará un técnico.'
    );
    
    // Limpiar formulario
    selectedAccount.value = '';
    comprobante.value = '';
    
  } catch (error) {
    console.error('Error al procesar el pago de la visita:', error);
    showError(
      'Error al procesar la solicitud',
      error.data?.message || error.response?._data?.message || error.message || 'No se pudo completar la operación. Por favor, inténtalo de nuevo.'
    );
  } finally {
    isProcessingPayment.value = false;
  }
}

const processPayment = async () => {
  if (!selectedAccount.value || !comprobante.value) {
    showError('Por favor complete todos los campos requeridos')
    return
  }
  
  try {
    isProcessingPayment.value = true
    
    // Enviar pago
    const response = await $fetch('/pagos/registrar', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('token').value}`
      },
      body: JSON.stringify({
        id_solicitud: selectedService.value.id,
        id_cuenta: selectedAccount.value,
        monto: selectedService.value.finalTotal || 180,
        comprobante: comprobante.value,
        metodo: 'transferencia'
      })
    })
    
    showSuccess('Pago registrado exitosamente. Se verificará el pago en breve.')
    closePaymentModal()
    
    // Recargar servicios para actualizar el estado
    await loadServices()
    
  } catch (error) {
    console.error('Error al procesar el pago:', error)
    showError(error.response?._data?.message || 'Error al procesar el pago. Intente de nuevo.')
  } finally {
    isProcessingPayment.value = false
  }
}

const toggleServiceTypeFilter = (serviceType) => {
  const index = selectedServiceTypes.value.indexOf(serviceType)
  if (index > -1) {
    selectedServiceTypes.value.splice(index, 1)
  } else {
    selectedServiceTypes.value.push(serviceType)
  }
}

const resetFilters = () => {
  currentFilter.value = 'all'
  currentDateFilter.value = 'all'
  selectedServiceTypes.value = []
}

const getCurrentStepNumber = (status) => {
  const statusToStep = {
    'Solicitud Recibida': 1,
    'Técnico Asignado': 2,
    'Cotización Pendiente': 3,
    'Servicio en Curso': 4,
    'Servicio Completado': 5
  }
  return statusToStep[status] || 1
}

const getStepStatus = (stepId, serviceStatus) => {
  const currentStep = getCurrentStepNumber(serviceStatus)
  
  if (stepId < currentStep) {
    return {
      class: 'bg-blue-500 border-blue-200 dark:border-blue-800',
      textClass: 'text-white',
      icon: '✓'
    }
  } else if (stepId === currentStep) {
    return {
      class: 'bg-yellow-500 border-yellow-200 dark:border-yellow-800',
      textClass: 'text-white',
      icon: '●'
    }
  } else {
    return {
      class: 'bg-gray-300 dark:bg-gray-600 border-gray-200 dark:border-gray-700',
      textClass: 'text-gray-500 dark:text-gray-400',
      icon: stepId
    }
  }
}

const acceptQuotation = () => {
  const service = allServices.value.find(s => s.id === selectedServiceId.value)
  if (service) {
    service.status = 'Servicio en Curso'
    showSuccess('Cotización aceptada. El servicio comenzará pronto.')
  }
}

// Títulos y textos para el modal de cancelación
const cancelModalTexts = {
  pendiente_asignacion: {
    title: 'Cancelar Servicio',
    confirmButton: 'Sí, cancelar',
  },
  asignado: {
    title: 'Solicitar Cancelación',
    confirmButton: 'Solicitar cancelación',
  },
  en_proceso: {
    title: 'Reportar Problema',
    confirmButton: 'Enviar reporte',
  },
  default: {
    title: 'Cancelar Servicio',
    confirmButton: 'Confirmar cancelación',
  }
}

const getCancelModalTitle = computed(() => {
  const status = selectedService.value?.rawStatus || 'default'
  return cancelModalTexts[status]?.title || cancelModalTexts.default.title
})

const getConfirmButtonText = computed(() => {
  const status = selectedService.value?.rawStatus || 'default'
  return cancelModalTexts[status]?.confirmButton || cancelModalTexts.default.confirmButton
})

const getCancelButtonText = computed(() => {
  const status = selectedService.value?.rawStatus || 'default'
  
  if (status === 'cancelado') return 'Servicio Cancelado'
  if (status === 'completado') return 'Servicio Completado'
  if (status === 'en_proceso') return 'Reportar Problema'
  if (status === 'asignado') return 'Solicitar Cancelación'
  if (status === 'pendiente_pago') return 'Cancelar Servicio'
  
  return 'Cancelar Servicio'
})

const confirmarCancelar = () => {
  // Resetear valores anteriores
  cancelAdditionalInfo.value = ''
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  // Pequeño retraso para la animación
  setTimeout(() => {
    cancelReason.value = ''
    cancelAdditionalInfo.value = ''
  }, 300)
}

const cancelarSolicitud = async () => {
  if (!cancelAdditionalInfo.value.trim()) {
    showError('Por favor, escribe el motivo de la cancelación')
    return
  }

  try {
    const token = useCookie('token').value
    
    // Realizar la petición para cancelar el servicio
    await $fetch(`/solicitudservicio/${selectedServiceId.value}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estado: 'cancelado',
        comentario: cancelAdditionalInfo.value.trim()
      })
    })

    // Cerrar el modal de cancelación
    closeCancelModal()
    
    // Mostrar mensaje de éxito
    showSuccess('El servicio ha sido cancelado correctamente')
    
    // Actualizar la lista de servicios
    await loadServices()
    
  } catch (error) {
    console.error('Error al cancelar el servicio:', error)
    showError('Ocurrió un error al cancelar el servicio. Por favor, inténtalo de nuevo.')
  }
}

// Función para reportar un problema con un servicio completado
const reportarProblema = () => {
  // Redirigir a la página de soporte con el hash #problemaServicio
  navigateTo('/cliente/soporte#problemaServicio');
  
  // Cerrar el modal de servicio actual
  closeServiceModal();
};

const rejectQuotation = () => {
  const service = allServices.value.find(s => s.id === selectedServiceId.value)
  if (service) {
    service.status = 'Cancelado'
    showToast({
      message: 'Cotización rechazada. El servicio ha sido cancelado.',
      type: 'warning',
      duration: 6000
    })
  }
}

const showToast = (options) => {
  // Primero ocultar el toast actual
  toast.value.show = false;
  
  // Usar nextTick para asegurar que la actualización del DOM se complete
  nextTick(() => {
    // Actualizar con los nuevos valores
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    };
  });
};

// Funciones de conveniencia
const showSuccess = (message) => {
  showToast({
    message: message,
    type: 'success',
    duration: 5000
  });
};

const showError = (message) => {
  console.error('Error:', message);
  
  showToast({
    message: message,
    type: 'error',
    duration: 8000 // Los errores duran más para que el usuario los pueda leer
  });
};

const getStatusColor = (status) => {
  const colors = {
    'Servicio Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Servicio en Curso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Cotización Pendiente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Técnico Asignado': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Solicitud Recibida': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const getTimeAgo = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  return `Hace ${Math.floor(diffInDays / 7)} semanas`
}

</script>

<style scoped>
/* Add any custom styles here */

/* Animaciones para el backdrop */
.backdrop-enter-active {
  transition: opacity 0.3s ease-out;
}

.backdrop-leave-active {
  transition: opacity 0.2s ease-in;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Animaciones para el contenido del modal */
.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.modal-content-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

/* Animación de slide down para contenido adicional */
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilos para el scrollbar personalizado */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Estilos para modo oscuro */
.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  animation: modal-enter 0.3s ease-out;
}

.modal-content-leave-active {
  animation: modal-leave 0.2s ease-in;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}

.slide-down-enter-active {
  animation: slide-down 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slide-down 0.2s ease-in reverse;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

html {
  scroll-behavior: smooth;
}

/* Force mobile layout on all screen sizes */
body {
  overflow-x: hidden;
}

/* Ensure modals also respect mobile constraints */
.fixed.inset-0 {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>