---
title: Stellar Background
description: A beautiful water drop background effect with physics-based collisions.
---

A beautiful water drop background effect with physics-based collisions. The water drops splash when they touch the mouse cursor or collide with elements.

## Preview

::ComponentLoader{label="Preview" componentName="BgStellarDemo" type="examples" id="backgrounds/bg-stellar"}
::

## Usage

The Stellar Background component creates a dynamic water drop effect that can interact with other elements on the page. It uses Matter.js for physics-based collisions and animations.

::CodeViewerTab{label="BgStellarDemo.vue" language="vue" componentName="BgStellarDemo" type="examples" id="backgrounds/bg-stellar"}
::

## Features

- **Interactive Water Drops**: Creates realistic water drop effects that respond to user interaction.
- **Physics-Based Collisions**: Uses Matter.js to simulate realistic physics for water drop movements and collisions.
- **Mouse Interaction**: Water drops splash when they touch the mouse cursor.
- **Element Collisions**: Water drops can collide with specified elements on the page.
- **Highly Customizable**: Adjust colors, quantity, size, speed, and other properties to match your design.
- **Visual Effects**: Includes wobble effects and splash particles for enhanced realism.
- **Debug Mode**: Optional debug mode to visualize collision boundaries.

## Component Code

::alert{type="info"}
The component code is quite extensive as it uses Matter.js for physics simulations. You can view and copy all the necessary files below, might aswell split the file because its too big lol.
::

:::code-group
::CodeViewerTab{label="BgStellar.vue" language="vue" componentName="BgStellar" type="ui" id="bg-stellar"}
::

::CodeViewerTab{label="index.ts" language="typescript" componentName="index" type="ui" id="bg-stellar" extension="ts"}
::
:::

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
