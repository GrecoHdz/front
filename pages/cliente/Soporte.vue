<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">

      <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Verificando autenticación...'"
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
    <HeadersHeaderSoporte/>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <Toast 
        v-if="toast.show"
        :message="toast.message" 
        :type="toast.type"
        @close="toast.show = false"
      />
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Soporte Técnico</h1>
      <!-- Contact Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Contáctanos</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ayudarte.</p>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asunto</label>
            <select 
              v-model="form.subject" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              required
            >
              <option value="" disabled selected>Selecciona un asunto</option>
              <option value="falla">Problema con un Servicio Completado</option>
              <option value="duda">Duda con Servicios Ofrecidos</option>
              <option value="queja">Queja sobre Técnico</option> 
              <option value="pago">Duda sobre Pagos</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          
          <!-- Selector de servicio (solo visible cuando se selecciona 'Problema con un Servicio Completado') -->
          <div v-if="form.subject === 'falla'">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Servicio con problema</label>
            <div class="relative">
              <select 
                ref="servicioSelect"
                v-model="form.servicio_id"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white relative z-10"
                required
                :disabled="cargandoServicios"
              >
                <option value="" disabled selected>Selecciona un servicio</option>
                <option 
                  v-for="servicio in serviciosFinalizados" 
                  :key="servicio.id_solicitud" 
                  :value="servicio.id_solicitud"
                >
                  {{ limitarTexto(servicio.descripcion) }} - {{ servicio.colonia }} - {{ formatDate(servicio.fecha_solicitud) }}
                </option>
              </select>
              <!-- Indicador de pulso -->
              <div 
                v-if="showPulse" 
                class="absolute -inset-1 bg-blue-500/20 rounded-xl animate-pulse z-0"
              ></div>
            </div>
            <p v-if="cargandoServicios" class="text-sm text-blue-600 dark:text-blue-400 mt-1">Cargando servicios finalizados...</p>
            <p v-if="errorCargaServicios" class="text-sm text-red-600 dark:text-red-400 mt-1">{{ errorCargaServicios }}</p>
            <p v-if="!cargandoServicios && serviciosFinalizados.length === 0 && !errorCargaServicios" class="text-sm text-gray-500 dark:text-gray-400 mt-1">No tienes servicios finalizados</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensaje</label>
            <textarea 
              v-model="form.message" 
              rows="4" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Describe tu consulta o problema..."
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">Enviar Mensaje</span>
            <span v-else>Enviando...</span>
          </button>
        </form>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Preguntas Frecuentes</h2>
        
        <div class="space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 dark:border-gray-700 pb-4">
            <button 
              @click="toggleFaq(index)"
              class="w-full flex justify-between items-center text-left focus:outline-none"
            >
              <span class="font-medium text-gray-900 dark:text-white">{{ faq.question }}</span>
              <svg 
                class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-200"
                :class="{ 'transform rotate-180': activeFaq === index }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              v-show="activeFaq === index"
              class="mt-2 text-gray-600 dark:text-gray-300 text-sm"
              v-html="faq.answer"
            ></div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Información de Contacto</h2>
        
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Correo Electrónico</h3>
              <p class="text-gray-600 dark:text-gray-300">soporte@prohogar.hn</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Respuesta en 24 horas</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Teléfono</h3>
              <p class="text-gray-600 dark:text-gray-300">+504 2234-5678</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Lunes a Viernes, 8:00 AM - 5:00 PM</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-3">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white">Oficina Principal</h3>
              <p class="text-gray-600 dark:text-gray-300">Colonia Palmira, Avenida República de Panamá</p>
              <p class="text-gray-600 dark:text-gray-300">Tegucigalpa, Honduras</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <FootersFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useHead, useCookie } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import FootersFooter from '@/components/footers/footer.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'
// Obtener la configuración
const config = useRuntimeConfig()
// SEO and Meta
useHead({
  title: 'HogarSeguro - Dashboard',
  meta: [
    { name: 'description', content: 'Panel de control de HogarSeguro - Gestiona tus servicios y membresía' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
  ]
})

// Autenticación
const auth = useAuthStore()
const router = useRouter() 
const isLoading = ref(true) 
const user = useCookie('user')
const token = useCookie('token')

// Función para verificar autenticación
const checkAuth = async () => {
  try {
    if (!token.value) {
      router.push('/auth/login')
      return false
    }
    return true
  } catch (error) {
    console.error('Error al verificar autenticación:', error)
    router.push('/auth/login')
    return false
  }
}

// Verificar autenticación y manejar el hash #problemaServicio al cargar el componente
onMounted(async () => {
  const isAuthenticated = await checkAuth()
  
  if (isAuthenticated) {
    // Verificar si hay un hash #problemaServicio
    if (process.client && window.location.hash === '#problemaServicio') {
      // Establecer el asunto como 'Problema con un Servicio Completado' de inmediato
      form.value.subject = 'falla'
      
      // Usar nextTick para asegurar que el DOM esté listo
      nextTick(async () => {
        try {
          // Cargar los servicios finalizados
          await cargarServiciosFinalizados()
          
          // Esperar un momento para asegurar que el DOM se haya actualizado
          await nextTick()
          
          // Desplazarse al formulario después de cargar los servicios
          const formElement = document.querySelector('form')
          if (formElement) {
            // Usar requestAnimationFrame para asegurar que el scroll se ejecute en el siguiente ciclo de renderizado
            requestAnimationFrame(() => {
              formElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center'
              })
            })
          }
          
          // Activar animación de pulso en el select
          showPulse.value = true
          
          // Desactivar la animación después de 3 segundos
          setTimeout(() => {
            showPulse.value = false
          }, 3000)
          
        } catch (error) {
          console.error('Error al cargar servicios finalizados:', error)
        } finally {
          // Limpiar el hash sin recargar la página
          window.history.replaceState({}, document.title, window.location.pathname)
        }
      })
    }
    
    // Marcar como cargado
    isLoading.value = false
  }
})

const activeFaq = ref(null)
const isSubmitting = ref(false)

const form = ref({
  subject: '',
  message: '',
  servicio_id: ''
})

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  }
}

const serviciosFinalizados = ref([])
const cargandoServicios = ref(false)
const errorCargaServicios = ref('')
const showPulse = ref(false)

// Referencia al select de servicios
const servicioSelect = ref(null)

// Función para limitar el texto a un número máximo de palabras
const limitarTexto = (texto, maxPalabras = 7) => {
  if (!texto) return ''
  const palabras = texto.trim().split(' ')
  if (palabras.length <= maxPalabras) return texto
  return palabras.slice(0, maxPalabras).join(' ') + '...'
}

// Función para formatear fechas en formato corto
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-HN', options)
}

// Cargar servicios finalizados del usuario
const cargarServiciosFinalizados = async () => {
  const userCookie = useCookie('user').value
  if (!userCookie?.id_usuario) {
    console.error('No se pudo obtener el ID de usuario')
    return
  }
  
  cargandoServicios.value = true
  errorCargaServicios.value = ''
  
  try {
    const response = await $fetch(`/solicitudservicio/usuario/${userCookie.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('token').value}`
      }
    })
    
    // Verificar si la respuesta tiene la propiedad 'solicitudes'
    const servicios = Array.isArray(response) ? response : response?.solicitudes || []
    
    if (!Array.isArray(servicios)) {
      console.error('Formato de respuesta inesperado del servidor:', response)
      serviciosFinalizados.value = []
      return
    }
    
    // Filtrar solo servicios finalizados o completados
    serviciosFinalizados.value = servicios.filter(servicio => 
      servicio && servicio.estado && 
      (servicio.estado.toLowerCase() === 'finalizado' || servicio.estado.toLowerCase() === 'completado')
    )
     
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    errorCargaServicios.value = 'No se pudieron cargar los servicios. Por favor, intente más tarde.'
    showToast('Error al cargar los servicios', 'error')
  } finally {
    cargandoServicios.value = false
  }
}

// Observar cambios en el select de asunto
watch(() => form.value.subject, (newVal) => {
  // Resetear el servicio seleccionado
  form.value.servicio_id = ''
  
  // Si se selecciona "Problema con un Servicio Completado", cargar los servicios
  if (newVal === 'falla') {
    cargarServiciosFinalizados()
  }
})

const faqs = [
  {
    question: '¿Cómo puedo solicitar un servicio?',
    answer: 'Para solicitar un servicio, inicia sesión en tu cuenta, ve a la sección "Servicios" y selecciona el tipo de servicio que necesitas. Completa el formulario con los detalles y un técnico se pondrá en contacto contigo a la brevedad.'
  },
  {
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Aceptamos pagos con tarjeta de crédito/débito (Visa, MasterCard, American Express), transferencia bancaria y efectivo al momento del servicio.'
  },
  {
    question: '¿Cuál es el tiempo de respuesta para soporte?',
    answer: 'Nuestro equipo de soporte atiende consultas por correo electrónico en un plazo máximo de 24 horas hábiles. Para emergencias, contamos con un número de atención telefónica de lunes a domingo.'
  },
  {
    question: '¿Ofrecen garantía por los servicios?',
    answer: 'Sí, todos nuestros servicios incluyen una garantía de 30 días. Si el problema persiste después de nuestra intervención, volveremos sin costo adicional.'
  },
  {
    question: '¿Cómo puedo cancelar o reprogramar una cita?',
    answer: 'Puedes cancelar o reprogramar tu cita con al menos 24 horas de anticipación llamando a nuestro centro de atención al cliente o a través de la sección "Mis Citas" en tu perfil.'
  }
]

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    const userCookie = useCookie('user').value
    if (!userCookie?.id_usuario) {
      throw new Error('No se pudo obtener la información del usuario')
    }

    const dataToSend = {
      id_usuario: parseInt(userCookie.id_usuario),
      asunto: form.value.subject,
      mensaje: form.value.message,
      ...(form.value.servicio_id && { id_solicitud: parseInt(form.value.servicio_id) })
    }
    

    
    const response = await $fetch('/soporte', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    showToast('Tu solicitud ha sido enviada. Nos pondremos en contacto contigo pronto.', 'success')
    
    // Resetear formulario
    form.value = {
      subject: '',
      message: '',
      servicio_id: ''
    }
    
  } catch (error) {
    const errorMessage = error.response?._data?.message || 'Ocurrió un error al enviar tu solicitud. Por favor, inténtalo de nuevo.'
    showToast(errorMessage, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.02);
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>