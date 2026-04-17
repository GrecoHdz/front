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
          <section class="p-3 sm:px-4 sm:py-4">
            <div class="grid grid-cols-2 gap-3">
              <div @click="currentTab = 'active'" 
                   class="cursor-pointer transition-all duration-300"
                   :class="currentTab === 'active' ? 'scale-105' : 'opacity-60 grayscale-[0.5]'">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                  <div v-if="currentTab === 'active'" class="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                  <div class="text-xl font-black text-blue-600 dark:text-blue-400 mb-0.5">{{ apiResponse.activas }}</div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Activos</p>
                </div>
              </div>
              <div @click="currentTab = 'finished'" 
                   class="cursor-pointer transition-all duration-300"
                   :class="currentTab === 'finished' ? 'scale-105' : 'opacity-60 grayscale-[0.5]'">
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center relative overflow-hidden">
                  <div v-if="currentTab === 'finished'" class="absolute bottom-0 left-0 right-0 h-1 bg-green-500"></div>
                  <div class="text-xl font-black text-green-600 dark:text-green-400 mb-0.5">{{ apiResponse.finalizadas }}</div>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Finalizados</p>
                </div>
              </div>
            </div>
          </section> 

          <!-- Tabs Indicator -->
          <div class="px-4 mb-4">
            <h2 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center"> 
              <span class="ml-2 h-px flex-1 bg-gray-100 dark:bg-gray-800"></span>
            </h2>
          </div> 

          <!-- Services List -->
          <section class="px-4">
            <div class="space-y-5">
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
                      <p class="font-bold text-gray-900 dark:text-white text-xs truncate">{{ service.title }}</p>
                      <p class="text-[9px] text-gray-500 dark:text-gray-400 font-medium">#{{ service.serviceNumber }}</p>
                    </div>
                  </div>
                  <div class="flex flex-wrap items-center justify-end gap-1.5 max-w-[50%]">
                    <span v-if="isCashService(service.description)" class="text-[8px] whitespace-nowrap bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter flex items-center shadow-sm border border-green-200/50 dark:border-green-700/50">
                      💰 Pago Efectivo
                    </span>
                    <span class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm" :class="getStatusColor(service.rawStatus)">
                      {{ service.status }}
                    </span>
                    <span v-if="service.isFirstTrip" class="text-[8px] whitespace-nowrap bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter flex items-center shadow-sm border border-amber-200/50 dark:border-amber-700/50 animate-pulse">
                      ✨ Primer Viaje
                    </span>
                  </div>
                </div>

                <!-- Location & Client Grid (Double Divs) -->
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div v-if="service.title === 'Taxi VIP'" class="grid grid-cols-2 gap-2 col-span-2">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50">
                      <p class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase mb-0.5">📍 Recogida</p>
                      <p class="font-bold text-blue-900 dark:text-blue-200 text-[10px] truncate">{{ service.location?.neighborhood }}</p>
                    </div>
                    <div class="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50">
                      <p class="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase mb-0.5">🏁 Destino</p>
                      <p class="font-bold text-emerald-900 dark:text-emerald-200 text-[10px] truncate">{{ service.location?.address }}</p>
                    </div>
                  </div>
                  <div v-else class="grid grid-cols-2 gap-2 col-span-2">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800/50">
                      <p class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase mb-0.5">👤 Cliente</p>
                      <p class="font-bold text-blue-900 dark:text-blue-200 text-[10px] truncate">{{ service.customer.name }}</p>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-100 dark:border-gray-600/50">
                      <p class="text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase mb-0.5">📍 Ubicación</p>
                      <p class="font-bold text-gray-900 dark:text-white text-[10px] truncate">{{ service.location?.neighborhood }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Service Description -->
                <p class="text-gray-700 dark:text-gray-300 text-[11px] mb-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg italic line-clamp-2">
                  "{{ service.description }}"
                </p> 

                <!-- Action Footer -->
                <div class="flex items-center justify-between pt-1 border-t border-gray-50 dark:border-gray-700/50">
                  <div class="flex items-center space-x-2">
                    <span class="text-gray-400 text-[9px] font-medium">{{ service.date }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span :class="[
                      service.rawStatus === 'asignado' 
                        ? 'text-white bg-indigo-600 px-2 py-0.5 rounded shadow-lg shadow-indigo-500/30' 
                        : 'text-blue-600 dark:text-blue-400',
                      'text-[10px] font-black uppercase tracking-widest'
                    ]">
                      {{ service.rawStatus === 'asignado' ? (isBarberíaService(service.title) ? 'Detalles' : 'Cotizar') : (service.rawStatus === 'en_proceso' ? 'Finalizar' : 'Ver detalles') }}
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
                <span class="text-2xl">�</span>
              </div>
              <h3 class="text-sm font-black text-gray-400 uppercase tracking-widest">No hay servicios</h3>
            </div>

            <!-- Load More -->
            <div v-if="hasMore && !isLoading" class="mt-6">
              <button @click="loadServices(true)" :disabled="isLoadingMore"
                class="w-full py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 shadow-sm transition-all flex items-center justify-center space-x-2">
                <span>{{ isLoadingMore ? 'Cargando...' : 'Cargar más' }}</span>
                <svg v-if="!isLoadingMore" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
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
                    <div class="flex items-center space-x-2">
                      <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">{{ selectedService.title }}</h3>
                      <span v-if="selectedService?.isFirstTrip" class="text-[8px] sm:text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter animate-pulse border border-amber-200/50">
                        ✨ Primer Viaje
                      </span>
                      <span v-if="isCashService(selectedService.description)" class="text-[8px] sm:text-[9px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter border border-green-200/50">
                        💰 Pago Efectivo
                      </span>
                    </div>
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
                    <div class="flex items-center gap-2 sm:gap-3">
                      <!-- Client Profile Photo (visible from 'asignado') -->
                      <div v-if="selectedService.customer?.photo && ['asignado', 'en_proceso', 'pendiente_cotizacion', 'pendiente_pagoservicio', 'verificando_pagoservicio', 'finalizado', 'calificado'].includes(selectedService.rawStatus)" 
                           @click="openImageModal(selectedService.customer.photo)"
                           class="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-blue-200 dark:border-blue-800 shadow-sm flex-shrink-0 cursor-pointer transition-transform hover:scale-110 active:scale-95">
                        <img :src="selectedService.customer.photo" 
                             :alt="selectedService.customer?.name"
                             class="w-full h-full object-cover">
                      </div>
                      <div v-else-if="['asignado', 'en_proceso', 'pendiente_cotizacion', 'pendiente_pagoservicio', 'verificando_pagoservicio', 'finalizado', 'calificado'].includes(selectedService.rawStatus)" 
                           class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-sm sm:text-base flex-shrink-0">
                        {{ (selectedService.customer?.name || 'C')[0].toUpperCase() }}
                      </div>

                      <div class="min-w-0">
                        <p class="font-bold text-blue-800 dark:text-blue-200 text-sm sm:text-base truncate">{{ selectedService.customer?.name }}</p>
                        <p class="text-blue-600 dark:text-blue-400 text-xs sm:text-sm">{{ selectedService.customer?.phone }}</p>
                      </div>
                    </div>
                    <button @click="openWhatsApp(selectedService.customer?.phone)" class="p-1.5 sm:p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.967-.273-.1-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.136-.135.298-.345.446-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.517-.172-.008-.371-.011-.571-.011s-.524.074-.797.358c-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.109 3.195 5.1 4.485.714.3 1.27.48 1.703.629.714.227 1.365.195 1.88.121.574-.09 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a11.92 11.92 0 01-1.819-6.355C2.5 6.28 6.84 2 12.092 2h.016c3.06 0 5.926 1.17 8.07 3.316A11.37 11.37 0 0123.5 12.87a11.28 11.28 0 01-3.346 8.016 11.54 11.54 0 01-8.162 3.315"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Location Details -->
              <div class="mb-4 sm:mb-6">
                <h4 class="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {{ isBarberíaService(selectedService.title) ? 'Ubicación del Corte' : 'Ubicación del Servicio' }}
                </h4>
                
                <div v-if="selectedService.title === 'Taxi VIP'" class="grid grid-cols-2 gap-3">
                  <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border-l-4 border-blue-500">
                    <p class="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase mb-1">📍 Recogida</p>
                    <p class="font-bold text-gray-900 dark:text-white text-[12px] sm:text-xs md:text-base">{{ selectedService.location?.neighborhood }}</p>
                  </div>
                  <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border-l-4 border-emerald-500">
                    <p class="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase mb-1">🏁 Destino</p>
                    <p class="font-bold text-gray-900 dark:text-white text-[12px] sm:text-xs md:text-base">{{ selectedService.location?.address }}</p>
                  </div>
                </div>

                <div v-else class="bg-gray-50 dark:bg-gray-700/50 p-2.5 sm:p-3 rounded-lg sm:rounded-xl">
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedService.location?.neighborhood }}</p>
                  <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mt-1">{{ selectedService.location?.address }}</p> 
                </div>
              </div>

              <!-- Service Description -->
              <div v-if="selectedService.title !== 'Taxi VIP'" class="mb-4 sm:mb-6">
                <h4 class="text-sm sm:text-base font-black text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {{ isBarberíaService(selectedService.title) ? 'Detalles del Corte' : 'Descripción del Problema' }}
                </h4>
                <div class="bg-gray-50 dark:bg-gray-700/50 p-2.5 sm:p-3 rounded-lg">
                  <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{{ selectedService.description }}</p>
                </div>
              </div>

              <!-- Calificación del Servicio -->
              <div v-if="['finalizado', 'calificado'].includes(selectedService.rawStatus)" class="mb-4 sm:mb-6">
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
                    {{ isBarberíaService(selectedService.title) ? '💇 Poner Precio' : '📋 Crear Cotización' }}
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
                    {{ isBarberíaService(selectedService.title) ? '✏️ Editar Detalles' : '✏️ Editar Cotización' }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Standard Quotation Modal -->
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
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {{ isBarberíaService(selectedService.title) ? 'Notas del Barbero' : 'Diagnóstico' }}
                  </label>
                  <textarea v-model="quotationForm.comentario" 
                            rows="4" 
                            required
                            class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                            :placeholder="isBarberíaService(selectedService.title) ? 'Escriba los detalles del servicio realizado' : 'Escriba su Diagnóstico'"></textarea>
                </div>

                <!-- Monto Mano de Obra -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Mano de Obra (L.)</label>
                  <input v-model.number="quotationForm.monto_manodeobra" 
                         type="number" 
                         step="1" 
                         min="0" 
                         required
                         class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                         placeholder="0">
                </div>

                <!-- Monto Materiales -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Materiales (L.) - Estimado</label>
                  <input v-model.number="quotationForm.monto_materiales" 
                         type="number" 
                         step="1" 
                         min="0"
                         class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                         placeholder="0">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Si aplica, este monto es solo para referencia del cliente y no suma al total a pagar por el cliente</p>
                </div>

                <!-- Total -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Total a pagar por el Cliente:</span>
                    <span class="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                      L. {{ Number(quotationForm.monto_manodeobra || 0) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-1 border-t border-blue-200 dark:border-blue-800 pt-1">
                    <span class="font-bold text-green-700 dark:text-green-400 text-xs">Tu Ganancia ({{ 100 - commissionPercentage }}% de mano de obra):</span>
                    <span class="text-sm font-bold text-green-800 dark:text-green-300">
                      L. {{ (Number(quotationForm.monto_manodeobra || 0) * ((100 - commissionPercentage) / 100)).toFixed(0) }}
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

    <!-- Taxi VIP Quotation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showTaxiQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showTaxiQuotationModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="showTaxiQuotationModal = false"
          ></div>
        </Transition>

        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showTaxiQuotationModal"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                    🚕
                  </div>
                  <div>
                    <div class="flex items-center space-x-2">
                      <h3 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Precio de Viaje</h3>
                      <span v-if="selectedService?.isFirstTrip" class="text-[8px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter animate-pulse border border-amber-200/50">
                        ✨ Primer
                      </span>
                    </div>
                    <p class="text-[10px] text-gray-400 font-bold">Taxi VIP • REF: #{{ selectedService?.serviceNumber }}</p>
                  </div>
                </div>
                <button @click="showTaxiQuotationModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quotation Form -->
            <div class="p-4">
              <form @submit.prevent="submitQuotation" class="space-y-4">
                <!-- Location Info (Read-only) -->
                <div class="grid grid-cols-1 gap-2 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/50">
                   <div class="flex items-start space-x-3">
                      <div class="mt-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20"></div>
                      <div class="min-w-0">
                         <p class="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Recogida</p>
                         <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ selectedService?.location?.neighborhood }}</p>
                      </div>
                   </div>
                   <div class="flex items-start space-x-3 mt-2 border-t border-blue-100/30 dark:border-blue-800/30 pt-2">
                      <div class="mt-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></div>
                      <div class="min-w-0">
                         <p class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Destino</p>
                         <p class="text-xs font-bold text-gray-900 dark:text-white truncate">{{ selectedService?.location?.address }}</p>
                      </div>
                   </div>
                </div>

                <!-- Price Field -->
                <div class="relative">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Monto del Viaje (L.)</label>
                  <div class="relative group">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400 group-focus-within:text-blue-500 transition-colors">L.</div>
                    <input v-model.number="quotationForm.monto_manodeobra" 
                           type="number" 
                           step="1" 
                           min="0" 
                           required
                           :readonly="selectedService.title === 'Taxi VIP' && selectedService.isFirstTrip"
                           :class="[
                             'w-full pl-12 pr-4 py-4 border-2 border-transparent focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-2xl font-black transition-all outline-none',
                             selectedService.title === 'Taxi VIP' && selectedService.isFirstTrip 
                               ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 cursor-not-allowed' 
                               : 'bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500'
                           ]"
                           placeholder="0">
                  </div>
                  <p v-if="selectedService.title === 'Taxi VIP' && selectedService.isFirstTrip" class="text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-2 px-1 uppercase tracking-wider">
                    ✨ ¡Primer viaje gratis! El monto está fijado en 0 por sistema.
                  </p>
                </div>

                <!-- Comment Field -->
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Notas del Viaje</label>
                  <textarea v-model="quotationForm.comentario" 
                            rows="2" 
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white transition-all outline-none resize-none" 
                            placeholder="Ej: Ford Escape Gris, llego en 5 min..."></textarea>
                </div>

                <!-- Earning Preview -->
                <div class="bg-blue-600 rounded-2xl p-4 shadow-xl shadow-blue-500/30 text-white">
                  <div class="flex justify-between items-center mb-1 opacity-80">
                    <span class="text-[10px] font-black uppercase tracking-widest">Tu Ganancia Estimada</span>
                    <span class="text-[10px] font-bold">({{ 100 - commissionPercentage }}%)</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <div class="text-3xl font-black">L. {{ (Number(quotationForm.monto_manodeobra || 0) * ((100 - commissionPercentage) / 100)).toFixed(0) }}</div>
                    <div class="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">PROCESADO VÍA APP</div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        :disabled="isSubmittingQuotation || (quotationForm.monto_manodeobra === null || quotationForm.monto_manodeobra === undefined || quotationForm.monto_manodeobra === '')"
                        :class="[
                          'group relative w-full py-4 border border-white/10 text-white font-black rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50',
                          selectedService.title === 'Taxi VIP' && selectedService.isFirstTrip 
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30' 
                            : 'bg-gray-900'
                        ]">
                  <div v-if="!isSubmittingQuotation" class="relative z-10 flex items-center justify-center space-x-2">
                    <span class="uppercase tracking-[0.2em] text-xs">
                      {{ selectedService.title === 'Taxi VIP' && selectedService.isFirstTrip ? 'Confirmar Viaje Gratuito' : 'Confirmar Precio' }}
                    </span>
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </div>
                  <div v-else class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                  <div v-if="!(selectedService.title === 'Taxi VIP' && selectedService.isFirstTrip)" class="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 duration-300"></div>
                </button>
              </form>
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
      <div v-if="showBarberiaQuotationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showBarberiaQuotationModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="showBarberiaQuotationModal = false"
          ></div>
        </Transition>

        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showBarberiaQuotationModal"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop>
            
            <!-- Modal Header -->
            <div class="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-amber-500/30">
                    💇
                  </div>
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">Detalles del Corte</h3>
                    <p class="text-[10px] text-gray-400 font-bold">Barbería • REF: #{{ selectedService?.serviceNumber }}</p>
                  </div>
                </div>
                <button @click="showBarberiaQuotationModal = false" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Quotation Form -->
            <div class="p-4">
              <form @submit.prevent="submitQuotation" class="space-y-4">

                <!-- Price Field -->
                <div class="relative">
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Precio del Corte (L.)</label>
                  <div class="relative group">
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400 group-focus-within:text-amber-500 transition-colors">L.</div>
                    <input v-model.number="quotationForm.monto_manodeobra" 
                           type="number" 
                           step="1" 
                           min="0" 
                           required
                           class="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-2xl font-black text-gray-900 dark:text-white transition-all outline-none" 
                           placeholder="0">
                  </div>
                </div>

                <!-- Comment Field -->
                <div>
                  <label class="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 px-1">Notas del Barbero</label>
                  <textarea v-model="quotationForm.comentario" 
                            rows="3" 
                            required
                            class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-sm font-medium text-gray-900 dark:text-white transition-all outline-none resize-none" 
                            placeholder="Ej: Lo esperamos pregunte por..."></textarea>
                </div>

                <!-- Earning Preview -->
                <div class="bg-amber-600 rounded-2xl p-4 shadow-xl shadow-amber-500/30 text-white">
                  <div class="flex justify-between items-center mb-1 opacity-80">
                    <span class="text-[10px] font-black uppercase tracking-widest">Tu Ganancia</span>
                    <span class="text-[10px] font-bold">({{ 100 - commissionPercentage }}%)</span>
                  </div>
                  <div class="flex justify-between items-end">
                    <div class="text-3xl font-black">L. {{ (Number(quotationForm.monto_manodeobra || 0) * ((100 - commissionPercentage) / 100)).toFixed(0) }}</div>
                    <div class="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">PROCESADO VÍA APP</div>
                  </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" 
                        :disabled="isSubmittingQuotation || (quotationForm.monto_manodeobra === null || quotationForm.monto_manodeobra === undefined || quotationForm.monto_manodeobra === '')"
                        class="group relative w-full py-4 bg-gray-900 border border-white/10 text-white font-black rounded-2xl overflow-hidden transition-all active:scale-[0.98] disabled:opacity-50">
                  <div v-if="!isSubmittingQuotation" class="relative z-10 flex items-center justify-center space-x-2">
                    <span class="uppercase tracking-[0.2em] text-xs">Enviar Detalles</span>
                    <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                  </div>
                  <div v-else class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity translate-y-full group-hover:translate-y-0 duration-300"></div>
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
            <div :class="[
              'sticky top-0 p-3 sm:p-4 border-b rounded-t-xl sm:rounded-t-2xl',
              selectedService.title === 'Taxi VIP' ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-100 dark:border-blue-800/30' : 
              isBarberíaService(selectedService.title) ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-100 dark:border-amber-800/30' : 
              'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            ]">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div v-if="selectedService.title === 'Taxi VIP'" class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-blue-500/30">🚕</div>
                  <div v-else-if="isBarberíaService(selectedService.title)" class="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600 rounded-xl flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-amber-500/30">💇</div>
                  
                  <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                    {{ selectedService.title === 'Taxi VIP' ? 'Editar Precio de Viaje' : (isBarberíaService(selectedService.title) ? 'Editar Detalles del Corte' : 'Editar Cotización') }}
                  </h3>
                </div>
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
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {{ selectedService.title === 'Taxi VIP' ? 'Notas del Viaje' : (isBarberíaService(selectedService.title) ? 'Notas del Barbero' : 'Diagnóstico') }}
                  </label>
                  <textarea 
                    v-model="currentQuotation.comentario" 
                    rows="4" 
                    required
                    class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    :placeholder="selectedService.title === 'Taxi VIP' ? 'Ej: Ford Escape Gris, llego en 5 min...' : (isBarberíaService(selectedService.title) ? 'Escriba los detalles del servicio realizado' : 'Escriba su Diagnóstico')">
                  </textarea>
                </div>

                <!-- Monto Mano de Obra -->
                <div>
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {{ selectedService.title === 'Taxi VIP' ? 'Monto del Viaje (L.)' : (isBarberíaService(selectedService.title) ? 'Precio del Corte (L.)' : 'Monto Mano de Obra (L.)') }}
                  </label>
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
                <div v-if="selectedService.title !== 'Taxi VIP' && !isBarberíaService(selectedService.title)">
                  <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto Materiales (L.) - Estimado</label>
                  <input 
                    v-model.number="currentQuotation.monto_materiales" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    class="w-full px-2.5 sm:px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" 
                    placeholder="0.00">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Este monto es solo para referencia del cliente y no suma al total a pagar por el cliente</p>
                </div>

                <!-- Total -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-2.5 sm:p-3 rounded-lg">
                  <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Total a pagar por el Cliente:</span>
                    <span class="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100">
                      L. {{ parseFloat(currentQuotation.monto_manodeobra || 0) }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center mt-1 border-t border-blue-200 dark:border-blue-800 pt-1">
                    <span class="font-bold text-green-700 dark:text-green-400 text-xs">Tu Ganancia ({{ 100 - commissionPercentage }}% de mano de obra):</span>
                    <span class="text-sm font-bold text-green-800 dark:text-green-300">
                      L. {{ (parseFloat(currentQuotation.monto_manodeobra || 0) * ((100 - commissionPercentage) / 100)).toFixed(2) }}
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
                    :disabled="isUpdatingQuotation || !currentQuotation.comentario || (currentQuotation.monto_manodeobra === null || currentQuotation.monto_manodeobra === undefined || currentQuotation.monto_manodeobra === '')"
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

    <!-- Modal para ver imagen en grande -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showImageModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        @click.self="showImageModal = false"
      >
        <div class="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-modal-enter">
          <button 
            @click="showImageModal = false"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-all p-2 hover:scale-110"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="bg-transparent rounded-2xl overflow-hidden shadow-2xl transition-all">
            <img 
              :src="selectedImage" 
              class="max-w-full max-h-[80vh] object-contain rounded-xl"
              alt="Vista previa de imagen"
            />
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

// Definir eventos personalizados del componente
const emit = defineEmits(['filterChange', 'dateFilterChange'])

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'MiSeguro - Dashboard Técnico',
  meta: [
    { name: 'description', content: 'Panel de Técnico - Gestiona tus servicios asignados' }, 
    { name: 'keywords', content: 'MiSeguro, Técnico, Servicios, Asignados' },
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
const showTaxiQuotationModal = ref(false)
const showViewQuotationModal = ref(false)
const showCancelConfirmation = ref(false)
const showCompleteConfirmation = ref(false)
const isCompleting = ref(false)
const isSubmittingQuotation = ref(false)
const isUpdatingQuotation = ref(false)
const showBarberiaQuotationModal = ref(false)
const showImageModal = ref(false)
const selectedImage = ref('')

// Bloquear scroll cuando un modal está abierto
const anyModalOpen = computed(() => {
  return showServiceModal.value || 
         showQuotationModal.value || 
         showTaxiQuotationModal.value || 
         showBarberiaQuotationModal.value || 
         showViewQuotationModal.value || 
         showCancelConfirmation.value || 
         showCompleteConfirmation.value ||
         showImageModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})

// Paginación
const currentPage = ref(1)
const hasMore = ref(false)

// Filtros
const currentFilter = ref('all')
const currentTab = ref('active') // 'active' o 'finished'
const currentDateFilter = ref('all')
const selectedServiceTypes = ref([])

// Observar cambios en la pestaña para recargar
watch(currentTab, () => {
  loadServices()
})

// Comentarios y estados
const completeServiceComment = ref('')
const currentServiceToComplete = ref(null)
const technicianStatus = ref('available')
const commissionPercentage = ref(0)

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

const stats = computed(() => {
  return {
    total: apiResponse.value.total || 0,
    activas: apiResponse.value.activas || 0,
    finalizadas: apiResponse.value.finalizadas || 0
  }
})

const filteredServices = computed(() => {
  let solicitudes = [...(apiResponse.value.solicitudes || [])]
  
  // El filtrado por estado (active/finished) ya lo hace el API
  
  if (currentFilter.value !== 'all' && currentFilter.value !== 'asignado' && currentFilter.value !== 'finalizado') {
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

// Helper: detects cash payment based on description
const isCashService = (description = '') => {
  return (description || '').toLowerCase().includes('pago efectivo')
}

const getServiceIcon = (estado, serviceTitle = '') => {
  const title = (serviceTitle || '').toLowerCase()
  if (title.includes('viaje') || title.includes('taxi')) return '🚗'
  if (title.includes('barber') || title.includes('peluquería') || title.includes('salón')) return '💈'
  if (title.includes('aire') || title.includes('ac') || title.includes('clima')) return '❄️'
  if (title.includes('fontan') || title.includes('plomer') || title.includes('tubo')) return '💧'
  if (title.includes('electri') || title.includes('luz')) return '💡'
  
  const iconMap = {
    'verificando_pagovisita': '💰',
    'asignado': '👨‍🔧',
    'en_proceso': '⚡',
    'finalizado': '✅',
    'calificado': '⭐',
    'cancelado': '❌',
    'pendiente_cotizacion': '📋'
  }
  
  return iconMap[estado] || '🛠️'
}

const mapApiStatusToLocal = (apiStatus, title = '') => {
  const isTaxi = title === 'Taxi VIP';
  const isBarberia = isBarberíaService(title);
  const statusMap = {
    'pendiente_asignacion': 'Cotización Rechazada',
    'asignado': 'Asignado',
    'pendiente_cotizacion': isTaxi ? 'Tarifa Recibida' : (isBarberia ? 'Detalles Enviados' : 'Cotización Enviada'),
    'en_proceso': isTaxi ? 'Viaje Programado' : (isBarberia ? 'Corte en Curso' : 'En Progreso'),
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
    status: mapApiStatusToLocal(solicitud.estado || 'pendiente', solicitud.servicio?.nombre),
    rawStatus: solicitud.estado || 'pendiente',
    serviceNumber: `${formatDateDDMMYY(solicitud.fecha_solicitud)}-${solicitud.id_solicitud}`,
    icon: getServiceIcon(solicitud.estado, solicitud.servicio?.nombre),
    rawDate: solicitud.fecha_solicitud,
    date: formatDate(solicitud.fecha_solicitud),
    assignedDate: solicitud.fecha_solicitud,
    customer: {
      id: solicitud.cliente?.id_usuario,
      name: solicitud.cliente?.nombre || 'Desconocido',
      phone: solicitud.cliente?.telefono || 'N/A',
      photo: solicitud.cliente?.imagen_url
    },
    location: {
      neighborhood: solicitud.colonia || 'Sin especificar',
      address: solicitud.direccion_precisa || 'Sin dirección especificada',
      formattedAddress: `${solicitud.direccion_precisa || ''}${solicitud.colonia ? ', ' + solicitud.colonia : ''}`.trim() || 'Sin dirección especificada'
    },
    // Datos adicionales de la API
    isFirstTrip: solicitud.es_primer_viaje,
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
    
    const response = await $api(`/solicitudservicio/tecnico/${userCookieValue.id_usuario}`, {
      method: 'GET',
      query: {
        offset: currentOffset.value,
        limit: itemsPerPage,
        tab: currentTab.value // Enviamos la pestaña actual al API
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
    const user = useCookie('user').value
    const id_ciudad = user?.id_ciudad

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
    const response = await $api(`/calificaciones/solicitud/${idSolicitud}`, {
      method: 'GET'
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
    
    const response = await $api(`cotizacion/solicitud/${selectedService.value.id}`, {
      method: 'GET'
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
  
  if (service.rawStatus === 'finalizado' || service.rawStatus === 'calificado') {
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
    
    if (selectedService.value.title === 'Taxi VIP') {
      quotationForm.value.monto_manodeobra = selectedService.value.isFirstTrip ? 0 : 0;
      showTaxiQuotationModal.value = true
    } else if (isBarberíaService(selectedService.value.title)) {
      showBarberiaQuotationModal.value = true
    } else {
      showQuotationModal.value = true
    }
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
  
  // Si es primer viaje de Taxi VIP, completar directamente sin modal
  if (service.title === 'Taxi VIP' && service.isFirstTrip) {
    confirmCompleteService()
    return
  }
  
  completeServiceComment.value = ''
  showCompleteConfirmation.value = true
}

const confirmCancelService = () => {
  showCancelConfirmation.value = true
}

// ===== FUNCIONES DE ACCIONES =====
const submitQuotation = async () => {
  // Validación específica: El comentario es obligatorio para servicios normales, opcional para Taxi VIP
  const isTaxi = selectedService.value?.title === 'Taxi VIP'
  const isCommentEmpty = !quotationForm.value.comentario || !quotationForm.value.comentario.trim()
  const isAmountInvalid = quotationForm.value.monto_manodeobra === null || quotationForm.value.monto_manodeobra === undefined || quotationForm.value.monto_manodeobra < 0

  if ((!isTaxi && isCommentEmpty) || isAmountInvalid) {
    showToast('Por favor completa todos los campos requeridos', 'error')
    return
  }

  let updateSuccessful = false;
  
  try {
    isSubmittingQuotation.value = true
    
    const cotizacionData = {
      id_solicitud: selectedService.value.id,
      comentario: isCommentEmpty && isTaxi ? 'Servicio Taxi VIP' : quotationForm.value.comentario.trim(),
      monto_manodeobra: parseFloat(quotationForm.value.monto_manodeobra),
      monto_materiales: parseFloat(quotationForm.value.monto_materiales) || 0,
      fecha: new Date().toISOString()
    };
    
    const updateResponse = await $api(`/solicitudservicio/${selectedService.value.id}`, {
      method: 'PUT',
      body: { estado: 'pendiente_cotizacion' }
    });
    
    updateSuccessful = true;
    
    const cotizacionResponse = await $api('/cotizacion', {
      method: 'POST',
      body: cotizacionData
    });
    
    // Notificar al usuario que solicitó el servicio sobre la cotización enviada
    try {
      const userId = selectedService.value.rawData.cliente?.id_usuario;
      
      if (userId) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Cotización Recibida',
            id_usuario: userId
          }
        });
      } else {
      }
    } catch (error) {
    }
    
    showToast(`${selectedService.value?.title === 'Barbería' ? 'Detalles enviados' : 'Cotización enviada'} correctamente`, 'success')
    
    closeQuotationModal()
    showTaxiQuotationModal.value = false // Cerrar también el de taxi si se usó
    showBarberiaQuotationModal.value = false // Cerrar también el de barbería if used
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
        await $api(`/solicitudservicio/${selectedService.value.id}`, {
          method: 'PUT',
          body: { estado: 'asignado' }
        });
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

  if ((currentQuotation.value.monto_manodeobra === null || currentQuotation.value.monto_manodeobra === undefined || currentQuotation.value.monto_manodeobra === '') || !currentQuotation.value.comentario) {
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
    
    const response = await $api(`/cotizacion/${currentQuotation.value.id}`, {
      method: 'PUT',
      body: requestData
    })
    
    if ((response && response.status === 'success') || (Array.isArray(response) && response.length > 0)) {
      // Notificar al usuario sobre la actualización de la cotización
      try {
        const userId = selectedService.value.rawData.cliente?.id_usuario;
        
        if (userId) {
          await $api('/notificaciones/enviar', {
            method: 'POST',
            body: {
              titulo: 'Cotización Editada',
              id_usuario: userId
            }
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
    const isTaxiFirstTrip = currentServiceToComplete.value?.title === 'Taxi VIP' && currentServiceToComplete.value?.isFirstTrip;
    const isCashPayment = isCashService(currentServiceToComplete.value?.description);
    const setAsFinalized = isTaxiFirstTrip || isCashPayment;
    
    const response = await $api(`/solicitudservicio/${currentServiceToComplete.value.id}`, {
      method: 'PUT',
      body: {
        estado: setAsFinalized ? 'finalizado' : 'pendiente_pagoservicio',
        comentario: completeServiceComment.value || (isTaxiFirstTrip ? 'Primer viaje Taxi VIP completado' : (isCashPayment ? 'Servicio cobrado en efectivo' : 'Completado'))
      }
    })
    
    // Si se fue directo a finalizado (Primer viaje o Pago efectivo), confirmar la cotización asociada directamente
    if (setAsFinalized) {
      try {
        const quotationRes = await $api(`cotizacion/solicitud/${currentServiceToComplete.value.id}`, {
          method: 'GET'
        });
        
        if (quotationRes && (quotationRes.data || quotationRes)) {
          const cotizacion = quotationRes.data || quotationRes;
          const cotId = cotizacion.id_cotizacion || cotizacion.id;
          
          if (cotId) {
            await $api(`/cotizacion/${cotId}`, {
              method: 'PUT',
              body: { estado: 'confirmado' }
            });
            console.log(`Cotización ${cotId} confirmada automáticamente para servicio finalizado directamente`);
          }
        }
      } catch (quotationError) {
        console.error('Error al confirmar cotización para servicio directo:', quotationError);
      }
    }

    // Notificar al usuario que solicitó el servicio sobre la finalización
    try {
      const userId = selectedService.value.rawData.cliente?.id_usuario;
      
      if (userId) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: setAsFinalized ? 'Servicio Finalizado' : 'Pago de Servicio Pendiente',
            id_usuario: userId
          }
        });
      } else {
        console.warn('No se pudo obtener el ID del usuario para notificar sobre la finalización del servicio');
      }
    } catch (notificationError) {
      console.error('Error al enviar notificación de servicio completado:', notificationError);
      // No mostrar error al usuario para no afectar su experiencia
    }
    
    showToast(`${currentServiceToComplete.value?.title === 'Barbería' ? 'Servicio de barbería' : 'Servicio'} marcado como completado exitosamente`, 'success')
    
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
    const response = await $api(`/solicitudservicio/${selectedService.value.id}`, {
      method: 'PUT',
      body: {
        estado: 'pendiente_asignacion'
      }
    })

    // Notificar al usuario sobre la cancelación del servicio
    try {
      const userId = selectedService.value.rawData.cliente?.id_usuario;
      
      if (userId) {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Servicio Cancelado',
            id_usuario: userId
          }
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
  if (!phone) {
    showToast('Número de teléfono no disponible', 'error')
    return
  }
  
  // Eliminar cualquier carácter que no sea dígito
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Abrir el enlace de llamada
  window.open(`tel:${cleanPhone}`, '_blank')
}

const openWhatsApp = (phone) => {
  if (!phone) {
    showToast('Número de teléfono no disponible', 'error')
    return
  }
  
  // Eliminar cualquier carácter que no sea dígito
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Verificar si el número ya tiene el código de país de Honduras (504)
  const formattedPhone = cleanPhone.startsWith('504') ? cleanPhone : `504${cleanPhone}`
  
  // Abrir WhatsApp con el número
  window.open(`https://wa.me/${formattedPhone}`, '_blank')
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

const loadCommission = async () => {
  try {
    const response = await $api('/config/valor/comision_por_servicio', {
      method: 'GET'
    })
    if (response && response.valor) {
      commissionPercentage.value = parseFloat(response.valor)
    }
  } catch (error) {
    console.error('Error al cargar comisión:', error)
    commissionPercentage.value = 30 // Fallback
  }
}

// ===== INICIALIZACIÓN =====
const checkAuthAndLoad = async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) { 
      window.location.reload()
      return
    }
    
    initializeDarkMode()
    await Promise.all([
      loadServices(),
      loadServiceTypes(),
      loadCommission()
    ])
  } catch (error) { 
    window.location.reload() 
  }
}

onMounted(() => {
  checkAuthAndLoad()
})

const openImageModal = (url) => {
  if (!url) return
  selectedImage.value = url
  showImageModal.value = true
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
  .max-w-xl {
    max-width: 100%;
  }
}

/* Animación de Gradiente Horizontal */
@keyframes gradient-x {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite;
}

/* Efecto de Elevación Activa */
.active-service-card {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.active-service-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>