<script setup lang="ts">
definePageMeta({ props: true });

const { id } = defineProps<{ id: string }>();
const route = useRoute();
const lang = computed(() => (route.params.lang as string) ?? "en");

const { data }: any = await useFetch(`/api/page/contents/recipes/${id}`, {
  query: { lang },
});

console.log({ data });

const recipe = computed(() => ({
  image: data.value?.settings?.image,
  title: data.value?.name,
  description: data.value?.local?.description,
  calories: data.value?.local?.calories,
  prepTime: data.value?.local?.prepTime,
  servings: data.value?.local?.servings,
  ingredients: data.value?.local?.ingredients ?? [{ name: "" }],
}));
const t = useT();

useSeoMeta({
  title: () => data.value?.seo?.title,
  description: () => data.value?.seo?.description,
  keywords: () => data.value?.seo?.keywords,
  robots: () => data.value?.seo?.robots,
  ogUrl: () => data.value?.seo?.canonicalUrl,

  ogTitle: () => data.value?.seo?.ogTitle,
  ogDescription: () => data.value?.seo?.ogDescription,
  ogImage: () => data.value?.seo?.ogImage,

  twitterTitle: () => data.value?.seo?.twitterTitle,
  twitterDescription: () => data.value?.seo?.twitterDescription,
  twitterImage: () => data.value?.seo?.twitterImage,
  twitterCard: "summary_large_image",
});
useHead({
  link: [{ rel: "canonical", href: () => data.value?.seo?.canonicalUrl ?? "" }],
});
</script>

<template>
  <div class="min-h-screen bg-[#0f172b] text-white">
    <!-- Hero -->
    <div class="relative h-[70vh] w-full overflow-hidden" style="height: 80vh">
      <!-- Background image -->
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.title"
        class="absolute inset-0 w-full h-full object-cover scale-110"
      />

      <!-- Hero content -->
      <div
        class="absolute bottom-0 left-0 p-8 md:p-16 w-full"
        style="background: linear-gradient(0deg, #0f172b, transparent)"
      >
        <div class="flex items-center gap-3 mb-4">
          <span
            class="text-primary text-sm font-semibold tracking-widest uppercase"
            >{{ t("Recipe") }}</span
          >
          <span class="w-8 h-px bg-primary" />
        </div>

        <h1
          class="text-5xl md:text-7xl font-bold leading-tight mb-4 font-allura italic text-white"
        >
          {{ recipe.title }}
        </h1>

        <!-- Quick stats -->
        <div class="flex flex-wrap items-center gap-6 mt-6">
          <div v-if="recipe.calories" class="flex items-center gap-2">
            <span class="text-primary">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M11 21H5a2 2 0 01-2-2V5a2 2 0 012-2h6v18zm2 0V3h6a2 2 0 012 2v14a2 2 0 01-2 2h-6z"
                />
              </svg>
            </span>
            <span class="text-white/80 text-sm"
              >{{ recipe.calories }} {{ t("kcal") }}</span
            >
          </div>
          <div v-if="recipe.prepTime" class="flex items-center gap-2">
            <span class="text-primary">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span class="text-white/80 text-sm">{{ recipe.prepTime }}</span>
          </div>
          <div v-if="recipe.servings" class="flex items-center gap-2">
            <span class="text-primary">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                />
              </svg>
            </span>
            <span class="text-white/80 text-sm"
              >{{ recipe.servings }} {{ t("servings") }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-8 md:px-16 py-16 max-w-5xl">
      <div class="grid md:grid-cols-3 gap-12">
        <!-- Description -->
        <div class="md:col-span-2 space-y-10">
          <div v-if="recipe.description">
            <h2
              class="text-xs tracking-widest uppercase text-primary font-semibold mb-4"
            >
              {{ t("About this dish") }}
            </h2>
            <p class="text-white/70 text-lg leading-relaxed">
              {{ recipe.description }}
            </p>
          </div>

          <!-- Ingredients -->
          <div v-if="recipe.ingredients?.length">
            <h2
              class="text-xs tracking-widest uppercase text-primary font-semibold mb-6"
            >
              {{ t("Ingredients") }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(ingredient, i) in recipe.ingredients"
                :key="i"
                class="flex items-center gap-4 py-3 border-b border-white/10"
              >
                <span
                  class="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold"
                >
                  {{ Number(i) + 1 }}
                </span>
                <span class="text-white/80">{{ ingredient?.name }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Sidebar stats -->
        <div class="space-y-4">
          <h2
            class="text-xs tracking-widest uppercase text-primary font-semibold mb-6"
          >
            {{ t("Nutrition") }}
          </h2>

          <div
            v-for="stat in [
              { label: t('Calories'), value: recipe.calories, unit: t('kcal') },
              { label: t('Prep Time'), value: recipe.prepTime, unit: '' },
              { label: t('Servings'), value: recipe.servings, unit: '' },
            ].filter((s) => s.value)"
            :key="stat.label"
            class="flex items-center justify-between py-4 border-b border-white/10"
          >
            <span class="text-white/50 text-sm">{{ stat.label }}</span>
            <span class="text-white font-semibold"
              >{{ stat.value }} {{ stat.unit }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-shadow: 0 4px 32px rgba(0, 0, 0, 0.6);
}
</style>
