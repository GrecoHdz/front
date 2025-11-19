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
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
     
     <HeadersHeaderServiciosTecnico 
       :total-services="totalServices"
       :show-filters="showFilters"
       :service-types="serviceTypes"
       :current-filter="currentFilter"
       :current-date-filter="currentDateFilter"
       :selected-service-types="selectedServiceTypes"
       :is-loading-service-types="isLoadingServiceTypes"
       :technician-status="technicianStatus"
       @toggle-filters="showFilters = !showFilters"
       @filter-change="currentFilter = $event"
       @service-type-toggle="toggleServiceTypeFilter($event)"
       @date-filter-change="currentDateFilter = $event" 
     />

    <!-- Content Container -->
    <div class="max-w-xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
      <div class="pb-20">
        <!-- Main Content -->
        <main class="pb-4">
          
          <!-- Stats Overview -->
          <section class="px-3 sm:px-4 py-3 sm:py-4">
            <div class="grid grid-cols-3 gap-2 mb-3 sm:mb-4">
              <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-lg sm:text-xl font-black text-orange-600 dark:text-orange-400 mb-1">{{ stats.total }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Total</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 mb-1">{{ stats.activas }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Asignados</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-lg sm:text-xl font-black text-green-600 dark:text-green-400 mb-1">{{ stats.finalizadas }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Finalizadas</p>
              </div>
            </div>
          </section> 

          <!-- Services List -->
          <section class="px-3 sm:px-4">
            <div class="space-y-2 sm:space-y-3">
              <div v-for="service in filteredServices" :key="service.id"
                   @click="openServiceModal(service)"
                   class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border-t-4 border-blue-500 dark:border-blue-600 border-b border-l border-r border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative group">
                <!-- Barra superior de estado -->
                <div class="absolute top-0 left-0 right-0 h-1 rounded-t-lg" 
                     :class="{
                       'bg-blue-500': ['asignado', 'pendiente_cotizacion', 'en_proceso'].includes(service.rawStatus),
                       'bg-green-500': ['pendiente_pagoservicio', 'verificando_pagoservicio', 'finalizado', 'calificado'].includes(service.rawStatus),
                       'bg-red-500': ['cancelado'].includes(service.rawStatus)
                     }">
                </div>

                <!-- Service Header -->
                <div class="flex items-start justify-between mb-2 sm:mb-3">
                  <div class="flex items-center space-x-2 sm:space-x-3">
                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center text-lg sm:text-xl">
                      {{ service.icon }}
                    </div>
                    <div>
                      <p class="font-black text-gray-900 dark:text-white text-sm sm:text-base">{{ service.title }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ service.date }} • #{{ service.serviceNumber }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full" :class="getStatusColor(service.rawStatus)">
                      {{ service.status }}
                    </span>
                  </div>
                </div>

                <!-- Cliente Info -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg mb-2 sm:mb-3">
                  <p class="text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">👤 CLIENTE</p>
                  <p class="text-blue-800 dark:text-blue-200 text-xs sm:text-sm font-semibold">{{ service.customer.name }}</p>
                  <p class="text-blue-700 dark:text-blue-300 text-xs">{{ service.customer.phone }}</p> 
                </div>
                
                <!-- Location -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-2.5 sm:p-3 rounded-lg mb-2 sm:mb-3">
                  <p class="text-gray-600 dark:text-gray-400 text-xs font-bold mb-1">📍 UBICACIÓN</p>
                  <p class="text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-semibold">{{ service.location.neighborhood }}</p>
                  <p class="text-gray-700 dark:text-gray-300 text-xs">{{ service.location.address }}</p>
                </div>
                
                <!-- Service Description -->
                <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 bg-gray-50 dark:bg-gray-700/50 p-2.5 sm:p-3 rounded-lg">
                  {{ service.description }}
                </p> 

                <!-- Action Buttons -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-500 dark:text-gray-400 text-xs">{{ getTimeAgo(service.rawDate) }}</span>
                  </div>
                  <div class="flex items-center space-x-1 sm:space-x-2">
                    <span v-if="service.rawStatus === 'asignado'" class="text-green-600 dark:text-green-400 text-xs font-bold">Crear cotización</span>
                    <span v-else-if="service.rawStatus === 'en_proceso'" class="text-green-600 dark:text-green-400 text-xs font-bold">Completar Servicio</span>
                    <span v-else class="text-blue-600 dark:text-blue-400 text-xs font-bold">Ver detalles</span>
                    <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredServices.length === 0" class="text-center py-6 sm:py-8">
              <div class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg sm:rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                <span class="text-2xl sm:text-3xl">🔍</span>
              </div>
              <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">No hay servicios asignados</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">No tienes servicios asignados con los filtros seleccionados</p>
              <button @click="resetFilters" class="px-3 sm:px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm">
                Limpiar filtros
              </button>
            </div>

            <!-- Botón Ver más -->
            <div v-if="hasMore && !isLoading" class="mt-4 text-center">
              <button 
                @click="loadServices(true)" 
                :disabled="isLoadingMore"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-xs mx-auto flex items-center justify-center"
              >
                <span v-if="!isLoadingMore">Ver más servicios</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </span>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>

    <FootersFooterTecnico /> 
    </div>
  </div>

    <!-- Service Detail Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showServiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showServiceModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeServiceModal"
          ></div>
        </Transition>

        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showServiceModal"
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg">
                    {{ selectedService.icon }}
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">{{ selectedService.title }}</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService.serviceNumber }}</p>
                  </div>
                </div>
                <button @click="closeServiceModal" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-3 sm:p-4">
              <!-- Customer Details -->
              <div class="mb-4 sm:mb-6">
                <h4 class="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-2 sm:mb-3">Información del Cliente</h4>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg sm:rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <p class="font-bold text-blue-800 dark:text-blue-200 text-sm">{{ selectedService.customer?.name }}</p>
                      <p class="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">{{ selectedService.customer?.phone }}</p>
                    </div>
                    <button @click="callCustomer(selectedService.customer?.phone)" class="p-1.5 sm:p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Location Details -->
              <div class="mb-4 sm:mb-6">
                <h4 class="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-2 sm:mb-3">Ubicación del Servicio</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl">
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedService.location?.neighborhood }}</p>
                  <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mt-1">{{ selectedService.location?.address }}</p> 
                </div>
              </div>

              <!-- Service Description -->
              <div class="mb-4 sm:mb-6">
                <h4 class="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-2 sm:mb-3">Descripción del Problema</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-2.5 sm:p-3 rounded-lg">
                  <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{{ selectedService.description }}</p>
                </div>
              </div>

              <!-- Calificación del Servicio -->
              <div v-if="selectedService.rawStatus === 'finalizado'" class="mb-4 sm:mb-6">
                <h4 class="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-2 sm:mb-3">Valoración del Cliente</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg">
                  <template v-if="selectedService.calificacion">
                    <div class="flex items-center mb-2">
                      <div class="flex space-x-1">
                        <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                          <template v-if="i <= selectedService.calificacion.calificacion">
                            ⭐
                          </template>
                          <template v-else>
                            <span class="text-gray-300 dark:text-gray-600">☆</span>
                          </template>
                        </span>
                      </div>
                      <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {{ selectedService.calificacion.calificacion.toFixed(1) }}/5.0
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {{ formatDate(selectedService.calificacion.fecha) }}
                      </span>
                    </div>
                    <p v-if="selectedService.calificacion.comentario" class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm italic mt-2 pl-1 border-l-2 border-blue-200 dark:border-blue-800">
                      "{{ selectedService.calificacion.comentario }}"
                    </p>
                  </template>
                  <p v-else class="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    El cliente no ha dejado ninguna valoración.
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-2 sm:space-y-3">
                <!-- Action Buttons Based on Status -->
                <template v-if="selectedService.rawStatus === 'asignado'">
                  <button 
                    @click="openQuotationModal" 
                    class="w-full py-2.5 sm:py-3 bg-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm">
                    📋 Crear Cotización
                  </button>
                  
                  <button 
                    @click="confirmCancelService" 
                    class="w-full py-2.5 sm:py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold rounded-lg sm:rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm">
                    ❌ Cancelar Servicio
                  </button>
                </template>

                <template v-else-if="selectedService.rawStatus === 'en_proceso'">
                  <button 
                    @click="openCompleteConfirmation(selectedService, $event)" 
                    class="w-full py-2.5 sm:py-3 bg-green-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-green-700 transition-colors text-sm">
                    ✅ Completar Servicio
                  </button>
                  
                  <button 
                    @click="confirmCancelService" 
                    class="w-full py-2.5 sm:py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold rounded-lg sm:rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm">
                    ❌ Cancelar Servicio
                  </button>
                </template>

                <template v-else-if="selectedService.rawStatus === 'pendiente_cotizacion'">
                  <button 
                    @click="openQuotationModal" 
                    class="w-full py-2.5 sm:py-3 bg-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors text-sm">
                    ✏️ Editar Cotización
                  </button>
                </template>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Quotation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showQuotationModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeQuotationModal"
          ></div>
        </Transition>

        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showQuotationModal"
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Crear Cotización</h3>
                <button @click="closeQuotationModal" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quotation Form -->
            <div class="p-3 sm:p-4">
              <form @submit.prevent="submitQuotation" class="space-y-3 sm:space-y-4">
                <!-- Comentario/Diagnóstico -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Diagnóstico</label>
                  <textarea v-model="quotationForm.comentario" 
                            rows="4" 
                            required
                            class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                            placeholder="Escriba su Diagnóstico"></textarea>
                </div>

                <!-- Monto Mano de Obra -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Mano de Obra (L.)</label>
                  <input v-model.number="quotationForm.monto_manodeobra" 
                         type="number" 
                         step="0.01" 
                         min="0" 
                         required
                         class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                         placeholder="0.00">
                </div>

                <!-- Monto Materiales -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Materiales (L.) - Estimado</label>
                  <input v-model.number="quotationForm.monto_materiales" 
                         type="number" 
                         step="0.01" 
                         min="0"
                         class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                         placeholder="0.00">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Este es un estimado que puede variar</p>
                </div>

                <!-- Total -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Total Estimado:</span>
                    <span class="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                      L. {{ (Number(quotationForm.monto_manodeobra || 0) + Number(quotationForm.monto_materiales || 0)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        :disabled="isSubmittingQuotation"
                        class="w-full py-2.5 sm:py-3 bg-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm">
                  <span v-if="!isSubmittingQuotation">Enviar Cotización</span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                </button>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- View/Edit Quotation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showViewQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showViewQuotationModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeViewQuotationModal"
          ></div>
        </Transition>

        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showViewQuotationModal"
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Editar Cotización</h3>
                <button @click="closeViewQuotationModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quotation Form -->
            <div class="p-3 sm:p-4">
              <form @submit.prevent="updateQuotation" class="space-y-3 sm:space-y-4">
                <!-- Comentario/Diagnóstico -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Diagnóstico</label>
                  <textarea 
                    v-model="currentQuotation.comentario" 
                    rows="4" 
                    required
                    class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="Escriba su Diagnóstico">
                  </textarea>
                </div>

                <!-- Monto Mano de Obra -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Mano de Obra (L.)</label>
                  <input 
                    v-model.number="currentQuotation.monto_manodeobra" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required
                    class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="0.00">
                </div>

                <!-- Monto Materiales -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Materiales (L.) - Estimado</label>
                  <input 
                    v-model.number="currentQuotation.monto_materiales" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="0.00">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Este es un estimado que puede variar</p>
                </div>

                <!-- Total -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Total Estimado:</span>
                    <span class="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                      L. {{ (parseFloat(currentQuotation.monto_manodeobra || 0) + parseFloat(currentQuotation.monto_materiales || 0)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex space-x-2 sm:space-x-3">
                  <button 
                    type="button"
                    @click="closeViewQuotationModal"
                    class="w-1/2 py-2.5 sm:py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    :disabled="isUpdatingQuotation || !currentQuotation.comentario || !currentQuotation.monto_manodeobra"
                    class="w-1/2 py-2.5 sm:py-3 bg-blue-600 text-white font-bold rounded-lg sm:rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm">
                    <span v-if="!isUpdatingQuotation">Guardar Cambios</span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Complete Service Confirmation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showCompleteConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCompleteConfirmation = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-4 sm:p-6 relative z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-3 sm:mb-4">
              <span class="text-green-600 dark:text-green-400 text-lg sm:text-xl">✅</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">¿Completar servicio?</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
              ¿Deseas marcar este servicio como completado? Puedes agregar un comentario opcional.
            </p>
            
            <!-- Comentario opcional -->
            <div class="mb-3 sm:mb-4 text-left">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comentario (opcional)</label>
              <textarea 
                v-model="completeServiceComment"
                class="w-full px-2.5 sm:px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                rows="3"></textarea>
            </div>
            
            <div class="flex gap-2 sm:gap-3">
              <button 
                @click="showCompleteConfirmation = false"
                class="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                Cancelar
              </button>
              <button 
                @click="confirmCompleteService"
                class="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm">
                <span v-if="!isCompleting">Sí, completar</span>
                <svg v-else class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cancel Service Confirmation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showCancelConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCancelConfirmation = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-4 sm:p-6 relative z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-3 sm:mb-4">
              <span class="text-red-600 dark:text-red-400 text-lg sm:text-xl">❌</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">¿Cancelar servicio?</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
              ¿Estás seguro de que deseas cancelar este servicio? El estado cambiará a 'Pendiente de asignación'.
            </p>
            
            <div class="flex gap-2 sm:gap-3">
              <button 
                @click="showCancelConfirmation = false"
                class="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
                No, mantener
              </button>
              <button 
                @click="cancelService"
                class="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-sm">
                Sí, cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// ===== VARIABLES DE CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard Técnico',
  meta: [
    { name: 'description', content: 'Panel de Técnico - Gestiona tus servicios asignados' }, 
    { name: 'keywords', content: 'HogarSeguro, Técnico, Servicios, Asignados' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// ===== CONSTANTES =====
const itemsPerPage = 2

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isLoadingMore = ref(false)
const showFilters = ref(false)
const isLoadingServiceTypes = ref(false)
const showServiceModal = ref(false)
const showQuotationModal = ref(false)
const showViewQuotationModal = ref(false)
const showCancelConfirmation = ref(false)
const showCompleteConfirmation = ref(false)
const isCompleting = ref(false)
const isSubmittingQuotation = ref(false)
const isUpdatingQuotation = ref(false)

// Paginación
const currentPage = ref(1)
const hasMore = ref(false)

// Filtros
const currentFilter = ref('all')
const currentDateFilter = ref('all')
const selectedServiceTypes = ref([])

// Comentarios y estados
const completeServiceComment = ref('')
const currentServiceToComplete = ref(null)
const technicianStatus = ref('available')

// Datos principales
const serviceTypes = ref([])
const apiResponse = ref({
  solicitudes: [],
  total: 0,
  finalizadas: 0,
  activas: 0
})

// Servicio seleccionado
const selectedService = ref({
  title: '',
  serviceNumber: '',
  icon: '',
  customer: {},
  location: {},
  description: '',
  rawStatus: '',
  calificacion: null
})

// Formularios
const quotationForm = ref({
  comentario: '',
  monto_manodeobra: 0,
  monto_materiales: 0
})

const currentQuotation = ref({
  id: null,
  monto_manodeobra: 0,
  monto_materiales: 0,
  comentario: '',
  fecha: new Date().toISOString()
})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== COMPUTED PROPERTIES =====
const totalServices = computed(() => apiResponse.value.total)

const stats = computed(() => ({
  total: apiResponse.value.total,
  activas: apiResponse.value.activas,
  finalizadas: apiResponse.value.finalizadas
}))

const filteredServices = computed(() => {
  let solicitudes = [...(apiResponse.value.solicitudes || [])]
  
  // Aplicar filtro de estado
  if (currentFilter.value === 'asignado') {
    solicitudes = solicitudes.filter(s => 
      s.estado === 'asignado' || 
      s.estado === 'pendiente_cotizacion' || 
      s.estado === 'en_proceso'
    )
  } else if (currentFilter.value === 'finalizado') {
    solicitudes = solicitudes.filter(s => 
      s.estado === 'finalizado' || 
      s.estado === 'calificado' || 
      s.estado === 'pendiente_pagoservicio' || 
      s.estado === 'verificando_pagoservicio'
    )
  } else if (currentFilter.value !== 'all') {
    solicitudes = solicitudes.filter(s => s.estado === currentFilter.value)
  }
  
  // Aplicar filtro de tipos de servicio si hay alguno seleccionado
  if (selectedServiceTypes.value.length > 0) {
    solicitudes = solicitudes.filter(s => {
      const servicioNombre = s.servicio?.nombre?.toLowerCase() || ''
      return selectedServiceTypes.value.some(type => 
        servicioNombre.includes(type.toLowerCase())
      )
    })
  }
  
  // Aplicar filtro por fecha
  if (currentDateFilter.value !== 'all') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    solicitudes = solicitudes.filter(s => {
      const fechaSolicitud = new Date(s.fecha_solicitud)
      fechaSolicitud.setHours(0, 0, 0, 0)
      
      switch (currentDateFilter.value) {
        case 'today':
          return fechaSolicitud.getTime() === today.getTime()
          
        case 'week': {
          const startOfWeek = new Date(today)
          startOfWeek.setDate(today.getDate() - today.getDay())
          return fechaSolicitud >= startOfWeek
        }
          
        case 'month': {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
          return fechaSolicitud >= startOfMonth
        }
          
        default:
          return true
      }
    })
  }
  
  // Mapear a formato de servicio
  return solicitudes.map(mapSolicitudToService)
})

// ===== FUNCIONES DE UTILIDAD =====
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-HN', options)
}

const formatDateDDMMYY = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear().toString().slice(-2)
  return `${day}${month}${year}`
}

const getStatusColor = (status) => {
  const colors = {
    'pendiente_asignacion': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'asignado': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'pendiente_cotizacion': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'en_proceso': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'pendiente_pagoservicio': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'verificando_pagoservicio': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'finalizado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'calificado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const getTimeAgo = (dateString) => {
  if (!dateString) return ''
  const now = new Date()
  const date = new Date(dateString)
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Hace unos minutos'
  if (diffInHours < 24) return `Hace ${diffInHours} horas`
  return `Hace ${Math.floor(diffInHours / 24)} días`
}

const getServiceIcon = (estado) => {
  const iconMap = {
    'verificando_pagovisita': '💰',
    'asignado': '👨‍🔧',
    'en_proceso': '⚡',
    'finalizado': '✅',
    'calificado': '⭐',
    'cancelado': '❌'
  }
  
  return iconMap[estado] || '🔧'
}

const mapApiStatusToLocal = (apiStatus) => {
  const statusMap = {
    'pendiente_asignacion': 'Cotización Rechazada',
    'asignado': 'Asignado',
    'pendiente_cotizacion': 'Cotización Enviada',
    'en_proceso': 'En Progreso',
    'pendiente_pagoservicio': 'Finalizado',
    'verificando_pagoservicio': 'Finalizado',
    'finalizado': 'Finalizado',
    'calificado': 'Calificado',
    'cancelado': 'Cancelado'
  }
  
  return statusMap[apiStatus] || 'Estado Desconocido'
}

const mapSolicitudToService = (solicitud) => {
  return {
    id: solicitud.id_solicitud,
    title: solicitud.servicio?.nombre || 'Servicio General',
    description: solicitud.descripcion || 'Sin descripción',
    status: mapApiStatusToLocal(solicitud.estado || 'pendiente'),
    rawStatus: solicitud.estado || 'pendiente',
    serviceNumber: `${formatDateDDMMYY(solicitud.fecha_solicitud)}-${solicitud.id_solicitud}`,
    icon: getServiceIcon(solicitud.estado),
    rawDate: solicitud.fecha_solicitud,
    date: formatDate(solicitud.fecha_solicitud),
    assignedDate: solicitud.fecha_solicitud,
    customer: {
      id: solicitud.cliente?.id_usuario,
      name: solicitud.cliente?.nombre || 'Desconocido',
      phone: solicitud.cliente?.telefono || 'N/A'
    },
    location: {
      neighborhood: solicitud.colonia || 'Sin especificar',
      address: solicitud.direccion_precisa || 'Sin dirección especificada',
      formattedAddress: `${solicitud.direccion_precisa || ''}${solicitud.colonia ? ', ' + solicitud.colonia : ''}`.trim() || 'Sin dirección especificada'
    },
    // Datos adicionales de la API
    cityId: solicitud.id_ciudad,
    technicianId: solicitud.id_tecnico,
    payForVisit: solicitud.pagar_visita,
    comment: solicitud.comentario,
    rawData: solicitud
  }
}

const resetCurrentQuotation = () => {
  currentQuotation.value = {
    id: null,
    monto_manodeobra: 0,
    monto_materiales: 0,
    comentario: '',
    fecha: new Date().toISOString()
  }
}

const showToast = (messageOrOptions, type = 'info', duration = 5000) => {
  if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
    toast.value = {
      show: true,
      message: messageOrOptions.message || '',
      type: messageOrOptions.type || 'info',
      duration: messageOrOptions.duration || 5000
    }
  } else {
    toast.value = {
      show: true,
      message: messageOrOptions || '',
      type: type,
      duration: duration
    }
  }
  
  if (toast.value.message) {
    setTimeout(() => {
      toast.value.show = false
    }, toast.value.duration)
  } else {
    toast.value.show = false
  }
}

// ===== FUNCIONES DE FILTROS =====
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

// ===== FUNCIONES DE CARGA DE DATOS =====
// Variable para mantener el offset actual
const currentOffset = ref(0)

const loadServices = async (loadMore = false) => {
  try {
    if (!loadMore) {
      // Si es una carga inicial, reiniciamos la paginación
      currentOffset.value = 0
      hasMore.value = false
      apiResponse.value.solicitudes = []
      isLoading.value = true
    } else {
      // Si estamos cargando más, actualizamos el loading state
      isLoadingMore.value = true
    }
    
    const userCookieValue = useCookie('user').value
    
    if (!userCookieValue?.id_usuario) {
      console.error('No se encontró ID de usuario')
      showToast({
        message: 'Error: No se encontró información del usuario',
        type: 'error'
      })
      return
    }
    
    const response = await $fetch(`/solicitudservicio/tecnico/${userCookieValue.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      query: {
        offset: currentOffset.value,
        limit: itemsPerPage
      }
    })

    if (!response || !response.solicitudes || !Array.isArray(response.solicitudes)) {
      throw new Error('Formato de respuesta inválido: se esperaba un array en la propiedad "solicitudes"')
    }
    
    // Actualizamos los datos
    if (loadMore) {
      // Concatenamos los nuevos resultados
      apiResponse.value.solicitudes = [
        ...apiResponse.value.solicitudes,
        ...(response.solicitudes || [])
      ]
    } else {
      // Reemplazamos los resultados
      apiResponse.value = response
    }
    
    // Actualizamos el estado de paginación
    hasMore.value = response.hasMore
    currentOffset.value = response.offset || 0
    
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showToast({
      message: 'Error al cargar los servicios. Intente de nuevo más tarde.',
      type: 'error'
    })
    
    if (!loadMore) {
      apiResponse.value = {
        solicitudes: [],
        total: 0,
        finalizadas: 0,
        activas: 0
      }
    }
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
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
    showToast({
      message: 'No se pudieron cargar los tipos de servicio',
      type: 'error'
    })
  } finally {
    isLoadingServiceTypes.value = false
  }
}

const loadCalificacion = async (idSolicitud) => {
  try {  
    const response = await $fetch(`/calificaciones/solicitud/${idSolicitud}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (Array.isArray(response) && response.length > 0) {
      const calificacionData = response[0]
      
      selectedService.value.calificacion = {
        calificacion: Number(calificacionData.calificacion) || 0,
        comentario: calificacionData.comentario || '',
        fecha: calificacionData.fecha || new Date().toISOString()
      }
    } else {
      selectedService.value.calificacion = null
    }
  } catch (error) {
    console.error('Error al cargar la calificación:', error)
    selectedService.value.calificacion = null
  }
}

const loadQuotationDetails = async () => {
  if (!selectedService.value) {
    console.error('No hay servicio seleccionado')
    return
  }

  try {
    isLoading.value = true
    
    const response = await $fetch(`cotizacion/solicitud/${selectedService.value.id}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response && response.status === 'success' && response.data) {
      const cotizacion = response.data 
      
      const cotizacionId = cotizacion.id_cotizacion;
      
      if (!cotizacionId) {
        console.error('La cotización no tiene un ID válido:', cotizacion)
        showToast('Error: La cotización no tiene un ID válido', 'error')
        return
      }
      
      currentQuotation.value = {
        id: cotizacionId,
        monto_manodeobra: parseFloat(cotizacion.monto_manodeobra) || 0,
        monto_materiales: parseFloat(cotizacion.monto_materiales) || 0,
        comentario: cotizacion.comentario || '',
        fecha: cotizacion.fecha || new Date().toISOString(),
        estado: cotizacion.estado
      }
      
      showViewQuotationModal.value = true
      
      await nextTick()
    } else {
      showToast({
        message: 'No se encontró la cotización para este servicio',
        type: 'warning'
      })
    }
  } catch (error) {
    console.error('Error al cargar la cotización:', error)
    showToast({
      message: 'Error al cargar los detalles de la cotización',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
} 

// ===== FUNCIONES DE MODAL =====
const openServiceModal = async (service) => { 
  selectedService.value = { ...service }
  showServiceModal.value = true
  
  const servicioId = service.id || service.id_solicitud 
  
  if (service.rawStatus === 'finalizado') {
    if (servicioId) { 
      await loadCalificacion(servicioId)
    } else {
      console.error('El servicio no tiene un ID de solicitud válido')
      selectedService.value.calificacion = null
    }
  } else { 
    selectedService.value.calificacion = null
  }
}

const closeServiceModal = () => {
  showServiceModal.value = false
  selectedService.value = null
  resetCurrentQuotation()
}

const openQuotationModal = async () => { 
  if (selectedService.value.rawStatus === 'asignado') {
    quotationForm.value = {
      comentario: '',
      monto_manodeobra: 0,
      monto_materiales: 0
    }
    showQuotationModal.value = true
  } else if (selectedService.value.rawStatus === 'pendiente_cotizacion') {
    try {
      await loadQuotationDetails()
    } catch (error) {
      console.error('Error al cargar la cotización:', error)
      showToast('Error al cargar la cotización', 'error')
    }
  }
}

const closeQuotationModal = () => {
  showQuotationModal.value = false
}

const closeViewQuotationModal = () => {
  showViewQuotationModal.value = false
  resetCurrentQuotation()
}

const openCompleteConfirmation = (service, event) => {
  event.stopPropagation()
  currentServiceToComplete.value = service
  completeServiceComment.value = ''
  showCompleteConfirmation.value = true
}

const confirmCancelService = () => {
  showCancelConfirmation.value = true
}

// ===== FUNCIONES DE ACCIONES =====
const submitQuotation = async () => {
  if (!quotationForm.value.comentario.trim() || quotationForm.value.monto_manodeobra <= 0) {
    showToast('Por favor completa todos los campos requeridos', 'error')
    return
  }

  let updateSuccessful = false;
  
  try {
    isSubmittingQuotation.value = true
    
    const cotizacionData = {
      id_solicitud: selectedService.value.id,
      comentario: quotationForm.value.comentario.trim(),
      monto_manodeobra: parseFloat(quotationForm.value.monto_manodeobra),
      monto_materiales: parseFloat(quotationForm.value.monto_materiales) || 0,
      fecha: new Date().toISOString()
    };
    
    console.log('Datos de la cotización a enviar:', JSON.stringify(cotizacionData, null, 2));
    
    const updateResponse = await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: { estado: 'pendiente_cotizacion' }
    });
    
    updateSuccessful = true;
    
    console.log('Actualización de estado exitosa, creando cotización...');
    
    const cotizacionResponse = await $fetch('/cotizacion', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: cotizacionData
    });
    
    console.log('Respuesta del servidor:', cotizacionResponse);
    
    // Notificar al usuario que solicitó el servicio sobre la cotización enviada
    try {
      const userId = selectedService.value.rawData.cliente?.id_usuario;
      
      if (userId) {
        console.log('ID del usuario a notificar:', userId);
        await $fetch('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo: 'Cotización Recibida',
            id_usuario: userId
          })
        });
      } else {
        console.warn('No se pudo obtener el ID del usuario para enviar la notificación');
      }
    } catch (error) {
      console.error('Error al enviar notificación al usuario:', error);
      // No mostrar error al usuario para no afectar su experiencia
    }
    
    showToast('Cotización enviada correctamente', 'success')
    
    closeQuotationModal()
    closeServiceModal()
    await loadServices()
    return true
  } catch (error) {
    console.error('Error en el proceso de cotización:', {
      message: error.message,
      response: error.response?._data || 'No hay respuesta del servidor',
      status: error.response?.status,
      statusText: error.response?.statusText
    });
    
    if (updateSuccessful) {
      try {
        console.log('Intentando revertir el estado de la solicitud...');
        await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
          baseURL: config.public.apiBase,
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: { estado: 'asignado' }
        });
        console.log('Estado de la solicitud revertido exitosamente');
      } catch (revertError) {
        console.error('Error al revertir el estado de la solicitud:', {
          message: revertError.message,
          response: revertError.response?._data || 'No hay respuesta del servidor'
        });
      }
    }
    
    const errorMessage = error.response?._data?.message || 'Error al procesar la cotización. Por favor, intente de nuevo.';
    showToast(errorMessage, 'error');
    return false;
  } finally {
    isSubmittingQuotation.value = false;
  }
}

const updateQuotation = async () => {
  if (!currentQuotation.value.id) {
    console.error('ID de cotización no válido en updateQuotation')
    console.error('currentQuotation.value:', JSON.stringify(currentQuotation.value, null, 2))
    showToast({
      message: 'Error: No se pudo identificar la cotización. Por favor, cierre y vuelva a abrir el formulario.',
      type: 'error'
    })
    return
  }

  if (!currentQuotation.value.monto_manodeobra || !currentQuotation.value.comentario) {
    showToast({
      message: 'Por favor completa todos los campos requeridos',
      type: 'error'
    })
    return
  }

  try {
    isUpdatingQuotation.value = true 
    
    const requestData = {
      monto_manodeobra: parseFloat(currentQuotation.value.monto_manodeobra),
      monto_materiales: parseFloat(currentQuotation.value.monto_materiales),
      comentario: currentQuotation.value.comentario,
      estado: currentQuotation.value.estado || 'pendiente'
    } 
    
    const response = await $fetch(`/cotizacion/${currentQuotation.value.id}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(requestData)
    })
    
    if ((response && response.status === 'success') || (Array.isArray(response) && response.length > 0)) {
      // Notificar al usuario sobre la actualización de la cotización
      try {
        const userId = selectedService.value.rawData.cliente?.id_usuario;
        
        if (userId) {
          console.log('Notificando al usuario sobre cotización actualizada, ID:', userId);
          await $fetch('/notificaciones/enviar', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({
              titulo: 'Cotización Editada',
              id_usuario: userId
            })
          });
        } else {
          console.warn('No se pudo obtener el ID del usuario para notificar sobre la actualización de la cotización');
        }
      } catch (notificationError) {
        console.error('Error al enviar notificación de cotización actualizada:', notificationError);
        // No mostrar error al usuario para no afectar su experiencia
      }
      
      showToast({
        message: 'Cotización actualizada correctamente',
        type: 'success'
      })
      
      closeViewQuotationModal()
      closeServiceModal()
      await loadServices()
    } else {
      throw new Error(response?.message || 'Error desconocido al actualizar la cotización')
    }
  } catch (error) {
    console.error('Error al actualizar la cotización:', error)
    console.error('Detalles del error:', {
      message: error.message,
      response: error.response?._data,
      status: error.response?.status
    })
    
    let errorMessage = 'Error al actualizar la cotización. Por favor, intente de nuevo.'
    
    if (error.response?._data?.message) {
      errorMessage = error.response._data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showToast({
      message: errorMessage,
      type: 'error',
      duration: 5000
    })
  } finally {
    isUpdatingQuotation.value = false
  }
}

const confirmCompleteService = async () => {
  if (!currentServiceToComplete.value) return
  
  isCompleting.value = true
  
  try {
    const response = await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        estado: 'pendiente_pagoservicio',
        comentario: completeServiceComment.value || 'Completado'
      }
    })
    
    // Notificar al usuario que solicitó el servicio sobre la finalización
    try {
      const userId = selectedService.value.rawData.cliente?.id_usuario;
      
      if (userId) {
        console.log('Notificando al usuario sobre servicio completado, ID:', userId);
        await $fetch('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo: 'Servicio Finalizado',
            id_usuario: userId
          })
        });
      } else {
        console.warn('No se pudo obtener el ID del usuario para notificar sobre la finalización del servicio');
      }
    } catch (notificationError) {
      console.error('Error al enviar notificación de servicio completado:', notificationError);
      // No mostrar error al usuario para no afectar su experiencia
    }
    
    showToast('Servicio marcado como completado exitosamente', 'success')
    
    showCompleteConfirmation.value = false
    completeServiceComment.value = ''
    
    await loadServices()
    closeServiceModal()
    
  } catch (error) {
    console.error('Error al completar el servicio:', error)
    showToast('Error al completar el servicio. Por favor, inténtalo de nuevo.', 'error')
  } finally {
    isCompleting.value = false
  }
}

const cancelService = async () => {
  if (!selectedService.value) return
  
  try {
    const response = await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        estado: 'pendiente_asignacion'
      }
    })

    // Notificar al usuario sobre la cancelación del servicio
    try {
      const userId = selectedService.value.rawData.cliente?.id_usuario;
      
      if (userId) {
        console.log('Notificando al usuario sobre servicio cancelado, ID:', userId);
        await $fetch('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo: 'Servicio Cancelado',
            id_usuario: userId
          })
        });
      } else {
        console.warn('No se pudo obtener el ID del usuario para notificar sobre la cancelación del servicio');
      }
    } catch (notificationError) {
      console.error('Error al enviar notificación de servicio cancelado:', notificationError);
      // No mostrar error al usuario para no afectar su experiencia
    }

    showToast('Servicio cancelado correctamente', 'success')

    closeServiceModal()
    showCancelConfirmation.value = false
    await loadServices()
  } catch (error) {
    console.error('Error al cancelar el servicio:', error)
    showToast('Error al cancelar el servicio. Por favor, inténtalo de nuevo.', 'error')
  }
}

const callCustomer = (phone) => {
  if (phone && phone !== 'N/A') {
    window.open(`tel:${phone}`, '_self')
  } else {
    showToast({
      message: 'Número de teléfono no disponible',
      type: 'error'
    })
  }
}

// ===== FUNCIONES DE CONFIGURACIÓN =====
const initializeDarkMode = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
  
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
}

// ===== INICIALIZACIÓN =====
onMounted(() => {
  initializeDarkMode()
  loadServices()
  loadServiceTypes()
})

</script>

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
  animation: modal-enter 0.3s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.modal-content-leave-active {
  animation: modal-leave 0.2s ease-in;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
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

/* Mobile optimizations */
button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

/* Responsive design */
@media (max-width: 640px) {
  .max-w-xl {
    max-width: 100%;
  }
}
</style>