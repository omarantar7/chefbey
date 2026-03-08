<script lang="ts" setup>
definePageMeta({ layout: "default" });

const { data } = await useFetch("/api/page/home");

const settings: any = computed(() => data.value?.settings ?? {});
const local: any = computed(() => data.value?.local ?? {});
const seoData: any = computed(() => data.value?.seo ?? {});

const banner = computed(() => {
  return {
    title: local.value?.title,
    description: local.value?.description,
    bgHeroImage: settings.value?.bgHeroImage,
    experienceNumber: local.value?.experienceNumber,
    experienceLabel: local.value?.experienceLabel,
    dishesNumber: local.value?.dishesNumber,
    dishesLabel: local.value?.dishesLabel,
    youtubeLink: local.value?.youtubeLink,
    heroImages: settings.value?.heroImages,
  };
});

const services = computed(() => {
  return {
    servicesTitle: local.value?.servicesTitle,
    servicesDescr: local.value?.servicesDescr,
    servicesSubDescr: local.value?.servicesSubDescr,
    servicesBg: settings.value?.servicesBg,
    services: local.value?.services,
  };
});
const awards = computed(() => {
  return {
    awardsTitle: local.value?.awardsTitle,
    awardsDescr: local.value?.awardsDescr,
    awards: local.value?.awards,
  };
});

const recipes = computed(() => {
  return {
    recipesTitle: local.value?.recipesTitle,
    recipesDescr: local.value?.recipesDescr,
    recipesBg: settings.value?.recipesBg,
  };
});

const contact = computed(() => {
  return {
    contactTitle: local.value?.contactTitle,
    contactDescr: local.value?.contactDescr,
    contactImage: settings.value?.contactImage,
  };
});

useSeoMeta({
  title: () => seoData.value?.title,
  description: () => seoData.value?.description,
  keywords: () => seoData.value?.keywords,
  robots: () => seoData.value?.robots,
  ogUrl: () => seoData.value?.canonicalUrl,

  ogTitle: () => seoData.value?.ogTitle,
  ogDescription: () => seoData.value?.ogDescription,
  ogImage: () => seoData.value?.ogImage,

  twitterTitle: () => seoData.value?.twitterTitle,
  twitterDescription: () => seoData.value?.twitterDescription,
  twitterImage: () => seoData.value?.twitterImage,
  twitterCard: "summary_large_image",
});
useHead({
  link: [{ rel: "canonical", href: () => seoData.value?.canonicalUrl ?? "" }],
});
</script>

<template>
  <SectionsHero :data="banner" />
  <SectionsServices :data="services" />
  <SectionsAwards :data="awards" />
  <SectionsRecipes :recipesData="recipes" />
  <SectionsContact :data="contact" />
</template>
