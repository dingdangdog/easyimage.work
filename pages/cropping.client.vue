<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-purple-400"
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

    <div
      v-if="cropperVisible"
      class="flex justify-center items-center space-x-2 mt-2 w-full overflow-x-auto p-1"
    >
      <button
        @click="removeAll()"
        class="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
      >
        {{ $t("crop.remove") }}
      </button>

      <button
        class="px-2 py-1 shadow-sm rounded-sm bg-gray-300/60 shadow-gray-500 hover:bg-purple-500/80 duration-150 ease-in-out"
        title="image.$rotate('-45deg')"
        @click="rightRotateImage()"
      >
        <!-- <i class="bi-arrow-90deg-left"></i> -->
        right
      </button>
      <button
        class="px-2 py-1 shadow-sm rounded-sm bg-gray-300/60 shadow-gray-500 hover:bg-purple-500/80 duration-150 ease-in-out"
        title="image.$rotate('45deg')"
        @click="leftRotateImage()"
      >
        <!-- <i class="bi-arrow-90deg-right"></i> -->
        left
      </button>
      <button
        class="px-2 py-1 shadow-sm rounded-sm bg-gray-300/60 shadow-gray-500 hover:bg-purple-500/80 duration-150 ease-in-out"
        title="image.$rotate('45deg')"
        @click="mirrorImage()"
      >
        <!-- <i class="bi-arrow-90deg-right"></i> -->
        镜像
      </button>
      <button
        class="px-2 py-1 shadow-sm rounded-sm bg-gray-300/60 shadow-gray-500 hover:bg-purple-500/80 duration-150 ease-in-out"
        title="image.$rotate('45deg')"
        @click="reverseImage()"
      >
        <!-- <i class="bi-arrow-90deg-right"></i> -->
        颠倒
      </button>
      <button
        class="bg-green-500 hover:bg-green-400 text-white font-bold py-1 px-2 rounded-md focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        @click="resetCropper()"
      >
        <!-- <i class="bi-arrow-90deg-right"></i> -->
        重置
      </button>
    </div>

    <div
      v-if="cropperVisible"
      class="flex md:justify-center items-center space-x-2 mt-2 w-full overflow-x-auto p-1"
    >
      <button
        v-for="ratio of selectionRatioOptions"
        :key="ratio.value"
        class="px-2 py-1 shadow-sm rounded-sm hover:bg-purple-500/80 duration-150 ease-in-out"
        :class="
          selection.aspectRatio == ratio.value
            ? 'bg-purple-300/60 shadow-purple-500 text-purple-500'
            : 'bg-gray-300/60 shadow-gray-500'
        "
        @click="setSelectionRatio(ratio.value)"
      >
        {{ ratio.label }}
      </button>
    </div>

    <div
      v-if="cropperVisible"
      class="mt-2 md:mt-4 flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row items-center justify-center"
    >
      <div
        class="cursor-pointer w-full min-h-40 md:max-w-[50%] p-2 bg-purple-300/50 rounded-md overflow-hidden border border-purple-300 flex items-center justify-center"
        @click="previewCropping"
      >
        <cropper-viewer
          ref="cropperViewer"
          class="bg-white/50"
          selection="#cropperSelection"
        />
      </div>
      <div
        class="flex flex-row md:flex-col space-x-4 md:space-y-4 md:space-x-0 justify-center"
      >
        <button
          @click="previewCropping"
          class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          {{ $t("crop.preview") }}
        </button>
        <button
          @click="downloadCroppedImage"
          class="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          {{ $t("crop.download") }}
        </button>
      </div>
    </div>

    <p class="mt-2 md:mt-6 text-center text-purple-300">
      {{ $t("crop.tips") }}
    </p>

    <div
      class="mt-2 md:mt-4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-100/20 hover:bg-purple-300/50 hover:border-purple-700 transition duration-300 ease-in-out"
      :class="{
        'border-purple-700 bg-blue-50': dragOver,
        'border-gray-300': !dragOver,
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
        class="text-gray-400 duration-100 ease-in-out"
        :class="{
          'my-0': cropperVisible,
          'my-16': !cropperVisible,
        }"
      >
        <p>
          {{ $t("crop.upload-tip") }}
          <button
            type="button"
            class="text-purple-800 font-bold hover:text-purple-700 focus:outline-none"
            @click.stop="uploadImage"
          >
            {{ $t("crop.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2">{{ $t("crop.upload-types") }}</p>
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
import "cropperjs";
import Cropper from "cropperjs";
import {
  type CropperCanvas,
  CropperSelection,
  type CropperImage,
  type CropperViewer,
} from "cropperjs";

const route = useRoute();
const { t } = useI18n();
useHead({
  title: `${t("crop.title")} - ${t("title")}`,
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

const cropper = ref<Cropper>();
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
  selection.value.aspectRatio = ratio;
  selection.value.initialAspectRatio = ratio;
  cropperSelection.value?.$reset();
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
  console.log(originSize.value);
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
