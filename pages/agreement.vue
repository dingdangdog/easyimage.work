<template>
  <div class="mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
      {{ $t("agreement.title") }}
    </h1>
    <div class="bg-white/30 dark:bg-gray-800/30 shadow-md rounded-lg p-6 mb-8">
      <div
        v-for="(section, sectionIndex) in Number($t('agreement.sectionsNum'))"
        :key="sectionIndex"
        class="mb-8"
      >
        <h2
          class="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100"
          v-if="
            !$t(`agreement.sections[${sectionIndex}].heading`).startsWith(
              'agreement.sections'
            )
          "
        >
          {{ $t(`agreement.sections[${sectionIndex}].heading`) }}
          <!-- {{ $t(`agreement.sections[${sectionIndex}].contentNum`) }} -->
        </h2>
        <div
          v-for="index in Number(
            $t(`agreement.sections[${sectionIndex}].contentNum`)
          )"
          :key="index"
        >
          <p class="text-gray-700 dark:text-gray-300 mb-3">
            {{
              $t(`agreement.sections[${sectionIndex}].content[${index - 1}]`)
            }}
          </p>
        </div>
      </div>
      <div class="mb-6">
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {{ $t("agreement.footer.lastUpdated") }}
        </p>
      </div>
      <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {{ $t("agreement.footer.companyInfo") }}
      </div>
    </div>

    <div class="flex justify-between items-center mt-6">
      <router-link
        :to="localePath('/')"
        class="text-gray-500 dark:text-gray-200 hover:underline"
      >
        &larr; {{ $t("common.backToHome") }}
      </router-link>
      <router-link
        :to="localePath('terms')"
        class="text-gray-500 dark:text-gray-200 hover:underline"
      >
        {{ $t("common.viewTerms") }} &rarr;
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

useHead({
  title: t("agreement.title"),
  meta: [
    { name: "description", content: t("agreement.description") },
    { name: "keywords", content: t("agreement.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("agreement.title") },
    { name: "twitter:description", content: t("agreement.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("agreement.title") },
    { property: "og:description", content: t("agreement.description") },
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
