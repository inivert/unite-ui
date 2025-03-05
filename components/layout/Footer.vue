<script setup lang="ts">
import { useAppConfig } from "#app";

const appConfig = useAppConfig();
const credits = appConfig.shadcnDocs?.footer?.credits || "";
</script>

<template>
  <footer class="border-t py-6 md:py-0">
    <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
      <p class="text-sm text-muted-foreground">
        {{ credits }}
      </p>
      <div
        class="flex items-center gap-4"
        v-if="appConfig.shadcnDocs?.footer?.links?.length"
      >
        <a
          v-for="link in appConfig.shadcnDocs?.footer?.links"
          :key="link.to"
          :href="link.to"
          :target="link.target || '_blank'"
          class="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon
            v-if="link.icon"
            :name="link.icon"
            class="h-4 w-4"
          />
          <span v-if="link.title">{{ link.title }}</span>
        </a>
      </div>
    </div>
  </footer>
</template>
