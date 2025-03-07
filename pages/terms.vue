<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">{{ $t("terms.title") }}</h1>
    <div class="bg-white/30 shadow-md rounded-lg p-6 mb-8">
      <div
        v-for="(section, sectionIndex) in $t('terms.sections')"
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
          <!-- {{ sectionIndex }} -->
          <!-- {{ $t(`agreementagreement.sections.${sectionIndex}.heading`) }} -->
        </h2>
        <div v-for="index in 10" :key="index">
          <p
            class="text-gray-700 mb-3"
            v-if="
              !$t(
                `terms.sections[${sectionIndex}].content[${index - 1}]`
              ).startsWith('terms.sections')
            "
          >
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
      <router-link to="agreement" class=" hover:underline text-white">
        &larr; {{ $t("common.viewAgreement") }}
      </router-link>
      <router-link to="/" class="hover:underline text-white">
        {{ $t("common.backToHome") }} &rarr;
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>
