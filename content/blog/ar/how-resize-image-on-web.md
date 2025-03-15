---
date: 2025-03-16
title: كيفية تحقيق عملية تحجيم الصور على الويب باستخدام EasyImage.work
---

هل سبق أن شعرت بالإحباط بسبب الصور الكبيرة التي تبطئ موقعك على الويب؟ أو احتجت إلى أحجام مختلفة من الصور لسيناريوهات عرض متنوعة؟ في EasyImage.work، نحن ندرك أهمية معالجة الصور، ولهذا السبب نكرس جهودنا لتزويدك بأدوات بسيطة وفعالة لمعالجة الصور عبر الإنترنت. اليوم، دعنا نتعمق تقنيًا في كيفية تنفيذ وظيفة تحجيم الصور بسهولة على الويب، تمامًا كما فعلنا في EasyImage.work!

## ضرورة تحجيم الصور

الصور موجودة في كل مكان في تطبيقات الإنترنت. ومع ذلك، فإن السيناريوهات المختلفة لها متطلبات مختلفة لأحجام الصور:

- **تحسين تحميل موقع الويب:** يمكن أن تبطئ الصور الكبيرة تحميل الصفحة، مما يؤثر على تجربة المستخدم.
- **التصميم المتجاوب:** تحتوي الأجهزة المختلفة على أحجام شاشة متفاوتة، مما يتطلب أبعاد صور مختلفة للعرض المناسب.
- **عرض الصور المصغرة:** في سيناريوهات القوائم أو المعاينة، هناك حاجة إلى صور مصغرة أصغر لتوفير المساحة وعرض النطاق الترددي.

لذلك، فإن تنفيذ وظيفة تحجيم الصور بكفاءة على الويب أمر بالغ الأهمية.

## الرؤى التقنية وراء EasyImage.work

قد تكون فضوليًا حول كيفية قيام EasyImage.work بإنشاء صور مصغرة وصور مقاسة بأحجام مختلفة بسرعة مباشرة في المتصفح. اليوم، سنكشف عن السر من خلال فحص مثال لكود JavaScript أساسي.

```js
// معالجة الصورة
const processImage = async (file: File) => {
  processing.value = true;
  processedImages.value = [];

  const img = new Image();
  const reader = new FileReader();

  return new Promise<void>((resolve) => {
    reader.onload = (e) => {
      img.src = String(e.target?.result);
    };

    img.onload = async () => {
      const originalWidth = img.naturalWidth;
      const originalHeight = img.naturalHeight;
      const mimeType = file.type;

      let width = originalWidth;
      let height = originalHeight;
      let n = 0;

      // تقليل بقوى 2 حتى يكون العرض أو الارتفاع أقل من 64
      while (width >= 64 && height >= 64) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) break;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(mimeType);

        // إنشاء صورة مصغرة
        const thumbCanvas = document.createElement("canvas");
        const thumbCtx = thumbCanvas.getContext("2d");
        if (!thumbCtx) break;

        const maxWidth = 250;
        const maxHeight = 200;
        let thumbWidth = width;
        let thumbHeight = height;

        if (thumbWidth > maxWidth || thumbHeight > maxHeight) {
          const ratio = Math.min(
            maxWidth / thumbWidth,
            maxHeight / thumbHeight
          );
          thumbWidth = thumbWidth * ratio;
          thumbHeight = thumbHeight * ratio;
        }

        thumbCanvas.width = thumbWidth;
        thumbCanvas.height = thumbHeight;
        thumbCtx.drawImage(canvas, 0, 0, thumbWidth, thumbHeight);

        processedImages.value.push({
          width,
          height,
          original: dataUrl,
          thumbnail: thumbCanvas.toDataURL(mimeType),
          name: `${file.name.split(".")[0]}_${width}x${height}.${file.name
            .split(".")
            .pop()}`,
        });

        n++;
        width = Math.floor(originalWidth / Math.pow(2, n));
        height = Math.floor(originalHeight / Math.pow(2, n));
      }

      processing.value = false;
      resolve();
    };

    reader.readAsDataURL(file);
  });
};
```

## شرح الكود

1. **قراءة ملف الصورة:** يستخدم الكود أولاً `FileReader` لقراءة ملف الصورة الذي تم تحميله بواسطة المستخدم وتحويله إلى عنوان URL للبيانات.
2. **إنشاء كائن Image:** ثم يستخدم كائن `Image` لتحميل الصورة للحصول على أبعادها الأصلية (`naturalWidth` و `naturalHeight`).
3. **حلقة التحجيم:** الجزء الأساسي هو حلقة `while` التي تقلل تدريجياً حجم الصورة بقوى 2 حتى يكون العرض أو الارتفاع أقل من 64 بكسل.
4. **الرسم على Canvas:** في كل تكرار، يتم إنشاء عنصر `canvas`، ويتم رسم الصورة المقاسة عليه. تقوم طريقة `toDataURL()` الخاصة بـ `canvas` بتحويل محتواها إلى عنوان URL للبيانات، مما يؤدي إلى الحصول على بيانات الصورة.
5. **إنشاء الصور المصغرة:** لتوفير صور معاينة أصغر، ينشئ الكود أيضًا صورًا مصغرة. يقوم بإنشاء عنصر `canvas` جديد (`thumbCanvas`) ويقيس الصورة بشكل متناسب بناءً على الحد الأقصى للعرض والارتفاع المحدد مسبقًا (`maxWidth` و `maxHeight`).
6. **تخزين النتائج:** يتم تخزين بيانات الصورة المعالجة (الصور الأصلية المقاسة والصور المصغرة) بأحجام مختلفة في مصفوفة (`processedImages`) للاستخدام لاحقًا.

## مزايا EasyImage.work

هذا الكود هو مجرد أحد مكونات المنطق الأساسي لوظيفة تحجيم الصور في EasyImage.work. في التطبيقات العملية، قمنا بالعديد من التحسينات والتعزيزات، مثل:

- **دعم تنسيقات صور متعددة:** يدعم EasyImage.work ليس فقط التنسيقات الشائعة مثل JPEG و PNG، ولكن أيضًا GIF والمزيد.
- **استراتيجيات تحجيم أكثر مرونة:** بالإضافة إلى التحجيم بقوى 2، نقدم خيارات متنوعة مثل الأبعاد المخصصة والتحجيم المتناسب لتلبية احتياجاتك المختلفة.
- **أداء أفضل:** لقد قمنا بتحسين الكود بعمق لضمان معالجة الصور بسرعة وكفاءة حتى في المتصفح.
- **واجهة نظيفة وسهلة الاستخدام:** مع EasyImage.work، لا تحتاج إلى كتابة أي كود. ما عليك سوى تحميل صورتك، واختيار حجم التحجيم المطلوب، وإكمال العملية بسهولة.

## الخلاصة

من خلال هذا التقديم، يجب أن يكون لديك الآن فهم أفضل لكيفية تنفيذ وظيفة تحجيم الصور على الويب. على الرغم من أن هذا مجرد غيض من فيض، إلا أنه يوضح خبرة EasyImage.work في تكنولوجيا معالجة الصور.

إذا كنت بحاجة إلى أداة بسيطة وفعالة وقوية لمعالجة الصور عبر الإنترنت، فتذكر [EasyImage.work](https://easyimage.work)! سنواصل العمل الجاد لنقدم لك المزيد من ميزات معالجة الصور المريحة والعملية، مما يجعل صورك تتألق في عالم الويب!
