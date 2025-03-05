<template>
  <div class="my-4 w-full space-y-8">
    <ClientOnly>
      <CodeGroup>
        <div
          :label="label || componentName"
          icon="lucide:laptop-minimal"
        >
          <ComponentViewer :component-name="componentName" />
        </div>
        <CodeViewerTab
          v-bind="$props"
          label="Code"
        />
      </CodeGroup>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  componentName?: string;
  id?: string;
  type?: string;
  label?: string;
  class?: string;
  icon?: string;
}

withDefaults(defineProps<Props>(), {
  icon: "lucide:square-terminal",
});
</script>

<style>
/* Ensure code blocks in the component loader have proper horizontal scrolling */
:deep(pre) {
  white-space: pre !important;
  word-wrap: normal !important;
  overflow-x: auto !important;
}

:deep(code) {
  max-width: 100%;
}
</style>
