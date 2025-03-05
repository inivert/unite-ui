<template>
  <Teleport
    :to="to"
    :disabled="!to"
  >
    <component
      :is="asChild ? 'template' : 'div'"
      v-bind="$attrs"
    >
      <slot />
    </component>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * ViewportPosition Component
 *
 * Part of unite-ui, inspired by Inspira UI
 * @see https://unite-ui.com/
 */
defineProps<{
  to?: string;
  asChild?: boolean;
}>();
</script>
