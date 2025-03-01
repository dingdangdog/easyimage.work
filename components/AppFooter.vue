<template>
  <footer
    class="min-h-16 p-2 bg-gray-950 flex flex-col items-center justify-center space-y-2"
  >
    <p>
      Power By
      <a href="https://easyimage.work" class="underline">easyimage.work</a>
    </p>
    <p>
      <a href="mailto:contact@easyimage.work" class="underline"
        >contact@easyimage.work</a
      >
    </p>
    <!-- <p>
      <a :href="localePath('/about')" class="hover:underline"> 关于 </a>
    </p> -->
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>

<style scoped></style>
