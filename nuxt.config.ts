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
        // Add Material Symbols font for icons
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
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
      // Add meta tags for theme color and viewport
      meta: [
        { name: "theme-color", content: "#1e40af" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  site: {
    url: "https://easyimage.work",
    name: "EasyImage",
  },
  sitemap: {
    autoI18n: true,
  },
  devServer: {
    port: 13175,
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("cropper-"),
    },
  },
  nitro: {
    prerender: {
      ignore: ["/manifest.json"],
    },
  },
  css: [
    "~/assets/css/base.css",
    "~/assets/css/theme.css", // Add our theme CSS file
  ],
  runtimeConfig: {
    public: {},
  },
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/sitemap",
    "@nuxt/content",
  ],
  content: {},
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
      {
        code: "ja",
        name: "日本語",
      },
    ],
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },
  // Add Tailwind configuration for dark mode
  tailwindcss: {
    config: {
      darkMode: "class",
    },
  },
});
