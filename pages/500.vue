<template>
  <div
    class="bg-gray-50 dark:bg-gray-900 h-screen flex items-center justify-center py-20 px-4"
  >
    <div
      class="w-full max-w-2xl text-center rounded-2xl shadow-lg border bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 backdrop-blur-sm p-8 md:p-12 transition-theme"
    >
      <div
        class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300"
      >
        <span class="text-2xl font-bold">500</span>
      </div>

      <h1
        class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-semibold mb-3"
      >
        {{ t("error.something_went_wrong", "Something went wrong") }}
      </h1>
      <p class="text-slate-600 dark:text-slate-300 mb-8">
        {{
          t(
            "error.error_generic_desc",
            "An unexpected error occurred. You can go back home or try again."
          )
        }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 sm:justify-center">
        <button
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-theme-primary text-white hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          @click="goHome"
        >
          {{ t("error.go_home", "Go Home") }}
        </button>
        <button
          class="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-theme-primary text-theme-primary hover:bg-blue-50 dark:hover:bg-slate-700/40"
          @click="tryAgain"
        >
          {{ t("error.try_again", "Try Again") }}
        </button>
      </div>

      <div class="mt-6 text-sm text-slate-500 dark:text-slate-400">
        <span v-if="error?.message">{{ error.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default" });

const { t } = useI18n?.() ?? ({ t: (_k: string, d: string) => d } as any);
const error = useError();

// 简化为仅显示500错误内容

const goHome = () => {
  clearError({ redirect: "/" });
};

const tryAgain = () => {
  if (process.client) {
    window.location.reload();
  }
};
</script>

<style scoped></style>
