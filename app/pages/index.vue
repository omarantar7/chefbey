<script lang="ts" setup>
import Awards from "~/components/Sections/Awards.vue";
import Contact from "~/components/Sections/Contact.vue";
import Hero from "~/components/Sections/Hero.vue";
import Recipes from "~/components/Sections/Recipes.vue";
import Services from "~/components/Sections/Services.vue";

definePageMeta({
  layout: "default",
});
</script>

<template>
  <Hero />
  <Services />
  <Awards />
  <Recipes />
  <Contact />
</template>
