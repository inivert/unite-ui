<template>
  <div class="flex w-full flex-row items-center justify-between py-4">
    <p>
      {{
        `Current direction : ${ORBIT_DIRECTION.Clockwise === direction ? "Clockwise" : "CounterClockwise"}`
      }}
    </p>
    <UiButton @click="switchDirection">{{
      `Switch to : ${ORBIT_DIRECTION.Clockwise === direction ? "CounterClockwise" : "Clockwise"}`
    }}</UiButton>
  </div>
  <div
    class="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
  >
    <span class="pointer-events-none text-center text-8xl font-semibold leading-none"> 🌍 </span>

    <UniteOrbit
      class="items-center justify-center border-none bg-transparent text-xl"
      :radius="190"
      :duration="20"
      :delay="200"
      :direction="direction"
      path
    >
      🪨
    </UniteOrbit>
    <UniteOrbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="100"
      :delay="4"
      :direction="direction"
      path
    >
      🌕
    </UniteOrbit>
    <UniteOrbit
      class="items-center justify-center border-none bg-transparent text-4xl"
      :radius="250"
      :delay="4"
      :direction="direction"
      path
    >
      🪐
    </UniteOrbit>
  </div>
</template>

<script setup lang="ts">
import { ORBIT_DIRECTION, type OrbitDirection, UniteOrbit } from "../ui/orbit";

const direction = ref<OrbitDirection>(ORBIT_DIRECTION.Clockwise);

function switchDirection() {
  if (ORBIT_DIRECTION.Clockwise === direction.value) {
    direction.value = ORBIT_DIRECTION.CounterClockwise;
    return;
  }

  direction.value = ORBIT_DIRECTION.Clockwise;
}
</script>
