<template>
  <div
    ref="containerRef"
    class="fixed inset-0 size-full"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

interface ParticlesProps {
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleColors?: string[];
  moveParticlesOnHover?: boolean;
  particleHoverFactor?: number;
  alphaParticles?: boolean;
  particleBaseSize?: number;
  sizeRandomness?: number;
  cameraDistance?: number;
  disableRotation?: boolean;
}

const props = withDefaults(defineProps<ParticlesProps>(), {
  particleCount: 200,
  particleSpread: 10,
  speed: 0.1,
  particleColors: () => ["#ffffff", "#ffffff", "#ffffff"],
  moveParticlesOnHover: false,
  particleHoverFactor: 1,
  alphaParticles: false,
  particleBaseSize: 100,
  sizeRandomness: 1,
  cameraDistance: 20,
  disableRotation: false,
});

const containerRef = ref<HTMLDivElement | null>(null);
const mousePosition = ref({ x: 0, y: 0 });
let renderer: any = null;
let gl: any = null;
let camera: any = null;
let particles: any = null;
let animationFrameId: number | null = null;
let lastTime = 0;
let elapsed = 0;

// GLSL Shaders
const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  uniform float uAlphaParticles;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    if(uAlphaParticles < 0.5) {
      if(d > 0.5) {
        discard;
      }
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), 1.0);
    } else {
      float circle = smoothstep(0.5, 0.4, d) * 0.8;
      gl_FragColor = vec4(vColor + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
    }
  }
`;

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
}

// Define resize and mouse move handlers
function resize() {
  if (!containerRef.value || !gl || !renderer || !camera) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.perspective({ aspect: width / height });
}

function handleMouseMove(e: MouseEvent) {
  if (!containerRef.value) return;
  // Use window dimensions for full-page tracking
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -((e.clientY / window.innerHeight) * 2 - 1);
  mousePosition.value = { x, y };
}

// Setup function to initialize particles
async function setupParticles() {
  const container = containerRef.value;
  if (!container) return;

  try {
    // Import OGL dynamically
    const OGL = await import("ogl");
    if (!OGL) return;

    const { Renderer, Camera, Geometry, Program, Mesh } = OGL;

    renderer = new Renderer({
      depth: false,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.clearColor(0, 0, 0, 0);

    // Set canvas to fill the container
    gl.canvas.style.position = "absolute";
    gl.canvas.style.top = "0";
    gl.canvas.style.left = "0";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    camera = new Camera(gl, { fov: 15 });
    camera.position.set(0, 0, props.cameraDistance);

    // Add resize listener to window
    window.addEventListener("resize", resize, false);
    resize();

    // Add mousemove listener to window for full-page tracking
    if (props.moveParticlesOnHover) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const count = props.particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const palette = props.particleColors;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: props.particleSpread },
        uBaseSize: { value: props.particleBaseSize },
        uSizeRandomness: { value: props.sizeRandomness },
        uAlphaParticles: { value: props.alphaParticles ? 1 : 0 },
      },
      transparent: true,
      depthTest: false,
    });

    particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    lastTime = performance.now();
    elapsed = 0;

    function update(t: number) {
      if (!renderer || !camera || !particles) return;

      animationFrameId = requestAnimationFrame(update);
      const delta = Math.min(t - lastTime, 100); // Cap delta to prevent jumps
      lastTime = t;
      elapsed += delta * props.speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      if (props.moveParticlesOnHover) {
        // Smooth movement with lerp for better feel
        const targetX = -mousePosition.value.x * props.particleHoverFactor;
        const targetY = -mousePosition.value.y * props.particleHoverFactor;
        particles.position.x += (targetX - particles.position.x) * 0.05;
        particles.position.y += (targetY - particles.position.y) * 0.05;
      } else {
        particles.position.x = 0;
        particles.position.y = 0;
      }

      if (!props.disableRotation) {
        particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1;
        particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15;
        particles.rotation.z += 0.01 * props.speed;
      }

      renderer.render({ scene: particles, camera });
    }

    animationFrameId = requestAnimationFrame(update);
  } catch (error) {
    // Log error but don't crash
    console.error("Error initializing WebGL particles:", error);
  }
}

// Lifecycle hooks
onMounted(() => {
  setupParticles();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);

  if (props.moveParticlesOnHover) {
    window.removeEventListener("mousemove", handleMouseMove);
  }

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  if (containerRef.value && gl && containerRef.value.contains(gl.canvas)) {
    containerRef.value.removeChild(gl.canvas);
  }
});

// Watch for prop changes
watch(
  () => props,
  () => {
    // Clean up and reinitialize when props change
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (containerRef.value && gl && containerRef.value.contains(gl.canvas)) {
      containerRef.value.removeChild(gl.canvas);
    }

    // Re-initialize particles
    setupParticles();
  },
  { deep: true },
);
</script>

<style scoped>
:deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Allow clicking through the canvas */
}
</style>
