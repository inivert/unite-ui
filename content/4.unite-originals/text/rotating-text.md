---
title: Rotating Text
description: A component that animates between multiple text strings with smooth transitions.
---

The Rotating Text component creates smooth, animated transitions between different text strings. It's perfect for highlighting multiple features, benefits, or descriptive words in a limited space.

## Preview

::ComponentLoader{label="Preview" componentName="RotatingTextDemo" type="examples" id="text/rotating-text"}
::

## Usage

The Rotating Text component can be used to create engaging text animations that cycle through different words or phrases. It supports various animation styles and can be customized to match your design.

::CodeViewerTab{label="RotatingTextDemo.vue" language="vue" componentName="RotatingTextDemo" type="examples" id="text/rotating-text"}
::

## Features

- **Smooth Animations**: Creates fluid transitions between different text strings.
- **Character-Level Animation**: Animates each character individually for a more engaging effect.
- **Customizable Timing**: Control the rotation interval and animation duration.
- **Multiple Animation Styles**: Choose from different animation styles (slide up, fade, slide side).
- **Staggered Animations**: Characters animate with a staggered delay for a more natural effect.
- **Flexible Configuration**: Extensive props for customizing the appearance and behavior.
- **AnimeJS Integration**: Powered by AnimeJS for smooth, high-performance animations.

## Component Code

::alert{type="info"}
The component uses AnimeJS for smooth animations. You can view and copy all the necessary files below.
::

:::code-group
::CodeViewerTab{label="RotatingText.vue" language="vue" componentName="RotatingText" type="ui" id="rotating-text"}
::

::CodeViewerTab{label="index.ts" language="typescript" componentName="index" type="ui" id="rotating-text" extension="ts"}
::
:::

## Props

| Prop                    | Type                                                  | Default                                                          | Description                                        |
| ----------------------- | ----------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| `texts`                 | `string[]`                                            | Required                                                         | Array of text strings to rotate through            |
| `transition`            | `object`                                              | `{ type: "spring", damping: 25, stiffness: 300, duration: 0.4 }` | Animation transition properties                    |
| `initial`               | `object`                                              | `{ y: "100%", opacity: 0 }`                                      | Initial state of entering text                     |
| `animate`               | `object`                                              | `{ y: 0, opacity: 1 }`                                           | Animated state of visible text                     |
| `exit`                  | `object`                                              | `{ y: "-120%", opacity: 0 }`                                     | Exit state of leaving text                         |
| `rotationInterval`      | `number`                                              | `2000`                                                           | Time in ms between text rotations                  |
| `staggerDuration`       | `number`                                              | `0.025`                                                          | Delay between each character's animation           |
| `staggerFrom`           | `"first" \| "last" \| "center" \| "random" \| number` | `"first"`                                                        | Where the stagger animation starts from            |
| `loop`                  | `boolean`                                             | `true`                                                           | Whether to loop through texts continuously         |
| `auto`                  | `boolean`                                             | `true`                                                           | Whether to auto-rotate through texts               |
| `splitBy`               | `string`                                              | `"characters"`                                                   | How to split text ("characters", "words", "lines") |
| `mainClassName`         | `string`                                              | `""`                                                             | Class for the main container                       |
| `splitLevelClassName`   | `string`                                              | `""`                                                             | Class for the split level elements                 |
| `elementLevelClassName` | `string`                                              | `""`                                                             | Class for the individual character elements        |

## Methods

The component exposes the following methods that can be called using a ref:

| Method       | Parameters      | Description                      |
| ------------ | --------------- | -------------------------------- |
| `next()`     | None            | Advance to the next text         |
| `previous()` | None            | Go back to the previous text     |
| `jumpTo()`   | `index: number` | Jump to a specific text by index |
| `reset()`    | None            | Reset to the first text          |

## Example

```vue
<template>
  <div>
    This is a
    <RotatingText
      :texts="['smooth', 'animated', 'beautiful', 'interactive']"
      :rotation-interval="2000"
      main-class-name="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-1 py-0.5 rounded-md"
      stagger-from="last"
      :stagger-duration="0.025"
    />
    component.
  </div>
</template>
```

## Credits

- Credits to [Unite-ui Team](https://github.com/inivert/unite-ui) for this component.
