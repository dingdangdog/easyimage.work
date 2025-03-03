<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-pink-400"
    >
      {{ $t("converter.name") }}
    </h1>
    <p class="text-pink-300 my-2 text-center">
      {{ $t("converter.tips") }}
    </p>

    <div class="mb-4">
      <label class="block text-lg font-medium text-pink-400">{{
        $t("converter.target-formats")
      }}</label>
      <div class="mt-2 flex flex-wrap gap-4">
        <div
          v-for="format in availableFormats"
          :key="format"
          class="flex items-center"
        >
          <input
            type="checkbox"
            id="format-checkbox"
            v-model="targetFormats"
            :value="format"
            class="mr-2 rounded border-gray-300 text-purple-700 focus:ring-purple-500"
          />
          <label class="font-medium text-gray-300">{{
            format.toUpperCase()
          }}</label>
        </div>
      </div>
    </div>

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
        multiple
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
          {{ $t("converter.upload-tip") }}
          <button
            type="button"
            @click.stop="upload()"
            class="text-purple-800 font-bold hover:text-purple-700 focus:outline-none"
          >
            {{ $t("converter.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2">{{ $t("converter.upload-types") }}</p>
      </div>
    </div>

    <div v-if="processedImages.length > 0" class="my-4">
      <button
        @click="reprocessImages"
        :disabled="
          processing ||
          processedImages.length === 0 ||
          targetFormats.length === 0
        "
        class="w-full py-3 bg-green-500 hover:bg-purple-500 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
        :class="{
          'cursor-not-allowed': processing || targetFormats.length === 0,
        }"
      >
        {{ $t("converter.rerun") }}
      </button>
    </div>

    <div v-if="processing" class="mt-6 text-center text-gray-600">
      {{ $t("converter.running") }} ({{ processedCount }}/{{ totalFiles }})
    </div>

    <div v-if="processedImages.length > 0" class="flex space-x-4">
      <button
        @click="deleteAll"
        class="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("converter.delete-all-button") }}
      </button>
      <button
        @click="downloadAll"
        :disabled="processedImages.length === 0"
        class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
        :class="{
          'cursor-not-allowed': processedImages.length === 0,
        }"
      >
        {{ $t("converter.download-all-button") }}
      </button>
    </div>

    <div v-if="processedImages.length > 0" class="mt-6">
      <h3 class="text-xl font-semibold mb-4">
        {{ $t("converter.ready") }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="(image, index) in processedImages" :key="index">
          <ImageCard
            :image="image"
            @preview="previewImage(image)"
            @remove="removeImage(index)"
            @download="downloadImage(image)"
          />
          <p class="text-center text-gray-300">
            {{ image.type }}
          </p>
        </div>
      </div>
    </div>

    <ImagePreview
      :previewImageData="previewImageData"
      @close-preview="
        () => {
          previewImageData = undefined;
        }
      "
    />
  </div>
</template>

<script setup lang="ts">
import { downloadConvertAsZip } from "~/utils/zip"; // 暂时复用 zip 工具

const route = useRoute();
const { t } = useI18n();
useHead({
  title: `${t("converter.title")} - ${t("title")}`,
  meta: [
    { name: "description", content: t("converter.description") },
    { name: "keywords", content: t("converter.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("converter.title") },
    { name: "twitter:description", content: t("converter.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("converter.title") },
    { property: "og:description", content: t("converter.description") },
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

const formats = ["bmp", "ico", "jfif", "jpg", "jpeg", "png", "webp"];

const availableFormats = ref(formats); // 可选择的格式
const targetFormats = ref<string[]>(formats); // 默认选择 jpeg 和 webp
const originalImages = ref<File[]>([]);
const processedImages = ref<ConverterImage[]>([]); //  processedImages 类型any, 因为要存储不同格式的图片
const dragOver = ref(false);
const processing = ref(false);
const processedCount = ref(0);
const totalFiles = ref(0);
const previewImageData = ref();

// 处理图片格式转换
const processImage = async (file: File): Promise<ConverterImage[]> => {
  const img = new Image();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      img.src = String(e.target?.result);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const results: ConverterImage[] = []; // 存储不同格式的结果

      for (const format of targetFormats.value) {
        let mimeType = `image/${format}`;
        // 修正一些格式的 mimeType
        if (format === "ico") {
          mimeType = "image/x-icon"; // ICO 的 MIME 类型
        } else if (format === "jpg" || format === "jpeg" || format === "jfif") {
          mimeType = "image/jpeg"; //  jpg, jpeg, jfif 都使用 image/jpeg
        }
        try {
          const convertedDataURL = canvas.toDataURL(mimeType, 0.8); // jpeg 质量 0.8
          // results[format] = convertedDataURL; // 存储转换后的 DataURL

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
          const thumbnailDataURL = thumbCanvas.toDataURL();

          // name 去掉原有拓展名
          const name = file.name.replace(/\.[^/.]+$/, "");
          results.push({
            name: name,
            original: convertedDataURL,
            thumbnail: thumbnailDataURL,
            type: format,
          });
        } catch (err) {
          console.error(format + "图片转换失败:", err);
          continue;
        }
      }

      resolve(results);
    };

    reader.readAsDataURL(file);
  });
};

// 处理文件选择 (复用水印页面的)
const handleFileSelect = async (e: Event) => {
  const fileInput = e.target as HTMLInputElement;
  const files = fileInput.files ? Array.from(fileInput.files) : [];
  await processFiles(files);
  if (files && files.length > 0) {
    originalImages.value = files;
  }
};

// 处理拖放文件 (复用水印页面的)
const handleDrop = async (e: Event) => {
  dragOver.value = false;
  const fileInput = e.target as HTMLInputElement;
  const files = fileInput.files ? Array.from(fileInput.files) : [];
  await processFiles(files);
  originalImages.value = files;
};

// 统一处理文件 (基本复用水印页面的 processFiles，但不需要本地存储水印文字)
const processFiles = async (files: File[]) => {
  processing.value = true;
  totalFiles.value = files.length;
  processedCount.value = 0;

  const processingPromises = files.map(async (file) => {
    if (!file.type.startsWith("image/")) return;
    try {
      const result = await processImage(file);
      processedImages.value = result;
    } catch (error) {
      console.error("图片处理失败:", error, file.name);
    } finally {
      processedCount.value++;
    }
  });

  await Promise.all(processingPromises);
  processing.value = false;
};

// 重新处理图片 (复用水印页面的)
const reprocessImages = async () => {
  processedImages.value = [];
  await processFiles(originalImages.value);
};

// 下载图片 (修改下载逻辑，根据用户选择的格式下载)
const downloadImage = (image: ConverterImage) => {
  const link = document.createElement("a");
  link.href = image.original; //  从 image.original 中获取对应格式的 DataURL
  link.download = `${image.name}.${image.type}`; // 文件名带格式
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 删除图片 (复用水印页面的)
const removeImage = (index: number) => {
  processedImages.value.splice(index, 1);
};

// 全部删除 (复用水印页面的)
const deleteAll = () => {
  processedImages.value = [];
  originalImages.value = [];
};

// 全部下载 (修改下载逻辑，下载 ZIP 包含所有格式)
const downloadAll = () => {
  downloadConvertAsZip(
    processedImages.value,
    `easyimage.work_converted_${new Date().toLocaleDateString()}.zip`
  );
};

// 预览图片 (复用水印页面的)
const previewImage = (image: any) => {
  previewImageData.value = image;
};

onMounted(() => {
  // 监听esc事件，关闭全屏图片 (复用水印页面的)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      previewImageData.value = undefined;
    }
  });
});
</script>

<style scoped>
/* 样式复用水印页面的 */
.preview-overlay {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .preview-overlay {
  opacity: 1;
}

img {
  cursor: pointer;
}

option {
  color: black;
}
</style>
