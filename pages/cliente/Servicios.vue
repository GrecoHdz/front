<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading"  
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
      <!-- Toast Notification -->
      <Toast 
        v-if="toast.show"
        :key="toast.message + Date.now()"
        :message="toast.message" 
        :type="toast.type"
        :duration="toast.duration"
        @close="toast.show = false"
      />

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
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 relative">
        <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
      <div class="pb-20 space-y-3">
          <!-- Main Content -->
          <main class="pb-4">
          
          <!-- Stats Overview / Tabs -->
          <section class="p-3 sm:px-4 sm:py-4">
            <div class="grid grid-cols-2 gap-3">
              <!-- Active Services Tab -->
              <div @click="switchTab('active')" 
                   class="cursor-pointer transition-all duration-300"
                   :class="currentTab === 'active' ? 'scale-105' : 'opacity-60 grayscale-[0.5]'">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                  <div v-if="currentTab === 'active'" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                  <div class="text-xl font-black text-blue-600 dark:text-blue-400 mb-0.5">{{ pendingServices }}</div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{{ $t('services_page.active') }}</p>
                </div>
              </div>
              
              <!-- Finished Services Tab -->
              <div @click="switchTab('finished')" 
                   class="cursor-pointer transition-all duration-300"
                   :class="currentTab === 'finished' ? 'scale-105' : 'opacity-60 grayscale-[0.5]'">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                  <div v-if="currentTab === 'finished'" class="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
                  <div class="text-xl font-black text-green-600 dark:text-green-400 mb-0.5">{{ completedServices }}</div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{{ $t('services_page.finished') }}</p>
                </div>
              </div>
            </div>
          </section> 

          <!-- Tabs Indicator (Visual Separator) -->
          <div class="px-4 mb-4">
            <h2 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center"> 
              <span class="ml-2 h-px flex-1 bg-gray-100 dark:bg-gray-800"></span>
            </h2>
          </div> 

        <!-- Services List -->
        <section class="px-4">
          <div class="space-y-4">
            <div v-for="service in filteredServices" :key="service.id"
                 @click="openServiceModal(service)"
                 class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden">
              
              <!-- Animated Top Border for Active Services (Subtle) -->
              <div v-if="currentTab === 'active'" 
                   class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 bg-[length:200%_auto] animate-gradient-x opacity-70">
              </div>

              
              <!-- Service Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                  <div class="w-9 h-9 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-base shadow-sm">
                    {{ service.icon }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px] sm:max-w-none">{{ service.title }}</p>
                    <p class="text-[9px] text-gray-500 dark:text-gray-400 font-medium">#{{ formatDateDDMMYY(service.rawDate) }}-{{ service.id }}</p>
                  </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm" :class="getStatusColor(service.status)">
                    {{ service.status }}
                  </span>
                  
                  <!-- Badges for extra info -->
                  <div class="flex flex-col items-end gap-1">
                    <span v-if="service.rawStatus === 'pendiente_pagovisita' || service.rawStatus === 'pendiente_pagoservicio'" class="animate-pulse inline-flex items-center px-1.5 py-0.5 rounded border border-amber-500 dark:border-amber-500 text-[9px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 uppercase tracking-wide shadow-sm">
                      🟡 {{ $t('services_page.pending_payment') }}
                    </span>
                    <span v-if="service.rawStatus === 'pendiente_cotizacion'" class="animate-pulse inline-flex items-center px-1.5 py-0.5 rounded border border-amber-500 dark:border-amber-500 text-[9px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 uppercase tracking-wide shadow-sm">
                      🟡 {{ service.title === 'Viaje Privado' ? $t('services_page.fare_ready') : $t('services_page.quote_ready') }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Location and Schedule Grid -->
              <div class="mb-3">
                 <!-- Viaje Privado Special Layout -->
                 <div v-if="service.title === 'Viaje Privado'" class="grid grid-cols-2 gap-2">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50">
                      <p class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase mb-0.5">{{ $t('services_page.pickup') }}</p>
                      <p class="font-bold text-blue-900 dark:text-blue-200 text-[10px] truncate">{{ service.fullLocation.colonia }}</p>
                    </div>
                    <div class="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                      <p class="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase mb-0.5">{{ $t('services_page.destination') }}</p>
                      <p class="font-bold text-emerald-900 dark:text-emerald-200 text-[10px] truncate">{{ service.fullLocation.direccion }}</p>
                    </div>
                 </div>

                 <!-- Standard Service Layout -->
                 <div v-else class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50">
                    <p class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase mb-0.5">📍 Ubicación</p>
                    <p class="font-bold text-blue-900 dark:text-blue-200 text-[10px] truncate">{{ service.fullLocation.colonia }}</p>
                    <p class="text-blue-800 dark:text-blue-300 text-[10px] truncate">{{ service.fullLocation.direccion }}</p>
                 </div>
              </div>
              
              <!-- Service Description -->
              <p class="text-gray-700 dark:text-gray-300 text-[11px] mb-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg italic line-clamp-2">
                "{{ service.description }}"
              </p> 

              <!-- Action Footer -->
              <div class="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-400 text-[9px] font-medium">{{ service.date }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <span class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest inline-block" :class="{ 'animate-bounce': service.rawStatus === 'finalizado' }">
                    {{ service.rawStatus === 'finalizado' ? (service.title === 'Viaje Privado' ? $t('services_page.rate_trip') : $t('services_page.rate_service')) : $t('services_page.view_details') }}
                  </span>
                  <svg class="w-3 h-3 text-blue-600/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredServices.length === 0" class="text-center py-10">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl mx-auto mb-3 flex items-center justify-center opacity-50">
              <span class="text-2xl">🔍</span>
            </div>
            <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{{ $t('services_page.no_services') }}</h3>
            <p class="text-gray-500 dark:text-gray-500 mb-3 text-[10px]">{{ $t('services_page.no_services_desc') }}</p>
            <button @click="resetFilters" class="px-3 py-1.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-[10px] uppercase tracking-wider">
              {{ $t('services_page.reset_filters') }}
            </button>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreServices && !isLoading && filteredServices.length > 0" class="mt-6 mb-4">
             <button 
                @click="loadMoreServices" 
                :disabled="isLoadingMore"
                class="w-full py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 shadow-sm transition-all flex items-center justify-center space-x-2"
             >
                <div v-if="isLoadingMore" class="animate-spin h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <span>{{ isLoadingMore ? $t('services_page.loading') : $t('services_page.load_more') }}</span>
                <svg v-if="!isLoadingMore" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
             </button>
          </div>
        </section>
        
        </main>
      </div> 
    </div> 

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
                      {{ $t('services_page.reference') }} #{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}
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
          <h4 class="text-sm font-black text-gray-900 dark:text-white mb-3">{{ $t('services_page.modal.tracking') }}</h4> 
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

        <!-- 2. Profesional/Conductor Asignado -->
        <div v-if="selectedService.technician && ['asignado', 'en_proceso'].includes(selectedService.rawStatus)" class="mb-4">
          <h4 class="text-sm font-black text-gray-900 dark:text-white mb-2">
            {{ selectedService.title === 'Viaje Privado' ? 'Conductor Asignado' : 'Profesional Asignado' }}
          </h4>
          <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div class="flex items-center space-x-2 mb-2">
              <button 
              v-if="selectedService.tecnico?.imagen_url" 
              @click="() => {
                selectedImage = getOptimizedImage(selectedService.tecnico.imagen_url, 800, 800, 'fill')
                showImageModal = true
              }"
              class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Ver imagen del Profesional"
            >
              <img 
                :src="getOptimizedImage(selectedService.tecnico.imagen_url, 100, 100)" 
                :alt="'Foto de ' + (selectedService.technicianName || 'Profesional')"
                class="w-full h-full object-cover transition-opacity duration-300 hover:opacity-90"
                :class="{ 'opacity-0': !imageLoaded }"
                @load="imageLoaded = true"
                @error="handleImageError"
                loading="lazy"
              >
              <div v-if="!imageLoaded" class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            </button>
              <div v-else class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <span class="text-white text-lg">👨‍🔧</span>
              </div>
              <div>
                <div class="flex flex-col">
                  <h5 class="font-bold text-emerald-800 dark:text-emerald-200 text-sm">
                    {{ selectedService.technicianName || (selectedService.title === 'Viaje Privado' ? 'Conductor' : 'Profesional') }}
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

            <!-- Información del Vehículo (Compacta con Botón) -->
            <div v-if="isViajePrivado(selectedService.title) && assignedVehiculo && ['asignado', 'en_proceso'].includes(selectedService.rawStatus)" class="mt-3">
              <div class="flex items-center justify-between gap-3 bg-sky-50 dark:bg-sky-900/20 p-2.5 rounded-xl border border-sky-100 dark:border-sky-800/50 shadow-sm animate-fade-in">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-8 h-8 bg-white dark:bg-sky-900/40 rounded-lg flex items-center justify-center text-lg shadow-inner">
                    🚗
                  </div>
                  <div class="min-w-0">
                    <p class="text-sky-900 dark:text-sky-200 font-black text-xs truncate">
                      {{ assignedVehiculo.modelo || 'Vehículo' }}
                    </p>
                    <p class="text-sky-600 dark:text-sky-400 text-[10px] font-bold uppercase tracking-tight">
                      {{ assignedVehiculo.color }} • {{ assignedVehiculo.placa }}
                    </p>
                  </div>
                </div>
                
                <button v-if="assignedVehiculo.foto1" 
                        @click="selectedImage = getOptimizedImage(assignedVehiculo.foto1, 1200, 800, 'fit'), showImageModal = true"
                        class="flex-shrink-0 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md shadow-blue-500/20 active:scale-90 transition-all">
                  Ver Auto
                </button>
              </div>
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

        <!-- 3. Acciones - Diseño Premium y Llamativo -->
        <div v-if="hasActions" class="mb-3">
          <h4 v-if="hasVisibleActions" class="text-xs font-black text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-widest ml-1">{{ $t('services_page.modal.actions') }}</h4>
          <div class="space-y-3">

            <!-- Acciones para Servicio Con Pago Pendiente -->
            <div v-if="selectedService.rawStatus === 'pendiente_pagovisita'"> 
              <button 
                @click="openVisitPaymentModal(selectedService)"
                class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all duration-300"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">
                    💳
                  </div>
                  <div class="text-left">
                    <span class="block font-black text-sm leading-none">{{ $t('services_page.modal.pay_visit') }}</span>
                    <span class="text-[10px] font-medium text-white/80 mt-1 uppercase tracking-tighter">Acción Requerida</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
            
            <!-- Acciones para Pago de Servicio Pendiente -->
            <div v-if="selectedService.rawStatus === 'pendiente_pagoservicio'"> 
              <button 
                @click="openPaymentModal(selectedService)"
                class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all duration-300"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">
                    💰
                  </div>
                  <div class="text-left">
                    <span class="block font-black text-sm leading-none">{{ $t('services_page.modal.pay_service') }}</span>
                    <span class="text-[10px] font-medium text-white/80 mt-1 uppercase tracking-tighter">Confirmar Finalización</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>

            <!-- Acciones para Cotización Pendiente -->
            <div v-if="selectedService.rawStatus === 'pendiente_cotizacion'">
              <button 
                @click="openQuotationModal(selectedService)"
                class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-xl shadow-lg shadow-yellow-500/30 active:scale-95 transition-all duration-300"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">
                    📋
                  </div>
                  <div class="text-left">
                    <span class="block font-black text-sm leading-none">
                      {{ 
                        selectedService.title === 'Viaje Privado' ? $t('services_page.modal.view_trip_details') : 
                        (selectedService.title === 'Barbería' ? $t('services_page.modal.view_cut_details') : $t('services_page.modal.view_quotation')) 
                      }}
                    </span>
                    <span class="text-[10px] font-bold text-gray-800/60 mt-1 uppercase tracking-tighter">Propuesta de Profesional</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-900/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
            
            <!-- Acciones para Servicio Finalizado -->
            <div v-if="selectedService.rawStatus === 'finalizado'" class="space-y-3">
              <!-- Botón de Calificar -->
              <button 
                @click="openRatingModal(selectedService)"
                class="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 rounded-xl shadow-lg shadow-yellow-500/30 active:scale-95 transition-all duration-300"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-black/5 rounded-lg flex items-center justify-center text-xl backdrop-blur-sm">
                    ⭐
                  </div>
                  <div class="text-left">
                    <span class="block font-black text-sm leading-none">
                      {{ selectedService.title === 'Viaje Privado' ? 'Calificar Viaje' : 'Calificar Servicio' }}
                    </span>
                    <span class="text-[10px] font-bold text-gray-800/60 mt-1 uppercase tracking-tighter">Tu opinión es importante</span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-900/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div> 

            <!-- Botón de Cancelar - Más sutil pero claro -->
            <div v-if="['pendiente_pagovisita', 'pendiente_asignacion', 'asignado'].includes(selectedService.rawStatus)">
              <button 
                @click="confirmarCancelar"
                class="w-full flex items-center justify-center p-3 text-red-600 dark:text-red-400 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
              >
                <span class="mr-2">❌</span>
                {{ getCancelButtonText }}
              </button>
            </div> 

            <div v-if="selectedService.rawStatus === 'calificado' || selectedService.rawStatus === 'finalizado'">
              <!-- Botón de Reportar Problema -->
              <button 
                @click="reportarProblema"
                class="w-full flex items-center justify-center p-3 text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-widest active:scale-95 transition-all"
              >
                <span class="mr-2 text-xs">⚠️</span>
                Reportar un problema
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
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white">{{ $t('services_page.payment.visit_title') }}</h3> 
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
                <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-2">{{ $t('services_page.payment.visit_title') }}</h4>
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
                <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-2">💰 {{ $t('services_page.payment.breakdown') }}</h4>
                <div class="space-y-2 text-sm">

                  <div class="flex justify-between items-center text-sm">
                    <span class="text-blue-700 dark:text-blue-300">{{ $t('services_page.payment.visit_cost') }}:</span>
                    <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ visitCost }}</span>
                  </div> 
                  <hr class="border-blue-300 dark:border-blue-700">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200">{{ $t('services_page.payment.total_pay') }}:</span>
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-base">L. {{ visitCost }}</span>
                  </div>
                </div>
              </div>

              <!-- Cuenta Bancaria -->
              <div class="mb-3">
                <label for="bank-account" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {{ $t('services_page.payment.bank_transfer') }}
                </label>
                <div v-if="isLoadingAccounts" class="py-6 flex flex-col items-center justify-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ $t('profile.membership.loading_accounts') }}</p>
                </div>
                <div v-else class="space-y-3">
                  <multiselect
                    id="bank-account"
                    v-model="selectedAccountObject"
                    :options="bankAccounts"
                    :searchable="false"
                    :close-on-select="true"
                    :show-labels="false"
                    :placeholder="$t('services_page.payment.select_account')"
                    label="banco"
                    track-by="id_cuenta"
                    class="multiselect-custom"
                    :class="{ 'multiselect--active': selectedAccountObject }"
                    :select-label="''"
                    :deselect-label="''"
                    :selected-label="''"
                    :custom-label="getAccountLabel"
                    @search-change="$event && $event.stopPropagation()"
                    @search-focus="(e) => e && e.target && e.target.blur()"
                    @touchstart.native.stop
                    @click.native.stop
                    :options-limit="100"
                    :disabled="bankAccounts.length === 0"
                    :loading="isLoadingAccounts"
                  >
                    <template #singleLabel="{ option }">
                      <span class="text-xs truncate font-medium">{{ getAccountLabel(option) }}</span>
                    </template>
                  </multiselect>

                  <!-- Detalles de la cuenta seleccionada -->
                  <div 
                    v-if="getSelectedAccount" 
                    class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('profile.membership.account_details') }}</h4>
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
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.membership.bank_account') }}:</span>
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
                      {{ $t('services_page.payment.receipt_number') }}
                    </label>
                    <input
                      id="comprobante"
                      v-model="comprobante"
                      type="text"
                      class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-200 text-base"
                      :placeholder="$t('services_page.payment.receipt_placeholder')"
                    >
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ $t('services_page.payment.receipt_desc') }}
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
                      {{ $t('services_page.payment.process_payment') }} - L. {{ visitCost }}
                    </span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ $t('profile.membership.processing') }}
                    </span>
                  </button>
                </div> 
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
 
  <!-- Standard Payment Modal -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePaymentModal"></div>
      
      <Transition name="modal-content" enter-active-class="modal-content-enter-active" leave-active-class="modal-content-leave-active" enter-from-class="modal-content-enter-from" leave-to-class="modal-content-leave-to">
        <div v-if="showPaymentModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10" @click.stop>
          
          <!-- Encabezado del modal -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-base">
                  💳
                </div>
                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">{{ $t('services_page.payment.service_title') }}</h3>
                  <p class="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">#{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closePaymentModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-3 space-y-4">
            <!-- Resumen del Servicio -->
            <div class="space-y-2">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="text-xs font-black text-blue-800 dark:text-blue-200 uppercase tracking-widest mb-2">{{ $t('services_page.payment.breakdown') }}</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-600 dark:text-gray-400 font-bold">{{ $t('services_page.payment.labor') }}</span>
                    <span class="font-black text-gray-900 dark:text-white">L. {{ formatCurrency(quotationData?.monto_manodeobra) }}</span>
                  </div>
                  
                  <!-- Crédito Aplicado -->
                  <div v-if="shouldShowCreditBenefit && creditApplied > 0" class="flex justify-between items-center text-xs text-blue-600 dark:text-blue-400">
                    <span class="font-bold">{{ $t('services_page.payment.credit_applied') }}</span>
                    <span class="font-black">−L. {{ formatCurrency(creditApplied) }}</span>
                  </div>

                  <div class="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between items-center">
                    <span class="text-sm font-black text-blue-900 dark:text-white uppercase">{{ $t('services_page.payment.total_transfer') }}</span>
                    <span class="text-base font-black text-blue-600 dark:text-blue-400">L. {{ (totalAPagar || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              <!-- Cashback Info (Sección Estructurada) -->
              <div v-if="shouldShowDiscountBenefit && cashbackAmount > 0" class="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">✨ Cashback</span>
                  <span class="text-xs font-black text-emerald-700 dark:text-emerald-300">+L. {{ formatCurrency(cashbackAmount) }}</span>
                </div>
                <p class="text-[9px] text-emerald-600/80 dark:text-emerald-400/80 font-medium leading-tight">
                  * Como beneficio exclusivo de tu membresía activa, este monto se agregará a tu crédito.
                </p>
              </div>
            </div>

            <!-- Información de Pago -->
            <div>
              <h4 class="text-sm font-black text-gray-900 dark:text-white mb-1">{{ $t('profile.membership.select_account_desc') }}</h4>
              
              <div v-if="isLoadingAccounts" class="p-6 flex justify-center">
                <div class="w-6 h-6 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              
              <div v-else class="space-y-3">
                <multiselect
                  v-model="selectedAccountObject"
                  :options="bankAccounts"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  :placeholder="$t('services_page.payment.select_account')"
                  label="banco"
                  track-by="id_cuenta"
                  class="multiselect-custom"
                  :class="{ 'multiselect--active': selectedAccountObject }"
                  :select-label="''"
                  :deselect-label="''"
                  :selected-label="''"
                  :custom-label="getAccountLabel"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate font-medium">{{ getAccountLabel(option) }}</span>
                  </template>
                </multiselect>

                <div v-if="getSelectedAccount" class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-gray-900 dark:text-white truncate flex-1">{{ getSelectedAccount.banco }}</span>
                    <span class="text-xs font-black text-indigo-600 dark:text-indigo-400 italic whitespace-nowrap">{{ getSelectedAccount.tipo_cuenta }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-mono font-bold text-gray-900 dark:text-white">{{ getSelectedAccount.numero_cuenta }}</span>
                    <button @click="copyToClipboard(getSelectedAccount.numero_cuenta)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-indigo-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest">ID: <span class="text-gray-900 dark:text-white">{{ getSelectedAccount.titular }}</span></p>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{{ $t('services_page.payment.receipt_number') }}</label>
                  <input v-model="comprobante" type="text" class="w-full px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" :placeholder="$t('services_page.payment.receipt_placeholder')">
                </div> 

                <button @click="processPayment" :disabled="!selectedAccount || !comprobante || isProcessingPayment" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50">
                  <span v-if="!isProcessingPayment">{{ $t('services_page.payment.confirm_payment') }} L. {{ (totalAPagar || 0).toFixed(2) }}</span>
                  <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                </button> 
                
                <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start space-x-2">
                  <span class="text-xs">ℹ️</span>
                  <p class="text-[9px] text-blue-700 dark:text-blue-300 font-medium leading-tight">{{ $t('services_page.payment.receipt_desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Taxi VIP Payment Modal -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showTaxiPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePaymentModal"></div>
      
      <Transition name="modal-content" enter-active-class="modal-content-enter-active" leave-active-class="modal-content-leave-active" enter-from-class="modal-content-enter-from" leave-to-class="modal-content-leave-to">
        <div v-if="showTaxiPaymentModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10" @click.stop>
          
          <!-- Encabezado -->
          <div class="sticky top-0 bg-yellow-400 p-3 border-b border-yellow-500 rounded-t-xl z-20">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-base">
                  🚗
                </div>
                <div>
                  <h3 class="text-base font-black text-black leading-none">{{ $t('services_page.payment.trip_title') }}</h3>
                  <p class="text-[10px] font-bold text-black/60 uppercase tracking-widest mt-1">TAXI-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closePaymentModal" class="bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors">
                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-3 space-y-4">
            <!-- Resumen de Viaje -->
            <div class="space-y-2">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="text-xs font-black text-blue-800 dark:text-blue-200 uppercase tracking-widest mb-2">{{ $t('services_page.payment.summary') }}</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-600 dark:text-gray-400 font-bold">{{ $t('services_page.payment.tariff') }}</span>
                    <span class="font-black text-gray-900 dark:text-white">L. {{ formatCurrency(quotationData?.monto_manodeobra) }}</span>
                  </div>

                  <div v-if="shouldShowCreditBenefit && creditApplied > 0" class="flex justify-between items-center text-xs text-blue-600 dark:text-blue-400">
                    <span class="font-bold">{{ $t('services_page.payment.credit_applied') }}</span>
                    <span class="font-black">−L. {{ formatCurrency(creditApplied) }}</span>
                  </div>

                  <div class="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between items-center">
                    <span class="text-sm font-black text-blue-900 dark:text-white uppercase">{{ $t('services_page.payment.total_pay') }}</span>
                    <span class="text-base font-black text-blue-600 dark:text-blue-400">L. {{ (totalAPagar || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Cashback Taxi -->
              <div v-if="shouldShowDiscountBenefit && cashbackAmount > 0" class="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">✨ Cashback</span>
                  <span class="text-xs font-black text-emerald-700 dark:text-emerald-300">+L. {{ formatCurrency(cashbackAmount) }}</span>
                </div>
                <p class="text-[9px] text-emerald-600/80 dark:text-emerald-400/80 font-medium leading-tight">
                  * {{ $t('services_page.payment.cashback_desc') }}
                </p>
              </div>
            </div>

            <!-- Información de Pago -->
            <div>
              <h4 class="text-sm font-black text-gray-900 dark:text-white mb-1">{{ $t('profile.membership.select_account_desc') }}</h4>
              
              <div v-if="isLoadingAccounts" class="p-6 flex justify-center">
                <div class="w-6 h-6 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              
              <div v-else class="space-y-3">
                <multiselect
                  v-model="selectedAccountObject"
                  :options="bankAccounts"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  :placeholder="$t('services_page.payment.select_account')"
                  label="banco"
                  track-by="id_cuenta"
                  class="multiselect-custom"
                  :class="{ 'multiselect--active': selectedAccountObject }"
                  :select-label="''"
                  :deselect-label="''"
                  :selected-label="''"
                  :custom-label="getAccountLabel"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate font-medium">{{ getAccountLabel(option) }}</span>
                  </template>
                </multiselect>

                <div v-if="getSelectedAccount" class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-gray-900 dark:text-white truncate flex-1">{{ getSelectedAccount.banco }}</span>
                    <span class="text-xs font-black text-indigo-600 dark:text-indigo-400 italic whitespace-nowrap">{{ getSelectedAccount.tipo_cuenta }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-mono font-bold text-gray-900 dark:text-white">{{ getSelectedAccount.numero_cuenta }}</span>
                    <button @click="copyToClipboard(getSelectedAccount.numero_cuenta)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-indigo-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest">ID: <span class="text-gray-900 dark:text-white">{{ getSelectedAccount.titular }}</span></p>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{{ $t('services_page.payment.receipt_number') }}</label>
                  <input v-model="comprobante" type="text" class="w-full px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" :placeholder="$t('services_page.payment.receipt_placeholder')">
                </div>

                <button @click="processPayment" :disabled="!selectedAccount || !comprobante || isProcessingPayment" class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50">
                  <span v-if="!isProcessingPayment">{{ $t('services_page.payment.confirm_payment') }} L. {{ (totalAPagar || 0).toFixed(2) }}</span>
                  <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                </button>

                <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start space-x-2">
                  <span class="text-xs">🚗</span>
                  <p class="text-[9px] text-blue-700 dark:text-blue-300 font-medium leading-tight">{{ $t('services_page.payment.receipt_desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Barbería Payment Modal -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showBarberiaPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePaymentModal"></div>
      
      <Transition name="modal-content" enter-active-class="modal-content-enter-active" leave-active-class="modal-content-leave-active" enter-from-class="modal-content-enter-from" leave-to-class="modal-content-leave-to">
        <div v-if="showBarberiaPaymentModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10" @click.stop>
          
          <!-- Encabezado -->
          <div class="sticky top-0 bg-gradient-to-r from-red-600 via-rose-500 to-blue-600 p-3 border-b border-blue-700/50 rounded-t-xl z-20 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-base shadow-inner border border-white/20">
                  💈
                </div>
                <div>
                  <h3 class="text-base font-black text-white leading-none">{{ $t('services_page.payment.service_title') }}</h3>
                  <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">BARBER-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="closePaymentModal" class="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-3 space-y-4">
            <!-- Resumen de Costo -->
            <div class="space-y-2">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 class="text-xs font-black text-blue-800 dark:text-blue-200 uppercase tracking-widest mb-2">{{ $t('services_page.payment.summary') }}</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-600 dark:text-gray-400 font-bold">{{ $t('services_page.payment.service_cost') }}</span>
                    <span class="font-black text-gray-900 dark:text-white">L. {{ formatCurrency(quotationData?.monto_manodeobra) }}</span>
                  </div>

                  <div v-if="shouldShowCreditBenefit && creditApplied > 0" class="flex justify-between items-center text-xs text-blue-600 dark:text-blue-400">
                    <span class="font-bold">{{ $t('services_page.payment.credit_applied') }}</span>
                    <span class="font-black">−L. {{ formatCurrency(creditApplied) }}</span>
                  </div>

                  <div class="pt-2 border-t border-blue-200 dark:border-blue-800 flex justify-between items-center">
                    <span class="text-sm font-black text-blue-900 dark:text-white uppercase">{{ $t('services_page.payment.total_pay') }}</span>
                    <span class="text-base font-black text-blue-600 dark:text-blue-400">L. {{ (totalAPagar || 0).toFixed(2) }}</span>
                  </div>
                </div>
              </div>

              <!-- Cashback -->
              <div v-if="shouldShowDiscountBenefit && cashbackAmount > 0" class="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">✨ Cashback</span>
                  <span class="text-xs font-black text-red-700 dark:text-red-300">+L. {{ formatCurrency(cashbackAmount) }}</span>
                </div>
                <p class="text-[9px] text-red-600/80 dark:text-red-400/80 font-medium leading-tight">
                  * {{ $t('services_page.payment.cashback_desc') }}
                </p>
              </div>
            </div>

            <!-- Información de Pago -->
            <div>
              <h4 class="text-sm font-black text-gray-900 dark:text-white mb-1">{{ $t('auth.profile.membership.select_account_desc') }}</h4>
              
              <div v-if="isLoadingAccounts" class="p-6 flex justify-center">
                <div class="w-6 h-6 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              
              <div v-else class="space-y-3">
                <multiselect
                  v-model="selectedAccountObject"
                  :options="bankAccounts"
                  :searchable="false"
                  :close-on-select="true"
                  :show-labels="false"
                  :placeholder="$t('services_page.payment.select_account')"
                  label="banco"
                  track-by="id_cuenta"
                  class="multiselect-custom"
                  :class="{ 'multiselect--active': selectedAccountObject }"
                  :select-label="''"
                  :deselect-label="''"
                  :selected-label="''"
                  :custom-label="getAccountLabel"
                >
                  <template #singleLabel="{ option }">
                    <span class="text-xs truncate font-medium">{{ getAccountLabel(option) }}</span>
                  </template>
                </multiselect>

                <div v-if="getSelectedAccount" class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-gray-900 dark:text-white truncate flex-1">{{ getSelectedAccount.banco }}</span>
                    <span class="text-xs font-black text-indigo-600 dark:text-indigo-400 italic whitespace-nowrap">{{ getSelectedAccount.tipo_cuenta }}</span>
                  </div>
                  
                  <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                    <span class="text-sm font-mono font-bold text-gray-900 dark:text-white">{{ getSelectedAccount.numero_cuenta }}</span>
                    <button @click="copyToClipboard(getSelectedAccount.numero_cuenta)" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-indigo-500">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest">ID: <span class="text-gray-900 dark:text-white">{{ getSelectedAccount.titular }}</span></p>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{{ $t('services_page.payment.receipt_number') }}</label>
                  <input v-model="comprobante" type="text" class="w-full px-4 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all" :placeholder="$t('services_page.payment.receipt_placeholder')">
                </div>

                <button @click="processPayment" :disabled="!selectedAccount || !comprobante || isProcessingPayment" class="w-full py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-black rounded-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-50">
                  <span v-if="!isProcessingPayment">{{ $t('services_page.payment.confirm_payment') }} L. {{ (totalAPagar || 0).toFixed(2) }}</span>
                  <div v-else class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto"></div>
                </button>

                <div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800 flex items-start space-x-2">
                  <span class="text-xs">💈</span>
                  <p class="text-[9px] text-blue-700 dark:text-blue-300 font-medium leading-tight">{{ $t('services_page.payment.receipt_desc') }}</p>
                </div>
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
        leave-to-class="modal-leave-to">
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
                    {{ cancelModalTexts[selectedService.rawStatus]?.title || $t('services_page.modal.cancel_service') }}
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
                  {{ cancelModalTexts[selectedService.rawStatus]?.message || $t('services_page.modal.cancel_warning') }}
                </p>
              </div>

              <div class="space-y-2">
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  {{ $t('services_page.modal.cancel_reason') }}:
                </p>
                <textarea 
                  v-model="cancelAdditionalInfo" 
                  rows="3" 
                  class="w-full px-3 py-3 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 transition-all duration-200"
                  :placeholder="$t('services_page.modal.cancel_placeholder')"
                ></textarea> 
              </div>
            </div>
          </div>

          <!-- Pie del modal -->
          <div class="sticky bottom-0 bg-gray-50 dark:bg-gray-800/80 px-3 py-2 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex justify-end space-x-2 backdrop-blur-sm">
            <button 
              @click="closeCancelModal" 
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {{ $t('common.go_back') }}
            </button>
            <button 
              @click="cancelarSolicitud" 
              :disabled="!cancelAdditionalInfo.trim() || isCancelling"
              class="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              <span v-if="!isCancelling">
                {{ $t('services_page.modal.cancel_confirm') }}
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('common.cancelling') }}...
              </span>
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition> 

  <!-- Modal de Cotización -->

  <!-- Standard Quotation Modal -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showQuotationModal = false"></div>
      
      <Transition name="modal-content" enter-active-class="modal-content-enter-active" leave-active-class="modal-content-leave-active" enter-from-class="modal-content-enter-from" leave-to-class="modal-content-leave-to">
        <div v-if="showQuotationModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10" @click.stop>
          
          <!-- Encabezado -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-base">
                  📜
                </div>
                <div>
                  <h3 class="text-base font-black text-gray-900 dark:text-white">{{ $t('services_page.modals.technical_proposal') }}</h3>
                  <p class="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wider">{{ $t('services_page.modals.order_prefix') }} #{{ formatDateDDMMYY(selectedService.rawDate) }}-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="showQuotationModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-3 space-y-4">
            <div v-if="isLoadingQuotation" class="p-12 flex justify-center">
              <div class="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>

            <template v-else>
              <!-- Diagnóstico -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-black text-gray-900 dark:text-white">{{ $t('services_page.modals.diagnosis') }}</h4>
                </div>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{{ quotationData?.comentario || $t('services_page.modals.diagnosis_ready') }}"
                  </p>
                </div>
              </div>

              <!-- Estructura de Costos -->
              <div class="space-y-2">
                <h4 class="text-sm font-black text-gray-900 dark:text-white">{{ $t('services_page.modals.investment') }}</h4>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-blue-800 dark:text-blue-200 font-bold">{{ $t('services_page.payment.labor') }}</span>
                    <span class="font-black text-blue-900 dark:text-white">L. {{ formatCurrency(quotationData?.monto_manodeobra) }}</span>
                  </div>

                  <div v-if="shouldShowCreditBenefit && parseFloat(membresiaProgreso?.monto_credito || 0) > 0" class="flex justify-between items-center text-xs pt-2 border-t border-blue-200/50 dark:border-blue-800">
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">{{ $t('services_page.modals.membership_credit') }}</span>
                    <span class="font-black text-emerald-600">−L. {{ formatCurrency(Math.min((parseFloat(quotationData?.monto_manodeobra || 0)), parseFloat(membresiaProgreso?.monto_credito || 0))) }}</span>
                  </div>

                  <div class="flex justify-between items-center pt-2 border-t-2 border-blue-300 dark:border-blue-700">
                    <span class="text-sm font-black text-blue-900 dark:text-white">{{ $t('services_page.modals.net_total') }}</span>
                    <span class="text-lg font-black text-blue-900 dark:text-white">L. {{ formatCurrency(getDiscountedPrice()) }}</span>
                  </div>
                </div>

                <!-- Estimación de Materiales (Fuera del Desglose) -->
                <div v-if="Number(quotationData?.monto_materiales) > 0" class="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ $t('services_page.modals.materials') }}</span>
                    <span class="text-xs font-black text-gray-700 dark:text-white">L. {{ formatCurrency(quotationData?.monto_materiales) }}</span>
                  </div>
                  <p class="text-[9px] text-gray-500 dark:text-gray-400 font-medium leading-tight">
                    * {{ $t('services_page.modals.materials_desc') }}
                  </p>
                </div>

                <!-- Cashback Info -->
                <div v-if="shouldShowDiscountBenefit && cashbackAmount > 0" class="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">✨ {{ $t('marketplace.featured') }}</span>
                    <span class="text-xs font-black text-emerald-700 dark:text-emerald-300">+L. {{ formatCurrency(cashbackAmount) }}</span>
                  </div>
                  <p class="text-[9px] text-emerald-600/80 dark:text-emerald-400/80 font-medium leading-tight">
                    * {{ $t('services_page.payment.cashback_desc') }}
                  </p>
                </div>
              </div>

              <!-- Selector de Pago -->
              <div class="space-y-2">
                <h4 class="text-xs font-black text-gray-900 dark:text-white ml-1 text-center uppercase tracking-widest">{{ $t('services_page.modals.payment_method') }}</h4>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="taxiPaymentMethod = 'transferencia'"
                    type="button"
                    class="p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1"
                    :class="taxiPaymentMethod === 'transferencia' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
                  >
                    <span class="text-xl">💳</span>
                    <span class="text-[9px] font-black uppercase tracking-widest text-center" :class="taxiPaymentMethod === 'transferencia' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500'">{{ $t('services_page.modals.transfer') || 'Transferencia' }}</span>
                  </button>
                  <button 
                    @click="taxiPaymentMethod = 'efectivo'"
                    type="button"
                    class="p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1"
                    :class="taxiPaymentMethod === 'efectivo' ? 'border-green-600 bg-green-50 dark:bg-green-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
                  >
                    <span class="text-xl">💵</span>
                    <span class="text-[9px] font-black uppercase tracking-widest text-center" :class="taxiPaymentMethod === 'efectivo' ? 'text-green-700 dark:text-green-400' : 'text-gray-500'">{{ $t('services_page.modals.cash') }}</span>
                  </button>
                </div>
              </div>

              <!-- Input Billete (Solo si es efectivo) -->
              <Transition name="slide-down">
                <div v-if="taxiPaymentMethod === 'efectivo'" class="space-y-2">
                  <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{{ $t('services_page.modals.cash_amount') }}</h4>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">L.</span>
                    <input 
                      v-model="taxiCashBillAmount"
                      type="number"
                      inputmode="numeric"
                      :placeholder="$t('services_page.modals.cash_placeholder')"
                      class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 outline-none font-bold text-sm transition-all"
                    >
                  </div>
                  <p class="text-[9px] text-gray-500 italic ml-1">* {{ $t('services_page.modals.cash_change_desc') }}</p>
                </div>
              </Transition>

              <!-- Acciones -->
              <div class="flex gap-2 pt-2">
                <button @click="confirmRejectQuotation" :disabled="isProcessingQuotation" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
                  {{ $t('common.reject') }}
                </button>
                <button @click="acceptQuotation" :disabled="isProcessingQuotation" class="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest disabled:opacity-50 flex items-center justify-center">
                  <span v-if="!isProcessingQuotation">{{ $t('services_page.modals.confirm_proposal') }}</span>
                  <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </button>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Taxi VIP Quotation Modal -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to">
    <div v-if="showTaxiQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTaxiQuotationModal = false"></div>

      <!-- Contenido -->
      <Transition name="modal-content" enter-active-class="modal-content-enter-active" leave-active-class="modal-content-leave-active" enter-from-class="modal-content-enter-from" leave-to-class="modal-content-leave-to">
        <div v-if="showTaxiQuotationModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10" @click.stop>
          
          <!-- Encabezado -->
          <div class="sticky top-0 bg-yellow-400 p-3 border-b border-yellow-500 rounded-t-xl z-20">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-base">
                  🚗
                </div>
                <div>
                  <h3 class="text-base font-black text-black leading-none">{{ $t('services_page.modals.trip_tariff') }}</h3>
                  <p class="text-[10px] font-bold text-black/60 uppercase tracking-widest mt-1">TAXI-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="showTaxiQuotationModal = false" class="bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors">
                <svg class="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-3 space-y-4">
            <div v-if="isLoadingQuotation" class="py-12 flex justify-center">
              <div class="w-8 h-8 border-4 border-yellow-600/20 border-t-yellow-600 rounded-full animate-spin"></div>
            </div>
            
            <template v-else>
              <!-- Conductor -->
              <div v-if="selectedService.tecnico" class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <img 
                  :src="getOptimizedImage(selectedService.tecnico.imagen_url, 60, 60)" 
                  class="w-10 h-10 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  @error="handleImageError"
                  @click="() => {
                    selectedImage = getOptimizedImage(selectedService.tecnico.imagen_url, 800, 800, 'fit')
                    showImageModal = true
                  }"
                >
                <div>
                  <p class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ $t('services_page.modals.driver') }}</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedService.tecnico.nombre }}</p>
                </div>
              </div>
              <!-- Notas del Conductor -->
              <div v-if="quotationData?.comentario" class="space-y-2">
                <h4 class="text-sm font-black text-gray-900 dark:text-white ml-1">{{ $t('services_page.modals.driver_notes') }}</h4>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic text-center">
                    "{{ quotationData.comentario }}"
                  </p>
                </div>
              </div>
              <!-- Ruta -->
              <div class="space-y-1">
                <h4 class="text-sm font-black text-gray-900 dark:text-white ml-1">{{ $t('services_page.modals.itinerary') }}</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 pt-1.5 pb-3 px-3 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2 relative">
                  <!-- Línea conectora -->
                  <div class="absolute left-[19px] top-6 bottom-7 w-0.5 border-l-2 border-dotted border-gray-300 dark:border-gray-500"></div>
                  
                  <div class="flex items-start space-x-3 relative z-10">
                    <div class="mt-0.5 w-4 h-4 rounded-full border-2 border-emerald-500 bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                      <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">{{ $t('services_page.modals.pickup') }}</p>
                      <p class="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">{{ selectedService.fullLocation?.colonia || $t('services_page.modals.departure_point') }}</p>
                    </div>
                  </div>

                  <div class="flex items-start space-x-3 relative z-10">
                    <div class="mt-0.5 w-4 h-4 rounded-full border-2 border-red-500 bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                      <p class="text-[9px] font-black text-red-600 uppercase tracking-widest leading-none mb-0.5">{{ $t('services_page.modals.destination') }}</p>
                      <p class="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight">{{ selectedService.fullLocation?.direccion || $t('services_page.modals.final_destination') }}</p>
                    </div>
                  </div>
                </div>
              </div>
 

              <!-- Selector de Pago -->
              <div class="space-y-2">
                <h4 class="text-sm font-black text-gray-900 dark:text-white ml-1 text-center">{{ $t('services_page.modals.payment_method') }}</h4>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="taxiPaymentMethod = 'transferencia'"
                    type="button"
                    class="p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1"
                    :class="taxiPaymentMethod === 'transferencia' ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
                  >
                    <span class="text-xl">💳</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-center" :class="taxiPaymentMethod === 'transferencia' ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-500'">{{ $t('services_page.modals.transfer') || 'Transferencia' }}</span>
                  </button>
                  <button 
                    @click="taxiPaymentMethod = 'efectivo'"
                    type="button"
                    class="p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1"
                    :class="taxiPaymentMethod === 'efectivo' ? 'border-yellow-400 bg-yellow-400/10' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
                  >
                    <span class="text-xl">💵</span>
                    <span class="text-[10px] font-black uppercase tracking-widest text-center" :class="taxiPaymentMethod === 'efectivo' ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-500'">{{ $t('services_page.modals.cash') }}</span>
                  </button>
                </div>
              </div>

              <!-- Input Billete (Solo si es efectivo) -->
              <Transition name="slide-down">
                <div v-if="taxiPaymentMethod === 'efectivo'" class="space-y-2">
                  <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{{ $t('services_page.modals.cash_amount') }}</h4>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">L.</span>
                    <input 
                      v-model="taxiCashBillAmount"
                      type="number"
                      inputmode="numeric"
                      :placeholder="$t('services_page.modals.cash_placeholder')"
                      class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-sm transition-all"
                    >
                  </div>
                  <p class="text-[9px] text-gray-500 italic ml-1">* {{ $t('services_page.modals.cash_change_desc') }}</p>
                </div>
              </Transition>

              <!-- Tarifa -->
              <div class="bg-black p-4 rounded-lg shadow-xl shadow-black/10">
                <div class="flex flex-col items-center text-center">
                  <p class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1">{{ $t('services_page.payment.total_pay') }}</p>
                  <div class="text-3xl font-black tabular-nums transition-colors text-white">
                    L. {{ formatCurrency(quotationData?.monto_manodeobra || '0.00') }}
                  </div>
                </div>
              </div>

              <!-- Acciones -->
              <div class="flex gap-2 pt-2">
                <button @click="confirmRejectQuotation" :disabled="isProcessingQuotation" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
                  {{ $t('common.reject') }}
                </button>
                <button 
                  @click="acceptQuotation" 
                  :disabled="isProcessingQuotation || (taxiPaymentMethod === 'efectivo' && (!taxiCashBillAmount || taxiCashBillAmount <= 0))" 
                  class="flex-[2] py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-black rounded-lg shadow-lg shadow-yellow-500/20 active:scale-95 transition-all text-[10px] uppercase tracking-widest disabled:opacity-50 flex items-center justify-center"
                >
                  <span v-if="!isProcessingQuotation">{{ $t('services_page.modals.accept_cost') }}</span>
                  <div v-else class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </button>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>

  <!-- Barbería Quotation Modal -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to">
    <div v-if="showBarberiaQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showBarberiaQuotationModal = false"></div>

      <!-- Contenido -->
      <Transition name="modal-content" enter-active-class="modal-content-enter-active" leave-active-class="modal-content-leave-active" enter-from-class="modal-content-enter-from" leave-to-class="modal-content-leave-to">
        <div v-if="showBarberiaQuotationModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10" @click.stop>
          
          <!-- Encabezado -->
          <div class="sticky top-0 bg-gradient-to-r from-red-600 via-rose-500 to-blue-600 p-3 border-b border-blue-700/50 rounded-t-xl z-20 shadow-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-base shadow-inner border border-white/20">
                  💈
                </div>
                <div>
                  <h3 class="text-base font-black text-white leading-none">{{ $t('services_page.modals.service_cost') }}</h3>
                  <p class="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">BARBER-{{ selectedService.id }}</p>
                </div>
              </div>
              <button @click="showBarberiaQuotationModal = false" class="bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Contenido -->
          <div class="p-3 space-y-4">
            <div v-if="isLoadingQuotation" class="py-12 flex justify-center">
              <div class="w-8 h-8 border-4 border-slate-600/20 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
            
            <template v-else>
              <!-- Barbero -->
              <div v-if="selectedService.tecnico" class="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <img 
                  :src="getOptimizedImage(selectedService.tecnico.imagen_url, 100, 100)" 
                  class="w-10 h-10 rounded-lg object-cover shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                  @error="handleImageError"
                  @click="() => {
                    selectedImage = getOptimizedImage(selectedService.tecnico.imagen_url, 800, 800, 'fit')
                    showImageModal = true
                  }"
                >
                <div>
                  <p class="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{{ $t('services_page.modals.barber') }}</p>
                  <p class="text-sm font-bold text-gray-900 dark:text-white">{{ selectedService.tecnico.nombre }}</p>
                </div>
              </div>

              <!-- Localidad -->
              <div class="space-y-1">
                <h4 class="text-sm font-black text-gray-900 dark:text-white ml-1">{{ $t('services_page.modals.location') }}</h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 space-y-2 shadow-sm">
                  <div class="flex items-start space-x-3">
                    <div class="mt-0.5 w-4 h-4 rounded-full border-2 border-red-500 bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm shadow-red-500/20">
                      <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    </div>
                    <div class="flex-1">
                      <p class="text-[9px] font-black text-red-600 uppercase tracking-widest leading-none">
                        {{ selectedService.description?.includes('(en local:') ? 'En Local' : 'A Domicilio' }}
                      </p>
                      <p class="text-xs font-bold text-gray-700 dark:text-gray-300 leading-tight mt-1">
                        {{ selectedService.description?.includes('(en local:') 
                           ? (selectedService.description.match(/\(en local:\s*(.*?)\)/)?.[1]?.split(' - ')?.[0] || selectedService.fullLocation?.direccion) 
                           : (selectedService.fullLocation?.direccion || selectedService.fullLocation?.colonia || 'Dirección no especificada') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Notas del Barbero -->
              <div v-if="quotationData?.comentario" class="space-y-2">
                <h4 class="text-sm font-black text-gray-900 dark:text-white ml-1">{{ $t('services_page.modals.barber_notes') }}</h4>
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                  <p class="text-xs font-medium text-blue-800 dark:text-blue-200 leading-relaxed italic text-center">
                    "{{ quotationData.comentario }}"
                  </p>
                </div>
              </div>

              <!-- Tarifa -->
              <div class="bg-gradient-to-br from-gray-900 to-black p-4 rounded-lg shadow-xl shadow-blue-900/10 border border-gray-800 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-blue-500"></div>
                <div class="flex flex-col items-center mt-1">
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{{ $t('services_page.modals.estimated_cost') }}</p>
                  <div class="text-3xl font-black tabular-nums transition-colors" :class="Number(getDiscountedPrice()) < Number(quotationData?.monto_manodeobra || 0) ? 'line-through text-white/50' : 'text-white'">
                    L. {{ formatCurrency(quotationData?.monto_manodeobra || '0.00') }}
                  </div>
                  <div v-if="Number(getDiscountedPrice()) < Number(quotationData?.monto_manodeobra || 0)" class="mt-2 text-[10px] font-black text-white/80 uppercase">
                    {{ $t('services_page.modals.app_payment') }}: <span class="text-xs text-blue-400 tracking-wider underline decoration-2 underline-offset-4">L. {{ getDiscountedPrice() }}</span>
                  </div>
                </div>
              </div>

              <!-- Cashback -->
              <div v-if="shouldShowDiscountBenefit && cashbackAmount > 0" class="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest">✨ Cashback</span>
                  <span class="text-xs font-black text-red-700 dark:text-red-300">+L. {{ formatCurrency(cashbackAmount) }}</span>
                </div>
                <p class="text-[9px] text-red-600/80 dark:text-red-400/80 font-medium leading-tight">
                  * Como beneficio exclusivo de tu membresía activa, este monto se agregará a tu crédito.
                </p>
              </div>

              <!-- Selector de Pago -->
              <div class="space-y-2">
                <h4 class="text-xs font-black text-gray-900 dark:text-white ml-1 text-center uppercase tracking-widest">{{ $t('services_page.modals.payment_method') }}</h4>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="taxiPaymentMethod = 'transferencia'"
                    type="button"
                    class="p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1"
                    :class="taxiPaymentMethod === 'transferencia' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
                  >
                    <span class="text-xl">💳</span>
                    <span class="text-[9px] font-black uppercase tracking-widest text-center" :class="taxiPaymentMethod === 'transferencia' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500'">{{ $t('services_page.modals.transfer') || 'Transferencia' }}</span>
                  </button>
                  <button 
                    @click="taxiPaymentMethod = 'efectivo'"
                    type="button"
                    class="p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-1"
                    :class="taxiPaymentMethod === 'efectivo' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'"
                  >
                    <span class="text-xl">💵</span>
                    <span class="text-[9px] font-black uppercase tracking-widest text-center" :class="taxiPaymentMethod === 'efectivo' ? 'text-red-700 dark:text-red-400' : 'text-gray-500'">{{ $t('services_page.modals.cash') }}</span>
                  </button>
                </div>
              </div>

              <!-- Input Billete (Solo si es efectivo) -->
              <Transition name="slide-down">
                <div v-if="taxiPaymentMethod === 'efectivo'" class="space-y-2">
                  <h4 class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{{ $t('services_page.modals.cash_amount') }}</h4>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">L.</span>
                    <input 
                      v-model="taxiCashBillAmount"
                      type="number"
                      inputmode="numeric"
                      :placeholder="$t('services_page.modals.cash_placeholder')"
                      class="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none font-bold text-sm transition-all"
                    >
                  </div>
                  <p class="text-[9px] text-gray-500 italic ml-1">* {{ $t('services_page.modals.cash_change_desc') }}</p>
                </div>
              </Transition>

              <!-- Acciones -->
              <div class="flex gap-2 pt-2">
                <button @click="confirmRejectQuotation" :disabled="isProcessingQuotation" class="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-black rounded-lg text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50 border border-gray-200 dark:border-gray-600 shadow-sm">
                  {{ $t('common.reject') }}
                </button>
                <button @click="acceptQuotation" :disabled="isProcessingQuotation" class="flex-[2] py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-black rounded-lg shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-[10px] uppercase tracking-widest disabled:opacity-50 flex items-center justify-center">
                  <span v-if="!isProcessingQuotation">{{ $t('services_page.modals.accept_cost') }}</span>
                  <div v-else class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                </button>
              </div>
            </template>
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
              Al rechazar esta cotización, se asignará un nuevo Profesional para que realice una nueva valoración. 
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

  <!-- Modal de Confirmación de Rechazo Taxi VIP -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div v-if="showTaxiRejectConfirmation" class="fixed inset-0 z-50 flex items-center justify-center p-3">
      <!-- Backdrop con animación -->
      <Transition
        name="backdrop"
        enter-active-class="backdrop-enter-active"
        leave-active-class="backdrop-leave-active"
        enter-from-class="backdrop-enter-from"
        leave-to-class="backdrop-leave-to"
      >
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm"
          @click="showTaxiRejectConfirmation = false"
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
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden border border-gray-100 dark:border-gray-700">
          <!-- Encabezado con Icono -->
          <div class="bg-yellow-400 p-4 flex items-center space-x-3">
            <div class="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-lg transform -rotate-3">
              <span class="text-xl">🚗</span>
            </div>
            <div>
              <h3 class="text-base font-black text-black leading-tight">¿No te convence la tarifa?</h3>
              <p class="text-[10px] font-bold text-black/60 uppercase tracking-wider">CANCELACIÓN DE VIAJE</p>
            </div>
          </div>

          <!-- Cuerpo -->
          <div class="p-5">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4 text-center">
              <p class="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Al cancelar este viaje, buscaremos un nuevo conductor disponible cerca de ti.
              </p>
            </div>
            
            <p class="text-xs text-gray-500 dark:text-gray-400 text-center mb-5 italic">
              "Queremos asegurarnos de que recibas el mejor servicio al precio justo."
            </p>
            
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="showTaxiRejectConfirmation = false"
                class="py-3 px-4 text-xs font-black text-gray-500 uppercase tracking-widest bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                :disabled="isProcessingQuotation"
              >
                Volver
              </button>
              <button
                @click="rejectQuotation"
                class="py-3 px-4 text-xs font-black text-white uppercase tracking-widest bg-black dark:bg-yellow-500 dark:text-black rounded-xl hover:shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
                :disabled="isProcessingQuotation"
              >
                <div v-if="isProcessingQuotation" class="w-3 h-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                <span>{{ isProcessingQuotation ? 'PROCESANDO' : 'SÍ, CANCELAR' }}</span>
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

  <!-- Modal para ver imagen en grande -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div 
      v-if="showImageModal"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      @click.self="showImageModal = false"
    >
      <div class="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
        <button 
          @click="showImageModal = false"
          class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          :aria-label="$t('common.cancel')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-1 flex items-center justify-center">
          <img 
            :src="selectedImage" 
            class="max-w-full max-h-[80vh] object-contain"
            :alt="'Imagen de ' + (selectedService?.technicianName || $t('common.technician'))"
          />
        </div>
      </div>
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
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
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

/* Estilos para vue-multiselect */
.multiselect-custom {
  position: relative;
  z-index: 10;
}

.multiselect-custom :deep(.multiselect__tags) {
  min-height: 46px !important;
  padding: 10px 40px 10px 12px !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.75rem !important;
  background-color: transparent !important;
  font-size: 16px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

.dark .multiselect-custom :deep(.multiselect__tags) {
  background-color: transparent !important;
  border-color: rgb(75 85 99) !important;
  color: white !important;
}

.multiselect-custom :deep(.multiselect__tags:hover) {
  border-color: #d1d5db !important;
}

.dark .multiselect-custom :deep(.multiselect__tags:hover) {
  border-color: #6b7280 !important;
}

.multiselect-custom.multiselect--active :deep(.multiselect__tags) {
  border-color: #e5e7eb !important;
  box-shadow: none !important;
}

.multiselect-custom :deep(.multiselect__placeholder) {
  margin-bottom: 0 !important;
  padding: 0 !important;
  color: #9ca3af !important;
  font-size: 16px !important;
}

.dark .multiselect-custom :deep(.multiselect__placeholder) {
  color: #6b7280 !important;
}

.multiselect-custom :deep(.multiselect__single) {
  margin-bottom: 0 !important;
  padding: 0 !important;
  color: #111827 !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  background: transparent !important;
}

.dark .multiselect-custom :deep(.multiselect__single) {
  color: white !important;
}

.multiselect-custom :deep(.multiselect__select) {
  padding: 8px 12px !important;
}

.multiselect-custom :deep(.multiselect__select:before) {
  border-color: #6b7280 transparent transparent !important;
  top: 65% !important;
}

.dark .multiselect-custom :deep(.multiselect__select:before) {
  border-color: #9ca3af transparent transparent !important;
}

.multiselect-custom :deep(.multiselect__content-wrapper) {
  background-color: white !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  margin-top: 4px !important;
  z-index: 50 !important;
}

.dark .multiselect-custom :deep(.multiselect__content-wrapper) {
  background-color: #1f2937 !important;
  border-color: #374151 !important;
}

.multiselect-custom .multiselect__content {
  list-style: none;
  padding: 0;
  margin: 0;
}

.multiselect-custom .multiselect__element {
  padding: 0;
}

.multiselect-custom :deep(.multiselect__option) {
  padding: 12px 16px !important;
  min-height: 44px !important;
  font-size: 16px !important;
  cursor: pointer !important;
  color: #374151 !important;
  transition: all 0.2s ease !important;
}

.dark .multiselect-custom :deep(.multiselect__option) {
  color: #e5e7eb !important;
}

.multiselect-custom :deep(.multiselect__option:hover) {
  background-color: transparent !important;
  color: #111827 !important;
}

.dark .multiselect-custom :deep(.multiselect__option:hover) {
  background-color: transparent !important;
  color: white !important;
}

.multiselect-custom :deep(.multiselect__option--selected) {
  background-color: transparent !important;
  color: #1e40af !important;
  font-weight: 700 !important;
}

.dark .multiselect-custom :deep(.multiselect__option--selected) {
    background-color: transparent !important;
    color: #f9fafb !important;
}

.multiselect-custom :deep(.multiselect__option--highlight) {
  background-color: transparent !important;
  color: inherit !important;
  font-weight: 700 !important;
}

.multiselect-custom .multiselect__option--highlight::after {
  content: '';
}

.multiselect-custom .multiselect__spinner {
  background: transparent;
}

.multiselect-custom .multiselect__spinner::before,
.multiselect-custom .multiselect__spinner::after {
  border-color: #3b82f6 transparent transparent;
}


.multiselect-custom-v2 .multiselect__tags {
  min-height: 42px;
  padding: 8px 40px 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.dark .multiselect-custom-v2 .multiselect__tags {
  background-color: #1f2937;
  border-color: #374151;
  color: white;
}

.multiselect-custom-v2 .multiselect__placeholder {
  color: #9ca3af;
  margin-bottom: 8px;
  padding-top: 2px;
}

.multiselect-custom-v2 .multiselect__single {
  background: transparent;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.dark .multiselect-custom-v2 .multiselect__single {
  color: #f9fafb;
}

.multiselect-custom-v2 .multiselect__content-wrapper {
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.dark .multiselect-custom-v2 .multiselect__content-wrapper {
  background-color: #1f2937;
  border-color: #374151;
}

.multiselect-custom-v2 .multiselect__option--highlight {
  background: #3b82f6;
}

.multiselect-custom-v2 .multiselect__option--selected {
  background: #f3f4f6;
  color: #111827;
  font-weight: 700;
}

.dark .multiselect-custom-v2 .multiselect__option--selected {
  background: #374151;
  color: white;
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead, useCookie, useRouter } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'
import Multiselect from 'vue-multiselect'

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const { $api } = useNuxtApp();
const { t: $t, locale } = useI18n()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: $t('welcome') + ' - Dashboard',
  meta: [
    { name: 'description', content: $t('dashboard_client.seo.description', 'Panel de Servicios - Gestiona tus servicios y membresía') },
    { name: 'keywords', content: $t('dashboard_client.seo.keywords') },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Service filters
const serviceFilters = computed(() => [
  { key: 'all', label: $t('services_page.filters.all') },
  { key: 'pending', label: $t('services_page.filters.pending') },
  { key: 'completed', label: $t('services_page.filters.completed') },
  { key: 'cancelled', label: $t('services_page.filters.cancelled') }
])

const currentTab = ref('active')
const assignedVehiculo = ref(null)
const loadingVehiculo = ref(false)
const toast = ref({
    show: false,
    message: '',
    type: 'success',
    duration: 3000
})
const datePeriods = computed(() => [
    { label: $t('services_page.filters.all'), value: 'all' },
    { label: $t('services_page.filters.today'), value: 'today' },
    { label: $t('services_page.filters.week'), value: 'week' },
    { label: $t('services_page.filters.month'), value: 'month' },
    { key: 'quarter', label: $t('services_page.filters.quarter') }
])

const switchTab = async (tab) => {
    if (currentTab.value === tab) return
    currentTab.value = tab
    // Reset services and pagination
    allServices.value = []
    currentPage.value = 1
    hasMoreServices.value = true
    await loadServices(true)
}

// Helper para detectar Viaje Privado sin importar capitalización
const isViajePrivado = (title) => title?.trim().toLowerCase() === 'viaje privado'

// Service steps
const serviceSteps = computed(() => {
  if (isViajePrivado(selectedService.value?.title)) {
    return [
      { id: 1, title: $t('services_page.steps.trip_pending_assignment.title'), description: $t('services_page.steps.trip_pending_assignment.desc') },
      { id: 2, title: $t('services_page.steps.trip_assigned.title'), description: $t('services_page.steps.trip_assigned.desc') },
      { id: 3, title: $t('services_page.steps.trip_quotation.title'), description: $t('services_page.steps.trip_quotation.desc') },
      { id: 4, title: $t('services_page.steps.trip_in_progress.title'), description: $t('services_page.steps.trip_in_progress.desc') },
      { id: 5, title: $t('services_page.steps.trip_finished.title'), description: $t('services_page.steps.trip_finished.desc') }
    ]
  } else if (selectedService.value?.title === 'Barbería') {
    return [
      { id: 1, title: $t('services_page.steps.pending_assignment.title'), description: $t('services_page.steps.pending_assignment.desc') },
      { id: 2, title: $t('services_page.steps.assigned.title'), description: $t('services_page.steps.assigned.desc') },
      { id: 3, title: $t('services_page.quotation.barber_title'), description: $t('services_page.steps.quotation.desc') },
      { id: 4, title: $t('services_page.steps.in_progress.title'), description: $t('services_page.steps.in_progress.desc') },
      { id: 5, title: $t('services_page.steps.finished.title'), description: $t('services_page.steps.finished.desc') }
    ]
  }
  return [
    { id: 1, title: $t('services_page.steps.pending_assignment.title'), description: $t('services_page.steps.pending_assignment.desc') },
    { id: 2, title: $t('services_page.steps.assigned.title'), description: $t('services_page.steps.assigned.desc') },
    { id: 3, title: $t('services_page.steps.quotation.title'), description: $t('services_page.steps.quotation.desc') },
    { id: 4, title: $t('services_page.steps.in_progress.title'), description: $t('services_page.steps.in_progress.desc') },
    { id: 5, title: $t('services_page.steps.finished.title'), description: $t('services_page.steps.finished.desc') }
  ]
})

// Títulos y textos para el modal de cancelación
const cancelModalTexts = computed(() => ({
  pendiente_asignacion: {
    title: $t('services_page.modal.cancel_request'),
    confirmButton: $t('common.confirm'),
  },
  asignado: {
    title: $t('services_page.modal.cancel_service'),
    confirmButton: $t('common.confirm'),
  },
  en_proceso: {
    title: $t('services_page.modal.report_problem'),
    confirmButton: $t('common.send'),
  },
  default: {
    title: $t('services_page.modal.cancel_service'),
    confirmButton: $t('common.confirm'),
  }
}))

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga y datos principales
const isLoading = ref(true)
const discountPercentage = ref(10) // Porcentaje de descuento regular (valor por defecto 10%)
const specialDiscountPercentage = ref(15) // Porcentaje de descuento especial (valor por defecto 15%)
const creditApplied = ref(0) // Monto de crédito realmente aplicado en el servicio actual
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

// Estados de paginación
const currentPage = ref(1)
const hasMoreServices = ref(false)
const isLoadingMore = ref(false)

// Estados de modales
const showServiceModal = ref(false)
const showPaymentModal = ref(false) 
const showTaxiPaymentModal = ref(false)
const showBarberiaPaymentModal = ref(false)
const showVisitPaymentModal = ref(false)
const showCancelModal = ref(false)
const showQuotationModal = ref(false)
const showTaxiQuotationModal = ref(false)
const showBarberiaQuotationModal = ref(false)
const showRatingModal = ref(false) 
const showImageModal = ref(false)
const selectedImage = ref('')

// Bloquear scroll cuando un modal está abierto
const anyModalOpen = computed(() => {
  return showServiceModal.value || 
         showPaymentModal.value || 
         showTaxiPaymentModal.value || 
         showBarberiaPaymentModal.value || 
         showVisitPaymentModal.value || 
         showCancelModal.value || 
         showQuotationModal.value || 
         showTaxiQuotationModal.value || 
         showBarberiaQuotationModal.value || 
         showRatingModal.value || 
         showImageModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
}) 

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
const showTaxiRejectConfirmation = ref(false)
const rejectReason = ref('') 

// Estados de pago Taxi VIP
const taxiPaymentMethod = ref('efectivo') // Solo 'efectivo'
const taxiCashBillAmount = ref('')

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
const selectedAccountObject = ref(null)
const comprobante = ref('')
const isProcessingPayment = ref(false)
const isProcessingVisitPayment = ref(false) // Estado para el procesamiento del pago de visita
const membresiaProgreso = ref(null)
const isLoadingMembresia = ref(false)
const visitCost = ref(0)


// Función para obtener la etiqueta de la cuenta bancaria
const getAccountLabel = (option) => {
  if (!option) return ''
  return `🏦 ${option.banco}`
}

// =========================
// COMPUTED PROPERTIES
// =========================

const totalServices = computed(() => servicesData.value.total || allServices.value.length)
const completedServices = computed(() => servicesData.value.finalizadas || allServices.value.filter(s => ['calificado', 'cancelado'].includes(s.rawStatus)).length)
const pendingServices = computed(() => servicesData.value.pendientes || allServices.value.filter(s => !['calificado', 'cancelado'].includes(s.rawStatus)).length)

// Referencia reactiva para almacenar el servicio seleccionado
const selectedServiceRef = ref({})

// Estado para controlar la carga de la imagen del Profesional
const imageLoaded = ref(false)

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
      filtered = filtered.filter(s => !['calificado', 'cancelado'].includes(s.rawStatus))
    } else if (currentFilter.value === 'completed') {
      filtered = filtered.filter(s => s.rawStatus === 'calificado')
    } else if (currentFilter.value === 'cancelled') {
      filtered = filtered.filter(s => s.rawStatus === 'cancelado')
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
  if (status === 'pendiente_pagovisita') return true;
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
  const isTaxi = selectedService.value?.title === 'Viaje Privado'
  
  if (status === 'cancelado') return isTaxi ? $t('services_page.status.trip_scheduled') : $t('services_page.status.cancelled') // This is a bit weird but let's use keys
  if (status === 'completado') return isTaxi ? $t('services_page.steps.finished.title') : $t('services_page.steps.finished.title')
  if (status === 'en_proceso') return $t('services_page.modal.report_problem')
  if (status === 'asignado') return isTaxi ? $t('services_page.modal.cancel_trip') : $t('services_page.modal.cancel_service')
  if (status === 'pendiente_pago') return isTaxi ? $t('services_page.modal.cancel_trip') : $t('services_page.modal.cancel_service')
  
  return isTaxi ? $t('services_page.modal.cancel_trip') : $t('services_page.modal.cancel_service')
})

// Computed properties para determinar si mostrar los beneficios
const shouldShowDiscountBenefit = computed(() => {
  return membresiaProgreso.value?.tiene_membresia && (membresiaProgreso.value?.porcentaje_descuento > 0);
});

const shouldShowCreditBenefit = computed(() => {  
  
  if (!membresiaBeneficios.value.length || !membresiaProgreso.value) { 
     return false;
  }
  
  const creditBenefit = membresiaBeneficios.value.find(
    beneficio => beneficio.tipo_beneficio === 'Crédito acumulable activado'
  ); 
   
  
  if (!creditBenefit) {  
    return false;
  }
  
  const cumpleRequisito = membresiaProgreso.value.mesesProgreso >= creditBenefit.mes_requerido;
   
  return cumpleRequisito;
}); 

const cashbackAmount = computed(() => {
  // Si el método de pago seleccionado es efectivo, no hay beneficio de cashback
  if (taxiPaymentMethod.value === 'efectivo') {
    return 0;
  }

  const basePrice = getDiscountedPrice();
  const netTotal = parseFloat(basePrice);
  if (!netTotal) return 0;
  
  const percentage = (membresiaProgreso.value?.porcentaje_descuento || 0) / 100;
  return netTotal * percentage;
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
  return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : 'es-ES', options)
}

const formatDateDDMMYY = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

const getServiceIcon = (serviceName) => {
  if (!serviceName) return '🛠️'
  const name = serviceName.toLowerCase()
  if (name.includes('viaje') || name.includes('taxi')) return '🚗'
  if (name.includes('barber') || name.includes('peluquería') || name.includes('salón')) return '💈'
  if (name.includes('aire') || name.includes('ac') || name.includes('clima')) return '❄️'
  if (name.includes('fontan') || name.includes('plomer') || name.includes('tubo')) return '💧'
  if (name.includes('electri') || name.includes('luz')) return '💡'
  if (name.includes('limpie') || name.includes('aseo')) return '🧹'
  if (name.includes('carpin') || name.includes('madera')) return '🚪'
  if (name.includes('pintur')) return '🎨'
  if (name.includes('jardin') || name.includes('planta')) return '🌿'
  if (name.includes('cámara')) return '🎥'
  if (name.includes('cerraj') || name.includes('llave')) return '🔑'
  if (name.includes('mudanz')) return '🚚'
  if (name.includes('teléfono') || name.includes('computadora') || name.includes('laptop')) return '💻'
  if (name.includes('edecanes')) return '🧜‍♀️'
  return '🛠️'
}

const getStatusColor = (status) => {
  const colors = {
    [$t('services_page.status_labels.finished')]: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    [$t('services_page.status_labels.verifying_visit')]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    [$t('services_page.status_labels.visit_rejected')]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    [$t('services_page.status_labels.service_rejected')]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    [$t('services_page.status_labels.verifying_service')]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    [$t('services_page.status_labels.in_progress')]: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    [$t('services_page.status_labels.pending_quote')]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    [$t('services_page.status_labels.tech_assigned')]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    [$t('services_page.status_labels.driver_assigned')]: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    [$t('services_page.status_labels.req_received')]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    [$t('services_page.status_labels.waiting_driver')]: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    [$t('services_page.status_labels.unrated')]: 'bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    [$t('services_page.status_labels.cancelled')]: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const getTimeAgo = (date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = Math.floor((now - targetDate) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return $t('common.today')
  if (diffInDays === 1) return $t('common.yesterday')
  if (diffInDays < 7) return $t('common.days_ago', { n: diffInDays })
  return $t('common.weeks_ago', { n: Math.floor(diffInDays / 7) })
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

const isActionRequired = (service) => {
  return service.rawStatus === 'pendiente_pagovisita' || 
         service.rawStatus === 'pendiente_pagoservicio' || 
         service.rawStatus === 'pendiente_cotizacion' ||
         service.rawStatus === 'finalizado';
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
// FUNCIONES DE MANEJO DE IMÁGENES
// =========================

const getOptimizedImage = (imageUrl, width = 300, height = 200, crop = 'fill') => {
  if (!imageUrl) return '';
  
  // Si la imagen ya es una URL de Cloudinary, aplicar transformaciones
  if (imageUrl.includes('res.cloudinary.com')) {
    // Extraer la ruta base de la URL
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length === 2) {
      return `${urlParts[0]}/upload/c_${crop},w_${width},h_${height},q_auto:good/${urlParts[1]}`;
    }
  }
  
  // Si no es una URL de Cloudinary, devolver la URL original
  return imageUrl;
};

const handleImageError = (event, fallbackImage = '/img/placeholder-user.jpg') => {
  // Si ya estamos mostrando la imagen de respaldo, no hacer nada
  if (event.target.src.endsWith(fallbackImage)) return;
  
  // Establecer la imagen de respaldo
  event.target.src = fallbackImage;
  
  // Asegurarse de que la imagen de respaldo se muestre correctamente
  event.target.onerror = null;
};

// =========================
// FUNCIONES DE MAPEO DE DATOS
// =========================

const mapApiStatusToLocal = (apiStatus, servicio = {}) => {
  
  // Si el estado es 'pendiente_pagovisita' y el pago fue rechazado, mostramos 'Pago Visita Rechazado'
  if (apiStatus === 'pendiente_pagovisita' && servicio.pagovisitaRechazado) {
    return $t('services_page.status_labels.visit_rejected');
  }
  
  // Si el estado es 'pendiente_pagoservicio' y la cotización fue rechazada, mostramos 'Pago del Servicio Rechazado'
  if (apiStatus === 'pendiente_pagoservicio' && servicio.cotizacion_estado === 'rechazado') {
    return $t('services_page.status_labels.service_rejected');
  }
  
  const statusMap = {
    'pendiente_pagovisita': $t('services_page.steps.pending_payment.title'),
    'verificando_pagovisita': $t('services_page.status_labels.verifying_visit'),
    'pendiente_asignacion': isViajePrivado(servicio.title) ? $t('services_page.status_labels.waiting_driver') : $t('services_page.status_labels.req_received'),
    'asignado': isViajePrivado(servicio.title) ? $t('services_page.status_labels.driver_assigned') : $t('services_page.status_labels.tech_assigned'),
    'pendiente_cotizacion': $t('services_page.status_labels.pending_quote'),
    'en_proceso': $t('services_page.status_labels.in_progress'),
    'pendiente_pagoservicio': $t('services_page.steps.finished.title'),
    'verificando_pagoservicio': $t('services_page.status_labels.verifying_service'),
    'finalizado': $t('services_page.status_labels.unrated'),
    'calificado': $t('services_page.status_labels.finished'),
    'cancelado': $t('services_page.status_labels.cancelled')
  }
  return statusMap[apiStatus] || $t('dashboard_client.in_progress')
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
    icon: getServiceIcon(apiService.servicio?.nombre),
    status: mapApiStatusToLocal(apiService.estado, { 
      pagovisitaRechazado,
      cotizacion_estado: apiService.cotizacion_estado,
      title: apiService.servicio?.nombre || 'Servicio General'
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
    technician: apiService.id_tecnico,
    // Incluir la propiedad tecnico si está presente
    ...(apiService.tecnico && { tecnico: { ...apiService.tecnico } })
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
    
    const response = await $api('/membresiabeneficios', {
      method: 'GET'
    });
     
    
    if (response && response.beneficios) { 
      const creditoBeneficio = response.beneficios.find(b => b.tipo_beneficio === 'Crédito acumulativo'); 
      
      membresiaBeneficios.value = response.beneficios;
    } else {
      console.warn('No se encontraron beneficios en la respuesta:', response);
      membresiaBeneficios.value = [];
    }
  } catch (error) {
    console.error('Error al obtener beneficios de membresía:', error);
    membresiaBeneficios.value = [];
  } finally {
    isLoadingBeneficios.value = false;
  }
};
 

const loadServices = async (reset = true) => {
  try {
    const userCookieValue = useCookie('user').value
    if (!userCookieValue?.id_usuario) {
      console.error('No se encontró ID de usuario')
      return
    }

    if (reset) {
        currentPage.value = 1
        isLoading.value = true
        hasMoreServices.value = false
    } else {
        isLoadingMore.value = true
    }

    const params = {
      page: currentPage.value,
      limit: 10,
      status: currentTab.value // Send 'active' or 'finished'
    }
    const response = await $api(`/solicitudservicio/usuario/${userCookieValue.id_usuario}`, {
      method: 'GET',
      params: params
    })

    if (reset) {
        servicesData.value = response;
    } else {
        // Update totals but keep accumulation logic separation
        servicesData.value.total = response.total;
        servicesData.value.finalizadas = response.finalizadas;
        servicesData.value.pendientes = response.pendientes;
    }

    hasMoreServices.value = response.hasMore;
    
    // Verificar el estado de los pagos para cada solicitud
    const solicitudesConPago = await Promise.all(response.solicitudes.map(async (solicitud) => {
      // Verificar estado del pago de la visita si corresponde
      if (solicitud.estado === 'pendiente_pagovisita') {
        try {
          const pagoResponse = await $api(`/pagovisita/solicitud/${solicitud.id_solicitud}`, {
            method: 'GET'
          });
          
          // Extraer el estado del pago de la respuesta anidada
          const estadoPago = pagoResponse.data?.estado || 'pendiente';
          
          const solicitudActualizada = {
            ...solicitud,
            pago_estado: estadoPago,
            _rawPagoResponse: pagoResponse // Guardar la respuesta completa para depuración
          };
          
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
          const response = await $api(`/cotizacion/solicitud/${solicitud.id_solicitud}`, {
            method: 'GET'
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
    const newMappedServices = solicitudesConPago.map(solicitud => {
      const servicioMapeado = mapApiServiceToLocal(solicitud);
      // Agregar el nombre del Profesional si está disponible
      if (solicitud.tecnico?.nombre) {
        servicioMapeado.technicianName = solicitud.tecnico.nombre;
      }
      return servicioMapeado;
    });

    if (reset) {
        allServices.value = newMappedServices
    } else {
        // Append new services
        allServices.value = [...allServices.value, ...newMappedServices]
    }
    
  } catch (error) {
    console.error('Error cargando servicios:', error)
    // showError('Error al cargar los servicios') // Optional: suppress if incremental load fails?
  } finally {
      isLoading.value = false
      isLoadingMore.value = false
  }
}

const loadMoreServices = async () => {
    if (isLoadingMore.value || !hasMoreServices.value) return;
    currentPage.value++
    await loadServices(false)
}

const loadServiceTypes = async () => {
  try {
    isLoadingServiceTypes.value = true
    const userRole = useCookie('user').value
    const id_ciudad = userRole?.id_ciudad
    
    const data = await $api('/servicios/activos', {
      method: 'GET',
      params: id_ciudad ? { id_ciudad } : {}
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
    
    const response = await $api(`/cotizacion/solicitud/${solicitudId}`, {
      method: 'GET'
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
    const data = await $api('/cuentas', {
      method: 'GET'
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
    const data = await $api('/config/valor/visita_tecnico', {
      method: 'GET'
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
  // Solo lectura: usar el objeto original directamente
  selectedServiceId.value = service.id;
  selectedServiceRef.value = service;
  showServiceModal.value = true;
  
  // Si hay un Profesional asignado, cargar su calificación
  if (service.technician) {
    if (!service.technicianName && service.tecnico?.nombre) {
      service.technicianName = service.tecnico.nombre;
    } else if (!service.technicianName) {
      service.technicianName = `Profesional #${service.technician}`;
    }
     
    await fetchTecnicoRating(service.technician);

    // Si es Viaje Privado y está asignado o en proceso, cargar datos del vehículo
    if (isViajePrivado(service.title) && ['asignado', 'en_proceso'].includes(service.rawStatus)) {
      await fetchAssignedVehiculo(service.technician);
    } else {
      assignedVehiculo.value = null;
    }
  } else {
    assignedVehiculo.value = null;
  }
}

const closeServiceModal = () => {
  showServiceModal.value = false
  assignedVehiculo.value = null
}

const fetchAssignedVehiculo = async (tecnicoId) => {
  try {
    loadingVehiculo.value = true
    const data = await $api(`/vehiculos/conductor/${tecnicoId}`)
    if (data) {
      assignedVehiculo.value = data
    } else {
      assignedVehiculo.value = null
    }
  } catch (error) {
    console.error('Error al cargar vehículo asignado:', error)
    assignedVehiculo.value = null
  } finally {
    loadingVehiculo.value = false
  }
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
    
    // Mostrar el modal según el tipo de servicio
    if (isViajePrivado(service?.title)) {
      showTaxiPaymentModal.value = true
    } else if (service?.title === 'Barbería') {
      showBarberiaPaymentModal.value = true
    } else {
      showPaymentModal.value = true
    }
    
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
  showTaxiPaymentModal.value = false
  showBarberiaPaymentModal.value = false
  selectedAccount.value = ''
  comprobante.value = ''
  isProcessingPayment.value = false
}

const getDiscountedPrice = () => {
  const amount = parseFloat(quotationData.value?.monto_manodeobra || 0)
  if (!amount) return '0.00'
  
  // Si el método de pago es efectivo, no hay beneficio de descuento de membresía/crédito
  if (taxiPaymentMethod.value === 'efectivo') {
    return amount.toFixed(2)
  }
  
  let currentTotal = amount
  
  if (shouldShowCreditBenefit.value) {
    const availableCredit = parseFloat(membresiaProgreso.value?.monto_credito || 0)
    currentTotal = Math.max(0, currentTotal - availableCredit) 
  }
  
  return currentTotal.toFixed(2)
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
    
    // Cargar los datos de la cotización y membresía en paralelo
    const promises = [fetchQuotationData(service.id)];
    
    if (userData.value?.id_usuario) {
      promises.push(fetchMembresiaProgreso(userData.value.id_usuario));
    }
    
    await Promise.all(promises);
    
    // Reset variables de pago Taxi VIP
    taxiPaymentMethod.value = 'efectivo';
    taxiCashBillAmount.value = '';
    
    // Mostrar el modal según el tipo de servicio
    if (isViajePrivado(service.title)) {
      showTaxiQuotationModal.value = true;
    } else if (service.title === 'Barbería') {
      showBarberiaQuotationModal.value = true;
    } else {
      showQuotationModal.value = true;
    }
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
  showTaxiPaymentModal.value = false
  showBarberiaPaymentModal.value = false
  showVisitPaymentModal.value = false
  showCancelModal.value = false
  showQuotationModal.value = false
  showTaxiQuotationModal.value = false
  showBarberiaQuotationModal.value = false
  showRejectConfirmation.value = false
  showTaxiRejectConfirmation.value = false
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
      $api(`/membresia/progreso/${userId}`, {
        method: 'GET'
      }),
      // Obtener crédito del usuario
      $api(`/credito/usuario/${userId}`, {
        method: 'GET'
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
        tiene_membresia: true,
        monto_credito: parseFloat(creditoUsuario.monto_credito || 0),
        mesesProgreso: parseInt(membresiaResponse.mesesProgreso || 0),
        montoTotal: parseFloat(membresiaResponse.montoTotal || 0),
        valorMembresia: parseFloat(membresiaResponse.valorMembresia || 0),
        id_credito_usuario: creditoUsuario.id_credito_usuario || null,
        fecha_credito: creditoUsuario.fecha_creacion || null,
        // Solo necesitamos el porcentaje de descuento que ya viene calculado
        porcentaje_descuento: parseFloat(membresiaResponse.porcentaje_descuento || '0')
      };
    } else {
      // Si no hay datos de membresía, usar solo el crédito del usuario
      membresiaProgreso.value = {
        tiene_membresia: false,
        monto_credito: parseFloat(creditoUsuario.monto_credito || 0),
        mesesProgreso: 0,
        montoTotal: 0,
        valorMembresia: 0,
        id_credito_usuario: creditoUsuario.id_credito_usuario || null,
        fecha_credito: creditoUsuario.fecha_creacion || null,
        porcentaje_descuento: 0
      };
    }
    
    // Actualizar las variables reactivas de descuento
    if (membresiaProgreso.value) {
      discountPercentage.value = membresiaProgreso.value.porcentaje_descuento;
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
    const response = await $api('/calificaciones', {
      method: 'POST',
      body: ratingData
    })
    
    try {
      // Actualizar el estado del servicio a 'calificado' directamente
      const updateResponse = await $api(`/solicitudservicio/${currentService.id}`, {
        method: 'PUT',
        body: {
          estado: 'calificado'
        }
      }) 

      // Notificar al Profesional sobre la calificación
      try {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Calificacion Recibida',
            id_usuario: currentService.technician
          }
        });
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Calificacion Recibida',
            nombre_rol: 'admin'
          }
        });
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Calificacion Recibida',
            nombre_rol: 'sa'
          }
        });
      } catch (error) {
        console.error('Error al enviar notificaciones de calificación:', error);
      }

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
    const cotizacionId = quotationData.value?.id || quotationData.value?.id_cotizacion; 
    
    if (!cotizacionId) throw new Error('No se pudo encontrar el ID de la cotización');
    
    const token = useCookie('token').value;
    if (!token) throw new Error('No se encontró el token de autenticación');
    
    // 1. Aceptar la cotización 
    const cotizacionUpdate = { estado: 'aceptado' }; 
    
    // Si el método de pago es efectivo, resetear campos de transferencia y beneficios en la cotización
    if (taxiPaymentMethod.value === 'efectivo') {
      cotizacionUpdate.id_cuenta = null;
      cotizacionUpdate.num_comprobante = null;
      cotizacionUpdate.descuento_membresia = 0;
      cotizacionUpdate.credito_usado = 0;
    }
    
    const cotizacionResponse = await $api(`/cotizacion/${cotizacionId}`, {
      method: 'PUT',
      body: cotizacionUpdate
    }); 
    
    // 2. Actualizar el estado de la solicitud 
    if (!selectedServiceId.value) throw new Error('No se encontró el ID de la solicitud de servicio');
    
    const solicitudUpdate = { estado: 'en_proceso' };
    
    // Agregar información de pago en la descripción si es efectivo
    if (taxiPaymentMethod.value === 'efectivo') {
      const amount = taxiCashBillAmount.value || '0';
      // Actualizar la descripción agregando el detalle del efectivo (necesario para detección en ServiciosTecnico.vue)
      const currentDesc = selectedService.value.description || '';
      solicitudUpdate.descripcion = `${currentDesc} Pago efectivo (L. ${amount})`.trim();
    }
    
    const solicitudResponse = await $api(`/solicitudservicio/${selectedServiceId.value}`, {
      method: 'PUT',
      body: solicitudUpdate
    }); 
    
    // 3. Registrar movimiento
    
    // Obtener el ID del Profesional de los datos del servicio
    const servicioActual = servicesData.value.solicitudes.find(s => s.id_solicitud === selectedServiceId.value);
    const idTecnico = servicioActual?.id_tecnico;
    
    if (!idTecnico) throw new Error('No se encontró el ID del Profesional en la solicitud de servicio');
    
    const configResponse = await $api('/config/valor/comision_por_servicio', {
      method: 'GET'
    });
    
    if (!configResponse?.valor) throw new Error('No se pudo obtener el porcentaje de comisión');
    
    const porcentajeComision = parseFloat(configResponse.valor);
    const factorComision = porcentajeComision / 100;
    
    // Obtener el monto de mano de obra del campo correcto
    const montoManoObra = Number(quotationData.value.monto_manodeobra); 
    
    if (isNaN(montoManoObra) || montoManoObra < 0) {
      throw new Error(`El monto de mano de obra no es válido: ${quotationData.value.monto_manodeobra}`);
    } 
    
    const montoTecnico = montoManoObra * factorComision;
    const montoCliente = montoManoObra - montoTecnico;

    const movimientoData = {
      id_usuario: idTecnico,
      id_cotizacion: cotizacionId,
      tipo: 'ingreso',
      monto: Number(montoCliente.toFixed(2)), 
      estado: 'pendiente'
    };
    
    const movimientoResponse = await $api('/movimientos', {
      method: 'POST',
      body: movimientoData
    });
    
    // Notificar al Profesional sobre la cotización aceptada
    try {
      const servicioActual = servicesData.value.solicitudes.find(s => s.id_solicitud === selectedServiceId.value);
      const idTecnico = servicioActual?.id_tecnico;
      
      if (idTecnico) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Cotización Aceptada',
            id_usuario: idTecnico
          }
        });
      }
    } catch (error) {
      console.error('Error al enviar notificación al Profesional:', error);
    }
    
    // Cerrar modal y recargar datos
    showQuotationModal.value = false;
    showTaxiQuotationModal.value = false;
    showBarberiaQuotationModal.value = false;
    
    await new Promise(resolve => setTimeout(resolve, 300)); // esperar animación
    await loadServices();
    
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
  if (selectedService.value.title === 'Taxi VIP') {
    showTaxiRejectConfirmation.value = true
  } else {
    showRejectConfirmation.value = true
  }
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
    
    // Cerrar el modal de confirmación
    showRejectConfirmation.value = false;
    showTaxiRejectConfirmation.value = false;
    
    // Deshabilitar botones mientras se procesa
    isProcessingQuotation.value = true
    
    // 1. Rechazar la cotización
    await $api(`/cotizacion/${cotizacionId}`, {
      method: 'PUT',
      body: {
        estado: 'rechazado'
      }
    });
    
    // 2. Actualizar el estado de la solicitud a 'pendiente_asignacion'
    if (selectedServiceId.value) {
      try {
        await $api(`/solicitudservicio/${selectedServiceId.value}`, {
          method: 'PUT',
          body: {
            estado: 'pendiente_asignacion'
          }
        });
      } catch (updateError) {
        console.error('Error al actualizar el estado de la solicitud:', updateError);
      }
    }
    
    // Notificar al Profesional y administradores sobre la cotización rechazada
    try {
      const servicioActual = servicesData.value.solicitudes.find(s => s.id_solicitud === selectedServiceId.value);
      const idTecnico = servicioActual?.id_tecnico;
      const isTaxi = selectedService.value?.title === 'Taxi VIP';
      const tituloNotif = isTaxi ? 'Tarifa Rechazada' : 'Cotización Rechazada';
      
      // Notificar al Profesional/conductor
      if (idTecnico) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: tituloNotif,
            id_usuario: idTecnico
          }
        });
      }

      // Notificar a administradores
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: tituloNotif,
          nombre_rol: 'admin'
        }
      });

      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: tituloNotif,
          nombre_rol: 'sa'
        }
      });
    } catch (error) {
      console.error('Error al enviar notificaciones de rechazo:', error);
    }
    
    // Cerrar el modal de cotización
    showQuotationModal.value = false
    showTaxiQuotationModal.value = false
    showBarberiaQuotationModal.value = false
    
    // Esperar a que la animación del modal termine
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Recargar los servicios
    await loadServices()
    
    // Mostrar notificación de éxito después de actualizar todo
    showSuccess('Cotización rechazada correctamente. Un nuevo Profesional será asignado a tu solicitud.')
    
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
// FUNCIONES DE PROCESAMIENTO
// =========================

const processVisitPayment = async () => {
  // Prevenir múltiples envíos
  if (isProcessingPayment.value) return;
  
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
    
    const response = await $api('/pagovisita', {
      method: 'POST',
      body: requestData
    });
 
// Asignar el id_pagovisita al selectedService
if (response?.data?.id_pagovisita) {
  selectedService.value.id_pagovisita = response.data.id_pagovisita;
}

    const token = useCookie('token').value;
    
    try {
      await $api(`/solicitudservicio/${selectedService.value.id}`, {
        method: 'PUT',
        body: { estado: 'verificando_pagovisita' }
      }); 
    } catch (updateError) {
      console.error('Error al actualizar el estado de la solicitud:', updateError);
      throw new Error(`Error al actualizar el estado de la solicitud: ${updateError.message}`);
    }

    
    
    // Notificar a los administradores sobre el pago de visita recibido
    try {
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Pago de visita recibido',
          nombre_rol: 'admin'
        }
      });
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Pago de visita recibido',
          nombre_rol: 'sa'
        }
      });
    } catch (error) {
      console.error('Error al enviar notificaciones de pago de visita:', error);
    }  
    
    // Mostrar mensaje de éxito
    showSuccess(
      '¡Pago Enviado!',
      'Una vez se verifique el pago, se le asignará un Profesional.'
    ); 
     //Enviar mensaje por WhatsApp
    sendWhatsAppMessage(
      selectedService.value, 
      'visit', 
      visitCost.value, 
      comprobante.value.trim()
    );
    
    // Limpiar y cerrar
    closeVisitPaymentModal();
    await loadServices();
    selectedAccount.value = '';
    comprobante.value = '';
    
    // Redirigir a la página de referir después de un pago exitoso
    navigateTo('/cliente/Referir');
    
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
  // Prevenir múltiples envíos
  if (isProcessingPayment.value) return;
  
  if (!selectedAccount.value) {
    showError('Por favor selecciona una cuenta bancaria');
    return;
  }
  
  if (!comprobante.value?.trim()) {
    showError('Por favor ingresa el número de comprobante');
    return;
  }
  
  isProcessingPayment.value = true;
  
  const payload = {
    id_cotizacion: Number(quotationData.value.id_cotizacion),
    id_solicitud: Number(selectedService.value.id),
    id_cuenta: Number(selectedAccount.value),
    // CORRECCIÓN: Usar monto_credito en lugar de monto_credito_mostrado
    monto_credito: Number(parseFloat(creditApplied.value || 0)),
    num_comprobante: comprobante.value,
    monto_manodeobra: Number(totalAPagar.value) || 0,
    id_usuario: auth.user.id_usuario,
    nombre: auth.user.nombre
  };
  
  // Agregar el beneficio de cashback (calculado sobre el total neto)
  if (shouldShowDiscountBenefit.value && cashbackAmount.value > 0) {
    payload.descuento_membresia = Math.round(cashbackAmount.value * 100) / 100;
  }

  try {
    const response = await $api('/pagoservicio/procesar', {
      method: 'POST',
      body: payload
    });

// Asignar el id_cotizacion al selectedService
if (response?.detalles?.id_cotizacion) {
  selectedService.value.id_cotizacion = response.detalles.id_cotizacion;
}
    
    // Notificar a los administradores sobre el pago de servicio recibido 
    try {
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Pago de servicio recibido',
          nombre_rol: 'admin'
        }
      }); 
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Pago de servicio recibido',
          nombre_rol: 'sa'
        }
      }); 
    } catch (error) {
      console.error('Error al enviar notificaciones de pago de servicio:', error);
    }  
    
    //Enviar mensaje por WhatsApp
    sendWhatsAppMessage(
      selectedService.value, 
      'service', 
      Number(totalAPagar.value) || 0, 
      comprobante.value.trim()
    ); 
    
    // Cerrar el modal de pago
    showPaymentModal.value = false;
    
    // Limpiar datos temporales
    comprobante.value = '';
    selectedAccount.value = null;
    
    // Actualizar la lista de servicios
    await loadServices();
    
    // Cerrar cualquier otro modal abierto
    showQuotationModal.value = false;
    
    // Redirigir a la página de referir después de un pago exitoso
    navigateTo('/cliente/Referir');
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
    
    // Obtener el servicio actual del modal usando selectedServiceRef
    const currentService = selectedServiceRef.value;
    
    // Actualizar el estado del servicio a cancelado
    const response = await $api(`/solicitudservicio/${selectedServiceId.value}`, {
      method: 'PUT',
      body: {
        estado: 'cancelado',
        comentario: cancelAdditionalInfo.value.trim()
      }
    });

    // Notificar al Profesional si está asignado, de lo contrario notificar a los administradores
    try {
      if (currentService?.technician) {
        // Notificar al Profesional asignado
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Servicio Cancelado',
            id_usuario: currentService.technician
          }
        });
      }
      
      // Notificar a los administradores
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Servicio Cancelado',
          nombre_rol: 'admin'
        }
      });
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Servicio Cancelado',
          nombre_rol: 'sa'
        }
      });
    } catch (notificationError) {
      console.error('Error al enviar notificación:', notificationError);
    }

    closeCancelModal()
    closeServiceModal()
    
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
// =========================

const totalAPagar = ref(0)

// Función para calcular el total basado en los beneficios dinámicos
const calcularTotal = () => {
  try {
    const montoManodeObra = parseFloat(quotationData.value?.monto_manodeobra || 0) || 0;
    let currentTotal = montoManodeObra;

    // 1. El descuento de membresía es un cashback: NO reduce el total a pagar.
    //    Se acredita al usuario cuando el admin acepta el pago.
    //    (No se modifica currentTotal por el descuento de membresía)

    // 3. Aplicar crédito, pero solo hasta que el total sea 0
    let actualCreditUsed = 0;
    if (shouldShowCreditBenefit.value && membresiaProgreso.value?.monto_credito > 0) {
      const montoCreditoDisponible = parseFloat(membresiaProgreso.value.monto_credito);
      actualCreditUsed = Math.min(currentTotal, montoCreditoDisponible);
      currentTotal -= actualCreditUsed;
    }

    // Guardar el crédito realmente aplicado para mostrarlo en el template
    creditApplied.value = actualCreditUsed;
    
    return currentTotal;
  } catch (error) {
    console.error('Error en calcularTotal:', error);
    creditApplied.value = 0;
    return 0;
  }
};

// Actualizar el total cuando cambien los datos relevantes
watch([() => quotationData.value?.monto_manodeobra, 
      () => membresiaProgreso.value?.monto_credito,
      () => membresiaProgreso.value?.mesesProgreso,
      () => discountPercentage.value,
      () => membresiaBeneficios.value], 
() => {
  try {
    const total = calcularTotal();
    totalAPagar.value = typeof total === 'number' ? total : 0;
  } catch (error) {
    console.error('Error al calcular el total:', error);
    totalAPagar.value = 0;
  }
}, { immediate: true, deep: true })

// Watch para sincronizar selectedAccount con selectedAccountObject
watch(() => selectedAccount.value, (newId) => {
  if (newId && bankAccounts.value.length > 0) {
    const accountObject = bankAccounts.value.find(acc => acc.id_cuenta === newId);
    if (accountObject && accountObject !== selectedAccountObject.value) {
      selectedAccountObject.value = accountObject;
    }
  } else if (!newId) {
    selectedAccountObject.value = null;
  }
}, { immediate: true });

// Watch para sincronizar selectedAccountObject con selectedAccount
watch(() => selectedAccountObject.value, (newAccount) => {
  if (newAccount && newAccount.id_cuenta !== selectedAccount.value) {
    selectedAccount.value = newAccount.id_cuenta;
  } else if (!newAccount) {
    selectedAccount.value = '';
  }
}, { immediate: true });

// Obtener calificación del Profesional - solo para servicios calificados
const fetchTecnicoRating = async (idTecnico) => { 
  if (!idTecnico) return
  
  try {
    isLoadingTecnicoRating.value = true
    const token = useCookie('token').value
    
    const response = await $api(`/calificaciones/usuario/${idTecnico}`, {
      method: 'GET'
    }) 
    
    // La API devuelve el número directamente (sin success wrapper)
    if (response && typeof response === 'number') {
      tecnicoRating.value = response
    } else if (response && response.promedio) {
      tecnicoRating.value = response.promedio
    } else if (response && response.data?.length > 0) {
      // Si el endpoint devuelve un array de calificaciones, calcular el promedio
      const suma = response.data.reduce((acc, cal) => acc + cal.calificacion, 0)
      tecnicoRating.value = suma / response.data.length
    } else {
      tecnicoRating.value = 0
    }
  } catch (error) {
    console.error('Error al obtener calificación del Profesional:', error)
    tecnicoRating.value = 0
  } finally {
    isLoadingTecnicoRating.value = false
  }
}

// =========================
// FUNCIONES DE UTILIDAD
// =========================

// Variable reactiva para almacenar el número de teléfono de la empresa
const empresaPhoneNumber = ref('');

// Función para obtener el número de teléfono de la empresa
const fetchEmpresaPhoneNumber = async () => {
  try {
    const response = await $api('/config/valor/numero_empresa', {
      method: 'GET'
    });
    
    if (response && response.valor) {
      empresaPhoneNumber.value = response.valor;
    }
  } catch (error) {
    console.error('Error al obtener el número de teléfono de la empresa:', error);
    // Establecer un valor por defecto en caso de error
    empresaPhoneNumber.value = '1234567890';
  }
};

// Función para enviar detalles de pago por WhatsApp
const sendWhatsAppMessage = async (service, paymentType, amount, receiptNumber) => {
  try {
    // Si no tenemos el número de teléfono, intentar obtenerlo
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }
    
    // Asegurarse de que amount sea un número
    const amountNumber = Number(amount) || 0;
    
    // Obtener la fecha actual en formato DDMMYY
const today = new Date();
const formattedDate = [
  String(today.getDate()).padStart(2, '0'),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getFullYear()).slice(-2)
].join('');

    // Formatear el mensaje con los detalles del pago
    const message = `*Comprobante de Pago*\n\n` +
      `*ID:* ${formattedDate}-${paymentType === 'visit' ? service.id_pagovisita : service.id_cotizacion}\n` +
      `*Tipo de pago:* ${paymentType === 'visit' ? 'Pago de Visita' : 'Pago de Servicio'}\n` + 
      `*N° de comprobante:* ${receiptNumber}\n\n`+
      `Adjunto una captura del comprobante de pago para su verificación.`;
    
    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Limpiar el número de teléfono (solo números)
    const phoneNumber = (empresaPhoneNumber.value || '1234567890').replace(/\D/g, '');
    
    // Construir URL de WhatsApp
    const url = `https://wa.me/+504${phoneNumber}?text=${encodedMessage}`;
    
    // Detectar si es dispositivo móvil
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile) {
      // En móvil, la redirección directa funciona mejor con los bloqueadores de popups
      window.location.assign(url);
    } else {
      // En escritorio, abrimos en una nueva pestaña
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
};

const copyToClipboard = (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Copiado al portapapeles')
    }).catch(err => {
      console.error('Error al copiar:', err)
      fallbackCopyToClipboard(text)
    })
  } else {
    fallbackCopyToClipboard(text)
  }
}

const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement("textarea")
  textArea.value = text
  
  // Asegurar que el textarea no sea visible pero esté en el DOM
  textArea.style.position = "fixed"
  textArea.style.left = "-9999px"
  textArea.style.top = "0"
  document.body.appendChild(textArea)
  
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showSuccess('Copiado al portapapeles')
    } else {
      showError('No se pudo copiar el texto')
    }
  } catch (err) {
    console.error('Error en fallback de copia:', err)
    showError('Error al intentar copiar')
  }

  document.body.removeChild(textArea)
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
onMounted(async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    // Cargar datos de configuración primero
    await Promise.all([
      fetchMembresiaBeneficios(),
      fetchEmpresaPhoneNumber() // Cargar el número de teléfono de la empresa
    ]);
    
    // Luego cargar datos principales
    await Promise.all([
      loadServices(),
      loadServiceTypes(),
      fetchBankAccounts(),
      fetchVisitCost()
    ]);
    
    // Si hay un usuario autenticado, cargar su progreso de membresía
    if (auth.user?.id_usuario || auth.user?.id) {
      await fetchMembresiaProgreso(auth.user.id_usuario || auth.user.id);
    }
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false;
  }
});

</script>

<style>
/* Estilos personalizados para Multiselect (non-scoped: sin :deep()) */

/* FIX GAP: el padding-top:8px por defecto en __tags crea el espacio entre
   el label/h4 y el multiselect. Con el style NO scoped, se escribe CSS normal. */
.multiselect-custom .multiselect__tags {
  padding-top: 4px !important;
  min-height: 38px !important;
}

.multiselect-custom .multiselect__placeholder {
  margin-top: 0 !important;
  padding-top: 0 !important;
  line-height: 28px !important;
}

.multiselect-custom .multiselect__single {
  margin-top: 0 !important;
  padding-top: 0 !important;
  line-height: 28px !important;
}

.multiselect-custom .multiselect__input {
  background: transparent !important;
  text-shadow: none !important;
}

.multiselect-custom .multiselect__option {
  text-shadow: none !important;
}

.multiselect-custom .multiselect__option--selected,
.multiselect-custom .multiselect__option--selected:hover,
.multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
  background: transparent !important;
  color: inherit !important;
  font-weight: bold !important;
  text-shadow: none !important;
}

.multiselect-custom .multiselect__option--highlight,
.multiselect-custom .multiselect__option--highlight:hover {
  background: transparent !important;
  color: inherit !important;
  text-shadow: none !important;
  font-weight: bold !important;
}

.multiselect-custom .multiselect__option--highlight:after,
.multiselect-custom .multiselect__option--selected:after {
  display: none !important;
}
</style>

