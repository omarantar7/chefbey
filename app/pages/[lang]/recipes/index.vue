<script setup lang="ts">
const route = useRoute();

const { data }: any = await useFetch("/api/page/recipes", {
  params: { lang: route.params.lang },
});
const { data: recipeItems }: any = await useFetch(
  "/api/page/contents/recipes",
  {
    params: { lang: route?.params?.lang },
  },
);

const settings: any = computed(() => data.value?.settings ?? {});
const local: any = computed(() => data.value?.local ?? {});

const recipes = computed(() => {
  return {
    title: local.value?.title,
    description: local.value?.description,
    bgHeroImage: settings.value?.bgHeroImage,
  };
});

const seoData: any = computed(() => data.value?.seo ?? {});
useSeoMeta({
  title: () => seoData.value?.title,
  description: () => seoData.value?.description,
  keywords: () => seoData.value?.keywords,
  robots: () => seoData.value?.robots,
  ogUrl: () => seoData.value?.canonicalUrl,

  ogTitle: () => seoData.value?.ogTitle,
  ogDescription: () => seoData.value?.ogDescription,
  ogImage: () => seoData.value?.ogImage ?? "/logo.png",

  twitterTitle: () => seoData.value?.twitterTitle,
  twitterDescription: () => seoData.value?.twitterDescription,
  twitterImage: () => seoData.value?.twitterImage ?? "/logo.png",
  twitterCard: "summary_large_image",
});
useHead({
  link: [{ rel: "canonical", href: () => seoData.value?.canonicalUrl ?? "" }],
});
const t = useT();
</script>

<template>
  <div v-gsap.from="{ opacity: 0, y: 60, duration: 1, ease: 'power3.out' }">
    <LazyCommonHero :data="recipes" />
  </div>
  <div class="container mx-auto px-4 py-12 lg:py-20 relative z-10">
    <h1
      class="text-black mb-12 border-primary text-3xl md:text-4xl"
      :class="route.params.lang == 'ar' ? 'pr-4 border-r-8' : 'border-l-8 pl-4'"
    >
      {{ t("Our Recipes") }}
    </h1>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
    >
      <LazyCard
        v-for="item in recipeItems"
        :key="item.id"
        :data="item"
        :isNews="false"
      />
    </div>
  </div>
</template>
