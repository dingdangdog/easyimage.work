<template>
  <div
    class="relative group rounded-lg overflow-hidden bg-gray-400/50 shadow-md shadow-gray-300 hover:scale-105 transition duration-300 ease-in-out"
  >
    <img
      :src="image.thumbnail"
      class="w-full h-32 object-contain"
      @click="$emit('preview')"
      alt="thumbnail"
    />
    <div
      class="preview-overlay absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        @click.stop="$emit('preview')"
        class="text-white bg-green-600 hover:bg-green-700 px-2 py-1 rounded-md duration-300 ease-in-out"
      >
        <IconFullscreen class="w-6 h-6" color="rgb(243 244 246)" />
      </button>
      <div class="absolute bottom-1 right-2 flex space-x-2">
        <button
          @click.stop="$emit('remove')"
          class="text-white bg-red-500 hover:bg-red-600 p-1 rounded-full duration-300 ease-in-out"
        >
          <IconDelete class="w-4 h-4" color="rgb(243 244 246)" />
        </button>
        <button
          @click.stop="$emit('download')"
          class="text-white text-sm bg-blue-600 hover:bg-purple-700 p-1 rounded-full duration-300 ease-in-out"
        >
          <IconDownload class="w-4 h-4" color="rgb(243 244 246)" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: BaseImage;
}>();

const emit = defineEmits(["preview", "remove", "download"]);
</script>

<style scoped>
/* 图片hover 预览层 */
.preview-overlay {
  opacity: 0; /* 初始状态隐藏 */
  transition: opacity 0.3s ease; /* 添加过渡效果 */
}

.group:hover .preview-overlay {
  opacity: 1; /* hover 时显示 */
}

img {
  cursor: pointer;
}
</style>
