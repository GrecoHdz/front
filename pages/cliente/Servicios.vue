<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- SEO Head -->
    <Head>
      <title>HogarSeguro - Mis Servicios</title>
      <meta name="description" content="Historial y seguimiento de todos tus servicios de HogarSeguro" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
     
     <HeadersHeaderServicios 
       :total-services="totalServices"
       :show-filters="showFilters"
       :service-filters="serviceFilters"
       :service-types="serviceTypes"
       :date-periods="datePeriods"
       :current-filter="currentFilter"
       :current-date-filter="currentDateFilter"
       :selected-service-types="selectedServiceTypes"
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
                 @click="openServiceModal(service.id)"
                 class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer relative">
              
              <!-- Payment Pending Badge for Completed Services -->
              <div v-if="service.status === 'Servicio Completado'" 
                   class="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg animate-pulse">
                💳 Pago Pendiente
              </div>

              <!-- Service Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center text-xl">
                    {{ service.icon }}
                  </div>
                  <div>
                    <p class="font-black text-gray-900 dark:text-white text-base">{{ service.title }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ service.date }} • #{{ service.id }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold"
                      :class="getStatusColor(service.status)">
                  {{ service.status }}
                </span>
              </div>

              <!-- Service Description -->
              <p class="text-gray-700 dark:text-gray-300 text-sm mb-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                {{ service.description }}
              </p>

              <!-- Location and Schedule -->
              <div class="space-y-2 mb-3">
                <!-- Extended Location -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p class="text-blue-600 dark:text-blue-400 text-xs font-bold mb-1">📍 UBICACIÓN</p>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-semibold">{{ service.fullLocation.colonia }}</p>
                  <p class="text-blue-700 dark:text-blue-300 text-xs">{{ service.fullLocation.direccion }}</p>
                </div>
                
                <!-- Scheduled Date and Time -->
                <div v-if="service.scheduledDate" class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <p class="text-purple-600 dark:text-purple-400 text-xs font-bold mb-1">📅 FECHA PROGRAMADA</p>
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-purple-800 dark:text-purple-200 text-sm font-semibold">{{ service.scheduledDate.date }}</p>
                      <p class="text-purple-700 dark:text-purple-300 text-xs">{{ service.scheduledDate.time }}</p>
                    </div>
                    <div class="text-purple-600 dark:text-purple-400 text-xl">🕐</div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-gray-500 dark:text-gray-400 text-xs">{{ getTimeAgo(service.date) }}</span>
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
    
    <!-- Service Detail Modal -->
  <div v-if="showServiceModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto">
      <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-lg">
              {{ selectedService.icon }}
            </div>
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white">{{ selectedService.title }}</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">#{{ selectedService.id }}</p>
            </div>
          </div>
          <button @click="closeServiceModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="p-4">
        <!-- 1. Seguimiento del Servicio -->
        <div class="mb-6">
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
        <div v-if="selectedService.technician && getCurrentStepNumber(selectedService.status) >= 2" class="mb-6">
          <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Técnico Asignado</h4>
          <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">👨‍🔧</span>
              </div>
              <div class="flex-1">
                <p class="font-black text-emerald-800 dark:text-emerald-200 text-base">{{ selectedService.technician.name }}</p>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1">
                    <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                      {{ i <= selectedService.technician.rating ? '★' : '☆' }}
                    </span>
                  </div>
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

        <!-- 3. Acciones -->
        <div class="mb-4">
          <h4 class="text-base font-black text-gray-900 dark:text-white mb-3">Acciones</h4>
          <div class="space-y-2">
            
            <!-- Acciones para Solicitud Recibida -->
            <div v-if="selectedService.status === 'Solicitud Recibida'">
              <button class="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">❌</span>
                  <span class="font-bold text-red-800 dark:text-red-200 text-sm">Cancelar solicitud</span>
                </div>
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Acciones para Técnico Asignado -->
            <div v-if="selectedService.status === 'Técnico Asignado'">
              <button class="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">💬</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Contactar técnico</span>
                </div>
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button class="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">❌</span>
                  <span class="font-bold text-red-800 dark:text-red-200 text-sm">Cancelar servicio</span>
                </div>
                <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <!-- Acciones para Servicio en Curso -->
            <div v-if="selectedService.status === 'Servicio en Curso'">
              <button class="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">💬</span>
                  <span class="font-bold text-blue-800 dark:text-blue-200 text-sm">Chat con técnico</span>
                </div>
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>

            <!-- Acciones para Servicio Completado -->
            <div v-if="selectedService.status === 'Servicio Completado'">
              <button class="w-full flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors mb-2">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">⭐</span>
                  <span class="font-bold text-yellow-800 dark:text-yellow-200 text-sm">Calificar servicio</span>
                </div>
                <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <button @click="openPaymentModal" class="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <div class="flex items-center space-x-2">
                  <span class="text-lg">💳</span>
                  <span class="font-bold text-green-800 dark:text-green-200 text-sm">Pagar servicio</span>
                </div>
                <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Payment Modal -->
  <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto">
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

      <div class="p-4">
        <!-- Service Summary -->
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

        <!-- Payment Breakdown -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4">
          <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-3">💰 Desglose de Pago</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-blue-700 dark:text-blue-300">Mano de obra:</span>
              <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ selectedService.finalLaborCost || selectedService.laborCost || 120 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-700 dark:text-blue-300">Materiales utilizados:</span>
              <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ selectedService.finalMaterialsCost || selectedService.materialsCost || 80 }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-blue-700 dark:text-blue-300">Descuento miembro:</span>
              <span class="font-bold text-green-600">-L. {{ selectedService.memberDiscount || 20 }}</span>
            </div>
            <hr class="border-blue-300 dark:border-blue-700">
            <div class="flex justify-between items-center">
              <span class="font-bold text-blue-800 dark:text-blue-200">Total a pagar:</span>
              <span class="font-bold text-blue-800 dark:text-blue-200 text-lg">L. {{ selectedService.finalTotal || 180 }}</span>
            </div>
          </div>
        </div>

        <!-- Payment Methods -->
        <div class="mb-4">
          <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-3">Método de Pago</h4>
          <div class="space-y-2">
            <label v-for="method in paymentMethods" :key="method.id" 
                   class="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <input type="radio" v-model="selectedPaymentMethod" :value="method.id" class="mr-3">
              <div class="flex items-center space-x-3">
                <span class="text-xl">{{ method.icon }}</span>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ method.name }}</p>
                  <p class="text-xs text-gray-600 dark:text-gray-400">{{ method.description }}</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Payment Button -->
        <button @click="processPayment" 
                class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          💳 Procesar Pago - L. {{ selectedService.finalTotal || 180 }}
        </button>

        <!-- Security Info -->
        <div class="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-green-700 dark:text-green-300 text-xs text-center">
            🔒 Tu pago está protegido con encriptación de nivel bancario
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Success Messages -->
  <div v-if="showSuccessMessage" class="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-50">
    <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-2xl">
      <div class="flex items-center space-x-2">
        <div class="text-xl">✅</div>
        <div>
          <p class="font-black text-sm">{{ successMessage }}</p>
        </div>
      </div>
      
    </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/middleware/auth.store'

//Autenticacion
const auth = useAuthStore()

// SEO and Meta
useHead({
  title: 'HogarSeguro - Mis Servicios',
  meta: [
    { name: 'description', content: 'Historial y seguimiento de todos tus servicios de HogarSeguro' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Reactive data
const showServiceModal = ref(false)
const showPaymentModal = ref(false)
const selectedServiceId = ref(null)
const showFilters = ref(false)
const currentFilter = ref('all')
const currentDateFilter = ref('all')
const selectedServiceTypes = ref([])
const showSuccessMessage = ref(false)
const successMessage = ref('')
const selectedPaymentMethod = ref('card')

// Payment methods
const paymentMethods = [
  { id: 'card', name: 'Tarjeta de Crédito/Débito', description: 'Visa, Mastercard, American Express', icon: '💳' },
  { id: 'transfer', name: 'Transferencia Bancaria', description: 'BAC, Banco Atlántida, Banpais', icon: '🏦' },
  { id: 'mobile', name: 'Pago Móvil', description: 'Tigo Money, Claro Pay', icon: '📱' }
]

// Service filters
const serviceFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'completed', label: 'Completados' },
  { key: 'cancelled', label: 'Cancelados' }
]

const serviceTypes = [
  { id: 1, name: 'Fontanería', icon: '🔧' },
  { id: 2, name: 'Electricidad', icon: '💡' },
  { id: 3, name: 'Aires A/C', icon: '❄️' },
  { id: 4, name: 'Electrodomésticos', icon: '🧊' },
  { id: 5, name: 'Pintura', icon: '🎨' },
  { id: 6, name: 'Cámaras', icon: '🎥' }
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

// Mock services data
const allServices = ref([
  {
    id: 1001,
    title: 'Reparación de aire acondicionado',
    description: 'El aire acondicionado de la sala principal no enfría correctamente.',
    date: '15 Dic 2024',
    status: 'Servicio Completado',
    icon: '❄️',
    fullLocation: {
      colonia: 'Col. Palmira, Tegucigalpa',
      direccion: 'Casa #1234, Calle Principal, 2da entrada después del parque'
    },
    scheduledDate: {
      date: '16 Dic 2024',
      time: '2:00 PM - 4:00 PM'
    },
    finalLaborCost: 120,
    finalMaterialsCost: 80,
    memberDiscount: 20,
    finalTotal: 180,
    serviceDescription: 'Reparación completa del sistema de refrigeración.',
    technician: {
      name: 'Carlos Martínez',
      rating: 4.8,
      reviews: 127
    }
  },
  {
    id: 1002,
    title: 'Instalación de lámpara LED',
    description: 'Instalar nueva lámpara LED en el comedor principal.',
    date: '12 Dic 2024',
    status: 'Cotización Pendiente',
    icon: '💡',
    fullLocation: {
      colonia: 'Col. Lomas del Guijarro, Tegucigalpa',
      direccion: 'Residencial Los Robles, Casa B-15, frente al área verde'
    },
    scheduledDate: {
      date: '14 Dic 2024',
      time: '10:00 AM - 12:00 PM'
    },
    diagnosis: 'Se requiere instalación de nuevo cableado eléctrico desde el panel principal hasta el comedor.',
    laborCost: 120,
    materialsCost: 60,
    quotedPrice: 180,
    serviceDescription: 'Instalación de sistema de iluminación LED.',
    technician: {
      name: 'Ana Rodriguez',
      rating: 4.9,
      reviews: 89
    }
  },
  {
    id: 1003,
    title: 'Reparación de fuga en cocina',
    description: 'Pequeña fuga en el grifo de la cocina.',
    date: '10 Dic 2024',
    status: 'Servicio en Curso',
    icon: '🔧',
    fullLocation: {
      colonia: 'Col. Kennedy, Tegucigalpa',
      direccion: 'Bloque C, Apartamento 3B, Edificio Vista Hermosa'
    },
    scheduledDate: {
      date: '11 Dic 2024',
      time: '9:00 AM - 11:00 AM'
    },
    serviceDescription: 'Reparación de válvulas internas del grifo.',
    technician: {
      name: 'Miguel Santos',
      rating: 4.7,
      reviews: 156
    }
  }
])

// Computed properties
const totalServices = computed(() => allServices.value.length)
const completedServices = computed(() => allServices.value.filter(s => s.status === 'Servicio Completado').length)
const pendingServices = computed(() => allServices.value.filter(s => !['Servicio Completado', 'Cancelado'].includes(s.status)).length)

const selectedService = computed(() => {
  return allServices.value.find(s => s.id === selectedServiceId.value) || allServices.value[0]
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
  
  if (selectedServiceTypes.value.length > 0) {
    filtered = filtered.filter(s => {
      const serviceType = serviceTypes.find(st => st.icon === s.icon)
      return serviceType && selectedServiceTypes.value.includes(serviceType.name)
    })
  }
  
  return filtered
})

// Methods
const openServiceModal = (serviceId) => {
  selectedServiceId.value = serviceId
  showServiceModal.value = true
}

const closeServiceModal = () => {
  showServiceModal.value = false
  selectedServiceId.value = null
}

const openPaymentModal = () => {
  showPaymentModal.value = true
}

const closePaymentModal = () => {
  showPaymentModal.value = false
}

const processPayment = () => {
  closePaymentModal()
  closeServiceModal()
  showSuccess('¡Pago procesado exitosamente! Tu servicio ha sido pagado.')
  
  // Update service status to paid
  const service = allServices.value.find(s => s.id === selectedServiceId.value)
  if (service) {
    service.isPaid = true
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

const rejectQuotation = () => {
  const service = allServices.value.find(s => s.id === selectedServiceId.value)
  if (service) {
    service.status = 'Cancelado'
    showSuccess('Cotización rechazada. El servicio ha sido cancelado.')
  }
}

const showSuccess = (message) => {
  successMessage.value = message
  showSuccessMessage.value = true
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 4000)
}

const getStatusColor = (status) => {
  const colors = {
    'Servicio Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Servicio en Curso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Cotización Pendiente': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Técnico Asignado': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Solicitud Recibida': 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const getTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  return `Hace ${Math.floor(diffInDays / 7)} semanas`
}

// Dark mode support
onMounted(() => {
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
})
</script>

<style scoped>
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