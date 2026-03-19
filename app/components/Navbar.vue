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
    <div class="mx-auto px-4 py-2 flex items-center justify-between">
      <NuxtLink :to="`/${route.params?.lang}`">
        <img
          :src="logo"
          alt="logo"
          class="size-16 md:size-[102px] object-cover"
        />
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
          >
            {{ t("Contact me") }}
          </NuxtLink>
        </Button>
      </div>

      <!-- Mobile burger -->
      <button
        class="md:hidden text-primary focus:outline-none w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        @click="isOpen = !isOpen"
      >
        <span
          :class="[
            'block h-0.5 w-6 bg-primary transition-all duration-300 origin-center',
            isOpen ? 'rotate-45 translate-y-2' : '',
          ]"
        />
        <span
          :class="[
            'block h-0.5 w-6 bg-primary transition-all duration-300',
            isOpen ? 'opacity-0 scale-x-0' : '',
          ]"
        />
        <span
          :class="[
            'block h-0.5 w-6 bg-primary transition-all duration-300 origin-center',
            isOpen ? '-rotate-45 -translate-y-2' : '',
          ]"
        />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="md:hidden px-4 py-4 backdrop-blur-sm"
      >
        <div class="flex flex-col gap-3 items-center">
          <NuxtLink
            v-for="(link, index) in links"
            :key="`${link.to}-${index}`"
            :to="link.to"
            class="relative inline-block px-2 py-1 text-white group"
            @click="isOpen = false"
          >
            <span>{{ link.label }}</span>
            <span
              class="absolute left-0 bottom-0 h-[2px] bg-primary w-0 transition-all duration-300 ease-out group-hover:w-full"
            />
          </NuxtLink>

          <!-- Mobile Language Switcher -->
          <div class="flex items-center gap-2 mt-1">
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
            class="mt-1 flex items-center justify-center py-2 px-6 rounded-full bg-primary hover:bg-[#128597] transition-all duration-300 text-white text-sm"
            @click="isOpen = false"
          >
            {{ t("Contact me") }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>
