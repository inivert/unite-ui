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
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "unite-ui: Build beautiful websites using Vue & Nuxt",
      meta: [
        {
          name: "description",
          content:
            "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
        },
        { name: "format-detection", content: "telephone=no" },
        { name: "theme-color", content: "#000000" },

        // Open Graph / Facebook
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "unite-ui" },

        // Twitter
        { name: "twitter:site", content: "@cmejia_dev" },
        { name: "twitter:creator", content: "@cmejia_dev" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
      ],
      style: [
        {
          children: `
            /* Minimalistic header styling with subtle glass effect */
            header, 
            .shadcn-docs-header, 
            .docs-header,
            #__nuxt header {
              /* Subtle transparency */
              background-color: rgba(255, 255, 255, 0.8) !important;
              /* Light blur effect */
              backdrop-filter: blur(5px) !important;
              /* Very subtle shadow */
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03) !important;
              border-bottom: none !important;
            }
            
            /* Dark mode styles */
            .dark header,
            .dark .shadcn-docs-header,
            .dark .docs-header,
            .dark #__nuxt header {
              background-color: rgba(9, 9, 11, 0.8) !important;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
            }
          `,
        },
      ],
    },
  },

  css: ["~/assets/css/code-theme.css", "~/assets/css/tailwind.css"],

  extends: ["shadcn-docs-nuxt"],
  compatibilityDate: "2024-07-06",
});
