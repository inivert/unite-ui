// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [],

  modules: [
    "@nuxt/image",
    "nuxt-gtag",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "motion-v/nuxt",
    "@nuxt/devtools",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
  ],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    public: {},
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  colorMode: {
    classSuffix: "",
  },

  app: {
    head: {
      meta: [],
      style: [
        {
          children: `
            :root:not(.dark) header {
              background-color: white !important;
              color: black !important;
              border: 1px solid rgba(0, 0, 0, 0.2) !important;
              border-radius: 9999px !important;
            }
            :root:not(.dark) header * { color: black !important; }
            
            .dark header {
              background-color: black !important;
              color: white !important;
              border: 1px solid rgba(255, 255, 255, 0.4) !important;
              border-radius: 9999px !important;
            }
            .dark header * { color: white !important; }
            .dark header img { filter: brightness(0) invert(1) !important; }

            /* Light mode styles */
            :root:not(.dark) header {
              background-color: white !important;
              color: black !important;
              border: 1px solid rgba(0, 0, 0, 0.2) !important;
            }
            
            /* Dark mode styles - direct inverse of light mode */
            .dark header {
              background-color: black !important;
              color: white !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
            }
            
            /* Dropdown menu fixes */
            .dark [data-radix-popper-content-wrapper] {
              background-color: rgba(30, 30, 30, 0.95) !important;
              border-color: rgba(255, 255, 255, 0.1) !important;
            }
            
            :root:not(.dark) [data-radix-popper-content-wrapper] {
              background-color: rgba(255, 255, 255, 0.95) !important;
              border-color: rgba(0, 0, 0, 0.1) !important;
            }
          `,
        },
      ],
    },
  },

  css: ["~/assets/css/global.css", "~/assets/css/custom.css", "~/assets/css/dropdown-fix.css"],

  extends: ["shadcn-docs-nuxt"],
  compatibilityDate: "2024-07-06",
});
