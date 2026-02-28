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
      <HeadersHeaderServiciosAdmin />

      <!-- Content Container -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Page Header -->
            <section class="px-3 sm:px-6 py-3 sm:py-6">
              <div class="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"></div>
                <div class="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg"></div>
                
                <div class="relative">
                  <div class="flex items-center mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <span class="text-2xl sm:text-4xl">🔧</span>
                      </div>
                      <div>
                        <h1 class="text-lg sm:text-3xl font-black">Gestión de Servicios</h1>
                        <p class="text-white/90 font-medium text-xs sm:text-base">{{ stats.total }} servicios registrados</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="grid grid-cols-3 gap-2 sm:gap-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-sm sm:text-xl font-black">{{ stats.total }}</div>
                      <div class="text-[10px] sm:text-xs text-white/80">Total</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-sm sm:text-xl font-black">{{ stats.pending }}</div>
                      <div class="text-[10px] sm:text-xs text-white/80">Activos</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-sm sm:text-xl font-black">{{ stats.completed }}</div>
                      <div class="text-[10px] sm:text-xs text-white/80">Completados</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECCIÓN: ACCIÓN PENDIENTE -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <!-- Header de Acción Pendiente -->
                <div class="flex flex-col space-y-4 mb-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">!</span>
                      </div>
                      <div>
                        <h2 class="text-base sm:text-xl font-black text-gray-900 dark:text-white">
                          Acción Pendiente
                        </h2>
                        <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {{ totalPendingItems }} servicios requieren atención
                        </p>
                      </div>
                    </div> 
                  </div>
                </div>

                <!-- Loading State para Pendientes -->
                <div v-if="loadingPending" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Cargando servicios pendientes...</p>
                </div>

                <!-- Empty State Acción Pendiente -->
                <div v-else-if="pendingServices.length === 0" class="text-center py-8"> 
                  <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">No hay acciones pendientes</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    Todos los servicios están al día
                  </p>
                </div>

                <!-- Lista de Servicios con Acción Pendiente -->
                <div v-else> 
                  <div v-if="pendingServices.length > 0" class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div 
                      v-for="service in pendingServices" 
                      :key="service.id_solicitud"
                      @click="viewService(service)"
                      class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <!-- Service Header -->
                      <div class="flex items-start justify-between mb-1.5">
                        <div class="flex items-center space-x-1.5">
                          <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs"
                               :class="getServiceTypeColor(service.servicio.nombre)">
                            <span>{{ getServiceTypeIcon(service.servicio.nombre) }}</span>
                          </div>
                          <div class="min-w-0">
                            <p class="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs leading-tight line-clamp-2">{{ service.servicio.nombre }}</p>
                            <p class="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">#{{ formatDateDDMMYY(service.fecha_solicitud) }}-{{ service.id_solicitud }}</p>
                          </div>
                        </div> 
                      </div>
                      
                      <!-- Client Info - Compact -->
                      <div class="mb-1">
                        <div class="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                          <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span class="truncate text-[10px] sm:text-xs">{{ service.cliente.nombre }}</span>
                        </div>
                        <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span class="truncate text-[10px] sm:text-xs">{{ service.colonia }}</span>
                        </div>
                      </div>
                      
                      <!-- Status and Actions -->
                      <div class="flex items-center justify-between pt-0 border-t border-gray-100 dark:border-gray-700">
                        <span class="text-[8px] sm:text-[8px] px-1 py-0.5 rounded-full font-medium"
                              :class="getStatusBadgeColor(service.estado)">
                          {{ getStatusText(service.estado) }}
                        </span>
                        
                        <div class="flex space-x-0.5">
                          <button 
                            v-if="service.estado === 'pendiente_asignacion'"
                            @click.stop="assignTechnician(service)"
                            class="p-0.5 text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 transition-all duration-300 transform hover:scale-110"
                            title="Asignar técnico"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          </button>
                          <button 
                            v-if="service.estado === 'verificando_pagovisita'"
                            @click.stop="confirmPaymentVisit(service)"
                            class="p-0.5 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-all duration-300 transform hover:scale-110"
                            title="Gestionar pago de visita"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button 
                            v-if="service.estado === 'verificando_pagoservicio'"
                            @click.stop="confirmPaymentService(service)"
                            class="p-0.5 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-all duration-300 transform hover:scale-110"
                            title="Gestionar pago de servicio"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          <button 
                            @click.stop="viewService(service)"
                            class="p-0.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                            title="Ver detalles"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Mensaje cuando no hay servicios -->
                  <div v-else class="py-8 text-center text-gray-500 dark:text-gray-400">
                    No hay servicios pendientes
                  </div>

                  <!-- Pagination for Pending Actions -->
                  <div v-if="(hasMorePendingPages || currentPendingPage > 1) && totalPendingItems > 0" class="mt-3 bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        Pág. {{ currentPendingPage }} de {{ Math.max(1, Math.ceil(totalPendingItems / pendingItemsPerPage)) }}
                      </div> 
                      <div class="flex items-center space-x-1 sm:space-x-2">
                        <button
                          @click="changePendingPage(currentPendingPage - 1)"
                          :disabled="currentPendingPage === 1"
                          class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Página anterior"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 px-1 sm:px-2 whitespace-nowrap">
                          {{ currentPendingPage }} / {{ Math.ceil(totalPendingItems / pendingItemsPerPage) }}
                        </div>
                        <button
                          @click="changePendingPage(currentPendingPage + 1)"
                          :disabled="!hasMorePendingPages"
                          class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Página siguiente"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- SECCIÓN: PAQUETES ACTIVOS -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <!-- Header de Paquetes Activos -->
                <div class="flex flex-col space-y-4 mb-4">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-sm">📦</span>
                      </div>
                      <div>
                        <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white whitespace-nowrap">
                          Solicitud de Paquetes
                        </h2>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          {{ (packageStats.en_uso || 0) + (packageStats.pendiente_verificacion || 0) }} solicitudes activas
                        </p>
                      </div>
                    </div>

                    <!-- Buscador por ID -->
                    <div class="relative w-full sm:w-64">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        v-model="packageSearchInput"
                        @input="debouncedPackageSearch"
                        @keyup.enter="handlePackageSearch"
                        placeholder="Buscar por ID de paquete..."
                        class="w-full pl-9 pr-8 py-2 text-[11px] bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                      <button 
                        @click="clearPackageSearch"
                        v-if="packageSearchInput"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                      >
                        <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Loading State -->
                <div v-if="loadingPackages" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Cargando solicitudes...</p>
                </div>

                <!-- Tabs para cambiar entre estados -->
                <div v-else class="mb-4 border-b border-gray-200 dark:border-gray-700">
                  <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="packageTabs" role="tablist">
                    <!-- Pestaña de En Uso -->
                    <li class="mr-2" role="presentation">
                      <button 
                        @click="activePackageTab = 'utilizando'" 
                        :class="{
                          'inline-block p-2 border-b-2 rounded-t-lg transition-colors duration-200': true,
                          'text-green-600 border-green-600 dark:text-green-500 dark:border-green-500': activePackageTab === 'utilizando',
                          'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activePackageTab !== 'utilizando'
                        }" 
                        type="button" 
                        role="tab"
                      >
                        En Uso
                        <span v-if="packageStats.en_uso > 0" 
                              class="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full" 
                              :class="activePackageTab === 'utilizando' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                          {{ packageStats.en_uso }}
                        </span>
                      </button>
                    </li>
                    
                    <!-- Pestaña de Pendiente Revisión -->
                    <li class="mr-2" role="presentation">
                      <button 
                        @click="activePackageTab = 'verificando_pago'" 
                        :class="{
                          'inline-block p-2 border-b-2 rounded-t-lg transition-colors duration-200': true,
                          'text-orange-600 border-orange-600 dark:text-orange-500 dark:border-orange-500': activePackageTab === 'verificando_pago',
                          'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activePackageTab !== 'verificando_pago'
                        }" 
                        type="button" 
                        role="tab"
                      >
                        Pend. Revisión
                        <span v-if="packageStats.pendiente_verificacion > 0" 
                              class="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full" 
                              :class="activePackageTab === 'verificando_pago' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                          {{ packageStats.pendiente_verificacion }}
                        </span>
                      </button>
                    </li>
                    
                    <!-- Pestaña de Historial -->
                    <li class="mr-2" role="presentation">
                      <button 
                        @click="activePackageTab = 'utilizado'" 
                        :class="{
                          'inline-block p-2 border-b-2 rounded-t-lg transition-colors duration-200': true,
                          'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500': activePackageTab === 'utilizado',
                          'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300': activePackageTab !== 'utilizado'
                        }" 
                        type="button" 
                        role="tab"
                      >
                        Historial
                        <span v-if="packageStats.historial > 0" 
                              class="ml-1 px-2 py-0.5 text-[10px] font-bold rounded-full" 
                              :class="activePackageTab === 'utilizado' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'">
                          {{ packageStats.historial }}
                        </span>
                      </button>
                    </li>
                  </ul>
                </div>

                <!-- Contenido de las pestañas -->
                <div>
                  <!-- 1. Pestaña de En Uso (Utilizando) -->
                  <div v-if="activePackageTab === 'utilizando'">
                    <div v-if="activePackages.utilizando?.length === 0" class="text-center py-8">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No hay paquetes activos</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Los paquetes aprobados aparecerán aquí</p>
                    </div>
                    <div v-else>
                      <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                        <div 
                          v-for="pkg in activePackages.utilizando" 
                          :key="'using-' + pkg.id_paquete_usuario"
                          class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <!-- Card Header -->
                          <div class="flex items-start justify-between mb-1.5">
                            <div class="flex items-center space-x-1.5">
                              <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px]"
                                   :class="getServiceTypeColor(pkg.paquete.nombre)">
                                <span>{{ getServiceTypeIcon(pkg.paquete.nombre) }}</span>
                              </div>
                              <div class="min-w-0">
                                <p class="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs leading-tight line-clamp-2">{{ pkg.paquete.nombre }}</p>
                                <p class="text-[8px] text-gray-500 dark:text-gray-400">#{{ formatDateDDMMYY(pkg.fecha_solicitud) }}-{{ pkg.id_paquete_usuario }}</p>
                              </div>
                            </div> 
                          </div>

                          <!-- Client Info -->
                          <div class="mb-1.5">
                            <div class="flex items-center space-x-1.5 text-[10px] text-gray-600 dark:text-gray-300">
                              <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span class="truncate">{{ pkg.Usuario.nombre }}</span>
                            </div>
                            <div class="flex items-center space-x-1.5 text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                              <svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span>{{ pkg.Usuario.telefono }}</span>
                            </div>
                          </div>

                          <!-- Actions -->
                          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
                            <span class="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Activo
                            </span>
                            <button 
                              @click="openPackageAssignment(pkg)"
                              class="p-1 px-1.5 text-[9px] font-bold text-white bg-green-500 hover:bg-green-600 rounded transition-colors"
                            >
                              Liquidar
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Paginación utilizando -->
                      <div v-if="(packagePagination.utilizando.totalPages > 1) && packagePagination.utilizando.total > 0" class="mt-3 bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                        <div class="flex items-center justify-between">
                          <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            Pág. {{ packagePagination.utilizando.page }} de {{ packagePagination.utilizando.totalPages }}
                          </div> 
                          <div class="flex items-center space-x-1 sm:space-x-2">
                            <button
                              @click="changePackagePage('utilizando', packagePagination.utilizando.page - 1)"
                              :disabled="packagePagination.utilizando.page === 1"
                              class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Página anterior"
                            >
                              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 px-1 sm:px-2 whitespace-nowrap">
                              {{ packagePagination.utilizando.page }} / {{ packagePagination.utilizando.totalPages }}
                            </div>
                            <button
                              @click="changePackagePage('utilizando', packagePagination.utilizando.page + 1)"
                              :disabled="packagePagination.utilizando.page >= packagePagination.utilizando.totalPages"
                              class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Página siguiente"
                            >
                              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 2. Pestaña de Pendiente Revisión (Verificando Pago) -->
                  <div v-else-if="activePackageTab === 'verificando_pago'">
                    <div v-if="activePackages.verificando_pago?.length === 0" class="text-center py-8">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No hay pagos pendientes</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Todo está al día</p>
                    </div>
                    <div v-else>
                      <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                        <div 
                          v-for="pkg in activePackages.verificando_pago" 
                          :key="'pending-' + pkg.id_paquete_usuario"
                          class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <!-- Card Header -->
                          <div class="flex items-start justify-between mb-1.5">
                            <div class="flex items-center space-x-1.5">
                              <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px]"
                                   :class="getServiceTypeColor(pkg.paquete.nombre)">
                                <span>{{ getServiceTypeIcon(pkg.paquete.nombre) }}</span>
                              </div>
                              <div class="min-w-0">
                                <p class="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs leading-tight line-clamp-2">{{ pkg.paquete.nombre }}</p>
                                <p class="text-[8px] text-gray-500 dark:text-gray-400">#{{ pkg.id_paquete_usuario }}</p>
                              </div>
                            </div> 
                          </div>

                          <!-- Info & Payment Details -->
                          <div class="mb-1.5">
                            <div class="flex items-center space-x-1.5 text-[10px] text-gray-600 dark:text-gray-300">
                              <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span class="truncate">{{ pkg.Usuario.nombre }}</span>
                            </div>
                            <div v-if="pkg.pagos?.length > 0" class="mt-1 p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-0.5">
                              <p class="text-[8px] font-medium text-gray-600 dark:text-gray-400">Monto: <span class="text-gray-900 dark:text-white">L. {{ parseFloat(pkg.pagos[0].monto).toFixed(2) }}</span></p>
                              <p class="text-[8px] font-medium text-gray-600 dark:text-gray-400">Comp: <span class="text-gray-900 dark:text-white">{{ pkg.pagos[0].num_comprobante }}</span></p>
                            </div>
                          </div>

                          <!-- Actions -->
                          <div class="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
                            <span class="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                              Verificando
                            </span>
                            <div class="flex space-x-1">
                              <button 
                              @click.stop="showPaymentConfirmation(pkg, null)"
                              class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                            >
                              Gestionar
                            </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Paginación verificando_pago -->
                      <div v-if="(packagePagination.verificando_pago.totalPages > 1) && packagePagination.verificando_pago.total > 0" class="mt-3 bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                        <div class="flex items-center justify-between">
                          <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            Pág. {{ packagePagination.verificando_pago.page }} de {{ packagePagination.verificando_pago.totalPages }}
                          </div> 
                          <div class="flex items-center space-x-1 sm:space-x-2">
                            <button
                              @click="changePackagePage('verificando_pago', packagePagination.verificando_pago.page - 1)"
                              :disabled="packagePagination.verificando_pago.page === 1"
                              class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Página anterior"
                            >
                              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 px-1 sm:px-2 whitespace-nowrap">
                              {{ packagePagination.verificando_pago.page }} / {{ packagePagination.verificando_pago.totalPages }}
                            </div>
                            <button
                              @click="changePackagePage('verificando_pago', packagePagination.verificando_pago.page + 1)"
                              :disabled="packagePagination.verificando_pago.page >= packagePagination.verificando_pago.totalPages"
                              class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Página siguiente"
                            >
                              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 3. Pestaña de Historial (Utilizado) -->
                  <div v-else-if="activePackageTab === 'utilizado'">
                    <div v-if="activePackages.utilizado?.length === 0" class="text-center py-8">
                      <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No hay historial</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Los paquetes consumidos aparecerán aquí</p>
                    </div>
                    <div v-else>
                      <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                        <div 
                          v-for="pkg in activePackages.utilizado" 
                          :key="'history-' + pkg.id_paquete_usuario"
                          class="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <!-- Card Header -->
                          <div class="flex items-start justify-between mb-1.5">
                            <div class="flex items-center space-x-1.5">
                              <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[10px] bg-gray-400">
                                <span class="opacity-80">{{ getServiceTypeIcon(pkg.paquete.nombre) }}</span>
                              </div>
                              <div class="min-w-0">
                                <p class="font-bold text-gray-900 dark:text-white text-[10px] sm:text-xs leading-tight line-clamp-2">{{ pkg.paquete.nombre }}</p>
                                <p class="text-[8px] text-gray-500 dark:text-gray-400">#{{ pkg.id_paquete_usuario }}</p>
                              </div>
                            </div> 
                          </div>

                          <!-- Info -->
                          <div class="mb-1.5">
                            <div class="flex items-center space-x-1.5 text-[10px] text-gray-600 dark:text-gray-300">
                              <svg class="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span class="truncate">{{ pkg.Usuario.nombre }}</span>
                            </div>
                            <p class="text-[8px] text-gray-400 mt-1">Uso: {{ formatDate(pkg.fecha_actualizacion) }}</p>
                          </div>

                          <!-- Status -->
                          <div class="pt-1 border-t border-gray-100 dark:border-gray-700">
                            <span v-if="pkg.estado === 'activo'" class="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                              Activo
                            </span>
                            <span v-else class="text-[8px] px-1.5 py-0.5 rounded-full font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                              Completado
                            </span>
                          </div>
                        
                          <!-- Botón Ver Detalles (Solo pago directo) -->
                          <button 
                            v-if="pkg.origen_compra === 'pago_directo'" 
                            @click="showPackagePaymentDetails(pkg)" 
                            class="w-full mt-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] px-2 py-1 rounded font-medium transition-colors"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>

                      <!-- Paginación utilizado -->
                      <div v-if="(packagePagination.utilizado.totalPages > 1) && packagePagination.utilizado.total > 0" class="mt-3 bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                        <div class="flex items-center justify-between">
                          <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            Pág. {{ packagePagination.utilizado.page }} de {{ packagePagination.utilizado.totalPages }}
                          </div> 
                          <div class="flex items-center space-x-1 sm:space-x-2">
                            <button
                              @click="changePackagePage('utilizado', packagePagination.utilizado.page - 1)"
                              :disabled="packagePagination.utilizado.page === 1"
                              class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Página anterior"
                            >
                              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 px-1 sm:px-2 whitespace-nowrap">
                              {{ packagePagination.utilizado.page }} / {{ packagePagination.utilizado.totalPages }}
                            </div>
                            <button
                              @click="changePackagePage('utilizado', packagePagination.utilizado.page + 1)"
                              :disabled="packagePagination.utilizado.page >= packagePagination.utilizado.totalPages"
                              class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Página siguiente"
                            >
                              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            <!-- SECCIÓN: HISTORIAL -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <!-- Header del Historial con Filtros -->
                <div class="flex flex-col space-y-3 sm:space-y-4 mb-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span class="text-white font-bold text-xs sm:text-sm">📋</span>
                      </div>
                      <div class="min-w-0">
                        <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                          Historial de Servicios
                        </h2>
                        <p class="text-[10px] sm:text-sm text-gray-600 dark:text-gray-400">
                          {{ totalHistoryItems }} servicios en total
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Filtros del Historial -->
                  <div class="flex flex-col">
                    <!-- Fila de Búsqueda y Fecha -->
                    <div class="flex flex-row gap-2 w-full">
                      <!-- Búsqueda -->
                      <div class="relative w-1/2">
                        <input
                          v-model="searchQuery"
                          type="text"
                          placeholder="Cliente o ID Servicio..."
                          class="w-full px-3 py-2.5 placeholder:text-[12px] text-[9px] sm:text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white pl-9 pr-9 h-10"
                        >
                        <!-- Icono de búsqueda -->
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                        </div>
                        <!-- Spinner de carga -->
                        <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      </div>

                      <!-- Filtro de Mes -->
                      <div class="relative w-1/2">
                        <input
                          v-model="selectedMonth"
                          type="month"
                          class="w-full px-2 py-2 text-[7px] bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white h-10"
                        >
                      </div>
                    </div>

                    <!-- Fila de Filtros -->
                    <div class="grid grid-cols-2 gap-2">
                      <!-- Status Filter -->
                      <multiselect
                        v-model="selectedStatusObject"
                        :options="statusOptions"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Todos los estados"
                        label="label"
                        track-by="value"
                        class="multiselect-admin-filter"
                        :custom-label="getStatusLabel"
                        :options-limit="100"
                      >
                        <template #singleLabel="{ option }">
                          <span class="text-[9px] sm:text-xs truncate">{{ getStatusLabel(option) }}</span>
                        </template>
                      </multiselect>
                      
                      <!-- Service Type Filter -->
                      <multiselect
                        v-model="selectedServiceTypeObject"
                        :options="catalogoServicios"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Todos los tipos"
                        label="nombre"
                        track-by="id_servicio"
                        class="multiselect-admin-filter"
                        :custom-label="getServiceTypeLabel"
                        :options-limit="100"
                        :disabled="catalogoServicios.length === 0"
                      >
                        <template #singleLabel="{ option }">
                          <span class="text-[9px] sm:text-xs truncate">{{ getServiceTypeLabel(option) }}</span>
                        </template>
                      </multiselect>
                    </div>
                    
                    <!-- Clear Filters -->
                    <div v-if="hasActiveFilters" class="mt-0">
                      <button 
                        @click="clearFilters"
                        class="text-blue-600 dark:text-blue-400 text-[9px] sm:text-xs font-medium hover:underline flex items-center"
                      >
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Loading State para Historial -->
                <div v-if="loadingHistory" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Cargando servicios...</p>
                </div>

                <!-- Empty State Historial -->
                <div v-else-if="historyServices.length === 0" class="text-center py-8"> 
                  <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-2">No se encontraron servicios</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
                    {{ searchQuery ? 'Intenta ajustar tus filtros de búsqueda' : 'No hay servicios en el historial' }}
                  </p>
                  <button 
                    v-if="hasActiveFilters"
                    @click="clearFilters"
                    class="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors text-[9px] sm:text-xs"
                  >
                    Limpiar filtros
                  </button>
                </div>

                <!-- Lista de Servicios del Historial -->
                <div v-else> 
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div 
                      v-for="service in historyServices" 
                      :key="service.id_solicitud"
                      @click="viewService(service)"
                      class="group bg-white dark:bg-gray-800 rounded-xl p-2.5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
                    >
                      <!-- Service Header -->
                      <div class="flex items-start justify-between mb-1.5">
                        <div class="flex items-center space-x-1.5">
                          <div class="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs"
                               :class="getServiceTypeColor(service.servicio.nombre)">
                            <span>{{ getServiceTypeIcon(service.servicio.nombre) }}</span>
                          </div>
                          <div class="min-w-0">
                            <p class="text-[10px] font-bold text-gray-900 dark:text-white sm:text-xs leading-tight line-clamp-2">{{ service.servicio.nombre }}</p>
                            <p class="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">#{{ formatDateDDMMYY(service.fecha_solicitud) }}-{{ service.id_solicitud }}</p>
                          </div>
                        </div> 
                      </div>
                      
                      <!-- Client Info - Compact -->
                      <div class="mb-1">
                        <div class="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                          <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span class="truncate text-[10px] sm:text-xs">{{ service.cliente.nombre }}</span>
                        </div>
                        <div class="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span class="truncate text-[10px] sm:text-xs">{{ service.colonia }}</span>
                        </div>
                      </div>
                      
                      <!-- Status and Actions -->
                      <div class="flex items-center justify-between pt-0.5 border-t border-gray-100 dark:border-gray-700">
                        <span class="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                              :class="getStatusBadgeColor(service.estado)">
                          {{ getStatusText(service.estado) }}
                        </span>
                        
                        <div class="flex space-x-0.5">
                          <button 
                            @click.stop="viewService(service)"
                            class="p-0.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-110"
                            title="Ver detalles"
                          >
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Mensaje cuando no hay servicios en el historial -->
                  <div v-if="historyServices.length === 0" class="py-8 text-center text-gray-500 dark:text-gray-400">
                    No se encontraron servicios en el historial
                  </div>
                  
                  <!-- Pagination for History -->
                  <div v-if="(hasMoreHistoryPages || currentHistoryPage > 1) && totalHistoryItems > 0" class="mt-3 bg-white dark:bg-gray-800 p-1.5 sm:p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        Pág. {{ currentHistoryPage }} de {{ Math.max(1, Math.ceil(totalHistoryItems / historyItemsPerPage)) }}
                      </div> 
                      <div class="flex items-center space-x-1 sm:space-x-2">
                        <button
                          @click="changeHistoryPage(currentHistoryPage - 1)"
                          :disabled="currentHistoryPage === 1"
                          class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Página anterior"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div class="text-[9px] sm:text-xs md:text-xs text-gray-500 dark:text-gray-400 px-1 sm:px-2 whitespace-nowrap">
                          {{ currentHistoryPage }} / {{ Math.ceil(totalHistoryItems / historyItemsPerPage) }}
                        </div>
                        <button
                          @click="changeHistoryPage(currentHistoryPage + 1)"
                          :disabled="!hasMoreHistoryPages"
                          class="p-1 sm:p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Página siguiente"
                        >
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <FootersFooterAdmin />
    </div>

    <!-- Service Detail Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDetailModal = false"></div>
        
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
              <button @click="showDetailModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
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
                <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">{{ selectedService?.cliente?.telefono }}</p>
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
                <button 
                  @click="openAmountDetails('service', selectedService)"
                  class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Ver detalles
                </button>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ selectedService.cotizacion.total }}</p>
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

    <!-- Assignment Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showAssignmentModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showAssignmentModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[320px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="flex items-center justify-between p-2 sm:p-3 pb-0 border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center space-x-3">
              <div class="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-sm">
                👷
              </div>
              <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Asignar Técnico</h3>
            </div>
            <button 
              @click="showAssignmentModal = false" 
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              aria-label="Cerrar modal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
            
           <!-- Filtro por ciudad -->
            <!--<div class="px-2">
              <multiselect 
                id="cityFilter"
                v-model="selectedTechCityObject"
                :options="availableCities"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Buscar por ciudad"
                class="multiselect-admin-filter"
                :custom-label="getTechCityLabel"
                :options-limit="100"
                :disabled="availableCities.length === 0"
                :loading="cities.length === 0"
                @open="onMultiselectOpen" 
                :tabindex="0"
              >
                <template #singleLabel="{ option }">
                  <span class="text-xs truncate">{{ getTechCityLabel(option) }}</span>
                </template>
              </multiselect>
            </div> -->

          <!-- Technicians List -->
          <div class="p-3">
            <div class="space-y-2">
              <div 
                v-for="tech in paginatedTechnicians" 
                :key="tech.id_usuario"
                @click="tech.estado === 'activo' ? selectTechnician(tech) : null"
                :class="[
                  'group p-2.5 rounded-lg border transition-colors',
                  tech.estado === 'activo' 
                    ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer'
                    : 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-70'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2">
                      <p class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{{ tech.nombre }}</p>
                      <span v-if="tech.tipo_usuario && tech.tipo_usuario !== 'Tecnico'" 
                            class="text-[8px] px-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-bold uppercase">
                        {{ tech.tipo_usuario }}
                      </span>
                    </div>
                    <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{{ tech.ciudad?.nombre_ciudad }}</p>
                  </div>
                  <div class="flex items-center space-x-2 ml-2">
                    <span 
                      v-if="tech.estado === 'activo'"
                      class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      Disponible
                    </span>
                    <span 
                      v-else
                      class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    >
                      Inactivo
                    </span>
                    <span class="text-[10px] sm:text-xs text-gray-500 flex items-center whitespace-nowrap">
                      <svg class="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {{ tech.promedio_calificacion?.toFixed(1) || '0.0' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div v-if="filteredTechnicians.length === 0" class="text-center py-6">
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No hay técnicos disponibles</p>
                <p class="text-[10px] sm:text-xs text-gray-400 mt-1">Intenta con otro filtro</p>
              </div>
              
              <!-- Paginación -->
              <div v-if="filteredTechnicians.length > 0" class="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                <button 
                  @click="changeTechPage(currentTechPage - 1)" 
                  :disabled="currentTechPage === 1"
                  class="px-3 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Página {{ currentTechPage }} de {{ totalTechPages }}
                </span>
                <button 
                  @click="changeTechPage(currentTechPage + 1)" 
                  :disabled="currentTechPage >= totalTechPages"
                  class="px-3 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Package Assignment Confirmation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showPackageConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPackageConfirmModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Confirmar Liquidación
              </h3>
              <button 
                @click="showPackageConfirmModal = false"
                class="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 p-1 -mr-1"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-5">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/50 mb-3 sm:mb-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                ¿Liquidar técnico?
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                Estás a punto de liquidar a <span class="font-semibold text-gray-900 dark:text-white">{{ selectedPackageTechnician?.nombre }}</span> 
                <span class="block mt-2">
                  <span class="text-base">Monto a liquidar: </span>
                  <span class="font-bold text-green-600 dark:text-green-400 text-lg">L. {{ (parseFloat(selectedPackage?.paquete?.costo || 0) * (100 - parseFloat(comisionPorcentaje) || 0) / 100).toFixed(2) }}</span>
                </span>
                <span class="block mt-3 text-sm">¿Deseas continuar con la liquidación?</span>
              </p>
            </div>

            <div class="mt-4 sm:mt-5 flex flex-row gap-2 sm:gap-3">
              <button
                type="button"
                @click="showPackageConfirmModal = false"
                class="inline-flex justify-center w-1/2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                @click="confirmPackageAssignment"
                class="inline-flex justify-center w-1/2 rounded-lg border border-transparent px-3 sm:px-4 py-2 bg-green-600 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Sí, liquidar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Technician Assignment Confirmation Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showConfirmModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Confirmar Asignación
              </h3>
              <button 
                @click="showConfirmModal = false"
                class="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 p-1 -mr-1"
              >
                <span class="sr-only">Cerrar</span>
                <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-5">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-3 sm:mb-4">
                <svg class="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                ¿Asignar técnico?
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                Estás a punto de asignar a <span class="font-semibold text-gray-900 dark:text-white">{{ selectedTechnician?.name }}</span> al servicio. 
                ¿Deseas continuar?
              </p>
            </div>

            <div class="mt-4 sm:mt-5 flex flex-row gap-2 sm:gap-3">
              <button
                type="button"
                @click="showConfirmModal = false"
                class="inline-flex justify-center w-1/2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                @click="confirmTechnicianAssignment"
                class="inline-flex justify-center w-1/2 rounded-lg border border-transparent px-3 sm:px-4 py-2 bg-blue-600 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sí, asignar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Payment Confirmation Modal with Transitions -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to">
  <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3">
    <!-- Backdrop with animation -->
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
        @click="showPaymentModal = false"
      ></div>
    </Transition>

    <!-- Modal content with animation -->
    <Transition
      name="modal-content"
      enter-active-class="modal-content-enter-active"
      leave-active-class="modal-content-leave-active"
      enter-from-class="modal-content-enter-from"
      leave-to-class="modal-content-leave-to">
      <div 
        v-if="showPaymentModal"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[320px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 text-[10px] sm:text-sm mx-auto"
        @click.stop
      >
        <!-- Modal header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-7 h-7 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center text-sm">
                💰
              </div>
              <div>
                <h3 class="text-xs sm:text-base font-black text-gray-900 dark:text-white">
                  {{ paymentType === 'visit' ? 'Pago de Visita' : 'Pago de Servicio' }}
                </h3>
                <p class="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                  #{{ formatDateDDMMYY(serviceToPayment?.fecha_solicitud) }}-{{ serviceToPayment?.id_solicitud }}
                </p>
              </div>
            </div>
            <button @click="showPaymentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Main content -->
        <div class="p-3">
          <!-- Service summary -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-3">
            <h4 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-2">
              {{ paymentType === 'visit' ? 'Visita' : 'Servicio' }} a confirmar
            </h4>
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-sm">
                {{ getServiceTypeIcon(serviceToPayment?.servicio?.nombre) }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">{{ serviceToPayment?.servicio?.nombre }}</p>
                <p class="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">{{ formatDate(serviceToPayment?.fecha_solicitud) }}</p>
              </div>
            </div>
          </div>

          <!-- Información del Pago del Cliente - Simplificada -->
          <div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
            <h4 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-3 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              Información del Pago del Cliente
            </h4>
            
            <div class="space-y-3 text-xs sm:text-sm">
              <!-- Monto con icono informativo -->
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p class="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">Monto</p>
                  <p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                    {{ paymentType === 'visit' 
                        ? (serviceToPayment?.pagoVisita?.monto ? `${serviceToPayment.pagoVisita.monto}` : 'L. 150.00')
                        : (serviceToPayment?.cotizacion?.total ? `${serviceToPayment.cotizacion.total}` : 'No especificado') 
                    }}
                  </p>
                </div>
                <button 
                  @click="showAmountDetailsModal = true"
                  class="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                  title="Ver detalles del monto"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>

              <!-- Banco con icono informativo -->
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p class="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">Banco</p>
                  <p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                    {{ paymentType === 'visit' 
                        ? (serviceToPayment?.pagoVisita?.cuenta?.banco || 'No especificado')
                        : (serviceToPayment?.cotizacion?.cuenta?.banco || 'No especificado')
                    }}
                  </p>
                </div>
                <button 
                  @click="showBankDetailsModal = true"
                  class="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                  title="Ver detalles del banco"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Acción de redirección -->
          <div class="pt-2">
            <button 
              @click="navigateToFinance"
              class="w-full flex items-center justify-center px-4 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-sm font-black rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-wider"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Gestionar en Finanzas
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</Transition>

<!-- Modal de Confirmación de Pago -->
<Transition
  name="modal"
  enter-active-class="modal-enter-active"
  leave-active-class="modal-leave-active"
  enter-from-class="modal-enter-from"
  leave-to-class="modal-leave-to">
  <div v-if="showPaymentConfirmationModal" class="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-3">
    <!-- Backdrop with animation -->
    <Transition
      name="backdrop"
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div 
        v-if="showPaymentConfirmationModal"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="cancelPaymentAction"
      ></div>
    </Transition>
    
    <!-- Modal content with animation -->
    <Transition
      name="modal-content"
      enter-active-class="modal-content-enter-active"
      leave-active-class="modal-content-leave-active"
      enter-from-class="modal-content-enter-from"
      leave-to-class="modal-content-leave-to">
      <div 
        v-if="showPaymentConfirmationModal"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[320px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 text-[10px] sm:text-sm mx-auto"
        @click.stop
      >
        <!-- Modal header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-7 h-7 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center text-sm">
                💰
              </div>
              <div>
                <h3 class="text-xs sm:text-base font-black text-gray-900 dark:text-white">
                  Confirmación de Pago
                </h3>
                <p class="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">
                  Paquete #{{ selectedPackage?.id_paquete_usuario }}
                </p>
              </div>
            </div>
            <button @click="cancelPaymentAction" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Main content -->
        <div class="p-3">
          <!-- Package Summary -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-3">
            <h4 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-2">
              Paquete Solicitado
            </h4>
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-lg flex items-center justify-center text-sm text-white" :class="getServiceTypeColor(selectedPackage?.paquete?.nombre)">
                {{ getServiceTypeIcon(selectedPackage?.paquete?.nombre) }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">{{ selectedPackage?.paquete?.nombre }}</p>
                <p class="text-[9px] sm:text-xs text-gray-600 dark:text-gray-400">{{ selectedPackage?.Usuario?.nombre }}</p>
              </div>
            </div>
          </div>

          <!-- Información del Pago -->
          <div class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
            <h4 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm mb-3 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
              </svg>
              Información del Pago
            </h4>
            
            <div class="space-y-3 text-xs sm:text-sm">
              <!-- Monto -->
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p class="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">Monto</p>
                  <p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                    L. {{ selectedPackage?.pagos?.[0]?.monto ? parseFloat(selectedPackage.pagos[0].monto).toFixed(2) : '0.00' }}
                  </p>
                </div>
              </div> 

              <!-- Banco -->
              <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                   <p class="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium">Banco</p>
                   <p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                     {{ selectedPackage?.pagos?.[0]?.cuenta?.banco || 'No especificado' }}
                   </p>
                </div>
                <!-- Mini detalle bancario desplegable o info extra si se requiere, similar al diseño original -->
                <button 
                  v-if="selectedPackage?.pagos?.[0]?.cuenta"
                  @click="showBankDetailsModal = true"
                  class="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                  title="Ver detalles del banco"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Botones de Acción (Accept/Reject) -->
          <div class="flex gap-2 mt-2">
            <button 
              @click="pendingPaymentAction = 'reject'; confirmPaymentAction()"
              :disabled="isVerifying"
              class="flex-1 flex items-center justify-center px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-800 text-[10px] sm:text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!isVerifying" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              Rechazar
            </button>
            
            <button 
              @click="pendingPaymentAction = 'approve'; confirmPaymentAction()"
              :disabled="isVerifying"
              class="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-[10px] sm:text-sm font-black rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-wider disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg v-if="isVerifying" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</Transition>

    <!-- Modal de Detalles del Monto -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showAmountDetailsModal" class="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-3">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showAmountDetailsModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[300px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Detalles del Monto</h3>
              <button @click="showAmountDetailsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-3">
            <div v-if="paymentType === 'visit'" class="space-y-2">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 class="font-medium text-blue-800 dark:text-blue-200 text-xs sm:text-sm mb-2">Pago de Visita</h4>
                <div class="text-xs sm:text-sm space-y-1">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Monto:</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      {{ serviceToPayment?.pagoVisita?.monto ? `${serviceToPayment.pagoVisita.monto}` : 'L. 150.00' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="paymentType === 'service' && serviceToPayment?.cotizacion" class="space-y-3">
              <div class="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <h4 class="font-medium text-green-800 dark:text-green-200 text-xs sm:text-sm mb-2">Detalles de la Cotización</h4>
                <div class="text-xs sm:text-sm space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Mano de obra:</span>
                    <span class="font-medium text-gray-900 dark:text-white">L. {{ serviceToPayment.cotizacion.monto_manodeobra || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Descuento membresía:</span>
                    <span class="font-medium text-green-600 dark:text-green-400">-L. {{ serviceToPayment.cotizacion.descuento_membresia || 0 }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-gray-400">Crédito usado:</span>
                    <span class="font-medium text-green-600 dark:text-green-400">-L. {{ serviceToPayment.cotizacion.credito_usado || 0 }}</span>
                  </div>
                  <hr class="border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between font-bold">
                    <span class="text-gray-900 dark:text-white">Total a pagar:</span>
                    <span class="text-gray-900 dark:text-white">L. {{ serviceToPayment.cotizacion.total || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Detalles del Banco -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showBankDetailsModal" class="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-3">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showBankDetailsModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[300px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Detalles del Banco</h3>
              <button @click="showBankDetailsModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-3">
            <div class="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <h4 class="font-medium text-purple-800 dark:text-purple-200 text-xs sm:text-sm mb-2">Información Bancaria</h4>
              <div class="text-xs sm:text-sm space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Banco:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ 
                      selectedPackage 
                        ? (selectedPackage.pagos?.[0]?.cuenta?.banco || 'No especificado') 
                        : (paymentType === 'visit' 
                            ? (serviceToPayment?.pagoVisita?.cuenta?.banco || 'No especificado')
                            : (serviceToPayment?.cotizacion?.cuenta?.banco || 'No especificado'))
                    }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">N° Cuenta:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ 
                      selectedPackage 
                        ? (selectedPackage.pagos?.[0]?.cuenta?.numero || selectedPackage.pagos?.[0]?.cuenta?.num_cuenta || 'No especificado') 
                        : (paymentType === 'visit' 
                            ? (serviceToPayment?.pagoVisita?.cuenta?.num_cuenta || 'No especificado')
                            : (serviceToPayment?.cotizacion?.cuenta?.num_cuenta || 'No especificado'))
                    }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Tipo de cuenta:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ 
                      selectedPackage 
                        ? (selectedPackage.pagos?.[0]?.cuenta?.tipo || 'No especificado') 
                        : (paymentType === 'visit' 
                            ? (serviceToPayment?.pagoVisita?.cuenta?.tipo || 'No especificado')
                            : (serviceToPayment?.cotizacion?.cuenta?.tipo || 'No especificado'))
                    }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">N° Comprobante:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ 
                      selectedPackage 
                        ? (selectedPackage.pagos?.[0]?.num_comprobante || 'No especificado') 
                        : (paymentType === 'visit' 
                            ? (serviceToPayment?.pagoVisita?.num_comprobante || 'No especificado')
                            : (serviceToPayment?.cotizacion?.num_comprobante || 'No especificado'))
                    }}
                  </span>
                </div>
                <!-- Fecha de pago: Aplica para paquetes y visitas -->
                <div v-if="selectedPackage || paymentType === 'visit'" class="flex justify-between">
                  <span class="text-gray-600 dark:text-gray-400">Fecha de pago:</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ 
                      selectedPackage 
                        ? (selectedPackage.pagos?.[0]?.fecha ? new Date(selectedPackage.pagos[0].fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No especificada') 
                        : (serviceToPayment?.pagoVisita?.fecha ? new Date(serviceToPayment.pagoVisita.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : 'No especificada') 
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    
  </div>

  <!-- Modal de Liquidación (Personal para Liquidar Paquete) -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to">
    <div v-if="showLiquidacionModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showLiquidacionModal = false"></div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[90%] sm:w-[92%] max-w-[320px] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
        <!-- Header -->
        <div class="flex items-center justify-between p-2 sm:p-3 pb-0 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="w-7 h-7 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-sm">
              👷
            </div>
            <h3 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">Asignar Técnico</h3>
          </div>
          <button 
            @click="showLiquidacionModal = false" 
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
            aria-label="Cerrar modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
          
         <!-- Filtro por ciudad -->
          <!--<div class="px-2">
            <multiselect 
              id="cityFilter"
              v-model="selectedTechCityObject"
              :options="availableCities"
              :searchable="false"
              :close-on-select="true"
              :show-labels="false"
              placeholder="Buscar por ciudad"
              class="multiselect-admin-filter"
              :custom-label="getTechCityLabel"
              :options-limit="100"
              :disabled="availableCities.length === 0"
              :loading="cities.length === 0"
              @open="onMultiselectOpen" 
              :tabindex="0"
            >
              <template #singleLabel="{ option }">
                <span class="text-xs truncate">{{ getTechCityLabel(option) }}</span>
              </template>
            </multiselect>
          </div> -->

        <!-- Technicians List -->
        <div class="p-3">
          <div class="space-y-2">
            <div 
              v-for="tech in paginatedTechnicians" 
              :key="tech.id_usuario"
              @click="tech.estado === 'activo' ? selectPackageTechnician(tech) : null"
              :class="[
                'group p-2.5 rounded-lg border transition-colors',
                tech.estado === 'activo' 
                  ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer'
                  : 'bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-70'
              ]"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2">
                    <p class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{{ tech.nombre }}</p>
                    <span v-if="tech.tipo_usuario && tech.tipo_usuario !== 'Tecnico'" 
                          class="text-[8px] px-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-bold uppercase">
                      {{ tech.tipo_usuario }}
                    </span>
                  </div>
                  <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{{ tech.ciudad?.nombre_ciudad }}</p>
                </div>
                <div class="flex items-center space-x-2 ml-2">
                  <span 
                    v-if="tech.estado === 'activo'"
                    class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    Disponible
                  </span>
                  <span 
                    v-else
                    class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    Inactivo
                  </span>
                  <span class="text-[10px] sm:text-xs text-gray-500 flex items-center whitespace-nowrap">
                    <svg class="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{ tech.promedio_calificacion?.toFixed(1) || '0.0' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="filteredTechnicians.length === 0" class="text-center py-6">
              <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No hay técnicos disponibles</p>
              <p class="text-[10px] sm:text-xs text-gray-400 mt-1">Intenta con otro filtro</p>
            </div>
            
            <!-- Paginación -->
            <div v-if="filteredTechnicians.length > 0" class="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
              <button 
                @click="changeTechPage(currentTechPage - 1)" 
                :disabled="currentTechPage === 1"
                class="px-3 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                Página {{ currentTechPage }} de {{ totalTechPages }}
              </span>
              <button 
                @click="changeTechPage(currentTechPage + 1)" 
                :disabled="currentTechPage >= totalTechPages"
                class="px-3 py-1 text-xs sm:text-sm rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Detalles del Pago de Paquete -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div
      v-if="showPackagePaymentDetailsModal && selectedPackagePayment"
      class="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closePackagePaymentDetailsModal"></div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10 text-[12px] sm:text-xs md:text-base"
      >
        <!-- Header -->
        <div
          class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="font-black text-gray-900 dark:text-white">Detalles del Pago</h3>
                <div class="flex items-center space-x-2">
                  <p class="text-gray-600 dark:text-gray-400">ID: #{{ selectedPackagePayment.id_pago_paquete || 'N/A' }}</p>
                  <span class="text-gray-400">•</span>
                 <p class="text-gray-600 dark:text-gray-400">{{ formatDate(selectedPackagePayment.fecha) || 'N/A' }}</p>
                </div>
              </div>
            </div>
            <button
              @click="closePackagePaymentDetailsModal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-3 sm:p-4 space-y-4">
          <!-- Información del Pago -->
          <div>
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información del Paquete</h4>
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-500 dark:text-gray-400 mb-1">Paquete</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ selectedPackagePayment.paquete?.nombre || 'Paquete' }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-500 dark:text-gray-400 mb-1">Monto</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(selectedPackagePayment.monto || 0) }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-500 dark:text-gray-400 mb-1">Comprobante</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ selectedPackagePayment.num_comprobante || 'No especificado' }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-500 dark:text-gray-400 mb-1">Usuario</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ selectedPackagePayment.usuario?.nombre || 'N/A' }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-500 dark:text-gray-400 mb-1">Teléfono</p>
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ selectedPackagePayment.usuario?.telefono || 'N/A' }}
                </p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                <span
                  :class="getStatusBadgeClass(selectedPackagePayment.estado)"
                  class="inline-flex items-center px-2 py-0.5 rounded-full font-medium"
                >
                  {{ selectedPackagePayment.estado || 'Pendiente' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Información Bancaria -->
          <div v-if="selectedPackagePayment.cuenta">
            <h4 class="font-bold text-gray-900 dark:text-white mb-2">Información Bancaria</h4>
            <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Banco:</span>
                <span class="font-medium text-gray-900 dark:text-white text-right">
                  {{ selectedPackagePayment.cuenta.banco || 'No especificado' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Número de Cuenta:</span>
                <span class="font-medium text-gray-900 dark:text-white text-right">
                  {{ selectedPackagePayment.cuenta.numero || selectedPackagePayment.cuenta.num_cuenta || 'N/A' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Beneficiario:</span>
                <span class="font-medium text-gray-900 dark:text-white text-right">
                  {{ selectedPackagePayment.cuenta.beneficiario || 'N/A' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500 dark:text-gray-400">Tipo de Cuenta:</span>
                <span class="font-medium text-gray-900 dark:text-white text-right">
                  {{ selectedPackagePayment.cuenta.tipo || 'N/A' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="sticky bottom-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap justify-end gap-2 sm:gap-3 rounded-b-xl sm:rounded-b-2xl"
        >
          <button
            v-if="selectedPackagePayment.estado === 'aprobado' || selectedPackagePayment.estado === 'completado'"
            @click="openFacturaModal(selectedPackagePayment)"
            class="px-3 py-2 font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Mostrar Recibo
          </button>
          <button
            @click="closePackagePaymentDetailsModal"
            class="px-3 py-2 font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Modal de Recibo -->
  <Transition
    name="modal"
    enter-active-class="modal-enter-active"
    leave-active-class="modal-leave-active"
    enter-from-class="modal-enter-from"
    leave-to-class="modal-leave-to"
  >
    <div
      v-if="showFacturaModal && selectedFacturaPayment"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeFacturaModal"></div>

      <div class="bg-white relative z-10 w-full max-w-2xl shadow-xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Receipt Content (Scrollable) -->
        <div class="overflow-y-auto p-6 flex-1">
          <!-- Top Header -->
          <div class="flex justify-between items-center border-b-2 border-gray-300 pb-2 mb-2">
              <div>
                  <h2 class="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">RECIBO POR HONORARIOS</h2>
                  <p class="text-sm font-mono font-bold text-gray-900">N° {{ empresaCorrelativo }}</p>
                  <p class="text-[10px] text-gray-500 mt-1">Fecha: {{ formatDate(selectedFacturaPayment.fecha) }}</p>
              </div>
              <div class="text-right">
                 <h1 class="text-lg font-bold text-gray-900 tracking-tight">{{ empresaNombre || 'MiSeguro' }}</h1>
                 <div class="text-[10px] text-gray-500 mt-2 space-y-0.5">
                    <p class="font-medium">RTN: {{ empresaRTN }}</p>
                    <p>{{ empresaEmail }}</p>
                    <p>{{ empresaTelefono }}</p>
                 </div>
              </div>
          </div>

          <!-- Main Body -->
          <div class="bg-gray-50 rounded-lg border border-gray-300 p-4 sm:p-4 mb-2">
              <div class="mb-6">
                  <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">RECIBÍ DE</span>
                  <p class="text-base sm:text-lg font-medium text-gray-900 break-words">
                      {{ selectedFacturaPayment.cliente?.nombre || selectedFacturaPayment.usuario?.nombre || 'Cliente General' }}
                  </p>
              </div>
              
              <div class="mb-6">
                   <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">LA SUMA DE</span>
                   <p class="text-lg sm:text-xl font-bold text-gray-900">{{ formatCurrency(selectedFacturaPayment.total || 0) }}</p>
              </div>

              <div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">POR CONCEPTO DE</span>
                  <p class="text-xs leading-relaxed text-gray-700">
                    <span v-if="selectedFacturaPayment.paquete">
                      Servicio de acceso, intermediación tecnológica, coordinación y gestión de solicitudes de adquisición de productos, servicios y/o beneficios ofrecidos por terceros a través de la plataforma MiSeguro, correspondiente al paquete
                      <strong>{{ selectedFacturaPayment.paquete.nombre }}</strong>.
                    </span>
                    <span v-else>
                      Pago de Servicio Profesional
                    </span>
                  </p>
              </div>
          </div>
          
          <!-- Details & Fiscal Data (Stacked Rows) -->
          <div class="flex flex-col gap-8 text-[11px] mb-8">
               <div>
                  <h4 class="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">DETALLES</h4>
                   <div class="space-y-2 text-gray-600">
                      <p class="flex justify-between"><span class="font-medium text-gray-500">Subtotal</span> <span>{{ formatCurrency(selectedFacturaPayment.subtotal || 0) }}</span></p>
                      <div class="flex justify-between pt-1 mt-1 border-t border-gray-300">
                          <span class="font-bold text-gray-900 text-xs">TOTAL</span> 
                          <span class="font-bold text-gray-900 text-xs">{{ formatCurrency(selectedFacturaPayment.total || 0) }}</span>
                      </div>
                  </div>
               </div>
               <div>
                  <h4 class="font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">DATOS FISCALES</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
                      <p class="flex justify-between sm:justify-start sm:gap-2"><span class="font-medium text-gray-500">CAI:</span> <span class="text-right sm:text-left">{{ empresaCAI }}</span></p>
                      <p class="flex justify-between sm:justify-start sm:gap-2"><span class="font-medium text-gray-500">Rango:</span> <span class="text-right sm:text-left">{{ empresaRangoAutorizado }}</span></p>
                      <p class="flex justify-between sm:justify-start sm:gap-2 sm:col-span-2"><span class="font-medium text-gray-500">Límite:</span> <span class="text-right sm:text-left">{{ empresaFechaLimite }}</span></p>
                  </div>
               </div>
          </div>

          <!-- Footer Info -->
          <div class="text-[10px] text-gray-400 text-center pt-1 border-t border-gray-300">
             <p>Este documento es un comprobante de pago por honorarios profesionales.</p>
             <p v-if="selectedFacturaPayment.num_comprobante" class="mt-1">Ref. Pago: {{ selectedFacturaPayment.num_comprobante }}</p>
          </div>
        </div>

        <!-- Action Footer -->
        <div class="bg-gray-50 p-4 border-t border-gray-300 flex justify-end">
          <button 
            @click="closeFacturaModal"
            class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
          >
            Cerrar Recibo
          </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style>
  @keyframes heartbeat {
    0% { transform: scale(1); }
    25% { transform: scale(1.05); }
    50% { transform: scale(1); }
    75% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .animate-heartbeat {
    animation: heartbeat 2s infinite;
  }

  @keyframes bounce-soft {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  .animate-bounce-soft {
    animation: bounce-soft 1.5s ease-in-out infinite;
  }

  /* Estilos para vue-multiselect en filtros de admin */
  .multiselect-admin-filter {
    position: relative;
    z-index: 10;
  }

  .multiselect-admin-filter .multiselect__tags {
    min-height: 36px;
    padding: 4px 40px 4px 12px;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    background-color: #f9fafb;
    font-size: 12px;
    transition: all 0.2s ease;
    color: #111827;
  }

  .dark .multiselect-admin-filter .multiselect__tags {
    background-color: #374151;
    border-color: #4b5563;
    color: #f9fafb;
  }

  .multiselect-admin-filter .multiselect__tags:hover {
    border-color: #3b82f6;
  }

  .dark .multiselect-admin-filter .multiselect__tags:hover {
    border-color: #60a5fa;
  }

  .multiselect-admin-filter.multiselect--active .multiselect__tags {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  .dark .multiselect-admin-filter.multiselect--active .multiselect__tags {
    border-color: #60a5fa;
    box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
  }

  .multiselect-admin-filter .multiselect__placeholder {
    margin-bottom: 0;
    padding: 0;
    color: #6b7280;
    font-size: 10px;
  }

  .dark .multiselect-admin-filter .multiselect__placeholder {
    color: #9ca3af;
  }

  .multiselect-admin-filter .multiselect__single {
    margin-bottom: 0;
    padding: 0;
    color: #111827;
    font-size: 10px;
    font-weight: 500;
  }

  .dark .multiselect-admin-filter .multiselect__single {
    color: #f9fafb;
  }

  .multiselect-admin-filter .multiselect__select {
    padding: 6px 12px;
  }

  .multiselect-admin-filter .multiselect__select::before {
    border-color: #6b7280 transparent transparent;
    top: 65%;
  }

  .dark .multiselect-admin-filter .multiselect__select::before {
    border-color: #9ca3af transparent transparent;
  }

  .multiselect-admin-filter .multiselect__content-wrapper {
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin-top: 2px;
    z-index: 50;
  }

  .dark .multiselect-admin-filter .multiselect__content-wrapper {
    background-color: #374151;
    border-color: #4b5563;
  }

  .multiselect-admin-filter .multiselect__option {
    padding: 8px 12px;
    min-height: 32px;
    font-size: 10px;
    cursor: pointer;
    color: #111827;
    transition: all 0.2s ease;
  }

  .dark .multiselect-admin-filter .multiselect__option {
    color: #f9fafb;
  }

  .multiselect-admin-filter .multiselect__option:hover {
    background-color: #f3f4f6;
  }

  .dark .multiselect-admin-filter .multiselect__option:hover {
    background-color: #4b5563;
  }

  .multiselect-admin-filter .multiselect__option--selected {
    background-color: #dbeafe;
    color: #1e40af;
    font-weight: 600;
  }

  .dark .multiselect-admin-filter .multiselect__option--selected {
    background-color: #4b5563;
    color: #f9fafb;
  } 

  .multiselect-admin-filter .multiselect__option--highlight::after {
    content: '';
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
</style>

<script setup>
import { ref, computed, onMounted, nextTick, reactive, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useHead, useCookie } from '#imports'

import { useRouter, useRoute } from 'vue-router';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'
import Multiselect from 'vue-multiselect'

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const router = useRouter();
const route = useRoute();

const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'MiSeguro - Gestión de Servicios',
  meta: [
    { name: 'description', content: 'Gestión de servicios del sistema MiSeguro - Administrar solicitudes, asignaciones y seguimiento' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no'}
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const loadingPending = ref(false)
const loadingHistory = ref(false)
const loadingPackages = ref(false)
const isProcessingPayment = ref(false)
const isVerifying = ref(false)
const showPaymentConfirmationModal = ref(false)
const showDetailModal = ref(false)
const showLiquidacionModal = ref(false)
const techSearchQuery = ref('')
const isSearchingTech = ref(false)
const showPaymentModal = ref(false)
const showAmountDetailsModal = ref(false)
const showAssignmentModal = ref(false)
const showBankDetailsModal = ref(false)
const showPackageConfirmModal = ref(false)
const showConfirmModal = ref(false)
const showPackagePaymentDetailsModal = ref(false)
const showFacturaModal = ref(false)

const anyModalOpen = computed(() => {
  return showDetailModal.value || 
         showLiquidacionModal.value || 
         showPaymentModal.value || 
         showAmountDetailsModal.value || 
         showAssignmentModal.value || 
         showBankDetailsModal.value || 
         showPaymentConfirmationModal.value || 
         showPackageConfirmModal.value || 
         showConfirmModal.value || 
         showPackagePaymentDetailsModal.value || 
         showFacturaModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})

// Package Assignment Modal
const selectedPackageTechnician = ref(null)
const isAssigningPackage = ref(false)
const packageCities = ref([])
const selectedPackageCity = ref(null)
const packageTechnicians = ref([])
const currentPackagePage = ref(1)
const itemsPerPackagePage = 5
const comisionPorcentaje = ref(0)

// Búsqueda de paquetes
const packageSearchInput = ref('')
const packageSearchId = ref('')
const handlePackageSearch = () => {
  packageSearchId.value = packageSearchInput.value.trim()
  invalidatePackageCache() // Limpiar todo el cache al buscar
  fetchActivePackages(true)
}

const debouncedPackageSearch = useDebounceFn(handlePackageSearch, 1500)

const clearPackageSearch = () => {
  packageSearchInput.value = ''
  packageSearchId.value = ''
  invalidatePackageCache() // Limpiar todo el cache
  fetchActivePackages(true)
}

const activePackages = ref({
  utilizando: [],
  verificando_pago: [],
  utilizado: []
})

// Cache para paquetes
const packagesCache = ref({
  utilizando: {},
  verificando_pago: {},
  utilizado: {}
})

// Función para invalidar cache
const invalidatePackageCache = (estado = null) => {
  if (estado) {
    packagesCache.value[estado] = {}
  } else {
    packagesCache.value = {
      utilizando: {},
      verificando_pago: {},
      utilizado: {}
    }
  }
}

// Contadores de paquetes (Header y Tabs)
const packageStats = ref({
  en_uso: 0,
  pendiente_verificacion: 0,
  historial: 0
})

// Estado de paginación por pestaña
const packagePagination = ref({
  utilizando: {
    page: 1,
    hasMore: true,
    loading: false,
    total: 0,
    totalPages: 1
  },
  verificando_pago: {
    page: 1,
    hasMore: true,
    loading: false,
    total: 0,
    totalPages: 1
  },
  utilizado: {
    page: 1,
    hasMore: true,
    loading: false,
    total: 0,
    totalPages: 1
  }
})

// Filtros y búsqueda
const searchQuery = ref('')
const isSearching = ref(false)
const selectedStatus = ref('')
const selectedServiceType = ref('')
const selectedCity = ref('')
const selectedTechCity = ref('')
const selectedMonth = ref(new Date().toISOString().slice(0, 7)) // Formato YYYY-MM

// Variables para el manejo de pestañas y estados
const activePackageTab = ref('verificando_pago'); // 'verificando_pago' o 'utilizando'
const selectedPackage = ref(null); 

// Función para mostrar el modal de confirmación de pago
const showPaymentConfirmation = (pkg, action) => {
  selectedPackage.value = pkg;
  pendingPaymentAction.value = action;
  showPaymentConfirmationModal.value = true;
};

// Función para crear factura automáticamente
const crearFacturaParaPago = async (idUsuario, payment, tipoPago, idRelacionado) => {
  try {

    // Verificar RTN
    let rtnResponse = { success: false };
    try {
      rtnResponse = await $api(`/usuarios/verificar-rtn/${idUsuario}`, {
        method: 'GET'
      });
    } catch (rtnError) {
    }

    let total = parseFloat(payment.monto_total || payment.monto || 0);

    // Si es pago de paquete, calcular solo la comisión
    if (tipoPago === 'package') {
      try {
        const comisionResponse = await $api('/config/valor/comision_por_paquete', {
          method: 'GET'
        });

        if (comisionResponse && comisionResponse.valor) {
          const porcentajeComision = parseFloat(comisionResponse.valor);
          const montoBase = total;
          total = (montoBase * porcentajeComision) / 100;
          
        } else {
          console.warn('⚠️ No se obtuvo porcentaje de comisión, usando monto completo');
        }
      } catch (comisionError) {
        console.error('❌ Error obteniendo comisión:', comisionError);
        console.warn('⚠️ Continuando con monto completo debido al error');
      }
    }

    const subtotal = total;
    const isv = 0;

    let facturaData = {
      tipo_factura: rtnResponse?.success ? 'CON_RTN' : 'CONSUMIDOR_FINAL',
      subtotal,
      isv,
      total
    };

    // Asignar ID correspondiente
    if (tipoPago === 'package') {
      facturaData.id_pago_paquete = idRelacionado;
    }

    if (rtnResponse?.success && rtnResponse.data) {
      facturaData.rtn_cliente = rtnResponse.data.rtn;
      facturaData.nombre_cliente = rtnResponse.data.nombre.trim();
    }

    const facturaResponse = await $api('/facturas', {
      method: 'POST',
      body: facturaData
    });
    
  } catch (error) {
    console.error('❌ Error generando factura:', error);
    console.error('❌ Detalles del error:', {
      message: error.message,
      response: error.response,
      data: error.data
    });
    showError('El pago se aprobó, pero hubo un error generando la factura.');
  }
};

// Función para confirmar la acción de pago
const confirmPaymentAction = async () => {
  if (!selectedPackage.value || !pendingPaymentAction.value) return;
  
  isVerifying.value = true;
  const pagoId = selectedPackage.value.pagos?.[0]?.id_pago_paquete;
  
  if (!pagoId) {
    showError('No se encontró el ID del pago');
    isVerifying.value = false;
    return;
  }

  try {
    const response = await $api(`/paquetes/usuarios/pagos/${pagoId}/${pendingPaymentAction.value}`, {
      method: 'PUT'
    });

    if (response && response.success) {
      showSuccess(`Pago ${pendingPaymentAction.value === 'approve' ? 'aprobado' : 'rechazado'} correctamente`);
      
      // Si se rechazó, notificar a usuario
      if (pendingPaymentAction.value === 'reject') {  

        // Notificar a Usuario
        try {
          await $api('/notificaciones/enviar', {
            method: 'POST',
            body: {
              titulo: 'Pago de Paquete Rechazado',
              id_usuario: selectedPackage.value?.id_usuario
            }
          });
        } catch (e) {
          console.error('Error notificando Usuario:', e);
        }
      }

      // Si se aprobó, notificar a usuario
      if (pendingPaymentAction.value === 'approve') {
        const adminName = userCookie.value?.nombre || 'Administrador';
        try {
          await $api('/notificaciones/enviar', {
            method: 'POST',
            body: {
              titulo: 'Pago de Paquete Aceptado',
              id_usuario: selectedPackage.value?.id_usuario
            }
          });
        } catch (e) {
          console.error('Error notificando Usuario (Aprobación):', e);
        }

        // Generar factura automática para el paquete
        const pago = selectedPackage.value?.pagos?.[0];
        if (pago) {
           await crearFacturaParaPago(selectedPackage.value.id_usuario, pago, 'package', pago.id_pago_paquete);
        }
      }

      // Invalidar cache y recargar
      invalidatePackageCache();
      await fetchActivePackages();
    } else {
      showError(response?.message || `Error al ${pendingPaymentAction.value === 'approve' ? 'aprobar' : 'rechazar'} el pago`);
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    showError(`Error al ${pendingPaymentAction.value === 'approve' ? 'aprobar' : 'rechazar'} el pago`);
  } finally {
    isVerifying.value = false;
    showPaymentConfirmationModal.value = false;
    selectedPackage.value = null;
    pendingPaymentAction.value = null;
  }
};

// Función para cancelar la acción de pago
const cancelPaymentAction = () => {
  selectedPackage.value = null;
  pendingPaymentAction.value = null;
  showPaymentConfirmationModal.value = false;
};

// Objetos seleccionados para multiselect
const selectedStatusObject = ref(null)
const selectedServiceTypeObject = ref(null)
const selectedTechCityObject = ref(null)

const navigateToFinance = () => {
  router.push('/admin/ReportesAdmin');
};

// Listas de opciones para multiselect
const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'asignado', label: 'Asignado' },
  { value: 'pendiente_cotizacion', label: 'Pend. Cotización' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'verificando_pagovisita', label: 'Verif. Pago Visita' },
  { value: 'verificando_pagoservicio', label: 'Verif. Pago Servicio' },
  { value: 'pendiente_pagoservicio', label: 'Pend. Pago' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'calificado', label: 'Calificado' },
  { value: 'cancelado', label: 'Cancelado' }
]

// Funciones para etiquetar
const getStatusLabel = (option) => {
  if (!option) return ''
  return option.label
}

const getServiceTypeLabel = (option) => {
  if (!option) return ''
  return option.nombre
}

const getTechCityLabel = (option) => {
  if (!option) return ''
  return option.nombre_ciudad || option
}

// Paginación para Pendientes
const pendingItemsPerPage = 4
const currentPendingPage = ref(1)
const hasMorePendingPages = ref(true)
const totalPendingItems = ref(0)

// Paginación para Historial con API
const historyItemsPerPage = 6
const hasMoreHistoryPages = ref(true) 
const totalHistoryItems = ref(0);
const currentHistoryPage = ref(1)

// Paginación de técnicos
const currentTechPage = ref(1)
const techsPerPage = 4
const totalTechPages = ref(1)

// Servicios en edición/asignación/pago
const selectedService = ref(null)
const serviceToAssign = ref(null)
const serviceToPayment = ref(null)
const paymentType = ref('') // 'visit' or 'service'

// Estado para la confirmación de pago
const pendingPaymentAction = ref(null) // 'approve' or 'reject'

// Detalles de pago
const paymentDetails = reactive({
  verified: false,
  adminNotes: ''
})

// ===== VARIABLES DE DATOS =====
// Estadísticas
const stats = ref({
  total: 0,
  completed: 0,
  pending: 0
})

// Lista de servicios - ahora se obtiene de la API
const pendingServices = ref([])
const historyServices = ref([])

// Catálogo de servicios disponibles
const catalogoServicios = ref([])

// Técnicos disponibles - ahora se obtiene de la API
const availableTechnicians = ref([])
const techniciansTotal = ref(0)


// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== VARIABLES PARA MODALES DE PAGOS y CONFIG EMPRESA =====
const selectedPackagePayment = ref(null)
const selectedFacturaPayment = ref(null);

// Variables de datos de empresa
const empresaNombre = ref('MiSeguro');
const empresaTelefono = ref('');
const empresaEmail = ref('');
const empresaRTN = ref('');
const empresaCAI = ref('');
const empresaRangoAutorizado = ref('');
const empresaFechaLimite = ref('');
const empresaCorrelativo = ref('');

// Función de utilidad para clases de estado
const getStatusBadgeClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const normalizedStatus = status.toLowerCase()
  switch (normalizedStatus) {
    case 'aprobado':
    case 'confirmado':
    case 'completado':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'pendiente':
    case 'pendiente_validacion':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'rechazado':
    case 'denegado':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

// Funciones de utilidad para formateo
const formatCurrency = (value) => {
  try {
    if (value === undefined || value === null || isNaN(value)) return 'L. 0.00';
    const number = parseFloat(value);
    return `L. ${number.toLocaleString('es-HN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  } catch (error) {
    console.error('Error formateando moneda:', error);
    return 'L. 0.00';
  }
}; 

// Cargar configuración de empresa
const loadEmpresaConfig = async () => {
  try {
    const [telefonoRes, emailRes, rtnRes] = await Promise.all([
      $api('/config/valor/numero_empresa', { method: 'GET' }).catch(() => null),
      $api('/config/valor/correo_empresa', { method: 'GET' }).catch(() => null),
      $api('/config/valor/rtn', { method: 'GET' }).catch(() => null)
    ]);

    if (telefonoRes?.valor) empresaTelefono.value = telefonoRes.valor.toString();
    if (emailRes?.valor) empresaEmail.value = emailRes.valor.toString();
    if (rtnRes?.valor) empresaRTN.value = rtnRes.valor.toString();
  } catch (error) {
    console.error('Error cargando configuración de empresa:', error);
  }
};

// Mostrar detalles de pago de paquete
const showPackagePaymentDetails = (pkg) => {
  if (pkg.pagos && pkg.pagos.length > 0) {
    // Tomamos el primer pago (o el más reciente si hubiera orden)
    // Asumimos que para pago_directo hay un pago relevante
    const pago = pkg.pagos[0]; 
    selectedPackagePayment.value = {
      ...pago,
      paquete: pkg.paquete,
      usuario: pkg.Usuario || pkg.usuario, // Normalizar usuario
      estado: pago.estado || pkg.estado // Usar estado del pago o del paquete si pago no tiene
    };
    showPackagePaymentDetailsModal.value = true;
  } else {
    showError('No hay información de pagos disponible para este paquete');
  }
};

const closePackagePaymentDetailsModal = () => {
  showPackagePaymentDetailsModal.value = false;
  selectedPackagePayment.value = null;
};

const openFacturaModal = async (payment) => {
  try {
    if (!payment) {
      console.error('No se proporcionó un pago');
      return;
    }

    // Resetear variables fiscales para evitar que se muestren datos de la factura anterior
    empresaCAI.value = '';
    empresaCorrelativo.value = '';
    empresaRangoAutorizado.value = '';
    empresaFechaLimite.value = '';

    // Clonar para no modificar el objeto original y resetear campos financieros/fiscales
    selectedFacturaPayment.value = { 
      ...payment, 
      subtotal: 0, 
      isv: 0, 
      total: 0,
      rtn_cliente: '' 
    };
    showFacturaModal.value = true;

    // Si no tiene id_factura, intentar buscar por el ID del pago
    if (!payment.id_factura && payment.id_pago_paquete) {
      try {
        const params = new URLSearchParams();
        params.append('id_pago_paquete', payment.id_pago_paquete);

        const response = await $api(`/facturas/relaciones/idpago?${params.toString()}`, {
          method: 'GET'
        });

        if (response?.status === 'success' && response.factura) {
          const factura = response.factura;
          const correlativo = response.correlativo;
          
          // Actualizar variables de datos fiscales con los datos de la factura
          if (factura.cai) empresaCAI.value = factura.cai;
          if (factura.numero_factura_correlativo) empresaCorrelativo.value = factura.numero_factura_correlativo;
          
          // Actualizar con datos del correlativo
          if (correlativo) {
            if (correlativo.rango_autorizado) empresaRangoAutorizado.value = correlativo.rango_autorizado;
            if (correlativo.fecha_limite_emision) empresaFechaLimite.value = correlativo.fecha_limite_emision;
          }
          
          // Actualizar RTN del cliente en selectedFacturaPayment
          if (factura.rtn_cliente) selectedFacturaPayment.value.rtn_cliente = factura.rtn_cliente;
          
          // Actualizar datos financieros en selectedFacturaPayment
          if (factura.subtotal) selectedFacturaPayment.value.subtotal = factura.subtotal;
          if (factura.isv) selectedFacturaPayment.value.isv = factura.isv;
          if (factura.total) selectedFacturaPayment.value.total = factura.total;
          
        } else if (response?.status === 'not_found') {
          console.warn('ℹ️ No se encontró factura asociada al pago:', response.message);
          // Los valores ya están reseteados por el inicio de la función
        } else {
          console.warn('⚠️ No se encontró factura asociada al pago:', response);
          showError('No se encontró la factura asociada a este pago');
        }
      } catch (error) {
        console.error('❌ Error al cargar la factura:', error);
        
        // Manejar el caso de no encontrado vía error de red/fetch
        const isNotFound = 
          error.response?.status === 404 || 
          error.data?.status === 'not_found' || 
          error.response?._data?.status === 'not_found';

        if (!isNotFound) {
          showError('No se pudo establecer conexión con el sistema de facturación');
        }
      }
    } else if (payment.id_factura) {
      // Obtener datos de la factura específica si hay un ID
      try {
        const response = await $api(`/facturas/${payment.id_factura}`, {
          method: 'GET'
        });

        if (response?.status === 'success' && response.factura) {
          const factura = response.factura;
          
          // Actualizar variables de datos fiscales con los datos de la factura
          if (factura.cai) empresaCAI.value = factura.cai;
          if (factura.numero_factura_correlativo) empresaCorrelativo.value = factura.numero_factura_correlativo;
          
        } else {
          console.warn('⚠️ La respuesta no contiene datos de factura válidos:', response);
        }
      } catch (error) {
        console.error('❌ Error obteniendo datos de factura:', error);
      }
    } else {
      console.warn('⚠️ No se proporcionó un ID de factura ni ID de pago de paquete:', payment);
    }
    
  } catch (error) {
    console.error('❌ Error inesperado al abrir el modal de factura:', error);
  }
};

const closeFacturaModal = () => {
  showFacturaModal.value = false;
  selectedFacturaPayment.value = null;
};

// Modificar onMounted para cargar config de empresa
onMounted(async () => {
  // ... código existente
  await loadEmpresaConfig();
});

// ===== API FUNCTIONS =====
// Función para obtener paquetes según el estado de la pestaña activa
const fetchActivePackages = async (reset = false) => {
  try {
    loadingPackages.value = true;
    
    // Determinar qué estados cargar
    const estadosACargar = [];
    const estadoActual = activePackageTab.value || 'utilizando';
    
    // Si reseteamos, volvemos a la página 1 y limpiamos datos de todas las tabs
    if (reset) {
      const tabs = ['utilizando', 'verificando_pago', 'utilizado'];
      tabs.forEach(estado => {
        packagePagination.value[estado].page = 1;
        packagePagination.value[estado].hasMore = true;
        invalidatePackageCache(estado);
      });
      // Solo cargamos la tab actual pero el resto quedan limpias para cuando se cambie
      estadosACargar.push(estadoActual);
    } else {
       // Carga inicial o cambio de tab normal sin forzar reset global inmediato
       if (['utilizando', 'verificando_pago', 'utilizado'].includes(estadoActual)) {
         estadosACargar.push(estadoActual);
       }
    }

    // Realizar solicitudes solo si no están en cache o si se fuerza recarga
    const requests = [];

    for (const estado of estadosACargar) {
      const page = packagePagination.value[estado].page;
      
      // Verificar cache
      if (packagesCache.value[estado]?.[page]) {
        // Usar datos cacheados
        const cached = packagesCache.value[estado][page];
        activePackages.value[estado] = cached.data;
        packagePagination.value[estado].hasMore = cached.hasMore;
        packagePagination.value[estado].total = cached.total;
        packagePagination.value[estado].totalPages = cached.totalPages;
        
        // Si hay contadores en cache (guardados en la primera pagina usualmente), usarlos
        if (cached.contadores) {
           packageStats.value = {
            en_uso: cached.contadores.en_uso || 0,
            pendiente_verificacion: cached.contadores.pendiente_verificacion || 0,
            historial: cached.contadores.historial || 0
          };
        }
        continue;
      }

      // Si no está en cache, preparar request
      const limit = 4;
      const offset = (page - 1) * limit;

      requests.push(
        (async () => {
          try {
            const response = await $api(`/paquetes/usuarios/estado`, {
              method: 'GET',
              params: {
                estado: estado === 'utilizado' ? 'utilizado,activo' : estado,
                limit,
                offset,
                search: packageSearchId.value || undefined
              }
            });

            return {
              estado,
              data: (response?.success && response.data) || [],
              contadores: response?.contadores || null,
              hasMore: response?.hasMore || false,
              total: response?.total || 0, 
              page: response?.page || 1,
              totalPages: response?.totalPages || 1
            };
          } catch (error) {
            console.error(`Error al obtener paquetes en estado ${estado}:`, error);
            return { 
              estado, 
              data: [],
              contadores: null,
              hasMore: false,
              total: 0,
              page: 1,
              totalPages: 1
            };
          }
        })()
      );
    }

    // Si no hay requests, terminamos
    if (requests.length === 0) {
      loadingPackages.value = false;
      return;
    }

    // Ejecutar peticiones
    const results = await Promise.all(requests);
    
    let contadoresActualizados = false;
    
    results.forEach(({ estado, data, contadores, hasMore, total, totalPages, page }) => {
      // Guardar en cache
      packagesCache.value[estado][page] = {
        data: [...data], // Clonar para evitar mutaciones
        contadores,
        hasMore,
        total,
        totalPages
      };

      activePackages.value[estado] = data;
      packagePagination.value[estado].hasMore = hasMore;
      packagePagination.value[estado].total = total;
      packagePagination.value[estado].totalPages = totalPages;
      
      // Actualizar contadores globales
      if (contadores && !contadoresActualizados) {
        packageStats.value = {
          en_uso: contadores.en_uso || 0,
          pendiente_verificacion: contadores.pendiente_verificacion || 0,
          historial: contadores.historial || 0
        };
        contadoresActualizados = true;
      }
    });
    
    // Si no hay tab, default
    if (!activePackageTab.value) {
      activePackageTab.value = 'utilizando';
    }
  } catch (error) {
    console.error('Error al obtener paquetes activos:', error);
    showError('Error al cargar los paquetes activos');
  } finally {
    loadingPackages.value = false;
  }
};

// Función para cambiar de página en paquetes
const changePackagePage = async (estado, newPage) => {
  if (newPage < 1 || newPage > packagePagination.value[estado].totalPages) return;
  
  packagePagination.value[estado].page = newPage;
  // Al cambiar pagina, llamamos a fetchActivePackages que usa el estado actual de la pagina
  await fetchActivePackages();
};


// Función para obtener técnicos desde la API
const fetchTechnicians = async (cityId = null, limit = 4, offset = 0, serviceId = null) => {
  try {
    let url = `/usuarios/tecnicos?limit=${limit}&offset=${offset}`
    
    // Si se proporciona un ID de ciudad, filtrar por esa ciudad
    if (cityId) {
      url += `&id_ciudad=${cityId}`
    } 
    
    if (serviceId) {
      url += `&id_servicio=${serviceId}`
    }
    
    const response = await $api(url, {
      method: 'GET'
    })

    // Actualizar con la nueva estructura de respuesta
    availableTechnicians.value = response.data || []
    techniciansTotal.value = response.total || 0
    currentTechPage.value = response.page || 1
    totalTechPages.value = response.totalPages || 1

    return response
  } catch (error) {
    console.error('Error al obtener técnicos:', error)
    showError('No se pudieron cargar los técnicos')
    // Resetear valores en caso de error
    availableTechnicians.value = []
    techniciansTotal.value = 0
    currentTechPage.value = 1
    totalTechPages.value = 1
    return { 
      data: [], 
      total: 0,
      page: 1,
      totalPages: 1,
      hasMore: false
    }
  }
}

// Función para obtener técnicos, administradores y super admins desde la API
const fetchTechniciansAndAdmins = async (cityId = null, limit = 4, offset = 0, serviceId = null, nombre = null, estado = null) => {
  try {
    let url = `/usuarios/tecnicos-admins?limit=${limit}&offset=${offset}`
    
    // Si se proporciona un ID de ciudad, filtrar por esa ciudad
    if (cityId) {
      url += `&id_ciudad=${cityId}`
    } 
    
    // Si se proporciona un ID de servicio, filtrar por ese servicio
    if (serviceId) {
      url += `&id_servicio=${serviceId}`
    }
    
    // Si se proporciona un nombre, filtrar por nombre
    if (nombre) {
      url += `&nombre=${encodeURIComponent(nombre)}`
    }
    
    // Si se proporciona un estado, filtrar por estado
    if (estado) {
      url += `&estado=${estado}`
    }
    
    const response = await $api(url, {
      method: 'GET'
    })

    // La respuesta incluye técnicos, admins y super admins
    return {
      data: response.data || [],
      total: response.total || 0,
      page: response.page || 1,
      totalPages: response.totalPages || 1,
      hasMore: response.hasMore || false,
      estadisticas: response.estadisticas || {
        total_tecnicos: 0,
        total_admins: 0,
        total_usuarios: 0
      }
    }
  } catch (error) {
    console.error('Error al obtener técnicos y administradores:', error)
    showError('No se pudieron cargar los técnicos y administradores')
    // Resetear valores en caso de error
    return { 
      data: [], 
      total: 0,
      page: 1,
      totalPages: 1,
      hasMore: false,
      estadisticas: {
        total_tecnicos: 0,
        total_admins: 0,
        total_usuarios: 0
      }
    }
  }
}

// Función para obtener el catálogo de servicios
const fetchCatalogoServicios = async () => {
  try {
    const response = await $api('/servicios', {
      method: 'GET'
    })
    
    // Manejar diferentes estructuras de respuesta
    let servicios = []
    
    if (Array.isArray(response)) {
      // Si la respuesta es directamente un array
      servicios = response
    } else if (response && response.data) {
      // Si la respuesta tiene una propiedad data
      servicios = response.data
    } else if (response && response.servicios) {
      // Si la respuesta tiene una propiedad servicios
      servicios = response.servicios
    } else {
      servicios = []
    }
    
    // Almacenar todos los servicios sin importar su estado
    catalogoServicios.value = servicios
    
    return servicios
  } catch (error) {
    console.error('Error al obtener catálogo de servicios:', error)
    // No lanzar el error para que no bloquee la carga de la página
    catalogoServicios.value = []
    return []
  }
}

const fetchServices = async (page = 1, limit = 10, section = 'all', filters = {}) => {
  try {
    // Calcular el offset basado en la página solicitada
    const offset = (page - 1) * limit;
    
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })

    if (section === 'pending') {
      // Para pendientes, incluir asignación y verificaciones de pago
      params.append('status', 'pendiente_asignacion,verificando_pagovisita,verificando_pagoservicio')
    } else if (filters.status) {
      // Si hay un filtro de estado específico, usarlo
      params.append('status', filters.status)
    } else if (filters.excludeStatus) {
      // Si se especifican estados a excluir, usarlos
      params.append('excludeStatus', filters.excludeStatus)
    }

    // Agregar otros filtros si existen
    if (filters.search) params.append('search', filters.search)
    if (filters.serviceType) params.append('serviceType', filters.serviceType)
    if (filters.month) params.append('month', filters.month)

    const response = await $api('/solicitudservicio', {
      method: 'GET',
      query: Object.fromEntries(params)
    })
    
    if (!response || !response.data) {
      throw new Error('Respuesta de API inválida')
    }
    
    // Actualizar las estadísticas con los contadores de la API
    if (response.contadores) {
      stats.value = {
        total: response.contadores.total || 0,
        completed: response.contadores.completados || 0,
        pending: response.contadores.activos || 0
      };
    }
    
    return {
      data: response.data,
      hasMore: response.hasMore,
      total: response.total,
      currentPage: response.page,
      totalPages: response.totalPages,
      fullData: response.data,
      stats: response.contadores || {}
    }
  } catch (error) {
    console.error('Error en fetchServices:', error)
    throw error
  }
}

const loadPendingServices = async (page = 1, resetList = false) => {
  try {
    loadingPending.value = true;
    
    // Si es un refresh, forzar la carga de la primera página
    if (resetList) {
      page = 1;
    }
    
    // Cargar servicios pendientes con paginación
    const result = await fetchServices(page, pendingItemsPerPage, 'pending');
    
    // Reemplazar la lista de servicios con los nuevos resultados
    pendingServices.value = result.data;
    
    // Actualizar el estado de la paginación
    currentPendingPage.value = page;
    hasMorePendingPages.value = result.hasMore;
    totalPendingItems.value = result.total || 0; // Asegurar que siempre tengamos un número
    
  } catch (error) {
    console.error('Error al cargar servicios pendientes:', error);
    showError('Error al cargar servicios pendientes');
  } finally {
    loadingPending.value = false;
  }
}

// Cache key basada en los filtros actuales
const getCacheKey = () => {
  return JSON.stringify({
    search: searchQuery.value,
    status: selectedStatus.value,
    serviceType: selectedServiceType.value,
    month: selectedMonth.value
  });
};

// Cache para almacenar páginas ya cargadas
const historyCache = {};

const loadHistoryServices = async (page = 1, resetList = false) => {
  try {
    loadingHistory.value = true;
    
    const targetPage = page;
    const cacheKey = getCacheKey();
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos de caché
    const now = Date.now();
    
    // Clear cache if it's a refresh
    if (resetList) {
      if (historyCache[cacheKey]) {
        delete historyCache[cacheKey];
      }
    }
    
    // Check if we have valid cached data for this page
    const cachedData = historyCache[cacheKey]?.[targetPage];
    const isCacheValid = cachedData && (now - cachedData.timestamp < CACHE_EXPIRY);
    
    if (isCacheValid) {
      historyServices.value = [...cachedData.data];
      currentHistoryPage.value = targetPage;
      hasMoreHistoryPages.value = cachedData.hasMore;
      totalHistoryItems.value = cachedData.total;
      return;
    }
    
    // Create filters excluding pending statuses
    const filters = {
      search: searchQuery.value,
      status: selectedStatus.value,
      serviceType: selectedServiceType.value,
      month: selectedMonth.value,
      excludeStatus: 'pendiente_asignacion,verificando_pagovisita,verificando_pagoservicio'
    }; 
    
    // Load history services with pagination
    const result = await fetchServices(targetPage, historyItemsPerPage, 'history', filters);
    
    if (!result || !Array.isArray(result.data)) {
      throw new Error('Respuesta inválida de la API');
    } 
    
    // Create a deep copy of the data
    const servicesData = JSON.parse(JSON.stringify(result.data));
    
    // Update reactive references with new data
    historyServices.value = servicesData;
    currentHistoryPage.value = targetPage;
    hasMoreHistoryPages.value = result.hasMore;
    totalHistoryItems.value = result.total || 0;
    
    // Initialize cache for this filter set if it doesn't exist
    if (!historyCache[cacheKey]) {
      historyCache[cacheKey] = {};
    }
    
    // Update cache with new data
    historyCache[cacheKey][targetPage] = {
      data: [...servicesData],
      hasMore: result.hasMore,
      total: result.total,
      timestamp: now
    };
    
    // Clean up old cache (older than 30 minutes) - pero mantenemos la caché actual aunque sea vieja
    // ya que la limpieza se hace al cargar nuevas páginas
    const CACHE_CLEANUP_THRESHOLD = 30 * 60 * 1000; // 30 minutos
    
    Object.keys(historyCache).forEach(key => {
      // No limpiar la caché actual
      if (key === cacheKey) return;
      
      Object.keys(historyCache[key]).forEach(pageNum => {
        if (now - historyCache[key][pageNum].timestamp > CACHE_CLEANUP_THRESHOLD) {
          delete historyCache[key][pageNum];
        }
      });
      
      // Remove filter set if it has no pages
      if (Object.keys(historyCache[key]).length === 0) {
        delete historyCache[key];
      }
    });
    
  } catch (error) {
    console.error('Error al cargar historial:', error);
    
    // Si hay un error, intentar cargar desde cachía si está disponible
    const cachedData = historyCache[getCacheKey()]?.[page];
    if (cachedData) {
      console.warn('Usando datos en caché debido a un error en la API');
      historyServices.value = [...cachedData.data];
      currentHistoryPage.value = page;
      hasMoreHistoryPages.value = cachedData.hasMore;
      totalHistoryItems.value = cachedData.total;
    } else {
      showError('Error al cargar el historial de servicios');
    }
  } finally {
    loadingHistory.value = false;
  }
}



// ===== COMPUTED PROPERTIES =====

// Lista de ciudades disponibles
const cities = ref([])

// Obtener ciudades desde la API
const fetchCities = async () => {
  try {
    const data = await $api('/ciudad', {
      method: 'GET'
    })
    cities.value = data.map(city => ({
      id_ciudad: city.id_ciudad,
      nombre_ciudad: city.nombre_ciudad
    })).sort((a, b) => a.nombre_ciudad.localeCompare(b.nombre_ciudad))
  } catch (error) {
    console.error('Error al obtener las ciudades:', error)
    showError('No se pudieron cargar las ciudades')
  }
}

// Lista de ciudades disponibles
const availableCities = computed(() => cities.value)

// Computed para obtener el nombre del servicio seleccionado (para mostrar en UI si es necesario)
const selectedServiceName = computed(() => {
  if (!selectedServiceType.value) return ''
  const servicio = catalogoServicios.value.find(s => s.id_servicio === selectedServiceType.value)
  return servicio ? servicio.nombre : ''
})

// Técnicos filtrados por ciudad (ahora el filtrado se hace en el backend)
const filteredTechnicians = computed(() => {
  // Ya no filtramos aquí porque el backend hace el filtrado
  return availableTechnicians.value || []
})

// Técnicos paginados
const paginatedTechnicians = computed(() => {
  // Usar directamente los técnicos recibidos del backend (ya están paginados)
  return availableTechnicians.value || []
})


// Función para cambiar de página de técnicos
const changeTechPage = async (page) => {
  try {
    currentTechPage.value = page;
    const offset = (page - 1) * techsPerPage;
    
    // Obtener el ID de la ciudad del paquete seleccionado o del selector de ciudad
    const cityId = selectedPackage.value?.Usuario?.ciudad?.id_ciudad || 
                  selectedPackage.value?.Usuario?.id_ciudad || 
                  selectedTechCityObject.value?.id_ciudad;
    
    const result = showLiquidacionModal.value 
      ? await fetchTechniciansAndAdmins(cityId, techsPerPage, offset, serviceToAssign.value?.id_servicio, techSearchQuery.value)
      : await fetchTechnicians(cityId, techsPerPage, offset, serviceToAssign.value?.id_servicio);
    
    // Actualizar las variables reactivas con los resultados
    if (showLiquidacionModal.value) {
      availableTechnicians.value = result.data || [];
      techniciansTotal.value = result.total || 0;
      currentTechPage.value = result.page || 1;
      totalTechPages.value = result.totalPages || 1;
    } else {
      // fetchTechnicians ya actualiza las variables reactivas internamente
    }
  } catch (error) {
    console.error('Error al cambiar de página de técnicos:', error);
    showError('No se pudieron cargar los técnicos');
  }
}

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedStatus.value || selectedServiceType.value || selectedMonth.value)
})

// ===== FUNCIONES DE UTILIDAD =====
// Formatear fecha a DDMMYY
const formatDateDDMMYY = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}${month}${year}`
}

const getServiceTypeIcon = (serviceName) => {
  if (!serviceName) return '🔧'
  
  const icons = {
    'Reparación de Plomería': '🚰',
    'Plomería': '🚰',
    'Instalación Eléctrica': '💡',
    'Electricidad': '💡', 
    'Reparación Aire Acondicionado': '❄️',
    'Aire Acondicionado': '❄️',
    'Pintura de Habitación': '🎨',
    'Pintura': '🎨',
    'Carpintería': '🪚',
    'Carpintería - Puerta': '🪚',
    'Limpieza de Hogar': '🧹',
    'Taxi VIP':'🚕'
  }
  
  // Buscar por coincidencia exacta primero
  if (icons[serviceName]) return icons[serviceName]
  
  // Buscar por palabras clave
  const lowerName = serviceName.toLowerCase()
  if (lowerName.includes('plom')) return '🚰'
  if (lowerName.includes('eléct') || lowerName.includes('elect')) return '💡'
  if (lowerName.includes('aire') || lowerName.includes('acondicionado')) return '❄️'
  if (lowerName.includes('pintura')) return '🎨'
  if (lowerName.includes('carpint')) return '🪚'
  if (lowerName.includes('limpieza')) return '🧹'
  
  return '🔧'
}

const getServiceTypeColor = (serviceName) => {
  if (!serviceName) return 'bg-gray-500'
  
  const colors = {
    'Reparación de Plomería': 'bg-blue-500',
    'Plomería': 'bg-blue-500',
    'Instalación Eléctrica': 'bg-yellow-500',
    'Electricidad': 'bg-yellow-500',
    'Reparación Aire Acondicionado': 'bg-cyan-500',
    'Aire Acondicionado': 'bg-cyan-500',
    'Pintura de Habitación': 'bg-pink-500',
    'Pintura': 'bg-pink-500',
    'Carpintería': 'bg-amber-500',
    'Carpintería - Puerta': 'bg-amber-500',
    'Limpieza de Hogar': 'bg-green-500'
  }
  
  // Buscar por coincidencia exacta primero
  if (colors[serviceName]) return colors[serviceName]
  
  // Buscar por palabras clave
  const lowerName = serviceName.toLowerCase()
  if (lowerName.includes('plom')) return 'bg-blue-500'
  if (lowerName.includes('eléct') || lowerName.includes('elect')) return 'bg-yellow-500'
  if (lowerName.includes('aire') || lowerName.includes('acondicionado')) return 'bg-cyan-500'
  if (lowerName.includes('pintura')) return 'bg-pink-500'
  if (lowerName.includes('carpint')) return 'bg-amber-500'
  if (lowerName.includes('limpieza')) return 'bg-green-500'
  
  return 'bg-gray-500'
}

const getStatusBadgeColor = (estado) => {
  const colors = {
    pendiente_pagovisita: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    pendiente_asignacion: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    verificando_pagovisita: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    asignado: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    pendiente_cotizacion: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    en_proceso: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    pendiente_pagoservicio: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    verificando_pagoservicio: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    finalizado: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    calificado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelado: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[estado] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

const getStatusText = (estado) => {
  const texts = {
    pendiente_pagovisita: 'Pend. Pago Visita',
    pendiente_asignacion: 'Asignación Pend.',
    verificando_pagovisita: 'Verif. Pago Visita',
    asignado: 'Asignado',
    pendiente_cotizacion: 'Pend. Cotización',
    en_proceso: 'En Proceso',
    pendiente_pagoservicio: 'Pend. Pago Servicio',
    verificando_pagoservicio: 'Verif. Pago Servicio',
    finalizado: 'Finalizado',
    calificado: 'Calificado',
    cancelado: 'Cancelado'
  }
  return texts[estado] || 'Desconocido'
}

// Formatear fecha
const formatDate = (dateString, time = false) => {
  if (!dateString) return ''
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }
  
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', options)
} 

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
    message,
    type: 'success',
    duration: 3000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  showToast({
    message: typeof message === 'string' ? message : 'Ocurrió un error inesperado',
    type: 'error',
    duration: 5000
  })
}

// ===== FUNCIONES DE FILTROS =====
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedServiceType.value = ''
  selectedMonth.value = ''
  currentHistoryPage.value = 1
  loadHistoryServices(1, true)
}

// ===== FUNCIONES DE ACCIONES =====
const viewService = (service) => {
  selectedService.value = service;
  showDetailModal.value = true;
}

// Función para abrir el modal de detalles del monto
const openAmountDetails = (type, service) => {
  paymentType.value = type;
  serviceToPayment.value = service;
  showAmountDetailsModal.value = true;
}

// Función para manejar la apertura del multiselect
const onMultiselectOpen = async () => {
  // Asegurarse de que las ciudades estén cargadas cuando se abra el multiselect
  if (cities.value.length === 0) {
    await fetchCities()
  }
}
 

const assignTechnician = async (service) => {
  serviceToAssign.value = service
  currentTechPage.value = 1
  
  // Asegurarse de que las ciudades estén cargadas antes de abrir el modal
  if (cities.value.length === 0) {
    await fetchCities()
  }
  
  // Establecer la ciudad del servicio actual si está disponible
  if (service.id_ciudad) {
    const city = cities.value.find(c => c.id_ciudad === service.id_ciudad)
    if (city) {
      selectedTechCityObject.value = city
      selectedTechCity.value = city.id_ciudad
    } else {
      selectedTechCityObject.value = null
      selectedTechCity.value = ''
    }
  } else {
    selectedTechCityObject.value = null
    selectedTechCity.value = ''
  }
  
  showAssignmentModal.value = true
  
  // Cargar técnicos de la ciudad del servicio si está disponible
  const cityId = service.id_ciudad || null
  await fetchTechnicians(cityId, 4, 0, service.id_servicio)
  
  // Esperar a que el DOM se actualice después de cargar los técnicos
  await nextTick()
}

// Cambiar página de técnicos

const confirmPaymentVisit = (service) => {
  serviceToPayment.value = service
  paymentType.value = 'visit'
  showPaymentModal.value = true
}

const confirmPaymentService = (service) => {
  serviceToPayment.value = service
  paymentType.value = 'service'
  showPaymentModal.value = true
}

// Estado para el modal de confirmación
const selectedTechnician = ref(null)

// Función para manejar la selección inicial del técnico
const selectTechnician = (technician) => {
  selectedTechnician.value = technician
  showConfirmModal.value = true
}

const sendWhatsAppNotification = (technician, service) => {
  try {
    const techName = technician.nombre;
    const techPhone = technician.telefono;
    
    if (!techPhone) {
      console.warn('El técnico no tiene número de teléfono registrado');
      return;
    }

    const serviceName = service.servicio?.nombre || 'Servicio';
    const clientName = service.cliente?.nombre || 'Cliente';
    const serviceId = service.id_solicitud;
    const dateStr = formatDateDDMMYY(service.fecha_solicitud);
    
    const message = `*Nuevo Servicio Asignado*\n\n` +
      `Hola *${techName}*,\n` +
      `Se te ha asignado un nuevo servicio en MiSeguro.\n\n` +
      `*ID:* ${dateStr}-${serviceId}\n` +
      `*Servicio:* ${serviceName}\n` +
      `*Cliente:* ${clientName}\n` +
      `*Colonia:* ${service.colonia || 'No especificada'}\n\n` +
      `Por favor, ingresa a la plataforma para ver los detalles.`;

    const encodedMessage = encodeURIComponent(message);
    
    // Limpiar el número y asegurar prefijo 504
    const cleanPhone = techPhone.toString().replace(/\D/g, '');
    const finalPhone = cleanPhone.length === 8 ? `504${cleanPhone}` : cleanPhone;

    window.open(`https://wa.me/${finalPhone}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp para el técnico:', error);
  }
};

// Función para confirmar la asignación del técnico
const confirmTechnicianAssignment = async () => {
  try { 
    // Actualizar el servicio en el backend primero
    const updateResponse = await $api(`/solicitudservicio/${serviceToAssign.value.id_solicitud}`, {
      method: 'PUT',
      body: {
        estado: 'asignado',
        id_tecnico: selectedTechnician.value.id_usuario
      }
    })

    // Obtener el ID del técnico que se está asignando
    const idTecnico = selectedTechnician.value.id_usuario;
    
    await $api('/notificaciones/enviar', {
      method: 'POST',
      body: {
        titulo: 'Servicio Asignado', 
        id_usuario: idTecnico
      }
    });

    // Guardar referencia antes de limpiar el estado
    const techToNotify = selectedTechnician.value;
    const serviceToNotify = serviceToAssign.value;

    // Buscar en servicios pendientes
    const pendingIndex = pendingServices.value.findIndex(s => s.id_solicitud === serviceToAssign.value.id_solicitud)
    if (pendingIndex > -1) {
      // Remover el servicio de la lista de pendientes inmediatamente
      pendingServices.value.splice(pendingIndex, 1)
      
      showSuccess(`${selectedTechnician.value.nombre} asignado al servicio exitosamente`) 
      await loadPendingServices(1, true) 
    }
    
    // Notificar al técnico vía WhatsApp
    sendWhatsAppNotification(techToNotify, serviceToNotify)
    
    showConfirmModal.value = false
    showAssignmentModal.value = false
    serviceToAssign.value = null
    selectedTechnician.value = null
  } catch (error) {
    console.error('Error en asignación de técnico:', error)
    showError('Error al asignar técnico')
  }
}

const verifyPayment = async (isApproved) => { 
  
  // Validar que se haya marcado el checkbox de verificación si se está aprobando
  if (isApproved && !paymentDetails.verified) {
    const errorMsg = 'Debes verificar el pago en tu banca móvil antes de aprobarlo';
    console.warn('⚠️ ' + errorMsg);
    showError(errorMsg);
    return;
  }
  
  try {
    // Obtener el ID de la cotización del servicio - intentar múltiples ubicaciones posibles
    const cotizacionId = serviceToPayment.value?.cotizacion?.id || 
                        serviceToPayment.value?.cotizacion?.id_cotizacion ||
                        serviceToPayment.value?.id_cotizacion ||
                        serviceToPayment.value?.cotizaciones?.[0]?.id ||
                        serviceToPayment.value?.cotizaciones?.[0]?.id_cotizacion ||
                        serviceToPayment.value?.id_cotizacion ||
                        serviceToPayment.value?.cotizacion_id ||
                        serviceToPayment.value?.id ||
                        serviceToPayment.value?.cotizacionId 
    
    // Obtener el ID de la solicitud - intentar múltiples ubicaciones posibles
    const solicitudId = serviceToPayment.value?.id_solicitud || 
                        serviceToPayment.value?.id ||
                        serviceToPayment.value?.idSolicitud ||
                        serviceToPayment.value?.solicitud_id
    
    if (!solicitudId) {
      console.error('ID de solicitud no encontrado en serviceToPayment:', serviceToPayment.value)
      showError('No se pudo encontrar el ID de la solicitud')
      return
    }
    
    // Obtener el ID del usuario - intentar múltiples ubicaciones posibles
    const idUsuario = serviceToPayment.value?.cliente?.id_cliente 
                      
    
    if (!idUsuario && !isApproved) {
      console.error('❌ ID de usuario no encontrado en serviceToPayment:', serviceToPayment.value)
      showError('No se pudo encontrar el ID del usuario')
      return
    }
    
    
    // Deshabilitar botones mientras se procesa
    isVerifying.value = true
    
    // Determinar el tipo de pago (visita o servicio)
    const isVisitPayment = paymentType.value === 'visit'
    
    if (isApproved) {
      // APROBAR PAGO 
      
      const endpoint = isVisitPayment ? '/pagovisita/confirmar' : '/pagoservicio/aceptar'
      const paymentPayload = { 
        id_solicitud: solicitudId,
        id_cotizacion: cotizacionId
      }  
      
      try {
        const response = await $api(endpoint, {
          method: 'POST',
          body: paymentPayload
        });
        
        // Si es una visita, notificar a los administradores
        if (isVisitPayment && response?.success) {
          try {
            // Notificar al super admin
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'Asignación Pendiente',
                nombre_rol: 'sa'
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación al super admin:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
          
          try {
            // Notificar a los administradores
            await $api('/notificaciones/enviar', {
              method: 'POST',
              body: {
                titulo: 'Asignación Pendiente',
                nombre_rol: 'admin'
              }
            });
          } catch (notificationError) {
            console.error('❌ Error al enviar notificación a los administradores:', notificationError);
            // No interrumpir el flujo si falla la notificación
          }
        } 
        
        // Obtener el ID del cliente de múltiples ubicaciones posibles
        const idUsuario = serviceToPayment.value?.cliente?.id_cliente ||
                         serviceToPayment.value?.id_cliente ||
                         serviceToPayment.value?.usuario?.id_cliente; 
                         
        if (!idUsuario) {
          const errorMsg = '⚠️ No se encontró el ID del cliente en el servicio.';
          console.warn(errorMsg);
          console.warn('Estructura completa de serviceToPayment:', JSON.parse(JSON.stringify(serviceToPayment?.value || {})));
          showError('No se pudo obtener el ID del cliente para la notificación');
          return;
        }
        
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Pago de Servicio Aprobado',
            id_usuario: idUsuario
          }
        });
      } catch (notifError) {
        console.error('Error al enviar notificación de pago aprobado:', notifError);
      }
      
    } else {
      // RECHAZAR PAGO DE SERVICIO
      const id_usuario = serviceToPayment.value?.cliente?.id_cliente 
      const endpoint = isVisitPayment ? '/pagovisita/denegar' : '/pagoservicio/denegar'
      const denyPayload = { id_solicitud: solicitudId, id_cotizacion: cotizacionId, id_usuario }
      
      const response = await $api(endpoint, {
        method: 'POST',
        body: denyPayload
      });
      
      // Notificar al cliente sobre el pago rechazado
      try { 
        
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Pago de Servicio Rechazado',
            id_usuario: id_usuario
          }
        }); 
      } catch (notifError) {
        console.error('Error al enviar notificación de pago rechazado:', notifError);
      }
    }
    
    // Actualizar la lista de servicios pendientes
    await loadPendingServices(1, true);
    
    // Cerrar el modal de pago y el modal de confirmación
    showPaymentModal.value = false;
    showPaymentConfirmationModal.value = false;
    serviceToPayment.value = null;
    paymentDetails.verified = false;
    
    // Mostrar mensaje de éxito
    showSuccess(isApproved ? 'Pago verificado correctamente' : 'Pago rechazado correctamente');
    
  } catch (error) {
    console.error('Error al verificar el pago:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      response: error.data,
      stack: error.stack
    })
    showError(`Error al procesar el pago: ${error.message || 'Error desconocido'}`)
  } finally {
    isVerifying.value = false
  }
} 

const resetPaymentDetails = () => {
  paymentDetails.verified = false
  paymentDetails.adminNotes = ''
  isVerifying.value = false
  showPaymentConfirmationModal.value = false
  pendingPaymentAction.value = null
} 

// ===== MÉTODOS PARA ASIGNACIÓN DE PAQUETES =====
const openPackageAssignment = async (pkg) => {
  try {
    selectedPackage.value = pkg
    selectedPackageTechnician.value = null
    isAssigningPackage.value = true
    showLiquidacionModal.value = true
    techSearchQuery.value = '' // Resetear búsqueda al abrir
    
    // Obtener el ID de la ciudad del usuario que tiene el paquete
    const cityId = pkg.Usuario?.ciudad?.id_ciudad || pkg.Usuario?.id_ciudad;
    
    // Actualizar el selectedTechCityObject si se encontró una ciudad
    if (cityId) {
      // Si ya tenemos las ciudades cargadas, buscar la ciudad
      if (cities.value.length > 0) {
        const city = cities.value.find(c => c.id_ciudad === cityId);
        if (city) {
          selectedTechCityObject.value = city;
        }
      } else {
        // Si no tenemos las ciudades, cargarlas primero
        await fetchCities();
        const city = cities.value.find(c => c.id_ciudad === cityId);
        if (city) {
          selectedTechCityObject.value = city;
        }
      }
    }
    
    // Cargar técnicos, administradores y super admins de la misma ciudad que el usuario
    const result = await fetchTechniciansAndAdmins(cityId, techsPerPage, 0);
    
    // Actualizar las variables reactivas con los resultados
    availableTechnicians.value = result.data || [];
    techniciansTotal.value = result.total || 0;
    currentTechPage.value = result.page || 1;
    totalTechPages.value = result.totalPages || 1;
    
    // Asegurarse de que los datos estén actualizados
    await fetchActivePackages(true)
  } catch (error) {
    console.error('Error al abrir el modal de asignación:', error)
    showError('No se pudo cargar la información de asignación')
  } finally {
    isAssigningPackage.value = false
  }
}

const selectPackageTechnician = async (tech) => {
  if (tech.estado !== 'activo') return;
  
  try {
    selectedPackageTechnician.value = tech;
    
    // Obtener el porcentaje de comisión
    const comisionResponse = await $api('/config/valor/comision_por_paquete', {
      method: 'GET'
    });
    
    comisionPorcentaje.value = parseFloat(comisionResponse.valor) || 0;
    
    // Mostrar modal de confirmación y cerrar el modal de selección
    showPackageConfirmModal.value = true;
    showLiquidacionModal.value = false;
    
  } catch (error) {
    console.error('Error al obtener la comisión:', {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    showError('No se pudo obtener la información de comisión');
  }
}

const confirmPackageAssignment = async () => {
  try {
    const montoPaquete = parseFloat(selectedPackage.value.paquete.costo) || 0;
    const porcentajeTecnico = 100 - comisionPorcentaje.value;
    const montoTecnico = (montoPaquete * porcentajeTecnico) / 100;
    
    // 1. Enviar movimiento de ingreso
    const movimientoResponse = await $api('/movimientos', {
      method: 'POST',
      body: {
        id_usuario: Number(selectedPackageTechnician.value.id_usuario),
        tipo: "ingreso",
        monto: Number(montoTecnico.toFixed(2)),
        descripcion: `Ingreso por Paquete ${selectedPackage.value.paquete.nombre}`,
        estado: 'completado'
      }
    });

    // 2. Marcar el paquete como utilizado
    try {
      await $api(`/paquetes/usuarios/utilizado/${selectedPackage.value.id_paquete_usuario}`, {
        method: 'PUT'
      });

      // 3. Enviar notificaciones
      try {
        // Notificación al cliente
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Paquete Consumido',
            id_usuario: selectedPackage.value.id_usuario
          }
        });

        // Notificación al técnico
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Pago de Paquete Recibido',
            id_usuario: selectedPackageTechnician.value.id_usuario
          }
        });
      } catch (notifError) {
        console.error('Error al enviar notificaciones:', notifError);
      }

    } catch (error) {
      console.error('Error al marcar el paquete como utilizado:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }); 
      throw error; // Relanzar el error para que lo capture el catch externo
    }

    // Cerrar modales primero para mejor experiencia de usuario
    showPackageConfirmModal.value = false;
    showLiquidacionModal.value = false;
    
    // Mostrar mensaje de éxito
    showSuccess(`Se ha liquidado L.${montoTecnico.toFixed(2)} al técnico ${selectedPackageTechnician.value.nombre}`);
    
    // Forzar una recarga completa de los paquetes
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequeño retraso
    await fetchActivePackages(true); // Forzar recarga completa
    
    // Si estamos en la pestaña de 'utilizado', forzar recarga de esa pestaña
    if (activePackageTab.value === 'utilizado') {
      await fetchActivePackages(true);
    }
    
  } catch (error) {
    console.error('Error en la solicitud:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    showError(error.response?.data?.message || 'Error al procesar la liquidación');
  }
};

// ===== FUNCIONES DE PAGINACIÓN =====
const changePendingPage = async (page) => {
  if (page < 1) return;
  if (loadingPending.value) return;
  
  await loadPendingServices(page, page === 1);
  
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

const changeHistoryPage = async (page) => {
  const totalPages = Math.ceil(totalHistoryItems.value / historyItemsPerPage);
  
  // Validar que la página esté en un rango válido
  if (page < 1 || page > totalPages) {
    console.warn(`Página ${page} fuera de rango. Total de páginas: ${totalPages}`);
    return;
  } 
  
  try {
    // Forzar una actualización de la interfaz para mostrar el estado de carga
    loadingHistory.value = true;
    
    // Esperar un tick para asegurar que la UI se actualice
    await nextTick();
    
    // Cargar los datos de la página solicitada
    await loadHistoryServices(page, false);
    
    // Verificar que los datos se cargaron correctamente
    if (historyServices.value.length === 0 && totalHistoryItems.value > 0) {
      console.warn('No se cargaron servicios a pesar de que debería haber datos');
      // Intentar recargar la página actual
      await loadHistoryServices(page, true);
    }
    
    // Desplazarse suavemente hacia arriba
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
  } catch (error) {
    console.error('Error al cambiar de página de historial:', error);
    showError('Error al cargar la página solicitada');
  } finally {
    loadingHistory.value = false;
  }
}

// ===== WATCHERS =====
// Observar cambios en la pestaña activa para cargar los datos correspondientes
watch(activePackageTab, (newTab) => {
  if (newTab) {
    fetchActivePackages(true);
  }
}, { immediate: true });

// Variables para almacenar los timeouts del debounce
let searchDebounceTimeout = null;
let spinnerDebounceTimeout = null;

// Watch con debounce para el campo de búsqueda
watch(searchQuery, () => {
  // Limpiar los timeouts anteriores si existen
  if (searchDebounceTimeout) {
    clearTimeout(searchDebounceTimeout)
  }
  if (spinnerDebounceTimeout) {
    clearTimeout(spinnerDebounceTimeout)
  }
  
  // Ocultar spinner al escribir
  isSearching.value = false
  
  // Si el campo está vacío, ejecutar inmediatamente sin spinner
  if (!searchQuery.value.trim()) {
    currentHistoryPage.value = 1
    loadHistoryServices(1, true)
    return
  }
  
  // Mostrar spinner después de 1 segundo de inactividad
  spinnerDebounceTimeout = setTimeout(() => {
    isSearching.value = true
  }, 1000)
  
  // Ejecutar búsqueda después de 2 segundos de inactividad
  searchDebounceTimeout = setTimeout(async () => {
    currentHistoryPage.value = 1
    await loadHistoryServices(1, true)
    // Desactivar spinner después de cargar
    isSearching.value = false
  }, 2000)
})

// Watch para sincronizar selectedStatus con selectedStatusObject
watch(() => selectedStatus.value, (newValue) => {
  if (newValue !== null && newValue !== undefined) {
    const statusObject = statusOptions.find(option => option.value === newValue);
    if (statusObject) {
      selectedStatusObject.value = statusObject;
    }
  } else {
    selectedStatusObject.value = statusOptions[0]; // "Todos los estados"
  }
});

// Watch para sincronizar selectedStatusObject con selectedStatus
watch(() => selectedStatusObject.value, (newObject) => {
  if (newObject && newObject.value !== undefined) {
    selectedStatus.value = newObject.value;
  } else {
    selectedStatus.value = '';
  }
});

// Watch para sincronizar selectedServiceType con selectedServiceTypeObject
watch(() => selectedServiceType.value, (newValue) => {
  if (newValue && catalogoServicios.value.length > 0) {
    const serviceObject = catalogoServicios.value.find(service => service.id_servicio === newValue);
    if (serviceObject) {
      selectedServiceTypeObject.value = serviceObject;
    }
  } else {
    selectedServiceTypeObject.value = null;
  }
});

// Watch para sincronizar selectedServiceTypeObject con selectedServiceType
watch(() => selectedServiceTypeObject.value, (newObject) => {
  if (newObject && newObject.id_servicio !== undefined) {
    selectedServiceType.value = newObject.id_servicio;
  } else {
    selectedServiceType.value = '';
  }
});

// Watch para sincronizar selectedTechCity con selectedTechCityObject
watch(() => selectedTechCity.value, (newValue) => {
  if (newValue && availableCities.value.length > 0) {
    const cityObject = availableCities.value.find(city => city.nombre_ciudad === newValue);
    if (cityObject) {
      selectedTechCityObject.value = cityObject;
    }
  } else {
    selectedTechCityObject.value = null;
  }
});

// Watch para sincronizar selectedTechCityObject con selectedTechCity
watch(() => selectedTechCityObject.value, async (newCity) => {
  if (newCity) {
    selectedTechCity.value = newCity.nombre_ciudad;
  } else {
    selectedTechCity.value = '';
  }
  // Resetear paginación y volver a cargar técnicos
  currentTechPage.value = 1;
  
  if (showLiquidacionModal.value) {
    const result = await fetchTechniciansAndAdmins(newCity?.id_ciudad, techsPerPage, 0, serviceToAssign.value?.id_servicio, techSearchQuery.value);
    // Actualizar las variables reactivas con los resultados
    availableTechnicians.value = result.data || [];
    techniciansTotal.value = result.total || 0;
    currentTechPage.value = result.page || 1;
    totalTechPages.value = result.totalPages || 1;
  } else if (showAssignmentModal.value) {
    await fetchTechnicians(newCity?.id_ciudad, techsPerPage, 0, serviceToAssign.value?.id_servicio);
  }
});

// Watch para los demás filtros (sin debounce, se ejecutan inmediatamente)
watch([selectedStatus, selectedServiceType, selectedMonth], () => {
  currentHistoryPage.value = 1
  loadHistoryServices(1, true)
})

// Búsqueda de técnicos con debounce
const handleTechSearch = async () => {
  isSearchingTech.value = true
  currentTechPage.value = 1
  try {
    const cityId = selectedPackage.value?.Usuario?.ciudad?.id_ciudad || 
                  selectedPackage.value?.Usuario?.id_ciudad || 
                  selectedTechCityObject.value?.id_ciudad;
    
    const result = await fetchTechniciansAndAdmins(cityId, techsPerPage, 0, serviceToAssign.value?.id_servicio, techSearchQuery.value);
    
    availableTechnicians.value = result.data || [];
    techniciansTotal.value = result.total || 0;
    totalTechPages.value = result.totalPages || 1;
  } finally {
    isSearchingTech.value = false
  }
}

const debouncedTechSearch = useDebounceFn(handleTechSearch, 600)

// Watch para buscar cuando cambie el query de búsqueda de técnicos
watch(() => techSearchQuery.value, () => {
  debouncedTechSearch()
})

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    // Cargar datos iniciales
    await Promise.all([ 
      fetchCatalogoServicios(),
      fetchCities(),
      fetchTechnicians(),
      loadPendingServices(),
      loadHistoryServices(),
      fetchActivePackages()
    ])
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false
  }
})

</script>

<style scoped>
/* Animaciones para modales */
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

/* Transiciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Estilos generales */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: rgba(34, 197, 94, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.6);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 