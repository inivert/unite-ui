// This plugin registers components globally
import { defineNuxtPlugin } from "#app";
import UniteOriginalsBlockList from "~/components/global/UniteOriginalsBlockList.vue";
import ComingSoon from "~/components/global/ComingSoon.vue";

export default defineNuxtPlugin((nuxtApp) => {
  // Register the UniteOriginalsBlockList component globally
  nuxtApp.vueApp.component("UniteOriginalsBlockList", UniteOriginalsBlockList);
  nuxtApp.vueApp.component("ComingSoon", ComingSoon);
});
