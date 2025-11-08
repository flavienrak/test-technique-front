import { defineNuxtPlugin } from 'nuxt/app';
import type { Pinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;
  pinia.use(piniaPersistedstate);
});
