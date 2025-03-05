<template>
  <UnitePatternBackground
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.TopRight"
    :variant="PATTERN_BACKGROUND_VARIANT.Dot"
    class="flex h-96 w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border"
    :speed="PATTERN_BACKGROUND_SPEED.Slow"
  >
    <div class="relative z-20 text-3xl font-bold">Dot Pattern</div>
    <div class="relative z-20 text-sm text-muted-foreground">A dot pattern with animation</div>
  </UnitePatternBackground>
</template>

<script setup lang="ts">
import {
  PATTERN_BACKGROUND_DIRECTION,
  PATTERN_BACKGROUND_SPEED,
  PATTERN_BACKGROUND_VARIANT,
  UnitePatternBackground,
} from "../../ui/pattern-background";
</script>
