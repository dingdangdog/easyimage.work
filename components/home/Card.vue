<script setup lang="ts">
const localePath = useLocalePath();

const { name, path, color, icon, desc } = defineProps([
  "name",
  "path",
  "color",
  "icon",
  "desc",
]);

const getIconName = () => {
  switch (icon) {
    case "watermark":
      return "water_drop";
    case "resize":
      return "photo_size_select_large";
    case "converter":
      return "swap_horiz";
    case "cropping":
      return "crop";
    default:
      return "";
  }
};
</script>

<template>
  <a
    :href="localePath(path)"
    class="w-full border border-gray-100/10 flex justify-center items-center p-2 md:p-6 rounded-lg shadow-md dark:shadow-gray-900 shadow-gray-300 hover:scale-105 transform transition duration-300 ease-in-out"
    :class="color"
  >
    <div class="text-center">
      <div
        class="h-12 w-12 md:h-16 md:w-16 mx-auto mb-2 md:mb-4 flex items-center justify-center"
      >
        <span class="material-symbols-outlined text-4xl md:text-5xl">{{
          getIconName()
        }}</span>
      </div>
      <h3 class="text-2xl font-semibold dark:text-white text-slate-800">
        {{ name }}
      </h3>
      <p class="dark:text-gray-200 text-gray-700 my-2 text-center">
        {{ desc }}
      </p>
      <p
        class="mt-2 md:mt-4 text-lg inline-block font-semibold text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 duration-200 ease-in-out"
      >
        {{ $t("home.start-button") }}
      </p>
    </div>
  </a>
</template>

<style scoped>
/* Card hover effect */
a {
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

a:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Dark mode adjustments */
.dark a:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Material Symbols styling */
.material-symbols-outlined {
  font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
  vertical-align: middle;
}
</style>
