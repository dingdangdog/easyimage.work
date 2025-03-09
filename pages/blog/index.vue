<template>
  <div class="mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6 text-center">{{ $t("blog.title") }}</h1>

    <div class="bg-white/30 shadow-lg rounded-lg p-6 mb-8">
      <!-- Blog Section -->
      <div class="mb-8">
        <h2 class="text-2xl font-semibold mb-4 text-black">
          {{ $t("blog.section.heading") }}
        </h2>
        <div v-if="posts.length > 0">
          <div
            v-for="post in posts"
            :key="post._path"
            class="text-gray-700 mb-3"
          >
            <router-link
              :to="localePath(`/blog/${encodeURIComponent(post.slug)}`)"
              class="text-blue-500 hover:text-blue-300"
            >
              {{ post.title || formatSlugToTitle(post.slug) }}
            </router-link>
            <span v-if="post.date" class="text-sm text-gray-500 ml-2">
              ({{ formatDate(post.date) }})
            </span>
          </div>
        </div>
        <div v-else class="text-gray-600">
          {{ $t("blog.noPosts") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { locale } = useI18n();

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

// Fetch blog posts for the current locale
const { data: localePosts } = await useAsyncData(
  `blog-posts-${locale.value}`,
  () => {
    // Use queryContent to fetch blog posts from the root blog directory
    return queryContent(`/blog/${locale.value}`).sort({ date: -1 }).find();
  }
);

// Fetch English blog posts as fallback
const { data: enPosts } = await useAsyncData("blog-posts-en", () => {
  if (locale.value === "en") return [];
  // Fetch English posts as fallback
  return queryContent("/blog/en").sort({ date: -1 }).find();
});

// Combine and deduplicate posts
const posts = computed(() => {
  const allPosts = [...(localePosts.value || [])];

  // Add English posts that don't exist in the current locale
  if (locale.value !== "en" && enPosts.value) {
    enPosts.value.forEach((enPost) => {
      const slug = enPost._path.split("/").pop();
      const exists = allPosts.some((p) => p._path.split("/").pop() === slug);
      if (!exists) {
        allPosts.push(enPost);
      }
    });
  }

  // Sort by date (newest first)
  return allPosts
    .sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .map((post) => {
      // Extract slug from path
      const pathParts = (post._path || "").split("/");
      const slug = pathParts[pathParts.length - 1];
      return {
        ...post,
        slug,
      };
    });
});
</script>

<style scoped></style>
