<script setup lang="ts">
definePageMeta({ props: true });

const { id } = defineProps<{ id: string }>();
const route = useRoute();
const lang = computed(() => (route.params.lang as string) ?? "en");

const { data }: any = await useFetch(`/api/page/contents/recipes/${id}`, {
  query: { lang },
});

const recipe = computed(() => ({
  image: data.value?.settings?.image,
  title: data.value?.name,
  description: data.value?.local?.description,
  calories: data.value?.local?.calories,
  prepTime: data.value?.local?.prepTime,
  servings: data.value?.local?.servings,
  ingredients: data.value?.local?.ingredients ?? [],
  instructions: data.value?.local?.instructions ?? [],
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
  <div class="min-h-screen bg-white text-gray-900 pt-16">
    <!-- Title + Description -->
    <div
      v-gsap.from="{ opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }"
      class="max-w-3xl mx-auto text-center pt-16 pb-8 px-4"
    >
      <h1
        class="text-5xl md:text-7xl font-bold font-allura italic text-primary mb-4"
      >
        {{ recipe.title }}
      </h1>
      <p
        v-if="recipe.description"
        class="text-gray-500 text-base leading-relaxed"
      >
        {{ recipe.description }}
      </p>
    </div>

    <!-- Hero Image -->
    <div
      v-gsap.from="{ opacity: 0, scale: 0.97, duration: 1, ease: 'power2.out' }"
      class="max-w-6xl mx-auto px-4 mb-10"
    >
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="recipe.title"
        class="w-full max-h-[70vh] object-cover rounded-2xl shadow-lg"
      />
    </div>

    <!-- Stats Row -->
    <div
      v-gsap.from="{
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { start: 'top 90%' },
      }"
      class="max-w-6xl mx-auto px-4 mb-12"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-if="recipe.prepTime"
          class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-primary"
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
          </div>
          <div>
            <p
              class="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
            >
              {{ t("Prep Time") }}
            </p>
            <p class="text-sm font-bold text-gray-800">{{ recipe.prepTime }}</p>
          </div>
        </div>

        <div
          v-if="recipe.servings"
          class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-primary"
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
          </div>
          <div>
            <p
              class="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
            >
              {{ t("Servings") }}
            </p>
            <p class="text-sm font-bold text-gray-800">{{ recipe.servings }}</p>
          </div>
        </div>

        <div
          v-if="recipe.calories"
          class="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
        >
          <div
            class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M11 21H5a2 2 0 01-2-2V5a2 2 0 012-2h6v18zm2 0V3h6a2 2 0 012 2v14a2 2 0 01-2 2h-6z"
              />
            </svg>
          </div>
          <div>
            <p
              class="text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
            >
              {{ t("Calories") }}
            </p>
            <p class="text-sm font-bold text-gray-800">{{ recipe.calories }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Ingredients + Instructions -->
    <div class="max-w-6xl mx-auto px-4 pb-24">
      <div class="grid md:grid-cols-2 gap-12">
        <!-- Ingredients — slide in from left -->
        <div
          v-if="recipe.ingredients?.length"
          v-gsap.from="{
            opacity: 0,
            x: -60,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { start: 'top 85%' },
          }"
        >
          <h2 class="text-xl font-bold text-gray-800 mb-6">
            {{ t("Ingredients") }}
          </h2>
          <ul class="space-y-3">
            <li
              v-for="(ingredient, i) in recipe.ingredients"
              :key="i"
              v-gsap.from="{
                opacity: 0,
                x: -20,
                duration: 0.4,
                delay: Number(i) * 0.07,
                ease: 'power1.out',
                scrollTrigger: { start: 'top 90%' },
              }"
              class="flex items-center gap-3"
            >
              <span
                class="w-2 h-2 rounded-full shrink-0"
                :class="ingredient?.name ? 'bg-primary' : 'bg-gray-200'"
              />
              <span
                :class="
                  ingredient?.name
                    ? 'text-gray-800 text-sm'
                    : 'text-gray-300 text-sm line-through'
                "
              >
                {{ ingredient?.name || "—" }}
              </span>
            </li>
          </ul>
        </div>

        <!-- Cooking Instructions — slide in from right -->
        <div
          v-if="recipe.instructions?.length"
          v-gsap.from="{
            opacity: 0,
            x: 60,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { start: 'top 85%' },
          }"
          class="bg-gray-50 rounded-xl p-4 border border-gray-100"
        >
          <h2 class="text-xl font-bold text-gray-800 mb-6">
            {{ t("Cooking Instructions") }}
          </h2>
          <ol class="space-y-6">
            <li
              v-for="(step, i) in recipe.instructions"
              :key="i"
              v-gsap.from="{
                opacity: 0,
                x: 20,
                duration: 0.4,
                delay: Number(i) * 0.07,
                ease: 'power1.out',
                scrollTrigger: { start: 'top 90%' },
              }"
              class="flex gap-4"
            >
              <span
                class="w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0 mt-0.5"
              >
                {{ Number(i) + 1 }}
              </span>
              <div>
                <h3 class="font-bold text-gray-800 mb-1">{{ step?.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed">
                  {{ step?.description }}
                </p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
}
</style>
