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
        <div class="flex flex-col items-center text-center mb-4">
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
              <select
                v-model="user.id_ciudad"
                class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white appearance-none pr-8 text-base"
              >
                <option :value="null" disabled>Selecciona una ciudad</option>
                <option v-for="ciudad in ciudades" :key="ciudad.id_ciudad" :value="ciudad.id_ciudad" :selected="user.id_ciudad === ciudad.id_ciudad">
                  {{ ciudad.nombre }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
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
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Términos y condiciones</p>
          </button>
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Política de privacidad</p>
          </button>
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
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

              <div class="space-y-4">
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
                    <select
                      id="bank-account"
                      v-model="selectedAccount"
                      class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200 text-base"
                      :disabled="bankAccounts.length === 0"
                    >
                      <option v-if="bankAccounts.length === 0" value="" disabled>No hay cuentas registradas</option>
                      <option value="" selected disabled>Selecciona una cuenta</option>
                      <option 
                        v-for="account in bankAccounts" 
                        :key="account.id_cuenta" 
                        :value="account.id_cuenta"
                      >
                        🏦 {{ account.banco }}
                      </option>
                    </select>
                    
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
</style>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
const config = useRuntimeConfig()

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

// Cargar ciudades desde la API
const cargarCiudades = async () => {
  try {
    const data = await $fetch('/ciudad', {
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
    
    const data = await $fetch(`/usuarios/id/${userData.id_usuario}`, {
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

// Actualizar el nombre de la ciudad cuando cambie el id_ciudad
watch(() => user.value.id_ciudad, (newId) => {
  if (newId) {
    const ciudadSeleccionada = ciudades.value.find(c => c.id_ciudad === newId);
    if (ciudadSeleccionada) {
      user.value.ciudad = ciudadSeleccionada.nombre;
    }
  } else {
    user.value.ciudad = null;
  }
});

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarDatosPerfil();
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
    
    const response = await $fetch(`/usuarios/${user.value.id_usuario}`, {
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
    
    const response = await $fetch(`/usuarios/cambio-clave/${user.value.id_usuario}`, {
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
    await $fetch(`/membresia/${membresiaId}`, {
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
    const data = await $fetch(`/membresia/${userId}`, {
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
    const data = await $fetch('/config/valor/membresia', {
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
    const data = await $fetch('/cuentas', {
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

    const data = await $fetch('/membresia', {
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
      await $fetch('/notificaciones/enviar', {
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
  return !membershipData.value.status || membershipData.value.status === 'inactiva';
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