<template>
  <div class="relative flex h-96 w-full items-center justify-center overflow-hidden rounded-xl">
    <!-- Container for the particles demo -->
    <div class="relative size-full">
      <!-- Particles background -->
      <Particles
        :particle-count="300"
        :particle-spread="8"
        :speed="0.05"
        :particle-colors="
          isDark
            ? ['#ffffff', '#a855f7', '#6366f1', '#ec4899']
            : ['#333333', '#a855f7', '#6366f1', '#ec4899']
        "
        :move-particles-on-hover="true"
        :particle-hover-factor="1.2"
        :alpha-particles="false"
        :particle-base-size="isDark ? 140 : 120"
        :size-randomness="0.8"
        :camera-distance="10"
        :center-shift-x="-1.6"
        class="absolute inset-0"
      />

      <!-- Overlay to improve visibility -->
      <div class="absolute inset-0 bg-white/20 dark:bg-black/50"></div>

      <!-- Content overlay -->
      <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <h3 class="mb-4 text-2xl font-bold">Interactive Particles Background</h3>
        <p class="mb-6 max-w-md text-sm">
          A customizable 3D particle system that responds to user interaction. Perfect for creating
          engaging hero sections and interactive backgrounds.
        </p>

        <!-- Controls for the demo -->
        <div class="flex flex-wrap justify-center gap-3">
          <button
            class="rounded-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
            @click="toggleDarkMode"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Particles from "~/components/content/unite-originals/ui/bg-particles/Particles.vue";
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

function toggleDarkMode() {
  colorMode.value = isDark.value ? "light" : "dark";
}
</script>
