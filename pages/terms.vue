<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">{{ $t("terms.title") }}</h1>
    <div class="bg-white/30 shadow-md rounded-lg p-6 mb-8">
      <div
        v-for="(section, sectionIndex) in Number($t('terms.sectionsNum'))"
        :key="sectionIndex"
        class="mb-8"
      >
        <h2
          class="text-xl font-semibold mb-3 text-black"
          v-if="
            !$t(`terms.sections[${sectionIndex}].heading`).startsWith(
              'terms.sections'
            )
          "
        >
          {{ $t(`terms.sections[${sectionIndex}].heading`) }}
          <!-- {{ $t(`terms.sections[${sectionIndex}].contentNum`) }} -->
        </h2>
        <div
          v-for="index in Number(
            $t(`terms.sections[${sectionIndex}].contentNum`)
          )"
          :key="index"
        >
          <p class="text-gray-700 mb-3">
            {{ $t(`terms.sections[${sectionIndex}].content[${index - 1}]`) }}
          </p>
        </div>
      </div>
      <div class="mb-6">
        <p class="text-sm text-gray-500 mb-4">
          {{ $t("terms.footer.lastUpdated") }}
        </p>
      </div>
      <div class="mt-4 text-sm text-gray-500">
        {{ $t("terms.footer.companyInfo") }}
      </div>
    </div>

    <div class="flex justify-between items-center mt-6">
      <router-link to="agreement" class="hover:underline text-white">
        &larr; {{ $t("common.viewAgreement") }}
      </router-link>
      <router-link to="/" class="hover:underline text-white">
        {{ $t("common.backToHome") }} &rarr;
      </router-link>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n();
const route = useRoute();
useHead({
  title: t("terms.title"),
  meta: [
    { name: "description", content: t("terms.description") },
    { name: "keywords", content: t("terms.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("terms.title") },
    { name: "twitter:description", content: t("terms.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("terms.title") },
    { property: "og:description", content: t("terms.description") },
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
