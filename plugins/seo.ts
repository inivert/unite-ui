import { defineNuxtPlugin, useAppConfig } from "#app";

// Add a theme fix function to ensure white theme works correctly
function fixWhiteThemeIssues() {
  // Only run in client-side
  if (typeof document === "undefined") return;

  // Create a style element for theme fixes
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    /* Fix for white theme text contrast issues */
    :root:not(.dark) .bg-white * {
      color: #333 !important; 
    }
    
    :root:not(.dark) span,
    :root:not(.dark) h1,
    :root:not(.dark) h2,
    :root:not(.dark) h3,
    :root:not(.dark) h4,
    :root:not(.dark) h5,
    :root:not(.dark) h6,
    :root:not(.dark) p {
      color: inherit !important;
    }
    
    :root:not(.dark) .text-black {
      color: #000 !important;
    }
    
    :root:not(.dark) [class*="dark:text-white"] {
      color: #000 !important;
    }
  `;
  document.head.appendChild(styleEl);
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useAppConfig();

  // Add default meta tags
  nuxtApp.hook("app:mounted", () => {
    // Add preload for critical resources
    const criticalResources = [
      { href: "/logo.svg", as: "image", type: "image/svg+xml" },
      { href: "/logo-dark.svg", as: "image", type: "image/svg+xml" },
    ];

    for (const resource of criticalResources) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) {
        link.type = resource.type;
      }
      document.head.appendChild(link);
    }

    // Apply theme fix
    fixWhiteThemeIssues();

    // Performance optimization for image loading
    const imgElements = document.querySelectorAll("img");
    imgElements.forEach((img) => {
      if (!img.hasAttribute("loading") && !img.hasAttribute("fetchpriority")) {
        img.setAttribute("loading", "lazy");
      }
    });
  });
});
