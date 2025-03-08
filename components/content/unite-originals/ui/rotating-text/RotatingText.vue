<template>
  <div
    ref="containerRef"
    :class="['relative inline-block overflow-visible', mainClassName]"
    :style="{
      height: containerHeight + 'px',
      width: containerWidth + 2 + 'px',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '0.25rem',
      textAlign: 'center',
      position: 'relative',
      verticalAlign: 'middle',
      lineHeight: 1,
    }"
  >
    <span class="sr-only">{{ texts[currentTextIndex] }}</span>
    <div
      v-for="(text, index) in texts"
      :key="index"
      :ref="(el) => el && (textElements[index] = el as HTMLDivElement)"
      :class="[
        'absolute inset-0 flex items-center justify-center',
        splitBy === 'lines' ? 'flex-col' : 'flex-row flex-wrap',
        { 'pointer-events-none': currentTextIndex !== index },
      ]"
      :style="{
        opacity: currentTextIndex === index ? 1 : 0,
        visibility: currentTextIndex === index ? 'visible' : 'hidden',
        overflow: 'visible',
      }"
      aria-hidden="true"
    >
      <div class="flex flex-wrap items-center justify-center overflow-visible">
        <span
          v-for="(wordObj, wordIndex) in getElements(text)"
          :key="wordIndex"
          :class="[
            'inline-flex flex-wrap items-center justify-center overflow-visible',
            splitLevelClassName,
          ]"
        >
          <span
            v-for="(char, charIndex) in wordObj.characters"
            :key="charIndex"
            :ref="
              (el) => el && registerCharElement(el as HTMLSpanElement, index, wordIndex, charIndex)
            "
            :class="['character inline-block', elementLevelClassName]"
          >
            {{ char }}
          </span>
          <span
            v-if="wordObj.needsSpace"
            class="whitespace-pre"
          >
            &nbsp;
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import anime from "animejs";

// Helper function to combine class names
function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface TransitionProps {
  type: string;
  damping?: number;
  stiffness?: number;
  duration?: number;
}

interface AnimationProps {
  y?: string | number;
  opacity?: number | string;
}

interface Props {
  texts: string[];
  transition?: TransitionProps;
  initial?: AnimationProps;
  animate?: AnimationProps;
  exit?: AnimationProps;
  animatePresenceMode?: "sync" | "wait";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  transitionName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  transition: () => ({ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }),
  initial: () => ({ y: "100%", opacity: 0 }),
  animate: () => ({ y: 0, opacity: 1 }),
  exit: () => ({ y: "-120%", opacity: 0 }),
  animatePresenceMode: "wait",
  animatePresenceInitial: false,
  rotationInterval: 2000,
  staggerDuration: 0.025,
  staggerFrom: "first",
  loop: true,
  auto: true,
  splitBy: "characters",
  mainClassName: "",
  splitLevelClassName: "",
  elementLevelClassName: "",
  transitionName: "text-slide",
});

const emit = defineEmits(["next"]);

const currentTextIndex = ref(0);
const containerRef = ref<HTMLElement | null>(null);
let intervalId: number | null = null;
const containerHeight = ref(0);
const containerWidth = ref(0);
const allTextSizes = ref<{ width: number; height: number }[]>([]);
const textElements = ref<(HTMLDivElement | null)[]>([]);
const charElements = ref<Map<number, Map<number, Map<number, HTMLElement>>>>(new Map());

// Initialize text elements array with null values
onMounted(() => {
  textElements.value = Array(props.texts.length).fill(null);
  props.texts.forEach((_, index) => {
    charElements.value.set(index, new Map());
  });
});

// Register character element references
function registerCharElement(
  el: HTMLElement,
  textIndex: number,
  wordIndex: number,
  charIndex: number,
) {
  if (!charElements.value.has(textIndex)) {
    charElements.value.set(textIndex, new Map());
  }

  const textMap = charElements.value.get(textIndex)!;

  if (!textMap.has(wordIndex)) {
    textMap.set(wordIndex, new Map());
  }

  const wordMap = textMap.get(wordIndex)!;
  wordMap.set(charIndex, el);
}

// Methods to control the rotation
function next() {
  const nextIndex =
    currentTextIndex.value === props.texts.length - 1
      ? props.loop
        ? 0
        : currentTextIndex.value
      : currentTextIndex.value + 1;

  if (nextIndex !== currentTextIndex.value) {
    animateTextTransition(currentTextIndex.value, nextIndex);
    currentTextIndex.value = nextIndex;
    emit("next", nextIndex);
  }
}

function previous() {
  const prevIndex =
    currentTextIndex.value === 0
      ? props.loop
        ? props.texts.length - 1
        : currentTextIndex.value
      : currentTextIndex.value - 1;

  if (prevIndex !== currentTextIndex.value) {
    animateTextTransition(currentTextIndex.value, prevIndex, true);
    currentTextIndex.value = prevIndex;
    emit("next", prevIndex);
  }
}

function jumpTo(index: number) {
  const validIndex = Math.max(0, Math.min(index, props.texts.length - 1));
  if (validIndex !== currentTextIndex.value) {
    animateTextTransition(currentTextIndex.value, validIndex);
    currentTextIndex.value = validIndex;
    emit("next", validIndex);
  }
}

function reset() {
  if (currentTextIndex.value !== 0) {
    animateTextTransition(currentTextIndex.value, 0);
    currentTextIndex.value = 0;
    emit("next", 0);
  }
}

// AnimeJS animation for text transition
function animateTextTransition(fromIndex: number, toIndex: number, isReverse = false) {
  const currentTextMap = charElements.value.get(fromIndex);
  const nextTextMap = charElements.value.get(toIndex);

  if (!currentTextMap || !nextTextMap) return;

  // Hide all texts first
  props.texts.forEach((_, i) => {
    if (i !== fromIndex && i !== toIndex && textElements.value[i]) {
      anime.set(textElements.value[i], {
        opacity: 0,
        visibility: "hidden",
      });
    }
  });

  // Make the next text visible but with initial animation state
  if (textElements.value[toIndex]) {
    anime.set(textElements.value[toIndex], {
      opacity: 1,
      visibility: "visible",
    });
  }

  // Exit animation for current text characters
  const exitTargets: HTMLElement[] = [];
  currentTextMap.forEach((wordMap) => {
    wordMap.forEach((el) => {
      exitTargets.push(el);
    });
  });

  // Determine exit animation properties
  const exitProps = isReverse
    ? { translateY: props.initial.y || "100%", opacity: 0 }
    : { translateY: props.exit.y || "-120%", opacity: 0 };

  // Determine enter animation properties
  const enterFromProps = isReverse
    ? { translateY: props.exit.y || "-120%", opacity: 0 }
    : { translateY: props.initial.y || "100%", opacity: 0 };

  const enterToProps = { translateY: 0, opacity: 1 };

  // Calculate appropriate stagger duration based on character count
  const totalChars = exitTargets.length;
  const maxStaggerDuration = Math.min(props.staggerDuration, 0.5 / totalChars);

  // Exit animation
  anime({
    targets: exitTargets,
    ...exitProps,
    duration: props.transition.duration ? props.transition.duration * 1000 : 400,
    easing: "cubicBezier(0.34, 1.56, 0.64, 1)",
    delay: anime.stagger(maxStaggerDuration * 1000, {
      from: getStaggerFrom(exitTargets.length) as any,
      direction: isReverse ? "reverse" : "normal",
    }),
    complete: function () {
      // Clean up after animation to prevent any lingering elements
      if (textElements.value[fromIndex]) {
        anime.set(textElements.value[fromIndex], {
          opacity: 0,
          visibility: "hidden",
        });
      }
    },
  });

  // Enter animation targets
  const enterTargets: HTMLElement[] = [];
  nextTextMap.forEach((wordMap) => {
    wordMap.forEach((el) => {
      enterTargets.push(el);
      // Set initial state
      anime.set(el, enterFromProps);
    });
  });

  // Calculate appropriate stagger duration for enter animation
  const totalEnterChars = enterTargets.length;
  const maxEnterStaggerDuration = Math.min(props.staggerDuration, 0.5 / totalEnterChars);

  // Enter animation
  anime({
    targets: enterTargets,
    ...enterToProps,
    duration: props.transition.duration ? props.transition.duration * 1000 : 400,
    easing: "cubicBezier(0.34, 1.56, 0.64, 1)",
    delay: anime.stagger(maxEnterStaggerDuration * 1000, {
      from: getStaggerFrom(enterTargets.length) as any,
      direction: isReverse ? "reverse" : "normal",
    }),
  });
}

// Get stagger from index based on staggerFrom prop
function getStaggerFrom(totalElements: number): number | string {
  if (props.staggerFrom === "first") return 0;
  if (props.staggerFrom === "last") return totalElements - 1;
  if (props.staggerFrom === "center") return Math.floor(totalElements / 2);
  if (props.staggerFrom === "random") return "random";
  return typeof props.staggerFrom === "number" ? Math.min(props.staggerFrom, totalElements - 1) : 0;
}

// Split text into elements based on splitBy prop
function splitIntoCharacters(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      // Define interfaces for Intl.Segmenter
      interface Segment {
        segment: string;
        index: number;
        input: string;
      }

      interface Segmenter {
        segment(text: string): Iterable<Segment>;
      }

      interface SegmenterConstructor {
        new (locale: string, options: { granularity: string }): Segmenter;
      }

      // Use the defined interfaces for type casting
      const SegmenterClass = (Intl as unknown as { Segmenter: SegmenterConstructor }).Segmenter;
      const segmenter = new SegmenterClass("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (segment: Segment) => segment.segment);
    } catch (e) {
      // Fallback if Segmenter is not available or fails
      return Array.from(text);
    }
  }
  return Array.from(text);
}

// Process text elements
function getElements(text: string) {
  if (props.splitBy === "characters") {
    const words = text.split(" ");
    return words.map((word, i) => ({
      characters: splitIntoCharacters(word),
      needsSpace: i !== words.length - 1,
    }));
  }

  if (props.splitBy === "words") {
    return text.split(" ").map((word, i, arr) => ({
      characters: [word],
      needsSpace: i !== arr.length - 1,
    }));
  }

  if (props.splitBy === "lines") {
    return text.split("\n").map((line, i, arr) => ({
      characters: [line],
      needsSpace: i !== arr.length - 1,
    }));
  }

  return text.split(props.splitBy).map((part, i, arr) => ({
    characters: [part],
    needsSpace: i !== arr.length - 1,
  }));
}

// Calculate the maximum size needed for the container
function calculateMaxSize() {
  if (!containerRef.value) return;

  // Get the parent container's style context
  const parentStyles = window.getComputedStyle(containerRef.value);

  // Create a temporary div to measure text sizes
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.visibility = "hidden";
  tempDiv.style.whiteSpace = "nowrap";
  tempDiv.style.display = "inline-block";
  tempDiv.style.fontSize = parentStyles.fontSize;
  tempDiv.style.fontWeight = parentStyles.fontWeight;
  tempDiv.style.fontFamily = parentStyles.fontFamily;
  tempDiv.style.letterSpacing = parentStyles.letterSpacing;
  tempDiv.style.lineHeight = parentStyles.lineHeight;
  tempDiv.style.padding = "0";
  tempDiv.style.textAlign = "center";

  // Apply the same main class for accurate measurement
  if (props.mainClassName) {
    tempDiv.className = props.mainClassName;
  }

  document.body.appendChild(tempDiv);

  // Measure each text
  const sizes = props.texts.map((text) => {
    tempDiv.textContent = text;
    const rect = tempDiv.getBoundingClientRect();
    return {
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
    };
  });

  document.body.removeChild(tempDiv);

  // Find the maximum width and height
  const maxWidth = Math.max(...sizes.map((size) => size.width));
  const maxHeight = Math.max(...sizes.map((size) => size.height));

  containerWidth.value = maxWidth;
  containerHeight.value = maxHeight;
  allTextSizes.value = sizes;
}

// Initialize animations after mounting
onMounted(() => {
  // Wait for DOM to be fully rendered
  setTimeout(() => {
    calculateMaxSize();

    // Initialize the first text with its animation
    nextTick(() => {
      // Set initial state for all texts
      props.texts.forEach((_, i) => {
        if (i !== currentTextIndex.value && textElements.value[i]) {
          anime.set(textElements.value[i], {
            opacity: 0,
            visibility: "hidden",
          });
        }
      });

      // Animate first text entry
      const firstTextMap = charElements.value.get(currentTextIndex.value);
      if (firstTextMap) {
        const firstTextChars: HTMLElement[] = [];
        firstTextMap.forEach((wordMap) => {
          wordMap.forEach((el) => {
            firstTextChars.push(el);
            // Set initial state
            anime.set(el, {
              translateY: props.initial.y || "100%",
              opacity: 0,
            });
          });
        });

        // Calculate appropriate stagger duration for initial animation
        const totalFirstChars = firstTextChars.length;
        const maxFirstStaggerDuration = Math.min(props.staggerDuration, 0.5 / totalFirstChars);

        // Animate first text in
        anime({
          targets: firstTextChars,
          translateY: 0,
          opacity: 1,
          duration: props.transition.duration ? props.transition.duration * 1000 : 400,
          easing: "cubicBezier(0.34, 1.56, 0.64, 1)",
          delay: anime.stagger(maxFirstStaggerDuration * 1000, {
            from: getStaggerFrom(firstTextChars.length) as any,
          }),
        });
      }

      // Start auto rotation if enabled
      if (props.auto) {
        intervalId = window.setInterval(next, props.rotationInterval);
      }
    });
  }, 100);

  // Recalculate on window resize
  window.addEventListener("resize", calculateMaxSize);
});

onBeforeUnmount(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }

  window.removeEventListener("resize", calculateMaxSize);
});

// Watch for props changes that should reset the interval
watch(
  () => props.rotationInterval,
  (newVal) => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    if (props.auto) {
      intervalId = window.setInterval(next, newVal);
    }
  },
);

watch(
  () => props.auto,
  (newVal) => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (newVal) {
      intervalId = window.setInterval(next, props.rotationInterval);
    }
  },
);

// Watch for texts changes to recalculate sizes
watch(
  () => props.texts,
  () => {
    nextTick(() => {
      calculateMaxSize();

      // Reset char elements map
      charElements.value = new Map();
      props.texts.forEach((_, index) => {
        charElements.value.set(index, new Map());
      });
    });
  },
  { deep: true },
);

// Expose methods to parent component
defineExpose({
  next,
  previous,
  jumpTo,
  reset,
});
</script>

<style scoped>
.character {
  display: inline-block;
  will-change: transform, opacity;
  transform-origin: center;
  backface-visibility: hidden;
  position: relative;
  margin: 0;
  padding: 0;
  line-height: 1;
  vertical-align: middle;
}
</style>
