interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  twitterCard?: string;
  twitterSite?: string;
  locale?: string;
  canonical?: string;
}

export function useSeo(options: SeoOptions = {}) {
  const config = useConfig();
  const route = useRoute();

  const defaults = {
    title: "unite-ui: Build beautiful websites using Vue & Nuxt",
    description:
      "Open Source components to build stunning animated interfaces effortlessly using Vue & Nuxt.",
    image: config.value.site.ogImage,
    url: `https://unite-ui.com${route.path}`,
    type: "website",
    twitterCard: "summary_large_image",
    twitterSite: "@cmejia_dev",
    locale: "en_US",
    canonical: `https://unite-ui.com${route.path}`,
  };

  const seo = {
    title: options.title || defaults.title,
    description: options.description || defaults.description,
    image: options.image || defaults.image,
    url: options.url || defaults.url,
    type: options.type || defaults.type,
    twitterCard: options.twitterCard || defaults.twitterCard,
    twitterSite: options.twitterSite || defaults.twitterSite,
    locale: options.locale || defaults.locale,
    canonical: options.canonical || defaults.canonical,
  };

  // Apply SEO metadata
  useSeoMeta({
    title: seo.title,
    ogTitle: seo.title,
    description: seo.description,
    ogDescription: seo.description,
    ogImage: seo.image,
    ogUrl: seo.url,
    ogType: seo.type,
    ogLocale: seo.locale,
    twitterTitle: seo.title,
    twitterDescription: seo.description,
    twitterImage: seo.image,
    twitterCard: seo.twitterCard,
    twitterSite: seo.twitterSite,
  });

  // Add canonical URL
  useHead({
    link: [
      {
        rel: "canonical",
        href: seo.canonical,
      },
    ],
    htmlAttrs: {
      lang: "en",
    },
  });

  return seo;
}
