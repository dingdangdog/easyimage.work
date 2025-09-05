<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-yellow-700 dark:text-yellow-500"
    >
      {{ $t("resize.name") }}
    </h1>
    <p class="my-2 text-center text-yellow-600 dark:text-yellow-400">
      {{ $t("resize.tips") }}
    </p>

    <!-- 上传区域 -->
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click.stop="upload()"
      class="mt-6 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-300/50 dark:bg-gray-100/20 hover:bg-yellow-300/50 dark:hover:bg-yellow-300/30 border-yellow-400 hover:border-yellow-500 transition duration-300 ease-in-out"
      :class="{
        'border-yellow-700 bg-blue-50': dragOver,
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
            class="text-yellow-800 dark:text-yellow-400 font-bold hover:text-yellow-700 dark:hover:text-yellow-300 focus:outline-none"
          >
            {{ $t("resize.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-200">
          {{ $t("resize.upload-types") }}
        </p>
      </div>
    </div>

    <!-- 参数设置 -->
    <div
      class="mt-4 p-4 rounded-lg bg-gray-200/60 dark:bg-gray-800/40 text-gray-700 dark:text-gray-200"
    >
      <h3 class="text-lg font-semibold mb-3">{{ $t("resize.panel_title") }}</h3>
      <div class="grid grid-cols-1 gap-4">
        <div class="flex space-x-2 md:space-x-4">
          <label class="inline-flex items-center gap-1 cursor-pointer">
            <input type="radio" value="auto" v-model="selectedMode" />
            <span>{{ $t("resize.mode_auto") }}</span>
          </label>
          <label class="inline-flex items-center gap-1 cursor-pointer">
            <input type="radio" value="options" v-model="selectedMode" />
            <span>{{ $t("resize.mode_options") }}</span>
          </label>
          <label class="inline-flex items-center gap-1 cursor-pointer">
            <input type="radio" value="custom" v-model="selectedMode" />
            <span>{{ $t("resize.mode_custom") }}</span>
          </label>
        </div>

        <div v-if="selectedMode === 'options'">
          <label class="block text-sm mb-2">{{
            $t("resize.options_label")
          }}</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in presetSizes"
              :key="s.w + 'x' + s.h"
              type="button"
              class="px-3 py-1 rounded border border-gray-400/50 hover:border-yellow-300 hover:text-yellow-600"
              :class="{
                'bg-yellow-100 dark:bg-yellow-800/10 border-yellow-400 text-yellow-500':
                  isPresetSelected(s),
              }"
              @click="togglePreset(s)"
            >
              {{ s.w }}x{{ s.h }}
            </button>
          </div>
        </div>

        <div v-if="selectedMode === 'custom'">
          <label class="block text-sm mb-2">{{
            $t("resize.custom_label")
          }}</label>
          <input
            class="w-full px-3 py-2 rounded border border-gray-400/50 bg-white/80 dark:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            v-model="customSizesText"
            :placeholder="$t('resize.custom_placeholder')"
          />
          <p class="text-xs mt-1 opacity-70">{{ $t("resize.custom_hint") }}</p>
        </div>
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
        class="my-2 w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
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

// 参数设置
type ResizeMode = "auto" | "options" | "custom";
const selectedMode = ref<ResizeMode>("auto");
const presetSizes = ref<Array<{ w: number; h: number }>>([
  { w: 1024, h: 1024 },
  { w: 512, h: 512 },
  { w: 256, h: 256 },
  { w: 128, h: 128 },
  { w: 64, h: 64 },
  { w: 32, h: 32 },
]);
const selectedPresetKeys = ref<Set<string>>(new Set());
const customSizesText = ref("");

const makeKey = (w: number, h: number) => `${w}x${h}`;
const isPresetSelected = (s: { w: number; h: number }) =>
  selectedPresetKeys.value.has(makeKey(s.w, s.h));
const togglePreset = (s: { w: number; h: number }) => {
  const key = makeKey(s.w, s.h);
  if (selectedPresetKeys.value.has(key)) {
    selectedPresetKeys.value.delete(key);
  } else {
    selectedPresetKeys.value.add(key);
  }
  // 触发响应
  selectedPresetKeys.value = new Set(Array.from(selectedPresetKeys.value));
};

const parseCustomSizes = (text: string): Array<{ w: number; h: number }> => {
  const result: Array<{ w: number; h: number }> = [];
  if (!text) return result;
  const parts = text
    .split(/[,，]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const p of parts) {
    const m = p.match(/^(\d+)\s*[xX＊*]\s*(\d+)$/);
    if (m) {
      const w = Number(m[1]);
      const h = Number(m[2]);
      if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
        result.push({ w, h });
      }
    }
  }
  return result;
};

// 模式切换时的默认值
watch(
  selectedMode,
  (mode) => {
    if (mode === "options" && selectedPresetKeys.value.size === 0) {
      const defaults = [1024, 512, 256, 128, 64, 32];
      const next = new Set<string>();
      for (const s of presetSizes.value) {
        if (defaults.includes(s.w) && s.w === s.h) {
          next.add(makeKey(s.w, s.h));
        }
      }
      selectedPresetKeys.value = next;
    }
    if (mode === "custom" && !customSizesText.value) {
      customSizesText.value = "1024x1024, 800x600";
    }
  },
  { immediate: true }
);

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

        // 目标尺寸计算
        if (selectedMode.value === "auto") {
          // 缩小（/2）
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
          // 放大（x2）
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
        } else {
          // presets/custom/all 路径：构建待处理目标尺寸集合
          const targets = new Map<string, { w: number; h: number }>();
          if (selectedMode.value === "options") {
            const base = presetSizes.value.filter((s) =>
              selectedPresetKeys.value.has(makeKey(s.w, s.h))
            );
            for (const s of base)
              targets.set(makeKey(s.w, s.h), { w: s.w, h: s.h });
          }
          if (selectedMode.value === "custom") {
            for (const s of parseCustomSizes(customSizesText.value)) {
              targets.set(makeKey(s.w, s.h), s);
            }
          }

          for (const { w, h } of targets.values()) {
            const resized = resizeIntoBoxAndCenter(
              img,
              w,
              h,
              mimeType,
              file.name
            );
            if (resized) imageResults.push(resized);
          }
        }

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

// 将原图等比缩放到目标画布内，并居中（保持背景透明/空白）
const resizeIntoBoxAndCenter = (
  targetImg: HTMLImageElement,
  boxW: number,
  boxH: number,
  mimeType: string,
  fileName: string
): ResizeImage | undefined => {
  const srcW = targetImg.naturalWidth;
  const srcH = targetImg.naturalHeight;
  if (boxW <= 0 || boxH <= 0) return;

  const canvas = document.createElement("canvas");
  canvas.width = boxW;
  canvas.height = boxH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scale = Math.min(boxW / srcW, boxH / srcH);
  const drawW = Math.floor(srcW * scale);
  const drawH = Math.floor(srcH * scale);
  const offsetX = Math.floor((boxW - drawW) / 2);
  const offsetY = Math.floor((boxH - drawH) / 2);

  // 清空画布为透明（PNG/JPEG都会被覆盖）
  ctx.clearRect(0, 0, boxW, boxH);
  ctx.drawImage(targetImg, 0, 0, srcW, srcH, offsetX, offsetY, drawW, drawH);

  const dataUrl = canvas.toDataURL(mimeType);

  // 生成缩略图
  const thumbCanvas = document.createElement("canvas");
  const thumbCtx = thumbCanvas.getContext("2d");
  if (!thumbCtx) return;
  const maxWidth = 250;
  const maxHeight = 200;
  let thumbWidth = boxW;
  let thumbHeight = boxH;
  if (thumbWidth > maxWidth || thumbHeight > maxHeight) {
    const ratio = Math.min(maxWidth / thumbWidth, maxHeight / thumbHeight);
    thumbWidth = Math.floor(thumbWidth * ratio);
    thumbHeight = Math.floor(thumbHeight * ratio);
  }
  thumbCanvas.width = thumbWidth;
  thumbCanvas.height = thumbHeight;
  thumbCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

  const imageResult: ResizeImage = {
    width: boxW,
    height: boxH,
    original: dataUrl,
    thumbnail: thumbCanvas.toDataURL(mimeType),
    name: `${fileName.split(".")[0]}_${boxW}x${boxH}.${fileName
      .split(".")
      .pop()}`,
    isOriginal: false,
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
