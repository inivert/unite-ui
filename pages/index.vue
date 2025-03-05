<template>
  <NuxtLayout>
    <template #header>
      <LayoutHeader />
    </template>
    <div class="flex flex-col items-center justify-center px-4 py-6 font-heading md:px-8">
      <HeroSection />
      <div class="mb-16 flex w-full flex-col items-center">
        <a
          href="https://github.com/sponsors/inivert"
          target="_blank"
        >
          <UiButton
            variant="secondary"
            class="gap-2 py-6 text-base"
          >
            Become a Sponsor <span class="text-red-500">♥️</span>
          </UiButton>
        </a>
      </div>

      <FeatureSection />
      <HomePageExamples />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useConfig();

useSeoMeta({
  title: `unite-ui: Build beautiful websites using Vue & Nuxt`,
  ogTitle: `unite-ui: Build beautiful websites using Vue & Nuxt`,
  description:
    "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
  ogDescription:
    "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
  ogImage: config.value.site.ogImage,
  twitterCard: "summary_large_image",
});
</script>
