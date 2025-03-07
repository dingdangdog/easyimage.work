<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6 text-center">{{ $t("about.title") }}</h1>

    <div class="bg-white/30 shadow-lg rounded-lg p-6 mb-8">
      <!-- What We Offer Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("about.offer.heading") }}
        </h2>
        <div
          v-for="(content, contentIndex) in $t('about.offer.content')"
          :key="contentIndex"
        >
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(`about.offer.content[${contentIndex}]`).startsWith(
                'about.offer'
              )
            "
          >
            {{ $t(`about.offer.content[${contentIndex}]`) }}
          </p>
        </div>
      </div>

      <!-- Privacy and Security Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("about.privacy.heading") }}
        </h2>
        <div
          v-for="(content, contentIndex) in $t('about.privacy.content')"
          :key="contentIndex"
        >
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(`about.privacy.content[${contentIndex}]`).startsWith(
                'about.privacy'
              )
            "
          >
            {{ $t(`about.privacy.content[${contentIndex}]`) }}
          </p>
        </div>
        <div class="text-right">
          <router-link to="agreement" class="hover:underline text-blue-300"
            >{{ $t("common.viewAgreement") }} &rarr;
          </router-link>
        </div>
      </div>

      <!-- Functionality Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("about.functionality.heading") }}
        </h2>
        <div
          v-for="(content, contentIndex) in $t('about.functionality.content')"
          :key="contentIndex"
        >
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(`about.functionality.content[${contentIndex}]`).startsWith(
                'about.functionality'
              )
            "
          >
            {{ $t(`about.functionality.content[${contentIndex}]`) }}
          </p>
        </div>
      </div>

      <!-- Support Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("about.support.heading") }}
        </h2>
        <div
          v-for="(content, contentIndex) in $t('about.support.content')"
          :key="contentIndex"
        >
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(`about.support.content[${contentIndex}]`).startsWith(
                'about.support'
              )
            "
          >
            {{ $t(`about.support.content[${contentIndex}]`) }}
          </p>
        </div>
        <div class="text-right">
          <router-link to="terms" class="hover:underline text-blue-300"
            >{{ $t("common.viewTerms") }} &rarr;
          </router-link>
        </div>
      </div>

      <!-- Language Support Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("about.language.heading") }}
        </h2>
        <div
          v-for="(content, contentIndex) in $t('about.language.content')"
          :key="contentIndex"
        >
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(`about.language.content[${contentIndex}]`).startsWith(
                'about.language'
              )
            "
          >
            {{ $t(`about.language.content[${contentIndex}]`) }}
          </p>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("about.contact.heading") }}
        </h2>
        <div
          v-for="(content, contentIndex) in $t('about.contact.content')"
          :key="contentIndex"
        >
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(`about.contact.content[${contentIndex}]`).startsWith(
                'about.contact'
              )
            "
          >
            {{ $t(`about.contact.content[${contentIndex}]`) }}
          </p>
        </div>
        <div class="text-right">
          <a
            href="mailto:contact@easyimage.work"
            class="hover:underline text-blue-300"
          >
            {{ $t("common.contactUs") }} &rarr;
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();

useHead({
  title: t("about.title"),
  meta: [
    { name: "description", content: t("about.description") },
    { name: "keywords", content: t("about.keywords") },
    // Twitter
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@oldmoontop" },
    { name: "twitter:title", content: t("about.title") },
    { name: "twitter:description", content: t("about.description") },
    {
      name: "twitter:image",
      content: "https://easyimage.work/favicon.webp",
    },
    // Open Graph
    { property: "og:title", content: t("about.title") },
    { property: "og:description", content: t("about.description") },
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
