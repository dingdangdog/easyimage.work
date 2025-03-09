---
date: 2025-03-09
title: How to use JavaScript to package files into a compressed package (.zip)
---

# How to use JavaScript to package files into a compressed package (.zip)

In modern web development, compressing files is a common requirement. Users may need to combine multiple files into a compressed package for download, or generate files through a web application and export them as a `.zip` file. This blog post will provide a detailed guide on how to implement file packaging and compression operations in the browser using JavaScript. We will accomplish this by using the popular JavaScript library JSZip and leveraging FileSaver.js for file downloads.

## Preparation

First, we need to install two commonly used libraries:

1. JSZip: This is a lightweight JavaScript library used for creating and handling `.zip` files.
2. FileSaver.js: This library provides a cross-browser way to trigger browser file downloads.

You can install these libraries in your project using:

```bash
npm install jszip file-saver
```

Or include them via CDN (for use in HTML):

```html
<script src="https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

## Utility Function Implementation

Next, we'll write an encapsulated utility function to package multiple files into a `.zip` file and trigger a download. Let's say we want to package a series of images, which can be either original files or processed files.

### Generic `downloadFilesAsZip` Function

```js
import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * Download multiple files packaged as a Zip file
 * @param {Array} files - Array of file objects, each containing a URL and filename
 * @param {string} zipName - Name of the generated Zip file, defaults to 'download.zip'
 */
export const downloadFilesAsZip = async (files, zipName = "download.zip") => {
  // Create a new JSZip instance
  const zip = new JSZip();

  // Use map to create an array of Promises to process each file
  const fetchPromises = files.map(async (file) => {
    try {
      // Request the file resource, assuming the file is provided via URL
      const response = await fetch(file.url); // Get the file resource
      const blob = await response.blob(); // Convert the response to a Blob object

      // Add the file to the zip package, using the provided filename
      zip.file(file.name, blob);
    } catch (error) {
      console.error(`Failed to add file: ${file.name}`, error);
    }
  });

  // Wait for all files to be downloaded and added to the Zip
  await Promise.all(fetchPromises);

  // Generate the zip package content (blob type)
  const content = await zip.generateAsync({ type: "blob" });

  // Use FileSaver.js to download the zip package
  saveAs(content, zipName);
};
```

### Code Explanation

- Creating a `JSZip` instance: `const zip = new JSZip();` — Creates a new Zip file instance, all files will be added to this instance.
- File download and packaging: Uses the `fetch()` function to get the content of the file from the URL, then converts it to a `blob` format. This is because `JSZip` supports processing files in `blob` format.
- Generating the `.zip` file: Through `zip.generateAsync({ type: "blob" })`, all files added to the `zip` object are compressed into a `.zip` file, returning a `blob` object.
- Saving the file: Using `saveAs(content, zipName)` with FileSaver.js to trigger the file download, where `content` is the generated zip package and `zipName` is the download filename.

## How to Use This Utility Function

Suppose we have a set of image URLs and want to package them into a `.zip` file for download. Here's an example of how to call the `downloadFilesAsZip` function:

```js
// Example file data: contains file URL and filename
const files = [
  { url: "https://example.com/image1.jpg", name: "image1.jpg" },
  { url: "https://example.com/image2.jpg", name: "image2.jpg" },
  { url: "https://example.com/image3.jpg", name: "image3.jpg" },
];

// Call the function to download files and package as a zip file
downloadFilesAsZip(files, "images.zip");
```

In this example, we provide an array of objects containing image URLs and filenames. After calling the `downloadFilesAsZip` function, the browser will automatically trigger a download operation and package these images into a compressed file named `images.zip`.

## Common Issues and Solutions

1. Cross-Origin Issues
   If files come from different domains, ensure the server has set the correct Cross-Origin Resource Sharing (CORS) headers. Otherwise, the browser will block `fetch()` requests, preventing file downloads.
2. Large File Downloads
   If the files being downloaded are large, you may need to optimize the download process, such as implementing chunked downloads or displaying progress bars.
3. Browser Support
   This method relies on `fetch()` and `FileSaver.js`, so it requires modern browsers that support these APIs. If you need to support older browsers, consider using polyfills.

## Alternative Solutions

Besides using `JSZip` and `FileSaver.js`, there are several other common solutions for implementing file compression and packaging in the browser:

1. **Pako.js**: `Pako` is a zlib compression library for JavaScript, supporting gzip and deflate formats. It's suitable for compressing smaller files and is relatively simple to use.
2. **Archiver.js**: `Archiver.js` is a feature-rich library that supports compression to formats like `.tar`, `.zip`, etc. It can perform file compression in the browser and provides more control options.
3. **zip.js**: `zip.js` is a JavaScript library that supports streaming decompression and compression, capable of handling larger files and providing functionality to compress to `.zip` files.
4. **BrowserFS + zip-lib**: `BrowserFS` is a library that provides file system simulation in the browser. Combined with `zip-lib`, it can create and download `.zip` files, suitable for applications that need to simulate a file system.
