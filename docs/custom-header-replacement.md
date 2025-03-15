# Replacing the Header in shadcn-docs-nuxt

This document provides detailed instructions on how to replace the default header in the shadcn-docs-nuxt Nuxt layer with a custom animated header.

## Problem Statement

The shadcn-docs-nuxt package is a Nuxt layer that provides a complete documentation site structure. However, overriding specific components like the header can be challenging because:

1. The component resolution system in Nuxt layers can be complex
2. The original header is deeply integrated with the theme's functionality
3. Direct component overriding may not work as expected

## Solution Overview

Instead of trying to directly override the component through Nuxt's standard component resolution system, we'll take a different approach:

1. Create a custom animated header component
2. Hide the original header with CSS
3. Use a custom layout to insert our new header
4. Implement all the necessary functionality to match the original header

## Step 1: Create the CSS to Hide the Original Header

Create a file: `assets/css/hide-header.css`:

```css
/* Hide original header from shadcn-docs-nuxt */
.shadcn-docs-header,
header[class*="bg-background"],
#__nuxt > div > header:not(.custom-animated-header) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  z-index: -999 !important;
}
```

## Step 2: Add the CSS to Nuxt Configuration

Update your `nuxt.config.ts` to include the CSS file:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // ... other config options
  css: [
    // ... your other CSS files
    "~/assets/css/hide-header.css", // Add our custom CSS to hide the original header
  ],
  // ... rest of config
});
```

## Step 3: Create the Custom Animated Header Component

Create the file: `components/global/CustomAnimatedHeader.vue`:

```vue
<template>
  <header class="custom-animated-header sticky top-0 z-40 overflow-hidden">
    <!-- Animated gradient background -->
    <div
      class="animate-gradient-x absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800"
    ></div>

    <!-- Glass effect overlay -->
    <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

    <!-- Main header content -->
    <div
      class="header-container relative flex h-16 items-center justify-between px-4 transition-all duration-300 ease-in-out"
      :class="{
        'h-12': isScrolled,
      }"
    >
      <!-- Logo with animation -->
      <div class="flex-1 transition-transform duration-500 ease-in-out hover:scale-105">
        <div class="hidden md:block">
          <NuxtLink
            to="/"
            class="logo-container flex items-center space-x-2"
          >
            <div
              class="logo-icon relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-white/20"
            >
              <SmartIcon
                name="lucide:zap"
                class="size-5 animate-pulse text-white"
              />
            </div>
            <span class="animate-text-slide-in text-lg font-bold tracking-wide text-white">
              Unite UI
            </span>
          </NuxtLink>
        </div>

        <!-- Mobile nav & menu animation -->
        <div class="flex md:hidden">
          <UiButton
            variant="ghost"
            class="border border-white/20 text-white transition-all hover:scale-105 hover:bg-white/10"
            @click="toggleSidebar"
          >
            <SmartIcon
              name="lucide:menu"
              class="mr-2 size-5"
            />
            <span>Menu</span>
          </UiButton>
        </div>
      </div>

      <!-- Center section - Title or Logo for mobile -->
      <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
        <NuxtLink to="/">
          <span class="animate-bounce text-lg font-bold text-white">Unite UI</span>
        </NuxtLink>
      </div>

      <!-- Navigation with hover animations -->
      <div class="nav-links hidden space-x-1 lg:flex">
        <NuxtLink
          v-for="(item, i) in navItems"
          :key="i"
          v-slot="{ href, navigate }"
          :to="item.to"
          custom
        >
          <UiButton
            tag="a"
            :href="href"
            variant="ghost"
            class="nav-item text-white transition-all duration-300 hover:bg-white/20"
            :class="{ active: route.path.startsWith(item.to) }"
            :style="{ 'animation-delay': `${i * 100}ms` }"
            @click="navigate"
          >
            {{ item.label }}
          </UiButton>
        </NuxtLink>
      </div>

      <!-- Right section with controls -->
      <div class="flex flex-1 justify-end gap-2">
        <!-- Search button -->
        <UiButton
          variant="ghost"
          class="ease-bounce border border-white/20 text-white transition-all duration-300 hover:bg-white/10"
          @click="openSearch"
        >
          <SmartIcon
            name="lucide:search"
            class="mr-2 size-4"
          />
          <span class="hidden sm:inline">Search</span>
        </UiButton>

        <!-- Control buttons with hover effects -->
        <div class="control-buttons flex space-x-1">
          <!-- Theme popover button -->
          <UiButton
            variant="ghost"
            class="text-white transition-transform duration-300 hover:scale-110 hover:bg-white/10"
            @click="toggleThemePopover"
          >
            <SmartIcon
              name="lucide:palette"
              class="size-4"
            />
          </UiButton>

          <!-- Dark mode toggle -->
          <UiButton
            variant="ghost"
            class="text-white transition-transform duration-300 hover:scale-110 hover:bg-white/10"
            @click="toggleColorMode"
          >
            <SmartIcon
              :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
              class="size-4"
            />
          </UiButton>

          <!-- GitHub link -->
          <UiButton
            variant="ghost"
            class="text-white transition-all duration-300 hover:rotate-3 hover:scale-110 hover:bg-white/10"
            tag="a"
            href="https://github.com/cmejia-inwentario/unite-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SmartIcon
              name="lucide:github"
              class="size-4"
            />
          </UiButton>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// Route and color mode for navigation and theme functionality
const route = useRoute();
const router = useRouter();
const colorMode = useColorMode();

// Navigation items with proper paths
const navItems = [
  { label: "Docs", to: "/docs" },
  { label: "Components", to: "/components" },
  { label: "Examples", to: "/examples" },
];

// Scroll effect for header
const isScrolled = ref(false);

// Function to toggle sidebar (mobile menu)
function toggleSidebar() {
  // Access the sidebar from shadcn-docs-nuxt if available
  const sidebar = document.querySelector(".shadcn-docs-sidebar");

  if (sidebar) {
    // If the sidebar has a toggle method or class
    sidebar.classList.toggle("hidden");
    sidebar.classList.toggle("block");
  } else {
    // Fallback - try to find a mobile menu button and click it
    const mobileMenuBtn = document.querySelector(".mobile-menu-button");
    if (mobileMenuBtn && mobileMenuBtn instanceof HTMLButtonElement) {
      mobileMenuBtn.click();
    }
  }
}

// Function to toggle color mode
function toggleColorMode() {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}

// Function to open search dialog
function openSearch() {
  // Try to find and click the search button from shadcn-docs-nuxt
  const searchBtn = document.querySelector(".search-button");
  if (searchBtn && searchBtn instanceof HTMLButtonElement) {
    searchBtn.click();
  } else {
    // Fallback - emit a custom event that can be caught by a listener
    window.dispatchEvent(new CustomEvent("open-search"));

    // If using command/search from ui/command, try to open it programmatically
    router.push({ query: { ...route.query, search: "true" } });
  }
}

// Function to toggle theme popover
function toggleThemePopover() {
  // Try to find and click the theme button from shadcn-docs-nuxt
  const themeBtn = document.querySelector(".theme-button");
  if (themeBtn && themeBtn instanceof HTMLButtonElement) {
    themeBtn.click();
  }
}

// Only add scroll event if we're in browser environment
onMounted(() => {
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", handleScroll);
  }
});

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}
</script>

<style scoped>
/* Animations */
@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Apply animations */
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 15s ease infinite;
}

.header-container {
  animation: slideIn 0.6s ease-out;
}

.nav-item {
  animation: slideIn 0.4s ease-out forwards;
  opacity: 0;
}

.animate-text-slide-in {
  animation: slideIn 0.5s ease-out;
}

/* Header compact effect when scrolled */
.header-container.scrolled {
  height: 52px;
  padding-top: 4px;
  padding-bottom: 4px;
}

/* Logo spin animation on hover */
.logo-icon:hover {
  animation: spin 0.6s ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Transition for scroll state */
.header-container {
  transition:
    height 0.3s ease,
    padding 0.3s ease;
}

/* Active nav item styling */
.nav-item.active {
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  animation: fadeIn 0.3s ease-out;
}
</style>
```

## Step 4: Create a Custom Default Layout

Create the file: `layouts/default.vue`:

```vue
<template>
  <div class="layout-wrapper">
    <!-- Our custom animated header -->
    <CustomAnimatedHeader />

    <!-- Slot for the page content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import CustomAnimatedHeader from "~/components/global/CustomAnimatedHeader.vue";
</script>

<style>
/* Hide original header from shadcn-docs-nuxt (redundant but adds extra safety) */
.shadcn-docs-header,
header[class*="bg-background"],
#__nuxt > div > header:not(.custom-animated-header) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  z-index: -999 !important;
}
</style>
```

## Step 5: Create or Update app.vue

Create or update the file: `app.vue`:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## Step 6: Clear Cache and Restart the Development Server

```bash
rm -rf .nuxt && pnpm dev
```

## How It Works

### CSS Approach

The CSS in `hide-header.css` uses multiple selectors to find and hide the original header, ensuring it's completely invisible. The `!important` flags override any inline styles.

### Layout Approach

Instead of trying to override the component directly, we:

1. Create a new custom header component
2. Use a custom layout to inject it at the top of the page
3. Hide the original header with CSS

### Functional Implementation

We've replicated all of the shadcn-docs-nuxt header's functionality:

1. **Navigation**: Uses `NuxtLink` for SPA navigation with proper active states
2. **Theme Toggling**: Uses `useColorMode()` to toggle between light and dark modes
3. **Search**: Attempts to trigger the original search functionality while providing fallbacks
4. **Mobile Menu**: Uses DOM manipulation to toggle the original sidebar
5. **Theme Selection**: Attempts to trigger the original theme popover

### Styling and Animation

The header includes:

1. Animated gradient background
2. Scroll-based height transition
3. Hover animations for buttons
4. Active state indicators for navigation
5. Responsive layout for mobile and desktop

## Troubleshooting

### Original Header Still Visible

If the original header is still visible:

1. Make sure the CSS is properly included in `nuxt.config.ts`
2. Check if there are any inline styles that might be overriding our CSS
3. Try adding more specific selectors to the CSS

### Mobile Menu Not Working

If the mobile menu button doesn't work:

1. Use browser developer tools to inspect the DOM
2. Find the exact class or ID of the mobile menu button
3. Update the `toggleSidebar()` function with the correct selector

### Search Not Working

If the search functionality doesn't work:

1. Check if the original search button uses a different class
2. Try implementing a custom search solution using the same UI components

## Customization Options

### Changing the Header Design

1. Modify the gradient colors in the background div
2. Adjust the height and padding in the `header-container` class
3. Change the animations by modifying the keyframes

### Updating Navigation Items

Update the `navItems` array in the script section:

```js
const navItems = [
  { label: "Your Label", to: "/your-path" },
  // Add more items as needed
];
```

### Adding Additional Buttons

Add more buttons to the controls section following the same pattern:

```vue
<UiButton
  variant="ghost"
  class="text-white transition-transform duration-300 hover:scale-110 hover:bg-white/10"
  @click="yourFunction"
>
  <SmartIcon
    name="your-icon"
    class="size-4"
  />
</UiButton>
```

## Conclusion

This approach allows you to completely replace the default header in shadcn-docs-nuxt with a custom animated header while maintaining all the original functionality. The layout-based approach is more reliable than trying to override the component directly, and the CSS ensures the original header doesn't interfere with our custom implementation.

By combining proper CSS hiding techniques with a custom layout, we've successfully replaced the header while keeping the rest of the site's functionality intact.

By combining proper CSS hiding techniques with a custom layout, we've successfully replaced the header while keeping the rest of the site's functionality intact.
