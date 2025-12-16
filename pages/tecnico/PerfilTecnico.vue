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
          <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl text-white mb-3 sm:mb-4 shadow-lg">
            {{ userInitials }}
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
                :show-labels="false"
                placeholder="Seleccionar ciudad"
                label="nombre"
                track-by="id_ciudad"
                class="multiselect-custom"
                :class="{ 'multiselect--active': user.ciudadSeleccionada }"
                :select-label="''"
                :deselect-label="''"
                :selected-label="''"
                :no-options="loadingCiudades ? 'Cargando ciudades...' : 'No hay ciudades disponibles'"
                :no-result="'No se encontraron resultados'"
                :loading="loadingCiudades"
                :disabled="loadingCiudades || !ciudades.length"
                :custom-label="getCityLabel"
                @search-change="$event && $event.stopPropagation()"
                @search-focus="(e) => e && e.target && e.target.blur()"
                @touchstart.native.stop
                @click.native.stop
                :options-limit="100"
              >
                <template #singleLabel="{ option }">
                  <span class="text-xs truncate">{{ getCityLabel(option) }}</span>
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
          </div>
        </div>
      </div>

      <!-- Gestión de Servicios -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Mis Servicios</h3>
          <button 
            @click="showServiceModal = !showServiceModal"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ showServiceModal ? 'Cerrar' : 'Agregar' }}
          </button>
        </div>
        
        <!-- Servicios asignados -->
        <div class="mb-4">
          <div v-if="loadingServices" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
          
          <div v-else-if="technicianServices.length === 0" class="text-center py-6 text-gray-500">
            <p class="text-sm">No tienes servicios asignados</p>
            <button 
              @click="showServiceModal = true"
              class="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Agregar servicios
            </button>
          </div>
          
          <div v-else class="space-y-2">
            <div 
              v-for="service in technicianServices" 
              :key="service.id_servicio"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ service.nombre }}</p>
                </div>
              </div>
              <button 
                @click="removeServiceFromTechnician(service.id_tecnico_servicio)"
                class="text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar servicio"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Panel para agregar servicios -->
        <div v-if="showServiceModal" class="border-t pt-4 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Agregar nuevos servicios</h4>
          
          <div v-if="loadingServices" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
          
          <div v-else-if="availableServices.length === 0" class="text-center py-4 text-gray-500">
            <p class="text-sm">No hay servicios disponibles</p>
          </div>
          
          <div v-else class="space-y-2 max-h-60 overflow-y-auto">
            <div 
              v-for="service in availableServices" 
              :key="service.id_servicio"
              class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ service.nombre }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ service.descripcion }}</p>
              </div>
              <button 
                v-if="!isServiceAssigned(service.id_servicio)"
                @click="assignServiceToTechnician(service.id_servicio)"
                class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Agregar
              </button>
              <span 
                v-else
                class="px-3 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded"
              >
                Ya asignado
              </span>
            </div>
          </div>
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
            @click="isPrivacidadModalOpen = true"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Política de privacidad</p>
          </button>
          <button 
            @click="isAcercaModalOpen = true"
            class="w-full text-left p-2.5 sm:p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg sm:rounded-xl transition-colors duration-200">
            <p class="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Acerca de HogarSeguro</p>
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

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Multiselect from 'vue-multiselect'

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const router = useRouter()
const auth = useAuthStore()
const userCookie = useCookie('user')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Perfil',
  meta: [
    { name: 'description', content: 'Perfil de usuario de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'keywords', content: 'Perfil, usuario, servicios, membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// ===== VARIABLES DE ESTADO =====
const isLoading = ref(true)
const isLoggingOut = ref(false)
const isSaving = ref(false)
const isUpdatingPassword = ref(false)
const isPasswordModalOpen = ref(false)
const isTerminosModalOpen = ref(false)
const isPrivacidadModalOpen = ref(false)
const isAcercaModalOpen = ref(false)

// Variables para gestión de servicios
const availableServices = ref([])
const technicianServices = ref([])
const loadingServices = ref(false)
const showServiceModal = ref(false)

// Campos de contraseña
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Datos
const ciudades = ref([])
const loadingCiudades = ref(false)
const originalUserData = ref(null)

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
})

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'info',
  duration: 5000
})

// Información de contacto
const contactInfo = ref([
  { type: 'email', value: 'soporte@hogarseguro.com' },
  { type: 'phone', value: '+504 1234-5678' }
])

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
  } finally {
    loadingCiudades.value = false
  }
}

// Funciones para gestión de servicios del técnico
const fetchAvailableServices = async () => {
  try {
    loadingServices.value = true
    const response = await $api('/servicios/activos', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
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
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
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

// Función para asignar un servicio al técnico
const assignServiceToTechnician = async (serviceId) => {
  try {
    const userId = auth.user?.id_usuario || userCookie.value?.id_usuario
    if (!userId) {
      showError('Error', 'No se pudo obtener tu ID de usuario.')
      return
    }
    
    const response = await $api('/tecnicoServicio', {
      baseURL: config.public.apiBase,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        id_tecnico: userId,
        id_servicio: serviceId
      })
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
      baseURL: config.public.apiBase,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
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
const getCityLabel = (option) => {
  if (!option) return ''
  return option.nombre || ''
}

const fetchUserData = async () => {
  try {
    if (!userCookie.value?.id_usuario) {
      console.error('No se pudo obtener el ID del usuario')
      return false
    }
    
    const data = await $api(`/usuarios/id/${userCookie.value.id_usuario}`, {
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
    
    const ciudadId = data.id_ciudad || data.ciudad?.id_ciudad;
    let ciudadNombre = data.ciudad?.nombre_ciudad || data.ciudad || '';
    
    const safeUserData = {
      ...data,
      nombre: data.nombre || 'Invitado',
      id_usuario: data.id_usuario || userId,
      id_rol: data.id_rol || null,
      id_ciudad: ciudadId,
      ciudad: ciudadNombre,
      rol_nombre: data.rol?.nombre_rol || data.rol_nombre || 'Usuario',
      role: data.role || 'usuario',
      // We'll set ciudadSeleccionada in the watch function when ciudades are loaded
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
  } finally {
    isLoading.value = false
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
      fetchTechnicianServices()
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
      baseURL: config.public.apiBase,
      body: userData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
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
const checkAuthAndLoad = async () => {
  try {
    const token = useCookie('token')
    const user = useCookie('user')
    
    if (!token.value || !user.value) { 
      window.location.reload()
      return
    }
    
    await cargarDatosPerfil()
    
    if (user.value) {
      originalUserData.value = { ...user.value }
    }
  } catch (error) { 
    window.location.reload() 
  }
}

onMounted(() => {
  checkAuthAndLoad()
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

/* Estilos personalizados para Multiselect - Exact match to index.vue */
.multiselect-custom {
  min-width: 140px !important;
  font-size: 0.75rem !important;
}

.multiselect-custom .multiselect__tags {
  min-height: 36px !important;
  background-color: rgb(249 250 251) !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  padding: 6px 30px 6px 10px !important;
  transition: all 0.2s ease !important;
}

.dark .multiselect-custom .multiselect__tags {
  background-color: rgb(55 65 81) !important;
  border-color: rgb(75 85 99) !important;
}

.multiselect-custom .multiselect__tags:focus-within {
  border-color: rgb(16 185 129) !important;
  box-shadow: 0 0 0 2px rgb(16 185 129) !important;
}

.dark .multiselect-custom .multiselect__tags:focus-within {
  border-color: rgb(16 185 129) !important;
  box-shadow: 0 0 0 2px rgb(16 185 129) !important;
}

.multiselect-custom .multiselect__single {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__single {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__input {
  margin: 0 !important;
  padding: 0 !important;
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
  font-size: 0.75rem !important;
  min-height: 20px !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__input {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__input::placeholder {
  color: rgb(156 163 175) !important;
}

.multiselect-custom .multiselect__placeholder {
  margin: 0 !important;
  padding: 0 !important;
  color: rgb(156 163 175) !important;
  font-size: 0.75rem !important;
  line-height: 1.25rem !important;
  margin-top: 1px !important;
}

.multiselect-custom .multiselect__select {
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

.multiselect-custom .multiselect__select:before {
  border-color: rgb(156 163 175) transparent transparent !important;
  border-style: solid !important;
  border-width: 5px 5px 0 !important;
  margin-top: 0 !important;
  top: 55% !important;
}

.dark .multiselect-custom .multiselect__select:before {
  border-color: rgb(156 163 175) transparent transparent !important;
}

.multiselect-custom .multiselect__content-wrapper {
  background-color: white !important;
  border: 1px solid rgb(229 231 235) !important;
  border-radius: 0.5rem !important;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
  margin-top: 0.25rem !important;
  z-index: 50 !important;
  min-width: 100% !important;
  width: auto !important;
}

.dark .multiselect-custom .multiselect__content-wrapper {
  background-color: rgb(31 41 55) !important;
  border-color: rgb(55 65 81) !important;
}

.multiselect-custom .multiselect__option {
  font-size: 0.75rem !important;
  color: rgb(17 24 39) !important;
  padding: 8px 12px !important;
  line-height: 1.25rem !important;
}

.dark .multiselect-custom .multiselect__option {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--highlight {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--highlight {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--selected {
    background-color: #4b5563;
    color: #f9fafb;
}

.dark .multiselect-custom .multiselect__option--selected {
    background-color: #4b5563;
    color: #f9fafb;
}

.multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
    background-color: #4b5563;
    color: #f9fafb;
}

.dark .multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
    background-color: #4b5563;
    color: #f9fafb;
}
</style>