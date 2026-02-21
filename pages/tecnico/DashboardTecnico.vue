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
    <LoadingSpinner v-if="isLoading" :loading="isLoading" />

    <HeadersHeaderDashboardTecnico 
      @availability-change="handleAvailabilityChange"
    />

    <!-- Content Container -->
    <div class="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative pb-20 sm:pb-0">
      <div class="pb-24">
        <main class="pb-4">

          <!-- Invitación a notificaciones push -->
          <UiPushNotificationInvite /> 
          
          <!-- Welcome Section -->
          <section class="px-4 sm:px-6 py-4 sm:py-6">
            <div class="bg-dark dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              <!-- Background decoration -->
              <div class="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl sm:blur-2xl"></div>
              <div class="absolute -bottom-6 -left-6 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-lg sm:blur-xl"></div>
              
              <div class="relative">
                <div class="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center">
                    <span class="text-white text-xl sm:text-2xl">👋</span>
                  </div>
                  <div class="min-w-0">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                      ¡Hola, {{ currentUser?.nombre || 'Técnico' }}!
                    </h2>
                    <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400">Bienvenido al panel</p>
                  </div>
                </div>
                
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-2 sm:p-3 rounded-xl">
                  <p class="text-blue-800 dark:text-blue-200 font-medium text-sm sm:text-base text-center">
                    🛠️ Gestiona tus servicios asignados
                  </p>
                </div>
              </div>
            </div>
          </section> 

          <!-- Stats Cards -->
          <section class="px-3 sm:px-6 mb-6">
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <!-- Tarjeta de Servicios Activos -->
              <!-- Tarjeta de Servicios Activos -->
              <div class="bg-dark dark:bg-gray-800 rounded-xl p-2 sm:p-3 shadow border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <span class="text-white text-sm sm:text-lg">📋</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 truncate">Servicios Activos</p>
                    <p class="text-base sm:text-xl font-black text-gray-900 dark:text-white">{{ stats.activeServices }}</p>
                  </div>
                </div>
              </div>
              
              <!-- Tarjeta de Calificación -->
              <div class="bg-dark dark:bg-gray-800 rounded-xl p-2 sm:p-3 shadow border border-gray-100 dark:border-gray-700">
                <div class="flex items-center space-x-2">
                  <div class="w-7 h-7 sm:w-9 sm:h-9 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                    <span class="text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">⭐</span>
                  </div>
                  <div class="min-w-0">
                  <p class="text-[10px] xs:text-xs text-gray-600 dark:text-gray-400 truncate">Calificación</p>
                    <p class="text-base sm:text-xl font-black text-gray-900 dark:text-white">{{ averageRating }}</p> 
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Servicios Recientes -->
          <section class="px-4 sm:px-6 mb-6">
            <div class="flex justify-between items-center mb-3 sm:mb-4">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Servicios Recientes</h3>
              <NuxtLink to="/tecnico/ServiciosTecnico" class="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors whitespace-nowrap ml-2">
                Ver todos
              </NuxtLink>
            </div>
            
            <div v-if="loading" class="py-8 flex justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
            
            <div v-else-if="services.length === 0" class="bg-dark dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-100 dark:border-gray-700">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">Sin servicios</h4>
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No hay servicios asignados</p>
            </div>
            
            <div class="space-y-2 sm:space-y-3">
              <div v-for="service in services" :key="service.id" 
                   @click="$router.push('/tecnico/ServiciosTecnico')"
                   class="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start space-x-2 sm:space-x-3">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-blue-50 dark:bg-blue-900/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <span class="text-blue-500 text-base sm:text-lg">🔧</span>
                      </div>
                      <div class="min-w-0">
                        <h4 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ service.title }}</h4>
                        <div class="flex items-center flex-wrap gap-x-1.5 text-gray-500 dark:text-gray-400 mt-0.5">
                          <span class="text-xs truncate max-w-[120px] xs:max-w-[180px] sm:max-w-full">
                            {{ formatStatus(service.location) }}
                          </span>
                          <span class="text-gray-300 dark:text-gray-600 hidden xs:inline">•</span>
                          <span class="text-[11px] xs:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            • {{ formatRelativeDate(service.date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button @click.stop="$router.push('/tecnico/ServiciosTecnico')" class="text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0 ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <!-- Paginación -->
              <div v-if="totalServices > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Página {{ currentPage }} de {{ totalPages }}
                  </div>
                  <div class="flex items-center space-x-1">
                    <button 
                      @click="changePage(currentPage - 1)" 
                      :disabled="currentPage === 1 || loading"
                      class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      :class="{ 'cursor-not-allowed': currentPage === 1 }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button 
                      @click="changePage(currentPage + 1)" 
                      :disabled="currentPage >= totalPages || loading"
                      class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      :class="{ 'cursor-not-allowed': currentPage >= totalPages }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <section class="px-4 sm:px-6 mb-6">
            <h3 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">Acciones Rápidas</h3>
            <div class="grid grid-cols-2 gap-2 sm:gap-4">
              <button @click="updateAvailability" :disabled="loadingAvailability" class="bg-dark dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed h-full">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center" :class="isAvailable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'">
                    <div v-if="loadingAvailability" class="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-gray-400 border-t-transparent"></div>
                    <svg 
                      v-else
                      xmlns="http://www.w3.org/2000/svg" 
                      class="h-4 w-4 sm:h-5 sm:w-5" 
                      :class="isAvailable ? 'text-green-500' : 'text-red-500'"
                      fill="none" 
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path 
                        v-if="isAvailable"
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                      <path 
                        v-else
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <div class="w-full min-w-0">
                    <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">
                      {{ isAvailable ? 'Disponible' : 'No disponible' }}
                    </p>
                    <div class="flex items-center justify-between mt-1 sm:mt-2">
                      <span class="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate pr-1">
                        {{ isAvailable ? 'Activo para trabajos' : 'No disponible' }}
                      </span>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          class="sr-only peer"
                          :checked="isAvailable"
                          @change="updateAvailability"
                          :disabled="loadingAvailability"
                        >
                        <div 
                          class="w-9 h-5 sm:w-11 sm:h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] sm:after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all"
                          :class="isAvailable 
                            ? 'bg-green-500 after:border-green-500' 
                            : 'bg-red-500 after:border-red-500'"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </button>
              
              <button @click="viewReports" class="bg-dark dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left h-full">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">Ver Reportes</p>
                    <p class="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate">Estadísticas</p>
                  </div>
                </div>
              </button>
            </div>
            <div class="grid grid-cols-2 gap-2 sm:gap-4 mt-2 sm:mt-3">
              <button @click="navigateTo('/tecnico/Referir')" class="bg-dark dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left h-full">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">Referir</p>
                    <p class="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate">Compartir enlace</p>
                  </div>
                </div>
              </button>
              <button @click="navigateTo('/tecnico/Marketplace')" class="bg-dark dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left h-full">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm sm:text-base font-medium text-gray-900 dark:text-white truncate">Marketplace</p>
                    <p class="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate">Comprar paquete</p>
                  </div>
                </div>
              </button>
            </div> 
          </section>

          <!-- Paquetes por Membresía -->
          <section v-if="paquetesMantenimiento?.length" class="px-4 mb-2">
            <!-- Header -->
            <div class="flex items-end justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  Mercado de Paquetes 💎
                </h3>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Compra paquetes o canjéalos con tu crédito
                </p>
              </div>
              <button 
                v-if="paquetesMantenimiento.length > 4"
                @click="navigateTo('/tecnico/Marketplace')" 
                class="text-xs font-black text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full"
              >
                Ver todos
              </button>
            </div>

            <!-- Carril Horizontal -->
            <div class="relative -mx-4">
              <div 
                ref="carruselRef"
                class="flex gap-4 overflow-x-auto px-4 pb-4 no-scrollbar cursor-grab active:cursor-grabbing select-none"
                @mouseenter="isHovering = true"
                @mouseleave="isHovering = false"
                @touchstart="handleInteraction"
                @mousedown="handleInteraction"
                @scroll="onManualScroll"
              >
                <div
                  v-for="(paquete, index) in carouselItems"
                  :key="index"
                  @click="openPackageDetail(paquete)"
                  class="flex-shrink-0 w-52 flex flex-col rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden transform-gpu"
                >
                  <div class="relative w-full h-44 overflow-hidden">
                    <img
                      v-if="paquete.imagen"
                      :src="getOptimizedImage(paquete.imagen, 500, 400)"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-gray-700 text-2xl">📦</div>
                    
                    <!-- Badge Proprietary -->
                    <div v-if="tienePaquete(paquete.id)" class="absolute top-3 right-3 z-10">
                      <div class="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-[9px] font-black text-white shadow-lg uppercase tracking-widest border border-white/20">
                        {{ getEstadoPaquete(paquete.id) }}
                      </div>
                    </div>

                    <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent">
                      <h4 class="font-bold text-white text-sm line-clamp-1 truncate">{{ paquete.nombre }}</h4>
                      <p class="text-xs font-black text-blue-400">L. {{ formatNumber(paquete.costo) }}</p>
                    </div>
                  </div>
                  <div class="px-3 py-3 bg-white dark:bg-gray-800">
                    <button class="w-full py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- Detail Panel -->
    <Transition name="bottom-sheet">
      <div v-if="selectedDetailPackage" class="fixed inset-0 z-[100] flex flex-col justify-end isolate" @touchmove.stop>
        <div class="absolute inset-0 bg-black/60 bs-backdrop" @click="closeDetail"></div>
        <div class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[85vh] flex flex-col bs-content">
          <div class="w-full flex items-center justify-between px-6 py-4 absolute top-0 left-0 z-20 pointer-events-none">
            <div class="w-10 h-1 bg-white/40 backdrop-blur-md rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
            <div class="flex-1"></div>
            <button @click="closeDetail" class="w-9 h-9 rounded-full bg-black/30 backdrop-blur-xl text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto">✕</button>
          </div>
          <div class="overflow-y-auto overscroll-contain no-scrollbar">
            <div class="aspect-video w-full bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
              <img v-if="selectedDetailPackage.imagen" :src="getOptimizedImage(selectedDetailPackage.imagen, 1000, 600)" class="w-full h-full object-cover" />
            </div>
            <div class="px-6 pb-32 pt-6">
              <h2 class="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-1">{{ selectedDetailPackage.nombre }}</h2>
              <p class="text-base font-black text-blue-600 mb-4">L. {{ formatNumber(selectedDetailPackage.costo) }}</p>
              <div class="prose prose-sm dark:prose-invert text-gray-500 dark:text-gray-400">
                <h3 class="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">Descripción</h3>
                <p class="text-base leading-relaxed">{{ selectedDetailPackage.descripcion || 'Sin descripción.' }}</p>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 right-0 p-6 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
            <button @click="navigateTo('/tecnico/Marketplace')" class="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-base shadow-xl">
              Ir al Marketplace
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <FootersFooterTecnico />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'
import Toast from '~/components/ui/Toast.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

// SEO and Meta
useHead({
  title: 'MiSeguro - Panel Técnico',
  meta: [
    { name: 'description', content: 'Panel de Técnico - Gestiona tus servicios y asignaciones' },
    { name: 'keywords', content: 'MiSeguro, Panel Técnico, Técnico, Servicios, Asignaciones' },  
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// ===== CONFIGURACIÓN Y AUTENTICACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const currentUser = ref(auth.user)

// ===== VARIABLES DE ESTADO =====
const loading = ref(false)
const loadingAvailability = ref(false)
const isLoading = ref(false) // Para el spinner de carga general
const services = ref([])
const isAvailable = ref(false)

// Estadísticas y reseñas
const stats = ref({
  activeServices: 0,
  rating: 0,
  completedServices: 0
})

// Reseñas del técnico
const reviews = ref([])

// Variables de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// === Carrusel de Paquetes State ===
const paquetesMantenimiento = ref([])
const paquetesUsuario = ref([])
const displayedPaquetes = ref([])
const cargandoPaquetes = ref(true)
const imageLoaded = ref({})
const carruselRef = ref(null)
const isHovering = ref(false)
const isInteracting = ref(false)
let animationFrame = null
let currentScroll = 0
let resumeTimeout = null
let isAutoScrolling = false
const selectedDetailPackage = ref(null)

// ===== FUNCIONES DE UTILIDAD =====
const formatRelativeDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Fecha inválida'
  
  const now = new Date()
  const diffInMs = now - date
  
  // Calcular horas
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  if (diffInHours < 1) {
    return 'Ahora'
  } else if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`
  }
  
  // Calcular días
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  if (diffInDays < 7) {
    return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`
  }
}

const formatStatus = (status) => {
  const statusMap = {
    'pendiente_pago': 'Pendiente de Pago',
    'pendiente_asignacion': 'Pendiente de Asignación',
    'asignado': 'Asignado',
    'pendiente_pagocotizacion': 'Pendiente de Pago de Cotización',
    'en_proceso': 'En Proceso',
    'finalizado': 'Finalizado',
    'cancelado': 'Cancelado'
  }
  return statusMap[status] || status
}

const getStatusBadgeClass = (status) => {
  const statusClasses = {
    'pendiente_pago': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    'pendiente_asignacion': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'asignado': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'pendiente_pagocotizacion': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'en_proceso': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    'finalizado': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'cancelado': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// ===== FUNCIONES DE TOAST =====
const showToast = (options) => {
  toast.value.show = false
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    }
  })
}

const showSuccess = (message) => {
  showToast({
    message: message,
    type: 'success',
    duration: 5000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  
  showToast({
    message: message,
    type: 'error',
    duration: 8000
  })
}

// === Carrusel de Paquetes Logic ===
const getOptimizedImage = (url, w, h) => {
  if (!url) return null;
  if (url.includes('cloudinary')) {
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/c_fill,w_${w},h_${h},f_auto,q_auto/${parts[1]}`;
  }
  return url;
};

const handleInteraction = () => {
  isInteracting.value = true;
  if (resumeTimeout) clearTimeout(resumeTimeout);
  resumeTimeout = setTimeout(() => {
    isInteracting.value = false;
    if (carruselRef.value) currentScroll = carruselRef.value.scrollLeft;
  }, 2000);
};

const onManualScroll = () => {
  if (!isAutoScrolling) handleInteraction();
};

const startAutoScroll = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  const scroll = () => {
    if (selectedDetailPackage.value) {
      animationFrame = null;
      return;
    }
    if (carruselRef.value) {
      if (!isHovering.value && !isInteracting.value) {
        currentScroll += 0.6; 
        const halfWidth = carruselRef.value.scrollWidth / 2;
        if (currentScroll >= halfWidth) currentScroll = 0;
        isAutoScrolling = true;
        carruselRef.value.scrollLeft = currentScroll;
        requestAnimationFrame(() => { isAutoScrolling = false; });
      } else {
        currentScroll = carruselRef.value.scrollLeft;
      }
    }
    animationFrame = requestAnimationFrame(scroll);
  };
  animationFrame = requestAnimationFrame(scroll);
};

const stopAutoScroll = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
};

const cargarPaquetesActivos = async () => {
  try {
    cargandoPaquetes.value = true;
    const userCookie = useCookie('user').value;
    const id_ciudad = userCookie?.id_ciudad;
    const id_usuario = userCookie?.id_usuario;

    const response = await $api('/paquetes/activos', {
      params: { ...(id_ciudad && { id_ciudad }), ...(id_usuario && { id_usuario }) }
    });
    
    paquetesMantenimiento.value = response.map(paquete => ({
      id: paquete.id_paquete,
      nombre: paquete.nombre,
      descripcion: paquete.descripcion,
      costo: parseFloat(paquete.costo),
      estado: paquete.estado,
      disponible: paquete.disponible !== false,
      imagen: paquete.imagen_url || null
    }));
  } catch (error) {
    console.error('Error al cargar paquetes:', error);
  } finally {
    cargandoPaquetes.value = false;
  }
}; 

const tienePaquete = (paqueteId) => {
  return paquetesUsuario.value.some(p => p.id_paquete === paqueteId && p.estado !== 'canjeado');
};

const getEstadoPaquete = (paqueteId) => {
  const paquetes = paquetesUsuario.value.filter(p => p.id_paquete === paqueteId);
  if (paquetes.length === 0) return '';
  if (paquetes.some(p => p.estado === 'verificando_pago')) return 'Verificando';
  if (paquetes.some(p => p.estado === 'activo')) return 'Adquirido';
  if (paquetes.some(p => p.estado === 'utilizando')) return 'En uso';
  return '';
};

const openPackageDetail = (p) => {
  selectedDetailPackage.value = p;
  document.body.style.overflow = 'hidden';
  isHovering.value = true;
  stopAutoScroll();
};

const closeDetail = () => {
  selectedDetailPackage.value = null;
  document.body.style.overflow = '';
  isHovering.value = false;
  startAutoScroll();
};

const formatNumber = (val) => new Intl.NumberFormat('es-HN', { minimumFractionDigits: 2 }).format(val || 0);

// Watchers and Computed for Carousel
watch(paquetesMantenimiento, (newVal) => {
  if (newVal?.length > 0) {
    displayedPaquetes.value = [...newVal]
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }
}, { immediate: true, deep: true });

watch(displayedPaquetes, (newVal) => {
  if (newVal && newVal.length > 0) {
    nextTick(() => {
      startAutoScroll();
    });
  }
});

const carouselItems = computed(() => {
  if (!displayedPaquetes.value.length) return [];
  return [...displayedPaquetes.value, ...displayedPaquetes.value];
});

// ===== VERIFICACIÓN DE PERFIL =====
const verificarPerfilTecnico = async () => {
  try {
    const userId = auth.user?.id_usuario;
    if (!userId) return; 
    
    const response = await $api(`/usuarios/verificar-perfil-tecnico/${userId}`, {
      method: 'GET'
    }); 

    if (response && response.perfil_completo === false) {
      let message = 'Por favor completa tu perfil para ofrecer servicios';
      
      if (!response.tiene_imagen && !response.tiene_servicios) {
        message = 'Por favor sube una foto de perfil de lo contrario no se te asignarán trabajos';
      } else if (!response.tiene_imagen) {
        message = 'Por favor sube una foto de perfil de lo contrario no se te asignarán trabajos';
      } else if (!response.tiene_servicios) {
        message = 'Por favor selecciona los servicios que ofreces en tu Perfil';
      }

      showToast({
        message: message,
        type: 'warning',
        duration: 8000
      });
    }
  } catch (error) {
    console.error('❌ Error al verificar perfil de técnico:', error);
  }
};

// Observar cambios en el usuario para verificar el perfil
watch(() => auth.user, (newUser) => {
  if (newUser && newUser.role === 'tecnico') {
    verificarPerfilTecnico();
  }
}, { immediate: true });

// ===== FUNCIONES DE CARGA DE DATOS =====
const fetchServices = async (page = 1) => {
  try {
    loading.value = true
    const userCookieValue = useCookie('user').value
    
    // Calcular el offset basado en la página actual
    const offset = (page - 1) * itemsPerPage
    
    const response = await $api(`/solicitudservicio/tecnico/${userCookieValue.id_usuario}?offset=${offset}&limit=${itemsPerPage}`, {
      method: 'GET'
    })
    
    // Manejar la respuesta de la API con paginación
    
    // Primero verificar si la respuesta tiene el array de solicitudes
    if (response.solicitudes && Array.isArray(response.solicitudes)) {
      // Mapear los servicios al formato esperado
      services.value = response.solicitudes.map(servicio => ({
        id: servicio.id_solicitud || servicio.id,
        title: servicio.servicio?.nombre || servicio.titulo || 'Servicio sin nombre',
        location: servicio.colonia || servicio.ubicacion || 'Ubicación no especificada',
        date: servicio.fecha_solicitud || servicio.fecha || new Date().toISOString(),
        status: servicio.estado || 'pendiente',
        description: servicio.descripcion || 'Sin descripción',
        client: servicio.nombre_cliente || servicio.cliente || 'Cliente no especificado',
        phone: servicio.telefono_contacto || servicio.telefono || 'Sin teléfono'
      }))
      
      // Actualizar los totales de la paginación
      totalServices.value = response.total || response.solicitudes.length
      hasMorePages.value = response.hasMore || false
    } 
    // Manejar otros formatos de respuesta para compatibilidad
    else if (Array.isArray(response)) {
      services.value = response
      totalServices.value = response.length
    } else if (response.data && Array.isArray(response.data)) {
      services.value = response.data
      totalServices.value = response.total || response.data.length
      hasMorePages.value = response.hasMore || false
    }
    
    stats.value = {
      ...stats.value,
      activeServices: response.activas,
      completedServices: response.finalizadas
    }
    
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    showError('Error al cargar los servicios. Intente de nuevo más tarde.')
  } finally {
    loading.value = false
  }
}

const fetchAvailability = async () => {
  loadingAvailability.value = true
  try {
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    const response = await $api(`/usuarios/id/${userId}`, {
      method: 'GET'
    })
    
    // Actualizar el estado local basado en el valor de 'estado' del backend
    isAvailable.value = response.estado === 'activo'
    return response.estado === 'activo'
    
  } catch (error) {
    showError('Error al cargar el estado de disponibilidad. Intente de nuevo más tarde.')
    throw error
  } finally {
    loadingAvailability.value = false
  }
}

// ===== FUNCIONES DE DISPONIBILIDAD =====
const updateAvailability = async () => {
  try {
    loadingAvailability.value = true
    
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    // Invertir el estado actual
    const newStatus = isAvailable.value ? 'inactivo' : 'activo'
    
    await $api(`/usuarios/${userId}`, {
      method: 'PUT',
      body: {
        estado: newStatus
      }
    })
    
    // Actualizar el estado local
    isAvailable.value = newStatus === 'activo'
    
    showSuccess(`Estado actualizado a: ${newStatus === 'activo' ? 'Disponible' : 'No disponible'}`)
    
  } catch (error) {
    showError('Error al actualizar la disponibilidad. Intente de nuevo.')
  } finally {
    loadingAvailability.value = false
  }
}

// ===== MANEJADOR DE CAMBIO DE DISPONIBILIDAD =====
const handleAvailabilityChange = async () => {
  try {
    loadingAvailability.value = true
    await updateAvailability()
  } catch (error) {
    // El error ya se maneja en updateAvailability
  } finally {
    loadingAvailability.value = false
  }
}

// Obtener la calificación promedio del técnico
const fetchReviews = async (loadMore = false) => {
  try {
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    // Obtener la calificación promedio directamente del endpoint
    const rating = await $api(`/calificaciones/promedio/${userId}`, {
      method: 'GET'
    })
    
    // Actualizar la calificación promedio en las estadísticas
    stats.value.rating = parseFloat(rating) || 0.0
    
    // Mantener compatibilidad con el array de reseñas para otros usos
    if (!loadMore) {
      reviews.value = []
    }
    
  } catch (error) {
    console.error('Error al cargar las reseñas:', error)
  }
}

// Mostrar la calificación promedio
const averageRating = computed(() => {
  return stats.value.rating?.toFixed(1) || '0.0'
})

// ===== FUNCIONES DE NAVEGACIÓN =====
const viewReports = async () => { 
  try {
    isLoading.value = true 
    await router.push('/tecnico/MetricasTecnico')
  } catch (error) {
    console.error('Error al navegar a las métricas:', error)
    showError('Error al cargar las métricas. Intente de nuevo.')
  } finally {
    isLoading.value = false
  }
}

// ===== PAGINACIÓN =====
const currentPage = ref(1)
const itemsPerPage = 3
const totalServices = ref(0)
const hasMorePages = ref(false)
const totalPages = computed(() => Math.ceil(totalServices.value / itemsPerPage))

const changePage = (page) => {
  // Si intentamos ir a una página inválida, no hacemos nada
  if (page < 1) return
  
  // Si no hay más páginas y estamos intentando ir más allá, no hacemos nada
  if (page > totalPages.value && !hasMorePages.value) return
  
  // Si ya estamos en esta página, no hacemos nada
  if (page === currentPage.value) return
  
  // Actualizamos la página actual primero para reflejar el cambio en la UI
  currentPage.value = page
  
  // Hacer la petición con el número de página actual
  fetchServices(page)
  
  // Desplazamiento suave al principio de la página
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ===== INICIALIZACIÓN =====
const initializeDashboard = async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) { 
      window.location.reload()
      return
    }
    
    // Forzar la carga de la primera página
    currentPage.value = 1
    await Promise.all([
      fetchServices(1),
      fetchAvailability(),
      fetchReviews(),
      cargarPaquetesActivos()
    ])
  } catch (error) { 
    window.location.reload() 
  }
}

onMounted(() => {
  initializeDashboard()
})

onUnmounted(() => {
  stopAutoScroll()
})
</script>

<style scoped>
/* Estilos específicos del componente */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }

.bottom-sheet-enter-active, .bottom-sheet-leave-active { transition: opacity 0.3s ease; }
.bs-content { box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15) !important; will-change: transform; }
.bottom-sheet-enter-active .bs-backdrop { transition: opacity 0.3s ease; }
.bottom-sheet-enter-from .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-to .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-active .bs-backdrop { transition: opacity 0.25s ease; }
.bottom-sheet-leave-from .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-to .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-active .bs-content { animation: slide-up-custom 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
.bottom-sheet-leave-active .bs-content { transition: transform 0.4s ease-in; transform: translateY(0); }
.bottom-sheet-leave-to .bs-content { transform: translateY(100%); }
@keyframes slide-up-custom { from { transform: translateY(100%); } to { transform: translateY(0); } }
.modal-pop-enter-active, .modal-pop-leave-active { transition: opacity 0.3s ease; }
.modal-pop-enter-active .modal-content-pop, .modal-pop-leave-active .modal-content-pop { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-pop-enter-from, .modal-pop-leave-to { opacity: 0; }
.modal-pop-enter-from .modal-content-pop, .modal-pop-leave-to .modal-content-pop { transform: scale(0.9); }
</style>