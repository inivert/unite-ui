interface WebsiteSchema {
  name: string;
  url: string;
  description: string;
  inLanguage?: string;
  author?: {
    name: string;
    url?: string;
  };
  sameAs?: string[];
  logo?: string;
}

/**
 * Composable for adding structured data (JSON-LD) to the page
 */
export function useSchemaOrg(options: Partial<WebsiteSchema> = {}) {
  const config = useConfig();
  const route = useRoute();

  const defaults: WebsiteSchema = {
    name: "unite-ui",
    url: `https://unite-ui.com${route.path}`,
    description:
      "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
    inLanguage: "en-US",
    author: {
      name: "Carlos Mejia",
      url: "https://github.com/inivert",
    },
    sameAs: [
      "https://github.com/inivert/unite-ui",
      "https://discord.gg/Xbh5DwJRc9",
      "https://x.com/cmejia_dev",
      "http://bsky.app/profile/unite-ui.com",
    ],
    logo: "https://unite-ui.com/logo.svg",
  };

  const schema = { ...defaults, ...options };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://unite-ui.com/#website",
    name: schema.name,
    url: "https://unite-ui.com",
    description: schema.description,
    inLanguage: schema.inLanguage,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://unite-ui.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://unite-ui.com/#organization",
    name: schema.name,
    url: "https://unite-ui.com",
    logo: schema.logo,
    sameAs: schema.sameAs,
  };

  // WebPage Schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": schema.url + "#webpage",
    url: schema.url,
    name: schema.name,
    description: schema.description,
    inLanguage: schema.inLanguage,
    isPartOf: {
      "@id": "https://unite-ui.com/#website",
    },
  };

  // Add structured data to the page
  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(websiteSchema),
      },
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(organizationSchema),
      },
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(webPageSchema),
      },
    ],
  });

  return {
    websiteSchema,
    organizationSchema,
    webPageSchema,
  };
}
