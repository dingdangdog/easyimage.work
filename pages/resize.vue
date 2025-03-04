<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-orange-400"
    >
      {{ $t("resize.name") }}
    </h1>
    <p class="my-2 text-center text-orange-300">
      {{ $t("resize.tips") }}
    </p>

    <!-- 上传区域 -->
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click.stop="upload()"
      class="mt-6 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-100/20 hover:bg-purple-300/50 hover:border-purple-700 transition duration-300 ease-in-out"
      :class="{
        'border-purple-700 bg-blue-50': dragOver,
        'border-gray-300': !dragOver,
      }"
    >
      <input
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
        ref="fileInput"
      />
      <div
        class="text-gray-300 duration-100 ease-in-out"
        :class="{
          'my-0': processedImages.length > 0,
          'my-16': processedImages.length === 0,
        }"
      >
        <p>
          {{ $t("resize.upload-tip") }}
          <button
            type="button"
            @click.stop="upload()"
            class="text-purple-800 font-bold hover:text-purple-700 focus:outline-none"
          >
            {{ $t("resize.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2">{{ $t("resize.upload-types") }}</p>
      </div>
    </div>

    <!-- 处理中提示 -->
    <div v-if="processing" class="mt-6 text-center text-gray-600">
      {{ $t("resize.running") }}
    </div>

    <!-- 处理结果 -->
    <div v-if="processedImages.length > 0" class="mt-6">
      <h3 class="text-xl font-semibold mb-4">{{ $t("resize.ready") }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="(image, index) in processedImages" :key="index">
          <ImageCard
            :key="index"
            :image="image"
            @preview="previewImage(image)"
            @remove="removeImage(index)"
            @download="downloadImage(image)"
          />
          <p class="text-center text-gray-300">
            {{ image.width }}x{{ image.height
            }}{{ index === 0 ? `(${t("resize.origin")})` : "" }}
          </p>
        </div>
      </div>
      <button
        @click="downloadAll"
        class="mt-4 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("resize.download-all-button") }}
      </button>
    </div>

    <!-- 预览弹窗 -->

    <ImagePreview
      :image="previewImageData"
      @close-preview="
        () => {
          previewImageData = undefined;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { downloadResizeAsZip } from "~/utils/zip"; // 假设你已有此工具函数

const route = useRoute();
const { t } = useI18n(); // 显式获取 $t
useHead({
  title: t("resize.title"),
  meta: [
    { name: "description", content: t("resize.description") },
    { name: "keywords", content: t("resize.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("resize.title") },
    { name: "twitter:description", content: t("resize.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("resize.title") },
    { property: "og:description", content: t("resize.description") },
    {
      property: "og:image",
      content: "https://easyimage.work/favicon.webp",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://easyimage.work${route.path}` },
    { property: "og:site_name", content: t("title") },
    { name: "google-adsense-account", content: "ca-pub-8842635629279684" },
  ],
});

const fileInput = ref<HTMLInputElement | null>(null);
const upload = () => {
  fileInput.value?.click();
};

// 响应式变量
const dragOver = ref(false); // 拖放状态
const processing = ref(false); // 处理状态
const processedImages = ref<ResizeImage[]>([]); // 处理后的图片数组
const previewImageData = ref<string>(); // 预览图片

// 处理文件选择
const handleFileSelect = async (e: Event) => {
  const fileInput = e.target as HTMLInputElement;
  const file = fileInput.files ? fileInput.files[0] : null;
  if (file) {
    await processImage(file);
  }
};

// 处理拖放
const handleDrop = async (e: DragEvent) => {
  dragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) {
    await processImage(file);
  }
};

// 处理图片
const processImage = async (file: File) => {
  processing.value = true;
  processedImages.value = [];

  const img = new Image();
  const reader = new FileReader();

  return new Promise<void>((resolve) => {
    reader.onload = (e) => {
      img.src = String(e.target?.result);
    };

    img.onload = async () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const mimeType = file.type;

      let width = originalWidth;
      let height = originalHeight;
      let n = 0;

      // 以2的倍数递减，直到宽度或高度小于64
      while (width >= 64 && height >= 64) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) break;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(mimeType);

        // 生成缩略图
        const thumbCanvas = document.createElement("canvas");
        const thumbCtx = thumbCanvas.getContext("2d");
        if (!thumbCtx) break;

        const maxWidth = 250;
        const maxHeight = 200;
        let thumbWidth = width;
        let thumbHeight = height;

        if (thumbWidth > maxWidth || thumbHeight > maxHeight) {
          const ratio = Math.min(
            maxWidth / thumbWidth,
            maxHeight / thumbHeight
          );
          thumbWidth = thumbWidth * ratio;
          thumbHeight = thumbHeight * ratio;
        }

        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;
        thumbCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

        processedImages.value.push({
          width,
          height,
          original: dataUrl,
          thumbnail: thumbCanvas.toDataURL(mimeType),
          name: `${file.name.split(".")[0]}_${width}x${height}.${file.name
            .split(".")
            .pop()}`,
        });

        n++;
        width = Math.floor(originalWidth / Math.pow(2, n));
        height = Math.floor(originalHeight / Math.pow(2, n));
      }

      processing.value = false;
      resolve();
    };

    reader.readAsDataURL(file);
  });
};

// 下载单张图片
const downloadImage = (image: ResizeImage) => {
  const link = document.createElement("a");
  link.href = image.original;
  link.download = image.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 删除单张图片
const removeImage = (index: number) => {
  processedImages.value.splice(index, 1);
};

// 下载所有图片
const downloadAll = () => {
  downloadResizeAsZip(
    processedImages.value,
    `easyimage.work_resize_${new Date().toLocaleDateString()}.zip`
  );
};

// 预览图片
const previewImage = (image: ResizeImage) => {
  previewImageData.value = image.original;
};

// 监听ESC键关闭预览
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      previewImageData.value = undefined;
    }
  });
});
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

option {
  color: black;
}
</style>
