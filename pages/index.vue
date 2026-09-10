<template>
  <div class="min-h-screen bg-gray-900 text-white">
   <!-- Mobile Header -->
<header class="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 overflow-hidden">
  <!-- Background Pattern -->
  <div class="absolute inset-0 opacity-10">
    <svg class="w-full h-full" viewBox="0 0 100 100">
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5"/>
      </pattern>
      <rect width="100" height="100" fill="url(#grid)"/>
    </svg>
  </div>
  
  <div class="relative px-4 py-4">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center space-x-2">
        <div class="relative">
          <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
            <div class="w-6 h-6 rounded-md flex items-center justify-center">
              <img src="/pwa-192x192.png" alt="MiSeguro" class="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        <div>
          <h1 class="text-xl font-black text-white tracking-tight">
            {{ $t('welcome') }}
          </h1>
          <p class="text-emerald-100 text-xs font-medium">{{ $t('solutions') }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="langModal?.openModal()"
          class="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl hover:bg-white/30 transition-all duration-300"
          :title="$t('profile.language')"
        >
          <span class="text-lg leading-none select-none">
            {{ currentLocale === 'es' ? '🇪🇸' : '🇺🇸' }}
          </span>
        </button>
        <button 
          @click="isLogin = true; showLoginModal = true"
          class="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 text-sm"
        >
          {{ $t('login') }}
        </button>
      </div>
    </div>

    <!-- Rate Limit Modal -->
    <transition name="modal">
      <div v-if="showRateLimitModal" class="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative border border-red-100 dark:border-red-900/30">
          <div class="p-8 text-center">
            <div class="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
              <span class="text-4xl">🛑</span>
            </div>
            
            <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3">
              {{ $t('rate_limit_title') }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              {{ $t('rate_limit_msg') }}
              <br><br>
              <span class="font-bold text-red-600 dark:text-red-400">{{ $t('rate_limit_retry') }}</span>
            </p> 
          </div>
        </div>
      </div>
    </transition>

    <!-- Hero Content -->
    <div class="text-center text-white py-10">
      <h2 class="text-4xl font-black mb-4 tracking-tight leading-[1.1]">
        {{ $t('hero_title') }}<br>
        <span class="text-yellow-300">{{ $t('hero_professionals') }}</span>
      </h2>
      <p class="text-lg text-emerald-50/80 font-medium px-4">
        {{ $t('hero_subtitle') }}
      </p>
    </div>
  </div>
</header>

<!-- Main Content -->
<main class="relative -mt-6 pb-1">
  
  <!-- Value Proposition Hero -->
  <section class="px-2 py-2 text-center bg-white dark:bg-gray-800 rounded-t-[2.5rem] shadow-2xl relative z-10 border-t border-gray-100 dark:border-gray-700">
    <h3 class="text-3xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
      {{ $t('value_prop_title1') }}<br>
      <span class="gradient-text">{{ $t('value_prop_title2') }}</span>
    </h3>

    <p class="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 max-w-xs mx-auto leading-relaxed">
      {{ $t('value_prop_description') }}
    </p>

    <!-- Premium How it Works -->
    <div class="relative mb-8 max-w-sm mx-auto px-2">
      <div class="absolute top-6 left-[calc(16.66%+8px)] right-[calc(16.66%+8px)] h-px border-t-2 border-dashed border-gray-200 dark:border-gray-700 z-0"></div>

      <div class="grid grid-cols-3 gap-2 relative z-10">
        <div class="flex flex-col items-center group cursor-default">
          <div class="relative mb-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-emerald-200 dark:group-hover:shadow-emerald-900/50">
              📱
            </div> 
          </div>
          <span class="text-[8px] text-gray-600 dark:text-gray-400 font-bold leading-tight text-center tracking-wide uppercase">{{ $t('step1') }}</span>
        </div>

        <div class="flex flex-col items-center group cursor-default">
          <div class="relative mb-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/50">
              🕒
            </div>
          </div>
          <span class="text-[8px] text-gray-600 dark:text-gray-400 font-bold leading-tight text-center tracking-wide uppercase">{{ $t('step2') }}</span>
        </div>

        <div class="flex flex-col items-center group cursor-default">
          <div class="relative mb-2">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-200 dark:shadow-amber-900/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-amber-200 dark:group-hover:shadow-amber-900/50">
              ✅
            </div>
          </div>
          <span class="text-[8px] text-gray-600 dark:text-gray-400 font-bold leading-tight text-center tracking-wide uppercase">{{ $t('step3') }}</span>
        </div>
      </div>
    </div>

    <div class="px-2">
      <button 
        @click="isLogin = false; showLoginModal = true"
        class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95 mb-4"
      >
        {{ $t('cta_start') }}
      </button>
      <p class="text-xs text-gray-400">{{ $t('free_registration') }}</p>
    </div>
  </section>

  <!-- Services Carousel -->
  <section class="px-2 py-2">
    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem]">
      <div class="px-4 mb-4 flex items-center justify-between">
        <h4 class="font-black text-gray-900 dark:text-white">{{ $t('covered_services') }}</h4>
        <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{{ $t('guaranteed') }}</span>
      </div>
      
      <div 
        ref="carruselRef"
        class="flex overflow-x-auto pb-4 px-4 space-x-4 no-scrollbar cursor-grab active:cursor-grabbing select-none"
        @mouseenter="isHovering = true"
        @mouseleave="isHovering = false"
        @touchstart="handleInteraction"
        @mousedown="handleInteraction"
        @scroll="onManualScroll"
      >
        <div v-for="(service, index) in carouselItems" :key="index"
             @click="isLogin = false; showLoginModal = true"
             class="flex-shrink-0 w-[140px]">
          <div class="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center h-full min-h-[140px] justify-center transition-transform hover:scale-105 active:scale-95">
            <div class="text-3xl mb-1">{{ service.icon }}</div>
            <h4 class="font-bold text-gray-900 dark:text-white text-xs leading-tight">
              {{ service.name }}
            </h4>
          </div>
        </div>
        <!-- Spacer: forces trailing padding to be respected at end of scroll -->
        <div class="flex-shrink-0 w-2" aria-hidden="true"></div>
      </div>
    </div>
  </section>

  <!-- Dedicated Uber-style Transport Section -->
  <section class="px-2 py-2">
    <div class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-950 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-2xl border border-emerald-500/20">
      <div class="absolute -top-12 -right-12 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-12 -left-12 w-44 h-44 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div class="absolute top-4 right-6 text-7xl opacity-10 font-black select-none">🚗</div>

      <div class="relative z-10 text-center">
        <div class="flex items-center justify-start space-x-2 mb-3">
          <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ $t('transport_tag') }}
          </span>
        </div>

        <h3 class="text-2xl sm:text-3xl font-black mb-2 text-white leading-tight">
          {{ $t('transport_title') }}
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100/70 mb-6 leading-relaxed">
          {{ $t('transport_subtitle') }}
        </p>

        <!-- Formulario de Cotización Interactivo -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/10 mb-6 space-y-4 text-left w-full">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span> {{ $t('transport_pickup') }}
              </label>
              <div class="flex items-center space-x-3 bg-black/40 rounded-xl px-3 py-3 border border-white/10 focus-within:border-emerald-400 transition-colors">
                <span class="text-emerald-400 text-base">📍</span>
                <input 
                  v-model="transportForm.recogida" 
                  type="text" 
                  :placeholder="$t('transport_pickup_placeholder')" 
                  class="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1.5 flex items-center gap-1">
                <span class="w-2 h-2 rounded-sm bg-cyan-400"></span> {{ $t('transport_destination') }}
              </label>
              <div class="flex items-center space-x-3 bg-black/40 rounded-xl px-3 py-3 border border-white/10 focus-within:border-cyan-400 transition-colors">
                <span class="text-cyan-400 text-base">📍</span>
                <input 
                  v-model="transportForm.destino" 
                  type="text" 
                  :placeholder="$t('transport_destination_placeholder')" 
                  class="w-full bg-transparent text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none font-medium"
                />
              </div>
            </div>
          </div>

          <!-- Selección de Tipo de Auto -->
          <div>
            <label class="block text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              {{ $t('transport_vehicle_type') }}
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button 
                v-for="v in vehicleTypes" 
                :key="v.id"
                type="button"
                @click="transportForm.tipoVehiculo = v.id"
                :class="[
                  'py-3 px-2 rounded-xl border text-center transition-all flex items-center justify-center cursor-pointer',
                  transportForm.tipoVehiculo === v.id
                    ? 'bg-emerald-500/30 border-emerald-400 text-white font-black ring-2 ring-emerald-500/50 shadow-lg scale-95'
                    : 'bg-black/30 border-white/5 text-gray-300 hover:bg-black/50 hover:border-white/20 font-medium'
                ]"
              >
                <span class="text-xs sm:text-sm leading-tight truncate w-full">{{ $t(v.i18nKey) }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="w-full mb-6">
          <button 
            @click="cotizarTransporteWhatsApp"
            class="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl hover:opacity-95 transition-all active:scale-[0.98] uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{{ $t('transport_quick_quote') }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-white/5 p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center">
            <span class="text-2xl mb-1">⚡</span>
            <span class="text-xs font-bold text-emerald-300 leading-tight">{{ $t('transport_feature_1_title') }}</span>
            <span class="text-[10px] text-gray-400 leading-tight mt-1">{{ $t('transport_feature_1_desc') }}</span>
          </div>
          <div class="bg-white/5 p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center">
            <span class="text-2xl mb-1">🏷️</span>
            <span class="text-xs font-bold text-emerald-300 leading-tight">{{ $t('transport_feature_2_title') }}</span>
            <span class="text-[10px] text-gray-400 leading-tight mt-1">{{ $t('transport_feature_2_desc') }}</span>
          </div>
          <div class="bg-white/5 p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center">
            <span class="text-2xl mb-1">🕒</span>
            <span class="text-xs font-bold text-emerald-300 leading-tight">{{ $t('transport_feature_3_title') }}</span>
            <span class="text-[10px] text-gray-400 leading-tight mt-1">{{ $t('transport_feature_3_desc') }}</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- Membership & Savings -->
  <section class="px-2 py-2">
    <div class="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
      <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10">
        <div class="text-center mb-8">
          <div class="inline-flex flex-col items-center">
            <span class="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 mb-3">{{ $t('membership_premium') }}</span>
            <div class="flex items-center justify-center space-x-3">
              <span v-if="isLoadingMembershipCost" class="text-2xl font-black text-white animate-pulse">{{ $t('loading') }}</span>
              <span v-else class="text-5xl font-black text-white">L. {{ membershipCost.toLocaleString('es-HN') }}</span>
              <span class="px-2 py-0.5 bg-white/10 rounded text-[10px] text-emerald-300 font-bold uppercase tracking-tighter self-start mt-1 border border-white/10">{{ $t('optional') }}</span>
            </div>
            <p class="text-[10px] text-emerald-100/50 mt-2 font-medium uppercase tracking-widest">{{ $t('monthly_investment') }}</p>
          </div>
        </div>

        <div class="mb-4 p-6 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 text-center">
          <h4 class="text-xl font-black text-emerald-400 mb-2">{{ $t('money_not_lost') }}</h4>
          <p class="text-sm text-emerald-100/80 leading-relaxed" v-html="$t('money_not_lost_desc').replace('Crédito Real', '<span class=\'font-bold text-white\'>Crédito Real</span>').replace('pagar cualquier servicio.', '<span class=\'font-bold text-white\'>pagar cualquier servicio.</span>')">
          </p>
        </div>

        <div class="grid grid-cols-1 gap-2 mb-8">
          <div v-for="(benefit, index) in membershipBenefits.slice(0, 3)" :key="benefit.id" class="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-xl">
              {{ index === 0 ? '✨' : index === 1 ? '💸' : '🛠️' }}
            </div>
            <div class="flex-1">
              <h5 class="text-sm font-black text-white">{{ benefit.title }}</h5>
              <p class="text-xs text-emerald-100/60 mt-0.5">{{ benefit.description }}</p>
            </div>
          </div>
        </div>

        <button 
          @click="isLogin = false; showLoginModal = true"
          class="w-full py-4 bg-white text-emerald-900 font-black text-sm rounded-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-[0.98] uppercase tracking-wider"
        >
          {{ $t('convert_savings') }}
        </button>
      </div>
    </div>
  </section>

  <!-- Referral Program - Modern Glassmorphism Design -->
  <section class="px-2 py-2">
    <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600/10 to-purple-600/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-[2.5rem] p-8 border border-white/10 backdrop-blur-sm">
      <div class="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 text-center max-w-xs mx-auto">
        <div class="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex items-center justify-center text-3xl mx-auto mb-6 transform -rotate-6">
          🤝
        </div>
        <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-3">{{ $t('referral_program') }}</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-8 leading-relaxed">
          {{ $t('referral_desc', { percentage: referralPercentage }) }}
        </p>
        <button 
          @click="isLogin = false; showLoginModal = true"
          class="px-8 py-3 bg-indigo-600 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all hover:bg-indigo-700 active:scale-95"
        >
          {{ $t('referral_cta') }}
        </button>
      </div>
    </div>
  </section>

  <!-- Simple Final CTA -->
  <section class="px-2 py-2 text-center">
    <div class="max-w-xs mx-auto">
      <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-4">{{ $t('ready_to_start') }}</h3> 
      <button 
        @click="isLogin = false; showLoginModal = true"
        class="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all active:scale-95"
      >
        {{ $t('create_account_free') }}
      </button>
      <p class="mt-4 text-[10px] text-gray-400 font-medium tracking-wide uppercase">{{ $t('free_registration') }}</p>
    </div>
  </section>

</main>

   <!-- Login/Register Modal -->
    <!-- Overlay de carga mientras se verifica la autenticación -->
<LoadingSpinner 
  v-if="isCheckingAuth"
  :loading="true" 
  class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
/>

    <!-- Modal de Login/Registro -->
    <transition name="modal">
      <div 
        v-if="showLoginModal" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overscroll-none"
        @touchmove.prevent
        @wheel.prevent
      >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto overflow-x-hidden relative overscroll-contain" @touchmove.stop @wheel.stop>
        <button 
          @click="showLoginModal = false" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 z-10"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div class="p-6">
          <div class="text-center mb-6 pt-4">
            <div class="w-14 h-14 bg-emerald-50 rounded-xl mx-auto mb-4 flex items-center justify-center border border-emerald-100 shadow-sm">
              <img src="/favicon.ico" alt="Logo" class="w-8 h-8 object-contain" />
            </div>

            <!-- Tabs de navegación -->
            <div class="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl mb-6 border border-gray-200/50 dark:border-gray-700/50">
              <button 
                type="button"
                @click="isLogin = false"
                class="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300"
                :class="!isLogin 
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-black/5' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
              >
                {{ $t('auth.create_account') }}
              </button>
              <button 
                type="button"
                @click="isLogin = true"
                class="flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300"
                :class="isLogin 
                  ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-md ring-1 ring-black/5' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
              >
                {{ $t('auth.already_have_account') }}
              </button>
            </div>

            <h3 class="text-xl font-black text-gray-900 dark:text-white mb-2">
              {{ isLogin ? $t('auth.welcome_back') : $t('auth.join_prohogar') }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ isLogin ? $t('auth.login_to_account') : $t('auth.create_free_account') }}
            </p>
          </div>

          <form @submit.prevent="handleAuth" class="space-y-4" :autocomplete="isLogin ? 'on' : 'on'">
            <!-- Campos adicionales para registro -->
            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('auth.full_name') }}
              </label>
              <input 
                v-model="form.nombre"
                type="text" 
                class="w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="formErrors.nombre ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                :placeholder="$t('auth.full_name_placeholder')"
                :required="!isLogin"
                autocomplete="name"
                @input="form.nombre = form.nombre.replace(/[0-9]/g, ''); formErrors.nombre = ''"
                @keydown="preventNumberInput"
              />
              <p v-if="formErrors.nombre" class="mt-1 text-sm text-red-500">{{ formErrors.nombre }}</p>
            </div>

            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('auth.email') }}
              </label>
              <input 
                v-model="form.email"
                type="email" 
                class="w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="formErrors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                :placeholder="$t('auth.email_placeholder')"
                :required="!isLogin"
                autocomplete="email"
                @input="formErrors.email = ''"
              />
              <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
            </div>

            <div v-if="!isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('auth.phone_register') }}
              </label>
              <input 
                v-model="form.telefono"
                type="tel" 
                class="w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="{'border-red-500': formErrors.telefono, 'border-gray-200 dark:border-gray-600': !formErrors.telefono}"
                :placeholder="$t('auth.phone_register_placeholder')"
                :required="!isLogin"
                autocomplete="tel"
                @input="handlePhoneInput"
                @keydown="preventLetterInput"
                @paste.prevent="handlePhonePaste"
                maxlength="17"
              />
              <p v-if="formErrors.telefono" class="mt-1 text-sm text-red-500">{{ formErrors.telefono }}</p>
            </div>

            <div v-if="!isLogin">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('auth.city') }}
              </label>
              <div 
                class="multiselect-custom flex items-center justify-between !pr-3 w-full px-3 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer transition-all duration-200" 
                @click="openCitiesSheet"
                :class="formErrors.ciudad ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
              >
                <div class="flex items-center gap-2 truncate">
                  <span v-if="loadingCiudades" class="flex items-center gap-2 text-gray-500">
                    <span class="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                    <span class="text-sm">Cargando ciudades...</span>
                  </span>
                  <span v-else-if="form.ciudad" class="flex items-center gap-2 truncate">
                    <span>📍</span>
                    <span class="truncate text-base">{{ getCityLabel(form.ciudad) }}</span>
                  </span>
                  <span v-else class="text-gray-450 dark:text-gray-400 text-base">
                    {{ $t('auth.city_placeholder') }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <p v-if="formErrors.ciudad" class="mt-1 text-sm text-red-500">{{ formErrors.ciudad }}</p>
            </div>

            <!-- Campo de teléfono para Login -->
            <div v-if="isLogin">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('auth.phone_login') }}
              </label>
              <input 
                v-model="form.loginTelefono"
                type="tel" 
                class="w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                :class="formErrors.loginTelefono ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                :placeholder="$t('auth.phone_login_placeholder')"
                :required="isLogin"
                autocomplete="tel"
                @input="formErrors.loginTelefono = ''"
                @keydown="preventLetterInput"
              />
              <p v-if="formErrors.loginTelefono" class="mt-1 text-sm text-red-500">{{ formErrors.loginTelefono }}</p>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('auth.password') }}
              </label>
              <div class="relative">
                <input 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'" 
                  class="w-full px-3 py-3 text-base border-2 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                  :class="formErrors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'"
                  :placeholder="isLogin ? $t('auth.login_password_placeholder') : $t('auth.register_password_placeholder')"
                  required
                  :autocomplete="isLogin ? 'current-password' : 'new-password'"
                  @input="formErrors.password = ''"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
              <p v-if="formErrors.password" class="mt-1 text-sm text-red-500">{{ formErrors.password }}</p>
            </div>



            

            <button 
              type="submit"
              :disabled="!isFormValid"
              :class="[
                'w-full py-1.5 font-black text-base rounded transition',
                isFormValid 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow cursor-pointer'
                  : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              ]"
            >
              {{ isLogin ? $t('auth.login_btn') : $t('auth.register_btn') }}
            </button>
          </form>

          <div v-if="isLogin" class="text-center mt-6">
            <button 
              type="button"
              @click="showForgotPassword = true"
              class="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition-colors focus:outline-none"
            >
              {{ $t('auth.forgot_password') }}
            </button>
          </div>


        </div>
      </div>
    </div>
    </transition>
    
    <!-- Modal de Selección de Rol -->
    <transition name="modal">
      <div v-if="showRoleSelectionModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden">
          <div class="p-8">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-sm border border-emerald-100 dark:border-emerald-800">
                ✨
              </div>
              <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">
                {{ $t('auth.select_role_title') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                {{ $t('auth.select_role_subtitle') }}
              </p>
            </div>

            <div class="space-y-4">
              <!-- Opción Cliente -->
              <button 
                @click="completeRegistration(false)"
                class="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 group transition-all duration-300 text-left flex items-center space-x-4 bg-gray-50/50 dark:bg-gray-900/30"
              >
                <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white">
                    {{ $t('auth.client_role') }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('auth.client_role_desc') }}
                  </p>
                </div>
              </button>

              <!-- Opción Proveedor -->
              <button 
                @click="completeRegistration(true)"
                class="w-full p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/20 group transition-all duration-300 text-left flex items-center space-x-4 bg-gray-50/50 dark:bg-gray-900/30"
              >
                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👷
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 dark:text-white">
                    {{ $t('auth.provider_role') }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ $t('auth.provider_role_desc') }}
                  </p>
                </div>
              </button>
            </div>
            
            <button 
              @click="showRoleSelectionModal = false; showLoginModal = true"
              class="w-full mt-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {{ $t('common.go_back') }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Loading Spinner -->
    <LoadingSpinner 
      v-if="isLoading || authStatus"
      :loading="isLoading"
      :success="authStatus === 'success'"
      :error="authStatus === 'error'"
      :message="loadingMessage"
      :error-message="authStatus === 'error' ? loadingMessage : ''"
    />

    <!-- Toast Notification -->
    <Toast 
      v-if="toast.show"
      ref="toastRef"
      :message="toast.message"
      :type="toast.type"
      :duration="toast.duration"
      @close="toast.show = false"
    />

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm relative">
        <button 
          @click="showForgotPassword = false" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="p-6">
          <div class="text-center mb-6 pt-4">
            <div class="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <span class="text-white text-xl">🔑</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ $t('forgot_password.title') }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ $t('forgot_password.desc') }}
            </p>
          </div>

          <form @submit.prevent="handlePasswordReset" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                {{ $t('forgot_password.email_label') }}
              </label>
              <input 
                v-model="emailForPasswordReset"
                type="email" 
                required
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 dark:text-white"
                :placeholder="$t('forgot_password.email_placeholder')"
              >
            </div>

            <button 
              type="submit" 
              :disabled="isResettingPassword"
              class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center"
            >
              <span v-if="!isResettingPassword">{{ $t('forgot_password.send_link') }}</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('forgot_password.sending') }}
              </span>
            </button>
          </form>

          <div class="mt-4 text-center">
            <button 
              @click="showForgotPassword = false; isLogin = true"
              class="text-sm text-gray-600 dark:text-gray-400 hover:underline focus:outline-none"
            >
              {{ $t('forgot_password.back_to_login') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Sheet para seleccionar ciudad -->
    <Transition name="bottom-sheet">
      <div 
        v-if="showCitiesSheet" 
        class="fixed inset-0 z-[100] flex flex-col justify-end isolate"
        @touchmove.stop
      >
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/60 bs-backdrop"
          @click="showCitiesSheet = false"
          @touchmove.prevent.stop
        ></div>

        <!-- Contenido -->
        <div 
          class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2.5rem] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] overflow-hidden max-h-[70vh] flex flex-col bs-content"
          @touchmove.stop
        >
          <!-- Cabecera -->
          <div class="w-full flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 relative z-20">
             <div class="w-10 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-3"></div>
             <h3 class="text-lg font-black text-gray-950 dark:text-white mt-1">
               {{ $t('auth.city_placeholder') }}
             </h3>
             <button 
                @click="showCitiesSheet = false"
                class="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center active:scale-90 transition-transform"
                type="button"
             >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>

          <!-- Listado de ciudades -->
          <div class="overflow-y-auto overscroll-contain no-scrollbar p-6 grid grid-cols-2 gap-3 pb-12">
             <div 
               v-for="city in ciudades" 
               :key="city.id"
               @click="selectCity(city)"
               class="flex items-center justify-between p-4 rounded-2xl border cursor-pointer border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-[0.98] transition-all duration-200"
               :class="[
                 form.ciudad?.id === city.id
                   ? 'border-emerald-500 dark:border-emerald-450 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                   : ''
               ]"
             >
               <div class="flex items-center gap-3">
                 <span class="text-xl">📍</span>
                 <div class="text-left">
                   <p class="font-bold text-gray-950 dark:text-white text-base">{{ city.nombre }}</p>
                 </div>
               </div>
               
               <div v-if="form.ciudad?.id === city.id" class="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white">
                 <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                   <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                 </svg>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Transition>

    <LanguageSelectorModal ref="langModal" />
  </div>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Smooth animations */
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Custom gradient backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Glass morphism effect */
.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.5);
}

/* Dark mode scrollbar */
.dark ::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.4);
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.6);
}

/* Ensure proper mobile touch targets */
button, input {
  min-height: 44px;
}

/* Prevent zoom on input focus */
input {
  font-size: 16px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom animations */
@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.slide-in-up {
  animation: slideInUp 0.6s ease-out;
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #10b981, #059669);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Shadow utilities */
.shadow-glow {
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.3);
}

/* Multiselect styles - Exact match to UsuariosAdmin.vue */
.multiselect-custom {
  min-width: 140px !important;
  font-size: 1rem !important;
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
  font-size: 1rem !important;
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
  font-size: 1rem !important;
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
  font-size: 1rem !important;
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
  font-size: 1rem !important;
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
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--selected {
  color: rgb(243 244 246) !important;
}

.multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
  background-color: transparent !important;
  color: rgb(17 24 39) !important;
}

.dark .multiselect-custom .multiselect__option--selected.multiselect__option--highlight {
  color: rgb(243 244 246) !important;
}

#app {
  min-height: 100vh;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }

/* Animación del Modal */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div, .modal-leave-active > div {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from > div, .modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* Bottom Sheet Transitions */
.bottom-sheet-enter-active, .bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bs-content {
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.15) !important;
  will-change: transform;
}

.bottom-sheet-enter-active .bs-backdrop { transition: opacity 0.3s ease; }
.bottom-sheet-enter-from .bs-backdrop { opacity: 0; }
.bottom-sheet-enter-to .bs-backdrop { opacity: 1; }

.bottom-sheet-leave-active .bs-backdrop { transition: opacity 0.25s ease; }
.bottom-sheet-leave-from .bs-backdrop { opacity: 1; }
.bottom-sheet-leave-to .bs-backdrop { opacity: 0; }

.bottom-sheet-enter-active .bs-content {
  animation: slide-up-custom 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.bottom-sheet-leave-active .bs-content {
  transition: transform 0.4s ease-in;
  transform: translateY(0);
}

.bottom-sheet-leave-to .bs-content {
  transform: translateY(100%);
}

@keyframes slide-up-custom {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { navigateTo } from '#imports'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/middleware/auth.store'
import Toast from '~/components/ui/Toast.vue';
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue';
import LanguageSelectorModal from '~/components/ui/LanguageSelectorModal.vue';
import Multiselect from 'vue-multiselect'
import { useAutoTranslate } from '~/composables/useAutoTranslate.js'

// ===== VARIABLES DE CONFIGURACIÓN =====
const { $api } = useNuxtApp();
const config = useRuntimeConfig()
const router = useRouter()
const auth = useAuthStore()
const userCookie = useCookie('user')
const { locale, t } = useI18n()
const langModal = ref(null)
const currentLocale = computed(() => locale.value)

// ===== AUTO-TRADUCCIÓN =====
const { trList } = useAutoTranslate()

// SEO and Meta
useHead({
  title: 'MiSeguro - Servicios Profesionales a Domicilio',
  meta: [
    { name: 'description', content: 'MiSeguro - Servicios Profesionales a Domicilio' }, 
    { name: 'keywords', content: 'MiSeguro, Servicios Profesionales a Domicilio' },
    { name: 'viewport', content: 'width=device-width, initial-scale=0.8, user-scalable=no' }
  ]
})

// Reactive data
const showLoginModal = ref(false)
const showRateLimitModal = ref(false)
const showForgotPassword = ref(false)
const showRoleSelectionModal = ref(false)
const pendingRegisterData = ref(null)
const showCitiesSheet = ref(false)

// Estado para la cotización de transporte
const transportForm = ref({
  recogida: '',
  destino: '',
  tipoVehiculo: 'Turismo'
})

const vehicleTypes = [
  { id: 'Turismo', i18nKey: 'transport_turismo' },
  { id: 'Camioneta', i18nKey: 'transport_camioneta' },
  { id: 'Mini Van', i18nKey: 'transport_minivan' },
  { id: 'Bus', i18nKey: 'transport_bus' }
]

const cotizarTransporteWhatsApp = async () => {
  const recogida = transportForm.value.recogida ? transportForm.value.recogida.trim() : ''
  const destino = transportForm.value.destino ? transportForm.value.destino.trim() : ''
  const vehiculo = transportForm.value.tipoVehiculo || 'Turismo'

  if (!recogida || !destino) {
    showToast(t('transport_whatsapp.missing_fields_error'), 'error')
    return
  }

  try {
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber()
    }

    const vehicleObj = vehicleTypes.find(v => v.id === vehiculo)
    const nombreVehiculo = vehicleObj ? t(vehicleObj.i18nKey) : vehiculo

    const message = `*${t('transport_whatsapp.title')}* 🚗\n\n` +
      `📍 *${t('transport_whatsapp.pickup')}:* ${recogida}\n` +
      `🏁 *${t('transport_whatsapp.destination')}:* ${destino}\n` +
      `🚘 *${t('transport_whatsapp.vehicle_type')}:* ${nombreVehiculo}\n\n` +
      `${t('transport_whatsapp.greeting')}`

    const encodedMessage = encodeURIComponent(message)
    const phoneNumber = (empresaPhoneNumber.value || '1234567890').replace(/\D/g, '')
    const url = `https://wa.me/+504${phoneNumber}?text=${encodedMessage}`

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.assign(url)
    } else {
      window.open(url, '_blank')
    }
  } catch (error) {
    console.error('Error al enviar cotización por WhatsApp:', error)
    showToast(t('transport_whatsapp.prep_error'), 'error')
  }
}

const selectCity = (city) => {
  form.value.ciudad = city
  showCitiesSheet.value = false
}

const openCitiesSheet = () => {
  showCitiesSheet.value = true
}

const anyModalOpen = computed(() => {
  return showLoginModal.value || showRateLimitModal.value || showForgotPassword.value || showCitiesSheet.value
})

let scrollPosition = 0

watch(anyModalOpen, (newValue) => {
  if (process.client) {
    if (newValue) {
      scrollPosition = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosition}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollPosition)
    }
  }
}, { immediate: true })

const showSuccess = ref(false)
const isLogin = ref(true)
const isLoading = ref(true) // Iniciar en true para mostrar el spinner mientras se verifica la autenticación
const isCheckingAuth = ref(true) // Estado para controlar la verificación de autenticación
const isFileDialogOpen = ref(false) // Estado para controlar cuando se abre el selector de archivos
const authStatus = ref('') // Estado para manejo de errores
const formErrors = ref({})

// Referencias para la imagen de perfil
const profileImage = ref(null)
const profileImagePreview = ref('')
const fileInput = ref(null)
const registerAsTechnician = ref(false)
const showPassword = ref(false)


// Abrir el selector de archivos
const openFileDialog = () => {
  isFileDialogOpen.value = true;
  
  // Usar setTimeout para asegurarnos de que el input se haya renderizado
  nextTick(() => {
    if (fileInput.value) {
      fileInput.value.click();
    }
    
    // Restablecer el estado después de un tiempo razonable
    setTimeout(() => {
      isFileDialogOpen.value = false;
    }, 2000);
  });
};

// Manejar la carga de la imagen
const handleImageUpload = (event) => {
  isFileDialogOpen.value = false; // Ocultar el indicador de carga
  const file = event.target.files[0]
  
  if (!file) return
  
  // Validar tipo de archivo
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    formErrors.value.profileImage = 'Formato de archivo no válido. Solo se aceptan JPG y PNG.'
    return
  }
  
  // Validar tamaño (10MB máximo)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    formErrors.value.profileImage = 'La imagen es demasiado grande. El tamaño máximo es de 10MB.'
    return
  }
  
  // Actualizar la referencia de la imagen
  profileImage.value = file
  
  // Crear vista previa
  const reader = new FileReader()
  reader.onload = (e) => {
    profileImagePreview.value = e.target.result
    form.value.profileImage = e.target.result // Guardar como base64
  }
  reader.readAsDataURL(file)
  
  // Limpiar mensajes de error
  formErrors.value.profileImage = ''
}

// Función para normalizar un número de teléfono: quita espacios, guiones y código de país
// para que siempre se pueda buscar sin importar el formato ingresado
const normalizarTelefono = (phone) => {
  if (!phone) return ''
  // Quitar espacios, guiones y paréntesis
  let clean = phone.replace(/[\s\-()]/g, '')
  // Si empieza con +, quitar el +
  if (clean.startsWith('+')) clean = clean.substring(1)
  // Si empieza con código de país de Honduras (504), extraer el número local
  if (clean.startsWith('504') && clean.length > 8) {
    clean = clean.substring(3)
  }
  // Si empieza con 00504, quitarlo
  if (clean.startsWith('00504') && clean.length > 9) {
    clean = clean.substring(5)
  }
  return clean
}

// Validación del formulario
const validateForm = () => {
  const errors = {}
  
  // Restricción por dispositivo (Local Check)
  if (process.client && localStorage.getItem('ph_dev_banned') === 'true') {
    errors.general = 'El acceso desde este dispositivo ha sido restringido por seguridad.';
    showToast('Este dispositivo tiene restringido el acceso a nuevos registros.', 'error');
    return errors;
  }
  
  // Solo validar estos campos si es registro
  if (!isLogin.value) {
    // Validar nombre (mínimo 2 palabras)
    if (!form.value.nombre || form.value.nombre.trim().split(' ').filter(Boolean).length < 2) {
      errors.nombre = 'Por favor ingresa tu nombre completo (mínimo 2 palabras)'
    } else {
      const nombreLower = form.value.nombre.toLowerCase().trim();
      const nombresFalsosExactos = ['fulano de tal', 'fulano detalt', 'test user', 'dummy user'];
      if (nombresFalsosExactos.includes(nombreLower) || nombreLower.includes('prueba')) {
        errors.nombre = 'Por favor utiliza un nombre real para tu registro';
      }
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.value.email || !emailRegex.test(form.value.email)) {
      errors.email = 'Por favor ingresa un correo electrónico válido'
    } else {
      const [userPart] = form.value.email.split('@')
      if (/^(.)\1+$/.test(userPart)) {
        errors.email = 'El correo electrónico parece ser falso'
      }
    }

    // Validar teléfono de registro (código de país + número)
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/
    if (!form.value.telefono || !phoneRegex.test(form.value.telefono)) {
      errors.telefono = 'Ingresa un número de teléfono válido (ej: +504 9999-9999)'
    } else {
      const onlyDigits = form.value.telefono.replace(/\D/g, '')
      if (/(.)\1{5,}/.test(onlyDigits)) {
        errors.telefono = 'El número de teléfono parece ser falso'
      } else if (onlyDigits.includes('504')) {
        const match = onlyDigits.match(/504([0-9])/);
        if (match && !['2', '3', '7', '8', '9'].includes(match[1])) {
          errors.telefono = 'Número no válido para Honduras (debe empezar con 2, 3, 7, 8 o 9)';
        }
      }
    }
  } else {
    // Validar teléfono de login
    if (!form.value.loginTelefono || form.value.loginTelefono.trim().length < 7) {
      errors.loginTelefono = 'Por favor ingresa tu número de teléfono'
    }
  }
  
  // Validar contraseña (mínimo 6 caracteres)
  if (form.value.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  formErrors.value = errors
  return Object.keys(errors).length === 0
}

// Estado para el costo de la membresía y visita técnica
const membershipCost = ref(0)
const visitCost = ref(0)
const specialDiscountPercentage = ref('50') // Valor por defecto
const referralPercentage = ref('10') // Valor por defecto
const isLoadingMembershipCost = ref(false)
const isLoadingVisitCost = ref(false)
const isLoadingReferralPercentage = ref(false)

// Servicios cargados dinámicamente
const services = ref([])
const isLoadingServices = ref(false)

// Carrusel Auto-scroll Logic
const carruselRef = ref(null);
const isHovering = ref(false);
const isInteracting = ref(false);
let animationFrame = null;
let currentScroll = 0;
let resumeTimeout = null;
let isAutoScrolling = false;

const handleInteraction = () => {
  isInteracting.value = true;
  if (resumeTimeout) clearTimeout(resumeTimeout);
  
  resumeTimeout = setTimeout(() => {
    isInteracting.value = false;
    // Sincronizar posición final
    if (carruselRef.value) currentScroll = carruselRef.value.scrollLeft;
  }, 2000);
};

const onManualScroll = () => {
  if (!isAutoScrolling) {
    handleInteraction();
  }
};

const startAutoScroll = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  
  const scroll = () => {
    // Si el modal de login está abierto, detener scroll
    if (showLoginModal.value) {
      animationFrame = null;
      return;
    }

    if (carruselRef.value) {
      if (!isHovering.value && !isInteracting.value) {
        // En index.vue el scroll es horizontal también
        currentScroll += 0.6; // Velocidad ajustada
        
        const halfWidth = carruselRef.value.scrollWidth / 2;
        
        if (currentScroll >= halfWidth) {
          currentScroll = 0;
        }
        
        isAutoScrolling = true;
        carruselRef.value.scrollLeft = currentScroll;
        // Pequeño delay para que el evento scroll no detecte esto como manual inmediatamente
        requestAnimationFrame(() => { isAutoScrolling = false; });
      } else {
        // Sincronizar currentScroll con la posición real mientras el usuario interactúa
        currentScroll = carruselRef.value.scrollLeft;
      }
    }
    animationFrame = requestAnimationFrame(scroll);
  };
  
  animationFrame = requestAnimationFrame(scroll);
};

const stopAutoScroll = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
};

// Servicios traducidos automáticamente según idioma activo
const servicesTranslated = trList(services, ['name', 'description'])

// Computed property para duplicar elementos (infinite scroll effect)
const carouselItems = computed(() => {
  const list = servicesTranslated.value.length ? servicesTranslated.value : services.value
  if (!list.length) return []
  return [...list, ...list]
})

// Reiniciar scroll si cambian los servicios
watch(services, (newVal) => {
  if (newVal && newVal.length > 0) {
    nextTick(() => {
      startAutoScroll();
    });
  }
});

// Watch para pausar/reanudar cuando se abre el modal
watch(showLoginModal, (isOpen) => {
  if (!isOpen) {
    startAutoScroll();
  } else {
    stopAutoScroll();
  }
});

onUnmounted(() => {
  stopAutoScroll();
});

// Estado para el número de teléfono
const phoneNumber = ref('')

// Referencia reactiva para almacenar las ciudades
const ciudades = ref([])
const loadingCiudades = ref(false)

// Función para obtener el label de la ciudad
const getCityLabel = (ciudad) => {
  return ciudad ? ciudad.nombre : ''
}

// Cargar ciudades desde la API
const cargarCiudades = async () => {
  loadingCiudades.value = true
  try {
    const data = await $api('/ciudad', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    
    if (Array.isArray(data)) {
      ciudades.value = data.map(ciudad => ({
        id: ciudad.id_ciudad,
        nombre: ciudad.nombre_ciudad,
        // Guardar nombre original en español para búsquedas internas
        nombre_es: ciudad.nombre_ciudad
      }))
    }
  } catch (error) { 
  } finally {
    loadingCiudades.value = false
  }
} 

// Verificar autenticación al cargar la página
const checkAuthStatus = async () => {
  if (process.client && localStorage.getItem('just_logged_out') === 'true') {
    console.log('Skipping auto-login because user just logged out');
    localStorage.removeItem('just_logged_out');
    isCheckingAuth.value = false;
    isLoading.value = false;
    return;
  }

  try {
    const isAuthenticated = await auth.checkAuth()
    
    if (isAuthenticated) {
      if (auth.user?.estado === 'deshabilitado') {
        navigateTo('/usuario-deshabilitado', { replace: true })
        return
      }
      // Si está autenticado, redirigir al dashboard correspondiente según su rol
      const userRole = auth.user?.role?.toLowerCase() || 'usuario';
      let dashboardPath = '/cliente/DashboardCliente'; // Default

      switch (userRole) {
        case 'admin':
        case 'sa':
          dashboardPath = '/admin/DashboardAdmin';
          break;
        case 'tecnico':
          dashboardPath = '/tecnico/DashboardTecnico';
          break;
        case 'usuario':
          dashboardPath = '/cliente/DashboardCliente';
          break;
      }
      
      navigateTo(dashboardPath, { replace: true })
    }
  } catch (error) {
    // Registrar marca de baneo si el servidor lo indica
    if (error.statusCode === 403 && error.data?.message?.toLowerCase().includes('dispositivo')) {
      if (process.client) {
        localStorage.setItem('ph_dev_banned', 'true');
      }
    }
  } finally {
    isCheckingAuth.value = false
    isLoading.value = false
  }
}

// Cargar ciudades y verificar autenticación al montar el componente
// Función para obtener el costo de la membresía
const fetchMembershipCost = async () => {
  isLoadingMembershipCost.value = true;
  try {
    const data = await $api('/config/valor/membresia', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
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

// Función para obtener el costo de la visita técnica
const fetchVisitCost = async () => {
  isLoadingVisitCost.value = true;
  try {
    const response = await $api('/config/valor/visita_tecnico', {
      baseURL: config.public.apiBase,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response && response.valor !== undefined) {
      visitCost.value = response.valor;
    } else {
      console.error('Formato de respuesta inesperado:', response);
    }
  } catch (error) {
    console.error('Error al obtener el costo de la visita técnica:', error);
  } finally {
    isLoadingVisitCost.value = false;
  }
};

// Función para obtener el porcentaje de referido
const fetchReferralPercentage = async () => {
  isLoadingReferralPercentage.value = true;
  try {
    const data = await $api('/config/valor/porcentaje_referido', {
      method: 'GET'
    });

    if (data && data.valor) {
      referralPercentage.value = data.valor;
    }
  } catch (error) {
    console.error('Error al obtener el porcentaje de referido:', error);
  } finally {
    isLoadingReferralPercentage.value = false;
  }
};

onMounted(async () => {
  // Configuración del modo oscuro
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }

  // Carga inicial de datos
  try {
    await Promise.all([
      cargarCiudades(),
      fetchMembershipCost(),
      loadServices(),
      fetchVisitCost(),
      fetchReferralPercentage(),
      fetchDiscountPercentage(),
      checkAuthStatus()
    ])
    
    // Cargar beneficios después de tener el costo de visita y porcentaje de descuento
    await loadMembershipBenefits()
  } catch (error) {
    console.error('Error durante la inicialización:', error)
  }
})

// Estado para el formulario
const form = ref({
  nombre: '',
  email: '',
  telefono: '',
  loginTelefono: '',
  password: '',
  confirmPassword: '',
  ciudad: null,
  profileImage: null
}) 

// Problems data
const problems = [
  { id: 1, icon: '💧', text: 'Una fuga de agua' },
  { id: 2, icon: '❄️', text: 'El aire deja de enfriar' },
  { id: 3, icon: '⚡', text: 'Fallo Eléctrico' },
  { id: 4, icon: '🔧', text: 'Se daña la lavadora' }
]

// Estado para el porcentaje de descuento
const discountPercentage = ref()

// Función para obtener el porcentaje de descuento del backend
const fetchDiscountPercentage = async () => {
  try {
    
    const response = await $api('/config/valor/porcentaje_descuento', {
      method: 'GET'
    })
    
    if (response && response.valor) {
      discountPercentage.value = response.valor
    }
  } catch (error) {
    console.error('Error al obtener el porcentaje de descuento:', error)
    // Mantener el valor por defecto en caso de error
    discountPercentage.value = '10'
  }
}


// Estado para los beneficios de membresía
const membershipBenefitsList = ref([])
const isLoadingBenefits = ref(false)

// Función para cargar los beneficios desde la API
const loadMembershipBenefits = async () => {
  try {
    isLoadingBenefits.value = true
    // Asegurarse de que tenemos el porcentaje de descuento actualizado
    if (!discountPercentage.value) {
      await fetchDiscountPercentage()
    }
    
    const data = await $api('/membresiabeneficios', {
      method: 'GET'
    })
    
    // Actualizar los valores de configuración si vienen en la respuesta
    if (data.valores) {
      visitCost.value = parseFloat(data.valores.visita_tecnico) || 0;
      discountPercentage.value = data.valores.porcentaje_descuento || '0';
      // Guardar el porcentaje de descuento especial si está disponible
      if (data.valores.porcentaje_descuento_especial) {
        specialDiscountPercentage.value = data.valores.porcentaje_descuento_especial;
      }
    }
    
    // Obtener beneficios de la respuesta o usar valores por defecto
    let beneficios = data.beneficios || [];
    
    if (beneficios.length === 0) {
      console.warn('No se encontraron beneficios en la API');
      // Podríamos insertar beneficios por defecto aquí si fuera necesario
    }
    
    // Ordenar por mes_requerido y mapear los datos
    membershipBenefitsList.value = [...beneficios]
      .sort((a, b) => (a.mes_requerido || 0) - (b.mes_requerido || 0))
      .map((benefit, index) => {
        // Determinar el ahorro basado en el tipo de beneficio
        let savings = '';
        const tipoBeneficio = benefit.tipo_beneficio || '';
        
        const tipoLower = tipoBeneficio.toLowerCase().trim();
        
        if (tipoLower === 'cashback en todos los servicios') {
          savings = `${discountPercentage.value}% Cashback en cada servicio`;
        } else if (tipoLower === 'cashback especial en todos los servicios') {
          const porcentaje = specialDiscountPercentage.value || tipoBeneficio.split('%')[0] || '0';
          savings = `${porcentaje}% Cashback en cada servicio`;
        } else if (tipoLower.includes('visita técnica')) {
          savings = `Ahorro: L. ${(visitCost.value || 0).toLocaleString('es-HN')} por visita`;
        } 
        
        return {
          id: benefit.id_beneficio || index + 1,
          mes_requerido: benefit.mes_requerido || 0,
          title: tipoBeneficio || 'Beneficio',
          description: benefit.descripcion || '',
          savings: savings
        };
      })
  } catch (error) {
    console.error('Error al cargar los beneficios de membresía:', error)
    // En caso de error, se manejará en el bloque try principal
  } finally {
    isLoadingBenefits.value = false
  }
}


// Beneficios traducidos automáticamente
const membershipBenefitsTranslated = trList(membershipBenefitsList, ['title', 'description', 'savings'])

// Beneficios de membresía como propiedad computada
const membershipBenefits = computed(() =>
  membershipBenefitsTranslated.value.length
    ? membershipBenefitsTranslated.value
    : membershipBenefitsList.value
)

// Función para cargar los servicios desde la API
const loadServices = async () => {
  try {
    isLoadingServices.value = true 
    
    const data = await $api('/servicios/activos', {
      method: 'GET'
    })
    
    if (!Array.isArray(data)) { 
      throw new Error('Formato de respuesta inesperado: se esperaba un array de servicios')
    }
    
    // Mapear los datos de la API al formato esperado por el componente y barajar aleatoriamente
    services.value = data.map(service => ({
      id: service.id_servicio,
      name: service.nombre,
      description: service.descripcion,
      estado: service.estado,
      icon: getServiceIcon(service.nombre)
    })).sort(() => Math.random() - 0.5)
  } catch (error) {
    console.error('Error al cargar los servicios:', error) 
  } finally {
    isLoadingServices.value = false
  }
}

// Función auxiliar para asignar iconos según el nombre del servicio
const getServiceIcon = (serviceName) => {
  const icons = {
    'fontan': '💧',
    'electri': '💡',
    'cámara': '🎥',
    'aire': '❄️', 
    'reparaci': '🔧',
    'pintur': '🎨', 
    'cerraj': '🔑',
    'jardin': '🌿',
    'limpie': '🧹',
    'mudanz': '🚚',
    'viaje': '🚗',
    'carpin': '🚪',
    'teléfono': '💻', 
    'computadora': '💻', 
    'barber': '💈',
    'peluquería': '💈',
    'edecanes': '🧜‍♀️'
  }
  
  if (!serviceName) return '🛠️'
  const lowerName = serviceName.toLowerCase()
  for (const [key, icon] of Object.entries(icons)) {
    if (lowerName.includes(key)) {
      return icon
    }
  }
  
  return '🛠️' // Icono por defecto
}

// How it works data
const howItWorks = [
  { id: 1, title: 'Regístrate en la plataforma (gratis)', description: 'Crea tu cuenta sin costo alguno' },
  { id: 2, title: 'Elige si deseas pagar la membresía mensual', description: 'Decide si quieres los beneficios de membresía' },
  { id: 3, title: 'Accede a todos los beneficios desde el primer día', description: 'Disfruta inmediatamente de las ventajas' },
  { id: 4, title: 'Solicita servicios cuando los necesites', description: 'Pide ayuda cuando tu hogar lo requiera' },
  { id: 5, title: 'Acumula crédito mes a mes si no lo usás', description: 'Tu dinero se convierte en ahorro real' }
]

// Referral steps data
const referralSteps = [
  {
    title: 'Comparte tu enlace',
    description: 'Envía tu enlace de invitación a amigos y familiares',
    icon: '📱'
  },
  {
    title: 'Ellos se registran',
    description: 'Se registran usando tu enlace',
    icon: '✍️'
  },
  {
    title: 'Contratan un servicio',
    description: 'Ganas por cada servicio contratado',
    icon: '🏠'
  },
  {
    title: 'Recibes recompensa',
    description: 'Retira tu dinero inmediatamente',
    icon: '💰'
  }
]

// No membership limitations
const noMembershipLimitations = [
  { id: 1, icon: '💢', text: 'No obtendrás descuentos ni cashback a la hora de pagar' },
  { id: 2, icon: '💢', text: 'Perderás todos los beneficios de tener membresía' },
  { id: 3, icon: '💢', text: 'Pagarás por la visita técnica al solicitar un servicio' }
]

// Trust features data
const trustFeatures = [
  { id: 1, title: 'Técnicos verificados y capacitados', icon: '✅' },
  { id: 2, title: 'Garantía de servicio en todos los trabajos', icon: '🛡️' },
  { id: 3, title: 'Fotografía y calificaciones de cada uno de los técnicos', icon: '⭐' },
  { id: 4, title: 'Registro de todo tu historial de servicios', icon: '📋' },
  { id: 5, title: 'Soporte directo desde la app o WhatsApp', icon: '📞' }
]

// Helper functions for styling
const getCardColor = (index) => {
  const colors = [
    'border-l-4 border-l-blue-500',
    'border-l-4 border-l-green-500',
    'border-l-4 border-l-purple-500',
    'border-l-4 border-l-orange-500',
    'border-l-4 border-l-pink-500',
    'border-l-4 border-l-teal-500'
  ]
  return colors[index % colors.length]
}

const getIconBg = (index) => {
  const benefit = membershipBenefitsList.value[index];
  if (!benefit) return 'bg-gray-500'; // Fallback color
  
  const month = benefit.mes_requerido;
  const colorMap = {
    1: 'bg-blue-500',
    2: 'bg-green-500',
    3: 'bg-purple-500',
    4: 'bg-orange-500',
    5: 'bg-pink-500',
    6: 'bg-teal-500',
    7: 'bg-red-500',
    8: 'bg-yellow-500',
    9: 'bg-indigo-500',
    10: 'bg-rose-500',
    11: 'bg-emerald-500',
    12: 'bg-amber-500'
  };
  
  // Use modulo to handle months beyond 12
  return colorMap[month] || colorMap[(month % 12) + 1] || 'bg-gray-500';
}

// Methods
const authStore = useAuthStore()
// Manejar el envío del formulario de recuperación de contraseña
const handlePasswordReset = async () => {
  try {
    isResettingPassword.value = true
    
    // Validar el correo electrónico
    if (!emailForPasswordReset.value) {
      showToast('Por favor ingresa tu correo electrónico', 'error')
      return
    }

    // Enviar solicitud de recuperación de contraseña
    const response = await $api('/auth/forgot-password', {
      method: 'POST',
      body: {
        email: emailForPasswordReset.value
      }
    })

    // Mostrar mensaje de éxito
    showToast('Si el correo está registrado, se enviará un enlace para restablecer la contraseña', 'success')
    showForgotPassword.value = false
    emailForPasswordReset.value = ''
  } catch (error) {
    const statusCode = error.statusCode || error.status || error.response?.status;
    const errorMessage = error?.data?.message || '';
    
    if (statusCode == 429 || errorMessage.includes('Demasiados intentos')) {
      showForgotPassword.value = false;
      setTimeout(() => {
        showRateLimitModal.value = true;
      }, 100);
      return;
    }

    console.error('Error al solicitar recuperación de contraseña:', error)
    const finalErrorMessage = error?.data?.message || 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.'
    showToast(finalErrorMessage, 'error')
  } finally {
    isResettingPassword.value = false
  }
}

const trackCompleteRegistration = () => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'Registro MiSeguro'
    });
  }
};

const handleAuth = async () => {
  // Resetear estado
  authStatus.value = ''
  formErrors.value = {}
  
  // Validar formulario
  if (!validateForm()) {
    showToast('Por favor completa correctamente todos los campos', 'error')
    return
  }
  
  isLoading.value = true
  
  try {
    if (isLogin.value) {
      // Lógica de login
      try {
        const loginData = {
          telefono: normalizarTelefono(form.value.loginTelefono),
          password: form.value.password
        }; 
        
        // Usar el store de autenticación para el login
        const loginResult = await auth.login(loginData); 
        
        if (loginResult?.success) {
          authStatus.value = 'success';
          
          await new Promise(resolve => setTimeout(resolve, 800));
          
          if (auth.user?.estado === 'deshabilitado') {
            showLoginModal.value = false;
            showSuccess.value = true;
            setTimeout(() => {
              window.location.href = '/usuario-deshabilitado';
            }, 300);
            return;
          }

          const userRole = auth.user?.role?.toLowerCase() || '';
          
          showLoginModal.value = false;
          showSuccess.value = true;
          
          setTimeout(() => {
            switch(userRole) {
              case 'admin':
                window.location.href = '/admin/DashboardAdmin';
                break;
              case 'tecnico':
                window.location.href = '/tecnico/DashboardTecnico';
                break;
              case 'usuario':
                window.location.href = '/cliente/DashboardCliente';
                break;
              case 'sa':
                window.location.href = '/admin/DashboardAdmin';
                break;
              default:
                window.location.href = '/';
                break;
            }
          }, 300);
        } else {
          // Verificar si el error es por Rate Limit (429)
          const errorMessage = loginResult?.error || '';
          if (loginResult?.status == 429 || errorMessage.includes('Demasiados intentos')) {
            showLoginModal.value = false;
            isLoading.value = false;
            authStatus.value = '';
            setTimeout(() => {
              showRateLimitModal.value = true;
            }, 100);
            return;
          }
          throw new Error(loginResult?.error || 'Error en las credenciales');
        }
      } catch (loginError) {
        const loginErrorData = loginError.data || loginError.response?._data;
        const statusCode = loginError.statusCode || loginError.status || loginError.response?.status;
        const errorMessage = loginErrorData?.message || loginError.message || '';
        
        if (statusCode == 429 || errorMessage.includes('Demasiados intentos')) {
          showLoginModal.value = false;
          isLoading.value = false;
          authStatus.value = '';
          setTimeout(() => {
            showRateLimitModal.value = true;
          }, 100);
          return;
        }

        authStatus.value = 'error';
        loadingMessage.value = errorMessage || 'Error de autenticación';
        
        setTimeout(() => {
          isLoading.value = false;
          authStatus.value = '';
          loadingMessage.value = '';
        }, 1500);
        return;
      }
    } else {
      // Lógica de registro - Ahora diferida a completeRegistration
      try { 
        const device_id = await getDeviceId();
        pendingRegisterData.value = {
          nombre: form.value.nombre,
          email: form.value.email,
          telefono: form.value.telefono,
          password_hash: form.value.password,
          id_ciudad: form.value.ciudad?.id,
          device_id
        };
        
        showLoginModal.value = false;
        showRoleSelectionModal.value = true;
        isLoading.value = false;
        return;
      } catch (error) {
        console.error('Error preparando registro:', error);
        showToast('Error al procesar el registro. Por favor, inténtalo de nuevo.', 'error');
        isLoading.value = false;
      }
    }
  } catch (error) {
    showToast('Error inesperado. Por favor, inténtalo de nuevo.', 'error');
    isLoading.value = false;
    authStatus.value = '';
  }
}

// Nueva función para completar el registro después de elegir el rol
const completeRegistration = async (isTechnician) => {
  if (!pendingRegisterData.value) return;
  
  isLoading.value = true;
  loadingMessage.value = isTechnician ? 'Procesando registro como técnico...' : 'Creando tu cuenta...';
  registerAsTechnician.value = isTechnician;

  try {
    const registerData = {
      ...pendingRegisterData.value,
      es_tecnico: isTechnician ? 1 : 0
    };
    
    // Realizar la petición de registro
    const response = await $api('/usuarios/nuevo', {
      method: 'POST',
      body: registerData
    }); 
    
    const responseData = response;
    
    if (responseData.error || responseData.status === 'error') {
      const errorMessage = responseData.message || 'Error en el registro';
      throw new Error(errorMessage);
    }
    
    const userId = responseData.id_usuario || responseData.id;
    if (!userId) {
      throw new Error('No se pudo obtener el ID del usuario del registro');
    }
    
    // Mostrar mensaje de éxito
    if (isTechnician) {
      showToast('¡Solicitud de técnico enviada! Tu perfil está en revisión.', 'success');
    } else {
      showToast('¡Registro exitoso! Iniciando sesión...', 'success');
    }
    
    trackCompleteRegistration();
    await handleReferral(userId);
    
    // Notificaciones en segundo plano
    $api('/notificaciones/enviar', { method: 'POST', body: { titulo: 'Nuevo registro', nombre_rol: 'admin' } }).catch(() => {});
    $api('/notificaciones/enviar', { method: 'POST', body: { titulo: 'Nuevo registro', nombre_rol: 'sa' } }).catch(() => {});

    if (isTechnician) {
      const formData = { ...form.value };
      showRoleSelectionModal.value = false;
      
      setTimeout(() => {
        sendTechnicianRegistrationMessage(formData.nombre, formData);
        
        setTimeout(() => {
          // Limpiar el formulario
          form.value = {
            nombre: '',
            email: '',
            telefono: '',
            ciudad: null,
            identidad: '',
            password: ''
          };
          registerAsTechnician.value = false;
          isLoading.value = false;
          authStatus.value = '';
          pendingRegisterData.value = null;
        }, 1500);
      }, 0);
    } else {
      // Login automático para usuarios normales (usar teléfono normalizado)
      try {
        const loginResult = await auth.login({
          telefono: normalizarTelefono(form.value.telefono),
          password: form.value.password
        });

        if (loginResult?.success) {
          const userRole = auth.user?.role?.toLowerCase() || '';
          showRoleSelectionModal.value = false;
          showSuccess.value = true;
          
          const redirectPath = {
            'admin': '/admin/DashboardAdmin',
            'sa': '/admin/DashboardAdmin',
            'tecnico': '/tecnico/DashboardTecnico',
            'usuario': '/cliente/DashboardCliente'
          }[userRole] || '/';



          setTimeout(() => {
            window.location.href = redirectPath;
          }, 600);
          return;
        }
      } catch (loginError) {
        console.error('Error en login automático:', loginError);
      }

      // Si falla el login automático
      isLogin.value = true;
      showRoleSelectionModal.value = false;
      isLoading.value = false;
      pendingRegisterData.value = null;
    }
  } catch (error) {
    console.error('Error finalizando registro:', error);
    const errorMessage = error?.data?.message || error?.message || 'Error en el registro';
    showToast(errorMessage, 'error');
    isLoading.value = false;
    authStatus.value = '';
  }
}

const emailForPasswordReset = ref('')
const isResettingPassword = ref(false)

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'error',
  duration: 5000,
  timeoutId: null
})

// Loading message state
const loadingMessage = ref('')

// Show toast function
const showToast = (message, type = 'error', duration = 5000) => {
  // Limpiar timeout anterior si existe
  if (toast.value.timeoutId) {
    clearTimeout(toast.value.timeoutId)
  }

  // Actualizar el estado del toast
  toast.value = {
    show: true,
    message,
    type,
    duration,
    timeoutId: null
  }

  // Configurar el cierre automático
  if (duration > 0) {
    toast.value.timeoutId = setTimeout(() => {
      toast.value.show = false
    }, duration)
  }
}

// Alias para compatibilidad con el código existente
const showCustomAlert = (message) => {
  showToast(message, 'error')
}

// Validación del campo de identidad
const handleIdentityInput = (e) => {
  // Asegurarse de que form.identidad sea una cadena
  if (!form.identidad) form.identidad = '';
  
  // Solo permite números
  form.identidad = form.identidad.toString().replace(/\D/g, '')
  // Limpia el mensaje de error al escribir
  if (form.identidad.length >= 12) {
    formErrors.identidad = ''
  }
}

const validateIdentity = () => {
  const len = form.identidad ? form.identidad.toString().length : 0
  if (len > 0) {
    if (len < 12 || len > 17) {
      formErrors.identidad = 'El número de identidad debe tener entre 12 y 17 dígitos'
      return false
    }
    if (/(.)\1{5,}/.test(form.identidad.toString())) {
      formErrors.identidad = 'El número de identidad parece ser falso'
      return false
    }
  }
  formErrors.identidad = ''
  return true
}

// Funciones de validación de teclado
const preventNumberInput = (e) => {
  if (e.key >= '0' && e.key <= '9') {
    e.preventDefault();
  }
}

const preventLetterInput = (e) => {
  // Permitir teclas de control (backspace, delete, tab, etc.)
  if ([8, 9, 13, 27, 46, 37, 38, 39, 40].includes(e.keyCode) || 
      // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode))) {
    return;
  }
  
  // Si estamos en el campo de teléfono
  if (e.target.name === 'telefono' || e.target.getAttribute('type') === 'tel') {
    // Permitir números y +
    if (/^[0-9+]$/.test(e.key)) {
      return;
    }
    e.preventDefault();
  }
}

// Manejar la entrada en el campo de teléfono
const handlePhoneInput = (e) => {
  // Obtener el valor actual
  let value = e.target.value;
  
  // Si se está pegando un valor, permitir la operación completa
  if (e.inputType === 'insertFromPaste') {
    form.telefono = value;
    validatePhoneNumber(value);
    return;
  }
  
  // Filtrar solo caracteres permitidos (números y +)
  value = value.replace(/[^0-9+]/g, '');
  
  // Limitar la longitud total
  if (value.length > 20) {
    value = value.substring(0, 20);
  }
  
  // Actualizar el valor del campo
  form.telefono = value;
  
  // Validar el número de teléfono
  validatePhoneNumber(value);
};

// Validar el formato del número de teléfono
const validatePhoneNumber = (phoneNumber) => {
  // Eliminar espacios en blanco para la validación
  const cleanNumber = phoneNumber.replace(/\s+/g, '');
  
  // Validar que comience con + seguido de 1-4 dígitos (código de país)
  const countryCodeRegex = /^\+[0-9]{1,4}/;
  
  // Validar que el número completo tenga entre 8 y 15 dígitos (incluyendo el código de país)
  const minLength = 8;
  const maxLength = 15;
  const digitCount = cleanNumber.replace(/[^0-9]/g, '').length;
  
  // Limpiar errores previos
  formErrors.telefono = '';
  
  // Validaciones
  if (!cleanNumber.startsWith('+')) {
    formErrors.telefono = 'El número debe comenzar con el código de país (ej: +504)';
  } else if (!countryCodeRegex.test(cleanNumber)) {
    formErrors.telefono = 'El código de país debe tener entre 1 y 4 dígitos después del +';
  } else if (digitCount < minLength) {
    formErrors.telefono = `El número es demasiado corto. Mínimo ${minLength} dígitos incluyendo el código de país`;
  } else if (digitCount > maxLength) {
    formErrors.telefono = `El número es demasiado largo. Máximo ${maxLength} dígitos incluyendo el código de país`;
  } else if (/(.)\1{5,}/.test(cleanNumber.replace(/\+/g, ''))) {
    formErrors.telefono = 'El número de teléfono parece ser falso';
  } else if (cleanNumber.includes('504')) {
    const onlyDigits = cleanNumber.replace(/\D/g, '');
    const match = onlyDigits.match(/504([0-9])/);
    if (match && !['2', '3', '7', '8', '9'].includes(match[1])) {
      formErrors.telefono = 'Número no válido para Honduras (debe empezar con 2, 3, 7, 8 o 9)';
    }
  }
  
  // Devolver si el número es válido
  return !formErrors.telefono;
};

// Manejar pegado en el campo de teléfono
const handlePhonePaste = (e) => {
  // Obtener el texto pegado
  const pastedText = (e.clipboardData || window.clipboardData).getData('text');
  
  // Filtrar solo caracteres permitidos (números y +)
  const filteredText = pastedText.replace(/[^0-9+]/g, '');
  
  // Actualizar el valor del campo
  form.telefono = form.telefono + filteredText;
  
  // Limpiar errores
  formErrors.telefono = '';
  
  // Prevenir el comportamiento por defecto
  e.preventDefault();
}

// Función para manejar el referido y notificaciones de forma asíncrona
const handleReferral = async (userId) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let referralCode = urlParams.get('ref');
    
    // Si no hay código de referido, obtener el ID del referido predeterminado desde la configuración
    if (!referralCode) {
      try {
        const response = await $api('/config/valor/referidor_predeterminado', {
          method: 'GET'
        });
        
        if (response && response.valor) {
          referralCode = response.valor;
        } 
      } catch (error) {
        console.error('Error al obtener el referidor predeterminado:', error);
        referralCode = '36'; 
      }
    }
    
    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      return; // Salir silenciosamente si no hay userId
    }
    
    const referralData = {
      id_referidor: referralCode,
      id_referido_usuario: userId
    };
    
    // Registrar el referido
    const referidoResult = await $api('/referidos/nuevo', {
      method: 'POST',
      body: referralData
    });
    
    // Obtener los datos del referido para la notificación
    const referidoData = referidoResult;
    
    // Enviar notificación al referidor
    if (referralCode && referidoData) {
      try {
        await $api('/notificaciones/enviar', {
          method: 'POST',
          body: {
            id_usuario: referralCode,
            titulo: 'Nuevo referido'
          }
        });
      } catch (notificationError) {
        console.error('Error al enviar notificación al referidor:', notificationError);
        // No interrumpir el flujo por errores en las notificaciones
      }
    }
  } catch (error) {
    console.error('Error en handleReferral:', error);
  }
};

// Función para enviar mensaje de WhatsApp al registrarse como técnico
// Variable reactiva para almacenar el número de teléfono de la empresa
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
      // Valor por defecto en caso de que no haya respuesta
      empresaPhoneNumber.value = '1234567890';
    }
  } catch (error) {
    console.error('Error al obtener el número de teléfono de la empresa:', error);
    // Establecer un valor por defecto en caso de error
    empresaPhoneNumber.value = '1234567890';
  }
};

const sendTechnicianRegistrationMessage = async (nombre, formData = {}) => {
  try { 

    // Si no tenemos el número de teléfono, intentar obtenerlo
    if (!empresaPhoneNumber.value) {
      await fetchEmpresaPhoneNumber();
    }

    // Asegurarse de que tenemos los valores
    const nombreUsuario = nombre?.trim() || formData?.nombre?.trim() || 'Usuario';
    const telefonoUsuario = formData?.telefono || 'No proporcionado';
    
    // Mantener el formato original del mensaje
    const message = `Hola, mi nombre es ${nombreUsuario}\n` +
      `*Teléfono:* ${telefonoUsuario}\n\n` +  
      `Como proveedor de servicios en la ciudad de ${formData?.ciudad?.nombre || ''} y quiero continuar con mi validación.\n\n` +
      `Me dedico a:\n` +
      `(escribir aquí qué servicios u oficios ofrece)\n\n` +
      `Tengo experiencia en:\n` +
      `(escribir años de experiencia o tipo de trabajos que ha realizado)\n\n` +
      `Adjunto a continuación:\n` +
      `• Mis especialidades\n` +
      `• Fotos de trabajos realizados\n` +
      `• Certificados, diplomas o constancias (si cuento con ellos)\n` +
      `• Cualquier otra información que respalde mi experiencia`; 
    
    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);
    
    // Abrir WhatsApp Web con el mensaje predefinido
    window.open(`https://wa.me/+504${empresaPhoneNumber.value}?text=${encodedMessage}`, '_blank');
  } catch (error) {
    console.error('Error al preparar el mensaje de WhatsApp:', error);
  }
};

// Computed property para verificar si el formulario está completo
const isFormValid = computed(() => {
  if (isLogin.value) {
    return form.value.loginTelefono && form.value.password;
  } else {
    const basicFields = form.value.nombre && 
                       form.value.email && 
                       form.value.telefono && 
                       form.value.ciudad && 
                       form.value.password; 
    
    return basicFields;
  }
});

// Forzar modo oscuro
onMounted(() => {
  fetchEmpresaPhoneNumber()
  // Forzar modo oscuro en el elemento html
  document.documentElement.classList.add('dark')
  document.documentElement.style.colorScheme = 'dark'
  document.documentElement.style.backgroundColor = '#111827'
  document.documentElement.setAttribute('data-theme', 'dark')
  
  // Aplicar estilos al body
  document.body.classList.add('bg-gray-900', 'text-white')
  document.body.style.backgroundColor = '#111827'
  
  // Forzar tema oscuro en localStorage para consistencia
  localStorage.setItem('theme', 'dark')
  
  // Asegurar que los estilos se mantengan incluso si hay cambios dinámicos
  const observer = new MutationObserver((mutations) => {
    if (!document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.add('dark')
    }
    if (document.documentElement.getAttribute('data-theme') !== 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  })
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
    childList: false,
    subtree: false
  })
  
  // Retornar función de limpieza
  return () => observer.disconnect()
})

// Función para obtener o generar un ID único de dispositivo (Fingerprint + UUID)
const getDeviceId = async () => {
  if (process.server) return null;
  
  let deviceId = localStorage.getItem('ph_device_id');
  
  if (!deviceId) {
    // Generar firma basada en características del navegador
    const fingerprint = [
      navigator.userAgent,
      screen.width,
      screen.height,
      navigator.language,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 'unknown',
      navigator.deviceMemory || 'unknown'
    ].join('|');
    
    // Generar un UUID aleatorio
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    // Combinar para crear el ID final
    // Usamos btoa para que no sea texto plano obvio
    deviceId = btoa(fingerprint).substring(0, 32) + '-' + uuid;
    localStorage.setItem('ph_device_id', deviceId);
    
    // También guardar en una cookie persistente por si borran localStorage
    const d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000)); // 1 año
    document.cookie = `ph_device_id=${deviceId};expires=${d.toUTCString()};path=/;SameSite=Lax`;
  }
  
  return deviceId;
};

// Cargar ID al inicio
onMounted(() => {
  if (process.client) {
    getDeviceId();
    
    // Sincronizar cookie con localStorage si uno falta
    const cookieMatch = document.cookie.match(/ph_device_id=([^;]+)/);
    const localId = localStorage.getItem('ph_device_id');
    
    if (cookieMatch && !localId) {
      localStorage.setItem('ph_device_id', cookieMatch[1]);
    } else if (!cookieMatch && localId) {
      const d = new Date();
      d.setTime(d.getTime() + (365*24*60*60*1000));
      document.cookie = `ph_device_id=${localId};expires=${d.toUTCString()};path=/;SameSite=Lax`;
    }
  }
});
</script>