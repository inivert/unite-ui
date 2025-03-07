---
title: Matter Card
description: A card component built with matter.js
---

A dynamic card component that uses Matter.js physics engine to create liquid-like interactive effects. The card responds to user interaction with realistic physics-based animations.

::ComponentLoader{label="Preview" componentName="Liquidcarddemo" type="examples" id="matter/m-cards"}
::

---

## Usage

The Matter Card component creates an interactive card with physics-based animations. It's perfect for creating engaging user interfaces with a unique tactile feel.

::CodeViewerTab{label="Liquidcarddemo.vue" language="vue" componentName="Liquidcarddemo" type="examples" id="matter/m-cards"}
::

## Component Code

::alert{type="info"}
The component code is quite extensive as it uses Matter.js for physics simulations. You can view and copy all the necessary files below.
::

:::code-group
::CodeViewerTab{label="LiquidCard.vue" language="vue" componentName="LiquidCard" type="ui" id="m-cards"}
::

::CodeViewerTab{label="index.ts" language="typescript" componentName="index" type="ui" id="m-cards" extension="ts"}
::
:::

## Props

| Prop           | Type     | Default   | Description                                     |
| -------------- | -------- | --------- | ----------------------------------------------- |
| `color`        | `string` | `#3b82f6` | Background color of the card                    |
| `borderRadius` | `number` | `20`      | Border radius of the card in pixels             |
| `stiffness`    | `number` | `0.1`     | Stiffness of the physics simulation (0.01 to 1) |
| `damping`      | `number` | `0.8`     | Damping of the physics simulation (0 to 1)      |

## Features

- **Physics-Based Interactions**: Uses Matter.js to create realistic physics simulations for card interactions.
- **Customizable Appearance**: Adjust the color and border radius to match your design.
- **Tunable Physics**: Control the feel of interactions by adjusting stiffness and damping.
- **Responsive Design**: Works well across different screen sizes.
- **Slot-Based Content**: Easily add your own content inside the card.

## Credits

- Credits to [Unite-ui Founder](https://x.com/cmejia_dev) for this component.
