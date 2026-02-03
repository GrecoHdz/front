<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Cargando Dashboard...'"
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
      <HeadersHeaderDashboard />

      <!-- Content Container with max-w-2xl -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Toast Component -->
        <Toast 
          v-if="toast.show"
          :message="toast.message" 
          :type="toast.type"
          @close="toast.show = false"
        />
      <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
      <div class="pb-20">
        <!-- Main Content -->
        <main class="pb-4">
      
      <!-- Welcome Section -->
      <section class="px-4 py-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          <!-- Background decoration -->
          <div class="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl"></div>
          <div class="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-lg"></div>
          
          <div class="relative">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-xl">👋</span>
              </div>
              <div>
                <h2 class="text-lg font-black text-gray-900 dark:text-white">
                  ¡Hola, {{ shortName }}!
                </h2>
                <p class="text-gray-600 dark:text-gray-400 text-sm">Bienvenido a HogarSeguro</p>
              </div>
            </div>
            
            <div class="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-3 rounded-xl">
              <p class="text-emerald-800 dark:text-emerald-200 font-medium text-center text-sm">
                🏠 Tu hogar está protegido con HogarSeguro
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Cards -->
      <section class="px-4 mb-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">📊</span>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-xs">Servicios Totales</p>
                <p class="text-xl font-black text-gray-900 dark:text-white">{{ statsData.totalServices }}</p>
              </div>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">💰</span>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400 text-xs">Crédito</p>
                <p class="text-xl font-black text-gray-900 dark:text-white">L. {{ (userCredit || 0).toLocaleString('es-HN') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Progress Section - New Design -->
      <section class="px-4 mb-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <!-- Header with gradient -->
          <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 p-4 text-white relative">
            <div class="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div class="relative">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-xl font-black">Tu Progreso</h3>
                <div class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                  <span v-if="isLoadingProgress" class="text-xs font-bold">Cargando...</span>
                  <span v-else class="text-xs font-bold">Mes {{ statsData.membershipMonths }}</span>
                </div>
              </div>
              
              <!-- Progress Circle -->
              <div class="flex items-center justify-center mb-3">
                <div class="relative w-24 h-24">
                  <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                    <path class="text-white/20" stroke="currentColor" stroke-width="3" fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="text-yellow-300" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"
                          :stroke-dasharray="progressCircle"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div v-if="isLoadingProgress" class="text-lg font-black text-white">--</div>
                      <div v-else class="text-lg font-black text-white">{{ statsData.membershipMonths }}</div>
                      <div class="text-xs text-white/80">Mes</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p class="text-center text-white/90 font-medium text-sm">
                {{ progressMessage }}
              </p>
            </div>
          </div>

          <!-- Benefits Cards -->
          <div class="p-4">
            <div v-if="loadingBenefits" class="grid grid-cols-2 gap-2">
              <div v-for="i in 4" :key="`skeleton-${i}`" 
                   class="h-20 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
            
            <div v-else-if="benefitsError" class="text-center py-3 text-red-500 text-sm">
              {{ benefitsError }}
              <button @click="fetchBeneficios" class="mt-2 text-xs text-blue-600 hover:underline">
                Reintentar
              </button>
            </div>
            
            <div v-else-if="benefitsToShow.length === 0" class="text-center py-3 text-gray-500 text-sm">
              No hay beneficios disponibles en este momento.
            </div>
            
            <div v-else class="grid grid-cols-2 gap-2">
              <div v-for="(benefit, index) in benefitsToShow" :key="`benefit-${benefit.mes_requerido}`"
                   class="p-3 rounded-xl border-2 transition-all duration-300"
                   :class="getBenefitStyle(benefit.mes_requerido)">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                       :class="getBenefitIconStyle(benefit.mes_requerido)">
                    {{ getBenefitIcon(benefit.mes_requerido) }}
                  </div>
                  <span class="text-xs font-bold"
                        :class="getBenefitTextStyle(benefit.mes_requerido)">
                    Mes {{ benefit.mes_requerido }}
                  </span>
                </div>
                <p class="text-xs font-semibold leading-tight mb-1"
                   :class="getBenefitTitleStyle(benefit.mes_requerido)">
                  {{ benefit.tipo_beneficio }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  <template v-if="benefit.tipo_beneficio === 'Descuento Especial en todos los Servicios'">
                    Descuento Especial del {{ specialDiscount }}% en todos los servicios
                  </template>
                  <template v-else-if="benefit.tipo_beneficio === 'Descuento en todos los servicios'">
                    Descuento del {{ regularDiscount }}% en todos los servicios
                  </template>
                  <template v-else>
                    {{ benefit.descripcion }}
                  </template>
                </p>
              </div>
            </div>
            
            <!-- Membresía -->
            <div class="mt-3 p-3 rounded-xl border transition-colors duration-300"
              :class="{
                'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': isMembershipActive,
                'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': isMembershipPending,
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800': isMembershipExpired,
                'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700': isMembershipInactive
              }">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      :class="{
                        'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400': isMembershipActive,
                        'bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400': isMembershipPending,
                        'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400': isMembershipExpired,
                        'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400': isMembershipInactive
                      }">
                      <span v-if="isMembershipActive">🏆</span>
                      <span v-else-if="isMembershipPending">⏳</span>
                      <span v-else-if="isMembershipExpired">⚠️</span>
                      <span v-else>🔒</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-medium"
                        :class="{
                          'text-blue-800 dark:text-blue-200': isMembershipActive,
                          'text-amber-800 dark:text-amber-200': isMembershipPending,
                          'text-red-800 dark:text-red-200': isMembershipExpired,
                          'text-gray-800 dark:text-gray-200': isMembershipInactive
                        }">
                        {{ isMembershipActive ? 'Membresía activa hasta' : 
                           isMembershipPending ? 'Membresía pendiente' :
                           isMembershipExpired ? 'Membresía vencida' : 'Estado de la membresía' }}
                      </p>
                      <p class="text-xs font-bold truncate"
                        :class="{
                          'text-blue-900 dark:text-white': isMembershipActive,
                          'text-amber-900 dark:text-amber-100': isMembershipPending,
                          'text-red-900 dark:text-red-100': isMembershipExpired,
                          'text-gray-900 dark:text-gray-100': isMembershipInactive
                        }">
                        {{ isMembershipActive ? membershipEndDate : membershipStatus }}
                      </p>
                    </div>
                  </div>
                  
                  <!-- Barra de progreso -->
                  <div v-if="!isMembershipInactive" class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-1">
                    <div 
                      class="h-1.5 rounded-full transition-all duration-500 ease-in-out"
                      :class="{
                        'bg-gradient-to-r from-green-500 to-emerald-600': membershipProgress < 80,
                        'bg-gradient-to-r from-amber-400 to-orange-500': membershipProgress >= 80 && membershipProgress < 95,
                        'bg-gradient-to-r from-red-500 to-pink-600': membershipProgress >= 95
                      }"
                      :style="`width: ${membershipProgress}%`"
                    ></div>
                  </div>
                  
                  <div v-if="!isMembershipInactive" class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Inicio: {{ membershipStartDate }}</span>
                    <span v-if="membershipProgress > 0 && membershipProgress < 100">{{ membershipProgress }}% completado</span>
                    <span v-else-if="membershipProgress >= 100 && !diasRestantesCredito">Expirada</span>
                  </div>
                  
                  <!-- Mensaje de días restantes para crédito -->
                  <div v-if="diasRestantesCredito > 0" class="mt-2 text-xs font-medium px-2 py-1 rounded-md text-center bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <template v-if="diasRestantesCredito > 0">
                      <span v-if="diasRestantesCredito === 1">⚠️ Tienes 1 día antes de perder tu crédito</span>
                      <span v-else>⏳ Tienes {{ diasRestantesCredito }} días antes de perder tu crédito</span>
                    </template>
                  </div>
                </div>
                
                <button 
                  @click="renovarMembresia"
                  class="w-full sm:w-auto px-3 py-2 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-md whitespace-nowrap self-center sm:self-auto flex items-center justify-center"
                  :class="{
                    'bg-gradient-to-r from-green-400 to-green-500 cursor-not-allowed': isMembershipActive,
                    'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5': isMembershipExpired || isMembershipInactive,
                    'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed': isMembershipPending,
                    'opacity-80': !isMembershipExpired && !isMembershipInactive
                  }"
                  :disabled="!isMembershipExpired && !isMembershipInactive"
                >
                  <svg v-if="isMembershipExpired || isMembershipInactive" class="w-3 h-3 mr-1 animate-pulse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ isMembershipActive ? 'Membresía Activa' : isMembershipPending ? 'Pendiente' : isMembershipInactive ? 'Activar ahora' : 'Renovar Ahora' }}
                </button>
              </div>
              
              <!-- Información adicional para debug -->
              <div v-if="false" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
                <p>ID: {{ membershipData.id }}</p>
                <p>Estado: {{ membershipData.status }}</p>
                <p>Progreso: {{ membershipProgress }}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Service Request -->
      <section class="px-4 mb-4">
        <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl p-4 text-white relative overflow-hidden">
          <div class="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div class="relative">
            <h3 class="text-xl font-black mb-3 flex items-center space-x-2">
              <span>🚀</span>
              <span>Solicitar Servicio</span>
            </h3>
            
            <form @submit.prevent="handleRequestService" class="space-y-3">
              <div>
                <div class="multiselect-service-wrapper">
                <multiselect v-model="selectedServiceObject" 
                        :options="servicesList"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Selecciona un servicio"
                        label="name"
                        track-by="id"
                        class="multiselect-transparent"
                        :custom-label="getServiceLabel"
                        :options-limit="100"
                        :disabled="isLoadingServices || servicesList.length === 0"
                        :loading="isLoadingServices">
                  <template #singleLabel="{ option }">
                    <span class="truncate">{{ getServiceLabel(option) }}</span>
                  </template>
                </multiselect>
              </div>
              </div>
              
              <div>
                <textarea v-model="serviceFormData.description" 
                         placeholder="Describe el problema o servicio que necesitas..."
                         class="w-full px-3 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 resize-none h-20"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <input v-model="serviceFormData.colonia" 
                         type="text"
                         placeholder="Colonia"
                         class="w-full px-3 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                </div>
                <div>
                  <input v-model="serviceFormData.direccion" 
                         type="text"
                         placeholder="Dirección precisa"
                         class="w-full px-3 py-3 text-base border-2 border-white/30 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50">
                </div>
              </div>

              <button type="submit" 
                      :disabled="!isFormValid"
                      :class="[
                        'w-full py-3 backdrop-blur-sm border font-black text-base rounded-xl transition-all duration-300',
                        isFormValid 
                          ? 'bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-105 cursor-pointer' 
                          : 'bg-white/10 border-white/10 text-white/50 cursor-not-allowed'
                      ]">
                Solicitar Ahora
              </button>
            </form>
          </div>
        </div>
      </section> 

    
    <!-- Paquetes por Membresía - Imagen balanceada -->
<section v-if="paquetesMantenimiento?.length" class="px-4 mb-10">
  <!-- Header -->
  <div class="mb-6">
    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
      Mercado de Paquetes
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-300">
      Compra paquetes o canjéalos con tu crédito
    </p>
  </div>

  <!-- Grid 2 columnas -->
  <div class="grid grid-cols-2 gap-3">
    <div
      v-for="paquete in paquetesMantenimiento"
      :key="paquete.id"
      class="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition"
    >
      <!-- Imagen (altura limitada) -->
      <div class="relative w-full h-32 bg-gray-100 dark:bg-gray-700">
        <img
          v-if="paquete.imagen"
          :src="getOptimizedImage(paquete.imagen, 400, 200)"
          :alt="paquete.nombre"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M20 7l-8-4.5L4 7m16 0l-8 4.5M4 7v10l8 4.5m0 0l8-4.5" />
          </svg>
        </div>

        <!-- Badge flotante -->
        <span
          v-if="tienePaquete(paquete.id)"
          class="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white"
        >
          {{ getEstadoPaquete(paquete.id) }}
        </span>
      </div>

      <!-- Contenido -->
      <div class="p-3 flex flex-col flex-grow">
        <h4 class="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">
          {{ paquete.nombre }}
        </h4>

        <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {{ paquete.descripcion || 'Beneficio por membresía' }}
        </p>

        <!-- Acciones -->
        <div class="mt-auto">
          <button
            v-if="tienePaquete(paquete.id)"
            @click.stop="handlePaqueteClick(paquete)"
            class="w-full py-1.5 text-xs rounded-lg transition"
            :class="{
              'bg-emerald-600 text-white hover:bg-emerald-700': getEstadoPaquete(paquete.id) === 'Adquirido',
              'bg-emerald-600 text-white cursor-default': getEstadoPaquete(paquete.id) === 'En uso',
              'bg-gray-200 text-gray-400 cursor-not-allowed': ['Utilizado', 'Vencido', 'Verificando pago...'].includes(getEstadoPaquete(paquete.id))
            }"
            :disabled="getEstadoPaquete(paquete.id) !== 'Adquirido'"
          >
            {{ getEstadoPaquete(paquete.id) === 'En uso' ? 'En uso' : 'Usar paquete' }}
          </button>

          <button
            v-else
            @click.stop="canjearPaquete(paquete)"
            :disabled="!paquete.estado"
            class="w-full py-1.5 text-xs rounded-lg transition"
            :class="{
              'bg-blue-600 text-white hover:bg-blue-700':
                paquete.estado && userCredit >= paquete.costo,
              'bg-purple-600 text-white hover:bg-purple-700':
                paquete.estado && userCredit < paquete.costo,
              'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700':
                !paquete.estado
            }"
          >
            {{ userCredit >= paquete.costo ? 'Canjear' : 'Comprar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Modal de confirmación de uso de paquete -->
  <Transition
    name="fade"
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="showConfirmarUsoModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
      <div 
        class="w-full max-w-md transform transition-all duration-300 ease-out"
        :class="{
          'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !showConfirmarUsoModal,
          'opacity-100 translate-y-0 sm:scale-100': showConfirmarUsoModal
        }"
        @click.stop
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-semibold text-center text-gray-900 dark:text-white">¿Usar paquete?</h3>
            <p v-if="selectedPaquete" class="mb-6 text-sm text-center text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas usar el paquete <span class="font-medium text-gray-700 dark:text-gray-200">{{ selectedPaquete.nombre }}</span>?
            </p>
            <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"> 
              <button
                type="button"
                @click="usarPaquete(selectedPaquete)"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
              >
                <span>Sí, usar paquete</span>
                <svg v-if="isProcessingPayment" class="w-4 h-4 ml-2 -mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
              <button
                type="button"
                @click="showConfirmarUsoModal = false"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Modal de confirmación de canjeo de paquete -->
  <Transition
    name="fade"
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="showConfirmarCanjeoModal && selectedPaquete" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70">
      <div 
        class="w-full max-w-md transform transition-all duration-300 ease-out"
        :class="{
          'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95': !showConfirmarCanjeoModal,
          'opacity-100 translate-y-0 sm:scale-100': showConfirmarCanjeoModal
        }"
        @click.stop
      >
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-semibold text-center text-gray-900 dark:text-white">¿Canjear paquete?</h3>
            <p class="mb-6 text-sm text-center text-gray-500 dark:text-gray-400">
              ¿Estás seguro de que deseas canjear <span class="font-medium text-gray-700 dark:text-gray-200">{{ selectedPaquete.nombre }}</span> por <span class="font-bold text-blue-600 dark:text-blue-400">L. {{ selectedPaquete.costo.toLocaleString('es-HN') }}</span> de su saldo?
            </p>
            <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"> 
              <button
                type="button"
                @click="confirmarCanjeo"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 flex items-center justify-center"
              >
                <span>Sí, canjear</span>
                <svg v-if="isProcessingPayment" class="w-4 h-4 ml-2 -mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
              <button
                type="button"
                @click="cancelarCanjeo"
                class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</section>
 

      <!-- Modal de Pago de Paquete -->
      <Transition
        name="modal"
        enter-active-class="modal-enter-active"
        leave-active-class="modal-leave-active"
        enter-from-class="modal-enter-from"
        leave-to-class="modal-leave-to">
        <div v-if="showPaquetePagoModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
          <!-- Backdrop con animación -->
          <Transition
            name="backdrop"
            enter-active-class="backdrop-enter-active"
            leave-active-class="backdrop-leave-active"
            enter-from-class="backdrop-enter-from"
            leave-to-class="backdrop-leave-to"
          >
            <div 
              v-if="showPaquetePagoModal"
              class="absolute inset-0 bg-black/60 backdrop-blur-sm"
              @click="closePaquetePagoModal"
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
              v-if="showPaquetePagoModal"
              class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
              @click.stop
            >
              <!-- Header del modal con botón de cerrar -->
              <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 px-4 py-0.5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-base font-semibold text-gray-900 dark:text-white">Pagar Paquete</h3>
                <button 
                  @click="closePaquetePagoModal"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 -mr-1"
                  aria-label="Cerrar modal"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <!-- Contenido principal del modal -->
              <div class="p-3">
                <!-- Resumen del paquete -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg mb-3">
                  <h4 class="font-bold text-gray-900 dark:text-white text-sm mb-2">Detalles del Paquete</h4>
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-base">
                      📦
                    </div>
                    <div>
                      <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ selectedPaquete?.nombre }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ selectedPaquete?.descripcion || 'Paquete de servicio' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Desglose de pago -->
                <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                  <h4 class="font-bold text-blue-800 dark:text-blue-200 text-sm mb-2">💰 Desglose de Pago</h4>
                  <div class="space-y-2 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-blue-700 dark:text-blue-300">Costo del paquete:</span>
                      <span class="font-bold text-blue-800 dark:text-blue-200">L. {{ formatNumber(selectedPaquete?.costo || 0) }}</span>
                    </div> 
                    <hr class="border-blue-200 dark:border-blue-700">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-blue-800 dark:text-blue-200">Total a pagar:</span>
                      <span class="font-bold text-blue-800 dark:text-blue-200 text-base">L. {{ formatNumber(selectedPaquete?.costo || 0) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Cuentas -->
                <div class="space-y-2 mb-3">
                  <label for="bank-account-package" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Transferencia
                  </label>

                  <div v-if="isLoadingAccounts" class="py-6 flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando cuentas...</p>
                  </div>

                  <div v-else class="space-y-3">
                    <multiselect
                      id="bank-account-package"
                      v-model="selectedAccountObject"
                      :options="bankAccounts"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Selecciona una cuenta"
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
                        <span class="text-xs truncate">{{ getAccountLabel(option) }}</span>
                      </template>
                    </multiselect>

                    <!-- Detalles -->
                    <div 
                      v-if="selectedAccountObject" 
                      class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Detalles de la cuenta:
                      </h4>
                      <div class="space-y-1">
                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500 dark:text-gray-400">Nombre:</span>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ selectedAccountObject.banco }}</span>
                        </div>

                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500 dark:text-gray-400">Titular:</span>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ selectedAccountObject.beneficiario }}</span>
                        </div>

                        <div class="flex justify-between">
                          <span class="text-xs text-gray-500 dark:text-gray-400">Tipo:</span>
                          <span class="text-sm font-medium text-gray-700 dark:text-gray-200">{{ selectedAccountObject.tipo }}</span>
                        </div>

                        <div class="flex justify-between items-center">
                          <span class="text-xs text-gray-500 dark:text-gray-400">Cuenta:</span>
                          <div class="flex items-center space-x-2">
                            <span class="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                              {{ selectedAccountObject.num_cuenta }}
                            </span>
                            <button 
                              v-if="selectedAccountObject.num_cuenta.length > 10"
                              @click="copyToClipboard(selectedAccountObject.num_cuenta)"
                              class="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                              :title="'Copiar ' + selectedAccountObject.num_cuenta"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p v-if="bankAccounts.length === 0" class="text-xs text-red-500 mt-1">
                      No hay cuentas bancarias disponibles. Por favor contacta al administrador.
                    </p>
                  </div>
                </div>

                <!-- Campo de número de comprobante -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de Comprobante
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="numeroComprobante"
                      type="text"
                      inputmode="numeric"
                      pattern="\d*"
                      placeholder="Ingresa el número de comprobante"
                      class="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                      :disabled="isProcessingPayment"
                    /> 
                  </div>
                </div>

                <!-- Botón de pago -->
                <button
                  @click="procesarPagoPaquete"
                  :disabled="isProcessingPayment || bankAccounts.length === 0 || !numeroComprobante"
                  class="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span v-if="!isProcessingPayment">
                    Pagar L. {{ formatNumber(selectedPaquete?.costo || 0) }}
                  </span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando pago...
                  </span>
                </button>

                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Realiza la transferencia e ingresa el número de comprobante. Una vez enviado serás redirigido a WhatsApp para adjuntar la captura.
                </p>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>

      <!-- Quick Actions -->
      <section class="px-4 mb-4">
        <h3 class="text-lg font-black text-gray-900 dark:text-white mb-3">Acciones Rápidas</h3>
        <div class="grid grid-cols-2 gap-3">
          <button @click="navigateTo('/cliente/Servicios')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">🏠</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Ver Servicios</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Historial completo</p>
              </div>
            </div>
          </button>
          
          <button @click="navigateTo('/cliente/Perfil')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">👤</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Mi Perfil</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Configuración</p>
              </div>
            </div>
          </button>
          
          <button @click="navigateTo('/cliente/Soporte')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">💬</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Soporte</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Ayuda 24/7</p>
              </div>
            </div>
          </button>
          
          <button @click="navigateTo('/cliente/Referir')" class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 text-left">
            <div class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <span class="text-white text-lg">💰</span>
              </div>
              <div>
                <p class="font-bold text-gray-900 dark:text-white text-xs">Referir</p>
                <p class="text-xs text-gray-600 dark:text-gray-400">Ganá dinero</p>
              </div>
            </div>
          </button>
        </div>
      </section>
      </main>
      </div> <!-- Close pb-24 div -->
      </div> <!-- Close max-w-2xl container -->

      <FootersFooter /> 
    </div>
  </div>
</template>

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
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
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

.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Estilos para vue-multiselect */
.multiselect-custom {
  position: relative;
  z-index: 10;
}

/* Estilos para vue-multiselect - Máxima especificidad */
.multiselect-custom.multiselect__tags {
  min-height: 44px !important;
  padding: 8px 40px 8px 12px !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 0.75rem !important;
  background: linear-gradient(to bottom right, #4f46e5, #2563eb, #0891b2) !important;
  backdrop-filter: blur(8px) !important;
  font-size: 16px !important;
  transition: all 0.2s ease !important;
  color: white !important;
}

.dark .multiselect-custom.multiselect__tags {
  background: linear-gradient(to bottom right, #4f46e5, #2563eb, #0891b2) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
}

/* Forzar estilos sobre clases globales */
.multiselect-custom .multiselect__tags,
.dark .multiselect-custom .multiselect__tags,
body .multiselect-custom .multiselect__tags,
html .multiselect-custom .multiselect__tags {
  background: linear-gradient(to bottom right, #4f46e5, #2563eb, #0891b2) !important;
  color: white !important;
}

/* Enfoque 3: Contenedor wrapper con multiselect transparente */
.multiselect-service-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  min-height: 44px;
  padding: 8px 40px 8px 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
  cursor: pointer;
}

.multiselect-service-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.multiselect-service-wrapper.active {
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.multiselect-transparent .multiselect__tags {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  min-height: auto !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.multiselect-transparent .multiselect__placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 16px;
}

.multiselect-transparent .multiselect__single {
  color: white !important;
  font-size: 16px;
  font-weight: 500;
}

.multiselect-transparent .multiselect__select {
  padding: 0 !important;
  right: 12px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.multiselect-transparent .multiselect__select::before {
  border-color: white transparent transparent;
}

.multiselect-transparent .multiselect__content-wrapper {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 50;
}

.multiselect-transparent .multiselect__option {
  padding: 12px 16px;
  min-height: 44px;
  font-size: 16px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
}

.multiselect-transparent .multiselect__option:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.multiselect-transparent .multiselect__option--selected {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

.multiselect-transparent .multiselect__option--highlight {
  background-color: #3b82f6;
  color: white;
}

.multiselect-custom .multiselect__tags:hover {
  border-color: rgba(255, 255, 255, 0.5);
}

.multiselect-custom.multiselect--active .multiselect__tags {
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
}

.multiselect-custom .multiselect__placeholder {
  margin-bottom: 0;
  padding: 0;
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 16px;
}

.dark .multiselect-custom .multiselect__placeholder {
  color: rgba(255, 255, 255, 0.7) !important;
}

.multiselect-custom .multiselect__single {
  margin-bottom: 0;
  padding: 0;
  color: white !important;
  font-size: 16px;
  font-weight: 500;
}

.dark .multiselect-custom .multiselect__single {
  color: white !important;
}

.multiselect-custom .multiselect__select {
  padding: 8px 12px;
}

.multiselect-custom .multiselect__select::before {
  border-color: white transparent transparent;
  top: 65%;
}

.multiselect-custom .multiselect__content-wrapper {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 50;
}

.multiselect-custom .multiselect__content {
  list-style: none;
  padding: 0;
  margin: 0;
}

.multiselect-custom .multiselect__element {
  padding: 0;
}

.multiselect-custom .multiselect__option {
  padding: 12px 16px;
  min-height: 44px;
  font-size: 16px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
}

.multiselect-custom .multiselect__option:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.multiselect-custom .multiselect__option--selected {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: #3b82f6;
  color: white;
}

.multiselect-custom .multiselect__option--highlight::after {
  content: '';
}

.multiselect-custom .multiselect__spinner {
  background: transparent;
}

.multiselect-custom .multiselect__spinner::before,
.multiselect-custom .multiselect__spinner::after {
  border-color: white transparent transparent;
}
</style>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect' 

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de control de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'keywords', content: 'dashboard, HogarSeguro, servicios, membresía, panel de control' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga y datos principales
const isLoading = ref(true)
const isLoadingProgress = ref(false)
const isLoadingServices = ref(false)

// Datos del usuario
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

// Estados de datos
const statsData = ref({
  totalServices: 0,
  credit: 0,
  membershipMonths: 0
})

// Estados de membresía
const membershipData = ref({
  id: null,
  status: 'inactiva',
  progress: 0,
  startDate: null,
  endDate: null
})

// Estado para controlar si se ha realizado el reinicio de crédito
const creditResetDone = ref(false)

// Estados de beneficios
const beneficios = ref([]);
const loadingBenefits = ref(false);
const benefitsError = ref(null);
const specialDiscount = ref('15'); // Valor por defecto para descuento especial
const regularDiscount = ref('10'); // Valor por defecto para descuento regular

// Estados de servicios
const servicesList = ref([])
const serviceFormData = ref({
  type: '',
  description: '',
  colonia: '',
  direccion: ''
})

const selectedServiceObject = ref(null)

// Función para obtener la etiqueta del servicio
const getServiceLabel = (option) => {
  if (!option) return ''
  return `${option.icon} ${option.name}`
}

// Estados de notificaciones
const recentServicesData = ref([]);

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// Variable reactiva para almacenar el número de teléfono de la empresa
const empresaPhoneNumber = ref('');

// =========================
// COMPUTED PROPERTIES
// =========================

// Obtener solo los dos primeros nombres
const shortName = computed(() => {
  if (!userData.value.nombre) return 'Invitado'
  const names = userData.value.nombre.split(' ')
  return names.length > 2 ? `${names[0]} ${names[1]}` : userData.value.nombre
})

// Computed properties para la membresía
const isMembershipActive = computed(() => {
  return membershipData.value.status === 'activa'
})

const isMembershipPending = computed(() => {
  return membershipData.value.status === 'pendiente'
})

const isMembershipExpired = computed(() => {
  return membershipData.value.status === 'vencida' || 
         (membershipData.value.status === 'activa' && membershipData.value.progress >= 100)
})

const isMembershipInactive = computed(() => {
  return !membershipData.value.status || membershipData.value.status === 'inactiva' || membershipData.value.status === 'rechazada'
})

const membershipProgress = computed(() => membershipData.value.progress || 0)

const membershipEndDate = computed(() => {
  if (!membershipData.value.endDate) return 'Fecha no disponible'
  
  return new Date(membershipData.value.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const membershipStartDate = computed(() => {
  if (!membershipData.value.startDate) return 'N/A';
  
  return new Date(membershipData.value.startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
})

const membershipStatus = computed(() => {
  const status = membershipData.value.status || 'inactiva'
  
  const statusMap = {
    'activa': 'Activa',
    'pendiente': 'Pendiente de verificación',
    'vencida': 'Vencida',
    'inactiva': 'Sin membresía',
    'vencida_reiniciada': 'Crédito reiniciado'
  }
  
  return statusMap[status] || 'Sin membresía'
})

// Días restantes antes de perder el crédito (3 días después del vencimiento)
const diasRestantesCredito = computed(() => {
  if (!membershipData.value.endDate) return null;
  
  const fechaVencimiento = new Date(membershipData.value.endDate);
  const fechaLimite = new Date(fechaVencimiento);
  
  // Obtener el período de gracia de la membresía o usar 3 días por defecto
  const diasGracia = membershipData.value.diasGracia || 3;
  fechaLimite.setDate(fechaLimite.getDate() + diasGracia);
  
  const hoy = new Date();
  const diffTime = fechaLimite - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Solo mostrar días restantes si ya pasó la fecha de vencimiento
  return hoy > fechaVencimiento ? Math.max(0, diffDays) : null;
})

// Computed para mapear los beneficios al formato esperado por la UI
const benefitsToShow = computed(() => {
  if (!beneficios.value || !Array.isArray(beneficios.value)) return [];
  
  return [...beneficios.value]
    .sort((a, b) => (a.mes_requerido || 0) - (b.mes_requerido || 0))
    .map(benefit => ({
      ...benefit,
      mes_requerido: benefit.mes_requerido || 0,
      tipo_beneficio: benefit.tipo_beneficio || 'Beneficio',
      descripcion: benefit.descripcion || '',
      savings: benefit.savings || ''
    }));
})

// Computed para obtener el mes actual relativo al inicio de la membresía
const currentMonth = computed(() => {
  if (!membershipData.value?.fecha_inicio) return 0
  const startDate = new Date(membershipData.value.fecha_inicio)
  const now = new Date()
  const months = (now.getFullYear() - startDate.getFullYear()) * 12
  return months + now.getMonth() - startDate.getMonth()
})

// Computed properties para el progreso
const progressCircle = computed(() => {
  const progress = Math.min(statsData.value.membershipMonths, 6) / 6 * 100
  return `${progress}, 100`
})

const progressCount = computed(() => {
  return Math.min(statsData.value.membershipMonths, 6)
})

const progressMessage = computed(() => {
  const month = statsData.value.membershipMonths
  if (month >= 6) return '¡Has desbloqueado todos los beneficios!'
  if (month >= 3) return 'Ya Puedes Adquirir el Paquete de Limpieza de Aire Acondicionado'
  if (month >= 2) return 'Ya puedes usar lo abonado en Membresía para pagar Servicios'
  if (month >= 1) return 'Ya tienes descuentos disponibles'
  return 'Empieza a acumular beneficios con tu membresía'
})

const recentServicesDisplay = computed(() => {
  return recentServicesData.value.slice(0, 3)
})

const isFormValid = computed(() => {
  return (
    serviceFormData.value.type &&
    serviceFormData.value.description.trim() !== '' &&
    serviceFormData.value.colonia.trim() !== '' &&
    serviceFormData.value.direccion.trim() !== ''
  )
})

// =========================
// FUNCIONES UTILITARIAS
// =========================

// Get appropriate icon based on service name
const getServiceIcon = (serviceName) => {
  const name = serviceName.toLowerCase()
  if (name.includes('plom')) return '🚰'
  if (name.includes('electric') || name.includes('eléctric')) return '💡'
  if (name.includes('pintur')) return '🎨'
  if (name.includes('carpinter')) return '🔨'
  if (name.includes('jardín') || name.includes('jardin')) return '🌱'
  if (name.includes('limpiez')) return '🧹'
  if (name.includes('aire') || name.includes('clima')) return '❄️'
  return '🔧'
}

const getStatusColor = (status) => {
  const colors = {
    'Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'En progreso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'En camino': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Programado': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

// =========================
// FUNCIONES DE ESTILO
// =========================

const getBenefitStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 
    'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
}

const getBenefitIconStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'bg-green-500 text-white' : 
    'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
}

const getBenefitIcon = (month) => {
  return statsData.value.membershipMonths >= month ? '✓' : month.toString()
}

const getBenefitTextStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'text-green-700 dark:text-green-300' : 
    'text-gray-600 dark:text-gray-400'
}

const getBenefitTitleStyle = (month) => {
  return statsData.value.membershipMonths >= month ? 
    'text-green-800 dark:text-green-200' : 
    'text-gray-700 dark:text-gray-300'
}

// =========================
// FUNCIONES DE CARGA DE DATOS
// =========================

// Función para obtener el crédito del usuario
const fetchUserCredit = async () => {
  try {
    const user = useCookie('user').value
    if (!user?.id_usuario) return
    
    const response = await $api(`/credito/usuario/${user.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response?.success && response.data) {
      userCredit.value = response.data.monto_credito
    } else {
      console.warn('La respuesta no contiene datos de crédito válidos:', response)
    }
  } catch (error) {
    console.error('Error al obtener el crédito del usuario:', error)
    userCredit.value = 0
  }
}

// Función para obtener el progreso de la membresía
const fetchMembershipProgress = async () => {
  try {
    isLoadingProgress.value = true
    
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData || !userData.id_usuario) {
      return
    }

    const response = await $api(`/membresia/progreso/${userData.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      ignoreResponseError: true
    }).catch(() => null)

    if (response?.status === 'success') {
      statsData.value.membershipMonths = response.mesesProgreso || 0
      statsData.value.credit = response.montoTotal || 0
    }
  } catch (error) {
    // Silenciar errores
  } finally {
    isLoadingProgress.value = false
  }
}

// Función para verificar si ha pasado el período de gracia desde el vencimiento
const haPasadoPeriodoDeGracia = (fechaVencimiento, diasGracia) => {
  if (typeof diasGracia === 'undefined' || diasGracia === null) {
    console.error('❌ Error: No se proporcionó el período de gracia');
    return false;
  }
  
  const hoy = new Date();
  const fechaLimite = new Date(fechaVencimiento);
  fechaLimite.setDate(fechaLimite.getDate() + parseInt(diasGracia, 10)); 
  
  return hoy > fechaLimite
}

const fetchMembershipData = async () => { 

  const userCookie = useCookie('user');
  const userData = userCookie.value;

  if (!userData || !userData.id_usuario) {
    membershipData.value = { status: 'inactiva', progress: 0 };
    return { status: 'not_found' };
  }

  try {
    const response = await $api(`/membresia/${userData.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    // Caso: no hay membresía activa
    if (response.status === 'not_found' || (response.status === 'success' && !response.data)) {
      membershipData.value = { status: 'inactiva', progress: 0 };
      return { status: 'not_found' };
    }

    // Caso: membresía válida
    if (response.status === 'success' && response.data) {
      const membresia = response.data;

      if (!membresia.fecha) {
        console.warn('⚠️ Fecha de membresía no válida:', membresia);
        membershipData.value = { status: 'inactiva', progress: 0 };
        return { status: 'not_found' };
      }

      const DURACION_MEMBRESIA_DIAS = 30; // La membresía siempre dura 30 días
      const fechaInicio = new Date(membresia.fecha);
      const fechaVencimiento = new Date(fechaInicio);
      
      // Establecer la fecha de vencimiento a 30 días después de la fecha de inicio
      fechaVencimiento.setDate(fechaVencimiento.getDate() + DURACION_MEMBRESIA_DIAS);
      
      // Obtener el período de gracia desde la API
      const diasGracia = await getCreditResetPeriod();
      
      const hoy = new Date();
      const totalDias = DURACION_MEMBRESIA_DIAS; // La duración total es siempre 30 días
      const diasTranscurridos = (hoy - fechaInicio) / (1000 * 60 * 60 * 24);
      const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
      const progreso = Math.min(100, Math.max(0, Math.round((diasTranscurridos / totalDias) * 100)));
      
      let estado = membresia.estado;
      const estaVencida = progreso >= 100;
      
      // Verificar si la membresía está vencida o está activa pero debería estar vencida
      const esMembresiaVencida = estaVencida && (membresia.estado === 'activa' || membresia.estado === 'vencida');
      
      if (esMembresiaVencida) {
        if (membresia.estado === 'activa') {
          estado = 'vencida';
        }

        const haPasadoGracia = haPasadoPeriodoDeGracia(fechaVencimiento, diasGracia);
        
        if (haPasadoGracia && !creditResetDone.value) {
          try {
            // Solo actualizar si el estado no es 'vencida'
            if (membresia.estado !== 'vencida') {
              await updateMembershipToExpired(membresia.id_membresia);
            }
            await resetCredito();
            creditResetDone.value = true;
          } catch (error) {
            console.error('Error al reiniciar crédito automáticamente:', error);
          }
        }
      }

      const membershipInfo = {
        id: membresia.id_membresia,
        status: estado,
        progress: progreso,
        startDate: fechaInicio,
        endDate: fechaVencimiento,
        estado,
        diasGracia, // Añadir el período de gracia al objeto membershipInfo
        puedeReiniciar: haPasadoPeriodoDeGracia(fechaVencimiento, diasGracia) && !creditResetDone.value
      };

      membershipData.value = membershipInfo;
      return membershipInfo;
    }

    // Cualquier otro caso inesperado
    console.warn('⚠️ Respuesta inesperada de membresía:', response);
    membershipData.value = { status: 'inactiva', progress: 0 };
    return { status: 'not_found' };

  } catch (error) {
    console.error('❌ Error al obtener datos de la membresía:', error);
    membershipData.value = { status: 'inactiva', progress: 0 };
    return { status: 'not_found' };
  }
};



// Función para obtener el total de solicitudes de servicio del usuario
const fetchTotalSolicitudes = async () => {
  try {
    const user = useCookie('user').value
    if (!user || !user.id_usuario) return

    const response = await $api(`/solicitudservicio/usuario/${user.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response && typeof response.total === 'number') {
      statsData.value.totalServices = response.total
    }
  } catch (error) {
    console.error('Error al obtener el total de solicitudes:', error)
  }
}

// Cargar servicios desde la API
const fetchServices = async () => {
  try {
    isLoadingServices.value = true
    const user = useCookie('user').value
    const id_ciudad = user?.id_ciudad
    
    const data = await $api('/servicios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      params: id_ciudad ? { id_ciudad } : {}
    })
    
    if (Array.isArray(data)) {
      servicesList.value = data.map(service => ({
        id: service.id_servicio,
        name: service.nombre,
        description: service.descripcion,
        icon: getServiceIcon(service.nombre)
      }))
    }
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showToast('No se pudieron cargar los servicios. Intente nuevamente.', 'error')
  } finally {
    isLoadingServices.value = false
  }
}

// Fetch beneficios desde la API
const fetchBeneficios = async () => {
  loadingBenefits.value = true;
  benefitsError.value = null;
  
  try {
    const response = await $api('/membresiabeneficios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    // Asegurarse de que la respuesta tenga la estructura esperada
    if (response && Array.isArray(response.beneficios)) {
      beneficios.value = response.beneficios.map(benefit => ({
        ...benefit,
        mes_requerido: benefit.mes_requerido || 0,
        tipo_beneficio: benefit.tipo_beneficio || 'Beneficio',
        descripcion: benefit.descripcion || '',
        savings: benefit.savings || ''
      }));
      
      // Guardar los porcentajes de descuento si están disponibles
      if (response.valores) {
        if (response.valores.porcentaje_descuento_especial) {
          specialDiscount.value = response.valores.porcentaje_descuento_especial;
        }
        if (response.valores.porcentaje_descuento) {
          regularDiscount.value = response.valores.porcentaje_descuento;
        }
      }
    } else if (Array.isArray(response)) {
      // Para compatibilidad con versiones anteriores de la API
      beneficios.value = response;
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
    
    // Si no hay beneficios, establecer un array vacío
    if (!beneficios.value || beneficios.value.length === 0) {
      console.warn('No se encontraron beneficios');
      beneficios.value = [];
    }
  } catch (error) {
    console.error('Error al cargar beneficios:', error);
    benefitsError.value = 'No se pudieron cargar los beneficios. Intente más tarde.';
    beneficios.value = []; // Asegurar que sea un array vacío en caso de error
  } finally {
    loadingBenefits.value = false;
  }
}

// Función para formatear números con separadores de miles
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00';
  return new Intl.NumberFormat('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Función para obtener el número de teléfono de la empresa
const fetchEmpresaPhoneNumber = async () => {
  try {
    const response = await $api('/config/valor/numero_empresa', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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

// Función para enviar detalles por WhatsApp
const sendWhatsAppMessage = async (data, type) => {
  try {
    // Si no tenemos el número de teléfono, intentar obtenerlo
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }
    
    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getFullYear()).slice(-2)
    ].join('');

    let message = '';
    
    if (type === 'package_payment') {
      // Mensaje para comprobante de pago de paquete
      message = `*Comprobante de Pago de Paquete*\n\n` +
        `*ID:* ${formattedDate}-${data.id_paquete_usuario}\n` +
        `*Paquete:* ${data.nombre_paquete}\n` + 
        `*N° de comprobante:* ${data.receiptNumber}\n` +
        `*Monto:* L. ${formatNumber(data.amount)}\n\n` +
        `Adjunto una captura del comprobante de pago para su verificación.`;
    } else if (type === 'use_package') {
      // Mensaje para solicitud de uso de paquete
      // Mensaje general para solicitud de uso de paquete
      message =
        `*Solicitud de Uso de Paquete*\n\n` +
        `Hola, deseo solicitar el uso de un paquete adquirido a través de la plataforma HogarSeguro.\n\n` +
        `*ID:* ${formattedDate}-${data.id_paquete_usuario}\n` +
        `*Paquete:* ${data.nombre_paquete}\n` +
        `Quedo atento(a) a la coordinación correspondiente.`;
    }
    
    if (!message) return;

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Usar el número de teléfono de la empresa o uno por defecto
    const phoneNumber = empresaPhoneNumber.value || '1234567890';
    
    // Abrir WhatsApp Web con el mensaje predefinido
    window.open(`https://wa.me/+504${phoneNumber}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
};

// =========================
// FUNCIONES DE NAVEGACIÓN
// =========================

const renovarMembresia = () => {
  navigateTo('/cliente/perfil#membresia')
}

// Lista de paquetes de mantenimiento disponibles
const paquetesMantenimiento = ref([]);
const paquetesUsuario = ref([]);
const cargandoPaquetes = ref(true);

// Estado para manejar la carga de imágenes
const imageLoaded = ref({});

// Función para obtener la URL de la imagen optimizada con Cloudinary
const getOptimizedImage = (url, width = 400, height = 250) => {
  if (!url) return null;
  
  // Si ya es una URL de Cloudinary, aplicar transformaciones
  if (url.includes('res.cloudinary.com')) {
    // Extraer la parte de la URL antes de las transformaciones
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const restOfUrl = url.split('/upload/')[1];
    
    // Aplicar transformaciones de optimización
    return `${baseUrl}c_fill,w_${width},h_${height},f_auto,q_auto/${restOfUrl}`;
  }
  
  // Si no es una URL de Cloudinary, devolver la URL original
  return url;
};

// Función para manejar errores de carga de imágenes
const handleImageError = (paqueteId) => {
  // Marcar como error para mostrar el ícono de error
  imageLoaded.value[paqueteId] = 'error';
};

// Estado del modal de pago de paquete
const showPaquetePagoModal = ref(false);
const showConfirmarUsoModal = ref(false);
const showConfirmarCanjeoModal = ref(false);
const selectedPaquete = ref(null);
const isLoadingAccounts = ref(false);
const bankAccounts = ref([]);
const selectedAccountObject = ref(null);
const isProcessingPayment = ref(false);
const numeroComprobante = ref('');

// Función para cargar los paquetes activos desde la API
const cargarPaquetesActivos = async () => {
  try {
    cargandoPaquetes.value = true;
    const user = useCookie('user').value;
    const id_ciudad = user?.id_ciudad;
    const id_usuario = user?.id_usuario;

    const response = await $api('/paquetes/activos', {
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`
      },
      params: {
        ...(id_ciudad && { id_ciudad }),
        ...(id_usuario && { id_usuario })
      }
    });
    
    // Inicializar estados de carga de imágenes
    response.forEach(paquete => {
      if (paquete.imagen_url) {
        imageLoaded.value[paquete.id_paquete] = false;
      }
    });
    
    // Mapear la respuesta de la API al formato esperado
    paquetesMantenimiento.value = response.map(paquete => ({
      id: paquete.id_paquete,
      nombre: paquete.nombre,
      descripcion: paquete.descripcion,
      costo: parseFloat(paquete.costo), // Convertir a número
      estado: paquete.estado,
      disponible: paquete.disponible !== false, // Asegurar que sea booleano
      imagen: paquete.imagen_url || null // Incluir la URL de la imagen o null si no hay
    }));
  } catch (error) {
    console.error('Error al cargar paquetes:', error);
    showToast('Error', 'No se pudieron cargar los paquetes', 'error');
  } finally {
    cargandoPaquetes.value = false;
  }
};

// Cargar los paquetes cuando el componente se monte
onMounted(async () => {
  await cargarPaquetesActivos();
  await cargarPaquetesUsuario();
});

const canjearPaquete = async (paquete) => {
  if (!paquete || !paquete.id) {
    showToast('Error', 'Paquete no válido', 'error');
    return;
  }

  if (userCredit.value < paquete.costo) {
    // Mostrar modal de pago en lugar de mensaje de error
    selectedPaquete.value = paquete;
    await cargarCuentasBancarias();
    showPaquetePagoModal.value = true;
    return;
  }
  
  // Si tiene crédito suficiente, mostrar modal de confirmación
  selectedPaquete.value = paquete;
  showConfirmarCanjeoModal.value = true;
};

const confirmarCanjeo = async () => {
  const paquete = selectedPaquete.value;
  if (!paquete) return;
  
  showConfirmarCanjeoModal.value = false;
  
  try {
    // Obtener el usuario de la cookie
    const user = useCookie('user').value;
    if (!user || !user.id_usuario) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    // Primero, descontar el crédito
    const creditoResponse = await $api('/credito', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: { 
        id_usuario: user.id_usuario,
        monto_credito: -Math.abs(paquete.costo)
      }
    });

    if (!creditoResponse.success) {
      throw new Error(creditoResponse.error || 'Error al actualizar el crédito');
    }

    // Luego, registrar el paquete para el usuario
    const requestData = {
      id_paquete: paquete.id,
      id_usuario: user.id_usuario
    }; 

    const response = await $api('/paquetes/usuarios/canjear', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: requestData
    }); 
    
    if (response.success) {
      // Actualizar el crédito del usuario
      userCredit.value = userCredit.value - paquete.costo;
      
      // Actualizar la lista de paquetes del usuario
      await cargarPaquetesUsuario();
      
      // Notificar a los administradores
      try {
        const user = useCookie('user').value;
        await $api('/notificaciones/enviar', {
          method: 'POST',
          baseURL: config.public.apiBase,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          },
          body: JSON.stringify({
            titulo: 'Paquete Adquirido',
            nombre_rol: 'admin'
            })
        });

        // Notificar también al super admin
        await $api('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: 'Paquete Adquirido',
            nombre_rol: 'sa'
          })
        });
      } catch (error) {
        console.error('Error al enviar notificaciones:', error);
      }
      
      // Mostrar notificación de éxito al usuario
      showToast(
        '¡Paquete canjeado!', 
        response.message || 'El paquete se ha canjeado exitosamente',
        'success'
      );
      
      // Recargar la lista de paquetes
      await cargarPaquetesActivos();
    } else {
      console.error('Error en la respuesta del servidor:', response);
    }
  } catch (error) {
    console.error('Error al canjear el paquete:', {
      error: error,
      response: error.response?.data,
      status: error.response?.status
    });
    const errorMessage = error.data?.error || error.response?.data?.error || error.message || 'Ocurrió un error al procesar tu solicitud';
    showToast('Error', errorMessage, 'error');
  }
};

const cancelarCanjeo = () => {
  showConfirmarCanjeoModal.value = false;
  selectedPaquete.value = null;
};

// Función para cargar las cuentas bancarias
const cargarCuentasBancarias = async () => {
  isLoadingAccounts.value = true;
  try {
    const response = await $api('/cuentas', {
      baseURL: config.public.apiBase,
      method: 'GET'
    });

    if (response && Array.isArray(response)) {
      bankAccounts.value = response;
    }
  } catch (error) {
    console.error('Error al cargar cuentas bancarias:', error);
  } finally {
    isLoadingAccounts.value = false;
  }
};

// Función para obtener la etiqueta de la cuenta
const getAccountLabel = (account) => {
  if (!account) return '';
  return `🏦 ${account.banco}`;
};

// Función para procesar el pago del paquete
// Función para procesar el pago del paquete
const procesarPagoPaquete = async () => {
  // Validar que se haya seleccionado un paquete y que el número de comprobante no esté vacío
  if (!selectedPaquete.value) {
    showToast('Error', 'No se ha seleccionado ningún paquete', 'error');
    return;
  }

  // Validar el número de comprobante
  const numComprobante = numeroComprobante.value ? numeroComprobante.value.trim() : '';
  if (!numComprobante) {
    showToast('Error', 'Por favor ingresa el número de comprobante', 'error');
    return;
  }

  // Validar que el número de comprobante solo contenga números
  if (!/^\d+$/.test(numComprobante)) {
    showToast('Error', 'El número de comprobante solo puede contener números', 'error');
    return;
  }

  const user = useCookie('user').value;
  if (!user || !user.id_usuario) {
    showToast('Error', 'No se pudo obtener la información del usuario', 'error');
    return;
  }

  // Verificar si es pago con saldo o por transferencia
  const esPagoConSaldo = user.credito >= selectedPaquete.value.costo;
  
  // Si es pago por transferencia, validar que se haya seleccionado una cuenta
  if (!esPagoConSaldo && !selectedAccountObject.value) {
    showToast('Error', 'Por favor selecciona una cuenta bancaria para la transferencia', 'error');
    return;
  }

  isProcessingPayment.value = true;

  try {
    const requestData = {
      id_paquete: selectedPaquete.value.id,
      id_usuario: user.id_usuario,
      // Solo incluir estos campos si es pago por transferencia
      ...(!esPagoConSaldo && {
        esPagoTransferencia: true,
        id_cuenta: selectedAccountObject.value.id_cuenta,
        numero_comprobante: numComprobante
      })
    }; 

    const response = await $api('/paquetes/usuarios/canjear', {
      method: 'POST',
      body: requestData
    });

    if (response.success) {
      // Obtener el ID de paquete usuario recién creado
      const idPaqueteUsuario = response.data.paquete.id_paquete_usuario;

      // Actualizar el saldo del usuario si fue pago con saldo
      if (esPagoConSaldo && response.data.nuevoSaldo !== undefined) {
        user.credito = response.data.nuevoSaldo;
        // Actualizar la cookie con el nuevo saldo
        useCookie('user').value = user;
      }

      // Mostrar mensaje de éxito
      showToast(
        '¡Éxito!', 
        esPagoConSaldo 
          ? 'Paquete canjeado exitosamente' 
          : 'Solicitud de pago por transferencia registrada. Por favor espera la verificación.',
        'success'
      );

      // Capturar datos del paquete antes de cerrar el modal
      const paqueteNombre = selectedPaquete.value.nombre;
      const paqueteCosto = selectedPaquete.value.costo;

      // Cerrar el modal y actualizar la lista de paquetes
      closePaquetePagoModal();
      await cargarPaquetesUsuario();

      // Si fue por transferencia, abrir WhatsApp para enviar comprobante y notificar a los admins
      if (!esPagoConSaldo) {
        // Enviar notificaciones a los administradores
        try {
          const token = useCookie('token').value;
          const notificationData = { titulo: 'Pago de Paquete Recibido' };
          
          await Promise.all([
            $api('/notificaciones/enviar', {
              method: 'POST',
              baseURL: config.public.apiBase,
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ...notificationData, nombre_rol: 'admin' })
            }),
            $api('/notificaciones/enviar', {
              method: 'POST',
              baseURL: config.public.apiBase,
              headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ...notificationData, nombre_rol: 'sa' })
            })
          ]);
        } catch (notifierError) {
          console.error('Error al enviar notificaciones de pago de paquete:', notifierError);
        }

        sendWhatsAppMessage({
          id_paquete_usuario: idPaqueteUsuario,
          nombre_paquete: paqueteNombre,
          receiptNumber: numComprobante,
          amount: paqueteCosto
        }, 'package_payment');
      }
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    const errorMessage = error.response?.data?.error || 'Error al procesar el pago';
    showToast('Error', errorMessage, 'error');
  } finally {
    isProcessingPayment.value = false;
  }
};

// Función para cerrar el modal de pago
const closePaquetePagoModal = () => {
  showPaquetePagoModal.value = false;
  selectedPaquete.value = null;
  isProcessingPayment.value = false;
  numeroComprobante.value = ''; // Limpiar el campo al cerrar el modal
};

// Función para cargar los paquetes del usuario
const cargarPaquetesUsuario = async () => {
  try {
    const user = useCookie('user').value;
    if (!user || !user.id_usuario) {
      throw new Error('No se pudo obtener la información del usuario');
    }

    const response = await $api(`/paquetes/usuarios/${user.id_usuario}`, {
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (response.success && response.data) {
      paquetesUsuario.value = response.data;
    }
  } catch (error) {
    console.error('Error al cargar paquetes del usuario:', error);
    showToast('Error', 'No se pudieron cargar tus paquetes', 'error');
  }
};

// Función para verificar si el usuario tiene un paquete específico disponible para usar
const tienePaquete = (paqueteId) => {
  return paquetesUsuario.value.some(p => 
    p.id_paquete === paqueteId && (p.estado === 'activo' || p.estado === 'utilizando')
  );
};

// Función para obtener el estado del paquete (priorizando el estado más importante)
const getEstadoPaquete = (paqueteId) => {
  const paquetes = paquetesUsuario.value.filter(p => p.id_paquete === paqueteId);
  if (paquetes.length === 0) return '';
  
  // Prioridad 1: Verificando pago
  if (paquetes.some(p => p.estado === 'verificando_pago')) {
    return 'Verificando pago...';
  }
  
  // Prioridad 2: Activo (Disponible para usar)
  if (paquetes.some(p => p.estado === 'activo')) {
    return 'Adquirido';
  }
  
  // Prioridad 3: Utilizando (En uso)
  if (paquetes.some(p => p.estado === 'utilizando')) {
    return 'En uso';
  }
  
  return '';
};

// Función para manejar el clic en el botón de paquete
const handlePaqueteClick = (paquete) => {
  const estado = getEstadoPaquete(paquete.id);
  
  if (estado === 'Adquirido') {
    selectedPaquete.value = paquete;
    showConfirmarUsoModal.value = true;
  }
};

// Función para usar un paquete canjeado
const confirmarUsoPaquete = (paquete) => {
  selectedPaquete.value = paquete;
  showConfirmarUsoModal.value = true;
};

const usarPaquete = async (paquete) => {
  try {
    isProcessingPayment.value = true;
    // Buscar el registro del paquete en la lista de paquetes del usuario que esté activo
    const paqueteUsuario = paquetesUsuario.value.find(p => 
      p.id_paquete === paquete.id && p.estado === 'activo'
    );

    if (!paqueteUsuario) {
      showToast('Error', 'No tienes este paquete disponible para usar', 'error');
      isProcessingPayment.value = false;
      showConfirmarUsoModal.value = false; // Cerrar el modal en caso de error
      return;
    }

    const response = await $api(`/paquetes/usuarios/${paqueteUsuario.id_paquete_usuario}/activar`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.success) {
      showToast(
        '¡Paquete activado!', 
        `El paquete ${paquete.nombre} está ahora en uso.`,
        'success'
      );
      
      // Recargar la lista de paquetes del usuario
      await cargarPaquetesUsuario();
      
      // Enviar mensaje por WhatsApp
      sendWhatsAppMessage({
        id_paquete_usuario: paqueteUsuario.id_paquete_usuario,
        nombre_paquete: paquete.nombre
      }, 'use_package');
      
      // Notificar a los administradores y super administradores
      try {
        const user = useCookie('user').value;
        const notificationData = { titulo: 'Solicitud Uso de Paquete' };
        
        await Promise.all([
          $api('/notificaciones/enviar', {
            method: 'POST',
            baseURL: config.public.apiBase,
            headers: { 
              'Authorization': `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ ...notificationData, nombre_rol: 'admin' })
          }),
          $api('/notificaciones/enviar', {
            method: 'POST',
            baseURL: config.public.apiBase,
            headers: { 
              'Authorization': `Bearer ${auth.token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ ...notificationData, nombre_rol: 'sa' })
          })
        ]);
      } catch (error) {
        console.error('Error al enviar notificaciones:', error);
        // No mostramos error al usuario para no interrumpir el flujo
      }
      
      // Cerrar el modal después de completar las operaciones
      showConfirmarUsoModal.value = false;
    } else {
      showToast('Error', response.message || 'No se pudo activar el paquete', 'error');
      showConfirmarUsoModal.value = false; // Cerrar el modal en caso de error
    }
  } catch (error) {
    console.error('Error al usar el paquete:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Error al activar el paquete';
    showToast('Error', errorMessage, 'error');
  } finally {
    isProcessingPayment.value = false;
    showConfirmarUsoModal.value = false; // Asegurarse de que el modal se cierre en cualquier caso
  }
};

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

// Función para reiniciar el crédito del usuario
const resetCredito = async () => {
  try {
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData || !userData.id_usuario) {
      showToast('Error', 'No se pudo identificar al usuario', 'error')
      return
    }

    const response = await $api(`/credito/reset/${userData.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response && response.success) {  
      await fetchUserCredit()  
      return response.data
    } else {
      throw new Error(response?.message || 'Error al reiniciar el crédito')
    }
  } catch (error) { 
    throw error
  }
}

// Event handlers
const handleRequestService = async () => {
  try {
    if (!serviceFormData.value.type || !serviceFormData.value.description || 
        !serviceFormData.value.colonia || !serviceFormData.value.direccion) {
      throw new Error('Por favor completa todos los campos requeridos')
    }

    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    if (!userData) {
      throw new Error('No se pudo obtener la información del usuario. Por favor inicia sesión nuevamente.')
    }
    
    if (!userData.id_ciudad) {
      throw new Error('No se pudo determinar la ciudad del usuario. Por favor contacte al soporte.')
    }

    const selectedService = servicesList.value.find(s => s.name === serviceFormData.value.type)
    if (!selectedService) {
      throw new Error('No se pudo encontrar el servicio seleccionado')
    }

    const membershipStatus = await fetchMembershipData()
    const tieneMembresiaActiva = membershipStatus?.estado === 'activa'
    
    const estadoInicial = tieneMembresiaActiva ? 'pendiente_asignacion' : 'pendiente_pagovisita'
    const visitaPagada = tieneMembresiaActiva ? 0 : 1 

    const requestData = {
      id_usuario: Number(userData.id_usuario),
      id_servicio: Number(selectedService.id),
      id_ciudad: Number(userData.id_ciudad),
      colonia: serviceFormData.value.colonia,
      direccion_precisa: serviceFormData.value.direccion,
      descripcion: serviceFormData.value.description,
      pagar_visita: visitaPagada,
      estado: estadoInicial
    }

    const response = await $api('/solicitudservicio', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: JSON.stringify(requestData),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    // Enviar notificación según el tipo de membresía
    try {
      const notificationData = tieneMembresiaActiva
        ? { titulo: 'Asignación Pendiente', nombre_rol: 'admin' }
        : { titulo: 'Pago de visita pendiente', id_usuario: Number(userData.id_usuario) }

      await $api('/notificaciones/enviar', {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(notificationData)
      })

      if (tieneMembresiaActiva) {
        await $api('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: 'Asignación Pendiente',
            nombre_rol: 'sa'
          })
        });
      }
    } catch (error) {
      console.error('Error al enviar notificación:', error)
      // No mostramos error al usuario para no afectar su experiencia
    }

    const newService = {
      id: response.id_solicitud_servicio || Date.now(),
      title: serviceFormData.value.type,
      description: serviceFormData.value.description,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pendiente',
      cost: 0,
      icon: selectedService.icon
    }
    
    recentServicesData.value.unshift(newService)
    
    serviceFormData.value = { 
      type: '', 
      description: '', 
      colonia: '', 
      direccion: '' 
    }
    
    showToast(
      '¡Solicitud enviada!', 
      tieneMembresiaActiva 
        ? 'Pronto se le asignará un técnico.' 
        : 'Ya puedes pagar la visita.',
      'success'
    )
    
    // Redirigir a la página de servicios después de 1.5 segundos
    setTimeout(() => {
      navigateTo('/cliente/Servicios')
    }, 1500)
    
  } catch (error) {
    console.error('Error al enviar la solicitud de servicio:', error)
    showToast('Error', 'No se pudo enviar la solicitud. Por favor, inténtalo mas tarde.', 'error')
  }
}

// =========================
// FUNCIONES DE GESTIÓN DE MEMBRESÍA
// =========================
// Función para obtener el período de reinicio de crédito desde la API
const getCreditResetPeriod = async () => {
  try {
    const response = await $api('/config/valor/reset_credito', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (response && response.valor) {
      const valor = parseInt(response.valor, 10);
      return valor || 30; // Usar 30 como valor por defecto
    }
    return 30; // Valor por defecto si no hay respuesta
  } catch (error) {
    console.error('❌ Error al obtener el período de reinicio de crédito:', error);
    return 30; // Valor por defecto en caso de error
  }
}

// Función para actualizar el estado de la membresía a vencida en el backend
const updateMembershipToExpired = async (membresiaId) => {
  try { 
    
    const response = await $api(`/membresia/${membresiaId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        estado: 'vencida'
      },
      onResponseError({ request, response, options }) {
        console.error('Error en la respuesta de la API:', {
          status: response.status,
          statusText: response.statusText,
          response: response._data
        });
      }
    }); 
    return { success: true };
  } catch (error) {
    console.error('❌ Error al actualizar el estado de la membresía:', {
      message: error.message,
      statusCode: error.statusCode,
      response: error.data,
      stack: error.stack
    });
    
    // Mostrar mensaje de error al usuario
    showToast('Error', 'No se pudo actualizar el estado de la membresía', 'error');
    
    return { success: false, error };
  }
};

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

const showToast = (param1, param2, param3 = 'success') => { 
  let message, type;
  
  if (param2 === 'success' || param2 === 'error' || param2 === 'warning' || param2 === 'info') {
    message = param1;
    type = param2;
  } else if (param2) {
    message = `${param1}
${param2}`;
    type = param3;
  } else {
    message = param1;
    type = 'success';
  }
  
  toast.value = {
    show: true,
    message: message,
    type: type,
    duration: 5000
  };   
}

// =========================
// INICIALIZACIÓN
// =========================

// Asegurar que name siempre tenga un valor
userData.value.name = userData.value.nombre || userData.value.name

// Estado reactivo para el crédito del usuario
const userCredit = ref(0)

// Watch para sincronizar serviceFormData.type con selectedServiceObject
watch(() => serviceFormData.value.type, (newType) => {
  if (newType && servicesList.value.length > 0) {
    const serviceObject = servicesList.value.find(s => s.name === newType);
    if (serviceObject) {
      selectedServiceObject.value = serviceObject;
    }
  } else {
    selectedServiceObject.value = null;
  }
});

// Watch para sincronizar selectedServiceObject con serviceFormData.type
watch(() => selectedServiceObject.value, (newService) => {
  if (newService) {
    serviceFormData.value.type = newService.name;
  } else {
    serviceFormData.value.type = '';
  }
});

// Verificar autenticación al cargar el componente
onMounted(async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    // Primero cargar los datos de la membresía
    await fetchMembershipData()
    
    // Luego cargar el resto de datos en paralelo
    await Promise.all([
      fetchMembershipProgress(),
      fetchServices(),
      fetchBeneficios(),
      fetchTotalSolicitudes(),
      fetchUserCredit()
    ])
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false
  }
})
</script> 