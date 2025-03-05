<template>
  <div>
    <!-- SEO Enhancements for URL sharing -->
    <Head v-if="urlText">
      <Title>{{ urlText }} - unite-ui</Title>
      <Meta
        name="description"
        :content="`Shared message: ${urlText}`"
      />
      <Meta
        property="og:title"
        :content="`${urlText} - unite-ui`"
      />
      <Meta
        property="og:description"
        :content="`Shared message: ${urlText}`"
      />
      <Meta
        property="og:image"
        :content="ogImageUrl"
      />
      <Meta
        property="og:url"
        :content="currentUrl"
      />
      <Meta
        property="og:type"
        content="website"
      />
      <Meta
        name="twitter:card"
        content="summary_large_image"
      />
      <Meta
        name="twitter:title"
        :content="`${urlText} - unite-ui`"
      />
      <Meta
        name="twitter:description"
        :content="`Shared message: ${urlText}`"
      />
      <Meta
        name="twitter:image"
        :content="ogImageUrl"
      />
    </Head>

    <!-- The original VanishingInput component -->
    <VanishingInput
      v-model="vanishingText"
      :placeholders="props.placeholders"
      @submit="handleSubmit"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

interface Props {
  placeholders?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  placeholders: () => [
    "What would you like to share?",
    "Write a message to share...",
    "Type something here...",
  ],
});

// Model value
const vanishingText = defineModel<string>({
  default: "",
});

// Emit events
const emit = defineEmits(["submit", "change"]);

// URL handling
const route = useRoute();
const urlText = ref("");
const currentUrl = computed(() => {
  // Get the current URL
  const baseUrl = window.location.origin;
  return `${baseUrl}${route.path}${urlText.value ? `?text=${encodeURIComponent(urlText.value)}` : ""}`;
});

// Generate OG image URL with the text
const ogImageUrl = computed(() => {
  if (!urlText.value) return `${window.location.origin}/og-image.png`;

  // Use a service like Vercel OG to generate a dynamic OG image with the text
  // You could replace this with your own OG image generation service
  return `https://og-image.vercel.app/**${encodeURIComponent(urlText.value)}**.png?theme=light&md=1&fontSize=100px&images=https%3A%2F%2Funite-ui.com%2Flogo.svg`;
});

// Handle submit events
function handleSubmit(value: string) {
  // Update URL with the submitted text
  urlText.value = value;

  // Update the browser URL without refreshing
  const newUrl = window.location.pathname + (value ? `?text=${encodeURIComponent(value)}` : "");
  window.history.pushState({ text: value }, "", newUrl);

  // Emit the event
  emit("submit", value);
}

// Handle change events
function handleChange(event: { target: { value: string } }) {
  emit("change", event);
}

// Check for text query parameter on load
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const textParam = urlParams.get("text");

  if (textParam) {
    urlText.value = textParam;
    vanishingText.value = textParam;
  }
});

// Watch for URL changes
watch(
  () => route.query.text,
  (newText) => {
    if (newText && typeof newText === "string") {
      urlText.value = newText;
      vanishingText.value = newText;
    } else {
      urlText.value = "";
    }
  },
  { immediate: true },
);
</script>
