<template>
  <div class="grid place-content-center p-10">
    <UniteBook>
      <UniteBookHeader>
        <Icon
          name="heroicons:book-open-solid"
          size="24"
        />
      </UniteBookHeader>
      <UniteBookTitle>
        <h1>The Book</h1>
      </UniteBookTitle>
      <UniteBookDescription>
        <p>Hover me to animate!</p>
      </UniteBookDescription>
    </UniteBook>
  </div>
</template>

<script setup lang="ts">
import {
  UniteBook,
  UniteBookHeader,
  UniteBookTitle,
  UniteBookDescription,
} from "~/components/content/inspira/ui/book";
</script>
