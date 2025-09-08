<template>
  <Teleport to="body">
    <Transition
      name="toast"
      enter-active-class="toast-enter-active"
      leave-active-class="toast-leave-active"
      enter-from-class="toast-enter-from"
      leave-to-class="toast-leave-to"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div
        v-if="show"
        ref="toastElement"
        class="fixed top-4 right-4 p-4 rounded-2xl shadow-lg z-50 max-w-sm w-[calc(100%-2rem)] sm:w-auto flex items-center gap-3 backdrop-blur-sm border border-white/20 overflow-hidden"
        :class="toastClasses"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
        style="position: fixed;"
      >
        <!-- Barra de progreso animada -->
        <div 
          class="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-100 ease-linear"
          :style="`width: ${progressWidth}%`"
        ></div>
        
        <!-- Icono con animación -->
        <div class="relative">
          <div class="p-2 bg-white/25 rounded-full backdrop-blur-sm icon-container">
            <component 
              :is="toastIcon" 
              :size="20" 
              class="text-white transition-all duration-300 icon-main"
              :class="{ 'animate-bounce-subtle': isEntering }"
            />
          </div>
          <!-- Efecto de onda al aparecer -->
          <div 
            v-if="isEntering"
            class="absolute inset-0 rounded-full bg-white/20 animate-ping"
          ></div>
        </div>
        
        <!-- Contenido del mensaje con soporte para saltos de línea -->
        <div class="flex-1 min-w-0">
          <p class="text-white font-medium text-sm leading-relaxed message-text" style="white-space: pre-line; word-break: break-word;">
            {{ formattedMessage }}
          </p>
        </div>
        
        <!-- Botón de cerrar -->
        <button 
          @click="close" 
          class="ml-2 p-1.5 text-white/80 rounded-lg transition-all duration-200 close-button"
          aria-label="Cerrar notificación"
        >
          <X :size="16" class="transition-transform duration-200" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next';

// Función para insertar saltos de línea cada 5 palabras por defecto
const insertLineBreaks = (text, wordsPerLine = 5) => {
  if (!text) return '';
  const words = text.split(' ');
  let result = [];
  
  for (let i = 0; i < words.length; i += wordsPerLine) {
    result.push(words.slice(i, i + wordsPerLine).join(' '));
  }
  
  return result.join('\n');
};

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  }
});

const emit = defineEmits(['close']);

// Estados reactivos - CORREGIDO: show inicia en false para permitir animación de entrada
const show = ref(false);
const isEntering = ref(false);
const progressWidth = ref(100);
const isPaused = ref(false);
const toastElement = ref(null);

// Variables para el timer
let timeoutId = null;
let progressInterval = null;
let startTime = null;
let pausedTime = null;
let remainingTime = props.duration;

// Computed properties
const formattedMessage = computed(() => {
  return insertLineBreaks(props.message, 5);
});

const toastIcon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
});

const toastClasses = computed(() => {
  const baseClasses = 'toast-container transition-all duration-300';
  switch (props.type) {
    case 'success':
      return `${baseClasses} toast-success`;
    case 'error':
      return `${baseClasses} toast-error`;
    case 'warning':
      return `${baseClasses} toast-warning`;
    case 'info':
    default:
      return `${baseClasses} toast-info`;
  }
});

// Métodos de animación
const onEnter = async (el) => {
  isEntering.value = true;
  
  // Pequeño retraso para la animación del icono
  await nextTick();
  setTimeout(() => {
    isEntering.value = false;
  }, 600);
};

const onLeave = (el) => {
  // Limpiar timers al salir
  clearTimers();
};

// Métodos del timer
const startTimer = () => {
  if (props.duration <= 0) return;
  
  startTime = Date.now();
  remainingTime = props.duration;
  
  // Timer principal
  timeoutId = setTimeout(() => {
    close();
  }, props.duration);
  
  // Actualizar barra de progreso
  updateProgress();
};

const updateProgress = () => {
  if (props.duration <= 0) return;
  
  progressInterval = setInterval(() => {
    if (!isPaused.value) {
      const elapsed = Date.now() - startTime;
      const progress = Math.max(0, 100 - (elapsed / props.duration) * 100);
      progressWidth.value = progress;
      
      if (progress <= 0) {
        clearInterval(progressInterval);
      }
    }
  }, 50);
};

const pauseTimer = () => {
  if (!timeoutId || isPaused.value) return;
  
  isPaused.value = true;
  pausedTime = Date.now();
  
  // Pausar timer principal
  clearTimeout(timeoutId);
  
  // Calcular tiempo restante
  const elapsed = pausedTime - startTime;
  remainingTime = props.duration - elapsed;
};

const resumeTimer = () => {
  if (!isPaused.value || remainingTime <= 0) return;
  
  isPaused.value = false;
  startTime = Date.now();
  
  // Reanudar timer principal
  timeoutId = setTimeout(() => {
    close();
  }, remainingTime);
};

const clearTimers = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

const close = () => {
  clearTimers();
  show.value = false;
  
  // Pequeño retraso antes de emitir el evento para que la animación se complete
  setTimeout(() => {
    emit('close');
  }, 300);
};

// Lifecycle hooks - CORREGIDO: show se pone en true después del montaje
onMounted(() => {
  // Usar nextTick para asegurar que el DOM esté listo antes de mostrar
  nextTick(() => {
    show.value = true;
    startTimer();
  });
});

onUnmounted(() => {
  clearTimers();
});
</script>

<style scoped>
/* Animaciones principales del toast - MEJORADAS */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* Estilos base del contenedor */
.toast-container {
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: calc(100% - 2rem);
  overflow: hidden;
  z-index: 9999;
  word-wrap: break-word;
  word-break: break-word;
}

/* Tipos de toast sin glow/box-shadow */
.toast-success {
  background: linear-gradient(135deg, 
    rgba(34, 197, 94, 0.9) 0%, 
    rgba(16, 185, 129, 0.9) 50%, 
    rgba(5, 150, 105, 0.9) 100%
  );
}

.toast-error {
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.9) 0%, 
    rgba(220, 38, 38, 0.9) 50%, 
    rgba(185, 28, 28, 0.9) 100%
  );
}

.toast-warning {
  background: linear-gradient(135deg, 
    rgba(245, 158, 11, 0.9) 0%, 
    rgba(217, 119, 6, 0.9) 50%, 
    rgba(180, 83, 9, 0.9) 100%
  );
}

.toast-info {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.9) 0%, 
    rgba(37, 99, 235, 0.9) 50%, 
    rgba(29, 78, 216, 0.9) 100%
  );
}

/* Animaciones de elementos internos */
.icon-container {
  position: relative;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.icon-main {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.message-text {
  animation: slideInFromRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

.close-button {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

/* Animaciones personalizadas */
@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-subtle {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.animate-bounce-subtle {
  animation: bounce-subtle 0.6s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: translateX(100%) scale(0.9);
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .toast-container {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* Reducir movimiento para usuarios que prefieren menos animación */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }
  
  .animate-bounce-subtle {
    animation: none;
  }
}

/* Mejoras de accesibilidad */
.toast-container:focus-within {
  outline: 2px solid rgba(255, 255, 255, 0.8);
  outline-offset: 2px;
}
</style>