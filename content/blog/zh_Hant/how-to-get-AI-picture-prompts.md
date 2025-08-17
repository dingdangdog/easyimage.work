---
date: 2025-03-16
title: 如何使用 EasyImage.work 從生成的圖像中提取 AI 圖片提示詞
---

您是否曾經想過如何從 AI 生成的圖像中提取原始提示詞和參數？或者想要了解創建那幅令人驚嘆的藝術作品時使用的確切設定？在 EasyImage.work，我們開發了一個複雜的 AI 分析工具，可以直接從 AI 生成的圖像中提取詳細的提示詞資訊。今天，讓我們深入了解如何從圖像元資料中提取 AI 圖片提示詞的技術實現，就像我們在 EasyImage.work 中所做的那樣！

## AI 提示詞提取的重要性

AI 生成的圖像變得越來越受歡迎，了解它們是如何創建的出於以下幾個原因很有價值：

- **學習和改進：** 通過分析成功的提示詞，您可以學習什麼有效並提高自己的 AI 藝術生成技能。
- **複製和變體：** 提取提示詞允許您重新創建類似的圖像或通過輕微修改創建變體。
- **文檔和分享：** 擁有原始提示詞有助於記錄您的創作過程並與他人分享技術。
- **品質評估：** 了解使用的參數可以幫助評估 AI 生成藝術作品的品質和複雜性。

但是，重要的是要注意**只有原始的 AI 生成圖像才能成功提取提示詞**。一旦圖像被編輯、調整大小或轉換為不同格式，包含提示詞資訊的元資料可能會遺失或損壞，使提取變得不可能。

## EasyImage.work AI 分析背後的技術洞察

您可能對 EasyImage.work 如何直接從瀏覽器中的 AI 生成圖像中提取詳細提示詞資訊感到好奇。今天，我們將通過檢查為我們的 AI 分析功能提供動力的核心 JavaScript 程式碼來揭示這個秘密。

```js
// 從檔案中提取 AI 資訊
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // 根據檔案類型使用不同的提取方法
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

    // 檢查文字是否包含 AI 關鍵詞
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

    // 清理和格式化文字
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // 格式化 AI 資訊
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

## PNG 文字提取

對於 PNG 圖像，AI 工具經常在圖像檔案內的文字區塊中儲存提示詞資訊。以下是我們提取這些資料的方法：

```js
// 提取 PNG 文字
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // 跳過 PNG 簽名

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

## JPEG 文字提取

對於 JPEG 圖像，AI 元資料通常儲存在 APP1 段內的 EXIF 資料中：

```js
// 提取 JPEG 文字
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // 跳過 SOI 標記

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

      // 到達圖像資料時停止
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

## AI 文字格式化

一旦我們提取了原始文字，我們需要正確格式化它以使其可讀和有組織：

```js
// 格式化 AI 文字
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // 查找參數部分
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // 分割內容：提示詞、負面提示詞、參數
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // 處理提示詞部分
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // 處理負面提示詞部分
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

    // 處理參數部分
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // 提取參數行
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // 將逗號分隔的參數轉換為行分隔
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

## 程式碼解釋

1. **檔案類型檢測：** 程式碼首先確定上傳的檔案是 PNG 還是 JPEG 圖像，因為不同格式以不同方式儲存元資料。

2. **二進位資料處理：** 檔案被轉換為 `Uint8Array` 以處理原始二進位資料並提取嵌入的文字資訊。

3. **格式特定提取：** 
   - 對於 PNG 檔案，程式碼搜尋包含文字元資料的 `tEXt` 和 `iTXt` 區塊
   - 對於 JPEG 檔案，它查找包含帶有 AI 參數的 EXIF 資料的 APP1 段

4. **AI 關鍵詞檢測：** 提取的文字被分析以查找特定的 AI 相關關鍵詞，如 "Steps:"、"Sampler:"、"CFG scale:" 等，以確認它包含 AI 生成參數。

5. **文字格式化：** 原始提取的文字被清理並格式化為具有提示詞、負面提示詞和參數的清晰部分的可讀結構。

6. **結果驗證：** 只有包含有效 AI 元資料的檔案才會被處理並顯示給使用者。

## 成功提取的關鍵要求

**重要：** 此提取過程僅適用於**原始 AI 生成的圖像**。原因如下：

- **元資料保存：** 像 Stable Diffusion、Midjourney 和 DALL-E 這樣的 AI 工具在圖像首次生成時將提示詞資訊直接嵌入到圖像檔案的元資料中。

- **處理過程中的資料遺失：** 當圖像被編輯、調整大小、轉換為不同格式或通過圖像編輯軟體處理時，包含提示詞資訊的元資料經常被剝離或損壞。

- **格式限制：** 僅支援 PNG 和 JPEG 格式，因為這些是 AI 工具通常用於儲存元資料的格式。

- **原始源要求：** 從社交媒體下載、截圖或通過 Web 應用程式處理的圖像可能會遺失其原始元資料。

## EasyImage.work AI 分析的優勢

此程式碼僅代表 EasyImage.work 綜合 AI 分析功能的一個元件。在我們的實際實現中，我們進行了許多最佳化和改進：

- **多格式支援：** EasyImage.work 支援 PNG 和 JPEG 格式，涵蓋最常見的 AI 生成圖像類型。

- **智慧檢測：** 我們的系統自動檢測圖像是否包含 AI 元資料，並在未找到資訊時提供清晰的回饋。

- **使用者友善介面：** 使用 EasyImage.work，您無需了解技術細節。只需上傳您的 AI 生成圖像，即可立即看到提取的提示詞和參數。

- **匯出功能：** 您可以輕鬆複製提取的提示詞或將所有結果匯出為 JSON 檔案以進行進一步分析。

- **批次處理：** 一次處理多個圖像，從整個 AI 生成藝術作品集合中提取提示詞。

## 結論

通過這次技術深度探討，您現在了解了如何從生成的圖像中提取 AI 圖片提示詞。此過程依賴於仔細解析 AI 工具在生成過程中嵌入的圖像元資料。

**記住：** 成功提取提示詞的關鍵是使用**原始、未修改的 AI 生成圖像**。一旦圖像被處理、編輯或轉換，有價值的提示詞資訊可能會永久遺失。

如果您需要一個簡單、高效且強大的工具來從生成的圖像中提取 AI 提示詞，請記住 [EasyImage.work](https://easyimage.work)！我們將繼續努力為您帶來更多方便實用的 AI 分析功能，幫助您解鎖您喜愛的 AI 生成藝術作品背後的秘密！
