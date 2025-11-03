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
      <div class="pb-20">
        <!-- Main Content -->
        <main class="pb-4">
          
          <!-- Stats Overview -->
          <section class="px-4 py-3">
            <div class="grid grid-cols-3 gap-2 mb-3">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-lg font-black text-blue-600 dark:text-blue-400 mb-1">{{ totalServices }}</div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Total</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div class="text-lg font-black text-green-600 dark:text-green-400 mb-1">{{ completedServices }}</div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Completados</p>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div class="text-lg font-black text-orange-600 dark:text-orange-400 mb-1">{{ pendingServices }}</div>
              <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Pendientes</p>
            </div>
          </div>
        </section> 

        <!-- Services List -->
        <section class="px-4">
          <div class="space-y-3">
            <div v-for="service in filteredServices" :key="service.id"
                 @click="openServiceModal(service)"
                 class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative">

              
              <!-- Service Header -->
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm">
                    {{ service.icon }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[125px] sm:max-w-none">{{ service.title }}</p>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">#{{ formatDateDDMMYY(service.rawDate) }}-{{ service.id }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-1">
                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-full" :class="getStatusColor(service.status)">
                    {{ service.status }}
                  </span>
                  </div>
                  <div class="flex flex-wrap justify-end gap-1">
                    <span v-if="service.rawStatus === 'pendiente_pagovisita' && service.pagar_visita || service.rawStatus === 'pendiente_pagoservicio'" class="inline-flex items-center px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-600 text-[10px] font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                      <svg class="w-2.5 h-2.5 mr-0.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      Pago Pendiente
                    </span>
                    <span v-if="service.rawStatus === 'pendiente_cotizacion'" class="inline-flex items-center px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-600 text-[10px] font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                      <svg class="w-2.5 h-2.5 mr-0.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                      Cotización Lista
                    </span>
                  </div>
                </div>
              </div>

              <!-- Location and Schedule -->
              <div class="space-y-2 mb-2">
                <!-- Extended Location -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <p class="text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">📍 UBICACIÓN</p>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-semibold">{{ service.fullLocation.colonia }}</p>
                  <p class="text-blue-700 dark:text-blue-300 text-xs">{{ service.fullLocation.direccion }}</p>
                </div> 
              </div>
              
              <!-- Service Description -->
              <p class="text-gray-700 dark:text-gray-300 text-sm mb-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                {{ service.description }}
              </p> 

              <!-- Action Buttons -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500 dark:text-gray-400 text-xs">{{ service.date }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {{ service.rawStatus === 'finalizado' ? 'Calificar Servicio' : 'Ver detalles' }}
                  </span>
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredServices.length === 0" class="text-center py-6">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span class="text-2xl">🔍</span>
            </div>
            <h3 class="text-base font-black text-gray-900 dark:text-white mb-2">No hay servicios</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-3 text-sm">No se encontraron servicios con los filtros seleccionados</p>
            <button @click="resetFilters" class="px-3 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm">
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
      leave-to-class="modal-leave-to">
      <div v-if="showServiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
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
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Encabezado del modal -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-base">
                    {{ selectedService.icon }}
                  </div>
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white">{{ selectedService.title }}</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      Número de referencia #{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}
                    </p>
                  </div>
                </div>
                <button @click="closeAllModals" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contenido principal del modal -->
            <div class="p-3">
        <!-- 1. Seguimiento del Servicio -->
        <div v-if="selectedService.rawStatus !== 'cancelado'" class="mb-4">  
          <h4 class="text-sm font-black text-gray-900 dark:text-white mb-3">Seguimiento del Servicio</h4> 
          <!-- Timeline Steps -->
          <div class="space-y-2">
            <div v-for="(step, index) in serviceSteps" :key="step.id"
                 class="flex items-start space-x-2">
              <div class="flex-shrink-0 relative">
                <div class="w-6 h-6 rounded-full flex items-center justify-center border-2"
                     :class="getStepStatus(step.id, selectedService.rawStatus).class">
                  <span class="text-xs font-bold" :class="getStepStatus(step.id, selectedService.rawStatus).textClass">
                    {{ getStepStatus(step.id, selectedService.rawStatus).icon }}
                  </span>
                </div>
                <div v-if="index < serviceSteps.length - 1" 
                     class="absolute top-6 left-1/2 transform -translate-x-1/2 w-px h-3"
                     :class="getCurrentStepNumber(selectedService.rawStatus) > step.id ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'"></div>
              </div>
              <div class="flex-1 pb-3">
                <p class="font-bold text-gray-900 dark:text-white text-sm">{{ step.title }}</p>
                <p class="text-gray-600 dark:text-gray-400 text-xs mt-1">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Técnico Asignado -->
        <div v-if="selectedService.technician && selectedService.rawStatus === 'asignado'" class="mb-4">
          <h4 class="text-sm font-black text-gray-900 dark:text-white mb-2">Técnico Asignado</h4>
          <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div class="flex items-center space-x-2 mb-2">
              <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg">👨‍🔧</span>
              </div>
              <div>
                <div class="flex flex-col">
                  <h5 class="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                    {{ selectedService.technicianName || 'Técnico' }}
                  </h5>
                  <div class="flex items-center space-x-1">
                    <span class="flex">
                      <svg v-for="i in 5" :key="i" class="w-3 h-3 fill-current" :class="{ 'text-yellow-400': i <= Math.round(tecnicoRating), 'text-gray-300 dark:text-gray-600': i > Math.round(tecnicoRating) }" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <span class="text-emerald-600 dark:text-emerald-400 text-xs font-bold">({{ tecnicoRating.toFixed(1) }})</span>
                  </div>
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
        <div v-if="selectedService.rawStatus === 'cancelado'" class="mb-4">
          <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border-l-4 border-red-500">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-2">
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Servicio Cancelado</h3>
                <div class="mt-1 text-sm text-red-700 dark:text-red-300"> 
                  <p>Este servicio ha sido cancelado.</p> 
                </div>
              </div>
            </div>
          </div>
        </div> 

        <!-- 3. Acciones - Solo se muestra si hay acciones disponibles -->
        <div v-if="hasActions" class="mb-3">
          <h4 v-if="hasVisibleActions" class="text-sm font-black text-gray-900 dark:text-white mb-2">Acciones</h4>
          <div class="space-y-2">

            <!-- Botón de Cancelar - Visible solo en estados específicos -->
            <div v-if="['pendiente_pagovisita', 'pendiente_asignacion', 'asignado'].includes(selectedService.rawStatus)" class="mb-2">
              <button 
                @click="confirmarCancelar"
                class="w-full flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-base">❌</span>
                  <span class="font-bold text-red-800 dark:text-red-200 text-sm">
                    {{ getCancelButtonText }}
                  </span>
                </div>
                <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div> 

            <!-- Acciones para Cotización Pendiente -->
            <div v-if="selectedService.status === 'Cotización Pendiente'">
              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-lg mb-2">
                <p class="text-yellow-800 dark:text-yellow-200 text-xs font-bold text-center">
                  ⏳ Esperando tu decisión sobre la cotización
                </p>
              </div>
              <button class="w-full flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div class="flex items-center space-x-2">
                  <span class="text-base">💬</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Contactar técnico</span>
                </div>
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div> 

            <!-- Acciones para Servicio Con Pago Pendiente -->
            <div v-if="selectedService.rawStatus === 'pendiente_pagovisita' && selectedService.pagar_visita" class="mb-3"> 
              <button 
                @click="openVisitPaymentModal(selectedService)"
                class="w-full flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors mb-2"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-base">💳</span>
                  <span class="font-bold text-amber-800 dark:text-amber-200 text-sm">Pagar Visita</span>
                </div>
                <svg class="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- Acciones para Pago de Servicio Pendiente -->
            <div v-if="selectedService.rawStatus === 'pendiente_pagoservicio'"> 
              <button 
                @click="openPaymentModal(selectedService)"
                class="w-full flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors mb-2"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-base">💰</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Pagar Servicio</span>
                </div>
                <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Acciones para Cotización Pendiente -->
            <div v-if="selectedService.rawStatus === 'pendiente_cotizacion'">
              <button 
                @click="openQuotationModal(selectedService)"
                class="w-full flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors mb-2"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-base">📝</span>
                  <span class="font-bold text-yellow-800 dark:text-yellow-200 text-sm">Ver Cotización y Diagnóstico</span>
                </div>
                <svg class="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- Acciones para Servicio Finalizado -->
            <div v-if="selectedService.rawStatus === 'finalizado'" class="space-y-2">
              <!-- Botón de Calificar -->
              <button 
                @click="openRatingModal(selectedService)"
                class="w-full flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-base">⭐</span>
                  <span class="font-bold text-yellow-800 dark:text-yellow-200 text-sm">Calificar Servicio</span>
                </div>
                <svg class="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <div v-if="selectedService.rawStatus === 'calificado' || selectedService.rawStatus === 'finalizado'" class="space-y-2">
              <!-- Botón de Reportar Problema -->
              <button 
                @click="reportarProblema"
                class="w-full flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-base">⚠️</span>
                  <span class="font-bold text-red-800 dark:text-red-200 text-sm">Reportar Problema</span>
                </div>
                <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      leave-to-class="modal-leave-to">
      <div v-if="showVisitPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
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
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showVisitPaymentModal"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Encabezado del modal -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-base">
                    💳
                  </div>
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white">Pagar Visita</h3> 
                    <p class="text-xs text-gray-600 dark:text-gray-400">#{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}</p>
                  </div> 
                </div>
                <button @click="closeVisitPaymentModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Contenido principal del modal -->
            <div class="p-3">
              <!-- Service Summary -->
              <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg mb-3">
                <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-2">Pago de la Visita</h4>
                <div class="flex items-center space-x-2 mb-2">
                  <div class="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm">
                    {{ selectedService.icon }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedService.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ selectedService.date }}</p>
                  </div>
                </div>
              </div>

              <!-- Payment Breakdown -->
              <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mb-3">
                <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-2">💰 Desglose de Pago</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between items-center">
                    <span class="text-blue-700 dark:text-blue-300">Visita del Técnico:</span>
                    <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ visitCost }}</span>
                  </div> 
                  <hr class="border-blue-300 dark:border-blue-700">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200">Total a pagar:</span>
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-base">L. {{ visitCost }}</span>
                  </div>
                </div>
              </div>

              <!-- Cuenta Bancaria -->
              <div class="space-y-2 mb-3">
                <label for="bank-account" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Transferencia
                </label>
                <div v-if="isLoadingAccounts" class="py-6 flex flex-col items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando cuentas...</p>
                </div>
                <div v-else class="space-y-3">
                  <select
                    id="bank-account"
                    v-model="selectedAccount"
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200 text-base"
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
                    class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detalles de la cuenta:</h4>
                    <div class="space-y-1">
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Banco:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.banco }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Titular:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.titular }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.tipo_cuenta }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Cuenta:</span>
                        <div class="flex items-center space-x-2">
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {{ getSelectedAccount.numero_cuenta.length > 10 ? getSelectedAccount.numero_cuenta.slice(0, 10) + '...' : getSelectedAccount.numero_cuenta }}
                          </span>
                          <button 
                            v-if="getSelectedAccount.numero_cuenta.length > 10"
                            @click="copyToClipboard(getSelectedAccount.numero_cuenta)"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Copiar número de cuenta"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Input para el número de comprobante -->
                  <div class="space-y-1">
                    <label for="comprobante" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Número de comprobante
                    </label>
                    <input
                      id="comprobante"
                      v-model="comprobante"
                      type="text"
                      class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 text-base"
                      placeholder="Ingresa el número de comprobante"
                    >
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Realiza la transferencia a la cuenta seleccionada e ingresa el número de comprobante.
                    </p>
                  </div>
                </div>

                <!-- Botón de pago -->
                <div class="mt-4">
                  <button 
                    @click="processVisitPayment"
                    :disabled="!selectedAccount || !comprobante || isProcessingPayment"
                    class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
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
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to">

    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">

      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to">
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
        leave-to-class="modal-content-leave-to">
        <div 
          v-if="showPaymentModal"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-base">
                  💳
                </div>
                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">Pagar Servicio</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido principal del modal -->
          <div class="p-3">
            <!-- Resumen del Servicio -->
            <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg mb-3">
              <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-2">Resumen del Servicio</h4>
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm">
                  {{ selectedService.icon }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedService.title }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ selectedService.date }}</p>
                </div>
              </div>
            </div>

            <!-- Desglose de Pago -->
            <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mb-3">
              <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-2">💰 Desglose de Pago</h4>
              <div v-if="isLoadingQuotation" class="py-3 flex justify-center">
                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              <div v-else class="space-y-1 text-sm">
                <!-- Mano de obra -->
                <div class="flex justify-between items-center mb-1">
                  <span class="text-blue-700 dark:text-blue-300">Mano de obra:</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ parseFloat(quotationData?.monto_manodeobra || 0).toFixed(2) }}</span>
                </div>
                
                <!-- Descuento por membresía -->
                <template v-if="shouldShowDiscountBenefit">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-blue-700 dark:text-blue-300">Descuento por membresía:</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400">
                      -L. {{ (parseFloat(quotationData?.monto_manodeobra || 0) * discountPercentage).toFixed(2) }}
                    </span>
                  </div>
                  </template>

                <!-- Crédito de membresía -->
                <template v-if="shouldShowCreditBenefit && membresiaProgreso?.monto_credito_mostrado > 0">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-blue-700 dark:text-blue-300">Crédito de membresía:</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400">
                      -L. {{ parseFloat(membresiaProgreso?.monto_credito_mostrado || 0).toFixed(2) }} 
                    </span>
                  </div>
                </template>
                
                <!-- Total a pagar -->
                <div class="flex justify-between items-center pt-2 mt-2 border-t border-blue-200 dark:border-blue-700">
                  <span class="font-bold text-blue-800 dark:text-blue-100">Total a pagar:</span>
                  <span class="font-bold text-lg text-blue-800 dark:text-blue-100">
                    L. {{ totalAPagar.toFixed(2) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Sección de Cuenta Bancaria -->
            <div class="space-y-2 mb-3">
              <label for="bank-account" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Transferencia
              </label>
              <div v-if="isLoadingAccounts" class="py-6 flex flex-col items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando cuentas...</p>
              </div>
              <div v-else class="space-y-3">
                <select
                  id="bank-account"
                  v-model="selectedAccount"
                  class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200 text-base"
                  :disabled="bankAccounts.length === 0"
                >
                  <option value="" disabled selected>Selecciona una cuenta</option>
                  <option 
                    v-for="account in bankAccounts" 
                    :key="account.id_cuenta" 
                    :value="account.id_cuenta"
                    class="py-2"
                  >
                    {{ account.banco }}
                  </option>
                </select>

                  <!-- Detalles de la cuenta seleccionada -->
                  <div 
                    v-if="getSelectedAccount" 
                    class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detalles de la cuenta:</h4>
                    <div class="space-y-1">
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Nombre:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.banco }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Titular:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.titular }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ getSelectedAccount.tipo_cuenta }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500 dark:text-gray-400">Cuenta:</span>
                        <div class="flex items-center space-x-2">
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                            {{ getSelectedAccount.numero_cuenta.length > 10 ? getSelectedAccount.numero_cuenta.slice(0, 10) + '...' : getSelectedAccount.numero_cuenta }}
                          </span>
                          <button 
                            v-if="getSelectedAccount.numero_cuenta.length > 10"
                            @click="copyToClipboard(getSelectedAccount.numero_cuenta)"
                            class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="Copiar número de cuenta"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                <!-- Input para el número de comprobante -->
                <div class="space-y-1">
                  <label for="comprobante" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de comprobante
                  </label>
                  <input
                    id="comprobante"
                    v-model="comprobante"
                    type="text"
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 text-base"
                    placeholder="Ingresa el número de comprobante"
                  >
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Realiza la transferencia a la cuenta seleccionada e ingresa el número de comprobante.
                  </p>
                </div>
              </div>

              <!-- Botón de pago -->
              <div class="mt-4">
                <button 
                  @click="processPayment"
                  :disabled="!selectedAccount || !comprobante || isProcessingPayment"
                  class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  <span v-if="!isProcessingPayment">
                    Procesar Pago L. {{ totalAPagar.toFixed(2) }}
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
    leave-to-class="modal-leave-to">
    <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to">
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
        leave-to-class="modal-content-leave-to">
        <div 
          v-if="showCancelModal"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center text-base">
                  ✖
                </div>
                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">
                    {{ cancelModalTexts[selectedService.rawStatus]?.title || 'Cancelar Servicio' }}
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closeCancelModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido principal del modal -->
          <div class="p-3">
            <div class="space-y-3">
              <div class="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg mb-3">
                <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                  {{ cancelModalTexts[selectedService.rawStatus]?.message || '¿Estás seguro de que deseas cancelar este servicio?' }}
                </p>
              </div>

              <div class="space-y-2">
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Por favor, indícanos el motivo de la cancelación:
                </p>
                <textarea 
                  v-model="cancelAdditionalInfo" 
                  rows="3" 
                  class="w-full px-3 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Describe el motivo de la cancelación..."
                ></textarea> 
              </div>
            </div>
          </div>

          <!-- Pie del modal -->
          <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 px-3 py-2 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex justify-end space-x-2 backdrop-blur-sm">
            <button 
              @click="closeCancelModal" 
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Volver atrás
            </button>
            <button 
              @click="cancelarSolicitud" 
              :disabled="!cancelAdditionalInfo.trim() || isCancelling"
              class="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              <span v-if="!isCancelling">
                Confirmar cancelación
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

  <!-- Modal de Cotización -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to">
    <div v-if="showQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to">
        <div 
          v-if="showQuotationModal"
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="showQuotationModal = false"
        ></div>
      </Transition>

      <!-- Contenido del modal con animación -->
      <Transition
        name="modal-content"
        enter-active-class="modal-content-enter-active"
        leave-active-class="modal-content-leave-active"
        enter-from-class="modal-content-enter-from"
        leave-to-class="modal-content-leave-to">
        <div 
          v-if="showQuotationModal"
          class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
          @click.stop
        >
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center text-base">
                  📝
                </div>
                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">Cotización del Servicio</h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">#{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="showQuotationModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido principal del modal -->
          <div class="p-3">
            <!-- Cargando -->
            <div v-if="isLoadingQuotation" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            
            <!-- Contenido de la cotización -->
            <template v-else>
              <!-- Tarjeta de diagnóstico -->
              <div class="bg-white dark:bg-gray-700/50 rounded-lg shadow-sm p-3 mb-3 border border-gray-100 dark:border-gray-700">
                <div class="flex items-start space-x-2 mb-2">
                  <div class="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg class="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">Diagnóstico Técnico</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Análisis realizado por el técnico</p>
                  </div>
                </div>
                <div class="bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg">
                  <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {{ quotationData?.comentario || 'No se proporcionó un diagnóstico detallado.' }}
                  </p>
                </div>
              </div>
              
              <!-- Tarjeta de costos -->
              <div class="bg-white dark:bg-gray-700/50 rounded-lg shadow-sm p-3 mb-3 border border-gray-100 dark:border-gray-700">
                <div class="flex items-start space-x-2 mb-2">
                  <div class="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <svg class="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900 dark:text-white">Detalle de Costos</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Desglose de la cotización</p>
                  </div>
                </div>
                
                <div class="space-y-2">
                  <!-- Item de costo fijo -->
                  <div class="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                    <div>
                      <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Mano de Obra</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Servicio técnico especializado</p>
                    </div>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">L. {{ formatCurrency(quotationData?.monto_manodeobra) || '0.00' }}</span>
                  </div>
                  
                  <!-- Estimación de materiales -->
                  <div class="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <div class="flex items-start space-x-1">
                      <svg class="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 100 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                      </svg>
                      <div>
                        <p class="text-xs font-medium text-amber-800 dark:text-amber-200">Estimación de Materiales (puede variar)</p>
                        <p class="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                          El costo de materiales es solo una estimación y podrá variar según disponibilidad y necesidades reales del servicio.
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 flex justify-between items-center pt-1 border-t border-amber-100 dark:border-amber-900/30">
                      <span class="text-xs font-medium text-amber-800 dark:text-amber-200">Monto estimado:</span>
                      <span class="text-xs font-bold text-amber-900 dark:text-amber-100">L. {{ formatCurrency(quotationData?.monto_materiales) || '0.00' }}</span>
                    </div>
                  </div>
                  
                  <!-- Total -->
                  <div class="flex justify-between items-center pt-2">
                    <div>
                      <span class="text-sm font-bold text-gray-900 dark:text-white">Total a pagar</span>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Solo incluye mano de obra</p>
                    </div>
                    <div class="text-right">
                      <p class="text-base font-bold text-blue-600 dark:text-blue-400">
                        L. {{ formatCurrency(quotationData?.monto_manodeobra || '0.00') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Información adicional -->
              <div class="text-center mb-3">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <span class="inline-flex items-center">
                    <svg class="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    Esta cotización tiene una validez de 7 días
                  </span>
                </p>
              </div>
            </template>
          </div>

          <!-- Pie del modal -->
          <div v-if="!isLoadingQuotation" class="sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 px-3 py-2 border-t border-gray-200 dark:border-gray-700 rounded-b-xl backdrop-blur-sm">
            <div class="flex space-x-2">
              <button 
                @click="confirmRejectQuotation"
                :disabled="isProcessingQuotation"
                class="flex-1 py-2 px-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg border border-gray-200 dark:border-gray-600 transition-colors flex items-center justify-center space-x-1 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg class="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                <span>Rechazar</span>
              </button>
              <button 
                @click="acceptQuotation"
                :disabled="isProcessingQuotation"
                class="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg transition-all transform hover:shadow-lg flex items-center justify-center space-x-1 text-sm disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <svg v-if="!isProcessingQuotation" class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ isProcessingQuotation ? 'Procesando...' : 'Aceptar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Modal de Confirmación de Rechazo de Cotización -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showRejectConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to"
      >
        <div 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="showRejectConfirmation = false"
        ></div>
      </Transition>

      <!-- Contenido del modal -->
      <Transition
        name="modal-content"
        enter-active-class="modal-content-enter-active"
        leave-active-class="modal-content-leave-active"
        enter-from-class="modal-content-enter-from"
        leave-to-class="modal-content-leave-to"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <svg class="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">¿Estás seguro?</h3>
              </div>
              <button 
                @click="showRejectConfirmation = false"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cuerpo del modal -->
          <div class="p-4">
            <p class="text-gray-700 dark:text-gray-300 mb-4 text-sm">
              Al rechazar esta cotización, se asignará un nuevo técnico para que realice una nueva valoración. 
              ¿Deseas continuar con el rechazo de la cotización actual?
            </p>
            
            <div class="flex justify-end space-x-2 mt-4">
              <button
                @click="showRejectConfirmation = false"
                class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                :disabled="isProcessingQuotation"
              >
                Cancelar
              </button>
              <button
                @click="rejectQuotation"
                class="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center space-x-1"
                :disabled="isProcessingQuotation"
              >
                <svg v-if="isProcessingQuotation" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isProcessingQuotation ? 'Procesando...' : 'Sí, rechazar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Modal de Calificación -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showRatingModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to"
      >
        <div 
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeAllModals"
        ></div>
      </Transition>

      <!-- Contenido del modal -->
      <Transition
        name="modal-content"
        enter-active-class="modal-content-enter-active"
        leave-active-class="modal-content-leave-active"
        enter-from-class="modal-content-enter-from"
        leave-to-class="modal-content-leave-to"
      >
        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <svg class="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 class="text-base font-bold text-gray-900 dark:text-white">Calificar Servicio</h3>
              </div>
              <button 
                @click="closeAllModals"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cuerpo del modal -->
          <div class="p-4">
            <p class="text-gray-700 dark:text-gray-300 mb-4 text-sm">
              Por favor califica el servicio recibido. Tu opinión nos ayuda a mejorar.
            </p>
            
            <!-- Estrellas de calificación -->
            <div class="flex justify-center mb-4">
              <div class="flex space-x-1">
                <button 
                  v-for="i in 5" 
                  :key="i"
                  @click="rating = i"
                  class="focus:outline-none"
                >
                  <svg 
                    class="w-8 h-8" 
                    :class="i <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Comentario opcional -->
            <div class="mb-4">
              <label for="comment" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comentario (opcional)
              </label>
              <textarea
                id="comment"
                v-model="comment"
                rows="3"
                class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white transition-all duration-200 text-sm"
                placeholder="¿Cómo fue tu experiencia con el servicio?"
              ></textarea>
            </div>

            <!-- Botones de acción -->
            <div class="flex justify-end space-x-2 mt-4">
              <button
                @click="closeAllModals"
                class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                :disabled="isSubmittingRating"
              >
                Cancelar
              </button>
              <button
                @click="submitRating"
                class="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors flex items-center space-x-1"
                :disabled="rating === 0 || isSubmittingRating"
              >
                <svg v-if="isSubmittingRating" class="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSubmittingRating ? 'Enviando...' : 'Enviar calificación' }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
<style scoped>
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

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de Servicios - Gestiona tus servicios y membresía' },
    { name: 'keywords', content: 'dashboard, HogarSeguro, servicios, membresía, panel de control' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Service filters
const serviceFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completados' },
  { key: 'cancelled', label: 'Cancelados' }
]

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

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga y datos principales
const isLoading = ref(true)
const discountPercentage = ref(0) // Porcentaje de descuento obtenido del backend
const userData = ref({
  id: null,
  identidad: '',
  nombre: 'Invitado',
  email: '',
  role: '',
  rol_nombre: 'Invitado',
  name: 'Invitado',
  ...(userCookie.value || {})
})

// Datos de servicios
const servicesData = ref({
  solicitudes: [],
  total: 0,
  finalizadas: 0,
  pendientes: 0,
  canceladas: 0
})
const allServices = ref([])
const serviceTypes = ref([])
const isLoadingServiceTypes = ref(false)

// Estados de modales
const showServiceModal = ref(false)
const showPaymentModal = ref(false) 
const showVisitPaymentModal = ref(false)
const showCancelModal = ref(false)
const showQuotationModal = ref(false)
const showRatingModal = ref(false)

// Estados para calificación
const rating = ref(0)
const comment = ref('')
const isSubmittingRating = ref(false)
const tecnicoRating = ref(0)
const isLoadingTecnicoRating = ref(false)

// Estados de cotización
const quotationData = ref(null)
const isLoadingQuotation = ref(false)
const isProcessingQuotation = ref(false)
const isRejectingQuotation = ref(false)
const showRejectConfirmation = ref(false)
const rejectReason = ref('') 

// Estados de filtros
const showFilters = ref(false)
const currentFilter = ref('all')
const currentDateFilter = ref('all')
const selectedServiceTypes = ref([])

// Estados de servicios
const selectedServiceId = ref(null)

// Estados de beneficios de membresía
const membresiaBeneficios = ref([])
const isLoadingBeneficios = ref(false)

// Estados de cancelación
const cancelReason = ref('')
const cancelAdditionalInfo = ref('')
const isCancelling = ref(false)

// Estados de pago
const isLoadingAccounts = ref(false)
const bankAccounts = ref([])
const selectedAccount = ref('')
const comprobante = ref('')
const isProcessingPayment = ref(false)
const isProcessingVisitPayment = ref(false) // Estado para el procesamiento del pago de visita
const membresiaProgreso = ref(null)
const isLoadingMembresia = ref(false)
const visitCost = ref(0)

// Estados de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// =========================
// COMPUTED PROPERTIES
// =========================

const totalServices = computed(() => servicesData.value.total || allServices.value.length)
const completedServices = computed(() => servicesData.value.finalizadas || allServices.value.filter(s => s.status === 'Servicio Completado').length)
const pendingServices = computed(() => servicesData.value.pendientes || allServices.value.filter(s => !['Servicio Completado', 'Cancelado'].includes(s.status)).length)

// Referencia reactiva para almacenar el servicio seleccionado
const selectedServiceRef = ref({})

// Propiedad computada para acceder al servicio seleccionado
const selectedService = computed(() => {
  if (!selectedServiceId.value) return {}
  const service = allServices.value.find(s => s.id === selectedServiceId.value)
  return service || {}
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
      return selectedServiceTypes.value.some(typeName => 
        serviceTypes.value.some(st => st && st.name === typeName && st.name === s.title)
      )
    })
  }
  
  return filtered
})

const hasVisibleActions = computed(() => {
  if (!selectedService.value) return false;
  
  const status = selectedService.value.rawStatus;
  
  if (['pendiente_asignacion', 'asignado', 'cotizacion_pendiente', 'cotizacion_aprobada', 'cotizacion_rechazada'].includes(status)) return true;
  if (status === 'pendiente_pagovisita' && selectedService.value.pagar_visita) return true;
  if (status === 'pendiente_pagoservicio') return true;
  if (status === 'pendiente_cotizacion') return true;
  if (status === 'finalizado') return true;
  
  return false;
});

const hasActions = computed(() => {
  if (!selectedService.value) return false;
  
  const status = selectedService.value.rawStatus;
  
  if (['pendiente_pagoservicio', 'finalizado'].includes(status)) return true;
  
  if (status === 'en_proceso') return false;
  
  return true;
});

const getSelectedAccount = computed(() => {
  if (!selectedAccount.value) return null;
  return bankAccounts.value.find(acc => acc.id_cuenta === selectedAccount.value) || null;
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

// Computed properties para determinar si mostrar los beneficios
const shouldShowDiscountBenefit = computed(() => {
  if (!membresiaBeneficios.value.length || !membresiaProgreso.value) return false;
  
  const discountBenefit = membresiaBeneficios.value.find(
    beneficio => beneficio.tipo_beneficio === 'Descuento en todos los servicios'
  );
  
  if (!discountBenefit) return false;
  
  return membresiaProgreso.value.mesesProgreso >= discountBenefit.mes_requerido;
});

const shouldShowCreditBenefit = computed(() => {
  if (!membresiaBeneficios.value.length || !membresiaProgreso.value) return false;
  
  const creditBenefit = membresiaBeneficios.value.find(
    beneficio => beneficio.tipo_beneficio === 'Crédito acumulativo'
  );
  
  if (!creditBenefit) return false;
  
  return membresiaProgreso.value.mesesProgreso >= creditBenefit.mes_requerido;
});

// =========================
// FUNCIONES UTILITARIAS
// =========================

const formatCurrency = (value) => {
  if (!value) return '0.00'
  return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  }
  return date.toLocaleDateString('es-ES', options)
}

const formatDateDDMMYY = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

const getServiceIcon = () => {
  return '🛠️'
}

const getStatusColor = (status) => {
  const colors = {
    'Servicio Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Verificando Pago de la Visita': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Pago Visita Rechazado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Pago del Servicio Rechazado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Verificando Pago del Servicio': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
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

const getCurrentStepNumber = (status) => {
  const statusToStep = { 
    'pendiente_pagovisita': 1,
    'pendiente_asignacion': 1,
    'verificando_pagovisita': 1, 
    'asignado': 2,
    'pendiente_cotizacion': 3,
    'en_proceso': 4,
    'pendiente_pagoservicio': 5,
    'verificando_pagoservicio': 5,
    'calificado': 6,
    'finalizado': 6,
    'cancelado': 0
  }
  return statusToStep[status] || 1
}

const getStepStatus = (stepId, rawStatus) => {
  const currentStep = getCurrentStepNumber(rawStatus)
  
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

// =========================
// FUNCIONES DE MAPEO DE DATOS
// =========================

const mapApiStatusToLocal = (apiStatus, servicio = {}) => {
  
  // Si el estado es 'pendiente_pagovisita' y el pago fue rechazado, mostramos 'Pago Visita Rechazado'
  if (apiStatus === 'pendiente_pagovisita' && servicio.pagovisitaRechazado) {
    return 'Pago Visita Rechazado';
  }
  
  // Si el estado es 'pendiente_pagoservicio' y la cotización fue rechazada, mostramos 'Pago del Servicio Rechazado'
  if (apiStatus === 'pendiente_pagoservicio' && servicio.cotizacion_estado === 'rechazado') {
    return 'Pago del Servicio Rechazado';
  }
  
  const statusMap = {
    'pendiente_pagovisita': 'Pago de la Visita',
    'verificando_pagovisita': 'Verificando Pago de la Visita',
    'pendiente_asignacion': 'Esperando Asignación de Técnico',
    'asignado': 'Técnico Asignado',
    'pendiente_cotizacion': 'Diagnóstico Realizado',
    'en_proceso': 'Servicio en Curso',
    'pendiente_pagoservicio': 'Pago del Servicio',
    'verificando_pagoservicio': 'Verificando Pago del Servicio',
    'finalizado': 'Servicio Completado',
    'calificado': 'Servicio Completado',
    'cancelado': 'Cancelado'
  }
  return statusMap[apiStatus] || 'En Progreso'
}

const mapApiServiceToLocal = (apiService) => { 
  
  // Inicializar los estados de pago
  const pagovisitaRechazado = apiService.pago_estado === 'rechazado';
  const cotizacionRechazada = apiService.cotizacion_estado === 'rechazado';
  
  // Crear objeto con los datos del servicio
  const servicioMapeado = {
    id: apiService.id_solicitud,
    serviceId: apiService.id_servicio,
    pagovisitaRechazado: pagovisitaRechazado,
    cotizacion_estado: apiService.cotizacion_estado || 'pendiente',
    title: apiService.servicio?.nombre || 'Servicio General',
    icon: getServiceIcon(apiService.id_servicio),
    status: mapApiStatusToLocal(apiService.estado, { 
      pagovisitaRechazado,
      cotizacion_estado: apiService.cotizacion_estado 
    }),
    rawStatus: apiService.estado,
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
    technician: apiService.id_tecnico
  }; 
  return servicioMapeado;
}

// =========================
// FUNCIONES DE CARGA DE DATOS
// =========================

// Función para obtener los beneficios de membresía
const fetchMembresiaBeneficios = async () => {
  try {
    isLoadingBeneficios.value = true;
    
    const response = await $fetch('/membresiabeneficios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response && response.beneficios) {
      membresiaBeneficios.value = response.beneficios;
    }
  } catch (error) {
    console.error('Error al obtener beneficios de membresía:', error);
    membresiaBeneficios.value = [];
  } finally {
    isLoadingBeneficios.value = false;
  }
};

// Obtener el porcentaje de descuento del backend
const fetchDiscountPercentage = async () => {
  try {
    const response = await $fetch('/config/valor/porcentaje_descuento', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response && response.valor) {
      discountPercentage.value = parseFloat(response.valor) / 100 // Convertir de porcentaje a decimal
    }
  } catch (error) {
    console.error('Error al obtener el porcentaje de descuento:', error)
    // Usar un valor por defecto en caso de error
    discountPercentage.value = 0 // 0% por defecto
  }
}

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

    servicesData.value = response;
    
    // Verificar el estado de los pagos para cada solicitud
    const solicitudesConPago = await Promise.all(response.solicitudes.map(async (solicitud) => {
      // Verificar estado del pago de la visita si corresponde
      if (solicitud.estado === 'pendiente_pagovisita') {
        console.log(`🔍 [${new Date().toISOString()}] Verificando estado de pago para solicitud ${solicitud.id_solicitud}`);
        
        try {
          console.log(`📡 [${new Date().toISOString()}] Solicitando estado de pago a: /pagovisita/solicitud/${solicitud.id_solicitud}`);
          
          const pagoResponse = await $fetch(`/pagovisita/solicitud/${solicitud.id_solicitud}`, {
            baseURL: config.public.apiBase,
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${useCookie('token').value}`
            }
          });
          
          console.log(`✅ [${new Date().toISOString()}] Respuesta de pago para solicitud ${solicitud.id_solicitud}:`, pagoResponse);
          
          // Extraer el estado del pago de la respuesta anidada
          const estadoPago = pagoResponse.data?.estado || 'pendiente';
          
          const solicitudActualizada = {
            ...solicitud,
            pago_estado: estadoPago,
            _rawPagoResponse: pagoResponse // Guardar la respuesta completa para depuración
          };
          
          console.log(`📊 [${new Date().toISOString()}] Estado de pago extraído para solicitud ${solicitud.id_solicitud}:`, estadoPago);
          
          console.log(`📝 [${new Date().toISOString()}] Actualizando estado de pago para solicitud ${solicitud.id_solicitud}: ${solicitudActualizada.pago_estado}`);
          
          return solicitudActualizada;
          
        } catch (error) {
          console.error(`❌ [${new Date().toISOString()}] Error al verificar pago para solicitud ${solicitud.id_solicitud}:`, {
            error: error.message,
            stack: error.stack
          });
          
          return {
            ...solicitud,
            pago_estado: 'pendiente',
            _error: error.message
          };
        }
        }
      
      // Verificar estado de la cotización si corresponde
      if (solicitud.estado === 'pendiente_pagoservicio') {
        try {
          const response = await $fetch(`/cotizacion/solicitud/${solicitud.id_solicitud}`, {
            baseURL: config.public.apiBase,
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${useCookie('token').value}`
            }
          });
          
          // Verificar si la respuesta tiene el formato esperado
          if (response && response.status === 'success' && response.data) {
            const cotizacion = response.data;
            return {
              ...solicitud,
              cotizacion_estado: cotizacion.estado
            };
          }
          
          return {
            ...solicitud,
            cotizacion_estado: 'pendiente'
          };
          
        } catch (error) {
          console.error('Error al verificar el estado de la cotización:', {
            message: error.message,
            statusCode: error.statusCode,
            response: error.data
          });
          return {
            ...solicitud,
            cotizacion_estado: 'pendiente'
          };
        }
      }
      
      return solicitud;
    }));
    
    // Mapear los servicios con la información de pago actualizada
    allServices.value = solicitudesConPago.map(solicitud => {
      const servicioMapeado = mapApiServiceToLocal(solicitud);
      // Agregar el nombre del técnico si está disponible
      if (solicitud.tecnico?.nombre) {
        servicioMapeado.technicianName = solicitud.tecnico.nombre;
      }
      return servicioMapeado;
    });
    
  } catch (error) {
    console.error('Error cargando servicios:', error)
    showError('Error al cargar los servicios')
  }
}

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

const fetchQuotationData = async (solicitudId) => {
  try {
    isLoadingQuotation.value = true
    const token = useCookie('token').value
    
    const response = await $fetch(`/cotizacion/solicitud/${solicitudId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Verificar si la respuesta tiene la estructura esperada
    if (response && response.data) {
      // Si la respuesta tiene un campo data, usarlo
      quotationData.value = response.data
    } else if (response) {
      // Si la respuesta es directa, usarla como está
      quotationData.value = response
    } else {
      console.warn('No se encontraron datos de cotización')
      showError('No se encontró información de cotización para este servicio')
      quotationData.value = null
      return null
    }
    
    // Verificar que el ID de cotización esté presente
    if (!quotationData.value?.id && !quotationData.value?.id_cotizacion) {
      console.error('La cotización no tiene un ID válido:', quotationData.value)
      showError('La cotización no tiene un ID válido')
      return null
    }
    
    return quotationData.value
  } catch (error) {
    console.error('Error al cargar la cotización:', error)
    showError('No se pudo cargar la información de la cotización. Por favor, intente nuevamente.')
    quotationData.value = null
    throw error // Relanzar el error para que el llamador pueda manejarlo si es necesario
  } finally {
    isLoadingQuotation.value = false
  }
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
      bankAccounts.value = data.map(account => ({
        id_cuenta: account.id_cuenta,
        banco: account.banco,
        numero_cuenta: account.num_cuenta,
        tipo_cuenta: account.tipo,
        titular: account.beneficiario || 'Titular no especificado',
        activo: account.activo === 1
      }));
      
      selectedAccount.value = '';
    }
  } catch (error) {
    console.error('Error al obtener cuentas bancarias:', error);
    showError('No se pudieron cargar las cuentas bancarias');
  } finally {
    isLoadingAccounts.value = false;
  }
};

const fetchVisitCost = async () => {
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
  }
};

// =========================
// FUNCIONES DE MODALES
// =========================

const openServiceModal = async (service) => {
  console.log('Datos completos del servicio:', JSON.parse(JSON.stringify(service)));
  
  // Crear una copia del servicio para no modificar el original
  const serviceCopy = { ...service };
  
  // Si hay un técnico asignado y el estado es 'calificado', cargar su calificación
  if (service.technician && service.rawStatus === 'calificado') {
    // Usar el nombre del técnico si ya está disponible
    if (service.technicianName) {
      serviceCopy.technicianName = service.technicianName;
    } else if (service.tecnico?.nombre) {
      serviceCopy.technicianName = service.tecnico.nombre;
    } else {
      serviceCopy.technicianName = `Técnico #${service.technician}`;
    }
    
    // Cargar la calificación del técnico solo si el estado es 'calificado'
    await fetchTecnicoRating(service.technician);
  }

  selectedServiceId.value = service.id;
  selectedServiceRef.value = serviceCopy;
  showServiceModal.value = true;
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

const openPaymentModal = async (service) => {
  try {
    // Actualizar el ID del servicio seleccionado en lugar de la propiedad computada
    selectedServiceId.value = service?.id || null
    showPaymentModal.value = true
    
    // Resetear datos de membresía
    membresiaProgreso.value = null
    
    // Cargar cuentas bancarias y progreso de membresía en paralelo
    await Promise.all([
      fetchBankAccounts(),
      userData.value?.id_usuario ? fetchCreditoUsuario(userData.value.id_usuario) : Promise.resolve()
    ])
    
    // Cargar la cotización
    if (service?.id) { 
      await fetchQuotationData(service.id)
      // Calcular el total una vez que tenemos todos los datos
      totalAPagar.value = calcularTotal()
    } else {
      console.error('No se pudo obtener el ID del servicio')
    }
  } catch (error) {
    console.error('Error al cargar datos del pago:', error)
    showError('No se pudieron cargar los datos del pago. Intente nuevamente.')
  }
}

const closePaymentModal = () => {
  showPaymentModal.value = false
  selectedAccount.value = ''
  comprobante.value = ''
  isProcessingPayment.value = false
}

const openQuotationModal = async (service) => {
  try {
    // Mostrar indicador de carga
    isLoadingQuotation.value = true;
    
    // Cerrar el modal de servicio si está abierto
    showServiceModal.value = false;
    
    // Establecer el servicio seleccionado
    selectedServiceId.value = service.id;
    selectedServiceRef.value = service;
    
    // Cargar los datos de la cotización
    await fetchQuotationData(service.id);
    
    // Mostrar el modal de cotización
    showQuotationModal.value = true;
  } catch (error) {
    console.error('Error al abrir el modal de cotización:', error);
    showError('No se pudo cargar la cotización. Por favor, inténtalo de nuevo.');
  } finally {
    isLoadingQuotation.value = false;
  }
}

const confirmarCancelar = () => {
  cancelAdditionalInfo.value = ''
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  setTimeout(() => {
    cancelReason.value = ''
    cancelAdditionalInfo.value = ''
  }, 300)
}

const closeAllModals = () => {
  // Cerrar todos los modales
  showServiceModal.value = false
  showPaymentModal.value = false
  showVisitPaymentModal.value = false
  showCancelModal.value = false
  showQuotationModal.value = false
  showRejectConfirmation.value = false
  showRatingModal.value = false
  
  // Limpiar el servicio seleccionado
  selectedServiceId.value = null
  selectedServiceRef.value = {}
  
  // Limpiar el formulario de pago
  selectedAccount.value = null
  comprobante.value = ''
  
  // Restablecer estados de carga
  isProcessingPayment.value = false
  isProcessingVisitPayment.value = false
  isProcessingQuotation.value = false
  isRejectingQuotation.value = false
  
  // Limpiar formularios
  cancelReason.value = ''
  cancelAdditionalInfo.value = ''
  rejectReason.value = ''
  
  // Limpiar formulario de calificación
  rating.value = 0
  comment.value = ''
  isSubmittingRating.value = false
}  

const fetchMembresiaProgreso = async (userId) => {
  try {
    isLoadingMembresia.value = true;
    const token = useCookie('token').value;
    
    if (!token) {
      console.error('[fetchMembresiaProgreso] No se encontró token de autenticación');
      return;
    }
    
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    // Obtener progreso de membresía
    const [membresiaResponse, creditoResponse] = await Promise.all([
      $fetch(`/membresia/progreso/${userId}`, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers
      }),
      // Obtener crédito del usuario
      $fetch(`/credito/usuario/${userId}`, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers
      }).catch(error => {
        console.error('[fetchMembresiaProgreso] Error al obtener crédito del usuario:', error);
        return { success: false, data: { monto_credito: 0 } };
      })
    ]);
    
    // Procesar respuesta de crédito del usuario
    const creditoUsuario = creditoResponse?.success ? creditoResponse.data : { monto_credito: 0 };
    
    // Verificar si la respuesta de membresía tiene el formato esperado
    if (membresiaResponse?.status === 'success') {
      membresiaProgreso.value = {
        monto_credito: parseFloat(creditoUsuario.monto_credito || 0), // Usar el crédito del usuario
        mesesProgreso: parseInt(membresiaResponse.mesesProgreso || 0),
        montoTotal: parseFloat(membresiaResponse.montoTotal || 0),
        valorMembresia: parseFloat(membresiaResponse.valorMembresia || 0),
        id_credito_usuario: creditoUsuario.id_credito_usuario,
        fecha_credito: creditoUsuario.fecha
      };
    } else {
      // Si no hay datos de membresía, usar solo el crédito del usuario
      membresiaProgreso.value = {
        monto_credito: parseFloat(creditoUsuario.monto_credito || 0),
        mesesProgreso: 0,
        montoTotal: 0,
        valorMembresia: 0,
        id_credito_usuario: creditoUsuario.id_credito_usuario,
        fecha_credito: creditoUsuario.fecha
      };
    }
    
    return membresiaProgreso.value;
  } catch (error) {
    console.error('[fetchMembresiaProgreso] Error en la petición:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.data,
      stack: error.stack
    });
    membresiaProgreso.value = null;
    return null;
  } finally {
    isLoadingMembresia.value = false;
  }
}

// Función obsoleta, mantener por compatibilidad
const fetchCreditoUsuario = fetchMembresiaProgreso;

const openRatingModal = (service) => {
  // Cerrar el modal de servicio si está abierto
  if (showServiceModal.value) {
    showServiceModal.value = false
  }
  
  // Actualizar el servicio seleccionado
  selectedServiceId.value = service.id
  selectedServiceRef.value = { ...service }
  
  // Reiniciar el formulario de calificación
  rating.value = 0
  comment.value = ''
  isSubmittingRating.value = false
  
  // Mostrar el modal de calificación
  showRatingModal.value = true
  
  // Forzar actualización del DOM si es necesario
  nextTick(() => {
    // Código que necesite esperar a que el modal esté en el DOM
  })
}

const submitRating = async () => {
  const currentService = selectedService.value.id ? selectedService.value : selectedServiceRef.value
  
  if (!currentService || !currentService.id || !rating.value) {
    showError('Por favor, selecciona una calificación')
    return
  }

  try {
    isSubmittingRating.value = true
    
    const token = useCookie('token').value
    const user = useCookie('user').value
    
    if (!token || !user) {
      showError('No se pudo autenticar. Por favor, inicia sesión nuevamente.')
      return
    }

    const ratingData = {
      id_solicitud: currentService.id,
      id_usuario_calificado: currentService.technician,
      id_usuario_calificador: user.id_usuario,
      calificacion: rating.value,
      comentario: comment.value.trim() || 'Sin Comentarios',
      fecha: new Date().toISOString().split('T')[0]
    }

    // 1. Enviar la calificación
    const response = await $fetch('/calificaciones', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(ratingData)
    })
    
    try {
      // Actualizar el estado del servicio a 'calificado' directamente
      const updateResponse = await $fetch(`/solicitudservicio/${currentService.id}`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estado: 'calificado'
        })
      }) 

      // Actualizar el estado local
      const serviceIndex = allServices.value.findIndex(s => s.id === currentService.id)
      if (serviceIndex !== -1) {
        allServices.value[serviceIndex].estatus = 'calificado'
        allServices.value[serviceIndex].status = 'Calificado'
      }

      showSuccess('¡Calificación Enviada!', 'Gracias por tu Calificación.')
      showRatingModal.value = false
      
      // Recargar los servicios para actualizar la lista
      await loadServices()
    } catch (updateError) {
      console.error('Error al actualizar el estado del servicio:', updateError) 
      showError('Ocurrió un error. Por favor, inténtalo de nuevo.')
      showRatingModal.value = false
      await loadServices()
    }
  } catch (error) {
    console.error('Error al enviar la calificación:', error)
    showError('Ocurrió un error al enviar la calificación. Por favor, inténtalo de nuevo.')
  } finally {
    isSubmittingRating.value = false
  }
}

// =========================
// FUNCIONES DE COTIZACIÓN
// =========================

const acceptQuotation = async () => {
  // Deshabilitar botones mientras se procesa
  isProcessingQuotation.value = true
  
  try {
    console.log('=== INICIO acceptQuotation ===');
    const cotizacionId = quotationData.value?.id || quotationData.value?.id_cotizacion;
    console.log('ID de cotización:', cotizacionId);
    
    if (!cotizacionId) throw new Error('No se pudo encontrar el ID de la cotización');
    
    const token = useCookie('token').value;
    if (!token) throw new Error('No se encontró el token de autenticación');
    
    // 1. Aceptar la cotización
    console.log('\n[1/3] Actualizando estado de la cotización a "aceptado"...');
    const cotizacionUpdate = { estado: 'aceptado' };
    console.log('Enviando a /cotizacion/' + cotizacionId + ':', cotizacionUpdate);
    
    const cotizacionResponse = await $fetch(`/cotizacion/${cotizacionId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(cotizacionUpdate)
    });
    console.log('Respuesta de actualización de cotización:', cotizacionResponse);
    
    // 2. Actualizar el estado de la solicitud
    console.log('\n[2/3] Actualizando estado de la solicitud a "en_proceso"...');
    if (!selectedServiceId.value) throw new Error('No se encontró el ID de la solicitud de servicio');
    
    const solicitudUpdate = { estado: 'en_proceso' };
    console.log('Enviando a /solicitudservicio/' + selectedServiceId.value + ':', solicitudUpdate);
    
    const solicitudResponse = await $fetch(`/solicitudservicio/${selectedServiceId.value}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(solicitudUpdate)
    });
    console.log('Respuesta de actualización de solicitud:', solicitudResponse);
    
    // 3. Registrar movimiento
    console.log('\n[3/3] Registrando movimiento...');
    
    // Obtener el ID del técnico de los datos del servicio
    const servicioActual = servicesData.value.solicitudes.find(s => s.id_solicitud === selectedServiceId.value);
    const idTecnico = servicioActual?.id_tecnico;
    console.log('ID del técnico:', idTecnico);
    
    if (!idTecnico) throw new Error('No se encontró el ID del técnico en la solicitud de servicio');
    
    console.log('Obteniendo porcentaje de comisión...');
    const configResponse = await $fetch('/config/valor/comision_por_servicio', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Respuesta de configuración de comisión:', configResponse);
    
    if (!configResponse?.valor) throw new Error('No se pudo obtener el porcentaje de comisión');
    
    const porcentajeComision = parseFloat(configResponse.valor);
    const factorComision = porcentajeComision / 100;
    console.log('Porcentaje de comisión:', porcentajeComision + '%', 'Factor:', factorComision);
    
    // Obtener el monto de mano de obra del campo correcto
    const montoManoObra = Number(quotationData.value.monto_manodeobra); 
    console.log('Monto de mano de obra:', montoManoObra);
    
    if (isNaN(montoManoObra) || montoManoObra <= 0) {
      throw new Error(`El monto de mano de obra no es válido: ${quotationData.value.monto_manodeobra}`);
    } 
    
    const montoTecnico = montoManoObra * factorComision;
    const fechaActual = new Date().toISOString().split('T')[0];
    console.log('Monto para el técnico (comisión):', montoTecnico);

    const movimientoData = {
      id_usuario: idTecnico,
      id_cotizacion: cotizacionId,
      tipo: 'ingreso',
      monto: Number(montoTecnico.toFixed(2)), 
      fecha: fechaActual,
      estado: 'pendiente'
    };
    
    console.log('Creando movimiento con datos:', movimientoData);
    
    const movimientoResponse = await $fetch('/movimientos', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(movimientoData)
    });
    
    console.log('Respuesta de creación de movimiento:', movimientoResponse);
    
    // ✅ Cerrar modal y recargar datos
    showQuotationModal.value = false;
    console.log('Cerrando modal de cotización...');
    
    await new Promise(resolve => setTimeout(resolve, 300)); // esperar animación
    console.log('Recargando servicios...');
    await loadServices();
    
    console.log('=== FINALIZADO CON ÉXITO ===');
    showSuccess('Cotización aceptada', 'El servicio ha sido iniciado correctamente');
    
  } catch (error) {
    console.error('=== ERROR EN acceptQuotation ===');
    console.error('Mensaje de error:', error.message);
    console.error('Respuesta del servidor:', error.response?._data || 'No hay respuesta del servidor');
    console.error('Estado de la respuesta:', error.response?.status, error.response?.statusText);
    console.error('Datos enviados:', error.config?.data || 'No hay datos de solicitud');
    
    showError(error.message || 'Ocurrió un error al procesar la cotización');
  } finally {
    isProcessingQuotation.value = false;
  }
}

const confirmRejectQuotation = () => {
  showRejectConfirmation.value = true;
}

const rejectQuotation = async () => {
  try {
    
    const cotizacionId = quotationData.value?.id || quotationData.value?.id_cotizacion
    
    if (!cotizacionId) {
      console.error('ID de cotización no encontrado en quotationData:', quotationData.value)
      showError('No se pudo encontrar el ID de la cotización para rechazar')
      return
    }
    
    const token = useCookie('token').value
    if (!token) {
      console.error('Token de autenticación no encontrado')
      showError('No se encontró el token de autenticación')
      return
    }
    
    // Cerrar el modal de confirmación
    showRejectConfirmation.value = false;
    
    // Deshabilitar botones mientras se procesa
    isProcessingQuotation.value = true
    
    // 1. Rechazar la cotización
    await $fetch(`/cotizacion/${cotizacionId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        estado: 'rechazado'
      })
    });
    
    // 2. Actualizar el estado de la solicitud a 'pendiente_asignacion'
    if (selectedServiceId.value) {
      try {
        await $fetch(`/solicitudservicio/${selectedServiceId.value}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            estado: 'pendiente_asignacion'
          })
        });
        console.log('Estado de la solicitud actualizado a "pendiente_asignacion"');
      } catch (updateError) {
        console.error('Error al actualizar el estado de la solicitud:', updateError);
        // No mostramos error al usuario para no confundirlo, ya que la cotización sí se rechazó
      }
    }
    
    // Cerrar el modal de cotización
    showQuotationModal.value = false
    
    // Esperar a que la animación del modal termine
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Recargar los servicios
    await loadServices()
    
    // Mostrar notificación de éxito después de actualizar todo
    showSuccess('Cotización rechazada correctamente. Un nuevo técnico será asignado a tu solicitud.')
    
  } catch (error) {
    console.error('Error al rechazar la cotización:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      response: error.data,
      stack: error.stack
    })
    showError(`Error al rechazar la cotización: ${error.message || 'Error desconocido'}`)
  } finally {
    isProcessingQuotation.value = false
  }
}

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

const processVisitPayment = async () => {
  if (!selectedAccount.value) {
    showError('Por favor selecciona una cuenta bancaria');
    return;
  }
  
  if (!comprobante.value?.trim()) {
    showError('Por favor ingresa el número de comprobante');
    return;
  }

  isProcessingPayment.value = true;
  
  try {
    const userData = useCookie('user').value;
    if (!userData?.id_usuario) {
      throw new Error('No se pudo identificar al usuario');
    }
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const fechaISO = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    
    const requestData = {
      id_usuario: userData.id_usuario,
      id_solicitud: selectedService.value.id,
      id_cuenta: selectedAccount.value,
      monto: visitCost.value,
      num_comprobante: comprobante.value.trim(),
      fecha: fechaISO
    };
    
    const authToken = useCookie('token').value;
    
    await $fetch('/pagovisita', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: requestData
    });
    
    const token = useCookie('token').value;
    
    try {
      await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
        method: 'PUT',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'verificando_pagovisita' })
      }); 
    } catch (updateError) {
      console.error('Error al actualizar el estado de la solicitud:', updateError);
      throw new Error(`Error al actualizar el estado de la solicitud: ${updateError.message}`);
    }
    
    closeVisitPaymentModal();
    await loadServices();
    
    showSuccess(
      '¡Pago Enviado!',
      'Una vez se verifique el pago, se le asignará un técnico.'
    );
    
    selectedAccount.value = '';
    comprobante.value = '';
    
  } catch (error) {
    console.error('Error al procesar el pago de la visita:', error);
    showError(
      error.data?.message || error.response?._data?.message || error.message || 'No se pudo completar la operación. Por favor, inténtalo de nuevo.'
    );
  } finally {
    isProcessingPayment.value = false;
  }
}


// =========================
// FUNCIONES DE PAGO
// =========================
const processPayment = async () => { 
  const payload = {
    id_cotizacion: Number(quotationData.value.id_cotizacion),
    id_solicitud: Number(selectedService.value.id),
    id_cuenta: Number(selectedAccount.value),
    monto_credito: Number(parseFloat(membresiaProgreso.value?.monto_credito_mostrado || 0)),
    num_comprobante: comprobante.value,
    monto_manodeobra: totalAPagar.value,
    descuento_membresia: Math.round(parseFloat(quotationData.value?.monto_manodeobra || 0) * (discountPercentage.value || 0) * 100) / 100,
    id_usuario: auth.user.id_usuario,
    nombre: auth.user.nombre
  };

  console.log('🛰️ Enviando al backend /pagoservicio/procesar:', payload);

  try {
    const response = await $fetch('/pagoservicio/procesar', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('token').value}`
      },
      body: JSON.stringify(payload)
    });

    console.log('✅ Respuesta del backend /pagoservicio/procesar:', response);
    
    // Cerrar el modal de pago
    showPaymentModal.value = false;
    
    // Limpiar datos temporales
    comprobante.value = '';
    selectedAccount.value = null;
    
    // Actualizar la lista de servicios
    await loadServices();
    
    // Mostrar mensaje de éxito
    showSuccess('Pago procesado correctamente');
    
    // Cerrar cualquier otro modal abierto
    showQuotationModal.value = false;
  } catch (error) {
    console.error('❌ Error al procesar pago:', {
      status: error.response?.status,
      data: error.response?._data,
      message: error.message
    });

    const msg = error.response?._data?.message || 'Error al procesar el pago';
    
    // Cerrar el modal de pago en caso de error
    showPaymentModal.value = false;
    
    // Mostrar mensaje de error
    showError(msg);
  }
};
 

const cancelarSolicitud = async () => {
  if (!cancelAdditionalInfo.value.trim()) {
    showError('Por favor, escribe el motivo de la cancelación')
    return
  }

  isCancelling.value = true
  
  try {
    const token = useCookie('token').value
    
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

    closeCancelModal()
    
    showSuccess('Solicitud cancelada', 'El servicio ha sido cancelado correctamente')
    
    await loadServices()
    
  } catch (error) {
    console.error('Error al cancelar el servicio:', error)
    showError('Error al cancelar el servicio. Por favor, inténtalo de nuevo.')
  } finally {
    isCancelling.value = false
  }
} 

const reportarProblema = () => {
  navigateTo('/cliente/soporte#problemaServicio');
  closeServiceModal();
};

// =========================
// FUNCIONES DE FILTROS
// =========================

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

// =========================
// FUNCIONES DE CÁLCULO
// =========================

const totalAPagar = ref(0)

// Función para calcular el total basado en los beneficios dinámicos
const calcularTotal = () => {
  const montoManodeObra = parseFloat(quotationData.value?.monto_manodeobra || 0)
  
  // Solo aplicar descuento si se cumple el beneficio
  const montoDescuento = shouldShowDiscountBenefit.value 
    ? montoManodeObra * discountPercentage.value 
    : 0
    
  // Calcular el monto después del descuento
  const montoDespuesDescuento = montoManodeObra - montoDescuento
    
  // Solo aplicar crédito si se cumple el beneficio
  const creditoDisponible = shouldShowCreditBenefit.value 
    ? parseFloat(membresiaProgreso.value?.monto_credito || 0)
    : 0
    
  // El crédito aplicado no puede ser mayor al monto después del descuento
  const montoCreditoAplicado = Math.min(creditoDisponible, montoDespuesDescuento)
  
  // Actualizar el monto de crédito mostrado
  if (membresiaProgreso.value) {
    membresiaProgreso.value.monto_credito_mostrado = montoCreditoAplicado
  }
    
  return Math.max(0, montoDespuesDescuento - montoCreditoAplicado)
}

// Actualizar el total cuando cambien los datos relevantes
watch([() => quotationData.value?.monto_manodeobra, 
      () => membresiaProgreso.value?.monto_credito,
      () => membresiaProgreso.value?.mesesProgreso,
      () => discountPercentage.value,
      () => membresiaBeneficios.value], () => {
  totalAPagar.value = calcularTotal()
}, { immediate: true })

// Obtener calificación del técnico - solo para servicios calificados
const fetchTecnicoRating = async (idTecnico) => {
  if (!idTecnico) return
  
  try {
    isLoadingTecnicoRating.value = true
    const token = useCookie('token').value
    
    const response = await $fetch(`/calificaciones/usuario/${idTecnico}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    // Asumimos que el endpoint devuelve un objeto con la calificación promedio
    if (response && response.promedio) {
      tecnicoRating.value = response.promedio
    } else if (response && response.data?.length > 0) {
      // Si el endpoint devuelve un array de calificaciones, calcular el promedio
      const suma = response.data.reduce((acc, cal) => acc + cal.calificacion, 0)
      tecnicoRating.value = suma / response.data.length
    }
  } catch (error) {
    console.error('Error al obtener calificación del técnico:', error)
    tecnicoRating.value = 0
  } finally {
    isLoadingTecnicoRating.value = false
  }
}

// =========================
// FUNCIONES DE UTILIDAD
// =========================

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    showSuccess('Número de cuenta copiado')
  }).catch(err => {
    console.error('Error al copiar al portapapeles:', err)
    showError('No se pudo copiar al portapapeles')
  })
}

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

const showToast = (options) => {
  toast.value.show = false;
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message || options.title,
      type: options.type || 'info',
      duration: options.duration || 5000
    };
  });
};

const showSuccess = (title, message) => {
  showToast({
    type: 'success',
    message: message ? `${title}\n${message}` : title,
    duration: 5000
  });
};

const showError = (message) => {
  console.error('Error:', message);
  
  showToast({
    message: typeof message === 'string' ? message : 'Ocurrió un error inesperado',
    type: 'error',
    duration: 8000
  });
};

// =========================
// INICIALIZACIÓN
// =========================
// Cargar datos iniciales al montar el componente
onMounted(async () => {
  try {
    // Cargar datos de configuración primero
    await Promise.all([
      fetchDiscountPercentage(),
      fetchMembresiaBeneficios()
    ]);
    
    // Luego cargar datos principales
    await Promise.all([
      loadServices(),
      loadServiceTypes(),
      fetchBankAccounts(),
      fetchVisitCost()
    ]);
    
    // Si hay un usuario autenticado, cargar su progreso de membresía
    if (auth.user?.id) {
      await fetchMembresiaProgreso(auth.user.id);
    }
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    showToast({
      message: 'Error al cargar los datos. Por favor, recarga la página.',
      type: 'error',
      duration: 5000
    });
  } finally {
    isLoading.value = false;
  }
});

</script> 