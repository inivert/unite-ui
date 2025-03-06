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
const isVisible = ref(true);
const isPaused = ref(false);

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

onMounted(() => {
  // Use IntersectionObserver to pause animations when not visible
  if (typeof IntersectionObserver !== "undefined" && container.value) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.value = entry.isIntersecting;

          if (entry.isIntersecting && isPaused.value) {
            isPaused.value = false;
            startTimeout();
          } else if (!entry.isIntersecting && !isPaused.value) {
            isPaused.value = true;
            if (timeoutId.value) {
              clearTimeout(timeoutId.value);
              timeoutId.value = null;
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(container.value);
  }

  // Calculate dimensions and start animation
  nextTick(() => {
    calculateMaxDimensions();

    // Start with the first word
    if (wordContainers.value[0]) {
      anime.set(wordContainers.value[0], {
        opacity: 1,
      });

      const letters = lettersByWordIndex.value.get(0);
      if (letters) {
        anime({
          targets: letters,
          opacity: [0, 1],
          translateY: [5, 0],
          delay: anime.stagger(15),
          duration: 180,
          easing: "easeOutQuad",
          complete: () => {
            if (isVisible.value) {
              startTimeout();
            }
          },
        });
      }
    }
  });
});

onBeforeUnmount(() => {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }
});

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

  // Simplified animation for better performance
  anime({
    targets: letters,
    opacity: 1,
    translateY: 0,
    duration: 180,
    easing: "easeOutQuad",
    complete: () => {
      isAnimating.value = false;
      // Start timeout for next word if visible
      if (isVisible.value) {
        startTimeout();
      }
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
    opacity: 0,
    translateY: -3,
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
  if (isAnimating.value || isPaused.value) return;
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

  if (!isVisible.value || isPaused.value) return;

  timeoutId.value = window.setTimeout(() => {
    startAnimation();
  }, props.duration);
}
</script>

<style scoped>
.active-word {
  opacity: 1;
}
</style>
