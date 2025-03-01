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
</script>

<template>
  <!-- 固定头部容器 -->
  <header class="fixed top-0 left-0 w-full z-30">
    <!-- 顶部导航栏 -->
    <div
      class="w-full h-16 bg-gradient-to-r from-red-700 via-green-700 to-blue-700 flex justify-between items-center px-4 md:px-8 transition-transform duration-500 ease-in-out transform"
      :class="isMenuVisible ? 'translate-y-0' : '-translate-y-full'"
    >
      <!-- 左侧：标题和桌面端导航链接 -->
      <div class="flex items-center space-x-4">
        <NuxtLink
          :to="localePath('/')"
          class="text-lg md:text-xl text-white/90 font-semibold transition duration-300 text-glow"
        >
          {{ $t("header.title") }}
        </NuxtLink>
      </div>
      <div>
        <nav class="h-full hidden md:flex space-x-8">
          <NuxtLink
            :to="localePath('/resize')"
            class="text-lg text-orange-500 hover:text-orange-300 transition duration-300"
          >
            {{ $t("header.resize") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/watermark')"
            class="h-full text-lg text-indigo-300 hover:text-indigo-200 transition duration-300"
          >
            {{ $t("header.watermark") }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/converter')"
            class="text-lg text-pink-500 hover:text-pink-300 transition duration-300"
          >
            {{ $t("header.converter") }}
          </NuxtLink>
        </nav>
      </div>
      <!-- 右侧：语言切换组件 & 移动端导航按钮 -->
      <div class="flex items-center space-x-4">
        <LocaleSelect />
        <!-- 移动端导航切换按钮 -->
        <button
          class="md:hidden text-white focus:outline-none"
          @click="toggleMobileNav"
        >
          <svg
            v-if="!isMobileNavOpen"
            class="w-6 h-6"
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
            class="w-6 h-6"
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
      class="md:hidden bg-gradient-to-r from-red-700 via-green-700 to-blue-700 p-2 transition-all duration-300 ease-out"
      :class="
        isMobileNavOpen
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-full'
      "
    >
      <nav class="flex flex-col px-4 py-2 space-y-2">
        <NuxtLink
          :to="localePath('/resize')"
          @click="toggleMobileNav"
          class="text-orange-400 hover:text-orange-300 transition duration-300"
        >
          {{ $t("header.resize") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/watermark')"
          @click="toggleMobileNav"
          class="text-indigo-300 hover:text-indigo-200 transition duration-300"
        >
          {{ $t("header.watermark") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/converter')"
          @click="toggleMobileNav"
          class="text-pink-400 hover:text-pink-300 transition duration-300"
        >
          {{ $t("header.converter") }}
        </NuxtLink>
        <!-- 如有其他子页面可在此添加 -->
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  /* 头部平滑的显示/隐藏动画 */
  transition: transform 0.3s ease-in-out;
}
</style>
