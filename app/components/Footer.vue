<script setup lang="ts">
import logo from "@/assets/images/logo.png";
import qsLogo from "@/assets/images/qs.png";
const t = useT();

const route = useRoute();

const languages = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
];

const currentLang: any = computed(() => {
  const lang = route.params.lang as string;
  return languages.find((l) => l.code === lang) ?? languages[0];
});

const links = computed(() => [
  // { label: t("Services"), to: `/${currentLang.value.code}/#Services` },
  // { label: t("Awards"), to: `/${currentLang.value.code}/#Awards` },
  // { label: t("Recipes"), to: `/${currentLang.value.code}/#Recipes` },
  // { label: t("Contact me"), to: `/${currentLang.value.code}/#contactus` },
  { label: t("Home"), to: `/${currentLang.value.code}` },
  { label: t("News"), to: `/${currentLang.value.code}/news` },
  { label: t("Recipes"), to: `/${currentLang.value.code}/recipes` },
  { label: t("Contact me"), to: `/${currentLang.value.code}/contactUs` },
]);
</script>

<template>
  <footer class="bg-white border-t border-gray-200 font-sans">
    <div class="container mx-auto px-4 sm:px-10 pt-10 pb-0">
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10 pb-10"
      >
        <!-- Logo -->
        <div
          class="flex justify-center cursor-pointer sm:justify-start sm:flex-1"
          @click="$router?.push(`/${currentLang.code}`)"
        >
          <img
            :src="logo"
            alt="Chef Bey logo"
            class="w-24 h-24 object-contain"
          />
        </div>

        <!-- Navigation -->
        <div class="sm:flex-2 sm:pl-10 lg:pl-24">
          <p
            class="text-lg font-semibold text-gray-900 mb-4 text-center sm:text-left"
          >
            {{ t("Pages") }}
          </p>
          <div class="grid grid-cols-2 gap-y-3 gap-x-10 lg:gap-x-16">
            <NuxtLink
              :to="link.to"
              class="text-gray-500 text-sm hover:text-gray-900 transition-colors text-center sm:text-left"
              v-for="link in links"
              :key="link.label"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Follow Me -->
        <div class="sm:flex-1 flex flex-col items-center sm:items-start">
          <p class="text-lg font-semibold text-gray-900 mb-4">
            {{ t("Follow Me") }}
          </p>
          <div class="flex items-center gap-3">
            <!-- Instagram -->
            <a
              href="https://www.instagram.com/chefbeyofficial?igsh=M3R2bHZtODVzaTU4"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('Visit our Instagram page (opens in new tab)')"
              class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
                focusable="false"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>

            <!-- Facebook -->
            <a
              href="https://www.facebook.com/share/1BLYnrafR5/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('Visit our Facebook page (opens in new tab)')"
              class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                />
              </svg>
            </a>

            <!-- LinkedIn -->
            <a
              href="https://www.linkedin.com/in/chef-bey-544a1626a"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="t('Visit our LinkedIn page (opens in new tab)')"
              class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div
        class="border-t border-gray-200 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 px-2"
      >
        <p class="text-gray-700 text-sm">
          {{ t("© All Rights Reserved") }}, Chef Bey
          {{ new Date().getFullYear() }}
        </p>
        <!-- <a
          href="#"
          class="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          {{ t("Powered by") }}
          <img
            :src="qsLogo"
            alt="QuikSite Logo"
            class="h-5 w-auto object-contain"
          />
        </a> -->
      </div>
    </div>
  </footer>
</template>
