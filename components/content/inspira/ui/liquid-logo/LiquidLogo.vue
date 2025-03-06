<template>
  <div
    v-if="processing"
    class="flex size-full items-center justify-center text-2xl font-bold text-primary/50"
  >
    <span> Processing Logo </span>
  </div>
  <canvas
    ref="liquidLogoRef"
    :class="cn('block size-full object-contain', props.class, { hidden: processing })"
  ></canvas>
</template>

<script lang="ts" setup>
import { type HTMLAttributes } from "vue";
import { liquidFragSource, vertexShaderSource } from "./shader";
import { parseLogoImage } from "./parseLogoImage";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  imageUrl: string;
  patternScale?: number;
  refraction?: number;
  edge?: number;
  patternBlur?: number;
  liquid?: number;
  speed?: number;
}

const props = withDefaults(defineProps<Props>(), {
  refraction: 0.015,
  edge: 0.4,
  patternScale: 2,
  patternBlur: 0.005,
  liquid: 0.07,
  speed: 0.3,
});

const emit = defineEmits(["loaded"]);

const imageData = ref<ImageData | null>(null);
const glRef = ref<WebGLRenderingContext | null>(null);
const uniforms = ref<Record<string, WebGLUniformLocation>>({});
const totalAnimationTime = ref(0);
const lastRenderTime = ref(0);
const liquidLogoRef = ref<HTMLCanvasElement | null>(null);
const processing = ref(false);
const isVisible = ref(false);
const animationPaused = ref(false);

let renderId: number;
let cleanUpTexture: (() => void) | undefined;

onMounted(async () => {
  processing.value = true;

  // Use IntersectionObserver to only animate when visible
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.value = entry.isIntersecting;
          if (entry.isIntersecting && animationPaused.value) {
            animationPaused.value = false;
            animate();
          } else if (!entry.isIntersecting && !animationPaused.value) {
            animationPaused.value = true;
            cancelAnimationFrame(renderId);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (liquidLogoRef.value) {
      observer.observe(liquidLogoRef.value);
    }
  }

  // Defer WebGL initialization to improve initial page load
  await nextTick();

  // Use requestIdleCallback if available to initialize during idle time
  if (typeof window.requestIdleCallback !== "undefined") {
    window.requestIdleCallback(
      async () => {
        await initializeWebGL();
      },
      { timeout: 1000 },
    );
  } else {
    // Fallback to setTimeout for browsers that don't support requestIdleCallback
    setTimeout(async () => {
      await initializeWebGL();
    }, 200);
  }

  window.addEventListener("resize", handleResize);
});

async function initializeWebGL() {
  await processImage();
  initShader();
  updateUniforms();
  cleanUpTexture = await cleanTexture();
  processing.value = false;
  resizeCanvas();

  // Emit loaded event
  emit("loaded");

  if (isVisible.value) {
    animate();
  }
}

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  cancelAnimationFrame(renderId);
  if (cleanUpTexture) {
    cleanUpTexture();
  }
});

// Debounced resize handler
const handleResize = useDebounceFn(() => {
  resizeCanvas();
}, 200);

function updateUniforms() {
  if (!glRef.value || !uniforms.value) return;

  // Add null checks for each uniform
  if (uniforms.value.u_edge) {
    glRef.value.uniform1f(uniforms.value.u_edge, props.edge);
  }
  if (uniforms.value.u_patternBlur) {
    glRef.value.uniform1f(uniforms.value.u_patternBlur, props.patternBlur);
  }
  if (uniforms.value.u_time) {
    glRef.value.uniform1f(uniforms.value.u_time, 0);
  }
  if (uniforms.value.u_patternScale) {
    glRef.value.uniform1f(uniforms.value.u_patternScale, props.patternScale);
  }
  if (uniforms.value.u_refraction) {
    glRef.value.uniform1f(uniforms.value.u_refraction, props.refraction);
  }
  if (uniforms.value.u_liquid) {
    glRef.value.uniform1f(uniforms.value.u_liquid, props.liquid);
  }
}

function initShader() {
  const canvas = liquidLogoRef.value;
  const gl = canvas?.getContext("webgl2", {
    antialias: true,
    alpha: true,
    powerPreference: "low-power", // Use low power mode for better performance
  });
  if (!canvas || !gl) {
    // "Failed to initialize shader. Does your browser support WebGL2?";
    return;
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function createShader(gl: WebGL2RenderingContext, sourceCode: string, type: number) {
    const shader = gl.createShader(type);
    if (!shader) {
      // "Failed to create shader";
      return null;
    }

    gl.shaderSource(shader, sourceCode);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = createShader(gl, liquidFragSource, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program || !vertexShader || !fragmentShader) {
    // "Failed to create program or shaders";
    return;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // "Unable to initialize the shader program: " + gl.getProgramInfoLog(program);
    return null;
  }

  function getUniforms(program: WebGLProgram, gl: WebGL2RenderingContext) {
    let uniforms: Record<string, WebGLUniformLocation> = {};
    let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      let uniformName = gl.getActiveUniform(program, i)?.name;
      if (!uniformName) continue;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName) as WebGLUniformLocation;
    }
    return uniforms;
  }
  const unfm = getUniforms(program, gl);
  uniforms.value = unfm;

  // Vertex position
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  glRef.value = gl;
}

function render(currentTime: number) {
  if (animationPaused.value) return;

  const deltaTime = currentTime - lastRenderTime.value;
  lastRenderTime.value = currentTime;

  // Limit animation speed for better performance
  const cappedDeltaTime = Math.min(deltaTime, 32); // Cap at ~30fps

  // Update the total animation time and time uniform
  totalAnimationTime.value += cappedDeltaTime * props.speed;

  // Add null checks to prevent the error
  if (glRef.value && uniforms.value && uniforms.value.u_time) {
    glRef.value.uniform1f(uniforms.value.u_time, totalAnimationTime.value);
    // Draw!
    glRef.value.drawArrays(glRef.value.TRIANGLE_STRIP, 0, 4);
  }

  // rAF
  renderId = requestAnimationFrame(render);
}

function animate() {
  if (animationPaused.value) return;

  // Kick off the render loop
  lastRenderTime.value = performance.now();
  renderId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(renderId);
  };
}

function resizeCanvas() {
  const canvasEl = liquidLogoRef.value;
  const gl = glRef.value;

  if (!canvasEl || !gl || !uniforms.value) return;

  // Check if u_img_ratio uniform exists before using it
  if (uniforms.value.u_img_ratio) {
    const imgRatio = imageData.value ? imageData.value.width / imageData.value.height : 1;
    gl.uniform1f(uniforms.value.u_img_ratio, imgRatio);

    // Use a smaller canvas size for better performance
    const side = Math.min(800, window.innerWidth);
    canvasEl.width = side * Math.min(devicePixelRatio, 2);
    canvasEl.height = side * Math.min(devicePixelRatio, 2);
    gl.viewport(0, 0, canvasEl.height, canvasEl.height);

    // Add null checks for each uniform
    if (uniforms.value.u_ratio) {
      gl.uniform1f(uniforms.value.u_ratio, 1);
    }
    if (uniforms.value.u_img_ratio) {
      gl.uniform1f(uniforms.value.u_img_ratio, imgRatio);
    }
  }
}

async function processImage() {
  try {
    const { imageData: imgData } = await parseLogoImage(props.imageUrl);
    imageData.value = imgData;
  } catch (error) {
    // handle error
  }
}

async function cleanTexture() {
  const gl = glRef.value;
  if (!gl || !uniforms.value || !imageData.value) return;

  // Delete any existing texture first
  const existingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
  if (existingTexture) {
    gl.deleteTexture(existingTexture);
  }

  // Create a new texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Upload the image data to the texture
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    imageData.value.width,
    imageData.value.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    imageData.value.data,
  );

  // Set the texture uniform
  if (uniforms.value.u_texture) {
    gl.uniform1i(uniforms.value.u_texture, 0);
  }

  return () => {
    if (gl && texture) {
      gl.deleteTexture(texture);
    }
  };
}
</script>
