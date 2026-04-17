<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, setLocale, t } = useI18n()
const showModal = ref(false)

// Use localStorage as fallback alongside cookie
const LANG_KEY = 'prohogar_language'

onMounted(() => {
  const saved = localStorage.getItem(LANG_KEY)
  if (saved) {
    // Apply saved language
    setLocale(saved)
  } else {
    // No language saved — show selector modal
    showModal.value = true
  }
})

const selectLanguage = (code) => {
  setLocale(code)
  localStorage.setItem(LANG_KEY, code)
  showModal.value = false
}

// Expose so parent (HeaderDashboard) can open the modal
const openModal = () => { showModal.value = true }
defineExpose({ openModal })
</script>

<template>
  <Transition name="fade">
    <div v-if="showModal" class="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all duration-500 scale-in">
        <div class="p-8 text-center">
          <div class="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl mx-auto mb-6 flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-800 shadow-inner">
            <span class="text-4xl">🌎</span>
          </div>
          
          <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
            {{ $t('profile.language') }}
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">
            {{ $t('profile.select_language') }}
          </p>
          
          <div class="space-y-3">
            <button 
              @click="selectLanguage('es')"
              class="w-full group relative flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all duration-300"
            >
              <span class="text-2xl mr-4 group-hover:scale-125 transition-transform">🇪🇸</span>
              <div class="text-left">
                <p class="font-bold text-gray-900 dark:text-white leading-none">Español</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Idioma predeterminado</p>
              </div>
              <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </button>
            
            <button 
              @click="selectLanguage('en')"
              class="w-full group relative flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all duration-300"
            >
              <span class="text-2xl mr-4 group-hover:scale-125 transition-transform">🇺🇸</span>
              <div class="text-left">
                <p class="font-bold text-gray-900 dark:text-white leading-none">English</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">English Language</p>
              </div>
              <div class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </button>
          </div>
          
          <p class="mt-8 text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
            miseguro • International
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.scale-in {
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
