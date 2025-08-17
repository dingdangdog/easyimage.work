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
docker build -t easyimage:1.2.2 .
docker save -o easyimage.1.2.2.tar easyimage:1.2.2
docker load -i easyimage.1.2.2.tar
```
