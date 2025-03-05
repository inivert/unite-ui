<template>
  <div class="flex h-96 w-full items-center justify-center">
    <LiquidLogo :image-url="imageUrl" />
  </div>
</template>

<script lang="ts" setup>
import LiquidLogo from "../../ui/liquid-logo/LiquidLogo.vue";

const imageUrl = "/images/apple-logo.svg";
</script>
