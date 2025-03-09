<template>
  <div class="">
    <div class="max-w-7xl mx-auto p-6">
      <div class="text-center mb-8 md:mb-12">
        <h1
          class="text-4xl sm:text-5xl font-extrabold leading-tight my-2 md:my-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 bg-clip-text text-transparent"
        >
          {{ $t("home.welcome") }}
        </h1>
        <p class="text-lg sm:text-xl dark:text-slate-300 text-slate-600">
          {{ $t("home.tip") }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        <HomeCard
          :name="$t('home.resize.name')"
          :desc="$t('home.resize.description')"
          color="!text-orange-200 bg-orange-500/50 hover:bg-orange-500/80 dark:bg-orange-600/40 dark:hover:bg-orange-600/60"
          path="resize"
          icon="resize"
        />
        <HomeCard
          :name="$t('home.watermark.name')"
          :desc="$t('home.watermark.description')"
          color="bg-indigo-500/50 hover:bg-indigo-500/80 dark:bg-indigo-600/40 dark:hover:bg-indigo-600/60"
          path="watermark"
          icon="watermark"
        />
        <HomeCard
          :name="$t('home.converter.name')"
          :desc="$t('home.converter.description')"
          color="bg-pink-500/50 hover:bg-pink-500/80 dark:bg-pink-600/40 dark:hover:bg-pink-600/60"
          path="converter"
          icon="converter"
        />
        <HomeCard
          :name="$t('home.cropping.name')"
          :desc="$t('home.cropping.description')"
          color="bg-purple-500/50 hover:bg-purple-500/80 dark:bg-purple-600/40 dark:hover:bg-purple-600/60"
          path="cropping"
          icon="cropping"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n(); // 显式获取 t
const route = useRoute(); // 获取路由对象

useHead({
  title: t("title"), // 首页仅使用 title，无需拼接
  meta: [
    { name: "description", content: t("description") },
    { name: "keywords", content: t("description") }, // 原配置中这里使用了 description，保留一致
    // Twitter Card data
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("title") },
    { name: "twitter:description", content: t("keywords") }, // 原配置中这里使用了 keywords，保留一致
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    }, // 修改为绝对路径，与工具页一致
    // Open Graph
    { property: "og:title", content: t("title") },
    { property: "og:description", content: t("description") },
    {
      property: "og:image",
      content: "https://easyimage.work/favicon.webp",
    }, // 修改为绝对路径，与工具页一致
    { property: "og:type", content: "website" }, // 添加 og:type，与工具页一致
    { property: "og:url", content: `https://easyimage.work${route.path}` }, // 添加动态 URL，与工具页一致
    { property: "og:site_name", content: t("title") }, // 添加 site_name，与工具页一致
  ],
});
</script>

<style scoped>
/* Custom Styling for Hover Effects and Transitions */
button {
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
}

button:hover {
  transform: scale(1.05);
}

.router-link {
  text-decoration: none;
}
</style>
