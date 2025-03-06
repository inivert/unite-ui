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
      <LazyParticlesBg
        class="fixed inset-0 z-[-3]"
        :quantity="150"
        :ease="100"
        :color="isDark ? '#FFF' : '#000'"
        :staticity="20"
        refresh
      />
      <template #fallback>
        <div class="fixed inset-0 z-[-3] bg-gradient-to-b from-transparent to-gray-900/20"></div>
      </template>
    </ClientOnly>
    <span
      class="fixed top-0 z-[-1] h-screen w-full bg-white opacity-40 dark:bg-black dark:opacity-50"
    ></span>

    <!-- Creative Get Started Button -->
    <button
      ref="buttonContainer"
      class="group relative mb-4 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
      @click="animateRocketAndNavigate"
      @mouseenter="handleButtonEnter"
      @mouseleave="handleButtonLeave"
    >
      <div
        class="relative flex items-center rounded-full bg-black px-6 py-2.5 transition-all duration-300 group-hover:bg-opacity-0 dark:bg-gray-900 dark:group-hover:bg-opacity-0"
      >
        <div
          ref="rocketContainer"
          class="inline-block"
        >
          <SmartIcon
            ref="rocketIcon"
            name="lucide:rocket"
            class="size-5 transition-transform duration-300 group-hover:rotate-45"
          />
        </div>
        <span
          ref="buttonText"
          class="ml-2 font-medium text-white"
          >Get Started</span
        >
        <Icon
          ref="arrowIcon"
          name="lucide:arrow-right"
          class="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1"
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

    <h1
      class="text-center text-3xl font-bold leading-tight tracking-tighter lg:leading-[1.1] md:text-6xl"
    >
      Build
      <ClientOnly>
        <FlipWords
          :words="[
            'modern',
            'dynamic',
            'responsive',
            'beautiful',
            'stunning',
            'elegant',
            'creative',
            'innovative',
          ]"
          :duration="3000"
          class="inline-block min-w-[150px]"
        />
        <template #fallback>
          <span class="inline-block min-w-[150px] text-purple-500">modern</span>
        </template>
      </ClientOnly>
      websites using Vue & Nuxt
    </h1>

    <span class="mt-4 text-center text-lg text-gray-600 sm:text-xl dark:text-gray-200">
      Curated list of amazing UI libraries and components for Nuxt developers, inspired by Inspira
      UI
    </span>
    <div class="mt-4 flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
      <NuxtLink to="/components">
        <UiButton> All Components </UiButton>
      </NuxtLink>
      <NuxtLink
        to="https://github.com/inivert/unite-ui"
        target="_blank"
      >
        <UiButton variant="outline">
          <SmartIcon
            name="lucide:github"
            class="mr-1"
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
      router.push("/components");
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
