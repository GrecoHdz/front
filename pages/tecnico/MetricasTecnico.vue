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

    <!-- Header con notificaciones -->
    <HeadersHeaderMetricasTecnico />

    <!-- Content Container -->
    <div class="max-w-xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen pb-20">
      
      <!-- Balance y Ganancias -->
      <section class="px-3 sm:px-4 py-3 sm:py-4">
        <div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-3 sm:mb-4">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <p class="text-green-100 text-xs sm:text-sm font-medium">Balance Disponible</p>
              <p class="text-2xl sm:text-3xl font-black">L. {{ formatCurrency(balance.balanceDisponible) }}</p>
            </div>
            <button @click="openWithdrawModal" 
                    class="bg-white/20 hover:bg-white/30 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-colors">
              💳 Retirar
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p class="text-green-100 text-xs">Último Retiro</p>
              <p class="text-lg sm:text-xl font-bold">{{ balance.ultimoRetiro !== null ? `L. ${formatCurrency(parseFloat(balance.ultimoRetiro))}` : 'N/A' }}</p>
            </div>
            <div>
              <p class="text-green-100 text-xs">Último Ingreso</p>
              <p class="text-lg sm:text-xl font-bold">{{ balance.ultimoIngreso !== null ? `L. ${formatCurrency(parseFloat(balance.ultimoIngreso))}` : 'N/A' }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Estadísticas Generales -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-3 sm:mb-4">Estadísticas Generales</h2>
        <div class="grid grid-cols-2 gap-2 sm:gap-3">
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-lg">🛠️</span>
              </div>
              <div>
                <p class="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">{{ stats.totalServices }}</p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400">Servicios Totales</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <span class="text-yellow-600 dark:text-yellow-400 text-sm sm:text-lg">⭐</span>
              </div>
              <div>
                <p class="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">{{ averageRating }}</p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400">Calificación</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span class="text-purple-600 dark:text-purple-400 text-sm sm:text-lg">📅</span>
              </div>
              <div>
                <p class="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">{{ stats.last3Months }}</p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400">Últimos 3 Meses</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span class="text-green-600 dark:text-green-400 text-sm sm:text-lg">📈</span>
              </div>
              <div>
                <p class="text-lg sm:text-2xl font-black text-gray-900 dark:text-white">{{ stats.thisMonth }}</p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400">Este Mes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Selector de Gráficos -->
      <section class="px-3 sm:px-4 mb-3 sm:mb-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Análisis de Datos</h2>
          <multiselect
            v-model="selectedChartObject"
            :options="availableCharts"
            :searchable="false"
            :close-on-select="true"
            :show-labels="false"
            placeholder="Seleccionar gráfico"
            label="name"
            track-by="id"
            class="multiselect-custom"
            :class="{ 'multiselect--active': selectedChartObject }"
            :select-label="''"
            :deselect-label="''"
            :selected-label="''"
            :custom-label="getChartLabel"
            @search-change="$event && $event.stopPropagation()"
            @search-focus="(e) => e && e.target && e.target.blur()"
            @touchstart.native.stop
            @click.native.stop
            :options-limit="100"
          >
            <template #singleLabel="{ option }">
              <span class="text-xs truncate">{{ getChartLabel(option) }}</span>
            </template>
          </multiselect>
        </div>
      </section>

      <!-- Gráfico Dinámico -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative">
          <div class="h-56 sm:h-64 relative">
            <!-- Mensaje cuando no hay servicios -->
            <div 
              v-if="selectedChart === 'serviceTypes' && serviceTypesData.labels.length === 1 && 
                   (serviceTypesData.labels[0] === 'Sin servicios' || serviceTypesData.labels[0] === 'Error al cargar' || serviceTypesData.labels[0] === 'Sin datos')"
              class="absolute inset-0 flex items-center justify-center"
            >
              <div class="text-center">
                <div class="text-gray-400 dark:text-gray-500 mb-2">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {{ serviceTypesData.labels[0] === 'Sin servicios' ? 'No tienes servicios registrados' : 
                     serviceTypesData.labels[0] === 'Error al cargar' ? 'Error al cargar datos' : 'No hay datos disponibles' }}
                </p>
                <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {{ serviceTypesData.labels[0] === 'Sin servicios' ? 'Los servicios que realices aparecerán aquí' : '' }}
                </p>
              </div>
            </div>
            <!-- Canvas del gráfico -->
            <canvas 
              :id="'chart-' + selectedChart" 
              class="w-full h-full"
              :class="{ 'opacity-0': selectedChart === 'serviceTypes' && serviceTypesData.labels.length === 1 && 
                       (serviceTypesData.labels[0] === 'Sin servicios' || serviceTypesData.labels[0] === 'Error al cargar' || serviceTypesData.labels[0] === 'Sin datos') }"
            ></canvas>
          </div>
        </div>
      </section>

      <!-- Historial de Ingresos/Retiros con pestañas -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div class="flex space-x-1 sm:space-x-2">
            <button 
              @click="setActiveTab('ingresos')"
              :class="{
                'bg-blue-600 text-white': activeTab === 'ingresos',
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300': activeTab !== 'ingresos'
              }"
              class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-l-lg font-medium text-xs sm:text-sm transition-colors"
            >
              Ingresos
            </button>
            <button 
              @click="setActiveTab('retiros')"
              :class="{
                'bg-blue-600 text-white': activeTab === 'retiros',
                'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300': activeTab !== 'retiros'
              }"
              class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-r-lg font-medium text-xs sm:text-sm transition-colors"
            >
              Retiros
            </button>
          </div>

          <!-- Selector de fecha tipo mes -->
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input 
                type="date"
                :value="(activeTab === 'ingresos' ? selectedMonth : selectedWithdrawMonth) + '-01'"
                @change="(e) => handleMonthChange(e, activeTab)"
                class="bg-gray-800 border border-gray-700 text-white text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 sm:pl-3 pr-8 sm:pr-10 py-1 sm:py-1.5"
              />
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <!-- ==================== INGRESOS ==================== -->
          <template v-if="activeTab === 'ingresos'">
            <div v-if="isLoadingMovements" class="text-center py-6 sm:py-8">
              <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cargando ingresos...</p>
            </div>

            <div v-else-if="earnings.length === 0" class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Sin ingresos registrados</h3>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ getNoEarningsMessage() }}</p>
            </div>

            <template v-else>
              <template v-for="(earning, index) in visibleEarnings" :key="earning.id_movimiento">
                <div
                  class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ earning.servicio || 'Servicio no especificado' }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          {{ formatDate(earning.fecha) }} • {{ earning.colonia || 'Sin ubicación' }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-green-600 dark:text-green-400 text-sm sm:text-base">+L. {{ formatCurrency(earning.monto) }}</p>
                      <p class="text-xs" :class="getStatusColor(earning.estado)">
                        {{ earning.estado }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Paginación de Ingresos -->
              <div v-if="earnings.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Página {{ earningsPagination.currentPage }} de {{ earningsPagination.totalPages }}
                  </div>
                  <div class="flex items-center space-x-1">
                    <button 
                      @click="loadMovements(earningsPagination.currentPage - 1)" 
                      :disabled="earningsPagination.currentPage === 1 || isLoadingMovements"
                      class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      :class="{ 'cursor-not-allowed': earningsPagination.currentPage === 1 }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ earningsPagination.currentPage }} / {{ earningsPagination.totalPages }}
                    </span>
                    <button 
                      @click="loadMovements(earningsPagination.currentPage + 1)" 
                      :disabled="!earningsPagination.hasMore || isLoadingMovements"
                      class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      :class="{ 'cursor-not-allowed': !earningsPagination.hasMore }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Resumen -->
              <div v-if="movementSummary" class="mt-3 sm:mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-100 dark:border-green-800/30">
                <div class="flex items-center justify-between">
                  <span class="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                    Total {{ movementSummary.mes.toLowerCase() }}
                  </span>
                  <span class="text-base sm:text-lg font-bold text-green-800 dark:text-green-200">
                    L. {{ formatCurrency(movementSummary.totalIngresos) }}
                  </span>
                </div>
              </div>
            </template>
          </template>

          <!-- ==================== RETIROS ==================== -->
          <template v-else>
            <div v-if="isLoadingMovements" class="text-center py-6 sm:py-8">
              <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cargando retiros...</p>
            </div>

            <div v-else-if="withdrawals.length === 0" class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
              <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Sin retiros registrados</h3>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ getNoWithdrawalsMessage() }}</p>
            </div>

            <template v-else>
              <template v-for="(withdrawal, index) in visibleWithdrawals" :key="withdrawal.id_movimiento">
                <div
                  class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2 hover:shadow-md transition-shadow"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                          Retiro de Fondos
                        </p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          {{ formatDate(withdrawal.fecha) }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-yellow-600 dark:text-yellow-400 text-sm sm:text-base">L. {{ formatCurrency(withdrawal.monto) }}</p>
                      <p class="text-xs" :class="getStatusWithDrawalColor(withdrawal.estado)">
                        {{ withdrawal.estado }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Paginación de Retiros -->
              <div v-if="withdrawals.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                <div class="flex items-center justify-between">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    Página {{ withdrawalsPagination.currentPage }} de {{ withdrawalsPagination.totalPages }}
                  </div>
                  <div class="flex items-center space-x-1">
                    <button 
                      @click="loadMovements(withdrawalsPagination.currentPage - 1)" 
                      :disabled="withdrawalsPagination.currentPage === 1 || isLoadingMovements"
                      class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      :class="{ 'cursor-not-allowed': withdrawalsPagination.currentPage === 1 }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      {{ withdrawalsPagination.currentPage }} / {{ withdrawalsPagination.totalPages }}
                    </span>
                    <button 
                      @click="loadMovements(withdrawalsPagination.currentPage + 1)" 
                      :disabled="!withdrawalsPagination.hasMore || isLoadingMovements"
                      class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      :class="{ 'cursor-not-allowed': !withdrawalsPagination.hasMore }"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Resumen -->
              <div v-if="movementSummary" class="mt-3 sm:mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg sm:rounded-xl">
                <div class="flex items-center justify-between">
                  <span class="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">
                    Total {{ movementSummary.mes }}
                  </span>
                  <span class="text-base sm:text-lg font-bold text-red-800 dark:text-red-200">
                    L. {{ formatCurrency(movementSummary.totalRetiros) }}
                  </span>
                </div>
              </div>
            </template>
          </template>
        </div>
      </section>

      <!-- Calificaciones Recientes -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Calificaciones Recientes</h2>
          <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ reviews.length }} calificaciones</span>
        </div>
        
        <!-- Mensaje cuando no hay calificaciones -->
        <div v-if="reviews.length === 0" class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div class="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-2 sm:mb-3">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Sin calificaciones aún</h3>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Completa más servicios para recibir valoraciones de tus clientes
          </p>
        </div>

        <!-- Lista de calificaciones -->
        <template v-else>
          <div v-if="isLoadingReviews" class="text-center py-6 sm:py-8">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cargando calificaciones...</p>
          </div>
          
          <template v-else>
            <div class="space-y-2 sm:space-y-3">
              <div v-for="review in reviews" :key="review.id || `${review.nombre_cliente}-${review.fecha}`"
                   class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-start justify-between mb-2 sm:mb-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span class="text-white text-xs sm:text-sm font-bold">{{ getInitials(review.nombre_cliente) }}</span>
                      </div>
                      <div class="flex-1">
                        <p class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ review.nombre_cliente }}</p>
                        <div class="flex items-center space-x-2">
                          <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(review.fecha) }}</p>
                          <span class="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {{ review.id_servicio }} - {{ review.nombre_servicio }}
                          </span>
                        </div>
                      </div>
                    </div>
                  <div class="flex items-center space-x-1">
                    <span v-for="i in 5" :key="i" 
                          :class="i <= Number(review.calificacion) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'"
                          class="text-xs sm:text-sm">
                      <template v-if="i <= Math.floor(Number(review.calificacion))">
                        <span class="text-yellow-400">⭐</span>
                      </template>
                      <template v-else-if="i === Math.ceil(Number(review.calificacion)) && Number(review.calificacion) % 1 > 0">
                        <span class="relative inline-block">
                          <span class="text-gray-300 dark:text-gray-600">⭐</span>
                          <span class="absolute left-0 overflow-hidden" :style="{ width: (Number(review.calificacion) % 1) * 100 + '%' }">
                            <span class="text-yellow-400">⭐</span>
                          </span>
                        </span>
                      </template> 
                    </span>
                    <span class="text-xs text-gray-600 dark:text-gray-400 ml-1">({{ Number(review.calificacion).toFixed(1) }}/5)</span>
                  </div>
                </div>
                <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mt-2">{{ review.comentario }}</p>
              </div>
            </div>

            <!-- Paginación de Calificaciones -->
            <div v-if="reviews.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  Página {{ reviewsPagination.currentPage }} de {{ reviewsPagination.totalPages }}
                </div>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="loadReviews(reviewsPagination.currentPage - 1)" 
                    :disabled="reviewsPagination.currentPage === 1 || isLoadingReviews"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': reviewsPagination.currentPage === 1 }"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  
                  <span class="px-2 text-xs text-gray-600 dark:text-gray-300">
                    {{ reviewsPagination.currentPage }} / {{ reviewsPagination.totalPages }}
                  </span>
                  
                  <button 
                    @click="loadReviews(reviewsPagination.currentPage + 1)" 
                    :disabled="!reviewsPagination.hasMore || isLoadingReviews"
                    class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': !reviewsPagination.hasMore }"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </template>
      </section>

      <FootersFooterTecnico />
    </div>

    <!-- Modal de Retiro -->
    <div v-if="showWithdrawModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeWithdrawModal"></div>
      <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto relative z-10">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg">
                💳
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Retirar Dinero</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Balance: L. {{ formatCurrency(balance.balanceDisponible) }}</p>
              </div>
            </div>
            <button @click="closeWithdrawModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-3 sm:p-4">
          <!-- Monto a retirar -->
          <div class="mb-4 sm:mb-6">
            <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Monto a retirar</label>
            <div class="relative">
              <span class="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm sm:text-base">L.</span>
              <input v-model.number="withdrawForm.amount" 
                     type="number" 
                     step="0.01" 
                     :max="balance.balanceDisponible"
                     min="1"
                     class="w-full pl-6 sm:pl-8 pr-3 sm:pr-4 py-2 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" 
                     placeholder="0.00">
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Mínimo: L. 100.00</p>
          </div>

          <!-- Datos Bancarios -->
          <div class="mb-4 sm:mb-6">
            <label class="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Datos Bancarios</label>
            <textarea v-model="withdrawForm.bankDetails" 
                      rows="4" 
                      class="w-full px-2 sm:px-3 py-2 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" 
                      placeholder="Ingresa donde deseas recibir tu retiro: Banco, Número de Cuenta, Titular, Tipo de cuenta"></textarea>
          </div>

          <!-- Botón de confirmar -->
          <button @click="processWithdraw" 
                  :disabled="!canProcessWithdraw || isProcessingWithdraw"
                  class="w-full py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg sm:rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base">
            <span v-if="!isProcessingWithdraw">
              Solicitar Retiro
            </span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          </button>

          <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 sm:mt-3">
            Los retiros se procesan en 1-3 días hábiles
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useAuthStore } from '~/middleware/auth.store';
import Toast from '~/components/ui/Toast.vue';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import Multiselect from 'vue-multiselect'

// SEO and Meta
useHead({
  title: 'HogarSeguro - Metricas Técnico',
  meta: [
    { name: 'description', content: 'Panel de Metricas Técnico - Gestiona tus metricas' },
    { name: 'keywords', content: 'HogarSeguro, Panel Metricas Técnico, Técnico, Metricas' }, 
    { name: 'viewport', content: 'width=device-width, initial-scale=0.9, user-scalable=no' }
  ]
})

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// ===== VARIABLES DE ESTADO =====
const currentUser = ref(auth.user)
const isLoading = ref(false)
const isLoadingMovements = ref(false)
const isProcessingWithdraw = ref(false)
const showWithdrawModal = ref(false)

// Fechas
const currentMonth = new Date().toISOString().slice(0, 7)
const selectedMonth = ref(currentMonth)
const selectedWithdrawMonth = ref(currentMonth)

// UI State
const activeTab = ref('ingresos')
const selectedChart = ref('earnings')
const selectedChartObject = ref(null)
const reviews = ref([])

// Función para obtener la etiqueta del gráfico
const getChartLabel = (option) => {
  if (!option) return ''
  return option.name || ''
}

// Visible items for earnings and withdrawals
const visibleEarningsCount = ref(3)
const visibleWithdrawalsCount = ref(3)

// Datos
const earnings = ref([])
const withdrawals = ref([])
const movementSummary = ref(null)

// Estado de paginación
const currentPage = ref(1)
const itemsPerPage = 2 // Mostrar solo 2 ítems por página para ver la paginación en acción
const totalItems = ref(0)
const hasMoreItems = ref(true)

// Paginación para reseñas
const reviewsPagination = ref({
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  totalItems: 0,
  itemsPerPage: 3
})

const isLoadingReviews = ref(false)

// Configuración de caché para reseñas 
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milisegundos
 
 

// Paginación
const earningsPagination = ref({
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  totalItems: 0
})

const withdrawalsPagination = ref({
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  totalItems: 0
})

// Variables de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// ===== DATOS REACTIVOS =====
// Estado reactivo para el balance
const balance = ref({
  balanceDisponible: 0,
  ultimoRetiro: null,
  ultimoIngreso: null
});

// Estadísticas
const stats = reactive({
  totalServices: 0,
  rating: 4.8,
  last3Months: 0,
  thisMonth: 0
})

// Formulario de retiro
const withdrawForm = reactive({
  amount: 0,
  bankDetails: ''
})

// ===== CONSTANTES =====
// Gráficos disponibles
const availableCharts = [
  { id: 'earnings', name: '📈 Ingresos Mensuales' },
  { id: 'serviceTypes', name: '🛠️ Servicios por Tipo' },
  { id: 'services', name: '📊 Servicios por Mes' }
]

// Datos para gráficos
const monthlyIncomes = ref([])
const monthlyServices = ref([])
const earningsData = reactive({
  labels: [],
  datasets: [{
    label: 'Ingresos Mensuales',
    data: [],
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    tension: 0.4,
    fill: true
  }]
})

const serviceTypesData = reactive({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
    borderWidth: 0
  }]
})

const servicesData = reactive({
  labels: [],
  datasets: [{
    label: 'Servicios Realizados',
    data: [],
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
})

// ===== COMPUTED PROPERTIES =====
const canProcessWithdraw = computed(() => {
  return withdrawForm.amount >= 1 && 
         withdrawForm.amount <= balance.value.balanceDisponible && 
         withdrawForm.bankDetails.trim().length > 10
})

const averageRating = computed(() => {
  // Usar el rating de las estadísticas generales que se carga desde el endpoint
  return stats.rating.toFixed(1);
})

const visibleEarnings = computed(() => {
  return earnings.value.slice(0, visibleEarningsCount.value)
})

const visibleWithdrawals = computed(() => {
  return withdrawals.value.slice(0, visibleWithdrawalsCount.value)
})

// ===== FUNCIONES DE UTILIDAD =====
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0.00'
  return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase()
  if (statusLower === 'completado') return 'text-green-600 dark:text-green-400'
  if (statusLower === 'rechazado') return 'text-red-600 dark:text-red-400'
  return 'text-yellow-600 dark:text-yellow-400'
}

const getStatusWithDrawalColor = (status) => {
  const statusLower = status?.toLowerCase()
  if (statusLower === 'completado') return 'text-green-600 dark:text-green-400'
  if (statusLower === 'rechazado') return 'text-red-600 dark:text-red-400'
  return 'text-yellow-600 dark:text-yellow-400'
}

const getInitials = (name) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

const compactNumber = (num) => {
  const isMobile = window.innerWidth < 640; // Breakpoint de Tailwind sm
  
  if (!isMobile) {
    return num.toLocaleString('es-HN');
  }
  
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  
  return num.toString();
}

const getNoEarningsMessage = () => {
  if (!selectedMonth.value) return 'Selecciona un mes para ver los ingresos.'
  
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  if (isLoadingMovements.value) {
    return 'Cargando ingresos...'
  }
  
  return `No se encontraron ingresos para ${monthNames[month - 1]} de ${year}.`
}

const getNoWithdrawalsMessage = () => {
  if (!selectedWithdrawMonth.value) return 'Selecciona un mes para ver los retiros.'
  
  const [year, month] = selectedWithdrawMonth.value.split('-').map(Number)
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  if (isLoadingMovements.value) {
    return 'Cargando retiros...'
  }
  
  return `No se encontraron retiros para ${monthNames[month - 1]} de ${year}.`
}

const getWithdrawalNumber = (withdrawal) => {
  if (!withdrawal?.fecha) return '--'
  
  const allWithdrawals = [...withdrawals.value]
  allWithdrawals.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  
  const index = allWithdrawals.findIndex(w => w.id_movimiento === withdrawal.id_movimiento)
  return index >= 0 ? index + 1 : '--'
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

// Configuración de caché para movimientos
const MOVEMENTS_CACHE_KEY = 'prohogar_technician_movements_cache'
const MOVEMENTS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Obtener movimientos del caché
const getCachedMovements = (cacheKey) => {
  try {
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}')
    // Verificar que el caché tenga datos y no esté vencido
    if (cache && cache.items && cache.timestamp && 
        (Date.now() - cache.timestamp) < MOVEMENTS_CACHE_DURATION) {
      return cache
    }
    // Si el caché está vencido o no tiene datos, devolver null
    return null
  } catch (error) {
    console.error('Error al leer el caché de movimientos:', error)
    return null
  }
}

// Guardar movimientos en caché
const cacheMovements = (cacheKey, data) => {
  try {
    const cacheData = {
      ...data,
      timestamp: Date.now()
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error al guardar en caché los movimientos:', error)
    // Si hay un error de cuota, limpiar caché antiguo
    if (error.name === 'QuotaExceededError') {
      clearOldCache()
    }
  }
}

// Limpiar caché antiguo
const clearOldCache = () => {
  try {
    const now = Date.now()
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(MOVEMENTS_CACHE_KEY)) {
        try {
          const cache = JSON.parse(localStorage.getItem(key) || '{}')
          if (now - (cache.timestamp || 0) > MOVEMENTS_CACHE_DURATION * 2) {
            localStorage.removeItem(key)
          }
        } catch (e) {
          // Si hay error al parsear, eliminar la entrada
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.error('Error al limpiar caché antiguo:', error)
  }
}

// Limpiar caché de movimientos
const clearMovementsCache = (userId = null, movementType = null) => {
  try {
    const user = userId || userCookie.value?.id_usuario;
    if (!user) return;

    // Si no se especifica el tipo, limpiar ambos
    const types = movementType ? [movementType] : ['ingresos', 'retiros'];
    
    types.forEach(type => {
      // Eliminar todas las entradas de caché para el tipo de movimiento
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`${MOVEMENTS_CACHE_KEY}_${user}_${type}`)) {
          localStorage.removeItem(key);
        }
      });
    });
    
    console.log('Caché de movimientos limpiado correctamente');
  } catch (error) {
    console.error('Error al limpiar la caché de movimientos:', error);
  }
};

// ===== FUNCIONES DE CARGA DE DATOS =====
const loadMovements = async (page = 1, forceRefresh = false) => {
  try {
    isLoadingMovements.value = true;
    const userId = userCookie.value.id_usuario;
    if (!userId) throw new Error('Error al obtener Usuario. Recargue la página.');

    const movementType = activeTab.value;
    const selectedMonthValue = movementType === 'ingresos' ? selectedMonth.value : selectedWithdrawMonth.value;
    let year, monthNum;
    
    if (selectedMonthValue) {
      const [y, m] = selectedMonthValue.split('-');
      year = parseInt(y);
      monthNum = parseInt(m);
    } else {
      const now = new Date();
      year = now.getFullYear();
      monthNum = now.getMonth() + 1;
    }

    const tipoMovimiento = movementType === 'ingresos' ? 'ingresos' : 'retiro';
    
    // Crear clave de caché sin timestamp para reutilización
    const cacheKey = `${MOVEMENTS_CACHE_KEY}_${userId}_${movementType}_${year}-${String(monthNum).padStart(2, '0')}_page_${page}`;
    
    // Verificar caché primero si no es una recarga forzada
    if (!forceRefresh) {
      try {
        const cachedData = getCachedMovements(cacheKey);
        if (cachedData) {
          if (movementType === 'ingresos') {
            earnings.value = cachedData.items;
            earningsPagination.value = cachedData.pagination;
          } else {
            withdrawals.value = cachedData.items;
            withdrawalsPagination.value = cachedData.pagination;
          }
          // Verificar si los datos están a punto de vencer (menos de 1 minuto de vida restante)
          const cacheAge = Date.now() - (cachedData.timestamp || 0);
          const timeUntilRefresh = (MOVEMENTS_CACHE_DURATION - cacheAge) - (4 * 60 * 1000); // 4 minutos
          
          // Si faltan menos de 4 minutos para que el caché expire, actualizar en segundo plano
          if (timeUntilRefresh <= 0) {
            // Usar setTimeout para no bloquear la interfaz
            setTimeout(() => {
              loadMovements(page, true).catch(console.error);
            }, 1000); // Pequeño retraso para no sobrecargar
          }
          isLoadingMovements.value = false;
          return;
        }
      } catch (e) {
        console.warn('Error al leer caché, cargando datos frescos', e);
      }
    }
    
    // Si no hay datos en caché o es una recarga forzada, hacer la petición a la API
    const response = await $api(`/movimientos/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      params: { 
        mes: monthNum, 
        tipo: tipoMovimiento,
        page: page,
        limit: itemsPerPage,
        _t: forceRefresh ? Date.now() : undefined // Forzar recarga solo cuando sea necesario
      },
      // Asegurarse de no usar caché del navegador
      headers: forceRefresh ? { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } : {}
    });
    
    if (response) {
      const items = response.data.map(item => ({
        id_movimiento: item.id_movimiento,
        monto: parseFloat(item.monto) || 0,
        fecha: item.fecha,
        estado: movementType === 'ingresos' ? (item.estado || 'Pendiente') : (item.estado || 'pendiente').toLowerCase(),
        ...(movementType === 'ingresos' ? {
          servicio: item.servicio || 'Servicio no especificado',
          colonia: item.colonia || 'Sin ubicación'
        } : {})
      }));
      
      const paginationData = response.pagination || response.meta?.pagination || {
        currentPage: 1,
        totalPages: 1,
        total: items.length,
        limit: itemsPerPage
      };
      
      const pagination = {
        currentPage: Number(paginationData.currentPage || paginationData.page || 1),
        totalPages: Number(paginationData.totalPages || Math.ceil((paginationData.total || items.length) / (paginationData.limit || itemsPerPage))),
        hasMore: paginationData.currentPage ? 
          (paginationData.currentPage < (paginationData.totalPages || 1)) : 
          (items.length >= (paginationData.limit || itemsPerPage)),
        totalItems: Number(paginationData.total || items.length)
      };

      // Guardar en caché con timestamp
      cacheMovements(cacheKey, {
        items,
        pagination,
        timestamp: Date.now() // Añadir timestamp
      });

      // Actualizar el estado con los datos obtenidos
      if (movementType === 'ingresos') {
        earnings.value = items;
        earningsPagination.value = pagination;
      } else {
        withdrawals.value = items;
        withdrawalsPagination.value = pagination;
      }
      
      // No es necesario actualizar un timestamp global, cada entrada tiene su propio timestamp
    }
  } catch (error) {
    console.error('Error al cargar movimientos:', error);
    showError('No se pudieron cargar los movimientos. Por favor, inténtalo de nuevo.');
  } finally {
    isLoadingMovements.value = false;
  }
};

// Función para forzar la recarga de datos
const refreshMovements = async () => {
  try {
    // Limpiar caché primero
    await clearMovementsCache();
    // Luego cargar datos frescos
    await loadMovements(1, true);
  } catch (error) {
    console.error('Error al refrescar movimientos:', error);
    showError('Error al actualizar los movimientos. Por favor, intente de nuevo.');
  }
};

// Eliminar loadMoreEarnings y loadMoreWithdrawals ya que ahora usamos paginación

// Configuración de caché para reseñas
const REVIEWS_CACHE_KEY = 'prohogar_technician_reviews_cache'
const REVIEWS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

// Obtener reseñas del caché
const getCachedReviews = (cacheKey) => {
  try {
    const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}')
    // Verificar que el caché tenga datos y no esté vencido
    if (cache && cache.reviews && cache.timestamp && 
        (Date.now() - cache.timestamp) < REVIEWS_CACHE_DURATION) {
      return cache
    }
    return null
  } catch (error) {
    console.error('Error al leer el caché de reseñas:', error)
    return null
  }
}

// Guardar reseñas en caché
const cacheReviews = (cacheKey, data) => {
  try {
    const cacheData = {
      ...data,
      timestamp: Date.now()
    }
    localStorage.setItem(cacheKey, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error al guardar en caché las reseñas:', error)
    if (error.name === 'QuotaExceededError') {
      // Limpiar caché antiguo de reseñas
      clearOldReviewsCache()
    }
  }
}

// Limpiar caché antiguo de reseñas
const clearOldReviewsCache = () => {
  try {
    const now = Date.now()
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(REVIEWS_CACHE_KEY)) {
        try {
          const cache = JSON.parse(localStorage.getItem(key) || '{}')
          if (now - (cache.timestamp || 0) > REVIEWS_CACHE_DURATION * 2) {
            localStorage.removeItem(key)
          }
        } catch (e) {
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.error('Error al limpiar caché antiguo de reseñas:', error)
  }
}

const loadReviews = async (page = 1, forceRefresh = false) => {
  try {
    isLoadingReviews.value = true
    const userId = userCookie.value.id_usuario
    
    if (!userId) {
      throw new Error('Error al obtener el ID del usuario. Recargue la página.')
    }

    const cacheKey = `${REVIEWS_CACHE_KEY}_${userId}_page_${page}`
    const now = Date.now()
    
    // Verificar si los datos están en caché y son recientes
    if (!forceRefresh) {
      const cachedData = getCachedReviews(cacheKey)
      if (cachedData) {
        reviews.value = cachedData.reviews
        reviewsPagination.value = cachedData.pagination
        
        // Verificar si los datos están a punto de vencer
        const cacheAge = now - (cachedData.timestamp || 0)
        const timeUntilRefresh = (REVIEWS_CACHE_DURATION - cacheAge) - (4 * 60 * 1000) // 4 minutos
        
        // Si faltan menos de 4 minutos para que el caché expire, actualizar en segundo plano
        if (timeUntilRefresh <= 0) {
          setTimeout(() => {
            loadReviews(page, true).catch(console.error)
          }, 1000)
        }
        
        isLoadingReviews.value = false
        return
      }
    }
    
    // Si no hay datos en caché o son viejos, hacer la petición a la API
    const response = await $api(`/calificaciones/usuario/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      params: {
        page: page,
        limit: reviewsPagination.value.itemsPerPage
      }
    })
    
    if (response) {
      // Mapear los datos de las reseñas
      const reviewsData = response.data.map(review => ({
        id: `${review.nombre_cliente}-${review.fecha}`,
        calificacion: review.calificacion,
        comentario: review.comentario || 'Sin comentario',
        fecha: review.fecha,
        id_servicio: review.id_servicio || 'N/A',
        nombre_servicio: review.nombre_servicio,
        nombre_cliente: review.nombre_cliente
      }))

      // Actualizar los datos en el estado
      reviews.value = reviewsData
      
      // Actualizar la paginación con la respuesta de la API
      let paginationData
      if (response.pagination) {
        paginationData = {
          currentPage: Number(response.pagination.currentPage) || 1,
          totalPages: Number(response.pagination.totalPages) || 1,
          hasMore: response.pagination.hasNextPage || false,
          totalItems: Number(response.pagination.totalItems) || 0,
          itemsPerPage: Number(response.pagination.itemsPerPage) || 3
        }
      } else {
        // Si no hay datos de paginación, asumir que es la única página
        paginationData = {
          currentPage: 1,
          totalPages: 1,
          hasMore: false,
          totalItems: reviewsData.length,
          itemsPerPage: reviewsPagination.value.itemsPerPage
        }
      }
      
      reviewsPagination.value = paginationData
      
      // Guardar en caché la página actual
      cacheReviews(cacheKey, {
        reviews: reviewsData,
        pagination: paginationData,
        timestamp: now
      })
    }
  } catch (error) {
    console.error('Error al cargar calificaciones:', error)
    showError('No se pudieron cargar las calificaciones.')
    reviews.value = []
  } finally {
    isLoadingReviews.value = false
  }
}

const loadAverageRating = async () => {
  try {
    const data = await $api(`/calificaciones/promedio/${currentUser.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    // Asumimos que la respuesta es un número directamente (ej. 4.2)
    const rating = parseFloat(data);
    stats.rating = isNaN(rating) ? 0 : rating;
    
  } catch (error) {
    console.error('Error al cargar la calificación promedio:', error);
    stats.rating = 0;
  }
}

const loadEstadisticasGenerales = async () => {
  try {
    // Cargar estadísticas generales
    const [estadisticas] = await Promise.all([
      $api(`/movimientos/estadisticas/${currentUser.value.id_usuario}`, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      }),
      loadAverageRating() // Cargar la calificación promedio en paralelo
    ]);
    
    stats.totalServices = estadisticas.totalServicios || 0;
    stats.last3Months = estadisticas.serviciosUltimos3Meses || 0;
    stats.thisMonth = estadisticas.serviciosMesActual || 0;
    
    const safeNumber = (value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };
    
    balance.value.balanceDisponible = safeNumber(estadisticas.balanceDisponible);
    balance.value.ultimoRetiro = estadisticas.ultimoRetiro !== null ? safeNumber(estadisticas.ultimoRetiro) : 0;
    balance.value.ultimoIngreso = estadisticas.ultimoIngreso !== null ? safeNumber(estadisticas.ultimoIngreso) : 0;
    
  } catch (error) {
    console.error('Error al cargar estadísticas generales:', error);
    showError('No se pudieron cargar las estadísticas generales');
  }
};

const loadServicesByType = async () => {
  try {
    console.log('Cargando servicios por tipo para usuario:', userCookie.value.id_usuario);
    
    // Verificar si tenemos el ID de usuario
    if (!userCookie.value?.id_usuario) {
      console.error('No se encontró ID de usuario en userCookie');
      // Datos de ejemplo para fallback
      serviceTypesData.labels = ['Sin datos'];
      serviceTypesData.datasets[0].data = [1];
      return;
    }
    
    const response = await $api(`/movimientos/servicios/tipo/${userCookie.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    console.log('Respuesta completa del API servicios por tipo:', response);

    // Extraer los datos del array anidado
    const data = response.data || [];
    console.log('Datos extraídos:', data);

    // Verificar si hay datos
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('No hay servicios registrados para este usuario');
      // Mostrar mensaje de "sin datos" en lugar de datos de ejemplo
      serviceTypesData.labels = ['Sin servicios'];
      serviceTypesData.datasets[0].data = [1];
      serviceTypesData.datasets[0].backgroundColor = ['#E5E7EB'];
    } else {
      serviceTypesData.labels = data.map(item => item.tipo || 'Sin nombre');
      serviceTypesData.datasets[0].data = data.map(item => item.cantidad || 0);
      // Restaurar colores originales si hay datos
      serviceTypesData.datasets[0].backgroundColor = ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'];
    }
    
    console.log('serviceTypesData final:', {
      labels: serviceTypesData.labels,
      data: serviceTypesData.datasets[0].data,
      colors: serviceTypesData.datasets[0].backgroundColor
    });
    
    if (selectedChart.value === 'serviceTypes') {
      createChart()
    }
  } catch (error) {
    console.error('Error al cargar servicios por tipo:', error)
    console.warn('Mostrando mensaje de sin datos debido al error');
    // Mostrar mensaje de "sin datos" en lugar de datos de ejemplo
    serviceTypesData.labels = ['Error al cargar'];
    serviceTypesData.datasets[0].data = [1];
    serviceTypesData.datasets[0].backgroundColor = ['#EF4444'];
    
    if (selectedChart.value === 'serviceTypes') {
      createChart()
    }
  }
}

const loadMonthlyIncomes = async () => {
  try {
    const data = await $api(`/movimientos/ingresos/mensuales/${userCookie.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    monthlyIncomes.value = data || []
    
    // Obtener los últimos 12 meses incluyendo el mes actual
    const months = [];
    const monthlyData = [];
    const now = new Date();
    
    // Crear un mapa para agrupar por año-mes
    const incomeMap = new Map();
    monthlyIncomes.value.forEach(item => {
      const [year, month] = item.fecha.split('-')
      incomeMap.set(`${year}-${month.padStart(2, '0')}`, parseFloat(item.monto))
    })
    
    // Generar etiquetas y datos para los últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthName = date.toLocaleString('es-ES', { month: 'short' });
      const yearShort = String(year).slice(-2);
      
      months.push(`${monthName} '${yearShort}`);
      monthlyData.push(incomeMap.get(`${year}-${month}`) || 0);
    }
    
    earningsData.labels = months;
    earningsData.datasets[0].data = monthlyData;
    
    if (selectedChart.value === 'earnings') {
      createChart();
    }
  } catch (error) {
    console.error('Error al cargar ingresos mensuales:', error)
    showError('No se pudieron cargar los ingresos mensuales')
  }
}

const loadMonthlyServices = async () => {
  try {
    const data = await $api(`/movimientos/servicios/mensuales/${userCookie.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    monthlyServices.value = data || []
    
    // Obtener los últimos 12 meses incluyendo el mes actual
    const months = [];
    const monthlyData = [];
    const now = new Date();
    
    // Crear un mapa para agrupar por año-mes
    const servicesMap = new Map();
    monthlyServices.value.forEach(item => {
      const [year, month] = item.fecha.split('-')
      servicesMap.set(`${year}-${month.padStart(2, '0')}`, item.cantidad)
    })
    
    // Variables para estadísticas
    let thisMonthCount = 0;
    let last3MonthsCount = 0;
    
    // Generar etiquetas y datos para los últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthName = date.toLocaleString('es-ES', { month: 'short' });
      const yearShort = String(year).slice(-2);
      const count = servicesMap.get(`${year}-${month}`) || 0;
      
      months.push(`${monthName} '${yearShort}`);
      monthlyData.push(count);
      
      // Actualizar estadísticas
      if (i === 0) thisMonthCount = count; // Mes actual
      if (i < 3) last3MonthsCount += count; // Últimos 3 meses
    }
    
    servicesData.labels = months;
    servicesData.datasets[0].data = monthlyData;
    
    // Actualizar estadísticas
    stats.thisMonth = thisMonthCount;
    stats.last3Months = last3MonthsCount;
    stats.totalServices = monthlyData.reduce((a, b) => a + b, 0);
    
    if (selectedChart.value === 'services') {
      createChart();
    }
  } catch (error) {
    console.error('Error al cargar servicios mensuales:', error)
    showError('No se pudieron cargar los servicios mensuales')
  }
}

// ===== FUNCIONES DE GRÁFICOS =====
const createChart = () => {
  // Validación inicial
  if (!selectedChart.value) {
    console.warn('No se ha seleccionado ningún gráfico')
    return
  }

  // Destruir el gráfico anterior si existe
  if (window.currentChart) {
    try {
      window.currentChart.destroy()
    } catch (e) {
      console.warn('Error al destruir el gráfico anterior:', e)
    }
    window.currentChart = null
  }

  // Obtener el elemento canvas
  const canvas = document.getElementById(`chart-${selectedChart.value}`)
  if (!canvas) {
    console.warn(`No se encontró el elemento canvas con ID: chart-${selectedChart.value}`)
    return
  }

  // Obtener el contexto 2D
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas')
    return
  }

  // Verificar si el canvas es visible
  if (canvas.offsetParent === null) {
    console.warn('El canvas no es visible en el DOM')
    return
  }

  // Configuración del tema
  const isDark = document.documentElement.classList.contains('dark')
  
  // Función para obtener configuración del gráfico
  const getChartConfig = () => {
    switch (selectedChart.value) {
      case 'earnings':
        return {
          type: 'bar',
          data: earningsData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: isDark ? '#ffffff' : '#374151',
                  font: { size: 14 }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `L. ${context.raw.toLocaleString('es-HN')}`
                  }
                }
              },
              datalabels: {
                display: true,
                color: function(context) {
                  return '#ffffff';
                },
                anchor: 'center',
                align: 'center',
                formatter: (value) => compactNumber(value),
                font: {
                  weight: 'bold',
                  size: 12
                },
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowBlur: 3,
                textStrokeColor: 'rgba(0, 0, 0, 0.5)',
                textStrokeWidth: 1,
                clamp: true,
                clip: false,
                offset: 0,
                display: function(context) {
                  return context.dataset.data[context.dataIndex] > 0;
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  callback: function(value) {
                    const isMobile = window.innerWidth < 640;
                    return isMobile ? `L. ${compactNumber(value)}` : `L. ${value.toLocaleString('es-HN')}`
                  }
                },
                grid: {
                  color: isDark ? '#374151' : '#E5E7EB'
                }
              },
              x: {
                ticks: {
                  color: isDark ? '#9CA3AF' : '#6B7280'
                },
                grid: {
                  display: false
                }
              }
            },
            animation: {
              duration: 1000
            },
            layout: {
              padding: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 10
              }
            }
          },
          plugins: [ChartDataLabels]
        }

      case 'serviceTypes':
        console.log('Creando gráfico de serviceTypes');
        console.log('Datos actuales de serviceTypesData:', serviceTypesData);
        
        // Si no hay servicios, no crear el gráfico (el HTML mostrará el mensaje)
        if (serviceTypesData.labels.length === 1 && 
            (serviceTypesData.labels[0] === 'Sin servicios' || serviceTypesData.labels[0] === 'Error al cargar' || serviceTypesData.labels[0] === 'Sin datos')) {
          console.log('No hay servicios, omitiendo creación del gráfico');
          return null;
        }
        
        const totalServices = serviceTypesData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;
        const percentages = serviceTypesData.datasets[0]?.data.map(value => {
          return totalServices > 0 ? Math.round((value / totalServices) * 100) + '%' : '0%';
        }) || [];
        
        console.log('Total servicios:', totalServices);
        console.log('Percentages:', percentages);
        
        return {
          type: 'doughnut',
          data: serviceTypesData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            layout: {
              padding: 0
            },
            plugins: {
              legend: {
                position: 'left',
                align: 'center',
                labels: {
                  color: '#ffffff',
                  padding: 12,
                  font: {
                    size: 13,
                    weight: 'bold',
                    color: '#ffffff',
                    family: 'sans-serif'
                  },
                  usePointStyle: true,
                  pointStyle: 'circle',
                  boxWidth: 8,
                  boxHeight: 8,
                  color: (context) => '#ffffff',
                  generateLabels: function(chart) {
                    const data = chart.data;
                    if (data.labels.length && data.datasets.length) {
                      return data.labels.map((label, i) => {
                        const value = data.datasets[0].data[i];
                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                        
                        return {
                          text: `${label}: ${value}`,
                          fillStyle: data.datasets[0].backgroundColor[i],
                          strokeStyle: 'transparent',
                          lineWidth: 0,
                          hidden: isNaN(value) || value === 0,
                          index: i,
                          value: value,
                          fontColor: '#ffffff',
                          draw: function(ctx) {
                            ctx.save();
                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 13px sans-serif';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            
                            const size = 8;
                            ctx.fillStyle = this.fillStyle;
                            ctx.beginPath();
                            ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.fillStyle = '#ffffff';
                            ctx.fillText(this.text, size * 1.5, size/2 + 1);
                            
                            ctx.restore();
                          }
                        };
                      });
                    }
                    return [];
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const label = context.label || ''
                    const value = context.raw || 0
                    const total = context.dataset.data.reduce((a, b) => a + b, 0)
                    const percentage = Math.round((value / total) * 100) || 0
                    return `${label}: ${value} (${percentage}%)`
                  }
                }
              },
              datalabels: {
                formatter: (value, context) => {
                  return percentages[context.dataIndex];
                },
                color: '#ffffff',
                font: {
                  weight: 'bold',
                  size: 14
                },
                anchor: 'center',
                align: 'center',
                offset: 0,
                textAlign: 'center',
                textStrokeColor: 'rgba(0, 0, 0, 0.5)',
                textStrokeWidth: 2,
                textShadowBlur: 5,
                textShadowColor: 'rgba(0, 0, 0, 0.8)'
              }
            },
            animation: {
              animateScale: true,
              animateRotate: true
            },
            elements: {
              arc: {
                borderWidth: 0
              }
            }
          },
          plugins: [ChartDataLabels]
        }

      case 'services':
        return {
          type: 'line',
          data: servicesData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  color: isDark ? '#ffffff' : '#374151',
                  font: { size: 14 }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.raw} servicio${context.raw !== 1 ? 's' : ''}`
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: isDark ? '#9CA3AF' : '#6B7280',
                  stepSize: 1,
                  precision: 0
                },
                grid: {
                  color: isDark ? '#374151' : '#E5E7EB'
                }
              },
              x: {
                ticks: {
                  color: isDark ? '#9CA3AF' : '#6B7280'
                },
                grid: {
                  display: false
                }
              }
            },
            animation: {
              duration: 1000
            },
            layout: {
              padding: {
                top: 10,
                right: 20,
                bottom: 10,
                left: 10
              }
            }
          }
        }

      default:
        console.error('Tipo de gráfico no soportado:', selectedChart.value)
        return null
    }
  }

  // Obtener configuración del gráfico
  const config = getChartConfig()
  if (!config) {
    console.log('No hay configuración de gráfico (probablemente no hay datos)')
    return
  }

  // Crear el nuevo gráfico
  try {
    window.currentChart = new Chart(ctx, config)
    
    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      if (window.currentChart) {
        try {
          window.currentChart.resize()
        } catch (e) {
          console.warn('Error al redimensionar el gráfico:', e)
        }
      }
    }
    
    // Limpiar listener anterior y agregar uno nuevo
    window.removeEventListener('resize', handleResize)
    window.addEventListener('resize', handleResize)
    
    // Forzar un redimensionamiento inicial
    setTimeout(handleResize, 100)
    
    console.log('Gráfico creado exitosamente:', selectedChart.value)
    
  } catch (error) {
    console.error('Error al crear el gráfico:', error)
    showError('No se pudo crear el gráfico. Por favor, intente de nuevo.')
    window.currentChart = null
  }
}

// ===== FUNCIONES DE MODAL =====
const openWithdrawModal = () => {
  showWithdrawModal.value = true
}

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
  withdrawForm.amount = 0
  withdrawForm.bankDetails = ''
}

const processWithdraw = async () => {
  if (!canProcessWithdraw.value) {
    showError('Por favor completa todos los campos requeridos')
    return
  }

  isProcessingWithdraw.value = true

  try {
    const requestBody = {
      id_usuario: userCookie.value.id_usuario,
      tipo: 'retiro',
      monto: parseFloat(withdrawForm.amount),
      descripcion: `Retiro a cuenta bancaria: ${withdrawForm.bankDetails}`
    }
    
    const response = await $api('/movimientos', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: requestBody
    })

    balance.value.balanceDisponible -= parseFloat(withdrawForm.amount)
    balance.value.ultimoRetiro = withdrawForm.amount
    
    // Notificar a los administradores sobre la nueva petición de retiro
    try {
      await $api('/notificaciones/enviar', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          titulo: 'Nueva Petición de Retiro',
          nombre_rol: 'admin'
        })
      })
      await $api('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: 'Nueva Petición de Retiro',
            nombre_rol: 'sa'
          })
        });
    } catch (error) {
      console.error('Error al enviar notificación a administradores:', error);
      // No mostrar error al usuario para no afectar su experiencia
    }
    
    showSuccess(`Retiro de L. ${formatCurrency(withdrawForm.amount)} solicitado correctamente`)
    
    closeWithdrawModal()
    
    // Limpiar la caché de movimientos antes de recargar
    clearMovementsCache(userCookie.value.id_usuario, 'retiros')
    
    // Forzar recarga de movimientos
    await loadMovements(1, true)
    
  } catch (error) {
    console.error('Error al procesar el retiro:', error)
    showError(error.data?.message || 'Error al procesar el retiro. Por favor, inténtalo de nuevo.')
  } finally {
    isProcessingWithdraw.value = false
  }
}

// ===== FUNCIONES DE NAVEGACIÓN =====
const handleMonthChange = async (event, tabType) => {
  const selectedDate = event.target.value;
  
  if (!selectedDate) return;
  
  const [year, month] = selectedDate.split('-');
  const formattedDate = `${year}-${month}`;
  
  if (tabType === 'ingresos') {
    selectedMonth.value = formattedDate;
  } else {
    selectedWithdrawMonth.value = formattedDate;
  }
  
  try {
    await loadMovements(formattedDate);
  } catch (error) {
    console.error('Error al cargar movimientos:', error);
    showError('No se pudieron cargar los movimientos');
  }
}

const setActiveTab = async (tab) => {
  if (activeTab.value === tab) return;
  
  activeTab.value = tab;
  
  try {
    isLoadingMovements.value = true;
    
    if (tab === 'ingresos') {
      await loadMovements(selectedMonth.value);
    } else if (tab === 'retiros') {
      await loadMovements(selectedWithdrawMonth.value);
    }
  } catch (error) {
    console.error('Error al cambiar de pestaña:', error);
    showError('No se pudo cargar la información de ' + (tab === 'ingresos' ? 'ingresos' : 'retiros'));
  } finally {
    isLoadingMovements.value = false;
  }
}

// ===== WATCHERS =====
watch(activeTab, (newTab) => {
  if (newTab === 'ingresos') {
    loadMovements(1)
  } else {
    loadMovements(1)
  }
})

// Watch para sincronizar selectedChart con selectedChartObject
watch(() => selectedChart.value, (newId) => {
  if (newId && availableCharts.length > 0) {
    const chartObject = availableCharts.find(c => c.id === newId);
    if (chartObject) {
      selectedChartObject.value = chartObject;
    }
  } else {
    selectedChartObject.value = null;
  }
});

// Watch para sincronizar selectedChartObject con selectedChart
watch(() => selectedChartObject.value, (newChart) => {
  if (newChart) {
    selectedChart.value = newChart.id;
  } else {
    selectedChart.value = null;
  }
});

watch(selectedChart, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nextTick(() => {
      createChart()
    })
  }
}, { immediate: true })

// ===== INICIALIZACIÓN =====
const initializeApp = async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) { 
      window.location.reload()
      return
    }

    // Registrar componentes de Chart.js
    Chart.register(...registerables)
    
    // Inicializar selectedChartObject con el valor por defecto
    if (selectedChart.value && availableCharts.length > 0) {
      const defaultChart = availableCharts.find(c => c.id === selectedChart.value);
      if (defaultChart) {
        selectedChartObject.value = defaultChart;
      }
    }
    
    // Limpiar caché primero
    clearMovementsCache();
    
    // Cargar datos iniciales
    await Promise.all([
      loadMonthlyIncomes(),
      loadMonthlyServices(),
      loadServicesByType(),
      loadEstadisticasGenerales(),
      loadReviews()
    ]);
    
    // Cargar movimientos después de limpiar el caché
    await refreshMovements();
    
    // Configurar tema oscuro
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    }
    
    // Escuchar cambios en el tema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      if (event.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    });
    
    // Forzar una actualización del gráfico después de que todo esté cargado
    await nextTick();
    if (selectedChart.value) {
      // Pequeño retraso para asegurar que el DOM esté listo
      setTimeout(() => {
        createChart();
      }, 100);
    }
    
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    window.location.reload();
  }
}

onMounted(() => {
  initializeApp();
})

</script>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none;
}

select::-ms-expand {
  display: none;
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

input:focus, select:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Estilos personalizados para Multiselect - Exact match to index.vue */
.multiselect-custom {
  min-width: 140px !important;
  font-size: 0.75rem !important;
}

.multiselect-custom .multiselect__tags {
  min-height: 36px !important;
  background-color: rgb(249 250 251) !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  padding: 6px 30px 6px 10px !important;
  transition: all 0.2s ease !important;
}

.dark .multiselect-custom .multiselect__tags {
  background-color: rgb(55 65 81) !important;
  border-color: rgb(75 85 99) !important;
}

.multiselect-custom .multiselect__tags:focus-within {
  border-color: rgb(16 185 129) !important;
  box-shadow: 0 0 0 2px rgb(16 185 129) !important;
}

.dark .multiselect-custom .multiselect__tags:focus-within {
  border-color: rgb(16 185 129) !important;
  box-shadow: 0 0 0 2px rgb(16 185 129) !important;
}

.multiselect-custom .multiselect__single {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__single {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__input {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.75rem !important;
  min-height: 20px !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__input {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__input::placeholder {
  color: rgb(156 163 175) !important;
}

.multiselect-custom .multiselect__placeholder {
  margin: 0 !important;
  padding: 0 !important;
  color: rgb(156 163 175) !important;
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
  margin-top: 1px !important;
}

.multiselect-custom .multiselect__select {
  height: 100% !important;
  width: 1.5rem !important;
  right: 0 !important;
  top: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  padding: 0 !important;
}

.multiselect-custom .multiselect__select:before {
  border-color: rgb(156 163 175) transparent transparent !important;
  border-style: solid !important;
  border-width: 5px 5px 0 !important;
  margin-top: 0 !important;
  top: 55% !important;
}

.dark .multiselect-custom .multiselect__select:before {
  border-color: rgb(156 163 175) transparent transparent !important;
}

.multiselect-custom .multiselect__content-wrapper {
  background-color: white !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  margin-top: 0.25rem !important;
  z-index: 50 !important;
  min-width: 100% !important;
  width: auto !important;
}

.dark .multiselect-custom .multiselect__content-wrapper {
  background-color: rgb(31 41 55) !important;
  border-color: rgb(55 65 81) !important;
}

.multiselect-custom .multiselect__option {
  font-size: 0.75rem !important;
  color: rgb(17 24 39) !important;
  padding: 8px 12px !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__option {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--highlight {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--selected {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--selected {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
  color: rgb(243 244 246) !important;
}
</style>