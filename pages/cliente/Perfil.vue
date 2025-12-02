<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <!-- Toast Notification -->
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
        :loading="isLoading || isLoggingOut" 
        :message="isLoggingOut ? 'Cerrando sesión...' : 'Cargando Perfil...'"
      />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
    <HeadersHeaderPerfil/>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 pb-4">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-4">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl text-white mb-3 shadow-lg">
            {{ userInitials }}
          </div>
          <h2 class="text-lg font-black text-gray-900 dark:text-white">{{ user.nombre }}</h2>
          <p class="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{{ user.email }}</p>
        </div>

        <!-- Membership Status -->
        <div class="mt-3 p-3 rounded-xl border transition-colors duration-300"
          :class="{
            'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': isMembershipActive,
            'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': isMembershipPending,
            'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800': isMembershipExpired,
            'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700': isMembershipInactive
          }">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="{
                    'bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400': isMembershipActive,
                    'bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400': isMembershipPending,
                    'bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400': isMembershipExpired,
                    'bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400': isMembershipInactive
                  }">
                  <span v-if="isMembershipActive">🏆</span>
                  <span v-else-if="isMembershipPending">⏳</span>
                  <span v-else-if="isMembershipExpired">⚠️</span>
                  <span v-else>🔒</span>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-medium"
                    :class="{
                      'text-blue-800 dark:text-blue-200': isMembershipActive,
                      'text-amber-800 dark:text-amber-200': isMembershipPending,
                      'text-red-800 dark:text-red-200': isMembershipExpired,
                      'text-gray-800 dark:text-gray-200': isMembershipInactive
                    }">
                    {{ isMembershipActive ? 'Membresía activa hasta' : 
                       isMembershipPending ? 'Membresía pendiente' :
                       isMembershipExpired ? 'Membresía vencida' : 'Estado de la membresía' }}
                  </p>
                  <p class="text-xs font-bold truncate"
                    :class="{
                      'text-blue-900 dark:text-white': isMembershipActive,
                      'text-amber-900 dark:text-amber-100': isMembershipPending,
                      'text-red-900 dark:text-red-100': isMembershipExpired,
                      'text-gray-900 dark:text-gray-100': isMembershipInactive
                    }">
                    {{ isMembershipActive ? membershipEndDate : membershipStatus }}
                  </p>
                </div>
              </div>
              
              <!-- Barra de progreso -->
              <div v-if="!isMembershipInactive" class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-1">
                <div 
                  class="h-1.5 rounded-full transition-all duration-500 ease-in-out"
                  :class="{
                    'bg-gradient-to-r from-green-500 to-emerald-600': membershipProgress < 80,
                    'bg-gradient-to-r from-amber-400 to-orange-500': membershipProgress >= 80 && membershipProgress < 95,
                    'bg-gradient-to-r from-red-500 to-pink-600': membershipProgress >= 95
                  }"
                  :style="`width: ${membershipProgress}%`"
                ></div>
              </div>
              
              <div v-if="!isMembershipInactive" class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Inicio: {{ membershipStartDate }}</span>
                <span v-if="membershipProgress > 0 && membershipProgress < 100">{{ membershipProgress }}% completado</span>
                <span v-else-if="membershipProgress >= 100">Expirada</span>
              </div>
            </div>
            
            <button 
              @click="renovarMembresia"
              class="w-full sm:w-auto px-3 py-2 text-white text-xs font-bold rounded-lg transition-all duration-300 shadow-md whitespace-nowrap self-center sm:self-auto flex items-center justify-center"
              :class="{
                'bg-gradient-to-r from-green-400 to-green-500 cursor-not-allowed': isMembershipActive,
                'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5': isMembershipExpired || isMembershipInactive,
                'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed': isMembershipPending,
                'opacity-80': !isMembershipExpired && !isMembershipInactive
              }"
              :disabled="!isMembershipExpired && !isMembershipInactive"
            >
              <svg v-if="isMembershipExpired || isMembershipInactive" class="w-3 h-3 mr-1 animate-pulse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ isMembershipActive ? 'Membresía Activa' : isMembershipPending ? 'Pendiente' : isMembershipInactive ? 'Activar ahora' : 'Renovar Ahora' }}
            </button>
          </div>
          
          <!-- Información adicional para debug -->
          <div v-if="false" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
            <p>ID: {{ membershipData.id }}</p>
            <p>Estado: {{ membershipData.status }}</p>
            <p>Progreso: {{ membershipProgress }}%</p>
          </div>
        </div>

        <!-- User Stats -->
        <div class="grid grid-cols-2 gap-2 mb-4 pt-2">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span class="text-blue-600 dark:text-blue-400 text-sm">📅</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Registrado el</p>
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ formatShortDate(user.fecha_registro) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span class="text-purple-600 dark:text-purple-400 text-sm">🏙️</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ user.ciudad || 'No especificada' }}</p>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-4">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Información Personal</h3>
        
        <div class="space-y-3">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              placeholder="Tu nombre completo"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              placeholder="tu@email.com"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              placeholder="+504 9999-9999"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
            <div class="relative">
              <multiselect
                v-model="selectedCiudadObject"
                :options="ciudades"
                :searchable="false"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Selecciona una ciudad"
                label="nombre"
                track-by="id_ciudad"
                class="multiselect-custom"
                :class="{ 'multiselect--active': selectedCiudadObject }"
                :select-label="''"
                :deselect-label="''"
                :selected-label="''"
                :custom-label="getCiudadLabel"
                :options-limit="100"
                :disabled="ciudades.length === 0"
              >
                <template #singleLabel="{ option }">
                  <span class="text-xs truncate">{{ getCiudadLabel(option) }}</span>
                </template>
              </multiselect>
            </div>
          </div>
          
          <div class="space-y-1">
            <button 
              @click="isPasswordModalOpen = true"
              type="button"
              class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              <p class="text-sm font-medium">Cambiar Contraseña</p>
            </button>
          </div>
          
          <!-- Modal de Cambio de Contraseña -->
          <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-sm relative">
              <button 
                @click="isPasswordModalOpen = false"
                type="button"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Cerrar modal"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Cambiar Contraseña</h3>
              
              <form @submit.prevent="updatePassword" class="space-y-3">
              <!-- Campo de usuario oculto para accesibilidad -->
              <div class="sr-only">
                <label for="username">Nombre de usuario</label>
                <input 
                  id="username"
                  type="text" 
                  :value="user.email"
                  name="username"
                  autocomplete="username"
                  class="hidden"
                  aria-hidden="true"
                >
              </div>
                <div class="space-y-1">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label>
                  <input 
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password" 
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
                    placeholder="Ingresa tu contraseña actual"
                    autocomplete="current-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                  <input 
                    id="newPassword"
                    v-model="newPassword"
                    type="password" 
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
                    placeholder="Ingresa tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password" 
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
                    placeholder="Confirma tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                  >
                  <p v-if="passwordMismatch" class="text-sm text-red-600 dark:text-red-400">Las contraseñas no coinciden</p>
                </div>
                
                <button 
                  type="submit"
                  :disabled="isUpdatingPassword || passwordMismatch"
                  class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <span v-if="isUpdatingPassword">Actualizando...</span>
                  <span v-else>Actualizar Contraseña</span>
                </button>
              </form>
            </div>
          </div>
          
          <div class="flex flex-col space-y-2 pt-2">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-indigo-400 text-sm"
            >
              <span v-if="isSaving">Guardando...</span>
              <span v-else>Actualizar Perfil</span>
            </button>
            
            <button 
              v-if="newPassword || currentPassword || confirmPassword"
              @click="updatePassword"
              class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      <!-- Legal & About -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">Legal y más</h3>
        
        <div class="space-y-2">
          <button 
            @click="isTerminosModalOpen = true"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Términos y condiciones</p>
          </button>
          <button 
            @click="isPrivacidadModalOpen = true"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Política de privacidad</p>
          </button>
          <button 
            @click="isAcercaModalOpen = true"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Acerca de HogarSeguro</p>
          </button>
          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200 flex items-center justify-between"
            :class="{'opacity-70 cursor-not-allowed': isLoggingOut}"
          >
            <span class="text-sm font-medium text-red-600 dark:text-red-400">Cerrar sesión</span>
            <LoadingSpinner v-if="isLoggingOut" class="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div> 
    <FootersFooter />  
    </div>

    <!-- Modal de Renovación de Membresía -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showRenewalModal" class="fixed inset-0 z-50 p-3">
        <!-- Backdrop con animación separada -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to"
        >
          <div 
            v-if="showRenewalModal"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="showRenewalModal = false"
          ></div>
        </Transition>

        <!-- Modal Content con animación separada -->
        <div class="flex items-center justify-center min-h-full">
          <Transition
            name="modal-content"
            enter-active-class="modal-content-enter-active"
            leave-active-class="modal-content-leave-active"
            enter-from-class="modal-content-enter-from"
            leave-to-class="modal-content-leave-to"
          >
            <div 
              v-if="showRenewalModal"
              class="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-sm relative shadow-2xl border border-gray-200 dark:border-gray-700"
              @click.stop
            >
              <!-- Botón de cerrar mejorado -->
              <button 
                @click="showRenewalModal = false"
                type="button"
                class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label="Cerrar modal"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <!-- Header del modal mejorado -->
              <div class="text-center mb-4">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-3 shadow-lg">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h3 class="text-lg font-black text-gray-900 dark:text-white mb-1">Renovar Membresía</h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">Selecciona una cuenta para realizar el pago</p>
              </div>

              <div class="space-y-4 mb-2">
                <!-- Costo de la membresía mejorado -->
                <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-semibold text-blue-800 dark:text-blue-200">Costo de la membresía:</span>
                    <span v-if="isLoadingMembershipCost" class="h-5 w-20 bg-blue-200 dark:bg-blue-700 rounded animate-pulse"></span>
                    <span v-else class="text-lg font-black text-blue-600 dark:text-blue-400">L. {{ Number(membershipCost).toFixed(2) }}</span>
                  </div>
                  <p class="text-xs text-blue-600 dark:text-blue-300 mt-1 font-medium"> Válido por 30 días a partir de hoy</p>
                </div>

                <!-- Selector de cuenta bancaria mejorado -->
                <div class="space-y-2">
                  <label for="bank-account" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Cuenta bancaria
                  </label>
                  <div v-if="isLoadingAccounts" class="py-6 flex flex-col items-center justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Cargando cuentas...</p>
                  </div>
                  <div v-else class="space-y-3">
                    <multiselect
                      id="bank-account"
                      v-model="selectedAccountObject"
                      :options="bankAccounts"
                      :searchable="false"
                      placeholder="Selecciona una cuenta"
                      label="banco"
                      track-by="id_cuenta"
                      class="multiselect-custom"
                      :custom-label="getAccountLabel"
                      :disabled="bankAccounts.length === 0"
                    >
                      <template #singleLabel="{ option }">
                        <span>{{ getAccountLabel(option) }}</span>
                      </template>
                    </multiselect>
                    
                    <!-- Detalles de la cuenta seleccionada con animación -->
                    <Transition
                      name="slide-down"
                      enter-active-class="slide-down-enter-active"
                      leave-active-class="slide-down-leave-active"
                      enter-from-class="slide-down-enter-from"
                      leave-to-class="slide-down-leave-to"
                    >
                      <div v-if="selectedAccount" class="space-y-3">
                        <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detalles de la cuenta:</h4>
                          <div class="space-y-1">
                            <div class="flex justify-between items-center py-1">
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Banco:</span>
                              <span class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.banco || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Cuenta:</span>
                              <span class="text-xs font-mono font-semibold text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.num_cuenta || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Beneficiario:</span>
                              <span class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.beneficiario || 'N/A' }}</span>
                            </div>
                            <div class="flex justify-between items-center py-1">
                              <span class="text-xs font-medium text-gray-600 dark:text-gray-400">Tipo:</span>
                              <span class="text-xs font-semibold text-gray-800 dark:text-gray-100 capitalize">{{ getSelectedAccount?.tipo || 'N/A' }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Input para el número de comprobante mejorado -->
                        <div class="space-y-1">
                          <label for="comprobante" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Número de comprobante
                          </label>
                          <input
                            id="comprobante"
                            v-model="comprobante"
                            type="text"
                            class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200 text-base"
                            placeholder="Ej: 123456789"
                            required
                          />
                          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Ingresa el número de comprobante de tu transferencia o depósito
                          </p>
                        </div>
                      </div>
                    </Transition>
                    
                    <div v-if="bankAccounts.length === 0" class="text-center py-3">
                      <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">⚠️ No se encontraron cuentas bancarias</p>
                    </div>
                  </div>
                </div>

                <!-- Botones de acción mejorados -->
                <div class="flex flex-col space-y-2 pt-3">
                  <button
                    @click="confirmRenewal"
                    :disabled="isRenewing || !selectedAccount || !comprobante || bankAccounts.length === 0"
                    class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-sm"
                    :class="{'opacity-50 cursor-not-allowed': !selectedAccount || !comprobante}"
                  >
                    <span v-if="isRenewing" class="flex items-center justify-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                    <span v-else class="flex items-center justify-center">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Confirmar Pago
                    </span>
                  </button>
                  <button
                    @click="showRenewalModal = false"
                    class="w-full py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>

    <!-- Modal de Términos y Condiciones -->
    <div v-if="isTerminosModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[80vh] overflow-hidden relative shadow-2xl border border-gray-200 dark:border-gray-700">
        <button 
          @click="isTerminosModalOpen = false"
          type="button"
          class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Términos y Condiciones</h3> 
        </div>

        <div class="overflow-y-auto max-h-[60vh] pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">1. Aceptación de los Términos</h4>
            <p>Al utilizar los servicios de HogarSeguro, usted acepta y se compromete a cumplir con estos términos y condiciones. Si no está de acuerdo con alguno de estos términos, por favor no utilice nuestra plataforma.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">2. Descripción del Servicio</h4>
            <p>HogarSeguro es una plataforma tecnológica que conecta a usuarios con técnicos profesionales para servicios de reparación y mantenimiento a domicilio. Nos comprometemos a facilitar la conexión entre clientes y técnicos calificados.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">3. Responsabilidades del Usuario</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Proporcionar información veraz y actualizada</li>
              <li>Mantener un ambiente seguro y respetuoso para los técnicos</li>
              <li>Pagar los servicios acordados en tiempo y forma</li>
              <li>Reportar cualquier problema o incidencia de manera oportuna</li>
              <li>No solicitar servicios ilegales o peligrosos</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">4. Responsabilidades del Técnico</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Contar con la capacitación y herramientas necesarias</li>
              <li>Realizar los servicios con profesionalismo y calidad</li>
              <li>Respetar la privacidad y propiedad del cliente</li>
              <li>Proporcionar presupuestos claros y detallados</li>
              <li>Garantizar la seguridad durante la prestación del servicio</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">5. Membresía y Beneficios</h4>
            <p>
            La membresía de HogarSeguro ofrece beneficios adicionales como descuentos especiales y crédito al pagar servicios.
            Pagos realizados a cuentas no autorizadas no serán reconocidos ni generarán derecho a activación o reclamos. 
            La membresía tiene una duración de 30 días y debe renovarse para mantener los beneficios. 
            Si la membresía vence y no se renueva dentro del período de gracia establecido, el crédito acumulado será reseteado a 0. 
            Este proceso es irreversible.
            </p>
          </section> 
        
          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">6. Pagos y Retiros</h4>
            <p>
            <strong>Pagos autorizados:</strong><br>
            HogarSeguro solo acepta pagos mediante transferencia bancaria a las cuentas oficiales proporcionadas por la plataforma. 
            Cualquier pago realizado en efectivo a técnicos, terceros o a cuentas no autorizadas no será reconocido, no generará crédito, 
            activación de servicios ni derecho a reclamos.
            <br><br> 

            <strong>Créditos acumulados:</strong><br>
            El crédito de los técnicos proviene exclusivamente de la mano de obra correspondiente a los servicios realizados y pagados por el cliente 
            según la cotización aceptada.  
            HogarSeguro únicamente cobra una comisión sobre dicha mano de obra definida por el técnico.
            El crédito de los clientes proviene de los pagos mensuales de su membresía y de un porcentaje generado por los servicios contratados 
            por todos sus referidos.
            <br><br>

            <strong>Solicitudes de retiro:</strong><br>
            Tanto técnicos como clientes pueden solicitar el retiro de su crédito acumulado en cualquier momento.  
            Los retiros serán enviados únicamente a la cuenta bancaria registrada por el usuario y podrán tardar un máximo de 5 días laborales.
            <br><br>

            <strong>Retiros para clientes:</strong><br>
            Los clientes solo pueden retirar los ingresos obtenidos por referidos.  
            Del monto solicitado, un porcentaje será depositado a la cuenta bancaria registrada y el porcentaje restante será dirigido 
            a su crédito acumulable, el cual podrá usarse como crédito al pagar un servicio dentro de la plataforma.
            </p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">7. Privacidad y Protección de Datos</h4>
            <p>Respetamos su privacidad y protegemos sus datos personales de acuerdo con nuestra Política de Privacidad. La información proporcionada se utilizará exclusivamente para la prestación de servicios y mejora de nuestra plataforma.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">8. Limitación de Responsabilidad</h4>
            <p>
              La mayoría de los servicios ofrecidos a través de HogarSeguro son ejecutados por técnicos verificados que forman parte de nuestra plataforma y cuentan con garantía conforme a las condiciones establecidas por HogarSeguro. En situaciones específicas, HogarSeguro podrá actuar únicamente como intermediario, facilitando la conexión entre el usuario y técnicos o proveedores externos. En estos casos, la responsabilidad, calidad y garantía del trabajo recaen exclusivamente en dicho proveedor externo.
              
              Aunque realizamos procesos de verificación para ofrecer servicios confiables, HogarSeguro no será responsable por daños directos o indirectos derivados de la ejecución del servicio, salvo en los casos en que la ley aplicable lo permita o exija. Recomendamos a los usuarios revisar la información y condiciones del técnico asignado antes de aceptar el servicio.
            </p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">9. Propiedad Intelectual</h4>
            <p>Todo el contenido de la plataforma HogarSeguro, incluyendo texto, gráficos, logotipos e imágenes, son propiedad de HogarSeguro y está protegido por las leyes de propiedad intelectual.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">10. Modificaciones de los Términos</h4>
            <p>Podemos modificar estos términos y condiciones en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en la plataforma. Se notificará a los usuarios sobre cambios importantes a través de los medios de contacto proporcionados.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">11. Ley Aplicable y Jurisdicción</h4>
            <p>Estos términos se rigen por las leyes de Honduras. Cualquier disputa será resuelta en los tribunales competentes de San Pedro Sula, Cortés.</p>
          </section>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="isTerminosModalOpen = false"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Política de Privacidad -->
    <div v-if="isPrivacidadModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[80vh] overflow-hidden relative shadow-2xl border border-gray-200 dark:border-gray-700">
        <button 
          @click="isPrivacidadModalOpen = false"
          type="button"
          class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Política de Privacidad</h3> 
        </div>

        <div class="overflow-y-auto max-h-[60vh] pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">1. Información que Recopilamos</h4>
            <p>Recopilamos información personal que usted nos proporciona voluntariamente al registrarse y utilizar nuestros servicios. Esta información incluye:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Nombre completo y datos de contacto (teléfono, email)</li>
              <li>Dirección y ubicación para facilitar los servicios</li>
              <li>Información de pago para procesar transacciones</li>
              <li>Historial de servicios solicitados y realizados</li>
              <li>Comentarios y calificaciones sobre los servicios</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">2. Uso de la Información</h4>
            <p>Utilizamos su información personal para:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Facilitar la conexión con técnicos calificados</li>
              <li>Procesar pagos y gestionar su membresía</li>
              <li>Mejorar la calidad de nuestros servicios</li>
              <li>Enviar notificaciones importantes sobre su cuenta</li>
              <li>Proporcionar soporte técnico y atención al cliente</li>
              <li>Cumplir con obligaciones legales y regulatorias</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">3. Compartir Información</h4>
            <p>Compartimos su información únicamente en las siguientes circunstancias:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Con técnicos asignados para realizar los servicios solicitados</li>
              <li>Con instituciones financieras para procesar pagos</li>
              <li>Con autoridades gubernamentales cuando sea requerido por ley</li>
              <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
            </ul>
            <p class="mt-2">Nunca vendemos ni alquilamos su información personal a terceros con fines comerciales.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">4. Seguridad de los Datos</h4>
            <p>Implementamos medidas de seguridad técnicas y organizativas para proteger su información personal contra acceso no autorizado, pérdida, alteración o destrucción. Estas incluyen:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Encriptación de datos sensibles</li>
              <li>Acceso restringido a la información personal</li>
              <li>Monitoreo constante de nuestras systems</li>
              <li>Capacitación regular de nuestro personal en seguridad</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">5. Derechos del Usuario</h4>
            <p>Usted tiene derecho a:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Acceder a su información personal que poseemos</li>
              <li>Corregir información inexacta o incompleta</li>
              <li>Solicitar la eliminación de sus datos personales</li>
              <li>Limitar el uso de su información</li>
              <li>Portar sus datos a otro proveedor de servicios</li>
              <li>Presentar quejas ante autoridades de protección de datos</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">6. Cookies y Tecnologías Similares</h4>
            <p>Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma. Estas nos permiten:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Mantener su sesión activa</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de nuestra plataforma</li>
              <li>Personalizar contenido y publicidad</li>
            </ul>
            <p class="mt-2">Puede configurar su navegador para rechazar cookies, aunque esto puede afectar algunas funcionalidades de la plataforma.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">7. Retención de Datos</h4>
            <p>Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos para los cuales fue recopilada, incluyendo:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>El período necesario para proporcionar nuestros servicios</li>
              <li>El tiempo requerido por obligaciones legales</li>
              <li>El período necesario para resolver disputas o reclamaciones</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">8. Menores de Edad</h4>
            <p>Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal de menores. Si somos conscientes de haber recopilado información de un menor, tomaremos medidas para eliminarla inmediatamente.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">9. Cambios a esta Política</h4>
            <p>Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o por requisitos legales. Le notificaremos cualquier cambio significativo mediante:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Notificaciones en nuestra plataforma</li>
              <li>Comunicación por correo electrónico</li>
              <li>Avisos destacados en nuestro sitio web</li>
            </ul>
          </section> 
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="isPrivacidadModalOpen = false"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Acerca de HogarSeguro -->
    <div v-if="isAcercaModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[80vh] overflow-hidden relative shadow-2xl border border-gray-200 dark:border-gray-700">
        <button 
          @click="isAcercaModalOpen = false"
          type="button"
          class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          aria-label="Cerrar modal"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Acerca de HogarSeguro</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Tu plataforma de confianza para servicios del hogar</p>
        </div>

        <div class="overflow-y-auto max-h-[60vh] pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <section class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl text-white mb-4 shadow-lg mx-auto">
              🏠
            </div>
            <h4 class="font-semibold text-lg text-gray-900 dark:text-white mb-2">HogarSeguro</h4>
            <p class="text-gray-600 dark:text-gray-400">Conectando hogares con profesionales de confianza</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Nuestra Misión</h4>
            <p>En HogarSeguro, nos dedicamos a facilitar el acceso a servicios técnicos de alta calidad para el hogar, conectando a clientes con profesionales verificados y confiables. Buscamos convertir cada experiencia de servicio en una solución satisfactoria y segura.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Nuestra Visión</h4>
            <p>Ser la plataforma líder en Honduras para servicios del hogar, reconocida por nuestra excelencia en el servicio, la confianza generada en nuestros usuarios y el impacto positivo en la vida de las familias y profesionales técnicos.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">¿Qué Hacemos?</h4>
            <p>HogarSeguro es una plataforma tecnológica que:</p>
            <ul class="list-disc pl-5 space-y-1 mt-2">
              <li>Conecta a clientes con técnicos profesionales calificados</li>
              <li>Verifica la identidad y experiencia de todos nuestros técnicos</li>
              <li>Facilita el proceso de cotización y pago de servicios</li>
              <li>Ofrece un sistema de membresía con beneficios exclusivos</li>
              <li>Proporciona garantía en los servicios realizados</li>
              <li>Brinda soporte continuo a clientes y técnicos</li>
            </ul>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Nuestros Valores</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">• Confianza</h5>
                <p class="text-gray-700 dark:text-gray-300 text-xs">Construimos relaciones basadas en la honestidad y transparencia.</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">• Calidad</h5>
                <p class="text-gray-700 dark:text-gray-300 text-xs">Comprometidos con la excelencia en cada servicio.</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">• Seguridad</h5>
                <p class="text-gray-700 dark:text-gray-300 text-xs">Priorizamos la protección de nuestros usuarios.</p>
              </div>
              <div class="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                <h5 class="font-semibold text-gray-800 dark:text-gray-200 mb-1">• Innovación</h5>
                <p class="text-gray-700 dark:text-gray-300 text-xs">Mejoramos constantemente nuestra tecnología.</p>
              </div>
            </div>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Servicios que Ofrecemos</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Reparaciones eléctricas y plomería</li>
              <li>Servicios de aire acondicionado y refrigeración</li>
              <li>Mantenimiento de electrodomésticos</li>
              <li>Instalaciones y reparaciones generales</li>
              <li>Limpieza y mantenimiento de espacios</li> 
              <li>Y mucho más</li>
            </ul>
          </section> 

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Nuestro Equipo</h4>
            <p>Somos un equipo apasionado de profesionales comprometidos con transformar la forma en que los hogares acceden a servicios técnicos. Contamos con expertos en tecnología, atención al cliente y desarrollo de negocios trabajando juntos para ofrecer la mejor experiencia posible.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Contacto</h4>
            <p>¿Necesitas ayuda? Estamos aquí para asistirte:</p>
            <div class="space-y-2 mt-2">
              <div class="flex items-center space-x-2">
                <span class="text-blue-600 dark:text-blue-400">📧</span>
                <span class="text-sm">{{ contactInfo.find(c => c.type === 'email')?.value || 'soporte@hogarseguro.com' }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-green-600 dark:text-green-400">📱</span>
                <span class="text-sm">{{ contactInfo.find(c => c.type === 'phone')?.value || '+504 1234-5678' }}</span>
              </div> 
            </div>
          </section> 
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="isAcercaModalOpen = false"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

  </div> 
</template>
<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pulse-icon {
  animation: pulse 2s infinite;
  display: inline-block;
}

/* Animaciones del Modal */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.25s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Animaciones del Backdrop */
.backdrop-enter-active {
  transition: all 0.3s ease-out;
}

.backdrop-leave-active {
  transition: all 0.25s ease-in;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Animaciones del Contenido del Modal */
.modal-content-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Animaciones del Slide Down */
.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-down-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  max-height: 0;
}

/* Mejoras visuales adicionales */
.border-3 {
  border-width: 3px;
}

/* Efecto de glassmorphism sutil */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Animación de hover mejorada para botones */
button:hover {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Sombra mejorada para el modal */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Dark mode adjustments */
.dark .shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Estilos para vue-multiselect */
.multiselect-custom {
  position: relative;
  z-index: 10;
}

.multiselect-custom .multiselect__tags {
  min-height: 44px;
  padding: 8px 40px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  font-size: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.dark .multiselect-custom .multiselect__tags {
  background-color: #374151;
  border-color: #4b5563;
  color: white;
}

.multiselect-custom .multiselect__tags:hover {
  border-color: #d1d5db;
}

.dark .multiselect-custom .multiselect__tags:hover {
  border-color: #6b7280;
}

.multiselect-custom.multiselect--active .multiselect__tags {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.multiselect-custom .multiselect__placeholder {
  margin-bottom: 0;
  padding: 0;
  color: #9ca3af;
  font-size: 16px;
}

.dark .multiselect-custom .multiselect__placeholder {
  color: #6b7280;
}

.multiselect-custom .multiselect__single {
  margin-bottom: 0;
  padding: 0;
  color: #111827;
  font-size: 16px;
  font-weight: 500;
}

.dark .multiselect-custom .multiselect__single {
  color: white;
}

.multiselect-custom .multiselect__select {
  padding: 8px 12px;
}

.multiselect-custom .multiselect__select::before {
  border-color: #6b7280 transparent transparent;
  top: 65%;
}

.dark .multiselect-custom .multiselect__select::before {
  border-color: #9ca3af transparent transparent;
}

.multiselect-custom .multiselect__content-wrapper {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 50;
}

.dark .multiselect-custom .multiselect__content-wrapper {
  background-color: #1f2937;
  border-color: #374151;
}

.multiselect-custom .multiselect__content {
  list-style: none;
  padding: 0;
  margin: 0;
}

.multiselect-custom .multiselect__element {
  padding: 0;
}

.multiselect-custom .multiselect__option {
  padding: 12px 16px;
  min-height: 44px;
  font-size: 16px;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s ease;
}

.dark .multiselect-custom .multiselect__option {
  color: #e5e7eb;
}

.multiselect-custom .multiselect__option:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.dark .multiselect-custom .multiselect__option:hover {
  background-color: #374151;
  color: white;
}

.multiselect-custom .multiselect__option--selected {
  background-color: #dbeafe;
  color: #1e40af;
  font-weight: 600;
}

.dark .multiselect-custom .multiselect__option--selected {
    background-color: #4b5563;
    color: #f9fafb;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: #3b82f6;
  color: white;
}

.multiselect-custom .multiselect__option--highlight::after {
  content: '';
}

.multiselect-custom .multiselect__spinner {
  background: transparent;
}

.multiselect-custom .multiselect__spinner::before,
.multiselect-custom .multiselect__spinner::after {
  border-color: #3b82f6 transparent transparent;
}
</style>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect'
const config = useRuntimeConfig()
const { $api } = useNuxtApp();

// SEO and Meta
useHead({
  title: 'HogarSeguro - Perfil',
  meta: [
    { name: 'description', content: 'Perfil de usuario de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// Autenticación
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

// Estados de carga
const isLoading = ref(true)
const isLoggingOut = ref(false)
const isLoadingMembershipData = ref(false)
const isLoadingMembershipCost = ref(false)
const isLoadingAccounts = ref(false) 
const showRenewalModal = ref(false);
const isRenewing = ref(false);
const selectedAccount = ref('');
const selectedAccountObject = ref(null);
const comprobante = ref('');
const showComprobanteInput = ref(false);
const membershipCost = ref(0);  
const bankAccounts = ref([]); 
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isPasswordModalOpen = ref(false)
const isUpdatingPassword = ref(false) 
const ciudades = ref([])
const selectedCiudadObject = ref(null)
const isTerminosModalOpen = ref(false)
const isPrivacidadModalOpen = ref(false)
const isAcercaModalOpen = ref(false)

// Información de contacto de la empresa
const contactInfo = ref([
  {
    type: 'email',
    value: 'cargando...',
    configKey: 'correo_empresa'
  },
  {
    type: 'phone',
    value: 'cargando...',
    configKey: 'numero_empresa'
  }
])

// Función para actualizar un valor específico de contactInfo
const updateContactInfo = (type, newValue) => {
  const index = contactInfo.value.findIndex(item => item.type === type)
  if (index !== -1) {
    contactInfo.value[index].value = newValue
  }
}

// Función para obtener la etiqueta de la ciudad
const getCiudadLabel = (option) => {
  if (!option) return ''
  return option.nombre
}

// Función para obtener la etiqueta de la cuenta bancaria
const getAccountLabel = (option) => {
  if (!option) return ''
  return `🏦 ${option.banco}`
}

// Obtener información de contacto de la empresa
const fetchContactInfo = async () => {
  try {
    // Usar Promise.all para hacer las peticiones en paralelo
    const requests = contactInfo.value.map(async (contact) => {
      try {
        const response = await $api(`/config/valor/${contact.configKey}`, {
          baseURL: config.public.apiBase,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${auth.token}`
          }
        })
        
        // Actualizar el valor correspondiente
        if (response?.valor) {
          updateContactInfo(contact.type, response.valor)
        }
      } catch (error) {
        console.error(`Error al obtener ${contact.type}:`, error)
        // Mostrar un mensaje de error específico para cada campo
        if (contact.type === 'email') {
          updateContactInfo('email', 'soporte@hogarseguro.com')
        } else if (contact.type === 'phone') {
          updateContactInfo('phone', '+504 1234-5678')
        }
      }
    })
    
    await Promise.all(requests)
    
  } catch (error) {
    console.error('Error general al obtener información de contacto:', error)
    // Establecer valores por defecto en caso de error general
    updateContactInfo('email', 'soporte@hogarseguro.com')
    updateContactInfo('phone', '+504 1234-5678')
  }
}

// Cargar ciudades desde la API
const cargarCiudades = async () => {
  try {
    const data = await $api('/ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    }) 
    
    if (Array.isArray(data)) {
      ciudades.value = data.map(ciudad => ({
        id_ciudad: ciudad.id_ciudad,
        nombre: ciudad.nombre_ciudad
      }))
    }
  } catch (error) {
    console.error('Error al cargar las ciudades:', error)
    showError('Error', 'No se pudieron cargar las ciudades')
  }
}

// Datos originales del usuario para comparar cambios
const originalUserData = ref(null);

// Estado para controlar la carga
const isSaving = ref(false);

// Datos del usuario con valores por defecto seguros
const user = ref({
  id_usuario: null,
  nombre: '',
  email: '',
  telefono: '',
  id_ciudad: null,
  ciudad: '',
  fecha_registro: new Date().toISOString(),
  id_rol: null,
  role: 'usuario',
  rol_nombre: 'Usuario',
  membership: {
    status: 'inactiva',
    endDate: new Date().toISOString()
  }
})

const userData = computed(() => auth.user || {})
const userCookie = useCookie('user')

// Obtener datos del usuario desde la API
const fetchUserData = async () => {
  try {
    const userCookie = useCookie('user')
    const userData = userCookie.value
    
    const data = await $api(`/usuarios/id/${userData.id_usuario}`, {
      baseURL: config.public.apiBase,
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Accept': 'application/json'
      }
    })
    
    if (!data) {
      throw new Error('No se recibieron datos del usuario')
    }
    
    // Crear un objeto seguro para actualizar el store
    const safeUserData = {
      ...data,
      nombre: data.nombre || 'Invitado',
      id_usuario: data.id_usuario || userData.id_usuario,
      id_rol: data.id_rol || null,
      id_ciudad: data.id_ciudad || data.ciudad?.id_ciudad || null,
      ciudad: data.ciudad?.nombre_ciudad || data.ciudad || '',
      rol_nombre: data.rol?.nombre_rol || data.rol_nombre || 'Usuario',
      membership: data.membership || {
        status: 'inactiva',
        endDate: new Date().toISOString()
      },
      role: data.role || 'usuario'
    }
    
    
    
    // Actualizar el estado local del usuario
    user.value = {
      ...user.value,
      ...safeUserData,
      fecha_registro: safeUserData.fecha_registro || new Date().toISOString(),
      rol_nombre: safeUserData.rol_nombre || 'Usuario'
    }
    
    
    
    // Actualizar el store de autenticación
    if (auth) {
      await auth.setUser(safeUserData)
    }
    
    return true
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error)
    showError('Error', 'No se pudieron cargar los datos del perfil')
  } finally {
    isLoading.value = false
  }
}

// Cargar datos del perfil
const cargarDatosPerfil = async () => {
  try {
    // Cargar ciudades y datos del usuario en paralelo
    await Promise.all([
      cargarCiudades(),
      fetchUserData()
    ])
    
    return true
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
    showError('Error', 'No se pudo cargar la información del perfil')
    return false
  } finally {
    isLoading.value = false
  }
}

// Verificar si hay cambios en los campos del perfil
const hasChanges = computed(() => {
  if (!originalUserData.value) return false;
  
  return (
    user.value.nombre !== originalUserData.value.nombre ||
    user.value.email !== originalUserData.value.email ||
    user.value.telefono !== originalUserData.value.telefono ||
    user.value.id_ciudad !== originalUserData.value.id_ciudad
  );
});

// Watch para sincronizar user.id_ciudad con selectedCiudadObject
watch(() => user.value.id_ciudad, (newId) => {
  if (newId && ciudades.value.length > 0) {
    const ciudadObject = ciudades.value.find(c => c.id_ciudad === newId);
    if (ciudadObject) {
      selectedCiudadObject.value = ciudadObject;
      user.value.ciudad = ciudadObject.nombre;
    }
  } else {
    selectedCiudadObject.value = null;
    user.value.ciudad = null;
  }
});

// Watch para sincronizar selectedCiudadObject con user.id_ciudad
watch(() => selectedCiudadObject.value, (newCiudad) => {
  if (newCiudad) {
    user.value.id_ciudad = newCiudad.id_ciudad;
    user.value.ciudad = newCiudad.nombre;
  } else {
    user.value.id_ciudad = null;
    user.value.ciudad = null;
  }
});

// Watch para sincronizar selectedAccount con selectedAccountObject
watch(() => selectedAccount.value, (newId) => {
  if (newId && bankAccounts.value.length > 0) {
    const accountObject = bankAccounts.value.find(acc => acc.id_cuenta === newId);
    if (accountObject) {
      selectedAccountObject.value = accountObject;
    }
  } else {
    selectedAccountObject.value = null;
  }
});

// Watch para sincronizar selectedAccountObject con selectedAccount
watch(() => selectedAccountObject.value, (newAccount) => {
  if (newAccount) {
    selectedAccount.value = newAccount.id_cuenta;
  } else {
    selectedAccount.value = '';
  }
});

// Cargar datos al montar el componente
onMounted(async () => {
  await Promise.all([
    cargarDatosPerfil(),
    fetchContactInfo()
  ]);
  // Guardar una copia de los datos originales
  if (user.value) {
    originalUserData.value = { ...user.value };
  }
}) 

// Función para manejar el cierre de sesión
const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.logout();
    // La redirección se manejará en el watch de auth.user
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    toast.value = {
      show: true,
      message: 'Error al cerrar sesión. Por favor, inténtalo de nuevo.',
      type: 'error',
      duration: 3000
    };
  } finally {
    isLoggingOut.value = false;
  }
}

// Computed property para verificar si las contraseñas coinciden
const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value;
}); 
 

// Computed properties
const userInitials = computed(() => {
  if (!user.value?.nombre) return '?'
  try {
    return user.value.nombre
      .split(' ')
      .filter(Boolean) // Eliminar cadenas vacías
      .map(n => n[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2)
  } catch (error) {
    console.error('Error al generar las iniciales:', error)
    return '?'
  }
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

// Format date to short version (DD/MM/YYYY)
const formatShortDate = (dateString) => {
  if (!dateString) return '--/--/----'
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

// Save profile function
// Estado para controlar las notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
});

const showToast = (options) => {
  // Primero ocultar el toast actual
  toast.value.show = false;
  
  // Usar nextTick para asegurar que la actualización del DOM se complete
  nextTick(() => {
    // Actualizar con los nuevos valores
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    };
  });
};

// Funciones de conveniencia
const showSuccess = (title, message) => { 
  const toastMessage = message ? `${title} \n${message}` : title;
  
  showToast({
    message: toastMessage,
    type: 'success',
    duration: 5000
  });  
};

const showError = (title, message) => {
  const errorMessage = message || title;
  console.error('Error:', errorMessage);
  
  showToast({
    message: errorMessage,
    type: 'error',
    duration: 8000 // Los errores duran más para que el usuario los pueda leer
  });
};

const showInfo = (message) => {
  showToast({
    message,
    type: 'info',
    duration: 5000
  });
};

const saveProfile = async () => {
  try {
    const config = useRuntimeConfig();
    
    // Datos que se enviarán al backend
    const userData = {
      nombre: user.value.nombre,
      email: user.value.email,
      telefono: user.value.telefono,
      id_ciudad: user.value.id_ciudad
    }; 
    
    const response = await $api(`/usuarios/${user.value.id_usuario}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      body: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    // Actualizar los datos originales con los nuevos valores
    originalUserData.value = { ...user.value };
    
    // Actualizar la cookie del usuario con los nuevos datos
    const userCookie = useCookie('user')
    userCookie.value = {
      ...userCookie.value, // Mantener los datos existentes
      nombre: user.value.nombre, 
      id_ciudad: user.value.id_ciudad
    } 
    
    // Mostrar notificación de éxito
    showToast({
      type: 'success',
      message: '¡Perfil actualizado correctamente!',
      duration: 1500
    });
    
  } catch (error) {
    console.error('❌ Error en saveProfile:', error)
    
    // Obtener el mensaje de error del servidor
    const responseData = error.data || {};
    let errorMessage = 'Error al guardar el perfil';
    
    // Registrar detalles del error en consola
    
    // Determinar el mensaje de error a mostrar
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error === 'Error de validación' && responseData.field) {
      errorMessage = responseData.message || `Error en el campo ${responseData.field}`;
    } else if (error.statusCode === 500) {
      errorMessage = 'Error interno del servidor. Por favor, intente nuevamente.';
    }
    
    // Mostrar el mismo mensaje en consola
    console.error('❌ Error al guardar el perfil:', errorMessage);
    
    // Mostrar el mensaje de error en el toast
    showToast({
      type: 'error',
      message: errorMessage,
      duration: 5000
    });
  } finally {
    isSaving.value = false;
  }
}

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showToast({
      type: 'error',
      message: 'Las contraseñas no coinciden',
      duration: 3000
    });
    return;
  }
  
  if (!currentPassword.value || !newPassword.value) {
    showToast({
      type: 'error',
      message: 'Por favor completa todos los campos',
      duration: 3000
    });
    return;
  }
  
  try {
    
    const response = await $api(`/usuarios/cambio-clave/${user.value.id_usuario}`, {
      method: 'PUT',
      baseURL: config.public.apiBase,
      body: JSON.stringify({
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    }); 
    
    // Cerrar el modal de contraseña
    isPasswordModalOpen.value = false;
    
    // Limpiar los campos
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    
    // Mostrar mensaje de éxito
    showToast({
      type: 'success',
      message: '¡Contraseña actualizada correctamente!',
      duration: 3000
    });
    
  } catch (error) {
    // No mostrar el error en consola ya que es un flujo controlado
    
    // Mensaje de error por defecto
    let errorMessage = 'Error al actualizar la contraseña. Verifica tu contraseña actual.';
    
    // Manejar diferentes tipos de errores
    if (error.statusCode === 400) {
      if (error.data?.error === 'Contraseña actual incorrecta') {
        errorMessage = 'La contraseña actual es incorrecta. Por favor, inténtalo de nuevo.';
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      }
    } else if (error.statusCode === 404) {
      errorMessage = 'Usuario no encontrado. Por favor, recarga la página e intenta de nuevo.';
    } else if (!navigator.onLine) {
      errorMessage = 'No hay conexión a internet. Por favor, verifica tu conexión.';
    }
    
    // Mostrar el mensaje de error
    showToast({
      type: 'error',
      message: errorMessage,
      duration: 5000
    });
    
    // Limpiar solo la contraseña actual para que el usuario pueda intentar de nuevo
    currentPassword.value = '';
  }
} 

// Membership data
const membershipData = ref({
  endDate: null,
  progress: 0
});

// Función para calcular la fecha de vencimiento (30 días después de la fecha de registro)
const calcularFechaVencimiento = (fechaInicio) => {
  const fecha = new Date(fechaInicio);
  fecha.setDate(fecha.getDate() + 30); // Agregar 30 días
  return fecha;
};

// Función para calcular el progreso de la membresía (0-100%)
const calcularProgreso = (fechaInicio) => {
  const hoy = new Date();
  const fechaInicioObj = new Date(fechaInicio);
  const fechaFinObj = calcularFechaVencimiento(fechaInicio);
  
  // Si la fecha actual es posterior a la fecha de vencimiento, retornar 100%
  if (hoy >= fechaFinObj) return 100;
  
  // Si la fecha actual es anterior a la fecha de inicio, retornar 0%
  if (hoy <= fechaInicioObj) return 0;
  
  // Calcular el porcentaje transcurrido
  const totalDias = (fechaFinObj - fechaInicioObj) / (1000 * 60 * 60 * 24);
  const diasTranscurridos = (hoy - fechaInicioObj) / (1000 * 60 * 60 * 24);
  
  return Math.min(100, Math.max(0, Math.round((diasTranscurridos / totalDias) * 100)));
};

// Función para actualizar el estado de la membresía a vencida
const updateMembershipToExpired = async (membresiaId) => {
  try {
    await $api(`/membresia/${membresiaId}`, {
      baseURL: config.public.apiBase,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: {
        estado: 'vencida'
      }
    }); 
  } catch (error) {
    console.error('Error al actualizar el estado de la membresía:', error);
  }
};

// Obtener y procesar datos de la membresía
const fetchMembershipData = async () => { 
  isLoadingMembershipData.value = true;
  const userId = user.value?.id_usuario;
  if (!userId) {
    // Si no hay usuario, establecer estado inactivo
    membershipData.value = {
      status: 'inactiva',
      progress: 0
    };
    return;
  } 
  
  try {
    const data = await $api(`/membresia/${userId}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    // Verificar si hay datos y si la respuesta es exitosa
    if (data && data.status === 'success' && data.data) {
      const membresia = data.data;      
      // Verificar que la fecha sea válida
      if (!membresia.fecha) {
        console.error('Fecha de membresía no válida:', membresia.fecha);
        throw new Error('Fecha de membresía no válida');
      }
      
      const fechaInicio = new Date(membresia.fecha);
      const fechaVencimiento = calcularFechaVencimiento(membresia.fecha);
      const progreso = calcularProgreso(membresia.fecha);
      
      // Si la membresía está vencida (progreso 100%) pero el estado es 'activa', actualizar estado
      let estado = membresia.estado;
      if (progreso >= 100 && membresia.estado === 'activa') {
        estado = 'vencida';
        // Hacer petición PUT para actualizar el estado en el backend
        await updateMembershipToExpired(membresia.id_membresia);
      }
      
      membershipData.value = {
        id: membresia.id_membresia,
        idCuenta: membresia.id_cuenta,
        numComprobante: membresia.num_comprobante,
        fechaInicio: fechaInicio,
        fechaVencimiento: fechaVencimiento,
        progress: progreso,
        status: estado,
        // Mantener compatibilidad con código existente
        endDate: fechaVencimiento,
        startDate: fechaInicio
      };
      
    } else if (data?.status === 'not_found') {
      // No se encontró membresía para este usuario
      membershipData.value = {
        status: 'inactiva',
        progress: 0
      };
    } else {
      throw new Error('Formato de respuesta inesperado');
    }
    
    return data;
  } catch (error) {
    if (error.response?._data?.status === 'not_found') {
      showInfo('No tienes una membresía activa');
    } else {
      showError('Ocurrió un error al cargar la información de la membresía');
    }
    membershipData.value = {
      status: 'inactiva',
      progress: 0,
      error: error.response?._data?.message || error.message
    };
    
    // Relanzar el error para que pueda ser manejado por el código que llamó a esta función
    throw error;
  } finally {
    isLoadingMembershipData.value = false;
  }
};

// Computed para obtener la cuenta seleccionada
const getSelectedAccount = computed(() => {
  if (!selectedAccount.value) return null;
  return bankAccounts.value.find(acc => acc.id_cuenta === selectedAccount.value) || null;
});

// Obtener el costo de la membresía
const fetchMembershipCost = async () => {
  isLoadingMembershipCost.value = true;
  try {
    const data = await $api('/config/valor/membresia', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });

    if (data) {
      membershipCost.value = data.valor;
    }
  } catch (error) {
    console.error('Error al obtener el costo de la membresía:', error);
  } finally {
    isLoadingMembershipCost.value = false;
  }
};

// Cargar el costo de la membresía al montar el componente
onMounted(() => {
  // Primero cargar el costo
  fetchMembershipCost().then(() => {
    // Luego cargar las cuentas bancarias
    fetchBankAccounts().finally(() => {
      // Finalmente, cargar los datos del perfil
      cargarDatosPerfil().finally(() => {
        // Cargar datos de la membresía
        fetchMembershipData().finally(() => {
          // Verificar el hash de la URL después de cargar todo
          if (process.client && window.location.hash === '#membresia' && (isMembershipExpired.value || isMembershipInactive.value)) {
            // Usar nextTick para asegurar que el DOM esté listo
            nextTick(() => {
              renovarMembresia();
              // Limpiar el hash sin recargar la página
              window.history.replaceState({}, document.title, window.location.pathname);
            });
          }
        });
      });
    });
  });

  // Escuchar cambios en el hash
  const handleHashChange = () => {
    if (process.client && window.location.hash === '#membresia' && (isMembershipExpired.value || isMembershipInactive.value)) {
      renovarMembresia();
      // Limpiar el hash sin recargar la página
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Agregar el event listener
  window.addEventListener('hashchange', handleHashChange);

  // Limpiar event listener al desmontar el componente
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
});

// Obtener cuentas bancarias
const fetchBankAccounts = async () => {
  isLoadingAccounts.value = true;
  try {
    const data = await $api('/cuentas', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    });
    
    if (data) {
      bankAccounts.value = data;
      selectedAccount.value = '';
    }
  } catch (error) {
    console.error('Error al obtener cuentas bancarias:', error);
    showError('Error', 'No se pudieron cargar las cuentas bancarias');
  } finally {
    isLoadingAccounts.value = false;
  }
};

// Membership functions
const renovarMembresia = async () => {
  // Mostrar el modal de renovación
  showRenewalModal.value = true;
  
  // Reiniciar valores
  selectedAccount.value = '';
  comprobante.value = ''; 

  await fetchBankAccounts();
};

const confirmRenewal = async () => {
  if (!selectedAccount.value) {
    showError('Error', 'Por favor selecciona una cuenta bancaria');
    return;
  }
  
  if (!comprobante.value?.trim()) {
    showError('Error', 'Por favor ingresa el número de comprobante');
    return;
  }

  isRenewing.value = true;
  
  try {
    const userId = user.value?.id_usuario;
    if (!userId) {
      throw new Error('No se pudo identificar al usuario');
    }

    const requestData = {
      id_usuario: userId,
      id_cuenta: parseInt(selectedAccount.value),
      num_comprobante: comprobante.value.trim(),
      monto: membershipCost.value
    };

    const data = await $api('/membresia', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: requestData
    });

    // Enviar notificación a administradores
    try {
      await $api('/notificaciones/enviar', {
        method: 'POST',
        baseURL: config.public.apiBase,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          titulo: 'Pago por membresía recibido',
          nombre_rol: 'admin'
        })
      });
       await $api('/notificaciones/enviar', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            titulo: 'Pago por membresía recibido',
            nombre_rol: 'sa'
          })
        });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      // No mostramos error al usuario para no afectar su experiencia
    }

    // Cerrar el modal y actualizar datos
    showRenewalModal.value = false;
    await fetchMembershipData();
    
    // Mostrar notificación de éxito
    showSuccess(
      '¡Pago Enviado!',
      'Tu membresía se actualizará una vez verifiquemos tu pago.'
    );
    
    // Limpiar formulario
    selectedAccount.value = '';
    comprobante.value = '';
    
  } catch (error) {
    showError(
      'Error al procesar la solicitud',
      error.data?.error || error.response?._data?.error || error.message || 'No se pudo completar la operación. Por favor, inténtalo de nuevo.'
    );
  } finally {
    isRenewing.value = false;
  }
}

const membershipEndDate = computed(() => {
  if (membershipData.value.status === 'inactiva') return 'Sin Membresía Activa';
  
  try {
    const fecha = membershipData.value.fechaVencimiento || membershipData.value.endDate;
    if (!fecha) return 'Fecha no disponible';
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Fecha inválida';
  }
});

// Fecha de inicio formateada
const membershipStartDate = computed(() => {
  if (membershipData.value.status === 'inactiva') return 'N/A';
  
  try {
    const fecha = membershipData.value.fechaInicio || membershipData.value.startDate;
    if (!fecha) return 'N/A';
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'N/A';
  }
});

// Estado de la membresía
const membershipStatus = computed(() => {
  const status = membershipData.value.status || 'inactiva';
  
  const statusMap = {
    'activa': 'Activa',
    'pendiente': 'Pendiente de verificación',
    'vencida': 'Vencida',
    'inactiva': 'Inactiva'
  };
  
  return statusMap[status] || 'Inactiva';
});

// Verificación de estado de membresía
const isMembershipActive = computed(() => {
  return membershipData.value.status === 'activa';
});

const isMembershipPending = computed(() => {
  return membershipData.value.status === 'pendiente';
});

const isMembershipExpired = computed(() => {
  return membershipData.value.status === 'vencida' || 
         (membershipData.value.status === 'activa' && membershipData.value.progress >= 100);
});

const isMembershipInactive = computed(() => {
  return !membershipData.value.status || membershipData.value.status === 'inactiva' || membershipData.value.status === 'rechazada';
});

const membershipProgress = computed(() => membershipData.value.progress);

// Dark mode toggle
const darkMode = ref(false)

// Cargar datos de membresía cuando el componente se monte
onMounted(() => {
  if (user.value?.id_usuario) {
    fetchMembershipData();
  }
});

// Watch for dark mode changes
watch(darkMode, (newVal) => {
  if (newVal) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  // Save preference to localStorage
  localStorage.setItem('darkMode', newVal)
})
 
</script> 