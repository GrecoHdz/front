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
      :message="'Cargando panel administrativo...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderDashboard />

      <!-- Content Container -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Hero Section -->
            <section class="px-2 sm:px-4 py-3 sm:py-6">
              <div class="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-xl sm:rounded-3xl p-3 sm:p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-6 -right-6 w-20 h-20 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl sm:blur-2xl"></div>
                <div class="absolute -bottom-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg sm:blur-xl"></div>
                
                <div class="relative">
                  <div class="flex justify-between items-start mb-3 sm:mb-6">
                    <div class="flex items-center space-x-2 sm:space-x-4">
                      <div class="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-2xl flex-shrink-0 flex items-center justify-center">
                        <span class="text-2xl sm:text-3xl md:text-4xl">👨‍💼</span>
                      </div>
                      <div class="min-w-0">
                        <h1 class="text-lg sm:text-2xl md:text-3xl font-bold sm:font-black">Panel Administrativo</h1>
                        <p class="text-white/90 font-medium text-xs sm:text-sm md:text-base">Bienvenido, {{ adminName }}</p>
                      </div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30">
                      <span class="text-xs sm:text-sm font-medium">{{ getCurrentTime }}</span>
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-base sm:text-xl md:text-2xl font-bold sm:font-black">{{ stats.totalUsers }}</div>
                      <div class="text-[10px] xs:text-xs text-white/80">Usuarios Totales</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-base sm:text-xl md:text-2xl font-bold sm:font-black">{{ stats.pendingServices }}</div>
                      <div class="text-[10px] xs:text-xs text-white/80">Servicios Pendientes</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-base sm:text-xl md:text-2xl font-bold sm:font-black">{{ stats.activeMemberships }}</div>
                      <div class="text-[10px] xs:text-xs text-white/80">Membresías Activas</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-base sm:text-xl md:text-2xl font-bold sm:font-black">L. {{ stats.monthlyRevenue.toLocaleString('es-HN') }}</div>
                      <div class="text-[10px] xs:text-xs text-white/80">Ingresos del Mes</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Quick Actions -->
            <section class="px-2 sm:px-4 mb-3 sm:mb-5">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Acciones Rápidas</h2>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <button 
                  v-for="action in quickActions" 
                  :key="action.id"
                  @click="navigateToAction(action.route)"
                  class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-200 text-left hover:scale-[1.02]"
                >
                  <div class="flex items-center space-x-2 mb-1.5 sm:mb-2">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0"
                         :class="action.bgColor">
                      <span class="text-base sm:text-lg">{{ action.icon }}</span>
                    </div>
                    <p class="font-semibold text-gray-900 dark:text-white text-xs truncate">{{ action.title }}</p>
                  </div>
                  <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 h-5 sm:h-6 leading-tight">{{ action.description }}</p>
                  <div v-if="action.badge" class="mt-1">
                    <span class="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                          :class="action.badgeColor">
                      {{ action.badge }}
                    </span>
                  </div>
                </button>
              </div>
            </section>

            <!-- Pending Reviews -->
            <section class="px-2 sm:px-4 mb-3 sm:mb-5">
              <div class="flex items-center justify-between mb-2 sm:mb-3">
                <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Revisiones Pendientes</h2>
                <button @click="refreshPendingItems" class="text-blue-600 dark:text-blue-400 text-xs font-medium hover:underline flex items-center">
                  <span class="mr-1">🔄</span> Actualizar
                </button>
              </div>
              
              <!-- Pending Memberships -->
              <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-gray-100 dark:border-gray-700 mb-2 sm:mb-3">
                <div class="flex items-center justify-between mb-2 sm:mb-3">
                  <div class="flex items-center">
                    <span class="w-6 h-6 sm:w-7 sm:h-7 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mr-2 text-sm">
                      💳
                    </span>
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Membresías</h3>
                  </div>
                  <span class="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ pendingMemberships.length }} pendientes
                  </span>
                </div>
                
                <div v-if="pendingMemberships.length === 0" class="text-center py-4 sm:py-5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <span class="text-lg">✅</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">No hay membresías pendientes</p>
                </div>

                <div v-else class="space-y-2">
                  <div v-for="membership in displayedMemberships" :key="membership.id"
                       class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-3 border border-gray-100 dark:border-gray-600">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-sm">
                          👤
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">{{ membership.userName }}</p>
                          <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                            {{ membership.voucher }} - L. {{ membership.amount.toLocaleString('es-HN') }}
                          </p>
                        </div>
                      </div>
                      <div class="flex justify-end">
                        <button 
                          @click="openVerificationModal(membership.id, 'membership')"
                          class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md transition-colors flex items-center"
                        >
                          <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Ver
                        </button>
                      </div>
                    </div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(membership.date) }}</p>
                  </div>
                  
                  <button v-if="pendingMemberships.length > 2 && !showAllMemberships" 
                          @click="showAllMemberships = true"
                          class="w-full py-1.5 text-blue-600 dark:text-blue-400 font-medium text-[10px] sm:text-xs hover:underline">
                    Ver todas ({{ pendingMemberships.length - 2 }} más)
                  </button>
                </div>
              </div>

              <!-- Pending Services -->
              <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">Servicios</h2>
              <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-2 sm:mb-3">
                  <div class="flex items-center">
                    <span class="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-2 text-sm">
                      🔧
                    </span>
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Servicios</h3>
                  </div>
                  <span class="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ pendingServices.length }} pendientes
                  </span>
                </div>
                
                <div v-if="pendingServices.length === 0" class="text-center py-4 sm:py-5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <span class="text-lg">✅</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">No hay servicios pendientes</p>
                </div>

                <div v-else class="space-y-2">
                  <div v-for="service in displayedServices" :key="service.id"
                       class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 sm:p-3 border border-gray-100 dark:border-gray-600">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-sm">
                          {{ service.icon }}
                        </div>
                        <div class="min-w-0">
                          <p class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">{{ service.type }}</p>
                          <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                            {{ service.client }} - {{ service.location }}
                          </p>
                        </div>
                      </div>
                      <div class="flex space-x-1">
                        <button 
                          @click="assignTechnician(service.id)"
                          class="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold rounded-md transition-colors"
                          title="Asignar técnico"
                        >
                          👨‍🔧
                        </button>
                        <button 
                          @click="viewServiceDetails(service.id)"
                          class="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-[10px] font-semibold rounded-md transition-colors"
                          title="Ver detalles"
                        >
                          👁
                        </button>
                      </div>
                    </div>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(service.date) }}</p>
                  </div>
                  
                  <button v-if="pendingServices.length > 2 && !showAllServices" 
                          @click="showAllServices = true"
                          class="w-full py-1.5 text-blue-600 dark:text-blue-400 font-medium text-[10px] sm:text-xs hover:underline">
                    Ver todos ({{ pendingServices.length - 2 }} más)
                  </button>
                </div>
              </div>
            </section>

            <!-- Recent Activity -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">Actividad Reciente</h2>
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700">
                <div class="space-y-3 sm:space-y-4">
                  <div v-for="activity in recentActivities" :key="activity.id"
                       class="flex items-start space-x-2 sm:space-x-4 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl sm:rounded-2xl">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                         :class="activity.iconBg">
                      <span :class="activity.iconColor" class="text-sm sm:text-base">{{ activity.icon }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ getRelativeTime(activity.timestamp) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- System Status -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-3 sm:mb-4">Resumen</h2>
              <div class="grid grid-cols-1 gap-3 sm:gap-4">  
                <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Resumen de Hoy</h3>
                  <div class="space-y-2 sm:space-y-3">
                    <div v-for="summary in dailySummary" :key="summary.label"
                         class="flex items-center justify-between">
                      <div class="flex items-center space-x-2 sm:space-x-3">
                        <span class="text-lg sm:text-xl">{{ summary.icon }}</span>
                        <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ summary.label }}</span>
                      </div>
                      <span class="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{{ summary.value }}</span>
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

    <!-- Assignment Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showAssignmentModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <!-- Backdrop -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showAssignmentModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="showAssignmentModal = false"
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
            v-if="showAssignmentModal"
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg sm:rounded-xl flex items-center justify-center text-base sm:text-lg">
                    👨‍🔧
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white">Asignar Técnico</h3>
                    <p class="text-xs text-gray-600 dark:text-gray-400">Selecciona un técnico disponible</p>
                  </div>
                </div>
                <button @click="showAssignmentModal = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-3 sm:p-4">
              <div class="space-y-2 sm:space-y-3">
                <div v-for="tech in availableTechnicians" :key="tech.id"
                     @click="selectTechnician(tech.id)"
                     class="p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors">
                  <div class="flex items-center space-x-2 sm:space-x-3">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-base">👷</span>
                    </div>
                    <div>
                      <p class="font-bold text-gray-900 dark:text-white text-sm">{{ tech.name }}</p>
                      <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ tech.speciality }}</p>
                      <div class="flex items-center space-x-2 mt-1">
                        <span class="text-xs px-2 py-1 rounded-full"
                              :class="tech.available ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'">
                          {{ tech.available ? 'Disponible' : 'Ocupado' }}
                        </span>
                        <span class="text-xs text-gray-500">⭐ {{ tech.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Admin Verification Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showVerificationModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <!-- Backdrop -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to">
          <div 
            v-if="showVerificationModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="closeVerificationModal"
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
            v-if="showVerificationModal"
            class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[calc(100%-2rem)] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10 mx-auto"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Verificar Pago</h3>
                <button @click="closeVerificationModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4 sm:p-6">
              <div class="space-y-4">
                <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800">
                  <h4 class="font-bold text-yellow-800 dark:text-yellow-200 text-sm mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Verificación del Administrador
                  </h4>
                  
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <div class="flex items-center h-5">
                        <input 
                          id="payment-verified" 
                          v-model="verificationData.verified" 
                          type="checkbox" 
                          class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        >
                      </div>
                      <div class="ml-2 text-xs">
                        <label for="payment-verified" class="font-medium text-gray-700 dark:text-gray-300">
                          He verificado el pago en mi banca móvil
                        </label>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                          Confirma que has verificado el pago en tu cuenta bancaria antes de aprobarlo.
                        </p>
                      </div>
                    </div>

                    <div class="pt-4 space-y-2">
                      <button 
                        @click="handleVerification(true)"
                        :disabled="!verificationData.verified || isVerifying"
                        :class="{
                          'opacity-50 cursor-not-allowed': !verificationData.verified || isVerifying,
                          'bg-green-600 hover:bg-green-700': verificationData.verified && !isVerifying
                        }"
                        class="w-full flex items-center justify-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-500 transition-colors"
                      >
                        <svg v-if="isVerifying" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <svg v-else class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ isVerifying ? 'Verificando...' : 'Aprobar Pago' }}
                      </button>
                      
                      <button 
                        @click="handleVerification(false)"
                        :disabled="isVerifying"
                        :class="{
                          'opacity-50 cursor-not-allowed': isVerifying,
                          'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50': !isVerifying
                        }"
                        class="w-full flex items-center justify-center px-4 py-2.5 text-red-700 dark:text-red-300 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
                      >
                        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Rechazar Pago
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
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
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl z-10">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-2">
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
            <div class="mt-2">
              <label for="cityFilter" class="sr-only">Filtrar por ciudad</label>
              <div class="relative">
                <select 
                  id="cityFilter"
                  v-model="selectedTechCity"
                  class="w-full px-3 py-2.5 pr-8 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-500 dark:focus:border-green-500 text-gray-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">Todas las ciudades</option>
                  <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Technicians List -->
          <div class="p-3">
            <div class="space-y-2">
              <div 
                v-for="tech in paginatedTechnicians" 
                :key="tech.id"
                @click="selectTechnician(tech)"
                class="group p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors"
                :class="{ 'opacity-60': !tech.available }"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{{ tech.name }}</p>
                    <p class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">{{ tech.city }}</p>
                  </div>
                  <div class="flex items-center space-x-2 ml-2">
                    <span 
                      class="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
                      :class="tech.available ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'"
                    >
                      {{ tech.available ? 'Disponible' : 'Ocupado' }}
                    </span>
                    <span class="text-[10px] sm:text-xs text-gray-500 flex items-center whitespace-nowrap">
                      <svg class="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {{ tech.rating }}
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// ===== VARIABLES DE CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Panel Administrativo',
  meta: [
    { name: 'description', content: 'Panel de administración de HogarSeguro - Gestión completa del sistema' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const showAllMemberships = ref(false)
const showAllServices = ref(false)
const showAssignmentModal = ref(false)
const showVerificationModal = ref(false)
const selectedServiceId = ref(null)
const isVerifying = ref(false)
const verificationData = ref({
  id: null,
  type: '', // 'membership' o 'service'
  verified: false
})

// Para el modal de asignación de técnico
const selectedTechCity = ref('')
const currentTechPage = ref(1)
const techsPerPage = 5

// Datos de ejemplo de técnicos (deberías reemplazarlos con datos reales de tu API)
const technicians = ref([
  { id: 1, name: 'Juan Pérez', city: 'Ciudad de México', available: true, rating: 4.8 },
  { id: 2, name: 'María García', city: 'Guadalajara', available: true, rating: 4.9 },
  { id: 3, name: 'Carlos López', city: 'Monterrey', available: false, rating: 4.7 },
  { id: 4, name: 'Ana Martínez', city: 'Puebla', available: true, rating: 4.6 },
  { id: 5, name: 'Pedro Sánchez', city: 'Ciudad de México', available: true, rating: 4.5 },
  { id: 6, name: 'Laura Ramírez', city: 'Guadalajara', available: false, rating: 4.9 },
  { id: 7, name: 'Jorge Torres', city: 'Monterrey', available: true, rating: 4.7 },
])

// ===== VARIABLES DE DATOS =====
// Estadísticas principales
const stats = ref({
  totalUsers: 1247,
  pendingServices: 23,
  activeMemberships: 156,
  monthlyRevenue: 45600
})

// Acciones rápidas
const quickActions = [
  {
    id: 'services',
    title: 'Gestionar Servicios',
    description: 'Asignar y supervisar servicios',
    icon: '🔧',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    route: '/admin/ServiciosAdmin',
    badge: '12 pendientes',
    badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  },
  {
    id: 'memberships',
    title: 'Membresías',
    description: 'Aprobar pagos y membresías',
    icon: '💳',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    route: '/admin/membresias',
    badge: '5 pendientes',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
  },
  {
    id: 'users',
    title: 'Gestionar Usuarios',
    description: 'Ver y administrar usuarios',
    icon: '👥',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    route: '/admin/UsuariosAdmin',
    badge: null,
    badgeColor: ''
  },
  {
    id: 'reports',
    title: 'Reportes',
    description: 'Estadísticas y análisis',
    icon: '📊',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    route: '/admin/reportes',
    badge: null,
    badgeColor: ''
  }
]

// Membresías pendientes
const pendingMemberships = ref([
  {
    id: 1,
    userName: 'Juan Pérez',
    voucher: 'TXN123456',
    amount: 199,
    date: '2024-12-18T10:30:00Z'
  },
  {
    id: 2,
    userName: 'María García',
    voucher: 'TXN789012',
    amount: 199,
    date: '2024-12-18T09:15:00Z'
  },
  {
    id: 3,
    userName: 'Carlos López',
    voucher: 'TXN345678',
    amount: 199,
    date: '2024-12-17T16:45:00Z'
  }
])

// Servicios pendientes
const pendingServices = ref([
  {
    id: 1,
    type: 'Reparación de Plomería',
    client: 'Pedro Sánchez',
    location: 'Col. Palmira',
    date: '2024-12-18T08:00:00Z',
    icon: '🚰'
  },
  {
    id: 2,
    type: 'Instalación Eléctrica',
    client: 'Carmen Flores',
    location: 'Col. Lomas del Mayab',
    date: '2024-12-18T07:30:00Z',
    icon: '💡'
  },
  {
    id: 3,
    type: 'Aire Acondicionado',
    client: 'Roberto Silva',
    location: 'Col. San Rafael',
    date: '2024-12-17T19:45:00Z',
    icon: '❄️'
  }
])

// Actividades recientes
const recentActivities = ref([
  {
    id: 1,
    title: 'Nuevo usuario registrado',
    description: 'María González se registró en la plataforma',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    icon: '👤',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 2,
    title: 'Servicio completado',
    description: 'Reparación de plomería en Col. Palmira finalizada',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    icon: '✅',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 3,
    title: 'Membresía aprobada',
    description: 'Pago de Carlos Rodríguez verificado y aprobado',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: '💳',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  }
])

// Técnicos disponibles
const availableTechnicians = ref([
  {
    id: 1,
    name: 'Carlos Rodríguez',
    speciality: 'Plomería y Electricidad',
    available: true,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Ana López',
    speciality: 'Aire Acondicionado',
    available: true,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Miguel Torres',
    speciality: 'Carpintería',
    available: false,
    rating: 4.7
  }
])

// Métricas de rendimiento
const performanceMetrics = ref([
  { name: 'CPU', value: 45 },
  { name: 'Memoria', value: 62 },
  { name: 'Almacenamiento', value: 78 },
  { name: 'Red', value: 91 }
])

// Resumen diario
const dailySummary = ref([
  { icon: '👥', label: 'Nuevos usuarios', value: '12' },
  { icon: '🔧', label: 'Servicios completados', value: '28' },
  { icon: '💰', label: 'Ingresos', value: 'L. 15,420' },
  { icon: '⭐', label: 'Calificación promedio', value: '4.8' }
])

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== COMPUTED PROPERTIES =====
const adminName = computed(() => {
  return userCookie.value?.nombre || 'Administrador'
})

const getCurrentTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString('es-HN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
})

const displayedMemberships = computed(() => {
  return showAllMemberships.value ? pendingMemberships.value : pendingMemberships.value.slice(0, 3)
})

const displayedServices = computed(() => {
  return showAllServices.value ? pendingServices.value : pendingServices.value.slice(0, 3)
})

// ===== FUNCIONES DE UTILIDAD =====
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getRelativeTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (minutes < 60) {
    return `hace ${minutes} minutos`
  } else if (hours < 24) {
    return `hace ${hours} horas`
  } else {
    return timestamp.toLocaleDateString('es-ES')
  }
}

const getMetricColor = (value) => {
  if (value >= 80) return 'bg-red-500'
  if (value >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
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

const showSuccess = (title, message) => {
  const toastMessage = message ? `${title}\n${message}` : title
  
  showToast({
    message: toastMessage,
    type: 'success',
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

const showInfo = (message) => {
  showToast({
    message,
    type: 'info',
    duration: 5000
  })
}

// ===== FUNCIONES DE ASIGNACIÓN DE TÉCNICO =====
// Computed properties para el filtrado y paginación de técnicos
const availableCities = computed(() => {
  const cities = new Set(technicians.value.map(tech => tech.city))
  return Array.from(cities).sort()
})

const filteredTechnicians = computed(() => {
  return technicians.value.filter(tech => {
    const matchesCity = !selectedTechCity.value || tech.city === selectedTechCity.value
    return matchesCity
  })
})

const totalTechPages = computed(() => {
  return Math.ceil(filteredTechnicians.value.length / techsPerPage)
})

const paginatedTechnicians = computed(() => {
  const start = (currentTechPage.value - 1) * techsPerPage
  const end = start + techsPerPage
  return filteredTechnicians.value.slice(start, end)
})

// Funciones para la paginación
const changeTechPage = (page) => {
  if (page < 1 || page > totalTechPages.value) return
  currentTechPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Función para asignar un técnico
const assignTechnician = (serviceId) => {
  selectedServiceId.value = serviceId
  showAssignmentModal.value = true
  currentTechPage.value = 1
  selectedTechCity.value = ''
}

// Función para seleccionar un técnico
const selectTechnician = (technician) => {
  if (!technician.available) return
  
  // Aquí iría la lógica para asignar el técnico al servicio
  showSuccess('Técnico asignado', `${technician.name} ha sido asignado al servicio.`)
  showAssignmentModal.value = false
  
  // Actualizar el estado del servicio
  const serviceIndex = pendingServices.value.findIndex(s => s.id === selectedServiceId.value)
  if (serviceIndex !== -1) {
    pendingServices.value[serviceIndex].assignedTo = technician.name
    // Aquí podrías hacer una llamada a tu API para actualizar el servicio
  }
}

// ===== FUNCIONES DE NAVEGACIÓN =====
const navigateToAction = (route) => {
  showInfo(`Navegando a ${route}`)
}

// ===== FUNCIONES DE VERIFICACIÓN =====
const openVerificationModal = (id, type) => {
  verificationData.value = {
    id,
    type,
    verified: false
  }
  showVerificationModal.value = true
}

const closeVerificationModal = () => {
  showVerificationModal.value = false
  verificationData.value.verified = false
  isVerifying.value = false
}

const handleVerification = async (approved) => {
  try {
    isVerifying.value = true
    
    // Simulación de llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (verificationData.value.type === 'membership') {
      if (approved) {
        await approveMembership(verificationData.value.id)
      } else {
        await rejectMembership(verificationData.value.id)
      }
    }
    
    closeVerificationModal()
  } catch (error) {
    showError('Error al procesar la verificación')
    console.error('Error en verificación:', error)
    isVerifying.value = false
  }
}

// ===== FUNCIONES DE PROCESAMIENTO =====
const approveMembership = async (membershipId) => {
  try {
    // Simulación de llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Actualizar el estado local
    const index = pendingMemberships.value.findIndex(m => m.id === membershipId)
    if (index !== -1) {
      pendingMemberships.value.splice(index, 1)
      showSuccess('Membresía Aprobada', 'La membresía ha sido aprobada exitosamente.')
    }
  } catch (error) {
    showError('Error al aprobar la membresía')
    console.error('Error al aprobar membresía:', error)
    throw error
  }
}

const rejectMembership = async (membershipId) => {
  try {
    // Simulación de llamada a la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Actualizar el estado local
    const index = pendingMemberships.value.findIndex(m => m.id === membershipId)
    if (index !== -1) {
      pendingMemberships.value.splice(index, 1)
      showInfo('Membresía Rechazada', 'La membresía ha sido rechazada.')
    }
  } catch (error) {
    showError('Error al rechazar la membresía')
    console.error('Error al rechazar membresía:', error)
    throw error
  }
} 
 

const viewServiceDetails = (serviceId) => {
  showInfo(`Ver detalles del servicio #${serviceId}`)
}

const refreshPendingItems = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    showSuccess('Datos actualizados')
  } catch (error) {
    showError('Error al actualizar los datos')
  }
}

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (error) {
    console.error('Error al cargar el dashboard:', error)
    showError('Error al cargar los datos del dashboard')
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
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

.dark ::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style>