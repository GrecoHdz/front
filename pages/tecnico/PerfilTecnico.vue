<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
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
      />

    <!-- Contenido principal -->
    <div v-if="!isLoading">
    <HeadersHeaderPerfil/>

    <!-- Main Content -->
    <div class="max-w-xl mx-auto px-3 sm:px-6 pb-4 sm:pb-6">
      <!-- Profile Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
        <div class="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div class="relative group">
            <div v-if="user.imagen_url" 
                 class="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3 sm:mb-4 relative">
              <img :src="user.imagen_url" 
                   :alt="user.nombre" 
                   class="w-full h-full object-cover">
              <div v-if="isUploading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            </div>
            <div v-else 
                 class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl text-white mb-3 sm:mb-4 shadow-lg">
              {{ userInitials }}
            </div> 
          </div>
          <h2 class="text-lg sm:text-xl font-black text-gray-900 dark:text-white">{{ user.nombre }}</h2>
          <p class="text-emerald-600 dark:text-emerald-400 font-medium text-sm sm:text-base">{{ user.email }}</p>
        </div>

        <!-- User Stats -->
        <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6 pt-2 sm:pt-3">
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <span class="text-blue-600 dark:text-blue-400 text-sm sm:text-base">📅</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Registrado el</p>
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatShortDate(user.fecha_registro) }}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-1 sm:mb-2">
              <span class="text-purple-600 dark:text-purple-400 text-sm sm:text-base">🏙️</span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">{{ user.ciudad || 'No especificada' }}</p>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 dark:border-gray-700 mb-4 sm:mb-6">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Información Personal</h3>
        
        <div class="space-y-3 sm:space-y-4">
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input 
              v-model="user.nombre"
              type="text" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Tu nombre completo"
            >
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input 
              v-model="user.email"
              type="email" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="tu@email.com"
            >
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
            <input 
              v-model="user.telefono"
              type="tel" 
              class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="+504 9999-9999"
            >
          </div>
          
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Ciudad</label>
            <div class="relative">
              <multiselect
                v-model="user.ciudadSeleccionada"
                :options="ciudades"
                :searchable="false"
                :close-on-select="true"
                :show-labels="true"
                label="nombre"
                track-by="id_ciudad"
                class="multiselect-custom"
                :class="{ 'multiselect--active': user.ciudadSeleccionada }"
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
          <div v-if="isPasswordModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-md relative">
              <button 
                @click="isPasswordModalOpen = false"
                type="button"
                class="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Cerrar modal"
              >
                <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Cambiar Contraseña</h3>
              
              <form @submit.prevent="updatePassword" class="space-y-3 sm:space-y-4">
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
                <div class="space-y-1.5 sm:space-y-2">
                  <label for="currentPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</label>
                  <input 
                    id="currentPassword"
                    v-model="currentPassword"
                    type="password" 
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu contraseña actual"
                    autocomplete="current-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1.5 sm:space-y-2">
                  <label for="newPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</label>
                  <input 
                    id="newPassword"
                    v-model="newPassword"
                    type="password" 
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Ingresa tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    minlength="6"
                  >
                </div>
                
                <div class="space-y-1.5 sm:space-y-2">
                  <label for="confirmPassword" class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nueva Contraseña</label>
                  <input 
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password" 
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                    placeholder="Confirma tu nueva contraseña"
                    autocomplete="new-password"
                    required
                    :class="{'border-red-500 dark:border-red-400': passwordMismatch}"
                  >
                  <p v-if="passwordMismatch" class="text-xs sm:text-sm text-red-600 dark:text-red-400">Las contraseñas no coinciden</p>
                </div>
                
                <button 
                  type="submit"
                  :disabled="isUpdatingPassword || passwordMismatch"
                  class="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <span v-if="isUpdatingPassword">Actualizando...</span>
                  <span v-else>Actualizar Contraseña</span>
                </button>
              </form>
            </div>
          </div>
          
          <div class="flex flex-col space-y-2 sm:space-y-3 pt-2">
            <button 
              @click="saveProfile"
              :disabled="!hasChanges || isSaving"
              class="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-indigo-400 text-sm sm:text-base"
            >
              <span v-if="isSaving">Guardando...</span>
              <span v-else>Actualizar Perfil</span>
            </button>
            <button 
              @click="isPasswordModalOpen = true"
              type="button"
              class="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              Cambiar Contraseña
            </button>
            <button 
              @click="isPhotoModalOpen = true"
              type="button"
              class="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              <div class="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Gestionar Foto</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Gestión de Servicios (Rediseñado) -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/50 mb-6 transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🛠️
            </div>
            <div>
              <h3 class="text-lg font-black text-gray-900 dark:text-white leading-tight">Mis Especialidades</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Servicios que ofreces actualmente</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
            {{ technicianServices.length }} Activos
          </span>
        </div>
        
        <!-- Servicios asignados (Grid Moderno) -->
        <div class="relative">
          <div v-if="loadingServices" class="flex flex-col items-center justify-center py-12">
            <div class="relative">
              <div class="w-12 h-12 border-4 border-blue-100 dark:border-gray-700 rounded-full"></div>
              <div class="absolute top-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p class="mt-4 text-sm text-gray-500 font-medium">Sincronizando tus servicios...</p>
          </div>
          
          <div v-else-if="technicianServices.length === 0" class="text-center py-10 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div class="text-4xl mb-3">✨</div>
            <p class="text-sm font-bold text-gray-900 dark:text-white mb-1">¿Aún no tienes servicios?</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4 px-6">Agrega tus habilidades para empezar a recibir solicitudes de clientes cercanos.</p>
            <button 
              @click="showServiceModal = true"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-200/50"
            >
              Comenzar ahora
            </button>
          </div>
          
          <div v-else class="grid grid-cols-2 gap-2 sm:gap-3">
            <div 
              v-for="service in technicianServices" 
              :key="service.id_servicio"
              class="group relative p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-700 rounded-2xl border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300 hover:shadow-md"
            >
              <div class="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div class="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 flex-shrink-0">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate w-full">{{ service.nombre }}</p>
                  <p class="hidden sm:block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">Habilitado</p>
                </div>
                <button 
                  @click="removeServiceFromTechnician(service.id_tecnico_servicio)"
                  class="absolute top-1 right-1 p-1.5 sm:relative sm:top-0 sm:right-0 sm:opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  title="Eliminar servicio"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Card de Acción Rápida para añadir -->
            <button 
              @click="showServiceModal = true"
              class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-800 rounded-2xl bg-white dark:bg-gray-800 transition-all hover:bg-blue-50/50 dark:hover:bg-blue-900/10 group"
            >
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span class="text-[10px] sm:text-sm font-bold text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-center">Añadir</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal de Gestión de Servicios (Inyectado al final antes de script) -->
      <Transition name="fade">
        <div v-if="showServiceModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md" @click="showServiceModal = false"></div>
          <div class="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg relative z-20 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-slide-up">
            <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
              <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white">Ampliar tu Perfil</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Selecciona servicios disponibles en tu ciudad</p>
              </div>
              <button @click="showServiceModal = false" class="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6 pt-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div v-if="loadingServices" class="py-20 text-center">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
              </div>
              
              <div v-else-if="availableServices.length === 0" class="py-12 text-center">
                <div class="text-4xl mb-4">🏠</div>
                <p class="text-gray-900 dark:text-white font-bold">Sin servicios adicionales para tu zona</p>
                <p class="text-xs text-gray-500">Te avisaremos cuando haya nuevas categorías disponibles.</p>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="service in availableServices" 
                  :key="service.id_servicio"
                  class="group flex items-center justify-between p-4 rounded-2xl transition-all duration-200"
                  :class="isServiceAssigned(service.id_servicio) ? 'bg-gray-50 dark:bg-gray-900/50 opacity-60' : 'bg-white dark:bg-gray-700 hover:shadow-lg border border-gray-100 dark:border-gray-600'"
                >
                  <div class="flex-1">
                    <p class="text-sm font-black text-gray-900 dark:text-white">{{ service.nombre }}</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{{ service.descripcion }}</p>
                  </div>
                  
                  <div class="ml-4">
                    <button 
                      v-if="!isServiceAssigned(service.id_servicio)"
                      @click="assignServiceToTechnician(service.id_servicio)"
                      class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl transition-all active:scale-95 flex items-center gap-2"
                    >
                      Añadir <span class="text-lg leading-none">+</span>
                    </button>
                    <span 
                      v-else
                      class="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px] font-black rounded-lg flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      ACTIVO
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      
      <!-- Mi Local (Solo si es Barbero) -->
      <div v-if="isBarber" class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700/50 mb-6 transition-all duration-300 animate-fade-in">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
            💈
          </div>
          <div>
            <h3 class="text-lg font-black text-gray-900 dark:text-white leading-tight">Mi Barbería</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">Registra tu local físico</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Local</label>
            <input v-model="barberia.nombre" type="text" placeholder="Ej: Barbería El Elegante" 
                   class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Colonia</label>
              <input v-model="barberia.colonia" type="text" placeholder="Colonia" 
                     class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm">
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Dirección Precisa</label>
              <input v-model="barberia.direccion_precisa" type="text" placeholder="Calle, Bloque, Casa" 
                     class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white text-sm">
            </div>
          </div>

          <!-- Fotos de Barbería con Cloudinary -->
          <div class="grid grid-cols-2 gap-4">
             <!-- Foto 1 -->
             <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Foto Fachada</label>
                <div @click="fileInputBarberia1.click()" 
                     class="group relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-all">
                   <img v-if="barberia.foto1" :src="barberia.foto1" class="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity">
                   <div v-else class="text-center p-3">
                      <div class="text-2xl mb-1">📸</div>
                      <p class="text-[10px] text-gray-400 font-bold">Subir Fachada</p>
                   </div>
                   
                   <!-- Overlay de carga/edición -->
                   <div v-if="isUploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                   </div>
                   <div v-if="barberia.foto1 && !isUploading" class="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                      <button @click.stop="deleteBarberiaImage('foto1')" class="p-2 bg-red-500/20 hover:bg-red-500/40 text-white rounded-full backdrop-blur-md transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                </div>
                <input type="file" ref="fileInputBarberia1" class="hidden" accept="image/*" @change="onBarberiaFileChange($event, 'foto1')">
             </div>

             <!-- Foto 2 -->
             <div class="space-y-2">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Foto Interior</label>
                <div @click="fileInputBarberia2.click()" 
                     class="group relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-400 transition-all">
                   <img v-if="barberia.foto2" :src="barberia.foto2" class="absolute inset-0 w-full h-full object-cover group-hover:opacity-75 transition-opacity">
                   <div v-else class="text-center p-3">
                      <div class="text-2xl mb-1">🛋️</div>
                      <p class="text-[10px] text-gray-400 font-bold">Subir Interior</p>
                   </div>

                   <!-- Overlay de carga/edición -->
                   <div v-if="isUploading" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                   </div>
                   <div v-if="barberia.foto2 && !isUploading" class="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                      <button @click.stop="deleteBarberiaImage('foto2')" class="p-2 bg-red-500/20 hover:bg-red-500/40 text-white rounded-full backdrop-blur-md transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                </div>
                <input type="file" ref="fileInputBarberia2" class="hidden" accept="image/*" @change="onBarberiaFileChange($event, 'foto2')">
             </div>
          </div>

          <button @click="saveBarberia" :disabled="isSavingBarberia || !hasBarberiaChanges"
                  class="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black rounded-2xl transition-all shadow-lg hover:shadow-indigo-200/50 disabled:opacity-50">
            <span v-if="isSavingBarberia">Guardando...</span>
            <span v-else>{{ barberia.id_barberia ? 'Actualizar Local' : 'Registrar Mi Local' }}</span>
          </button>
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
              <h3 class="text-base font-bold text-gray-900 dark:text-white">Notificaciones Push</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">Recibe alertas en tiempo real</p>
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
            Activa las notificaciones para recibir actualizaciones sobre tus pedidos y mensajes incluso si no tienes la aplicación abierta.
          </p>
          
          <p v-if="permission === 'denied'" class="mt-2 text-[10px] text-red-500 dark:text-red-400">
            ⚠️ Permisos bloqueados en el navegador. Por favor, habilítalos en los ajustes del sitio.
          </p>
        </div>
      </div>

      <!-- Legal & About -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal y más</h3>
        
        <div class="space-y-2 sm:space-y-3">
          <button 
            @click="isTerminosModalOpen = true"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Términos y condiciones</p>
          </button>
          
          <button 
            @click="isContratoTecnicoModalOpen = true"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Contrato del Técnico</p>
          </button>
          <button 
            @click="isPrivacidadModalOpen = true"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Política de privacidad</p>
          </button>
          <button 
            @click="isAcercaModalOpen = true"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Acerca de MiSeguro</p>
          </button>
          <button 
            @click="handleLogout"
            :disabled="isLoggingOut"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200 flex items-center justify-between"
            :class="{'opacity-70 cursor-not-allowed': isLoggingOut}"
          >
            <span class="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Cerrar sesión</span>
            <LoadingSpinner v-if="isLoggingOut" class="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div> 
    <FootersFooterTecnico />
    </div>

<!-- Modal de Términos y Condiciones (PARA CLIENTES Y TÉCNICOS) -->
<div v-if="isTerminosModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
  <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col relative shadow-2xl border border-gray-200 dark:border-gray-700">
    
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
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Términos y Condiciones</h3> 
    </div>

    <div class="overflow-y-auto flex-1 pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">1. Aceptación de los Términos</h4>
        <p>
          Al registrarse y utilizar la plataforma MiSeguro, usted acepta de forma expresa
          estos Términos y Condiciones. Si no está de acuerdo con alguno de ellos, deberá abstenerse de utilizar la plataforma.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">2. Descripción del Servicio</h4>
        <p>
          MiSeguro es una plataforma tecnológica que facilita la conexión entre clientes y técnicos independientes
          para la prestación de servicios de mantenimiento y reparación a domicilio.
        </p>
        <p class="mt-2">
          <strong>Importante:</strong> MiSeguro no presta directamente los servicios técnicos, no emplea a los técnicos
          y no asume una relación laboral con ellos. Los técnicos actúan de manera independiente y bajo su propia responsabilidad.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">3. Medios de Pago</h4>
        <p>
          Todos los pagos de los servicios solicitados a través de la plataforma deberán realizarse exclusivamente 
          mediante transferencia bancaria o medios electrónicos autorizados a las cuentas oficiales de MiSeguro.
        </p>
        <p class="mt-2">
          <strong>Importante:</strong> Cualquier pago realizado fuera de la plataforma, en efectivo o a cuentas no autorizadas, 
          no será reconocido por MiSeguro y no generará derechos de reclamo, garantía, crédito o soporte.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">4. Precio del Servicio</h4>
        <p>
          El precio de la mano de obra es definido por el técnico y deberá ser aceptado por el cliente antes
          de la ejecución del servicio. El precio incluye la comisión de la plataforma por intermediación.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">5. Membresías y Créditos</h4>
        <p>
          MiSeguro ofrece membresías mensuales que otorgan beneficios, entre ellos la acumulación de crédito
          utilizable como descuento al momento de pagar servicios dentro de la plataforma.
        </p>
        <p class="mt-2">El crédito acumulado:</p>
        <ul class="list-disc pl-5 space-y-1">
          <li>No es dinero en efectivo</li>
          <li>No es transferible</li>
          <li>Solo puede utilizarse para pagar servicios dentro de MiSeguro</li>
          <li>Reduce el monto a pagar por el cliente, sin afectar el pago al técnico</li>
        </ul>
        <p class="mt-2">
          La membresía tiene una duración de 30 días. Si no es renovada dentro del período de gracia establecido,
          el crédito acumulado podrá ser reiniciado a cero, sin posibilidad de reversión.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">6. Pago por Visita Técnica</h4>
        <p>
          En caso de que el cliente no cuente con una membresía activa, se cobrará una tarifa fija por visita técnica,
          cuyo valor será informado previamente.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">7. Limitación de Responsabilidad</h4>
        <p>
          Los servicios son prestados por técnicos independientes. MiSeguro no garantiza el resultado final del servicio,
          salvo en los casos expresamente establecidos por la plataforma.
        </p>
        <p class="mt-2">
          MiSeguro no será responsable por daños directos o indirectos derivados de la ejecución del servicio,
          excepto cuando la legislación aplicable disponga lo contrario.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">8. Privacidad y Protección de Datos</h4>
        <p>
          Los datos personales serán tratados conforme a la Política de Privacidad de MiSeguro
          y utilizados únicamente para la operación y mejora de la plataforma.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">9. Modificaciones</h4>
        <p>
          MiSeguro podrá modificar estos Términos y Condiciones en cualquier momento.
          Las modificaciones entrarán en vigor desde su publicación en la plataforma.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">10. Ley Aplicable y Jurisdicción</h4>
        <p>
          Estos Términos se rigen por las leyes de la República de Honduras.
          Cualquier controversia será sometida a los tribunales competentes de San Pedro Sula, Cortés.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">11. Garantía de los Servicios</h4>
        <p>
          Los servicios técnicos contratados a través de MiSeguro cuentan con una garantía de <strong>un (1) mes</strong>. 
          En caso de que un trabajo no se haya realizado con los mejores estándares posibles y requiera una nueva 
          intervención para hacer efectiva la garantía, no se le cobrará mano de obra de nuevo al cliente.
        </p>
      </section>

    </div>

    <div class="mt-4 pt-4 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
      <button 
        @click="isTerminosModalOpen = false"
        class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm"
      >
        Cerrar
      </button>
    </div>

  </div>
</div>

<!-- Modal de Contrato del Técnico (SOLO PARA TÉCNICOS) -->
<div v-if="isContratoTecnicoModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
  <div class="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] flex flex-col relative shadow-2xl border border-gray-200 dark:border-gray-700">
    
    <button 
      @click="isContratoTecnicoModalOpen = false"
      type="button"
      class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
      aria-label="Cerrar modal"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div class="mb-4 flex-shrink-0">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        Contrato de Prestación de Servicios del Técnico
      </h3> 
      <p class="text-sm text-gray-600 dark:text-gray-400">
        Última actualización: 10 de febrero de 2025
      </p>
    </div>

    <div class="overflow-y-auto flex-1 pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">1. Objeto del Contrato</h4>
        <p>
          El presente contrato tiene por objeto regular la relación entre MiSeguro
          (en adelante, "la Plataforma") y el técnico independiente (en adelante, "el Técnico")
          para la intermediación tecnológica en la prestación de servicios a clientes finales.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">2. Naturaleza de la Relación</h4>
        <p>
          El Técnico actúa como profesional independiente, sin que exista relación laboral,
          societaria o de subordinación con MiSeguro. La Plataforma no presta directamente
          los servicios técnicos y no asume responsabilidad por los mismos.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">3. Obligaciones del Técnico</h4>
        <ul class="list-disc pl-5 space-y-1">
          <li>Prestar los servicios con profesionalismo y diligencia</li>
          <li>Responder por los daños causados durante la ejecución del servicio</li>
          <li>Respetar los horarios y condiciones acordadas con el cliente</li>
          <li>Mantener la confidencialidad de la información de los clientes</li>
          <li>Definir el precio justo de su mano de obra</li>
        </ul>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">4. Modelo de Cobro y Pago Centralizado</h4>
        <p>
          Por razones operativas, de seguridad y control, todos los pagos de los servicios 
          deberán realizarse exclusivamente a las cuentas oficiales de MiSeguro.
        </p>
        <p class="mt-2">
          MiSeguro actúa como intermediario tecnológico y agente de gestión de pagos, facilitando 
          el recaudo de los montos acordados entre cliente y técnico independiente. MiSeguro factura 
          únicamente sus comisiones, cargos propios y servicios adicionales ofrecidos por la plataforma, 
          y gestiona la transferencia al técnico independiente del valor correspondiente a la mano de obra 
          efectivamente prestada por éste.
        </p>
        <p class="mt-2">
          Los montos recaudados por MiSeguro correspondientes a la mano de obra del técnico independiente constituyen
          <strong>fondos de terceros</strong> administrados temporalmente por la plataforma en calidad de agente de 
          gestión de pago, y no representan ingresos propios de MiSeguro, reconociéndose contablemente como pasivos 
          hasta su liquidación al técnico correspondiente.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">5. Distribución del Pago y Comisiones</h4>
        <p>
          El precio de la mano de obra es definido directamente por el Técnico y aceptado por el cliente 
          antes de la ejecución del servicio.
        </p>
        <p class="mt-2">
          La distribución del pago entre el Técnico y MiSeguro es <strong>variable</strong> y será determinada
          por la plataforma según el tipo de servicio, categoría, promociones u otros criterios operativos,
          los cuales serán informados al Técnico previo a la aceptación del trabajo.
        </p>
        <p class="mt-2">
          La comisión de MiSeguro se calcula sobre el valor total de la mano de obra acordada,
          independientemente de descuentos, créditos o beneficios aplicados al cliente.
        </p>
        <p class="mt-2">
          El uso de crédito por parte del cliente reduce únicamente el monto a pagar por éste,
          pero <strong>no afecta</strong> el valor total de la mano de obra ni el pago correspondiente al Técnico.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">6. Proceso de Liquidación y Pago</h4>
        <p>
          MiSeguro realizará el pago al Técnico independiente una vez confirmado el pago del cliente
          y finalizado el servicio, descontando la comisión correspondiente.
        </p>
        <p class="mt-2">
          Los pagos se efectuarán únicamente a la cuenta bancaria registrada por el Técnico en la plataforma
          y podrán tardar hasta cinco (5) días hábiles.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">7. Prueba Plena de Pago</h4>
        <p class="font-medium">
          La constancia de transferencia bancaria realizada a la cuenta registrada por el Técnico constituye
          prueba plena, válida y suficiente de pago.
        </p>
        <p class="mt-2">
          La transferencia realizada a la cuenta registrada por el Técnico se considerará válida y liberatoria
          para MiSeguro, aun cuando el Técnico alegue desconocimiento, falta de notificación o no aceptación
          expresa de la liquidación electrónica.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">8. Responsabilidad sobre Datos Bancarios</h4>
        <p>
          El Técnico es el único responsable de la veracidad y exactitud de los datos bancarios proporcionados.
          MiSeguro no será responsable por errores en la información suministrada por el Técnico que resulten
          en transferencias a cuentas incorrectas, inexistentes o de terceros.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">9. Obligaciones Fiscales y Tributarias</h4>
        <p>
          El Técnico reconoce que es el único responsable de la emisión de los comprobantes fiscales 
          correspondientes por los servicios técnicos prestados al cliente, así como del cumplimiento de sus 
          obligaciones tributarias ante el Servicio de Administración de Rentas (SAR).
        </p>
        <p class="mt-2">
          La falta de emisión de comprobantes fiscales por parte del Técnico no altera la naturaleza de 
          intermediación de MiSeguro ni convierte dichos montos en ingresos propios de la plataforma.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">10. Pagos No Autorizados</h4>
        <p>
          El Técnico reconoce y acepta que cualquier pago realizado fuera de la plataforma, en efectivo, 
          a cuentas no autorizadas o directamente al Técnico:
        </p>
        <ul class="list-disc pl-5 space-y-1 mt-2">
          <li>No será reconocido por MiSeguro</li>
          <li>No generará derecho a cobro de comisión por parte de la plataforma</li>
          <li>Liberará al Técnico de cualquier obligación con MiSeguro respecto a ese servicio</li>
          <li>No otorgará al cliente derechos de reclamo, garantía o soporte por parte de la plataforma</li>
        </ul>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">11. Garantía de Servicio</h4>
        <p>
          Todos los trabajos realizados a través de la plataforma cuentan con una garantía de <strong>un (1) mes</strong>. 
          En caso de que un trabajo no se haya realizado siguiendo los mejores estándares posibles y requiera una 
          nueva intervención para hacer efectiva la garantía, el Técnico deberá correr íntegramente con los <strong>gastos de mano de obra</strong> 
          derivados de dicha intervención.
        </p>
        <p class="mt-2 text-red-600 dark:text-red-400 font-medium">
          El incumplimiento de esta obligación resultará en el <strong>veto inmediato y permanente</strong> del Técnico 
          de la aplicación.
        </p>
      </section>

      <section>
        <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">12. Aceptación del Contrato</h4>
        <p>
          El uso, acceso y permanencia en la Plataforma implica la aceptación expresa,
          automática e incondicional del presente contrato.
        </p>
        <p class="mt-2 font-semibold text-gray-900 dark:text-white">
          Si el Técnico no está de acuerdo con estos términos, deberá abstenerse de utilizar
          la Plataforma. El uso continuado de la misma se entenderá como aceptación total
          del contrato.
        </p>
      </section>

    </div>

    <div class="mt-4 pt-4 pb-2 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
      <button 
        @click="isContratoTecnicoModalOpen = false"
        class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        Acepto y Entiendo
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

    <!-- Modal de Acerca de MiSeguro -->
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
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Acerca de MiSeguro</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">Tu plataforma de confianza para servicios del hogar</p>
        </div>

        <div class="overflow-y-auto max-h-[60vh] pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <section class="text-center">
            <div class="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-3xl text-white mb-4 shadow-lg mx-auto">
              🏠
            </div>
            <h4 class="font-semibold text-lg text-gray-900 dark:text-white mb-2">MiSeguro</h4>
            <p class="text-gray-600 dark:text-gray-400">Conectando hogares con profesionales de confianza</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Nuestra Misión</h4>
            <p>En MiSeguro, nos dedicamos a facilitar el acceso a servicios técnicos de alta calidad para el hogar, conectando a clientes con profesionales verificados y confiables. Buscamos convertir cada experiencia de servicio en una solución satisfactoria y segura.</p>
          </section>

          <section>
            <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">Nuestra Visión</h4>
            <p>Ser la plataforma líder en Honduras para servicios del hogar, reconocida por nuestra excelencia en el servicio, la confianza generada en nuestros usuarios y el impacto positivo en la vida de las familias y profesionales técnicos.</p>
          </section>

          <section>
          <h4 class="font-semibold text-base text-gray-900 dark:text-white mb-2">¿Qué Hacemos?</h4>
          <p>MiSeguro es una plataforma tecnológica que:</p>
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
            <span class="text-sm">{{ contactInfo.find(c => c.type === 'email')?.value || 'soporte@MiSeguro.com' }}</span>
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

<!-- Modal de Gestión de Foto de Perfil -->
<Transition name="fade">
  <div v-if="isPhotoModalOpen" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all duration-300">
      <!-- Header con gradiente sutil -->
      <div class="relative bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold">Foto de perfil</h3>
          <button 
            @click="isPhotoModalOpen = false"
            class="p-1.5 rounded-full hover:bg-white/20 transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="p-6">
        <div class="flex flex-col items-center space-y-6">
          <!-- Avatar con efecto de elevación -->
          <div class="relative group">
            <div class="relative w-40 h-40 rounded-full ring-4 ring-white dark:ring-gray-800 shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <div v-if="user.imagen_url" class="w-full h-full">
                <img 
                  :src="user.imagen_url" 
                  :alt="user.nombre" 
                  class="w-full h-full object-cover"
                >
                <div v-if="isUploading" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                </div>
              </div>
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-6xl text-white font-bold">
                {{ userInitials }}
              </div>
            </div> 
          </div>

          <!-- Botones de acción con iconos -->
<div class="w-full" :class="{'grid grid-cols-2 gap-4': user.imagen_url}">
  <label class="block" :class="{'opacity-50 cursor-not-allowed': isUploading}">
    <div class="flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" :class="{'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none': isUploading}">
      <svg v-if="!isUploading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span v-if="!isUploading">{{ user.imagen_url ? 'Cambiar' : 'Subir foto' }}</span>
      <span v-else>Procesando...</span>
      <input 
        type="file" 
        class="hidden" 
        @change="onFileChange" 
        accept="image/*" 
        :disabled="isUploading"
      >
    </div>
  </label>
  
  <button 
    v-if="user.imagen_url"
    @click="deleteProfileImage"
    type="button"
    class="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-white dark:bg-gray-700 border-2 border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
    :disabled="isUploading"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    <span>Eliminar</span>
  </button> </div></div></div>
    </div>
  </div>
</Transition>
    <!-- Modal de Confirmación Desactivar Notificaciones -->
    <Transition name="fade">
      <div v-if="showUnsubscribeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showUnsubscribeModal = false"></div>
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-2xl w-full max-w-sm relative z-10 border border-gray-100 dark:border-gray-700">
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🔕
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Desactivar notificaciones?</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-2">
              Dejarás de recibir avisos importantes sobre tus servicios y membresías en tiempo real.
            </p>
          </div>
          
          <div class="flex flex-col gap-3">
            <button 
              @click="confirmUnsubscribe"
              class="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-200 dark:shadow-none"
            >
              Sí, desactivar
            </button>
            <button 
              @click="showUnsubscribeModal = false"
              class="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              Mantener activas
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
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">¡Mantente informado!</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-2">
              Activando las notificaciones te avisaremos sobre el estado de tus servicios y promociones exclusivas.
            </p>
          </div>
          
          <div class="flex flex-col gap-3">
            <button 
              @click="confirmSubscribe"
              class="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200 dark:shadow-none"
            >
              Sí, activar alertas
            </button>
            <button 
              @click="showSubscribeModal = false"
              class="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl transition-all active:scale-95"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
  
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect'
import { usePushNotifications } from '~/composables/usePushNotifications'


// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const router = useRouter()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'MiSeguro - Perfil',
  meta: [
    { name: 'description', content: 'Perfil de usuario de MiSeguro - Gestiona tus servicios y membresía' },
    { name: 'keywords', content: 'Perfil, usuario, servicios, membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isLoggingOut = ref(false)
const isUploading = ref(false)
const isSaving = ref(false)
const isUpdatingPassword = ref(false)
const isPasswordModalOpen = ref(false)
const isPhotoModalOpen = ref(false)
const isTerminosModalOpen = ref(false)
const isContratoTecnicoModalOpen = ref(false)
const isPrivacidadModalOpen = ref(false)
const isAcercaModalOpen = ref(false)
const { subscribe, unsubscribe, isSubscribed, checkSubscription, isSupported, permission } = usePushNotifications()
const showUnsubscribeModal = ref(false)
const showSubscribeModal = ref(false)




const availableServices = ref([])
const technicianServices = ref([])
const loadingServices = ref(false)
const showServiceModal = ref(false)

// Variables para gestión de barbería
const barberia = ref({
  id_barberia: null,
  nombre: '',
  colonia: '',
  direccion_precisa: '',
  foto1: '',
  foto2: ''
})
const loadingBarberia = ref(false)
const isSavingBarberia = ref(false)

// Bloquear scroll cuando un modal está abierto
const anyModalOpen = computed(() => {
  return isPasswordModalOpen.value || 
         isPhotoModalOpen.value || 
         isTerminosModalOpen.value || 
         isContratoTecnicoModalOpen.value || 
         isPrivacidadModalOpen.value || 
         isAcercaModalOpen.value || 
         showUnsubscribeModal.value || 
         showSubscribeModal.value ||
         showServiceModal.value
})

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    const overflowValue = newValue ? 'hidden' : ''
    document.body.style.overflow = overflowValue
    document.documentElement.style.overflow = overflowValue
  }
})

// Campos de contraseña
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Datos
const ciudades = ref([])
const loadingCiudades = ref(false)
const originalUserData = ref(null)
const originalBarberiaData = ref(null)

// Datos del usuario con valores por defecto seguros
const user = ref({
  id_usuario: null,
  nombre: '',
  email: '',
  telefono: '',
  id_ciudad: null,
  ciudad: '',
  ciudadSeleccionada: null,
  fecha_registro: new Date().toISOString(),
  id_rol: null,
  role: 'usuario',
  rol_nombre: 'Usuario',
  imagen_url: null,
  imagen_public_id: null
})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// Información de contacto
const contactInfo = ref([])

// Obtener información de contacto de la empresa
const fetchContactInfo = async () => {
  try {
    const [emailRes, phoneRes] = await Promise.all([
      $api('/config/valor/correo_empresa'),
      $api('/config/valor/numero_empresa')
    ])

    contactInfo.value = [
      { type: 'email', value: emailRes.valor || 'contactomisegurohn@gmail.com' },
      { type: 'phone', value: phoneRes.valor || '+504 9451-7811' }
    ]
  } catch (error) {
    console.error('Error al cargar información de contacto:', error)
    // Valores por defecto en caso de error
    contactInfo.value = [
      { type: 'email', value: 'contactomisegurohn@gmail.com' },
      { type: 'phone', value: '+504 9451-7811' }
    ]
  }
}

// ===== COMPUTED PROPERTIES =====
const userInitials = computed(() => {
  if (!user.value?.nombre) return '?'
  try {
    return user.value.nombre
      .split(' ')
      .filter(Boolean)
      .map(n => n[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2)
  } catch (error) {
    console.error('Error al generar las iniciales:', error)
    return '?'
  }
})

const hasChanges = computed(() => {
  if (!originalUserData.value) return false;
  
  return (
    user.value.nombre !== originalUserData.value.nombre ||
    user.value.email !== originalUserData.value.email ||
    user.value.telefono !== originalUserData.value.telefono ||
    user.value.id_ciudad !== originalUserData.value.id_ciudad
  );
})

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && 
         newPassword.value !== confirmPassword.value;
})

const isBarber = computed(() => {
  return technicianServices.value.some(s => s.nombre.toLowerCase().includes('barbería'));
})

const hasBarberiaChanges = computed(() => {
  if (!originalBarberiaData.value) return !!barberia.value.nombre;
  
  return (
    barberia.value.nombre !== originalBarberiaData.value.nombre ||
    barberia.value.colonia !== originalBarberiaData.value.colonia ||
    barberia.value.direccion_precisa !== originalBarberiaData.value.direccion_precisa
  );
})

// ===== FUNCIONES DE UTILIDAD =====
const formatShortDate = (dateString) => {
  if (!dateString) return '--/--/----'
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}

const showToast = (options) => {
  toast.value.show = false;
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    };
  });
}

const showSuccess = (title, message) => { 
  const toastMessage = message ? `${title} \n${message}` : title;
  
  showToast({
    message: toastMessage,
    type: 'success',
    duration: 5000
  });  
}

const showError = (title, message) => {
  const errorMessage = message || title;
  console.error('Error:', errorMessage);
  
  showToast({
    message: errorMessage,
    type: 'error',
    duration: 8000
  });
}

// ===== FUNCIONES DE CARGA DE DATOS =====
const cargarCiudades = async () => {
  try {
    loadingCiudades.value = true
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
    showError('Error', 'No se pudieron cargar las ciudades')
  } finally {
    loadingCiudades.value = false
  }
}

// Funciones para gestión de servicios del técnico
const fetchAvailableServices = async () => {
  try {
    loadingServices.value = true
    const userVal = useCookie('user').value
    const id_ciudad = userVal?.id_ciudad

    const response = await $api('/servicios/activos', {
      method: 'GET',
      params: id_ciudad ? { id_ciudad } : {}
    })
    
    if (response.success && response.data) {
      availableServices.value = response.data
    } else if (Array.isArray(response)) {
      availableServices.value = response
    }
  } catch (error) {
    console.error('Error al cargar servicios disponibles:', error)
    showError('Error', 'No se pudieron cargar los servicios disponibles.')
  } finally {
    loadingServices.value = false
  }
}

const fetchTechnicianServices = async () => {
  try {
    const userId = auth.user?.id_usuario || userCookie.value?.id_usuario
    if (!userId) return
    
    const response = await $api(`/tecnicoServicio/${userId}`, {
      method: 'GET'
    })
    
    if (response.success && response.data) {
      technicianServices.value = response.data
    } else if (Array.isArray(response)) {
      technicianServices.value = response
    }
  } catch (error) {
    console.error('Error al cargar servicios del técnico:', error)
    showError('Error', 'No se pudieron cargar tus servicios asignados.')
  }
}

const fetchTechnicianBarberia = async () => {
  try {
    const userId = auth.user?.id_usuario || userCookie.value?.id_usuario
    if (!userId) return
    
    loadingBarberia.value = true
    const data = await $api(`/barberias/tecnico/${userId}`)
    if (data) {
      barberia.value = data
      originalBarberiaData.value = { ...data }
    } else {
      barberia.value = {
        id_barberia: null,
        id_tecnico: userId,
        nombre: '',
        colonia: '',
        direccion_precisa: '',
        foto1: '',
        foto2: ''
      }
      originalBarberiaData.value = null
    }
  } catch (error) {
    console.error('Error al cargar barbería del técnico:', error)
  } finally {
    loadingBarberia.value = false
  }
}

const saveBarberia = async () => {
  try {
    const userId = auth.user?.id_usuario || userCookie.value?.id_usuario
    if (!userId) return

    isSavingBarberia.value = true
    const method = barberia.value.id_barberia ? 'PUT' : 'POST'
    const url = barberia.value.id_barberia ? `/barberias/${barberia.value.id_barberia}` : '/barberias'
    
    const payload = {
      ...barberia.value,
      id_tecnico: userId
    }

    const response = await $api(url, {
      method,
      body: payload
    })

    if (response.success) {
      showSuccess('¡Éxito!', 'Información de barbería guardada.')
      const barberData = response.data || barberia.value;
      if (!barberia.value.id_barberia) {
         barberia.value = barberData
      }
      originalBarberiaData.value = { ...barberia.value }
    } else {
      showError('Error', response.error || 'No se pudo guardar la información.')
    }
  } catch (error) {
    console.error('Error al guardar barbería:', error)
    showError('Error', 'Ocurrió un error inesperado.')
  } finally {
    isSavingBarberia.value = false
  }
}

// Función para asignar un servicio al técnico
const assignServiceToTechnician = async (serviceId) => {
  try {
    const userId = auth.user?.id_usuario || userCookie.value?.id_usuario
    if (!userId) {
      showError('Error', 'No se pudo obtener tu ID de usuario.')
      return
    }
    
    const response = await $api('/tecnicoServicio', {
      method: 'POST',
      body: {
        id_tecnico: userId,
        id_servicio: serviceId
      }
    })
    
    if (response.success) {
      showSuccess('¡Éxito!', 'Servicio asignado correctamente.')
      // Cerrar el panel automáticamente
      showServiceModal.value = false
      // Recargar los servicios del técnico
      await fetchTechnicianServices()
      // Actualizar la lista de servicios disponibles
      await fetchAvailableServices()
    } else {
      showError('Error', response.error || 'Error al asignar el servicio.')
    }
  } catch (error) {
    console.error('Error al asignar servicio:', error)
    showError('Error', 'Error al asignar el servicio. Intente de nuevo.')
  }
}

// Función para eliminar un servicio asignado
const removeServiceFromTechnician = async (tecnicoServicioId) => {
  try {
    const response = await $api(`/tecnicoServicio/${tecnicoServicioId}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      showSuccess('¡Éxito!', 'Servicio eliminado correctamente.')
      // Recargar los servicios del técnico
      await fetchTechnicianServices()
      // Actualizar la lista de servicios disponibles
      await fetchAvailableServices()
    } else {
      showError('Error', response.error || 'Error al eliminar el servicio.')
    }
  } catch (error) {
    console.error('Error al eliminar servicio:', error)
    showError('Error', 'Error al eliminar el servicio. Intente de nuevo.')
  }
}

// Función para verificar si un servicio está asignado
const isServiceAssigned = (serviceId) => {
  return technicianServices.value.some(ts => ts.id_servicio === serviceId)
}

// Función para obtener la etiqueta de la ciudad
const getCiudadLabel = (option) => {
  if (!option) return ''
  return option.nombre || ''
}

const fetchUserData = async () => {
  try {
    const userData = userCookie.value
    if (!userData || !userData.id_usuario) {
      console.warn('No hay datos de usuario válidos en las cookies');
      return false
    }
    
    const data = await $api(`/usuarios/id/${userData.id_usuario}`)
    
    if (!data) {
      throw new Error('No se recibieron datos del usuario')
    }
    
    const ciudadId = data.id_ciudad || data.ciudad?.id_ciudad;
    let ciudadNombre = data.ciudad?.nombre_ciudad || data.ciudad || '';
    
    const safeUserData = {
      ...data,
      nombre: data.nombre || '',
      email: data.email || '',
      telefono: data.telefono || '',
      id_usuario: data.id_usuario || userId,
      id_rol: data.id_rol || null,
      id_ciudad: ciudadId,
      ciudad: ciudadNombre,
      rol_nombre: data.rol?.nombre_rol || data.rol_nombre || 'Usuario',
      role: data.role || 'usuario',
    }
    
    user.value = {
      ...user.value,
      ...safeUserData,
      fecha_registro: safeUserData.fecha_registro || new Date().toISOString(),
      rol_nombre: safeUserData.rol_nombre || 'Usuario'
    }
    
    if (auth) {
      await auth.setUser(safeUserData)
    }
    
    return true
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error)
    showError('Error', 'No se pudieron cargar los datos del perfil')
    return false
  }
}

// Add this watch function if it doesn't exist
watch(() => ciudades.value, (newCiudades) => {
  if (newCiudades.length > 0 && user.value.id_ciudad) {
    const ciudad = newCiudades.find(c => c.id_ciudad === user.value.id_ciudad);
    if (ciudad) {
      user.value.ciudadSeleccionada = {
        id_ciudad: ciudad.id_ciudad,
        nombre: ciudad.nombre_ciudad || ciudad.nombre
      };
    }
  }
}, { immediate: true });

const cargarDatosPerfil = async () => {
  try {
    await Promise.all([
      cargarCiudades(),
      fetchUserData(),
      fetchAvailableServices(),
      fetchTechnicianServices(),
      fetchTechnicianBarberia()
    ])
    
    return true
  } catch (error) {
    console.error('Error al cargar el perfil:', error)
    showError('Error', 'No se pudo cargar la información del perfil')
    return false
  }
}

// ===== FUNCIONES DE MANEJO DE IMÁGENES =====
const onFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    showError('Error', 'Formato de archivo no válido. Solo se permiten imágenes JPG, PNG o WebP.')
    return
  }

  // Validar tamaño (máximo 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    showError('Error', 'La imagen es demasiado grande. El tamaño máximo permitido es 5MB.')
    return
  }

  uploadProfileImage(file)
}

const uploadProfileImage = async (file) => {
  const formData = new FormData()
  formData.append('imagen', file)
  
  // Verificar que el ID de usuario existe
  if (!user.value || !user.value.id_usuario) {
    console.error('ID de usuario no encontrado')
    showError('Error', 'No se pudo identificar tu cuenta. Por favor, recarga la página e intenta de nuevo.')
    return
  }
  
  const url = `/usuarios/imagen-perfil/${user.value.id_usuario}`
  const fullUrl = `${config.public.apiBase}${url}`
  
  try {
    isUploading.value = true
    
    const response = await $api(url, {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      // Actualizar la URL de la imagen en el estado del usuario
      user.value.imagen_url = response.data.imagen_url
      user.value.imagen_public_id = response.data.imagen_public_id
      
      showSuccess('¡Éxito!', 'Imagen de perfil actualizada correctamente')
    } else {
      console.error('Error en la respuesta del servidor:', response)
      showError('Error', response.message || 'No se pudo actualizar la imagen de perfil')
    }
  } catch (error) {
    console.error('Error al subir la imagen:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? {
          ...error.config.headers,
          Authorization: error.config.headers.Authorization ? 'Bearer [TOKEN]' : undefined
        } : undefined
      }
    })
    showError('Error', 'No se pudo subir la imagen. Por favor, verifica tu conexión e inténtalo de nuevo.')
  } finally {
    isUploading.value = false
    // Limpiar el input de archivo
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const deleteProfileImage = async () => { 

  // Verificar que el ID de usuario existe
  if (!user.value || !user.value.id_usuario) {
    console.error('ID de usuario no encontrado')
    showError('Error', 'No se pudo identificar tu cuenta. Por favor, recarga la página e intenta de nuevo.')
    return
  } 

  const url = `/usuarios/imagen-perfil/${user.value.id_usuario}` 

  try {
    isUploading.value = true
    
    const response = await $api(url, {
      method: 'DELETE'
    }) 

    if (response.success) {
      // Eliminar la referencia a la imagen en el estado del usuario
      user.value.imagen_url = null
      user.value.imagen_public_id = null
      
      showSuccess('¡Éxito!', 'Imagen de perfil eliminada correctamente')
    } else {
      console.error('Error en la respuesta del servidor (DELETE):', response)
      showError('Error', response.message || 'No se pudo eliminar la imagen de perfil')
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers ? {
          ...error.config.headers,
          Authorization: error.config.headers.Authorization ? 'Bearer [TOKEN]' : undefined
        } : undefined
      }
    })
    showError('Error', 'No se pudo eliminar la imagen. Por favor, verifica tu conexión e inténtalo de nuevo.')
  } finally {
    isUploading.value = false
  }
}

const onBarberiaFileChange = (event, campo) => {
  const file = event.target.files[0]
  if (!file) return

  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    showError('Error', 'Formato no válido. Use JPG, PNG o WebP.')
    return
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    showError('Error', 'La imagen supera los 5MB.')
    return
  }

  uploadBarberiaImage(file, campo)
}

const uploadBarberiaImage = async (file, campo) => {
  if (!barberia.value.id_barberia) {
    showError('Aviso', 'Primero guarda la información básica del local antes de subir fotos.')
    return
  }

  const formData = new FormData()
  formData.append('imagen', file)
  
  try {
    isUploading.value = true
    const response = await $api(`/barberias/foto/${barberia.value.id_barberia}/${campo}`, {
      method: 'POST',
      body: formData
    })
    
    if (response.success) {
      barberia.value[campo] = response.data.url
      showSuccess('¡Éxito!', 'Imagen actualizada.')
    } else {
      showError('Error', response.error || 'No se pudo subir la imagen.')
    }
  } catch (error) {
    console.error('Error al subir imagen de barbería:', error)
    showError('Error', 'Error al procesar la subida.')
  } finally {
    isUploading.value = false
    if (campo === 'foto1' && fileInputBarberia1.value) fileInputBarberia1.value.value = ''
    if (campo === 'foto2' && fileInputBarberia2.value) fileInputBarberia2.value.value = ''
  }
}

const deleteBarberiaImage = async (campo) => {
  if (!barberia.value.id_barberia || !barberia.value[campo]) return

  try {
    isUploading.value = true
    const response = await $api(`/barberias/foto/${barberia.value.id_barberia}/${campo}`, {
      method: 'DELETE'
    })

    if (response.success) {
      barberia.value[campo] = null
      showSuccess('¡Éxito!', 'Imagen eliminada.')
    }
  } catch (error) {
    console.error('Error al eliminar imagen:', error)
    showError('Error', 'No se pudo eliminar la imagen.')
  } finally {
    isUploading.value = false
  }
}

// Referencia al input de archivo
const fileInput = ref(null)
const fileInputBarberia1 = ref(null)
const fileInputBarberia2 = ref(null)

// ===== FUNCIONES DE ACCIONES =====
const saveProfile = async () => {
  try {
    const userData = {
      nombre: user.value.nombre,
      email: user.value.email,
      telefono: user.value.telefono,
      id_ciudad: user.value.id_ciudad
    }; 
    
    const response = await $api(`/usuarios/${userCookie.value.id_usuario}`, {
      method: 'PUT',
      body: userData
    });
    
    originalUserData.value = { ...user.value };
    
    userCookie.value = {
      ...userCookie.value,
      nombre: user.value.nombre, 
      id_ciudad: user.value.id_ciudad
    } 
    
    showToast({
      type: 'success',
      message: '¡Perfil actualizado correctamente!',
      duration: 1500
    });
    
  } catch (error) {
    console.error('❌ Error en saveProfile:', error)
    
    const responseData = error.data || {};
    let errorMessage = 'Error al guardar el perfil';
    
    if (responseData.message) {
      errorMessage = responseData.message;
    } else if (responseData.error === 'Error de validación' && responseData.field) {
      errorMessage = responseData.message || `Error en el campo ${responseData.field}`;
    } else if (error.statusCode === 500) {
      errorMessage = 'Error interno del servidor. Por favor, intente nuevamente.';
    }
    
    console.error('❌ Error al guardar el perfil:', errorMessage);
    
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
    const response = await $api(`/usuarios/cambio-clave/${userCookie.value.id_usuario}`, {
      method: 'PUT',
      body: {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      }
    }); 
    
    isPasswordModalOpen.value = false;
    
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
    
    showToast({
      type: 'success',
      message: '¡Contraseña actualizada correctamente!',
      duration: 3000
    });
    
  } catch (error) {
    let errorMessage = 'Error al actualizar la contraseña. Verifica tu contraseña actual.';
    
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
    
    showToast({
      type: 'error',
      message: errorMessage,
      duration: 5000
    });
    
    currentPassword.value = '';
  }
}

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.logout();
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
            showSuccess('¡Éxito!', 'Notificaciones activadas correctamente')
        } else if (result.error === 'denied') {
            showError('Permiso denegado', 'Debes permitir las notificaciones en tu navegador')
        } else if (result.error === 'supported') {
            showError('No soportado', 'Tu navegador no soporta notificaciones push')
        } else {
            showError('Error', result.error || 'No se pudieron activar las notificaciones')
        }
    } catch (error) {
        console.error('Error al suscribir:', error)
        showError('Error', 'Ocurrió un error inesperado al activar las notificaciones')
    }
}

const confirmUnsubscribe = async () => {
  try {
    await unsubscribe()
    showUnsubscribeModal.value = false
    toast.value.show = true
    toast.value.message = 'Notificaciones desactivadas'
    toast.value.type = 'info'
  } catch (error) {
    console.error('Error al desactivar:', error)
  }
}


// ===== WATCHERS =====
// Watch para sincronizar id_ciudad con ciudadSeleccionada
watch(() => user.value.id_ciudad, (newId) => {
  if (newId && ciudades.value.length > 0) {
    const ciudadSeleccionada = ciudades.value.find(c => c.id_ciudad === newId);
    if (ciudadSeleccionada) {
      user.value.ciudadSeleccionada = ciudadSeleccionada;
      user.value.ciudad = ciudadSeleccionada.nombre;
    }
  } else {
    user.value.ciudadSeleccionada = null;
    user.value.ciudad = null;
  }
});

// Watch para sincronizar ciudadSeleccionada con id_ciudad
watch(() => user.value.ciudadSeleccionada, (newCiudad) => {
  if (newCiudad) {
    user.value.id_ciudad = newCiudad.id_ciudad;
    user.value.ciudad = newCiudad.nombre;
  } else {
    user.value.id_ciudad = null;
    user.value.ciudad = null;
  }
});

// ===== INICIALIZACIÓN =====
// ===== INICIALIZACIÓN UNIFICADA =====
onMounted(async () => {
  try {
    const token = useCookie('token')
    const userCookieValue = useCookie('user')
    
    // Si no hay token o cookie, redirigir al inicio en lugar de recargar infinitamente
    if (!token.value || !userCookieValue.value) { 
      console.warn('Sesión no encontrada o expirada en Perfil Técnico. Redirigiendo...');
      navigateTo('/')
      return
    }
    
    // Cargar todos los datos necesarios en paralelo
    await Promise.all([
      cargarDatosPerfil(),
      fetchContactInfo(),
      checkSubscription()
    ])
    
    // Inicializar originalUserData tras la carga exitosa
    if (user.value) {
      originalUserData.value = {
        nombre: user.value.nombre,
        email: user.value.email,
        telefono: user.value.telefono,
        id_ciudad: user.value.id_ciudad
      }
    }
  } catch (error) { 
    console.error('Error fatal durante la carga del perfil técnico:', error);
    if (error.statusCode === 401) {
      navigateTo('/') 
    }
  } finally {
    // Asegurar que el estado de carga termine pase lo que pase
    isLoading.value = false
  }
})

</script>

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

/* Estilos personalizados para Multiselect - Sincronizado con Perfil.vue */
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
  width: 1.5rem !important;
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
    background-color: #4b5563 !important;
    color: #f9fafb !important;
}

.dark .multiselect-custom :deep(.multiselect__option--selected) {
    background-color: #4b5563 !important;
    color: #f9fafb !important;
}

.multiselect-custom :deep(.multiselect__option--selected.multiselect__option--highlight) {
    background-color: #4b5563 !important;
    color: #f9fafb !important;
}

.dark .multiselect-custom :deep(.multiselect__option--selected.multiselect__option--highlight) {
    background-color: #4b5563 !important;
    color: #f9fafb !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>