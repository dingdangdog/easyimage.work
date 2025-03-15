---
date: 2025-03-16
title: Web端で画像縮小機能を実装する方法
---

ウェブサイトに大きすぎる画像をアップロードして読み込みが遅くなることにお悩みではありませんか？あるいは、異なる表示シナリオ用に異なるサイズの画像が必要ですか？EasyImage.workでは、画像処理の重要性を深く理解しており、シンプルで効率的なオンライン画像処理ツールを提供することに専念しています。今日は、EasyImage.workで実現しているように、Web上で簡単に画像スケーリング機能を実装する方法について、技術的な視点から詳しく見ていきましょう！

## 画像スケーリングの必要性

インターネットアプリケーションでは、画像はどこにでも存在します。しかし、異なるシナリオでは画像サイズに対する要件が異なります：

- **ウェブサイトの読み込み最適化：** 大きなサイズの画像はページの読み込みを遅くし、ユーザー体験に影響を与えます。
- **レスポンシブデザイン：** デバイスによって画面サイズが異なるため、適切な表示のために異なる画像サイズが必要です。
- **サムネイル表示：** リストやプレビューのシナリオでは、スペースと帯域幅を節約するために小さなサムネイルが必要です。

したがって、Web上で効率的な画像スケーリング機能を実装することは非常に重要です。

## EasyImage.workの背後にある技術的洞察

EasyImage.workがブラウザ上で様々なサイズのサムネイルやスケーリングされた画像を素早く生成する方法について興味があるかもしれません。今日は、核となるJavaScriptコードの例を見ながら、その秘密を明らかにします。

```js
// 画像処理
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

      // 幅または高さが64未満になるまで2の累乗で縮小
      while (width >= 64 && height >= 64) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) break;

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(mimeType);

        // サムネイル生成
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

## コードの説明

1. **画像ファイルの読み込み：** コードはまず`FileReader`を使用してユーザーがアップロードした画像ファイルを読み込み、Data URLに変換します。
2. **Imageオブジェクトの作成：** 次に、`Image`オブジェクトを使用して画像を読み込み、元のサイズ（`naturalWidth`と`naturalHeight`）を取得します。
3. **スケーリングループ：** 核心部分は`while`ループで、幅または高さが64ピクセル未満になるまで、2の累乗で画像サイズを徐々に縮小します。
4. **Canvas描画：** 各反復で、`canvas`要素が作成され、スケーリングされた画像がそこに描画されます。`canvas`の`toDataURL()`メソッドはその内容をData URLに変換し、画像データを取得します。
5. **サムネイル生成：** より小さなプレビュー画像を提供するために、コードはサムネイルも生成します。新しい`canvas`要素（`thumbCanvas`）を作成し、プリセットされた最大幅と高さ（`maxWidth`と`maxHeight`）に基づいて画像を比例的にスケーリングします。
6. **結果の保存：** 処理された画像データ（スケーリングされた元の画像とサムネイル）は、後で使用するために配列（`processedImages`）に保存されます。

## EasyImage.workの利点

このコードはEasyImage.workの画像スケーリング機能の中核的なロジックコンポーネントの一つに過ぎません。実際のアプリケーションでは、以下のような多くの最適化と拡張を行っています：

- **複数の画像フォーマットのサポート：** EasyImage.workはJPEGやPNGなどの一般的なフォーマットだけでなく、GIFなどもサポートしています。
- **より柔軟なスケーリング戦略：** 2の累乗でのスケーリングに加えて、カスタムサイズや比例スケーリングなど、さまざまなニーズに対応するオプションを提供しています。
- **より良いパフォーマンス：** ブラウザでも高速かつ効率的な画像処理を確保するために、コードを深く最適化しています。
- **クリーンでユーザーフレンドリーなインターフェース：** EasyImage.workでは、コードを書く必要はありません。画像をアップロードし、希望するスケーリングサイズを選択するだけで、簡単に操作を完了できます。

## 結論

この紹介を通じて、Web上での画像スケーリング機能の実装方法についてより良く理解できたはずです。これは氷山の一角に過ぎませんが、EasyImage.workの画像処理技術における専門性を示しています。

シンプルで効率的、そして強力なオンライン画像処理ツールが必要な場合は、[EasyImage.work](https://easyimage.work)を覚えておいてください！私たちは、より便利で実用的な画像処理機能を提供し続け、あなたの画像がWeb世界で輝くお手伝いをします！
