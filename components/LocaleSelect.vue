<script setup lang="ts">
const isMenuVisible = ref(true);
let lastScrollPosition = 0;
const threshold = 5;

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  if (Math.abs(currentScrollPosition - lastScrollPosition) > threshold) {
    // 向下滚动隐藏，向上滚动显示
    isMenuVisible.value = currentScrollPosition < lastScrollPosition;
  }
  lastScrollPosition = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

/* -------------------------------
   语言切换组件相关逻辑
---------------------------------- */
const { locale, locales } = useI18n();
const localName = ref("");
const switchLocalePath = useSwitchLocalePath();

// 设置当前语言名称
locales.value.forEach((l) => {
  if (l.code === locale.value) {
    localName.value = l.name || "";
  }
});

const isDropdownOpen = ref(false);
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  const dropdown = document.getElementById("locale-dropdown");
  if (dropdown && !dropdown.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const clickLang = (name: string | any) => {
  localName.value = name || "";
  isDropdownOpen.value = false;
};
</script>

<!-- 语言切换组件 -->
<template>
  <div class="relative inline-block text-left" id="locale-dropdown">
    <button
      class="flex items-center p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/60 transition duration-300"
      @click="toggleDropdown"
      aria-label="Change language"
    >
      <!-- Globe 图标 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 mr-1 text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="rgb(96 165 250/ var(--tw-text-opacity, 1))"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="text-sm font-medium text-blue-400 transition duration-300">{{
        localName
      }}</span>
      <svg
        class="w-4 h-4 ml-1"
        fill="rgb(96 165 250/ var(--tw-text-opacity, 1))"
        stroke="rgb(96 165 250/ var(--tw-text-opacity, 1))"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <div class="py-1">
          <NuxtLink
            v-for="l in locales"
            :key="l.code"
            :to="switchLocalePath(l.code)"
            @click="clickLang(l.name)"
            class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400 transition duration-150"
          >
            {{ l.name }}
          </NuxtLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Add any additional custom styles here */
svg,
span {
  transition: color 0.3s ease;
}
</style>
