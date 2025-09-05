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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-3 lg:col-span-1 flex justify-center">
          <HomeCard
            :name="$t('home.resize.name')"
            :desc="$t('home.resize.description')"
            color="bg-orange-500/50 hover:bg-orange-500/60 dark:bg-orange-600/40 dark:hover:bg-orange-600/60"
            titleClass="text-orange-900 dark:text-orange-300 drop-shadow-sm"
            descClass="text-orange-950/90 dark:text-orange-300/90"
            actionClass="text-orange-600 dark:text-orange-300 hover:text-orange-700 dark:hover:text-orange-100"
            iconClass="text-orange-500 dark:text-orange-200/90"
            path="resize"
            icon="resize"
          />
        </div>
        <div class="md:col-span-3 lg:col-span-1 flex justify-center">
          <HomeCard
            :name="$t('home.converter.name')"
            :desc="$t('home.converter.description')"
            color="bg-pink-500/50 hover:bg-pink-500/70 dark:bg-pink-600/40 dark:hover:bg-pink-600/60"
            titleClass="text-pink-900 dark:text-pink-300 drop-shadow-sm"
            descClass="text-pink-950/90 dark:text-pink-300/90"
            actionClass="text-pink-600 dark:text-pink-300 hover:text-pink-900 dark:hover:text-pink-100"
            iconClass="text-pink-500 dark:text-pink-200/90"
            path="converter"
            icon="converter"
          />
        </div>
        <div class="md:col-span-3 lg:col-span-1 flex justify-center">
          <HomeCard
            :name="$t('home.cropping.name')"
            :desc="$t('home.cropping.description')"
            color="bg-purple-500/50 hover:bg-purple-500/70 dark:bg-purple-600/40 dark:hover:bg-purple-600/60"
            titleClass="text-purple-900 dark:text-purple-300 drop-shadow-sm"
            descClass="text-purple-950/90 dark:text-purple-300/90"
            actionClass="text-purple-600 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100"
            iconClass="text-purple-500 dark:text-purple-200/90"
            path="cropping"
            icon="cropping"
          />
        </div>
        <div class="md:col-span-3 lg:col-span-1 flex justify-center">
          <HomeCard
            :name="$t('home.aiAnalysis.name')"
            :desc="$t('home.aiAnalysis.description')"
            color="bg-cyan-500/50 hover:bg-cyan-500/70 dark:bg-cyan-600/40 dark:hover:bg-cyan-600/60"
            titleClass="text-cyan-900 dark:text-cyan-300 drop-shadow-sm"
            descClass="text-cyan-950/90 dark:text-cyan-300/90"
            actionClass="text-cyan-600 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100"
            iconClass="text-cyan-500 dark:text-cyan-200/90"
            path="ai-analysis"
            icon="ai-analysis"
          />
        </div>
        <div class="md:col-span-3 lg:col-span-1 flex justify-center">
          <HomeCard
            :name="$t('home.pixAnalysis.name')"
            :desc="$t('home.pixAnalysis.description')"
            color="bg-green-500/50 hover:bg-green-500/70 dark:bg-green-600/40 dark:hover:bg-green-600/60"
            titleClass="text-green-900 dark:text-green-300 drop-shadow-sm"
            descClass="text-green-950/90 dark:text-green-300/90"
            actionClass="text-green-600 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
            iconClass="text-green-500 dark:text-green-200/90"
            path="pix-analysis"
            icon="pix-analysis"
          />
        </div>
        <div class="md:col-span-3 lg:col-span-1 flex justify-center">
          <HomeCard
            :name="$t('home.watermark.name')"
            :desc="$t('home.watermark.description')"
            color="bg-indigo-500/50 hover:bg-indigo-500/70 dark:bg-indigo-600/40 dark:hover:bg-indigo-600/60"
            titleClass="text-indigo-900 dark:text-indigo-300 drop-shadow-sm"
            descClass="text-indigo-950/90 dark:text-indigo-300/90"
            actionClass="text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100"
            iconClass="text-indigo-500 dark:text-indigo-200/90"
            path="watermark"
            icon="watermark"
          />
        </div>
      </div>
    </div>

    <!-- Key Features Section -->
    <div class="mt-16 flex flex-col justify-center text-center">
      <div
        class="flex flex-col items-center p-8 ease-in-out duration-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
      >
        <div class="p-3 rounded-full text-blue-100 dark:text-blue-200 bg-blue-600 dark:bg-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold mt-2 text-blue-800 dark:text-blue-200">
          {{ $t("body.tip1") }}
        </h3>
      </div>
      <div
        class="flex flex-col items-center p-8 ease-in-out duration-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
      >
        <div
          class="p-3 rounded-full text-green-100 dark:text-green-200 bg-green-500 dark:bg-green-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3
          class="text-lg font-semibold mt-2 text-green-800 dark:text-green-200"
        >
          {{ $t("body.tip2") }}
        </h3>
      </div>
      <div
        class="flex flex-col items-center p-8 ease-in-out duration-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md"
      >
        <div
          class="p-3 rounded-full text-purple-100 dark:text-purple-200 bg-purple-500 dark:bg-purple-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3
          class="text-lg font-semibold mt-2 text-purple-800 dark:text-purple-200"
        >
          {{ $t("body.tip3") }}
        </h3>
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
    { name: "keywords", content: t("keywords") },
    // Twitter Card data
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("title") },
    { name: "twitter:description", content: t("description") },
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
