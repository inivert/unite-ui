<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :icon="icon"
    :class="cn('relative flex max-h-[32rem]', $props.class)"
    :code="rawString"
  >
    <CodeCopy
      class="absolute right-0 top-0"
      :code="rawString"
    />
    <code class="min-w-full overflow-x-auto px-2 leading-4">
      <pre
        class="text-sm"
        v-html="codeHtml"
      ></pre>
    </code>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { MagicString } from "vue/compiler-sfc";
import { cn } from "~/lib/utils";
import hljs from "highlight.js";
import "~/assets/css/code-theme.css";

interface Props {
  componentName?: string;
  id?: string;
  type?: string;
  icon?: string;
  class?: string;
  extension?: string;
  folder?: string;
}

const rawString = ref("");
const codeHtml = ref("");

const props = withDefaults(defineProps<Props>(), {
  icon: "lucide:square-terminal",
  extension: "vue",
  folder: "inspira", // Default to inspira folder
});

// Create maps of all possible components using import.meta.glob for both folders
const inspiraComponents = import.meta.glob("../inspira/**/*.{vue,ts,js,d.ts}", {
  query: "?raw",
  import: "default",
  eager: false,
});

const uniteOriginalsComponents = import.meta.glob("../unite-originals/**/*.{vue,ts,js,d.ts}", {
  query: "?raw",
  import: "default",
  eager: false,
});

// Compute the component path based on props
const componentPath = computed(() => {
  // Normalize folder name to lowercase for case-insensitive comparison
  const normalizedFolder = props.folder?.toLowerCase() || "inspira";
  const folderToUse = normalizedFolder.includes("unite") ? "unite-originals" : "inspira";

  return `../${folderToUse}/${props.type}/${props.id ? props.id + "/" : ""}${
    props.componentName
  }.${props.extension}`;
});

// Compute alternative path for the other folder
const alternativeComponentPath = computed(() => {
  // Use the opposite folder of the primary path
  const normalizedFolder = props.folder?.toLowerCase() || "inspira";
  const altFolderToUse = normalizedFolder.includes("unite") ? "inspira" : "unite-originals";

  return `../${altFolderToUse}/${props.type}/${props.id ? props.id + "/" : ""}${
    props.componentName
  }.${props.extension}`;
});

// Load and process the component code on mount
onMounted(() => {
  loadAndProcessComponentCode();
});

// Function to load and process the component code
async function loadAndProcessComponentCode() {
  try {
    const componentCode = await fetchComponentCode();
    rawString.value = updateImportPaths(componentCode);
    codeHtml.value = hljs.highlightAuto(rawString.value, ["ts", "html", "css", "js", "d.ts"]).value;
  } catch (error) {
    throw new Error(
      `Error loading component code: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

// Fetch the raw code of the component dynamically
async function fetchComponentCode() {
  // Try the primary path first
  const primaryPath = componentPath.value;
  const altPath = alternativeComponentPath.value;

  // Check if component exists in inspira folder
  let loadRawComponent = inspiraComponents[primaryPath];

  // If not found in inspira, check in unite-originals
  if (!loadRawComponent) {
    loadRawComponent = uniteOriginalsComponents[altPath];
  }

  // If still not found, try case-insensitive search
  if (!loadRawComponent) {
    // Try to find a case-insensitive match in inspira
    const inspiraKeys = Object.keys(inspiraComponents);
    const matchingInspiraKey = inspiraKeys.find(
      (key) => key.toLowerCase() === primaryPath.toLowerCase(),
    );

    if (matchingInspiraKey) {
      loadRawComponent = inspiraComponents[matchingInspiraKey];
    } else {
      // Try to find a case-insensitive match in unite-originals
      const uniteKeys = Object.keys(uniteOriginalsComponents);
      const matchingUniteKey = uniteKeys.find((key) => key.toLowerCase() === altPath.toLowerCase());

      if (matchingUniteKey) {
        loadRawComponent = uniteOriginalsComponents[matchingUniteKey];
      }
    }
  }

  if (!loadRawComponent) {
    throw new Error(`Component not found: ${primaryPath} or ${altPath}`);
  }

  const mod = await loadRawComponent();
  // Fix the type error by properly casting the unknown type
  return (mod as unknown as string).trim();
}

// Update import paths in the raw code using MagicString
function updateImportPaths(code: string) {
  const magicString = new MagicString(code);
  magicString.replaceAll("~/components/content/inspira/", "@/components/");
  magicString.replaceAll("~/components/content/unite-originals/", "@/components/");
  magicString.replaceAll("~/composables/", "@/composables/");
  return magicString.toString();
}
</script>

<style>
/* CSS for code blocks with horizontal scrolling */
pre {
  white-space: pre !important;
  word-wrap: normal !important;
  overflow-x: auto !important;
}

code {
  display: inline-block;
  min-width: 100%;
}

/* Ensure proper spacing */
pre,
code {
  padding: 0;
  margin: 0;
}
</style>
