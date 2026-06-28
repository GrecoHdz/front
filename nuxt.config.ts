// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/i18n'
  ],
  i18n: {
    locales: [
      {
        code: 'es',
        name: 'Español',
        file: 'es.json'
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      }
    ],

    langDir: 'locales',
    defaultLocale: 'es',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'es'
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/',
      name: 'MiSeguro',
      short_name: 'MiSeguro',
      description: 'Servicios en la palma de tu mano.',
      theme_color: '#2563eb',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    includeAssets: ['favicon.ico', 'pwa-192x192.png', 'pwa-512x512.png'],
    workbox: {
      navigateFallback: '/',
      importScripts: ['/sw-push.js'],
      globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,svg,json,woff2,woff}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  site: {
    url: 'https://miseguro.vercel.app'
  },
  sitemap: {
    urls: [
      '/',
    ]
  },
  // Configuración de impresión
  app: {
    head: {
      title: 'MiSeguro - Servicios en la palma de tu mano',
      meta: [
        { name: 'google-site-verification', content: 'GEPuBsyW3v_JTl_akiNBfF4DILNI3EVLggqEsYawrNM' },
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Servicios en la palma de tu mano.' },
        { name: 'theme-color', content: '#2563eb' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        // Open Graph
        { property: 'og:title', content: 'MiSeguro - Servicios en la palma de tu mano.' },
        { property: 'og:description', content: 'Servicios en la palma de tu mano.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://miseguro.vercel.app/' },
        { property: 'og:image', content: 'https://miseguro.vercel.app/favicon.ico' },
        { property: 'og:site_name', content: 'MiSeguro' },
      ],

      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
      ],
      script: [
        {
          innerHTML: `!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1564351111444799');
          fbq('track', 'PageView');`,
          type: 'text/javascript'
        }
      ],
      noscript: [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1564351111444799&ev=PageView&noscript=1" />`
        }
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
      appName: 'MiSeguro',
      appVersion: '1.6.6',
      apiBase: process.env.NUXT_PUBLIC_API_URL
    }
  }
})