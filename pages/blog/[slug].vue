<template>
  <div class="mx-auto px-4 py-8 max-w-4xl">
    <div v-if="post">
      <div class="mb-6">
        <router-link
          :to="localePath('/blog')"
          class="text-blue-500 hover:text-blue-700"
        >
          ← {{ $t("blog.backToList") }}
        </router-link>
      </div>

      <div class="bg-white/30 shadow-lg rounded-lg p-6 mb-8">
        <h1 class="text-3xl font-bold mb-6">
          {{ post.title || formatSlugToTitle(slug) }}
        </h1>
        <div v-if="post.date" class="text-sm text-gray-500 mb-6">
          {{ formatDate(post.date) }}
        </div>

        <ContentRenderer
          v-if="post"
          :value="post"
          class="prose prose-lg max-w-none"
        >
          <template #empty>
            <p>{{ $t("blog.noContent") }}</p>
          </template>
        </ContentRenderer>
      </div>
    </div>
    <div v-else class="text-center py-12">
      <p>{{ $t("blog.postNotFound") }}</p>
      <router-link
        :to="localePath('/blog')"
        class="text-blue-500 hover:text-blue-700 mt-4 inline-block"
      >
        {{ $t("blog.backToList") }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
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
.prose img {
  @apply mx-auto rounded-lg shadow-md;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto;
}

.prose code {
  @apply text-sm;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4 {
  @apply text-gray-800;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800;
}
</style>
