---
date: 2025-03-09
title: JavaScriptを使用してファイルを圧縮パッケージ（.zip）にする方法
---

# JavaScriptを使用してファイルを圧縮パッケージ（.zip）にする方法

現代のWeb開発では、ファイルの圧縮は一般的な要件です。ユーザーは複数のファイルを圧縮パッケージにまとめてダウンロードしたり、Webアプリケーションを通じてファイルを生成し、`.zip`ファイルとしてエクスポートしたりする必要があるかもしれません。このブログ記事では、ブラウザでJavaScriptを使用してファイルのパッケージ化と圧縮操作を実装する方法について詳しく説明します。人気のJavaScriptライブラリであるJSZipを使用してこの作業を行い、FileSaver.jsを活用してファイルのダウンロードを実現します。

## 準備

まず、よく使われる2つのライブラリをインストールする必要があります：

1. JSZip：これは`.zip`ファイルの作成と処理に使用される軽量のJavaScriptライブラリです。
2. FileSaver.js：このライブラリは、ブラウザのファイルダウンロードをトリガーするためのクロスブラウザの方法を提供します。

これらのライブラリをプロジェクトにインストールするには：

```bash
npm install jszip file-saver
```

またはCDNを介して含める（HTMLで使用する場合）：

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## ユーティリティ関数の実装

次に、複数のファイルを`.zip`ファイルにパッケージ化してダウンロードをトリガーするカプセル化されたユーティリティ関数を作成します。一連の画像をパッケージ化したいとしましょう。これらは元のファイルでも、処理後のファイルでもかまいません。

### 汎用的な`downloadFilesAsZip`関数

```js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * 複数のファイルをZipファイルとしてパッケージ化してダウンロードする
 * @param {Array} files - ファイルオブジェクトの配列、各オブジェクトにはURLとファイル名が含まれる
 * @param {string} zipName - 生成されるZipファイルの名前、デフォルトは'download.zip'
 */
export const downloadFilesAsZip = async (files, zipName = "download.zip") => {
  // 新しいJSZipインスタンスを作成
  const zip = new JSZip();

  // mapを使用して各ファイルを処理するPromiseの配列を作成
  const fetchPromises = files.map(async (file) => {
    try {
      // ファイルリソースをリクエスト、ファイルはURLを介して提供されると仮定
      const response = await fetch(file.url); // ファイルリソースを取得
      const blob = await response.blob(); // レスポンスをBlobオブジェクトに変換

      // 提供されたファイル名を使用して、ファイルをzipパッケージに追加
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`ファイルの追加に失敗しました: ${file.name}`, error);
    }
  });

  // すべてのファイルがダウンロードされ、Zipに追加されるのを待つ
  await Promise.all(fetchPromises);

  // zipパッケージのコンテンツを生成（blobタイプ）
  const content = await zip.generateAsync({ type: "blob" });

  // FileSaver.jsを使用してzipパッケージをダウンロード
  saveAs(content, zipName);
};
```

### コードの説明

- `JSZip`インスタンスの作成：`const zip = new JSZip();` — 新しいZipファイルインスタンスを作成し、すべてのファイルがこのインスタンスに追加されます。
- ファイルのダウンロードとパッケージ化：`fetch()`関数を使用してURLからファイルのコンテンツを取得し、それを`blob`形式に変換します。これは、`JSZip`が`blob`形式でファイルを処理できるためです。
- `.zip`ファイルの生成：`zip.generateAsync({ type: "blob" })`を通じて、`zip`オブジェクトに追加されたすべてのファイルを`.zip`ファイルに圧縮し、`blob`オブジェクトを返します。
- ファイルの保存：FileSaver.jsを使用して`saveAs(content, zipName)`でファイルダウンロードをトリガーします。ここで`content`は生成されたzipパッケージ、`zipName`はダウンロードファイル名です。

## このユーティリティ関数の使用方法

画像URLのセットがあり、それらを`.zip`ファイルにパッケージ化してダウンロードしたいとします。以下は`downloadFilesAsZip`関数を呼び出す例です：

```js
// サンプルファイルデータ：ファイルURLとファイル名を含む
const files = [
  { url: "https://example.com/image1.jpg", name: "image1.jpg" },
  { url: "https://example.com/image2.jpg", name: "image2.jpg" },
  { url: "https://example.com/image3.jpg", name: "image3.jpg" },
];

// 関数を呼び出してファイルをダウンロードし、zipファイルとしてパッケージ化
downloadFilesAsZip(files, "images.zip");
```

この例では、画像URLとファイル名を含むオブジェクトの配列を提供しています。`downloadFilesAsZip`関数を呼び出した後、ブラウザは自動的にダウンロード操作をトリガーし、これらの画像を`images.zip`という名前の圧縮ファイルにパッケージ化します。

## 一般的な問題と解決策

1. クロスオリジンの問題
   ファイルが異なるドメインから来る場合、サーバーが正しいクロスオリジンリソース共有（CORS）ヘッダーを設定していることを確認してください。そうでなければ、ブラウザは`fetch()`リクエストをブロックし、ファイルのダウンロードができなくなります。
2. 大きなファイルのダウンロード
   ダウンロードするファイルが大きい場合、チャンクダウンロードやプログレスバーの表示など、ダウンロードプロセスを最適化する必要があるかもしれません。
3. ブラウザのサポート
   この方法は`fetch()`とFileSaver.jsに依存しているため、これらのAPIをサポートする最新のブラウザが必要です。古いブラウザをサポートする必要がある場合は、ポリフィルの使用を検討してください。

## 代替ソリューション

`JSZip`とFileSaver.jsを使用する以外にも、ブラウザでファイル圧縮とパッケージ化を実装するためのいくつかの一般的なソリューションがあります：

1. **Pako.js**：`Pako`はJavaScript用のzlib圧縮ライブラリで、gzipとdeflate形式をサポートしています。小さなファイルの圧縮に適しており、比較的使いやすいです。
2. **Archiver.js**：`Archiver.js`は機能豊富なライブラリで、`.tar`や`.zip`などの形式への圧縮をサポートしています。ブラウザでファイル圧縮を実行でき、より多くの制御オプションを提供します。
3. **zip.js**：`zip.js`はストリーミング解凍と圧縮をサポートするJavaScriptライブラリで、より大きなファイルを処理でき、`.zip`ファイルへの圧縮機能を提供します。
4. **BrowserFS + zip-lib**：`BrowserFS`はブラウザでファイルシステムシミュレーションを提供するライブラリです。`zip-lib`と組み合わせることで、`.zip`ファイルを作成してダウンロードでき、ファイルシステムをシミュレートする必要があるアプリケーションに適しています。
