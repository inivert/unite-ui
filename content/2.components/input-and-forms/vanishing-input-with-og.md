---
title: Vanishing Input with OG
description: Enhanced text input with social media preview when shared
---

::ComponentLoader{label="Preview" componentName="VanishingInputWithOGDemo" type="examples"}  
::

## Overview

The VanishingInputWithOG component extends the standard VanishingInput by adding Open Graph (OG) metadata to the page when text is submitted. This allows the shared URL to display a rich preview on social media platforms and messaging apps, including:

- The submitted text as the title
- A custom-generated image featuring the text
- A description mentioning the shared message
- Proper URL formatting with the text as a query parameter

When a user submits text via the input, the URL is updated with a `?text=` query parameter. This parameter is then used to generate Open Graph metadata, which social media platforms and messaging apps will use when the URL is shared.

## API

| Prop Name      | Type            | Default                                                                                      | Description                                                                     |
| -------------- | --------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `placeholders` | `Array<string>` | `["What would you like to share?", "Write a message to share...", "Type something here..."]` | An array of placeholder texts that cycle through as prompts in the input field. |

| Event Name | Parameters                      | Description                             |
| ---------- | ------------------------------- | --------------------------------------- |
| `change`   | `{ target: { value: string } }` | Triggered when the input value changes. |
| `submit`   | `string`                        | Triggered when the input is submitted.  |

## URL Sharing Features

When text is submitted, the component:

1. Updates the URL with the text as a query parameter
2. Adds Open Graph metadata to the page for social media previews
3. Generates a custom image featuring the submitted text
4. Sets appropriate title and description tags for better SEO and sharing

## Component Code

You can copy and paste the following code to create these components:

::CodeViewer{filename="VanishingInputWithOG.vue" language="vue" componentName="VanishingInputWithOG" type="ui" id="vanishing-input-with-og"}
::

## Implementation Details

This component uses Nuxt's `Head` component to dynamically inject Open Graph metadata into the page. It relies on the Vercel OG Image generation service to create dynamic preview images that include the submitted text, but you can modify it to use any image generation service or a custom endpoint.

The component also handles URL parameter parsing, so if someone visits a URL with a `text` parameter, the input will be pre-filled with that text and the OG metadata will be set accordingly.

## Use Cases

- Social media sharing of messages or quotes
- Generating shareable links that include text content
- Creating dynamic preview cards for user-generated content
- Enhancing SEO for user-submitted content
