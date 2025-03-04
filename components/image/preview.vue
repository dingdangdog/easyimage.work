<template>
  <div
    v-if="image"
    class="fixed w-screen h-screen inset-0 bg-gray-800 bg-opacity-90 z-50"
    @keydown.esc="$emit('close-preview')"
    tabindex="0"
  >
    <div class="relative p-2 w-full h-full flex justify-center items-center">
      <img
        :src="image"
        class="max-w-full max-h-full bg-gray-300/50"
        alt="Fullscreen Overview"
      />
      <button
        @click="$emit('close-preview')"
        class="text-white bg-red-600/60 hover:bg-red-500/60 px-2 py-1 md:px-4 md:py-2 rounded-lg absolute top-2 left-2 md:top-4 md:left-4"
      >
        <IconClose class="w-4 h-4 md:w-6 md:h-6" color="rgb(243 244 246)" />
      </button>
      <button
        @click="$emit('close-preview')"
        class="text-white bg-red-600/60 hover:bg-red-500/60 px-2 py-1 md:px-4 md:py-2 rounded-lg absolute bottom-2 left-2 md:bottom-4 md:left-4"
      >
        <IconClose class="w-4 h-4 md:w-6 md:h-6" color="rgb(243 244 246)" />
      </button>
      <button
        @click="$emit('close-preview')"
        class="text-white bg-red-600/60 hover:bg-red-500/60 px-2 py-1 md:px-4 md:py-2 rounded-lg absolute top-2 right-2 md:top-4 md:right-4"
      >
        <IconClose class="w-4 h-4 md:w-6 md:h-6" color="rgb(243 244 246)" />
      </button>
      <button
        @click="$emit('close-preview')"
        class="text-white bg-red-600/60 hover:bg-red-500/60 px-2 py-1 md:px-4 md:py-2 rounded-lg absolute bottom-4 right-2 md:right-4"
      >
        <IconClose class="w-4 h-4 md:w-6 md:h-6" color="rgb(243 244 246)" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string | undefined;
}>();

const emit = defineEmits(["close-preview"]);
</script>
