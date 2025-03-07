---
title: Stellar Background
description: A beautiful water drop background effect with physics-based collisions.
---


A beautiful water drop background effect with physics-based collisions. The water drops splash when they touch the mouse cursor or collide with elements.

## Preview

::ComponentLoader{label="Preview" componentName="BgStellarDemo" type="examples" id="backgrounds/bg-stellar" folder="unite-originals"}
::

## Usage

The Stellar Background component creates a dynamic water drop effect that can interact with other elements on the page. It uses Matter.js for physics-based collisions and animations.

```vue
<template>
  <div class="relative h-96">
    <BgStellar
      color="FFFF99"
      class="absolute inset-0"
      :collision-element="frameRef"
      :debug="false"
      :quantity="40"
      :drop-size="5"
      :transparency="0.85"
    />

    <!-- Your content with a reference -->
    <div
      ref="frameRef"
      class="relative z-10"
    >
      <!-- Content here -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BgStellar from "~/components/content/unite-originals/ui/bg-stellar/BgStellar.vue";

const frameRef = ref(null);
</script>
```

## Component Code

::CodeViewer{filename="BgStellar.vue" language="vue" componentName="BgStellar" type="ui" id="bg-stellar" folder="unite-originals"}
::

## Props

| Prop               | Type          | Default    | Description                                |
| ------------------ | ------------- | ---------- | ------------------------------------------ |
| `color`            | `string`      | `"FFFF99"` | Color of the water drops (hex without #)   |
| `quantity`         | `number`      | `30`       | Number of water drops                      |
| `speed`            | `number`      | `0.4`      | Speed of the water drops                   |
| `dropSize`         | `number`      | `5`        | Size of the water drops                    |
| `cursorRadius`     | `number`      | `15`       | Radius of cursor interaction               |
| `debug`            | `boolean`     | `false`    | Show debug visuals                         |
| `splashParticles`  | `number`      | `8`        | Number of particles in splash              |
| `wobbleAmount`     | `number`      | `0.3`      | Amount of wobble for water drops           |
| `transparency`     | `number`      | `0.8`      | Base transparency for water drops          |
| `collisionElement` | `HTMLElement` | `null`     | Element to create collision boundaries for |

## Credits

- Credits to [Unite-ui Founder](https://x.com/cmejia_dev) for this component.
