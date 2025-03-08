<template>
  <div
    class="flex flex-col items-center justify-center bg-transparent px-4 py-6 font-heading md:px-8 relative z-10"
  >
    <!-- Page-level loading state -->
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500"
    >
      <div class="flex flex-col items-center space-y-4">
        <div class="size-16 animate-spin rounded-full border-y-2 border-white"></div>
        <p class="text-lg text-white">Loading Unite UI...</p>
      </div>
    </div>

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
          <CachedComponent
            cache-key="home-liquid-logo"
            :cacheable="true"
          >
            <ClientOnly>
              <Suspense>
                <LiquidLogo
                  :image-url="isDark ? '/nuxt-logo.svg' : '/nuxt-logo.svg'"
                  :pattern-scale="1.5"
                  :liquid="0.1"
                  :speed="0.3"
                  :refraction="0.02"
                  :edge="0.4"
                  @loaded="handleLogoLoaded"
                />
                <template #fallback>
                  <div
                    class="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-900/20"
                  >
                    <div class="flex flex-col items-center space-y-4">
                      <NuxtImg
                        src="/nuxt-logo.svg"
                        class="size-24 opacity-50"
                        alt="Nuxt Logo"
                      />
                      <div class="h-2 w-24 animate-pulse rounded-full bg-gray-700"></div>
                    </div>
                  </div>
                </template>
              </Suspense>
            </ClientOnly>
            <template #fallback>
              <div
                class="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-900/20"
              >
                <div class="flex flex-col items-center space-y-4">
                  <NuxtImg
                    src="/nuxt-logo.svg"
                    class="size-24 opacity-50"
                    alt="Nuxt Logo"
                  />
                  <div class="h-2 w-24 animate-pulse rounded-full bg-gray-700"></div>
                </div>
              </div>
            </template>
          </CachedComponent>
        </div>
      </div>
    </div>
    <div class="mb-16 flex w-full flex-col items-center relative z-20">
      <a
        href="https://x.com/cmejia_dev"
        target="_blank"
        class="relative z-50"
      >
        <UiButton
          class="gap-2 py-6 text-base relative z-50"
          variant="secondary"
        >
          Become a hater <span class="text-red-500">♥️</span>
        </UiButton>
      </a>
    </div>

    <!-- Matter Card with Stellar Background Section -->
    <div class="my-16 w-full max-w-7xl">
      <CachedComponent
        cache-key="home-warp-background"
        :cacheable="true"
      >
        <LazyWarpBackground
          class="rounded-xl border-none p-0 md:p-12"
          :perspective="170"
          :beam-size="2"
          :beams-per-side="5"
          :beam-delay-max="5"
          :beam-duration="4"
          grid-color="rgba(255, 255, 255, 0.1)"
        >
          <div class="flex flex-col items-center justify-center py-12 text-center relative z-50">
            <h2
              class="mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-4xl font-bold text-transparent"
            >
              Experience the Matter Card
            </h2>
            <p class="mb-12 max-w-2xl text-gray-400">
              Hover over the card below to see the liquid effect in action. Our components bring
              your UI to life with subtle, engaging animations.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-8">
              <!-- Using the fixed version of the Liquidcard component with strict isolation -->
              <div
                class="card-container relative isolate h-[400px] w-[320px] overflow-visible rounded-lg"
              >
                <CachedComponent
                  cache-key="home-liquid-card"
                  :cacheable="true"
                >
                  <ClientOnly>
                    <Suspense>
                      <FixedLiquidcard class="flex flex-col items-center justify-center px-4 py-8">
                        <NuxtImg
                          src="/logo-dark.svg"
                          class="size-16"
                        />

                        <p
                          class="mt-4 text-xl font-bold"
                          style="color: white !important"
                        >
                          Hover me
                        </p>
                      </FixedLiquidcard>
                      <template #fallback>
                        <div
                          class="flex h-[400px] w-[320px] flex-col items-center justify-center rounded-lg bg-gray-900/30 px-4 py-8"
                        >
                          <div class="flex flex-col items-center space-y-4">
                            <NuxtImg
                              src="/logo-dark.svg"
                              class="size-16"
                            />
                            <p class="mt-4 text-xl font-bold text-white">Loading...</p>
                            <div class="h-2 w-24 animate-pulse rounded-full bg-gray-700"></div>
                          </div>
                        </div>
                      </template>
                    </Suspense>
                  </ClientOnly>
                  <template #fallback>
                    <div
                      class="flex h-[400px] w-[320px] flex-col items-center justify-center rounded-lg bg-gray-900/30 px-4 py-8"
                    >
                      <div class="flex flex-col items-center space-y-4">
                        <NuxtImg
                          src="/logo-dark.svg"
                          class="size-16"
                        />
                        <p class="mt-4 text-xl font-bold text-white">Loading...</p>
                        <div class="h-2 w-24 animate-pulse rounded-full bg-gray-700"></div>
                      </div>
                    </div>
                  </template>
                </CachedComponent>
              </div>
            </div>
          </div>
        </LazyWarpBackground>
        <template #fallback>
          <div
            class="flex min-h-[400px] w-full items-center justify-center rounded-xl border border-gray-800 bg-gray-900/30"
          >
            <div class="flex flex-col items-center space-y-4">
              <div class="size-12 animate-spin rounded-full border-y-2 border-white"></div>
              <p class="text-lg text-white">Loading background...</p>
            </div>
          </div>
        </template>
      </CachedComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from "~/composables/useSeo";
import { useSchemaOrg } from "~/composables/useSchemaOrg";
import { useComponentCache } from "~/composables/useComponentCache";
import WarpBackground from "~/components/content/inspira/ui/warp-background/WarpBackground.vue";
import FixedLiquidcard from "~/components/content/common/FixedLiquidcard.vue";

const config = useConfig();
const isDark = computed(() => useColorMode().value === "dark");
const isLoading = ref(true);
const componentsLoaded = ref({
  logo: false,
  hero: false,
  card: false,
});

// Check if we have cached components
const { isComponentLoaded } = useComponentCache();
const hasCachedComponents = computed(() => {
  if (import.meta.server) return false;
  return (
    isComponentLoaded("home-liquid-logo") ||
    isComponentLoaded("home-warp-background") ||
    isComponentLoaded("home-liquid-card")
  );
});

// Set body background to ensure the starry background shows through
onMounted(() => {
  document.body.classList.add("bg-black");

  // If we have cached components, reduce loading time
  if (hasCachedComponents.value) {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  } else {
    // Add a minimum loading time to prevent flickering
    setTimeout(() => {
      if (componentsLoaded.value.logo) {
        isLoading.value = false;
      } else {
        // Force hide loading after 3 seconds even if components aren't ready
        setTimeout(() => {
          isLoading.value = false;
        }, 2000);
      }
    }, 1000);
  }
});

function handleLogoLoaded() {
  componentsLoaded.value.logo = true;
  checkAllComponentsLoaded();
}

function checkAllComponentsLoaded() {
  if (componentsLoaded.value.logo) {
    isLoading.value = false;
  }
}

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

<style scoped>
/* Add isolation to prevent event bubbling */
.card-container {
  contain: layout style;
  z-index: 1;
  transform-style: preserve-3d;
  perspective: 1200px;
  pointer-events: auto;
}

/* Add fade-in animation for content */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Ensure all buttons and links are clickable */
a,
button,
.UiButton,
[role="button"] {
  position: relative;
  z-index: 50 !important;
  pointer-events: auto !important;
}
</style>
