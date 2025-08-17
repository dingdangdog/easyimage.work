---
date: 2025-03-16
title: EasyImage.workで生成された画像からAI画像プロンプトを抽出する方法
---

AI生成画像から元のプロンプトやパラメータを抽出する方法について考えたことはありますか？または、その素晴らしいアートワークを作成するために使用された正確な設定を理解したいと思ったことはありますか？EasyImage.workでは、AI生成画像から直接詳細なプロンプト情報を抽出できる高度なAI分析ツールを開発しました。今日は、EasyImage.workで行ったように、画像メタデータからAI画像プロンプトを抽出する技術的実装について深く掘り下げてみましょう！

## AIプロンプト抽出の重要性

AI生成画像はますます人気が高まっており、それらがどのように作成されたかを理解することは、いくつかの理由で価値があります：

- **学習と改善：** 成功したプロンプトを分析することで、何が効果的かを学び、独自のAIアート生成スキルを向上させることができます。
- **再現とバリエーション：** プロンプトを抽出することで、類似の画像を再作成したり、わずかな修正でバリエーションを作成したりできます。
- **ドキュメント化と共有：** 元のプロンプトを持つことで、創造的プロセスを文書化し、他の人とテクニックを共有するのに役立ちます。
- **品質評価：** 使用されたパラメータを理解することで、AI生成アートワークの品質と複雑さを評価するのに役立ちます。

ただし、**元のAI生成画像のみがプロンプトを正常に抽出できる**ことに注意することが重要です。画像が編集、リサイズ、または異なる形式に変換されると、プロンプト情報を含むメタデータが失われたり破損したりして、抽出が不可能になる可能性があります。

## EasyImage.workのAI分析の背後にある技術的洞察

EasyImage.workがブラウザでAI生成画像から直接詳細なプロンプト情報を抽出する方法について興味があるかもしれません。今日は、AI分析機能を支えるコアJavaScriptコードを調べて、その秘密を明かします。

```js
// ファイルからAI情報を抽出
const extractAIInfoFromFile = async (file: File): Promise<AIInfo | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let extractedText = "";

    // ファイルタイプに基づいて異なる抽出方法を使用
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

    // テキストにAIキーワードが含まれているかチェック
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

    // テキストをクリーンアップしてフォーマット
    const cleanText = extractedText
      .replace(/\0/g, "")
      .replace(/\r/g, "")
      .trim();

    // AI情報をフォーマット
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

## PNGテキスト抽出

PNG画像の場合、AIツールは画像ファイル内のテキストチャンクにプロンプト情報を保存することがよくあります。以下がこのデータを抽出する方法です：

```js
// PNGテキストを抽出
const extractPNGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 8; // PNGシグネチャをスキップ

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

## JPEGテキスト抽出

JPEG画像の場合、AIメタデータは通常APP1セグメント内のEXIFデータに保存されます：

```js
// JPEGテキストを抽出
const extractJPEGText = (uint8Array: Uint8Array): string => {
  try {
    let text = "";
    let offset = 2; // SOIマーカーをスキップ

    while (offset < uint8Array.length - 4) {
      const marker = (uint8Array[offset] << 8) | uint8Array[offset + 1];

      if (marker === 0xffe1) {
        // APP1セグメント
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

      // 画像データに到達したら停止
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

## AIテキストフォーマット

生のテキストを抽出したら、読みやすく整理されたものにするために適切にフォーマットする必要があります：

```js
// AIテキストをフォーマット
const formatAIText = (rawText: string): string => {
  let formattedText = "";

  // パラメータセクションを探す
  const paramMatch = rawText.match(/parameters[:\s]*(.*)/is);
  if (paramMatch && paramMatch[1]) {
    const fullContent = paramMatch[1].trim();

    // コンテンツを分割：プロンプト、ネガティブプロンプト、パラメータ
    const sections = fullContent.split(/(?=Negative prompt:|Steps:)/);

    // プロンプトセクションを処理
    if (sections[0]) {
      const promptText = sections[0].replace(/\n+/g, " ").trim();

      if (
        promptText &&
        !promptText.toLowerCase().startsWith("negative prompt")
      ) {
        formattedText += `Prompt:\n${promptText}\n\n`;
      }
    }

    // ネガティブプロンプトセクションを処理
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

    // パラメータセクションを処理
    const paramSection = sections.find((s) => s.includes("Steps:"));
    if (paramSection) {
      formattedText += "Parameters:\n";

      // パラメータ行を抽出
      const paramText = paramSection.replace(/^.*?(Steps:)/s, "Steps:");

      // カンマ区切りのパラメータを行区切りに変換
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

## コードの説明

1. **ファイルタイプ検出：** コードは最初に、アップロードされたファイルがPNGまたはJPEG画像かどうかを判断します。異なる形式はメタデータを異なる方法で保存するためです。

2. **バイナリデータ処理：** ファイルは生のバイナリデータを処理し、埋め込まれたテキスト情報を抽出するために`Uint8Array`に変換されます。

3. **形式固有の抽出：** 
   - PNGファイルの場合、コードはテキストメタデータを含む`tEXt`および`iTXt`チャンクを検索します
   - JPEGファイルの場合、AIパラメータを含むEXIFデータを含むAPP1セグメントを探します

4. **AIキーワード検出：** 抽出されたテキストは、"Steps:"、"Sampler:"、"CFG scale:"などの特定のAI関連キーワードについて分析され、AI生成パラメータが含まれていることを確認します。

5. **テキストフォーマット：** 生の抽出されたテキストはクリーンアップされ、プロンプト、ネガティブプロンプト、パラメータの明確なセクションを持つ読みやすい構造にフォーマットされます。

6. **結果検証：** 有効なAIメタデータを含むファイルのみが処理され、ユーザーに表示されます。

## 成功した抽出のための重要な要件

**重要：** この抽出プロセスは**元のAI生成画像**でのみ機能します。理由は以下の通りです：

- **メタデータ保存：** Stable Diffusion、Midjourney、DALL-EなどのAIツールは、画像が最初に生成されるときにプロンプト情報を画像ファイルのメタデータに直接埋め込みます。

- **処理中のデータ損失：** 画像が編集、リサイズ、異なる形式に変換、または画像編集ソフトウェアで処理されると、プロンプト情報を含むメタデータがしばしば削除または破損します。

- **形式制限：** PNGとJPEG形式のみがサポートされています。これらはAIツールが通常メタデータを保存するために使用する形式だからです。

- **元のソース要件：** ソーシャルメディアからダウンロードされた、スクリーンショットが撮られた、またはWebアプリケーションで処理された画像は、元のメタデータを失う可能性があります。

## EasyImage.workのAI分析の利点

このコードは、EasyImage.workの包括的なAI分析機能の1つのコンポーネントのみを表しています。実際の実装では、多くの最適化と強化を行いました：

- **マルチ形式サポート：** EasyImage.workはPNGとJPEGの両方の形式をサポートし、最も一般的なAI生成画像タイプをカバーしています。

- **インテリジェント検出：** システムは自動的に画像にAIメタデータが含まれているかどうかを検出し、情報が見つからない場合は明確なフィードバックを提供します。

- **ユーザーフレンドリーなインターフェース：** EasyImage.workでは、技術的な詳細を理解する必要はありません。AI生成画像をアップロードするだけで、抽出されたプロンプトとパラメータを即座に確認できます。

- **エクスポート機能：** 抽出されたプロンプトを簡単にコピーしたり、さらなる分析のためにすべての結果をJSONファイルとしてエクスポートしたりできます。

- **バッチ処理：** 一度に複数の画像を処理して、AI生成アートワークのコレクション全体からプロンプトを抽出できます。

## 結論

この技術的な深い掘り下げを通じて、生成された画像からAI画像プロンプトを抽出する方法を理解しました。このプロセスは、AIツールが生成プロセス中に埋め込む画像メタデータを慎重に解析することに依存しています。

**覚えておいてください：** 成功したプロンプト抽出の鍵は、**元の、変更されていないAI生成画像**を使用することです。画像が処理、編集、または変換されると、貴重なプロンプト情報が永続的に失われる可能性があります。

生成された画像からAIプロンプトを抽出するためのシンプルで効率的で強力なツールが必要な場合は、[EasyImage.work](https://easyimage.work)を覚えておいてください！お気に入りのAI生成アートワークの背後にある秘密を解き放つのを助けながら、より便利で実用的なAI分析機能を提供するために、引き続き懸命に取り組みます！
