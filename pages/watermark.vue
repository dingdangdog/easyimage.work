<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-indigo-400 dark:text-indigo-300"
    >
      {{ $t("watermark.name") }}
    </h1>
    <p class="my-2 text-center text-indigo-600 dark:text-indigo-200">
      {{ $t("watermark.tips") }}
    </p>

    <div class="mb-4">
      <label
        for="watermark-text"
        class="block text-lg font-medium text-blue-700 dark:text-blue-300"
        >{{ $t("watermark.mark-text") }}</label
      >
      <input
        id="watermark-text"
        v-model="watermarkText"
        type="text"
        class="mt-2 p-2 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700 transition duration-300 ease-in-out"
      />
    </div>

    <div class="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div>
        <label
          for="watermark-size"
          class="block font-medium text-blue-700 dark:text-blue-300"
          >{{ $t("watermark.mark-size") }}(px)</label
        >
        <input
          id="watermark-size"
          v-model.number="watermarkSize"
          type="number"
          min="10"
          max="100"
          step="1"
          class="mt-2 p-2 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700 transition duration-300 ease-in-out"
        />
      </div>
      <div>
        <label
          for="watermark-position"
          class="block font-medium text-blue-700 dark:text-blue-300"
          >{{ $t("watermark.mark-position") }}</label
        >
        <select
          id="watermark-position"
          v-model="watermarkPosition"
          class="mt-2 p-2 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700 transition duration-300 ease-in-out"
        >
          <option value="random" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.random") }}
          </option>
          <option
            value="center-center"
            class="text-gray-600 dark:text-gray-400"
          >
            {{ $t("watermark.mark-size-option.center-center") }}
          </option>
          <option value="center-top" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.center-top") }}
          </option>
          <option
            value="center-bottom"
            class="text-gray-600 dark:text-gray-400"
          >
            {{ $t("watermark.mark-size-option.center-bottom") }}
          </option>
          <option value="left-center" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.left-center") }}
          </option>
          <option value="right-center" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.right-center") }}
          </option>
          <option value="top-left" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.top-left") }}
          </option>
          <option value="top-right" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.top-right") }}
          </option>
          <option value="bottom-left" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.bottom-left") }}
          </option>
          <option value="bottom-right" class="text-gray-600 dark:text-gray-400">
            {{ $t("watermark.mark-size-option.bottom-right") }}
          </option>
        </select>
      </div>
      <div>
        <label
          for="watermark-font"
          class="block font-medium text-blue-700 dark:text-blue-300"
          >{{ $t("watermark.mark-font") }}</label
        >
        <select
          id="watermark-font"
          v-model="watermarkFont"
          class="mt-2 p-2 block w-full rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700 transition duration-300 ease-in-out"
        >
          <option
            value="Arial"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Arial"
          >
            Arial
          </option>
          <option
            value="Arial Black"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'Arial Black'"
          >
            Arial Black
          </option>
          <option
            value="Bookman"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Bookman"
          >
            Bookman
          </option>
          <option
            value="Comic Sans MS"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'Comic Sans MS'"
          >
            Comic Sans MS
          </option>
          <option
            value="Courier"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Courier"
          >
            Courier
          </option>
          <option
            value="Courier New"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'Courier New'"
          >
            Courier New
          </option>
          <option
            value="Garamond"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Garamond"
          >
            Garamond
          </option>
          <option
            value="Georgia"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Georgia"
          >
            Georgia
          </option>
          <option
            value="Helvetica"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Helvetica"
          >
            Helvetica
          </option>
          <option
            value="Impact"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Impact"
          >
            Impact
          </option>
          <option
            value="MapleMono-Medium"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'MapleMono-Medium'"
          >
            MapleMono-Medium
          </option>
          <option
            value="Palatino"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Palatino"
          >
            Palatino
          </option>
          <option
            value="SmileySans-Oblique"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'SmileySans-Oblique'"
          >
            SmileySans-Oblique
          </option>
          <option
            value="Tahoma"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Tahoma"
          >
            Tahoma
          </option>
          <option
            value="Times"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Times"
          >
            Times
          </option>
          <option
            value="Times New Roman"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'Times New Roman'"
          >
            Times New Roman
          </option>
          <option
            value="Trebuchet MS"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: 'Trebuchet MS'"
          >
            Trebuchet MS
          </option>
          <option
            value="Verdana"
            class="text-gray-600 dark:text-gray-400"
            style="font-family: Verdana"
          >
            Verdana
          </option>
        </select>
      </div>
    </div>

    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click.stop="upload()"
      class="mt-6 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-300/50 dark:bg-gray-100/20 hover:bg-indigo-300/50 dark:hover:bg-indigo-300/30 border-indigo-300 hover:border-indigo-500 transition duration-300 ease-in-out"
      :class="{
        'border-indigo-700 bg-blue-50': dragOver,
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
          {{ $t("watermark.upload-tip") }}
          <button
            type="button"
            @click.stop="upload()"
            class="text-indigo-800 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 focus:outline-none"
          >
            {{ $t("watermark.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-200">
          {{ $t("watermark.upload-types") }}
        </p>
      </div>
    </div>

    <div v-if="processedImages.length > 0" class="my-4">
      <button
        @click="reprocessImages"
        :disabled="processing || processedImages.length === 0"
        class="w-full py-3 bg-green-500 hover:bg-blue-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
        :class="{
          'cursor-not-allowed': processing,
        }"
      >
        {{ $t("watermark.rerun") }}
      </button>
    </div>

    <div
      v-if="processing"
      class="mt-6 text-center text-gray-600 dark:text-gray-400"
    >
      {{ $t("watermark.running") }} ({{ processedCount }}/{{ totalFiles }})
    </div>

    <div v-if="processedImages.length > 0" class="flex space-x-4">
      <button
        @click="deleteAll"
        class="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("watermark.delete-all-button") }}
      </button>
      <button
        @click="downloadAll"
        class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("watermark.download-all-button") }}
      </button>
    </div>

    <div v-if="processedImages.length > 0" class="mt-6">
      <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {{ $t("watermark.ready") }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <ImageCard
          v-for="(image, index) in processedImages"
          :key="index"
          :image="image"
          @preview="previewImage(image)"
          @remove="removeImage(index)"
          @download="downloadImage(image)"
        />
      </div>
    </div>

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
import { downloadWatermarkAsZip } from "~/utils/zip";
const route = useRoute();
const { t } = useI18n(); // 显式获取 $t
useHead({
  title: t("watermark.title"),
  meta: [
    { name: "description", content: t("watermark.description") },
    { name: "keywords", content: t("watermark.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("watermark.title") },
    { name: "twitter:description", content: t("watermark.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("watermark.title") },
    { property: "og:description", content: t("watermark.description") },
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

const watermarkText = ref("WaterMark Text");
const watermarkSize = ref(40);
const watermarkPosition = ref("random");
const watermarkFont = ref("SmileySans-Oblique");
const originalImages = ref<File[]>([]); // 用于存储原图
const processedImages = ref<WatermarkImage[]>([]);
const dragOver = ref(false);
const processing = ref(false);
const processedCount = ref(0);
const totalFiles = ref(0);
// 预览
const previewImageData = ref<string>();

// 处理图片
const processImage = async (file: File): Promise<WatermarkImage> => {
  const img = new Image();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      img.src = String(e.target?.result);
    };

    img.onerror = (error) => {
      // 添加图片加载失败处理
      reject(error);
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (watermarkText.value) {
        ctx.font = `${watermarkSize.value}px ${watermarkFont.value}`;
        ctx.fillStyle = "rgba(128, 128, 128, 0.8)";

        // 获取实际位置 - 处理随机选项
        let actualPosition = watermarkPosition.value;
        if (actualPosition === "random") {
          // 定义所有可能的位置选项
          const positions = [
            "center-center",
            "center-top",
            "center-bottom",
            "left-center",
            "right-center",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
          ];
          // 随机选择一个位置
          const randomIndex = Math.floor(Math.random() * positions.length);
          actualPosition = positions[randomIndex];
        }

        // 设置文本对齐方式
        ctx.textAlign = "center";
        if (actualPosition.includes("left")) {
          ctx.textAlign = "left";
        } else if (actualPosition.includes("right")) {
          ctx.textAlign = "right";
        } else if (actualPosition.startsWith("center-")) {
          ctx.textAlign = "center";
        }
        ctx.textBaseline = "middle";

        // 默认正中
        let x = canvas.width / 2;
        let y = canvas.height / 2;

        // 根据位置设置坐标
        if (actualPosition === "top-left") {
          x = 10;
          y = watermarkSize.value;
        } else if (actualPosition === "top-right") {
          x = canvas.width - 10; // 右对齐，需要减去文字宽度和一些边距
          y = watermarkSize.value;
        } else if (actualPosition === "bottom-left") {
          x = 10;
          y = canvas.height - watermarkSize.value; // 下对齐，需要减去文字大小和一些边距
        } else if (actualPosition === "bottom-right") {
          x = canvas.width - 10; // 右下对齐
          y = canvas.height - watermarkSize.value; // 右下对齐
        } else if (actualPosition === "center-top") {
          x = canvas.width / 2;
          y = watermarkSize.value;
        } else if (actualPosition === "center-bottom") {
          x = canvas.width / 2;
          y = canvas.height - watermarkSize.value;
        } else if (actualPosition === "left-center") {
          x = 10;
          y = canvas.height / 2;
        } else if (actualPosition === "right-center") {
          x = canvas.width - 10;
          y = canvas.height / 2;
        }
        // console.log(x, y);
        // console.log(canvas.width, canvas.height);

        ctx.fillText(watermarkText.value, x, y);
      }

      const thumbCanvas = document.createElement("canvas");
      const thumbCtx = thumbCanvas.getContext("2d");
      if (!thumbCtx) {
        return;
      }
      const maxWidth = 250,
        maxHeight = 200;
      let width = img.width,
        height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      thumbCanvas.width = width;
      thumbCanvas.height = height;
      thumbCtx.drawImage(canvas, 0, 0, width, height);

      resolve({
        original: canvas.toDataURL(file.type),
        thumbnail: thumbCanvas.toDataURL(),
        name: file.name,
      });
    };

    reader.readAsDataURL(file);
  });
};

// 处理文件选择
const handleFileSelect = async (e: Event) => {
  const fileInput = e.target as HTMLInputElement;
  const files = fileInput.files ? Array.from(fileInput.files) : [];
  await processFiles(files);
  if (files && files.length > 0) {
    originalImages.value = files; // 存储 File 对象，而不是 URL
  }
};

// 处理拖放文件
const handleDrop = async (e: Event) => {
  dragOver.value = false;
  const fileInput = e.target as HTMLInputElement;
  const files = fileInput.files ? Array.from(fileInput.files) : [];
  await processFiles(files);
  originalImages.value = files; // 存储 File 对象，而不是 URL
};

// 统一处理文件
const processFiles = async (files: File[]) => {
  processing.value = true;
  totalFiles.value = files.length;
  processedCount.value = 0;
  if (watermarkText.value) {
    localStorage.setItem("watermarkText", watermarkText.value);
  }

  const processingPromises = files.map(async (file) => {
    // 使用 map 创建 Promise 数组
    if (!file.type.startsWith("image/")) return;
    try {
      const result = await processImage(file);
      processedImages.value.push(result); // 直接 push 到响应式数组
    } catch (error) {
      console.error("图片处理失败:", error, file.name); // 打印文件名以便调试
      // 可以选择是否继续处理其他图片，这里选择继续
    } finally {
      processedCount.value++; // 无论成功失败都增加计数
    }
  });

  await Promise.all(processingPromises); // 并行处理所有图片
  processing.value = false;
};

// Reprocess Images: Reapply watermark to previously processed images
const reprocessImages = async () => {
  processedImages.value = []; // 清空之前处理的图片
  await processFiles(originalImages.value); // 重新处理原图 File 对象
};

// 下载图片
const downloadImage = (image: WatermarkImage) => {
  const link = document.createElement("a");
  link.href = image.original;
  link.download = `watermark_${image.name}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 删除图片
const removeImage = (index: number) => {
  processedImages.value.splice(index, 1);
};

// 全部删除
const deleteAll = () => {
  processedImages.value = [];
  originalImages.value = [];
};

// 全部下载
const downloadAll = () => {
  // processedImages.value.forEach((image) => downloadImage(image));
  downloadWatermarkAsZip(
    processedImages.value,
    `easyimage.work_watermark-${new Date().toLocaleDateString()}.zip`
  );
};

// 预览图片
const previewImage = (image: WatermarkImage) => {
  previewImageData.value = image.original;
};

onMounted(() => {
  const lastText = localStorage.getItem("watermarkText");
  if (lastText) {
    watermarkText.value = lastText;
  }
  // 监听esc事件，关闭全屏图片
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      previewImageData.value = undefined;
    }
  });
});
</script>

<style scoped>
/* Dynamic font loading - only loaded when needed */
@font-face {
  font-family: "SmileySans-Oblique";
  src: url("@/assets/fonts/SmileySans-Oblique.ttf") format("truetype"),
    url("@/assets/fonts/SmileySans-Oblique.otf") format("opentype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "MapleMono-Medium";
  src: url("@/assets/fonts/MapleMono-NF-Medium.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

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
