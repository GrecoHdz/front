// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  
  app: {
    head: {
      title: 'TecniServ - Servicios Técnicos a Domicilio',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=0.7, user-scalable=no' },
        { name: 'description', content: 'Servicios técnicos profesionales a domicilio. Fontanería, electricidad, aires acondicionados y más.' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
   // Server configuration 
   devServer: {
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3000 
  },
  
  // Runtime config
  runtimeConfig: {
    public: {
      appName: 'TecniServ',
      appVersion: '1.0.0',
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:4000' //process.env.NUXT_PUBLIC_API_URL ||  
    }
  }
})