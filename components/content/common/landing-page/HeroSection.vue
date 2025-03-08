<template>
  <section
    :class="[
      'relative mx-auto flex min-h-[52rem] max-w-[800px] flex-col items-center justify-center gap-2 py-8 max-sm:min-h-[28rem] lg:py-24 lg:pb-20 md:py-12 md:pb-8',
      {
        'opacity-0': !isContentReady,
        'opacity-100 transition-opacity duration-500': isContentReady,
      },
    ]"
  >
    <ClientOnly>
      <Particles
        :particle-count="isDark ? 300 : 250"
        :particle-spread="15"
        :speed="0.07"
        :particle-colors="
          isDark
            ? ['#ffffff', '#a855f7', '#6366f1', '#ec4899']
            : ['#000000', '#a855f7', '#6366f1', '#ec4899']
        "
        :move-particles-on-hover="true"
        :particle-hover-factor="1.5"
        :alpha-particles="false"
        :particle-base-size="isDark ? 120 : 100"
        :size-randomness="1"
        :camera-distance="20"
      />
      <template #fallback>
        <div class="fixed inset-0 z-[-3] bg-gradient-to-b from-transparent to-gray-900/20"></div>
      </template>
    </ClientOnly>
    <span
      class="fixed top-0 z-[-1] h-screen w-full bg-white opacity-30 dark:bg-black dark:opacity-60"
    ></span>

    <!-- Creative Get Started Button -->
    <div class="flex w-full justify-center">
      <button
        ref="buttonContainer"
        class="group relative mb-8 mt-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
        @click="animateRocketAndNavigate"
        @mouseenter="handleButtonEnter"
        @mouseleave="handleButtonLeave"
      >
        <div
          class="relative flex items-center justify-center rounded-full bg-white/90 px-8 py-3 transition-all duration-300 group-hover:bg-opacity-0 dark:bg-gray-900 dark:group-hover:bg-opacity-0"
        >
          <div
            ref="rocketContainer"
            class="inline-flex items-center justify-center"
          >
            <SmartIcon
              ref="rocketIcon"
              name="lucide:rocket"
              class="size-5 text-gray-800 transition-transform duration-300 group-hover:rotate-45 group-hover:text-white dark:text-white"
            />
          </div>
          <span
            ref="buttonText"
            class="ml-2 font-medium text-gray-800 group-hover:text-white dark:text-white"
            >Get Started</span
          >
          <Icon
            ref="arrowIcon"
            name="lucide:arrow-right"
            class="ml-2 size-4 text-gray-800 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white dark:text-white"
          />

          <!-- Animated particles on hover -->
          <div
            ref="hoverParticles"
            class="absolute -top-10 left-0 size-40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          >
            <div
              class="absolute size-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-[1px]"
              style="left: 10%; top: 50%; animation: float 3s ease-in-out infinite"
            ></div>
            <div
              class="absolute size-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-[1px]"
              style="left: 20%; top: 30%; animation: float 4s ease-in-out infinite 0.5s"
            ></div>
            <div
              class="absolute size-1 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 blur-[1px]"
              style="left: 30%; top: 60%; animation: float 3.5s ease-in-out infinite 1s"
            ></div>
          </div>

          <!-- Rocket trail animation elements -->
          <div
            ref="rocketTrail"
            class="absolute left-5 top-1/2 -z-10 flex -translate-y-1/2 space-x-1 opacity-0"
          >
            <div
              class="size-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 blur-[1px]"
            ></div>
            <div
              class="size-2 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 blur-[1px]"
            ></div>
            <div
              class="size-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-300 blur-[1px]"
            ></div>
          </div>

          <!-- Additional trail particles that appear during animation -->
          <div
            ref="extraTrail"
            class="absolute left-0 top-1/2 -z-10 -translate-y-1/2 opacity-0"
          >
            <div
              class="absolute size-1 rounded-full bg-gradient-to-r from-orange-300 to-yellow-300 blur-[1px]"
              style="left: 2px; top: -3px"
            ></div>
            <div
              class="absolute size-1 rounded-full bg-gradient-to-r from-yellow-300 to-orange-200 blur-[1px]"
              style="left: 6px; top: 3px"
            ></div>
            <div
              class="absolute size-0.5 rounded-full bg-gradient-to-r from-orange-200 to-yellow-200 blur-[1px]"
              style="left: 10px; top: -2px"
            ></div>
          </div>

          <!-- Button glow effect -->
          <div
            class="absolute inset-0 -z-10 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30 dark:group-hover:opacity-40"
            style="
              background: linear-gradient(
                90deg,
                rgba(99, 102, 241, 1) 0%,
                rgba(168, 85, 247, 1) 50%,
                rgba(236, 72, 153, 1) 100%
              );
            "
          ></div>
        </div>
      </button>
    </div>

    <h1
      class="text-center text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1] md:text-6xl"
    >
      <span
        class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >Supercharge</span
      >
      your Nuxt apps with
      <ClientOnly>
        <div class="inline-block">
          <RotatingText
            :texts="[
              'production-ready',
              'eye-catching',
              'blazing-fast',
              'customizable',
              'accessible',
              'stunning',
              'animated',
            ]"
            :rotation-interval="2500"
            main-class-name="px-0.5 pb-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-visible pt-0 justify-center rounded-md inline-flex"
            stagger-from="last"
            :stagger-duration="0.025"
            split-level-class-name="overflow-visible"
            element-level-class-name="font-medium"
            :transition="{ type: 'spring', damping: 30, stiffness: 400, duration: 0.4 }"
            transition-name="text-slide"
          />
        </div>
        <template #fallback>
          <span
            class="inline-block min-w-[200px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >production-ready</span
          >
        </template>
      </ClientOnly>
      UI components
    </h1>

    <span class="mt-4 text-center text-lg text-gray-600 sm:text-xl dark:text-gray-200">
      Ship faster with our expertly crafted, ready-to-use UI components for Vue & Nuxt developers
    </span>
    <div class="mt-6 flex w-full items-center justify-center space-x-6 py-4 md:pb-10">
      <NuxtLink to="/getting-started/introduction">
        <UiButton
          size="lg"
          class="px-6"
        >
          All Components
        </UiButton>
      </NuxtLink>
      <NuxtLink
        to="https://github.com/inivert/unite-ui"
        target="_blank"
      >
        <UiButton
          variant="outline"
          size="lg"
          class="px-6"
        >
          <SmartIcon
            name="lucide:github"
            class="mr-2"
          />
          Github
        </UiButton>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import anime from "animejs";
import Particles from "../../unite-originals/ui/bg-particles";
import RotatingText from "../../unite-originals/ui/rotating-text";

const isDark = computed(() => useColorMode().value == "dark");
const router = useRouter();
const buttonContainer = ref<HTMLElement | null>(null);
const rocketContainer = ref<HTMLElement | null>(null);
const rocketIcon = ref<HTMLElement | null>(null);
const rocketTrail = ref<HTMLElement | null>(null);
const extraTrail = ref<HTMLElement | null>(null);
const buttonText = ref<HTMLElement | null>(null);
const arrowIcon = ref<HTMLElement | null>(null);
const hoverParticles = ref<HTMLElement | null>(null);
const isAnimating = ref(false);
const isHovering = ref(false);
const isContentReady = ref(false);

// Fade in content after a short delay
onMounted(() => {
  setTimeout(() => {
    isContentReady.value = true;
  }, 300);
});

// Simplified hover animation
function handleButtonEnter() {
  if (isAnimating.value) return;
  isHovering.value = true;

  // Simplified hover animation for better performance
  anime({
    targets: rocketContainer.value,
    translateY: -2,
    duration: 300,
    easing: "easeOutQuad",
  });

  // Simplified hover particles animation
  anime({
    targets: hoverParticles.value?.children,
    opacity: 0.8,
    scale: 1.2,
    duration: 300,
    easing: "easeOutQuad",
  });
}

function handleButtonLeave() {
  if (isAnimating.value) return;
  isHovering.value = false;

  // Stop the hover animation
  anime.remove(rocketContainer.value);

  // Fade out hover particles
  anime({
    targets: hoverParticles.value?.children,
    opacity: 0,
    scale: 0.8,
    duration: 300,
    easing: "easeOutQuad",
  });

  // Reset position
  anime({
    targets: rocketContainer.value,
    translateY: 0,
    duration: 300,
    easing: "easeOutQuad",
  });
}

function animateRocketAndNavigate() {
  if (isAnimating.value) return;
  isAnimating.value = true;

  // Stop any hover animations
  anime.remove(rocketContainer.value);

  // Calculate safe distance based on button width
  const buttonWidth = buttonContainer.value?.offsetWidth || 200;
  const rocketWidth = rocketContainer.value?.offsetWidth || 20;
  const safeDistance = buttonWidth - rocketWidth - 24; // 24px padding buffer

  // Hide hover particles immediately
  anime({
    targets: hoverParticles.value?.children,
    opacity: 0,
    scale: 0.5,
    duration: 150,
    easing: "easeOutQuad",
  });

  // Simplified rocket animation sequence
  const timeline = anime.timeline({
    easing: "easeOutQuad",
    complete: () => {
      router.push("/getting-started/introduction");
    },
  });

  // 1. Prepare for takeoff
  timeline.add({
    targets: rocketIcon.value,
    rotate: 45,
    scale: 1.2,
    duration: 300,
  });

  // 2. Show rocket trail
  timeline.add(
    {
      targets: rocketTrail.value,
      opacity: 1,
      translateX: -5,
      duration: 200,
    },
    "-=100",
  );

  // 3. Rocket moves to the right
  timeline.add(
    {
      targets: rocketContainer.value,
      translateX: safeDistance,
      duration: 600,
    },
    "-=100",
  );

  // 4. Text and arrow fade out
  timeline.add(
    {
      targets: [buttonText.value, arrowIcon.value],
      opacity: 0,
      duration: 200,
    },
    "-=500",
  );

  // 5. Extra trail particles appear
  timeline.add(
    {
      targets: extraTrail.value,
      opacity: 1,
      duration: 200,
    },
    "-=400",
  );
}
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>
