<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Toast Notification -->
    <div v-if="toast.show" 
         :class="`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${getToastClass()}`">
      <div class="flex items-center space-x-3">
        <span v-html="getToastIcon()"></span>
        <span class="font-medium">{{ toast.message }}</span>
        <button @click="toast.show = false" class="ml-2 text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300">Cargando datos...</p>
      </div>
    </div>

    <!-- Modal Universal para Pagos/Retiros -->
    <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeDetailsModal"></div>
      <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[85vw] max-w-4xl max-h-[85vh] overflow-y-auto relative z-10">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-lg sm:rounded-t-xl">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <div :class="getModalIconClass()" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex-shrink-0 flex items-center justify-center text-base sm:text-lg">
                {{ getModalIcon() }}
              </div>
              <div class="min-w-0">
                <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">{{ getModalTitle() }}</h3>
                <p class="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">{{ getModalSubtitle() }}</p>
              </div>
            </div>
            <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="p-3 text-[13px] sm:text-sm">
          <!-- Información del Monto -->
          <div class="mb-3 sm:mb-4">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-[12px] text-gray-500 dark:text-gray-400">Monto:</span>
                <span :class="getModalAmountClass()" class="font-medium text-sm">{{ formatCurrency(selectedItem?.amount) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[12px] text-gray-500 dark:text-gray-400">Fecha:</span>
                <span class="text-gray-900 dark:text-white">{{ formatDate(selectedItem?.date) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[12px] text-gray-500 dark:text-gray-400">Estado:</span>
                <span :class="getStatusBadgeClass(selectedItem?.status)" class="text-[11px] px-2 py-0.5 rounded-full">
                  {{ selectedItem?.status || 'Pendiente' }}
                </span>
              </div>
              <template v-if="modalType !== 'withdrawal'">
                <div class="flex items-center justify-between">
                  <span class="text-[12px] text-gray-500 dark:text-gray-400">Método:</span>
                  <span class="text-gray-900 dark:text-white">{{ selectedItem?.method || 'No especificado' }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Datos de Cuenta -->
          <div class="mb-3 sm:mb-4">
            <h4 class="text-[12px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {{ modalType === 'withdrawal' ? 'Datos Bancarios' : 'Información de Cuenta' }}
            </h4>
            <div class="bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
              <pre class="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-snug">{{ getAccountDetails() }}</pre>
            </div>
          </div>

          <!-- Acciones -->
          <div v-if="selectedItem?.status === 'Pendiente'" class="flex gap-2 mt-4">
            <button @click="rejectItem" 
                    class="flex-1 py-1.5 text-xs sm:text-[13px] font-medium rounded border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              Rechazar
            </button>
            <button @click="approveItem" 
                    class="flex-1 py-1.5 text-xs sm:text-[13px] font-medium rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              Aprobar
            </button>
          </div>
          <div v-else class="text-center py-1 text-xs text-gray-500 dark:text-gray-400">
            {{ modalType === 'withdrawal' ? 'Retiro' : 'Pago' }} {{ selectedItem?.status?.toLowerCase() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Header --> 
      <HeadersHeaderReportesAdmin /> 

    <!-- Content Container -->
    <div class="max-w-xl mx-auto bg-white dark:bg-gray-900 min-h-screen pb-20">
      
      <!-- Resumen Ejecutivo -->
      <section class="px-3 sm:px-4 py-3 sm:py-4"> 
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Resumen Ejecutivo</h2>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <!-- Ingresos -->
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-purple-100 text-xs font-medium mb-2">💰 Ingresos</p>
              <div class="space-y-1">
                <div>
                  <p class="text-xs text-purple-200">Último mes</p>
                  <p class="text-base font-bold">L. {{ formatCurrency(executiveSummary.monthlyRevenue) }}</p>
                </div>
                <div>
                  <p class="text-xs text-purple-200">Total</p>
                  <p class="text-xs font-medium">L. {{ formatCurrency(executiveSummary.totalRevenue) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Comisiones Técnicos -->
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-purple-100 text-xs font-medium mb-2">🏆 Comisiones</p>
              <div class="space-y-1">
                <div>
                  <p class="text-xs text-purple-200">Último mes</p>
                  <p class="text-base font-bold">L. {{ formatCurrency(executiveSummary.monthlyCommissions) }}</p>
                </div>
                <div>
                  <p class="text-xs text-purple-200">Total</p>
                  <p class="text-xs font-medium">L. {{ formatCurrency(executiveSummary.totalCommissions) }}</p>
                </div>
              </div>
            </div>

            <!-- Retiros -->
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-purple-100 text-xs font-medium mb-2">💳 Retiros</p>
              <div class="space-y-1">
                <div>
                  <p class="text-xs text-purple-200">Último mes</p>
                  <p class="text-base font-bold">L. {{ formatCurrency(executiveSummary.monthlyWithdrawals) }}</p>
                </div>
                <div>
                  <p class="text-xs text-purple-200">Total</p>
                  <p class="text-xs font-medium">L. {{ formatCurrency(executiveSummary.totalWithdrawals) }}</p>
                </div>
              </div>
            </div>

            <!-- Ingresos Referidos -->
            <div class="bg-white/10 rounded-lg p-3">
              <p class="text-purple-100 text-xs font-medium mb-2">👥 Referidos</p>
              <div class="space-y-1">
                <div>
                  <p class="text-xs text-purple-200">Último mes</p>
                  <p class="text-base font-bold">L. {{ formatCurrency(executiveSummary.monthlyReferrals) }}</p>
                </div>
                <div>
                  <p class="text-xs text-purple-200">Total</p>
                  <p class="text-xs font-medium">L. {{ formatCurrency(executiveSummary.totalReferrals) }}</p>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </section>

      <!-- Estadísticas de la Plataforma con Filtro -->
      <section class="px-2 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-sm sm:text-lg font-black text-gray-900 dark:text-white whitespace-nowrap">
            Estadísticas de la Plataforma
          </h2>
          <select 
            v-model="selectedPeriod" 
            @change="updateStats"
            class="px-2 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1">Último mes</option>
            <option value="6">Últimos 6 meses</option>
            <option value="all">Total</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:gap-3">
          <!-- Ingresos Membresía -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span class="text-green-600 dark:text-green-400 text-sm sm:text-lg">💳</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  L. {{ formatCurrency(platformStats.membershipRevenue) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Membresía
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Por Visita -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span class="text-purple-600 dark:text-purple-400 text-sm sm:text-lg">🏠</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  L. {{ formatCurrency(platformStats.visitRevenue) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Por Visita
                </p>
              </div>
            </div>
          </div>
      
          <!-- Ingresos Servicios -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <span class="text-yellow-600 dark:text-yellow-400 text-sm sm:text-lg">🛠️</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  L. {{ formatCurrency(platformStats.serviceRevenue) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Ingresos Servicios
                </p>
              </div>
            </div>
          </div>
      
          <!-- Retiros Totales -->
          <div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div class="flex-shrink-0 w-7 h-7 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <span class="text-red-600 dark:text-red-400 text-sm sm:text-lg">💸</span>
              </div>
              <div class="min-w-0">
                <p class="text-sm sm:text-xl font-black text-gray-900 dark:text-white truncate">
                  L. {{ formatCurrency(platformStats.totalWithdrawals) }}
                </p>
                <p class="text-xs font-bold text-gray-600 dark:text-gray-400 truncate">
                  Retiros Totales
                </p>
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

      <!-- Sección de Transacciones -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <h2 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Transacciones</h2>
          <!-- Selector de mes (igual que el de pestañas) -->
          <input 
            type="month"
            v-model="selectedMonthInput"
            @change="updateSelectedMonth"
            class="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
          />
        </div>

        <div class="space-y-2">
          <div v-if="isLoadingTransactions" class="text-center py-6 sm:py-8">
            <div class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">Cargando transacciones...</p>
          </div>

          <div v-else-if="transactions.length === 0" class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">Sin transacciones</h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No hay transacciones registradas para la fecha seleccionada</p>
          </div>

          <template v-else>
            <div v-for="transaction in visibleTransactions" :key="transaction.id"
                 class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div :class="getTransactionIconClass(transaction.type)" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                    <span class="text-[8px] text-white text-xs sm:text-sm">{{ getTransactionIcon(transaction.type) }}</span>
                  </div>
                  <div>
                    <p class="text-[6px]font-bold text-gray-900 dark:text-white text-xs sm:text-sm">{{ transaction.description }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400">
                      {{ formatDate(transaction.date) }} • {{ transaction.technician }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p :class="getTransactionAmountClass(transaction.type)" class="font-bold text-[12px] sm:text-base">
                    {{ transaction.type === 'commission' ? '+' : '-' }}L. {{ formatCurrency(transaction.amount) }}
                  </p>
                  <p class="text-[10px]" :class="getStatusColor(transaction.status)">
                    {{ transaction.status }}
                  </p>
                </div>
              </div>
            </div>

            <button v-if="hasMoreTransactions" @click="loadMoreTransactions" 
                    class="w-full py-2 text-xs sm:text-sm font-medium text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              Ver más transacciones
            </button>
          </template>
        </div>
      </section>

      <!-- Pagos y Retiros con pestañas REDISEÑADA -->
      <section class="px-3 sm:px-4 mb-4 sm:mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-3">
          <!-- Header con título y selector de mes -->
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-black text-gray-900 dark:text-white">Gestión de Pagos y Retiros</h2>
            <input 
              type="month"
              v-model="selectedMonthInput"
              @change="updateSelectedMonth"
              class="px-2 py-1 text-[11px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            />
          </div>
      
          <!-- Pestañas principales -->
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-3">
            <div class="flex border-b border-gray-200 dark:border-gray-600">
              <button 
                v-for="tab in [
                  { id: 'membership', label: '💳 Membresía' },
                  { id: 'visits', label: '🏠 Visitas' },
                  { id: 'services', label: '🛠️ Servicios' },
                  { id: 'withdrawals', label: '💸 Retiros' }
                ]"
                :key="tab.id"
                @click="setActiveTab(tab.id)"
                :class="{
                  'bg-blue-600 text-white border-blue-600': activeTab === tab.id,
                  'text-gray-700 dark:text-gray-300 border-transparent hover:text-blue-600 dark:hover:text-blue-400': activeTab !== tab.id
                }"
                class="flex-1 px-2 py-2 text-[11px] font-medium border-b-2 transition-colors"
              >
                {{ tab.label }}
              </button>
            </div>
      
            <!-- Resumen mensual integrado -->
            <div class="p-2">
              <div class="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div class="text-sm font-bold text-green-600 dark:text-green-400">{{ getMonthlyStats().approved }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Aprobados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-red-600 dark:text-red-400">{{ getMonthlyStats().rejected }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Rechazados</div>
                </div>
                <div>
                  <div class="text-sm font-bold text-yellow-600 dark:text-yellow-400">{{ getPendingItems().length }}</div>
                  <div class="text-[9px] text-gray-600 dark:text-gray-400">Pendientes</div>
                </div>
                <div>
                  <div class="text-[12px] font-bold text-blue-600 dark:text-blue-400">L. {{ formatCurrency(getMonthlyStats().total) }}</div>
                  <div class="text-[8px] text-gray-600 dark:text-gray-400">Total {{ getSelectedMonthName() }}</div>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Filtros por estado con 4 opciones -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <div class="flex bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
              <button 
                v-for="filter in [
                  { id: 'all', label: '📋Todos', count: getAllItems().length, color: 'blue' },
                  { id: 'pending', label: '⏳Pendientes', count: getPendingItems().length, color: 'yellow' },
                  { id: 'approved', label: '✅Aprobados', count: getApprovedItems().length, color: 'green' },
                  { id: 'rejected', label: '❌Rechazados', count: getRejectedItems().length, color: 'red' }
                ]"
                :key="filter.id"
                @click="setStatusFilter(filter.id)"
                :class="{
                  'bg-blue-600 text-white': statusFilter === 'all' && filter.id === 'all',
                  'bg-yellow-600 text-white': statusFilter === 'pending' && filter.id === 'pending',
                  'bg-green-600 text-white': statusFilter === 'approved' && filter.id === 'approved',
                  'bg-red-600 text-white': statusFilter === 'rejected' && filter.id === 'rejected',
                  'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600': statusFilter !== filter.id
                }"
                class="px-2 py-1 text-[10px] font-medium transition-colors"

                :title="filter.id === 'all' ? 'Todos' : 
                       filter.id === 'pending' ? 'Pendientes' :
                       filter.id === 'approved' ? 'Aprobados' : 'Rechazados'"
              >
                {{ filter.label }} ({{ filter.count }})
              </button>
            </div>
          </div>
      
          <div class="space-y-1.5">
            <div v-if="isLoadingData" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p class="mt-1.5 text-[11px] text-gray-600 dark:text-gray-400">Cargando {{ getLoadingMessage() }}...</p>
            </div>
      
            <div v-else-if="getCurrentTabData().length === 0" class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center border border-dashed border-gray-200 dark:border-gray-600">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Sin {{ getEmptyMessage() }}</h3>
              <p class="text-[11px] text-gray-600 dark:text-gray-400">No hay {{ getEmptyMessage() }} {{ getStatusFilterText() }}</p>
            </div>
      
            <template v-else>
              <div class="grid grid-cols-2 gap-1.5">
                <div v-for="item in getCurrentTabData()" :key="item.id"
                     :class="getItemCardClass(item.status)"
                     class="rounded-lg p-2 shadow-sm border text-[11px]">
                  <div class="mb-2">
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center space-x-1.5">
                        <div :class="getItemIconClass(item.status)" class="w-5 h-5 rounded flex items-center justify-center">
                          <span :class="getItemIconTextClass(item.status)" class="text-[10px]">{{ getItemIcon() }}</span>
                        </div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-[10px] truncate">{{ getItemTitle(item) }}</h3>
                      </div>
                      <p :class="getItemAmountClass(item.status)" class="font-bold text-[10px] whitespace-nowrap">L. {{ formatCurrency(item.amount) }}</p>
                    </div> 
                  </div>
                  <button @click="showItemDetails(item)" 
                          class="w-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[9px] px-2 py-1 rounded font-medium transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Sección de Reportería -->
      <section class="px-2 sm:px-4 mb-4 sm:mb-6">
        <div class="flex items-center justify-between mb-2 sm:mb-3">
          <h2 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white">Reportes</h2>
        </div>

        <!-- Selector de fechas para reportes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 shadow border border-gray-100 dark:border-gray-700">
          <h3 class="text-xs font-semibold text-gray-900 dark:text-white mb-2">Período del Reporte</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Desde</label>
              <input 
                type="date"
                v-model="reportDateFrom"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
            <div>
              <label class="text-[11px] text-gray-500 dark:text-gray-400 mb-0.5 block">Hasta</label>
              <input 
                type="date"
                v-model="reportDateTo"
                class="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-xs rounded px-2 py-1.5"
              />
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 gap-2">
          <div v-for="report in availableReports" :key="report.id"
               class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow border border-gray-100 dark:border-gray-700">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-start gap-2 min-w-0">
                <div :class="report.iconClass" class="w-8 h-8 sm:w-9 sm:h-9 rounded flex-shrink-0 flex items-center justify-center">
                  <span class="text-base">{{ report.icon }}</span>
                </div>
                <div class="min-w-0">
                  <h3 class="font-bold text-gray-900 dark:text-white text-xs sm:text-sm leading-tight">{{ report.title }}</h3>
                  <p class="text-[11px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-1">{{ report.description }}</p>
                </div>
              </div>
              <button @click="generateReport(report)" :disabled="report.generating"
                      class="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-[11px] px-2 py-1.5 rounded font-medium transition-colors flex items-center gap-1 whitespace-nowrap">
                <span v-if="report.generating" class="animate-spin text-[10px]">⏳</span>
                <span v-else class="text-[9px]">PDF ⬇️</span>
              </button>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-center text-[10px] sm:text-xs mt-2">
              <div v-for="metric in report.metrics" :key="metric.label" class="bg-gray-50 dark:bg-gray-700/50 p-1 rounded">
                <p class="font-bold text-gray-900 dark:text-white">{{ metric.value }}</p>
                <p class="text-gray-500 dark:text-gray-400 text-[9px] sm:text-[10px]">{{ metric.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FootersFooterAdmin />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// ===== VARIABLES DE ESTADO =====
const currentUser = ref({ nombre: 'Admin Principal' })
const isLoading = ref(false)
const isLoadingData = ref(false)
const isLoadingTransactions = ref(false)
const selectedChart = ref('earnings')
const activeTab = ref('membership')
const selectedPeriod = ref('1')
const selectedMonthInput = ref(new Date().toISOString().slice(0, 7)) // YYYY-MM format
const statusFilter = ref('all') // 'all', 'pending', 'approved', 'rejected'
const showDetailsModal = ref(false)
const selectedItem = ref(null)
const modalType = ref('') // 'membership', 'visits', 'services', 'withdrawals'

// Variables para reportería
const reportDateFrom = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
const reportDateTo = ref(new Date().toISOString().split('T')[0])

// ===== DATOS REACTIVOS =====
const executiveSummary = reactive({
  totalTechnicians: 156,
  monthlyServices: 1247,
  averageSatisfaction: 94.2,
  responseTime: 2.3,
  monthlyRevenue: 480760,
  totalRevenue: 3247890,
  monthlyCommissions: 89760,
  totalCommissions: 623450,
  monthlyWithdrawals: 145320,
  totalWithdrawals: 876540,
  monthlyReferrals: 25640,
  totalReferrals: 156780
})

const platformStats = reactive({
  newUsers: 247,
  membershipRevenue: 89760,
  visitRevenue: 156420,
  serviceRevenue: 234580,
  totalWithdrawals: 145320
})

const transactions = ref([])
const membershipPayments = ref([])
const visitPayments = ref([])
const servicePayments = ref([])
const pendingWithdrawals = ref([])
const visibleTransactionsCount = ref(5)
const hasMoreTransactions = ref(true)

// Variables de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'info'
})

// ===== REPORTES DISPONIBLES =====
const availableReports = ref([
  {
    id: 1,
    title: 'Reporte Financiero Mensual',
    description: 'Resumen completo de ingresos y gastos',
    icon: '💰',
    iconClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    generating: false,
    metrics: [
      { label: 'Ingresos', value: 'L. 480,760' },
      { label: 'Comisiones', value: 'L. 89,760' },
      { label: 'Crecimiento', value: '+18.5%' }
    ]
  },
  {
    id: 2,
    title: 'Reporte de Usuarios y Técnicos',
    description: 'Estadísticas de registros y actividad',
    icon: '👥',
    iconClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    generating: false,
    metrics: [
      { label: 'Nuevos', value: '247' },
      { label: 'Técnicos', value: '156' },
      { label: 'Activos', value: '89.2%' }
    ]
  },
  {
    id: 3,
    title: 'Reporte de Servicios Detallado',
    description: 'Análisis completo por categorías y regiones',
    icon: '🛠️',
    iconClass: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    generating: false,
    metrics: [
      { label: 'Completados', value: '1,247' },
      { label: 'Pendientes', value: '89' },
      { label: 'Satisfacción', value: '94.2%' }
    ]
  },
  {
    id: 4,
    title: 'Reporte de Transacciones',
    description: 'Detalle de todos los movimientos financieros',
    icon: '📊',
    iconClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    generating: false,
    metrics: [
      { label: 'Transacciones', value: '2,847' },
      { label: 'Retiros', value: '342' },
      { label: 'Volumen', value: 'L. 1.2M' }
    ]
  }
])

// ===== CONSTANTES =====
const availableCharts = [
  { id: 'earnings', name: '📈 Ingresos Mensuales' },
  { id: 'serviceTypes', name: '🛠️ Servicios por Tipo' },
  { id: 'services', name: '📊 Servicios por Mes' },
  { id: 'users', name: '👥 Crecimiento de Usuarios' },
  { id: 'cities', name: '🏙️ Servicios por Ciudad' }
]

// Función para generar etiquetas de meses dinámicas
const generateMonthLabels = () => {
  const labels = []
  const currentDate = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
    labels.push(date.toLocaleDateString('es-ES', { month: 'short' }))
  }
  
  return labels
}

// Datos para gráficos
const earningsData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Ingresos Mensuales',
    data: [45000, 52000, 48000, 61000, 59000, 67000, 73000, 69000, 78000, 82000, 89000, 94000],
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    tension: 0.4,
    fill: true
  }]
})

const serviceTypesData = reactive({
  labels: ['Electricidad', 'Plomería', 'Climatización', 'Carpintería', 'Pintura', 'Limpieza'],
  datasets: [{
    data: [387, 245, 198, 156, 98, 67],
    backgroundColor: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899'],
    borderWidth: 0
  }]
})

const servicesData = reactive({
  labels: generateMonthLabels(),
  datasets: [{
    label: 'Servicios Realizados',
    data: [85, 92, 78, 105, 98, 112, 125, 118, 132, 145, 158, 167],
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
})

const usersData = reactive({
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [{
    label: 'Usuarios Registrados',
    data: [150, 280, 420, 650, 890, 1200],
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
    borderWidth: 3,
    tension: 0.3,
    fill: true
  }]
})

const citiesData = reactive({
  labels: ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba', 'Choluteca', 'Comayagua'],
  datasets: [{
    data: [387, 245, 156, 98, 67],
    backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#EF4444', '#06B6D4'],
    borderWidth: 0
  }]
})

// ===== COMPUTED PROPERTIES =====
const visibleTransactions = computed(() => {
  return transactions.value.slice(0, visibleTransactionsCount.value)
})

// ===== FUNCIONES DE UTILIDAD =====
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0'
  return parseFloat(value).toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0'
  return parseInt(value).toLocaleString()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { day: '2-digit', month: 'short', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Completado': return 'text-green-600 dark:text-green-400'
    case 'Pendiente': return 'text-yellow-600 dark:text-yellow-400'
    case 'Cancelado': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'Rechazado': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'Pendiente': 
    default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
  }
}

const getTransactionIcon = (type) => {
  switch (type) {
    case 'commission': return '💰'
    case 'withdrawal': return '💳'
    case 'refund': return '↩️'
    default: return '💸'
  }
}

const getTransactionIconClass = (type) => {
  switch (type) {
    case 'commission': return 'bg-green-500'
    case 'withdrawal': return 'bg-red-500'
    case 'refund': return 'bg-yellow-500'
    default: return 'bg-blue-500'
  }
}

const getTransactionAmountClass = (type) => {
  return type === 'commission' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
}

// ===== FUNCIONES DE ESTADÍSTICAS =====
const updateStats = () => {
  const baseStats = {
    newUsers: { '1': 247, '6': 1452, 'all': 2847 },
    membershipRevenue: { '1': 89760, '6': 523840, 'all': 1247600 },
    visitRevenue: { '1': 156420, '6': 892340, 'all': 2134580 },
    serviceRevenue: { '1': 234580, '6': 1345670, 'all': 3245890 },
    totalWithdrawals: { '1': 145320, '6': 876540, 'all': 2098760 }
  }
  
  const period = selectedPeriod.value
  platformStats.newUsers = baseStats.newUsers[period]
  platformStats.membershipRevenue = baseStats.membershipRevenue[period]
  platformStats.visitRevenue = baseStats.visitRevenue[period]
  platformStats.serviceRevenue = baseStats.serviceRevenue[period]
  platformStats.totalWithdrawals = baseStats.totalWithdrawals[period]
}

// ===== FUNCIONES DE FILTROS =====
const getAllItems = () => {
  switch (activeTab.value) {
    case 'membership': return membershipPayments.value
    case 'visits': return visitPayments.value
    case 'services': return servicePayments.value
    case 'withdrawals': return pendingWithdrawals.value
    default: return []
  }
}

const getPendingItems = () => {
  return getAllItems().filter(item => item.status === 'Pendiente')
}

const getApprovedItems = () => {
  return getAllItems().filter(item => item.status === 'Aprobado')
}

const getRejectedItems = () => {
  return getAllItems().filter(item => item.status === 'Rechazado')
}

const getReviewedItems = () => {
  return getAllItems().filter(item => item.status === 'Aprobado' || item.status === 'Rechazado')
}

const setStatusFilter = async (filter) => {
  statusFilter.value = filter
  // Forzar actualización de los datos
  await nextTick()
  // Si es necesario, forzar la recarga de datos
  if (getCurrentTabData().length === 0) {
    await loadTabData()
  }
}

const getStatusFilterText = () => {
  switch (statusFilter.value) {
    case 'pending': return 'pendientes'
    case 'approved': return 'aprobados'
    case 'rejected': return 'rechazados'
    default: return ''
  }
}

// ===== FUNCIONES DE PESTAÑAS =====
const getCurrentTabData = () => {
  let items = getAllItems()
  
  switch (statusFilter.value) {
    case 'pending': return getPendingItems()
    case 'approved': return getApprovedItems()
    case 'rejected': return getRejectedItems()
    default: return items
  }
}

const getLoadingMessage = () => {
  switch (activeTab.value) {
    case 'membership': return 'pagos de membresía'
    case 'visits': return 'pagos de visitas'
    case 'services': return 'pagos de servicios'
    case 'withdrawals': return 'retiros solicitados'
    default: return 'datos'
  }
}

const getEmptyMessage = () => {
  switch (activeTab.value) {
    case 'membership': return 'pagos de membresía'
    case 'visits': return 'pagos de visitas'
    case 'services': return 'pagos de servicios'
    case 'withdrawals': return 'retiros pendientes'
    default: return 'elementos'
  }
}

const updateSelectedMonth = () => {
  loadTabData()
  loadTransactions()
}

const getSelectedMonthName = () => {
  const date = new Date(selectedMonthInput.value + '-01')
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

const getMonthlyStats = () => {
  // Simular estadísticas mensuales basadas en el mes seleccionado
  const baseStats = {
    membership: { approved: 45, rejected: 8, total: 125430 },
    visits: { approved: 78, rejected: 12, total: 234560 },
    services: { approved: 92, rejected: 15, total: 345670 },
    withdrawals: { approved: 34, rejected: 5, total: 89760 }
  }
  
  return baseStats[activeTab.value] || { approved: 0, rejected: 0, total: 0 }
}

const getItemCardClass = (status) => {
  const baseClass = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
  
  switch (status) {
    case 'Aprobado': return baseClass + ' border-l-4 border-l-green-500'
    case 'Rechazado': return baseClass + ' border-l-4 border-l-red-500'
    case 'Pendiente':
    default: return baseClass + ' border-l-4 border-l-yellow-500'
  }
}

const getItemIconClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'bg-green-100 dark:bg-green-900/30'
    case 'Rechazado': return 'bg-red-100 dark:bg-red-900/30'
    case 'Pendiente':
    default: return 'bg-yellow-100 dark:bg-yellow-900/30'
  }
}

const getItemIconTextClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'text-green-600 dark:text-green-400'
    case 'Rechazado': return 'text-red-600 dark:text-red-400'
    case 'Pendiente':
    default: return 'text-yellow-600 dark:text-yellow-400'
  }
}

const getItemIcon = () => {
  switch (activeTab.value) {
    case 'membership': return '💳'
    case 'visits': return '🏠'
    case 'services': return '🛠️'
    case 'withdrawals': return '💳'
    default: return '📄'
  }
}

const getItemAmountClass = (status) => {
  switch (status) {
    case 'Aprobado': return 'text-green-600 dark:text-green-400'
    case 'Rechazado': return 'text-red-600 dark:text-red-400'
    case 'Pendiente':
    default: return 'text-yellow-600 dark:text-yellow-400'
  }
}

const getItemTitle = (item) => {
  let title;
  switch (activeTab.value) {
    case 'membership': title = item.plan; break;
    case 'visits': title = item.service; break;
    case 'services': title = item.serviceName; break;
    case 'withdrawals': title = item.technician; break;
    default: return 'Item';
  }
  return title.length > 12 ? `${title.substring(0, 12)}...` : title;
}

const getItemSubtitle = (item) => {
  switch (activeTab.value) {
    case 'membership': return `${item.user} • ${formatDate(item.date)}`
    case 'visits': return `${item.client} • ${formatDate(item.date)}`
    case 'services': return `${item.client} • ${formatDate(item.date)}`
    case 'withdrawals': return `Solicitado: ${formatDate(item.date)}`
    default: return ''
  }
}

// ===== FUNCIONES DE MODAL =====
const showItemDetails = (item) => {
  selectedItem.value = item
  modalType.value = activeTab.value
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedItem.value = null
  modalType.value = ''
}

const getModalIconClass = () => {
  switch (modalType.value) {
    case 'membership': return 'bg-gradient-to-r from-green-500 to-green-600'
    case 'visits': return 'bg-gradient-to-r from-blue-500 to-blue-600'
    case 'services': return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
    case 'withdrawals': return 'bg-gradient-to-r from-red-500 to-red-600'
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600'
  }
}

const getModalIcon = () => {
  switch (modalType.value) {
    case 'membership': return '💳'
    case 'visits': return '🏠'
    case 'services': return '🛠️'
    case 'withdrawals': return '💳'
    default: return '📄'
  }
}

const getModalTitle = () => {
  switch (modalType.value) {
    case 'membership': return 'Detalles del Pago de Membresía'
    case 'visits': return 'Detalles del Pago de Visita'
    case 'services': return 'Detalles del Pago de Servicio'
    case 'withdrawals': return 'Detalles del Retiro'
    default: return 'Detalles'
  }
}

const getModalSubtitle = () => {
  if (!selectedItem.value) return ''
  switch (modalType.value) {
    case 'membership': return selectedItem.value.user
    case 'visits': return selectedItem.value.client
    case 'services': return selectedItem.value.client
    case 'withdrawals': return selectedItem.value.technician
    default: return ''
  }
}

const getModalAmountClass = () => {
  switch (modalType.value) {
    case 'membership': return 'text-green-600 dark:text-green-400'
    case 'visits': return 'text-blue-600 dark:text-blue-400'
    case 'services': return 'text-yellow-600 dark:text-yellow-400'
    case 'withdrawals': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-600'
  }
}

const getServiceLabel = () => {
  switch (modalType.value) {
    case 'membership': return 'Plan'
    case 'visits': return 'Servicio'
    case 'services': return 'Servicio'
    default: return 'Elemento'
  }
}

const getItemService = () => {
  if (!selectedItem.value) return ''
  switch (modalType.value) {
    case 'membership': return selectedItem.value.plan
    case 'visits': return selectedItem.value.service
    case 'services': return selectedItem.value.serviceName
    default: return ''
  }
}

const getAccountDetails = () => {
  if (!selectedItem.value) return ''
  switch (modalType.value) {
    case 'membership':
      return `Método de Pago: ${selectedItem.value.method}
Plan: ${selectedItem.value.plan}
Usuario: ${selectedItem.value.user}
Email: ${selectedItem.value.user.toLowerCase().replace(' ', '.')}@email.com
Vencimiento: ${formatDate(selectedItem.value.expires)}`
    case 'visits':
      return `Servicio: ${selectedItem.value.service}
Cliente: ${selectedItem.value.client}
Técnico: ${selectedItem.value.technician}
Duración: ${selectedItem.value.duration}
Email: ${selectedItem.value.client.toLowerCase().replace(' ', '.')}@email.com`
    case 'services':
      return `Servicio: ${selectedItem.value.serviceName}
Cliente: ${selectedItem.value.client}
Técnico: ${selectedItem.value.technician}
Categoría: ${selectedItem.value.category}
Email: ${selectedItem.value.client.toLowerCase().replace(' ', '.')}@email.com`
    case 'withdrawals':
      return selectedItem.value.bankDetails || `Banco: BAC Honduras
Cuenta: 123456789
Titular: ${selectedItem.value.technician}
Tipo: Cuenta de Ahorros
Cédula: 0801-1985-12345`
    default: return ''
  }
}

const approveItem = () => {
  if (!selectedItem.value) return
  
  const itemType = modalType.value === 'membership' ? 'pago de membresía' : 
                   modalType.value === 'visits' ? 'pago de visita' : 
                   modalType.value === 'services' ? 'pago de servicio' : 'retiro'
  
  // Cambiar estado en lugar de eliminar
  selectedItem.value.status = 'Aprobado'
  selectedItem.value.reviewedAt = new Date().toISOString()
  
  showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} aprobado correctamente`, 'success')
  closeDetailsModal()
}

const rejectItem = () => {
  if (!selectedItem.value) return
  
  const itemType = modalType.value === 'membership' ? 'pago de membresía' : 
                   modalType.value === 'visits' ? 'pago de visita' : 
                   modalType.value === 'services' ? 'pago de servicio' : 'retiro'
  
  // Cambiar estado en lugar de eliminar
  selectedItem.value.status = 'Rechazado'
  selectedItem.value.reviewedAt = new Date().toISOString()
  
  showToast(`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} rechazado`, 'warning')
  closeDetailsModal()
}

// ===== FUNCIONES DE REPORTERÍA =====
const generateReport = async (report) => {
  report.generating = true
  
  try {
    // Simular tiempo de generación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Crear contenido del PDF
    const { jsPDF } = window.jspdf
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text(report.title, 20, 30)
    
    doc.setFontSize(12)
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 45)
    doc.text(`Período: ${formatDate(reportDateFrom.value)} - ${formatDate(reportDateTo.value)}`, 20, 55)
    doc.text('HogarSeguro - Sistema Administrativo', 20, 65)
    
    // Contenido basado en el tipo de reporte
    let yPosition = 90
    
    switch (report.id) {
      case 1: // Reporte Financiero
        doc.setFontSize(14)
        doc.text('Resumen Financiero', 20, yPosition)
        yPosition += 20
        
        doc.setFontSize(10)
        doc.text(`Ingresos por Membresía: L. ${formatCurrency(platformStats.membershipRevenue)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Ingresos por Visitas: L. ${formatCurrency(platformStats.visitRevenue)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Ingresos por Servicios: L. ${formatCurrency(platformStats.serviceRevenue)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Total de Ingresos: L. ${formatCurrency(platformStats.membershipRevenue + platformStats.visitRevenue + platformStats.serviceRevenue)}`, 20, yPosition)
        break
        
      case 2: // Reporte de Usuarios
        doc.setFontSize(14)
        doc.text('Estadísticas de Usuarios y Técnicos', 20, yPosition)
        yPosition += 20
        
        doc.setFontSize(10)
        doc.text(`Nuevos Usuarios (período): ${formatNumber(platformStats.newUsers)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Total de Técnicos: ${formatNumber(executiveSummary.totalTechnicians)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Servicios del Mes: ${formatNumber(executiveSummary.monthlyServices)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Satisfacción Promedio: ${executiveSummary.averageSatisfaction}%`, 20, yPosition)
        break
        
      case 3: // Reporte de Servicios
        doc.setFontSize(14)
        doc.text('Análisis de Servicios', 20, yPosition)
        yPosition += 20
        
        doc.setFontSize(10)
        doc.text(`Servicios Completados: ${formatNumber(executiveSummary.monthlyServices)}`, 20, yPosition)
        yPosition += 10
        doc.text(`Tiempo de Respuesta Promedio: ${executiveSummary.responseTime} horas`, 20, yPosition)
        yPosition += 10
        doc.text(`Índice de Satisfacción: ${executiveSummary.averageSatisfaction}%`, 20, yPosition)
        break
        
      case 4: // Reporte de Transacciones
        doc.setFontSize(14)
        doc.text('Resumen de Transacciones', 20, yPosition)
        yPosition += 20
        
        doc.setFontSize(10)
        doc.text(`Total de Transacciones: ${transactions.value.length}`, 20, yPosition)
        yPosition += 10
        doc.text(`Retiros Procesados: ${pendingWithdrawals.value.length}`, 20, yPosition)
        yPosition += 10
        doc.text(`Pagos de Membresía: ${membershipPayments.value.length}`, 20, yPosition)
        break
    }
    
    // Footer
    doc.setFontSize(8)
    doc.text('Este reporte fue generado automáticamente por el sistema HogarSeguro', 20, 280)
    
    // Descargar el PDF
    doc.save(`${report.title.replace(/\s+/g, '_')}_${reportDateFrom.value}_${reportDateTo.value}.pdf`)
    
    showToast(`${report.title} generado correctamente`, 'success')
    
  } catch (error) {
    showToast('Error al generar el reporte', 'error')
  } finally {
    report.generating = false
  }
}

// ===== FUNCIONES DE TOAST =====
const getToastClass = () => {
  switch (toast.value.type) {
    case 'success': return 'bg-green-500 text-white'
    case 'error': return 'bg-red-500 text-white'
    case 'warning': return 'bg-yellow-500 text-white'
    default: return 'bg-blue-500 text-white'
  }
}

const getToastIcon = () => {
  switch (toast.value.type) {
    case 'success': return '✅'
    case 'error': return '❌'
    case 'warning': return '⚠️'
    default: return 'ℹ️'
  }
}

const showToast = (message, type = 'info') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 5000)
}

// ===== FUNCIONES DE DATOS =====
const generateMockTransactions = () => {
  const types = ['commission', 'withdrawal', 'refund']
  const statuses = ['Completado', 'Pendiente', 'Cancelado']
  const technicians = ['Carlos Mendoza', 'Ana Rodriguez', 'Miguel Santos', 'Sofia Martinez']
  const descriptions = [
    'Comisión por servicio de electricidad',
    'Retiro de ganancias',
    'Reembolso por cancelación',
    'Comisión por reparación de plomería',
    'Pago por servicio de climatización'
  ]

  return Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.floor(Math.random() * 1000) + 100,
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    technician: technicians[Math.floor(Math.random() * technicians.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }))
}

const generateMockMembershipPayments = () => {
  const plans = ['Plan Básico', 'Plan Premium', 'Plan Pro']
  const users = ['Juan Pérez', 'María González', 'Carlos López', 'Ana Martínez', 'Roberto Silva', 'Carmen Flores']
  const methods = ['Tarjeta de Crédito', 'Transferencia', 'PayPal']
  const statuses = ['Pendiente', 'Aprobado', 'Rechazado']

  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    plan: plans[Math.floor(Math.random() * plans.length)],
    user: users[Math.floor(Math.random() * users.length)],
    amount: [99, 199, 299][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    method: methods[Math.floor(Math.random() * methods.length)],
    expires: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    status: i < 3 ? 'Pendiente' : statuses[Math.floor(Math.random() * statuses.length)]
  }))
}

const generateMockVisitPayments = () => {
  const services = ['Reparación Eléctrica', 'Instalación de Tubería', 'Mantenimiento AC', 'Pintura', 'Carpintería', 'Limpieza']
  const clients = ['Roberto Silva', 'Carmen Flores', 'Diego Morales', 'Lucia Herrera', 'Fernando López', 'Patricia Vega']
  const technicians = ['Carlos Mendoza', 'Ana Rodriguez', 'Miguel Santos', 'Sofia Martinez']
  const statuses = ['Pendiente', 'Aprobado', 'Rechazado']

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    service: services[Math.floor(Math.random() * services.length)],
    client: clients[Math.floor(Math.random() * clients.length)],
    technician: technicians[Math.floor(Math.random() * technicians.length)],
    amount: Math.floor(Math.random() * 500) + 200,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    duration: ['2 horas', '3 horas', '1.5 horas', '4 horas'][Math.floor(Math.random() * 4)],
    status: i < 4 ? 'Pendiente' : statuses[Math.floor(Math.random() * statuses.length)]
  }))
}

const generateMockServicePayments = () => {
  const services = ['Instalación Completa', 'Reparación Mayor', 'Mantenimiento Preventivo', 'Diagnóstico Técnico', 'Consultoría']
  const clients = ['Luis García', 'Elena Castro', 'Pedro Ramírez', 'Claudia Vega', 'Ricardo Torres', 'Mónica Herrera']
  const technicians = ['Carlos Mendoza', 'Ana Rodriguez', 'Miguel Santos', 'Sofia Martinez']
  const categories = ['Electricidad', 'Plomería', 'Climatización', 'Carpintería', 'Pintura']
  const statuses = ['Pendiente', 'Aprobado', 'Rechazado']

  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    serviceName: services[Math.floor(Math.random() * services.length)],
    client: clients[Math.floor(Math.random() * clients.length)],
    technician: technicians[Math.floor(Math.random() * technicians.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: Math.floor(Math.random() * 800) + 300,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: i < 5 ? 'Pendiente' : statuses[Math.floor(Math.random() * statuses.length)]
  }))
}

const generateMockWithdrawals = () => {
  const technicians = ['Carlos Mendoza', 'Ana Rodriguez', 'Miguel Santos', 'Sofia Martinez', 'Luis García', 'Patricia Morales']
  const statuses = ['Pendiente', 'Aprobado', 'Rechazado']
  const bankDetails = [
    `Banco: BAC Honduras
Cuenta: 123456789
Titular: Carlos Alberto Mendoza López
Tipo: Cuenta de Ahorros
Cédula: 0801-1985-12345`,
    `Banco: Banco Atlántida
Cuenta: 987654321
Titular: Ana Beatriz Rodriguez
Tipo: Cuenta Corriente
Cédula: 0801-1990-54321`,
    `Banco: Ficohsa
Cuenta: 456789123
Titular: Miguel Angel Santos
Tipo: Cuenta de Ahorros
Cédula: 0801-1988-67890`,
    `Banco: Banrural
Cuenta: 789123456
Titular: Sofia Martinez Gutierrez
Tipo: Cuenta de Ahorros
Cédula: 0801-1992-09876`
  ]

  return Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    technician: technicians[Math.floor(Math.random() * technicians.length)],
    amount: Math.floor(Math.random() * 2000) + 500,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    bankDetails: bankDetails[Math.floor(Math.random() * bankDetails.length)],
    status: i < 2 ? 'Pendiente' : statuses[Math.floor(Math.random() * statuses.length)]
  }))
}

const loadTransactions = async () => {
  isLoadingTransactions.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  transactions.value = generateMockTransactions()
  visibleTransactionsCount.value = 5
  hasMoreTransactions.value = transactions.value.length > 5
  isLoadingTransactions.value = false
}

const loadTabData = async () => {
  isLoadingData.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  switch (activeTab.value) {
    case 'membership':
      membershipPayments.value = generateMockMembershipPayments()
      break
    case 'visits':
      visitPayments.value = generateMockVisitPayments()
      break
    case 'services':
      servicePayments.value = generateMockServicePayments()
      break
    case 'withdrawals':
      pendingWithdrawals.value = generateMockWithdrawals()
      break
  }
  
  isLoadingData.value = false
}

const loadMoreTransactions = () => {
  const remaining = transactions.value.length - visibleTransactionsCount.value
  const toAdd = Math.min(5, remaining)
  visibleTransactionsCount.value += toAdd
  hasMoreTransactions.value = visibleTransactionsCount.value < transactions.value.length
}

const setActiveTab = (tab) => {
  if (activeTab.value === tab) return
  activeTab.value = tab
  statusFilter.value = 'all' // Reset filter when changing tabs
  loadTabData()
}

const exportData = () => {
  showToast('Exportando datos...', 'info')
  setTimeout(() => {
    showToast('Datos exportados correctamente', 'success')
  }, 2000)
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
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 11,
                  family: 'sans-serif',
                  weight: 500
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 6,
                boxHeight: 6
              }
            },
            tooltip: {
              backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
              titleColor: isDark ? '#F3F4F6' : '#111827',
              bodyColor: isDark ? '#9CA3AF' : '#4B5563',
              borderColor: isDark ? '#374151' : '#E5E7EB',
              borderWidth: 1,
              padding: 10,
              titleFont: {
                size: 12,
                weight: 'bold'
              },
              bodyFont: {
                size: 12
              },
              callbacks: {
                label: function(context) {
                  return 'L. ' + context.raw.toLocaleString('es-HN')
                },
                labelColor: function(context) {
                  return {
                    borderColor: 'transparent',
                    backgroundColor: context.dataset.backgroundColor,
                    borderRadius: 2,
                    borderWidth: 2
                  }
                }
              }
            },
            datalabels: {
              display: true,
              color: function(context) {
                return isDark ? '#E5E7EB' : '#1F2937';
              },
              anchor: 'center',
              align: 'center',
              formatter: (value) => 'L. ' + (value/1000).toFixed(0) + 'K',
              font: {
                weight: 'bold',
                size: 9,
                family: 'sans-serif'
              },
              textShadowColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              textShadowBlur: 2,
              textStrokeWidth: 0.5,
              textStrokeColor: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              display: function(context) {
                return context.dataset.data[context.dataIndex] > 0
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                },
                padding: 5,
                callback: function(value) {
                  return 'L. ' + (value/1000) + 'K'
                }
              },
              grid: {
                color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                drawBorder: false,
                drawTicks: false
              },
              border: {
                display: false
              }
            },
            x: {
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                },
                maxRotation: 45,
                minRotation: 45
              },
              grid: {
                display: false,
                drawBorder: false
              },
              border: {
                display: false
              }
            }
          }
        },
        plugins: [ChartDataLabels]
      }
      break

    case 'serviceTypes':
      config = {
        type: 'doughnut',
        data: serviceTypesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'left',
              labels: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                padding: 8,
                font: { 
                  size: 11, 
                  weight: '500',
                  family: 'sans-serif'
                },
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 6,
                boxHeight: 6
              }
            },
            datalabels: {
              formatter: (value, context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = Math.round((value / total) * 100)
                return percentage >= 5 ? percentage + '%' : ''
              },
              color: function(context) {
                // Make text color white for dark segments, black for light segments
                const bgColor = context.dataset.backgroundColor[context.dataIndex];
                // Simple brightness calculation from RGB
                if (typeof bgColor === 'string' && bgColor.startsWith('#')) {
                  const hex = bgColor.replace('#', '');
                  const r = parseInt(hex.substr(0, 2), 16);
                  const g = parseInt(hex.substr(2, 2), 16);
                  const b = parseInt(hex.substr(4, 2), 16);
                  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                  return brightness > 155 ? '#1F2937' : '#FFFFFF';
                }
                return '#FFFFFF';
              },
              font: { 
                weight: 'bold', 
                size: 10,
                family: 'sans-serif'
              },
              anchor: 'center',
              align: 'center'
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
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 11,
                  family: 'sans-serif',
                  weight: 500
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 6,
                boxHeight: 6
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                },
                padding: 5,
                stepSize: 1,
                precision: 0
              },
              grid: {
                color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                drawBorder: false,
                drawTicks: false
              },
              border: {
                display: false
              }
            },
            x: {
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280',
                font: {
                  size: 10,
                  family: 'sans-serif'
                },
                maxRotation: 45,
                minRotation: 45
              },
              grid: {
                display: false,
                drawBorder: false
              },
              border: {
                display: false
              }
            }
          }
        }
      }
      break

    case 'users':
      config = {
        type: 'line',
        data: usersData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: isDark ? '#ffffff' : '#374151'
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: isDark ? '#9CA3AF' : '#6B7280'
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
          }
        }
      }
      break

    case 'cities':
      config = {
        type: 'doughnut',
        data: citiesData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: isDark ? '#ffffff' : '#374151',
                padding: 20
              }
            }
          }
        }
      }
      break
  }

  window.currentChart = new Chart(ctx, config)
}

// ===== WATCHERS =====
watch(selectedChart, () => {
  nextTick(() => {
    createChart()
  })
})

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  Chart.register(...registerables)
  
  // Configurar tema oscuro
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

  // Cargar datos iniciales
  updateStats() // Inicializar estadísticas
  
  await Promise.all([
    loadTransactions(),
    loadTabData()
  ])
  createChart()
})
</script>