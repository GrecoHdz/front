<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-safe">
    <!-- Navbar y Search Sticky -->
    <header class="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
      <div class="px-4 pt-3 pb-3">
        <div class="flex items-center justify-between gap-3 mb-3">
          <button @click="router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div class="flex-1 text-center">
            <h1 class="text-base font-black text-gray-900 dark:text-white tracking-tight">Marketplace</h1>
          </div>

          <!-- Saldo Pill Compacto -->
          <div class="bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full flex items-center space-x-1.5 border border-gray-200 dark:border-gray-700">
            <span class="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Saldo</span>
            <span class="text-xs font-black text-blue-600 dark:text-blue-400">L. {{ formatNumber(userCredit) }}</span>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            v-model="searchQuery"
            type="text" 
            class="block w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-800 border-none rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
            placeholder="¿Qué necesitas hoy?"
          >
        </div>
      </div>
    </header>

    <main class="space-y-6 pb-24 pt-4">
      <!-- Loading Skeleton -->
      <div v-if="cargandoPaquetes" class="px-4 space-y-4">
        <div class="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        <div class="grid grid-cols-2 gap-3">
           <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
           <div class="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div v-else>
         
         <!-- 1. Mis Paquetes (Carril Horizontal) -->
         <section v-if="ownedPackages.length > 0 && !searchQuery" class="pl-4">
            <div class="flex items-center justify-between pr-4 mb-3">
               <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">Mis Paquetes</h2>
            </div>
            
            <div class="flex overflow-x-auto gap-3 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in ownedPackages" 
                  :key="'owned-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-72 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl p-4 relative overflow-hidden shadow-lg group active:scale-95 transition-transform"
               >
                  <!-- Decoración -->
                  <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div class="relative z-10 flex justify-between items-start">
                     <div>
                        <span class="inline-block px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold mb-2 border border-white/10 backdrop-blur-md">
                           {{ getEstadoPaquete(paquete.id) }}
                        </span>
                        <h3 class="font-bold text-base leading-tight w-4/5">{{ paquete.nombre }}</h3>
                     </div>
                     <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl shadow-inner">
                        📦
                     </div>
                  </div>
                  
                  <div class="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                     <span class="text-[10px] text-gray-300">Toca para gestionar</span>
                     <svg class="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
               </div>
            </div>
         </section>

         <!-- 2. Carril 1: Destacados (4 items) -->
         <section v-if="!searchQuery && lane1.length > 0" class="pl-4">
            <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Destacados</h2>
            <div class="flex overflow-x-auto gap-3 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in lane1" 
                  :key="'l1-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-[85vw] sm:w-80 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-3 active:scale-[0.98] transition-all"
               >
                  <!-- Imagen Izquierda -->
                  <div class="w-24 h-24 shrink-0 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden relative">
                     <img 
                        v-if="paquete.imagen"
                        :src="getOptimizedImage(paquete.imagen, 200, 200)" 
                        class="w-full h-full object-cover"
                     />
                     <div v-if="userCredit >= paquete.costo" class="absolute bottom-0 left-0 right-0 bg-emerald-500/90 text-white text-[8px] font-bold text-center py-0.5">
                        CANJEABLE
                     </div>
                  </div>

                  <!-- Info Derecha -->
                  <div class="flex flex-col justify-between py-1 flex-1 min-w-0">
                     <div>
                        <h3 class="font-bold text-sm text-gray-900 dark:text-white leading-tight mb-1 truncate">{{ paquete.nombre }}</h3>
                        <p class="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{{ paquete.descripcion }}</p>
                     </div>
                     <div class="flex items-end justify-between mt-2">
                        <span class="font-black text-sm text-blue-600 dark:text-blue-400">L. {{ formatNumber(paquete.costo) }}</span>
                        <button class="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                           <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- 3. Carril 2: Recomendados (4 items) -->
         <section v-if="!searchQuery && lane2.length > 0" class="pl-4">
            <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Te podría interesar</h2>
            <div class="flex overflow-x-auto gap-3 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in lane2" 
                  :key="'l2-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-36 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 active:scale-[0.98] transition-all relative"
               >
                  <div class="h-24 w-full bg-gray-100 dark:bg-gray-700 relative">
                     <img 
                        v-if="paquete.imagen"
                        :src="getOptimizedImage(paquete.imagen, 300, 200)" 
                        class="w-full h-full object-cover"
                     />
                     <!-- Etiqueta Crédito -->
                     <div v-if="userCredit >= paquete.costo" class="absolute bottom-0 left-0 right-0 bg-emerald-500/90 text-white text-[8px] font-bold text-center py-0.5">
                        CANJEABLE
                     </div>
                  </div>
                  <div class="p-2">
                     <h3 class="font-bold text-[11px] text-gray-900 dark:text-white leading-tight mb-1 truncate">{{ paquete.nombre }}</h3>
                     <p class="font-black text-xs text-blue-600 dark:text-blue-400">L. {{ formatNumber(paquete.costo) }}</p>
                  </div>
               </div>
            </div>
         </section>

         <!-- 3.5. Carril Especial "Hogar" (Filtro 'casa') -->
         <section v-if="!searchQuery && laneHome.length > 0" class="pl-4">
            <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider mb-3">Especial Hogar 🏠</h2>
            <div class="flex overflow-x-auto gap-4 pb-4 pr-4 -ml-4 pl-4 snap-x no-scrollbar">
               <div 
                  v-for="paquete in laneHome" 
                  :key="'home-'+paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="snap-center shrink-0 w-[85vw] sm:w-80 h-48 rounded-2xl relative overflow-hidden shadow-md active:scale-[0.98] transition-all bg-gray-200"
               >
                  <img 
                     v-if="paquete.imagen"
                     :src="getOptimizedImage(paquete.imagen, 600, 400)" 
                     class="absolute inset-0 w-full h-full object-cover"
                  />
                  <!-- Gradiente superpuesto -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  <div class="absolute bottom-0 left-0 right-0 p-4">
                     <h3 class="text-white font-bold text-lg leading-tight mb-1">{{ paquete.nombre }}</h3>
                     <div class="flex items-center space-x-2">
                        <span class="text-white font-black text-sm">L. {{ formatNumber(paquete.costo) }}</span>
                        <span v-if="userCredit >= paquete.costo" class="text-[9px] bg-emerald-500/90 text-white px-1.5 py-0.5 rounded font-bold">Canjeable</span>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- 4. "Todos los Paquetes" (Grid Vertical Restante) -->
         <section class="px-4">
            <div class="flex items-center justify-between mb-3">
               <h2 class="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  {{ searchQuery ? 'Resultados' : 'Explorar Todo' }}
               </h2>
               <span class="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-bold">{{ gridPackages.length }}</span>
            </div>

            <div class="grid grid-cols-2 gap-3">
               <div 
                  v-for="paquete in gridPackages" 
                  :key="paquete.id"
                  @click="openPackageDetail(paquete)"
                  class="flex bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-gray-700 active:bg-gray-50 transition-colors"
               >
                  <!-- Layout Horizontal Compacto dentro de la tarjeta vertical (Mini-List) -->
                  <!-- Esta vez optamos por un diseño de "Fila" dentro de Grid para aprovechar ancho -->
                  <!-- Si prefieres imagen arriba: -->
                  <div class="flex flex-col w-full h-full"> 
                     <div class="relative w-full aspect-[16/9] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-2">
                        <img 
                           v-if="paquete.imagen"
                           :src="getOptimizedImage(paquete.imagen, 200, 150)" 
                           class="w-full h-full object-cover"
                           loading="lazy"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-xl">✨</div>
                        
                        <!-- Mini Badge de Precio -->
                        <div class="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                           L. {{ formatNumber(paquete.costo) }}
                        </div>
                     </div>

                     <h3 class="text-[11px] font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1">
                        {{ paquete.nombre }}
                     </h3>
                     
                     <div class="mt-auto pt-1">
                        <p v-if="userCredit >= paquete.costo" class="text-[9px] text-emerald-600 font-bold flex items-center">
                           <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span>
                           Canjeable
                        </p>
                        <p v-else class="text-[9px] text-blue-600 font-bold flex items-center">
                           <span class="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                           Adquirir
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            
            <!-- Empty Search -->
            <div v-if="gridPackages.length === 0" class="text-center py-10">
               <p class="text-gray-400 text-sm">No encontramos resultados para "{{ searchQuery }}"</p>
               <button @click="searchQuery = ''" class="text-blue-600 text-xs font-bold mt-2">Limpiar búsqueda</button>
            </div>
         </section>
      </div>
    </main>

    <!-- Bottom Sheet Detalle (Misma lógica, diseño limpio) -->
    <div 
      v-if="selectedDetailPackage" 
      class="fixed inset-0 z-50 flex flex-col justify-end isolate"
    >
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        @click="closeDetail"
      ></div>

      <div class="relative w-full bg-white dark:bg-gray-900 rounded-t-[2rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-slide-up-spring">
        <div class="w-full flex justify-center pt-3 pb-1" @click="closeDetail">
           <div class="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>

        <div class="overflow-y-auto p-6 pb-28">
           <div class="aspect-video w-full rounded-2xl bg-gray-100 dark:bg-gray-800 mb-6 overflow-hidden relative shadow-inner">
              <img 
                 v-if="selectedDetailPackage.imagen"
                 :src="getOptimizedImage(selectedDetailPackage.imagen, 800, 500)" 
                 class="w-full h-full object-cover"
              />
              <!-- Float buttons on image -->
              <button 
                 @click="closeDetail"
                 class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-md"
              >
                 ✕
              </button>
           </div>

           <div class="flex justify-between items-start mb-4">
              <h2 class="text-xl font-black text-gray-900 dark:text-white leading-tight w-full">
                 {{ selectedDetailPackage.nombre }}
              </h2>
           </div>

           <div class="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300">
              <h3 class="text-xs uppercase font-bold text-gray-400 mb-2 tracking-wider">Acerca del paquete</h3>
              <p class="text-sm leading-relaxed">{{ selectedDetailPackage.descripcion || 'Sin descripción detallada.' }}</p>
           </div>
        </div>

        <div class="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
           <div v-if="tienePaquete(selectedDetailPackage.id)">
              <button 
                 @click="initiateUse(selectedDetailPackage)"
                 :disabled="getEstadoPaquete(selectedDetailPackage.id) !== 'Adquirido'"
                 class="w-full py-3.5 rounded-xl font-black text-base bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg"
              >
                 {{ getEstadoPaquete(selectedDetailPackage.id) === 'En uso' ? 'En Uso' : 'Usar Paquete' }}
              </button>
           </div>
           
           <div v-else class="flex gap-3">
              <button 
                 @click="initiatePurchase(selectedDetailPackage)"
                 class="flex-1 py-3.5 rounded-xl font-black text-base text-white shadow-xl active:scale-95 transition-transform"
                 :class="userCredit >= selectedDetailPackage.costo ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-900 dark:bg-gray-700'"
              >
                 <span v-if="userCredit >= selectedDetailPackage.costo">Canjear </span>
                 <span v-else>Adquirir </span>
                 <span>L. {{ formatNumber(selectedDetailPackage.costo) }}</span>
              </button>
           </div>
        </div>
      </div>
    </div>

    <!-- Modals (Sin cambios funcionales, solo estilo mínimo) -->
    
    <!-- Confirmar Uso -->
    <Transition name="fade">
       <div v-if="showConfirmarUsoModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div class="bg-white dark:bg-gray-800 w-full max-w-[300px] rounded-3xl p-6 text-center animate-pop-in">
             <div class="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🚀</div>
             <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-1">Activar Paquete</h3>
             <p class="text-xs text-gray-500 mb-6">{{ selectedPaquete?.nombre }}</p>
             <button @click="usarPaquete(selectedPaquete)" :disabled="isProcessingPayment" class="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm mb-2">
                {{ isProcessingPayment ? 'Activando...' : 'Confirmar' }}
             </button>
             <button @click="showConfirmarUsoModal = false" class="text-xs text-gray-500 font-bold py-2">Cancelar</button>
          </div>
       </div>
    </Transition>

    <!-- Confirmar Canje -->
    <Transition name="fade">
       <div v-if="showConfirmarCanjeoModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div class="bg-white dark:bg-gray-800 w-full max-w-[300px] rounded-3xl p-6 text-center animate-pop-in">
             <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">💎</div>
             <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-4">Confirmar Canje</h3>
             <button @click="confirmarCanjeo" :disabled="isProcessingPayment" class="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm mb-2">
                {{ isProcessingPayment ? 'Procesando...' : 'Canjear' }}
             </button>
             <button @click="showConfirmarCanjeoModal = false" class="text-xs text-gray-500 font-bold py-2">Cancelar</button>
          </div>
       </div>
    </Transition>

     <!-- Pago Transferencia -->
     <Transition name="slide-up">
      <div v-if="showPaquetePagoModal" class="fixed inset-0 z-[70] bg-white dark:bg-gray-900 flex flex-col">
         <div class="px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
            <h2 class="font-bold text-base">Transferencia</h2>
            <button @click="closePaquetePagoModal" class="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">✕</button>
         </div>
         <div class="flex-1 overflow-y-auto p-6">
            <div class="text-center mb-6">
               <h1 class="text-3xl font-black text-blue-600">L. {{ formatNumber(selectedPaquete?.costo) }}</h1>
               <p class="text-xs font-bold text-gray-400 mt-1">Total a transferir</p>
            </div>

            <!-- Lista Bancos (Grid 2 por fila) -->
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cuentas Disponibles</label>
            <div class="grid grid-cols-2 gap-3 mb-6">
               <div 
                  v-for="acc in bankAccounts" 
                  :key="acc.id_cuenta"
                  @click="verDatosCuenta(acc)"
                  class="p-3 rounded-xl border transition-all flex flex-col justify-between h-24 active:scale-95 cursor-pointer"
                  :class="selectedAccountObject?.id_cuenta === acc.id_cuenta ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'"
               >
                  <div>
                     <p class="font-bold text-xs mb-1 line-clamp-1 text-gray-900 dark:text-white uppercase">{{ acc.banco }}</p>
                     <p class="text-[10px] text-gray-500 font-mono">{{ acc.num_cuenta }}</p>
                  </div>
                  <!-- Indicador de 'Ver' sutil -->
                  <div class="mt-auto pt-2 flex justify-end">
                     <span class="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">VER</span>
                  </div>
               </div>
            </div>

            <div v-if="selectedAccountObject" class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-6 border border-blue-100 dark:border-blue-800 flex items-center justify-between">
               <span class="text-xs font-bold text-blue-600">Banco seleccionado: {{ selectedAccountObject.banco }}</span>
               <button @click="verDatosCuenta(selectedAccountObject)" class="text-[10px] font-bold text-blue-600 underline">Ver Detalles</button>
            </div>

            <!-- Input Comprobante -->
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Referencia de Pago</label>
            <input 
               v-model="numeroComprobante"
               type="text" 
               inputmode="numeric" 
               placeholder="# Comprobante"
               class="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 font-bold focus:border-blue-500 focus:ring-0 mb-8 bg-transparent text-sm"
            >

            <button 
               @click="procesarPagoPaquete"
               :disabled="!isValidPaymentForm || isProcessingPayment"
               class="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-base rounded-xl shadow-lg disabled:opacity-50 transition-all"
            >
               {{ isProcessingPayment ? 'Enviando...' : 'Enviar Comprobante' }}
            </button>
         </div>
      </div>
    </Transition>

    <!-- Modal Detalle Cuenta (Nuevo) -->
    <Transition name="fade">
      <div v-if="showAccountDetailModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
         <div class="bg-white dark:bg-gray-800 w-full max-w-[320px] rounded-3xl p-6 relative animate-pop-in">
            <button @click="showAccountDetailModal = false" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">✕</button>
            
            <div class="text-center mb-6">
               <div class="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">🏦</div>
               <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-0.5">{{ viewingAccount?.banco }}</h3>
               <span class="text-xs text-gray-400 font-medium uppercase tracking-wider">{{ viewingAccount?.tipo }}</span>
            </div>

            <!-- Bloque Unificado de Información -->
            <div class="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center mb-6">
               <div class="mb-4">
                  <p class="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Número de Cuenta</p>
                  <p class="font-mono font-black text-2xl text-blue-600 dark:text-blue-400 tracking-tight">{{ viewingAccount?.num_cuenta }}</p>
               </div>
               
               <div class="pt-4 border-t border-gray-200 dark:border-gray-600">
                  <p class="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Beneficiario</p>
                  <p class="font-bold text-sm text-gray-900 dark:text-white">{{ viewingAccount?.beneficiario }}</p>
               </div>
            </div>

            <button 
               @click.stop="copyToClipboard(viewingAccount?.num_cuenta)"
               class="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
               <span>Copiar Número de Cuenta</span>
               <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </button>
         </div>
      </div>
    </Transition>

    <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useHead, useCookie, useRouter } from '#imports'
import Toast from '~/components/ui/Toast.vue'
import { useAuthStore } from '~/middleware/auth.store'

const { $api } = useNuxtApp()
const config = useRuntimeConfig()
const auth = useAuthStore()
const router = useRouter()
const userCookie = useCookie('user')

useHead({ 
  title: 'Marketplace',
  meta: [ { name: 'theme-color', content: '#ffffff' } ]
})

// --- State ---
const isLoading = ref(true)
const toast = ref({ show: false })
const userCredit = ref(0)
const searchQuery = ref('')

const paquetesMantenimiento = ref([])
const paquetesUsuario = ref([])
const cargandoPaquetes = ref(true)

// Detail Sheet Logic
const selectedDetailPackage = ref(null)

// Transaction State
const showPaquetePagoModal = ref(false)
const showAccountDetailModal = ref(false)
const viewingAccount = ref(null)
const showConfirmarUsoModal = ref(false)
const showConfirmarCanjeoModal = ref(false)
const selectedPaquete = ref(null)
const isLoadingAccounts = ref(false)
const bankAccounts = ref([])
const selectedAccountObject = ref(null)
const isProcessingPayment = ref(false)
const numeroComprobante = ref('')

// --- Computed ---

const displayPackages = computed(() => {
  let list = paquetesMantenimiento.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.nombre?.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q))
  }
  return list
})

const ownedPackages = computed(() => {
   return paquetesMantenimiento.value.filter(p => tienePaquete(p.id))
})

// 1. Fuente de paquetes "Hogar" (Exclusivos)
const homePackagesSource = computed(() => {
   return displayPackages.value.filter(p => 
      p.descripcion?.toLowerCase().includes('casa') || p.nombre?.toLowerCase().includes('casa')
   )
})

// 2. Fuente de "Otros" paquetes (Sin los de Hogar)
const otherPackagesSource = computed(() => {
   return displayPackages.value.filter(p => 
      !p.descripcion?.toLowerCase().includes('casa') && !p.nombre?.toLowerCase().includes('casa')
   )
})

const laneHome = computed(() => {
   if (searchQuery.value) return []
   return homePackagesSource.value.slice(0, 5) // Mostrar hasta 5 de Hogar
})

const lane1 = computed(() => {
   if (searchQuery.value) return []
   return otherPackagesSource.value.slice(0, 4) // Primeros 4 de "Otros"
})

const lane2 = computed(() => {
   if (searchQuery.value) return []
   return otherPackagesSource.value.slice(4, 8) // Siguientes 4 de "Otros"
})

const gridPackages = computed(() => {
   if (searchQuery.value) return displayPackages.value
   
   // El grid muestra el resto de "Otros" + el resto de "Hogar" si hubiera más de 5
   // Pero para simplificar y evitar repetir lógica compleja:
   // Excluímos los que ya se mostraron en los 3 carriles.
   
   const shownIds = new Set([
      ...laneHome.value.map(p => p.id),
      ...lane1.value.map(p => p.id),
      ...lane2.value.map(p => p.id)
   ])
   
   return displayPackages.value.filter(p => !shownIds.has(p.id))
})

const isValidPaymentForm = computed(() => {
  return selectedAccountObject.value && numeroComprobante.value?.length > 3
})

// --- Methods ---

const formatNumber = (val) => new Intl.NumberFormat('es-HN', { minimumFractionDigits: 2 }).format(val || 0)

const getOptimizedImage = (url, w, h) => {
  if (!url) return null
  if (url.includes('cloudinary')) {
    const parts = url.split('/upload/')
    return `${parts[0]}/upload/c_fill,w_${w},h_${h},f_auto,q_auto/${parts[1]}`
  }
  return url
}
const handleImageError = (id) => {} 

const openPackageDetail = (p) => {
  selectedDetailPackage.value = p
  document.body.style.overflow = 'hidden'
}

const closeDetail = () => {
  selectedDetailPackage.value = null
  document.body.style.overflow = ''
}

const verDatosCuenta = (acc) => {
   viewingAccount.value = acc
   showAccountDetailModal.value = true
}

// Transaction Triggers
const initiatePurchase = async (p) => {
   if (userCredit.value < p.costo) {
      selectedPaquete.value = p
      selectedAccountObject.value = null
      numeroComprobante.value = ''
      await cargarCuentas()
      showPaquetePagoModal.value = true
   } else {
      selectedPaquete.value = p
      showConfirmarCanjeoModal.value = true
   }
}

const initiateUse = (p) => {
   selectedPaquete.value = p
   showConfirmarUsoModal.value = true
}

// --- Logic Reused ---

const fetchUserCredit = async () => {
  try {
    const user = userCookie.value
    if (!user) return
    const res = await $api(`/credito/usuario/${user.id_usuario}`, { baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` }})
    if (res?.success) userCredit.value = res.data.monto_credito
  } catch(e) {}
}

const cargarPaquetes = async () => {
  cargandoPaquetes.value = true
  try {
    const res = await $api('/paquetes/activos', { baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` }, params: { id_ciudad: userCookie.value?.id_ciudad, id_usuario: userCookie.value?.id_usuario } })
    paquetesMantenimiento.value = res.map(p => ({
      id: p.id_paquete,
      nombre: p.nombre,
      descripcion: p.descripcion,
      costo: parseFloat(p.costo),
      estado: p.estado,
      imagen: p.imagen_url
    }))
  } finally { cargandoPaquetes.value = false }
}

const cargarPaquetesUsuario = async () => {
   try {
      const res = await $api(`/paquetes/usuarios/${userCookie.value.id_usuario}`, { baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` } })
      if(res.success) paquetesUsuario.value = res.data
   } catch(e) {}
}

const cargarCuentas = async () => {
   isLoadingAccounts.value = true
   try {
      const res = await $api('/cuentas', { baseURL: config.public.apiBase })
      if(Array.isArray(res)) bankAccounts.value = res
   } finally { isLoadingAccounts.value = false }
}

const tienePaquete = (id) => paquetesUsuario.value.some(p => p.id_paquete === id && (p.estado === 'activo' || p.estado === 'utilizando'))

const getEstadoPaquete = (id) => {
   const ps = paquetesUsuario.value.filter(p => p.id_paquete === id)
   if (!ps.length) return ''
   if (ps.some(p => p.estado === 'verificando_pago')) return 'Verificando'
   if (ps.some(p => p.estado === 'activo')) return 'Adquirido'
   if (ps.some(p => p.estado === 'utilizando')) return 'En uso'
   return ''
}

// --- Actions (Confirmations) ---

const confirmarCanjeo = async () => {
   try {
      isProcessingPayment.value = true
      const p = selectedPaquete.value
      await $api('/credito', { method: 'POST', baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` }, body: { id_usuario: userCookie.value.id_usuario, monto_credito: -Math.abs(p.costo) } })
      const res = await $api('/paquetes/usuarios/canjear', { method: 'POST', baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` }, body: { id_paquete: p.id, id_usuario: userCookie.value.id_usuario } })
      
      if(res.success) {
         showToast('Canjeado con éxito', 'success')
         userCredit.value -= p.costo
         await cargarPaquetesUsuario()
         showConfirmarCanjeoModal.value = false
         closeDetail()
      }
   } catch(e) {
      showToast('Error al canjear', 'error')
   } finally { isProcessingPayment.value = false }
}

const procesarPagoPaquete = async () => {
   try {
      isProcessingPayment.value = true
      const res = await $api('/paquetes/usuarios/canjear', {
         method: 'POST', baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` },
         body: {
            id_paquete: selectedPaquete.value.id,
            id_usuario: userCookie.value.id_usuario,
            esPagoTransferencia: true,
            id_cuenta: selectedAccountObject.value.id_cuenta,
            numero_comprobante: numeroComprobante.value
         }
      })
      if(res.success) {
         closePaquetePagoModal()
         showToast('Pago enviado', 'success')
         await cargarPaquetesUsuario()
         const idPaqueteUsuario = res.data?.paquete?.id_paquete_usuario
         sendWA(selectedPaquete.value, numeroComprobante.value, 'pay', idPaqueteUsuario)
         closeDetail()
      }
   } catch(e) {
      showToast('Error', 'error')
   } finally { isProcessingPayment.value = false }
}

const usarPaquete = async (p) => {
   try {
      isProcessingPayment.value = true
      const pu = paquetesUsuario.value.find(pup => pup.id_paquete === p.id && pup.estado === 'activo')
      if(!pu) throw new Error('Error')
      
      const res = await $api(`/paquetes/usuarios/${pu.id_paquete_usuario}/activar`, { method: 'PUT', baseURL: config.public.apiBase, headers: { 'Authorization': `Bearer ${auth.token}` } })
      
      if(res.success) {
         showToast('Paquete Activado', 'success')
         await cargarPaquetesUsuario()
         showConfirmarUsoModal.value = false
         sendWA(p, pu.id_paquete_usuario, 'use')
         closeDetail()
      }
   } catch(e) { showToast('Error', 'error') }
   finally { isProcessingPayment.value = false }
}

const sendWA = async (p, ref, type, extraId = null) => {
   try {
      const res = await $api('/config/valor/numero_empresa', { baseURL: config.public.apiBase })
      const phone = res?.valor || '12345678'
      
      const today = new Date();
      const formattedDate = [
        String(today.getDate()).padStart(2, '0'),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getFullYear()).slice(-2)
      ].join('');

      let msg = '';
      if (type === 'pay') {
         const idPaquete = extraId || 'PENDIENTE'
         msg = `*Comprobante de Pago de Paquete*\n\n*ID:* ${formattedDate}-${idPaquete}\n*Paquete:* ${p.nombre}\n*N° de comprobante:* ${ref}\n*Monto:* L. ${formatNumber(p.costo)}\n\nAdjunto una captura del comprobante de pago para su verificación.`
      } else {
         msg = `*Solicitud de Uso de Paquete*\n\nHola, deseo solicitar el uso de un paquete adquirido a través de la plataforma MiSeguro.\n\n*ID:* ${formattedDate}-${ref}\n*Paquete:* ${p.nombre}\nQuedo atento(a) a la coordinación correspondiente.`
      }

      window.open(`https://wa.me/504${phone}?text=${encodeURIComponent(msg)}`, '_blank')
   } catch(e){}
}

const showToast = (m, t='success') => { toast.value = { show: true, message: m, type: t }; setTimeout(()=>toast.value.show=false, 3000) }
const closePaquetePagoModal = () => showPaquetePagoModal.value = false
const copyToClipboard = (t) => { navigator.clipboard.writeText(t); showToast('Copiado', 'success') }

onMounted(async () => {
   await Promise.all([fetchUserCredit(), cargarPaquetes(), cargarPaquetesUsuario()])
   isLoading.value = false
})
</script>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom); }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slide-up-spring {
   0% { transform: translateY(100%); }
   100% { transform: translateY(0); }
}
.animate-slide-up-spring { animation: slide-up-spring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards; }

@keyframes pop-in {
   0% { transform: scale(0.9); opacity: 0; }
   100% { transform: scale(1); opacity: 1; }
}
.animate-pop-in { animation: pop-in 0.2s ease-out forwards; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
