<template>
  <div
    class="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
  >
    <span class="pointer-events-none text-center text-8xl font-semibold leading-none"> 🌍 </span>

    <!-- Inner Circles -->
    <UniteOrbit
      class="size-[30px] items-center justify-center border-none bg-transparent"
      :duration="20"
      :delay="20"
      :radius="80"
      :direction="ORBIT_DIRECTION.CounterClockwise"
    >
      <WhatsAppIcon />
    </UniteOrbit>
    <UniteOrbit
      class="size-[30px] items-center justify-center border-none bg-transparent"
      :duration="20"
      :delay="10"
      :radius="80"
      path
      :direction="ORBIT_DIRECTION.CounterClockwise"
    >
      <NotionIcon />
    </UniteOrbit>

    <!-- Outer Circles (reverse) -->
    <UniteOrbit
      class="size-[50px] items-center justify-center border-none bg-transparent"
      :radius="190"
      :duration="20"
      path
    >
      <GoogleDriveIcon />
    </UniteOrbit>
    <UniteOrbit
      class="size-[50px] items-center justify-center border-none bg-transparent"
      :radius="190"
      :duration="20"
      :delay="200"
      :direction="ORBIT_DIRECTION.CounterClockwise"
    >
      <GitHubIcon />
    </UniteOrbit>
    <UniteOrbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="140"
      :delay="4"
    >
      🌕
    </UniteOrbit>
  </div>
</template>

<script setup lang="ts">
import { ORBIT_DIRECTION, UniteOrbit } from "../ui/orbit";
</script>
