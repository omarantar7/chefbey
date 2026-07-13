<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { parseTitle } from "~/helper/filters/WordColors";

definePageMeta({ props: true });

const { id } = defineProps<{ id: string }>();
const route = useRoute();
const lang = computed(() => (route.params.lang as string) ?? "en");
const t = useT();

const modules = [Pagination];

interface NewsData {
  id?: number;
  name?: string;
  settings?: {
    image?: string;
    youtubeUrl?: string;
    isVideo?: boolean;
  };
  local?: {
    name?: string;
    description?: string | null;
    date?: string;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    robots?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
  };
}

const { data }: any = await useFetch<NewsData>(
  `/api/page/contents/news/${id}`,
  { query: { lang } },
);

const news = computed(() => ({
  title: data.value?.name ?? null,
  description: data.value?.local?.description,
  date: data.value?.local?.date,
  image: data.value?.settings?.image,
  youtubeUrl: data.value?.settings?.youtubeUrl,
  isVideo: data.value?.settings?.isVideo,
}));

const { data: latestRaw } = await useFetch<NewsData[]>(
  "/api/page/contents/news",
  { query: { lang, limit: 4 } },
);

const latestNews = computed(() =>
  (latestRaw?.value ?? [])
    .filter((item) => String(item.id) !== String(id))
    .slice(0, 3),
);

const textHtml = computed(() => parseTitle(news.value.description));

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
  <div class="min-h-screen bg-white text-gray-900 pt-30">
    <!-- Hero Image / Video -->
    <div
      v-gsap.from="{
        opacity: 0,
        scale: 1.03,
        duration: 1,
        ease: 'power2.out',
      }"
      class="relative w-[90%] lg:w-300 mx-auto h-[50vh] md:h-[70vh] rounded-[26px] bg-white"
    >
      <LazyUIYoutubeEmbed
        v-if="news.isVideo && news.youtubeUrl"
        :url="news.youtubeUrl"
        :title="news.title"
        class="rounded-[26px]"
      />
      <img
        v-else-if="news.image"
        :src="news.image"
        :alt="news.title"
        class="w-full h-full object-cover rounded-[26px]"
      />

      <span
        v-if="news.date"
        class="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-black text-sm font-semibold px-4 py-2 rounded-full shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)]"
      >
        {{ news.date }}
      </span>
    </div>

    <div
      v-gsap.from="{ opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }"
      class="max-w-302 mx-auto px-4 pt-10 pb-16 md:pt-14 md:pb-20"
    >
      <h1
        class="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
      >
        {{ news.title }}
      </h1>
      <p
        v-if="news.description"
        class="text-gray-500 text-lg leading-relaxed whitespace-pre-line"
        v-html="textHtml"
      ></p>
    </div>

    <div v-if="latestNews.length" class="bg-gray-50 py-16 md:py-20">
      <div
        v-gsap.from="{
          opacity: 0,
          y: 30,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { start: 'top 90%' },
        }"
      >
        <h2 class="text-2xl font-bold text-gray-800 mb-10 text-center">
          {{ t("Latest News") }}
        </h2>

        <Swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="24"
          :pagination="latestNews.length > 1 ? { clickable: true } : false"
          :breakpoints="{
            640: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }"
          class="latest-news-swiper"
        >
          <SwiperSlide
            v-for="item in latestNews"
            :key="item.id"
            class="h-auto! flex items-stretch"
          >
            <Card :data="item" :is-news="true" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<style scoped>
.latest-news-swiper {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 3.5rem;
  max-width: 77rem;
  margin-inline: auto;
  display: flex;
  align-items: stretch;
}

.latest-news-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
}

.latest-news-swiper :deep(.swiper-slide) {
  height: auto;
}

.latest-news-swiper :deep(.swiper-pagination) {
  bottom: 0;
}

.latest-news-swiper :deep(.swiper-pagination-bullet) {
  background-color: var(--color-primary, #0ea5b7);
  opacity: 0.5;
}

.latest-news-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}
</style>
