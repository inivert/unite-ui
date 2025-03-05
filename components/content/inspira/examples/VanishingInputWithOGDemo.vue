<template>
  <div class="flex h-[40rem] flex-col items-center justify-center px-4">
    <h2 class="mb-10 text-center text-xl text-black sm:mb-20 sm:text-5xl dark:text-white">
      Share Your Message
    </h2>

    <!-- VanishingInputWithOG Component with social sharing explanation -->
    <div class="w-full max-w-xl">
      <VanishingInputWithOG
        v-model="text"
        :placeholders="placeholders"
        @submit="handleSubmit"
      />

      <div
        v-if="hasSubmitted"
        class="mt-8 rounded-lg bg-gray-100 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        <p class="mb-2 font-bold">Your message has been added to the URL!</p>
        <p>When you share this link, social media platforms will show:</p>
        <ul class="ml-4 mt-2 list-disc">
          <li>Your message as the title</li>
          <li>A custom preview image with your text</li>
          <li>A description mentioning your shared message</li>
        </ul>
        <div class="mt-4">
          <p class="text-xs">Shareable link:</p>
          <div class="mt-1 flex items-center">
            <input
              class="flex-1 overflow-hidden rounded-l-md border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              type="text"
              readonly
              :value="shareableUrl"
            />
            <button
              class="rounded-r-md border border-gray-300 bg-gray-200 px-3 py-2 text-xs font-medium hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500"
              @click="copyToClipboard"
            >
              {{ copied ? "Copied!" : "Copy" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const placeholders = [
  "Type a message to share...",
  "Share your thoughts...",
  "Write something to share with others...",
  "Create a shareable message...",
  "What's on your mind?",
];

const text = ref("");
const hasSubmitted = ref(false);
const copied = ref(false);

// Compute the shareable URL with the text parameter
const shareableUrl = computed(() => {
  if (!text.value) return window.location.href;
  const url = new URL(window.location.href);
  url.searchParams.set("text", text.value);
  return url.toString();
});

// Handle submission from the VanishingInputWithOG component
function handleSubmit(value: string) {
  if (value.trim()) {
    hasSubmitted.value = true;
  }
}

// Copy URL to clipboard functionality
function copyToClipboard() {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(shareableUrl.value)
      .then(() => {
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      })
      .catch(() => {
        // Handle silently and fall back to alternative method
        fallbackCopyToClipboard();
      });
  } else {
    fallbackCopyToClipboard();
  }
}

// Fallback copy method
function fallbackCopyToClipboard() {
  const textArea = document.createElement("textarea");
  textArea.value = shareableUrl.value;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>
