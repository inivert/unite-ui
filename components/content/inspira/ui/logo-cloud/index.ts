export { default as UniteAnimatedLogoCloud } from "./AnimatedLogoCloud.vue";
export { default as UniteStaticLogoCloud } from "./StaticLogoCloud.vue";
export { default as UniteIconLogoCloud } from "./IconLogoCloud.vue";

interface Logo {
  name: string;
  path: string;
}
export interface AnimateLogoCloudProps {
  class?: string;
  title?: string;
  logos?: Logo[];
}
