<template>
  <UnitePatternBackground
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.TopRight"
    :variant="PATTERN_BACKGROUND_VARIANT.Grid"
    class="flex h-96 w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border"
    :speed="PATTERN_BACKGROUND_SPEED.Slow"
  >
    <div class="relative z-20 text-3xl font-bold">Grid Pattern</div>
    <div class="relative z-20 text-sm text-muted-foreground">A grid pattern with animation</div>
  </UnitePatternBackground>
</template>

<script setup lang="ts">
import {
  PATTERN_BACKGROUND_DIRECTION,
  PATTERN_BACKGROUND_SPEED,
  PATTERN_BACKGROUND_VARIANT,
  UnitePatternBackground,
} from "~/components/content/inspira/ui/pattern-background";
</script>
