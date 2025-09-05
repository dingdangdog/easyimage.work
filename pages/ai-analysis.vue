<template>
  <div class="p-4 max-w-3xl mx-auto">
    <h1
      class="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-cyan-500 dark:text-cyan-400"
    >
      {{ $t("aiAnalysis.name") }}
    </h1>
    <p class="my-2 text-center text-cyan-500 dark:text-cyan-400">
      {{ $t("aiAnalysis.tips") }}
    </p>

    <!-- 上传区域 -->
    <div
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
      @click.stop="upload()"
      class="mt-2 md:mt-6 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer bg-gray-300/50 dark:bg-gray-100/20 hover:bg-cyan-300/50 dark:hover:bg-cyan-300/30 border-cyan-300 hover:border-cyan-500 transition duration-300 ease-in-out"
      :class="{
        'border-cyan-700 bg-blue-50': dragOver,
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
          {{ $t("aiAnalysis.upload-tip") }}
          <button
            type="button"
            @click.stop="upload()"
            class="text-cyan-800 dark:text-cyan-500 font-bold hover:text-cyan-700 dark:hover:text-cyan-400 focus:outline-none"
          >
            {{ $t("aiAnalysis.upload-button") }}
          </button>
        </p>
        <p class="text-sm mt-2 text-gray-500 dark:text-gray-200">
          {{ $t("aiAnalysis.upload-types") }}
        </p>
      </div>
    </div>

    <!-- 处理中提示 -->
    <div
      v-if="processing"
      class="mt-6 text-center text-gray-600 dark:text-gray-300"
    >
      {{ $t("aiAnalysis.running") }} ({{ processedCount }}/{{ totalFiles }})
    </div>

    <!-- 重新分析按钮 -->
    <div v-if="analysisResults.length > 0" class="my-4">
      <button
        @click="reprocessImages"
        :disabled="processing || analysisResults.length === 0"
        class="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition duration-300 ease-in-out"
      >
        {{ $t("aiAnalysis.rerun") }}
      </button>
    </div>

    <!-- 处理结果按钮 -->
    <div v-if="analysisResults.length > 0" class="flex space-x-4">
      <button
        @click="removeAll"
        class="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("aiAnalysis.remove-all-button") }}
      </button>
      <button
        @click="exportResults"
        class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg focus:outline-none transition duration-300 ease-in-out"
      >
        {{ $t("aiAnalysis.export-button") }}
      </button>
    </div>

    <!-- 分析结果展示 -->
    <div v-if="analysisResults.length > 0" class="mt-4">
      <h3 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        {{ $t("aiAnalysis.ready") }}
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
                class="object-contain max-w-full max-h-48 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
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
                  {{ $t("aiAnalysis.copy") }}
                </button>
                <!-- 完整信息显示 -->
                <pre
                  class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono leading-relaxed max-h-40 overflow-y-auto"
                  >{{ result.aiInfo.rawText }}</pre
                >
              </div>

              <div
                v-else
                class="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4"
              >
                <p class="text-yellow-800 dark:text-yellow-200 text-sm">
                  {{ $t("aiAnalysis.no-ai-info") }}
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

const { t } = useI18n();

// 页面SEO
useHead({
  title: t("aiAnalysis.title"),
  meta: [
    {
      name: "description",
      content: t("aiAnalysis.description"),
    },
    {
      name: "keywords",
      content: t("aiAnalysis.keywords"),
    },
    {
      property: "og:title",
      content: t("aiAnalysis.title"),
    },
    {
      property: "og:description",
      content: t("aiAnalysis.description"),
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
      content: t("aiAnalysis.title"),
    },
    {
      name: "twitter:description",
      content: t("aiAnalysis.description"),
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
  const aiInfo = await extractAIInfoFromFile(file);

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

// 从文件提取AI信息
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // 根据文件类型使用不同的提取方法
    if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      extractedText = extractPNGText(uint8Array);
    } else if (
      file.type.startsWith("image/jpeg") ||
      file.name.toLowerCase().match(/\.(jpg|jpeg)$/)
    ) {
      extractedText = extractJPEGText(uint8Array);
    }

    console.log(
      `[DEBUG] 文件 ${file.name} 提取的文本长度:`,
      extractedText.length
    );

    if (!extractedText.trim()) {
      console.log(`[DEBUG] 文件 ${file.name} 没有提取到文本`);
      return null;
    }

    // 检查是否包含AI关键字
    const aiKeywords = [
      "Steps:",
      "Sampler:",
      "CFG scale:",
      "Seed:",
      "Size:",
      "Model:",
      "Negative prompt:",
      "parameters",
      "DPM++",
      "Euler",
    ];

    const hasAI = aiKeywords.some((keyword) => extractedText.includes(keyword));

    if (!hasAI) {
      console.log(`[DEBUG] File ${file.name} does not contain AI keywords`);
      return null;
    }

    // 清理和格式化文本
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // 格式化AI信息
    const formattedText = formatAIText(cleanText);

    return {
      rawText: formattedText,
    };
  } catch (error) {
    console.error(`Error analyzing file ${file.name}:`, error);
    return null;
  }
};

// 格式化AI文本
const formatAIText = (rawText: string): string => {
  console.log(`[DEBUG] Start formatting text:`, rawText.substring(0, 200));

  let formattedText = "";

  // 查找parameters段
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // 分割内容：Prompt, Negative prompt, Parameters
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // 处理Prompt部分
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // 处理Negative prompt部分
    const negativeSection = sections.find((s) =>
      s.trim().startsWith("Negative prompt:")
    );
    if (negativeSection) {
      const negativeMatch = negativeSection.match(
        /Negative prompt:\s*(.*?)(?=\n*Steps:|$)/s
      );
      if (negativeMatch && negativeMatch[1]) {
        const negativeText = negativeMatch[1].replace(/\n+/g, " ").trim();
        formattedText += `Negative prompt:\n${negativeText}\n\n`;
      }
    }

    // 处理Parameters部分
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // 提取参数行
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // 将逗号分隔的参数转换为换行分隔
      const params = paramText.split(/,\s*(?=[A-Za-z])/);

      params.forEach((param) => {
        const trimmedParam = param.trim();
        if (trimmedParam) {
          formattedText += `${trimmedParam}\n`;
        }
      });
    }
  } else {
    // 如果没有找到parameters段，尝试其他格式
    let prompt = "";
    let negativePrompt = "";
    let parameters = "";

    // 查找negative prompt
    const negativeMatch = rawText.match(
      /Negative prompt:\s*(.*?)(?=\n(?:Steps:|$))/s
    );
    if (negativeMatch) {
      negativePrompt = negativeMatch[1].trim();
      // 提取prompt（negative prompt之前的内容）
      const promptMatch = rawText.match(/^(.*?)(?=Negative prompt:)/s);
      if (promptMatch) {
        prompt = promptMatch[1].trim();
      }
    }

    // 查找参数部分
    const paramMatch2 = rawText.match(/(Steps:.*)/s);
    if (paramMatch2) {
      parameters = paramMatch2[1];
    }

    // 组装格式化文本
    if (prompt) {
      formattedText += `Prompt:\n${prompt}\n\n`;
    }

    if (negativePrompt) {
      formattedText += `Negative prompt:\n${negativePrompt}\n\n`;
    }

    if (parameters) {
      formattedText += "Parameters:\n";
      // 将逗号分隔的参数转换为换行分隔
      const params = parameters.split(/,\s*(?=[A-Za-z])/);
      params.forEach((param) => {
        const trimmedParam = param.trim();
        if (trimmedParam) {
          formattedText += `${trimmedParam}\n`;
        }
      });
    }
  }

  console.log(`[DEBUG] Formatted text:`, formattedText.substring(0, 300));
  return formattedText.trim();
};

// 提取PNG文本
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // 跳过PNG签名

    while (offset < uint8Array.length - 8) {
      const length =
        (uint8Array[offset] << 24) |
        (uint8Array[offset + 1] << 16) |
        (uint8Array[offset + 2] << 8) |
        uint8Array[offset + 3];
      const type = String.fromCharCode(
        uint8Array[offset + 4],
        uint8Array[offset + 5],
        uint8Array[offset + 6],
        uint8Array[offset + 7]
      );

      if (type === "tEXt" || type === "iTXt") {
        const data = uint8Array.slice(offset + 8, offset + 8 + length);
        const chunkText = new TextDecoder("utf-8", { fatal: false }).decode(
          data
        );
        text += chunkText + "\n";
        console.log(`[DEBUG] 找到PNG ${type}段:`, chunkText.substring(0, 200));
      }

      offset += 12 + length;
      if (type === "IEND") break;
    }

    return text;
  } catch (error) {
    console.error("PNG text extraction failed:", error);
    return "";
  }
};

// 提取JPEG文本
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // 跳过SOI标记

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // APP1段
        const length = (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
        const data = uint8Array.slice(offset + 4, offset + 2 + length);
        const segmentText = new TextDecoder("utf-8", { fatal: false }).decode(
          data
        );
        text += segmentText + "\n";
        console.log(
          `[DEBUG] Found JPEG APP1 segment:`,
          segmentText.substring(0, 200)
        );
      }

      const segmentLength =
        (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
      offset += 2 + segmentLength;

      // 到达图片数据，停止
      if (
        marker >= 0xffc0 &&
        marker <= 0xffcf &&
        marker !== 0xffc4 &&
        marker !== 0xffc8
      ) {
        break;
      }
    }

    return text;
  } catch (error) {
    console.error("JPEG text extraction failed:", error);
    return "";
  }
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
