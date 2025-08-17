---
date: 2025-08-17
title: Cách trích xuất prompt ảnh AI từ ảnh được tạo với EasyImage.work
---

Bạn đã bao giờ tự hỏi làm thế nào để trích xuất các prompt và tham số gốc từ một ảnh được tạo bởi AI chưa? Hoặc muốn hiểu các cài đặt chính xác được sử dụng để tạo ra tác phẩm nghệ thuật tuyệt đẹp đó? Tại EasyImage.work, chúng tôi đã phát triển một công cụ phân tích AI tinh vi có thể trích xuất thông tin prompt chi tiết trực tiếp từ các ảnh được tạo bởi AI. Hôm nay, hãy cùng đi sâu vào việc triển khai kỹ thuật về cách trích xuất prompt ảnh AI từ metadata của ảnh, giống như chúng tôi đã làm tại EasyImage.work!

## Tầm quan trọng của việc trích xuất prompt AI

Ảnh được tạo bởi AI đã trở nên ngày càng phổ biến, và việc hiểu cách chúng được tạo ra có giá trị vì một số lý do:

- **Học hỏi và cải thiện:** Bằng cách phân tích các prompt thành công, bạn có thể học những gì hiệu quả và cải thiện kỹ năng tạo nghệ thuật AI của chính mình.
- **Tái tạo và biến thể:** Trích xuất prompt cho phép bạn tái tạo các ảnh tương tự hoặc tạo ra các biến thể với những thay đổi nhỏ.
- **Tài liệu và chia sẻ:** Có các prompt gốc giúp tài liệu hóa quá trình sáng tạo của bạn và chia sẻ kỹ thuật với người khác.
- **Đánh giá chất lượng:** Hiểu các tham số được sử dụng có thể giúp đánh giá chất lượng và độ phức tạp của tác phẩm nghệ thuật được tạo bởi AI.

Tuy nhiên, điều quan trọng cần lưu ý là **chỉ những ảnh được tạo bởi AI gốc mới có thể trích xuất prompt thành công**. Một khi ảnh đã được chỉnh sửa, thay đổi kích thước, hoặc chuyển đổi sang các định dạng khác nhau, metadata chứa thông tin prompt có thể bị mất hoặc bị hỏng, khiến việc trích xuất không thể thực hiện được.

## Những hiểu biết kỹ thuật đằng sau phân tích AI của EasyImage.work

Bạn có thể tò mò về cách EasyImage.work trích xuất thông tin prompt chi tiết trực tiếp từ các ảnh được tạo bởi AI trong trình duyệt. Hôm nay, chúng tôi sẽ tiết lộ bí mật bằng cách xem xét code JavaScript cốt lõi cung cấp năng lượng cho chức năng phân tích AI của chúng tôi.

```js
// Trích xuất thông tin AI từ file
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // Sử dụng các phương pháp trích xuất khác nhau dựa trên loại file
    if (file.type === "image/png" || file.name.toLowerCase().endsWith(".png")) {
      extractedText = extractPNGText(uint8Array);
    } else if (
      file.type.startsWith("image/jpeg") ||
      file.name.toLowerCase().match(/\.(jpg|jpeg)$/)
    ) {
      extractedText = extractJPEGText(uint8Array);
    }

    if (!extractedText.trim()) {
      console.log(`[DEBUG] File ${file.name} không có text được trích xuất`);
      return null;
    }

    // Kiểm tra xem text có chứa từ khóa AI không
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
      console.log(`[DEBUG] File ${file.name} không chứa từ khóa AI`);
      return null;
    }

    // Làm sạch và định dạng text
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // Định dạng thông tin AI
    const formattedText = formatAIText(cleanText);

    return {
      rawText: formattedText,
    };
  } catch (error) {
    console.error(`Lỗi phân tích file ${file.name}:`, error);
    return null;
  }
};
```

## Trích xuất text PNG

Đối với ảnh PNG, các công cụ AI thường lưu trữ thông tin prompt trong các chunk text trong file ảnh. Đây là cách chúng tôi trích xuất dữ liệu này:

```js
// Trích xuất text PNG
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // Bỏ qua chữ ký PNG

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
        console.log(`[DEBUG] Tìm thấy chunk PNG ${type}:`, chunkText.substring(0, 200));
      }

      offset += 12 + length;
      if (type === "IEND") break;
    }

    return text;
  } catch (error) {
    console.error("Trích xuất text PNG thất bại:", error);
    return "";
  }
};
```

## Trích xuất text JPEG

Đối với ảnh JPEG, metadata AI thường được lưu trữ trong dữ liệu EXIF trong các segment APP1:

```js
// Trích xuất text JPEG
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // Bỏ qua marker SOI

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // Segment APP1
        const length = (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
        const data = uint8Array.slice(offset + 4, offset + 2 + length);
        const segmentText = new TextDecoder("utf-8", { fatal: false }).decode(
          data
        );
        text += segmentText + "\n";
        console.log(
          `[DEBUG] Tìm thấy segment JPEG APP1:`,
          segmentText.substring(0, 200)
        );
      }

      const segmentLength =
        (uint8Array[offset + 2] << 8) | uint8Array[offset + 3];
      offset += 2 + segmentLength;

      // Dừng khi đến dữ liệu ảnh
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
    console.error("Trích xuất text JPEG thất bại:", error);
    return "";
  }
};
```

## Định dạng text AI

Một khi chúng tôi trích xuất text thô, chúng tôi cần định dạng nó đúng cách để làm cho nó dễ đọc và có tổ chức:

```js
// Định dạng text AI
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // Tìm phần tham số
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // Chia nội dung: Prompt, Negative prompt, Parameters
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // Xử lý phần Prompt
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // Xử lý phần Negative prompt
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

    // Xử lý phần Parameters
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // Trích xuất các dòng tham số
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // Chuyển đổi các tham số được phân tách bằng dấu phẩy thành phân tách bằng dòng
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

## Giải thích code

1. **Phát hiện loại file:** Code đầu tiên xác định xem file được upload là ảnh PNG hay JPEG, vì các định dạng khác nhau lưu trữ metadata khác nhau.

2. **Xử lý dữ liệu nhị phân:** File được chuyển đổi thành `Uint8Array` để xử lý dữ liệu nhị phân thô và trích xuất thông tin text được nhúng.

3. **Trích xuất theo định dạng cụ thể:** 
   - Đối với file PNG, code tìm kiếm các chunk `tEXt` và `iTXt` chứa metadata text
   - Đối với file JPEG, nó tìm kiếm các segment APP1 chứa dữ liệu EXIF với các tham số AI

4. **Phát hiện từ khóa AI:** Text được trích xuất được phân tích cho các từ khóa liên quan đến AI cụ thể như "Steps:", "Sampler:", "CFG scale:", v.v., để xác nhận nó chứa các tham số tạo AI.

5. **Định dạng text:** Text thô được trích xuất được làm sạch và định dạng thành cấu trúc dễ đọc với các phần rõ ràng cho Prompt, Negative prompt, và Parameters.

6. **Xác thực kết quả:** Chỉ những file chứa metadata AI hợp lệ mới được xử lý và hiển thị cho người dùng.

## Yêu cầu quan trọng để trích xuất thành công

**Quan trọng:** Quá trình trích xuất này chỉ hoạt động với **những ảnh được tạo bởi AI gốc**. Đây là lý do tại sao:

- **Bảo tồn metadata:** Các công cụ AI như Stable Diffusion, Midjourney, và DALL-E nhúng thông tin prompt trực tiếp vào metadata của file ảnh khi ảnh được tạo lần đầu tiên.

- **Mất dữ liệu trong quá trình xử lý:** Khi ảnh được chỉnh sửa, thay đổi kích thước, chuyển đổi sang các định dạng khác nhau, hoặc xử lý thông qua phần mềm chỉnh sửa ảnh, metadata chứa thông tin prompt thường bị loại bỏ hoặc bị hỏng.

- **Giới hạn định dạng:** Chỉ hỗ trợ các định dạng PNG và JPEG, vì đây là những định dạng mà các công cụ AI thường sử dụng để lưu trữ metadata.

- **Yêu cầu nguồn gốc:** Những ảnh đã được tải xuống từ mạng xã hội, chụp màn hình, hoặc xử lý thông qua các ứng dụng web có thể mất metadata gốc của chúng.

## Ưu điểm của phân tích AI EasyImage.work

Code này chỉ đại diện cho một thành phần của chức năng phân tích AI toàn diện của EasyImage.work. Trong việc triển khai thực tế của chúng tôi, chúng tôi đã thực hiện nhiều tối ưu hóa và cải tiến:

- **Hỗ trợ đa định dạng:** EasyImage.work hỗ trợ cả định dạng PNG và JPEG, bao gồm các loại ảnh được tạo bởi AI phổ biến nhất.

- **Phát hiện thông minh:** Hệ thống của chúng tôi tự động phát hiện xem ảnh có chứa metadata AI hay không và cung cấp phản hồi rõ ràng khi không tìm thấy thông tin.

- **Giao diện thân thiện với người dùng:** Với EasyImage.work, bạn không cần hiểu các chi tiết kỹ thuật. Chỉ cần upload ảnh được tạo bởi AI của bạn và ngay lập tức thấy các prompt và tham số được trích xuất.

- **Chức năng xuất:** Bạn có thể dễ dàng sao chép các prompt được trích xuất hoặc xuất tất cả kết quả dưới dạng file JSON để phân tích thêm.

- **Xử lý hàng loạt:** Xử lý nhiều ảnh cùng lúc để trích xuất prompt từ toàn bộ bộ sưu tập tác phẩm nghệ thuật được tạo bởi AI.

## Kết luận

Thông qua việc đi sâu vào kỹ thuật này, bạn giờ đây hiểu cách trích xuất prompt ảnh AI từ các ảnh được tạo. Quá trình này dựa vào việc phân tích cẩn thận metadata ảnh mà các công cụ AI nhúng trong quá trình tạo.

**Hãy nhớ:** Chìa khóa để trích xuất prompt thành công là sử dụng **những ảnh được tạo bởi AI gốc, chưa được chỉnh sửa**. Một khi ảnh đã được xử lý, chỉnh sửa, hoặc chuyển đổi, thông tin prompt quý giá có thể bị mất vĩnh viễn.

Nếu bạn cần một công cụ đơn giản, hiệu quả và mạnh mẽ để trích xuất prompt AI từ các ảnh được tạo của mình, hãy nhớ đến [EasyImage.work](https://easyimage.work)! Chúng tôi sẽ tiếp tục làm việc chăm chỉ để mang đến cho bạn nhiều tính năng phân tích AI tiện lợi và thực tế hơn, giúp bạn khám phá những bí mật đằng sau tác phẩm nghệ thuật được tạo bởi AI yêu thích của mình!
