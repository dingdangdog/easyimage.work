<template>
  <footer class="bg-gray-950 text-gray-200 py-8 px-4">
    <div class="mx-auto">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Company Info -->
        <div class="flex flex-col space-y-3">
          <h3 class="text-xl font-semibold mb-2 text-white">
            {{ $t("footer.companyInfo.title") }}
          </h3>
          <p class="text-sm text-gray-400">
            {{ $t("footer.companyInfo.description") }}
          </p>
          <div class="flex items-center mt-2">
            <span class="text-sm">{{
              $t("footer.companyInfo.poweredBy")
            }}</span>
            <a
              href="https://easyimage.work"
              class="ml-2 text-blue-400 hover:text-blue-300 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t("footer.companyInfo.website") }}
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col space-y-3">
          <h3 class="text-xl font-semibold mb-2 text-white">
            {{ $t("footer.legal.title") }}
          </h3>
          <ul class="space-y-2">
            <li>
              <router-link
                :to="localePath('/agreement')"
                class="text-gray-400 hover:text-white transition duration-200"
              >
                {{ $t("footer.legal.links.userAgreement") }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="localePath('/terms')"
                class="text-gray-400 hover:text-white transition duration-200"
              >
                {{ $t("footer.legal.links.termsOfService") }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="localePath('/about')"
                class="text-gray-400 hover:text-white transition duration-200"
              >
                {{ $t("footer.legal.links.aboutUs") }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="flex flex-col space-y-3">
          <h3 class="text-xl font-semibold mb-2 text-white">
            {{ $t("footer.contact.title") }}
          </h3>
          <div class="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href="mailto:contact@easyimage.work"
              class="text-gray-400 hover:text-white transition duration-200"
            >
              contact@easyimage.work
            </a>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 my-6"></div>

      <!-- Copyright -->
      <div
        class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500"
      >
        <p>
          {{ $t("footer.copyright.text", { year: new Date().getFullYear() }) }}
        </p>
        <div class="mt-4 md:mt-0 flex space-x-4">
          <router-link
            :to="localePath('/about')"
            class="hover:text-gray-300 transition duration-200"
          >
            {{ $t("footer.copyright.privacyPolicy") }}
          </router-link>
          <router-link
            :to="localePath('/about')"
            class="hover:text-gray-300 transition duration-200"
          >
            {{ $t("footer.copyright.cookies") }}
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
