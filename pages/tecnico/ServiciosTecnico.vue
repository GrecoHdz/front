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
      :message="'Cargando Servicios Asignados...'"
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
       @status-toggle="toggleTechnicianStatus"
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
                <div class="text-xl font-black text-blue-600 dark:text-blue-400 mb-1">{{ stats.total }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Total</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-xl font-black text-green-600 dark:text-green-400 mb-1">{{ stats.finalizadas }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Finalizadas</p>
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                <div class="text-xl font-black text-orange-600 dark:text-orange-400 mb-1">{{ stats.activas }}</div>
                <p class="text-xs text-gray-600 dark:text-gray-400 font-bold">Asignados</p>
              </div>
            </div>
          </section> 

          <!-- Services List -->
          <section class="px-4">
            <div class="space-y-3">
              <div v-for="service in filteredServices" :key="service.id"
                   @click="openServiceModal(service)"
                   class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer">

                <!-- Service Header -->
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-xl">
                      {{ service.icon }}
                    </div>
                    <div>
                      <p class="font-black text-gray-900 dark:text-white text-base">{{ service.title }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ service.date }} • #{{ service.serviceNumber }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs font-bold px-2.5 py-0.5 rounded-full" :class="getStatusColor(service.rawStatus)">
                      {{ service.status }}
                    </span>
                  </div>
                </div>

                <!-- Cliente Info -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                  <p class="text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">👤 CLIENTE</p>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-semibold">{{ service.customer.name }}</p>
                  <p class="text-blue-700 dark:text-blue-300 text-xs">{{ service.customer.phone }}</p> 
                </div>
                
                <!-- Location -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-3">
                  <p class="text-gray-600 dark:text-gray-400 text-xs font-bold mb-1">📍 UBICACIÓN</p>
                  <p class="text-gray-800 dark:text-gray-200 text-sm font-semibold">{{ service.location.neighborhood }}</p>
                  <p class="text-gray-700 dark:text-gray-300 text-xs">{{ service.location.address }}</p>
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
            <div v-if="filteredServices.length === 0" class="text-center py-8">
              <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span class="text-3xl">🔍</span>
              </div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">No hay servicios asignados</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">No tienes servicios asignados con los filtros seleccionados</p>
              <button @click="resetFilters" class="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Limpiar filtros
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
      <div v-if="showServiceModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-lg">
                    {{ selectedService.icon }}
                  </div>
                  <div>
                    <h3 class="text-lg font-black text-gray-900 dark:text-white">{{ selectedService.title }}</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService.serviceNumber }}</p>
                  </div>
                </div>
                <button @click="closeServiceModal" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-4">
              <!-- Customer Details -->
              <div class="mb-6">
                <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Información del Cliente</h4>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                  <div class="flex items-center justify-between mb-2">
                    <div>
                      <p class="font-bold text-blue-800 dark:text-blue-200">{{ selectedService.customer?.name }}</p>
                      <p class="text-blue-600 dark:text-blue-400 text-sm">{{ selectedService.customer?.phone }}</p>
                    </div>
                    <button @click="callCustomer(selectedService.customer?.phone)" class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Location Details -->
              <div class="mb-6">
                <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Ubicación del Servicio</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                  <p class="font-semibold text-gray-900 dark:text-white">{{ selectedService.location?.neighborhood }}</p>
                  <p class="text-gray-700 dark:text-gray-300 text-sm mt-1">{{ selectedService.location?.address }}</p> 
                </div>
              </div>

              <!-- Service Description -->
              <div class="mb-6">
                <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Descripción del Problema</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService.description }}</p>
                </div>
              </div>

              <!-- Calificación del Servicio -->
              <div v-if="selectedService.rawStatus === 'finalizado'" class="mb-6">
                <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Valoración del Cliente</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <template v-if="selectedService.calificacion">
                    <div class="flex items-center mb-2">
                      <div class="flex space-x-1">
                        <span v-for="i in 5" :key="i" class="text-yellow-400">
                          <template v-if="i <= selectedService.calificacion.calificacion">
                            ⭐
                          </template>
                          <template v-else>
                            <span class="text-gray-300 dark:text-gray-600">☆</span>
                          </template>
                        </span>
                      </div>
                      <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        {{ selectedService.calificacion.calificacion.toFixed(1) }}/5.0
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {{ formatDate(selectedService.calificacion.fecha) }}
                      </span>
                    </div>
                    <p v-if="selectedService.calificacion.comentario" class="text-gray-700 dark:text-gray-300 text-sm italic mt-2 pl-1 border-l-2 border-blue-200 dark:border-blue-800">
                      "{{ selectedService.calificacion.comentario }}"
                    </p>
                  </template>
                  <p v-else class="text-gray-500 dark:text-gray-400 text-sm">
                    El cliente no ha dejado ninguna valoración.
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-3">
                <!-- Action Buttons Based on Status -->
                <template v-if="selectedService.rawStatus === 'asignado'">
                  <button 
                    @click="openQuotationModal" 
                    class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    📋 Crear Cotización
                  </button>
                  
                  <button 
                    @click="confirmCancelService" 
                    class="w-full py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors mt-2">
                    ❌ Cancelar Servicio
                  </button>
                </template>

                <template v-else-if="selectedService.rawStatus === 'en_proceso'">
                  <button 
                    @click="openCompleteConfirmation(selectedService, $event)" 
                    class="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                    ✅ Completar Servicio
                  </button>
                  
                  <button 
                    @click="confirmCancelService" 
                    class="w-full py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors mt-2">
                    ❌ Cancelar Servicio
                  </button>
                </template>

                <template v-else-if="selectedService.rawStatus === 'pendiente_cotizacion'">
                  <button 
                    @click="openQuotationModal" 
                    class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
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
      <div v-if="showQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-black text-gray-900 dark:text-white">Crear Cotización</h3>
                <button @click="closeQuotationModal" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quotation Form -->
            <div class="p-4">
              <form @submit.prevent="submitQuotation" class="space-y-4">
                <!-- Comentario/Diagnóstico -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Diagnóstico</label>
                  <textarea v-model="quotationForm.comentario" 
                            rows="4" 
                            required
                            class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                            placeholder="Escriba su Diagnóstico"></textarea>
                </div>

                <!-- Monto Mano de Obra -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Mano de Obra (L.)</label>
                  <input v-model.number="quotationForm.monto_manodeobra" 
                         type="number" 
                         step="0.01" 
                         min="0" 
                         required
                         class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                         placeholder="0.00">
                </div>

                <!-- Monto Materiales -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Materiales (L.) - Estimado</label>
                  <input v-model.number="quotationForm.monto_materiales" 
                         type="number" 
                         step="0.01" 
                         min="0"
                         class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                         placeholder="0.00">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Este es un estimado que puede variar</p>
                </div>

                <!-- Total -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200">Total Estimado:</span>
                    <span class="text-lg font-bold text-blue-900 dark:text-blue-100">
                      L. {{ (Number(quotationForm.monto_manodeobra || 0) + Number(quotationForm.monto_materiales || 0)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        :disabled="isSubmittingQuotation"
                        class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  <span v-if="!isSubmittingQuotation">Enviar Cotización</span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div v-if="showViewQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-black text-gray-900 dark:text-white">Editar Cotización</h3>
                <button @click="closeViewQuotationModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quotation Form -->
            <div class="p-4">
              <form @submit.prevent="updateQuotation" class="space-y-4">
                <!-- Comentario/Diagnóstico -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Diagnóstico</label>
                  <textarea 
                    v-model="currentQuotation.comentario" 
                    rows="4" 
                    required
                    class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="Escriba su Diagnóstico">
                  </textarea>
                </div>

                <!-- Monto Mano de Obra -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Mano de Obra (L.)</label>
                  <input 
                    v-model.number="currentQuotation.monto_manodeobra" 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    required
                    class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="0.00">
                </div>

                <!-- Monto Materiales -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Materiales (L.) - Estimado</label>
                  <input 
                    v-model.number="currentQuotation.monto_materiales" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    class="w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="0.00">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Este es un estimado que puede variar</p>
                </div>

                <!-- Total -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200">Total Estimado:</span>
                    <span class="text-lg font-bold text-blue-900 dark:text-blue-100">
                      L. {{ (parseFloat(currentQuotation.monto_manodeobra || 0) + parseFloat(currentQuotation.monto_materiales || 0)).toFixed(2) }}
                    </span>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="flex space-x-3">
                  <button 
                    type="button"
                    @click="closeViewQuotationModal"
                    class="w-1/2 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    :disabled="isUpdatingQuotation || !currentQuotation.comentario || !currentQuotation.monto_manodeobra"
                    class="w-1/2 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    <span v-if="!isUpdatingQuotation">Guardar Cambios</span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div v-if="showCompleteConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCompleteConfirmation = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <span class="text-green-600 dark:text-green-400 text-xl">✅</span>
            </div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">¿Completar servicio?</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
              ¿Deseas marcar este servicio como completado? Puedes agregar un comentario opcional.
            </p>
            
            <!-- Comentario opcional -->
            <div class="mb-4 text-left">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comentario (opcional)</label>
              <textarea 
                v-model="completeServiceComment"
                class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                rows="3"></textarea>
            </div>
            
            <div class="flex gap-3">
              <button 
                @click="showCompleteConfirmation = false"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button 
                @click="confirmCompleteService"
                class="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                <span v-if="!isCompleting">Sí, completar</span>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
      <div v-if="showCancelConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCancelConfirmation = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <span class="text-red-600 dark:text-red-400 text-xl">❌</span>
            </div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">¿Cancelar servicio?</h3>
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-6">
              ¿Estás seguro de que deseas cancelar este servicio? El estado cambiará a 'Pendiente de asignación'.
            </p>
            
            <div class="flex gap-3">
              <button 
                @click="showCancelConfirmation = false"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                No, mantener
              </button>
              <button 
                @click="cancelService"
                class="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
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

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard Técnico',
  meta: [
    { name: 'description', content: 'Panel de Técnico - Gestiona tus servicios asignados' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================
// Nota: Los filtros se manejan ahora en el componente HeaderServiciosTecnico

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga y datos principales
const isLoading = ref(true)
const showFilters = ref(false)
const isLoadingServiceTypes = ref(false)
const serviceTypes = ref([])
const showServiceModal = ref(false)
const showQuotationModal = ref(false)
const showViewQuotationModal = ref(false)
const showCancelConfirmation = ref(false)
const showCompleteConfirmation = ref(false)
const isCompleting = ref(false)
const completeServiceComment = ref('')
const currentServiceToComplete = ref(null)
const currentFilter = ref('all')
const currentDateFilter = ref('all')
const selectedServiceTypes = ref([])

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// Datos del técnico
const technicianStatus = ref('available')
const technician = ref({
  id: userCookie.value?.id || null,
  name: userCookie.value?.name || 'Técnico',
  status: 'Disponible',
  rating: 4.8,
  totalServices: 0
})

// Datos de servicios
const services = ref([])
const apiResponse = ref({
  solicitudes: [],
  total: 0,
  finalizadas: 0,
  activas: 0
})

// Formulario de cotización
const quotationForm = ref({
  comentario: '',
  monto_manodeobra: 0,
  monto_materiales: 0
})

const quotationData = ref(null)
const isSubmittingQuotation = ref(false)
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

const isCanceling = ref(false)

const currentQuotation = ref({
  id: null,
  monto_manodeobra: 0,
  monto_materiales: 0,
  comentario: '',
  fecha: new Date().toISOString()
})

// Inicializar currentQuotation con valores por defecto
const resetCurrentQuotation = () => {
  currentQuotation.value = {
    id: null,
    monto_manodeobra: 0,
    monto_materiales: 0,
    comentario: '',
    fecha: new Date().toISOString()
  }
}

const isUpdatingQuotation = ref(false)

// =========================
// COMPUTED PROPERTIES
// =========================

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
      s.estado !== 'cancelado' && 
      s.estado !== 'finalizado' && 
      s.estado !== 'pendiente_pagoservicio' && 
      s.estado !== 'pendiente_asignacion'
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

// =========================
// LIFECYCLE HOOKS
// =========================

onMounted(() => {
  initializeDarkMode()
  loadServices()
  loadServiceTypes()
})

// =========================
// MÉTODOS
// =========================

// Función para mapear datos de la API al formato del frontend
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

// Función para obtener el título del servicio
const getServiceTitle = (solicitud) => {
  const stateMap = {
    'verificando_pagovisita': 'Verificación de Pago de Visita',
    'asignado': 'Servicio Asignado',
    'en_proceso': 'Servicio en Progreso',
    'finalizado': 'Servicio Finalizado',
    'cancelado': 'Servicio Cancelado'
  }
  
  return stateMap[solicitud.estado] || 'Servicio Técnico'
}

// Función para obtener icono basado en el estado
const getServiceIcon = (estado) => {
  const iconMap = {
    'verificando_pagovisita': '💰',
    'asignado': '👨‍🔧',
    'en_proceso': '⚡',
    'finalizado': '✅',
    'cancelado': '❌'
  }
  
  return iconMap[estado] || '🔧'
}

// Manejo de filtros
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

const toggleTechnicianStatus = () => {
  technician.value.status = technician.value.status === 'Disponible' ? 'Ocupado' : 'Disponible'
  updateStatus()
}

// Configuración
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

// Carga de datos
const loadServices = async () => {
  try {
    isLoading.value = true
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
      }
    }) 
    
    if (!response || !response.solicitudes || !Array.isArray(response.solicitudes)) {
      throw new Error('Formato de respuesta inválido: se esperaba un array en la propiedad "solicitudes"')
    }
    
    apiResponse.value = {
      solicitudes: response.solicitudes || [],
      total: response.total || 0,
      finalizadas: response.finalizadas || 0,
      activas: response.activas || 0
    }
    
    technician.value.totalServices = response.total || 0 
    
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showToast({
      message: 'Error al cargar los servicios. Intente de nuevo más tarde.',
      type: 'error'
    })
    
    apiResponse.value = {
      solicitudes: [],
      total: 0,
      finalizadas: 0,
      activas: 0
    }
  } finally {
    isLoading.value = false
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

// Mapeo de estados
const mapApiStatusToLocal = (apiStatus) => {
  const statusMap = {
    'pendiente_asignacion': 'Cotización Rechazada',
    'asignado': 'Asignado',
    'pendiente_cotizacion': 'Cotización Enviada',
    'en_proceso': 'En Progreso',
    'pendiente_pagoservicio': 'Finalizado',
    'verificando_pagoservicio': 'Finalizado',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado'
  }
  
  return statusMap[apiStatus] || 'Estado Desconocido'
}

// Formateo
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

// Gestión de estado del técnico
const updateStatus = async () => {
  try {
    const newStatus = technician.value.status === 'Disponible' ? 'ocupado' : 'disponible'
    
    await $fetch(`/api/tecnico/estado`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: { estado: newStatus }
    })
    
    technician.value.status = newStatus === 'disponible' ? 'Disponible' : 'No Disponible'
    
    showToast(`Estado actualizado a: ${technician.value.status}`, 'success')
  } catch (error) {
    console.error('Error al actualizar estado:', error)
    showToast('Error al actualizar el estado. Intente de nuevo.', 'error')
  }
}

// Gestión de modales
const openServiceModal = async (service) => { 
  selectedService.value = { ...service }
  showServiceModal.value = true
  
  // Usar el ID del servicio (puede estar en service.id o service.id_solicitud)
  const servicioId = service.id || service.id_solicitud 
  
  // Si el servicio está finalizado, cargar la calificación
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

// Cargar calificación del servicio
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
    
    // Verificamos si la respuesta es un array y tiene elementos
    if (Array.isArray(response) && response.length > 0) {
      const calificacionData = response[0]
      
      // Aseguramos que los datos estén en el formato correcto
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

const openCompleteConfirmation = (service, event) => {
  event.stopPropagation() // Evitar que se abra el modal de detalle
  currentServiceToComplete.value = service
  completeServiceComment.value = ''
  showCompleteConfirmation.value = true
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
    
    // Mostrar notificación de éxito
    showToast('Servicio marcado como completado exitosamente', 'success')
    
    // Cerrar el modal de confirmación
    showCompleteConfirmation.value = false
    
    // Recargar los servicios
    await loadServices()
    
  } catch (error) {
    console.error('Error al completar el servicio:', error)
    showToast('Error al completar el servicio. Por favor, inténtalo de nuevo.', 'error')
  } finally {
    isCompleting.value = false
  }
}

const closeServiceModal = () => {
  showServiceModal.value = false
  selectedService.value = null
  resetCurrentQuotation()
}

const openQuotationModal = async () => { 
  
  if (selectedService.value.rawStatus === 'asignado') {
    // Para crear nueva cotización
    quotationForm.value = {
      comentario: '',
      monto_manodeobra: 0,
      monto_materiales: 0
    }
    showQuotationModal.value = true
  } else if (selectedService.value.rawStatus === 'pendiente_cotizacion') {
    // Para ver/editar cotización existente
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

const confirmCancelService = () => {
  showCancelConfirmation.value = true
}

const cancelService = async () => {
  if (!selectedService.value) return
  
  try {
    isCanceling.value = true
    
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

    showToast('Servicio cancelado correctamente', 'success')

    // Actualizar el estado local
    const index = services.value.findIndex(s => s.id === selectedService.value.id)
    if (index !== -1) {
      services.value[index].estado = 'pendiente_asignacion'
    }

    closeServiceModal()
    showCancelConfirmation.value = false
    loadServices() // Recargar servicios para actualizar las estadísticas
  } catch (error) {
    console.error('Error al cancelar el servicio:', error)
    showToast('Error al cancelar el servicio. Por favor, inténtalo de nuevo.', 'error')
  } finally {
    isCanceling.value = false
  }
}

const submitQuotation = async () => {
  if (!quotationForm.value.comentario.trim() || quotationForm.value.monto_manodeobra <= 0) {
    showToast('Por favor completa todos los campos requeridos', 'error')
    return
  }

  let updateSuccessful = false;
  
  try {
    isSubmittingQuotation.value = true
    
    // Preparar datos para la cotización
    const cotizacionData = {
      id_solicitud: selectedService.value.id,
      comentario: quotationForm.value.comentario.trim(),
      monto_manodeobra: parseFloat(quotationForm.value.monto_manodeobra),
      monto_materiales: parseFloat(quotationForm.value.monto_materiales) || 0,
      fecha: new Date().toISOString()
    };
    
    console.log('Datos de la cotización a enviar:', JSON.stringify(cotizacionData, null, 2));
    
    // Primero actualizar el estado de la solicitud
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
    
    // Si la actualización del estado fue exitosa, crear la cotización
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
    
    // Si llegamos aquí, ambas operaciones fueron exitosas
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
    
    // Si hubo un error después de actualizar el estado, intentar revertirlo
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
          body: { estado: 'asignado' } // Revertir al estado anterior
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

// Cargar detalles de la cotización
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
      
      // Verificar que el ID existe antes de asignarlo
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
      
      // Forzar actualización del DOM
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

// Actualizar cotización
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
    
    // Aceptar tanto respuestas con status 'success' como arrays no vacíos
    if ((response && response.status === 'success') || (Array.isArray(response) && response.length > 0)) {
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

// Acciones de servicio
const completeService = async () => {
  try {
    isLoading.value = true
    const response = await $fetch(`/solicitudservicio/${selectedService.value.id}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    showToast({
      message: '¡Servicio completado exitosamente!',
      type: 'success'
    })

    // Actualizar el estado local
    const index = services.value.findIndex(s => s.id === selectedService.value.id)
    if (index !== -1) {
      services.value[index].estado = 'completado'
    }

    closeServiceModal()
    loadServices()
  } catch (error) {
    console.error('Error al completar el servicio:', error)
    showToast({
      message: 'Error al completar el servicio. Por favor, inténtalo de nuevo.',
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

// Utilidades
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

const showToast = (messageOrOptions, type = 'info', duration = 5000) => {
  // Si el primer parámetro es un objeto, extraer las propiedades
  if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
    toast.value = {
      show: true,
      message: messageOrOptions.message || '',
      type: messageOrOptions.type || 'info',
      duration: messageOrOptions.duration || 5000
    }
  } else {
    // Si se pasan parámetros individuales
    toast.value = {
      show: true,
      message: messageOrOptions || '',
      type: type,
      duration: duration
    }
  }
  
  // Cerrar automáticamente después de la duración especificada
  if (toast.value.message) { // Solo si hay un mensaje
    setTimeout(() => {
      toast.value.show = false
    }, toast.value.duration)
  } else {
    // Si no hay mensaje, ocultar inmediatamente
    toast.value.show = false
  }
}

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
  .max-w-2xl {
    max-width: 100%;
  }
}
</style>
