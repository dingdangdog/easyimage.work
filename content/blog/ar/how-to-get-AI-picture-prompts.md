---
date: 2025-03-16
title: كيفية استخراج أوامر الصور الذكية من الصور المُولدة باستخدام EasyImage.work
---

هل تساءلت يومًا عن كيفية استخراج الأوامر والمعاملات الأصلية من صورة مولدة بالذكاء الاصطناعي؟ أو أردت فهم الإعدادات الدقيقة المستخدمة لإنشاء تلك الأعمال الفنية المذهلة؟ في EasyImage.work، طورنا أداة تحليل ذكية متطورة يمكنها استخراج معلومات الأوامر التفصيلية مباشرة من الصور المولدة بالذكاء الاصطناعي. اليوم، دعنا نتعمق في التنفيذ التقني لكيفية استخراج أوامر الصور الذكية من بيانات وصفية للصورة، تمامًا كما فعلنا في EasyImage.work!

## أهمية استخراج أوامر الذكاء الاصطناعي

أصبحت الصور المولدة بالذكاء الاصطناعي شائعة بشكل متزايد، وفهم كيفية إنشائها أمر قيّم لعدة أسباب:

- **التعلم والتحسين:** من خلال تحليل الأوامر الناجحة، يمكنك تعلم ما يعمل وتحسين مهاراتك في توليد الفن بالذكاء الاصطناعي.
- **إعادة الإنتاج والتنويع:** استخراج الأوامر يتيح لك إعادة إنشاء صور مماثلة أو إنشاء تنويعات بتعديلات طفيفة.
- **التوثيق والمشاركة:** امتلاك الأوامر الأصلية يساعد في توثيق عملية الإبداع ومشاركة التقنيات مع الآخرين.
- **تقييم الجودة:** فهم المعاملات المستخدمة يمكن أن يساعد في تقييم جودة وتعقيد الأعمال الفنية المولدة بالذكاء الاصطناعي.

ومع ذلك، من المهم ملاحظة أن **فقط الصور المولدة بالذكاء الاصطناعي الأصلية يمكنها استخراج الأوامر بنجاح**. بمجرد تعديل الصورة أو تغيير حجمها أو تحويلها إلى صيغ مختلفة، قد تفقد البيانات الوصفية المحتوية على معلومات الأوامر أو تتلف، مما يجعل الاستخراج مستحيلاً.

## الرؤى التقنية وراء تحليل الذكاء الاصطناعي في EasyImage.work

قد تكون فضوليًا حول كيفية استخراج EasyImage.work لمعلومات الأوامر التفصيلية مباشرة من الصور المولدة بالذكاء الاصطناعي في المتصفح. اليوم، سنكشف السر من خلال فحص كود JavaScript الأساسي الذي يشغل وظيفة تحليل الذكاء الاصطناعي لدينا.

```js
// استخراج معلومات الذكاء الاصطناعي من الملف
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // استخدام طرق استخراج مختلفة بناءً على نوع الملف
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

    // التحقق من احتواء النص على كلمات مفتاحية للذكاء الاصطناعي
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

    // تنظيف وتنسيق النص
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // تنسيق معلومات الذكاء الاصطناعي
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

## استخراج نص PNG

للصور بصيغة PNG، غالبًا ما تخزن أدوات الذكاء الاصطناعي معلومات الأوامر في أجزاء نصية داخل ملف الصورة. إليك كيفية استخراج هذه البيانات:

```js
// استخراج نص PNG
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // تخطي توقيع PNG

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

## استخراج نص JPEG

للصور بصيغة JPEG، عادة ما تُخزن بيانات وصفية للذكاء الاصطناعي في بيانات EXIF داخل أجزاء APP1:

```js
// استخراج نص JPEG
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // تخطي علامة SOI

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // جزء APP1
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

      // التوقف عند الوصول لبيانات الصورة
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

## تنسيق نص الذكاء الاصطناعي

بمجرد استخراج النص الخام، نحتاج إلى تنسيقه بشكل صحيح لجعله مقروءًا ومنظمًا:

```js
// تنسيق نص الذكاء الاصطناعي
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // البحث عن قسم المعاملات
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // تقسيم المحتوى: الأمر، الأمر السلبي، المعاملات
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // معالجة قسم الأمر
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // معالجة قسم الأمر السلبي
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

    // معالجة قسم المعاملات
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // استخراج أسطر المعاملات
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // تحويل المعاملات المفصولة بفواصل إلى مفصولة بأسطر
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

## شرح الكود

1. **اكتشاف نوع الملف:** يحدد الكود أولاً ما إذا كان الملف المرفوع صورة PNG أو JPEG، حيث تخزن الصيغ المختلفة البيانات الوصفية بشكل مختلف.

2. **معالجة البيانات الثنائية:** يتم تحويل الملف إلى `Uint8Array` لمعالجة البيانات الثنائية الخام واستخراج معلومات النص المضمنة.

3. **الاستخراج حسب الصيغة:** 
   - للصور بصيغة PNG، يبحث الكود عن أجزاء `tEXt` و `iTXt` التي تحتوي على بيانات وصفية نصية
   - للصور بصيغة JPEG، يبحث عن أجزاء APP1 التي تحتوي على بيانات EXIF مع معاملات الذكاء الاصطناعي

4. **اكتشاف كلمات مفتاحية للذكاء الاصطناعي:** يتم تحليل النص المستخرج للكلمات المفتاحية المتعلقة بالذكاء الاصطناعي مثل "Steps:", "Sampler:", "CFG scale:", إلخ، لتأكيد احتوائه على معاملات توليد الذكاء الاصطناعي.

5. **تنسيق النص:** يتم تنظيف النص المستخرج الخام وتنسيقه في هيكل مقروء مع أقسام واضحة للأمر، والأمر السلبي، والمعاملات.

6. **التحقق من النتائج:** يتم معالجة وعرض الملفات التي تحتوي على بيانات وصفية صالحة للذكاء الاصطناعي فقط للمستخدم.

## المتطلبات الحاسمة للاستخراج الناجح

**مهم:** عملية الاستخراج هذه تعمل فقط مع **الصور المولدة بالذكاء الاصطناعي الأصلية**. إليك السبب:

- **الحفاظ على البيانات الوصفية:** أدوات الذكاء الاصطناعي مثل Stable Diffusion و Midjourney و DALL-E تضمن معلومات الأوامر مباشرة في البيانات الوصفية لملف الصورة عند توليد الصورة لأول مرة.

- **فقدان البيانات أثناء المعالجة:** عند تعديل الصور أو تغيير أحجامها أو تحويلها إلى صيغ مختلفة أو معالجتها من خلال برامج تحرير الصور، غالبًا ما يتم إزالة البيانات الوصفية المحتوية على معلومات الأوامر أو إتلافها.

- **قيود الصيغة:** يتم دعم صيغ PNG و JPEG فقط، حيث أن هذه هي الصيغ التي تستخدمها أدوات الذكاء الاصطناعي عادة لتخزين البيانات الوصفية.

- **متطلب المصدر الأصلي:** الصور التي تم تنزيلها من وسائل التواصل الاجتماعي أو التقاطها كشاشة أو معالجتها من خلال تطبيقات الويب قد تفقد بياناتها الوصفية الأصلية.

## مزايا تحليل الذكاء الاصطناعي في EasyImage.work

يمثل هذا الكود مكونًا واحدًا فقط من وظيفة تحليل الذكاء الاصطناعي الشاملة في EasyImage.work. في تنفيذنا العملي، قمنا بالعديد من التحسينات والتحسينات:

- **دعم متعدد الصيغ:** يدعم EasyImage.work صيغ PNG و JPEG، مما يغطي أكثر أنواع الصور المولدة بالذكاء الاصطناعي شيوعًا.

- **اكتشاف ذكي:** نظامنا يكتشف تلقائيًا ما إذا كانت الصورة تحتوي على بيانات وصفية للذكاء الاصطناعي ويوفر تغذية راجعة واضحة عندما لا يتم العثور على معلومات.

- **واجهة سهلة الاستخدام:** مع EasyImage.work، لا تحتاج إلى فهم التفاصيل التقنية. ما عليك سوى رفع صورة مولدة بالذكاء الاصطناعي وسترى فورًا الأوامر والمعاملات المستخرجة.

- **وظيفة التصدير:** يمكنك بسهولة نسخ الأوامر المستخرجة أو تصدير جميع النتائج كملفات JSON لمزيد من التحليل.

- **معالجة الدفعات:** معالجة صور متعددة في وقت واحد لاستخراج الأوامر من مجموعات كاملة من الأعمال الفنية المولدة بالذكاء الاصطناعي.

## الخلاصة

من خلال هذا التعمق التقني، تفهم الآن كيفية استخراج أوامر الصور الذكية من الصور المولدة. تعتمد هذه العملية على تحليل البيانات الوصفية للصورة بعناية التي تضمنها أدوات الذكاء الاصطناعي أثناء عملية التوليد.

**تذكر:** المفتاح للاستخراج الناجح للأوامر هو استخدام **الصور المولدة بالذكاء الاصطناعي الأصلية وغير المعدلة**. بمجرد معالجة الصورة أو تعديلها أو تحويلها، قد تفقد معلومات الأوامر القيّمة بشكل دائم.

إذا كنت بحاجة إلى أداة بسيطة وفعالة وقوية لاستخراج أوامر الذكاء الاصطناعي من صورك المولدة، تذكر [EasyImage.work](https://easyimage.work)! سنواصل العمل بجد لجلب المزيد من ميزات تحليل الذكاء الاصطناعي المريحة والعملية، مما يساعدك على كشف أسرار أعمالك الفنية المولدة بالذكاء الاصطناعي المفضلة!
