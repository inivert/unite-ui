<template>
  <div class="unite-originals-block-list">
    <div class="my-8 flex flex-col gap-4">
      <div
        class="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900"
      >
        <h3 class="mb-2 text-xl font-bold">Unite Originals Fullstacks</h3>
        <p class="mb-4 text-gray-600 dark:text-gray-400">
          Our collection of fullstack components is coming soon. These components will help you
          build complete page layouts quickly and easily.
        </p>
        <div class="flex flex-wrap gap-4">
          <!-- Placeholder cards for upcoming components -->
          <div
            v-for="i in 3"
            :key="i"
            class="w-full rounded-md border border-gray-200 bg-white p-4 md:w-[calc(33%-1rem)] dark:border-gray-800 dark:bg-gray-800"
          >
            <div class="mb-3 h-32 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div class="mb-2 h-6 w-2/3 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div class="h-4 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This is a global component that will be automatically registered by Nuxt
</script>
