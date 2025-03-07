import { defineNuxtPlugin } from "#app";

// This plugin is now just a placeholder
// We're using component directory priority in nuxt.config.ts to handle component overrides
export default defineNuxtPlugin({
  name: "override-components",
  setup() {
    // No need to do anything here anymore
    // The components in ~/components/content/custom will take precedence
    // over components with the same name from other directories or modules
  },
});
