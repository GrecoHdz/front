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
      :message="'Cargando usuarios...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderUsuariosAdmin />

      <!-- Content Container -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Page Header -->
            <section class="px-3 sm:px-6 py-3 sm:py-6">
              <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"></div>
                <div class="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg"></div>
                
                <div class="relative">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center">
                        <span class="text-lg sm:text-2xl">👥</span>
                      </div>
                      <div>
                        <h1 class="text-base sm:text-2xl font-black">Gestión de Usuarios</h1>
                        <p class="text-white/90 font-medium text-xs sm:text-sm">{{ totalUsers }} usuarios registrados</p>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Quick Stats -->
                  <div class="grid grid-cols-3 gap-2">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                      <div class="text-[12px] sm:text-base font-black">{{ totalUsers }}</div>
                      <div class="text-[11px] text-white/80">Usuarios</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                      <div class="text-[12px] sm:text-base font-black">{{ stats.totalReferrals }}</div>
                      <div class="text-[11px] text-white/80">Referidos</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20 text-center">
                      <div class="text-[11px] sm:text-base font-black">L. {{ formatCurrency(stats.totalCredits) }}</div>
                      <div class="text-[11px] text-white/80">Créditos</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Filters and Search -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex flex-col space-y-2">
                  <!-- Search -->
                  <div class="w-full">
                    <div class="relative">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-3 w-3 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                      </div>
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Buscar por nombre..."
                        class="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                      >
                    </div>
                  </div>
                  
                  <!-- Status and City Filters -->
                  <div class="flex space-x-2">
                    <div class="flex-1">
                      <multiselect
                        v-model="selectedStatus"
                        :options="statusOptions"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Estado"
                        label="label"
                        track-by="value"
                        class="multiselect-custom"
                        :class="{ 'multiselect--active': selectedStatus }"
                        :select-label="''"
                        :deselect-label="''"
                        :selected-label="''"
                        :no-options="'No hay opciones'"
                        :no-result="'No se encontraron resultados'"
                        @search-change="$event && $event.stopPropagation()"
                        @search-focus="(e) => e && e.target && e.target.blur()"
                        @touchstart.native.stop
                        @click.native.stop
                        ref="statusSelect"
                        :options-limit="100"
                      >
                        <template #singleLabel="{ option }">
                          <span class="text-xs truncate">{{ option.label }}</span>
                        </template>
                      </multiselect>
                    </div>
                    
                    <div class="flex-1">
                      <multiselect
                        v-model="selectedCity"
                        :options="availableCities.map(city => ({ value: city, label: city }))"
                        :searchable="false"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Todas las ciudades"
                        label="label"
                        track-by="value"
                        class="multiselect-custom"
                        :class="{ 'multiselect--active': selectedCity }"
                        :select-label="''"
                        :deselect-label="''"
                        :selected-label="''"
                        :no-options="'No hay ciudades'"
                        :no-result="'No se encontraron resultados'"
                        @search-change="$event && $event.stopPropagation()"
                        @search-focus="(e) => e && e.target && e.target.blur()"
                        @touchstart.native.stop
                        @click.native.stop
                        ref="citySelect"
                        :options-limit="100"
                      >
                        <template #singleLabel="{ option }">
                          <span class="text-xs truncate">{{ option.value || 'Ciudad' }}</span>
                        </template>
                      </multiselect>
                    </div>
                  </div>
                </div>
                
                <!-- Clear Filters -->
                <div v-if="hasActiveFilters" class="mt-2">
                  <button 
                    @click="clearFilters"
                    class="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline"
                  >
                    🗑️ Limpiar filtros
                  </button>
                </div>
              </div>
            </section>

            <!-- Usuarios Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    👤 Usuarios ({{ filteredUsers.length }})
                  </h2>
                  <div class="flex space-x-1">
                    <button 
                      @click="showTopCredits"
                      class="text-[11px] xs:text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-green-200 dark:hover:bg-green-900/50 whitespace-nowrap"
                    >
                      💰Top Créditos
                    </button>
                    <button 
                      @click="showTopReferrals"
                      class="text-[11px] xs:text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 whitespace-nowrap"
                    >
                      👥Top Referidos
                    </button>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-if="paginatedUsers.length === 0" class="text-center py-6">
                  <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span class="text-lg">👤</span>
                  </div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No se encontraron usuarios</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">
                    {{ searchQuery ? 'Intenta ajustar tus filtros de búsqueda' : 'No hay usuarios registrados' }}
                  </p>
                </div>

                <!-- Users List -->
                <div v-else>
                  <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div 
                      v-for="user in paginatedUsers" 
                      :key="user.id"
                      @click="editUser(user)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': user.status === 'deshabilitado',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': user.status === 'activo'
                      }"
                    >
                      <!-- User Header -->
                      <div class="flex items-start justify-between w-full">
                        <div class="flex items-center space-x-2">
                          <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                               :class="user.status === 'deshabilitado' ? 'bg-red-500' : 'bg-green-500'">
                            {{ getUserInitial(user.name) }}
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white truncate max-w-[90px] sm:max-w-[120px] mb-0.5">
                              {{ truncateName(user.name) }}
                            </h3>
                            <div class="flex">
                              <span class="text-[7px] px-1.5 py-0.5 rounded-full font-medium"
                                    :class="user.status === 'deshabilitado' 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'">
                                {{ getStatusText(user.status) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="showServiceHistory(user)"
                            class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': user.status === 'deshabilitado',
                              'text-gray-400 hover:text-blue-500': user.status === 'activo'
                            }"
                            title="Historial"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h9.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0018 16.586V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                          </button>
                          <button 
                            @click.stop="editUser(user)"
                            class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': user.status === 'deshabilitado',
                              'text-gray-400 hover:text-blue-500': user.status === 'activo'
                            }"
                            title="Editar"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button> 
                        </div>
                      </div>
                      
                      <!-- Stats -->
                      <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div class="grid grid-cols-2 gap-2">
                          <!-- Referidos -->
                          <div 
                            @click.stop="user.referrals > 0 ? showReferrals(user) : null"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': user.referrals > 0,
                              'bg-red-50 dark:bg-red-900/20': user.status === 'deshabilitado',
                              'bg-gray-50 dark:bg-gray-700/50': user.status === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Referidos</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span 
                                class="text-xs font-medium"
                                :class="user.status === 'deshabilitado' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'"
                              >
                                {{ user.referrals || 0 }}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Créditos -->
                          <div 
                            @click.stop="user.credits > 0 ? showCredits(user) : null"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': user.credits > 0,
                              'bg-red-50 dark:bg-red-900/20': user.status === 'deshabilitado',
                              'bg-gray-50 dark:bg-gray-700/50': user.status === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Créditos</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="user.status === 'deshabilitado' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                L {{ formatCompactCurrency(user.credits || 0) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Paginación Usuarios -->
                  <div v-if="usersTotalPages > 1" class="mt-3 flex items-center justify-between px-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ usersStartItem }}-{{ usersEndItem }} de {{ filteredUsers.length }}
                    </div>
                    <div class="flex space-x-1">
                      <button 
                        @click="usersCurrentPage--" 
                        :disabled="usersCurrentPage === 1"
                        class="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span class="px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                        {{ usersCurrentPage }} / {{ usersTotalPages }}
                      </span>
                      <button 
                        @click="usersCurrentPage++" 
                        :disabled="usersCurrentPage >= usersTotalPages"
                        class="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Técnicos Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    🔧 Técnicos ({{ filteredTechnicians.length }})
                  </h2>
                  <div class="flex space-x-1">
                    <button 
                      @click="showTopBalances"
                      class="text-[11px] xs:text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-yellow-200 dark:hover:bg-yellow-900/50 whitespace-nowrap"
                    >
                      💰Top Saldos
                    </button>
                    <button 
                      @click="showTopRatings"
                      class="text-[11px] xs:text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-md font-bold hover:bg-purple-200 dark:hover:bg-purple-900/50 whitespace-nowrap"
                    >
                      ⭐ Calificaciones
                    </button>
                  </div>
                </div>

                <!-- Technicians Grid -->
                <div v-if="paginatedTechnicians.length > 0">
                  <div class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div 
                      v-for="technician in paginatedTechnicians" 
                      :key="technician.id"
                      @click="editUser(technician)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': technician.status === 'deshabilitado',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': technician.status === 'activo',
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50': technician.status === 'inactivo'
                      }"
                    >
                      <!-- Header -->
                      <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-2">
                          <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm"
                               :class="technician.status === 'deshabilitado' ? 'bg-red-500' : 'bg-blue-500'">
                            <span>🔧</span>
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px]">{{ technician.name }}</h3>
                            <div class="flex items-center space-x-1">
                              <span class="text-[10px] px-1 py-0.5 rounded-full font-medium"
                                    :class="technician.status === 'deshabilitado' 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'">
                                {{ getStatusText(technician.status) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="editUser(technician)"
                            class="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': technician.status === 'deshabilitado',
                              'text-gray-400 hover:text-blue-500': technician.status === 'activo'
                            }"
                            title="Editar"
                          >
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button> 
                        </div>
                      </div>
                      
                      <!-- Stats -->
                      <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div class="grid grid-cols-2 gap-2">
                          <!-- Saldo -->
                          <div 
                            @click.stop="showCredits(technician)"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': technician.credits > 0,
                              'bg-red-50 dark:bg-red-900/20': technician.status === 'deshabilitado',
                              'bg-gray-50 dark:bg-gray-700/50': technician.status === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[10px] text-gray-500 dark:text-gray-400">Ver Saldo</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="technician.status === 'deshabilitado' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                L {{ formatCompactCurrency(technician.credits || 0) }}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Calificaciones -->
                          <div 
                            @click.stop="showTechnicianServices(technician)"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': true,
                              'bg-red-50 dark:bg-red-900/20': technician.status === 'deshabilitado',
                              'bg-gray-50 dark:bg-gray-700/50': technician.status === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Servicios</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="technician.status === 'deshabilitado' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'">
                                ⭐ {{ technician.rating || '5.0' }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <!-- Paginación Técnicos -->
                  <div v-if="techniciansTotalPages > 1" class="mt-3 flex items-center justify-between px-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ techniciansStartItem }}-{{ techniciansEndItem }} de {{ filteredTechnicians.length }}
                    </div>
                    <div class="flex space-x-1">
                      <button 
                        @click="techniciansCurrentPage--" 
                        :disabled="techniciansCurrentPage === 1"
                        class="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span class="px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                        {{ techniciansCurrentPage }} / {{ techniciansTotalPages }}
                      </span>
                      <button 
                        @click="techniciansCurrentPage++" 
                        :disabled="techniciansCurrentPage >= techniciansTotalPages"
                        class="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-6">
                  <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span class="text-lg">🔧</span>
                  </div>
                  <h3 class="text-sm font-bold text-gray-900 dark:text-white mb-1">No se encontraron técnicos</h3>
                </div>
              </div>
            </section>

            <!-- Administradores Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    👑 Administradores ({{ filteredAdmins.length }})
                  </h2>
                </div>

                <!-- Admins Grid -->
                <div v-if="paginatedAdmins.length > 0" class="grid grid-cols-2 gap-1">
                  <div v-for="admin in paginatedAdmins" :key="admin.id"
                       class="bg-purple-50 dark:bg-purple-900/20 rounded-md p-1.5 border border-purple-200 dark:border-purple-700">
                    <div>
                      <p class="text-[10px] font-medium text-gray-900 dark:text-white truncate">{{ admin.name }}</p>
                      <p class="text-[9px] text-gray-600 dark:text-gray-400 truncate">{{ admin.email || 'Sin correo' }}</p>
                      <p class="text-[9px] text-gray-600 dark:text-gray-400 truncate">{{ admin.phone || 'Sin teléfono' }}</p>
                    </div>
                  </div>
                  
                  <!-- Paginación Admins -->
                  <div v-if="adminsTotalPages > 1" class="mt-3 flex items-center justify-between px-1">
                    <div class="text-xs text-gray-500 dark:text-gray-400">
                      {{ adminsStartItem }}-{{ adminsEndItem }} de {{ filteredAdmins.length }}
                    </div>
                    <div class="flex space-x-1">
                      <button 
                        @click="adminsCurrentPage--" 
                        :disabled="adminsCurrentPage === 1"
                        class="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span class="px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                        {{ adminsCurrentPage }} / {{ adminsTotalPages }}
                      </span>
                      <button 
                        @click="adminsCurrentPage++" 
                        :disabled="adminsCurrentPage >= adminsTotalPages"
                        class="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-4">
                  <h3 class="text-xs font-medium text-gray-500 dark:text-gray-400">No hay administradores registrados</h3>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      <FootersFooterAdmin />
    </div>

    <!-- Edit User Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">Editar Usuario</h3>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <div class="p-3">
            <form @submit.prevent="saveUser" class="space-y-3">
              <!-- Información del Usuario (solo lectura) -->
              <div class="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg space-y-3">
                <h4 class="text-xs font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-1">
                  Información del Usuario
                </h4>
                
                <!-- Nombre -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Nombre Completo
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.nombre }}
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Correo Electrónico
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.email }}
                  </div>
                </div>

                <!-- Identidad -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Número de Identidad
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.identidad || 'No especificado' }}
                  </div>
                </div>

                <!-- Teléfono -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Teléfono
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ userForm.telefono || 'No especificado' }}
                  </div>
                </div>

                <!-- Ciudad -->
                <div>
                  <label class="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                    Ciudad
                  </label>
                  <div class="text-sm text-gray-900 dark:text-white bg-white/50 dark:bg-gray-700/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                    {{ getCityName(userForm.id_ciudad) || 'No especificada' }}
                  </div>
                </div>
              </div> 
                
                <!-- Rol y Estado en una línea -->
                <div class="grid grid-cols-2 gap-3">
                  <!-- Rol -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rol
                    </label>
                    <multiselect
                      v-model="userForm.id_rol"
                      :options="[
                        { value: '1', label: 'Administrador' },
                        { value: '2', label: 'Técnico' },
                        { value: '3', label: 'Usuario' }
                      ]"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Seleccionar rol"
                      label="label"
                      track-by="value"
                      class="multiselect-custom"
                      :class="{ 'multiselect--active': userForm.id_rol }"
                      :select-label="''"
                      :deselect-label="''"
                      :selected-label="''"
                      :no-options="'No hay opciones'"
                      :no-result="'No se encontraron resultados'"
                      @search-change="$event && $event.stopPropagation()"
                      @search-focus="(e) => e && e.target && e.target.blur()"
                      @touchstart.native.stop
                      @click.native.stop
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-xs truncate">{{ option ? option.label : 'Seleccionar rol' }}</span>
                      </template>
                    </multiselect>
                  </div>

                  <!-- Estado -->
                  <div>
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <multiselect
                      v-model="userForm.estado"
                      :options="[
                        { value: 'activo', label: 'Activo' },
                        { value: 'deshabilitado', label: 'Deshabilitado' }
                      ]"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Estado"
                      label="label"
                      track-by="value"
                      class="multiselect-custom"
                      :class="{ 'multiselect--active': userForm.estado }"
                      :select-label="''"
                      :deselect-label="''"
                      :selected-label="''"
                      :no-options="'No hay opciones'"
                      :no-result="'No se encontraron resultados'"
                      @search-change="$event && $event.stopPropagation()"
                      @search-focus="(e) => e && e.target && e.target.blur()"
                      @touchstart.native.stop
                      @click.native.stop
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-xs truncate">{{ option ? option.label : 'Estado' }}</span>
                      </template>
                    </multiselect>
                  </div>
                </div>
              

              <!-- Botón de cambio de contraseña -->
              <div class="pt-2">
                <button 
                  type="button"
                  @click="showPasswordModal = true"
                  class="w-full py-2 mb-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Cambiar Contraseña</span>
                </button>
              </div>

              <!-- Botones de acción -->
              <div class="flex space-x-2 pt-1">
                <button 
                  type="button"
                  @click="closeModal"
                  class="w-1/3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  :disabled="isSaving"
                  class="w-2/3 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs"
                >
                  {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top Credits Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopCreditsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopCreditsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">💰 Top 5 Usuarios con más Créditos</h3>
              <button @click="showTopCreditsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(user, index) in topCreditUsers" :key="user.id" class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ user.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ user.city }}</p>
                    </div>
                  </div>
                  <p class="text-sm font-bold text-green-600 dark:text-green-400">L. {{ formatCurrency(user.credits) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top Referrals Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopReferralsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopReferralsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">👥 Top 5 Usuarios con más Referidos</h3>
              <button @click="showTopReferralsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(user, index) in topReferralUsers" :key="user.id" class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ user.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ user.city }}</p>
                    </div>
                  </div>
                  <p class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ user.referrals }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Referrals Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showReferralsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showReferralsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">👥 Referidos de {{ selectedUser?.name }}</h3>
              <button @click="showReferralsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtro y Contador en una línea -->
            <div class="flex items-center justify-between mb-3 gap-2">
              <!-- Filtro de fecha -->
              <div class="flex-1 relative">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar por mes</label>
                <div class="relative">
                  <input 
                    type="month"
                    v-model="referralsFilterMonth"
                    @change="filterReferrals"
                    class="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none"
                    :class="{ 'text-transparent': !referralsFilterMonth }"
                  />
                  <div v-if="!referralsFilterMonth" class="absolute inset-0 flex items-center px-2 pointer-events-none text-gray-400 dark:text-gray-500">
                    <span class="text-xs">Todos los meses</span>
                  </div>
                </div>
              </div>
              
              <!-- Contador de referidos -->
              <div class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 flex-1">
                <p class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ filteredReferrals.length }}</p>
                <p class="text-xs text-blue-600 dark:text-blue-400">Referidos</p>
              </div>
            </div>
            
            <div class="space-y-2 mb-3">
              <div v-if="filteredReferrals.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron referidos</p>
              </div>
              <div v-else>
                <div v-for="referral in paginatedReferrals" :key="referral.id" class="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ referral.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ referral.email }}</p>
                    </div>
                    <span :class="referral.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'" 
                          class="text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                      {{ referral.status }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Registrado: {{ formatDate(referral.createdAt) }}</p>
                </div>
              </div>
            </div>
            
            <!-- Paginación referidos -->
            <div v-if="referralsTotalPages > 1" class="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ referralsStartItem }}-{{ referralsEndItem }} de {{ filteredReferrals.length }}
                </div>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="changeReferralsPage(referralsCurrentPage - 1)" 
                    :disabled="referralsCurrentPage === 1"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': referralsCurrentPage === 1 }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div class="flex items-center space-x-0.5">
                    <button 
                      v-for="page in referralsTotalPages" 
                      :key="page"
                      @click="changeReferralsPage(page)"
                      class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                      :class="{
                        'bg-blue-600 text-white': referralsCurrentPage === page,
                        'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': referralsCurrentPage !== page
                      }"
                    >
                      {{ page }}
                    </button>
                  </div>
                  
                  <button 
                    @click="changeReferralsPage(referralsCurrentPage + 1)" 
                    :disabled="referralsCurrentPage >= referralsTotalPages"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': referralsCurrentPage >= referralsTotalPages }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Credits Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showCreditsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCreditsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">💰 Créditos de {{ selectedUser?.name }}</h3>
              <button @click="showCreditsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtro y Saldo en una línea -->
            <div class="flex items-center justify-between mb-3 gap-2">
              <!-- Filtro de fecha -->
              <div class="flex-1 relative">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar por mes</label>
                <div class="relative">
                  <input 
                    type="month"
                    v-model="creditsFilterMonth"
                    @change="filterCredits"
                    class="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none"
                    :class="{ 'text-transparent': !creditsFilterMonth }"
                  />
                  <div v-if="!creditsFilterMonth" class="absolute inset-0 flex items-center px-2 pointer-events-none text-gray-400 dark:text-gray-500">
                    <span class="text-xs">Todos los meses</span>
                  </div>
                </div>
              </div>
              
              <!-- Saldo actual -->
              <div class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 flex-1">
                <p class="text-sm font-bold text-green-600 dark:text-green-400">L. {{ formatCurrency(selectedUser?.credits || 0) }}</p>
                <p class="text-xs text-green-600 dark:text-green-400">Saldo disponible</p>
              </div>
            </div>
            
            <div class="space-y-2 mb-3">
              <div v-if="filteredCredits.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron transacciones</p>
              </div>
              <div v-else>
                <div v-for="transaction in paginatedCredits" :key="transaction.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1.5 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ transaction.description }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ formatDate(transaction.date) }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ transaction.reference }}</p>
                    </div>
                    <div class="text-right">
                      <p :class="transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'" class="font-bold text-sm">
                        {{ transaction.type === 'credit' ? '+' : '-' }}L. {{ formatCurrency(transaction.amount) }}
                      </p>
                      <span :class="{
                        'bg-green-100 text-green-800': transaction.status === 'Completado',
                        'bg-yellow-100 text-yellow-800': transaction.status === 'Pendiente',
                        'bg-red-100 text-red-800': transaction.status === 'Rechazado'
                      }" class="text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block">
                        {{ transaction.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Paginación créditos -->
            <div v-if="creditsTotalPages > 1" class="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ creditsStartItem }}-{{ creditsEndItem }} de {{ filteredCredits.length }}
                </div>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="changeCreditsPage(creditsCurrentPage - 1)" 
                    :disabled="creditsCurrentPage === 1"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': creditsCurrentPage === 1 }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div class="flex items-center space-x-0.5">
                    <button 
                      v-for="page in Math.min(5, creditsTotalPages)" 
                      :key="page"
                      @click="changeCreditsPage(page)"
                      class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                      :class="{
                        'bg-blue-600 text-white': creditsCurrentPage === page,
                        'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': creditsCurrentPage !== page
                      }"
                    >
                      {{ page }}
                    </button>
                    
                    <span v-if="creditsTotalPages > 5" class="px-1 text-gray-500">...</span>
                  </div>
                  
                  <button 
                    @click="changeCreditsPage(creditsCurrentPage + 1)" 
                    :disabled="creditsCurrentPage >= creditsTotalPages"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': creditsCurrentPage >= creditsTotalPages }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Service History Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showServiceHistoryModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showServiceHistoryModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ selectedUser?.role === 'technician' ? '🔧' : '📋' }} 
                {{ selectedUser?.role === 'technician' ? 'Servicios de ' : 'Historial de ' }}
                {{ selectedUser?.name }}
              </h3>
              <button @click="showServiceHistoryModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <!-- Filtro y Contador en una línea -->
            <div class="flex items-center justify-between mb-3 gap-2">
              <!-- Filtro de fecha -->
              <div class="flex-1 relative">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Filtrar por fecha</label>
                <div class="relative">
                  <input 
                    type="date"
                    v-model="servicesFilterDate"
                    class="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white appearance-none"
                    :class="{ 'text-transparent': !servicesFilterDate }"
                  />
                  <div v-if="!servicesFilterDate" class="absolute inset-0 flex items-center px-2 pointer-events-none text-gray-400 dark:text-gray-500">
                    <span class="text-xs">Todas las fechas</span>
                  </div>
                </div>
              </div>
              
              <!-- Contador de servicios -->
              <div class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 flex-1">
                <p class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ userServiceHistory.length }}</p>
                <p class="text-xs text-purple-600 dark:text-purple-400">Servicios</p>
              </div>
            </div>
            
            <div class="space-y-2 mb-3">
              <div v-if="userServiceHistory.length === 0" class="text-center py-4">
                <p class="text-sm text-gray-500 dark:text-gray-400">No se encontraron servicios</p>
              </div>
              <div v-else>
                <div v-for="service in paginatedServices" :key="service.id" class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-1.5 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="w-full">
                      <div class="flex justify-between items-center">
                        <p class="font-medium text-gray-900 dark:text-white text-xs">{{ service.name }}</p>
                        <span :class="service.status === 'Completado' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'" 
                              class="text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                          {{ service.status }}
                        </span>
                      </div>
                      <div class="flex justify-between items-center mt-1">
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(service.date) }}</p>
                        <div class="flex items-center space-x-2">
                          <p v-if="selectedUser?.role !== 'technician'" class="text-xs text-gray-600 dark:text-gray-400">{{ service.technician }}</p>
                          <button v-if="service.status === 'Completado' && service.comment" 
                                  @click.stop="showComment(service.comment, service.rating, service.user)" 
                                  class="flex items-center text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                            <span class="mr-0.5">Ver</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Paginación servicios -->
            <div v-if="servicesTotalPages > 1" class="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ servicesStartItem }}-{{ servicesEndItem }} de {{ userServiceHistory.length }}
                </div>
                <div class="flex items-center space-x-1">
                  <button 
                    @click="changeServicesPage(servicesCurrentPage - 1)" 
                    :disabled="servicesCurrentPage === 1"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': servicesCurrentPage === 1 }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div class="flex items-center space-x-0.5">
                    <template v-if="servicesTotalPages <= 5">
                      <button 
                        v-for="page in servicesTotalPages" 
                        :key="page"
                        @click="changeServicesPage(page)"
                        class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                        :class="{
                          'bg-blue-600 text-white': servicesCurrentPage === page,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': servicesCurrentPage !== page
                        }"
                      >
                        {{ page }}
                      </button>
                    </template>
                    <template v-else>
                      <!-- Mostrar primeros 2 botones -->
                      <button 
                        v-for="page in Math.min(2, servicesTotalPages)" 
                        :key="page"
                        @click="changeServicesPage(page)"
                        class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                        :class="{
                          'bg-blue-600 text-white': servicesCurrentPage === page,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': servicesCurrentPage !== page
                        }"
                      >
                        {{ page }}
                      </button>
                      
                      <!-- Puntos suspensivos si es necesario -->
                      <span v-if="servicesCurrentPage > 3" class="px-1 text-gray-500">...</span>
                      
                      <!-- Botones alrededor de la página actual -->
                      <template v-if="servicesCurrentPage > 2 && servicesCurrentPage < servicesTotalPages - 1">
                        <button 
                          v-if="servicesCurrentPage > 3"
                          @click="changeServicesPage(servicesCurrentPage - 1)"
                          class="w-6 h-6 text-xs rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {{ servicesCurrentPage - 1 }}
                        </button>
                        <button 
                          @click="changeServicesPage(servicesCurrentPage)"
                          class="w-6 h-6 text-xs rounded-full bg-blue-600 text-white"
                        >
                          {{ servicesCurrentPage }}
                        </button>
                        <button 
                          v-if="servicesCurrentPage < servicesTotalPages - 2"
                          @click="changeServicesPage(servicesCurrentPage + 1)"
                          class="w-6 h-6 text-xs rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {{ servicesCurrentPage + 1 }}
                        </button>
                      </template>
                      
                      <!-- Puntos suspensivos si es necesario -->
                      <span v-if="servicesCurrentPage < servicesTotalPages - 2" class="px-1 text-gray-500">...</span>
                      
                      <!-- Últimos 2 botones -->
                      <button 
                        v-for="page in [servicesTotalPages - 1, servicesTotalPages]" 
                        :key="page"
                        @click="changeServicesPage(page)"
                        class="w-6 h-6 text-xs rounded-full flex items-center justify-center"
                        :class="{
                          'bg-blue-600 text-white': servicesCurrentPage === page,
                          'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700': servicesCurrentPage !== page
                        }"
                      >
                        {{ page }}
                      </button>
                    </template>
                  </div>
                  
                  <button 
                    @click="changeServicesPage(servicesCurrentPage + 1)" 
                    :disabled="servicesCurrentPage >= servicesTotalPages"
                    class="p-1.5 rounded-full disabled:opacity-40 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    :class="{ 'cursor-not-allowed': servicesCurrentPage >= servicesTotalPages }"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Cambio de Contraseña -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showPasswordModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
              <h3 class="text-sm font-black text-gray-900 dark:text-white">Cambiar Contraseña</h3>
              <button 
                @click="showPasswordModal = false"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Contenido -->
          <div class="p-3">
            <form @submit.prevent="updateUserPassword" class="space-y-3">
              <!-- Campo de usuario oculto para accesibilidad -->
              <div class="sr-only">
                <label for="username">Nombre de usuario</label>
                <input 
                  id="username"
                  type="text" 
                  :value="userForm.email"
                  name="username"
                  autocomplete="username"
                  class="hidden"
                  aria-hidden="true"
                >
              </div>
              
              <div class="space-y-1">
                <label for="newPassword" class="block text-xs font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                <input 
                  id="newPassword"
                  v-model="newPassword"
                  type="password" 
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-sm"
                  placeholder="Ingresa la nueva contraseña"
                  autocomplete="new-password"
                  required
                  minlength="6"
                >
              </div>
              
              <div class="space-y-1">
                <label for="confirmPassword" class="block text-xs font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                <input 
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password" 
                  class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-sm"
                  placeholder="Confirma la nueva contraseña"
                  autocomplete="new-password"
                  required
                  :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                >
                <p v-if="passwordMismatch" class="text-xs text-red-600 dark:text-red-400">Las contraseñas no coinciden</p>
              </div>
              
              <div class="space-y-2"> 
                
                <div class="flex space-x-2">
                  <button 
                    type="button"
                    @click="closeModal"
                    class="w-1/2 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    :disabled="isSaving"
                    class="w-1/2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <span v-if="isSaving">Guardando...</span>
                    <span v-else>Guardar Cambios</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de Comentario -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showCommentModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showCommentModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-sm relative z-10">
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">Comentario del Cliente</h3>
              <button @click="showCommentModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="space-y-4">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cliente</p>
                <p class="text-sm text-gray-900 dark:text-white">{{ currentClient }}</p>
              </div>
              
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Calificación</p>
                <div class="flex items-center">
                  <span class="text-yellow-500 text-sm mr-1">{{ currentRating }}</span>
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
              </div>
              
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Comentario</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  {{ currentComment }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Top Saldos Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopBalancesModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopBalancesModal = false"></div>
        <Transition
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to"
        >
          <div v-if="showTopBalancesModal" class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
            <div class="p-3">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-black text-gray-900 dark:text-white">🏆 Top 5 Técnicos con Mejores Saldos</h3>
                <button @click="showTopBalancesModal = false" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="space-y-2">
                <div v-for="(tech, index) in topBalances" :key="tech.id" class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white text-xs">{{ tech.name }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ getCityName(tech.city) }}</p>
                      </div>
                    </div>
                    <p class="text-sm font-bold text-yellow-600 dark:text-yellow-400">L. {{ formatCurrency(tech.balance) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Top Calificaciones Modal -->
    <Transition
      enter-active-class="backdrop-enter-active"
      leave-active-class="backdrop-leave-active"
      enter-from-class="backdrop-enter-from"
      leave-to-class="backdrop-leave-to"
    >
      <div v-if="showTopRatingsModal" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopRatingsModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] max-w-sm max-h-[90vh] overflow-y-auto relative z-10">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">⭐ Top 5 Técnicos Mejor Calificados</h3>
              <button @click="showTopRatingsModal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="space-y-2">
              <div v-for="(tech, index) in topRatings" :key="tech.id" class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ tech.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ getCityName(tech.city) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1">
                    <span class="text-sm font-bold text-purple-600 dark:text-purple-400">{{ tech.rating.toFixed(1) }}</span>
                    <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="text-xs text-gray-500 dark:text-gray-400">({{ tech.reviews }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Estilos personalizados para vue-multiselect */
:deep(.multiselect-custom) {
  @apply min-w-[140px] text-xs;
}

:deep(.multiselect-custom .multiselect__tags) {
  @apply min-h-[36px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg;
  @apply focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500;
  padding: 6px 30px 6px 10px;
  transition: all 0.2s ease;
}

:deep(.multiselect-custom .multiselect__single) {
  @apply m-0 p-0 bg-transparent text-gray-900 dark:text-white text-xs;
  line-height: 1.25rem;
}

:deep(.multiselect-custom .multiselect__input) {
  @apply m-0 p-0 bg-transparent text-gray-900 dark:text-white text-xs placeholder-gray-400;
  @apply focus:ring-0 focus:border-transparent;
  min-height: 20px;
  line-height: 1.25rem;
}

:deep(.multiselect-custom .multiselect__placeholder) {
  @apply m-0 p-0 text-gray-400 text-xs;
  line-height: 1.25rem;
  margin-top: 1px;
}

:deep(.multiselect-custom .multiselect__select) {
  @apply h-full w-6 right-0 top-0 flex items-center justify-center;
  background: transparent;
  padding: 0;
}

:deep(.multiselect-custom .multiselect__select:before) {
  @apply border-t-gray-400 dark:border-t-gray-400;
  border-width: 5px 5px 0;
  margin-top: 0;
  top: 55%;
}

:deep(.multiselect-custom .multiselect__content-wrapper) {
  @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 z-50;
  min-width: 100%;
  width: auto !important;
}

:deep(.multiselect-custom .multiselect__option) {
  @apply text-xs text-gray-900 dark:text-white;
  padding: 8px 12px;
  line-height: 1.25rem;
}

:deep(.multiselect-custom .multiselect__option--highlight) {
  @apply bg-transparent text-gray-900 dark:text-white;
}

:deep(.multiselect-custom .multiselect__option--selected) {
  @apply bg-transparent text-gray-900 dark:text-white;
}

:deep(.multiselect-custom .multiselect__option--selected.multiselect__option--highlight) {
  @apply bg-transparent text-gray-900 dark:text-white;
}

:deep(.multiselect-custom .multiselect__tag) {
  @apply bg-blue-500 text-white text-xs rounded;
  padding: 2px 6px;
  margin: 2px 4px 2px 0;
}

:deep(.multiselect-custom .multiselect__tag-icon) {
  @apply hover:bg-blue-600 text-white;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

:deep(.multiselect-custom .multiselect__tag-icon:after) {
  @apply text-white text-sm;
}

:deep(.multiselect__tag) {
  @apply bg-blue-500 text-white text-xs;
}

:deep(.multiselect__tag-icon) {
  @apply hover:bg-blue-600 text-white;
}

:deep(.multiselect__tag-icon:after) {
  @apply text-white text-sm;
}

:deep(.multiselect__spinner) {
  @apply bg-transparent;
}

:deep(.multiselect__spinner:before, .multiselect__spinner:after) {
  @apply border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent;
}

/* ===== ANIMACIONES PARA MODALES ===== */
/* Animación de fondo (backdrop) */
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Animación del contenido del modal */
.modal-content-enter-active {
  animation: modal-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.modal-content-leave-active {
  animation: modal-leave 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modal-leave {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
}

/* Transiciones para el componente Transition de Vue */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
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
  background: rgba(107, 114, 128, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.6);
}

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

/* Asegurar que los modales tengan un ancho máximo del 85% en móviles */
@media (max-width: 640px) {
  .max-w-sm {
    max-width: 85% !important;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import Multiselect from 'vue-multiselect'
import { useHead, useCookie } from '#imports'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// ===== VARIABLES DE CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Gestión de Usuarios',
  meta: [
    { name: 'description', content: 'Gestión de usuarios del sistema HogarSeguro - Administrar usuarios, técnicos y administradores' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isSaving = ref(false)
const showEditModal = ref(false)
const showReferralsModal = ref(false)
const showCreditsModal = ref(false)
const showServiceHistoryModal = ref(false)
const showTopCreditsModal = ref(false)
const showTopReferralsModal = ref(false)
const showTopBalancesModal = ref(false)
const showTopRatingsModal = ref(false)

// Ciudades locales (temporal)
const localCities = [
  { id: 1, nombre: 'Tegucigalpa' },
  { id: 2, nombre: 'San Pedro Sula' },
  { id: 3, nombre: 'La Ceiba' },
  { id: 4, nombre: 'Choloma' },
  { id: 5, nombre: 'El Progreso' },
  { id: 6, nombre: 'Choluteca' },
  { id: 7, nombre: 'Comayagua' },
  { id: 8, nombre: 'Puerto Cortés' },
  { id: 9, nombre: 'La Lima' },
  { id: 10, nombre: 'Siguatepeque' }
]

// Top balances y ratings
const topBalances = ref([
  { id: 1, name: 'Técnico Ejemplo 1', city: 1, balance: 12500 },
  { id: 2, name: 'Técnico Ejemplo 2', city: 2, balance: 9800 },
  { id: 3, name: 'Técnico Ejemplo 3', city: 3, balance: 7500 },
  { id: 4, name: 'Técnico Ejemplo 4', city: 1, balance: 6200 },
  { id: 5, name: 'Técnico Ejemplo 5', city: 2, balance: 5100 }
])

const topRatings = ref([
  { id: 1, name: 'Técnico Ejemplo 1', city: 1, rating: 4.9, reviews: 128 },
  { id: 2, name: 'Técnico Ejemplo 2', city: 2, rating: 4.8, reviews: 95 },
  { id: 3, name: 'Técnico Ejemplo 3', city: 3, rating: 4.7, reviews: 87 },
  { id: 4, name: 'Técnico Ejemplo 4', city: 1, rating: 4.6, reviews: 76 },
  { id: 5, name: 'Técnico Ejemplo 5', city: 2, rating: 4.5, reviews: 64 }
])

// Filtros
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedCity = ref('')

// Paginación principal
const itemsPerPage = 6 // Mostrar 6 usuarios por página
const techniciansItemsPerPage = 6 // Cambiado a 6
const adminsItemsPerPage = 6 // Cambiado a 6
const usersCurrentPage = ref(1)
const techniciansCurrentPage = ref(1)
const adminsCurrentPage = ref(1)

// Paginación modales
const modalItemsPerPage = 5
const referralsCurrentPage = ref(1)
const creditsCurrentPage = ref(1)
const servicesCurrentPage = ref(1)

// Función para obtener la fecha actual en zona horaria de Honduras
const getCurrentDateInHonduras = () => {
  // Crear fecha actual en UTC
  const now = new Date()
  // Ajustar a zona horaria de Honduras (UTC-6)
  const offset = -6 * 60 // Honduras está en UTC-6
  const hondurasTime = new Date(now.getTime() + (offset * 60 * 1000))
  return hondurasTime
}

// Opciones de filtros
const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
  { value: 'suspendido', label: 'Suspendidos' }
]

// Filtros modales
const todayHonduras = getCurrentDateInHonduras()
const currentDate = todayHonduras.toISOString().split('T')[0]
const currentMonth = `${todayHonduras.getFullYear()}-${String(todayHonduras.getMonth() + 1).padStart(2, '0')}`

const referralsFilterMonth = ref('')
const creditsFilterMonth = ref('')
const servicesFilterDate = ref('')

// Usuario seleccionado y datos
const selectedUser = ref(null)
const userReferrals = ref([])
const userCreditHistory = ref([])
const userServiceHistory = ref([])

// Reset pagination when filters change
watch([searchQuery, selectedStatus, selectedCity], () => {
  usersCurrentPage.value = 1
  techniciansCurrentPage.value = 1
  adminsCurrentPage.value = 1
})

// ===== MÉTODOS DE UTILIDAD =====
const getCityName = (cityId) => {
  if (!cityId) return ''
  const city = localCities.find(c => c.id == cityId)
  return city ? city.nombre : 'Ciudad no encontrada'
}

const getUserInitial = (name) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

const formatCompactCurrency = (value) => {
  if (!value) return '0';
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value;
};

const getRoleBadgeColor = (role) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
    case 'technician':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// ===== VARIABLES DE DATOS =====
// Variables para el cambio de contraseña
const showPasswordModal = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isUpdatingPassword = ref(false)

// Estadísticas
const stats = ref({
  totalCredits: 125460,
  totalReferrals: 89
})

// Lista de usuarios (expandida para demostrar paginación)
const users = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+504 9999-1111',
    role: 'usuario',
    status: 'activo',
    city: 'Tegucigalpa',
    referrals: 5,
    credits: 1250.50,
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2024-12-18T08:45:00Z'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+504 9999-2222',
    role: 'tecnico',
    status: 'activo',
    city: 'San Pedro Sula',
    rating: 4.8,
    createdAt: '2024-02-20T14:20:00Z',
    lastLogin: '2024-12-18T07:30:00Z'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    phone: '+504 9999-3333',
    role: 'admin',
    status: 'activo',
    city: 'Tegucigalpa',
    createdAt: '2024-01-10T09:15:00Z',
    lastLogin: '2024-12-18T09:00:00Z'
  },
  {
    id: 4,
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@email.com',
    phone: '+504 9999-4444',
    role: 'usuario',
    status: 'deshabilitado',
    city: 'La Ceiba',
    referrals: 2,
    credits: 450.00,
    createdAt: '2024-03-05T16:45:00Z',
    lastLogin: '2024-12-15T10:20:00Z'
  },
  {
    id: 5,
    name: 'Luis Martínez',
    email: 'luis.martinez@email.com',
    phone: '+504 9999-5555',
    role: 'tecnico',
    status: 'deshabilitado',
    city: 'Tegucigalpa',
    rating: 4.2,
    createdAt: '2024-02-28T11:30:00Z',
    lastLogin: '2024-12-14T15:10:00Z'
  },
  {
    id: 6,
    name: 'Sofia Hernández',
    email: 'sofia.hernandez@email.com',
    phone: '+504 9999-6666',
    role: 'usuario',
    status: 'activo',
    city: 'San Pedro Sula',
    referrals: 8,
    credits: 2150.75,
    createdAt: '2024-04-12T13:25:00Z',
    lastLogin: '2024-12-18T06:50:00Z'
  },
  // Agregar más usuarios para demostrar paginación
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 7,
    name: `Usuario ${i + 7}`,
    email: `usuario${i + 7}@email.com`,
    phone: `+504 9999-${String(i + 7).padStart(4, '0')}`,
    role: ['usuario', 'tecnico', 'admin'][Math.floor(Math.random() * 3)],
    status: ['activo', 'deshabilitado'][Math.floor(Math.random() * 2)],
    city: ['Tegucigalpa', 'San Pedro Sula', 'La Ceiba'][Math.floor(Math.random() * 3)],
    referrals: Math.floor(Math.random() * 10),
    credits: Math.floor(Math.random() * 3000) + 100,
    rating: 4 + Math.random(),
    createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    lastLogin: new Date().toISOString()
  }))
])

// Formulario de usuario
const userForm = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  role: '',
  status: ''
})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== COMPUTED PROPERTIES =====
const totalUsers = computed(() => users.value.length)

// Filtros por tipo de usuario
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = searchQuery.value === '' || 
                         user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    const matchesCity = !selectedCity.value || user.city === selectedCity.value
    const isUser = user.role === 'usuario'
    
    return matchesSearch && matchesStatus && matchesCity && isUser
  })
})

const filteredTechnicians = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = searchQuery.value === '' || 
                         user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    const matchesCity = !selectedCity.value || user.city === selectedCity.value
    const isTechnician = user.role === 'tecnico'
    
    return matchesSearch && matchesStatus && matchesCity && isTechnician
  })
})

const filteredAdmins = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = searchQuery.value === '' || 
                         user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    const isAdmin = user.role === 'admin'
    
    return matchesSearch && matchesStatus && isAdmin
  })
})

// Paginación principal
const paginatedUsers = computed(() => {
  const start = (usersCurrentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const paginatedTechnicians = computed(() => {
  const start = (techniciansCurrentPage.value - 1) * techniciansItemsPerPage
  const end = start + techniciansItemsPerPage
  return filteredTechnicians.value.slice(start, end)
})

const paginatedAdmins = computed(() => {
  const start = (adminsCurrentPage.value - 1) * adminsItemsPerPage
  const end = start + adminsItemsPerPage
  return filteredAdmins.value.slice(start, end)
})

// Stats paginación principal
const usersTotalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))
const techniciansTotalPages = computed(() => Math.ceil(filteredTechnicians.value.length / techniciansItemsPerPage))
const adminsTotalPages = computed(() => Math.ceil(filteredAdmins.value.length / adminsItemsPerPage))

const usersStartItem = computed(() => (usersCurrentPage.value - 1) * itemsPerPage + 1)
const usersEndItem = computed(() => Math.min(usersCurrentPage.value * itemsPerPage, filteredUsers.value.length))

const techniciansStartItem = computed(() => (techniciansCurrentPage.value - 1) * techniciansItemsPerPage + 1)
const techniciansEndItem = computed(() => Math.min(techniciansCurrentPage.value * techniciansItemsPerPage, filteredTechnicians.value.length))

const adminsStartItem = computed(() => (adminsCurrentPage.value - 1) * adminsItemsPerPage + 1)
const adminsEndItem = computed(() => Math.min(adminsCurrentPage.value * adminsItemsPerPage, filteredAdmins.value.length))

// Top users
const topCreditUsers = computed(() => {
  return users.value
    .filter(user => user.role === 'usuario' && user.credits > 0)
    .sort((a, b) => b.credits - a.credits)
    .slice(0, 5)
})

const topReferralUsers = computed(() => {
  return users.value
    .filter(user => user.role === 'usuario' && user.referrals > 0)
    .sort((a, b) => b.referrals - a.referrals)
    .slice(0, 5)
})

// Filtros modales
const filteredReferrals = computed(() => {
  if (!referralsFilterMonth.value) return userReferrals.value
  
  return userReferrals.value.filter(referral => {
    const referralDate = new Date(referral.createdAt)
    const referralMonth = `${referralDate.getFullYear()}-${String(referralDate.getMonth() + 1).padStart(2, '0')}`
    return referralMonth === referralsFilterMonth.value
  })
})

const filteredCredits = computed(() => {
  if (!creditsFilterMonth.value) return userCreditHistory.value
  
  return userCreditHistory.value.filter(credit => {
    const creditMonth = new Date(credit.date).toISOString().slice(0, 7)
    return creditMonth === creditsFilterMonth.value
  })
})

// Paginación modales
const paginatedReferrals = computed(() => {
  const start = (referralsCurrentPage.value - 1) * modalItemsPerPage
  const end = start + modalItemsPerPage
  return filteredReferrals.value.slice(start, end)
})

const paginatedCredits = computed(() => {
  const start = (creditsCurrentPage.value - 1) * modalItemsPerPage
  const end = start + modalItemsPerPage
  return filteredCredits.value.slice(start, end)
})

const paginatedServices = computed(() => {
  const start = (servicesCurrentPage.value - 1) * modalItemsPerPage
  const end = start + modalItemsPerPage
  return userServiceHistory.value.slice(start, end)
})

// Stats paginación modales
const referralsTotalPages = computed(() => Math.ceil(filteredReferrals.value.length / modalItemsPerPage))
const creditsTotalPages = computed(() => Math.ceil(filteredCredits.value.length / modalItemsPerPage))
const servicesTotalPages = computed(() => Math.ceil(userServiceHistory.value.length / modalItemsPerPage))

const referralsStartItem = computed(() => (referralsCurrentPage.value - 1) * modalItemsPerPage + 1)
const referralsEndItem = computed(() => Math.min(referralsCurrentPage.value * modalItemsPerPage, filteredReferrals.value.length))

const creditsStartItem = computed(() => (creditsCurrentPage.value - 1) * modalItemsPerPage + 1)
const creditsEndItem = computed(() => Math.min(creditsCurrentPage.value * modalItemsPerPage, filteredCredits.value.length))

const servicesStartItem = computed(() => (servicesCurrentPage.value - 1) * modalItemsPerPage + 1)
const servicesEndItem = computed(() => Math.min(servicesCurrentPage.value * modalItemsPerPage, userServiceHistory.value.length))

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || selectedStatus.value !== '' || selectedCity.value !== ''
})

const availableCities = computed(() => {
  const cities = new Set()
  users.value.forEach(user => {
    if (user.city) cities.add(user.city)
  })
  return Array.from(cities).sort()
})

// ===== FUNCIONES DE UTILIDAD =====
// Validar si las contraseñas coinciden
const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value;
});

// Actualizar la contraseña del usuario
const updateUserPassword = async () => {
  try {
    isUpdatingPassword.value = true;
    
    // Validar que las contraseñas coincidan
    if (newPassword.value !== confirmPassword.value) {
      showError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar longitud mínima de la contraseña
    if (newPassword.value.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Llamar a la API para actualizar la contraseña
    await $fetch(`/api/usuarios/${userForm.id_usuario}/cambiar-clave`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        nuevaClave: newPassword.value
      }
    });
    
    // Mostrar mensaje de éxito
    showSuccess('Contraseña actualizada correctamente');
    
    // Cerrar el modal y limpiar los campos
    showPasswordModal.value = false;
    newPassword.value = '';
    confirmPassword.value = '';
    
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    const errorMessage = error.data?.message || 'Error al actualizar la contraseña';
    showError(errorMessage);
  } finally {
    isUpdatingPassword.value = false;
  }
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0.00'
  return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDate = (dateString) => {
  if (!dateString) return 'Nunca'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

const formatLastLogin = (dateString) => {
  if (!dateString) return 'Nunca'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Hoy'
  if (diffDays === 2) return 'Ayer'
  if (diffDays <= 7) return `${diffDays}d`
  
  return formatDate(dateString)
}

const getStatusColor = (status) => {
  const colors = {
    activo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    deshabilitado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    activo: 'Activo',
    deshabilitado: 'Deshabilitado'
  }
  return texts[status] || 'Desconocido'
}

const truncateName = (name) => {
  if (!name) return '';
  return name.length > 12 ? name.substring(0, 12) + '...' : name;
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

const resetUserForm = () => {
  userForm.value = {
    id_usuario: null,
    id_ciudad: '',
    id_rol: '',
    nombre: '',
    identidad: '',
    email: '',
    telefono: '',
    estado: 'activo'
  }
}

// ===== FUNCIONES DE PAGINACIÓN =====
const changeReferralsPage = (page) => {
  if (page < 1 || page > referralsTotalPages.value) return
  referralsCurrentPage.value = page
}

const changeCreditsPage = (page) => {
  if (page < 1 || page > creditsTotalPages.value) return
  creditsCurrentPage.value = page
}

const changeServicesPage = (page) => {
  if (page < 1 || page > servicesTotalPages.value) return
  servicesCurrentPage.value = page
}

// Métodos para manejar los filtros
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedCity.value = ''
  currentPage.value = 1
}



const filterReferrals = () => {
  referralsCurrentPage.value = 1
}

const filterCredits = () => {
  creditsCurrentPage.value = 1
}

// ===== FUNCIONES DE MODALES =====
const closeModal = () => {
  showEditModal.value = false
  resetUserForm()
}

const showReferrals = (user) => {
  selectedUser.value = user
  referralsCurrentPage.value = 1
  // No establecer un mes por defecto
  // Mock data for referrals - generamos más datos para probar la paginación
  const referralsCount = user.referrals || 0
  const totalItems = referralsCount > 0 ? Math.max(12, referralsCount) : 0 // Mínimo 12 ítems para probar paginación
  
  userReferrals.value = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
    name: `Referido ${i + 1}`,
    email: `referido${i + 1}@ejemplo.com`,
    status: Math.random() > 0.3 ? 'Activo' : 'Inactivo',
    createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
  }))
  showReferralsModal.value = true
}

const showCredits = (user) => {
  selectedUser.value = user
  creditsCurrentPage.value = 1
  // No establecer un mes por defecto
  // Mock data for credit history - generamos más datos para probar la paginación
  userCreditHistory.value = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    description: `Transacción ${i + 1}`,
    amount: Math.floor(Math.random() * 500) + 50,
    type: Math.random() > 0.5 ? 'credit' : 'debit',
    status: ['Completado', 'Pendiente', 'Rechazado'][Math.floor(Math.random() * 3)],
    reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
  }))
  showCreditsModal.value = true
}

const showServiceHistory = (user) => {
  selectedUser.value = user
  servicesCurrentPage.value = 1
  // Ya no es necesario actualizar servicesFilterDate aquí porque se inicializa con la fecha actual
  // Mock data for service history - generamos más datos para probar la paginación
  const serviceTypes = ['Limpieza', 'Mantenimiento', 'Reparación', 'Instalación', 'Revisión']
  userServiceHistory.value = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `${serviceTypes[Math.floor(Math.random() * serviceTypes.length)]} ${i + 1}`,
    status: Math.random() > 0.3 ? 'Completado' : 'Pendiente',
    amount: Math.floor(Math.random() * 800) + 100,
    technician: `Técnico ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
  }))
  showServiceHistoryModal.value = true
}

// Variables para el modal de comentario
const showCommentModal = ref(false)
const currentComment = ref('')
const currentRating = ref('')
const currentClient = ref('')

// Mostrar modal de comentario
const showComment = (comment, rating, client) => {
  currentComment.value = comment
  currentRating.value = rating
  currentClient.value = client
  showCommentModal.value = true
}

const showTechnicianServices = (technician) => {
  selectedUser.value = technician
  servicesCurrentPage.value = 1
  // Mock data for service history - generamos más datos para probar la paginación
  const serviceTypes = ['Limpieza', 'Mantenimiento', 'Reparación', 'Instalación', 'Revisión']
  const comments = [
    'Excelente servicio, muy profesional',
    'Buen trabajo, cumplió con lo acordado',
    'Podría mejorar la puntualidad',
    'Muy satisfecho con el resultado',
    'El técnico fue muy amable y eficiente'
  ]
  userServiceHistory.value = Array.from({ length: 18 }, (_, i) => {
    const status = Math.random() > 0.3 ? 'Completado' : 'Pendiente'
    const isCompleted = status === 'Completado'
    const clientName = `Cliente ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`
    const hasComment = isCompleted && Math.random() > 0.5
    
    return {
      id: i + 1,
      name: `${serviceTypes[Math.floor(Math.random() * serviceTypes.length)]} ${i + 1}`,
      status: status,
      amount: Math.floor(Math.random() * 800) + 100,
      // Mostrar el nombre del técnico
      technician: technician.name || 'Técnico no especificado',
      // Solo agregar calificación si el servicio está completado
      ...(isCompleted && { 
        rating: (Math.random() * 2 + 3).toFixed(1), // Calificación entre 3.0 y 5.0
        ...(hasComment && { comment: comments[Math.floor(Math.random() * comments.length)] })
      }),
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      // Mostrar el nombre del cliente como usuario del servicio
      user: clientName
    }
  })
  showServiceHistoryModal.value = true
}

const showTopCredits = () => {
  showTopCreditsModal.value = true
}

const showTopReferrals = () => {
  showTopReferralsModal.value = true
}

const showTopBalances = () => {
  showTopBalancesModal.value = true
}

const showTopRatings = () => {
  showTopRatingsModal.value = true
}

// ===== FUNCIONES DE ACCIONES =====
const editUser = (user) => {
  // Mapear los campos del usuario al formulario
  userForm.value = {
    id_usuario: user.id_usuario || user.id,
    id_ciudad: user.id_ciudad || '',
    id_rol: user.id_rol || (user.role === 'admin' ? '1' : user.role === 'tecnico' ? '2' : '3'),
    nombre: user.nombre || user.name || '',
    identidad: user.identidad || '',
    email: user.email || '',
    telefono: user.telefono || user.phone || '',
    estado: user.estado || user.status || 'activo'
  }
  showEditModal.value = true
}

const saveUser = async () => {
  // Validar campos requeridos
  if (!userForm.value.nombre || !userForm.value.email || !userForm.value.id_rol || !userForm.value.estado) {
    showError('Por favor completa todos los campos requeridos')
    return
  }

  try {
    isSaving.value = true
    
    // Preparar los datos para la API
    const userData = {
      id_usuario: userForm.value.id_usuario,
      id_ciudad: parseInt(userForm.value.id_ciudad),
      id_rol: parseInt(userForm.value.id_rol),
      nombre: userForm.value.nombre.trim(),
      identidad: userForm.value.identidad.trim(),
      email: userForm.value.email.trim().toLowerCase(),
      telefono: userForm.value.telefono.trim(),
      estado: userForm.value.estado
    }

    // Determinar si es creación o actualización
    const isNewUser = !userData.id_usuario
    const url = isNewUser 
      ? '/api/usuarios'
      : `/api/usuarios/${userData.id_usuario}`
    const method = isNewUser ? 'POST' : 'PUT'

    // Llamada a la API
    const response = await $fetch(url, {
      baseURL: config.public.apiBase,
      method,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: userData
    })

    // Actualizar la lista de usuarios
    await refreshUsers()
    
    showSuccess(`Usuario ${userData.nombre} ${isNewUser ? 'creado' : 'actualizado'} correctamente`)
    closeModal()
    
  } catch (error) {
    console.error('Error al guardar el usuario:', error)
    const errorMessage = error.data?.message || 'Error al guardar el usuario'
    showError(errorMessage)
  } finally {
    isSaving.value = false
  }
}

const refreshUsers = async () => {
  try {
    // Simular recarga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    showSuccess('Lista de usuarios actualizada')
  } catch (error) {
    showError('Error al actualizar la lista')
  }
}

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    showError('Error al cargar la lista de usuarios')
  } finally {
    isLoading.value = false
  }
})

</script>

<style scoped>
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

button, input, textarea, select {
  min-height: 36px;
}

input, textarea, select {
  font-size: 14px;
}

@media (min-width: 640px) {
  button, input, textarea, select {
    min-height: 44px;
  }

  input, textarea, select {
    font-size: 16px;
  }
}
</style> 