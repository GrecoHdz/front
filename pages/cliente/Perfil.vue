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
        :message="isLoggingOut ? $t('profile.logging_out') : $t('profile.loading_profile')"
      />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      
    <!-- Invitación a notificaciones push -->
    <UiPushNotificationInvite />

    <HeadersHeaderPerfil/>

    <!-- Main Content -->
    <div class="max-w-2xl mx-auto px-4 pb-4">
      <!-- Profile Card -->
      <div class="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-4 overflow-hidden">
        <!-- Badge de Verificado en la esquina (Keep it simple) -->
        <div v-if="user.identidad_url" class="absolute top-0 right-0 pt-2 pr-2">
          <span class="flex items-center gap-1.5 text-[10px] bg-emerald-500 text-white px-3 py-1.5 rounded-bl-2xl rounded-tr-xl font-black uppercase tracking-widest shadow-lg animate-fade-in">
            <i class="fas fa-check-circle"></i> {{ $t('profile.verified') }}
          </span>
        </div>

        <div class="flex flex-col items-center text-center mb-6">
          <div class="relative group">
            <div 
              @click="isIdentityModalOpen = true"
              class="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl text-white mb-3 shadow-xl overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 border-4 border-white dark:border-gray-800 transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            >
              <img 
                v-if="user.imagen_url" 
                :src="user.imagen_url" 
                alt="Avatar" 
                class="w-full h-full object-cover"
              />
              <div v-else class="flex flex-col items-center justify-center w-full h-full text-white/90 group-hover:scale-110 transition-transform duration-500">
                <div class="relative mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 drop-shadow-sm">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <div class="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce-subtle">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-emerald-600">
                      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                  </div>
                </div> 
              </div>
            </div>
            <button 
              @click="isIdentityModalOpen = true"
              class="absolute -bottom-1 -right-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all border border-gray-100 dark:border-gray-700"
              :title="$t('profile.change_photo')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a48.324 48.324 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
            </button>
          </div>
          <h2 class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ user.nombre }}</h2>
          <div class="flex items-center justify-center">
            <p class="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{{ user.email }}</p>
          </div>
          
          <!-- New Verification Status under Email -->
          <div class="mt-3 flex justify-center">
            <button 
              v-if="!user.identidad_url"
              @click="isIdentityModalOpen = true"
              class="flex items-center gap-2.5 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-blue-200 dark:hover:shadow-none transition-all duration-300 active:scale-95 group relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <div class="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]"></div>
              <span class="text-[10px] font-black uppercase tracking-[0.1em]">{{ $t('profile.verify_identity') }}</span>
              <i class="fas fa-chevron-right text-[8px] group-hover:translate-x-0.5 transition-transform"></i>
            </button>
            <div 
              v-else
              class="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800/30 shadow-sm"
            >
              <div class="flex items-center justify-center w-4 h-4 bg-emerald-500 rounded-full">
                <i class="fas fa-check text-white text-[8px]"></i>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest">{{ $t('profile.verified_account') }}</span>
            </div>
          </div>
        </div>
        


        <!-- User Stats -->
        <div class="grid grid-cols-2 gap-2 mb-4 pt-2">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span class="text-blue-600 dark:text-blue-400 text-sm">📅</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.registered_on') }}</p>
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ formatShortDate(user.fecha_registro) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
            <div class="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span class="text-purple-600 dark:text-purple-400 text-sm">🏙️</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.city') }}</p>
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ user.ciudad || $t('profile.not_specified') }}</p>
          </div>
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
                    {{ isMembershipActive ? $t('profile.membership.active_until') : 
                       isMembershipPending ? $t('profile.membership.pending') :
                       isMembershipExpired ? $t('profile.membership.expired') : $t('profile.membership.status') }}
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
                <span>{{ $t('profile.membership.start') }}: {{ membershipStartDate }}</span>
                <span v-if="membershipProgress > 0 && membershipProgress < 100">{{ membershipProgress }}% {{ $t('profile.membership.completed') }}</span>
                <span v-else-if="membershipProgress >= 100">{{ $t('profile.membership.expired') }}</span>
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
              {{ isMembershipActive ? $t('profile.membership.active') : isMembershipPending ? $t('profile.membership.pending') : isMembershipInactive ? $t('profile.membership.activate_now') : $t('profile.membership.renew_now') }}
            </button>
          </div>
          
          <!-- Información adicional para debug -->
          <div v-if="false" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
            <p>ID: {{ membershipData.id }}</p>
            <p>Estado: {{ membershipData.status }}</p>
            <p>Progreso: {{ membershipProgress }}%</p>
          </div>
        </div> 

      </div> 

      <!-- User Information -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-4">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-4">{{ $t('profile.personal_info') }}</h3>
        
        
        <div class="space-y-3">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.full_name') }}</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              :placeholder="$t('profile.name_placeholder')"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.email') }}</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              :placeholder="$t('profile.email_placeholder')"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.phone') }}</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              :placeholder="$t('profile.phone_placeholder')"
            >
          </div>
          
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.city') }}</label>
            <div class="relative">
              <multiselect
                v-model="selectedCiudadObject"
                :options="ciudades"
                :searchable="false"
                :close-on-select="true"
                :show-labels="true"
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
                  <span class="text-sm truncate">{{ getCiudadLabel(option) }}</span>
                </template>
              </multiselect>
            </div>
          </div>
          
          
          <!-- Modal de Cambio de Contraseña -->
          <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-sm relative">
              <button 
                @click="isPasswordModalOpen = false"
                type="button"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                :aria-label="$t('profile.close_modal')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">{{ $t('profile.change_password') }}</h3>
              
              <form @submit.prevent="updatePassword" class="space-y-3">
              <!-- Campo de usuario oculto para accesibilidad -->
              <div class="sr-only">
                <label for="username">{{ $t('profile.username') }}</label>
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
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.current_password') }}</label>
                  <input 
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password" 
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
                    :placeholder="$t('profile.current_password_placeholder')"
                    autocomplete="current-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.new_password') }}</label>
                  <input 
                    id="newPassword"
                    v-model="newPassword"
                    type="password" 
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
                    :placeholder="$t('profile.new_password_placeholder')"
                    autocomplete="new-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.confirm_password') }}</label>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password" 
                    class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
                    :placeholder="$t('profile.confirm_password_placeholder')"
                    autocomplete="new-password"
                    required
                    :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                  >
                  <p v-if="passwordMismatch" class="text-sm text-red-600 dark:text-red-400">{{ $t('profile.passwords_mismatch') }}</p>
                </div>
                
                <button 
                  type="submit"
                  :disabled="isUpdatingPassword || passwordMismatch"
                  class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <span v-if="isUpdatingPassword">{{ $t('profile.updating') }}</span>
                  <span v-else>{{ $t('profile.update_password') }}</span>
                </button>
              </form>
            </div>
          </div>
          
          <div class="flex flex-col space-y-3 pt-4">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              <i v-if="isSaving" class="fas fa-circle-notch fa-spin"></i>
              <span>{{ isSaving ? $t('profile.saving') : $t('profile.update_info') }}</span>
            </button>
            
              <button 
                @click="isPasswordModalOpen = true"
                type="button"
                class="w-full py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <i class="fas fa-key text-amber-500"></i>
                {{ $t('profile.change_password') }}
              </button>
          </div>
        </div>
      </div>

      <!-- Push Notifications Settings -->
      <div v-if="isSupported" class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-4 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-xl">
              🔔
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ $t('profile.push_notifications') }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.real_time_alerts') }}</p>
            </div>
          </div>
          
          <!-- Toggle Switch -->
          <button 
            @click="handleToggleNotifications"
            :disabled="permission === 'denied'"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            :class="isSubscribed ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
              :class="isSubscribed ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="mt-4">
          <p class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {{ $t('profile.notifications_description') }}
          </p>
          
          <p v-if="permission === 'denied'" class="mt-2 text-[10px] text-red-500 dark:text-red-400">
            ⚠️ {{ $t('profile.notifications_blocked') }}
          </p>
        </div>
      </div>

      <!-- Language Settings -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-4 transition-all duration-300">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-xl">
              🌎
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ $t('profile.language') }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('profile.select_language') }}</p>
            </div>
          </div>
          
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button 
              @click="setLocale('es')"
              class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
              :class="locale === 'es' ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'"
            >
              ES
            </button>
            <button 
              @click="setLocale('en')"
              class="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
              :class="locale === 'en' ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-500 dark:text-gray-400'"
            >
              EN
            </button>
          </div>
        </div>
      </div>

      <!-- Legal & About -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">{{ $t('profile.legal') }}</h3>
        
        <div class="space-y-2">
          <!-- Términos y Condiciones -->
          <button 
            @click.stop="() => { console.log('Opening Terms Modal'); isTerminosModalOpen = true; }"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.terms') }}</p>
          </button>

          <!-- Política de Privacidad -->
          <button 
            @click.stop="() => { console.log('Opening Privacy Modal'); isPrivacidadModalOpen = true; }"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.privacy') }}</p>
          </button>

          <!-- Acerca de -->
          <button 
            @click.stop="() => { console.log('Opening About Modal'); isAcercaModalOpen = true; }"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('profile.about') }}</p>
          </button>
          <!-- App Version Display -->
          <div class="px-3 py-2 mb-2 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Versión de la aplicación</span>
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">v{{ config.public.appVersion }}</span>
          </div>

          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200 flex items-center justify-between"
            :class="{'opacity-70 cursor-not-allowed': isLoggingOut}"
          >
            <span class="text-sm font-medium text-red-600 dark:text-red-400">{{ $t('profile.logout') }}</span>
            <LoadingSpinner v-if="isLoggingOut" class="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div> 
    <FootersFooter />  
    


    <!-- Modal de Renovación de Membresía -->
    <Transition
      name="modal"
      enter-active-class="modal-enter-active"
      leave-active-class="modal-leave-active"
      enter-from-class="modal-enter-from"
      leave-to-class="modal-leave-to"
    >
      <div v-if="showRenewalModal" class="fixed inset-0 z-[70] p-3 flex items-center justify-center">
        <!-- Backdrop con animación separada -->
        <Transition
          name="backdrop"
          enter-active-class="backdrop-enter-active"
          leave-active-class="backdrop-leave-active"
          enter-from-class="backdrop-enter-from"
          leave-to-class="backdrop-leave-to"
        >
          <div 
            class="absolute inset-0 bg-black/60 backdrop-blur-sm"
            @click="showRenewalModal = false"
          ></div>
        </Transition>

        <!-- Modal Content con animación separada -->
        <Transition
          name="modal-content"
          enter-active-class="modal-content-enter-active"
          leave-active-class="modal-content-leave-active"
          enter-from-class="modal-content-enter-from"
          leave-to-class="modal-content-leave-to"
        >
          <div 
            class="bg-white dark:bg-gray-800 rounded-2xl p-5 w-full max-w-sm max-h-[90vh] flex flex-col relative shadow-2xl border border-gray-200 dark:border-gray-700"
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
            <div class="text-center mb-4 flex-shrink-0">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-3 shadow-lg">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white mb-1">Renovar Membresía</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">Selecciona una cuenta para realizar el pago</p>
            </div>

            <div class="overflow-y-auto flex-1 pr-1 space-y-4 mb-2">
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
              <div class="space-y-2 text-left">
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
                        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('profile.membership.account_details') }}:</h4>
                        <div class="space-y-1">
                          <div class="flex justify-between items-center py-1">
                            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('profile.membership.bank') }}:</span>
                            <span class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.banco || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between items-center py-1">
                            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('profile.membership.account_number') }}:</span>
                            <span class="text-xs font-mono font-semibold text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.num_cuenta || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between items-center py-1">
                            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('marketplace.account_details.beneficiary') }}:</span>
                            <span class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ getSelectedAccount?.beneficiario || 'N/A' }}</span>
                          </div>
                          <div class="flex justify-between items-center py-1">
                            <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ $t('auth.city') }}:</span>
                            <span class="text-xs font-semibold text-gray-800 dark:text-gray-100 capitalize">{{ getSelectedAccount?.tipo || 'N/A' }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Input para el número de comprobante mejorado -->
                      <div class="space-y-1">
                        <label for="comprobante" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {{ $t('profile.membership.receipt_number') }}
                        </label>
                        <input
                          id="comprobante"
                          v-model="comprobante"
                          type="text"
                          class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white font-medium transition-all duration-200 text-base"
                          :placeholder="$t('profile.membership.receipt_placeholder')"
                          required
                        />
                        <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {{ $t('profile.membership.receipt_desc') }}
                        </p>
                      </div>
                    </div>
                  </Transition>
                  
                  <div v-if="bankAccounts.length === 0" class="text-center py-3">
                    <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">⚠️ No se encontraron cuentas bancarias</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botones de acción mejorados -->
            <div class="flex flex-col space-y-2 pt-3 flex-shrink-0">
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
                  {{ $t('profile.membership.processing') }}
                </span>
                <span v-else class="flex items-center justify-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ $t('profile.membership.confirm_payment') }}
                </span>
              </button>
              <button
                @click="showRenewalModal = false"
                class="w-full py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] text-sm"
              >
                {{ $t('profile.membership.cancel') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal Unificado: Foto de Perfil + Verificación de Identidad -->
    <Transition name="fade">
      <div v-if="isIdentityModalOpen" @click.self="isIdentityModalOpen = false" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <Transition name="modal">
          <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col">
            <!-- Header -->
            <div class="p-5 pb-3 flex-shrink-0">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <i class="fas fa-shield-alt text-blue-600 dark:text-blue-400 text-lg"></i>
                  <h3 class="text-lg font-black text-gray-900 dark:text-white">Verificación de Cuenta</h3>
                  <svg v-if="user.identidad_url" class="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <button @click="isIdentityModalOpen = false" class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Sube ambas fotografías para completar tu verificación</p>
            </div>

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1 px-5 pb-5 space-y-5">

              <!-- ===== SECCIÓN 1: Foto de Perfil ===== -->
              <div class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                  <i class="fas fa-user-circle text-emerald-600 dark:text-emerald-400 text-sm"></i>
                  <h4 class="text-sm font-bold text-emerald-800 dark:text-emerald-300">Foto de Perfil</h4>
                  <span v-if="user.imagen_url" class="ml-auto text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">✓ Subida</span>
                </div>
                <div class="p-4">
                  <div class="flex items-center gap-4 mb-3">
                    <!-- Preview actual -->
                    <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-emerald-500/20 flex-shrink-0">
                      <img v-if="user.imagen_url" :src="user.imagen_url" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                        <i class="fas fa-user text-2xl"></i>
                      </div>
                    </div>
                    <div class="flex-1 text-xs text-gray-500 dark:text-gray-400">
                      <p>Una foto clara de tu rostro. Esta se mostrará en tu perfil.</p>
                      <p class="mt-1 text-gray-400">Máx. 5MB · JPG, PNG, WEBP</p>
                    </div>
                  </div>
                  <!-- Input file oculto -->
                  <input 
                    type="file" 
                    ref="fileInput" 
                    class="hidden" 
                    accept="image/*"
                    @change="onFileChange"
                  />
                  <button 
                    @click="$refs.fileInput.click()"
                    :disabled="isUploading"
                    class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
                  >
                    <i v-if="isUploading" class="fas fa-circle-notch fa-spin"></i>
                    <i v-else class="fas fa-camera"></i>
                    {{ isUploading ? 'Subiendo...' : (user.imagen_url ? 'Cambiar Foto de Perfil' : 'Subir Foto de Perfil') }}
                  </button>
                </div>
              </div>

              <!-- ===== SECCIÓN 2: Foto de Identificación ===== -->
              <div class="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="bg-blue-50 dark:bg-blue-900/20 px-4 py-2.5 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                  <i class="fas fa-id-card text-blue-600 dark:text-blue-400 text-sm"></i>
                  <h4 class="text-sm font-bold text-blue-800 dark:text-blue-300">Identificación (DNI)</h4>
                  <span v-if="user.identidad_url" class="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                    <i class="fas fa-check-circle"></i> Enviada
                  </span>
                  <span v-else class="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                    Pendiente
                  </span>
                </div>
                <div class="p-4 space-y-3">

                  <!-- Ya existe: solo mostrar imagen + aviso de bloqueo -->
                  <template v-if="user.identidad_url">
                    <div class="aspect-[1.6/1] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border-2 border-emerald-500/20">
                      <img :src="user.identidad_url" class="w-full h-full object-cover pointer-events-none" />
                    </div>
                    <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5">
                      <i class="fas fa-lock text-gray-400 text-sm flex-shrink-0"></i>
                      <p class="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                        Por seguridad, la identificación no puede modificarse una vez enviada.
                      </p>
                    </div>
                  </template>

                  <!-- No existe aún: placeholder + botón de subir (una sola vez) -->
                  <template v-else>
                    <div class="aspect-[1.6/1] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50">
                      <i class="fas fa-cloud-upload-alt text-3xl text-gray-300 mb-1"></i>
                      <span class="text-xs text-gray-400">Sin archivo seleccionado</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Foto clara de tu identificación nacional. Máx. 10MB · JPG, PNG, PDF</p>
                    <input 
                      type="file" 
                      ref="identityFileInput" 
                      class="hidden" 
                      accept="image/*,application/pdf"
                      @change="onIdentityFileChange"
                    />
                    <button 
                      @click="$refs.identityFileInput.click()"
                      :disabled="isUploading"
                      class="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
                    >
                      <i v-if="isUploading" class="fas fa-circle-notch fa-spin"></i>
                      <i v-else class="fas fa-id-card"></i>
                      {{ isUploading ? 'Subiendo...' : 'Subir Identificación' }}
                    </button>
                  </template>
                </div>
              </div>

              <!-- Aviso de privacidad -->
              <div class="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <i class="fas fa-shield-alt text-amber-600 mt-0.5 text-sm"></i>
                <p class="text-[11px] text-amber-700 dark:text-amber-500 leading-tight">
                  Tus datos están protegidos. Esta información solo se utiliza para validar tu identidad y no será compartida con terceros.
                </p>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Modal de Confirmación de Eliminación de Identidad -->
    <Transition name="fade">
      <div v-if="showDeleteIdentityConfirm" @click.self="showDeleteIdentityConfirm = false" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <Transition name="modal">
          <div class="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
            <div class="p-6 text-center">
              <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                <i class="fas fa-trash-alt"></i>
              </div>
              <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">¿Eliminar documento?</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">Esta acción no se puede deshacer y perderás tu estado de verificado.</p>
              
              <div class="flex flex-col gap-2">
                <button 
                  @click="confirmDeleteIdentity" 
                  :disabled="isDeleting"
                  class="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                >
                  {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar documento' }}
                </button>
                <button 
                  @click="showDeleteIdentityConfirm = false" 
                  class="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-sans"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    </div>

    <!-- Modal de Confirmación Desactivar Notificaciones -->
    <Transition name="fade">
      <div v-if="showUnsubscribeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showUnsubscribeModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl w-full max-w-sm relative z-10 border border-gray-100 dark:border-gray-700">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🔕
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('profile.notifications.disable_title') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-2">
              {{ $t('profile.notifications.disable_desc') }}
            </p>
          </div>
          
          <div class="flex flex-col gap-3">
            <button 
              @click="confirmUnsubscribe"
              class="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-200 dark:shadow-none"
            >
              {{ $t('profile.notifications.confirm_disable') }}
            </button>
            <button 
              @click="showUnsubscribeModal = false"
              class="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              {{ $t('profile.notifications.keep_active') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Modal de Confirmación Activar Notificaciones -->
    <Transition name="fade">
      <div v-if="showSubscribeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showSubscribeModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl w-full max-w-sm relative z-10 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-blue-500"></div>
          
          <div class="text-center mb-6 pt-2">
            <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🔔
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('profile.notifications.subscribe_title') }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-2">
              {{ $t('profile.notifications.subscribe_desc') }}
            </p>
          </div>
          
          <div class="flex flex-col gap-3">
            <button 
              @click="confirmSubscribe"
              class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-none"
            >
              {{ $t('profile.notifications.confirm_subscribe') }}
            </button>
            <button 
              @click="showSubscribeModal = false"
              class="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              {{ $t('profile.notifications.not_now') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <!-- Modales Legales relocados para mejor contexto de apilamiento -->
    <!-- Modal de Términos y Condiciones -->
    <div v-if="isTerminosModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] p-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col relative shadow-2xl border border-gray-200 dark:border-gray-700 text-left">
        
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

        <div class="mb-4 flex-shrink-0">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('profile.terms') }}</h3> 
        </div>

        <div class="overflow-y-auto flex-1 pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <template v-if="Array.isArray(tm('profile.terms_content'))">
            <section v-for="(section, index) in tm('profile.terms_content')" :key="index">
              <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">
                {{ index + 1 }}. {{ rt(section.title) }}
              </h4>
              <p v-if="section.text" v-html="rt(section.text)"></p>
              <ul v-if="section.list" class="list-disc pl-5 mt-2 space-y-1">
                <li v-for="(item, i) in section.list" :key="i">
                  {{ rt(item) }}
                </li>
              </ul>
            </section>
          </template>
          <div v-else class="text-center py-10">
            <p>{{ $t('common.error_unexpected') }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="isTerminosModalOpen = false"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Política de Privacidad -->
    <div v-if="isPrivacidadModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] p-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col relative shadow-2xl border border-gray-200 dark:border-gray-700 text-left">
        
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

        <div class="mb-4 flex-shrink-0">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('profile.privacy') }}</h3> 
        </div>

        <div class="overflow-y-auto flex-1 pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <template v-if="Array.isArray(tm('profile.privacy_content'))">
            <section v-for="(section, index) in tm('profile.privacy_content')" :key="index">
              <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">
                {{ index + 1 }}. {{ rt(section.title) }}
              </h4>
              <p v-if="section.text" v-html="rt(section.text)"></p>
              <ul v-if="section.list" class="list-disc pl-5 mt-2 space-y-1">
                <li v-for="(item, i) in section.list" :key="i">
                  {{ rt(item) }}
                </li>
              </ul>
            </section>
          </template>
          <div v-else class="text-center py-10">
            <p>{{ $t('common.error_unexpected') }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="isPrivacidadModalOpen = false"
            class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Acerca de MiSeguro -->
    <div v-if="isAcercaModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] p-3">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col relative shadow-2xl border border-gray-200 dark:border-gray-700 text-left">
        
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

        <div class="mb-4 flex-shrink-0">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ $t('about.title') }}</h3> 
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('about.subtitle') }}</p>
        </div>

        <div class="overflow-y-auto flex-1 pr-2 space-y-6 text-sm text-gray-700 dark:text-gray-300">
          <section class="text-center pb-2">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl text-white mb-3 shadow-lg mx-auto">
              🏠
            </div>
            <p class="text-sm leading-relaxed max-w-md mx-auto">{{ $t('about.hero_desc') }}</p>
          </section>

          <template v-if="Array.isArray(tm('about.content'))">
            <section v-for="(section, index) in tm('about.content')" :key="index">
              <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">
                {{ rt(section.title) }}
              </h4>
              
              <p v-if="section.text" class="mb-2">{{ rt(section.text) }}</p>

              <ul v-if="section.list" class="list-disc pl-5 mt-2 space-y-1">
                <li v-for="(item, i) in section.list" :key="i">
                  {{ rt(item) }}
                </li>
              </ul>

              <div v-if="section.grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div v-for="(val, vIdx) in section.grid" :key="vIdx" class="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                  <h5 class="font-bold text-gray-900 dark:text-white mb-1">{{ rt(val.title) }}</h5>
                  <p class="text-gray-600 dark:text-gray-400 text-xs">{{ rt(val.desc) }}</p>
                </div>
              </div>
            </section>
          </template>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">
              {{ $t('about.contact') }}
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div class="w-8 h-8 flex items-center justify-center text-blue-500">
                  <i class="fas fa-envelope"></i>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Email</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ contactInfo.find(c => c.type === 'email')?.value || 'soporte@MiSeguro.com' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                <div class="w-8 h-8 flex items-center justify-center text-emerald-500">
                  <i class="fas fa-phone-alt"></i>
                </div>
                <div>
                  <p class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Teléfono</p>
                  <p class="text-sm text-gray-900 dark:text-white">{{ contactInfo.find(c => c.type === 'phone')?.value || '+504 3300-0000' }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="mt-4 pt-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
          <button 
            @click="isAcercaModalOpen = false"
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div> 
</template>
<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite ease-in-out;
}

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

/* Animación para el Modal de Desactivar (fade) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animación del contenido (hijo) del modal fade */
.fade-enter-active > div:last-child {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-leave-active > div:last-child {
  transition: all 0.25s ease-in;
}

.fade-enter-from > div:last-child {
  opacity: 0;
  transform: scale(0.85) translateY(20px);
}

.fade-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect'
import { usePushNotifications } from '~/composables/usePushNotifications'
import { useI18n } from 'vue-i18n'

const { t, tm, rt, locale, setLocale } = useI18n()
const config = useRuntimeConfig();
const { $api } = useNuxtApp();

// SEO and Meta
useHead({
  title: t('profile.title') + ' - MiSeguro',
  meta: [
    { name: 'description', content: t('profile.title') + ' - MiSeguro' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// Autenticación
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { subscribe, unsubscribe, isSubscribed, checkSubscription, isSupported, permission } = usePushNotifications()

const showUnsubscribeModal = ref(false)
const showSubscribeModal = ref(false)



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
const isIdentityModalOpen = ref(false);
const showDeleteIdentityConfirm = ref(false);

// Bloquear scroll cuando un modal está abierto
const anyModalOpen = computed(() => {
  return isPasswordModalOpen.value || 
         isTerminosModalOpen.value || 
         isPrivacidadModalOpen.value || 
         isAcercaModalOpen.value || 
         showUnsubscribeModal.value || 
         showSubscribeModal.value ||
         showRenewalModal.value ||
         isIdentityModalOpen.value || 
         showDeleteIdentityConfirm.value;
})

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
          method: 'GET'
        })
        
        // Actualizar el valor correspondiente
        if (response?.valor) {
          updateContactInfo(contact.type, response.valor)
        }
      } catch (error) {
        console.error(`Error al obtener ${contact.type}:`, error)
        // Mostrar un mensaje de error específico para cada campo
        if (contact.type === 'email') {
          updateContactInfo('email', 'contactomisegurohn@gmail.com')
        } else if (contact.type === 'phone') {
          updateContactInfo('phone', '+504 9451-7811')
        }
      }
    })
    
    await Promise.all(requests)
    
  } catch (error) {
    console.error('Error general al obtener información de contacto:', error)
    // Establecer valores por defecto en caso de error general
    updateContactInfo('email', 'contactomisegurohn@gmail.com')
    updateContactInfo('phone', '+504 9451-7811')
  }
}

// Cargar ciudades desde la API
const cargarCiudades = async () => {
  try {
    const data = await $api('/ciudad', {
      method: 'GET'
    }) 
    
    if (Array.isArray(data)) {
      ciudades.value = data.map(ciudad => ({
        id_ciudad: ciudad.id_ciudad,
        nombre: ciudad.nombre_ciudad
      }))
    }
  } catch (error) {
    console.error('Error al cargar las ciudades:', error)
    showError(t('common.error'), t('profile.messages.load_cities_error'))
  }
}

// Datos originales del usuario para comparar cambios
const originalUserData = ref(null);

// Estado para controlar la carga
const isSaving = ref(false);
const isUploading = ref(false);
const isDeleting = ref(false);
 
 

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : '';
    document.body.style.overflow = overflowValue;
    document.documentElement.style.overflow = overflowValue;
  }
});

const fileInput = ref(null);
const identityFileInput = ref(null);

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
  },
  identidad_url: null,
  imagen_url: null
})

const userData = computed(() => auth.user || {})
const userCookie = useCookie('user')

// Obtener datos del usuario desde la API
const fetchUserData = async () => {
  try {
    const userData = userCookie.value
    if (!userData || !userData.id_usuario) {
      console.warn('No hay datos de usuario válidos en las cookies');
      return false;
    }
    
    const data = await $api(`/usuarios/id/${userData.id_usuario}`, {
      method: 'GET'
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
  role: data.role || 'usuario',
  identidad_url: data.identidad_url || null,
  imagen_url: data.imagen_url || null
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
    showError(t('common.error'), t('profile.messages.load_profile_error'))
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
    showError(t('common.error'), t('profile.messages.load_profile_error'))
    return false
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

// Función para manejar el cierre de sesión
const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.logout();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    toast.value = {
      show: true,
      message: t('profile.messages.logout_error'),
      type: 'error',
      duration: 3000
    };
    isLoggingOut.value = false;
  }
}

const handleSubscribe = async () => {
  await subscribe();
};

const handleToggleNotifications = async () => {
    if (isSubscribed.value) {
        showUnsubscribeModal.value = true
    } else {
        showSubscribeModal.value = true
    }
}

const confirmSubscribe = async () => {
    try {
        showSubscribeModal.value = false
        const result = await subscribe()
        
        if (result.success) {
            showSuccess(t('common.success'), t('profile.messages.update_success'))
        } else if (result.error === 'denied') {
            showError(t('profile.messages.generic_error'), t('profile.permissions_denied'))
        } else if (result.error === 'supported') {
            showError(t('common.error'), 'Your browser does not support push notifications')
        } else {
            showError(t('common.error'), result.error || t('profile.messages.generic_error'))
        }
    } catch (error) {
        console.error('Error al suscribir:', error)
        showError(t('common.error'), t('profile.messages.generic_error'))
    }
}

const confirmUnsubscribe = async () => {
  try {
    await unsubscribe()
    showUnsubscribeModal.value = false
    toast.value = {
      show: true,
      message: t('profile.messages.update_success'),
      type: 'info',
      duration: 3000
    }
  } catch (error) {
    console.error('Error al desactivar:', error)
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

// ===== FUNCIONES PARA IMAGEN DE PERFIL =====
const onFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError(t('common.error'), t('profile.messages.file_size_error'))
    return
  }
  
  await uploadProfileImage(file)
}

const uploadProfileImage = async (file) => {
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('imagen', file)
    
    const response = await $api(`/usuarios/imagen-perfil/${user.value.id_usuario}`, {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      user.value.imagen_url = response.data.imagen_url
      // Actualizar el store y la cookie
      const userCookie = useCookie('user')
      userCookie.value = { ...userCookie.value, imagen_url: response.data.imagen_url }
      showSuccess(t('common.success'), t('profile.messages.photo_success'))
    }
  } catch (error) {
    console.error('Error al subir imagen:', error)
    showError(t('common.error'), t('profile.messages.upload_error'))
  } finally {
    isUploading.value = false
  }
}

const deleteProfileImage = async () => {
  if (!confirm(t('profile.messages.confirm_delete_photo'))) return
  
  isDeleting.value = true
  try {
    const response = await $api(`/usuarios/imagen-perfil/${user.value.id_usuario}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      user.value.imagen_url = null
      const userCookie = useCookie('user')
      userCookie.value = { ...userCookie.value, imagen_url: null }
      showSuccess(t('common.success'), t('profile.messages.photo_delete_success'))
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error)
    showError(t('common.error'), t('profile.messages.delete_error'))
  } finally {
    isDeleting.value = false
  }
}

// ===== FUNCIONES PARA FOTO DE IDENTIDAD =====
const onIdentityFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 10 * 1024 * 1024) {
    showError(t('common.error'), t('profile.messages.file_size_error'))
    return
  }
  
  await uploadIdentityImage(file)
}

const uploadIdentityImage = async (file) => {
  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('imagen', file)
    
    const response = await $api(`/usuarios/identidad-foto/${user.value.id_usuario}`, {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      user.value.identidad_url = response.data.identidad_url
      showSuccess(t('common.success'), t('profile.messages.id_upload_success'))
      isIdentityModalOpen.value = false
      
      // Notificar a administradores y súper administradores
      try {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Solicitud de Verificación',
            nombre_rol: 'admin'
          }
        });
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            titulo: 'Solicitud de Verificación',
            nombre_rol: 'sa'
          }
        });
      } catch (notifError) {
        console.error('Error al enviar notificaciones:', notifError);
      }
    }
  } catch (error) {
    console.error('Error al subir foto de identidad:', error)
    showError(t('common.error'), t('profile.messages.upload_error'))
  } finally {
    isUploading.value = false
  }
}

const deleteIdentityImage = () => {
  showDeleteIdentityConfirm.value = true
}

const confirmDeleteIdentity = async () => {
  showDeleteIdentityConfirm.value = false
  isDeleting.value = true
  try {
    const response = await $api(`/usuarios/identidad-foto/${user.value.id_usuario}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      user.value.identidad_url = null
      showSuccess(t('common.success'), t('profile.messages.id_delete_success'))
      isIdentityModalOpen.value = false
    }
  } catch (error) {
    console.error('Error al eliminar foto de identidad:', error)
    showError(t('common.error'), t('profile.messages.delete_error'))
  } finally {
    isDeleting.value = false
  }
}

const saveProfile = async () => {
  try {

    // Validaciones básicas
    if (!user.value.nombre || user.value.nombre.trim().split(' ').filter(Boolean).length < 2) {
      showError(t('common.error'), 'Por favor ingresa tu nombre completo (mínimo 2 palabras)');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.value.email || !emailRegex.test(user.value.email)) {
      showError(t('common.error'), 'Por favor ingresa un correo electrónico válido');
      return;
    } else {
      const [userPart] = user.value.email.split('@');
      if (/^(.)\1+$/.test(userPart)) {
        showError(t('common.error'), 'El correo electrónico parece ser falso');
        return;
      }
    }

    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
    if (!user.value.telefono || !phoneRegex.test(user.value.telefono)) {
      showError(t('common.error'), 'Ingresa un número de teléfono válido (ej: +504 9999-9999)');
      return;
    } else {
      const onlyDigits = user.value.telefono.replace(/\D/g, '');
      if (/(.)\1{5,}/.test(onlyDigits)) {
        showError(t('common.error'), 'El número de teléfono parece ser falso');
        return;
      }
    }
    
    // Datos que se enviarán al backend
    const userData = {
      nombre: user.value.nombre,
      email: user.value.email,
      telefono: user.value.telefono,
      id_ciudad: user.value.id_ciudad
    }; 
    
    isSaving.value = true;
    const response = await $api(`/usuarios/${user.value.id_usuario}`, {
      method: 'PUT',
      body: userData
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
      message: t('profile.messages.update_success'),
      duration: 1500
    });
    
  } catch (error) {
    console.error('❌ Error en saveProfile:', error)
    
    // Obtener el mensaje de error del servidor
    const responseData = error.data || {};
    let errorMessage = t('profile.messages.save_error');
    
    // Registrar detalles del error en consola
    
    // Determinar el mensaje de error a mostrar
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error === 'Error de validación' && responseData.field) {
      errorMessage = responseData.message || `Error en el campo ${responseData.field}`;
    } else if (error.statusCode === 500) {
      errorMessage = t('profile.messages.server_error');
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
      message: t('profile.password_mismatch'),
      duration: 3000
    });
    return;
  }
  
  if (!currentPassword.value || !newPassword.value) {
    showToast({
      type: 'error',
      message: t('profile.messages.complete_fields'),
      duration: 3000
    });
    return;
  }
  
  try {
    
    const response = await $api(`/usuarios/cambio-clave/${user.value.id_usuario}`, {
      method: 'PUT',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
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
      message: t('profile.messages.password_success'),
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
      method: 'PUT',
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
      method: 'GET'
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
      method: 'GET'
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

// Cargar datos al montar el componente de forma unificada

// Inicialización de datos
onMounted(async () => {
  try {
    const token = useCookie('token')
    const userCookie = useCookie('user')
    
    // Si no hay token o cookie, redirigir al inicio en lugar de recargar infinitamente
    if (!token.value || !userCookie.value) {
      navigateTo('/');
      return;
    }

    // Iniciar carga de datos esenciales en paralelo
    await Promise.all([
      fetchMembershipCost(),
      fetchBankAccounts(),
      cargarDatosPerfil(), // Este ya llama a fetchUserData() y cargarCiudades()
      fetchContactInfo()
    ]);
    
    // Cargar datos de la membresía después de tener el ID del usuario
    await fetchMembershipData();
    
    // Guardar una copia de los datos originales para detectar cambios
    if (user.value) {
      originalUserData.value = { ...user.value };
      
      // Mostrar toast si no tiene foto de perfil
      if (!user.value.imagen_url) {
        setTimeout(() => {
          showInfo('¡Completa tu perfil! Sube una foto para que sea más fácil identificarte👤');
        }, 1000);
      }
    }

    // Verificar el hash de la URL después de cargar todo
    if (process.client && window.location.hash === '#membresia' && (isMembershipExpired.value || isMembershipInactive.value)) {
      nextTick(() => {
        renovarMembresia();
        // Limpiar el hash sin recargar la página
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }
  } catch (error) {
    console.error('Error durante la inicialización del Perfil:', error);
    // Si es un error de autenticación (401), redirigir
    if (error.statusCode === 401) {
      navigateTo('/');
    }
  } finally {
    console.log('🏁 [Perfil] Finalizando carga. isLoading = false');
    // Asegurar que isLoading se detenga incluso si hay errores
    isLoading.value = false;
  }

  // Escuchar cambios en el hash
  const handleHashChange = () => {
    if (process.client && window.location.hash === '#membresia' && (isMembershipExpired.value || isMembershipInactive.value)) {
      renovarMembresia();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  if (process.client) {
    window.addEventListener('hashchange', handleHashChange);
  }

  // Limpiar event listener en onUnmounted (usando Lifecycle hook correcto)
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('hashchange', handleHashChange);
    }
  });
});

// Obtener cuentas bancarias
const fetchBankAccounts = async () => {
  isLoadingAccounts.value = true;
  try {
    const data = await $api('/cuentas', {
      method: 'GET'
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

// Referencia para el número de teléfono de la empresa
const empresaPhoneNumber = ref('');

// Función para obtener el número de teléfono de la empresa
const fetchEmpresaPhoneNumber = async () => {
  try {
    const response = await $api('/config/valor/numero_empresa', {
      method: 'GET'
    });
    
    if (response && response.valor) {
      empresaPhoneNumber.value = response.valor;
    } else {
      empresaPhoneNumber.value = '1234567890';
    }
  } catch (error) {
    console.error('Error al obtener el número de teléfono de la empresa:', error);
    // Establecer un valor por defecto en caso de error
    empresaPhoneNumber.value = '1234567890';
  }
};

// Función para enviar mensaje de WhatsApp
const sendWhatsAppMessage = async (amount, receiptNumber, membershipId) => {
  try {
    // Si no tenemos el número de teléfono, intentar obtenerlo
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }
    
    // Asegurarse de que amount sea un número
    const amountNumber = Number(amount) || 0;
    
    // Obtener la fecha actual en formato DDMMYY
    const today = new Date();
    const formattedDate = [
      String(today.getDate()).padStart(2, '0'),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getFullYear()).slice(-2)
    ].join('');
    
    // Formatear el mensaje con los detalles del pago
    const message = `*Comprobante de Pago*\n\n` +
      `*ID de Membresía:* ${formattedDate}-${membershipId || 'N/A'}\n` +
      `*Tipo de pago:* Pago de Membresía\n` + 
      `*N° de comprobante:* ${receiptNumber}\n\n` +
      `Adjunto una captura del comprobante de pago para su verificación.`;
    
    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Usar el número de teléfono de la empresa o uno por defecto
    const phoneNumber = empresaPhoneNumber.value || '1234567890';
    
    // Abrir WhatsApp Web con el mensaje predefinido
    window.open(`https://wa.me/+504${phoneNumber}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
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
      body: requestData
    });

    // Enviar notificación a administradores
    try {
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Pago por membresía recibido',
          nombre_rol: 'admin'
        }
      });
      await $api('/notificaciones/enviar', {
        method: 'POST',
        body: {
          titulo: 'Pago por membresía recibido',
          nombre_rol: 'sa'
        }
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
    
    // Enviar mensaje de WhatsApp con el ID de la membresía
    await sendWhatsAppMessage(membershipCost.value, comprobante.value.trim(), data.id_membresia);
    
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
/* Estilos personalizados para Multiselect */
.multiselect-custom {
  min-width: 140px !important;
  font-size: 0.875rem !important;
}

.multiselect-custom :deep(.multiselect__tags) {
  min-height: 46px !important;
  background-color: rgb(249 250 251) !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.75rem !important;
  padding: 10px 30px 10px 12px !important;
  transition: all 0.2s ease !important;
}

.dark .multiselect-custom :deep(.multiselect__tags) {
  background-color: rgb(55 65 81) !important;
  border-color: rgb(75 85 99) !important;
}

.multiselect-custom :deep(.multiselect__tags:focus-within) {
  border-color: rgb(59 130 246) !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
}

.dark .multiselect-custom :deep(.multiselect__tags:focus-within) {
  border-color: rgb(59 130 246) !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
}

.multiselect-custom :deep(.multiselect__single) {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.875rem !important;
  line-height: 1.5rem !important;
}

.dark .multiselect-custom :deep(.multiselect__single) {
  color: rgb(243 244 246) !important;
}

.multiselect-custom :deep(.multiselect__input) {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.875rem !important;
  min-height: 24px !important;
  line-height: 1.5rem !important;
}

.dark .multiselect-custom :deep(.multiselect__input) {
  color: rgb(243 244 246) !important;
}

.multiselect-custom :deep(.multiselect__input::placeholder) {
  color: rgb(156 163 175) !important;
}

.multiselect-custom :deep(.multiselect__placeholder) {
  margin: 0 !important;
  padding: 0 !important;
  color: rgb(156 163 175) !important;
  font-size: 0.875rem !important;
  line-height: 1.5rem !important;
}

.multiselect-custom :deep(.multiselect__select) {
  height: 100% !important;
  width: 1.75rem !important;
  right: 0 !important;
  top: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: transparent !important;
  padding: 0 !important;
}

.multiselect-custom :deep(.multiselect__select:before) {
  border-color: rgb(156 163 175) transparent transparent !important;
  border-style: solid !important;
  border-width: 5px 5px 0 !important;
  margin-top: 0 !important;
  top: 55% !important;
}

.dark .multiselect-custom :deep(.multiselect__select:before) {
  border-color: rgb(156 163 175) transparent transparent !important;
}

.multiselect-custom :deep(.multiselect__content-wrapper) {
  background-color: white !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.75rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  margin-top: 0.25rem !important;
  z-index: 50 !important;
  min-width: 100% !important;
  width: auto !important;
}

.dark .multiselect-custom :deep(.multiselect__content-wrapper) {
  background-color: rgb(31 41 55) !important;
  border-color: rgb(55 65 81) !important;
}

.multiselect-custom :deep(.multiselect__option) {
  font-size: 0.875rem !important;
  color: rgb(17 24 39) !important;
  padding: 10px 14px !important;
  line-height: 1.5rem !important;
}

.dark .multiselect-custom :deep(.multiselect__option) {
  color: rgb(243 244 246) !important;
}

.multiselect-custom :deep(.multiselect__option--highlight) {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom :deep(.multiselect__option--highlight) {
  background-color: transparent !important;
  color: rgb(243 244 246) !important;
}

.multiselect-custom :deep(.multiselect__option--selected) {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-weight: 600 !important;
}

.dark .multiselect-custom :deep(.multiselect__option--selected) {
  background-color: transparent !important;
  color: rgb(243 244 246) !important;
}

.multiselect-custom :deep(.multiselect__option--selected.multiselect__option--highlight) {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom :deep(.multiselect__option--selected.multiselect__option--highlight) {
  background-color: transparent !important;
  color: rgb(243 244 246) !important;
}

/* Animación de pulso para icono */
@keyframes pulse-icon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse-icon {
  animation: pulse-icon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animación sutil para el check de verificación */
@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s ease-in-out infinite;
}

/* Animaciones del modal */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-content-leave-active {
  transition: all 0.2s ease-in;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.backdrop-enter-active {
  transition: opacity 0.3s ease;
}

.backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

/* Animación slide-down */
.slide-down-enter-active {
  transition: all 0.3s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>