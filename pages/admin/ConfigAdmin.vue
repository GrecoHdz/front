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

        <!-- Card 4: Beneficios de Membresía -->
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

        <!-- Card 5: Gestión de Servicios -->
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

        <!-- Card 6: Gestión de Notificaciones -->
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
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useAuthStore } from '~/middleware/auth.store'

// ===== CONFIGURACIÓN =====
const config = useRuntimeConfig()
const auth = useAuthStore()

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

// ===== COMPUTED PARA DETECTAR CAMBIOS =====
const hayChanges = computed(() => {
  return configuracionMembresia.value !== valoresOriginales.value.membresia ||
         configuracionVisita.value !== valoresOriginales.value.visita_tecnico ||
         configuracionComision.value !== valoresOriginales.value.comision_por_servicio ||
         configuracionTelefono.value !== valoresOriginales.value.numero_empresa ||
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

// Watchers para reiniciar la paginación cuando cambian los filtros
watch([filtroBusqueda, filtroEstado], () => {
  paginacion.value.paginaActual = 1
})

watch([filtroBusquedaBeneficios], () => {
  paginacionBeneficios.value.paginaActual = 1
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

    console.log('Cambios detectados para enviar:', cambios)

    if (cambios.length === 0) {
      showToastMessage('No hay cambios para guardar', 'info')
      return
    }

    // Hacer peticiones PUT individuales para cada cambio
    const promesas = cambios.map(async (cambio) => {
      const payload = {
        tipo_config: cambio.tipo_config,
        valor: cambio.valor
      }
      
      console.log(`Enviando PUT a /config/${cambio.id}:`, payload)
      
      const response = await $fetch(`/config/${cambio.id}`, {
        baseURL: config.public.apiBase,
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: payload
      })
      
      console.log(`Respuesta del backend para ${cambio.tipo_config}:`, response)
      return response
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
    console.log('Iniciando carga de configuraciones...');
    
    const response = await $fetch('/config', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    console.log('Respuesta de la API:', response);

    if (Array.isArray(response)) {
      configuraciones.value = response
      
      // Mapeo directo de la respuesta de la API a las variables
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
        retiro_minimo: configuracionRetiroMinimo.value
      }
      
      console.log('Configuraciones cargadas:', valoresOriginales.value);
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
    const response = await $fetch('/membresiabeneficios', {
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
      console.log('Beneficios cargados:', beneficios.value);
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
  console.log('Editando beneficio:', beneficio);
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
    console.log('Modal de edición abierto para ID:', beneficioEditando.value);
  });
}

const cerrarModalBeneficio = () => {
  console.log('Cerrando modal de beneficio');
  mostrarModalNuevoBeneficio.value = false;
  // Usamos setTimeout para limpiar los datos después de que se cierre la animación del modal
  setTimeout(() => {
    beneficioEditando.value = null;
    formBeneficio.value = {
      mes_requerido: 1,
      tipo_beneficio: '',
      descripcion: ''
    };
    console.log('Datos del formulario reiniciados');
  }, 300);
}

const crearBeneficio = async () => {
  try {
    console.log('=== Creando nuevo beneficio ===');
    const url = '/membresiabeneficios';
    const method = 'POST';
    
    const response = await $fetch(url, {
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

    console.log('Beneficio creado:', response);
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

    console.log(`=== Actualizando beneficio ID: ${beneficioEditando.value} ===`);
    const url = `/membresiabeneficios/${beneficioEditando.value}`;
    
    const response = await $fetch(url, {
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

    console.log('Beneficio actualizado:', response);
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
    const response = await $fetch(`/membresiabeneficios/${beneficioId}`, {
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

// ===== FUNCIONES PARA NOTIFICACIONES =====
const cargarNotificaciones = async () => {
  isLoadingNotifications.value = true
  try {
    const response = await $fetch('/notificaciones/manuales', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.success) {
      notificaciones.value = response.data
      console.log('Notificaciones cargadas:', notificaciones.value)
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
    const response = await $fetch('/notificaciones', {
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

    console.log('Enviando al backend:', payload);
    const response = await $fetch('/notificaciones/enviar', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json'
      },
      body: payload
    })
    console.log('Respuesta del backend:', response);

    if (response.success) {
      showToastMessage(`Notificación enviada a ${response.data.cantidad_destinatarios} destinatario(s)`, 'success')
      cerrarModalEnvio()
    } else {
      showToastMessage(response.message || 'Error al enviar la notificación', 'error')
    }
  } catch (error) {
    console.error('Error al enviar notificación:', error)
    showToastMessage('Error al enviar la notificación', 'error')
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
    const response = await $fetch(`/notificaciones/${notificacionAEliminar.value}`, {
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
    const response = await $fetch('/notificaciones/eliminar/leidas', {
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
    
    const response = await $fetch(`/servicios/${servicioId}`, {
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
    
    const response = await $fetch('/servicios', {
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
    
    const response = await $fetch(url, {
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
  console.log('Cambiando estado del servicio. ID:', servicioId, 'Nuevo estado:', activar);
  
  if (servicioId === undefined || servicioId === null || servicioId === '') {
    console.error('ID de servicio no válido (undefined/null/vacío):', servicioId);
    showToastMessage('Error: No se pudo identificar el servicio seleccionado', 'error');
    return false;
  }
  
  try {
    const auth = useAuthStore();
    
    // Realizar la petición al servidor
    const response = await $fetch(`/servicios/${servicioId}`, {
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

// ===== INICIALIZACIÓN =====
onMounted(async () => {
  try {
    await Promise.all([
      cargarConfiguraciones().catch(error => {
        console.error('Error al cargar configuraciones:', error);
        showToastMessage('Error al cargar las configuraciones', 'error');
      }),
      cargarNotificaciones().catch(error => {
        console.error('Error al cargar notificaciones:', error);
        showToastMessage('Error al cargar las notificaciones', 'error');
      }),
      cargarServicios().catch(error => {
        console.error('Error en cargarServicios:', error);
        showToastMessage('Error al cargar los servicios', 'error');
      }),
      cargarBeneficios().catch(error => {
        console.error('Error al cargar beneficios:', error);
        showToastMessage('Error al cargar los beneficios', 'error');
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
