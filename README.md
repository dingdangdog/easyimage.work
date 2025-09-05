# EasyImage

- [easyimage.work](https://easyimage.work)

A collection of some image processing tools.

A pure front-end website based on Nuxtjs, including tools and blog pages.

## Stack

- Nuxt3
- Vue3
- Tailwindcss
- Vuei18n
- cropperjs
- exifreader
- file-saver
- jszip
- @nuxtjs/sitemap
- @nuxt/content

## Command

### npm

```sh
npm i
npm run dev
# package
npm run generate
```

### docker

```sh
docker build -t easyimage:1.2.5 .
docker save -o easyimage.1.2.5.tar easyimage:1.2.5
docker load -i easyimage.1.2.5.tar
```

## Acknowledgments

This project is built with the help of many excellent open source projects:

- [Cropper.js](https://github.com/fengyuanchen/cropperjs) - JavaScript image cropper
- [EXIF Reader](https://github.com/mattiasw/ExifReader) - JavaScript EXIF reader
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) - An HTML5 saveAs() FileSaver implementation
- [JSZip](https://stuk.github.io/jszip/) - Create, read and edit .zip files with JavaScript
- [SmileySans](https://github.com/atelier-anchor/smiley-sans) - 得意黑 Smiley Sans：一款在人文观感和几何特征中寻找平衡的中文黑体

Special thanks to all the contributors and maintainers of these amazing projects!
