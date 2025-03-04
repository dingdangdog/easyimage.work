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

// 导出给 LocaleSelect 组件用的变量和方法
const localeSelectData = {
  localName,
  locales,
  switchLocalePath,
  isDropdownOpen,
  toggleDropdown,
};

const clickLang = (name: string | any) => {
  localName.value = name || "";
  isDropdownOpen.value = false;
};
</script>

<!-- 语言切换组件 -->
<template #LocaleSelect>
  <div class="relative inline-block text-left" id="locale-dropdown">
    <button
      class="flex items-center text-white hover:text-gray-300 focus:outline-none"
      @click="toggleDropdown"
    >
      <!-- Globe 图标 -->
      <!-- <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M10 20a10 10 0 100-20 10 10 0 000 20zm1-14V5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0V8h1a1 1 0 100-2h-1z"
        />
      </svg> -->
      <span>{{ localName }}</span>
      <!-- 下拉箭头 -->
      <svg
        class="w-4 h-4 ml-1"
        fill="none"
        stroke="currentColor"
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
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-20 rounded-md shadow-lg bg-gray-950/50"
    >
      <div class="py-1">
        <NuxtLink
          v-for="l in locales"
          :key="l.code"
          :to="switchLocalePath(l.code)"
          @click="clickLang(l.name)"
          class="block px-4 py-2 text-sm text-white hover:bg-gray-800/50"
        >
          {{ l.name }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
