<script setup lang="ts">
const { color } = defineProps(["color"]);
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      :fill="color ? color : 'currentColor'"
      :stroke="color ? color : 'currentColor'"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M8 3L4 7l4 4M4 7h16m-4 14l4-4l-4-4m4 4H4"
    />
  </svg>
</template>

<style scoped></style>
