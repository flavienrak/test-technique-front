// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    [
      '@nuxtjs/i18n',
      {
        locales: [
          { code: 'fr', language: 'fr-FR', file: 'fr.json' },
          { code: 'en', language: 'en-US', file: 'en.json' },
        ],
        defaultLocale: 'fr',
      },
    ],
    'shadcn-nuxt',
    '@nuxtjs/tailwindcss',
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_API_BASE_URL,
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
});
