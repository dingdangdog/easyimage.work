<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-orange-400 dark:text-orange-300"
    >
      {{ $t("resize.name") }}
    </h1>
    <p class="my-2 text-center text-orange-300 dark:text-orange-200">
      {{ $t("resize.tips") }}
    </p>

    <!-- 上传区域 -->
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click.stop="upload()"
      class="mt-6 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-300/50 dark:bg-gray-100/20 hover:bg-orange-300/50 dark:hover:bg-orange-300/30 border-orange-300 hover:border-orange-500 transition duration-300 ease-in-out"
      :class="{
        'border-orange-700 bg-blue-50': dragOver,
      }"
    >
      <input
        type="file"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
        ref="fileInput"
      />
      <div
        class="duration-100 ease-in-out"
        :class="{
          'my-0': processedImages.length > 0,
          'my-16': processedImages.length === 0,
        }"
      >
        <p class="text-gray-500 dark:text-gray-200">
          {{ $t("resize.upload-tip") }}
          <button
            type="button"
            @click.stop="upload()"
            class="text-orange-800 dark:text-orange-400 font-bold hover:text-orange-700 dark:hover:text-orange-300 focus:outline-none"
          >
            {{ $t("resize.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-200">
          {{ $t("resize.upload-types") }}
        </p>
      </div>
    </div>

    <!-- 处理中提示 -->
    <div
      v-if="processing"
      class="mt-6 text-center text-gray-600 dark:text-gray-300"
    >
      {{ $t("resize.running") }}({{ nowNum }}/{{ totalNum }})
    </div>

    <!-- 处理结果 -->
    <div v-if="processedImages.length > 0" class="mt-4">
      <button
        @click="downloadAll"
        class="my-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("resize.download-all-button") }}
      </button>
      <button
        @click="removeAll"
        class="my-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("resize.remove-all-button") }}
      </button>

      <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {{ $t("resize.ready") }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(image, index) in processedImages" :key="index">
          <ImageCard
            :key="index"
            :image="image"
            @preview="previewImage(image)"
            @remove="removeImage(index)"
            @download="downloadImage(image)"
          />
          <p class="mt-2 text-center text-gray-300 dark:text-gray-400">
            {{ image.width }}x{{ image.height
            }}{{ image.isOriginal ? `(${t("resize.origin")})` : "" }}
          </p>
        </div>
      </div>
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
  const files = fileInput.files ? Array.from(fileInput.files) : [];
  await processFiles(files);
};

// 处理拖放
const handleDrop = async (e: DragEvent) => {
  dragOver.value = false;
  const files = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
  await processFiles(files);
};

const nowNum = ref(0);
const totalNum = ref(0);
// 处理图片
const processFiles = async (files: File[]) => {
  processing.value = true;
  totalNum.value = files.length;
  nowNum.value = 1;
  for (const file of files) {
    console.log(`Processing file: ${file.name}`);
    const img = new Image();
    const reader = new FileReader();

    await new Promise<void>((resolve) => {
      reader.onload = (e) => {
        img.src = String(e.target?.result);
      };

      img.onload = async () => {
        const originalWidth = img.naturalWidth;
        const originalHeight = img.naturalHeight;
        const mimeType = file.type;

        const imageResults: ResizeImage[] = [];

        // 添加原图
        const originalImage = addImageToResults(
          originalWidth,
          originalHeight,
          img,
          mimeType,
          file.name,
          true
        );
        if (originalImage) imageResults.push(originalImage);

        console.log(`Original image added for: ${file.name}`);

        // 缩小图片尺寸（以2的倍数递减，直到宽度或高度小于64）
        let width = originalWidth;
        let height = originalHeight;
        let n = 1;

        while (width / 2 >= 64 && height / 2 >= 64) {
          width = Math.floor(originalWidth / Math.pow(2, n));
          height = Math.floor(originalHeight / Math.pow(2, n));
          const resizedImage = addImageToResults(
            width,
            height,
            img,
            mimeType,
            file.name
          );
          if (resizedImage) imageResults.push(resizedImage);
          n++;
        }

        console.log(`Resized images added for: ${file.name}`);

        // 放大图片尺寸（以2的倍数增加，直到宽度或高度达到4096）
        width = originalWidth;
        height = originalHeight;
        n = 1;

        while (width * 2 <= 4096 && height * 2 <= 4096) {
          width = Math.floor(originalWidth * Math.pow(2, n));
          height = Math.floor(originalHeight * Math.pow(2, n));
          const enlargedImage = addImageToResults(
            width,
            height,
            img,
            mimeType,
            file.name
          );
          if (enlargedImage) imageResults.push(enlargedImage);
          n++;
        }

        console.log(`Enlarged images added for: ${file.name}`);

        // Sort results for this image only
        imageResults.sort((a, b) => {
          if (a.isOriginal) return -1;
          if (b.isOriginal) return 1;
          return b.width * b.height - a.width * a.height;
        });

        processedImages.value = [...processedImages.value, ...imageResults];
        nowNum.value++;
        resolve();
      };

      reader.readAsDataURL(file);
    });
  }

  processing.value = false;
};

// 添加图片到结果数组中
const addImageToResults = (
  width: number,
  height: number,
  img: HTMLImageElement,
  mimeType: string,
  fileName: string,
  isOriginal = false
): ResizeImage | undefined => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL(mimeType);

  // 生成缩略图
  const thumbCanvas = document.createElement("canvas");
  const thumbCtx = thumbCanvas.getContext("2d");
  if (!thumbCtx) return;

  const maxWidth = 250;
  const maxHeight = 200;
  let thumbWidth = width;
  let thumbHeight = height;

  if (thumbWidth > maxWidth || thumbHeight > maxHeight) {
    const ratio = Math.min(maxWidth / thumbWidth, maxHeight / thumbHeight);
    thumbWidth = thumbWidth * ratio;
    thumbHeight = thumbHeight * ratio;
  }

  thumbCanvas.width = thumbWidth;
  thumbCanvas.height = thumbHeight;
  thumbCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

  const imageResult: ResizeImage = {
    width,
    height,
    original: dataUrl,
    thumbnail: thumbCanvas.toDataURL(mimeType),
    name: `${fileName.split(".")[0]}_${width}x${height}.${fileName
      .split(".")
      .pop()}`,
    isOriginal: isOriginal,
  };
  return imageResult;
};

// 全部删除 (复用水印页面的)
const removeAll = () => {
  processedImages.value = [];
  if (fileInput.value) {
    fileInput.value.value = "";
  }
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
