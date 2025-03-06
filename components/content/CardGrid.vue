<template>
  <div :class="['grid', $attrs.class || 'grid-cols-1 gap-4 md:grid-cols-2']">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>
