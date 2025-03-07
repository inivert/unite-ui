<template>
  <div>
    <slot v-if="!isClient" />
    <slot v-else-if="!isCacheable" />
    <ClientOnly v-else>
      <Suspense>
        <div ref="componentRef">
          <slot />
        </div>
        <template #fallback>
          <div class="flex items-center justify-center p-4">
            <slot name="fallback">
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"
                ></div>
                <p class="text-sm text-muted-foreground">Loading component...</p>
              </div>
            </slot>
          </div>
        </template>
      </Suspense>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  cacheKey?: string;
  cacheable?: boolean;
}>();

const isClient = ref(false);
const isCacheable = computed(() => props.cacheable !== false && !!props.cacheKey);
const componentRef = ref<HTMLElement | null>(null);
const { getFromCache, saveToCache, isComponentLoaded } = useComponentCache();
const isVisible = ref(false);
let observer: IntersectionObserver | null = null;

// Set isClient to true on client-side
onMounted(() => {
  isClient.value = true;

  // Set up intersection observer to detect when component is visible
  if (componentRef.value && isCacheable.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible.value = entry.isIntersecting;

          // If component becomes visible and has a cache key, save it to cache
          if (entry.isIntersecting && props.cacheKey && !isComponentLoaded(props.cacheKey)) {
            // Wait a bit to ensure component is fully rendered
            setTimeout(() => {
              if (componentRef.value && props.cacheKey) {
                // Save component HTML to cache
                saveToCache(props.cacheKey, componentRef.value.innerHTML);
              }
            }, 1000);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(componentRef.value);
  }
});

onUnmounted(() => {
  // Clean up observer
  if (observer) {
    observer.disconnect();
  }
});

// Check if we have cached content
const cachedContent = ref<string | null>(null);
if (props.cacheKey) {
  cachedContent.value = getFromCache(props.cacheKey);
}

// Apply cached content if available
watch(componentRef, (el) => {
  if (el && cachedContent.value && props.cacheKey) {
    // Only apply cache if component isn't already loaded
    if (!isComponentLoaded(props.cacheKey)) {
      el.innerHTML = cachedContent.value;
    }
  }
});
</script>
