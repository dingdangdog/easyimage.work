<script setup lang="ts">
const { color } = defineProps(["color"]);
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      :fill="color ? color : 'currentColor'"
      d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H3V5h18zm-10-7h9v6h-9z"
    />
  </svg>
</template>

<style scoped></style>
