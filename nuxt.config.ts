// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  plugins: [
    // Removed empty plugin: "~/plugins/register-components.ts",
    "~/plugins/override-components.ts",
    "~/plugins/component-cache.client.ts",
  ],

  modules: [
    "@nuxt/image",
    "@nuxt/content",
    "nuxt-gtag",
    "@nuxt/eslint",
    "@nuxt/scripts",
    "motion-v/nuxt",
    "@nuxt/devtools",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
  ],

  // Content module configuration
  content: {
    documentDriven: true,
    navigation: {
      fields: ["title", "description", "icon"],
    },
    experimental: {
      clientDB: true, // Enable client DB for better performance
      cacheContents: true, // Enable content caching
    },
    watch: {
      ws: {
        hostname: "localhost",
        port: 4000,
      },
    },
  },

  // Vite configuration - enable HMR for better development experience
  vite: {
    server: {
      hmr: true,
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },

  // Fix 503 errors by removing caching and increasing timeouts
  nitro: {
    // Enable timing information
    timing: true,
    future: {
      nativeSWR: true, // Use native stale-while-revalidate
    },
    experimental: {
      asyncContext: true, // Enable async context
    },
    routeRules: {
      "/api/_content/**": {
        cache: {
          maxAge: 60 * 60, // Cache for 1 hour
        },
      },
      "/**": {
        cors: true, // Enable CORS for all routes
        headers: {
          "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    },
  },

  // Comment out the invalid router options
  // router: {
  //   options: {
  //     prefetchLinks: false,
  //   },
  // },

  components: {
    dirs: [
      // Add our custom components directory with higher priority
      {
        path: "~/components/content/custom",
        prefix: "",
        pathPrefix: false,
        priority: 0, // Highest priority (lower number = higher priority)
        global: true,
      },
      {
        path: "~/components/content/unite-originals/ui",
        prefix: "UniteOriginals",
        pathPrefix: false,
        priority: 1,
        global: true,
      },
      {
        path: "~/components/content/inspira/ui",
        prefix: "Inspira",
        pathPrefix: false,
        priority: 1,
        global: true,
      },
      {
        path: "~/components/content/common",
        prefix: "",
        pathPrefix: false,
        priority: 2,
        global: true,
      },
      {
        path: "~/components/global",
        prefix: "",
        pathPrefix: false,
        priority: 3,
        global: true,
      },
    ],
  },

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
