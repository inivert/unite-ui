<template>
  <ClientOnly>
    <div class="relative flex h-[500px] w-full flex-col overflow-hidden p-6">
      <AnimatedList>
        <template #default>
          <Notification
            v-for="(item, idx) in notifications"
            :key="idx"
            :name="item.name"
            :description="item.description"
            :icon="item.icon"
            :color="item.color"
            :time="item.time"
          />
        </template>
      </AnimatedList>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const notifications = [
  {
    name: "Payment received",
    description: "unite-ui",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "unite-ui",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "unite-ui",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "unite-ui",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
  {
    name: "Task completed",
    description: "unite-ui",
    time: "1m ago",
    icon: "✅",
    color: "#45B26B",
  },
];
</script>
