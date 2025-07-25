<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-purple-400 dark:text-purple-300"
    >
      {{ $t("crop.name") }}
    </h1>

    <div
      v-if="cropperVisible"
      class="mt-2 md:mt-6 rounded-lg shadow-md overflow-hidden flex flex-col space-y-4 justify-center"
    >
      <!-- 裁剪器 -->
      <cropper-canvas
        class="min-h-80 w-full"
        id="cropperCanvas"
        ref="cropperCanvas"
        background
      >
        <!-- 裁剪器内部显示要裁剪的图片 -->
        <cropper-image
          class="h-full"
          :src="cropperImageUrl"
          alt="cropperImage"
          ref="cropperImage"
          rotatable
          scalable
          skewable
          translatable
        ></cropper-image>
        <!-- 显示裁剪器阴影 -->
        <cropper-shade hidden></cropper-shade>
        <!-- 显示准星 -->
        <cropper-crosshair centered></cropper-crosshair>
        <!-- 允许选择裁剪区域 -->
        <cropper-handle action="select" plain></cropper-handle>
        <!-- 裁剪器裁剪区域窗口 -->
        <cropper-selection
          id="cropperSelection"
          ref="cropperSelection"
          :initialCoverage="selection.initialCoverage"
          :x="selection.x"
          :y="selection.y"
          :width="selection.width"
          :height="selection.height"
          :aspect-ratio="selection.aspectRatio"
          :hidden="selection.hidden"
          :initial-aspect-ratio="selection.initialAspectRatio"
          :movable="selection.movable"
          :resizable="selection.resizable"
          :zoomable="selection.zoomable"
          :multiple="selection.multiple"
          :keyboard="selection.keyboard"
          :outlined="selection.outlined"
          :precise="selection.precise"
          :dynamic="selection.dynamic"
        >
          <!-- 允许拖动裁剪器 -->
          <cropper-handle
            action="move"
            theme-color="rgba(255, 255, 255, 0.35)"
          ></cropper-handle>
          <!-- 允许北方（上）裁剪尺寸变化 -->
          <cropper-handle action="n-resize"></cropper-handle>
          <!-- 允许东方（右）裁剪尺寸变化 -->
          <cropper-handle action="e-resize"></cropper-handle>
          <!-- 允许南方（下）裁剪尺寸变化 -->
          <cropper-handle action="s-resize"></cropper-handle>
          <!-- 允许西方（左）裁剪尺寸变化 -->
          <cropper-handle action="w-resize"></cropper-handle>
          <!-- 允许东北方（右上）裁剪尺寸变化 -->
          <cropper-handle action="ne-resize"></cropper-handle>
          <!-- 允许西北方（左上）裁剪尺寸变化 -->
          <cropper-handle action="nw-resize"></cropper-handle>
          <!-- 允许东南方（右下）裁剪尺寸变化 -->
          <cropper-handle action="se-resize"></cropper-handle>
          <!-- 允许西南方（左下）裁剪尺寸变化 -->
          <cropper-handle action="sw-resize"></cropper-handle>
        </cropper-selection>
      </cropper-canvas>
    </div>

    <div v-if="cropperVisible" class="mt-2 grid grid-cols-1 gap-4">
      <!-- 左侧：裁剪比例选择 -->
      <div class="bg-purple-100/20 dark:bg-purple-900/20 p-3 rounded-lg">
        <h3
          class="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2"
        >
          {{ $t("crop.ratio") }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="ratio of selectionRatioOptions"
            :key="ratio.value"
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out"
            :class="
              selection.aspectRatio == ratio.value
                ? 'bg-purple-500 shadow-purple-500/50 text-white'
                : 'bg-gray-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100'
            "
            @click="setSelectionRatio(ratio.value)"
          >
            {{ ratio.label }}
          </button>
        </div>
      </div>

      <!-- 右侧：图像操作工具 -->
      <div class="bg-purple-100/20 dark:bg-purple-900/20 p-3 rounded-lg">
        <h3
          class="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2"
        >
          {{ $t("crop.operate") }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out bg-gray-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100"
            :title="$t('crop.image.left-title')"
            @click="leftRotateImage()"
          >
            {{ $t("crop.image.left") }}
          </button>
          <button
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out bg-gray-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100"
            :title="$t('crop.image.right-title')"
            @click="rightRotateImage()"
          >
            {{ $t("crop.image.right") }}
          </button>
          <button
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out bg-gray-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100"
            @click="mirrorImage()"
          >
            {{ $t("crop.image.mirror") }}
          </button>
          <button
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out bg-gray-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100"
            @click="reverseImage()"
          >
            {{ $t("crop.image.reverse") }}
          </button>
          <button
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out bg-red-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100"
            @click="removeAll()"
          >
            {{ $t("crop.remove") }}
          </button>
          <button
            class="px-2 py-1 text-sm shadow-sm rounded-md transition-all duration-150 ease-in-out bg-green-300/60 hover:bg-purple-300 shadow-gray-500/30 text-gray-800 dark:text-gray-100"
            @click="resetCropper()"
          >
            {{ $t("crop.reset") }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="cropperVisible"
      class="mt-4 md:mt-6 flex flex-col space-y-4 items-center justify-center"
    >
      <div
        class="cursor-pointer w-full min-h-40 md:max-w-[50%] p-2 bg-purple-300/30 dark:bg-purple-800/20 rounded-md overflow-hidden border border-purple-300/50 dark:border-purple-700/50 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow duration-200"
        @click="previewCropping"
      >
        <cropper-viewer
          ref="cropperViewer"
          class="bg-white/30 dark:bg-black/20 rounded"
          selection="#cropperSelection"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="w-full flex justify-center space-x-4">
        <button
          @click="previewCropping"
          class="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200 ease-in-out shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t("crop.preview") }}
        </button>
        <button
          @click="downloadCroppedImage"
          class="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200 ease-in-out shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          {{ $t("crop.download") }}
        </button>
      </div>
    </div>

    <p class="mt-4 text-center text-purple-500 dark:text-purple-300">
      {{ $t("crop.tips") }}
    </p>

    <div
      class="mt-2 md:mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-300/50 dark:bg-gray-100/20 hover:bg-purple-300/50 dark:hover:bg-purple-300/30 border-purple-300 hover:border-purple-500 transition duration-300 ease-in-out"
      :class="{
        'border-purple-700 bg-blue-50': dragOver,
      }"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="onFileDrop"
      @click.stop="uploadImage"
    >
      <input
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
        ref="fileInput"
      />
      <div
        class="duration-100 ease-in-out"
        :class="{
          'my-0': cropperVisible,
          'my-16': !cropperVisible,
        }"
      >
        <p class="text-gray-500 dark:text-gray-200">
          {{ $t("crop.upload-tip") }}
          <button
            type="button"
            class="text-purple-800 dark:text-purple-400 font-bold hover:text-purple-700 dark:hover:text-purple-300 focus:outline-none"
            @click.stop="uploadImage"
          >
            {{ $t("crop.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-200">
          {{ $t("crop.upload-types") }}
        </p>
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
import type {
  CropperCanvas,
  CropperViewer,
  CropperSelection,
  CropperImage,
} from "cropperjs";

onMounted(async () => {
  // 动态导入 Cropper.js，确保只在客户端加载
  await import("cropperjs");
});

const route = useRoute();
const { t } = useI18n();
useHead({
  title: t("crop.title"),
  meta: [
    { name: "description", content: t("crop.description") },
    { name: "keywords", content: t("crop.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("crop.title") },
    { name: "twitter:description", content: t("crop.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("crop.title") },
    { property: "og:description", content: t("crop.description") },
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

// const cropper = ref<Cropper>();
const cropperCanvas = ref<CropperCanvas>();
const cropperViewer = ref<CropperViewer>();
const cropperSelection = ref<CropperSelection>();
const cropperImage = ref<CropperImage>();
const fileInput = ref<HTMLInputElement | null>(null);
const previewImageData = ref<string>();
const defaultSelection = {
  initialCoverage: 0.5,
  hidden: false,
  x: undefined,
  y: undefined,
  width: undefined,
  height: undefined,
  aspectRatio: undefined,
  initialAspectRatio: undefined,
  dynamic: false,
  movable: true,
  resizable: true,
  zoomable: false,
  multiple: false,
  keyboard: false,
  outlined: false,
  precise: false,
};
const selection = ref<any>({ ...defaultSelection });
const selectionRatioOptions = ref([
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "1:2", value: 0.5 },
  { label: "2:1", value: 2 },
  { label: "3:4", value: 0.75 },
  { label: "4:3", value: 1.33 },
  { label: "9:16", value: 0.56 },
  { label: "16:9", value: 1.78 },
]);

const setSelectionRatio = (ratio: number | undefined) => {
  selection.value.width = undefined;
  selection.value.height = undefined;
  selection.value.x = undefined;
  selection.value.y = undefined;
  cropperSelection.value?.$clear();
  selection.value.aspectRatio = ratio;
  nextTick(() => {
    cropperSelection.value?.$center();
  });
  // selection.value.aspectRatio = ratio;
  // selection.value.initialAspectRatio = ratio;
  // cropperSelection.value?.$reset();
  // cropperSelection.value?.$render();
  // cropperSelection.value?.$center();
};
/**
 * Upload image trigger
 */
const uploadImage = () => {
  fileInput.value?.click();
};

const rightRotateImage = () => {
  cropperImage.value?.$rotate("1deg");
};

const leftRotateImage = () => {
  cropperImage.value?.$rotate("-1deg");
};

const mirrorImage = () => {
  cropperImage.value?.$scale(-1, 1);
};

const reverseImage = () => {
  cropperImage.value?.$scale(1, -1);
};

/**
 * Drag over state
 */
const dragOver = ref(false);

/**
 *暫存上传的原始文件对象
 */
const originImage = ref<File>();
const cropperVisible = ref(false);
const cropperImageUrl = ref<string>();

/**
 * 文件上传事件处理
 */
const onFileChange = async (e: Event) => {
  const fileInput = e.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (!file) return;

  await handleFile(file);
};

/**
 * 文件拖拽处理
 */
const onFileDrop = async (e: DragEvent) => {
  dragOver.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (!file) return;

  await handleFile(file);
};

const handleFile = async (file: File) => {
  originImage.value = file;
  try {
    cropperImageUrl.value = await readFileAsDataURL(file);
    cropperVisible.value = true;
    setTimeout(() => {
      getOriginSize(cropperImageUrl.value || "");
      resetCropper();
    }, 50);
  } catch (error) {
    console.error("File reading failed:", error);
  }
};

/**
 * 读取文件并返回 base64 URL
 */
const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;

      resolve(imageData);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const originSize = ref({
  width: 0,
  height: 0,
});

// 获取原始图片尺寸（TODO 有BUG）
const getOriginSize = (image: string) => {
  let img = new Image();
  img.src = image;
  originSize.value.width = img.naturalWidth;
  originSize.value.height = img.naturalHeight;
  // console.log(originSize.value);
};

// 重置裁剪元素
const resetCropper = () => {
  if (cropperImage.value) {
    cropperImage.value?.$center("contain");
  }
  selection.value = defaultSelection;
  if (cropperSelection.value) {
    // cropperSelection.value?.$render();
    cropperSelection.value?.$reset();
    nextTick(() => {
      cropperSelection.value?.$center();
    });
  }
};
// 移出裁剪元素
const removeAll = () => {
  cropperVisible.value = false;
  originImage.value = undefined;
  cropperImageUrl.value = undefined;
  if (fileInput.value) {
    fileInput.value.files = null;
    fileInput.value.value = ""; // 关键：重置 fileInput.value 为空字符串
  }
};
// 预览图片
const previewCropping = async () => {
  const canvas = await cropperViewer.value?.$selection.$toCanvas({
    width: originSize.value.width,
    height: originSize.value.height,
  });
  const image = canvas?.toDataURL("image/png");
  previewImageData.value = image;
};
/**
 * 下载裁剪后的图片
 */
const downloadCroppedImage = async () => {
  const canvas = await cropperViewer.value?.$selection.$toCanvas({
    width: originSize.value.width,
    height: originSize.value.height,
  });
  canvas?.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cropped_${originImage.value?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};
</script>

<style scoped>
/* 图片预览样式 */
</style>
