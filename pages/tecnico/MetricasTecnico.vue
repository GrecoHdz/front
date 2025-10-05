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

    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
              <span class="text-white text-lg sm:text-xl">📊</span>
            </div>
            <div>
              <h1 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Mis Métricas</h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">{{ currentUser?.nombre || 'Técnico' }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

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
          <select v-model="selectedChart" 
                  class="px-2 sm:px-3 py-1.5 sm:py-2 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
            <option v-for="chart in availableCharts" :key="chart.id" :value="chart.id">
              {{ chart.name }}
            </option>
          </select>
        </div>
      </section>

      <!-- Gráfico Dinámico -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
          <div class="h-56 sm:h-64">
            <canvas :id="'chart-' + selectedChart" class="w-full h-full"></canvas>
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
              
              <!-- Botón Ver más -->
              <div v-if="earnings.length > 0 && hasMoreItems && activeTab === 'ingresos'" class="text-center mt-3 sm:mt-4">
                <button 
                  @click="loadMoreEarnings" 
                  class="w-full py-2 text-xs sm:text-sm font-medium text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  :disabled="isLoadingMovements"
                >
                  <span v-if="isLoadingMovements">
                    Cargando...
                  </span>
                  <span v-else>
                    Ver más ingresos ({{ totalItems - earnings.length }} restantes)
                  </span>
                </button>
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
                          Retiro #{{ getWithdrawalNumber(withdrawal) }}
                        </p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">
                          {{ formatDate(withdrawal.fecha) }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-bold text-red-600 dark:text-red-400 text-sm sm:text-base">L. {{ formatCurrency(withdrawal.monto) }}</p>
                      <p class="text-xs" :class="getStatusWithDrawalColor(withdrawal.estado)">
                        {{ withdrawal.estado }}
                      </p>
                    </div>
                  </div>
                </div>
              </template>
              
              <!-- Botón Ver más -->
              <div v-if="withdrawals.length > 0 && hasMoreItems && activeTab === 'retiros'" class="text-center mt-3 sm:mt-4">
                <button 
                  @click="loadMoreWithdrawals" 
                  class="w-full py-2 text-xs sm:text-sm font-medium text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  :disabled="isLoadingMovements"
                >
                  <span v-if="isLoadingMovements">
                    Cargando...
                  </span>
                  <span v-else>
                    Ver más retiros ({{ totalItems - withdrawals.length }} restantes)
                  </span>
                </button>
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
          <div class="space-y-2 sm:space-y-3">
            <div v-for="review in reviews.slice(0, 3)" :key="review.id || `${review.nombre_cliente}-${review.fecha}`"
                 class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
              <div class="flex items-start justify-between mb-2 sm:mb-3">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span class="text-white text-xs sm:text-sm font-bold">{{ getInitials(review.nombre_cliente) }}</span>
                  </div>
                  <div>
                    <p class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ review.nombre_cliente }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(review.fecha) }}</p>
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
              <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3">{{ review.comentario }}</p>
              <div class="flex items-center space-x-2">
                <span class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                  {{ review.nombre_servicio }}
                </span>
              </div>
            </div>
          </div>

          <button v-if="pagination.hasMore"
                  @click="loadMoreReviews" 
                  :disabled="isLoading"
                  class="w-full mt-2 sm:mt-3 py-2 text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isLoading">Cargando más...</span>
            <span v-else>Ver más calificaciones ({{ pagination.totalItems - reviews.length }} restantes)</span>
          </button>
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
                      placeholder="Ingresa tus datos bancarios completos:&#10;Banco: Nombre del banco&#10;Cuenta: Número de cuenta&#10;Titular: Nombre completo&#10;Tipo: Ahorros/Corriente"></textarea>
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
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useAuthStore } from '~/middleware/auth.store'
import Toast from '~/components/ui/Toast.vue'

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
const config = useRuntimeConfig()
const auth = useAuthStore()

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
const reviews = ref([])

// Visible items for earnings and withdrawals
const visibleEarningsCount = ref(3)
const visibleWithdrawalsCount = ref(3)

// Datos
const earnings = ref([])
const withdrawals = ref([])
const movementSummary = ref(null)

// Estado de paginación
const currentPage = ref(1)
const itemsPerPage = 2
const totalItems = ref(0)
const hasMoreItems = ref(true)

// Paginación para reseñas
const pagination = ref({
  currentPage: 1,
  itemsPerPage: 5,
  totalItems: 0,
  totalPages: 1,
  hasMore: false
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
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((acc, review) => acc + review.calificacion, 0)
  return (sum / reviews.value.length).toFixed(1)
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
  return status === 'Completado' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400' 
}

const getStatusWithDrawalColor = (status) => {
  return status === 'completado' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400' 
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
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

// ===== FUNCIONES DE CARGA DE DATOS =====
const loadMovements = async (loadMore = false) => {
  try {
    if (!loadMore) {
      currentPage.value = 1
      activeTab.value === 'ingresos' ? earnings.value = [] : withdrawals.value = []
      hasMoreItems.value = true
    } else {
      currentPage.value++
    }

    isLoadingMovements.value = true
    const userId = auth.user?.id_usuario
    if (!userId) throw new Error('No se pudo obtener el ID del usuario')

    const selectedMonthValue = activeTab.value === 'ingresos' ? selectedMonth.value : selectedWithdrawMonth.value
    let year, monthNum
    
    if (selectedMonthValue) {
      const [y, m] = selectedMonthValue.split('-')
      year = parseInt(y)
      monthNum = parseInt(m)
    } else {
      const now = new Date()
      year = now.getFullYear()
      monthNum = now.getMonth() + 1
    }

    const tipoMovimiento = activeTab.value === 'ingresos' ? 'ingreso' : 'retiro'
    
    const response = await $fetch(`/movimientos/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      params: { 
        mes: monthNum, 
        tipo: tipoMovimiento,
        page: currentPage.value,
        limit: itemsPerPage
      }
    })

    if (response.success) {
      if (loadMore && movementSummary.value && response.summary) {
        movementSummary.value = {
          mes: response.summary.mes || movementSummary.value.mes,
          totalIngresos: parseFloat(movementSummary.value.totalIngresos || 0) + parseFloat(response.summary.totalIngresos || 0),
          totalRetiros: parseFloat(movementSummary.value.totalRetiros || 0) + parseFloat(response.summary.totalRetiros || 0)
        }
      } else if (response.summary) {
        movementSummary.value = response.summary
      }
      
      totalItems.value = response.pagination?.total || 0
      
      hasMoreItems.value = response.pagination ? 
        (response.pagination.page * response.pagination.limit) < response.pagination.total : 
        false
      
      const items = response.data.map(item => ({
        id_movimiento: item.id_movimiento,
        monto: parseFloat(item.monto) || 0,
        fecha: item.fecha,
        estado: activeTab.value === 'ingresos' ? (item.estado || 'Pendiente') : (item.estado || 'pendiente').toLowerCase(),
        ...(activeTab.value === 'ingresos' ? {
          servicio: item.servicio || 'Servicio no especificado',
          colonia: item.colonia || 'Sin ubicación'
        } : {})
      }))

      if (activeTab.value === 'ingresos') {
        earnings.value = loadMore ? [...earnings.value, ...items] : items
        visibleEarningsCount.value = Math.min(earnings.value.length, currentPage.value * itemsPerPage)
      } else {
        withdrawals.value = loadMore ? [...withdrawals.value, ...items] : items
        visibleWithdrawalsCount.value = Math.min(withdrawals.value.length, currentPage.value * itemsPerPage)
      }
    }
  } catch (error) {
    console.error('Error al cargar movimientos:', error)
    showError('No se pudieron cargar los movimientos. Por favor, inténtalo de nuevo.')
  } finally {
    isLoadingMovements.value = false
  }
}

const loadMoreEarnings = async () => {
  if (earnings.value.length < totalItems.value) {
    await loadMovements(true)
  } else {
    visibleEarningsCount.value = Math.min(visibleEarningsCount.value + 3, earnings.value.length)
  }
}

const loadMoreWithdrawals = async () => {
  if (withdrawals.value.length < totalItems.value) {
    await loadMovements(true)
  } else {
    visibleWithdrawalsCount.value = Math.min(visibleWithdrawalsCount.value + 3, withdrawals.value.length)
  }
}

const loadReviews = async (loadMore = false) => {
  try {
    const userId = auth.user?.id_usuario
    
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario')
    }
    
    if (!loadMore) {
      pagination.value.currentPage = 1
      reviews.value = []
    }
    
    const response = await $fetch(`/calificaciones/usuario/${userId}?page=${pagination.value.currentPage}&limit=${pagination.value.itemsPerPage}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    const newReviews = response.data.map(review => ({
      id: `${review.nombre_cliente}-${review.fecha}`,
      calificacion: review.calificacion,
      comentario: review.comentario || 'Sin comentario',
      fecha: review.fecha,
      nombre_servicio: review.nombre_servicio,
      nombre_cliente: review.nombre_cliente
    }))
    
    if (loadMore) {
      reviews.value = [...reviews.value, ...newReviews]
    } else {
      reviews.value = newReviews
    }
    
    pagination.value = {
      ...pagination.value,
      totalItems: response.pagination.totalItems,
      totalPages: response.pagination.totalPages,
      hasMore: response.pagination.currentPage < response.pagination.totalPages,
      currentPage: response.pagination.currentPage
    }
    
  } catch (error) {
    console.error('Error al cargar calificaciones:', error)
    showError('No se pudieron cargar las calificaciones.')
    if (!loadMore) {
      reviews.value = []
    }
  }
}

const loadMoreReviews = async () => {
  if (pagination.value.hasMore) {
    pagination.value.currentPage++
    await loadReviews(true)
  }
}

const loadEstadisticasGenerales = async () => {
  try {
    const data = await $fetch(`/movimientos/estadisticas/${currentUser.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    console.log('Datos recibidos del servidor:', data);
    
    stats.totalServices = data.totalServicios || 0;
    stats.last3Months = data.serviciosUltimos3Meses || 0;
    stats.thisMonth = data.serviciosMesActual || 0;
    
    const safeNumber = (value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };
    
    balance.value.balanceDisponible = safeNumber(data.balanceDisponible);
    balance.value.ultimoRetiro = data.ultimoRetiro !== null ? safeNumber(data.ultimoRetiro) : 0;
    balance.value.ultimoIngreso = data.ultimoIngreso !== null ? safeNumber(data.ultimoIngreso) : 0;
    
  } catch (error) {
    console.error('Error al cargar estadísticas generales:', error);
    showError('No se pudieron cargar las estadísticas generales');
  }
};

const loadServicesByType = async () => {
  try {
    const data = await $fetch(`/movimientos/servicios/tipo/${currentUser.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    serviceTypesData.labels = data.map(item => item.tipo)
    serviceTypesData.datasets[0].data = data.map(item => item.cantidad)
    
    if (selectedChart.value === 'serviceTypes') {
      createChart()
    }
  } catch (error) {
    console.error('Error al cargar servicios por tipo:', error)
    showError('No se pudieron cargar los servicios por tipo')
  }
}

const loadMonthlyIncomes = async () => {
  try {
    const data = await $fetch(`/movimientos/ingresos/mensuales/${currentUser.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    monthlyIncomes.value = data || []
    
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const monthlyData = Array(12).fill(0)
    
    monthlyIncomes.value.forEach(item => {
      const [year, month] = item.fecha.split('-')
      const monthIndex = parseInt(month) - 1
      monthlyData[monthIndex] = parseFloat(item.monto)
    })
    
    earningsData.labels = monthNames
    earningsData.datasets[0].data = monthlyData
    
    if (selectedChart.value === 'earnings') {
      createChart()
    }
  } catch (error) {
    console.error('Error al cargar ingresos mensuales:', error)
    showError('No se pudieron cargar los ingresos mensuales')
  }
}

const loadMonthlyServices = async () => {
  try {
    const data = await $fetch(`/movimientos/servicios/mensuales/${currentUser.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    monthlyServices.value = data || []
    
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    const monthlyData = Array(12).fill(0)
    
    monthlyServices.value.forEach(item => {
      const [year, month] = item.fecha.split('-')
      const monthIndex = parseInt(month) - 1
      monthlyData[monthIndex] = item.cantidad
    })
    
    servicesData.labels = monthNames
    servicesData.datasets[0].data = monthlyData
    
    stats.thisMonth = monthlyData[new Date().getMonth()] || 0
    stats.last3Months = monthlyData.slice(-3).reduce((a, b) => a + b, 0)
    stats.totalServices = monthlyData.reduce((a, b) => a + b, 0)
    
    if (selectedChart.value === 'services') {
      createChart()
    }
  } catch (error) {
    console.error('Error al cargar servicios mensuales:', error)
    showError('No se pudieron cargar los servicios mensuales')
  }
}

// ===== FUNCIONES DE GRÁFICOS =====
const createChart = () => {
  if (!selectedChart.value) return
  
  if (window.currentChart) {
    window.currentChart.destroy()
  }
  
  const canvas = document.getElementById(`chart-${selectedChart.value}`)
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const isDark = document.documentElement.classList.contains('dark')

  let config = {}
  
  switch (selectedChart.value) {
    case 'earnings':
      config = {
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
                font: {
                  size: 14
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.raw.toLocaleString('es-HN')
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
              formatter: (value) => value.toLocaleString('es-HN'),
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
                  return value.toLocaleString('es-HN')
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
      break

    case 'serviceTypes':
      const totalServices = serviceTypesData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;
      
      const percentages = serviceTypesData.datasets[0]?.data.map(value => {
        return totalServices > 0 ? Math.round((value / totalServices) * 100) + '%' : '0%';
      }) || [];
      
      config = {
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
      break

    case 'services':
      config = {
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
                font: {
                  size: 14
                }
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
      break
  }

  window.currentChart = new Chart(ctx, config)
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
      id_usuario: currentUser.value.id_usuario,
      tipo: 'retiro',
      monto: parseFloat(withdrawForm.amount),
      descripcion: `Retiro a cuenta bancaria: ${withdrawForm.bankDetails}`
    }
    
    console.log('Enviando al backend:', JSON.stringify(requestBody, null, 2))
    
    const response = await $fetch('/movimientos', {
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
    
    showSuccess(`Retiro de L. ${formatCurrency(withdrawForm.amount)} solicitado correctamente`)
    
    closeWithdrawModal()
    
    await loadMovements()
    
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
  currentPage.value = 1
  hasMoreItems.value = true
  if (newTab === 'ingresos') {
    visibleEarningsCount.value = 3
  } else {
    visibleWithdrawalsCount.value = 3
  }
  loadMovements()
})

watch(selectedChart, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nextTick(() => {
      createChart()
    })
  }
}, { immediate: true })

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  Chart.register(...registerables)
  await Promise.all([
    loadMonthlyIncomes(),
    loadMonthlyServices(),
    loadServicesByType(),
    loadEstadisticasGenerales(),
    loadMovements(),
    loadReviews()
  ])
  
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
</style>