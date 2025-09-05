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
    "@vite-pwa/nuxt",
  ],
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "EasyImage",
      short_name: "EasyImage",
      description: "EasyImage - Offline image tools",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#1e40af",
      lang: "en",
      scope: "/",
      categories: ["utilities", "productivity"],
      icons: [
        { src: "/pwa/manifest-icon-192.maskable.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
        { src: "/pwa/manifest-icon-512.maskable.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        { src: "/pwa/apple-icon-180.png", sizes: "180x180", type: "image/png" }
      ]
    },
    workbox: {
      navigateFallback: "/offline.html",
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
      globPatterns: [
        "**/*.{js,css,html,svg,png,jpg,jpeg,webp,woff,woff2,otf,ttf,ico,json}"
      ],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "document",
          handler: "NetworkFirst",
          options: {
            cacheName: "html-documents",
            networkTimeoutSeconds: 3,
          }
        },
        {
          urlPattern: ({ request }) => ["style", "script", "worker"].includes(request.destination),
          handler: "StaleWhileRevalidate",
          options: { cacheName: "static-resources" }
        },
        {
          urlPattern: ({ request }) => ["image", "font"].includes(request.destination),
          handler: "CacheFirst",
          options: {
            cacheName: "assets",
            expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
          }
        },
        {
          urlPattern: ({ url }) => url.origin === self.location.origin && url.pathname.startsWith("/_nuxt/"),
          handler: "CacheFirst",
          options: { cacheName: "nuxt-build" }
        }
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 24 * 60 * 60,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/?$/],
    },
  },
  content: {},
  i18n: {
    strategy: "prefix_except_default",
    defaultLocale: "en",
    locales: [
      {
        code: "ar",
        name: "العربية",
      },
      {
        code: "bn",
        name: "বাংলা",
      },
      {
        code: "en",
        name: "English",
      },
      {
        code: "es",
        name: "Español",
      },
      {
        code: "hi",
        name: "हिन्दी",
      },
      {
        code: "ja",
        name: "日本語",
      },
      {
        code: "pt_br",
        name: "Português (Brasil)",
      },
      {
        code: "zh",
        name: "简体中文",
      },
      {
        code: "zh_hant",
        name: "繁体中文",
      },
      {
        code: "vn",
        name: "Tiếng Việt",
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
