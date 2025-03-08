<template>
  <div
    ref="refElement"
    class="container-style duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] container relative isolate w-[320px] transition-all will-change-transform [aspect-ratio:17/21] [contain:layout_style]"
    :class="{
      'theme-light': theme === 'light',
      'theme-dark': theme === 'dark',
      'card-hovered': isCardHovered,
    }"
    :style="{
      '--position-x': `${state.position.x}`,
      '--position-y': `${state.position.y}`,
      '--bg-x': `${state.background.x}%`,
      '--bg-y': `${state.background.y}%`,
    }"
    @pointermove="handlePointerMove"
  >
    <div
      class="card-wrapper relative transition-all duration-500"
      style="transform-style: preserve-3d"
    >
      <!-- Stacked sheets that appear on hover -->
      <div
        class="sheet-stack absolute inset-0"
        style="transform-style: preserve-3d"
      >
        <div class="sheet sheet-4"></div>
        <div class="sheet sheet-3"></div>
        <div class="sheet sheet-2"></div>
        <div class="sheet sheet-1"></div>
      </div>

      <!-- Main card -->
      <div
        class="main-card duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] relative grid h-full origin-center overflow-hidden rounded-lg border transition-all will-change-transform hover:shadow-lg hover:filter-none hover:[--border-opacity:0.8] hover:[--duration:200ms] hover:[--easing:linear]"
        style="transform-style: preserve-3d"
        @pointerenter="handleCardEnter"
        @pointerleave="handleCardLeave"
      >
        <div
          class="grid size-full mix-blend-soft-light [clip-path:inset(0_0_0_0_round_var(--radius))] [grid-area:1/1]"
        >
          <div :class="cn('size-full card-bg', props.class)">
            <slot />
          </div>
        </div>
        <!-- Border glow animation layer -->
        <div
          class="border-glow-style duration-[var(--duration)] ease-[var(--easing)] delay-[var(--delay)] absolute inset-0 rounded-lg opacity-[var(--border-opacity)] transition-opacity"
        />
        <!-- Color shift layer -->
        <div
          class="color-shift-style will-change-background relative grid size-full opacity-[var(--color-opacity)] mix-blend-color-dodge transition-opacity [clip-path:inset(0_0_1px_0_round_var(--radius))] [grid-area:1/1]"
        />
        <!-- Reflection layer -->
        <div
          class="reflection-layer absolute inset-0 overflow-hidden rounded-lg [clip-path:inset(0_0_0_0_round_var(--radius))]"
          :class="{
            'reflection-enter': isPointerInside && !isFullyExtended,
            'reflection-leave': !isPointerInside && wasPointerInside,
            'reflection-fade': isFullyExtended,
          }"
        ></div>
        <!-- Geometric accent shapes -->
        <div
          class="geometric-accents pointer-events-none absolute inset-0 overflow-visible rounded-lg opacity-[var(--accent-opacity)]"
        >
          <div class="accent-circle-1"></div>
          <div class="accent-circle-2"></div>
          <div class="accent-line-1"></div>
          <div class="accent-line-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { cn } from "~/lib/utils";

interface GlareCardProps {
  class?: string;
  theme?: "light" | "dark";
}

const props = withDefaults(defineProps<GlareCardProps>(), {
  theme: "dark",
});

const isPointerInside = ref(false);
const wasPointerInside = ref(false);
const isFullyExtended = ref(false);
const isCardHovered = ref(false);
const refElement = ref<HTMLElement | null>(null);

const state = ref({
  position: { x: 50, y: 50 },
  background: { x: 50, y: 50 },
  hue: 0,
  reflectionOpacity: 0,
});

function handlePointerMove(event: PointerEvent) {
  const rect = refElement.value?.getBoundingClientRect();
  if (rect) {
    const position = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const percentage = {
      x: (100 / rect.width) * position.x,
      y: (100 / rect.height) * position.y,
    };

    // Calculate position values for effects
    state.value.background.x = 50 + percentage.x / 4 - 12.5;
    state.value.background.y = 50 + percentage.y / 3 - 16.67;
    state.value.position.x = percentage.x;
    state.value.position.y = percentage.y;

    // Calculate reflection intensity based on position
    const distanceFromCenter = Math.sqrt(
      Math.pow((percentage.x - 50) / 50, 2) + Math.pow((percentage.y - 50) / 50, 2),
    );
    state.value.reflectionOpacity = Math.max(0, 1 - distanceFromCenter);

    // Add dynamic rotation based on mouse position when card is hovered
    if (isCardHovered.value && refElement.value) {
      const cardWrapper = refElement.value.querySelector(".card-wrapper") as HTMLElement;
      if (cardWrapper) {
        // Calculate rotation angles based on mouse position
        const rotateY = ((percentage.x - 50) / 50) * 10; // -10 to 10 degrees
        const rotateX = ((50 - percentage.y) / 50) * 10; // -10 to 10 degrees

        // Apply the rotation transformation
        cardWrapper.style.transform = `rotateX(${20 + rotateX}deg) rotateY(${-10 + rotateY}deg) translateZ(30px) scale(1.05)`;
      }
    }
  }
}

function handleCardEnter() {
  isPointerInside.value = true;
  wasPointerInside.value = false;
  isCardHovered.value = true;

  // Set a timeout to check if the card is fully extended after the animation completes
  setTimeout(() => {
    if (isPointerInside.value && refElement.value) {
      refElement.value.style.setProperty("--duration", "0s");
      isFullyExtended.value = true;
    }
  }, 500); // Match this with the sheet transition duration
}

function handleCardLeave() {
  wasPointerInside.value = true;
  isPointerInside.value = false;
  isFullyExtended.value = false;
  isCardHovered.value = false;

  if (refElement.value) {
    refElement.value.style.removeProperty("--duration");

    // Reset the card wrapper rotation smoothly
    const cardWrapper = refElement.value.querySelector(".card-wrapper") as HTMLElement;
    if (cardWrapper) {
      cardWrapper.style.transition = "transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      cardWrapper.style.transform = "translateZ(0) scale(1)";

      // Reset the transition after the animation completes
      setTimeout(() => {
        if (cardWrapper) {
          cardWrapper.style.transition = "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        }
      }, 800);
    }
  }
}

function handlePointerEnter() {
  handleCardEnter();
}

function handlePointerLeave() {
  handleCardLeave();
}
</script>

<style scoped>
/* Theme variables */
.theme-dark {
  --card-bg-color: #0f0f11;
  --card-border-color: rgba(82, 82, 91, 0.3);
  --accent-color-primary: hsla(220, 15%, 60%, 0.15);
  --accent-color-secondary: hsla(210, 15%, 60%, 0.1);
  --accent-line-color-primary: hsla(220, 15%, 60%, 0.2);
  --accent-line-color-secondary: hsla(210, 15%, 60%, 0.15);
  --reflection-color-bright: rgba(255, 255, 255, 0.7);
  --reflection-color-mid: rgba(200, 200, 220, 0.2);
  --sheet-color-1: hsla(220, 15%, 92%, 0.85);
  --sheet-color-2: hsla(220, 15%, 89%, 0.8);
  --sheet-color-3: hsla(220, 15%, 86%, 0.75);
  --sheet-color-4: hsla(220, 15%, 83%, 0.7);
  --shadow-color: rgba(0, 0, 0, 0.2);
}

.theme-light {
  --card-bg-color: #ffffff;
  --card-border-color: rgba(228, 228, 231, 0.8);
  --accent-color-primary: hsla(220, 15%, 40%, 0.1);
  --accent-color-secondary: hsla(210, 15%, 40%, 0.08);
  --accent-line-color-primary: hsla(220, 15%, 40%, 0.15);
  --accent-line-color-secondary: hsla(210, 15%, 40%, 0.1);
  --reflection-color-bright: rgba(100, 100, 255, 0.4);
  --reflection-color-mid: rgba(150, 150, 255, 0.1);
  --sheet-color-1: hsla(220, 10%, 95%, 0.85);
  --sheet-color-2: hsla(220, 10%, 90%, 0.8);
  --sheet-color-3: hsla(220, 10%, 85%, 0.75);
  --sheet-color-4: hsla(220, 10%, 80%, 0.7);
  --shadow-color: rgba(0, 0, 0, 0.1);
}

.card-bg {
  background-color: var(--card-bg-color);
  border-radius: var(--radius);
  overflow: hidden;
}

.main-card {
  border-color: var(--card-border-color);
  box-shadow: 0 4px 8px var(--shadow-color);
  transform: translateZ(0);
  overflow: visible;
  transition:
    box-shadow 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.color-shift-style {
  --gradient-angle: calc(var(--position-x) * 3.6deg);
  background: linear-gradient(
    var(--gradient-angle),
    hsla(210, 15%, 40%, 0.25),
    hsla(220, 10%, 30%, 0.25),
    hsla(230, 8%, 20%, 0.25),
    hsla(240, 12%, 35%, 0.25)
  );
  background-size: 400% 400%;
  background-position: calc(var(--position-x) * 1%) calc(var(--position-y) * 1%);
  filter: blur(16px);
}

.border-glow-style {
  box-shadow:
    0 0 10px 1px hsla(220, 15%, 50%, 0.2),
    0 0 20px 2px hsla(230, 10%, 40%, 0.15),
    inset 0 0 8px 1px hsla(210, 10%, 45%, 0.15);
  border: 1px solid var(--card-border-color);
  pointer-events: none;
  transition:
    box-shadow 0.3s ease,
    border 0.3s ease,
    opacity 0.3s ease;
}

.card-hovered .border-glow-style {
  box-shadow:
    0 0 15px 2px hsla(220, 20%, 55%, 0.3),
    0 0 30px 4px hsla(230, 15%, 45%, 0.2),
    inset 0 0 12px 2px hsla(210, 15%, 50%, 0.2);
  border: 1px solid hsla(220, 20%, 65%, 0.4);
}

/* Geometric accent shapes */
.geometric-accents {
  transition: opacity 0.3s ease;
  opacity: 0.8;
  overflow: visible;
  border-radius: var(--radius);
}

.accent-circle-1 {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1.5px solid var(--accent-color-primary);
  top: 10px;
  right: 10px;
  background: radial-gradient(circle, hsla(220, 15%, 30%, 0.1) 0%, transparent 80%);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
  z-index: 1;
  transform-origin: center;
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0.8;
}

.card-hovered .accent-circle-1 {
  transform: translateZ(5px) scale(1.1);
  opacity: 1;
}

.accent-circle-2 {
  position: absolute;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 1.5px solid var(--accent-color-secondary);
  bottom: 20px;
  left: 20px;
  background: radial-gradient(circle, hsla(210, 15%, 30%, 0.1) 0%, transparent 80%);
  box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.1);
  transform-origin: center;
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0.8;
}

.card-hovered .accent-circle-2 {
  transform: translateZ(3px) scale(1.05);
  opacity: 1;
}

.theme-dark .accent-circle-1,
.theme-dark .accent-circle-2 {
  border-color: hsla(220, 15%, 60%, 0.25);
}

.theme-light .accent-circle-1,
.theme-light .accent-circle-2 {
  border-color: hsla(220, 15%, 40%, 0.2);
  background: radial-gradient(circle, hsla(210, 15%, 50%, 0.08) 0%, transparent 80%);
}

.accent-line-1 {
  position: absolute;
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-line-color-primary), transparent);
  transform: rotate(45deg);
  bottom: 60px;
  right: 20px;
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0.8;
}

.card-hovered .accent-line-1 {
  transform: rotate(45deg) translateZ(2px);
  opacity: 1;
}

.accent-line-2 {
  position: absolute;
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent-line-color-secondary), transparent);
  transform: rotate(-30deg);
  top: 60px;
  left: 30px;
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
  opacity: 0.8;
}

.card-hovered .accent-line-2 {
  transform: rotate(-30deg) translateZ(2px);
  opacity: 1;
}

.container-style {
  --duration: 300ms;
  --border-opacity: 0.15;
  --color-opacity: 0.2;
  --accent-opacity: 0.6;
  --radius: 16px;
  --easing: ease;
  --delay: 0ms;
  perspective: 1500px;
}

/* Animation for the color shift when not hovering */
@keyframes colorShift {
  0% {
    background-position: 0% 50%;
    filter: brightness(0.9) saturate(0.7);
  }
  25% {
    background-position: 50% 0%;
    filter: brightness(0.95) saturate(0.75);
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.05) saturate(0.8);
  }
  75% {
    background-position: 50% 100%;
    filter: brightness(1) saturate(0.78);
  }
  100% {
    background-position: 0% 50%;
    filter: brightness(0.9) saturate(0.7);
  }
}

.color-shift-style {
  animation: colorShift 20s ease-in-out infinite;
}

/* Enhanced reflection animations */
@keyframes reflectionEnter {
  0% {
    opacity: 0;
    background: linear-gradient(
      135deg,
      var(--reflection-color-bright) 0%,
      var(--reflection-color-mid) 30%,
      transparent 70%
    );
    background-position: 100% 100%;
    background-size: 200% 200%;
  }
  100% {
    opacity: 0.25;
    background: linear-gradient(
      135deg,
      var(--reflection-color-bright) 0%,
      var(--reflection-color-mid) 30%,
      transparent 70%
    );
    background-position: 0% 0%;
    background-size: 200% 200%;
  }
}

@keyframes reflectionLeave {
  0% {
    opacity: 0.25;
    background: linear-gradient(
      135deg,
      var(--reflection-color-bright) 0%,
      var(--reflection-color-mid) 30%,
      transparent 70%
    );
    background-position: 0% 0%;
    background-size: 200% 200%;
  }
  100% {
    opacity: 0;
    background: linear-gradient(
      135deg,
      var(--reflection-color-bright) 0%,
      var(--reflection-color-mid) 30%,
      transparent 70%
    );
    background-position: 100% 100%;
    background-size: 200% 200%;
  }
}

.reflection-layer {
  mix-blend-mode: overlay;
  opacity: 0;
  transform: translateZ(0);
  backface-visibility: hidden;
  pointer-events: none;
  z-index: 2;
  will-change: opacity, background-position;
}

.reflection-enter {
  animation: reflectionEnter 0.8s ease-out forwards;
}

.reflection-leave {
  animation: reflectionLeave 0.8s ease-out forwards;
}

.reflection-fade {
  opacity: 0;
  transition: opacity 0.5s ease-out;
  background: none;
}

/* Enhance hover effect */
.card-hovered .color-shift-style {
  animation-play-state: paused;
  opacity: 0.3;
  filter: brightness(1.05) saturate(0.9) blur(12px);
  transition:
    opacity 0.3s ease,
    filter 0.3s ease;
}

.card-hovered .geometric-accents {
  opacity: 1;
}

/* 3D Sheet Stack Effect */
.sheet-stack {
  z-index: 0;
}

.sheet {
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  box-shadow: 0 1px 3px var(--shadow-color);
  transform-origin: bottom left;
  transition: all 0.5s ease-out;
  opacity: 0;
  backface-visibility: hidden;
}

.sheet-1 {
  transform: translateZ(-2px) translateY(2px) translateX(2px) rotateX(0deg) rotateY(0deg);
  background-color: var(--sheet-color-1);
}

.sheet-2 {
  transform: translateZ(-4px) translateY(4px) translateX(4px) rotateX(0deg) rotateY(0deg);
  background-color: var(--sheet-color-2);
}

.sheet-3 {
  transform: translateZ(-6px) translateY(6px) translateX(6px) rotateX(0deg) rotateY(0deg);
  background-color: var(--sheet-color-3);
}

.sheet-4 {
  transform: translateZ(-8px) translateY(8px) translateX(8px) rotateX(0deg) rotateY(0deg);
  background-color: var(--sheet-color-4);
}

/* Hover effects for the card wrapper */
.card-hovered .card-wrapper {
  transform: rotateX(20deg) rotateY(-10deg) translateZ(30px) scale(1.05);
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Hover effects for the sheets - ensure they move exactly like the main card */
.card-hovered .sheet-1 {
  transform: translateZ(-8px) translateY(8px) translateX(8px) rotateX(0deg) rotateY(0deg);
  opacity: 1;
  box-shadow: 0 8px 16px var(--shadow-color);
}

.card-hovered .sheet-2 {
  transform: translateZ(-16px) translateY(16px) translateX(16px) rotateX(0deg) rotateY(0deg);
  opacity: 1;
  box-shadow: 0 12px 20px var(--shadow-color);
}

.card-hovered .sheet-3 {
  transform: translateZ(-24px) translateY(24px) translateX(24px) rotateX(0deg) rotateY(0deg);
  opacity: 1;
  box-shadow: 0 16px 24px var(--shadow-color);
}

.card-hovered .sheet-4 {
  transform: translateZ(-32px) translateY(32px) translateX(32px) rotateX(0deg) rotateY(0deg);
  opacity: 1;
  box-shadow: 0 20px 28px var(--shadow-color);
}

/* Main card hover effect */
.card-hovered .main-card {
  box-shadow: 0 25px 40px var(--shadow-color);
  transform: translateZ(0);
  overflow: visible;
}

/* Add a subtle shadow to the main card in default state */
.main-card {
  box-shadow: 0 4px 8px var(--shadow-color);
  transform: translateZ(0);
  overflow: visible;
  transition:
    box-shadow 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Remove the individual card transformation since we're transforming the wrapper */
.card-hovered > div.main-card {
  transform: none;
}

/* Remove the dark corner overlay as we're fixing the issue with the reflection */
.card-hovered .main-card::after {
  display: none;
}

.theme-dark .card-hovered .main-card::after,
.theme-light .card-hovered .main-card::after {
  display: none;
}

/* Remove the permanent corner mask as we're restoring the reflection */
.main-card::before {
  display: none;
}

.card-hovered .main-card::before {
  display: none;
}

.theme-dark .main-card::before,
.theme-light .main-card::before {
  display: none;
}

/* Card wrapper transition */
.card-wrapper {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateZ(0) scale(1);
}
</style>
