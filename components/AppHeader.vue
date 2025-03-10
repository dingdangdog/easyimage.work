<script setup lang="ts">
/* -------------------------------
   滚动隐藏/显示头部逻辑
---------------------------------- */
const isMenuVisible = ref(true);
let lastScrollPosition = 0;
const threshold = 5;

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  if (Math.abs(currentScrollPosition - lastScrollPosition) > threshold) {
    // 向下滚动隐藏，向上滚动显示
    isMenuVisible.value = currentScrollPosition < lastScrollPosition;
  }
  isMobileNavOpen.value = false;
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
/* -------------------------------
   移动端导航菜单开关
---------------------------------- */
const isMobileNavOpen = ref(false);
const toggleMobileNav = () => {
  isMobileNavOpen.value = !isMobileNavOpen.value;
};

/* -------------------------------
   语言切换组件相关逻辑
---------------------------------- */
const { locale, locales } = useI18n();
const localName = ref("");
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

// 设置当前语言名称
locales.value.forEach((l) => {
  if (l.code === locale.value) {
    localName.value = l.name || "";
  }
});

/* -------------------------------
   主题切换相关逻辑
---------------------------------- */
const props = defineProps({
  isDarkMode: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-theme"]);

const toggleTheme = () => {
  emit("toggle-theme");
};
</script>

<template>
  <!-- 固定头部容器 -->
  <header class="fixed top-0 left-0 w-full z-30">
    <!-- 顶部导航栏 -->
    <div
      class="w-full h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 flex justify-between items-center px-2 md:px-8 transition-transform duration-500 ease-in-out transform shadow-sm"
      :class="isMenuVisible ? 'translate-y-0' : '-translate-y-full'"
    >
      <!-- 左侧：标题和桌面端导航链接 -->
      <div class="flex items-center space-x-4">
        <NuxtLink
          :to="localePath('/')"
          class="text-lg md:text-xl font-semibold transition duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 bg-clip-text text-transparent"
        >
          {{ $t("header.title") }}
        </NuxtLink>
      </div>

      <!-- 中间：桌面端导航链接 -->
      <nav class="h-full hidden md:flex space-x-8">
        <NuxtLink
          :to="localePath('/resize')"
          class="flex items-center px-3 py-2 text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-1 text-sm text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400"
            >photo_size_select_large</span
          >
          {{ $t("header.resize") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/watermark')"
          class="flex items-center px-3 py-2 text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-1 text-sm text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400"
            >water_drop</span
          >
          {{ $t("header.watermark") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/converter')"
          class="flex items-center px-3 py-2 text-pink-700 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-1 text-sm text-pink-700 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400"
            >swap_horiz</span
          >
          {{ $t("header.converter") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/cropping')"
          class="flex items-center px-3 py-2 text-purple-700 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-1 text-sm text-purple-700 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400"
            >crop</span
          >
          {{ $t("header.cropping") }}
        </NuxtLink>
      </nav>

      <!-- 右侧：主题切换、语言切换组件 & 移动端导航按钮 -->
      <div class="flex items-center space-x-2 md:space-x-4">
        <!-- 主题切换按钮 -->
        <button
          @click="toggleTheme"
          class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition duration-300"
          aria-label="Toggle theme"
        >
          <svg
            v-if="props.isDarkMode"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-slate-300 transition-colors duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 transition-colors duration-300"
            fill="rgb(51 65 85 / var(--tw-text-opacity, 1))"
            viewBox="0 0 24 24"
            stroke="rgb(51 65 85 / var(--tw-text-opacity, 1))"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- 语言切换组件 -->
        <LocaleSelect />

        <!-- 移动端导航切换按钮 -->
        <button
          class="md:hidden p-2 rounded-full text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition duration-300"
          @click="toggleMobileNav"
          aria-label="Toggle mobile menu"
        >
          <svg
            v-if="!isMobileNavOpen"
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <div
      class="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 ease-out shadow-lg"
      :class="
        isMobileNavOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
      "
    >
      <nav class="flex flex-col p-2">
        <NuxtLink
          :to="localePath('/resize')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-2 text-orange-700 hover:text-orange-600 dark:text-orange-300 dark:hover:text-orange-400"
            >photo_size_select_large</span
          >
          {{ $t("header.resize") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/watermark')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-2 text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400"
            >water_drop</span
          >
          {{ $t("header.watermark") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/converter')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-pink-700 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-2 text-pink-700 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400"
            >swap_horiz</span
          >
          {{ $t("header.converter") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/cropping')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-purple-700 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <span
            class="material-symbols-outlined mr-2 text-purple-700 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400"
            >crop</span
          >
          {{ $t("header.cropping") }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  /* 头部平滑的显示/隐藏动画 */
  transition: transform 0.3s ease-in-out;
}

/* 确保 Material Symbols 图标正确加载 */
/* @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"); */

.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  font-size: 1.2rem;
  vertical-align: middle;
  transition: color 0.3s ease;
}
</style>
