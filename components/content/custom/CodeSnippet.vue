<template>
  <div class="relative my-6 overflow-hidden rounded-lg border bg-background">
    <div class="flex items-center justify-between px-4 py-2">
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted-foreground">{{ fileName }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="text-muted-foreground hover:text-foreground"
          @click="copyCode"
        >
          <Icon
            v-if="copied"
            name="lucide:check"
            class="size-4"
          />
          <Icon
            v-else
            name="lucide:copy"
            class="size-4"
          />
        </button>
      </div>
    </div>
    <div class="relative">
      <pre
        class="language-{{ language }} max-h-[650px] overflow-x-auto p-4"
      ><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  code: string;
  language?: string;
  fileName?: string;
}>();

const language = computed(() => props.language || "typescript");
const fileName = computed(() => props.fileName || "example.ts");

const copied = ref(false);

function copyCode() {
  navigator.clipboard.writeText(props.code);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>
