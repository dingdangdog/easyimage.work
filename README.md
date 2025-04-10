# EasyImage/老狗图片处理厂

- [oldmoon.top](https://oldmoon.top)

A collection of some image processing tools

## 技术栈

- Nuxt3
- Vue3
- Tailwindcss
- Vuei18n

```sh
npm i
npm run dev
# 打包
npm run generate
```

## docker

```sh
docker build -t easyimage:1.0.13 .
docker save -o easyimage.1.0.13.tar easyimage:1.0.13
docker load -i easyimage.1.0.13.tar
```
