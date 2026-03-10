<script lang="ts" setup>
import logo from "@/assets/images/logo.png";
import Button from "./UI/Button.vue";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const isOpen = ref(false);

const languages = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
];

const currentLang: any = computed(() => {
  const lang = route.params.lang as string;
  return languages.find((l) => l.code === lang) ?? languages[0];
});

const switchLang = (code: string) => {
  const pathWithoutLang = route.path.replace(/^\/[a-z]{2}/, "");
  window.location.href = `/${code}${pathWithoutLang}`;
  isOpen.value = false;
};

// Apply dir to html tag
watchEffect(() => {
  if (process.client) {
    document.documentElement.dir = currentLang.value.dir;
    document.documentElement.lang = currentLang.value.code;
  }
});

const t = useT();

const links = computed(() => [
  { label: t("Services"), to: `/${currentLang.value.code}/#Services` },
  { label: t("Awards"), to: `/${currentLang.value.code}/#Awards` },
  { label: t("Recipes"), to: `/${currentLang.value.code}/#Recipes` },
]);

const isScrolled = ref(false);

onMounted(() => {
  const handleScroll = () => {
    isScrolled.value = window.scrollY >= 100;
  };
  window.addEventListener("scroll", handleScroll);
  onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));
});
</script>

<template>
  <nav
    :class="[
      'fixed top-0 z-50 w-full backdrop-blur-sm transition-all duration-75',
      isScrolled ? 'bg-white/50 text-black' : '',
    ]"
  >
    <div class="mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink :to="`/${route.params?.lang}`">
        <img :src="logo" alt="logo" class="size-[102px] object-cover" />
      </NuxtLink>

      <!-- Desktop -->
      <div class="hidden md:flex items-center space-x-6">
        <NuxtLink
          v-for="(link, index) in links"
          :key="`${link.to}-${index}`"
          :to="link.to"
          class="relative inline-block px-2 py-1 group"
        >
          <span>{{ link.label }}</span>
          <span
            class="absolute left-0 bottom-0 h-[2px] bg-primary/50 w-0 transition-all duration-300 ease-out group-hover:w-full"
          />
        </NuxtLink>

        <!-- Language Dropdown -->
        <UDropdownMenu
          :items="
            languages.map((l) => ({
              label: l.label,
              onSelect: () => switchLang(l.code),
            }))
          "
        >
          <UButton
            :label="currentLang.label"
            icon="i-heroicons-language"
            color="neutral"
            variant="ghost"
            trailing-icon="i-heroicons-chevron-down"
            :class="[
              'transition-colors duration-200 cursor-pointer',
              isScrolled
                ? 'text-black hover:text-primary hover:bg-black/5'
                : 'text-white hover:text-primary hover:bg-white/10',
            ]"
          />
        </UDropdownMenu>

        <Button>
          <NuxtLink
            :to="`/${route.params?.lang}/#contactus`"
            class="text-white"
            >{{ t("Contact me") }}</NuxtLink
          >
        </Button>
      </div>

      <!-- Mobile burger -->
      <button
        class="md:hidden text-primary focus:outline-none"
        @click="isOpen = !isOpen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="isOpen" class="md:hidden px-4 pb-4 space-y-2 text-white">
      <div class="flex flex-col gap-4 items-center justify-center">
        <NuxtLink
          v-for="(link, index) in links"
          :key="`${link.to}-${index}`"
          :to="link.to"
          :class="[
            'relative inline-block px-2 py-1 group',
            isScrolled ? 'text-black' : 'text-white',
          ]"
          @click="isOpen = false"
        >
          <span>{{ link.label }}</span>
          <span
            class="absolute left-0 bottom-0 h-[2px] bg-black w-0 transition-all duration-300 ease-out group-hover:w-full"
          />
        </NuxtLink>

        <!-- Mobile Language Switcher -->
        <div class="flex items-center gap-2">
          <button
            v-for="lang in languages"
            :key="lang.code"
            :class="[
              'px-3 py-1 text-sm rounded-full transition-colors border',
              currentLang.code === lang.code
                ? 'bg-primary text-white border-primary'
                : 'bg-white/10 text-white border-white/30 hover:bg-white/20',
            ]"
            @click="switchLang(lang.code)"
          >
            {{ lang.label }}
          </button>
        </div>

        <NuxtLink
          :to="`/${route.params?.lang}/#contactus`"
          class="flex items-center justify-center py-2.5 px-6 rounded-full bg-primary hover:bg-[#128597] transition-all duration-300 ease-out"
          @click="isOpen = false"
        >
          {{ t("Contact me") }}
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
