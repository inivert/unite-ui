<template>
  <div>
    <NuxtLink
      v-if="logo.light && logo.dark"
      to="/"
      class="flex"
      :style="isDark ? 'color: white' : 'color: black'"
    >
      <img
        :src="isDark ? logo.dark : logo.light"
        class="h-7"
        alt="unite-ui logo"
        :style="isDark ? 'filter: brightness(0) invert(1)' : ''"
      />
      <span
        v-if="showTitle && title"
        class="ml-3 self-center font-bold"
        :style="isDark ? 'color: white' : 'color: black'"
      >
        {{ title }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { logo, title, showTitle } = useConfig().value.header;
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<style scoped>
/* Styles are now handled with dynamic binding */
</style>
