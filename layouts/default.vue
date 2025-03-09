<template>
  <div :class="{ dark: isDarkMode }">
    <div class="theme-container transition-colors duration-300">
      <AppHeader @toggle-theme="toggleTheme" :isDarkMode="isDarkMode" />
      <main
        class="min-h-screen pt-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      >
        <slot></slot>
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
const isDarkMode = ref(false);

// Check for user's preferred color scheme on initial load
onMounted(() => {
  if (typeof window !== "undefined") {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      isDarkMode.value = savedTheme === "dark";
    } else {
      // If no saved preference, check system preference
      isDarkMode.value = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    }
  }
});

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  // Save preference to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
  }
};
</script>

<style>
.theme-container {
  @apply text-slate-800 dark:text-slate-200;
}

/* Global transitions for theme changes */
.transition-theme {
  @apply transition-all duration-300 ease-in-out;
}
</style>
