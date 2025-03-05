export default defineAppConfig({
  shadcnDocs: {
    site: {
      name: "unite-ui",
      description: "Build beautiful websites using Vue & Nuxt.",
      ogImage: "https://unite-ui.com/og-image.png",
    },
    theme: {
      customizable: true,
      color: "zinc",
      radius: 0.5,
    },
    header: {
      title: "unite-ui",
      showTitle: true,
      darkModeToggle: true,
      border: false,
      logo: {
        light: "/logo.svg",
        dark: "/logo-dark.svg",
      },
      nav: [
        {
          title: "Docs",
          links: [
            {
              title: "Getting Started",
              to: "/getting-started/introduction",
              description: "Introduction to unite-ui and its core concepts.",
            },
            {
              title: "Installation",
              to: "/getting-started/installation",
              description: "Follow the step-by-step guide to install unite-ui in your project.",
            },
            {
              title: "Components",
              to: "/components",
              description: "Explore all available components and their usage.",
              target: "_self",
            },
          ],
        },
        {
          title: "Credits",
          links: [
            {
              title: "Inspira UI",
              to: "https://inspira-ui.com/",
              description: "For pioneering work in the Vue UI space that inspired this project.",
              target: "_blank",
            },
            {
              title: "Aceternity UI",
              to: "https://ui.aceternity.com/",
              description:
                "For providing the inspiration and permission to adapt the original designs.",
              target: "_blank",
            },
            {
              title: "Magic UI",
              to: "https://magicui.design/",
              description: "For providing the inspiration for designs.",
              target: "_blank",
            },
            {
              title: "shadcn-vue",
              to: "https://www.shadcn-vue.com/",
              description: "For the Vue port of shadcn-ui and contributions to some components",
              target: "_blank",
            },
            {
              title: "shadcn-docs-nuxt",
              to: "https://github.com/ZTL-UwU/shadcn-docs-nuxt",
              description: "For the beautifully crafted Nuxt documentation site.",
              target: "_blank",
            },
          ],
        },
        {
          title: "Community",
          links: [
            {
              title: "GitHub",
              to: "https://github.com/inivert/unite-ui",
              description: "Source code for unite-ui.",
              target: "_blank",
            },
            {
              title: "Discord",
              to: "https://discord.gg/Xbh5DwJRc9",
              description: "Connect with community on Discord",
              target: "_blank",
            },
            {
              title: "Forum",
              to: "https://github.com/inivert/unite-ui/discussions",
              target: "_blank",
              description: "Join the forum",
            },
          ],
        },
      ],
      links: [
        {
          icon: "lucide:github",
          to: "https://github.com/inivert/unite-ui",
          target: "_blank",
        },
        {
          icon: "prime:twitter",
          to: "https://x.com/cmejia_dev",
          target: "_blank",
        },
        {
          icon: "ri:discord-line",
          to: "https://discord.gg/Xbh5DwJRc9",
          target: "_blank",
        },
        {
          icon: "ri:bluesky-line",
          to: "http://bsky.app/profile/unite-ui.com",
          target: "_blank",
        },
      ],
    },
    aside: {
      useLevel: true,
      collapse: false,
      folderStyle: "group",
    },
    main: {
      breadCrumb: true,
      showTitle: true,
      padded: true,
      centered: true,
      maxWidth: "7xl",
    },
    footer: {
      credits: "Copyright © 2024 - 2025",
      links: [
        {
          icon: "lucide:globe",
          to: "https://github.com/inivert",
          title: "Maintained by Carlos",
          target: "_blank",
        },
        {
          icon: "lucide:github",
          title: "Github",
          to: "https://github.com/inivert/unite-ui",
          target: "_blank",
        },
      ],
    },
    toc: {
      enable: true,
      title: "On This Page",
      links: [
        {
          title: "Star on GitHub",
          icon: "lucide:star",
          to: "https://github.com/inivert/unite-ui",
          target: "_blank",
        },
        {
          title: "Create Issues",
          icon: "lucide:circle-dot",
          to: "https://github.com/inivert/unite-ui/issues",
          target: "_blank",
        },
        {
          title: "Join Discord",
          icon: "ri:discord-line",
          to: "https://discord.gg/Xbh5DwJRc9",
          target: "_blank",
        },
        {
          title: "Forum",
          icon: "lucide:newspaper",
          to: "https://github.com/inivert/unite-ui/discussions",
          target: "_blank",
        },
        {
          title: "Follow on X",
          icon: "prime:twitter",
          to: "https://x.com/cmejia_dev",
          target: "_blank",
        },
        {
          title: "Follow on Bluesky",
          icon: "ri:bluesky-line",
          to: "http://bsky.app/profile/unite-ui.com",
          target: "_blank",
        },
      ],
    },
    search: {
      enable: true,
      inAside: true,
    },
  },
});
