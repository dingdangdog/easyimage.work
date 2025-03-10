<template>
  <div class="mx-auto px-4 py-8 max-w-4xl">
    <h1
      class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white"
    >
      {{ $t("blog.title") }}
    </h1>

    <div class="bg-white/30 dark:bg-gray-800/30 shadow-md rounded-lg p-6 mb-8">
      <!-- Blog Posts List -->
      <div class="mb-8">
        <div
          v-for="(post, index) in Number($t('blog.listNum'))"
          :key="index"
          class="text-gray-700 dark:text-gray-300 mb-4"
        >
          <router-link
            :to="localePath(`/blog/${$t(`blog.list[${index}].key`)}`)"
            class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
          >
            {{ $t(`blog.list[${index}].title`) }}
          </router-link>
          <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">
            ({{ formatDate($t(`blog.list[${index}].date`)) }})
          </span>
        </div>
        <div
          v-if="Number($t('blog.listNum')) === 0"
          class="text-gray-600 dark:text-gray-400"
        >
          {{ $t("blog.noPosts") }}
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mt-6">
      <router-link
        to="/"
        class="text-gray-500 dark:text-gray-200 hover:underline"
      >
        &larr; {{ $t("common.backToHome") }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
const { locale } = useI18n();
const route = useRoute();

// Function to format date
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale.value, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

useHead({
  title: t("blog.title"),
  meta: [
    { name: "description", content: t("blog.description") },
    { name: "keywords", content: t("blog.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("blog.title") },
    { name: "twitter:description", content: t("blog.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("blog.title") },
    { property: "og:description", content: t("blog.description") },
    {
      property: "og:image",
      content: "https://easyimage.work/favicon.webp",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://easyimage.work${route.path}` },
    { property: "og:site_name", content: t("title") },
    { name: "google-adsense-account", content: "ca-pub-8842635629279684" },
  ],
});
</script>

<style scoped></style>
