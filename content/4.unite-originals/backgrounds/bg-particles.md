---
title: Particles Background
description: An interactive 3D particle system that responds to user interaction.
---

A customizable 3D particle system that creates an engaging background effect. The particles respond to user interaction, creating a dynamic and immersive experience.

## Preview

::ComponentLoader{label="Preview" componentName="BgParticlesDemo" type="examples" id="backgrounds/bg-particles"}
::

## Usage

The Particles Background component creates a dynamic 3D particle system that can be customized to match your design. It's perfect for hero sections, landing pages, and other areas where you want to create visual interest.

::CodeViewerTab{label="BgParticlesDemo.vue" language="vue" componentName="BgParticlesDemo" type="examples" id="backgrounds/bg-particles"}
::

## Features

- **Interactive Particles**: Creates a dynamic 3D particle system that responds to user interaction.
- **Mouse Tracking**: Particles move and react when the user moves their cursor.
- **Customizable Colors**: Choose from a variety of color schemes or create your own.
- **Dark/Light Mode Support**: Automatically adjusts to match your site's theme.
- **Performance Optimized**: Designed to run smoothly even with hundreds of particles.
- **Responsive Design**: Adapts to different screen sizes and devices.
- **Easy Integration**: Simple to add to any Vue or Nuxt project.

## Component Code

::alert{type="info"}
The component uses Three.js for 3D rendering and animation. You can view and copy all the necessary files below.
::

:::code-group
::CodeViewerTab{label="Particles.vue" language="vue" componentName="Particles" type="ui" id="bg-particles"}
::

::CodeViewerTab{label="index.ts" language="typescript" componentName="index" type="ui" id="bg-particles" extension="ts"}
::
:::

## Props

| Prop                   | Type       | Default                                        | Description                               |
| ---------------------- | ---------- | ---------------------------------------------- | ----------------------------------------- |
| `particleCount`        | `number`   | `300`                                          | Number of particles to display            |
| `particleSpread`       | `number`   | `15`                                           | How spread out the particles are          |
| `speed`                | `number`   | `0.07`                                         | Animation speed of the particles          |
| `particleColors`       | `string[]` | `['#ffffff', '#a855f7', '#6366f1', '#ec4899']` | Array of colors for the particles         |
| `moveParticlesOnHover` | `boolean`  | `true`                                         | Whether particles react to mouse movement |
| `particleHoverFactor`  | `number`   | `1.5`                                          | How much particles move on hover          |
| `alphaParticles`       | `boolean`  | `false`                                        | Whether particles have transparency       |
| `particleBaseSize`     | `number`   | `100`                                          | Base size of particles                    |
| `sizeRandomness`       | `number`   | `1`                                            | Random variation in particle size         |
| `cameraDistance`       | `number`   | `20`                                           | Distance of the camera from the particles |

## Credits

- Credits to [Unite-ui Team](https://github.com/inivert/unite-ui) for this component.
