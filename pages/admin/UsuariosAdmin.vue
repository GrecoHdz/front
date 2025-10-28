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
                        class="w-full pl-8 pr-8 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                        :disabled="isSearching"
                      >
                      <div v-if="isSearching" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
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
                        :options="availableCities.map(city => ({ value: city.nombre_ciudad, label: city.nombre_ciudad }))"
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
                    👤 Usuarios ({{ totalUsers }})
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

                <!-- Loading State for Users -->
                <div v-if="loadingUsers" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Cargando usuarios...</p>
                </div>

                <!-- Empty State -->
                <div v-else-if="users.length === 0" class="text-center py-6">
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
                      v-for="user in users" 
                      :key="user.id_usuario"
                      @click="editUser(user)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': user.estado === 'deshabilitado',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': user.estado === 'activo'
                      }"
                    >
                      <!-- User Header -->
                      <div class="flex items-start justify-between w-full">
                        <div class="flex items-center space-x-2">
                          <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                               :class="user.estado === 'deshabilitado' ? 'bg-red-500' : 'bg-green-500'">
                            {{ getUserInitial(user.nombre) }}
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-[10px] sm:text-xs font-bold text-gray-900 dark:text-white truncate max-w-[90px] sm:max-w-[120px] mb-0.5">
                              {{ truncateName(user.nombre) }}
                            </h3>
                            <div class="flex">
                              <span class="text-[7px] px-1.5 py-0.5 rounded-full font-medium"
                                    :class="user.estado === 'deshabilitado' 
                                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'">
                                {{ getStatusText(user.estado) }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="showServiceHistory(user)"
                            class="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': user.estado === 'deshabilitado',
                              'text-gray-400 hover:text-blue-500': user.estado === 'activo'
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
                              'text-red-400 hover:text-red-500': user.estado === 'deshabilitado',
                              'text-gray-400 hover:text-blue-500': user.estado === 'activo'
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
                            @click.stop="user.total_referidos > 0 ? showReferrals(user) : null"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': user.total_referidos > 0,
                              'bg-red-50 dark:bg-red-900/20': user.estado === 'deshabilitado',
                              'bg-gray-50 dark:bg-gray-700/50': user.estado === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Referidos</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span 
                                class="text-xs font-medium"
                                :class="user.estado === 'deshabilitado' ? 'text-red-500 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'"
                              >
                                {{ user.total_referidos || 0 }}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Créditos -->
                          <div 
                            @click.stop="(user.credito?.monto || 0) > 0 ? showCredits(user) : null"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': (user.credito?.monto || 0) > 0,
                              'bg-red-50 dark:bg-red-900/20': user.estado === 'deshabilitado',
                              'bg-gray-50 dark:bg-gray-700/50': user.estado === 'activo'
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Créditos</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="user.estado === 'deshabilitado' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                L {{ formatCompactCurrency(user.credito?.monto || 0) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Paginación Usuarios -->
                  <div v-if="totalUsers > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        Página {{ usersCurrentPage }} de {{ usersTotalPages }}
                      </div>
                      <div class="flex items-center space-x-1">
                        <button 
                          @click="loadUsers(usersCurrentPage - 1)" 
                          :disabled="usersCurrentPage === 1 || loadingMoreUsers"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          :class="{ 'cursor-not-allowed': usersCurrentPage === 1 }"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                          {{ usersCurrentPage }} / {{ usersTotalPages }}
                        </span>
                        <button 
                          @click="loadUsers(usersCurrentPage + 1)" 
                          :disabled="!hasMoreUsers || loadingMoreUsers"
                          class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          :class="{ 'cursor-not-allowed': !hasMoreUsers }"
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

            <!-- Técnicos Section -->
            <section class="px-3 sm:px-6 mb-3 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div class="flex items-center justify-between mb-3">
                  <h2 class="text-sm sm:text-xl font-black text-gray-900 dark:text-white flex items-center">
                    🔧 Técnicos ({{ totalTechnicians }})
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

                <!-- Loading State -->
                <div v-if="loadingTechnicians" class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">Cargando técnicos...</p>
                </div>

                <!-- Technicians Grid -->
                <div v-else>
                  <div v-if="technicians.length > 0" class="grid grid-cols-2 gap-1.5 sm:gap-2">
                    <div 
                      v-for="technician in technicians" 
                      :key="technician.id_usuario"
                      @click="editUser(technician)"
                      class="group rounded-lg p-2 transition-all duration-200 cursor-pointer border"
                      :class="{
                        'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50': technician.estado === 'inactivo' || technician.estado === 'deshabilitado',
                        'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md': technician.estado === 'activo',
                        'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50': !technician.estado
                      }"
                    >
                      <!-- Header -->
                      <div class="flex items-start justify-between">
                        <div class="flex items-center space-x-2">
                          <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm"
                               :class="technician.estado === 'inactivo' || technician.estado === 'deshabilitado' ? 'bg-red-500' : 'bg-blue-500'">
                            <span>🔧</span>
                          </div>
                          <div class="min-w-0">
                            <h3 class="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[100px] sm:max-w-[120px]">
                              {{ technician.nombre || 'Técnico sin nombre' }}
                            </h3>
                            <div class="flex items-center space-x-1">
                              <span 
                                class="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                                :class="getStatusColor(technician.estado || 'activo')"
                              >
                                {{ getStatusText(technician.estado || 'activo') }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="flex items-center space-x-1">
                          <button 
                            @click.stop="editUser(technician)"
                            class="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            :class="{
                              'text-red-400 hover:text-red-500': technician.estado === 'inactivo',
                              'text-gray-400 hover:text-blue-500': technician.estado === 'activo' || !technician.estado
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
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': true,
                              'bg-red-50 dark:bg-red-900/20': technician.estado === 'inactivo',
                              'bg-gray-50 dark:bg-gray-700/50': technician.estado === 'activo' || !technician.estado
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[10px] text-gray-500 dark:text-gray-400">Ver Saldo</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="technician.estado === 'inactivo' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                                L {{ formatCompactCurrency(technician.saldo || 0) }}
                              </span>
                            </div>
                          </div>
                          
                          <!-- Calificaciones -->
                          <div 
                            @click.stop="showTechnicianServices(technician)"
                            :class="{
                              'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30': true,
                              'bg-red-50 dark:bg-red-900/20': technician.estado === 'inactivo',
                              'bg-gray-50 dark:bg-gray-700/50': technician.estado === 'activo' || !technician.estado
                            }"
                            class="rounded-lg p-1 text-center transition-colors"
                          >
                            <div class="text-[9px] text-gray-500 dark:text-gray-400">Ver Servicios</div>
                            <div class="flex items-center justify-center space-x-1">
                              <span class="text-xs font-medium"
                                    :class="technician.estado === 'inactivo' ? 'text-red-500 dark:text-red-400' : 'text-yellow-500 dark:text-yellow-400'">
                                ⭐ {{ (technician.promedio_calificacion || 0).toFixed(1) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <!-- Paginación Técnicos -->
                  <div v-if="totalTechnicians > 0" class="mt-3">
                    <div v-if="techniciansTotalPages > 1" class="flex items-center justify-between px-1">
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ (techniciansCurrentPage - 1) * techniciansPerPage + 1 }}-{{ Math.min(techniciansCurrentPage * techniciansPerPage, totalTechnicians) }} de {{ totalTechnicians }}
                      </div>
                      <div class="flex space-x-1">
                        <button 
                          @click="changeTechniciansPage(techniciansCurrentPage - 1)" 
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
                          @click="changeTechniciansPage(techniciansCurrentPage + 1)" 
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
                    <p class="text-gray-600 dark:text-gray-400 text-xs">
                      {{ searchQuery ? 'Intenta ajustar tus filtros de búsqueda' : 'No hay técnicos registrados' }}
                    </p>
                  </div>
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
                  <div v-for="admin in paginatedAdmins" :key="admin.id_usuario"
                       class="bg-purple-50 dark:bg-purple-900/20 rounded-md p-1.5 border border-purple-200 dark:border-purple-700">
                    <div>
                      <p class="text-[10px] font-medium text-gray-900 dark:text-white truncate">{{ admin.nombre }}</p>
                      <p class="text-[9px] text-gray-600 dark:text-gray-400 truncate">{{ admin.email || 'Sin correo' }}</p>
                      <p class="text-[9px] text-gray-600 dark:text-gray-400 truncate">{{ admin.telefono || 'Sin teléfono' }}</p>
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
                    {{ userForm.ciudad?.nombre_ciudad || 'No especificada' }}
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
                      v-model="userForm.rol"
                      :options="roles"
                      :searchable="false"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Seleccionar rol"
                      label="nombre_rol"
                      track-by="id_rol"
                      class="multiselect-custom"
                      :class="{ 'multiselect--active': userForm.rol }"
                      :select-label="''"
                      :deselect-label="''"
                      :selected-label="''"
                      :no-options="loadingRoles ? 'Cargando roles...' : 'No hay roles disponibles'"
                      :no-result="'No se encontraron resultados'"
                      :loading="loadingRoles"
                      :disabled="loadingRoles || !roles.length"
                      :custom-label="getRoleLabel"
                      @search-change="$event && $event.stopPropagation()"
                      @search-focus="(e) => e && e.target && e.target.blur()"
                      @touchstart.native.stop
                      @click.native.stop
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-xs truncate">{{ getRoleLabel(option) }}</span>
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
                        { value: 'inactivo', label: 'Inactivo' },
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
                      :custom-label="getStatusLabel"
                      @search-change="$event && $event.stopPropagation()"
                      @search-focus="(e) => e && e.target && e.target.blur()"
                      @touchstart.native.stop
                      @click.native.stop
                      :options-limit="100"
                    >
                      <template #singleLabel="{ option }">
                        <span class="text-xs truncate">{{ getStatusLabel(option) }}</span>
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
              <div v-for="(user, index) in topBalances" :key="index" class="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ user.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ user.city }}</p>
                    </div>
                  </div>
                  <p class="text-sm font-bold text-green-600 dark:text-green-400">L. {{ formatCurrency(user.balance) }}</p>
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
              <div v-for="(user, index) in topReferrals" :key="index" class="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ user.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ user.city }}</p>
                    </div>
                  </div>
                  <p class="text-sm font-bold text-blue-600 dark:text-blue-400">{{ user.total }}</p>
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
              <h3 class="text-sm font-black text-gray-900 dark:text-white">👥 Referidos de {{ selectedUser?.nombre }}</h3>
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
              <h3 class="text-sm font-black text-gray-900 dark:text-white">💰 Créditos de {{ selectedUser?.nombre }}</h3>
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
                <p class="text-sm font-bold text-green-600 dark:text-green-400">L. {{ formatCurrency(selectedUser?.credito?.monto || 0) }}</p>
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
                {{ selectedUser?.nombre }}
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
                <h3 class="text-sm font-black text-gray-900 dark:text-white">🏆 Top 5 Técnicos con Más Crédito</h3>
                <button @click="showTopBalancesModal = false" class="text-gray-400 hover:text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <!-- Loading State -->
              <div v-if="isLoadingTopBalances" class="flex justify-center items-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
              
              <!-- Empty State -->
              <div v-else-if="topBalances.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
                No hay técnicos con crédito disponible
              </div>
              
              <!-- Data -->
              <div v-else class="space-y-2">
                <div v-for="(tech, index) in topBalances" :key="tech.id" class="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white text-xs">{{ tech.name }}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-400">{{ tech.city || 'Sin ciudad' }}</p>
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
            <div v-if="isLoadingTopRatings" class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
            <div v-else-if="topRatings.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              No hay técnicos calificados aún
            </div>
            <div v-else class="space-y-2">
              <div v-for="(tech, index) in topRatings" :key="tech.id" class="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <span class="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{{ index + 1 }}</span>
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-xs">{{ tech.name }}</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">{{ tech.city }}</p>
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { debounce } from 'lodash'
import Multiselect from 'vue-multiselect'
import { useHead, useCookie } from '#imports'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// ===== CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()
const userCookie = useCookie('user')
const router = useRouter()
const route = useRoute()

// SEO y Meta
useHead({
  title: 'HogarSeguro - Gestión de Usuarios',
  meta: [
    { name: 'description', content: 'Gestión de usuarios del sistema HogarSeguro - Administrar usuarios, técnicos y administradores' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const loadingUsers = ref(false)
const loadingMoreUsers = ref(false)
const loadingTechnicians = ref(false)
const loadingRoles = ref(false)
const loadingCities = ref(false)
const isSaving = ref(false)

// Datos
const users = ref([])
const technicians = ref([])
const roles = ref([])
const availableCities = ref([])
const cities = ref([])
const hasMoreUsers = ref(false) 


// Modales
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const showReferralsModal = ref(false)
const showCreditsModal = ref(false)
const showServiceHistoryModal = ref(false)
const showCommentModal = ref(false)
const showTopCreditsModal = ref(false)
const showTopReferralsModal = ref(false)
const showTopBalancesModal = ref(false)
const showTopRatingsModal = ref(false)

// ===== VARIABLES DE PAGINACIÓN =====
const itemsPerPage = 6
const techniciansPerPage = ref(6)
const adminsItemsPerPage = 6
const modalItemsPerPage = 5

// Cache para almacenar páginas ya cargadas (incluye filtros en la clave)
const usersCache = {}

// Paginación principal
const usersCurrentPage = ref(1)
const techniciansCurrentPage = ref(1)
const adminsCurrentPage = ref(1)
const totalUsers = ref(0)
const totalTechnicians = ref(0)

// Paginación modales
const referralsCurrentPage = ref(1)
const creditsCurrentPage = ref(1)
const servicesCurrentPage = ref(1)

// ===== VARIABLES DE FILTROS =====
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const selectedStatus = ref('')
const selectedCity = ref('')
const isSearching = ref(false)


// Configurar el watch para searchQuery con debounce
const debouncedSearch = debounce(async (newVal) => {
  isSearching.value = true
  try {
    debouncedSearchQuery.value = newVal
    // Reiniciar a la primera página al buscar
    usersCurrentPage.value = 1
    // Limpiar caché para forzar recarga
    Object.keys(usersCache).forEach(key => delete usersCache[key])
    // Cargar usuarios con el nuevo término de búsqueda
    await loadUsers(1)
  } finally {
    isSearching.value = false
  }
}, 1000) // 1 segundo de debounce

// Opciones de filtros
const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'deshabilitado', label: 'Deshabilitado' }
]

// ===== VARIABLES DE DATOS TEMPORALES =====
const selectedUser = ref(null)
const userReferrals = ref([])
const userCreditHistory = ref([])
const userServiceHistory = ref([])

// Variables para tops
const topBalances = ref([])
const topReferrals = ref([])
const topRatings = ref([])
const isLoadingTopBalances = ref(false)
const isLoadingTopReferrals = ref(false)
const isLoadingTopRatings = ref(false)

// Variables para el formulario de usuario
const userForm = ref({
  id_usuario: null,
  id_ciudad: null,
  id_rol: null,
  rol: null,
  nombre: '',
  identidad: '',
  email: '',
  telefono: '',
  estado: 'activo',
  ciudad: null
})

// Variables para cambio de contraseña
const newPassword = ref('')
const confirmPassword = ref('')

// Variables para filtros de modales
const referralsFilterMonth = ref('')
const creditsFilterMonth = ref('')
const servicesFilterDate = ref('')

// Variables para comentarios
const currentComment = ref('')
const currentRating = ref('')
const currentClient = ref('')

// Variables para estadísticas
const stats = ref({
  totalCredits: 0,
  totalReferrals: 0
})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== WATCHER PARA REINICIAR PAGINACIÓN AL CAMBIAR FILTROS =====
watch([selectedStatus, selectedCity], () => {
  usersCurrentPage.value = 1
  techniciansCurrentPage.value = 1
  adminsCurrentPage.value = 1
  
  // Limpiar cache cuando cambien los filtros
  Object.keys(usersCache).forEach(key => delete usersCache[key])
  
  // Recargar datos cuando cambien los filtros
  loadUsers(1)
  loadTechnicians(1)
})

// Watch para searchQuery que activa el debounce
watch(searchQuery, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    debouncedSearch(newVal)
  }
})

// ===== COMPUTED PROPERTIES =====
// Para administradores seguimos filtrando en frontend
const filteredAdmins = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = searchQuery.value === '' || 
                         user.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || !selectedStatus.value.value || user.estado === selectedStatus.value.value
    const isAdmin = user.rol?.nombre_rol?.toLowerCase() === 'admin'
    
    return matchesSearch && matchesStatus && isAdmin
  })
})

// Paginación principal - Los usuarios y técnicos ahora muestran lo que viene del backend
const paginatedAdmins = computed(() => {
  const start = (adminsCurrentPage.value - 1) * adminsItemsPerPage
  const end = start + adminsItemsPerPage
  return filteredAdmins.value.slice(start, end)
})

// Calcular el total de páginas
const usersTotalPages = computed(() => {
  if (hasMoreUsers.value) {
    return usersCurrentPage.value + 1
  }
  return Math.max(usersCurrentPage.value, 1)
})

const techniciansTotalPages = computed(() => Math.ceil(totalTechnicians.value / techniciansPerPage.value))
const adminsTotalPages = computed(() => Math.ceil(filteredAdmins.value.length / adminsItemsPerPage))

const adminsStartItem = computed(() => (adminsCurrentPage.value - 1) * adminsItemsPerPage + 1)
const adminsEndItem = computed(() => Math.min(adminsCurrentPage.value * adminsItemsPerPage, filteredAdmins.value.length))

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

// Validar si las contraseñas coinciden
const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value
})

// ===== FUNCIONES DE UTILIDAD =====
const getUserInitial = (name) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

const formatCompactCurrency = (value) => {
  if (!value) return '0'
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

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

const getStatusColor = (status) => {
  const colors = {
    activo: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    inactivo: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    deshabilitado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
}

const getStatusText = (status) => {
  const statusMap = {
    'activo': 'Activo',
    'inactivo': 'Inactivo',
    'deshabilitado': 'Deshabilitado'
  }
  return statusMap[status] || status
}

const getStatusLabel = (status) => {
  if (!status) return 'Estado'
  if (typeof status === 'string') {
    return getStatusText(status)
  }
  return status.label || getStatusText(status.value)
}

const getRoleLabel = (role) => {
  if (!role) return 'Seleccionar rol'
  if (typeof role === 'string') {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }
  return role.nombre_rol ? 
    role.nombre_rol.charAt(0).toUpperCase() + role.nombre_rol.slice(1) : 
    'Seleccionar rol'
}

const truncateName = (name) => {
  if (!name) return ''
  return name.length > 12 ? name.substring(0, 12) + '...' : name
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

const changeTechniciansPage = (page) => {
  if (page < 1 || page > techniciansTotalPages.value) return
  techniciansCurrentPage.value = page
  loadTechnicians(page)
}

// Métodos para manejar los filtros
const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedCity.value = ''
  usersCurrentPage.value = 1
  techniciansCurrentPage.value = 1
  adminsCurrentPage.value = 1
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
  showPasswordModal.value = false
  resetUserForm()
  newPassword.value = ''
  confirmPassword.value = ''
}

const showReferrals = (user) => {
  selectedUser.value = user
  referralsCurrentPage.value = 1
  
  // Mock data temporal - después conectar con API
  userReferrals.value = Array.from({ length: 12 }, (_, i) => ({
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
  
  // Mock data temporal - después conectar con API
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
  
  // Mock data temporal - después conectar con API
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

const showTechnicianServices = (technician) => {
  selectedUser.value = technician
  servicesCurrentPage.value = 1
  
  // Mock data temporal para servicios de técnico
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
      technician: technician.nombre || 'Técnico no especificado',
      ...(isCompleted && { 
        rating: (Math.random() * 2 + 3).toFixed(1),
        ...(hasComment && { comment: comments[Math.floor(Math.random() * comments.length)] })
      }),
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      user: clientName
    }
  })
  showServiceHistoryModal.value = true
}

const showComment = (comment, rating, client) => {
  currentComment.value = comment
  currentRating.value = rating
  currentClient.value = client
  showCommentModal.value = true
}

// ===== FUNCIONES PARA TOPS =====
const showTopCredits = async () => {
  try {
    isLoadingTopBalances.value = true
    showTopCreditsModal.value = true
    
    // Obtener el ID del rol de Usuario
    const rolesResponse = await $fetch('/roles', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    const rolUsuario = Array.isArray(rolesResponse) 
      ? rolesResponse.find(r => r.nombre_rol.toLowerCase() === 'usuario')
      : null
    
    if (!rolUsuario) {
      throw new Error('No se encontró el rol de Usuario')
    }
    
    const response = await $fetch('/credito/tops', {
      baseURL: config.public.apiBase,
      method: 'GET',
      params: {
        id_rol: rolUsuario.id_rol
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response && response.success) {
      topBalances.value = response.data.map(usuario => ({ 
        name: usuario.nombre || 'Usuario sin nombre',
        email: '', 
        city: usuario.ciudad || 'Sin ciudad',
        balance: parseFloat(usuario.monto_credito) || 0
      }))
    } else {
      showError(response?.error || 'No se pudieron cargar los usuarios con más crédito')
    }
  } catch (error) {
    console.error('Error al cargar los usuarios con más crédito:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los usuarios con más crédito'}`)
  } finally {
    isLoadingTopBalances.value = false
  }
}

const showTopReferrals = async () => {
  try {
    isLoadingTopReferrals.value = true
    showTopReferralsModal.value = true
    
    const response = await $fetch('/referidos/top/usuarios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response && response.success) {
      topReferrals.value = response.data.map(item => ({
        name: item.nombre,
        city: item.ciudad,
        total: item.cantidad_referidos,
        date: new Date(item.fecha).toLocaleDateString()
      }))
    } else {
      showError(response?.error || 'No se pudieron cargar los usuarios con más referidos')
    }
  } catch (error) {
    console.error('Error al cargar los usuarios con más referidos:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los usuarios con más referidos'}`)
  } finally {
    isLoadingTopReferrals.value = false
  }
}

const showTopBalances = async () => {
  try {
    isLoadingTopBalances.value = true
    showTopBalancesModal.value = true
    
    // Obtener el ID del rol de Técnico
    const rolesResponse = await $fetch('/roles', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    const rolTecnico = Array.isArray(rolesResponse) 
      ? rolesResponse.find(r => r.nombre_rol.toLowerCase() === 'tecnico')
      : null
    
    if (!rolTecnico) {
      throw new Error('No se encontró el rol de Técnico')
    }
    
    const response = await $fetch('/credito/tops', {
      baseURL: config.public.apiBase,
      method: 'GET',
      params: {
        id_rol: rolTecnico.id_rol
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response && response.success) {
      topBalances.value = response.data.map(tecnico => ({
        id: tecnico.nombre,
        name: tecnico.nombre,
        city: tecnico.ciudad,
        balance: parseFloat(tecnico.monto_credito) || 0
      }))
    } else {
      showError(response?.error || 'No se pudieron cargar los técnicos con más crédito')
    }
  } catch (error) {
    console.error('Error al cargar los técnicos con más crédito:', error)
    showError(`Error: ${error.message || 'No se pudieron cargar los técnicos con más crédito'}`)
  } finally {
    isLoadingTopBalances.value = false
  }
}

const showTopRatings = async () => {
  try {
    isLoadingTopRatings.value = true
    showTopRatingsModal.value = true
    
    const response = await $fetch('/calificaciones/top-tecnicos', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.success) {
      topRatings.value = response.data.map(tecnico => ({
        id: tecnico.id_usuario,
        name: tecnico.nombre,
        city: tecnico.ciudad,
        rating: parseFloat(tecnico.promedio_calificacion),
        reviews: tecnico.total_calificaciones
      }))
    } else {
      showError('No se pudieron cargar los técnicos mejor calificados')
    }
  } catch (error) {
    console.error('Error al obtener los técnicos mejor calificados:', error)
    showError('Error al cargar los técnicos mejor calificados')
  } finally {
    isLoadingTopRatings.value = false
  }
}

// ===== FUNCIONES DE ACCIONES =====
const editUser = (user) => {
  // Mapear los campos del usuario al formulario
  userForm.value = {
    id_usuario: user.id_usuario || user.id,
    id_ciudad: user.id_ciudad || null,
    id_rol: user.id_rol || (user.rol ? user.rol.id_rol : null),
    rol: user.rol || roles.value.find(r => r.id_rol === (user.id_rol || user.rol?.id_rol)) || null,
    nombre: user.nombre || user.name || '',
    identidad: user.identidad || '',
    email: user.email || '',
    telefono: user.telefono || user.phone || '',
    estado: user.estado || user.status || 'activo',
    ciudad: user.ciudad || null
  }
  
  showEditModal.value = true
}

const saveUser = async () => {
  // Validar campos requeridos
  if (!userForm.value.nombre || !userForm.value.email) {
    showError('Por favor completa todos los campos requeridos')
    return
  }

  // Validar que se haya seleccionado un rol
  if (!userForm.value.rol || !userForm.value.rol.id_rol) {
    showError('Por favor selecciona un rol')
    return
  }

  // Validar que se haya seleccionado un estado
  if (!userForm.value.estado) {
    showError('Por favor selecciona un estado')
    return
  }

  try {
    isSaving.value = true
    
    // Preparar los datos para la API
    const userData = { 
      id_rol: parseInt(userForm.value.rol.id_rol), 
      estado: typeof userForm.value.estado === 'object' ? userForm.value.estado.value : userForm.value.estado
    }

    // Llamada a la API para actualizar el usuario
    const response = await $fetch(`usuarios/${userForm.value.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: userData
    })

    // Recargar datos
    await Promise.all([
      loadUsers(),
      loadTechnicians()
    ])
    
    showSuccess(`Usuario actualizado correctamente`)
    closeModal()
    
  } catch (error) {
    console.error('Error al actualizar el usuario:', error)
    const errorMessage = error.data?.message || 'Error al actualizar el usuario'
    showError(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// Actualizar la contraseña del usuario
const updateUserPassword = async () => {
  try {
    isSaving.value = true
    
    // Validar que las contraseñas coincidan
    if (newPassword.value !== confirmPassword.value) {
      showError('Las contraseñas no coinciden')
      return
    }
    
    // Validar longitud mínima de la contraseña
    if (newPassword.value.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    // Llamar a la API para actualizar la contraseña
    await $fetch(`usuarios/${userForm.value.id_usuario}/cambiar-clave`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        nuevaClave: newPassword.value
      }
    })
    
    // Mostrar mensaje de éxito
    showSuccess('Contraseña actualizada correctamente')
    
    // Cerrar el modal y limpiar los campos
    showPasswordModal.value = false
    newPassword.value = ''
    confirmPassword.value = ''
    
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error)
    const errorMessage = error.data?.message || 'Error al actualizar la contraseña'
    showError(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// ===== FUNCIONES PARA CARGAR DATOS DE APIS =====
// Función para cargar roles desde la API
const loadRoles = async () => {
  try {
    loadingRoles.value = true
    const response = await $fetch('/roles', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    roles.value = Array.isArray(response) ? response : []
    return roles.value
  } catch (error) {
    console.error('Error al cargar roles:', error)
    showError('No se pudieron cargar los roles')
    roles.value = []
    return []
  } finally {
    loadingRoles.value = false
  }
}

// Función para cargar usuarios desde la API con filtros aplicados en backend
const loadUsers = async (page = 1) => {
  try {
    loadingUsers.value = true
    
    // Generar clave de caché que incluya filtros
    const filtersKey = JSON.stringify({
      search: debouncedSearchQuery.value,
      status: selectedStatus.value?.value || '',
      city: selectedCity.value?.value || ''
    })
    const cacheKey = `${page}_${filtersKey}`
    
    // Verificar si ya tenemos la página con estos filtros en caché
    if (usersCache[cacheKey]) {
      const cachedData = usersCache[cacheKey]
      users.value = cachedData.usuarios
      hasMoreUsers.value = cachedData.hasMore
      totalUsers.value = cachedData.total
      usersCurrentPage.value = page
      return cachedData
    }
    
    // Pedir un elemento extra para ver si hay más páginas
    const limit = itemsPerPage + 1
    const offset = (page - 1) * itemsPerPage
    
    // Construir parámetros de consulta con filtros
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })
    
    // Agregar filtros si están definidos
    if (debouncedSearchQuery.value) {
      params.append('nombre', debouncedSearchQuery.value)
    }
    
    if (selectedStatus.value?.value) {
      params.append('estado', selectedStatus.value.value)
    }
    
    if (selectedCity.value?.value) {
      // Buscar el ID de la ciudad por nombre
      const ciudad = availableCities.value.find(c => c.nombre_ciudad === selectedCity.value.value)
      if (ciudad) {
        params.append('id_ciudad', ciudad.id_ciudad.toString())
      }
    }
    
    const response = await $fetch(`/usuarios/usuarios?${params.toString()}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response && response.usuarios) {
      // Verificar si hay más páginas disponibles
      const hasMore = response.usuarios.length > itemsPerPage
      
      // Tomar solo los elementos necesarios (el último es solo para verificar)
      const usuariosAMostrar = hasMore 
        ? response.usuarios.slice(0, -1) 
        : response.usuarios
      
      // Actualizar la lista de usuarios
      users.value = usuariosAMostrar
      hasMoreUsers.value = hasMore
      totalUsers.value = response.total || 0
      usersCurrentPage.value = page
      
      // Guardar en caché con la clave que incluye filtros
      usersCache[cacheKey] = {
        usuarios: usuariosAMostrar,
        hasMore,
        total: response.total || 0
      }
      
      // Calcular estadísticas con los usuarios actuales
      const usuariosActivos = usuariosAMostrar.filter(u => u.rol?.nombre_rol?.toLowerCase() === 'usuario')
      stats.value.totalReferrals = usuariosActivos.reduce((sum, u) => sum + (u.total_referidos || 0), 0)
      stats.value.totalCredits = usuariosActivos.reduce((sum, u) => sum + ((u.credito?.monto || 0)), 0)
    }
    
    return response
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
    showError('No se pudieron cargar los usuarios')
    return { usuarios: [], total: 0 }
  } finally {
    loadingUsers.value = false
    loadingMoreUsers.value = false
  }
}

// Función para cargar técnicos desde la API con filtros
const loadTechnicians = async (page = 1) => {
  try {
    loadingTechnicians.value = true
    const offset = (page - 1) * techniciansPerPage.value
    
    // Construir parámetros con filtros
    const params = new URLSearchParams({
      limit: techniciansPerPage.value.toString(),
      offset: offset.toString()
    })
    
    // Agregar filtros si están definidos
    if (searchQuery.value) {
      params.append('nombre', searchQuery.value)
    }
    
    if (selectedStatus.value?.value) {
      params.append('estado', selectedStatus.value.value)
    }
    
    if (selectedCity.value?.value) {
      // Buscar el ID de la ciudad por nombre
      const ciudad = availableCities.value.find(c => c.nombre_ciudad === selectedCity.value.value)
      if (ciudad) {
        params.append('id_ciudad', ciudad.id_ciudad.toString())
      }
    }

    const response = await $fetch(`/usuarios/tecnicos?${params.toString()}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    technicians.value = response.tecnicos || []
    totalTechnicians.value = response.total || 0
    techniciansCurrentPage.value = page
    return response
  } catch (error) {
    console.error('Error al cargar técnicos:', error)
    showError('No se pudieron cargar los técnicos')
    return { tecnicos: [], total: 0 }
  } finally {
    loadingTechnicians.value = false
  }
}

// Función para cargar ciudades
const loadCities = async () => {
  try {
    loadingCities.value = true
    const response = await $fetch('/ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    availableCities.value = Array.isArray(response) 
      ? response.map(ciudad => ({
          id_ciudad: ciudad.id_ciudad,
          nombre_ciudad: ciudad.nombre_ciudad
        }))
      : []
      
    return availableCities.value
  } catch (error) {
    console.error('Error al cargar ciudades:', error)
    showError('No se pudieron cargar las ciudades')
    return []
  } finally {
    loadingCities.value = false
  }
}

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    isLoading.value = true
    // Cargar datos iniciales en paralelo
    await Promise.all([
      loadCities(),
      loadRoles(),
      loadUsers(),
      loadTechnicians()
    ])
    
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    showError('Error al cargar los datos iniciales')
  } finally {
    isLoading.value = false
  }
})
</script>