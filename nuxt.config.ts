import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@vueuse/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Urbanist: [400, 500, 600, 700, 800, 900],
      'Plus Jakarta Sans': [400, 500, 600, 700, 800],
    },
    display: 'swap',
    preload: true,
  },
  vite: {
    plugins: [tailwindcss()]
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: parseInt(process.env.DB_PORT || '3306'),
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'my_anime_media',
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    malClientId: process.env.MAL_CLIENT_ID || '21c4dff4d31658c01772b0d00eedee36',
    malClientSecret: process.env.MAL_CLIENT_SECRET || '',
    public: {
      malClientId: process.env.MAL_CLIENT_ID || '21c4dff4d31658c01772b0d00eedee36',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    }
  },
  nitro: {
    experimental: {
      wasm: false
    }
  }
})
