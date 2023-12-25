// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', 'nuxt-primevue', '@nuxt/test-utils/module'],
  css: ['primevue/resources/themes/lara-light-green/theme.css'],
  ssr: false,
  runtimeConfig: {
    public: {
      BASE_URL: 'https://staging.mazaady.com/api/v1/',
    },
  }
})
