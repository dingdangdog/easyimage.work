---
date: 2025-03-09
title: Cách sử dụng JavaScript để đóng gói file thành file nén (.zip)
---

Trong phát triển web hiện đại, nén file là một yêu cầu phổ biến. Người dùng có thể cần kết hợp nhiều file thành một gói nén để tải xuống, hoặc tạo file thông qua ứng dụng web và xuất chúng dưới dạng file `.zip`. Bài viết blog này sẽ cung cấp hướng dẫn chi tiết về cách triển khai các thao tác đóng gói và nén file trong trình duyệt bằng JavaScript. Chúng ta sẽ hoàn thành việc này bằng cách sử dụng thư viện JavaScript phổ biến JSZip và tận dụng FileSaver.js để tải xuống file.

## Chuẩn bị

Đầu tiên, chúng ta cần cài đặt hai thư viện thường được sử dụng:

1. JSZip: Đây là một thư viện JavaScript nhẹ được sử dụng để tạo và xử lý file `.zip`.
2. FileSaver.js: Thư viện này cung cấp cách cross-browser để kích hoạt tải xuống file của trình duyệt.

Bạn có thể cài đặt các thư viện này trong dự án của mình bằng cách:

```bash
npm install jszip file-saver
```

Hoặc bao gồm chúng qua CDN (để sử dụng trong HTML):

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## Triển khai hàm tiện ích

Tiếp theo, chúng ta sẽ viết một hàm tiện ích được đóng gói để đóng gói nhiều file thành một file `.zip` và kích hoạt tải xuống. Giả sử chúng ta muốn đóng gói một loạt ảnh, có thể là file gốc hoặc file đã được xử lý.

### Hàm `downloadFilesAsZip` tổng quát

```js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Tải xuống nhiều file được đóng gói thành file Zip
 * @param {Array} files - Mảng các đối tượng file, mỗi đối tượng chứa URL và tên file
 * @param {string} zipName - Tên của file Zip được tạo, mặc định là 'download.zip'
 */
export const downloadFilesAsZip = async (files, zipName = "download.zip") => {
  // Tạo một instance JSZip mới
  const zip = new JSZip();

  // Sử dụng map để tạo một mảng Promise để xử lý từng file
  const fetchPromises = files.map(async (file) => {
    try {
      // Yêu cầu tài nguyên file, giả sử file được cung cấp qua URL
      const response = await fetch(file.url); // Lấy tài nguyên file
      const blob = await response.blob(); // Chuyển đổi phản hồi thành đối tượng Blob

      // Thêm file vào gói zip, sử dụng tên file được cung cấp
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`Không thể thêm file: ${file.name}`, error);
    }
  });

  // Chờ tất cả file được tải xuống và thêm vào Zip
  await Promise.all(fetchPromises);

  // Tạo nội dung gói zip (kiểu blob)
  const content = await zip.generateAsync({ type: "blob" });

  // Sử dụng FileSaver.js để tải xuống gói zip
  saveAs(content, zipName);
};
```

### Giải thích code

- Tạo instance `JSZip`: `const zip = new JSZip();` — Tạo một instance file Zip mới, tất cả file sẽ được thêm vào instance này.
- Tải xuống và đóng gói file: Sử dụng hàm `fetch()` để lấy nội dung của file từ URL, sau đó chuyển đổi nó thành định dạng `blob`. Điều này là do `JSZip` hỗ trợ xử lý file ở định dạng `blob`.
- Tạo file `.zip`: Thông qua `zip.generateAsync({ type: "blob" })`, tất cả file được thêm vào đối tượng `zip` được nén thành một file `.zip`, trả về một đối tượng `blob`.
- Lưu file: Sử dụng `saveAs(content, zipName)` với FileSaver.js để kích hoạt tải xuống file, trong đó `content` là gói zip được tạo và `zipName` là tên file tải xuống.

## Cách sử dụng hàm tiện ích này

Giả sử chúng ta có một tập hợp URL ảnh và muốn đóng gói chúng thành một file `.zip` để tải xuống. Đây là ví dụ về cách gọi hàm `downloadFilesAsZip`:

```js
// Dữ liệu file ví dụ: chứa URL file và tên file
const files = [
  { url: "https://example.com/image1.jpg", name: "image1.jpg" },
  { url: "https://example.com/image2.jpg", name: "image2.jpg" },
  { url: "https://example.com/image3.jpg", name: "image3.jpg" },
];

// Gọi hàm để tải xuống file và đóng gói thành file zip
downloadFilesAsZip(files, "images.zip");
```

Trong ví dụ này, chúng ta cung cấp một mảng các đối tượng chứa URL ảnh và tên file. Sau khi gọi hàm `downloadFilesAsZip`, trình duyệt sẽ tự động kích hoạt thao tác tải xuống và đóng gói những ảnh này thành một file nén có tên `images.zip`.

## Các vấn đề thường gặp và giải pháp

1. Vấn đề Cross-Origin
   Nếu file đến từ các domain khác nhau, hãy đảm bảo server đã thiết lập đúng header Cross-Origin Resource Sharing (CORS). Nếu không, trình duyệt sẽ chặn các yêu cầu `fetch()`, ngăn cản việc tải xuống file.
2. Tải xuống file lớn
   Nếu các file đang được tải xuống lớn, bạn có thể cần tối ưu hóa quá trình tải xuống, chẳng hạn như triển khai tải xuống theo chunk hoặc hiển thị thanh tiến trình.
3. Hỗ trợ trình duyệt
   Phương pháp này dựa vào `fetch()` và `FileSaver.js`, vì vậy nó yêu cầu các trình duyệt hiện đại hỗ trợ các API này. Nếu bạn cần hỗ trợ các trình duyệt cũ hơn, hãy cân nhắc sử dụng polyfill.

## Các giải pháp thay thế

Bên cạnh việc sử dụng `JSZip` và `FileSaver.js`, có một số giải pháp phổ biến khác để triển khai nén và đóng gói file trong trình duyệt:

1. **Pako.js**: `Pako` là một thư viện nén zlib cho JavaScript, hỗ trợ định dạng gzip và deflate. Nó phù hợp để nén các file nhỏ hơn và tương đối đơn giản để sử dụng.
2. **Archiver.js**: `Archiver.js` là một thư viện giàu tính năng hỗ trợ nén sang các định dạng như `.tar`, `.zip`, v.v. Nó có thể thực hiện nén file trong trình duyệt và cung cấp nhiều tùy chọn kiểm soát hơn.
3. **zip.js**: `zip.js` là một thư viện JavaScript hỗ trợ giải nén và nén streaming, có khả năng xử lý các file lớn hơn và cung cấp chức năng nén thành file `.zip`.
4. **BrowserFS + zip-lib**: `BrowserFS` là một thư viện cung cấp mô phỏng hệ thống file trong trình duyệt. Kết hợp với `zip-lib`, nó có thể tạo và tải xuống file `.zip`, phù hợp cho các ứng dụng cần mô phỏng hệ thống file.
