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

    <!-- Main Content -->
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

            <!-- Comisión -->
            <div>
              <label class="block text-[12px] sm:text-xs md:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Comisión por Servicio
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">L.</span>
                <input
                  v-model.number="configuracionComision"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full pl-8 pr-4 py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="70.00">
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

        <!-- Card 4: Gestión de Notificaciones -->
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
              
              <div class="flex gap-2 ml-4">
                <button 
                  @click="mostrarFormularioEnvio(notif)"
                  class="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  Enviar
                </button>
                <button 
                  @click="confirmarEliminarNotificacion(notif.id_notificacion)"
                  class="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación de notificación individual -->
    <div v-if="mostrarModalConfirmacionEliminar" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">¿Eliminar notificación?</h3>
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Esta acción no se puede deshacer. La notificación será eliminada permanentemente.
            </p>
            <div class="mt-6 flex justify-center space-x-4">
              <button 
                type="button" 
                @click="mostrarModalConfirmacionEliminar = false"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                @click="eliminarNotificacion"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para confirmar eliminación de notificaciones leídas -->
    <div v-if="mostrarModalConfirmacionEliminarLeidas" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">¿Eliminar notificaciones leídas?</h3>
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Se eliminarán todas las notificaciones marcadas como leídas. Esta acción no se puede deshacer.
            </p>
            <div class="mt-6 flex justify-center space-x-4">
              <button 
                type="button" 
                @click="mostrarModalConfirmacionEliminarLeidas = false"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                @click="eliminarNotificacionesLeidas"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                :disabled="isDeletingRead"
              >
                <div class="flex items-center">
                  <div v-if="isDeletingRead" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ isDeletingRead ? 'Eliminando...' : 'Eliminar' }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para enviar notificación -->
    <div v-if="mostrarModalEnvio" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Enviar Notificación
            </h3>
            <button @click="cerrarModalEnvio" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <span class="text-2xl">×</span>
            </button>
          </div>
          
          <div class="mb-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              <strong>{{ notificacionAEnviar?.titulo }}</strong>
            </p>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Envío
                </label>
                <select 
                  v-model="tipoEnvio"
                  @change="resetearFormularioEnvio"
                  class="w-full px-3 py-2 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white">
                  <option value="">Seleccionar...</option>
                  <option value="usuario">Usuario Específico</option>
                  <option value="rol">Por Rol</option>
                  <option value="global">Global (Todos)</option>
                </select>
              </div>

              <div v-if="tipoEnvio === 'usuario'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ID del Usuario
                </label>
                <input 
                  v-model.number="idUsuarioDestino"
                  type="number"
                  class="w-full px-3 py-2 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                  placeholder="Ingrese ID del usuario">
              </div>

              <div v-if="tipoEnvio === 'rol'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Rol
                </label>
                <select 
                  v-model="nombreRolDestino"
                  class="w-full px-3 py-2 text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white">
                  <option value="">Seleccionar rol...</option>
                  <option value="admin">Administradores</option>
                  <option value="usuario">Usuarios</option>
                  <option value="tecnico">Técnicos</option>
                </select>
              </div>

              <div v-if="tipoEnvio === 'global'">
                <p class="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  Esta notificación será enviada a todos los usuarios del sistema.
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button 
              @click="enviarNotificacion"
              :disabled="!puedeEnviar || isSendingNotification"
              class="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <div class="flex items-center justify-center">
                <div v-if="isSendingNotification" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {{ isSendingNotification ? 'Enviando...' : 'Enviar' }}
              </div>
            </button>
            <button 
              @click="cerrarModalEnvio"
              class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <FootersFooterAdmin />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
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

// ===== COMPUTED PARA DETECTAR CAMBIOS =====
const hayChanges = computed(() => {
  return configuracionMembresia.value !== valoresOriginales.value.membresia ||
         configuracionVisita.value !== valoresOriginales.value.visita_tecnico ||
         configuracionComision.value !== valoresOriginales.value.comision_por_servicio ||
         configuracionTelefono.value !== valoresOriginales.value.numero_empresa ||
         configuracionEmail.value !== valoresOriginales.value.correo_empresa ||
         configuracionDescuento.value !== valoresOriginales.value.porcentaje_descuento ||
         configuracionReferido.value !== valoresOriginales.value.porcentaje_referido ||
         configuracionRetiro.value !== valoresOriginales.value.porcentaje_retiro
})

const puedeEnviar = computed(() => {
  if (!tipoEnvio.value) return false
  if (tipoEnvio.value === 'usuario') return !!idUsuarioDestino.value
  if (tipoEnvio.value === 'rol') return !!nombreRolDestino.value
  if (tipoEnvio.value === 'global') return true
  return false
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
            configuracionRetiro.value = Number(item.valor) || 0;
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
        porcentaje_retiro: configuracionRetiro.value
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
    await cargarConfiguraciones();
    await cargarNotificaciones();
  } catch (error) {
    console.error('Error en la inicialización:', error);
    showToastMessage('Error al inicializar la configuración', 'error');
  }
});
</script>

<style scoped> 
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