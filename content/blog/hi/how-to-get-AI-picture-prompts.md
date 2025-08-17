---
date: 2025-03-16
title: EasyImage.work के साथ जनरेट की गई छवियों से AI पिक्चर प्रॉम्प्ट्स कैसे निकालें
---

क्या आपने कभी सोचा है कि AI-जनरेट की गई छवि से मूल प्रॉम्प्ट्स और पैरामीटर्स कैसे निकालें? या उस आकर्षक कलाकृति को बनाने में उपयोग की गई सटीक सेटिंग्स को समझना चाहते हैं? EasyImage.work पर, हमने एक परिष्कृत AI विश्लेषण टूल विकसित किया है जो AI-जनरेट की गई छवियों से सीधे विस्तृत प्रॉम्प्ट जानकारी निकाल सकता है। आज, आइए छवि मेटाडेटा से AI पिक्चर प्रॉम्प्ट्स निकालने के तकनीकी कार्यान्वयन में गहराई से जाएं, बिल्कुल वैसे ही जैसे हमने EasyImage.work पर किया है!

## AI प्रॉम्प्ट निष्कर्षण का महत्व

AI-जनरेट की गई छवियां तेजी से लोकप्रिय हो रही हैं, और यह समझना कि वे कैसे बनाई गईं, कई कारणों से मूल्यवान है:

- **सीखना और सुधार:** सफल प्रॉम्प्ट्स का विश्लेषण करके, आप सीख सकते हैं कि क्या काम करता है और अपने स्वयं के AI कला जनरेशन कौशल में सुधार कर सकते हैं।
- **पुनरुत्पादन और विविधता:** प्रॉम्प्ट्स निकालने से आप समान छवियों को पुनः बना सकते हैं या थोड़े संशोधनों के साथ विविधताएं बना सकते हैं।
- **दस्तावेजीकरण और साझाकरण:** मूल प्रॉम्प्ट्स होने से आपकी रचनात्मक प्रक्रिया का दस्तावेजीकरण करने और दूसरों के साथ तकनीकों को साझा करने में मदद मिलती है।
- **गुणवत्ता मूल्यांकन:** उपयोग किए गए पैरामीटर्स को समझने से AI-जनरेट की गई कलाकृति की गुणवत्ता और जटिलता का मूल्यांकन करने में मदद मिल सकती है।

हालांकि, यह ध्यान रखना महत्वपूर्ण है कि **केवल मूल AI-जनरेट की गई छवियां ही प्रॉम्प्ट्स को सफलतापूर्वक निकाल सकती हैं**। एक बार जब किसी छवि को संपादित, रीसाइज़ या विभिन्न प्रारूपों में परिवर्तित किया जाता है, तो प्रॉम्प्ट जानकारी वाले मेटाडेटा खो सकते हैं या भ्रष्ट हो सकते हैं, जिससे निष्कर्षण असंभव हो जाता है।

## EasyImage.work के AI विश्लेषण के पीछे तकनीकी अंतर्दृष्टि

आपको जिज्ञासा हो सकती है कि EasyImage.work ब्राउज़र में AI-जनरेट की गई छवियों से सीधे विस्तृत प्रॉम्प्ट जानकारी कैसे निकालता है। आज, हम हमारी AI विश्लेषण कार्यक्षमता को संचालित करने वाले मुख्य JavaScript कोड की जांच करके रहस्य को प्रकट करेंगे।

```js
// फ़ाइल से AI जानकारी निकालें
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // फ़ाइल प्रकार के आधार पर विभिन्न निष्कर्षण विधियों का उपयोग करें
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

    // जांचें कि क्या टेक्स्ट में AI कीवर्ड्स हैं
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

    // टेक्स्ट को साफ़ और फॉर्मेट करें
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // AI जानकारी को फॉर्मेट करें
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

## PNG टेक्स्ट निष्कर्षण

PNG छवियों के लिए, AI टूल्स अक्सर छवि फ़ाइल के भीतर टेक्स्ट चंक्स में प्रॉम्प्ट जानकारी संग्रहीत करते हैं। यहाँ हम इस डेटा को कैसे निकालते हैं:

```js
// PNG टेक्स्ट निकालें
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // PNG सिग्नेचर को छोड़ें

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

## JPEG टेक्स्ट निष्कर्षण

JPEG छवियों के लिए, AI मेटाडेटा आमतौर पर APP1 सेगमेंट्स के भीतर EXIF डेटा में संग्रहीत होता है:

```js
// JPEG टेक्स्ट निकालें
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // SOI मार्कर को छोड़ें

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // APP1 सेगमेंट
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

      // छवि डेटा तक पहुंचने पर रुकें
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

## AI टेक्स्ट फॉर्मेटिंग

एक बार जब हम कच्चा टेक्स्ट निकाल लेते हैं, तो हमें इसे पठनीय और संगठित बनाने के लिए सही तरीके से फॉर्मेट करने की आवश्यकता होती है:

```js
// AI टेक्स्ट को फॉर्मेट करें
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // पैरामीटर्स सेक्शन की तलाश करें
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // सामग्री को विभाजित करें: प्रॉम्प्ट, नेगेटिव प्रॉम्प्ट, पैरामीटर्स
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // प्रॉम्प्ट सेक्शन को प्रोसेस करें
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // नेगेटिव प्रॉम्प्ट सेक्शन को प्रोसेस करें
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

    // पैरामीटर्स सेक्शन को प्रोसेस करें
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // पैरामीटर लाइन्स निकालें
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // कॉमा-सेपरेटेड पैरामीटर्स को लाइन-सेपरेटेड में बदलें
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

## कोड स्पष्टीकरण

1. **फ़ाइल टाइप डिटेक्शन:** कोड पहले निर्धारित करता है कि अपलोड की गई फ़ाइल PNG या JPEG छवि है या नहीं, क्योंकि विभिन्न प्रारूप मेटाडेटा को अलग तरीके से संग्रहीत करते हैं।

2. **बाइनरी डेटा प्रोसेसिंग:** फ़ाइल को कच्चे बाइनरी डेटा को प्रोसेस करने और एम्बेडेड टेक्स्ट जानकारी निकालने के लिए `Uint8Array` में परिवर्तित किया जाता है।

3. **प्रारूप-विशिष्ट निष्कर्षण:** 
   - PNG फ़ाइलों के लिए, कोड `tEXt` और `iTXt` चंक्स की खोज करता है जो टेक्स्ट मेटाडेटा रखते हैं
   - JPEG फ़ाइलों के लिए, यह APP1 सेगमेंट्स की खोज करता है जो AI पैरामीटर्स के साथ EXIF डेटा रखते हैं

4. **AI कीवर्ड डिटेक्शन:** निकाले गए टेक्स्ट का विश्लेषण "Steps:", "Sampler:", "CFG scale:", आदि जैसे विशिष्ट AI-संबंधित कीवर्ड्स के लिए किया जाता है, यह पुष्टि करने के लिए कि इसमें AI जनरेशन पैरामीटर्स हैं।

5. **टेक्स्ट फॉर्मेटिंग:** कच्चे निकाले गए टेक्स्ट को साफ़ किया जाता है और प्रॉम्प्ट, नेगेटिव प्रॉम्प्ट और पैरामीटर्स के लिए स्पष्ट सेक्शन्स के साथ पठनीय संरचना में फॉर्मेट किया जाता है।

6. **परिणाम वैधीकरण:** केवल वैध AI मेटाडेटा वाली फ़ाइलें ही प्रोसेस की जाती हैं और उपयोगकर्ता को दिखाई जाती हैं।

## सफल निष्कर्षण के लिए महत्वपूर्ण आवश्यकताएं

**महत्वपूर्ण:** यह निष्कर्षण प्रक्रिया केवल **मूल AI-जनरेट की गई छवियों** के साथ काम करती है। यहाँ क्यों:

- **मेटाडेटा संरक्षण:** Stable Diffusion, Midjourney और DALL-E जैसे AI टूल्स छवि पहली बार जनरेट होने पर प्रॉम्प्ट जानकारी को सीधे छवि फ़ाइल के मेटाडेटा में एम्बेड करते हैं।

- **प्रोसेसिंग के दौरान डेटा हानि:** जब छवियों को संपादित, रीसाइज़, विभिन्न प्रारूपों में परिवर्तित या छवि संपादन सॉफ्टवेयर के माध्यम से प्रोसेस किया जाता है, तो प्रॉम्प्ट जानकारी वाले मेटाडेटा अक्सर हटा दिए जाते हैं या भ्रष्ट हो जाते हैं।

- **प्रारूप सीमाएं:** केवल PNG और JPEG प्रारूप समर्थित हैं, क्योंकि ये वे प्रारूप हैं जो AI टूल्स आमतौर पर मेटाडेटा संग्रहीत करने के लिए उपयोग करते हैं।

- **मूल स्रोत आवश्यकता:** सोशल मीडिया से डाउनलोड की गई, स्क्रीनशॉट ली गई या वेब अनुप्रयोगों के माध्यम से प्रोसेस की गई छवियां अपना मूल मेटाडेटा खो सकती हैं।

## EasyImage.work के AI विश्लेषण के लाभ

यह कोड EasyImage.work की व्यापक AI विश्लेषण कार्यक्षमता का केवल एक घटक है। हमारे व्यावहारिक कार्यान्वयन में, हमने कई अनुकूलन और सुधार किए हैं:

- **मल्टी-फॉर्मेट समर्थन:** EasyImage.work PNG और JPEG दोनों प्रारूपों का समर्थन करता है, सबसे सामान्य AI-जनरेट की गई छवि प्रकारों को कवर करता है।

- **बुद्धिमान डिटेक्शन:** हमारी प्रणाली स्वचालित रूप से पता लगाती है कि क्या किसी छवि में AI मेटाडेटा है और जब कोई जानकारी नहीं मिलती है तो स्पष्ट प्रतिक्रिया प्रदान करती है।

- **उपयोगकर्ता-अनुकूल इंटरफेस:** EasyImage.work के साथ, आपको तकनीकी विवरण समझने की आवश्यकता नहीं है। बस अपनी AI-जनरेट की गई छवि अपलोड करें और तुरंत निकाले गए प्रॉम्प्ट्स और पैरामीटर्स देखें।

- **एक्सपोर्ट कार्यक्षमता:** आप आसानी से निकाले गए प्रॉम्प्ट्स को कॉपी कर सकते हैं या आगे के विश्लेषण के लिए सभी परिणामों को JSON फ़ाइलों के रूप में एक्सपोर्ट कर सकते हैं।

- **बैच प्रोसेसिंग:** एक साथ कई छवियों को प्रोसेस करें AI-जनरेट की गई कलाकृति के पूरे संग्रह से प्रॉम्प्ट्स निकालने के लिए।

## निष्कर्ष

इस तकनीकी गहरी डाइव के माध्यम से, अब आप समझते हैं कि जनरेट की गई छवियों से AI पिक्चर प्रॉम्प्ट्स कैसे निकालें। यह प्रक्रिया छवि मेटाडेटा को सावधानीपूर्वक पार्स करने पर निर्भर करती है जो AI टूल्स जनरेशन प्रक्रिया के दौरान एम्बेड करते हैं।

**याद रखें:** सफल प्रॉम्प्ट निष्कर्षण की कुंजी **मूल, अपरिवर्तित AI-जनरेट की गई छवियों** का उपयोग करना है। एक बार जब किसी छवि को प्रोसेस, संपादित या परिवर्तित किया जाता है, तो मूल्यवान प्रॉम्प्ट जानकारी स्थायी रूप से खो सकती है।

यदि आपको अपनी जनरेट की गई छवियों से AI प्रॉम्प्ट्स निकालने के लिए एक सरल, कुशल और शक्तिशाली टूल की आवश्यकता है, तो [EasyImage.work](https://easyimage.work) याद रखें! हम आपकी पसंदीदा AI-जनरेट की गई कलाकृति के पीछे के रहस्यों को अनलॉक करने में मदद करते हुए अधिक सुविधाजनक और व्यावहारिक AI विश्लेषण सुविधाएं लाने के लिए कड़ी मेहनत जारी रखेंगे!
