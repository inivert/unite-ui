// Disable link prefetching to prevent 503 errors
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  // Wait for the app to be mounted
  nuxtApp.hook("app:mounted", () => {
    // Disable prefetching on all links
    function disablePrefetch() {
      const links = document.querySelectorAll("a");
      links.forEach((link) => {
        if (link.hasAttribute("data-prefetch")) {
          link.removeAttribute("data-prefetch");
        }
      });
    }

    // Run initially
    disablePrefetch();

    // Set up a MutationObserver to handle dynamically added links
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          disablePrefetch();
        }
      });
    });

    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Clean up when component is unmounted
    window.addEventListener("beforeunload", () => {
      observer.disconnect();
    });
  });
});
