---
date: 2025-08-17
title: EasyImage.work দিয়ে জেনারেট করা ছবি থেকে AI ছবির প্রম্পট কীভাবে বের করবেন
---

আপনি কি কখনও ভেবেছেন কীভাবে একটি AI-জেনারেট করা ছবি থেকে মূল প্রম্পট এবং প্যারামিটারগুলি বের করা যায়? অথবা সেই অসাধারণ শিল্পকর্ম তৈরি করতে ব্যবহৃত সঠিক সেটিংসগুলি বুঝতে চেয়েছেন? EasyImage.work-এ, আমরা একটি পরিশীলিত AI বিশ্লেষণ টুল তৈরি করেছি যা AI-জেনারেট করা ছবি থেকে সরাসরি বিস্তারিত প্রম্পট তথ্য বের করতে পারে। আজ, EasyImage.work-এ আমরা যেমন করেছি ঠিক তেমনি ছবির মেটাডেটা থেকে AI ছবির প্রম্পট বের করার প্রযুক্তিগত বাস্তবায়নের গভীরে যাই!

## AI প্রম্পট বের করার গুরুত্ব

AI-জেনারেট করা ছবিগুলি ক্রমবর্ধমানভাবে জনপ্রিয় হয়ে উঠেছে, এবং কীভাবে সেগুলি তৈরি করা হয়েছিল তা বোঝা বিভিন্ন কারণে মূল্যবান:

- **শিক্ষা এবং উন্নতি:** সফল প্রম্পটগুলি বিশ্লেষণ করে, আপনি শিখতে পারেন কী কাজ করে এবং আপনার নিজস্ব AI শিল্প জেনারেশন দক্ষতা উন্নত করতে পারেন।
- **পুনরুৎপাদন এবং বৈচিত্র্য:** প্রম্পট বের করা আপনাকে অনুরূপ ছবি পুনরায় তৈরি করতে বা সামান্য পরিবর্তন সহ বৈচিত্র্য তৈরি করতে দেয়।
- **ডকুমেন্টেশন এবং শেয়ারিং:** মূল প্রম্পট থাকা আপনার সৃজনশীল প্রক্রিয়া ডকুমেন্ট করতে এবং অন্যদের সাথে কৌশল শেয়ার করতে সাহায্য করে।
- **গুণমান মূল্যায়ন:** ব্যবহৃত প্যারামিটারগুলি বোঝা AI-জেনারেট করা শিল্পকর্মের গুণমান এবং জটিলতা মূল্যায়ন করতে সাহায্য করতে পারে।

তবে, এটি লক্ষ করা গুরুত্বপূর্ণ যে **শুধুমাত্র মূল AI-জেনারেট করা ছবিগুলি সফলভাবে প্রম্পট বের করতে পারে**। একবার একটি ছবি সম্পাদনা, রিসাইজ বা বিভিন্ন ফরম্যাটে রূপান্তরিত হলে, প্রম্পট তথ্য ধারণকারী মেটাডেটা হারিয়ে যেতে পারে বা ক্ষতিগ্রস্ত হতে পারে, যা বের করা অসম্ভব করে তোলে।

## EasyImage.work-এর AI বিশ্লেষণের পিছনের প্রযুক্তিগত অন্তর্দৃষ্টি

আপনি হয়তো কৌতূহলী হতে পারেন যে EasyImage.work কীভাবে ব্রাউজারে AI-জেনারেট করা ছবি থেকে সরাসরি বিস্তারিত প্রম্পট তথ্য বের করে। আজ, আমরা আমাদের AI বিশ্লেষণ কার্যকারিতা চালিত করে এমন মূল JavaScript কোড পরীক্ষা করে রহস্য প্রকাশ করব।

```js
// ফাইল থেকে AI তথ্য বের করুন
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // ফাইল টাইপের উপর ভিত্তি করে বিভিন্ন বের করার পদ্ধতি ব্যবহার করুন
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

    // চেক করুন যে টেক্সটে AI কীওয়ার্ড আছে কিনা
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

    // টেক্সট পরিষ্কার এবং ফরম্যাট করুন
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // AI তথ্য ফরম্যাট করুন
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

## PNG টেক্সট বের করা

PNG ছবিগুলির জন্য, AI টুলগুলি প্রায়শই ছবির ফাইলের মধ্যে টেক্সট চাঙ্কে প্রম্পট তথ্য সংরক্ষণ করে। এখানে আমরা কীভাবে এই ডেটা বের করি:

```js
// PNG টেক্সট বের করুন
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // PNG সিগনেচার এড়িয়ে যান

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

## JPEG টেক্সট বের করা

JPEG ছবিগুলির জন্য, AI মেটাডেটা সাধারণত APP1 সেগমেন্টে EXIF ডেটায় সংরক্ষিত থাকে:

```js
// JPEG টেক্সট বের করুন
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // SOI মার্কার এড়িয়ে যান

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // APP1 সেগমেন্ট
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

      // ছবির ডেটায় পৌঁছলে থামুন
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

## AI টেক্সট ফরম্যাটিং

একবার আমরা কাঁচা টেক্সট বের করলে, আমাদের এটিকে সঠিকভাবে ফরম্যাট করতে হবে যাতে এটি পড়ার যোগ্য এবং সংগঠিত হয়:

```js
// AI টেক্সট ফরম্যাট করুন
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // প্যারামিটার সেকশন খুঁজুন
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // কন্টেন্ট বিভক্ত করুন: প্রম্পট, নেগেটিভ প্রম্পট, প্যারামিটার
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // প্রম্পট সেকশন প্রক্রিয়া করুন
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // নেগেটিভ প্রম্পট সেকশন প্রক্রিয়া করুন
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

    // প্যারামিটার সেকশন প্রক্রিয়া করুন
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // প্যারামিটার লাইনগুলি বের করুন
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // কমা-বিচ্ছিন্ন প্যারামিটারগুলি লাইন-বিচ্ছিন্নে রূপান্তর করুন
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

## কোড ব্যাখ্যা

1. **ফাইল টাইপ সনাক্তকরণ:** কোডটি প্রথমে নির্ধারণ করে যে আপলোড করা ফাইলটি PNG নাকি JPEG ছবি, কারণ বিভিন্ন ফরম্যাট মেটাডেটা ভিন্নভাবে সংরক্ষণ করে।

2. **বাইনারি ডেটা প্রক্রিয়াকরণ:** ফাইলটি `Uint8Array`-এ রূপান্তরিত হয় কাঁচা বাইনারি ডেটা প্রক্রিয়া করতে এবং এমবেড করা টেক্সট তথ্য বের করতে।

3. **ফরম্যাট-নির্দিষ্ট বের করা:** 
   - PNG ফাইলগুলির জন্য, কোডটি `tEXt` এবং `iTXt` চাঙ্কগুলি খুঁজে যা টেক্সট মেটাডেটা ধারণ করে
   - JPEG ফাইলগুলির জন্য, এটি APP1 সেগমেন্টগুলি খুঁজে যা AI প্যারামিটার সহ EXIF ডেটা ধারণ করে

4. **AI কীওয়ার্ড সনাক্তকরণ:** বের করা টেক্সটটি "Steps:", "Sampler:", "CFG scale:", ইত্যাদি নির্দিষ্ট AI-সম্পর্কিত কীওয়ার্ডের জন্য বিশ্লেষণ করা হয়, এটি নিশ্চিত করতে যে এতে AI জেনারেশন প্যারামিটার রয়েছে।

5. **টেক্সট ফরম্যাটিং:** কাঁচা বের করা টেক্সটটি পরিষ্কার করা হয় এবং প্রম্পট, নেগেটিভ প্রম্পট এবং প্যারামিটারের জন্য স্পষ্ট বিভাগ সহ একটি পড়ার যোগ্য কাঠামোতে ফরম্যাট করা হয়।

6. **ফলাফল যাচাইকরণ:** শুধুমাত্র বৈধ AI মেটাডেটা ধারণকারী ফাইলগুলি প্রক্রিয়া করা হয় এবং ব্যবহারকারীকে দেখানো হয়।

## সফল বের করার জন্য গুরুত্বপূর্ণ প্রয়োজনীয়তা

**গুরুত্বপূর্ণ:** এই বের করার প্রক্রিয়াটি শুধুমাত্র **মূল AI-জেনারেট করা ছবিগুলির** সাথে কাজ করে। এখানে কেন:

- **মেটাডেটা সংরক্ষণ:** Stable Diffusion, Midjourney এবং DALL-E এর মতো AI টুলগুলি ছবি প্রথম জেনারেট করার সময় প্রম্পট তথ্য সরাসরি ছবির ফাইলের মেটাডেটায় এমবেড করে।

- **প্রক্রিয়াকরণের সময় ডেটা ক্ষতি:** যখন ছবিগুলি সম্পাদনা, রিসাইজ, বিভিন্ন ফরম্যাটে রূপান্তরিত বা ছবি সম্পাদনা সফ্টওয়্যার দিয়ে প্রক্রিয়া করা হয়, তখন প্রম্পট তথ্য ধারণকারী মেটাডেটা প্রায়শই সরানো হয় বা ক্ষতিগ্রস্ত হয়।

- **ফরম্যাট সীমাবদ্ধতা:** শুধুমাত্র PNG এবং JPEG ফরম্যাট সমর্থিত, কারণ এগুলি হল ফরম্যাটগুলি যা AI টুলগুলি সাধারণত মেটাডেটা সংরক্ষণ করতে ব্যবহার করে।

- **মূল উৎস প্রয়োজনীয়তা:** সোশ্যাল মিডিয়া থেকে ডাউনলোড করা, স্ক্রিনশট নেওয়া বা ওয়েব অ্যাপ্লিকেশন দিয়ে প্রক্রিয়া করা ছবিগুলি তাদের মূল মেটাডেটা হারাতে পারে।

## EasyImage.work-এর AI বিশ্লেষণের সুবিধা

এই কোডটি EasyImage.work-এর বিস্তৃত AI বিশ্লেষণ কার্যকারিতার শুধুমাত্র একটি উপাদান প্রতিনিধিত্ব করে। আমাদের ব্যবহারিক বাস্তবায়নে, আমরা অসংখ্য অপ্টিমাইজেশন এবং উন্নতি করেছি:

- **মাল্টি-ফরম্যাট সমর্থন:** EasyImage.work PNG এবং JPEG উভয় ফরম্যাট সমর্থন করে, সবচেয়ে সাধারণ AI-জেনারেট করা ছবির ধরনগুলি কভার করে।

- **বুদ্ধিমান সনাক্তকরণ:** আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে সনাক্ত করে যে একটি ছবিতে AI মেটাডেটা আছে কিনা এবং কোন তথ্য পাওয়া না গেলে স্পষ্ট প্রতিক্রিয়া প্রদান করে।

- **ব্যবহারকারী-বান্ধব ইন্টারফেস:** EasyImage.work দিয়ে, আপনার প্রযুক্তিগত বিবরণ বুঝতে হবে না। শুধু আপনার AI-জেনারেট করা ছবি আপলোড করুন এবং অবিলম্বে বের করা প্রম্পট এবং প্যারামিটারগুলি দেখুন।

- **এক্সপোর্ট কার্যকারিতা:** আপনি সহজেই বের করা প্রম্পটগুলি কপি করতে পারেন বা আরও বিশ্লেষণের জন্য সমস্ত ফলাফল JSON ফাইল হিসাবে এক্সপোর্ট করতে পারেন।

- **ব্যাচ প্রক্রিয়াকরণ:** একবারে একাধিক ছবি প্রক্রিয়া করুন AI-জেনারেট করা শিল্পকর্মের সম্পূর্ণ সংগ্রহ থেকে প্রম্পট বের করতে।

## উপসংহার

এই প্রযুক্তিগত গভীর ডাইভের মাধ্যমে, আপনি এখন বুঝতে পারেন কীভাবে জেনারেট করা ছবি থেকে AI ছবির প্রম্পট বের করতে হয়। এই প্রক্রিয়াটি AI টুলগুলি জেনারেশন প্রক্রিয়ার সময় এমবেড করে এমন ছবির মেটাডেটা সাবধানে পার্স করার উপর নির্ভর করে।

**মনে রাখুন:** সফল প্রম্পট বের করার চাবিকাঠি হল **মূল, অপরিবর্তিত AI-জেনারেট করা ছবি** ব্যবহার করা। একবার একটি ছবি প্রক্রিয়া, সম্পাদনা বা রূপান্তরিত হলে, মূল্যবান প্রম্পট তথ্য স্থায়ীভাবে হারিয়ে যেতে পারে।

আপনার জেনারেট করা ছবি থেকে AI প্রম্পট বের করার জন্য যদি আপনার একটি সহজ, দক্ষ এবং শক্তিশালী টুল প্রয়োজন হয়, তাহলে [EasyImage.work](https://easyimage.work) মনে রাখবেন! আমরা আপনার প্রিয় AI-জেনারেট করা শিল্পকর্মের পিছনের রহস্য উন্মোচন করতে সাহায্য করে আরও সুবিধাজনক এবং ব্যবহারিক AI বিশ্লেষণ বৈশিষ্ট্য আনতে কঠোর পরিশ্রম চালিয়ে যাব!
