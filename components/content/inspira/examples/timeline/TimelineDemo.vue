<template>
  <div class="h-fit w-full">
    <Timeline
      :items="data"
      title="Beam me up"
      description="Show the timeline in style"
    >
      <template
        v-for="(item, index) in data"
        :key="item.id + 'template'"
        #[item.id]
      >
        <div class="relative w-full pl-20 pr-4 md:pl-4">
          <h3
            class="mb-4 block text-left text-2xl font-bold text-neutral-500 dark:text-neutral-500"
          >
            {{ `Section ${index + 1}` }}
          </h3>
        </div>
        <TimelineItem>
          <template #title>Freedom to Design</template>
          <template #description>
            unite-ui gives you the freedom to design awesome website, in less time.
          </template>
        </TimelineItem>
      </template>
    </Timeline>
  </div>
</template>

<script setup lang="ts">
const data = [
  {
    id: "version1.0",
    label: "Version 1.0",
  },
  {
    id: "version2.0",
    label: "Version 2.0",
  },

  {
    id: "version3.0",
    label: "Version 3.0",
  },
  {
    id: "version4.0",
    label: "Version 4.0",
  },

  {
    id: "version5.0",
    label: "Version 5.0",
  },
  {
    id: "version6.0",
    label: "Version 6.0",
  },
];
</script>
