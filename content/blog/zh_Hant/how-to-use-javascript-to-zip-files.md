---
date: 2025-03-09
title: 如何使用JavaScript將檔案打包成壓縮包（.zip）
---

在現代網頁開發中，壓縮檔案是一項常見的需求。使用者可能需要將多個檔案整合為一個壓縮包進行下載，或者通過網頁應用程式生成檔案並匯出為 `.zip` 檔案。這篇部落格文章將為您詳細介紹如何在瀏覽器中使用 JavaScript 實現檔案的打包和壓縮操作。我們將通過使用流行的 JavaScript 庫 JSZip 來完成這項工作，並利用 FileSaver.js 來實現檔案下載。

## 使用前的準備

首先，我們需要安裝兩個常用的庫：

1. JSZip：這是一個輕量級的 JavaScript 庫，用於創建和處理 `.zip` 檔案。
2. FileSaver.js：這個庫提供了一個跨瀏覽器的方式來觸發瀏覽器下載檔案。

您可以通過以下方式在專案中安裝這些庫：

```bash
npm install jszip file-saver
```

或者使用 CDN 引入（在 HTML 中使用）：

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## 工具函數封裝

接下來，我們編寫一個封裝好的工具函數，用來將多個檔案打包成一個 `.zip` 檔案，並觸發下載。假設我們要打包一系列圖片，可以是原始檔案，也可以是經過處理後的檔案。

### 通用的 `downloadFilesAsZip` 函數

```js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * 下載多個檔案並打包為一個 Zip 檔案
 * @param {Array} files - 檔案物件陣列，每個檔案物件包含檔案的 URL 和檔案名
 * @param {string} zipName - 生成的 Zip 檔案名稱，預設是 'download.zip'
 */
export const downloadFilesAsZip = async (files, zipName = "download.zip") => {
  // 創建一個新的 JSZip 實例
  const zip = new JSZip();

  // 使用 map 創建一個 Promise 陣列來處理每個檔案
  const fetchPromises = files.map(async (file) => {
    try {
      // 請求檔案資源，這裡假設檔案是通過 URL 提供的
      const response = await fetch(file.url); // 獲取檔案資源
      const blob = await response.blob(); // 將回應轉換為 Blob 物件

      // 將檔案添加到壓縮包中，使用傳入的檔案名
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`添加檔案失敗: ${file.name}`, error);
    }
  });

  // 等待所有檔案的下載並添加到 Zip 中
  await Promise.all(fetchPromises);

  // 生成壓縮包內容（blob 類型）
  const content = await zip.generateAsync({ type: "blob" });

  // 使用 FileSaver.js 下載壓縮包
  saveAs(content, zipName);
};
```

### 程式碼註解解讀

- 創建 `JSZip` 實例：`const zip = new JSZip();` — 創建一個新的 Zip 檔案實例，所有的檔案將會被添加到這個實例中。
- 檔案下載和打包：使用 `fetch()` 函數從檔案 URL 獲取檔案的內容，然後將它轉換為 `blob` 格式。這是因為 `JSZip` 支援通過 `blob` 格式處理檔案。
- 生成 `.zip` 檔案：通過 `zip.generateAsync({ type: "blob" })` 將所有添加到 `zip` 物件中的檔案壓縮為一個 `.zip` 檔案，返回一個 `blob` 物件。
- 儲存檔案：通過 `saveAs(content, zipName)` 使用 FileSaver.js 觸發檔案下載，`content` 是生成的壓縮包，`zipName` 是下載的檔案名。

## 如何使用這個工具函數

假設我們有一組圖片 URL，並希望將它們打包成一個 `.zip` 檔案進行下載，以下是如何調用 `downloadFilesAsZip` 函數的示例：

```js
// 示例檔案數據：包含檔案 URL 和檔案名
const files = [
  { url: "https://example.com/image1.jpg", name: "image1.jpg" },
  { url: "https://example.com/image2.jpg", name: "image2.jpg" },
  { url: "https://example.com/image3.jpg", name: "image3.jpg" },
];

// 調用函數下載檔案並打包成 zip 檔案
downloadFilesAsZip(files, "images.zip");
```

在這個例子中，我們提供了一個包含圖片 URL 和檔案名的物件陣列。調用 `downloadFilesAsZip` 函數後，瀏覽器會自動觸發下載操作，並將這些圖片打包為一個名為 `images.zip` 的壓縮檔案。

## 常見問題與解決

1. 跨域問題
   如果檔案來自不同的域名，確保伺服器設置了正確的跨域（CORS）頭信息。否則，瀏覽器會阻止 `fetch()` 請求，導致檔案無法下載。
2. 大檔案下載
   如果下載的檔案很大，可能需要優化下載流程，例如分塊下載或顯示進度條等。
3. 瀏覽器支援
   這個方法依賴於 `fetch()` 和 `FileSaver.js`，因此需要支援這些 API 的現代瀏覽器。如果需要支援舊版瀏覽器，可以考慮使用 polyfill。

## 其他方案

除了使用 `JSZip` 和 `FileSaver.js`，還有其他幾種常見的方案可以實現瀏覽器端檔案壓縮和打包：

1. **Pako.js**：`Pako` 是一個用於 JavaScript 的 zlib 壓縮庫，支援 gzip 和 deflate 格式。適合用於較小檔案的壓縮，且使用較為簡單。
2. **Archiver.js**：`Archiver.js` 是一個功能豐富的庫，支援壓縮為 `.tar`、`.zip` 等格式，可以在瀏覽器端進行檔案壓縮，並提供了更多的控制選項。
3. **zip.js**：`zip.js` 是一個支援流式解壓和壓縮的 JavaScript 庫，可以處理較大檔案，並提供了壓縮到 `.zip` 檔案的功能。
4. **BrowserFS + zip-lib**：`BrowserFS` 是一個在瀏覽器中提供檔案系統模擬的庫，結合 `zip-lib` 可以創建和下載 `.zip` 檔案，適合需要模擬檔案系統的應用。
