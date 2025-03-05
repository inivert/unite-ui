<template>
  <Root
    v-bind="forwardedProps"
    :class="cn('relative z-10 flex max-w-max flex-1 items-center justify-center', props.class)"
  >
    <slot />
    <ViewportPosition
      v-if="shouldUpdatePosition"
      :to="to"
      :as-child="asChild"
    />
  </Root>
</template>

<script setup lang="ts">
/**
 * NavigationMenu Component
 *
 * Part of unite-ui, inspired by Inspira UI
 * @see https://unite-ui.com/
 */
import type { NavigationMenuProps } from "radix-vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { NavigationMenuRoot, useForwardProps } from "radix-vue";
import { computed, ref, watch } from "vue";
import ViewportPosition from "./ViewportPosition.vue";

// Rename for template usage
const Root = NavigationMenuRoot;

const props = withDefaults(
  defineProps<
    NavigationMenuProps & {
      class?: HTMLAttributes["class"];
      to?: string;
      asChild?: boolean;
    }
  >(),
  {
    asChild: false,
  },
);

const shouldUpdatePosition = ref(false);

watch(
  () => props.to,
  (to) => {
    shouldUpdatePosition.value = !!to;
  },
  { immediate: true },
);

const delegatedProps = computed(() => {
  const { class: _, to: __, asChild: ___, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>
