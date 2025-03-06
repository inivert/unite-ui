<template>
  <div class="pb-37 relative flex h-96 w-full items-end justify-center">
    <BgStellar
      color="FFFF99"
      class="absolute inset-0"
      :collision-element="frameRef"
      :debug="debug"
      :quantity="40"
      :drop-size="5"
      :transparency="0.85"
    />

    <!-- Image card with frame -->
    <div
      ref="frameRef"
      class="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-white/5 shadow-xl backdrop-blur-sm"
    >
      <!-- Image container -->
      <div class="relative p-1">
        <div class="aspect-video overflow-hidden rounded-lg border border-white/30 shadow-inner">
          <!-- Half-visible image (top half only) -->
          <div class="relative size-full overflow-hidden">
            <div class="absolute inset-x-0 -top-[40%] h-[200%] w-full">
              <img
                src="/images/unite-ss.png"
                alt="Unite UI Screenshot"
                class="size-full object-cover"
              />
            </div>
            <!-- Subtle vignette overlay -->
            <div class="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]"></div>
            <!-- Bottom fade effect -->
            <div
              class="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/30 to-transparent"
            ></div>
          </div>
        </div>

        <!-- Decorative corner elements -->
        <div
          class="absolute -right-1 -top-1 size-10 rounded-tr-xl border-r-2 border-t-2 border-yellow-300/50"
        ></div>
        <div
          class="absolute -bottom-1 -left-1 size-10 rounded-bl-xl border-b-2 border-l-2 border-yellow-300/50"
        ></div>
        <div
          class="absolute -left-1 -top-1 size-10 rounded-tl-xl border-l-2 border-t-2 border-indigo-300/50"
        ></div>
        <div
          class="absolute -bottom-1 -right-1 size-10 rounded-br-xl border-b-2 border-r-2 border-indigo-300/50"
        ></div>
      </div>
    </div>

    <!-- Debug toggle button -->
    <button
      class="absolute bottom-2 right-2 z-20 rounded-full bg-gray-800/70 px-3 py-1 text-xs text-white/80 hover:bg-gray-700/70"
      @click="debug = !debug"
    >
      {{ debug ? "Hide Debug" : "Show Debug" }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const frameRef = ref(null);
const debug = ref(false); // Set to true to see collision boundaries
</script>

<style>
/* Add a button to toggle debug mode */
</style>
