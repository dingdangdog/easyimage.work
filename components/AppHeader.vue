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
          class="text-lg md:text-xl font-semibold transition duration-300 site-title-reflect"
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
          <IconResize
            class="w-6 h-6 mr-2"
            color="rgb(194 65 12 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.resize") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/watermark')"
          class="flex items-center px-3 py-2 text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconWatermark
            class="w-6 h-6 mr-2"
            color="rgb(29 78 216 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.watermark") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/converter')"
          class="flex items-center px-3 py-2 text-pink-700 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconConverter
            class="w-6 h-6 mr-2"
            color="rgb(190 24 93 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.converter") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/cropping')"
          class="flex items-center px-3 py-2 text-purple-700 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconCropping
            class="w-6 h-6 mr-2"
            color="rgb(126 34 206 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.cropping") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/ai-analysis')"
          class="flex items-center px-3 py-2 text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconAiAnalysis
            class="w-6 h-6 mr-2"
            color="rgb(14 116 144 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.aiAnalysis") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/pix-analysis')"
          class="flex items-center px-3 py-2 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconPixAnalysis
            class="w-6 h-6 mr-2"
            color="rgb(16 185 129 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.pixAnalysis") }}
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
          <IconResize
            class="w-6 h-6 mr-2"
            color="rgb(194 65 12 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.resize") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/watermark')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-blue-700 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconWatermark
            class="w-6 h-6 mr-2"
            color="rgb(29 78 216 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.watermark") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/converter')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-pink-700 hover:text-pink-600 dark:text-pink-300 dark:hover:text-pink-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconConverter
            class="w-6 h-6 mr-2"
            color="rgb(190 24 93 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.converter") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/cropping')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-purple-700 hover:text-purple-600 dark:text-purple-300 dark:hover:text-purple-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconCropping
            class="w-6 h-6 mr-2"
            color="rgb(126 34 206 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.cropping") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/ai-analysis')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-cyan-700 hover:text-cyan-600 dark:text-cyan-300 dark:hover:text-cyan-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconAiAnalysis
            class="w-6 h-6 mr-2"
            color="rgb(14 116 144 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.aiAnalysis") }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/pix-analysis')"
          @click="toggleMobileNav"
          class="flex items-center px-4 py-3 text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-400 transition duration-300 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60"
        >
          <IconPixAnalysis
            class="w-6 h-6 mr-2"
            color="rgb(16 185 129 / var(--tw-text-opacity, 1))"
          />
          {{ $t("header.pixAnalysis") }}
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

/* 站点标题：深蓝文字 + 地面式阴影（非镜像） */
.site-title-reflect {
  /* 深蓝，贴合主题 */
  color: #0f3d7a;
  position: relative;
  display: inline-block;
  /* 向下的层叠阴影，模拟地面投影 */
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.18), 0 2px 2px rgba(0, 0, 0, 0.16),
    0 4px 6px rgba(0, 0, 0, 0.14), 0 8px 12px rgba(0, 0, 0, 0.1);
}

.dark .site-title-reflect {
  /* 暗色模式的亮深蓝，提升可读性 */
  color: #7fb3ff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25), 0 2px 3px rgba(0, 0, 0, 0.28),
    0 6px 10px rgba(0, 0, 0, 0.22), 0 12px 18px rgba(0, 0, 0, 0.18);
}

/* 地面椭圆阴影（非镜像），根据主题微调强度 */
.site-title-reflect::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -5px;
  width: 130%;
  height: 12px;
  /* 双层阴影：中间更深（本影）+ 外围更柔（半影） */
  background: radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.3) 0%,
      rgba(0, 0, 0, 0.2) 45%,
      rgba(0, 0, 0, 0) 75%
    ),
    radial-gradient(
      ellipse at center,
      rgba(0, 0, 0, 0.18) 0%,
      rgba(0, 0, 0, 0.12) 40%,
      rgba(0, 0, 0, 0) 85%
    );
  filter: blur(1.2px);
  opacity: 0.85;
  pointer-events: none;
}

.dark .site-title-reflect::after {
  /* 深色背景下加大对比与层次 */
  background: radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.35) 45%,
      rgba(255, 255, 255, 0) 75%
    ),
    radial-gradient(
      ellipse at center,
      rgba(255, 255, 255, 0.28) 0%,
      rgba(255, 255, 255, 0.2) 40%,
      rgba(255, 255, 255, 0) 85%
    );
  opacity: 0.9;
}
</style>
