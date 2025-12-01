<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Header -->
    <HeadersHeaderConfigAdmin />
    
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
      :message="'Cargando configuraciones...'"
    />

    <!-- Contenido Principal -->
    <div v-if="!isLoading" class="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-10 sm:pb-32">
      
      <!-- Header Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-start sm:items-center space-x-3 sm:space-x-4">
            <div class="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <span class="text-2xl sm:text-3xl">⚙️</span>
            </div>
            <div class="min-w-0 flex-1">
              <h1 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Configuración del Sistema
              </h1>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Administra las configuraciones principales de HogarSeguro
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              @click="guardarConfiguraciones"
              :disabled="isSaving || !hayChanges"
              class="w-full sm:w-auto px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="flex items-center justify-center">
                <div v-if="!isSaving" class="mr-2"></div>
                <div v-else class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
              </div>
            </button>
          </div>
        </div> 
      </div>

      <!-- Configuration Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-16 sm:mb-20 lg:mb-24">
        
        <!-- Card 1: Precios y Tarifas -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">💰</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Precios y Tarifas
              </h3>
              <p class="text-[11px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Configuración de precios del sistema
              </p>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-5">
            <!-- Membresía -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio de Membresía
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionMembresia"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="250.00">
              </div>
            </div>

            <!-- Visita Técnica -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio de Visita Técnica
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionVisita"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="150.00">
              </div>
            </div>

            <!-- Monto Mínimo de Retiro -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Mínimo de Retiro
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionRetiroMinimo"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="500.00">
              </div>
            </div>

            <!-- Período de Gracia para Créditos -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Días de Gracia para Créditos
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">📅</span>
                <input
                  v-model.number="configuracionDiasGracia"
                  type="number"
                  min="1"
                  step="1"
                  class="w-full pl-10 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="14">
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Días de gracia después de vencida la membresía
              </p>
            </div>
          </div>
        </div>

        <!-- Card 2: Información de Empresa -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">🏢</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Información de Empresa
              </h3>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Datos de contacto empresarial
              </p>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-5">
            <!-- Teléfono -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Empresa
              </label>
              <input
                v-model="configuracionTelefono"
                type="text"
                class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="99866626">
            </div>

            <!-- Email -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo de Empresa
              </label>
              <input
                v-model="configuracionEmail"
                type="email"
                class="w-full px-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="hogarseguro@gmail.com">
            </div>

            <!-- Referente Predeterminado -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300">
                  Referente Predeterminado
                </label>
                <button 
                  @click="abrirModalBuscarUsuario"
                  type="button"
                  class="-mt-1 -mr-1 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <div class="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <span v-if="referidorPredeterminado" class="text-gray-900 dark:text-white">
                  {{ referidorPredeterminado.nombre || 'Sin nombre' }}
                </span>
                <span v-else class="text-gray-500 dark:text-gray-400">
                  No se ha configurado un referente predeterminado
                </span>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Este es el usuario que se asigna por defecto cuando un nuevo usuario se registra sin código de referido
              </p>
            </div>

            <!-- Info adicional -->
            <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
              <h4 class="text-[12px] sm:text-xs md:text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Información</h4>
              <p class="text-[12px] sm:text-xs md:text-sm text-blue-600 dark:text-blue-300 leading-relaxed">
                Esta información se utiliza para el contacto oficial de la empresa y aparece en documentos y comunicaciones.
              </p>
            </div>
          </div>
        </div>

        <!-- Card 3: Porcentajes del Sistema -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div class="flex items-center mb-4 sm:mb-6">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span class="text-lg sm:text-2xl">📊</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                Porcentajes del Sistema
              </h3>
              <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                Configuración de comisiones
              </p>
            </div>
          </div>

          <div class="space-y-4 sm:space-y-5">
            <!-- Comisión por Servicio -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comisión por Servicio
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionComision"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-full pl-4 pr-10 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10.00">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Descuento -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Porcentaje de Descuento
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionDescuento"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Referido -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Porcentaje de Referido
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionReferido"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="10">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>

            <!-- Retiro -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Porcentaje de Retiro
              </label>
              <div class="relative">
                <input
                  v-model.number="configuracionRetiro"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full pl-4 pr-8 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="99">
                <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 4: Gestión de Cuentas Bancarias -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 dark:bg-teal-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🏦</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Cuentas Bancarias
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra las cuentas bancarias para retiros
                </p>
              </div>
            </div>
            <button 
              @click="mostrarModalNuevaCuenta = true; cargarCuentas()"
              class="px-4 py-2 text-sm bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
              + Nueva Cuenta
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusquedaCuentas"
                type="text"
                placeholder="Buscar cuentas..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Grid de cuentas bancarias -->
          <div v-if="cuentasCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p>Cargando cuentas...</p>
          </div>
          
          <div v-else-if="cuentasFiltradas.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            <span class="text-4xl mb-2 block">🏦</span>
            <p>No se encontraron cuentas bancarias</p>
          </div>
          
          <!-- Grid 2x2 incluso en móvil -->
          <div v-else class="grid grid-cols-2 gap-3 sm:gap-4">
            <div v-for="cuenta in cuentasPaginadas" :key="cuenta.id_cuenta" 
                 @click="abrirDetallesCuenta(cuenta)"
                 class="cursor-pointer bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-200 min-h-[120px] sm:min-h-[140px] flex flex-col justify-between">
              
              <!-- Header de la tarjeta -->
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="text-sm">🏦</span>
                  </div>
                  <div class="min-w-0">
                    <h5 class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {{ cuenta.banco }}
                    </h5>
                  </div>
                </div>
                <span 
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': cuenta.activo,
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !cuenta.activo
                  }" 
                  class="px-1.5 py-0.5 rounded-full text-xs font-medium">
                  {{ cuenta.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <!-- Información de la cuenta -->
              <div class="space-y-1.5 flex-1">
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Número de cuenta</p>
                  <p class="text-xs sm:text-sm font-mono text-gray-900 dark:text-white truncate">{{ cuenta.num_cuenta }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-600 dark:text-gray-400">Tipo</p>
                  <p class="text-xs sm:text-sm text-gray-900 dark:text-white truncate">{{ cuenta.tipo }}</p>
                </div>
              </div>

              <!-- Footer de la tarjeta -->
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                  ID: {{ cuenta.beneficiario }}
                </p>
              </div>
            </div>
          </div>

          <!-- Paginación para cuentas -->
          <div v-if="cuentasFiltradas.length > 0" class="mt-4 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionCuentas.paginaActual }} de {{ paginacionCuentasCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaCuentas(paginacionCuentas.paginaActual - 1, $event)" 
                  :disabled="paginacionCuentas.paginaActual === 1 || cuentasCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionCuentas.paginaActual }} / {{ paginacionCuentasCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaCuentas(paginacionCuentas.paginaActual + 1, $event)" 
                  :disabled="paginacionCuentas.paginaActual >= paginacionCuentasCalculada.totalPaginas || cuentasCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 5: Beneficios de Membresía -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🎁</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Beneficios de Membresía
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra los beneficios disponibles para miembros de HogarSeguro
                </p>
              </div>
            </div>
            <button 
              @click="mostrarModalNuevoBeneficio = true; cargarBeneficios()"
              class="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
              + Nuevo Beneficio
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusquedaBeneficios"
                type="text"
                placeholder="Buscar beneficios..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Lista de beneficios -->
          <div class="space-y-3">
            <div v-if="beneficiosCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p>Cargando beneficios...</p>
            </div>
            
            <div v-else-if="beneficiosFiltrados.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">🎁</span>
              <p>No se encontraron beneficios</p>
            </div>
            
            <div v-for="beneficio in beneficiosPaginados" :key="beneficio.id_beneficio" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">🎁</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">{{ beneficio.tipo_beneficio }}</h5>
                    <p class="text-[12px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {{ beneficio.descripcion || 'Sin descripción' }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 px-2 py-1 rounded-full text-xs font-medium">
                    Mes {{ beneficio.mes_requerido }}
                  </span>
                </div>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click="editarBeneficio(beneficio)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  @click="confirmarEliminarBeneficio(beneficio)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación para beneficios -->
          <div v-if="beneficiosFiltrados.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionBeneficios.paginaActual }} de {{ paginacionBeneficiosCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaBeneficios(paginacionBeneficios.paginaActual - 1, $event)" 
                  :disabled="paginacionBeneficios.paginaActual === 1 || beneficiosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionBeneficios.paginaActual }} / {{ paginacionBeneficiosCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaBeneficios(paginacionBeneficios.paginaActual + 1, $event)" 
                  :disabled="paginacionBeneficios.paginaActual >= paginacionBeneficiosCalculada.totalPaginas || beneficiosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 6: Gestión de Servicios -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🔧</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Servicios
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra los servicios disponibles en HogarSeguro
                </p>
              </div>
            </div>
            <button 
              @click="mostrarModalNuevoServicio = true; cargarServicios()"
              class="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
              + Nuevo Servicio
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusqueda"
                type="text"
                placeholder="Buscar..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <select 
              v-model="filtroEstado"
              class="w-32 sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all">
              <option value="">Todos</option>
              <option value="1">Activos</option>
              <option value="0">Inactivos</option>
            </select>
          </div>

          <!-- Lista de servicios -->
          <div class="space-y-3">
            <div v-if="serviciosCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p>Cargando servicios...</p>
            </div>
            
            <div v-else-if="serviciosFiltrados.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">🔧</span>
              <p>No se encontraron servicios</p>
            </div>
            
            <div v-for="servicio in serviciosPaginados" :key="servicio.id_servicio" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">🔧</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">{{ servicio.nombre }}</h5>
                    <p class="text-[12px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400">
                      {{ servicio.descripcion || 'Sin descripción' }}
                    </p>
                  </div>
                </div>
                <span 
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': servicio.estado,
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !servicio.estado
                  }" 
                  class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ servicio.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click="editarServicio(servicio)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  v-if="servicio.estado"
                  @click="confirmarCambioEstado(servicio, false)"
                  class="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Desactivar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                
                <button 
                  v-else
                  @click="confirmarCambioEstado(servicio, true)"
                  class="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Activar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </button>
                
                <button 
                  @click="confirmarEliminarServicio(servicio)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div v-if="serviciosFiltrados.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacion.paginaActual }} de {{ paginacionCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPagina(paginacion.paginaActual - 1, $event)" 
                  :disabled="paginacion.paginaActual === 1 || serviciosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  :class="{ 'cursor-not-allowed': paginacion.paginaActual === 1 }">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacion.paginaActual }} / {{ paginacionCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPagina(paginacion.paginaActual + 1, $event)" 
                  :disabled="paginacion.paginaActual >= paginacionCalculada.totalPaginas || serviciosCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  :class="{ 'cursor-not-allowed': paginacion.paginaActual >= paginacionCalculada.totalPaginas }">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 7: Gestión de Ciudades -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-100 dark:bg-cyan-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🏙️</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Ciudades
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Administra las ciudades disponibles en el sistema
                </p>
              </div>
            </div>
            <button 
              @click="mostrarModalNuevaCiudad = true; cargarCiudades()"
              class="px-4 py-2 text-sm bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
              + Nueva Ciudad
            </button>
          </div>

          <!-- Filtros y búsqueda -->
          <div class="mb-4 sm:mb-6 flex flex-row gap-2 sm:gap-4">
            <div class="relative flex-1 min-w-0">
              <input
                v-model="filtroBusquedaCiudades"
                type="text"
                placeholder="Buscar ciudades..."
                class="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base transition-all"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Lista de ciudades -->
          <div class="space-y-3">
            <div v-if="ciudadesCargando" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
              <p>Cargando ciudades...</p>
            </div>
            
            <div v-else-if="ciudadesFiltradas.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">🏙️</span>
              <p>No se encontraron ciudades</p>
            </div>
            
            <div v-for="ciudad in ciudadesPaginadas" :key="ciudad.id_ciudad" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">🏙️</span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base font-medium text-gray-900 dark:text-white">{{ ciudad.nombre }}</h5>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-row gap-1.5 sm:gap-2 ml-2">
                <button 
                  @click="editarCiudad(ciudad)"
                  class="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button 
                  @click="confirmarEliminarCiudad(ciudad)"
                  class="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Paginación para ciudades -->
          <div v-if="ciudadesFiltradas.length > 0" class="mt-3 bg-white dark:bg-gray-800 p-2 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Página {{ paginacionCiudades.paginaActual }} de {{ paginacionCiudadesCalculada.totalPaginas }}
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  @click="$event => cambiarPaginaCiudades(paginacionCiudades.paginaActual - 1, $event)" 
                  :disabled="paginacionCiudades.paginaActual === 1 || ciudadesCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {{ paginacionCiudades.paginaActual }} / {{ paginacionCiudadesCalculada.totalPaginas }}
                </span>
                <button 
                  @click="$event => cambiarPaginaCiudades(paginacionCiudades.paginaActual + 1, $event)" 
                  :disabled="paginacionCiudades.paginaActual >= paginacionCiudadesCalculada.totalPaginas || ciudadesCargando"
                  class="p-1.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 8: Gestión de Notificaciones -->
        <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:col-span-2 xl:col-span-3">
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                <span class="text-lg sm:text-2xl">🔔</span>
              </div>
              <div class="min-w-0 flex-1">
                <h3 class="text-[14px] sm:text-xs md:text-base font-bold text-gray-900 dark:text-white leading-tight">
                  Gestión de Notificaciones
                </h3>
                <p class="text-[12px] sm:text-xs md:text-base text-gray-600 dark:text-gray-300 mt-1">
                  Crear y administrar notificaciones del sistema
                </p>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                @click="mostrarFormularioCrear = !mostrarFormularioCrear"
                class="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                {{ mostrarFormularioCrear ? 'Cancelar' : 'Crear/Eliminar Leídas' }}
              </button>
            </div>
          </div>

          <!-- Formulario para crear notificación -->
          <div v-if="mostrarFormularioCrear" class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Crear Nueva Notificación</h4>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título de la notificación</label>
                <input
                  v-model="nuevaNotificacion.titulo"
                  type="text"
                  class="w-full px-3 py-2 text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 dark:text-white"
                  placeholder="Escribe el título de la notificación"
                  @keyup.enter="crearNotificacion">
              </div>
            </div>
            <div class="mt-4 flex gap-3">
              <button 
                @click="crearNotificacion"
                :disabled="!nuevaNotificacion.titulo || isCreatingNotification"
                class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="flex items-center">
                  <div v-if="isCreatingNotification" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ isCreatingNotification ? 'Creando...' : 'Crear Notificación' }}
                </div>
              </button>
              <button 
                @click="confirmarEliminarNotificacionesLeidas"
                :disabled="isDeletingRead"
                class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50">
                <div class="flex items-center">
                  <div v-if="isDeletingRead" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ isDeletingRead ? 'Eliminando...' : 'Eliminar Leídas' }}
                </div>
              </button>
            </div>
          </div>

          <!-- Lista de notificaciones -->
          <div class="space-y-3">
            <div v-if="notificaciones.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              <span class="text-4xl mb-2 block">📭</span>
              <p>No hay notificaciones manuales creadas</p>
            </div>
            
            <div v-for="notif in notificaciones" :key="notif.id_notificacion" 
                 class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-lg">
                    {{ '📢' }}
                  </span>
                  <div>
                    <h5 class="text-[13px] sm:text-xs md:text-base text-gray-900 dark:text-white">{{ notif.titulo }}</h5>
                    <p class="text-[12px] sm:text-xs md:text-base text-gray-500 dark:text-gray-400">
                      Creada por: {{ notif.creado_por }} • 
                      {{ formatearFecha(notif.fecha_creacion) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-2 ml-0 sm:ml-4 mt-2 sm:mt-0">
                <button 
                  @click="mostrarFormularioEnvio(notif)"
                  class="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
                <button 
                  @click="confirmarEliminarNotificacion(notif.id_notificacion)"
                  class="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <FootersFooterAdmin />
    
    <!-- Modal para enviar notificación -->
    <Transition name="fade">
      <div v-if="mostrarModalEnvio" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalEnvio"></div>
        <Transition name="modal">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 relative z-10">
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Enviar notificación
              </h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Destinatario
                  </label>
                  <select 
                    v-model="tipoEnvio"
                    class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="usuario">Usuario específico</option>
                    <option value="rol">Por rol</option>
                    <option value="global">Todos los usuarios</option>
                  </select>
                </div>

                <div v-if="tipoEnvio === 'usuario'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ID de Usuario
                  </label>
                  <input
                    v-model.number="idUsuarioDestino"
                    type="number"
                    min="1"
                    class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="ID del usuario"
                  >
                </div>

                <div v-if="tipoEnvio === 'rol'">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rol
                  </label>
                  <select 
                    v-model="nombreRolDestino"
                    class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="tecnico">Técnico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="cerrarModalEnvio"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  @click="enviarNotificacion"
                  :disabled="!puedeEnviar || isSendingNotification"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isSendingNotification" class="inline-flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                  <span v-else>Enviar</span>
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal de confirmación para eliminar notificación -->
    <Transition name="fade">
      <div v-if="mostrarModalConfirmacionEliminar" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacionEliminar = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Confirmar eliminación
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas eliminar esta notificación? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="mostrarModalConfirmacionEliminar = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              @click="eliminarNotificacion"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal de confirmación para eliminar notificaciones leídas -->
    <Transition name="fade">
      <div v-if="mostrarModalConfirmacionEliminarLeidas" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacionEliminarLeidas = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative z-10">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Eliminar notificaciones leídas
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            ¿Estás seguro de que deseas eliminar todas las notificaciones leídas? Esta acción no se puede deshacer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="mostrarModalConfirmacionEliminarLeidas = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isDeletingRead"
            >
              Cancelar
            </button>
            <button
              @click="eliminarNotificacionesLeidas"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              :disabled="isDeletingRead"
            >
              <svg v-if="isDeletingRead" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isDeletingRead ? 'Eliminando...' : 'Eliminar leídas' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modal para crear/editar servicio -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevoServicio" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalServicio"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ servicioEditando ? 'Editar Servicio' : 'Nuevo Servicio' }}
              </h3>
              <button @click="cerrarModalServicio" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarServicio" class="space-y-4">
              <div>
                <label for="nombre" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del servicio <span class="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  v-model="formServicio.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Reparación eléctrica">
              </div>
              
              <div>
                <label for="descripcion" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  v-model="formServicio.descripcion"
                  rows="3"
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Descripción detallada del servicio"></textarea>
              </div>
              
              <div class="flex items-center">
                <input
                  id="estado"
                  v-model="formServicio.estado"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded">
                <label for="estado" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Activo
                </label>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalServicio"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoServicio"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoServicio"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoServicio" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoServicio ? 'Guardando...' : (servicioEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para crear/editar beneficio -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevoBeneficio" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalBeneficio"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ beneficioEditando ? 'Editar Beneficio' : 'Nuevo Beneficio' }}
              </h3>
              <button @click="cerrarModalBeneficio" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarBeneficio" class="space-y-4">
              <div>
                <label for="mes_requerido" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mes requerido <span class="text-red-500">*</span>
                </label>
                <input
                  id="mes_requerido"
                  v-model.number="formBeneficio.mes_requerido"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
                  placeholder="1">
              </div>

              <div>
                <label for="tipo_beneficio" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de beneficio <span class="text-red-500">*</span>
                </label>
                <input
                  id="tipo_beneficio"
                  v-model="formBeneficio.tipo_beneficio"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Visita técnica gratis">
              </div>
              
              <div>
                <label for="descripcion_beneficio" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="descripcion_beneficio"
                  v-model="formBeneficio.descripcion"
                  rows="3"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white"
                  placeholder="Descripción detallada del beneficio"></textarea>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalBeneficio"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoBeneficio"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoBeneficio"
                  class="flex-1 py-2 px-4 bg-emerald-600 text-white font-medium text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoBeneficio" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoBeneficio ? 'Guardando...' : (beneficioEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para crear/editar ciudad -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevaCiudad" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalCiudad"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ ciudadEditando ? 'Editar Ciudad' : 'Nueva Ciudad' }}
              </h3>
              <button @click="cerrarModalCiudad" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarCiudad" class="space-y-4">
              <div>
                <label for="nombre" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre de la ciudad <span class="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  v-model="formCiudad.nombre"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Tegucigalpa">
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalCiudad"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoCiudad"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoCiudad"
                  class="flex-1 py-2 px-4 bg-cyan-600 text-white font-medium text-sm rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoCiudad" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoCiudad ? 'Guardando...' : (ciudadEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para crear/editar cuenta bancaria -->
    <Transition name="fade">
      <div v-if="mostrarModalNuevaCuenta" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarModalCuenta"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                {{ cuentaEditando ? 'Editar Cuenta' : 'Nueva Cuenta' }}
              </h3>
              <button @click="cerrarModalCuenta" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <form @submit.prevent="guardarCuenta" class="space-y-4">
              <div>
                <label for="banco" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Banco <span class="text-red-500">*</span>
                </label>
                <input
                  id="banco"
                  v-model="formCuenta.banco"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: BAC, BANPAIS, FICOHSA">
              </div>

              <div>
                <label for="beneficiario" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beneficiario (ID) <span class="text-red-500">*</span>
                </label>
                <input
                  id="beneficiario"
                  v-model="formCuenta.beneficiario"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: 1101200100595">
              </div>
              
              <div>
                <label for="num_cuenta" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Número de Cuenta <span class="text-red-500">*</span>
                </label>
                <input
                  id="num_cuenta"
                  v-model="formCuenta.num_cuenta"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: 34567887">
              </div>

              <div>
                <label for="tipo" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Cuenta <span class="text-red-500">*</span>
                </label>
                <input
                  id="tipo"
                  v-model="formCuenta.tipo"
                  type="text"
                  required
                  class="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 dark:text-white"
                  placeholder="Ej: Ahorro, Cheques, Dólares">
              </div>
              
              <div class="flex items-center">
                <input
                  id="activo_cuenta"
                  v-model="formCuenta.activo"
                  type="checkbox"
                  class="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 dark:border-gray-600 rounded">
                <label for="activo_cuenta" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Cuenta activa
                </label>
              </div>

              <!-- Buttons -->
              <div class="flex space-x-3 pt-2">
                <button
                  type="button"
                  @click="cerrarModalCuenta"
                  class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :disabled="guardandoCuenta"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  :disabled="guardandoCuenta"
                  class="flex-1 py-2 px-4 bg-teal-600 text-white font-medium text-sm rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <svg v-if="guardandoCuenta" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ guardandoCuenta ? 'Guardando...' : (cuentaEditando ? 'Actualizar' : 'Crear') }}
                </button>
              </div>
            </form>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal para ver detalles de cuenta bancaria -->
    <Transition name="fade">
      <div v-if="mostrarModalDetallesCuenta" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="cerrarDetallesCuenta"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-md max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">
                Detalles de la Cuenta
              </h3>
              <button @click="cerrarDetallesCuenta" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4" v-if="cuentaSeleccionada">
            <!-- Información de la cuenta -->
            <div class="space-y-4 mb-6">
              <div class="flex items-center justify-center mb-4">
                <div class="w-16 h-16 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center">
                  <span class="text-2xl">🏦</span>
                </div>
              </div>
              
              <div class="text-center mb-6">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ cuentaSeleccionada.banco }}</h4>
                <span 
                  :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': cuentaSeleccionada.activo,
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': !cuentaSeleccionada.activo
                  }" 
                  class="px-3 py-1 rounded-full text-xs font-medium">
                  {{ cuentaSeleccionada.activo ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Beneficiario (ID)</label>
                  <p class="text-sm font-mono text-gray-900 dark:text-white">{{ cuentaSeleccionada.beneficiario }}</p>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Número de Cuenta</label>
                  <p class="text-sm font-mono text-gray-900 dark:text-white">{{ cuentaSeleccionada.num_cuenta }}</p>
                </div>
                
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tipo de Cuenta</label>
                  <p class="text-sm text-gray-900 dark:text-white">{{ cuentaSeleccionada.tipo }}</p>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex space-x-3">
              <button
                @click="editarCuenta(cuentaSeleccionada)"
                class="flex-1 py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              <button
                @click="confirmarEliminarCuenta(cuentaSeleccionada)"
                class="flex-1 py-2 px-4 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal de Confirmación -->
    <Transition name="fade">
      <div v-if="mostrarModalConfirmacion" class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.self="mostrarModalConfirmacion = false"></div>
        <Transition name="modal">
        
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-[85%] sm:max-w-sm max-h-[90vh] overflow-y-auto relative z-10 mx-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-black text-gray-900 dark:text-white">{{ tituloConfirmacion }}</h3>
              <button @click="mostrarModalConfirmacion = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="p-4">
            <div class="text-center mb-6">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 mb-4">
                <svg class="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {{ mensajeConfirmacion }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <!-- Buttons -->
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="mostrarModalConfirmacion = false"
                class="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button"
                @click="ejecutarAccionConfirmada"
                class="flex-1 py-2 px-4 bg-red-600 text-white font-medium text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                Confirmar
              </button>
            </div>
          </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>

  <!-- Modal de búsqueda de usuario -->
  <Transition name="fade" mode="out-in">
    <div v-if="mostrarModalBuscarUsuario" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="cerrarModalBuscarUsuario">
          <div class="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
                  Buscar Usuario
                </h3>
                
                <div class="mt-2">
                  <div class="relative">
                    <input
                      v-model="terminoBusquedaUsuario"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pr-10"
                      placeholder="Buscar por nombre"
                    />
                    <div class="absolute right-2 top-1/2 -translate-y-1/2">
                      <div v-if="buscandoUsuarios" class="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-500"></div>
                    </div>
                  </div>

                  <div v-if="buscandoUsuarios && usuariosEncontrados.length === 0" class="mt-4 text-center py-4">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Buscando usuarios...</p>
                  </div>

                  <div v-else-if="!buscandoUsuarios && usuariosEncontrados.length === 0 && terminoBusquedaUsuario" class="mt-4 text-center py-4">
                    <p class="text-sm text-gray-600 dark:text-gray-300">No se encontraron usuarios que coincidan con la búsqueda</p>
                  </div>

                  <ul v-else-if="usuariosEncontrados.length > 0" class="mt-4 max-h-60 overflow-y-auto">
                    <li 
                      v-for="usuario in usuariosEncontrados" 
                      :key="usuario.id_usuario"
                      class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer flex items-center"
                      @click="seleccionarUsuario(usuario)"
                    >
                      <div class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                        {{ usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : 'U' }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ usuario.nombre || 'Sin nombre' }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="cerrarModalBuscarUsuario"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { debounce } from 'lodash';
import { useAuthStore } from '~/middleware/auth.store'
import { useHead, useCookie, useRuntimeConfig } from '#imports';
import { useRouter, useRoute } from 'vue-router'

// ===== CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter();
const route = useRoute();

// Componentes 
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue' 

// SEO y Meta
useHead({
  title: 'HogarSeguro - Configuraciones',
  meta: [
    { name: 'description', content: 'Configuraciones del sistema HogarSeguro - Administrar configuraciones' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isSaving = ref(false)
const referidorPredeterminado = ref(null)

// Variables para búsqueda de usuarios
const mostrarModalBuscarUsuario = ref(false)
const terminoBusquedaUsuario = ref('')
const buscandoUsuarios = ref(false)
const usuariosEncontrados = ref([])

// Watcher para el término de búsqueda con debounce
watch(terminoBusquedaUsuario, (newVal) => {
  if (newVal) {
    buscarUsuarios();
  } else {
    usuariosEncontrados.value = [];
  }
});

// Configurar el debounce para la búsqueda
const buscarUsuarios = debounce(async () => {
  if (!terminoBusquedaUsuario.value.trim()) {
    usuariosEncontrados.value = []
    return
  }

  buscandoUsuarios.value = true
  try {
    const response = await $api(`/usuarios/${encodeURIComponent(terminoBusquedaUsuario.value)}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    usuariosEncontrados.value = Array.isArray(response) ? response : [response];
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    showToastMessage('Error al buscar usuarios', 'error');
    usuariosEncontrados.value = [];
  } finally {
    buscandoUsuarios.value = false;
  }
}, 500); // 500ms de debounce

// ===== CONFIGURACIONES INDIVIDUALES =====
const configuracionMembresia = ref(0)
const configuracionVisita = ref(0)
const configuracionComision = ref(0)
const configuracionTelefono = ref('')
const configuracionEmail = ref('')
const configuracionDescuento = ref(0)
const configuracionReferido = ref(0)
const configuracionRetiro = ref(0)
const configuracionRetiroMinimo = ref(0)
const configuracionDiasGracia = ref(14) // Valor por defecto de 14 días

// ===== VALORES ORIGINALES PARA DETECTAR CAMBIOS =====
const valoresOriginales = ref({})
const configuraciones = ref([])

// ===== VARIABLES PARA NOTIFICACIONES =====
const notificaciones = ref([])
const isLoadingNotifications = ref(false)
const mostrarFormularioCrear = ref(false)
const isCreatingNotification = ref(false)
const isDeletingRead = ref(false)

// Formulario nueva notificación
const nuevaNotificacion = ref({
  tipo: '',
  titulo: ''
})

// Modal envío
const mostrarModalEnvio = ref(false)
const notificacionAEnviar = ref(null)
const tipoEnvio = ref('')
const idUsuarioDestino = ref(null)
const nombreRolDestino = ref('')
const isSendingNotification = ref(false)

// Estados para los modales de confirmación
const mostrarModalConfirmacionEliminar = ref(false)
const notificacionAEliminar = ref(null)
const mostrarModalConfirmacionEliminarLeidas = ref(false)
const mostrarModalConfirmacion = ref(false)
const accionConfirmar = ref(null)
const servicioSeleccionado = ref(null)
const mensajeConfirmacion = ref('')
const tituloConfirmacion = ref('')

// Estados para gestión de servicios
const servicios = ref([]);
const serviciosCargando = ref(false);
const servicioEditando = ref(null);
const mostrarModalNuevoServicio = ref(false);
const guardandoServicio = ref(false);
const formServicio = ref({
  nombre: '',
  descripcion: '',
  estado: true
});
const filtroBusqueda = ref('')
const filtroEstado = ref('')

// Estados para gestión de beneficios
const beneficios = ref([]);
const beneficiosCargando = ref(false);
const beneficioEditando = ref(null);
const mostrarModalNuevoBeneficio = ref(false);
const guardandoBeneficio = ref(false);
const formBeneficio = ref({
  mes_requerido: 1,
  tipo_beneficio: '',
  descripcion: ''
});
const filtroBusquedaBeneficios = ref('')

// Estados para gestión de cuentas bancarias
const cuentas = ref([]);
const cuentasCargando = ref(false);
const cuentaEditando = ref(null);
const mostrarModalNuevaCuenta = ref(false);
const mostrarModalDetallesCuenta = ref(false);
const guardandoCuenta = ref(false);
const cuentaSeleccionada = ref(null);
const formCuenta = ref({
  banco: '',
  beneficiario: '',
  num_cuenta: '',
  tipo: '',
  activo: true
});
const filtroBusquedaCuentas = ref('')

// Estados para gestión de ciudades
const ciudades = ref([]);
const ciudadesCargando = ref(false);
const ciudadEditando = ref(null);
const mostrarModalNuevaCiudad = ref(false);
const guardandoCiudad = ref(false);
const formCiudad = ref({
  nombre: ''
});
const filtroBusquedaCiudades = ref('')

// Paginación
const paginacion = ref({
  paginaActual: 1,
  porPagina: 3, // Mostrar solo 3 elementos por página
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para beneficios
const paginacionBeneficios = ref({
  paginaActual: 1,
  porPagina: 3,
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para cuentas
const paginacionCuentas = ref({
  paginaActual: 1,
  porPagina: 4, // Mostrar 4 cuentas por página (2x2)
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// Paginación para ciudades
const paginacionCiudades = ref({
  paginaActual: 1,
  porPagina: 3, // Mostrar 3 ciudades por página
  total: 0,
  totalPaginas: 1,
  paginas: [],
  desde: 0,
  hasta: 0
})

// ===== COMPUTED PARA DETECTAR CAMBIOS =====
const hayChanges = computed(() => {
  return configuracionMembresia.value !== valoresOriginales.value.membresia ||
         configuracionVisita.value !== valoresOriginales.value.visita_tecnico ||
         configuracionComision.value !== valoresOriginales.value.comision_por_servicio ||
         configuracionTelefono.value !== valoresOriginales.value.numero_empresa ||
         configuracionDiasGracia.value !== valoresOriginales.value.dias_gracia ||
         configuracionEmail.value !== valoresOriginales.value.correo_empresa ||
         configuracionDescuento.value !== valoresOriginales.value.porcentaje_descuento ||
         configuracionReferido.value !== valoresOriginales.value.porcentaje_referido ||
         configuracionRetiro.value !== valoresOriginales.value.porcentaje_retiro ||
         configuracionRetiroMinimo.value !== valoresOriginales.value.retiro_minimo
})

const puedeEnviar = computed(() => {
  if (!tipoEnvio.value) return false
  if (tipoEnvio.value === 'usuario') return !!idUsuarioDestino.value
  if (tipoEnvio.value === 'rol') return !!nombreRolDestino.value
  if (tipoEnvio.value === 'global') return true
  return false
})

// Computed para servicios filtrados (sin paginación)
const serviciosFiltrados = computed(() => {
  let resultado = [...servicios.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusqueda.value) {
    const busqueda = filtroBusqueda.value.toLowerCase()
    resultado = resultado.filter(servicio => 
      servicio.nombre.toLowerCase().includes(busqueda) || 
      (servicio.descripcion && servicio.descripcion.toLowerCase().includes(busqueda))
    )
  }
  
  // Aplicar filtro de estado
  if (filtroEstado.value !== '') {
    const estadoFiltro = filtroEstado.value === '1'
    resultado = resultado.filter(servicio => servicio.estado === estadoFiltro)
  }
  
  return resultado
})

// Computed para beneficios filtrados
const beneficiosFiltrados = computed(() => {
  let resultado = [...beneficios.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaBeneficios.value) {
    const busqueda = filtroBusquedaBeneficios.value.toLowerCase()
    resultado = resultado.filter(beneficio => 
      beneficio.tipo_beneficio.toLowerCase().includes(busqueda) || 
      (beneficio.descripcion && beneficio.descripcion.toLowerCase().includes(busqueda))
    )
  }
  
  return resultado
})

// Computed para cuentas filtradas
const cuentasFiltradas = computed(() => {
  let resultado = [...cuentas.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaCuentas.value) {
    const busqueda = filtroBusquedaCuentas.value.toLowerCase()
    resultado = resultado.filter(cuenta => 
      cuenta.banco.toLowerCase().includes(busqueda) || 
      cuenta.beneficiario.toLowerCase().includes(busqueda) ||
      cuenta.num_cuenta.toLowerCase().includes(busqueda) ||
      (cuenta.tipo && cuenta.tipo.toLowerCase().includes(busqueda))
    )
  }
  
  return resultado
})

// Computed para la paginación
const paginacionCalculada = computed(() => {
  const total = serviciosFiltrados.value.length
  const totalPaginas = Math.ceil(total / paginacion.value.porPagina) || 1
  const paginaActual = Math.min(paginacion.value.paginaActual, totalPaginas || 1)
  
  // Calcular índices para la paginación
  const inicio = (paginaActual - 1) * paginacion.value.porPagina
  const fin = inicio + paginacion.value.porPagina
  
  // Calcular páginas para la navegación
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para la paginación de beneficios
const paginacionBeneficiosCalculada = computed(() => {
  const total = beneficiosFiltrados.value.length
  const totalPaginas = Math.ceil(total / paginacionBeneficios.value.porPagina) || 1
  const paginaActual = Math.min(paginacionBeneficios.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionBeneficios.value.porPagina
  const fin = inicio + paginacionBeneficios.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para ciudades filtradas
const ciudadesFiltradas = computed(() => {
  let resultado = [...ciudades.value]
  
  // Aplicar filtro de búsqueda
  if (filtroBusquedaCiudades.value) {
    const busqueda = filtroBusquedaCiudades.value.toLowerCase()
    resultado = resultado.filter(ciudad => 
      ciudad.nombre.toLowerCase().includes(busqueda)
    )
  }
  
  return resultado
})

// Computed para la paginación de ciudades
const paginacionCiudadesCalculada = computed(() => {
  const total = ciudadesFiltradas.value.length
  const totalPaginas = Math.ceil(total / paginacionCiudades.value.porPagina) || 1
  const paginaActual = Math.min(paginacionCiudades.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionCiudades.value.porPagina
  const fin = inicio + paginacionCiudades.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Computed para la paginación de cuentas
const paginacionCuentasCalculada = computed(() => {
  const total = cuentasFiltradas.value.length
  const totalPaginas = Math.ceil(total / paginacionCuentas.value.porPagina) || 1
  const paginaActual = Math.min(paginacionCuentas.value.paginaActual, totalPaginas || 1)
  
  const inicio = (paginaActual - 1) * paginacionCuentas.value.porPagina
  const fin = inicio + paginacionCuentas.value.porPagina
  
  let paginas = []
  if (totalPaginas > 0) {
    let paginaInicial = Math.max(1, paginaActual - 2)
    if (totalPaginas - paginaActual < 2) {
      paginaInicial = Math.max(1, totalPaginas - 4)
    }
    paginas = Array.from(
      { length: Math.min(5, totalPaginas) },
      (_, i) => Math.min(paginaInicial + i, totalPaginas)
    ).filter((pagina, index, array) => !index || pagina > array[index - 1])
  }
  
  return {
    total,
    totalPaginas,
    paginaActual,
    desde: total > 0 ? inicio + 1 : 0,
    hasta: Math.min(fin, total),
    paginas
  }
})

// Servicios paginados
const serviciosPaginados = computed(() => {
  const inicio = (paginacionCalculada.value.paginaActual - 1) * paginacion.value.porPagina
  const fin = inicio + paginacion.value.porPagina
  return serviciosFiltrados.value.slice(inicio, fin)
})

// Beneficios paginados
const beneficiosPaginados = computed(() => {
  const inicio = (paginacionBeneficiosCalculada.value.paginaActual - 1) * paginacionBeneficios.value.porPagina
  const fin = inicio + paginacionBeneficios.value.porPagina
  return beneficiosFiltrados.value.slice(inicio, fin)
})

// Cuentas paginadas
const cuentasPaginadas = computed(() => {
  const inicio = (paginacionCuentasCalculada.value.paginaActual - 1) * paginacionCuentas.value.porPagina
  const fin = inicio + paginacionCuentas.value.porPagina
  return cuentasFiltradas.value.slice(inicio, fin)
})

// Ciudades paginadas
const ciudadesPaginadas = computed(() => {
  const inicio = (paginacionCiudadesCalculada.value.paginaActual - 1) * paginacionCiudades.value.porPagina
  const fin = inicio + paginacionCiudades.value.porPagina
  return ciudadesFiltradas.value.slice(inicio, fin)
})

// Watchers para reiniciar la paginación cuando cambian los filtros
watch([filtroBusqueda, filtroEstado], () => {
  paginacion.value.paginaActual = 1
})

watch([filtroBusquedaBeneficios], () => {
  paginacionBeneficios.value.paginaActual = 1
})

watch([filtroBusquedaCuentas], () => {
  paginacionCuentas.value.paginaActual = 1
})

watch([filtroBusquedaCiudades], () => {
  paginacionCiudades.value.paginaActual = 1
})

// ===== TOAST NOTIFICATION =====
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
});

const showToastMessage = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type,
    duration: 5000
  };
};

// ===== ICONOS PARA TIPOS DE NOTIFICACIÓN =====
const tipoIcono = {
  'informacion': 'ℹ️',
  'advertencia': '⚠️',
  'urgente': '🚨',
  'mantenimiento': '🔧'
}

// ===== FUNCIONES PARA CIUDADES =====
const cargarCiudades = async () => {
  ciudadesCargando.value = true;
  try {
    const response = await $api('/ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (response && Array.isArray(response)) {
      ciudades.value = response.map(ciudad => ({
        ...ciudad,
        nombre: ciudad.nombre_ciudad // Mapear nombre_ciudad a nombre
      }));
    } else {
      showToastMessage('Error al cargar las ciudades', 'error');
    }
  } catch (error) {
    console.error('Error al cargar ciudades:', error);
    showToastMessage('Error al cargar las ciudades', 'error');
  } finally {
    ciudadesCargando.value = false;
  }
}

const editarCiudad = (ciudad) => {
  // Primero cerramos el modal si está abierto
  mostrarModalNuevaCiudad.value = false;
  
  // Usamos nextTick para asegurarnos que el modal se cierre antes de abrirlo de nuevo
  nextTick(() => {
    ciudadEditando.value = ciudad.id_ciudad;
    formCiudad.value = {
      nombre: ciudad.nombre
    };
    // Abrimos el modal después de actualizar los datos
    mostrarModalNuevaCiudad.value = true;
  });
}

const cerrarModalCiudad = () => {
  mostrarModalNuevaCiudad.value = false;
  // Usamos setTimeout para limpiar los datos después de que se cierre la animación del modal
  setTimeout(() => {
    ciudadEditando.value = null;
    formCiudad.value = {
      nombre: ''
    };
  }, 300);
}

const guardarCiudad = async () => {
  guardandoCiudad.value = true;
  try {
    let response;
    
    if (ciudadEditando.value) {
      // Actualizar ciudad existente
      response = await $api(`/ciudad/${ciudadEditando.value}`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ nombre_ciudad: formCiudad.value.nombre })
      });
      
      if (response) {
        showToastMessage('Ciudad actualizada exitosamente', 'success');
      }
    } else {
      // Crear nueva ciudad
      response = await $api('/ciudad', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ nombre_ciudad: formCiudad.value.nombre })
      });
      
      if (response) {
        showToastMessage('Ciudad creada exitosamente', 'success');
      }
    }

    // Cerrar modal y recargar lista
    cerrarModalCiudad();
    await cargarCiudades();
    
  } catch (error) {
    console.error('Error al guardar ciudad:', error);
    showToastMessage('Error al guardar la ciudad', 'error');
  } finally {
    guardandoCiudad.value = false;
  }
}

const confirmarEliminarCiudad = (ciudad) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la ciudad "${ciudad.nombre}"? Esta acción no se puede deshacer.`)) {
    eliminarCiudad(ciudad.id_ciudad);
  }
}

const eliminarCiudad = async (idCiudad) => {
  try {
    await $api(`/ciudad/${idCiudad}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    showToastMessage('Ciudad eliminada exitosamente', 'success');
    await cargarCiudades();
  } catch (error) {
    console.error('Error al eliminar ciudad:', error);
    showToastMessage('Error al eliminar la ciudad', 'error');
  }
}

const cambiarPaginaCiudades = (pagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Validar que la página esté en el rango correcto
  if (pagina < 1 || pagina > paginacionCiudadesCalculada.value.totalPaginas) {
    return;
  }
  
  paginacionCiudades.value.paginaActual = pagina;
}

// ===== FUNCIONES PARA CUENTAS BANCARIAS =====
const cargarCuentas = async () => {
  cuentasCargando.value = true;
  try {
    const response = await $api('/cuentas/todas', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (Array.isArray(response)) {
      cuentas.value = response.map(cuenta => ({
        ...cuenta,
        // Asegurar que activo sea booleano
        activo: Boolean(cuenta.activo)
      }));
    } else {
      showToastMessage('Error al cargar las cuentas bancarias', 'error');
    }
  } catch (error) {
    console.error('Error al cargar cuentas:', error);
    showToastMessage('Error al cargar las cuentas bancarias', 'error');
  } finally {
    cuentasCargando.value = false;
  }
}

const abrirDetallesCuenta = (cuenta) => {
  cuentaSeleccionada.value = cuenta;
  mostrarModalDetallesCuenta.value = true;
}

const cerrarDetallesCuenta = () => {
  mostrarModalDetallesCuenta.value = false;
  setTimeout(() => {
    cuentaSeleccionada.value = null;
  }, 300);
}

const editarCuenta = (cuenta) => {
  // Cerrar modal de detalles si está abierto
  mostrarModalDetallesCuenta.value = false;
  
  // Usar nextTick para asegurarnos que el modal se cierre antes de abrir el de edición
  nextTick(() => {
    cuentaEditando.value = cuenta.id_cuenta;
    formCuenta.value = {
      banco: cuenta.banco,
      beneficiario: cuenta.beneficiario,
      num_cuenta: cuenta.num_cuenta,
      tipo: cuenta.tipo,
      activo: cuenta.activo
    };
    mostrarModalNuevaCuenta.value = true;
  });
}

const cerrarModalCuenta = () => {
  mostrarModalNuevaCuenta.value = false;
  setTimeout(() => {
    cuentaEditando.value = null;
    formCuenta.value = {
      banco: '',
      beneficiario: '',
      num_cuenta: '',
      tipo: '',
      activo: true
    };
  }, 300);
}

const crearCuenta = async () => {
  try {
    const response = await $api('/cuentas', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        banco: formCuenta.value.banco,
        beneficiario: formCuenta.value.beneficiario,
        num_cuenta: formCuenta.value.num_cuenta,
        tipo: formCuenta.value.tipo,
        activo: formCuenta.value.activo ? 1 : 0
      })
    });

    showToastMessage('Cuenta bancaria creada correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al crear cuenta:', error);
    const errorMessage = error.data?.message || 'Error al crear la cuenta bancaria. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const actualizarCuenta = async () => {
  try {
    if (!cuentaEditando.value) {
      throw new Error('No se ha especificado la cuenta a actualizar');
    }

    const datosEnviar = {
      banco: formCuenta.value.banco,
      beneficiario: formCuenta.value.beneficiario,
      num_cuenta: formCuenta.value.num_cuenta,
      tipo: formCuenta.value.tipo,
      activo: formCuenta.value.activo ? 1 : 0
    };

    console.log('Datos enviados al backend:', JSON.stringify(datosEnviar, null, 2));

    const response = await $api(`/cuentas/${cuentaEditando.value}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(datosEnviar)
    }); 

    console.log('Respuesta del servidor:', response);
    showToastMessage('Cuenta bancaria actualizada correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al actualizar cuenta:', error);
    const errorMessage = error.data?.message || 'Error al actualizar la cuenta bancaria. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const guardarCuenta = async () => {
  guardandoCuenta.value = true;
  
  try {
    const esEdicion = !!cuentaEditando.value;
    
    const resultado = esEdicion 
      ? await actualizarCuenta() 
      : await crearCuenta();
    
    if (resultado) {
      await cargarCuentas();
      cerrarModalCuenta();
    }
    
    return resultado;
  } catch (error) {
    console.error('Error en guardarCuenta:', error);
    showToastMessage('Ocurrió un error inesperado', 'error');
    return false;
  } finally {
    guardandoCuenta.value = false;
  }
}

const confirmarEliminarCuenta = (cuenta) => {
  // Cerrar modal de detalles si está abierto
  mostrarModalDetallesCuenta.value = false;
  
  servicioSeleccionado.value = cuenta.id_cuenta;
  tituloConfirmacion.value = 'Eliminar Cuenta Bancaria';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar la cuenta ${cuenta.banco} - ${cuenta.num_cuenta}? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarCuenta(cuenta.id_cuenta);
  mostrarModalConfirmacion.value = true;
}

const eliminarCuenta = async (cuentaId) => {
  if (!cuentaId) {
    console.error('ID de cuenta no válido');
    showToastMessage('Error: No se pudo identificar la cuenta a eliminar', 'error');
    return false;
  }
  
  try {
    const response = await $api(`/cuentas/${cuentaId}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    showToastMessage('Cuenta bancaria eliminada correctamente', 'success');
    await cargarCuentas();
    return true;
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    const errorMessage = error.data?.message || error.message || 'Error al eliminar la cuenta bancaria';
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

const cambiarPaginaCuentas = (nuevaPagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (nuevaPagina < 1 || nuevaPagina > paginacionCuentasCalculada.value.totalPaginas) {
    return false;
  }
  
  paginacionCuentas.value.paginaActual = nuevaPagina;
  
  const cuentasContainer = document.querySelector('.grid.grid-cols-2');
  if (cuentasContainer) {
    cuentasContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== FUNCIONES PARA CONFIGURACIONES =====
const guardarConfiguraciones = async () => {
  try {
    isSaving.value = true
    
    // Detectar cambios y preparar datos para enviar
    const cambios = []
    
    if (configuracionMembresia.value !== valoresOriginales.value.membresia) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'membresia')?.id_config,
        tipo_config: 'membresia',
        valor: configuracionMembresia.value
      })
    }
    
    if (configuracionVisita.value !== valoresOriginales.value.visita_tecnico) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'visita_tecnico')?.id_config,
        tipo_config: 'visita_tecnico',
        valor: configuracionVisita.value
      })
    }
    
    if (configuracionComision.value !== valoresOriginales.value.comision_por_servicio) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'comision_por_servicio')?.id_config,
        tipo_config: 'comision_por_servicio',
        valor: configuracionComision.value
      })
    }
    
    if (configuracionTelefono.value !== valoresOriginales.value.numero_empresa) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'numero_empresa')?.id_config,
        tipo_config: 'numero_empresa',
        valor: configuracionTelefono.value
      })
    }
    
    if (configuracionEmail.value !== valoresOriginales.value.correo_empresa) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'correo_empresa')?.id_config,
        tipo_config: 'correo_empresa',
        valor: configuracionEmail.value
      })
    }
    
    if (configuracionDescuento.value !== valoresOriginales.value.porcentaje_descuento) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_descuento')?.id_config,
        tipo_config: 'porcentaje_descuento',
        valor: configuracionDescuento.value
      })
    }
    
    if (configuracionReferido.value !== valoresOriginales.value.porcentaje_referido) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_referido')?.id_config,
        tipo_config: 'porcentaje_referido',
        valor: configuracionReferido.value
      })
    }
    
    if (configuracionRetiro.value !== valoresOriginales.value.porcentaje_retiro) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'porcentaje_retiro')?.id_config,
        tipo_config: 'porcentaje_retiro',
        valor: configuracionRetiro.value
      })
    }
    
    if (configuracionRetiroMinimo.value !== valoresOriginales.value.retiro_minimo) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'retiro_minimo')?.id_config,
        tipo_config: 'retiro_minimo',
        valor: configuracionRetiroMinimo.value
      })
    }

    if (configuracionDiasGracia.value !== valoresOriginales.value.reset_credito) {
      cambios.push({
        id: configuraciones.value.find(c => c.tipo_config === 'reset_credito')?.id_config || null,
        tipo_config: 'reset_credito',
        valor: configuracionDiasGracia.value
      })
    }

    if (cambios.length === 0) {
      showToastMessage('No hay cambios para guardar', 'info')
      return
    }

    // Hacer peticiones individuales para cada cambio
    const promesas = cambios.map(async (cambio) => {
      const payload = {
        tipo_config: cambio.tipo_config,
        valor: cambio.valor
      }
      
      // Si el cambio tiene un ID, es una actualización (PUT), de lo contrario es nuevo (POST)
      const url = cambio.id ? `/config/${cambio.id}` : '/config/crear'
      const method = cambio.id ? 'PUT' : 'POST'
      
      try {
        const response = await $api(url, {
          baseURL: config.public.apiBase,
          method: method,
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          },
          body: payload
        })
        return response
      } catch (error) {
        console.error(`Error al ${method === 'PUT' ? 'actualizar' : 'crear'} configuración ${cambio.tipo_config}:`, error)
        throw error // Propagar el error para manejarlo en el bloque catch externo
      }
    })

    await Promise.all(promesas)
    
    // Actualizar valores originales después de guardar exitosamente
    await cargarConfiguraciones()
    
    showToastMessage('Configuraciones guardadas exitosamente', 'success')
    
  } catch (error) {
    console.error('Error al guardar configuraciones:', error)
    showToastMessage('Error al guardar las configuraciones', 'error')
  } finally {
    isSaving.value = false
  }
}

const cargarConfiguraciones = async () => {
  isLoading.value = true;
  try { 
    
    const response = await $api('/config', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (Array.isArray(response)) {
      configuraciones.value = response
      
      // Mapeo directo de la respuesta de la API a las variables
      const configMapeo = {
        membresia: 'membresia',
        visita_tecnico: 'visita_tecnico',
        comision_por_servicio: 'comision_por_servicio',
        numero_empresa: 'numero_empresa',
        correo_empresa: 'correo_empresa',
        porcentaje_descuento: 'porcentaje_descuento',
        porcentaje_referido: 'porcentaje_referido',
        porcentaje_retiro: 'porcentaje_retiro',
        retiro_minimo: 'retiro_minimo',
        reset_credito: 'reset_credito'
      }
      
      response.forEach(item => {
        switch(item.tipo_config) {
          case 'membresia':
            configuracionMembresia.value = Number(item.valor) || 0;
            break;
          case 'visita_tecnico':
            configuracionVisita.value = Number(item.valor) || 0;
            break;
          case 'comision_por_servicio':
            configuracionComision.value = Number(item.valor) || 0;
            break;
          case 'numero_empresa':
            configuracionTelefono.value = item.valor?.toString() || '';
            break;
          case 'correo_empresa':
            configuracionEmail.value = item.valor?.toString() || '';
            break;
          case 'porcentaje_descuento':
            configuracionDescuento.value = Number(item.valor) || 0;
            break;
          case 'porcentaje_referido':
            configuracionReferido.value = Number(item.valor) || 0;
            break;
          case 'porcentaje_retiro':
            configuracionRetiro.value = parseFloat(item.valor) || 0
            break;
          case 'retiro_minimo':
            configuracionRetiroMinimo.value = parseFloat(item.valor) || 0
            valoresOriginales.value.retiro_minimo = configuracionRetiroMinimo.value
            break;
          case 'reset_credito':
            configuracionDiasGracia.value = parseInt(item.valor, 10) || 14
            valoresOriginales.value.reset_credito = configuracionDiasGracia.value
            break;
        }
      });
      
      // Guardar valores originales para detectar cambios
      valoresOriginales.value = {
        membresia: configuracionMembresia.value,
        visita_tecnico: configuracionVisita.value,
        comision_por_servicio: configuracionComision.value,
        numero_empresa: configuracionTelefono.value,
        correo_empresa: configuracionEmail.value,
        porcentaje_descuento: configuracionDescuento.value,
        porcentaje_referido: configuracionReferido.value,
        porcentaje_retiro: configuracionRetiro.value,
        retiro_minimo: configuracionRetiroMinimo.value,
        reset_credito: configuracionDiasGracia.value
      } 
    } else {
      console.error('La respuesta de la API no es un array:', response);
      showToastMessage('Error: Formato de respuesta inválido', 'error');
    }
  } catch (error) {
    console.error('Error al cargar configuraciones:', error);
    showToastMessage('Error al cargar las configuraciones. Por favor, recarga la página.', 'error');
  } finally {
    isLoading.value = false;
  }
}

// ===== FUNCIONES PARA BENEFICIOS =====
const cargarBeneficios = async () => {
  beneficiosCargando.value = true;
  try {
    const response = await $api('/membresiabeneficios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (response && response.beneficios) {
      beneficios.value = response.beneficios.map(beneficio => ({
        ...beneficio,
        id_beneficio: beneficio.id_beneficio || beneficio.id
      }));
    } else {
      showToastMessage('Error al cargar los beneficios', 'error');
    }
  } catch (error) {
    console.error('Error al cargar beneficios:', error);
    showToastMessage('Error al cargar los beneficios', 'error');
  } finally {
    beneficiosCargando.value = false;
  }
}

const editarBeneficio = (beneficio) => {
  // Primero cerramos el modal si está abierto
  mostrarModalNuevoBeneficio.value = false;
  
  // Usamos nextTick para asegurarnos que el modal se cierre antes de abrirlo de nuevo
  nextTick(() => {
    beneficioEditando.value = beneficio.id_beneficio;
    formBeneficio.value = {
      mes_requerido: beneficio.mes_requerido,
      tipo_beneficio: beneficio.tipo_beneficio,
      descripcion: beneficio.descripcion
    };
    // Abrimos el modal después de actualizar los datos
    mostrarModalNuevoBeneficio.value = true;
  });
}

const cerrarModalBeneficio = () => {
  mostrarModalNuevoBeneficio.value = false;
  // Usamos setTimeout para limpiar los datos después de que se cierre la animación del modal
  setTimeout(() => {
    beneficioEditando.value = null;
    formBeneficio.value = {
      mes_requerido: 1,
      tipo_beneficio: '',
      descripcion: ''
    };
  }, 300);
}

const crearBeneficio = async () => {
  try {
    const url = '/membresiabeneficios';
    const method = 'POST';
    
    const response = await $api(url, {
      method,
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        mes_requerido: formBeneficio.value.mes_requerido,
        tipo_beneficio: formBeneficio.value.tipo_beneficio,
        descripcion: formBeneficio.value.descripcion
      })
    });

    showToastMessage('Beneficio creado correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al crear beneficio:', error);
    const errorMessage = error.data?.message || 'Error al crear el beneficio. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const actualizarBeneficio = async () => {
  try {
    if (!beneficioEditando.value) {
      throw new Error('No se ha especificado el beneficio a actualizar');
    }

    const url = `/membresiabeneficios/${beneficioEditando.value}`;
    
    const response = await $api(url, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'X-HTTP-Method-Override': 'PUT'
      },
      body: JSON.stringify({
        mes_requerido: formBeneficio.value.mes_requerido,
        tipo_beneficio: formBeneficio.value.tipo_beneficio,
        descripcion: formBeneficio.value.descripcion,
        _method: 'PUT' // Para compatibilidad con Laravel
      })
    }); 
    showToastMessage('Beneficio actualizado correctamente', 'success');
    return true;
  } catch (error) {
    console.error('Error al actualizar beneficio:', error);
    const errorMessage = error.data?.message || 'Error al actualizar el beneficio. Por favor, inténtalo de nuevo.';
    showToastMessage(errorMessage, 'error');
    return false;
  }
};

const guardarBeneficio = async () => {
  guardandoBeneficio.value = true;
  
  try {
    const esEdicion = !!beneficioEditando.value;
    
    // Llamar a la función correspondiente
    const resultado = esEdicion 
      ? await actualizarBeneficio() 
      : await crearBeneficio();
    
    if (resultado) {
      await cargarBeneficios();
      cerrarModalBeneficio();
    }
    
    return resultado;
  } catch (error) {
    console.error('Error en guardarBeneficio:', error);
    showToastMessage('Ocurrió un error inesperado', 'error');
    return false;
  } finally {
    guardandoBeneficio.value = false;
  }
}

const confirmarEliminarBeneficio = (beneficio) => {
  servicioSeleccionado.value = beneficio.id_beneficio;
  tituloConfirmacion.value = 'Eliminar Beneficio';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar el beneficio "${beneficio.tipo_beneficio}"? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarBeneficio(beneficio.id_beneficio);
  mostrarModalConfirmacion.value = true;
}

const eliminarBeneficio = async (beneficioId) => {
  if (!beneficioId) {
    console.error('ID de beneficio no válido');
    showToastMessage('Error: No se pudo identificar el beneficio a eliminar', 'error');
    return false;
  }
  
  try {
    const response = await $api(`/membresiabeneficios/${beneficioId}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response.success) {
      showToastMessage('Beneficio eliminado correctamente', 'success');
      await cargarBeneficios();
      return true;
    } else {
      throw new Error(response.message || 'Error al eliminar el beneficio');
    }
  } catch (error) {
    console.error('Error al eliminar beneficio:', error);
    const errorMessage = error.data?.message || error.message || 'Error al eliminar el beneficio';
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

const cambiarPaginaBeneficios = (nuevaPagina, event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  if (nuevaPagina < 1 || nuevaPagina > paginacionBeneficiosCalculada.value.totalPaginas) {
    return false;
  }
  
  paginacionBeneficios.value.paginaActual = nuevaPagina;
  
  const beneficiosContainer = document.querySelector('.space-y-3');
  if (beneficiosContainer) {
    beneficiosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== FUNCIONES PARA BÚSQUEDA DE USUARIOS =====
const abrirModalBuscarUsuario = () => {
  mostrarModalBuscarUsuario.value = true
  terminoBusquedaUsuario.value = ''
  usuariosEncontrados.value = []
}

const cerrarModalBuscarUsuario = () => {
  mostrarModalBuscarUsuario.value = false
  terminoBusquedaUsuario.value = ''
  usuariosEncontrados.value = []
  buscandoUsuarios.value = false
}

const seleccionarUsuario = async (usuario) => {
  try {
    // Primero obtenemos el ID de la configuración existente
    const configResponse = await $api('/config/valor/referidor_predeterminado', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    const configId = configResponse?.id_config;
    
    if (!configId) {
      throw new Error('No se encontró la configuración existente');
    }
    
    // Actualizar el referidor predeterminado en el backend
    const response = await $api(`/config/${configId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        tipo_config: 'referidor_predeterminado',
        valor: usuario.id_usuario.toString()
      })
    });

    // Actualizar el referidor predeterminado localmente
    referidorPredeterminado.value = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre
    };

    showToastMessage('Referente predeterminado actualizado correctamente', 'success');
    cerrarModalBuscarUsuario();
  } catch (error) {
    console.error('Error al actualizar el referente predeterminado:', error);
    showToastMessage('Error al actualizar el referente predeterminado', 'error');
  }
}

// ===== FUNCIONES PARA NOTIFICACIONES =====
const cargarNotificaciones = async () => {
  isLoadingNotifications.value = true
  try {
    const response = await $api('/notificaciones/manuales', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.success) {
      notificaciones.value = response.data
    } else {
      showToastMessage('Error al cargar las notificaciones', 'error')
    }
  } catch (error) {
    console.error('Error al cargar notificaciones:', error)
    showToastMessage('Error al cargar las notificaciones', 'error')
  } finally {
    isLoadingNotifications.value = false
  }
}

const crearNotificacion = async () => {
  if (!nuevaNotificacion.value.titulo?.trim()) {
    showToastMessage('Por favor escribe un título para la notificación', 'error')
    return
  }

  isCreatingNotification.value = true
  try {
    const response = await $api('/notificaciones', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: {
        tipo: 'manual',
        titulo: nuevaNotificacion.value.titulo.trim(),
        creado_por: auth.user?.nombre || 'Administrador'
      }
    })

    if (response.success) {
      showToastMessage('Notificación creada exitosamente', 'success')
      // Resetear formulario
      nuevaNotificacion.value = { titulo: '' }
      mostrarFormularioCrear.value = false
      // Recargar lista
      await cargarNotificaciones()
    } else {
      showToastMessage('Error al crear la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al crear notificación:', error)
    showToastMessage('Error al crear la notificación', 'error')
  } finally {
    isCreatingNotification.value = false
  }
}

const mostrarFormularioEnvio = (notificacion) => {
  notificacionAEnviar.value = notificacion
  mostrarModalEnvio.value = true
  resetearFormularioEnvio()
}

const cerrarModalEnvio = () => {
  mostrarModalEnvio.value = false
  notificacionAEnviar.value = null
  resetearFormularioEnvio()
}

const resetearFormularioEnvio = () => {
  idUsuarioDestino.value = null
  nombreRolDestino.value = ''
}

const enviarNotificacion = async () => {
  if (!puedeEnviar.value) {
    showToastMessage('Por favor completa la información de destino', 'error')
    return
  }

  isSendingNotification.value = true
  
  try {
    const payload = {
      id_notificacion: notificacionAEnviar.value.id_notificacion
    }

    // Configurar según el tipo de envío
    if (tipoEnvio.value === 'usuario') {
      payload.id_usuario = idUsuarioDestino.value
    } else if (tipoEnvio.value === 'rol') {
      payload.nombre_rol = nombreRolDestino.value
    } else if (tipoEnvio.value === 'global') {
      payload.global = true
    }

    const response = await $api('/notificaciones/enviar', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })

    if (response.success) {
      // Mensaje mejorado con información del tipo de envío
      const tipoEnvioTexto = response.data.tipo_envio || 
        (tipoEnvio.value === 'usuario' ? 'usuario individual' : 
         tipoEnvio.value === 'rol' ? `rol ${nombreRolDestino.value}` : 
         'todos los usuarios')
      
      showToastMessage(
        `Notificación enviada exitosamente a ${response.data.cantidad_destinatarios} destinatario(s) - ${tipoEnvioTexto}`, 
        'success'
      )
      
      cerrarModalEnvio()
      
      // Opcional: Recargar lista de notificaciones si existe la función
      if (typeof obtenerNotificaciones === 'function') {
        await obtenerNotificaciones()
      }
    } else {
      showToastMessage(response.message || 'Error al enviar la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error)
    
    // Manejo mejorado de errores
    let errorMessage = 'Error al enviar la notificación'
    
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    showToastMessage(errorMessage, 'error')
  } finally {
    isSendingNotification.value = false
  }
}

// Mostrar modal de confirmación para eliminar notificación individual
const confirmarEliminarNotificacion = (idNotificacion) => {
  notificacionAEliminar.value = idNotificacion
  mostrarModalConfirmacionEliminar.value = true
}

// Eliminar notificación después de confirmación
const eliminarNotificacion = async () => {
  try {
    const response = await $api(`/notificaciones/${notificacionAEliminar.value}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.success) {
      showToastMessage('Notificación eliminada exitosamente', 'success')
      await cargarNotificaciones()
    } else {
      showToastMessage('Error al eliminar la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al eliminar notificación:', error)
    showToastMessage('Error al eliminar la notificación', 'error')
  } finally {
    mostrarModalConfirmacionEliminar.value = false
    notificacionAEliminar.value = null
  }
}

// Mostrar modal de confirmación para eliminar notificaciones leídas
const confirmarEliminarNotificacionesLeidas = () => {
  mostrarModalConfirmacionEliminarLeidas.value = true
}

// Eliminar notificaciones leídas después de confirmación
const eliminarNotificacionesLeidas = async () => {
  isDeletingRead.value = true
  try {
    const response = await $api('/notificaciones/eliminar/leidas', {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.success) {
      showToastMessage(response.message, 'success')
      await cargarNotificaciones()
    } else {
      showToastMessage('Error al eliminar notificaciones leídas', 'error')
    }
  } catch (error) {
    console.error('Error al eliminar notificaciones leídas:', error)
    showToastMessage('Error al eliminar notificaciones leídas', 'error')
  } finally {
    isDeletingRead.value = false
    mostrarModalConfirmacionEliminarLeidas.value = false
  }
}

// ===== FUNCIONES PARA GESTIÓN DE SERVICIOS =====

// Mostrar confirmación para eliminar servicio
function confirmarEliminarServicio(servicio) {
  servicioSeleccionado.value = servicio.id_servicio;
  tituloConfirmacion.value = 'Eliminar Servicio';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`;
  accionConfirmar.value = () => eliminarServicio(servicio.id_servicio);
  mostrarModalConfirmacion.value = true;
}

// Eliminar un servicio
async function eliminarServicio(servicioId) {
  if (!servicioId) {
    console.error('ID de servicio no válido');
    showToastMessage('Error: No se pudo identificar el servicio a eliminar', 'error');
    return false;
  }
  
  try {
    const auth = useAuthStore();
    
    const response = await $api(`/servicios/${servicioId}`, {
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response.success) {
      showToastMessage('Servicio eliminado correctamente', 'success');
      await cargarServicios();
      return true;
    } else {
      throw new Error(response.message || 'Error al eliminar el servicio');
    }
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    const errorMessage = error.data?.message || error.message || 'Error al eliminar el servicio';
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

// Cargar lista de servicios
async function cargarServicios() {
  let data;
  try {
    serviciosCargando.value = true;
    const auth = useAuthStore()
    
    if (!auth.token) {
      throw new Error('No se encontró el token de autenticación');
    }
    
    const response = await $api('/servicios', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (!response) {
      throw new Error('La respuesta del servidor está vacía');
    }
    
    data = response;
    
    if (!Array.isArray(data)) {
      console.warn('Se esperaba un arreglo de servicios, se recibió:', data);
      data = [];
    }
    
    servicios.value = data.map(servicio => ({
      ...servicio,
      // Asegurarse de que el estado sea booleano
      estado: Boolean(servicio.estado)
    }));
    
    return data;
  } catch (error) {
    console.error('Error en cargarServicios:', {
      error: error.message,
      response: data,
      stack: error.stack
    });
    showToastMessage('Error al cargar los servicios', 'error');
    throw error; // Relanzar el error para que pueda ser manejado por el llamador
  } finally {
    serviciosCargando.value = false;
  }
}

// Abrir modal para nuevo servicio
function nuevoServicio() {
  servicioEditando.value = null
  formServicio.value = {
    nombre: '',
    descripcion: '',
    estado: true
  }
  mostrarModalNuevoServicio.value = true
}

// Abrir modal para editar servicio
function editarServicio(servicio) {
  servicioEditando.value = servicio.id_servicio
  formServicio.value = {
    nombre: servicio.nombre,
    descripcion: servicio.descripcion || '',
    estado: servicio.estado
  }
  mostrarModalNuevoServicio.value = true
}

// Cerrar modal de servicio
function cerrarModalServicio() {
  mostrarModalNuevoServicio.value = false
  servicioEditando.value = null
}

// Guardar o actualizar servicio
async function guardarServicio() {
  try {
    guardandoServicio.value = true;
    const auth = useAuthStore();
    
    const url = servicioEditando.value 
      ? `/servicios/${servicioEditando.value}`
      : '/servicios';
    
    const method = servicioEditando.value ? 'PUT' : 'POST';
    
    const response = await $api(url, {
      baseURL: config.public.apiBase,
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        nombre: formServicio.value.nombre,
        descripcion: formServicio.value.descripcion || null,
        estado: formServicio.value.estado ? 1 : 0
      })
    });

    // Usar el mensaje del backend si está disponible
    const successMessage = response?.message || 
      (servicioEditando.value ? 'Servicio actualizado correctamente' : 'Servicio creado correctamente');
    
    showToastMessage(successMessage, 'success');
    
    await cargarServicios();
    cerrarModalServicio();
    
    return true;
    
  } catch (error) {
    console.error('Error al guardar servicio:', error);
    
    // Mostrar mensaje de error más descriptivo
    const errorMessage = error.data?.message || 
                       error.response?._data?.message || 
                       'Error al guardar el servicio. Por favor, inténtalo de nuevo.';
    
    showToastMessage(errorMessage, 'error');
    return false;
  } finally {
    guardandoServicio.value = false;
  }
}

// Mostrar confirmación para cambiar estado
// Función para ejecutar la acción confirmada
async function ejecutarAccionConfirmada() {
  if (accionConfirmar.value) {
    try {
      await accionConfirmar.value();
      showToastMessage('Operación realizada con éxito', 'success');
    } catch (error) {
      console.error('Error al ejecutar la acción:', error);
      showToastMessage('Ocurrió un error al realizar la operación', 'error');
    } finally {
      mostrarModalConfirmacion.value = false;
      accionConfirmar.value = null;
      servicioSeleccionado.value = null;
    }
  }
}

function confirmarCambioEstado(servicio, activar) {
  servicioSeleccionado.value = servicio.id_servicio;
  tituloConfirmacion.value = activar ? 'Activar Servicio' : 'Desactivar Servicio';
  mensajeConfirmacion.value = `¿Estás seguro de que deseas ${activar ? 'activar' : 'desactivar'} el servicio "${servicio.nombre}"?`;
  accionConfirmar.value = () => cambiarEstadoServicio(servicio.id_servicio, activar);
  mostrarModalConfirmacion.value = true;
}

// Cambiar estado de un servicio
async function cambiarEstadoServicio(servicioId, activar) { 
  
  if (servicioId === undefined || servicioId === null || servicioId === '') {
    console.error('ID de servicio no válido (undefined/null/vacío):', servicioId);
    showToastMessage('Error: No se pudo identificar el servicio seleccionado', 'error');
    return false;
  }
  
  try {
    const auth = useAuthStore();
    
    // Realizar la petición al servidor
    const response = await $api(`/servicios/${servicioId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        estado: activar ? 1 : 0
      })
    });
    
    // Usar el mensaje del backend si está disponible
    const successMessage = response?.message || 
      `Servicio ${activar ? 'activado' : 'desactivado'} correctamente`;
    
    showToastMessage(successMessage, 'success');
    
    // Actualizar el estado local
    const index = servicios.value.findIndex(s => s.id_servicio === servicioId);
    if (index !== -1) {
      // Crear un nuevo array para asegurar la reactividad
      servicios.value = [
        ...servicios.value.slice(0, index),
        { 
          ...servicios.value[index], 
          estado: activar,
          // Asegurar que se actualice la fecha de actualización si existe
          updatedAt: new Date().toISOString()
        },
        ...servicios.value.slice(index + 1)
      ];
    }
    
    return true;
    
  } catch (error) {
    console.error('Error al cambiar estado del servicio:', error);
    
    // Mostrar mensaje de error detallado
    const errorMessage = error.data?.message || 
                        error.response?._data?.message || 
                        'Error al cambiar el estado del servicio';
    
    showToastMessage(errorMessage, 'error');
    return false;
  }
}

// Cambiar de página
function cambiarPagina(nuevaPagina, event) {
  // Prevenir el comportamiento por defecto del botón
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Validar que la página esté dentro de los límites
  if (nuevaPagina < 1 || nuevaPagina > paginacionCalculada.value.totalPaginas) {
    return false;
  }
  
  // Actualizar solo la página actual en el estado reactivo
  paginacion.value.paginaActual = nuevaPagina;
  
  // Desplazamiento suave al principio de la lista de servicios
  const serviciosContainer = document.querySelector('.space-y-3');
  if (serviciosContainer) {
    serviciosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  return false;
}

// ===== UTILIDADES =====
const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Cargar referidor predeterminado
const cargarReferidorPredeterminado = async () => {
  try {
    const response = await $api('/config/valor/referidor_predeterminado', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (response && response.usuario) {
      referidorPredeterminado.value = {
        id_usuario: response.usuario.id_usuario,
        nombre: response.usuario.nombre
      };
    } else {
      referidorPredeterminado.value = null;
    }
  } catch (error) {
    console.error('Error al cargar el referidor predeterminado:', error);
    referidorPredeterminado.value = null;
  }
};

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    await Promise.all([
      cargarConfiguraciones(),
      cargarCuentas().catch(error => {
        console.error('Error al cargar cuentas:', error);
        showToastMessage('Error al cargar las cuentas bancarias', 'error');
      }),
      cargarBeneficios().catch(error => {
        console.error('Error al cargar beneficios:', error);
        showToastMessage('Error al cargar los beneficios', 'error');
      }),
      cargarServicios().catch(error => {
        console.error('Error en cargarServicios:', error);
        showToastMessage('Error al cargar los servicios', 'error');
      }),
      cargarCiudades().catch(error => {
        console.error('Error al cargar ciudades:', error);
        showToastMessage('Error al cargar las ciudades', 'error');
      }),
      cargarNotificaciones().catch(error => {
        console.error('Error al cargar notificaciones:', error);
        showToastMessage('Error al cargar las notificaciones', 'error');
      }),
      cargarReferidorPredeterminado().catch(error => {
        console.error('Error al cargar el referidor predeterminado:', error);
        showToastMessage('Error al cargar el referidor predeterminado', 'error');
      })
    ]);
  } catch (error) {
    console.error('Error inesperado al cargar datos iniciales:', error);
    showToastMessage('Error inesperado al cargar los datos', 'error');
  } finally {
    isLoading.value = false;
  }
});

</script>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}

/* Estilos generales */
input, select, textarea {
  font-size: 14px;
}

/* Personalizar scrollbar */
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

/* Transiciones suaves */
* {
  transition: colors 0.3s ease;
}

/* Asegurar que el contenido principal tome el espacio disponible */
.flex-1 {
  flex: 1 1 0%;
}

/* Mejorar espaciado en móvil */
@media (max-width: 640px) {
  .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1rem;
  }
  
  .space-y-5 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1.25rem;
  }
}
</style>