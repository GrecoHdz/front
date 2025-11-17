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
      :message="'Cargando programa de referidos...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderDashboard />

      <!-- Content Container with max-w-2xl -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
        <div class="pb-20">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Hero Section -->
            <section class="px-4 py-4">
              <div class="bg-gradient-to-br from-purple-600 via-pink-600 to-red-500 rounded-2xl p-5 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div class="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                
                <div class="relative text-center">
                  <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span class="text-3xl">💰</span>
                  </div>
                  <h1 class="text-2xl font-black mb-2">¡Gana Dinero Refiriendo!</h1>
                  <p class="text-white/90 font-medium mb-5 text-sm">
                    Invita a tus amigos y familiares a HogarSeguro y recibe el <span class="font-black">{{ referralReward }}%</span> de cada servicio que paguen 
                  </p>
                  
                  <!-- Stats -->
                  <div class="grid grid-cols-3 gap-3"> 
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div class="text-xl font-black">L. {{ stats.totalEarnings.toLocaleString('es-HN') }}</div>
                      <div class="text-xs text-white/80">Total Ganado</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div class="text-xl font-black">L. {{ stats.retirado.toLocaleString('es-HN') }}</div>
                      <div class="text-xs text-white/80">Total Retirado</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div class="text-xl font-black">L. {{ stats.availableBalance.toLocaleString('es-HN') }}</div>
                      <div class="text-xs text-white/80">Disponible</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Tu Código de Referido -->
            <section class="px-4 mb-4">
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="text-center mb-4">
                  <div class="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span class="text-white text-xl">🔗</span>
                  </div>
                  <h2 class="text-xl font-black text-gray-900 dark:text-white mb-2">Tu Código de Referido</h2>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">Comparte tu código único y empieza a ganar</p>
                </div> 

                <!-- Enlace de referido -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl mb-4">
                  <p class="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">ENLACE DE INVITACIÓN</p>
                  <div class="flex items-center space-x-2">
                    <div class="flex-1 bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                      <p class="text-sm text-gray-700 dark:text-gray-300 truncate">{{ referralLink }}</p>
                    </div>
                    <button 
                      @click="copyReferralLink"
                      class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-all duration-300"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Botones de compartir -->
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="shareWhatsApp"
                    class="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <span class="text-lg">📱</span>
                    <span class="font-bold text-sm">WhatsApp</span>
                  </button>
                  <button 
                    @click="shareGeneral"
                    class="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <span class="text-lg">🔗</span>
                    <span class="font-bold text-sm">Compartir</span>
                  </button>
                </div>
              </div>
            </section>

            <!-- Cómo Funciona -->
            <section class="px-4 mb-4">
              <h2 class="text-lg font-black text-gray-900 dark:text-white mb-3">¿Cómo Funciona?</h2>
              <div class="space-y-2">
                <div v-for="(step, index) in howItWorksSteps" :key="`step-${index}`"
                     class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-start space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span class="text-white font-black text-xs">{{ index + 1 }}</span>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-bold text-gray-900 dark:text-white text-sm mb-1">{{ step.title }}</h3>
                      <p class="text-gray-600 dark:text-gray-400 text-xs">{{ step.description }}</p>
                    </div>
                    <div class="text-xl">{{ step.icon }}</div>
                  </div>
                </div>
              </div>
            </section> 

            <!-- Historial de Ingresos/Retiros con pestañas -->
            <section class="px-4 mb-6">
              <h2 class="text-lg font-black text-gray-900 dark:text-white mb-3">Historial</h2>
              <div class="flex items-center justify-between mb-4">
                <div class="flex space-x-2">
                  <button 
                    @click="setActiveTab('ingresos')"
                    :class="{
                      'bg-blue-600 text-white': activeTab === 'ingresos',
                      'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300': activeTab !== 'ingresos'
                    }"
                    class="px-4 py-2 rounded-l-lg font-medium text-sm transition-colors"
                  >
                    Ingresos
                  </button>
                  <button 
                    @click="setActiveTab('retiros')"
                    :class="{
                      'bg-blue-600 text-white': activeTab === 'retiros',
                      'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300': activeTab !== 'retiros'
                    }"
                    class="px-4 py-2 rounded-r-lg font-medium text-sm transition-colors"
                  >
                    Retiros
                  </button>
                </div>
                
                <div class="flex items-center space-x-2">
                  <!-- Selector de fecha tipo mes -->
                  <div class="relative">
                    <div class="relative">
                      <input 
                        type="month"
                        :value="activeTab === 'ingresos' ? selectedMonth : selectedWithdrawMonth"
                        @change="(e) => handleMonthChange(e, activeTab)"
                        class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-10 py-1.5"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="space-y-2">
                <!-- Sección de Ingresos -->
                <template v-if="activeTab === 'ingresos'">
                  <!-- Loading -->
                  <div v-if="isLoadingMovements" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando ingresos...</p>
                  </div>
                  
                  <!-- Mostrar mensaje cuando no hay ingresos -->
                  <div v-else-if="filteredEarnings.length === 0" class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Sin ingresos registrados</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ getNoEarningsMessage() }}
                    </p>
                  </div>

                  <!-- Lista de ingresos -->
                  <template v-else>
                    <div v-for="earning in filteredEarnings" :key="earning.fecha + earning.monto"
                         class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2 hover:shadow-md transition-shadow">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p class="font-bold text-gray-900 dark:text-white text-sm">
                              {{ earning.descripcion ? (earning.descripcion.includes(' - ') ? earning.descripcion.split(' - ')[1] : earning.descripcion) : 'Ingreso por referido' }}
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                              {{ formatDate(earning.fecha) }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="font-bold text-green-600 dark:text-green-400">+L. {{ formatCurrency(earning.monto) }}</p>
                          <p class="text-xs" :class="getStatusColor(earning.estado)">
                            {{ earning.estado }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Botón Ver más ingresos -->
                    <div v-if="hasMoreMovements" class="text-center mt-4">
                      <button 
                        @click="loadMoreEarnings" 
                        class="w-full py-2 text-sm font-medium text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        :disabled="isLoadingMovements"
                      >
                        <span v-if="isLoadingMovements">
                          Cargando...
                        </span>
                        <span v-else>
                          Ver más ingresos ({{ totalMovements - filteredEarnings.length }} restantes)
                        </span>
                      </button>
                    </div>

                    <!-- Resumen del período seleccionado -->
                    <div v-if="movementSummary" class="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2"> 
                          <span class="text-sm font-medium text-green-700 dark:text-green-300">
                            Total {{ movementSummary.mes.toLowerCase() }}
                          </span>
                        </div>
                        <span class="text-lg font-bold text-green-800 dark:text-green-200">
                          L. {{ formatCurrency(movementSummary.totalIngresosReferido) }}
                        </span>
                      </div> 
                    </div>
                  </template>
                </template>

                <!-- Sección de Retiros -->
                <template v-else>
                  <!-- Loading -->
                  <div v-if="isLoadingMovements" class="text-center py-8">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando retiros...</p>
                  </div>
                  
                  <!-- Mostrar mensaje cuando no hay retiros -->
                  <div v-else-if="filteredWithdrawals.length === 0" class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div class="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">Sin retiros registrados</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ getNoWithdrawalsMessage() }}
                    </p>
                  </div>

                  <!-- Lista de retiros -->
                  <template v-else>
                    <div v-for="withdrawal in filteredWithdrawals" :key="withdrawal.fecha + withdrawal.monto"
                         class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-2">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p class="font-medium text-gray-900 dark:text-white">
                              {{ `Retiro de fondos #${withdrawalCounter - filteredWithdrawals.findIndex(w => w.id === withdrawal.id)}` }}
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">
                              {{ formatDate(withdrawal.fecha) }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="font-bold text-red-600 dark:text-red-400">L. {{ formatCurrency(withdrawal.monto) }}</p>
                          <p class="text-xs" :class="getStatusWithDrawalColor(withdrawal.estado)">
                            {{ withdrawal.estado }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Botón Ver más retiros -->
                    <div v-if="hasMoreMovements" class="text-center mt-4">
                      <button 
                        @click="loadMoreWithdrawals" 
                        class="w-full py-2 text-sm font-medium text-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        :disabled="isLoadingMovements"
                      >
                        <span v-if="isLoadingMovements">
                          Cargando...
                        </span>
                        <span v-else>
                          Ver más retiros ({{ totalMovements - filteredWithdrawals.length }} restantes)
                        </span>
                      </button>
                    </div>

                    <!-- Resumen del período seleccionado usando datos de la API -->
                    <div v-if="movementSummary" class="mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-red-700 dark:text-red-300">
                          Total {{ movementSummary.mes }}
                        </span>
                        <span class="text-lg font-bold text-red-800 dark:text-red-200">
                          L. {{ formatCurrency(movementSummary.totalRetiros) }}
                        </span>
                      </div> 
                    </div>
                  </template>
                </template>
              </div>
            </section>
            
            <!-- Retirar Ganancias -->
            <section class="px-4 mb-4"> 
              <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 relative">
                <div class="relative">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center">
                      <span class="text-gray-700 dark:text-gray-300 text-xl">💳</span>
                    </div>
                    <div>
                      <h2 class="text-xl font-black">Retirar Ganancias</h2>
                      <p class="text-white/90 text-sm">
                        Disponible: L. {{ (stats?.availableBalance || 0).toLocaleString('es-HN') }}
                        <span v-if="withdrawalPercentage > 0" class="block text-xs opacity-80">
                          Puedes retirar hasta el {{ withdrawalPercentage }}%: L. {{ (maxWithdrawableAmount || 0).toLocaleString('es-HN') }}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div class="w-full">
                    <button 
                      @click="showWithdrawModal = true"
                      :disabled="!canWithdrawFromTotal"
                      class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <template v-if="stats?.availableBalance > 0">
                        <template v-if="stats.availableBalance >= minWithdrawAmount">
                          Retirar Ahora
                        </template>
                        <template v-else>
                          Mínimo L. {{ minWithdrawAmount.toFixed(2) }}
                        </template>
                      </template>
                      <template v-else>
                        Sin saldo disponible
                      </template>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Historial de Referidos -->
            <section class="px-4 mb-4">
              <div class="flex items-center justify-between mb-3">
                <h2 class="text-lg font-black text-gray-900 dark:text-white">Tus Referidos</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ stats.totalReferrals || 0 }} personas</span>
              </div>
              
              <!-- Loading -->
              <div v-if="isLoadingReferrals" class="text-center py-8">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando referidos...</p>
              </div>
              
              <!-- Mostrar mensaje cuando no hay referidos -->
              <div v-else-if="!referralHistory || referralHistory.length === 0" class="text-center py-6">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span class="text-2xl">👥</span>
                </div>
                <h3 class="text-base font-black text-gray-900 dark:text-white mb-2">Aún no tienes referidos</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-3 text-sm">Comparte tu código y empieza a ganar dinero</p>
              </div>

              <!-- Lista de referidos -->
              <div v-else class="space-y-2">
                <div v-for="(referral, index) in referralHistory" :key="index"
                     class="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                        <span class="text-white text-lg">👤</span>
                      </div>
                      <div>
                        <p class="font-bold text-gray-900 dark:text-white text-sm">{{ referral.nombre }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(referral.fecha) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paginación de referidos -->
                <div v-if="referralsPagination.totalItems > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ referralHistory.length }} de {{ referralsPagination.totalItems }}
                    </div>
                    <div class="flex items-center space-x-2">
                      <button 
                        @click="previousReferralsPage" 
                        :disabled="referralsPagination.currentPage <= 1 || isLoadingReferrals"
                        class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        :class="{ 'opacity-50 cursor-not-allowed': referralsPagination.currentPage <= 1 }"
                        aria-label="Página anterior"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                        Página {{ referralsPagination.currentPage }} de {{ referralsPagination.totalPages }}
                      </span>
                      
                      <button 
                        @click="nextReferralsPage" 
                        :disabled="referralsPagination.currentPage >= referralsPagination.totalPages || isLoadingReferrals"
                        class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        :class="{ 'opacity-50 cursor-not-allowed': referralsPagination.currentPage >= referralsPagination.totalPages }"
                        aria-label="Página siguiente"
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

            <!-- Términos y Condiciones -->
            <section class="px-4 mb-4">
              <div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
                <div class="flex items-start space-x-2">
                  <div class="text-amber-500 text-lg flex-shrink-0">📋</div>
                  <div>
                    <h3 class="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">Términos del Programa</h3>
                    <ul class="space-y-1 text-xs text-amber-700 dark:text-amber-300">
                      <li v-for="term in referralTerms" :key="term" class="flex items-start space-x-2">
                        <span class="text-amber-500 text-xs mt-0.5">•</span>
                        <span>{{ term }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <FootersFooter />
    </div>

    <!-- Modal de Retiro -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showWithdrawModal" class="fixed inset-0 z-50 flex items-center justify-center p-3">
        <!-- Backdrop -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showWithdrawModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeWithdrawModal"
          ></div>
        </Transition>

        <!-- Modal Content -->
        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to">
          <div 
            v-if="showWithdrawModal"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-xs max-h-[90vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-base">
                    💳
                  </div>
                  <div>
                    <h3 class="text-base font-black text-gray-900 dark:text-white">Retirar Ganancias</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Disponible: L. {{ stats.availableBalance.toLocaleString('es-HN') }}</p>
                  </div>
                </div>
                <button @click="closeWithdrawModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-3">
              <form @submit.prevent="processWithdraw" class="space-y-4">
                <!-- Monto a Retirar -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Monto a Retirar ({{ withdrawalPercentage }}%)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">L.</span>
                    <input
                      type="text"
                      :value="(maxWithdrawableAmount).toFixed(2)"
                      class="w-full pl-8 pr-3 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
                      readonly
                      disabled
                    >
                  </div>
                </div>

                <!-- Monto a Crédito -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Monto a Crédito ({{ 100 - withdrawalPercentage }}%)
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">L.</span>
                    <input
                      type="text"
                      :value="(stats.availableBalance - maxWithdrawableAmount).toFixed(2)"
                      class="w-full pl-8 pr-3 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-300"
                      readonly
                      disabled
                    >
                  </div>
                </div>

                <!-- Datos Bancarios -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Datos Bancarios
                  </label>
                  <textarea
                    v-model="withdrawForm.bankDetails"
                    rows="3"
                    class="w-full px-3 py-3 text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese los datos de su cuenta bancaria (Banco, # de cuenta, nombre del titular, identidad, tipo)"
                    required
                  ></textarea>
                </div>

                <!-- Botón de envío -->
                <button 
                  type="submit"
                  :disabled="!isWithdrawFormValid || isProcessingWithdraw"
                  class="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                >
                  <span v-if="!isProcessingWithdraw">
                    Solicitar Retiro
                  </span>
                  <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                </button>
              </form>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Programa de Referidos',
  meta: [
    { name: 'description', content: 'Gana dinero refiriendo amigos a HogarSeguro - Programa de referidos' },
    { name: 'keywords', content: 'HogarSeguro, Programa de Referidos, Referir, Referidos' }, 
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Pasos de cómo funciona
const howItWorksSteps = [
  {
    title: 'Comparte tu código',
    description: 'Envía tu enlace a amigos y familiares',
    icon: '📱'
  },
  {
    title: 'Ellos se registran',
    description: 'Tus contactos se registran usando tu enlace',
    icon: '✍️'
  },
  {
    title: 'Contratan un servicio',
    description: 'Por cada servicio que contraten tu ganas un porcentaje',
    icon: '🏠'
  },
  {
    title: 'Recibes tu recompensa',
    description: 'Ganas dinero que puedes retirar inmediatamente',
    icon: '💰'
  }
]

// Términos del programa
const referralTerms = [
  '¡Gana un porcentaje cada vez que tu referido complete un servicio con éxito!',
  'Tus ganancias se acumulan automáticamente y puedes retirarlas cuando quieras.',
  'Al retirar tus ganancias un porcentaje lo recibirás como crédito', 
  'No hay límite en la cantidad de personas que puedes referir',
  'Los retiros se procesan en 24-72 horas hábiles'
] 

// =========================
// VARIABLES REACTIVAS
// =========================

// Estado de carga
const isLoading = ref(true)
const isLoadingMovements = ref(false)
const isLoadingReferrals = ref(false)

// Configuración del programa
const referralReward = ref(50)
const withdrawalPercentage = ref(0)
const minWithdrawAmount = ref(0)

// Estado reactivo para las estadísticas
const stats = ref({
  totalEarnings: 0,
  availableBalance: 0,
  retirado: 0,
  totalReferrals: 0
})

// Código de referido del usuario
const userReferralCode = ref('')

// Estados de modales
const showWithdrawModal = ref(false)
const isProcessingWithdraw = ref(false)

// Estado para el formulario de retiro
const withdrawForm = ref({
  amount: 0,
  creditAmount: 0,
  bankDetails: ''
})

// Historial de datos
const referralHistory = ref([])
const movementsHistory = ref([])
const withdrawalsHistory = ref([])

// Estados de vista y paginación
const activeTab = ref('ingresos')
const withdrawalCounter = ref(0)

// Estados de paginación para movimientos
const currentMovementsPage = ref(1)
const totalMovements = ref(0)
const hasMoreMovements = ref(false)

// Estados de paginación para referidos
const referralsPagination = ref({
  currentPage: 1,
  totalItems: 0,
  totalPages: 1,
  itemsPerPage: 3
})

// Configuración de paginación
const itemsPerPage = 3

// Mes actual para filtros
const currentDate = new Date()
const selectedMonth = ref(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`)
const selectedWithdrawMonth = ref(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`)

// Resumen de movimientos
const movementSummary = ref(null)

// Estados de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

// =========================
// COMPUTED PROPERTIES
// =========================

const referralLink = computed(() => {
  const userId = userCookie.value?.id_usuario || ''
  return `https://hogarseguro.hn/registro?ref=${userId}`
})

const maxWithdrawableAmount = computed(() => {
  const percentage = withdrawalPercentage.value / 100
  return Math.max(0, Math.floor(stats.value.availableBalance * percentage * 100) / 100)
})

const canWithdrawFromTotal = computed(() => {
  return (stats.value?.availableBalance || 0) > 0 && (stats.value?.availableBalance || 0) >= minWithdrawAmount.value
})

const isWithdrawFormValid = computed(() => {
  return withdrawForm.value.bankDetails?.trim().length >= 4
})

const filteredEarnings = computed(() => {
  return movementsHistory.value || []
})

const filteredWithdrawals = computed(() => {
  const withdrawals = withdrawalsHistory.value.filter(w => w.tipo === 'retiro');
  withdrawalCounter.value = withdrawals.length;
  return withdrawals.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
})

// =========================
// FUNCIONES UTILITARIAS
// =========================

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatCurrency = (amount) => {
  return parseFloat(amount).toLocaleString('es-HN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const getStatusColor = (status) => {
  const colors = {
    'completado': 'text-green-600 dark:text-green-400',
    'pendiente': 'text-yellow-600 dark:text-yellow-400',
    'cancelado': 'text-red-600 dark:text-red-400'
  }
  return colors[status?.toLowerCase()] || 'text-gray-600 dark:text-gray-400'
}

const getStatusWithDrawalColor = (status) => {
  const colors = {
    'completado': 'text-green-600 dark:text-green-400',
    'pendiente': 'text-yellow-600 dark:text-yellow-400',
    'procesando': 'text-blue-600 dark:text-blue-400',
    'cancelado': 'text-red-600 dark:text-red-400'
  }
  return colors[status?.toLowerCase()] || 'text-gray-600 dark:text-gray-400'
}

const getNoEarningsMessage = () => {
  const currentYear = new Date().getFullYear()
  const selectedYear = selectedMonth.value.split('-')[0]
  const selectedMonthNum = selectedMonth.value.split('-')[1]
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const monthName = monthNames[parseInt(selectedMonthNum) - 1]
  
  if (selectedYear === currentYear.toString()) {
    return `No hay ingresos registrados para ${monthName} ${selectedYear}`
  } else {
    return `No hay ingresos registrados para el período seleccionado`
  }
}

const getNoWithdrawalsMessage = () => {
  const currentYear = new Date().getFullYear()
  const selectedYear = selectedWithdrawMonth.value.split('-')[0]
  const selectedMonthNum = selectedWithdrawMonth.value.split('-')[1]
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
  const monthName = monthNames[parseInt(selectedMonthNum) - 1]
  
  if (selectedYear === currentYear.toString()) {
    return `No hay retiros registrados para ${monthName} ${selectedYear}`
  } else {
    return `No hay retiros registrados para el período seleccionado`
  }
}

// =========================
// FUNCIONES DE CARGA DE DATOS
// =========================

const loadReferralData = async () => {
  try {
    const user = useCookie('user').value
    if (!user?.id_usuario) return 
    
    // Cargar configuración de monto mínimo de retiro
    try {
      const minWithdrawConfig = await $fetch('/config/valor/retiro_minimo', {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });
      minWithdrawAmount.value = parseFloat(minWithdrawConfig?.valor || 0);
    } catch (error) {
      console.error('Error al cargar configuración de retiro mínimo:', error);
      minWithdrawAmount.value = 0;
    }

    const [configData, porcentajeRetiroData, ingresosData] = await Promise.all([
      $fetch('/config/valor/porcentaje_referido', {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      }),
      $fetch('/config/valor/porcentaje_retiro', {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      }),
      $fetch(`/movimientos/ingresos/referidos/${user.id_usuario}`, {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      })
    ]) 

    // Configurar porcentaje de recompensa por referido
    if (configData?.valor) {
      referralReward.value = parseInt(configData.valor) 
    }

    // Configurar porcentaje de retiro desde la respuesta del backend
    if (porcentajeRetiroData?.valor) {
      const porcentaje = parseInt(porcentajeRetiroData.valor)
      withdrawalPercentage.value = Math.min(100, Math.max(0, porcentaje))
      
      if (showWithdrawModal.value) {
        const halfAmount = (maxWithdrawableAmount.value * (withdrawalPercentage.value / 100)).toFixed(2)
        const creditAmount = (maxWithdrawableAmount.value * ((100 - withdrawalPercentage.value) / 100)).toFixed(2)
        
        withdrawForm.value = {
          ...withdrawForm.value,
          amount: parseFloat(halfAmount),
          creditAmount: parseFloat(creditAmount)
        }
      }
    }

    if (ingresosData?.success) {
      stats.value = {
        totalEarnings: ingresosData.total || 0,
        availableBalance: ingresosData.saldoDisponible || 0,
        retirado: ingresosData.retirado || 0,
        totalReferrals: 0
      } 
    }

    // Cargar los referidos inicialmente
    await loadReferrals()

    // Generar código de referido
    userReferralCode.value = `HR${user.id_usuario.toString().padStart(6, '0')}`
    
  } catch (error) {
    console.error('Error al cargar datos de referidos:', error)
    
    // Generar código de respaldo
    const user = useCookie('user').value
    userReferralCode.value = user?.id_usuario ? `HR${user.id_usuario.toString().padStart(6, '0')}` : 'HR000001'
    
    showError('No se pudo cargar la información de recompensas. Mostrando valor por defecto.')
  }
}

const loadReferrals = async (page = 1) => {
  const user = useCookie('user').value
  if (!user?.id_usuario) return

  isLoadingReferrals.value = true

  try {
    const response = await $fetch(`/referidos/${user.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      query: {
        page: page,
        limit: referralsPagination.value.itemsPerPage
      }
    })

    if (response?.success) {
      referralHistory.value = response.data || []
      
      // Actualizar información de paginación
      referralsPagination.value = {
        currentPage: response.pagination?.page || 1,
        totalItems: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 1,
        itemsPerPage: response.pagination?.limit || referralsPagination.value.itemsPerPage
      }
      
      // Actualizar estadísticas
      stats.value.totalReferrals = referralsPagination.value.totalItems
    }
  } catch (error) {
    console.error('Error al cargar referidos:', error)
    showError('Error al cargar los referidos')
    referralHistory.value = []
  } finally {
    isLoadingReferrals.value = false
  }
}

const nextReferralsPage = async () => {
  if (referralsPagination.value.currentPage < referralsPagination.value.totalPages) {
    await loadReferrals(referralsPagination.value.currentPage + 1)
  }
}

const previousReferralsPage = async () => {
  if (referralsPagination.value.currentPage > 1) {
    await loadReferrals(referralsPagination.value.currentPage - 1)
  }
}

const loadMovements = async (tipo = 'ingreso_referido', month = null, loadMore = false) => {
  const user = useCookie('user').value
  if (!user?.id_usuario) return

  if (!loadMore) {
    currentMovementsPage.value = 1
    hasMoreMovements.value = true
    if (tipo === 'ingreso_referido') {
      movementsHistory.value = []
    } else {
      withdrawalsHistory.value = []
    }
  } else {
    currentMovementsPage.value++
  }

  isLoadingMovements.value = true

  try {
    const selectedMonthValue = month || (tipo === 'ingreso_referido' ? selectedMonth.value : selectedWithdrawMonth.value)
    const monthNumber = selectedMonthValue.split('-')[1]
    
    const response = await $fetch(`/movimientos/historial/referidos/${user.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      query: {
        mes: parseInt(monthNumber),
        tipo: tipo,
        page: currentMovementsPage.value,
        limit: itemsPerPage
      }
    })

    if (response?.success) {
      if (tipo === 'ingreso_referido') {
        movementsHistory.value = loadMore 
          ? [...movementsHistory.value, ...(response.data || [])] 
          : (response.data || [])
      } else if (tipo === 'retiro') {
        withdrawalsHistory.value = loadMore 
          ? [...withdrawalsHistory.value, ...(response.data || [])] 
          : (response.data || [])
      }
      
      if (response.summary) {
        if (loadMore && movementSummary.value) {
          // Si estamos cargando más, sumamos los totales
          movementSummary.value = {
            mes: response.summary.mes || movementSummary.value.mes,
            totalIngresosReferido: parseFloat(movementSummary.value.totalIngresosReferido || 0) + parseFloat(response.summary.totalIngresosReferido || 0),
            totalRetiros: parseFloat(movementSummary.value.totalRetiros || 0) + parseFloat(response.summary.totalRetiros || 0)
          }
        } else {
          // Primera carga, establecemos los valores iniciales
          movementSummary.value = {
            mes: response.summary.mes || '',
            totalIngresosReferido: parseFloat(response.summary.totalIngresosReferido || 0),
            totalRetiros: parseFloat(response.summary.totalRetiros || 0)
          }
        }
      }
      
      totalMovements.value = response.pagination?.total || 0
      hasMoreMovements.value = response.pagination ? 
        (response.pagination.page * response.pagination.limit) < response.pagination.total : 
        false
    }
  } catch (error) {
    console.error(`Error al cargar ${tipo}:`, error)
    showError(`Error al cargar los ${tipo === 'ingreso_referido' ? 'ingresos' : 'retiros'}`)
    if (tipo === 'ingreso_referido') {
      movementsHistory.value = []
    } else {
      withdrawalsHistory.value = []
    }
  } finally {
    isLoadingMovements.value = false
  }
}

// =========================
// FUNCIONES DE MANEJO DE PESTAÑAS Y FILTROS
// =========================

const setActiveTab = async (tab) => {
  activeTab.value = tab
  const tipo = tab === 'ingresos' ? 'ingreso_referido' : 'retiro'
  await loadMovements(tipo)
}

const handleMonthChange = async (event, tab) => {
  const newMonth = event.target.value
  
  if (tab === 'ingresos') {
    selectedMonth.value = newMonth
    await loadMovements('ingreso_referido', newMonth)
  } else {
    selectedWithdrawMonth.value = newMonth
    await loadMovements('retiro', newMonth)
  }
}

// Funciones para cargar más elementos
const loadMoreEarnings = async () => {
  if (hasMoreMovements.value) {
    await loadMovements('ingreso_referido', selectedMonth.value, true)
  }
}

const loadMoreWithdrawals = async () => {
  if (hasMoreMovements.value) {
    await loadMovements('retiro', selectedWithdrawMonth.value, true)
  }
}

const loadMoreReferrals = async () => {
  if (hasMoreReferrals.value) {
    await loadReferrals(true)
  }
}

// =========================
// FUNCIONES DE COMPARTIR
// =========================

const copyReferralLink = async () => {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    showSuccess('¡Enlace copiado!', 'El enlace se copió al portapapeles')
  } catch (error) {
    const textArea = document.createElement('textarea')
    textArea.value = referralLink.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showSuccess('¡Enlace copiado!', 'El enlace se copió al portapapeles')
  }
}

const shareWhatsApp = () => {
  const message = `¡Hola! 👋 Te invito a conocer HogarSeguro, el mejor servicio de reparaciones para tu hogar. 

🏠 Servicios profesionales
💰 Precios justos
⚡ Atención rápida

Usa mi código de referido: ${userReferralCode.value}

Regístrate aquí: ${referralLink.value}

¡Ambos ganamos cuando te registres! 🎉`

  const encodedMessage = encodeURIComponent(message)
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank')
}

const shareGeneral = async () => {
  const shareData = {
    title: 'HogarSeguro - Servicios para tu hogar',
    text: `¡Únete a HogarSeguro con mi código ${userReferralCode.value} y ambos ganamos!`,
    url: referralLink.value
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (error) {
      copyReferralLink()
    }
  } else {
    copyReferralLink()
  }
}

// =========================
// FUNCIONES DE MODALES
// =========================

const closeWithdrawModal = () => {
  showWithdrawModal.value = false
  withdrawForm.value = {
    amount: '',
    creditAmount: '',
    bankDetails: ''
  }
}

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

const processWithdraw = async () => {
  if (isProcessingWithdraw.value) return
  isProcessingWithdraw.value = true
  
  try {  
    const userCookie = useCookie('user');
    if (!userCookie.value || !userCookie.value.id_usuario) {
      showError('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    // Obtener el monto mínimo de retiro desde la configuración
    let minWithdrawAmount = 0;
    try {
      const minWithdrawConfig = await $fetch('/config/valor/retiro_minimo', {
        baseURL: config.public.apiBase,
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        }
      });
      minWithdrawAmount = parseFloat(minWithdrawConfig?.valor || 0);
    } catch (error) {
      console.error('Error al obtener la configuración de retiro mínimo:', error);
      // Continuar con 0 como valor por defecto
    }

    const montoRetiro = parseFloat(stats.value.availableBalance) || 0; 
    const montoMaximoRetiro = parseFloat(maxWithdrawableAmount.value) || 0;
    
    // Validar monto mínimo de retiro contra el saldo total
    if (montoRetiro < minWithdrawAmount) {
      showError(`El monto mínimo de retiro es de L. ${minWithdrawAmount.toFixed(2)}. Tu saldo actual es de L. ${montoRetiro.toFixed(2)}`);
      isProcessingWithdraw.value = false;
      return;
    }

    // Validar que el monto a retirar no sea mayor al permitido
    if (montoMaximoRetiro <= 0) {
      showError('No tienes saldo disponible para retirar');
      isProcessingWithdraw.value = false;
      return;
    }

    const montoCredito = parseFloat((montoRetiro - montoMaximoRetiro).toFixed(2));
    
    const requestBody = {
      id_usuario: userCookie.value.id_usuario,
      tipo: 'retiro',
      monto: montoMaximoRetiro,
      descripcion: `Retiro de ${montoMaximoRetiro} a: ${withdrawForm.value.bankDetails}`
    };  
    
    let response;
    try {
      response = await $fetch('/movimientos', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: requestBody
      });
    } catch (error) {
      console.error('Error en la solicitud de retiro:', error);
      const errorMessage = error.data?.message || 'Error al procesar el retiro. Por favor, inténtalo de nuevo.';
      showError(errorMessage);
      return;
    }

    if (response && response.success === true) {
      if (stats.value) {
        stats.value.availableBalance -= montoMaximoRetiro;
        stats.value.retirado = (parseFloat(stats.value.retirado) + montoMaximoRetiro).toFixed(2);
      }
      
      if (montoCredito > 0) {
        try { 
          const creditRequestBody = {
            id_usuario: userCookie.value.id_usuario,
            monto_credito: montoCredito
          }; 
          
          await $fetch('/credito', {
            baseURL: config.public.apiBase,
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.token}`
            },
            body: creditRequestBody
          });
          
          showSuccess('¡Retiro Solicitado!', 'El pago puede tardar hasta 72 horas en procesarse.');
        } catch (creditError) {
          console.error('Error al procesar el crédito:', creditError);
          // Mostrar mensaje de éxito parcial
          showSuccess('Retiro Parcial', 'El retiro se procesó, pero hubo un error al aplicar el crédito. Contacta a soporte.');
        }
      } else {
        showSuccess('¡Retiro Solicitado!', 'El pago puede tardar hasta 72 horas en procesarse.');
      }
    } else {
      const errorMessage = response?.message || 'Error al procesar el retiro. Por favor, inténtalo de nuevo.';
      showError(errorMessage);
    }
    
    closeWithdrawModal();
    await loadReferralData();
    
  } catch (error) {
    console.error('Error inesperado en processWithdraw:', error);
    showError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
  } finally {
    isProcessingWithdraw.value = false;
  }
}

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

const showToast = (options) => {
  toast.value.show = false
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message || options.title,
      type: options.type || 'info',
      duration: options.duration || 5000
    }
  })
}

const showSuccess = (title, message) => {
  showToast({
    type: 'success',
    message: message ? `${title}\n${message}` : title,
    duration: 5000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  
  showToast({
    message: typeof message === 'string' ? message : 'Ocurrió un error inesperado',
    type: 'error',
    duration: 8000
  })
}

// =========================
// WATCHERS
// =========================

watch(() => showWithdrawModal.value, (newVal) => {
  if (newVal) {
    const halfAmount = (maxWithdrawableAmount.value / 2).toFixed(2)
    
    withdrawForm.value = {
      amount: parseFloat(halfAmount),
      creditAmount: parseFloat(halfAmount),
      bankDetails: ''
    } 
  }
})

watch([maxWithdrawableAmount, withdrawalPercentage], ([newMaxAmount, newPercentage]) => {
  if (showWithdrawModal.value) {
    const withdrawAmount = (newMaxAmount * (newPercentage / 100)).toFixed(2)
    const creditAmount = (newMaxAmount * ((100 - newPercentage) / 100)).toFixed(2)
    
    withdrawForm.value = {
      ...withdrawForm.value,
      amount: parseFloat(withdrawAmount),
      creditAmount: parseFloat(creditAmount)
    }
  }
})

watch([selectedMonth, selectedWithdrawMonth], async ([newMonth, newWithdrawMonth], [oldMonth, oldWithdrawMonth]) => {
  if (newMonth !== oldMonth && activeTab.value === 'ingresos') {
    await loadMovements('ingreso_referido', newMonth)
  } else if (newWithdrawMonth !== oldWithdrawMonth && activeTab.value === 'retiros') {
    await loadMovements('retiro', newWithdrawMonth)
  }
})

// =========================
// INICIALIZACIÓN
// =========================

onMounted(async () => {
  try {
    await loadReferralData()
    await loadMovements('ingreso_referido')
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    showError('Error al cargar los datos. Por favor, recargue la página.')
  } finally {
    isLoading.value = false
  }
})

// Dark mode support
onMounted(() => {
  if (process.client) {
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
}) 
</script>