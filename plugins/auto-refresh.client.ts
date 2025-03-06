// This plugin has been disabled to prevent frequent page refreshes
/*
export default defineNuxtPlugin(() => {
  // Only run in client-side and development mode
  if (process.server || process.env.NODE_ENV !== "development") {
    return;
  }

  // Set up a periodic check for updates
  const checkInterval = 10000; // 10 seconds

  // Function to check if we need to reload the page
  const checkForUpdates = () => {
    // Create a timestamp to prevent caching
    const timestamp = new Date().getTime();

    // Make a HEAD request to the current page with a cache-busting parameter
    fetch(`${window.location.pathname}?_=${timestamp}`, { method: "HEAD" })
      .then((response) => {
        // Check if the response is OK
        if (response.ok) {
          // Get the last-modified header
          const lastModified = response.headers.get("last-modified");

          // If we have a last-modified header, check if it's newer than our last check
          if (lastModified) {
            const lastModifiedDate = new Date(lastModified);
            const lastCheckDate = new Date(localStorage.getItem("lastCheckDate") || 0);

            // If the page has been modified since our last check, reload
            if (lastModifiedDate > lastCheckDate) {
              console.log("Page has been updated. Reloading...");
              window.location.reload();
            }

            // Update the last check date
            localStorage.setItem("lastCheckDate", new Date().toISOString());
          }
        }
      })
      .catch((error) => {
        console.error("Error checking for updates:", error);
      });
  };

  // Set up the interval to check for updates
  const intervalId = setInterval(checkForUpdates, checkInterval);

  // Clean up the interval when the page is unloaded
  window.addEventListener("beforeunload", () => {
    clearInterval(intervalId);
  });
});
*/
