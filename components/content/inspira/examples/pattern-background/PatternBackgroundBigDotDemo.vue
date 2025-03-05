<template>
  <UnitePatternBackground
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.Bottom"
    :variant="PATTERN_BACKGROUND_VARIANT.BigDot"
    class="flex h-96 w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border"
    :speed="PATTERN_BACKGROUND_SPEED.Slow"
    :mask="PATTERN_BACKGROUND_MASK.EllipseTop"
  >
    <div class="relative z-20 text-3xl font-bold">Big Dot Pattern</div>
    <div class="relative z-20 text-sm text-muted-foreground">
      A big dot pattern with animation and mask
    </div>
  </UnitePatternBackground>
</template>

<script setup lang="ts">
import {
  PATTERN_BACKGROUND_DIRECTION,
  PATTERN_BACKGROUND_MASK,
  PATTERN_BACKGROUND_SPEED,
  PATTERN_BACKGROUND_VARIANT,
  UnitePatternBackground,
} from "../../ui/pattern-background";
</script>
