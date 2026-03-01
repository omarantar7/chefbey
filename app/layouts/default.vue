<script setup lang="ts">
const route = useRoute();

useSeoMeta({
  title: "Chef Bey",
  ogTitle: "Chef bey",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "/chefbey/uploads/1772131596296.svg",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div class="w-[98%] md:w-full mx-auto">
    <Navbar />
    <div class="min-h-screen">
      <slot />
    </div>
    <Footer />
  </div>
</template>
