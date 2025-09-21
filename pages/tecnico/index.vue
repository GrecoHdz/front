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
      :message="loadingMessage"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <!-- Header dinámico -->
      <HeaderTecnico :current-view="currentView" />

      <!-- Content Container with max-w-2xl -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <!-- Add padding at the bottom to prevent content from being hidden behind the fixed footer -->
        <div class="pb-24">
          <!-- Main Content - Vista Dinámica -->
          <main class="pb-4">

            <!-- DASHBOARD DEL TÉCNICO -->
            <div v-if="currentView === 'dashboard'">
              <!-- Welcome Section -->
              <section class="px-6 py-6">
                <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden">
                  <!-- Background decoration -->
                  <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div class="relative">
                    <div class="flex items-center space-x-4 mb-4">
                      <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <span class="text-2xl">🔧</span>
                      </div>
                      <div>
                        <h2 class="text-2xl font-black">¡Hola, {{ shortName }}!</h2>
                        <p class="text-white/90">Técnico de HogarSeguro</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 mt-4">
                      <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20">
                        <p class="text-white/90 font-medium text-center text-sm">
                          🚀 {{ pendingServices.length }} servicios hoy
                        </p>
                      </div>
                      <button 
                        @click="toggleAvailability"
                        class="flex items-center justify-center space-x-2 p-3 rounded-2xl border transition-colors duration-200"
                        :class="technicianData.available 
                          ? 'bg-green-500/90 border-green-400/50 hover:bg-green-600/90' 
                          : 'bg-white/10 border-white/20 hover:bg-white/20'"
                      >
                        <span class="text-white font-medium">
                          {{ technicianData.available ? 'Disponible' : 'No disponible' }}
                        </span>
                        <span class="text-white">
                          {{ technicianData.available ? '✅' : '⏸️' }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>


              <!-- Stats Cards -->
              <section class="px-6 mb-6">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                        <span class="text-white text-xl">⏳</span>
                      </div>
                      <div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Pendientes</p>
                        <p class="text-2xl font-black text-gray-900 dark:text-white">{{ pendingServices.length }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <span class="text-white text-xl">✅</span>
                      </div>
                      <div>
                        <p class="text-gray-600 dark:text-gray-400 text-sm">Completados</p>
                        <p class="text-2xl font-black text-gray-900 dark:text-white">{{ completedServices.length }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <span class="text-white text-xl">⭐</span>
                    </div>
                    <div>
                      <p class="text-gray-600 dark:text-gray-400 text-sm">Calificación Promedio</p>
                      <div class="flex items-center space-x-2">
                        <p class="text-2xl font-black text-gray-900 dark:text-white">{{ averageRating }}</p>
                        <div class="flex">
                          <span v-for="i in 5" :key="i" class="text-yellow-400">
                            {{ i <= Math.floor(averageRating) ? '★' : '☆' }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Servicios de Hoy -->
              <section class="px-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-xl font-black text-gray-900 dark:text-white">Servicios de Hoy</h3>
                  <button @click="currentView = 'servicios'" class="text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline">
                    Ver todos
                  </button>
                </div>
                <div v-if="todayServices.length === 0" class="text-center py-8">
                  <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span class="text-3xl">📅</span>
                  </div>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white mb-2">No tienes servicios hoy</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">Disfruta tu día libre</p>
                </div>
                <div v-else class="space-y-3">
                  <div v-for="service in todayServices.slice(0, 3)" :key="`today-${service.id}`"
                       @click="selectService(service)"
                       class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3 flex-1">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl">
                          {{ service.icon }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-gray-900 dark:text-white truncate">{{ service.title }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.address }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-500">{{ service.scheduledTime }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                              :class="getStatusColor(service.status)">
                          {{ service.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- LISTA DE SERVICIOS -->
            <div v-if="currentView === 'servicios'">
              <!-- Header -->
              <section class="px-6 py-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span class="text-white text-2xl">📋</span>
                    </div>
                    <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-2">Mis Servicios</h1>
                    <p class="text-gray-600 dark:text-gray-400">Gestiona tus servicios asignados</p>
                  </div>
                </div>
              </section>

              <!-- Filtros -->
              <section class="px-6 mb-6">
                <div class="flex space-x-2 overflow-x-auto pb-2">
                  <button v-for="filter in serviceFilters" :key="filter.value"
                          @click="selectedFilter = filter.value"
                          class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                          :class="selectedFilter === filter.value 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'">
                    {{ filter.label }}
                  </button>
                </div>
              </section>

              <!-- Lista de Servicios -->
              <section class="px-6 mb-6">
                <div class="space-y-3">
                  <div v-for="service in filteredServices" :key="`service-${service.id}`"
                       @click="selectService(service)"
                       class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3 flex-1">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl">
                          {{ service.icon }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-gray-900 dark:text-white">{{ service.title }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.address }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(service.date) }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                              :class="getStatusColor(service.status)">
                          {{ service.status }}
                        </span>
                        <p class="text-xs text-gray-500 mt-1">{{ service.scheduledTime }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- DETALLE DE SERVICIO -->
            <div v-if="currentView === 'detalle'">
              <!-- Header -->
              <section class="px-6 py-6">
                <div class="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white relative overflow-hidden">
                  <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div class="relative">
                    <button @click="currentView = 'servicios'" class="flex items-center text-white/80 hover:text-white mb-4">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                      Volver a servicios
                    </button>
                    <div class="flex items-center space-x-4">
                      <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                        {{ selectedService?.icon }}
                      </div>
                      <div>
                        <h1 class="text-2xl font-black">{{ selectedService?.title }}</h1>
                        <p class="text-white/90">{{ selectedService?.address }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Información del Cliente -->
              <section class="px-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Información del Cliente</h3>
                  <div class="space-y-3">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <span class="text-blue-600 dark:text-blue-400">👤</span>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-900 dark:text-white">{{ selectedService?.clientName }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Cliente</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                        <span class="text-green-600 dark:text-green-400">📞</span>
                      </div>
                      <div>
                        <p class="font-semibold text-gray-900 dark:text-white">{{ selectedService?.clientPhone }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                        <span class="text-purple-600 dark:text-purple-400">📍</span>
                      </div>
                      <div class="flex-1">
                        <p class="font-semibold text-gray-900 dark:text-white">{{ selectedService?.fullAddress }}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Dirección completa</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Descripción del Problema -->
              <section class="px-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Descripción del Problema</h3>
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ selectedService?.description }}</p>
                </div>
              </section>

              <!-- Acciones -->
              <section class="px-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Acciones</h3>
                  <div class="grid grid-cols-2 gap-3">
                    <button v-if="selectedService?.status === 'Asignado'" 
                            @click="startService"
                            class="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition-all duration-300">
                      <span class="text-xl">🚀</span>
                      <span class="font-bold">Iniciar</span>
                    </button>
                    <button v-if="selectedService?.status === 'En Progreso'" 
                            @click="completeService"
                            class="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl transition-all duration-300">
                      <span class="text-xl">✅</span>
                      <span class="font-bold">Completar</span>
                    </button>
                    <button @click="callClient"
                            class="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl transition-all duration-300">
                      <span class="text-xl">📞</span>
                      <span class="font-bold">Llamar</span>
                    </button>
                    <button @click="openMaps"
                            class="flex items-center justify-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-xl transition-all duration-300">
                      <span class="text-xl">🗺️</span>
                      <span class="font-bold">Ubicación</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <!-- PERFIL DEL TÉCNICO -->
            <div v-if="currentView === 'perfil'">
              <!-- Header -->
              <section class="px-6 py-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <div class="flex flex-col items-center text-center">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center text-4xl text-white mb-4 shadow-lg">
                      {{ userInitials }}
                    </div>
                    <h2 class="text-xl font-black text-gray-900 dark:text-white">{{ technicianData.name }}</h2>
                    <p class="text-blue-600 dark:text-blue-400 font-medium">{{ technicianData.email }}</p>
                    <div class="flex items-center space-x-1 mt-2">
                      <span class="text-yellow-400 text-lg">⭐</span>
                      <span class="text-gray-600 dark:text-gray-400 font-medium">{{ averageRating }} / 5.0</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Estado de disponibilidad -->
              <section class="px-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Estado de Disponibilidad</h3>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center mr-3" :class="technicianData.available ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'">
                        <span class="text-xl" :class="technicianData.available ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                          {{ technicianData.available ? '✅' : '⏸️' }}
                        </span>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ technicianData.available ? 'Disponible' : 'No disponible' }}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                          {{ technicianData.available ? 'Recibiendo nuevos servicios' : 'No disponible temporalmente' }}
                        </p>
                      </div>
                    </div>
                    <button 
                      @click="toggleAvailability"
                      class="px-4 py-2 rounded-xl font-medium transition-colors duration-200"
                      :class="technicianData.available 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:hover:bg-yellow-900/50' 
                        : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'"
                    >
                      {{ technicianData.available ? 'Pausar' : 'Activar' }}
                    </button>
                  </div>
                </div>
              </section>

              <!-- Estadísticas -->
              <section class="px-6 mb-6">
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                    <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span class="text-green-600 dark:text-green-400 text-xl">✅</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Completados</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ technicianStats.completed }}</p>
                  </div>
                  <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                    <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <span class="text-blue-600 dark:text-blue-400 text-xl">📅</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Este Mes</p>
                    <p class="text-2xl font-black text-gray-900 dark:text-white">{{ technicianStats.thisMonth }}</p>
                  </div>
                </div>
              </section>

              <!-- Información Personal -->
              <section class="px-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Información Personal</h3>
                  <div class="space-y-4">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                      <input 
                        v-model="technicianData.name"
                        type="text" 
                        class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                        placeholder="Tu nombre completo"
                      >
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
                      <input 
                        v-model="technicianData.email"
                        type="email" 
                        class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                        placeholder="tu@email.com"
                      >
                    </div>
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                      <input 
                        v-model="technicianData.phone"
                        type="tel" 
                        class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                        placeholder="+504 9999-9999"
                      >
                    </div>
                    <button class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300">
                      Actualizar Perfil
                    </button>
                  </div>
                </div>
              </section>

              <!-- Cerrar Sesión -->
              <section class="px-6 mb-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <button @click="logout" class="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all duration-300">
                    Cerrar Sesión
                  </button>
                </div>
              </section>
            </div>

            <!-- HISTORIAL -->
            <div v-if="currentView === 'historial'">
              <!-- Header -->
              <section class="px-6 py-6">
                <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                  <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span class="text-white text-2xl">📊</span>
                    </div>
                    <h1 class="text-3xl font-black text-gray-900 dark:text-white mb-2">Historial</h1>
                    <p class="text-gray-600 dark:text-gray-400">Revisa tu historial de servicios</p>
                  </div>
                </div>
              </section>

              <!-- Filtros de Período -->
              <section class="px-6 mb-6">
                <div class="flex space-x-2 overflow-x-auto pb-2">
                  <button v-for="period in periodFilters" :key="period.value"
                          @click="selectedPeriod = period.value"
                          class="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300"
                          :class="selectedPeriod === period.value 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'">
                    {{ period.label }}
                  </button>
                </div>
              </section>

              <!-- Lista del Historial -->
              <section class="px-6 mb-6">
                <div class="space-y-3">
                  <div v-for="service in filteredHistory" :key="`history-${service.id}`"
                       class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3 flex-1">
                        <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl">
                          {{ service.icon }}
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="font-bold text-gray-900 dark:text-white">{{ service.title }}</p>
                          <p class="text-sm text-gray-600 dark:text-gray-400">{{ service.clientName }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-500">{{ formatDate(service.date) }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="flex items-center space-x-1 mb-1">
                          <span v-for="i in 5" :key="i" class="text-yellow-400 text-sm">
                            {{ i <= service.rating ? '★' : '☆' }}
                          </span>
                        </div>
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Completado
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

          </main>
        </div>
      </div>

      <!-- Footer de Navegación para Técnico -->
      <nav class="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40">
        <div class="px-6 py-4">
          <div class="flex justify-around items-center">
            <button 
              @click="currentView = 'dashboard'" 
              :class="currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-400 dark:text-gray-500'"
              class="flex flex-col items-center space-y-1">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center"
                   :class="currentView === 'dashboard' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span class="text-xs font-bold">Dashboard</span>
            </button>
            
            <button 
              @click="currentView = 'servicios'" 
              :class="currentView === 'servicios' ? 'text-orange-600' : 'text-gray-400 dark:text-gray-500'"
              class="flex flex-col items-center space-y-1">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center"
                   :class="currentView === 'servicios' ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-gray-100 dark:bg-gray-800'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <span class="text-xs font-bold">Servicios</span>
            </button>
            
            <button 
              @click="currentView = 'historial'" 
              :class="currentView === 'historial' ? 'text-purple-600' : 'text-gray-400 dark:text-gray-500'"
              class="flex flex-col items-center space-y-1">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center"
                   :class="currentView === 'historial' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <span class="text-xs font-bold">Historial</span>
            </button>
            
            <button 
              @click="currentView = 'perfil'" 
              :class="currentView === 'perfil' ? 'text-green-600' : 'text-gray-400 dark:text-gray-500'"
              class="flex flex-col items-center space-y-1">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center"
                   :class="currentView === 'perfil' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <span class="text-xs font-bold">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
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
  title: 'HogarSeguro - Panel Técnico',
  meta: [
    { name: 'description', content: 'Panel de control para técnicos de HogarSeguro' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Filtros para servicios
const serviceFilters = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'in-progress', label: 'En Progreso' },
  { value: 'completed', label: 'Completados' }
]

// Filtros para períodos
const periodFilters = [
  { value: 'week', label: 'Esta Semana' },
  { value: 'month', label: 'Este Mes' },
  { value: 'quarter', label: 'Último Trimestre' },
  { value: 'year', label: 'Este Año' }
]

// Datos de ejemplo para servicios
const allServices = ref([
  {
    id: 1,
    title: 'Reparación de aire acondicionado',
    description: 'El aire acondicionado no enfría correctamente. Revisar sistema de refrigeración.',
    address: 'Colonia Palmira',
    fullAddress: 'Colonia Palmira, Calle Principal #123, Tegucigalpa',
    clientName: 'María González',
    clientPhone: '+504 9999-1234',
    status: 'Asignado',
    date: '2024-12-20',
    scheduledTime: '09:00 AM',
    icon: '❄️',
    rating: 0
  },
  {
    id: 2,
    title: 'Instalación de lámpara',
    description: 'Instalar nueva lámpara LED en sala de estar.',
    address: 'Colonia Kennedy',
    fullAddress: 'Colonia Kennedy, Avenida Los Próceres #456, Tegucigalpa',
    clientName: 'Carlos Rodríguez',
    clientPhone: '+504 9999-5678',
    status: 'En Progreso',
    date: '2024-12-20',
    scheduledTime: '02:00 PM',
    icon: '💡',
    rating: 0
  },
  {
    id: 3,
    title: 'Reparación de grifo',
    description: 'Goteo constante en grifo de cocina, revisar y reparar.',
    address: 'Colonia Miraflores',
    fullAddress: 'Colonia Miraflores, Calle Los Almendros #789, Tegucigalpa',
    clientName: 'Ana López',
    clientPhone: '+504 9999-9012',
    status: 'Completado',
    date: '2024-12-19',
    scheduledTime: '10:30 AM',
    icon: '🚰',
    rating: 5
  }
])

// =========================
// VARIABLES REACTIVAS
// =========================

// Estados de carga
const isLoading = ref(true)
const loadingMessage = ref('Cargando panel técnico...')

// Vista actual
const currentView = ref('dashboard')

// Datos del técnico
const technicianData = ref({
  name: 'Juan Pérez',
  email: 'juan.perez@hogarseguro.hn',
  phone: '+504 9999-0000',
  available: true
})

// Estadísticas del técnico
const technicianStats = ref({
  completed: 156,
  thisMonth: 24
})

// Servicio seleccionado
const selectedService = ref(null)

// Filtros
const selectedFilter = ref('all')
const selectedPeriod = ref('month')

// Estados de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// =========================
// COMPUTED PROPERTIES
// =========================

const shortName = computed(() => {
  if (!technicianData.value.name) return 'Técnico'
  const names = technicianData.value.name.split(' ')
  return names.length > 1 ? `${names[0]} ${names[1]}` : technicianData.value.name
})

const userInitials = computed(() => {
  if (!technicianData.value.name) return 'T'
  return technicianData.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
})

const pendingServices = computed(() => {
  return allServices.value.filter(service => service.status === 'Asignado')
})

const completedServices = computed(() => {
  return allServices.value.filter(service => service.status === 'Completado')
})

const averageRating = computed(() => {
  const completedWithRating = completedServices.value.filter(service => service.rating > 0)
  if (completedWithRating.length === 0) return 0
  const sum = completedWithRating.reduce((acc, service) => acc + service.rating, 0)
  return (sum / completedWithRating.length).toFixed(1)
})

const todayServices = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return allServices.value.filter(service => service.date === today)
})

const filteredServices = computed(() => {
  if (selectedFilter.value === 'all') return allServices.value
  
  const statusMap = {
    'pending': 'Asignado',
    'in-progress': 'En Progreso',
    'completed': 'Completado'
  }
  
  return allServices.value.filter(service => service.status === statusMap[selectedFilter.value])
})

const filteredHistory = computed(() => {
  // Solo servicios completados para el historial
  const completed = allServices.value.filter(service => service.status === 'Completado')
  
  // Filtrar por período (implementación simplificada)
  return completed
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

const getStatusColor = (status) => {
  const colors = {
    'Asignado': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'En Progreso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Completado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'Cancelado': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
  return colors[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
}

// =========================
// FUNCIONES DE NAVEGACIÓN
// =========================

const selectService = (service) => {
  selectedService.value = service
  currentView.value = 'detalle'
}

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

const startService = () => {
  if (selectedService.value) {
    selectedService.value.status = 'En Progreso'
    showSuccess('Servicio iniciado', 'El servicio ha sido marcado como en progreso')
  }
}

const completeService = () => {
  if (selectedService.value) {
    selectedService.value.status = 'Completado'
    showSuccess('Servicio completado', 'El servicio ha sido marcado como completado')
  }
}

const callClient = () => {
  if (selectedService.value?.clientPhone) {
    window.open(`tel:${selectedService.value.clientPhone}`, '_self')
  }
}

const openMaps = () => {
  if (selectedService.value?.fullAddress) {
    const encodedAddress = encodeURIComponent(selectedService.value.fullAddress)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }
}

const toggleAvailability = async () => {
  try {
    // Aquí iría la llamada a la API para actualizar la disponibilidad
    // Por ahora, solo actualizamos el estado local
    technicianData.value.available = !technicianData.value.available
    
    showSuccess(
      technicianData.value.available ? '¡Disponible!' : 'Modo pausa activado',
      technicianData.value.available 
        ? 'Ahora aparecerás como disponible para nuevos servicios' 
        : 'No recibirás nuevos servicios hasta que actives tu disponibilidad'
    )
    
    // Aquí podrías agregar una llamada a la API para guardar el estado
    // await $fetch('/api/technician/availability', {
    //   method: 'POST',
    //   body: { available: technicianData.value.available }
    // })
    
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error)
    showError('No se pudo actualizar tu disponibilidad. Intenta de nuevo.')
    // Revertir el cambio en caso de error
    technicianData.value.available = !technicianData.value.available
  }
}

const logout = () => {
  // Implementar logout
  router.push('/auth/login')
}

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

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

// =========================
// INICIALIZACIÓN
// =========================

onMounted(async () => {
  try {
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Cargar datos del técnico desde cookie o API
    const user = userCookie.value
    if (user) {
      technicianData.value = {
        name: user.nombre || 'Técnico',
        email: user.email || 'tecnico@hogarseguro.hn',
        phone: user.telefono || '+504 0000-0000',
        available: user.available !== undefined ? user.available : true
      }
      
      // Aquí podrías cargar el estado de disponibilidad desde la API
      // const response = await $fetch('/api/technician/availability')
      // technicianData.value.available = response.available
    }
    
  } catch (error) {
    console.error('Error al cargar datos:', error)
    showError('Error al cargar los datos del técnico')
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

// Header Component (simulado)
const HeaderTecnico = {
  props: ['currentView'],
  template: `
    <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div class="max-w-2xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">🔧</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">HogarSeguro</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Panel Técnico</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900 dark:text-white capitalize">{{ currentView }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ new Date().toLocaleDateString('es-ES') }}</p>
          </div>
        </div>
      </div>
    </header>
  `
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
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

button, input, textarea, select {
  min-height: 44px;
}

input, textarea, select {
  font-size: 16px;
}

html {
  scroll-behavior: smooth;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}
</style> 