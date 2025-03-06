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
import { onMounted, onBeforeUnmount, ref, reactive, computed, watch } from "vue";
import { useDevicePixelRatio } from "@vueuse/core";
import * as Matter from "matter-js";
import anime from "animejs";

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
  animeInstance?: anime.AnimeInstance; // Anime.js instance for animation
};

type Props = {
  color?: string;
  quantity?: number;
  speed?: number;
  dropSize?: number;
  class?: string;
  cursorRadius?: number; // Radius of cursor interaction
  cursorForce?: number; // Force of cursor repulsion
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
  cursorForce: 0.005, // Default cursor repulsion force
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

// Collision detection
const collisionStarted = ref(false);

// Animation timing
const time = ref(0);

// Watch for changes to the collision element
watch(
  () => props.collisionElement,
  (newElement) => {
    if (newElement && engine.value) {
      createFrameBody();
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
    gravity: { x: 0, y: 0.5 }, // Light gravity for water drops
    positionIterations: 6, // Increase position iterations for better collision detection
    velocityIterations: 4, // Increase velocity iterations for smoother physics
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

  // Create frame body if collision element is provided
  if (props.collisionElement) {
    createFrameBody();
  }

  // Set up collision detection
  Matter.Events.on(engine.value, "collisionStart", handleCollision);

  initCanvas();
  setupMouseEvents();
  animate();

  window.addEventListener("resize", initCanvas);
});

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
  const x = rect.left - canvasRect.left + rect.width / 2;
  const y = rect.top - canvasRect.top + rect.height / 2;

  // Create frame parts - top, bottom, left, right edges instead of a single rectangle
  // This creates a more realistic collision surface
  const thickness = 4; // Thickness of the collision boundary

  // Top edge
  const topEdge = Matter.Bodies.rectangle(
    x,
    y - rect.height / 2 + thickness / 2,
    rect.width,
    thickness,
    {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      render: { visible: false },
      collisionFilter: {
        group: -1,
        category: 0x0004,
        mask: 0x0001,
      },
    },
  );

  // Bottom edge
  const bottomEdge = Matter.Bodies.rectangle(
    x,
    y + rect.height / 2 - thickness / 2,
    rect.width,
    thickness,
    {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      render: { visible: false },
      collisionFilter: {
        group: -1,
        category: 0x0004,
        mask: 0x0001,
      },
    },
  );

  // Left edge
  const leftEdge = Matter.Bodies.rectangle(
    x - rect.width / 2 + thickness / 2,
    y,
    thickness,
    rect.height,
    {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      render: { visible: false },
      collisionFilter: {
        group: -1,
        category: 0x0004,
        mask: 0x0001,
      },
    },
  );

  // Right edge
  const rightEdge = Matter.Bodies.rectangle(
    x + rect.width / 2 - thickness / 2,
    y,
    thickness,
    rect.height,
    {
      isStatic: true,
      restitution: 0.5,
      friction: 0.1,
      render: { visible: false },
      collisionFilter: {
        group: -1,
        category: 0x0004,
        mask: 0x0001,
      },
    },
  );

  // Create a compound body from the edges
  frameBody.value = Matter.Body.create({
    parts: [topEdge, bottomEdge, leftEdge, rightEdge],
    isStatic: true,
  });

  // Add frame body to the world
  Matter.Composite.add(engine.value.world, frameBody.value);
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

  // Stop all anime.js animations
  waterDrops.value.forEach((drop) => {
    if (drop.animeInstance) {
      drop.animeInstance.pause();
    }
  });
});

function handleCollision(event: Matter.IEventCollision<Matter.Engine>) {
  const pairs = event.pairs;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    let dropBody: Matter.Body | null = null;
    let isFrameCollision = false;
    let collisionPoint = { x: 0, y: 0 };

    // Check if one of the bodies is the cursor
    if (pair.bodyA === cursorBody.value || pair.bodyB === cursorBody.value) {
      dropBody = pair.bodyA === cursorBody.value ? pair.bodyB : pair.bodyA;
      collisionPoint = pair.collision.supports[0] || pair.bodyA.position;
    }
    // Check if one of the bodies is part of the frame
    else if (
      frameBody.value &&
      (frameBody.value.parts.includes(pair.bodyA) || frameBody.value.parts.includes(pair.bodyB))
    ) {
      dropBody = frameBody.value.parts.includes(pair.bodyA) ? pair.bodyB : pair.bodyA;
      isFrameCollision = true;
      collisionPoint = pair.collision.supports[0] || dropBody.position;
    }

    if (dropBody) {
      // Find the water drop that corresponds to this body
      const dropIndex = waterDrops.value.findIndex((d) => d.body === dropBody);

      if (dropIndex !== -1) {
        const drop = waterDrops.value[dropIndex];

        // Create splash effect at the collision point
        createSplash(collisionPoint.x || drop.x, collisionPoint.y || drop.y, drop.size);

        // For frame collisions, we might want to keep the drop but change its velocity
        if (isFrameCollision) {
          // Bounce the drop with reduced velocity
          if (drop.body) {
            const velocity = drop.body.velocity;
            // Add some randomness to the bounce for more natural effect
            Matter.Body.setVelocity(drop.body, {
              x: velocity.x * -0.7 + (Math.random() - 0.5) * 1,
              y: velocity.y * -0.5 + (Math.random() - 0.5) * 0.5,
            });

            // Increase wobble amount temporarily for a "splash" effect
            drop.wobbleAmount = props.wobbleAmount * 2;

            // Reset wobble amount after a short delay
            setTimeout(() => {
              if (!drop.toRemove) {
                drop.wobbleAmount = props.wobbleAmount * (0.7 + Math.random() * 0.6);
              }
            }, 300);
          }
        } else {
          // For cursor collisions, remove the drop and create a new one
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
        }
      }
    }
  }
}

function createSplash(x: number, y: number, size: number) {
  // Create splash particles
  for (let i = 0; i < props.splashParticles; i++) {
    const angle = Math.PI * 2 * (i / props.splashParticles);
    const speed = 0.5 + Math.random() * 1.5;
    const radius = Math.max(size, 1) * (0.5 + Math.random() * 0.5);
    const life = 0;
    const maxLife = 20 + Math.random() * 30;

    splashParticlesList.value.push({
      x,
      y,
      radius,
      alpha: 0.6 + Math.random() * 0.4,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life,
      maxLife,
    });
  }

  // Add a few more random particles for a more chaotic splash effect
  const extraParticles = Math.floor(Math.random() * 5) + 3;
  for (let i = 0; i < extraParticles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 2.2; // Faster than regular particles
    const radius = Math.max(size * 0.7, 0.8) * (0.3 + Math.random() * 0.7);
    const life = 0;
    const maxLife = 15 + Math.random() * 20; // Shorter lifespan

    splashParticlesList.value.push({
      x,
      y,
      radius,
      alpha: 0.7 + Math.random() * 0.3, // Slightly more opaque
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
  // Position water drops at the top of the canvas
  const x = Math.random() * canvasSize.w;
  const y = atTop ? -20 - Math.random() * 100 : Math.random() * canvasSize.h;

  const size = props.dropSize * (0.7 + Math.random() * 0.6);
  const alpha = props.transparency * (0.8 + Math.random() * 0.2);

  // Add wobble properties for watery animation
  const wobblePhase = Math.random() * Math.PI * 2;
  const wobbleSpeed = 0.05 + Math.random() * 0.05;
  const wobbleAmount = props.wobbleAmount * (0.7 + Math.random() * 0.6);

  // Initial stretch factor (will be animated)
  const stretchFactor = 1.0;

  // Slight horizontal drift
  const dx = (Math.random() - 0.5) * 0.2;
  const dy = props.speed * (0.8 + Math.random() * 0.4);

  // Create Matter.js body for the water drop
  // Use a circle for the physics body
  const body = Matter.Bodies.circle(x, y, size, {
    restitution: 0.4, // Increase bounce for better collision response
    friction: 0.01, // Add slight friction for more realistic physics
    frictionAir: 0.01, // Some air resistance
    density: 0.001, // Low density to make it light
    slop: 0.05, // Reduce slop for more precise collisions
    collisionFilter: {
      group: 1,
      category: 0x0001,
      mask: 0x0006, // Allow collisions with cursor (0x0002) and frame (0x0004)
    },
  });

  // Set initial velocity
  Matter.Body.setVelocity(body, { x: dx, y: dy });

  // Add body to the world
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
        }
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
