<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex w-full justify-center pt-4">
      <LayoutHeader />
    </div>
    <div class="mt-6 flex-1">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
// Import only the Footer component
import Footer from "~/components/layout/Footer.vue";
</script>

<style>
/* Force header styling for light mode */
:root:not(.dark) header {
  background-color: white !important;
  color: black !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  border-radius: 9999px !important;
  backdrop-filter: blur(8px) !important;
}

:root:not(.dark) header * {
  color: black !important;
}

/* Force header styling for dark mode */
.dark header {
  background-color: black !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  border-radius: 9999px !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.dark header * {
  color: white !important;
}

.dark header img {
  filter: brightness(0) invert(1) !important;
}

/* Style dropdown menus */
.dark [data-radix-popper-content-wrapper] [role="menu"],
.dark [data-radix-popper-content-wrapper] [role="dialog"],
.dark [data-radix-popper-content-wrapper] .navigation-menu-content {
  background-color: rgba(30, 30, 30, 0.95) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

:root:not(.dark) [data-radix-popper-content-wrapper] [role="menu"],
:root:not(.dark) [data-radix-popper-content-wrapper] [role="dialog"],
:root:not(.dark) [data-radix-popper-content-wrapper] .navigation-menu-content {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: black !important;
}
</style>
