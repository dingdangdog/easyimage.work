<script setup lang="ts">
const IconWatermark = resolveComponent("IconWatermark");
const IconResize = resolveComponent("IconResize");
const IconConverter = resolveComponent("IconConverter");

const localePath = useLocalePath();

const { name, path, color, icon, desc } = defineProps([
  "name",
  "path",
  "color",
  "icon",
  "desc",
]);

const getIcon = () => {
  switch (icon) {
    case "watermark":
      return IconWatermark;
    case "resize":
      return IconResize;
    case "converter":
      return IconConverter;
  }
};
</script>

<template>
  <a
    :href="localePath(path)"
    class="w-full border border-gray-100/10 flex justify-center items-center p-2 md:p-6 rounded-lg shadow-md shadow-gray-300 hover:scale-105 transform transition duration-300 ease-in-out"
    :class="color"
  >
    <div class="text-center">
      <div class="h-12 w-12 md:h-16 md:w-16 mx-auto mb-2 md:mb-4">
        <component :is="getIcon()" />
      </div>
      <h3 class="text-2xl font-semibold">
        {{ name }}
      </h3>
      <p class="text-gray-200 my-2 text-center">
        {{ desc }}
      </p>
      <p
        class="mt-2 md:mt-4 text-lg inline-block font-semibold text-blue-300 duration-200 ease-in-out"
      >
        {{ $t("home.start-button") }}
      </p>
    </div>
  </a>
</template>

<style scoped></style>
