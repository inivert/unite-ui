<template>
  <div class="relative inline-block">
    <div
      ref="container"
      :class="[
        'relative z-10 inline-block text-left text-neutral-900 dark:text-neutral-100',
        props.class,
      ]"
      :style="{
        minWidth: `${maxWordWidth}px`,
        minHeight: `${maxWordHeight}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <div
        v-for="(word, wordIndex) in props.words"
        :key="`word-${wordIndex}-${word}`"
        :ref="setWordContainer"
        class="absolute inset-0 flex items-center justify-center whitespace-nowrap opacity-0"
        :class="{ 'active-word': currentWordIndex === wordIndex }"
        :data-index="wordIndex"
      >
        <span
          v-for="(letter, letterIndex) in word.split('')"
          :key="`letter-${wordIndex}-${letterIndex}-${letter}`"
          :ref="setLetterElement"
          class="inline-block opacity-0"
          :data-word-index="wordIndex"
          :data-letter-index="letterIndex"
        >
          {{ letter }}
        </span>
      </div>
    </div>

    <!-- Hidden elements to measure word widths -->
    <div
      ref="measureContainer"
      aria-hidden="true"
      class="pointer-events-none absolute opacity-0"
    >
      <span
        v-for="(word, index) in props.words"
        :key="`measure-${index}-${word}`"
        :ref="
          (el) => {
            if (el) wordElements.push(el);
          }
        "
        class="inline-block whitespace-nowrap"
      >
        {{ word }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import anime from "animejs";

interface Props {
  words: string[];
  duration?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  class: "",
});

const emit = defineEmits(["animationStart", "animationComplete"]);

const container = ref(null);
const currentWordIndex = ref(0);
const wordElements = ref<HTMLElement[]>([]);
const wordContainers = ref<HTMLElement[]>([]);
const lettersByWordIndex = ref<Map<number, HTMLElement[]>>(new Map());
const timeoutId = ref<number | null>(null);
const maxWordWidth = ref(0);
const maxWordHeight = ref(0);
const isAnimating = ref(false);

// Keep track of animation cycles
function logWordState() {
  // Silent debugging - removed console statements
}

// Separate methods for setting refs to avoid reactivity issues
function setWordContainer(el: HTMLElement | null) {
  if (!el) return;
  const index = parseInt(el.dataset.index || "0");
  wordContainers.value[index] = el;
}

function setLetterElement(el: HTMLElement | null) {
  if (!el) return;
  const wordIndex = parseInt(el.dataset.wordIndex || "0");

  if (!lettersByWordIndex.value.has(wordIndex)) {
    lettersByWordIndex.value.set(wordIndex, []);
  }

  const letters = lettersByWordIndex.value.get(wordIndex);
  if (letters && !letters.includes(el)) {
    letters.push(el);
  }
}

// Function to measure all words and find the maximum dimensions
function calculateMaxDimensions() {
  if (!wordElements.value || wordElements.value.length === 0) return;

  let maxWidth = 0;
  let maxHeight = 0;

  wordElements.value.forEach((element) => {
    if (element) {
      if (element.offsetWidth > maxWidth) {
        maxWidth = element.offsetWidth;
      }
      if (element.offsetHeight > maxHeight) {
        maxHeight = element.offsetHeight;
      }
    }
  });

  maxWordWidth.value = maxWidth > 0 ? maxWidth : 100; // Fallback minimum width
  maxWordHeight.value = maxHeight > 0 ? maxHeight : 40; // Fallback minimum height
}

function moveToNextWord() {
  // Calculate next index and wrap around if needed
  const nextIndex = (currentWordIndex.value + 1) % props.words.length;

  // Update the current word index
  currentWordIndex.value = nextIndex;

  // Animate the new word in
  nextTick(() => {
    animateLettersIn(nextIndex);
  });
}

function resetAllFilters() {
  // Clear any blur filters that might be stuck
  wordContainers.value.forEach((container) => {
    if (container) {
      anime.set(container, {
        filter: "blur(0)",
        scale: 1,
      });
    }
  });
}

function animateLettersIn(wordIndex: number) {
  const letters = lettersByWordIndex.value.get(wordIndex);
  const wordContainer = wordContainers.value[wordIndex];

  if (!letters || !letters.length || !wordContainer) {
    // Skip animation if elements are missing
    return;
  }

  // Emit animation start
  emit("animationStart");

  // Make word container visible first and ensure no blur
  anime.set(wordContainer, {
    opacity: 1,
    filter: "blur(0)",
    scale: 1,
  });

  // Animate each letter with faster timing
  anime({
    targets: letters,
    opacity: [0, 1],
    translateY: [5, 0],
    delay: anime.stagger(15),
    duration: 180,
    easing: "easeOutQuad",
    complete: () => {
      isAnimating.value = false;
      // Start timeout for next word
      startTimeout();
    },
  });
}

function animateLettersOut(wordIndex: number) {
  const wordContainer = wordContainers.value[wordIndex];

  if (!wordContainer) {
    // Skip animation if container is missing
    return;
  }

  // Quick fade out with minimal blur
  anime({
    targets: wordContainer,
    opacity: [1, 0],
    translateY: [0, -3],
    duration: 150,
    easing: "easeInOutQuad",
    complete: () => {
      // Emit animation complete
      emit("animationComplete");

      // Reset any transforms or filters
      anime.set(wordContainer, {
        translateY: 0,
        scale: 1,
        filter: "blur(0)",
      });

      // Move to next word after current word is out
      moveToNextWord();
    },
  });
}

function startAnimation() {
  if (isAnimating.value) return;
  isAnimating.value = true;

  // Clear any existing timeouts
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }

  // Reset any stuck filters
  resetAllFilters();

  // Animate current word out
  animateLettersOut(currentWordIndex.value);
}

function startTimeout() {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }

  timeoutId.value = window.setTimeout(() => {
    startAnimation();
  }, props.duration);
}

function setupInitialState() {
  // Reset all word containers visibility and state
  wordContainers.value.forEach((container, index) => {
    if (container) {
      // Using anime.set to avoid reactivity issues and ensure no blur
      anime.set(container, {
        opacity: index === currentWordIndex.value ? 1 : 0,
        scale: 1,
        translateY: 0,
        filter: "blur(0)",
      });
    }
  });
}

function resetCollections() {
  // Clear existing collection references to avoid stale data
  wordElements.value = [];
  wordContainers.value = Array(props.words.length);
  lettersByWordIndex.value.clear();
}

function initializeAnimation() {
  // Clear any previous timeouts
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }

  // Wait for the DOM to be updated
  nextTick(() => {
    calculateMaxDimensions();
    setupInitialState();
    resetAllFilters();

    // Only animate the first word in if we're starting fresh
    if (!isAnimating.value) {
      animateLettersIn(currentWordIndex.value);
    }
  });
}

onMounted(() => {
  resetCollections();

  // Wait for refs to be populated
  nextTick(() => {
    calculateMaxDimensions();
    initializeAnimation();
  });
});

onBeforeUnmount(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }
});

// Watch for changes to the words prop
watch(
  () => props.words,
  () => {
    // Reset animation state
    isAnimating.value = false;
    currentWordIndex.value = 0;
    resetCollections();

    // Wait for the next tick to allow DOM updates
    nextTick(() => {
      calculateMaxDimensions();
      initializeAnimation();
    });
  },
  { deep: true },
);
</script>

<style>
.active-word {
  position: relative !important;
}
</style>
