<template>
  <div class="flex size-full items-center justify-center py-2">
    <LiquidCard class="flex flex-col items-center justify-center py-5">
      <NuxtImg src="/logo-dark.svg" />
      <p
        class="mt-4 text-xl font-bold"
        style="color: white !important"
      >
        hover me
      </p>
    </LiquidCard>
  </div>
</template>

<script setup lang="ts">
import LiquidCard from "~/components/content/unite-originals/ui/m-cards/LiquidCard.vue";
</script>
