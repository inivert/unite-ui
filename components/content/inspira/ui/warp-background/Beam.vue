<template>
  <Motion
    :style="{
      '--x': `${props.x}`,
      '--width': `${props.width}`,
      '--aspect-ratio': `${aspectRatio}`,
      '--background': `linear-gradient(hsl(${hueValue} 80% 60%), transparent)`,
    }"
    class="absolute left-[var(--x)] top-0 [aspect-ratio:1/var(--aspect-ratio)] [background:var(--background)] [width:var(--width)]"
    :initial="{
      x: '-50%',
      y: '100cqmax',
    }"
    :animate="{
      x: '-50%',
      y: '-100%',
    }"
    :transition="{
      duration: props.duration,
      delay: props.delay,
      repeat: Infinity,
      ease: 'linear',
    }"
  ></Motion>
</template>

<script lang="ts" setup>
import { Motion } from "motion-v";

interface Props {
  width: string | number;
  x: string | number;
  delay: number;
  duration: number;
  seed?: string; // Optional seed for deterministic values
}
const props = defineProps<Props>();

// Extract a numeric value from the x position for deterministic calculations
const xValue = computed(() => {
  const xStr = String(props.x);
  const numericValue = parseFloat(xStr);
  return isNaN(numericValue) ? 0 : numericValue;
});

// Generate a deterministic hue based on the x position
const hueValue = computed(() => {
  // Use the x value to generate a deterministic hue (0-359)
  return Math.abs(Math.round(xValue.value * 17) % 360);
});

// Generate a deterministic aspect ratio based on the x position
const aspectRatio = computed(() => {
  // Use the x value to generate a deterministic aspect ratio (1-10)
  return Math.abs(Math.round(xValue.value * 13) % 10) + 1;
});
</script>

<style></style>
