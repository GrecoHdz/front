<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 space-y-2 z-50">
      <Toast
        v-for="toast in toastMessages"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>  
      
      <!-- Loading Spinner -->
      <LoadingSpinner 
        :loading="isLoading || isLoggingOut" 
        :message="isLoggingOut ? 'Cerrando sesión...' : 'Cargando Perfil...'"
      />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
    <HeadersHeaderPerfil/>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-6 pb-6">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-6">
        <div class="flex flex-col items-center text-center mb-6">
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-4xl text-white mb-4 shadow-lg">
            {{ userInitials }}
          </div>
          <h2 class="text-xl font-black text-gray-900 dark:text-white">{{ user.nombre }}</h2>
          <p class="text-emerald-600 dark:text-emerald-400 font-medium">{{ user.email }}</p>
        </div>

        <!-- Membership Status -->
        <div class="mt-4 p-4 rounded-2xl border transition-colors duration-300"
          :class="{
            'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800': isMembershipActive,
            'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800': isMembershipPending,
            'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800': isMembershipExpired,
            'bg-gray-50 border-gray-200 dark:bg-gray-800/50 dark:border-gray-700': isMembershipInactive
          }">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
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
                  <p class="text-sm font-medium"
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
                  <p class="text-sm font-bold truncate"
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
              <div v-if="!isMembershipInactive" class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-1">
                <div 
                  class="h-2 rounded-full transition-all duration-500 ease-in-out"
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
              class="w-full sm:w-auto px-4 py-2 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap self-center sm:self-auto"
              :class="{
                'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700': isMembershipActive && membershipProgress < 80,
                'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600': isMembershipActive && membershipProgress >= 80,
                'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700': isMembershipPending,
                'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700': isMembershipExpired || isMembershipInactive
              }"
              :disabled="isMembershipPending"
            >
              {{ isMembershipPending ? 'Pendiente' : 'Renovar Ahora' }}
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
        <div class="grid grid-cols-2 gap-3 mb-6 pt-3">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span class="text-blue-600 dark:text-blue-400">📅</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Registrado el</p>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatShortDate(user.fecha_registro) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
            <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span class="text-purple-600 dark:text-purple-400">🏙️</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.ciudad || 'No especificada' }}</p>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Información Personal</h3>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Tu nombre completo"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="tu@email.com"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="+504 9999-9999"
            >
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
            <div class="relative">
              <select
                v-model="user.id_ciudad"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white appearance-none pr-10"
              >
                <option :value="null" disabled>Selecciona una ciudad</option>
                <option v-for="ciudad in ciudades" :key="ciudad.id_ciudad" :value="ciudad.id_ciudad">
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
          
          <div class="space-y-2">
            <button 
              @click="isPasswordModalOpen = true"
              type="button"
              class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors duration-200 text-gray-700 dark:text-gray-300"
            >
              <p class="text-sm font-medium">Cambiar Contraseña</p>
            </button>
          </div>
          
          <!-- Modal de Cambio de Contraseña -->
          <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
              <button 
                @click="isPasswordModalOpen = false"
                type="button"
                class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Cerrar modal"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Cambiar Contraseña</h3>
              
              <form @submit.prevent="updatePassword" class="space-y-4">
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
                <div class="space-y-2">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label>
                  <input 
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password" 
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu contraseña actual"
                    autocomplete="current-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-2">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                  <input 
                    id="newPassword"
                    v-model="newPassword"
                    type="password" 
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-2">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password" 
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
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
                  class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isUpdatingPassword">Actualizando...</span>
                  <span v-else>Actualizar Contraseña</span>
                </button>
              </form>
            </div>
          </div>
          
          <div class="flex flex-col space-y-3 pt-2">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-indigo-400"
            >
              <span v-if="isSaving">Guardando...</span>
              <span v-else>Actualizar Perfil</span>
            </button>
            
            <button 
              v-if="newPassword || currentPassword || confirmPassword"
              @click="updatePassword"
              class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      <!-- Legal & About -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Legal y más</h3>
        
        <div class="space-y-3">
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
    <div v-if="showRenewalModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative">
        <button 
          @click="showRenewalModal = false"
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <span class="sr-only">Cerrar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <span class="text-blue-600 dark:text-blue-400 text-xl">💳</span>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Renovar Membresía</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Selecciona una cuenta para realizar el pago</p>
        </div>

        <div class="space-y-4">
          <!-- Costo de la membresía -->
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Costo de la membresía:</span>
              <span v-if="isLoadingMembershipCost" class="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></span>
              <span v-else class="text-lg font-bold text-blue-600 dark:text-blue-400">L. {{ Number(membershipCost).toFixed(2) }}</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Válido por 30 días a partir de hoy</p>
          </div>

          <!-- Selector de cuenta bancaria -->
          <div>
            <label for="bank-account" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cuenta bancaria
            </label>
            <div v-if="isLoadingAccounts" class="py-4 flex justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <div v-else>
              <select
                id="bank-account"
                v-model="selectedAccount"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                :disabled="bankAccounts.length === 0"
              >
                <option v-if="bankAccounts.length === 0" value="" disabled>No hay cuentas registradas</option>
                <option value="" selected disabled>Selecciona una cuenta</option>
                <option 
                  v-for="account in bankAccounts" 
                  :key="account.id_cuenta" 
                  :value="account.id_cuenta"
                >
                  • {{ account.banco }}  
                </option>
              </select>
              <!-- Mostrar detalles de la cuenta seleccionada -->
              <div v-if="selectedAccount" class="space-y-4">
                <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div class="space-y-2">
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Banco:</span>
                      <span class="text-sm text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.banco || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Número de cuenta:</span>
                      <span class="text-sm text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.num_cuenta || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Beneficiario:</span>
                      <span class="text-sm text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.beneficiario || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">Tipo de cuenta:</span>
                      <span class="text-sm text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.tipo || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <!-- Input para el número de comprobante -->
                <div class="space-y-2">
                  <label for="comprobante" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número de comprobante
                  </label>
                  <input
                    id="comprobante"
                    v-model="comprobante"
                    type="text"
                    class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa el número de comprobante"
                    required
                  />
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Por favor ingresa el número de comprobante de tu transferencia o depósito
                  </p>
                </div>
              </div>
              <p v-if="bankAccounts.length === 0" class="mt-1 text-sm text-amber-600 dark:text-amber-400">
                No se encontraron cuentas bancarias
              </p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col space-y-3 pt-2">
            <button
              @click="confirmRenewal"
              :disabled="isRenewing || !selectedAccount || !comprobante || bankAccounts.length === 0"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{'opacity-50 cursor-not-allowed': !selectedAccount || !comprobante}"
            >
              <span v-if="isRenewing" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
              <span v-else>Confirmar Pago</span>
            </button>
            <button
              @click="showRenewalModal = false"
              class="w-full py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Autenticación
const auth = useAuthStore()
const router = useRouter()

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
    const userId = auth.user?.id_usuario
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario')
      return false
    }
     
    
    const data = await $fetch(`/usuarios/id/${userId}`, {
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
      id_usuario: data.id_usuario || userId,
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
const toastMessages = ref([]);
let toastId = 0;

const showToast = (options) => {
  const id = toastId++;
  const toast = {
    id,
    type: 'success',
    duration: 5000,
    ...options
  };
  
  toastMessages.value.push(toast);
  
  // Eliminar el toast después de la duración especificada
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }
  
  return id;
};

const removeToast = (id) => {
  const index = toastMessages.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toastMessages.value.splice(index, 1);
  }
};

// Funciones de conveniencia
const showSuccess = (title, message) => {
  showToast({
    title,
    message,
    type: 'success'
  });};

const showError = (title, message) => {
  showToast({
    title,
    message,
    type: 'error',
    duration: 7000 // Los errores duran un poco más
  });
};

const showInfo = (message) => {
  showToast({
    message,
    type: 'warning',
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
    
    // Mostrar notificación de éxito
    showToast({
      type: 'success',
      message: '¡Perfil actualizado correctamente!',
      duration: 1500
    });
    
    // Recargar la página después de un breve retraso para que se vea el mensaje
    setTimeout(() => {
      window.location.reload();
    }, 1500);
    
  } catch (error) {
    // Obtener el mensaje de error del servidor
    const responseData = error.data || {};
    let errorMessage = 'Error al guardar el perfil';
    
    // Determinar el mensaje de error a mostrar
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error === 'Error de validación' && responseData.field) {
      errorMessage = responseData.message || `Error en el campo ${responseData.field}`;
    }
    
    // Mostrar el mismo mensaje en consola
    console.error('Error al guardar el perfil:', errorMessage);
    
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
    // Luego cargar los datos de la membresía
    return fetchMembershipData();
  }).catch(error => {
    console.error('Error al cargar datos:', error);
  });
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
      num_comprobante: comprobante.value.trim()
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

    // Cerrar el modal y actualizar datos
    showRenewalModal.value = false;
    await fetchMembershipData();
    
    // Mostrar notificación de éxito
    showSuccess(
      '¡Pago enviado!', 
      '¡Pago Enviado! Tu membresía se actualizará una vez lo verifiquemos.'
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

<style scoped>
/* Add any custom styles here if needed */
</style>