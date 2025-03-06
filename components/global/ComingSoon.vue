<template>
  <div
    class="coming-soon-banner my-6 border-l-4 border-blue-500 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-950"
  >
    <div class="flex items-center">
      <div class="shrink-0">
        <svg
          class="size-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-blue-800 dark:text-blue-300">Coming Soon</h3>
        <div class="mt-2 text-sm text-blue-700 dark:text-blue-400">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This is a global component for the Coming soon directive
</script>
