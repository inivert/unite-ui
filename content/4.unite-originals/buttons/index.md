---
title: MasterCTA
description: An animated call-to-action button component designed to capture user attention and encourage interaction.
---

# MasterCTA Button

A highly customizable animated call-to-action button component that helps draw user attention and increase conversion rates.

## Features

- Smooth hover animations
- Customizable colors and sizes
- Optional icon support
- Responsive design

## Usage

```vue
<MasterCTA text="Get Started" :primary="true" icon="arrow-right" />
```

## Props

| Prop    | Type    | Default  | Description                                  |
| ------- | ------- | -------- | -------------------------------------------- |
| text    | String  | 'Button' | The text to display on the button            |
| primary | Boolean | false    | Whether to use primary styling               |
| icon    | String  | null     | Optional icon to display (uses Lucide icons) |
| size    | String  | 'md'     | Size of the button (sm, md, lg)              |
