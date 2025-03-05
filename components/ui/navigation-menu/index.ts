import { cva } from "class-variance-authority";

/**
 * Navigation Menu Components
 *
 * Part of unite-ui, inspired by Inspira UI
 * @see https://inspira-ui.com/
 */

export { default as NavigationMenu } from "./NavigationMenu.vue";
export { default as NavigationMenuTrigger } from "./NavigationMenuTrigger.vue";
export { default as ViewportPosition } from "./ViewportPosition.vue";

export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
);

// Credit: This component is based on Inspira UI (https://inspira-ui.com/)
