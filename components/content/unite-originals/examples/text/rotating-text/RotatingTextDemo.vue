<template>
  <div
    class="flex h-64 w-full items-center justify-center rounded-xl bg-gray-50 p-6 dark:bg-gray-900"
  >
    <div class="text-center text-xl text-gray-800 dark:text-white">
      <span class="mr-2">This component creates</span>
      <RotatingText
        :texts="['smooth', 'animated', 'beautiful', 'simple', 'low-code']"
        :rotation-interval="2500"
        main-class-name="px-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-visible py-1 justify-center rounded-md inline-flex"
        stagger-from="last"
        :stagger-duration="0.02"
        split-level-class-name="overflow-visible"
        element-level-class-name="font-medium"
        :transition="{ type: 'spring', damping: 30, stiffness: 400, duration: 0.4 }"
      />
      <span class="ml-2">text animations.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import RotatingText from "~/components/content/unite-originals/ui/rotating-text/RotatingText.vue";
</script>
