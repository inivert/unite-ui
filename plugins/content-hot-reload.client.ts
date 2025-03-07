// This plugin enables hot reloading for content changes
export default defineNuxtPlugin(() => {
  // Only run in client-side and development mode
  if (process.server || process.env.NODE_ENV !== "development") {
    return;
  }

  // Get the Nuxt Content module's queryContent function
  const { $content } = useNuxtApp();
  const router = useRouter();
  const route = useRoute();

  // Track the current page's content
  let currentContentHash = "";
  let isFirstLoad = true;

  // Function to compute a simple hash of content
  function hashContent(content: Record<string, unknown>): string {
    if (!content) return "";
    try {
      // Create a string representation of the content
      const contentStr = JSON.stringify(content);
      // Use a simple hash function
      let hash = 0;
      for (let i = 0; i < contentStr.length; i++) {
        const char = contentStr.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash.toString(16);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error hashing content:", e);
      return "";
    }
  }

  // Function to check for content updates
  function checkContentUpdates(): void {
    try {
      // Get the current path
      const path = route.path;

      // Skip non-content pages
      if (!path || path === "/" || path.startsWith("/api/")) {
        return;
      }

      // Query the content for the current path
      queryContent(path)
        .find()
        .then((content) => {
          // Compute a hash of the content
          const newHash = hashContent(content as Record<string, unknown>);

          // If this is the first load, just store the hash
          if (isFirstLoad) {
            currentContentHash = newHash;
            isFirstLoad = false;
            return;
          }

          // If the hash has changed, reload the page
          if (newHash && currentContentHash && newHash !== currentContentHash) {
            // eslint-disable-next-line no-console
            console.log("Content has changed. Reloading...");
            window.location.reload();
          }

          // Update the current hash
          currentContentHash = newHash;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Error checking for content updates:", error);
        });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error checking for content updates:", error);
    }
  }

  // Set up polling for content updates
  const pollInterval = 2000; // 2 seconds
  const intervalId = setInterval(checkContentUpdates, pollInterval);

  // Also check when the route changes
  router.afterEach(() => {
    // Reset first load flag
    isFirstLoad = true;
    // Check for updates after a short delay
    setTimeout(checkContentUpdates, 500);
  });

  // Clean up when the page is unloaded
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
});
