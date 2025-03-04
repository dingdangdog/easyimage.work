// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-04-03",
  app: {
    head: {
      title: "EasyImage.Work",
      link: [
        {
          rel: "shortcut icon",
          href: "/favicon.jpg",
        },
        {
          rel: "icon",
          href: "/favicon.jpg",
        },
        {
          rel: "manifest",
          href: "/manifest.json",
        },
      ],
      script: [
        {
          src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          async: true,
          crossorigin: "anonymous",
          "data-ad-client": "ca-pub-8842635629279684", // 注意：data-ad-client 需要使用 data- 前缀
        },
      ],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("cropper-"),
    },
  },
  devServer: {
    port: 13175,
  },
  nitro: {
    prerender: {
      ignore: ["/manifest.json"],
    },
  },
  css: ["~/assets/css/base.css"],
  runtimeConfig: {
    public: {},
  },
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss"],

  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        name: "En",
      },
      {
        code: "zh",
        name: "简中",
      },
    ],
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },
});
