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
import { onMounted, onBeforeUnmount, ref, reactive, computed, watch, nextTick } from "vue";
import { useDevicePixelRatio } from "@vueuse/core";
import * as Matter from "matter-js";

type SplashParticle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
};

type WaterDrop = {
  x: number;
  y: number;
  size: number;
  stretchFactor: number; // For water droplet stretching effect
  wobblePhase: number; // For wobble animation
  wobbleSpeed: number; // Speed of wobble
  wobbleAmount: number; // Amount of wobble
  alpha: number;
  dx: number;
  dy: number;
  body?: Matter.Body; // Matter.js physics body
  toRemove?: boolean; // Flag to mark for removal
};

type Props = {
  color?: string;
  quantity?: number;
  speed?: number;
  dropSize?: number;
  class?: string;
  cursorRadius?: number; // Radius of cursor interaction
  debug?: boolean; // Show debug visuals
  splashParticles?: number; // Number of particles in splash
  wobbleAmount?: number; // Amount of wobble for water drops
  transparency?: number; // Base transparency for water drops
  collisionElement?: HTMLElement | null; // Element to create collision boundaries for
};

const props = withDefaults(defineProps<Props>(), {
  color: "FFFF99", // Raindrop color
  quantity: 30, // Increase quantity for more raindrops
  speed: 0.4, // Slightly faster drops
  dropSize: 5, // Slightly larger drops
  class: "",
  cursorRadius: 15, // Larger cursor interaction radius
  debug: false, // Debug mode off by default
  splashParticles: 8, // Default number of particles in splash
  wobbleAmount: 0.3, // Default wobble amount
  transparency: 0.8, // Increased transparency for better visibility
  collisionElement: null, // No collision element by default
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasContainerRef = ref<HTMLDivElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const waterDrops = ref<WaterDrop[]>([]);
const splashParticlesList = ref<SplashParticle[]>([]);
const canvasSize = reactive<{ w: number; h: number }>({ w: 0, h: 0 });
const { pixelRatio } = useDevicePixelRatio();

// Matter.js variables
const engine = ref<Matter.Engine>();
const cursorBody = ref<Matter.Body>();
const frameBody = ref<Matter.Body>();
const mousePosition = reactive({ x: 0, y: 0 });
const isMouseInCanvas = ref(false);

// Animation timing
const time = ref(0);

// Watch for changes to the collision element
watch(
  () => props.collisionElement,
  (newElement) => {
    if (newElement && engine.value) {
      // Use nextTick to ensure the DOM is updated before measuring
      nextTick(() => {
        createFrameBody();
      });
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (canvasRef.value) {
    context.value = canvasRef.value.getContext("2d");
  }

  // Initialize Matter.js engine
  engine.value = Matter.Engine.create({
    gravity: { x: 0, y: 0.3 }, // Reduced gravity for smoother falling
    positionIterations: 8, // Increased for better precision
    velocityIterations: 6, // Increased for smoother movement
  });

  // Create cursor body
  cursorBody.value = Matter.Bodies.circle(
    -100, // Start off-screen
    -100,
    props.cursorRadius,
    {
      isStatic: true,
      restitution: 0, // No bounciness
      friction: 0,
      frictionAir: 0,
      render: { visible: false }, // Hide the cursor body in Matter.js rendering
      collisionFilter: {
        group: -1, // Negative group means it can collide with all other bodies
        category: 0x0002,
        mask: 0x0001,
      },
    },
  );

  // Add cursor body to the world
  Matter.Composite.add(engine.value.world, cursorBody.value);

  // Set up collision detection
  Matter.Events.on(engine.value, "collisionStart", handleCollision);

  initCanvas();
  setupMouseEvents();

  // Create frame body if collision element is provided
  // Delay frame creation to ensure DOM is ready
  nextTick(() => {
    if (props.collisionElement) {
      createFrameBody();
    }

    // Start animation after everything is set up
    animate();
  });

  window.addEventListener("resize", initCanvas);

  // Add a ResizeObserver to track frame element size changes
  if (props.collisionElement) {
    const resizeObserver = new ResizeObserver(() => {
      nextTick(() => {
        createFrameBody();
      });
    });
    resizeObserver.observe(props.collisionElement);
  }
});

// Add a debug logging function with proper typing
function debugLog(...args: unknown[]): void {
  if (props.debug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

function createFrameBody() {
  if (!props.collisionElement || !engine.value) return;

  // Remove existing frame body if it exists
  if (frameBody.value) {
    Matter.Composite.remove(engine.value.world, frameBody.value);
  }

  // Get the position and dimensions of the frame element
  const rect = props.collisionElement.getBoundingClientRect();
  const canvasRect = canvasContainerRef.value?.getBoundingClientRect();

  if (!canvasRect) return;

  // Calculate position relative to the canvas
  const x = rect.left - canvasRect.left;
  const y = rect.top - canvasRect.top;
  const width = rect.width;
  const height = rect.height;

  // Create frame parts with proper rounded corners
  const thickness = 10; // Collision boundary thickness
  const cornerRadius = 12; // Matches rounded-xl (12px)
  const innerCornerRadius = 8; // Matches rounded-lg (8px)

  // Create vertices for the frame shape with rounded corners
  const vertices = [
    // Top edge with rounded corners
    { x: x + cornerRadius, y: y },
    { x: x + width - cornerRadius, y: y },
    // Top-right corner
    ...createArc(x + width - cornerRadius, y + cornerRadius, cornerRadius, -Math.PI / 2, 0, 8),
    // Right edge
    { x: x + width, y: y + cornerRadius },
    { x: x + width, y: y + height - cornerRadius },
    // Bottom-right corner
    ...createArc(
      x + width - cornerRadius,
      y + height - cornerRadius,
      cornerRadius,
      0,
      Math.PI / 2,
      8,
    ),
    // Bottom edge
    { x: x + width - cornerRadius, y: y + height },
    { x: x + cornerRadius, y: y + height },
    // Bottom-left corner
    ...createArc(
      x + cornerRadius,
      y + height - cornerRadius,
      cornerRadius,
      Math.PI / 2,
      Math.PI,
      8,
    ),
    // Left edge
    { x: x, y: y + height - cornerRadius },
    { x: x, y: y + cornerRadius },
    // Top-left corner
    ...createArc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, (3 * Math.PI) / 2, 8),
  ];

  // Create the frame body using vertices
  frameBody.value = Matter.Bodies.fromVertices(x + width / 2, y + height / 2, [vertices], {
    isStatic: true,
    restitution: 0.6,
    friction: 0.02,
    frictionAir: 0,
    render: { visible: false },
    collisionFilter: {
      group: 0,
      category: 0x0004,
      mask: 0x0001,
    },
    label: "frame",
  });

  // Add frame body to the world
  Matter.Composite.add(engine.value.world, frameBody.value);

  // Force an update to ensure collision detection is working
  Matter.Engine.update(engine.value, 0);

  // Log frame creation for debugging
  debugLog("Frame body created:", frameBody.value);
}

// Helper function to create arc vertices
function createArc(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  segments: number,
): { x: number; y: number }[] {
  const vertices = [];
  const angleStep = (endAngle - startAngle) / segments;

  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + angleStep * i;
    vertices.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return vertices;
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", initCanvas);

  // Remove mouse event listeners
  if (canvasContainerRef.value) {
    canvasContainerRef.value.removeEventListener("mousemove", handleMouseMove);
    canvasContainerRef.value.removeEventListener("mouseenter", handleMouseEnter);
    canvasContainerRef.value.removeEventListener("mouseleave", handleMouseLeave);
  }

  // Clean up Matter.js engine
  if (engine.value) {
    // Remove collision event listener
    Matter.Events.off(engine.value, "collisionStart", handleCollision);
    Matter.Engine.clear(engine.value);
  }
});

function handleCollision(event: Matter.IEventCollision<Matter.Engine>) {
  const pairs = event.pairs;

  debugLog("Collision detected:", pairs.length, "pairs");

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    let dropBody: Matter.Body | null = null;
    let isFrameCollision = false;
    let collisionPoint = { x: 0, y: 0 };
    let collisionNormal = { x: 0, y: 0 };

    // Store collision normal for better splash direction
    if (pair.collision && pair.collision.normal) {
      collisionNormal = pair.collision.normal;
    }

    // Check if one of the bodies is the cursor
    if (pair.bodyA === cursorBody.value || pair.bodyB === cursorBody.value) {
      dropBody = pair.bodyA === cursorBody.value ? pair.bodyB : pair.bodyA;
      collisionPoint =
        pair.collision.supports && pair.collision.supports.length > 0
          ? pair.collision.supports[0]
          : dropBody.position;

      debugLog("Cursor collision with:", dropBody.label);
    }
    // Check if one of the bodies is part of the frame
    else if (frameBody.value) {
      // Check if either body is part of the frame compound body
      const bodyAIsFrame =
        pair.bodyA.parent === frameBody.value ||
        frameBody.value.parts.includes(pair.bodyA) ||
        (pair.bodyA.label && pair.bodyA.label.includes("frame"));

      const bodyBIsFrame =
        pair.bodyB.parent === frameBody.value ||
        frameBody.value.parts.includes(pair.bodyB) ||
        (pair.bodyB.label && pair.bodyB.label.includes("frame"));

      if (bodyAIsFrame || bodyBIsFrame) {
        // Determine which body is the water drop
        dropBody = bodyAIsFrame ? pair.bodyB : pair.bodyA;
        isFrameCollision = true;

        // Get collision point - use support point if available, otherwise use drop position
        collisionPoint =
          pair.collision.supports && pair.collision.supports.length > 0
            ? pair.collision.supports[0]
            : dropBody.position;

        debugLog("Frame collision with:", dropBody.label, "at point:", collisionPoint);
      }
    }

    if (dropBody) {
      // Find the water drop that corresponds to this body
      const dropIndex = waterDrops.value.findIndex((d) => d.body === dropBody);

      if (dropIndex !== -1) {
        const drop = waterDrops.value[dropIndex];

        // Create splash effect at the collision point
        createSplash(
          collisionPoint.x || drop.x,
          collisionPoint.y || drop.y,
          drop.size,
          collisionNormal,
        );

        // For frame collisions, remove the drop and create splash effect
        if (isFrameCollision) {
          // Mark drop for removal
          drop.toRemove = true;

          // Remove the body from the world
          if (engine.value && drop.body) {
            Matter.Composite.remove(engine.value.world, drop.body);
          }

          // Create a new water drop to replace it
          const newDrop = createWaterDrop(true);
          waterDrops.value.push(newDrop);

          // Remove the old drop from the array
          waterDrops.value.splice(dropIndex, 1);
        } else {
          // For cursor collisions, handle as before
          drop.toRemove = true;

          // Remove the body from the world
          if (engine.value && drop.body) {
            Matter.Composite.remove(engine.value.world, drop.body);
          }

          // Create a new water drop to replace it
          const newDrop = createWaterDrop(true);
          waterDrops.value.push(newDrop);

          // Remove the old drop from the array
          waterDrops.value.splice(dropIndex, 1);
        }
      }
    }
  }
}

function createSplash(x: number, y: number, size: number, normal = { x: 0, y: 0 }) {
  // Create splash particles
  for (let i = 0; i < props.splashParticles; i++) {
    let angle;
    if (normal.x !== 0 || normal.y !== 0) {
      const baseAngle = Math.atan2(-normal.y, -normal.x);
      angle = baseAngle + (Math.random() - 0.5) * Math.PI * 0.8; // Reduced spread
    } else {
      angle = Math.PI * 2 * (i / props.splashParticles);
    }

    const speed = 0.5 + Math.random() * 1.5; // Reduced speed for smoother splashes
    const radius = Math.max(size * 0.4, 0.8) * (0.6 + Math.random() * 0.4);
    const life = 0;
    const maxLife = 25 + Math.random() * 20; // Longer life for smoother fading

    splashParticlesList.value.push({
      x,
      y,
      radius,
      alpha: 0.8 + Math.random() * 0.2, // Higher base opacity
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life,
      maxLife,
    });
  }

  // Fewer but more visible extra particles
  const extraParticles = Math.floor(Math.random() * 4) + 3;
  for (let i = 0; i < extraParticles; i++) {
    let angle;
    if (normal.x !== 0 || normal.y !== 0) {
      const baseAngle = Math.atan2(-normal.y, -normal.x);
      angle = baseAngle + (Math.random() - 0.5) * Math.PI;
    } else {
      angle = Math.random() * Math.PI * 2;
    }

    const speed = 0.8 + Math.random() * 1.8;
    const radius = Math.max(size * 0.3, 0.6) * (0.4 + Math.random() * 0.6);
    const life = 0;
    const maxLife = 20 + Math.random() * 15;

    splashParticlesList.value.push({
      x,
      y,
      radius,
      alpha: 0.9 + Math.random() * 0.1,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life,
      maxLife,
    });
  }
}

function setupMouseEvents() {
  if (canvasContainerRef.value) {
    canvasContainerRef.value.addEventListener("mousemove", handleMouseMove);
    canvasContainerRef.value.addEventListener("mouseenter", handleMouseEnter);
    canvasContainerRef.value.addEventListener("mouseleave", handleMouseLeave);
  }
}

function handleMouseEnter() {
  isMouseInCanvas.value = true;
}

function handleMouseMove(event: MouseEvent) {
  const rect = canvasContainerRef.value?.getBoundingClientRect();
  if (rect && cursorBody.value) {
    mousePosition.x = event.clientX - rect.left;
    mousePosition.y = event.clientY - rect.top;

    // Update cursor body position
    Matter.Body.setPosition(cursorBody.value, {
      x: mousePosition.x,
      y: mousePosition.y,
    });
  }
}

function handleMouseLeave() {
  isMouseInCanvas.value = false;
  if (cursorBody.value) {
    // Move cursor body off-screen when mouse leaves
    Matter.Body.setPosition(cursorBody.value, {
      x: -100,
      y: -100,
    });
  }
}

function initCanvas() {
  resizeCanvas();
  createWaterDrops();
  splashParticlesList.value = []; // Clear splash particles
}

function resizeCanvas() {
  if (canvasContainerRef.value && canvasRef.value && context.value) {
    waterDrops.value.length = 0;
    canvasSize.w = canvasContainerRef.value.offsetWidth;
    canvasSize.h = canvasContainerRef.value.offsetHeight;
    canvasRef.value.width = canvasSize.w * pixelRatio.value;
    canvasRef.value.height = canvasSize.h * pixelRatio.value;
    canvasRef.value.style.width = `${canvasSize.w}px`;
    canvasRef.value.style.height = `${canvasSize.h}px`;
    context.value.scale(pixelRatio.value, pixelRatio.value);

    // Clear existing bodies from the world
    if (engine.value) {
      Matter.Composite.clear(engine.value.world, false, true);

      // Re-add cursor body
      if (cursorBody.value) {
        Matter.Composite.add(engine.value.world, cursorBody.value);
      }

      // Recreate frame body if collision element is provided
      if (props.collisionElement) {
        createFrameBody();
      }
    }
  }
}

function createWaterDrops() {
  for (let i = 0; i < props.quantity; i++) {
    const drop = createWaterDrop();
    waterDrops.value.push(drop);
  }
}

function createWaterDrop(atTop = false): WaterDrop {
  const x = Math.random() * canvasSize.w;
  const y = atTop ? -20 - Math.random() * 100 : Math.random() * canvasSize.h;

  const size = props.dropSize * (0.8 + Math.random() * 0.4); // More consistent sizes
  const alpha = props.transparency * (0.85 + Math.random() * 0.15); // More consistent transparency

  // Smoother wobble animation
  const wobblePhase = Math.random() * Math.PI * 2;
  const wobbleSpeed = 0.03 + Math.random() * 0.02; // Slower wobble
  const wobbleAmount = props.wobbleAmount * (0.5 + Math.random() * 0.3); // Reduced wobble

  const stretchFactor = 1.0;

  // More controlled horizontal movement
  const dx = (Math.random() - 0.5) * 0.1; // Reduced horizontal drift
  const dy = props.speed * (0.9 + Math.random() * 0.2); // More consistent vertical speed

  // Create Matter.js body with improved physics properties
  const body = Matter.Bodies.circle(x, y, size, {
    restitution: 0.3, // Reduced bounce
    friction: 0.005, // Less friction
    frictionAir: 0.001, // Less air resistance
    density: 0.0005, // Lighter drops
    slop: 0.02, // More precise collisions
    label: "waterDrop",
    collisionFilter: {
      group: 1,
      category: 0x0001,
      mask: 0x0006,
    },
  });

  // Set initial velocity
  Matter.Body.setVelocity(body, { x: dx, y: dy });

  if (engine.value) {
    Matter.Composite.add(engine.value.world, body);
  }

  return {
    x,
    y,
    size,
    stretchFactor,
    wobblePhase,
    wobbleSpeed,
    wobbleAmount,
    alpha,
    dx,
    dy,
    body,
    toRemove: false,
  };
}

function drawWaterDrop(drop: WaterDrop) {
  if (context.value) {
    const { x, y, size, stretchFactor, wobblePhase, wobbleAmount, alpha } = drop;

    context.value.save();
    context.value.translate(x, y);

    // Calculate wobble effect based on time
    const wobbleX = Math.sin(wobblePhase + time.value * drop.wobbleSpeed) * wobbleAmount;

    // Draw the water drop (teardrop shape)
    context.value.beginPath();

    // Create a teardrop/droplet shape
    const dropHeight = size * (1 + stretchFactor * 0.5);

    // Draw the main body of the drop
    context.value.moveTo(0, -dropHeight);

    // Left side with wobble
    context.value.bezierCurveTo(
      -size - wobbleX,
      -dropHeight * 0.5,
      -size - wobbleX,
      dropHeight * 0.3,
      0,
      dropHeight,
    );

    // Right side with wobble (opposite direction)
    context.value.bezierCurveTo(
      size - wobbleX,
      dropHeight * 0.3,
      size - wobbleX,
      -dropHeight * 0.5,
      0,
      -dropHeight,
    );

    // Fill the drop with a semi-transparent color
    const rgbValues =
      props.color
        .replace(/^#/, "")
        .match(/.{2}/g)
        ?.map((hex) => parseInt(hex, 16))
        .join(", ") || "100, 116, 139";

    // Create a gradient fill for more realistic water appearance
    const gradient = context.value.createRadialGradient(
      size * 0.25,
      -size * 0.25,
      0,
      0,
      0,
      dropHeight,
    );
    gradient.addColorStop(0, `rgba(${rgbValues}, ${alpha * 1.5})`);
    gradient.addColorStop(0.5, `rgba(${rgbValues}, ${alpha * 1.2})`);
    gradient.addColorStop(1, `rgba(${rgbValues}, ${alpha * 0.8})`);

    context.value.fillStyle = gradient;
    context.value.fill();

    // Add a subtle outline for better visibility
    context.value.strokeStyle = `rgba(${rgbValues}, ${alpha * 0.3})`;
    context.value.lineWidth = 0.5;
    context.value.stroke();

    // Add a highlight/reflection
    context.value.beginPath();
    context.value.ellipse(size * 0.25, -size * 0.25, size * 0.4, size * 0.25, 0, 0, Math.PI * 2);
    context.value.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
    context.value.fill();

    context.value.restore();
  }
}

function drawSplashParticles() {
  if (context.value) {
    // Update and draw splash particles
    for (let i = splashParticlesList.value.length - 1; i >= 0; i--) {
      const particle = splashParticlesList.value[i];

      // Update position
      particle.x += particle.dx;
      particle.y += particle.dy;

      // Add gravity effect to particles - stronger gravity for more realistic physics
      particle.dy += 0.08;

      // Slow down particles over time - different rates for x and y for more natural movement
      particle.dx *= 0.96;
      particle.dy *= 0.98;

      // Update life
      particle.life += 1;

      // Calculate alpha based on life - non-linear fade out for more natural look
      const lifeRatio = particle.life / particle.maxLife;
      const alpha = particle.alpha * Math.pow(1 - lifeRatio, 1.2);

      // Shrink particles as they age - non-linear shrinking
      const currentRadius = particle.radius * (1 - Math.pow(lifeRatio, 1.5) * 0.7);

      // Draw particle
      context.value.beginPath();
      context.value.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);

      // Use a slightly brighter color for splash particles
      const rgbValues =
        props.color
          .replace(/^#/, "")
          .match(/.{2}/g)
          ?.map((hex) => parseInt(hex, 16))
          .join(", ") || "100, 116, 139";

      // Add a slight glow effect for more visible splashes
      if (lifeRatio < 0.3) {
        // Only add glow to newer particles
        context.value.shadowColor = `rgba(${rgbValues}, ${alpha * 0.7})`;
        context.value.shadowBlur = 3;
      } else {
        context.value.shadowBlur = 0;
      }

      context.value.fillStyle = `rgba(${rgbValues}, ${alpha})`;
      context.value.fill();

      // Add a highlight to some particles - more dynamic highlights
      if (Math.random() > 0.5 || particle.life < 5) {
        // Always add highlight to new particles
        context.value.beginPath();
        // Offset the highlight based on velocity direction for more dynamic look
        const highlightOffsetX = particle.dx > 0 ? 1 : -1;
        const highlightOffsetY = particle.dy > 0 ? 1 : -1;
        context.value.arc(
          particle.x + highlightOffsetX * currentRadius * 0.3,
          particle.y + highlightOffsetY * currentRadius * 0.3,
          currentRadius * 0.4,
          0,
          Math.PI * 2,
        );
        context.value.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        context.value.fill();
      }

      // Reset shadow settings
      context.value.shadowBlur = 0;

      // Remove if life is over
      if (particle.life >= particle.maxLife) {
        splashParticlesList.value.splice(i, 1);
      }
    }
  }
}

function drawDebug() {
  if (context.value && props.debug) {
    // Draw cursor interaction area if mouse is in canvas
    if (isMouseInCanvas.value) {
      context.value.beginPath();
      context.value.arc(mousePosition.x, mousePosition.y, props.cursorRadius, 0, Math.PI * 2);
      context.value.strokeStyle = "rgba(255, 0, 0, 0.5)";
      context.value.lineWidth = 1;
      context.value.stroke();
    }

    // Draw frame collision boundary if it exists
    if (frameBody.value && props.collisionElement && context.value) {
      // Draw each part of the frame body
      frameBody.value.parts.forEach((part, index) => {
        // Skip the parent body (index 0)
        if (index === 0 || !context.value) return;

        const position = part.position;
        const bounds = part.bounds;
        const width = bounds.max.x - bounds.min.x;
        const height = bounds.max.y - bounds.min.y;

        context.value.beginPath();
        context.value.rect(position.x - width / 2, position.y - height / 2, width, height);

        // Use different colors for different parts
        const colors = [
          "rgba(0, 255, 0, 0.5)",
          "rgba(255, 255, 0, 0.5)",
          "rgba(0, 255, 255, 0.5)",
          "rgba(255, 0, 255, 0.5)",
        ];
        context.value.strokeStyle = colors[index % colors.length];
        context.value.lineWidth = 1;
        context.value.stroke();

        // Add label to identify the part
        context.value.fillStyle = "rgba(255, 255, 255, 0.8)";
        context.value.font = "10px Arial";
        context.value.fillText(part.label || `Part ${index}`, position.x - 20, position.y);
      });

      // Draw water drop collision bodies if debug is enabled
      waterDrops.value.forEach((drop) => {
        if (drop.body && context.value) {
          const position = drop.body.position;
          const radius = drop.size;

          context.value.beginPath();
          context.value.arc(position.x, position.y, radius, 0, Math.PI * 2);
          context.value.strokeStyle = "rgba(0, 0, 255, 0.5)";
          context.value.lineWidth = 1;
          context.value.stroke();

          // Draw velocity vector
          const velocity = drop.body.velocity;
          const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
          if (speed > 0.5) {
            context.value.beginPath();
            context.value.moveTo(position.x, position.y);
            context.value.lineTo(position.x + velocity.x * 5, position.y + velocity.y * 5);
            context.value.strokeStyle = "rgba(255, 0, 0, 0.7)";
            context.value.lineWidth = 1;
            context.value.stroke();
          }
        }
      });

      // Draw splash particles for debugging
      splashParticlesList.value.forEach((particle) => {
        context.value!.beginPath();
        context.value!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.value!.strokeStyle = "rgba(255, 255, 0, 0.5)";
        context.value!.lineWidth = 0.5;
        context.value!.stroke();
      });
    }
  }
}

function updateFramePosition() {
  if (!props.collisionElement || !frameBody.value || !engine.value) return;

  // Get the updated position of the frame element
  const rect = props.collisionElement.getBoundingClientRect();
  const canvasRect = canvasContainerRef.value?.getBoundingClientRect();

  if (!canvasRect) return;

  // Calculate position relative to the canvas
  const x = rect.left - canvasRect.left + rect.width / 2;
  const y = rect.top - canvasRect.top + rect.height / 2;

  // Update the frame body position
  Matter.Body.setPosition(frameBody.value, { x, y });
}

function animate() {
  if (context.value) {
    context.value.clearRect(0, 0, canvasSize.w, canvasSize.h);
  }

  // Update time for animations
  time.value += 0.016; // Approximately 60fps

  // Update physics engine
  if (engine.value) {
    Matter.Engine.update(engine.value, 1000 / 60); // Update at 60fps
  }

  // Update frame position if needed
  if (props.collisionElement && frameBody.value) {
    updateFramePosition();
  }

  // Draw splash particles
  drawSplashParticles();

  // Update and draw water drops
  waterDrops.value.forEach((drop) => {
    if (drop.body && !drop.toRemove) {
      // Update drop position from physics body
      const position = drop.body.position;
      drop.x = position.x;
      drop.y = position.y;

      // Get velocity for stretching effect
      const velocity = drop.body.velocity;

      // Calculate stretch factor based on vertical velocity
      // Faster falling = more stretched
      drop.stretchFactor = 1 + Math.min(Math.abs(velocity.y) * 0.05, 1.2);

      // Check if drop is out of bounds
      const isOutOfBounds =
        drop.x < -50 || drop.y < -50 || drop.x > canvasSize.w + 50 || drop.y > canvasSize.h + 50;

      if (isOutOfBounds) {
        // Reset drop position to start again from the top
        const newDrop = createWaterDrop(true);

        // Update the current drop with new values
        drop.x = newDrop.x;
        drop.y = newDrop.y;
        drop.dx = newDrop.dx;
        drop.dy = newDrop.dy;
        drop.size = newDrop.size;
        drop.wobblePhase = newDrop.wobblePhase;
        drop.wobbleSpeed = newDrop.wobbleSpeed;
        drop.wobbleAmount = newDrop.wobbleAmount;

        // Update the physics body
        Matter.Body.setPosition(drop.body, { x: newDrop.x, y: newDrop.y });
        Matter.Body.setVelocity(drop.body, { x: newDrop.dx, y: newDrop.dy });

        // Clean up the temporary drop
        if (newDrop.body && engine.value) {
          Matter.Composite.remove(engine.value.world, newDrop.body);
        }
      }

      drawWaterDrop(drop);
    }
  });

  // Draw debug visuals if enabled
  drawDebug();

  requestAnimationFrame(animate);
}
</script>
