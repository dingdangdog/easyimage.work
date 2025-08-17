---
date: 2025-03-16
title: 如何使用 EasyImage.work 从生成的图像中提取 AI 图片提示词
---

您是否曾经想过如何从 AI 生成的图像中提取原始提示词和参数？或者想要了解创建那幅令人惊叹的艺术作品时使用的确切设置？在 EasyImage.work，我们开发了一个复杂的 AI 分析工具，可以直接从 AI 生成的图像中提取详细的提示词信息。今天，让我们深入了解如何从图像元数据中提取 AI 图片提示词的技术实现，就像我们在 EasyImage.work 中所做的那样！

## AI 提示词提取的重要性

AI 生成的图像变得越来越受欢迎，了解它们是如何创建的出于以下几个原因很有价值：

- **学习和改进：** 通过分析成功的提示词，您可以学习什么有效并提高自己的 AI 艺术生成技能。
- **复制和变体：** 提取提示词允许您重新创建类似的图像或通过轻微修改创建变体。
- **文档和分享：** 拥有原始提示词有助于记录您的创作过程并与他人分享技术。
- **质量评估：** 了解使用的参数可以帮助评估 AI 生成艺术作品的质量和复杂性。

但是，重要的是要注意**只有原始的 AI 生成图像才能成功提取提示词**。一旦图像被编辑、调整大小或转换为不同格式，包含提示词信息的元数据可能会丢失或损坏，使提取变得不可能。

## EasyImage.work AI 分析背后的技术洞察

您可能对 EasyImage.work 如何直接从浏览器中的 AI 生成图像中提取详细提示词信息感到好奇。今天，我们将通过检查为我们的 AI 分析功能提供动力的核心 JavaScript 代码来揭示这个秘密。

```js
// 从文件中提取 AI 信息
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

    if (!extractedText.trim()) {
      console.log(`[DEBUG] File ${file.name} has no extracted text`);
      return null;
    }

    // 检查文本是否包含 AI 关键词
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

    // 格式化 AI 信息
    const formattedText = formatAIText(cleanText);

    return {
      rawText: formattedText,
    };
  } catch (error) {
    console.error(`Error analyzing file ${file.name}:`, error);
    return null;
  }
};
```

## PNG 文本提取

对于 PNG 图像，AI 工具经常在图像文件内的文本块中存储提示词信息。以下是我们提取这些数据的方法：

```js
// 提取 PNG 文本
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // 跳过 PNG 签名

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
        console.log(`[DEBUG] Found PNG ${type} chunk:`, chunkText.substring(0, 200));
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
```

## JPEG 文本提取

对于 JPEG 图像，AI 元数据通常存储在 APP1 段内的 EXIF 数据中：

```js
// 提取 JPEG 文本
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // 跳过 SOI 标记

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // APP1 段
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

      // 到达图像数据时停止
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
```

## AI 文本格式化

一旦我们提取了原始文本，我们需要正确格式化它以使其可读和有组织：

```js
// 格式化 AI 文本
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // 查找参数部分
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // 分割内容：提示词、负面提示词、参数
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // 处理提示词部分
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // 处理负面提示词部分
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

    // 处理参数部分
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // 提取参数行
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // 将逗号分隔的参数转换为行分隔
      const params = paramText.split(/,\s*(?=[A-Za-z])/);

      params.forEach((param) => {
        const trimmedParam = param.trim();
        if (trimmedParam) {
          formattedText += `${trimmedParam}\n`;
        }
      });
    }
  }

  return formattedText.trim();
};
```

## 代码解释

1. **文件类型检测：** 代码首先确定上传的文件是 PNG 还是 JPEG 图像，因为不同格式以不同方式存储元数据。

2. **二进制数据处理：** 文件被转换为 `Uint8Array` 以处理原始二进制数据并提取嵌入的文本信息。

3. **格式特定提取：** 
   - 对于 PNG 文件，代码搜索包含文本元数据的 `tEXt` 和 `iTXt` 块
   - 对于 JPEG 文件，它查找包含带有 AI 参数的 EXIF 数据的 APP1 段

4. **AI 关键词检测：** 提取的文本被分析以查找特定的 AI 相关关键词，如 "Steps:"、"Sampler:"、"CFG scale:" 等，以确认它包含 AI 生成参数。

5. **文本格式化：** 原始提取的文本被清理并格式化为具有提示词、负面提示词和参数的清晰部分的可读结构。

6. **结果验证：** 只有包含有效 AI 元数据的文件才会被处理并显示给用户。

## 成功提取的关键要求

**重要：** 此提取过程仅适用于**原始 AI 生成的图像**。原因如下：

- **元数据保存：** 像 Stable Diffusion、Midjourney 和 DALL-E 这样的 AI 工具在图像首次生成时将提示词信息直接嵌入到图像文件的元数据中。

- **处理过程中的数据丢失：** 当图像被编辑、调整大小、转换为不同格式或通过图像编辑软件处理时，包含提示词信息的元数据经常被剥离或损坏。

- **格式限制：** 仅支持 PNG 和 JPEG 格式，因为这些是 AI 工具通常用于存储元数据的格式。

- **原始源要求：** 从社交媒体下载、截图或通过 Web 应用程序处理的图像可能会丢失其原始元数据。

## EasyImage.work AI 分析的优势

此代码仅代表 EasyImage.work 综合 AI 分析功能的一个组件。在我们的实际实现中，我们进行了许多优化和改进：

- **多格式支持：** EasyImage.work 支持 PNG 和 JPEG 格式，涵盖最常见的 AI 生成图像类型。

- **智能检测：** 我们的系统自动检测图像是否包含 AI 元数据，并在未找到信息时提供清晰的反馈。

- **用户友好界面：** 使用 EasyImage.work，您无需了解技术细节。只需上传您的 AI 生成图像，即可立即看到提取的提示词和参数。

- **导出功能：** 您可以轻松复制提取的提示词或将所有结果导出为 JSON 文件以进行进一步分析。

- **批处理：** 一次处理多个图像，从整个 AI 生成艺术作品集合中提取提示词。

## 结论

通过这次技术深度探讨，您现在了解了如何从生成的图像中提取 AI 图片提示词。此过程依赖于仔细解析 AI 工具在生成过程中嵌入的图像元数据。

**记住：** 成功提取提示词的关键是使用**原始、未修改的 AI 生成图像**。一旦图像被处理、编辑或转换，有价值的提示词信息可能会永久丢失。

如果您需要一个简单、高效且强大的工具来从生成的图像中提取 AI 提示词，请记住 [EasyImage.work](https://easyimage.work)！我们将继续努力为您带来更多方便实用的 AI 分析功能，帮助您解锁您喜爱的 AI 生成艺术作品背后的秘密！
