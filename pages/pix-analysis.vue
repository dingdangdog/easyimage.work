<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-green-600 dark:text-green-500"
    >
      {{ $t("pixAnalysis.name") }}
    </h1>
    <p class="my-2 text-center text-green-500 dark:text-green-400">
      {{ $t("pixAnalysis.tips") }}
    </p>

    <!-- 上传区域 -->
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click.stop="upload()"
      class="mt-2 md:mt-6 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-300/50 dark:bg-gray-100/20 hover:bg-green-300/50 dark:hover:bg-green-300/30 border-green-300 hover:border-green-500 transition duration-300 ease-in-out"
      :class="{
        'border-green-700 bg-blue-50': dragOver,
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
          'my-0': analysisResults.length > 0,
          'my-16': analysisResults.length === 0,
        }"
      >
        <p class="text-gray-500 dark:text-gray-200">
          {{ $t("pixAnalysis.upload-tip") }}
          <button
            type="button"
            @click.stop="upload()"
            class="text-green-800 dark:text-green-500 font-bold hover:text-green-700 dark:hover:text-green-400 focus:outline-none"
          >
            {{ $t("pixAnalysis.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-200">
          {{ $t("pixAnalysis.upload-types") }}
        </p>
      </div>
    </div>

    <!-- 处理中提示 -->
    <div
      v-if="processing"
      class="mt-6 text-center text-gray-600 dark:text-gray-300"
    >
      {{ $t("pixAnalysis.running") }} ({{ processedCount }}/{{ totalFiles }})
    </div>

    <!-- 重新分析按钮 -->
    <div v-if="analysisResults.length > 0" class="my-4">
      <button
        @click="reprocessImages"
        :disabled="processing || analysisResults.length === 0"
        class="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
      >
        {{ $t("pixAnalysis.rerun") }}
      </button>
    </div>

    <!-- 处理结果按钮 -->
    <div v-if="analysisResults.length > 0" class="flex space-x-4">
      <button
        @click="removeAll"
        class="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("pixAnalysis.remove-all-button") }}
      </button>
      <button
        @click="exportResults"
        class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("pixAnalysis.export-button") }}
      </button>
    </div>

    <!-- 分析结果展示 -->
    <div v-if="analysisResults.length > 0" class="mt-4">
      <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {{ $t("pixAnalysis.ready") }}
      </h3>

      <div class="space-y-6">
        <div
          v-for="(result, index) in analysisResults"
          :key="index"
          class="bg-white/30 dark:bg-slate-800/30 shadow-lg rounded-lg p-4 transition-colors duration-300"
        >
          <!-- 文件名和删除按钮 -->
          <div class="flex justify-between items-center mb-4">
            <h4
              class="text-md font-semibold text-gray-800 dark:text-gray-100 truncate"
            >
              {{ result.fileName }}
            </h4>
            <button
              @click="removeResult(index)"
              class="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none transition-colors duration-300"
            >
              <IconDelete class="w-5 h-5" />
            </button>
          </div>

          <div class="flex flex-col lg:flex-row gap-4">
            <!-- 图片预览 -->
            <div class="flex justify-center min-w-48">
              <img
                :src="result.thumbnail"
                :alt="result.fileName"
                class="object-contain max-w-full max-h-52 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
                @click="previewImage(result.original)"
              />
            </div>

            <!-- AI信息显示 -->
            <div
              class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 w-full relative"
            >
              <div v-if="result.aiInfo && result.aiInfo.rawText">
                <!-- 标题和复制按钮 -->
                <button
                  @click="copyToClipboard(result.aiInfo.rawText)"
                  class="absolute top-2 right-4 px-2 py-1 bg-blue-500/20 hover:bg-blue-500/80 text-white text-sm font-medium rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {{ $t("pixAnalysis.copy") }}
                </button>
                <!-- 完整信息显示 -->
                <pre
                  class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed max-h-44 overflow-y-auto"
                  >{{ result.aiInfo.rawText }}</pre
                >
              </div>

              <div
                v-else
                class="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4"
              >
                <p class="text-yellow-800 dark:text-yellow-200 text-sm">
                  {{ $t("pixAnalysis.no-pix-info") }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div
      v-if="previewImageData"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="previewImageData = undefined"
    >
      <img
        :src="previewImageData"
        class="max-w-full max-h-full rounded-lg shadow-2xl"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import ExifReader from "exifreader";

const { t } = useI18n();

// 页面SEO
useHead({
  title: t("pixAnalysis.title"),
  meta: [
    {
      name: "description",
      content: t("pixAnalysis.description"),
    },
    {
      name: "keywords",
      content: t("pixAnalysis.keywords"),
    },
    {
      property: "og:title",
      content: t("pixAnalysis.title"),
    },
    {
      property: "og:description",
      content: t("pixAnalysis.description"),
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: t("pixAnalysis.title"),
    },
    {
      name: "twitter:description",
      content: t("pixAnalysis.description"),
    },
  ],
});

// 响应式数据
const fileInput = ref<HTMLInputElement>();
const analysisResults = ref<AnalysisResult[]>([]);
const originalImages = ref<File[]>([]);
const processing = ref(false);
const processedCount = ref(0);
const totalFiles = ref(0);
const dragOver = ref(false);
const previewImageData = ref<string | undefined>();

// 接口定义
interface AIInfo {
  rawText: string;
}

interface AnalysisResult {
  fileName: string;
  thumbnail: string;
  original: string;
  aiInfo: AIInfo | null;
}

// 上传文件
const upload = () => {
  fileInput.value?.click();
};

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    processFiles(files);
  }
};

// 处理拖拽上传
const handleDrop = (event: DragEvent) => {
  dragOver.value = false;
  if (event.dataTransfer?.files) {
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
  }
};

// 处理文件
const processFiles = async (files: File[]) => {
  if (files.length === 0) return;

  // 过滤图片文件
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  if (imageFiles.length === 0) {
    alert("Please upload image files");
    return;
  }

  // 存储原始文件对象
  originalImages.value = imageFiles;

  processing.value = true;
  processedCount.value = 0;
  totalFiles.value = imageFiles.length;

  try {
    // 并行处理所有文件
    const promises = imageFiles.map(async (file) => {
      const result = await analyzeImage(file);
      processedCount.value++;
      return result;
    });

    const results = await Promise.all(promises);
    analysisResults.value = results;
  } catch (error) {
    console.error("Process file error:", error);
    alert("Process file error, please try again");
  } finally {
    processing.value = false;
  }
};

// 分析单个图片
const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  console.log(`[DEBUG] Start analyzing file: ${file.name}`);

  // 创建缩略图
  const thumbnail = await createThumbnail(file);
  const original = URL.createObjectURL(file);

  // 提取AI信息
  const aiInfo = await extractPhotoInfoFromFile(file);

  return {
    fileName: file.name,
    thumbnail,
    original,
    aiInfo,
  };
};

// 创建缩略图
const createThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // 计算缩略图尺寸
        const maxSize = 300;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

interface PhotoInfo {
  rawText: string;
  tags: any;
}
// 从文件提取AI信息
const extractPhotoInfoFromFile = async (
  file: File
): Promise<PhotoInfo | null> => {
  try {
    const tags = await ExifReader.load(file);

    if (Object.keys(tags).length === 0) {
      console.log(
        `[DEBUG] file ${file.name} does not contain any Exif information`
      );
      return null;
    }

    const formattedText = formatExifText(tags);

    return {
      rawText: formattedText,
      tags: tags,
    };
  } catch (error) {
    console.error(
      `Error extracting Exif information from file ${file.name}:`,
      error
    );
    return null;
  }
};

// 格式化Exif数据
const formatExifText = (tags: any): string => {
  let formattedText = `📷 ${t("pixAnalysis.params.Important")}:\n`;

  const exifMap: Record<string, string> = {
    Make: t("pixAnalysis.params.Make"),
    Model: t("pixAnalysis.params.Model"),
    LensModel: t("pixAnalysis.params.LensModel"),
    FocalLength: t("pixAnalysis.params.FocalLength"),
    FNumber: t("pixAnalysis.params.FNumber"),
    ApertureValue: t("pixAnalysis.params.ApertureValue"),
    ShutterSpeedValue: t("pixAnalysis.params.ShutterSpeedValue"),
    ExposureTime: t("pixAnalysis.params.ExposureTime"),
    ExposureProgram: t("pixAnalysis.params.ExposureProgram"),
    ISOSpeedRatings: t("pixAnalysis.params.ISOSpeedRatings"),
    WhiteBalance: t("pixAnalysis.params.WhiteBalance"),
    Flash: t("pixAnalysis.params.Flash"),
    DateTimeOriginal: t("pixAnalysis.params.DateTimeOriginal"),
    Software: t("pixAnalysis.params.Software"),
    Artist: t("pixAnalysis.params.Artist"),
    Copyright: t("pixAnalysis.params.Copyright"),
    Location: t("pixAnalysis.params.Location"),
    Size: t("pixAnalysis.params.Size"),
    Other: t("pixAnalysis.params.Other"),
  };

  const importantKeys = new Set(Object.keys(exifMap));
  const otherInfoLines: string[] = [];

  // 处理“重要信息”
  for (const [key, displayName] of Object.entries(exifMap)) {
    if (tags[key] && tags[key].description != null) {
      let value = tags[key].description.toString().trim();

      if (key === "ApertureValue" && !value.startsWith("f/")) {
        value = `f/${value}`;
      }
      if (
        (key === "ShutterSpeedValue" || key === "ExposureTime") &&
        !value.endsWith("s")
      ) {
        value = `${value}s`;
      }

      formattedText += `- ${displayName}: ${value}\n`;
    }
  }

  // 图像尺寸
  if (tags.ImageWidth && tags.ImageHeight) {
    formattedText += `- ${t("pixAnalysis.params.Size")}: ${
      tags.ImageWidth.value
    } x ${tags.ImageHeight.value} pixels\n`;
  }

  // GPS
  if (tags.GPSLatitude && tags.GPSLongitude) {
    formattedText += `- ${t("pixAnalysis.params.Location")}: ${
      tags.GPSLatitude.description
    }, ${tags.GPSLongitude.description}\n`;
  }

  // 处理“其他信息”
  for (const key in tags) {
    if (!importantKeys.has(key)) {
      const tag = tags[key];
      let name = tag?.description ?? tag?.value;

      if (name && typeof name !== "object") {
        otherInfoLines.push(`- ${key}: ${name}`);
      }
    }
  }

  if (otherInfoLines.length > 0) {
    formattedText +=
      `\n📎 ${t("pixAnalysis.params.Other")}:\n` + otherInfoLines.join("\n");
  }

  if (formattedText.trim() === "") {
    return "No regular photo parameter information found.";
  }

  return formattedText.trim();
};

// 重新处理图片
const reprocessImages = async () => {
  analysisResults.value = [];
  await processFiles(originalImages.value);
};

// 删除所有结果
const removeAll = () => {
  analysisResults.value = [];
  originalImages.value = [];
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 删除单个结果
const removeResult = (index: number) => {
  analysisResults.value.splice(index, 1);
  originalImages.value.splice(index, 1);
};

// 导出结果
const exportResults = () => {
  const results = analysisResults.value.map((result) => ({
    fileName: result.fileName,
    aiInfo: result.aiInfo?.rawText || "No AI information found",
  }));

  const jsonString = JSON.stringify(results, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ai_analysis_results_${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 预览图片
const previewImage = (imageUrl: string) => {
  previewImageData.value = imageUrl;
};

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // 简单的成功提示
    const button = event?.target as HTMLElement;
    const originalText = button?.textContent;
    if (button) {
      button.textContent = "Copied!";
      button.classList.add("bg-green-500");
      button.classList.remove("bg-blue-500");
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("bg-green-500");
        button.classList.add("bg-blue-500");
      }, 2000);
    }
  } catch (err) {
    console.error("Copy failed:", err);
    // 降级方案
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      alert("Content copied to clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Copy failed, please copy manually");
    }
    document.body.removeChild(textArea);
  }
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
/* 确保使用 Tailwind CSS 样式 */
.text-magenta-600 {
  color: #d946ef;
}

.dark .text-magenta-400 {
  color: #e879f9;
}

/* 自定义滚动条样式 */
pre::-webkit-scrollbar {
  width: 8px;
}

pre::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dark pre::-webkit-scrollbar-track {
  background: #374151;
}

pre::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark pre::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark pre::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
