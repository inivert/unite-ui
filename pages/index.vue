<template>
  <div
    class="flex flex-col items-center justify-center bg-transparent px-4 py-6 font-heading md:px-8"
  >
    <div class="flex w-full max-w-[1200px] flex-col items-center justify-between gap-8 lg:flex-row">
      <div class="lg:w-2/3">
        <HeroSection />
      </div>
      <div
        class="relative z-10 overflow-hidden rounded-xl border border-gray-700/10 bg-transparent p-5 shadow-xl lg:w-1/3"
      >
        <!-- Very subtle backdrop blur to maintain readability while keeping transparency -->
        <div class="absolute inset-0 -z-10 bg-black/5 backdrop-blur-sm"></div>

        <div class="aspect-square w-full rounded-lg">
          <LiquidLogo
            :image-url="isDark ? '/nuxt-logo.svg' : '/nuxt-logo.svg'"
            :pattern-scale="1.5"
            :liquid="0.1"
            :speed="0.3"
            :refraction="0.02"
            :edge="0.4"
          />
        </div>
      </div>
    </div>
    <div class="mb-16 flex w-full flex-col items-center">
      <a
        href="https://x.com/cmejia_dev"
        target="_blank"
      >
        <UiButton
          class="gap-2 py-6 text-base"
          variant="secondary"
        >
          Become a hater <span class="text-red-500">♥️</span>
        </UiButton>
      </a>
    </div>

    <FeatureSection />
    <HomePageExamples />
  </div>
</template>

<script setup lang="ts">
import { useSeo } from "~/composables/useSeo";
import { useSchemaOrg } from "~/composables/useSchemaOrg";

const config = useConfig();
const isDark = computed(() => useColorMode().value === "dark");

// Set body background to ensure the starry background shows through
onMounted(() => {
  document.body.classList.add("bg-black");
});

// Use our SEO composable for consistent metadata
useSeo({
  title: "unite-ui: Build beautiful websites using Vue & Nuxt",
  description:
    "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
  type: "website",
});

// Add structured data
useSchemaOrg({
  name: "unite-ui - Vue & Nuxt UI Component Library",
  description:
    "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
});
</script>
