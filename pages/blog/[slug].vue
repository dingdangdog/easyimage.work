<template>
  <div class="mx-auto px-4 py-8 max-w-4xl">
    <div v-if="post">
      <div class="mb-6">
        <router-link
          :to="localePath('/blog')"
          class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
        >
          ← {{ $t("common.blogList") }}
        </router-link>
      </div>

      <div
        class="bg-white/30 dark:bg-slate-800/30 shadow-lg rounded-lg p-6 mb-8 transition-colors duration-300"
      >
        <h1 class="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
          {{ post.title || formatSlugToTitle(slug) }}
        </h1>
        <div
          v-if="post.date"
          class="text-sm text-gray-500 dark:text-gray-400 mb-6"
        >
          {{ formatDate(post.date) }}
        </div>

        <ContentRenderer
          v-if="post"
          :value="post"
          class="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-img:rounded-lg prose-img:shadow-md transition-colors duration-300"
        >
          <template #empty>
            <p>{{ $t("blog.noContent") }}</p>
          </template>
        </ContentRenderer>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p class="dark:text-slate-300">{{ $t("blog.postNotFound") }}</p>
      <router-link
        :to="localePath('/blog')"
        class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-4 inline-block transition-colors duration-300"
      >
        {{ $t("blog.backToList") }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();
// Replace useContent with queryCollection which is auto-imported
// const { queryContent } = useContent();

// Get the slug from the route
const slug = computed(() => route.params.slug as string);

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

// Function to format slug to title if title is not available
const formatSlugToTitle = (slug: string) => {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

// Fetch the blog post based on the slug and current locale
const { data: post } = await useAsyncData(
  `blog-${slug.value}-${locale.value}`,
  async () => {
    try {
      // Try to find the post in the current locale
      // The blog files are in the root blog directory, not in content
      // We need to use the correct path format for queryContent
      const post = await queryCollection("blog")
        .path(`/blog/${locale.value}/${slug.value}`)
        .first();
      return post;
    } catch (error) {
      // If not found in current locale, try to find it in English (fallback)
      try {
        if (locale.value !== "en") {
          const fallbackPost = await queryCollection("blog")
            .path(`/blog/en/${slug.value}`)
            .first();
          return fallbackPost;
        }
      } catch (fallbackError) {
        console.error("Post not found in any language", fallbackError);
      }
      console.error("Error fetching post", error);
      return null;
    }
  }
);

// Set page title after post is fetched
useHead({
  title: post.value?.title || formatSlugToTitle(slug.value),
});
</script>

<style>
/* Light theme styles */
.prose img {
  @apply mx-auto rounded-lg shadow-md;
}

.prose pre {
  @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto transition-colors duration-300;
}

.prose pre code {
  @apply text-sm bg-transparent px-1 py-0.5 rounded transition-colors duration-300 text-gray-700 dark:text-gray-300;
}

.prose code {
  @apply text-sm bg-blue-200 dark:bg-blue-900 px-1 py-0.5 rounded transition-colors duration-300 text-gray-700 dark:text-gray-300;
}

.prose h1 {
  @apply text-3xl font-bold text-gray-800 dark:text-gray-100 my-6 transition-colors duration-300;
}

.prose h2 {
  @apply text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300;
}

.prose h3 {
  @apply text-xl font-medium text-gray-800 dark:text-gray-100 mt-6 mb-3 transition-colors duration-300;
}

.prose h4 {
  @apply text-lg font-medium text-gray-800 dark:text-gray-100 mt-5 mb-2 transition-colors duration-300;
}

.prose p {
  @apply text-gray-700 dark:text-gray-300 mb-4 leading-relaxed transition-colors duration-300;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300;
}

.prose strong {
  @apply text-gray-900 dark:text-gray-100;
}
.prose ul,
.prose ol {
  @apply my-4 ml-6 text-gray-700 dark:text-gray-300 transition-colors duration-300 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg;
}

.prose li {
  @apply mb-2 transition-colors duration-300 text-gray-700 dark:text-gray-300;
}

.prose blockquote {
  @apply pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-700 dark:text-gray-400 my-4 transition-colors duration-300;
}

.prose hr {
  @apply my-8 border-gray-200 dark:border-gray-700 transition-colors duration-300;
}

.prose table {
  @apply w-full my-6 border-collapse transition-colors duration-300;
}

.prose th {
  @apply bg-gray-100 dark:bg-gray-800 text-left p-2 border border-gray-300 dark:border-gray-700 transition-colors duration-300;
}

.prose td {
  @apply p-2 border border-gray-300 dark:border-gray-700 transition-colors duration-300;
}
</style>
