<template>
  <transition name="toast">
    <div
      v-if="show"
      class="fixed top-8 right-8 p-4 rounded-xl shadow-xl z-50 max-w-sm flex items-center gap-3 transition-all duration-300"
      :class="['toast-' + type, toastClasses]"
    >
      <div class="p-2 bg-white bg-opacity-25 rounded-full">
        <component :is="toastIcon" :size="20" class="text-white" />
      </div>
      <p class="text-white font-medium">{{ message }}</p>
      <button @click="close" class="ml-auto text-white hover:text-gray-200">
        <X :size="18" />
      </button>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next';

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
const show = ref(true);
let timeoutId = null;

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
  const base = 'transition-all duration-300';
  switch (props.type) {
    case 'success':
      return `${base} bg-green-500`;
    case 'error':
      return `${base} bg-red-500`;
    case 'warning':
      return `${base} bg-yellow-500`;
    case 'info':
    default:
      return `${base} bg-blue-500`;
  }
});

const close = () => {
  show.value = false;
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  emit('close');
};

onMounted(() => {
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      close();
    }, props.duration);
  }
});

// No necesitamos exponer métodos ya que manejamos todo a través de props y eventos
</script>

<style scoped>
/* Animación de entrada */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Animación de salida */
.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Estado inicial de entrada */
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

/* Estado final de salida */
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Colores para los diferentes tipos de toast */
.toast-success {
  @apply bg-gradient-to-r from-green-500 to-emerald-600;
}

.toast-error {
  @apply bg-gradient-to-r from-red-500 to-rose-600;
}

.toast-warning {
  @apply bg-gradient-to-r from-amber-500 to-yellow-600;
}

.toast-info {
  @apply bg-gradient-to-r from-blue-500 to-cyan-600;
}
</style>
