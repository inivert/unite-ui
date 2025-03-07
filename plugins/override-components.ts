import { defineNuxtPlugin } from "#app";
import CustomCodeSnippet from "~/components/content/custom/CodeSnippet.vue";

export default defineNuxtPlugin((nuxtApp) => {
  // Override the shadcn-docs-nuxt CodeSnippet component with our custom one
  nuxtApp.vueApp.component("CodeSnippet", CustomCodeSnippet);
});
