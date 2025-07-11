<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
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
        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400">🏆</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-blue-800 dark:text-blue-200">Membresía activa hasta</p>
                  <p class="text-sm font-bold text-blue-900 dark:text-white">{{ membershipEndDate }}</p>
                </div>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 mb-3">
                <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" :style="`width: ${membershipProgress}%`"></div>
              </div>
            </div>
            <button 
              @click="renovarMembresia"
              class="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              Renovar Ahora
            </button>
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
            <select
              v-model="user.ciudad"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white appearance-none"
            >
              <option value="" disabled>Selecciona una ciudad</option>
              <option v-for="city in hondurasCities" :key="city" :value="city">
                {{ city }}
              </option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cambiar Contraseña</label>
            <div class="space-y-3">
              <input 
                v-model="currentPassword"
                type="password" 
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="Contraseña actual"
              >
              <input 
                v-model="newPassword"
                type="password" 
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="Nueva contraseña"
              >
              <input 
                v-model="confirmPassword"
                type="password" 
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
                placeholder="Confirmar nueva contraseña"
              >
            </div>
          </div>
          
          <div class="flex flex-col space-y-3 pt-2">
            <button 
              @click="saveProfile"
              class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Actualizar Perfil
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
          <button class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200">
            <p class="text-sm font-medium text-red-600 dark:text-red-400">Cerrar sesión</p>
          </button>
        </div>
      </div>
    </div> 
    <Footer />  
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

// List of major cities in Honduras
const hondurasCities = [
  'Tegucigalpa',
  'San Pedro Sula',
  'Choloma',
  'La Ceiba',
  'El Progreso',
  'Choluteca',
  'Comayagua',
  'Puerto Cortés',
  'La Lima',
  'Danlí',
  'Siguatepeque',
  'Juticalpa',
  'Tocoa',
  'Villanueva',
  'Tela',
  'Santa Rosa de Copán',
  'Olanchito',
  'San Lorenzo',
  'Cofradía',
  'La Paz'
]

// User data (this would typically come from your auth store/API)
const user = ref({
  id_usuario: 12345,
  id_rol: 1, // 1 = cliente, 2 = admin, etc.
  nombre: 'Juan Pérez',
  email: 'juan.perez@example.com',
  telefono: '+504 9999-9999',
  ciudad: 'Tegucigalpa',
  fecha_registro: '2023-01-15T00:00:00.000Z',
  membership: {
    status: 'activa',
    plan: 'Premium',
    startDate: '2023-01-15',
    endDate: '2023-12-31',
    progress: 65
  }
})

// Password change fields
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Get user role name
const userRole = computed(() => {
  const roles = {
    1: 'Cliente',
    2: 'Administrador',
    3: 'Técnico'
  }
  return roles[user.value.id_rol] || 'Usuario'
})

// Computed properties
const userInitials = computed(() => {
  const name = user.value?.nombre || ''
  return name
    .split(' ')
    .filter(Boolean) // Remove empty strings from multiple spaces
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'US' // Default to 'US' if no name
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
const saveProfile = async () => {
  try {
    // In a real app, you would make an API call to update the user profile
    // Example:
    // await api.put(`/usuarios/${user.value.id_usuario}`, {
    //   nombre: user.value.nombre,
    //   email: user.value.email,
    //   telefono: user.value.telefono
    // })
    
    showSuccess('¡Perfil actualizado!', 'Tus cambios se han guardado correctamente.')
  } catch (error) {
    console.error('Error al actualizar el perfil:', error)
    showError('Error', 'No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.')
  }
}

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showError('Error', 'Las contraseñas no coinciden')
    return
  }
  
  try {
    // In a real app, you would make an API call to update the password
    // Example:
    // await api.put(`/usuarios/${user.value.id_usuario}/password`, {
    //   currentPassword: currentPassword.value,
    //   newPassword: newPassword.value
    // })
    
    // Clear password fields after successful update
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    
    showSuccess('¡Contraseña actualizada!', 'Tu contraseña ha sido cambiada exitosamente.')
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error)
    showError('Error', 'No se pudo actualizar la contraseña. Verifica tu contraseña actual e inténtalo de nuevo.')
  }
}

// Helper functions for notifications
const showSuccess = (title, message) => {
  // In a real app, use a toast notification library
  alert(`${title}: ${message}`)
}

const showError = (title, message) => {
  // In a real app, use a toast notification library
  alert(`❌ ${title}: ${message}`)
}

// Membership functions
const renovarMembresia = () => {
  // In a real app, this would open a payment modal or redirect to payment page
  alert('Redirigiendo al proceso de renovación de membresía...')
}
const membershipEndDate = computed(() => {
  return new Date(user.value.membership.endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const membershipProgress = computed(() => user.value.membership.progress)

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

// Initialize dark mode from localStorage or system preference
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode !== null) {
    darkMode.value = savedDarkMode === 'true'
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    darkMode.value = true
  }
})
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>