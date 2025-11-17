<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

      <!-- Loading Spinner -->
    <LoadingSpinner 
      :loading="isLoading" 
      :message="'Verificando autenticación...'"
    />

    <!-- Contenido principal (oculto hasta completar autenticación) -->
    <div v-if="!isLoading">
    <HeadersHeaderSoporte/>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-4 max-w-2xl">
      <Toast 
        v-if="toast.show"
        :message="toast.message" 
        :type="toast.type"
        @close="toast.show = false"
      />
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-5">Soporte Técnico</h1>
      <!-- Contact Card -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Contáctanos</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 text-sm">¿Tienes alguna pregunta o necesitas ayuda? Estamos aquí para ayudarte.</p>
        
        <form @submit.prevent="submitForm" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Asunto</label>
            <select 
              v-model="form.subject" 
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
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
                class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white relative z-10 text-base"
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
                class="absolute -inset-1 bg-blue-500/20 rounded-lg animate-pulse z-0"
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
              class="w-full px-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500 text-gray-900 dark:text-white text-base"
              placeholder="Describe tu consulta o problema..."
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            class="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-base"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">Enviar Mensaje</span>
            <span v-else>Enviando...</span>
          </button>
        </form>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg mb-4">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Preguntas Frecuentes</h2>
        
        <div class="space-y-3">
          <div v-for="(faq, index) in faqs" :key="index" class="border-b border-gray-200 dark:border-gray-700 pb-3">
            <button 
              @click="toggleFaq(index)"
              class="w-full flex justify-between items-center text-left focus:outline-none"
            >
              <span class="font-medium text-gray-900 dark:text-white text-sm">{{ faq.question }}</span>
              <svg 
                class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2"
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
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-3">Información de Contacto</h2>
        
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white text-sm">Correo Electrónico</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ contactInfo.find(c => c.type === 'email')?.value || 'soporte@prohogar.hn' }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Respuesta en 24 horas</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white text-sm">Teléfono</h3>
              <p class="text-gray-600 dark:text-gray-300 text-sm">{{ contactInfo.find(c => c.type === 'phone')?.value || '+504 2234-5678' }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-xs mt-1">Lunes a Viernes, 8:00 AM - 5:00 PM</p>
            </div>
          </div>
           
        </div>
      </div>
    </div>
    
    <FootersFooter />
    </div>
  </div>
</template>

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

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useHead, useCookie, useRouter, useRuntimeConfig } from '#imports'
import { useAuthStore } from '~/middleware/auth.store'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
import Toast from '~/components/ui/Toast.vue'

// =========================
// CONFIGURACIÓN Y SETUP
// =========================
const auth = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()
const userCookie = useCookie('user')
const tokenCookie = useCookie('token')

// SEO and Meta
useHead({
  title: 'HogarSeguro - Soporte Técnico',
  meta: [
    { name: 'description', content: 'Centro de soporte técnico de HogarSeguro - Contáctanos para resolver tus dudas' },
    { name: 'keywords', content: 'soporte técnico, HogarSeguro, servicios, soporte, soporte técnico' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// =========================
// VARIABLES ESTÁTICAS
// =========================

// Opciones de asunto
const subjectOptions = [
  { value: 'falla', label: 'Problema con un Servicio Completado' },
  { value: 'duda', label: 'Duda con Servicios Ofrecidos' },
  { value: 'queja', label: 'Queja sobre Técnico' },
  { value: 'pago', label: 'Duda sobre Pagos' },
  { value: 'otro', label: 'Otro' }
]

// FAQs
const faqs = [
  {
    question: '¿Puedo solicitar un servicio sin membresia?',
    answer: 'Sí, puedes solicitar un servicio sin membresia, solo tendrás que pagar la visita inicial. Y a la hora de pagar el servicio no se aplica ningún descuento.'
  },
  {
    question: '¿Cómo puedo solicitar un servicio?',
    answer: 'Para solicitar un servicio ve al Dashboard y selecciona el tipo de servicio que necesitas. Si no tienes membresia, tendrás que pagar la visita inicial. Luego el técnico hará el diagnóstico y la cotización, si la rechazas se asigará a otro técnico, si la aceptas se procede con el servicio.'
  },
  {
    question: '¿Cuáles son los métodos de pago aceptados?',
    answer: 'Por los momento solo transferencias bancarias y CRIPTO'
  },
  {
    question: '¿Cuál es el tiempo de respuesta para soporte?',
    answer: 'Nuestro equipo de soporte atiende consultas en un plazo máximo de 48 horas hábiles.'
  },
  {
    question: '¿Ofrecen garantía por los servicios?',
    answer: 'Sí, todos nuestros servicios incluyen una garantía de 30 días. Si el problema persiste después de nuestra intervención, volveremos sin costo adicional.'
  },
  {
    question: '¿Cómo puedo cancelar o reprogramar un servicio?',
    answer: 'Puedes cancelar un servicio siempre y cuando no hayas aceptado la cotización. Para reprogramar un servicio, debes cancelar el servicio y solicitarlo cuando lo necesites.'
  }
]
 
const contactInfo = ref([
  {
    type: 'email',
    title: 'Correo Electrónico',
    value: 'cargando...',
    description: 'Respuesta en 24-48 horas',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconPath: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 z',
    configKey: 'correo_empresa'  // Clave para identificar el endpoint de la API
  },
  {
    type: 'phone',
    title: 'Teléfono',
    value: 'cargando...',
    description: 'Lunes a Domingo, 7:00 AM - 5:00 PM',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    iconPath: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
    configKey: 'numero_empresa'  // Clave para identificar el endpoint de la API
  }
])

// Función para actualizar un valor específico de contactInfo
const updateContactInfo = (type, newValue) => {
  const index = contactInfo.value.findIndex(item => item.type === type)
  if (index !== -1) {
    contactInfo.value[index].value = newValue
  }
}

// =========================
// VARIABLES REACTIVAS
// =========================

// Estados de carga
const isLoading = ref(true)
const isSubmitting = ref(false)
const isLoadingServices = ref(false)

// Estados de datos
const serviciosFinalizados = ref([])
const servicesError = ref('')
const activeFaq = ref(null)

// Estados de UI
const showPulse = ref(false)

// Formulario
const form = ref({
  subject: '',
  message: '',
  servicio_id: ''
})

// Referencia al select de servicios
const servicioSelect = ref(null)

// Estados de notificaciones
const toast = ref({
  show: false,
  message: '',
  type: 'success',
  duration: 5000
})

// =========================
// COMPUTED PROPERTIES
// =========================

// No hay computed properties específicas para esta página

// =========================
// FUNCIONES UTILITARIAS
// =========================

const limitarTexto = (texto, maxPalabras = 7) => {
  if (!texto) return ''
  const palabras = texto.trim().split(' ')
  if (palabras.length <= maxPalabras) return texto
  return palabras.slice(0, maxPalabras).join(' ') + '...'
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return new Date(dateString).toLocaleDateString('es-HN', options)
}

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

// =========================
// FUNCIONES DE CARGA DE DATOS
// =========================

// Obtener información de contacto de la empresa
const fetchContactInfo = async () => {
  try {
    // Usar Promise.all para hacer las peticiones en paralelo
    const requests = contactInfo.value.map(async (contact) => {
      try {
        const response = await $fetch(`/config/valor/${contact.configKey}`, {
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
          updateContactInfo('email', 'soporte@prohogar.hn')
        } else if (contact.type === 'phone') {
          updateContactInfo('phone', '+504 2234-5678')
        }
      }
    })
    
    await Promise.all(requests)
    
  } catch (error) {
    console.error('Error general al obtener información de contacto:', error)
    showError('No se pudieron cargar los datos de contacto. Se están utilizando valores por defecto.')
    
    // Establecer valores por defecto en caso de error general
    updateContactInfo('email', 'soporte@prohogar.hn')
    updateContactInfo('phone', '+504 2234-5678')
  }
}

const checkAuth = async () => {
  try {
    if (!tokenCookie.value) {
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

const cargarServiciosFinalizados = async () => {
  const userCookie = useCookie('user').value
  if (!userCookie?.id_usuario) {
    console.error('No se pudo obtener el ID de usuario')
    return
  }
  
  isLoadingServices.value = true
  servicesError.value = ''
  
  try {
    const response = await $fetch(`/solicitudservicio/usuario/${userCookie.id_usuario}`, {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenCookie.value}`
      }
    })
    
    const servicios = Array.isArray(response) ? response : response?.solicitudes || []
    
    if (!Array.isArray(servicios)) {
      console.error('Formato de respuesta inesperado del servidor:', response)
      serviciosFinalizados.value = []
      return
    }
    
    serviciosFinalizados.value = servicios.filter(servicio => 
      servicio && servicio.estado && 
      (servicio.estado.toLowerCase() === 'finalizado' || servicio.estado.toLowerCase() === 'completado')
    )
     
  } catch (error) {
    console.error('Error al cargar servicios:', error)
    servicesError.value = 'No se pudieron cargar los servicios. Por favor, intente más tarde.'
    showError('Error al cargar los servicios')
  } finally {
    isLoadingServices.value = false
  }
}

// =========================
// FUNCIONES DE PROCESAMIENTO
// =========================

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
    
    // Enviar el ticket de soporte
    const response = await $fetch('/soporte', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: dataToSend,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    // Enviar notificación a los administradores
    try {
      await $fetch('/notificaciones/enviar', {
        baseURL: config.public.apiBase,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          titulo: 'Nuevo Ticket',
          nombre_rol: 'admin'
        })
      });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      // No mostrar error al usuario para no afectar su experiencia
    }
    
    showSuccess(
      '¡Ticket enviado!',
      '¡Ticket enviado! Pronto te contactaremos.'
    )
    
    // Resetear formulario
    form.value = {
      subject: '',
      message: '',
      servicio_id: ''
    }
    
  } catch (error) {
    const errorMessage = error.response?._data?.message || 'Ocurrió un error al enviar tu solicitud. Por favor, inténtalo de nuevo.'
    showError(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// =========================
// FUNCIONES DE NOTIFICACIONES
// =========================

const showToast = (options) => {
  toast.value.show = false
  
  nextTick(() => {
    toast.value = {
      show: true,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 5000
    }
  })
}

const showSuccess = (title, message) => {
  const toastMessage = message ? `${title}\n${message}` : title
  
  showToast({
    message: toastMessage,
    type: 'success',
    duration: 5000
  })
}

const showError = (message) => {
  console.error('Error:', message)
  
  showToast({
    message: typeof message === 'string' ? message : 'Ocurrió un error inesperado',
    type: 'error',
    duration: 8000
  })
}

// =========================
// INICIALIZACIÓN
// =========================

onMounted(async () => {
  try {
    await checkAuth()
    await Promise.all([
      cargarServiciosFinalizados(),
      fetchContactInfo()
    ])
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error)
    showError('Ocurrió un error al cargar los datos. Por favor, recarga la página.')
  }
})

// =========================
// WATCHERS
// =========================

// Observar cambios en el select de asunto
watch(() => form.subject, async (newVal) => {
  // Si se selecciona "Problema con un Servicio Completado", cargar los servicios
  if (newVal === 'falla') {
    await cargarServiciosFinalizados()
  }
})

// =========================
// INICIALIZACIÓN
// =========================

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
 

</script> 