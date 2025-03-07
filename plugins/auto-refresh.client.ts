// This plugin enables automatic page refresh when content changes
export default defineNuxtPlugin(() => {
  // Only run in client-side and development mode
  if (process.server || process.env.NODE_ENV !== "development") {
    return;
  }

  // Set up a periodic check for updates
  const checkInterval = 2000; // 2 seconds - faster checks for better responsiveness

  // Store the current route path
  let currentPath = window.location.pathname;

  // Function to check if content has been updated
  function checkForContentUpdates() {
    try {
      // Only check markdown content pages
      if (!currentPath.endsWith(".md") && !currentPath.includes("/content/")) {
        // Create a timestamp to prevent caching
        const timestamp = new Date().getTime();

        // Make a request to the content API for the current page
        fetch(`/api/_content/query?path=${currentPath}&_=${timestamp}`, {
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return null;
          })
          .then((data) => {
            // Check if we have content data
            if (data && data.length > 0) {
              const contentItem = data[0];

              // Get the last modified time from localStorage
              const lastModifiedKey = `content-last-modified-${currentPath}`;
              const storedLastModified = localStorage.getItem(lastModifiedKey);

              // If we have a updatedAt field and it's different from what we stored, reload
              if (
                contentItem.updatedAt &&
                (!storedLastModified || contentItem.updatedAt !== storedLastModified)
              ) {
                // eslint-disable-next-line no-console
                console.log("Content has been updated. Reloading...");
                localStorage.setItem(lastModifiedKey, contentItem.updatedAt);
                window.location.reload();
              }
            }
          });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error checking for content updates:", error);
    }
  }

  // Set up the interval to check for updates
  const intervalId = setInterval(checkForContentUpdates, checkInterval);

  // Also check when the route changes
  const router = useRouter();
  router.afterEach((to) => {
    currentPath = to.path;
    // Check for updates after a short delay to allow content to load
    setTimeout(checkForContentUpdates, 500);
  });

  // Clean up the interval when the page is unloaded
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
});
