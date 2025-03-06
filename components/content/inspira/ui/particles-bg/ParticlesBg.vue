<template>
  <div
    ref="canvasContainerRef"
    :class="$props.class"
    aria-hidden="true"
  >
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { useMouse, useDevicePixelRatio, useRafFn } from "@vueuse/core";

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

type Props = {
  color?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  class?: string;
  refresh?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  color: "#FFF",
  quantity: 100,
  staticity: 50,
  ease: 50,
  class: "",
  refresh: false,
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const circles = ref<Circle[]>([]);
const mouse = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
const canvasSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 });
const { x: mouseX, y: mouseY } = useMouse();
const { pixelRatio } = useDevicePixelRatio();
const isVisible = ref(true);
const rafPaused = ref(false);

// Throttle mouse movement updates
const throttledMouseX = ref(0);
const throttledMouseY = ref(0);
const throttleInterval = 50; // ms
let lastMouseUpdate = 0;

const color = computed(() => {
  // Remove the leading '#' if it's present
  let hex = props.color.replace(/^#/, "");

  // If the hex code is 3 characters, expand it to 6 characters
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse the r, g, b values from the hex string
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255; // Extract the red component
  const g = (bigint >> 8) & 255; // Extract the green component
  const b = bigint & 255; // Extract the blue component

  // Return the RGB values as a string separated by spaces
  return `${r} ${g} ${b}`;
});

onMounted(() => {
  if (canvasRef.value) {
    context.value = canvasRef.value.getContext("2d", { alpha: true });
  }

  initCanvas();

  // Use IntersectionObserver to only animate when visible
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.value = entry.isIntersecting;
          rafPaused.value = !entry.isIntersecting;
        });
      },
      { threshold: 0.1 },
    );

    if (canvasContainerRef.value) {
      observer.observe(canvasContainerRef.value);
    }
  }

  // Start animation loop with useRafFn for better performance
  const { pause, resume } = useRafFn(animate, { immediate: true });

  watch(rafPaused, (paused) => {
    if (paused) {
      pause();
    } else {
      resume();
    }
  });

  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// Debounced resize handler
const handleResize = useDebounceFn(() => {
  initCanvas();
}, 200);

watch([mouseX, mouseY], () => {
  const now = Date.now();
  if (now - lastMouseUpdate > throttleInterval) {
    lastMouseUpdate = now;
    throttledMouseX.value = mouseX.value;
    throttledMouseY.value = mouseY.value;
    onMouseMove();
  }
});

function initCanvas() {
  resizeCanvas();
  drawParticles();
}

function onMouseMove() {
  if (canvasRef.value && isVisible.value) {
    const rect = canvasRef.value.getBoundingClientRect();
    const { w, h } = canvasSize;
    const x = throttledMouseX.value - rect.left - w / 2;
    const y = throttledMouseY.value - rect.top - h / 2;

    const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
    if (inside) {
      mouse.x = x;
      mouse.y = y;
    }
  }
}

function resizeCanvas() {
  if (canvasContainerRef.value && canvasRef.value && context.value) {
    circles.value.length = 0;
    canvasSize.w = canvasContainerRef.value.offsetWidth;
    canvasSize.h = canvasContainerRef.value.offsetHeight;

    // Use a lower pixel ratio for better performance
    const effectivePixelRatio = Math.min(pixelRatio.value, 2);

    canvasRef.value.width = canvasSize.w * effectivePixelRatio;
    canvasRef.value.height = canvasSize.h * effectivePixelRatio;
    canvasRef.value.style.width = canvasSize.w + "px";
    canvasRef.value.style.height = canvasSize.h + "px";
    context.value.scale(effectivePixelRatio, effectivePixelRatio);
  }
}

function circleParams(): Circle {
  const x = Math.floor(Math.random() * canvasSize.w);
  const y = Math.floor(Math.random() * canvasSize.h);
  const translateX = 0;
  const translateY = 0;
  const size = Math.floor(Math.random() * 2) + 1;
  const alpha = 0;
  const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
  const dx = (Math.random() - 0.5) * 0.2;
  const dy = (Math.random() - 0.5) * 0.2;
  const magnetism = 0.1 + Math.random() * 4;
  return {
    x,
    y,
    translateX,
    translateY,
    size,
    alpha,
    targetAlpha,
    dx,
    dy,
    magnetism,
  };
}

function drawCircle(circle: Circle, update = false) {
  if (context.value) {
    const { x, y, translateX, translateY, size, alpha } = circle;
    context.value.translate(translateX, translateY);
    context.value.beginPath();
    context.value.arc(x, y, size, 0, 2 * Math.PI);
    context.value.fillStyle = `rgba(${color.value.split(" ").join(", ")}, ${alpha})`;
    context.value.fill();
    context.value.setTransform(
      Math.min(pixelRatio.value, 2),
      0,
      0,
      Math.min(pixelRatio.value, 2),
      0,
      0,
    );

    if (!update) {
      circles.value.push(circle);
    }
  }
}

function clearContext() {
  if (context.value) {
    context.value.clearRect(0, 0, canvasSize.w, canvasSize.h);
  }
}

function drawParticles() {
  clearContext();
  // Use a reduced quantity for better performance
  const particleCount = Math.min(props.quantity, 200);
  for (let i = 0; i < particleCount; i++) {
    const circle = circleParams();
    drawCircle(circle);
  }
}

function remapValue(
  value: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): number {
  const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
  return remapped > 0 ? remapped : 0;
}

function animate() {
  if (!isVisible.value || rafPaused.value) return;

  clearContext();

  // Process fewer particles per frame for better performance
  const limit = Math.min(circles.value.length, 100);

  for (let i = 0; i < limit; i++) {
    const circle = circles.value[i];
    if (!circle) continue;

    // Handle the alpha value
    const edge = [
      circle.x + circle.translateX - circle.size, // distance from left edge
      canvasSize.w - circle.x - circle.translateX - circle.size, // distance from right edge
      circle.y + circle.translateY - circle.size, // distance from top edge
      canvasSize.h - circle.y - circle.translateY - circle.size, // distance from bottom edge
    ];

    const closestEdge = edge.reduce((a, b) => Math.min(a, b));
    const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

    if (remapClosestEdge > 1) {
      circle.alpha += 0.02;
      if (circle.alpha > circle.targetAlpha) circle.alpha = circle.targetAlpha;
    } else {
      circle.alpha = circle.targetAlpha * remapClosestEdge;
    }

    circle.x += circle.dx;
    circle.y += circle.dy;
    circle.translateX +=
      (mouse.x / (props.staticity / circle.magnetism) - circle.translateX) / props.ease;
    circle.translateY +=
      (mouse.y / (props.staticity / circle.magnetism) - circle.translateY) / props.ease;

    // circle gets out of the canvas
    if (
      circle.x < -circle.size ||
      circle.x > canvasSize.w + circle.size ||
      circle.y < -circle.size ||
      circle.y > canvasSize.h + circle.size
    ) {
      // remove the circle from the array
      circles.value.splice(i, 1);
      // create a new circle
      const newCircle = circleParams();
      drawCircle(newCircle);
      // update the circle position
    } else {
      drawCircle(
        {
          ...circle,
          x: circle.x,
          y: circle.y,
          translateX: circle.translateX,
          translateY: circle.translateY,
          alpha: circle.alpha,
        },
        true,
      );
    }
  }
}
</script>
