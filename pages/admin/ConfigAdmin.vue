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
      :message="'Cargando configuración...'"
    />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <HeadersHeaderConfigAdmin />

      <!-- Content Container -->
      <div class="max-w-2xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen relative">
        <div class="pb-24">
          <!-- Main Content -->
          <main class="pb-4">

            <!-- Page Header -->
            <section class="px-3 sm:px-6 py-3 sm:py-6">
              <div class="bg-gradient-to-br from-gray-700 via-gray-800 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-xl"></div>
                <div class="absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 bg-white/10 rounded-full blur-lg"></div>
                
                <div class="relative">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <span class="text-2xl sm:text-4xl">⚙️</span>
                      </div>
                      <div>
                        <h1 class="text-xl sm:text-3xl font-black">Configuración</h1>
                        <p class="text-white/90 font-medium text-sm sm:text-base">Administra la configuración del sistema</p>
                      </div>
                    </div>
                    <button 
                      @click="saveAllSettings"
                      :disabled="isSaving"
                      class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border border-white/30 transition-colors disabled:opacity-50"
                    >
                      <span class="text-xs sm:text-sm font-bold">
                        {{ isSaving ? '💾 Guardando...' : '💾 Guardar Todo' }}
                      </span>
                    </button>
                  </div>
                  
                  <!-- Quick Status -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-base sm:text-xl font-black">{{ systemStatus.uptime }}d</div>
                      <div class="text-xs text-white/80">Tiempo Activo</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-base sm:text-xl font-black">{{ systemStatus.version }}</div>
                      <div class="text-xs text-white/80">Versión</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-base sm:text-xl font-black">{{ systemStatus.storage }}%</div>
                      <div class="text-xs text-white/80">Almacenamiento</div>
                    </div>
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-2xl p-2.5 sm:p-4 border border-white/20">
                      <div class="text-base sm:text-xl font-black flex items-center">
                        <span class="w-2 h-2 rounded-full mr-1" :class="systemStatus.healthy ? 'bg-green-400' : 'bg-red-400'"></span>
                        {{ systemStatus.healthy ? 'OK' : 'Error' }}
                      </div>
                      <div class="text-xs text-white/80">Estado</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- General Settings -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">🏢</span>
                  </span>
                  Configuración General
                </h2>

                <div class="space-y-4">
                  <!-- Company Info -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre de la Empresa</label>
                    <input
                      v-model="settings.general.companyName"
                      type="text"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="HogarSeguro"
                    >
                  </div>

                  <!-- Company Email -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email de la Empresa</label>
                    <input
                      v-model="settings.general.companyEmail"
                      type="email"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="info@hogarseguro.com"
                    >
                  </div>

                  <!-- Company Phone -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono de la Empresa</label>
                    <input
                      v-model="settings.general.companyPhone"
                      type="tel"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="+504 0000-0000"
                    >
                  </div>

                  <!-- Timezone -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Zona Horaria</label>
                    <select
                      v-model="settings.general.timezone"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="America/Tegucigalpa">Honduras (GMT-6)</option>
                      <option value="America/Guatemala">Guatemala (GMT-6)</option>
                      <option value="America/El_Salvador">El Salvador (GMT-6)</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <!-- Global System Settings -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">💰</span>
                  </span>
                  Configuraciones Globales
                </h2>

                <div class="space-y-4">
                  <!-- Membership Fee -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio de Membresía (L.)</label>
                    <input
                      v-model.number="settings.global.membershipPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="250.00"
                    >
                  </div>

                  <!-- Technical Visit Fee -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio de Visita Técnica (L.)</label>
                    <input
                      v-model.number="settings.global.technicalVisitPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="150.00"
                    >
                  </div>

                  <!-- Service Commission -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Comisión por Servicio (L.)</label>
                    <input
                      v-model.number="settings.global.serviceCommission"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="70.00"
                    >
                  </div>

                  <!-- Company Phone Number -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número de Empresa</label>
                    <input
                      v-model="settings.global.companyNumber"
                      type="text"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="99866626"
                    >
                  </div>

                  <!-- Company Email -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo de Empresa</label>
                    <input
                      v-model="settings.global.companyEmail"
                      type="email"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="hogarseguro@gmail.com"
                    >
                  </div>

                  <!-- Discount Percentage -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Porcentaje de Descuento (%)</label>
                    <input
                      v-model.number="settings.global.discountPercentage"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="10"
                    >
                  </div>

                  <!-- Referral Percentage -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Porcentaje de Referido (%)</label>
                    <input
                      v-model.number="settings.global.referralPercentage"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="10"
                    >
                  </div>

                  <!-- Withdrawal Percentage -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Porcentaje de Retiro (%)</label>
                    <input
                      v-model.number="settings.global.withdrawalPercentage"
                      type="number"
                      min="0"
                      max="100"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="99"
                    >
                  </div>
                </div>
              </div>
            </section>

            <!-- Notifications Settings -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">🔔</span>
                  </span>
                  Notificaciones
                </h2>

                <div class="space-y-4">
                  <!-- Email Notifications -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Notificaciones por Email</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Recibir alertas importantes por correo</p>
                    </div>
                    <button
                      @click="settings.notifications.email = !settings.notifications.email"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.notifications.email ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>

                  <!-- SMS Notifications -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Notificaciones SMS</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Alertas urgentes por mensaje de texto</p>
                    </div>
                    <button
                      @click="settings.notifications.sms = !settings.notifications.sms"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.notifications.sms ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>

                  <!-- Push Notifications -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Notificaciones Push</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Notificaciones en tiempo real en la app</p>
                    </div>
                    <button
                      @click="settings.notifications.push = !settings.notifications.push"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.notifications.push ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Security Settings -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 dark:bg-red-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">🔐</span>
                  </span>
                  Seguridad
                </h2>

                <div class="space-y-4">
                  <!-- Two Factor Authentication -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Autenticación de Dos Factores</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Requiere código adicional para iniciar sesión</p>
                    </div>
                    <button
                      @click="settings.security.twoFactor = !settings.security.twoFactor"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.security.twoFactor ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.security.twoFactor ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>

                  <!-- Session Timeout -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tiempo de Sesión (minutos)</label>
                    <select
                      v-model="settings.security.sessionTimeout"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="120">2 horas</option>
                      <option value="480">8 horas</option>
                    </select>
                  </div>

                  <!-- Password Policy -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Longitud Mínima de Contraseña</label>
                    <select
                      v-model="settings.security.passwordLength"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="6">6 caracteres</option>
                      <option value="8">8 caracteres</option>
                      <option value="10">10 caracteres</option>
                      <option value="12">12 caracteres</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <!-- Service Settings -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">🔧</span>
                  </span>
                  Configuración de Servicios
                </h2>

                <div class="space-y-4">
                  <!-- Auto Assignment -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Asignación Automática</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Asignar técnicos automáticamente</p>
                    </div>
                    <button
                      @click="settings.services.autoAssignment = !settings.services.autoAssignment"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.services.autoAssignment ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.services.autoAssignment ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>

                  <!-- Service Price -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio Base de Visita (L.)</label>
                    <input
                      v-model.number="settings.services.basePrice"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="150.00"
                    >
                  </div>

                  <!-- Max Technicians -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Máximo de Técnicos por Servicio</label>
                    <select
                      v-model="settings.services.maxTechnicians"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="1">1 técnico</option>
                      <option value="2">2 técnicos</option>
                      <option value="3">3 técnicos</option>
                      <option value="5">5 técnicos</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <!-- Backup & Maintenance -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">💾</span>
                  </span>
                  Respaldos y Mantenimiento
                </h2>

                <div class="space-y-4">
                  <!-- Auto Backup -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Respaldo Automático</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Crear respaldos automáticamente</p>
                    </div>
                    <button
                      @click="settings.backup.autoBackup = !settings.backup.autoBackup"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.backup.autoBackup ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>

                  <!-- Backup Frequency -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frecuencia de Respaldo</label>
                    <select
                      v-model="settings.backup.frequency"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="daily">Diario</option>
                      <option value="weekly">Semanal</option>
                      <option value="monthly">Mensual</option>
                    </select>
                  </div>

                  <!-- Backup Actions -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      @click="createBackup"
                      :disabled="isCreatingBackup"
                      class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 text-sm"
                    >
                      {{ isCreatingBackup ? '⏳ Creando...' : '💾 Crear Respaldo' }}
                    </button>
                    <button 
                      @click="showMaintenanceModal = true"
                      class="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors text-sm"
                    >
                      🔧 Modo Mantenimiento
                    </button>
                  </div>

                  <!-- Last Backup Info -->
                  <div class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p class="text-xs text-gray-600 dark:text-gray-400">Último respaldo:</p>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ lastBackupDate }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Advanced Settings -->
            <section class="px-3 sm:px-6 mb-4 sm:mb-6">
              <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center">
                  <span class="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                    <span class="text-sm sm:text-base">🔬</span>
                  </span>
                  Configuración Avanzada
                </h2>

                <div class="space-y-4">
                  <!-- Debug Mode -->
                  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p class="font-medium text-gray-900 dark:text-white text-sm">Modo Debug</p>
                      <p class="text-xs text-gray-600 dark:text-gray-400">Activar logs detallados para desarrollo</p>
                    </div>
                    <button
                      @click="settings.advanced.debugMode = !settings.advanced.debugMode"
                      class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      :class="settings.advanced.debugMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'"
                    >
                      <span
                        class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                        :class="settings.advanced.debugMode ? 'translate-x-6' : 'translate-x-1'"
                      ></span>
                    </button>
                  </div>

                  <!-- API Rate Limit -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Límite de API (requests/min)</label>
                    <input
                      v-model.number="settings.advanced.rateLimit"
                      type="number"
                      min="10"
                      max="1000"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                      placeholder="100"
                    >
                  </div>

                  <!-- Cache Duration -->
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duración de Cache (minutos)</label>
                    <select
                      v-model="settings.advanced.cacheDuration"
                      class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
                    >
                      <option value="5">5 minutos</option>
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                    </select>
                  </div>

                  <!-- Dangerous Actions -->
                  <div class="border-t border-gray-200 dark:border-gray-600 pt-4">
                    <h4 class="text-sm font-bold text-red-600 dark:text-red-400 mb-3">⚠️ Acciones Peligrosas</h4>
                    <div class="grid grid-cols-1 gap-2">
                      <button 
                        @click="showResetModal = true"
                        class="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm"
                      >
                        🗑️ Restablecer Configuración
                      </button>
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

    <!-- Maintenance Mode Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showMaintenanceModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showMaintenanceModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-4 sm:p-6 relative z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-3 sm:mb-4">
              <span class="text-orange-600 dark:text-orange-400 text-lg sm:text-xl">🔧</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">Modo Mantenimiento</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
              Activar el modo mantenimiento deshabilitará temporalmente el acceso a la aplicación para todos los usuarios.
            </p>
            
            <div class="flex gap-2 sm:gap-3">
              <button 
                @click="showMaintenanceModal = false"
                class="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                @click="toggleMaintenanceMode"
                :disabled="isTogglingMaintenance"
                class="flex-1 px-3 sm:px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
              >
                <span v-if="!isTogglingMaintenance">
                  {{ settings.system.maintenanceMode ? 'Desactivar' : 'Activar' }}
                </span>
                <svg v-else class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Reset Configuration Modal -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to">
      <div v-if="showResetModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showResetModal = false"></div>
        
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm p-4 sm:p-6 relative z-10">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-3 sm:mb-4">
              <span class="text-red-600 dark:text-red-400 text-lg sm:text-xl">⚠️</span>
            </div>
            <h3 class="text-base sm:text-lg font-black text-gray-900 dark:text-white mb-2">¿Restablecer configuración?</h3>
            <p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-4 sm:mb-6">
              <strong>¡ADVERTENCIA!</strong> Esta acción restaurará toda la configuración a los valores predeterminados. Esta acción no se puede deshacer.
            </p>
            
            <div class="flex gap-2 sm:gap-3">
              <button 
                @click="showResetModal = false"
                class="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button 
                @click="resetConfiguration"
                :disabled="isResetting"
                class="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm disabled:opacity-50"
              >
                <span v-if="!isResetting">Restablecer</span>
                <svg v-else class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
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
  title: 'HogarSeguro - Configuración del Sistema',
  meta: [
    { name: 'description', content: 'Configuración del sistema HogarSeguro - Ajustes generales, seguridad y mantenimiento' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isSaving = ref(false)
const isCreatingBackup = ref(false)
const isTogglingMaintenance = ref(false)
const isResetting = ref(false)
const showMaintenanceModal = ref(false)
const showResetModal = ref(false)

// ===== VARIABLES DE DATOS =====
// Estado del sistema
const systemStatus = ref({
  uptime: 45,
  version: 'v2.1.3',
  storage: 68,
  healthy: true
})

// Configuraciones del sistema
const settings = ref({
  general: {
    companyName: 'HogarSeguro',
    companyEmail: 'info@hogarseguro.com',
    companyPhone: '+504 2234-5678',
    timezone: 'America/Tegucigalpa'
  },
  global: {
    membershipPrice: 250,
    technicalVisitPrice: 150,
    serviceCommission: 70,
    companyNumber: '99866626',
    companyEmail: 'hogarseguro@gmail.com',
    discountPercentage: 10,
    referralPercentage: 10,
    withdrawalPercentage: 99
  },
  notifications: {
    email: true,
    sms: false,
    push: true
  },
  security: {
    twoFactor: false,
    sessionTimeout: 30,
    passwordLength: 8
  },
  services: {
    autoAssignment: true,
    basePrice: 150.00,
    maxTechnicians: 2
  },
  backup: {
    autoBackup: true,
    frequency: 'daily'
  },
  advanced: {
    debugMode: false,
    rateLimit: 100,
    cacheDuration: 15
  },
  system: {
    maintenanceMode: false
  }
})

// Configuraciones originales para detectar cambios
const originalSettings = ref({})

// Fecha del último respaldo
const lastBackupDate = ref('18 Dic 2024, 03:00 AM')

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// ===== COMPUTED PROPERTIES =====
const hasUnsavedChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
})

// ===== FUNCIONES DE UTILIDAD =====
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

const showWarning = (message) => {
  showToast({
    message,
    type: 'warning',
    duration: 4000
  })
}

// ===== FUNCIONES DE CONFIGURACIÓN =====
const saveAllSettings = async () => {
  try {
    isSaving.value = true
    
    // Simular guardado de configuraciones
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Actualizar configuraciones originales
    originalSettings.value = JSON.parse(JSON.stringify(settings.value))
    
    showSuccess('Todas las configuraciones han sido guardadas exitosamente')
  } catch (error) {
    showError('Error al guardar las configuraciones')
  } finally {
    isSaving.value = false
  }
}

const createBackup = async () => {
  try {
    isCreatingBackup.value = true
    
    // Simular creación de respaldo
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Actualizar fecha del último respaldo
    const now = new Date()
    lastBackupDate.value = now.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    
    showSuccess('Respaldo creado exitosamente')
  } catch (error) {
    showError('Error al crear el respaldo')
  } finally {
    isCreatingBackup.value = false
  }
}

const toggleMaintenanceMode = async () => {
  try {
    isTogglingMaintenance.value = true
    
    // Simular cambio de modo mantenimiento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    settings.value.system.maintenanceMode = !settings.value.system.maintenanceMode
    
    if (settings.value.system.maintenanceMode) {
      showWarning('Modo mantenimiento activado. Los usuarios no podrán acceder a la aplicación.')
    } else {
      showSuccess('Modo mantenimiento desactivado. La aplicación está disponible nuevamente.')
    }
    
    showMaintenanceModal.value = false
  } catch (error) {
    showError('Error al cambiar el modo mantenimiento')
  } finally {
    isTogglingMaintenance.value = false
  }
}

const resetConfiguration = async () => {
  try {
    isResetting.value = true
    
    // Simular restablecimiento
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Restablecer a valores predeterminados
    settings.value = {
      general: {
        companyName: 'HogarSeguro',
        companyEmail: 'info@hogarseguro.com',
        companyPhone: '+504 2234-5678',
        timezone: 'America/Tegucigalpa'
      },
      global: {
        membershipPrice: 250,
        technicalVisitPrice: 150,
        serviceCommission: 70,
        companyNumber: '99866626',
        companyEmail: 'hogarseguro@gmail.com',
        discountPercentage: 10,
        referralPercentage: 10,
        withdrawalPercentage: 99
      },
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
        passwordLength: 8
      },
      services: {
        autoAssignment: false,
        basePrice: 150.00,
        maxTechnicians: 1
      },
      backup: {
        autoBackup: true,
        frequency: 'daily'
      },
      advanced: {
        debugMode: false,
        rateLimit: 100,
        cacheDuration: 15
      },
      system: {
        maintenanceMode: false
      }
    }
    
    originalSettings.value = JSON.parse(JSON.stringify(settings.value))
    
    showSuccess('Configuración restablecida a valores predeterminados')
    showResetModal.value = false
  } catch (error) {
    showError('Error al restablecer la configuración')
  } finally {
    isResetting.value = false
  }
}

// ===== FUNCIONES DE CARGA =====
const loadSettings = async () => {
  try {
    // Simular carga de configuraciones desde la API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Las configuraciones ya están inicializadas en el estado
    // En una aplicación real, aquí se cargarían desde la API
    
    // Guardar configuraciones originales
    originalSettings.value = JSON.parse(JSON.stringify(settings.value))
    
  } catch (error) {
    console.error('Error al cargar configuraciones:', error)
    showError('Error al cargar las configuraciones del sistema')
  } finally {
    isLoading.value = false
  }
}

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  await loadSettings()
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
  background: rgba(107, 114, 128, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.5);
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

/* Estilos para toggle switches */
.toggle-switch {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>