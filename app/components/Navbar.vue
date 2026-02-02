<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import logo from "@/assets/images/logo.png";
import Button from "./UI/Button.vue";

const isOpen = ref(false);
const links = [
  // { label: "Home", to: "/" },
  { label: "Services", to: "/#Services" },
  { label: "Awards", to: "/#Awards" },
  { label: "Recipes", to: "/#Recipes" },
];

onMounted(() => {
  const handleScroll = () => {
    const nav = document.querySelector("nav");
    if (!nav) return;
    if (window.scrollY >= 100) {
      nav.classList.add("bg-white/50");
      nav.classList.add("text-black");
    } else {
      nav.classList.remove("bg-white/50");
      nav.classList.remove("text-black");
    }
  };

  window.addEventListener("scroll", handleScroll);

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>
<template>
  <nav
    class="fixed top-0 z-50 w-full backdrop-blur-sm transition-all duration-75"
  >
    <div class="mx-auto px-4 py-3 flex items-center justify-between">
      <NuxtLink to="/">
        <img :src="logo" alt="logo" class="size-[102px] object-cover" />
      </NuxtLink>

      <div class="hidden md:flex space-x-6">
        <NuxtLink
          v-for="(link, index) in links"
          :key="`${link.to}-${index}`"
          :to="link.to"
          class="relative inline-block px-2 py-1 group"
        >
          <span>{{ link.label }}</span>
          <span
            class="absolute left-0 bottom-0 h-[2px] bg-priamary/50 w-0 transition-all duration-300 ease-out group-hover:w-full"
          ></span>
        </NuxtLink>

        <Button>
          <NuxtLink to="/#contactus" class="text-white"> Contact me </NuxtLink>
        </Button>
      </div>

      <button
        class="md:hidden text-gray-700 focus:outline-none"
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

    <div v-if="isOpen" class="md:hidden px-4 pb-4 space-y-2 text-white">
      <div class="flex flex-col gap-4 items-center justify-center">
        <NuxtLink
          v-for="(link, index) in links"
          :key="`${link.to}-${index}`"
          :to="link.to"
          class="relative inline-block px-2 py-1 group"
        >
          <span>{{ link.label }}</span>
          <span
            class="absolute left-0 bottom-0 h-[2px] bg-black w-0 transition-all duration-300 ease-out group-hover:w-full"
          ></span>
        </NuxtLink>

        <NuxtLink
          to="/#contactus"
          class="flex items-center justify-center py-2.5 px-6 rounded-full bg-primary hover:bg-[#128597] transition-all duration-300 ease-out"
        >
          Contact me
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>
