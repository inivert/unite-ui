<template>
  <span
    ref="highlightElement"
    :class="cn('inline-block px-1 pb-1', props.class)"
    ><slot
  /></span>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import anime from "animejs";

interface Props {
  delay?: number;
  duration?: number;
  class?: HTMLAttributes["class"];
  textEndColor?: string;
  animationType?: "fade" | "reveal" | "glow" | "underline";
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 2000,
  textEndColor: "inherit",
  animationType: "fade",
});

const highlightElement = ref<HTMLElement | null>(null);

// Function to get computed color from CSS variable if needed
const getComputedColor = (colorValue: string): string => {
  // If it's not a CSS variable reference, return as is
  if (!colorValue.includes("var(")) return colorValue;

  // For CSS variables, we need to use getComputedStyle
  const tempEl = document.createElement("div");
  tempEl.style.color = colorValue;
  document.body.appendChild(tempEl);
  const computedColor = window.getComputedStyle(tempEl).color;
  document.body.removeChild(tempEl);
  return computedColor;
};

onMounted(() => {
  if (!highlightElement.value) return;

  // Get the actual color value if it's a CSS variable
  const actualTextColor = getComputedColor(props.textEndColor);

  // Create timeline for smoother animation sequence
  const timeline = anime.timeline({
    easing: "easeOutSine",
    delay: props.delay,
  });

  // Set initial styles based on animation type
  switch (props.animationType) {
    case "fade":
      // For fade animation
      anime.set(highlightElement.value, {
        opacity: 0,
        backgroundSize: "100% 100%",
      });
      break;

    case "reveal":
      // For reveal animation
      anime.set(highlightElement.value, {
        clipPath: "inset(0 100% 0 0)",
        backgroundSize: "100% 100%",
      });
      break;

    case "glow":
      // For glow animation
      anime.set(highlightElement.value, {
        boxShadow: "0 0 0 rgba(181, 144, 255, 0)",
        backgroundSize: "100% 100%",
        opacity: 0.85,
      });
      break;

    case "underline":
      // For underline animation
      anime.set(highlightElement.value, {
        backgroundSize: "100% 0%",
        backgroundPosition: "left bottom",
      });
      break;

    default:
      anime.set(highlightElement.value, {
        opacity: 0,
        backgroundSize: "100% 100%",
      });
  }

  // Apply animation based on type
  switch (props.animationType) {
    case "fade":
      // Simple elegant fade in
      timeline.add({
        targets: highlightElement.value,
        opacity: [0, 1],
        duration: props.duration,
        easing: "easeOutCubic",
      });
      break;

    case "reveal":
      // Reveal from left to right
      timeline.add({
        targets: highlightElement.value,
        clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
        duration: props.duration,
        easing: "easeInOutQuint",
      });
      break;

    case "glow":
      // Subtle glow effect
      timeline.add({
        targets: highlightElement.value,
        boxShadow: [
          "0 0 0 rgba(181, 144, 255, 0)",
          "0 0 20px rgba(181, 144, 255, 0.6)",
          "0 0 10px rgba(181, 144, 255, 0.3)",
        ],
        opacity: [0.85, 1],
        duration: props.duration,
        easing: "easeOutExpo",
      });
      break;

    case "underline":
      // Underline animation
      timeline.add({
        targets: highlightElement.value,
        backgroundSize: ["100% 0%", "100% 100%"],
        duration: props.duration,
        easing: "easeOutQuad",
      });
      break;

    default:
      // Default fade animation
      timeline.add({
        targets: highlightElement.value,
        opacity: [0, 1],
        duration: props.duration,
      });
  }

  // Add text color change animation - only if we have a valid color
  if (actualTextColor !== "inherit") {
    timeline.add(
      {
        targets: highlightElement.value,
        color: actualTextColor,
        duration: props.duration / 2,
      },
      `-=${props.duration / 2}`,
    );
  }
});
</script>

<style scoped>
span {
  display: inline-block;
  transform-origin: center;
  will-change: opacity, transform, background-size, box-shadow, clip-path;
}
</style>
