<template>
  <header
    class="header-float-animation sticky top-6 z-40 mx-auto w-full max-w-7xl rounded-full px-4 shadow-lg"
    :class="{ 'header-dark': isDark, 'header-light': !isDark }"
  >
    <div class="flex h-14 items-center justify-between gap-2">
      <LayoutHeaderLogo class="hidden flex-1 md:flex" />
      <LayoutMobileNav />
      <LayoutHeaderLogo
        v-if="config.header.showTitleInMobile"
        class="flex md:hidden"
      />
      <LayoutHeaderNav class="hidden flex-1 lg:flex" />
      <div class="flex flex-1 justify-end gap-2">
        <LayoutSearchButton v-if="!config.search.inAside && config.search.style === 'input'" />
        <div class="flex">
          <LayoutSearchButton v-if="!config.search.inAside && config.search.style === 'button'" />
          <ThemePopover v-if="config.theme.customizable" />
          <DarkModeToggle v-if="config.header.darkModeToggle" />
          <NuxtLink
            v-for="(link, i) in config.header.links"
            :key="i"
            :to="link?.to"
            :target="link?.target"
          >
            <UiButton
              variant="ghost"
              size="icon"
              class="flex gap-2"
            >
              <SmartIcon
                v-if="link?.icon"
                :name="link.icon"
                :size="18"
              />
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      v-if="config.toc.enable && config.toc.enableInMobile"
      class="lg:hidden"
    >
      <LayoutToc is-small />
    </div>
  </header>
</template>

<script setup lang="ts">
const config = useConfig();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");
</script>

<style>
/* Header styling for light mode */
.header-light {
  background-color: white !important;
  color: black !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(8px) !important;
}

/* Header styling for dark mode */
.header-dark {
  background-color: black !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: none !important;
}

/* Force all text and icons to be the right color based on theme */
.header-light * {
  color: black !important;
}

.header-dark * {
  color: white !important;
}

/* Force all images to be the right color based on theme */
.header-dark img {
  filter: brightness(0) invert(1) !important;
}

/* Style dropdown menus */
.dark [data-radix-popper-content-wrapper] [role="menu"],
.dark [data-radix-popper-content-wrapper] [role="dialog"],
.dark [data-radix-popper-content-wrapper] .navigation-menu-content {
  background-color: rgba(30, 30, 30, 0.95) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

:root:not(.dark) [data-radix-popper-content-wrapper] [role="menu"],
:root:not(.dark) [data-radix-popper-content-wrapper] [role="dialog"],
:root:not(.dark) [data-radix-popper-content-wrapper] .navigation-menu-content {
  background-color: rgba(255, 255, 255, 0.95) !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  color: black !important;
}

/* Animation for floating header */
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}

.header-float-animation {
  animation: float 6s ease-in-out infinite;
}
</style>
