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
      <HeadersHeaderDashboardAdmin />

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
                        <span class="text-[18px] sm:text-xs md:text-base">🖥️</span>
                      </div>
                      <div class="min-w-0">
                        <h1 class="text-[14px] sm:text-xs md:text-base font-bold sm:font-black">Panel Administrativo</h1>
                        <p class="text-white/90 font-medium text-[12px] sm:text-xs md:text-base">Bienvenido, {{ adminName }}</p>
                      </div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30">
                      <span class="text-xs sm:text-sm font-medium">{{ getCurrentTime }}</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                  <h2 class="text-[16px] sm:text-xs md:text-2xl font-bold text-gray-900 dark:text-white">Resumen</h2>
                  <div class="flex items-center space-x-1 sm:space-x-2">
                    <div class="relative">
                      <input 
                        type="date" 
                        v-model="startDate"
                        @change="applyDateFilter"
                        class="w-[125px] xs:w-[100px] sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 text-[11px] text-white/90 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 placeholder-white/50"
                        :max="endDate || ''"
                      >
                    </div>
                    <span class="text-white/70 text-[11px] sm:text-xs">-</span>
                    <div class="relative">
                      <input 
                        type="date" 
                        v-model="endDate"
                        @change="applyDateFilter"
                        class="w-[125px] xs:w-[100px] sm:w-auto bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1 text-[11px] sm:text-xs text-white/90 focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/30 placeholder-white/50"
                        :min="startDate || ''"
                      >
                    </div>
                  </div>
                </div> 
                <div class="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-[10px] xs:text-xs md:text-xs text-white/80 text-center">Usuarios</div>
                      <div class="text-[14px] sm:text-xs md:text-base font-bold sm:font-black text-center">{{ stats.totalUsers }}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-[10px] xs:text-xs md:text-xs text-white/80 text-center">Servicios</div>
                      <div class="text-[14px] sm:text-xs md:text-base font-bold sm:font-black text-center">{{ stats.pendingServices }}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-[10px] xs:text-xs md:text-xs text-white/80 text-center">Membresías Activas</div>
                      <div class="text-[14px] sm:text-xs md:text-base font-bold sm:font-black text-center">{{ stats.activeMemberships }}</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl md:rounded-2xl p-2 sm:p-3 md:p-4 border border-white/20">
                      <div class="text-[10px] xs:text-xs md:text-xs text-white/80 text-center">Ingresos</div>
                      <div class="text-[14px] sm:text-xs md:text-base font-bold sm:font-black text-center">L. {{ stats.monthlyRevenue.toLocaleString('es-HN') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section> 

            <!-- Quick Actions -->
            <section class="px-2 sm:px-4 mb-3 sm:mb-5">
              <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Acciones Rápidas</h2>
              <div class="grid grid-cols-2 gap-2 sm:gap-3">
                <div 
                  v-for="action in quickActions" 
                  :key="action.id"
                  class="relative rounded-lg sm:rounded-xl p-2.5 sm:p-3 shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                >
                  <button 
                    @click="navigateToAction(action.route)"
                    class="w-full h-full text-left focus:outline-none"
                  >
                    <div class="flex items-center space-x-2 mb-1.5 sm:mb-2">
                      <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 relative"
                           :class="[
                             action.bgColor,
                             action.showBadge ? 'scale-110' : '',
                             action.showBadge ? 'animate-bounce-slow' : '',
                             action.showBadge ? 'bg-yellow-100 dark:bg-yellow-900/50 border-2 border-yellow-100 dark:border-yellow-500' : ''
                           ]"
                           :style="action.showBadge ? `box-shadow: 0 0 0 0.25rem ${action.pulseColor}40;` : ''">
                        <span class="text-base sm:text-lg">{{ action.icon }}</span>
                      </div>
                      <p class="font-semibold text-gray-900 dark:text-white text-xs truncate">{{ action.title }}</p>
                    </div>
                    <p class="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 h-5 sm:h-6 leading-tight">{{ action.description }}</p>
                  </button>
                </div>
              </div>
            </section>
            
            <!-- Soporte Técnico -->
            <section class="px-2 sm:px-4 mb-3 sm:mb-5">
              <div class="flex items-center justify-between mb-2 sm:mb-3">
                <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Soporte Técnico</h2> 
              </div>
              
              <!-- Tickets Pendientes -->
              <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-gray-100 dark:border-gray-700 mb-2 sm:mb-3">
                <div class="flex items-center justify-between mb-2 sm:mb-3">
                  <div class="flex items-center">
                    <span class="w-6 h-6 sm:w-7 sm:h-7 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-2 text-sm">
                      🎫
                    </span>
                    <h3 class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Tickets de Soporte</h3>
                  </div>
                  <span class="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {{ pendingTickets.filter(t => t.estado === 1).length }} pendientes
                  </span>
                </div>
                
                <div v-if="pendingTickets.length === 0" class="text-center py-4 sm:py-5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <span class="text-lg">✅</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">No hay tickets pendientes</p>
                </div>

                <div v-else class="space-y-2">
                  <div v-for="ticket in displayedTickets" :key="ticket.id"
                       @click="openTicketModal(ticket)"
                       class="group rounded-lg p-2.5 sm:p-3 border transition-colors cursor-pointer"
                       :class="[
                         ticket.estado === 1 
                           ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-800/20' 
                           : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/70',
                         'group-hover:shadow-sm'
                       ]">
                    <div class="flex items-start justify-between">
                      <div class="flex items-start space-x-2 flex-1 min-w-0">
                        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-base mt-0.5 flex-shrink-0"
                             :class="ticket.estado === 1 ? 'bg-purple-100 dark:bg-purple-800/30' : 'bg-gray-100 dark:bg-gray-600/50'">
                          🎫
                        </div>
                        <div class="min-w-0 flex-1">
                          <div class="flex flex-col space-y-1">
                            <div class="flex items-center space-x-2">
                              <p class="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                                {{ ticket.subject }}
                              </p>
                            </div>
                            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span class="inline-flex items-center text-[10px] text-gray-600 dark:text-gray-400">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                {{ ticket.user }}
                              </span>
                              <span class="inline-flex items-center text-[10px] text-gray-500 dark:text-gray-500">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ formatDate(ticket.date) }}
                              </span> 
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Botón Ver Detalles -->
                      <button 
                        @click.stop="openTicketModal(ticket)"
                        class="ml-2 px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center whitespace-nowrap"
                        :class="ticket.estado === 1 
                          ? 'bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-800/50 text-purple-700 dark:text-purple-400' 
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-gray-700 dark:text-gray-300'"
                        :title="ticket.estado === 1 ? 'Ver detalles' : 'Ticket cerrado'"
                      >
                        <span class="hidden sm:inline mr-1">Ver</span>
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      

                    </div> 
                    <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {{ ticket.message }}
                    </p>
                  </div>
                  
                  <!-- Paginación Tickets -->
                  <div v-if="pendingTickets.length > itemsPerPage" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Página {{ currentPage }} de {{ totalPages }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click="prevPage"
                          :disabled="currentPage === 1"
                          class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
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
                          @click="nextPage"
                          :disabled="currentPage >= totalPages"
                          class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
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
              </div>
            </section>

            <!-- Actividad Reciente -->
            <section class="px-2 sm:px-4 mb-3 sm:mb-5">
              <div class="flex items-center justify-between mb-2 sm:mb-3">
                <h2 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Actividad Reciente</h2> 
              </div>
              <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md border border-gray-100 dark:border-gray-700">
                <div v-if="recentActivities.length === 0" class="text-center py-4 sm:py-5">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-1.5 flex items-center justify-center">
                    <span class="text-lg">📋</span>
                  </div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">No hay actividad reciente</p>
                </div>

                <div v-else class="space-y-2">
                  <div v-for="activity in displayedActivities" :key="activity.id"
                       class="flex items-start space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-100 dark:bg-blue-900/30">
                      <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                        {{ activity.icon || '📝' }}
                      </span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ getRelativeTime(activity.date) }}
                      </p>
                    </div>
                  </div>

                  <!-- Paginación Actividades -->
                  <div v-if="totalActivityPages > 1" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Página {{ currentActivityPage }} de {{ totalActivityPages }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click="prevActivityPage"
                          :disabled="currentActivityPage === 1"
                          class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                          :class="{'hover:bg-gray-100 dark:hover:bg-gray-700': currentActivityPage > 1}"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          @click="nextActivityPage"
                          :disabled="currentActivityPage === totalActivityPages"
                          class="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                          :class="{'hover:bg-gray-100 dark:hover:bg-gray-700': currentActivityPage < totalActivityPages}"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    
    <!-- Ticket Details Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showTicketModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeTicketModal"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-[90%] sm:w-full max-w-md max-h-[85vh] overflow-y-auto relative z-10">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl sm:rounded-t-2xl z-10">
            
              <div class="flex items-center space-x-2 sm:space-x-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
                  <span class="text-base">🎫</span>
                </div>
                <div class="flex flex-col">
                  <h3 class="text-[12px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                    {{ selectedTicket?.subject }}
                  </h3>
                  <span class="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">
                    {{ formatDate(selectedTicket?.date) }}
                  </span>
                </div>
              </div> 
            </div> 

          <!-- Body -->
          <div class="p-3 sm:p-4 space-y-4">
            <!-- Información del Cliente -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Información del Cliente</h4>
              <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="flex items-center gap-1 sm:gap-2">
                    <p class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Nombre:</p>
                    <p class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.user || 'N/A' }}</p>
                  </div> 
                  <div class="flex items-center gap-1 sm:gap-2">
                    <p class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Teléfono:</p>
                    <p class="text-xs sm:text-sm text-gray-900 dark:text-white">{{ selectedTicket?.userPhone || 'N/A' }}</p>
                  </div>
                  <div v-if="selectedTicket?.serviceId" class="col-span-full flex items-center gap-1 sm:gap-2">
                    <p class="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">ID de Servicio:</p>
                    <p class="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                      #{{ selectedTicket.serviceId }}
                      <button 
                        @click.stop="viewServiceDetails(selectedTicket.serviceId)"
                        class="ml-1.5 text-blue-600 dark:text-blue-400 hover:underline text-[10px] flex items-center"
                        title="Ver detalles del servicio"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detalles del Mensaje -->
            <div>
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Detalles del Mensaje</h4>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                <p class="text-xs sm:text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {{ selectedTicket?.message || 'No hay mensaje disponible' }}
                </p>
              </div>
            </div>

            <!-- Historial -->
            <div v-if="selectedTicket?.history?.length">
              <h4 class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">Historial</h4>
              <div class="space-y-2">
                <div v-for="(entry, index) in selectedTicket.history" :key="index" class="flex items-start">
                  <div 
                    class="flex-shrink-0 w-1.5 h-1.5 mt-1.5 rounded-full mr-2"
                    :class="{
                      'bg-purple-500': entry.action === 'Ticket creado',
                      'bg-green-500': entry.action === 'Ticket cerrado'
                    }"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs text-gray-900 dark:text-white">{{ entry.action }}</p>
                    <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ entry.date }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sticky bottom-0 bg-white dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex justify-end space-x-2">
            <button 
              @click="closeTicketModal"
              class="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cerrar
            </button>
            <button 
              v-if="selectedTicket?.estado === 1"
              @click.stop.prevent="handleResolveClick"
              class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center"
            >
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Marcar como Resuelto
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie } from '#imports'
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')
const router = useRouter();
const route = useRoute();

// SEO and Meta
useHead({
  title: 'HogarSeguro - Panel Administrativo',
  meta: [
    { name: 'description', content: 'Panel de administración de HogarSeguro - Gestión completa del sistema' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' }
  ]
})

// Estado del modal de ticket
const showTicketModal = ref(false)
const selectedTicket = ref(null)

// Abrir modal con los detalles del ticket
const openTicketModal = (ticket) => {
  selectedTicket.value = { ...ticket }
  showTicketModal.value = true
}

// Cerrar modal
const closeTicketModal = () => {
  showTicketModal.value = false
  // Pequeño retraso para permitir la animación antes de limpiar los datos
  setTimeout(() => {
    selectedTicket.value = null
  }, 300)
} 

// Limpiar timeouts al desmontar el componente
onBeforeUnmount(() => {
  if (toast.value.id) {
    clearTimeout(toast.value.id)
  }
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const startDate = ref('')
const endDate = ref('')
const recentActivities = ref([])
 
// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    // Verificar autenticación
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) {
      window.location.reload()
      return
    }

    // Inicializar fechas vacías
    startDate.value = ''
    endDate.value = ''

    // Cargar datos en paralelo
    await Promise.all([
      fetchSupportTickets(),
      fetchStatistics(),
      refreshPendingItems()
    ])
    
  } catch (error) {
    window.location.reload()
  } finally {
    isLoading.value = false
  }
})

// Función para obtener estadísticas del servidor
const fetchStatistics = async () => {
  try {
    isLoading.value = true
    
    // Construir URL base
    let url = '/movimientos/estadisticas/admin'
    
    // Agregar parámetros de fecha solo si están definidos
    const params = new URLSearchParams()
    if (startDate.value) params.append('fechaInicio', startDate.value)
    if (endDate.value) params.append('fechaFin', endDate.value)
    
    // Agregar parámetros a la URL si existen
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }
    
    // Realizar la petición usando $fetch según el estándar del proyecto
    const response = await $api(url, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response.success) {
      // Actualizar las estadísticas con los datos de la respuesta
      stats.value = {
        totalUsers: response.data.totalUsuarios,
        pendingServices: response.data.totalServicios,
        activeMemberships: response.data.totalMembresiasActivas,
        monthlyRevenue: parseFloat(response.data.ingresosTotales) || 0,
        serviciosPendiente: response.data.serviciosPendiente || 'no',
        membresiasPendiente: response.data.membresiasPendiente || 'no',
        incomeBreakdown: response.data.desgloseIngresos || {
          servicios: '0.00',
          membresias: '0.00',
          visitas: '0.00'
        }
      } 
    }
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    showError('Error al cargar las estadísticas. Por favor, intente de nuevo.')
  } finally {
    isLoading.value = false
  }
}

// Aplicar filtro de rango de fechas
const applyDateFilter = async () => {
  try {
    await fetchStatistics()
    
    // Mostrar mensaje solo si hay fechas seleccionadas
    if (startDate.value && endDate.value) {
      showSuccess(
        'Filtro aplicado', 
        `Mostrando datos del ${formatDate(startDate.value)} al ${formatDate(endDate.value)}`
      )
    } else if (startDate.value) {
      showSuccess(
        'Filtro aplicado', 
        `Mostrando datos desde el ${formatDate(startDate.value)}`
      )
    } else if (endDate.value) {
      showSuccess(
        'Filtro aplicado', 
        `Mostrando datos hasta el ${formatDate(endDate.value)}`
      )
    } else {
      showSuccess('Filtro aplicado', 'Mostrando todos los datos')
    }
  } catch (error) {
    console.error('Error al aplicar filtro:', error)
    showError('Error al aplicar el filtro de fechas')
  }
}
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
 

// ===== VARIABLES DE DATOS =====
// Estadísticas principales
const stats = ref({
  totalUsers: 0,
  pendingServices: 0,
  activeMemberships: 0,
  monthlyRevenue: 0,
  serviciosPendiente: 'no',
  membresiasPendiente: 'no',
  incomeBreakdown: {
    servicios: '0.00',
    membresias: '0.00',
    visitas: '0.00'
  }
})

// Acciones rápidas
const quickActions = computed(() => {
  // Add null checks for stats and stats.value
  const serviciosPendiente = stats?.value?.serviciosPendiente === 'si' || false;
  const membresiasPendiente = stats?.value?.membresiasPendiente === 'si' || false;
  
  return [
    {
      id: 'services',
      title: 'Gestionar Servicios',
      description: 'Asignar y supervisar servicios',
      icon: '🔧',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      route: '/admin/ServiciosAdmin',
      showBadge: serviciosPendiente,
      pulseColor: '#f59e0b'
    },
    {
      id: 'memberships',
      title: 'Membresías',
      description: 'Aprobar pagos y membresías',
      icon: '💳',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      route: '/admin/ReportesAdmin',
      showBadge: membresiasPendiente,
      pulseColor: '#f59e0b'
    },
    {
      id: 'users',
      title: 'Gestionar Usuarios',
      description: 'Ver y administrar usuarios',
      icon: '👥',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      route: '/admin/UsuariosAdmin',
      badge: null,
      badgeColor: '',
      showBadge: false,
      pulseColor: ''
    },
    {
      id: 'reports',
      title: 'Reportes',
      description: 'Estadísticas y análisis',
      icon: '📊',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      route: '/admin/ReportesAdmin',
      badge: null,
      badgeColor: '',
      showBadge: false,
      pulseColor: ''
    }
  ];
}); 

// Actividades recientes
// Datos para la sección de soporte
const showAllTickets = ref(false);
const pendingTickets = ref([])

// Fetch support tickets from API
const fetchSupportTickets = async () => {
  try {
    isLoading.value = true
    
    // Obtener el token del store de autenticación
    const token = auth.token || useCookie('auth:token')?.value
    if (!token) {
      throw new Error('No se encontró el token de autenticación')
    }
    
    // Realizar la petición a la API
    const response = await $api('/soporte', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }) 
    
    // Obtener los datos de la respuesta
    const ticketsData = response.data || []
    
    // Transformar los datos para la UI
    if (ticketsData.length > 0) {
      pendingTickets.value = ticketsData.map(ticket => {
        const history = [
          { 
            action: 'Ticket creado', 
            date: formatDateForHistory(ticket.fecha_creacion), 
            user: `Usuario #${ticket.id_usuario}` 
          }
        ]

        // Si hay fecha de actualización, significa que el ticket fue cerrado
        if (ticket.fecha_actualizacion && ticket.fecha_actualizacion !== ticket.fecha_creacion) {
          history.push({
            action: 'Ticket cerrado',
            date: formatDateForHistory(ticket.fecha_actualizacion),
            user: 'Sistema'
          })
        }

        return {
          id: ticket.id_soporte,
          subject: ticket.asunto,
          message: ticket.mensaje,
          user: ticket.usuario.nombre,
          userPhone: ticket.usuario.telefono,
          date: new Date(ticket.fecha_creacion),
          estado: ticket.estado ? 1 : 0,
          service: ticket.id_solicitud ? `Solicitud #${ticket.id_solicitud}` : 'Sin solicitud',
          serviceId: ticket.id_solicitud || null,
          history: history
        }
      })
    }
  } catch (error) {
    console.error('Error fetching support tickets:', error)
    showError(error.message || 'Error al cargar los tickets de soporte')
  } finally {
    isLoading.value = false
  }
}


// Tipos de ticket y sus iconos
const ticketTypes = {
  falla: '🔧',
  pago: '💳',
  duda: '❓',
  queja: '⚠️',
  facturacion: '📄',
  otro: '✉️'
};

// Clases para los niveles de prioridad
const priorityClasses = {
  alta: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  media: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  baja: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

// Clases para los iconos según prioridad
const priorityIconBg = {
  alta: 'bg-red-100 dark:bg-red-900/30',
  media: 'bg-yellow-100 dark:bg-yellow-900/30',
  baja: 'bg-green-100 dark:bg-green-900/30'
};

// Configuración de paginación
const currentPage = ref(1);
const itemsPerPage = 5;

// Calcular el total de páginas
const totalPages = computed(() => {
  return Math.ceil(pendingTickets.value.length / itemsPerPage);
});

// Calcular los tickets a mostrar en la página actual
const displayedTickets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return pendingTickets.value.slice(start, end);
});

// Ir a la página anterior
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Ir a la página siguiente
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Obtener icono según el tipo de ticket
const getTicketIcon = (type) => {
  return ticketTypes[type] || ticketTypes.otro;
};

// Obtener clase de fondo según prioridad
const getTicketIconBg = (priority) => {
  return priorityIconBg[priority] || priorityIconBg.media;
};

// Obtener clase de badge según prioridad
const getPriorityBadgeClass = (priority) => {
  return priorityClasses[priority] || priorityClasses.media;
};

// Formatear prioridad para mostrar
const formatPriority = (priority) => {
  const priorities = {
    alta: 'Alta',
    media: 'Media',
    baja: 'Baja'
  };
  return priorities[priority] || priority;
};

// Actualizar lista de tickets
const refreshSupportTickets = async () => {
  try {
    showToast({
      message: 'Actualizando lista de tickets...',
      type: 'info',
      duration: 2000
    })
    
    await fetchSupportTickets()
    
    showToast({
      message: 'Lista de tickets actualizada',
      type: 'success',
      duration: 2000
    })
  } catch (error) {
    showError(error.message || 'Error al actualizar los tickets')
  }
} 

// Configuración de paginación para actividades
const currentActivityPage = ref(1);
const totalActivityPages = ref(1);
const activityItemsPerPage = 5;

// Calcular las actividades a mostrar en la página actual
const displayedActivities = computed(() => {
  // Ya no necesitamos calcular el slice aquí ya que el servidor maneja la paginación
  return recentActivities.value;
});

// Función para cargar notificaciones con paginación sin mostrar loading global
const loadNotifications = async () => {
  try {
    const config = useRuntimeConfig()
    const auth = useAuthStore()
    
    const response = await $api(`/notificaciones?page=${currentActivityPage.value}&limit=5`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    
    if (response.success && response.data) {
      recentActivities.value = response.data.map(notif => ({
        id: notif.id || Math.random().toString(36).substr(2, 9),
        title: notif.titulo,
        date: notif.fecha,
        read: notif.leido === 1,
        readDate: notif.fechaLeido,
        user: notif.nombreUsuario,
        icon: getNotificationIcon(notif.titulo)
      }))
      
      if (response.pagination) {
        totalActivityPages.value = response.pagination.pages
      }
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    showError('Error al cargar las actividades recientes')
  }
};

// Función para cargar notificaciones con loading (para inicialización)
const refreshPendingItems = async () => {
  isLoading.value = true
  try {
    await loadNotifications()
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    showError('Error al cargar las actividades recientes')
  } finally {
    isLoading.value = false
  }
};

// Ir a la página anterior de actividades
const prevActivityPage = async () => {
  if (currentActivityPage.value > 1) {
    currentActivityPage.value--;
    await loadNotifications();
  }
};

// Ir a la página siguiente de actividades
const nextActivityPage = async () => {
  if (currentActivityPage.value < totalActivityPages.value) {
    currentActivityPage.value++;
    await loadNotifications();
  }
};

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000,
  id: null
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

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }
    
    const now = new Date();
    const diff = now - date; // Diferencia en milisegundos
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
      return 'hace unos segundos';
    } else if (minutes < 60) {
      return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      return `hace ${days} día${days !== 1 ? 's' : ''}`;
    } else if (months < 12) {
      return `hace ${months} mes${months !== 1 ? 'es' : ''}`;
    } else {
      return `hace ${years} año${years !== 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
}

const getMetricColor = (value) => {
  if (value >= 80) return 'bg-red-500'
  if (value >= 60) return 'bg-yellow-500'
  return 'bg-green-500'
}

const showToast = (options) => {
  // Limpiar cualquier toast existente
  if (toast.value.id) {
    clearTimeout(toast.value.id)
  }
  
  // Ocultar el toast actual
  toast.value.show = false
  
  // Usar nextTick para asegurar que la actualización del DOM se complete
  nextTick(() => {
    // Generar un ID único para este toast
    const toastId = Date.now()
    
    // Configurar el nuevo toast
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000,
      id: toastId
    }
    
    // Configurar el temporizador para ocultar el toast
    if (toast.value.duration > 0) {
      toast.value.id = setTimeout(() => {
        if (toast.value.id === toastId) {
          toast.value.show = false
        }
      }, toast.value.duration)
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
  if (route) {
    navigateTo(route);
  }
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

// Función auxiliar para obtener iconos según el tipo de notificación
const getNotificationIcon = (title) => {
  if (title.includes('asignado')) return '👨‍💼'
  if (title.includes('Cotización')) return '📄'
  if (title.includes('Aceptada')) return '✅'
  if (title.includes('Rechazada')) return '❌'
  return '📝'
}

// Marcar ticket como resuelto
const marcarComoResuelto = async (ticket) => {
  try {
    const url = `/soporte/${ticket.id_soporte || ticket.id}`
    
    const data = await $api(url, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      credentials: 'include',
      body: JSON.stringify({
        estado: 0, // 0 = cerrado
        fecha_actualizacion: new Date().toISOString()
      })
    });
    
    // El backend devuelve el ticket actualizado directamente
    if (!data) {
      throw new Error('No se recibió respuesta del servidor');
    }
    
    return data;
  } catch (error) {
    console.error('Error al marcar como resuelto:', error);
    throw error;
  }
}

// Función para formatear fechas en el historial
const formatDateForHistory = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// Manejar clic en el botón de resolver
const handleResolveClick = async () => {
  if (!selectedTicket.value) {
    console.error('No hay ticket seleccionado')
    showError('No se pudo procesar la solicitud')
    return
  }

  try {
    // Mostrar toast de carga
    showToast({
      message: 'Marcando ticket como resuelto...',
      type: 'info',
      duration: 2000
    })

    // Cerrar el modal inmediatamente para mejor experiencia de usuario
    closeTicketModal()
    
    // Realizar la petición
    await marcarComoResuelto(selectedTicket.value)
    
    // Mostrar mensaje de éxito
    showSuccess('El ticket se ha marcado como resuelto correctamente')
    
    // Forzar actualización de la lista
    await fetchSupportTickets()
    
  } catch (error) {
    console.error('Error al marcar como resuelto:', error)
    showError('Ocurrió un error al procesar la solicitud')
  }
}

// ===== INICIALIZACIÓN =====
const isInitialized = ref(false) 
const initPromise = ref(null)

const initializeDashboard = async () => {
  // Si ya está inicializado, retornar la promesa existente
  if (isInitialized.value) return initPromise.value
  
  // Crear una nueva promesa para la inicialización
  initPromise.value = (async () => {
    try {
      isInitialized.value = true
      
      // Cargar tickets de soporte
      await fetchSupportTickets()
      
      // Cargar estadísticas u otros datos necesarios
      await fetchStatistics()
      
      // Cargar actividades recientes
      await refreshPendingItems()
      
    } catch (error) {
      console.error('Error al cargar el dashboard:', error)
      showError('Error al cargar los datos del dashboard')
    } finally {
      isLoading.value = false
    }
  })()
  
  return initPromise.value
}
</script>

<style scoped>
/* Animación de rebote continuo */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0) scale(1.1);
  }
  50% {
    transform: translateY(-4px) scale(1.15);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 1.5s ease-in-out infinite;
}

/* Estilos específicos del componente */
@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--pulse-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(var(--pulse-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--pulse-rgb), 0);
  }
}

.animate-pulse-border {
  position: relative;
  --pulse-rgb: 245, 158, 11; /* Yellow color */
  animation: pulse-border 2s infinite;
  background-clip: padding-box;
}

.animate-pulse-border::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(45deg, 
    rgba(var(--pulse-rgb), 0.8), 
    rgba(var(--pulse-rgb), 0.4), 
    rgba(var(--pulse-rgb), 0.8)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box, 
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

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