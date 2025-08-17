---
date: 2025-04-10
title: Cách viết một component web upload ảnh kéo thả xuất sắc
---

Trong môi trường phát triển web hiện đại, việc cung cấp trải nghiệm người dùng mượt mà là rất quan trọng. Một cách để nâng cao tương tác người dùng là triển khai tính năng upload ảnh kéo thả. Blog này sẽ hướng dẫn bạn tạo một component upload ảnh kéo thả hiệu quả và thân thiện với người dùng, được lấy cảm hứng từ việc triển khai tại [EasyImage.work](https://easyimage.work).

## Tại sao chọn upload ảnh kéo thả?

Tính năng kéo thả mang lại một số lợi thế:

- **Thân thiện với người dùng:** Nó đơn giản hóa quá trình upload file, làm cho thao tác của người dùng trực quan hơn.
- **Hiệu quả:** Người dùng có thể upload nhiều file cùng lúc, tiết kiệm thời gian.
- **Tương tác:** Cung cấp trải nghiệm hấp dẫn hơn so với các phương pháp input file truyền thống.

## Các tính năng chính của một component kéo thả tốt

1. **Phản hồi trực quan:** Cho biết khi file được kéo qua vùng thả.
2. **Hỗ trợ nhiều file:** Cho phép người dùng upload nhiều ảnh cùng lúc.
3. **Xác thực loại file:** Đảm bảo chỉ upload ảnh bằng cách xác thực loại file.
4. **Thiết kế responsive:** Thích ứng với các kích thước màn hình và thiết bị khác nhau.
5. **Khả năng truy cập:** Đảm bảo component có thể sử dụng cho tất cả người dùng, bao gồm những người sử dụng trình đọc màn hình.

## Chi tiết triển khai

Dưới đây là phân tích chi tiết về component upload ảnh kéo thả từ [EasyImage.work](https://easyimage.work):

### Cấu trúc template

Template của component bao gồm một vùng thả với các event listener cho các hành động kéo thả:

```html
<div
  @dragover.prevent="dragOver = true"
  @dragleave="dragOver = false"
  @drop.prevent="handleDrop"
  @click.stop="upload()"
  class="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
  :class="{'border-orange-700 bg-blue-50': dragOver}"
>
  <input
    type="file"
    multiple
    accept="image/*"
    @change="handleFileSelect"
    class="hidden"
    ref="fileInput"
  />
  <p>Kéo và thả ảnh vào đây, hoặc nhấp để chọn file.</p>
</div>
```

### Logic script

Script xử lý việc chọn và xử lý file:

```typescript
const fileInput = ref<HTMLInputElement | null>(null);
const dragOver = ref(false);
const processedImages = ref<ResizeImage[]>([]);

const handleFileSelect = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files) await processFiles(Array.from(files));
};

const handleDrop = async (e: DragEvent) => {
  dragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files) await processFiles(Array.from(files));
};
```

### Xử lý ảnh

Ảnh được xử lý bằng hàm `processFiles`, hàm này thay đổi kích thước và lưu trữ ảnh:

```typescript
const processFiles = async (files: File[]) => {
  for (const file of files) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = String(e.target?.result);
    };

    img.onload = () => {
      // Logic thay đổi kích thước ở đây
    };

    reader.readAsDataURL(file);
  }
};
```

## Kết luận

Triển khai component upload ảnh kéo thả có thể nâng cao đáng kể trải nghiệm người dùng trên website của bạn. Bằng cách tuân theo các nguyên tắc và cấu trúc code được nêu trên, bạn có thể tạo một component mạnh mẽ và hiệu quả đáp ứng các tiêu chuẩn web hiện đại.

Để có các tính năng xử lý ảnh nâng cao hơn, hãy cân nhắc khám phá [EasyImage.work](https://easyimage.work), nơi cung cấp bộ công cụ toàn diện cho việc xử lý ảnh trực tuyến.
