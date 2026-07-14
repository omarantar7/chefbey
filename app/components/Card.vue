<script setup lang="ts">
interface CardData {
  id?: number;
  name?: string;
  settings?: {
    image?: string;
    youtubeUrl?: string;
    cardImage?: string;
    isVideo?: boolean;
  };
  local?: {
    title?: string | null;
    name?: string;
    description?: string | null;
    calories?: string | null;
    date?: string;
  };
}

const { data, isNews = true } = defineProps<{
  data: CardData;
  isNews?: boolean;
}>();
const route = useRoute();
const image = computed(() => data?.settings?.image);

const title = computed(
  () => data?.local?.title || data?.local?.name || data?.name,
);

const description = computed(() => data?.local?.description);

const calories = computed(() => data?.local?.calories);

const isVideoCard = computed(
  () => isNews && data?.settings?.isVideo && data?.settings?.youtubeUrl,
);

const youtubeEmbedUrl = computed(
  () => `https://www.youtube.com/embed/${data?.settings?.youtubeUrl}`,
);

const t = useT();
</script>

<template>
  <div
    class="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-md"
  >
    <div class="relative shrink-0">
      <LazyUIYoutubeEmbed
        v-if="isVideoCard"
        :url="data?.settings?.youtubeUrl"
        :title="title"
        class="w-full h-65!"
      />

      <img v-else :src="image" :alt="title" class="w-full h-65 object-cover" />

      <div
        v-if="!isNews && calories"
        class="absolute bg-white/80 text-black text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.25)]"
        :class="route.params.lang==='ar' ? 'top-3 left-3' : 'top-3 right-3'"
          >
        {{ calories }}
        <svg
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.5 5.52901C8.5 4.73801 9.553 4.52801 9.832 5.26901C10.508 7.05901 11 8.66301 11 9.52901C11 10.8551 10.4732 12.1269 9.53553 13.0645C8.59785 14.0022 7.32608 14.529 6 14.529C4.67392 14.529 3.40215 14.0022 2.46447 13.0645C1.52678 12.1269 1 10.8551 1 9.52901C1 8.59901 1.568 6.81801 2.322 4.86601C3.297 2.33801 3.785 1.07401 4.388 1.00601C4.58 0.984011 4.791 1.02301 4.963 1.11301C5.5 1.39301 5.5 2.77201 5.5 5.52901C5.5 5.92684 5.65804 6.30837 5.93934 6.58967C6.22064 6.87098 6.60218 7.02901 7 7.02901C7.39782 7.02901 7.77936 6.87098 8.06066 6.58967C8.34196 6.30837 8.5 5.92684 8.5 5.52901Z"
            stroke="black"
            stroke-width="2"
          />
          <path
            d="M4.99992 14.529L4.73692 13.872C4.51249 13.3126 4.4408 12.7037 4.52919 12.1074C4.61757 11.5112 4.86286 10.9492 5.23992 10.479C5.33107 10.365 5.44671 10.273 5.57827 10.2097C5.70983 10.1464 5.85394 10.1136 5.99992 10.1136C6.1459 10.1136 6.29001 10.1464 6.42157 10.2097C6.55313 10.273 6.66877 10.365 6.75992 10.479C7.52592 11.437 7.71792 12.733 7.26292 13.872L6.99992 14.529"
            stroke="black"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>

    <div class="flex flex-col flex-1 pt-3 p-5">
      <span v-if="isNews" class="text-sm text-gray-400 mb-2">
        {{ data?.local?.date }}
      </span>

      <h3 class="font-bold text-lg text-black leading-snug line-clamp-1 mb-2">
        {{ title }}
      </h3>

      <p class="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
        {{ description }}
      </p>

      <NuxtLink
        :to="`/${route?.params?.lang}/${isNews ? 'news' : 'recipes'}/${data?.id}`"
        class="bg-gradient-primary text-white flex items-center justify-center py-2.5 px-6 rounded-full transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none text-sm font-bold"
      >
        {{ t?.("Read More") ?? "Read More" }} &nbsp;
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ '-rotate-90': route.params.lang === 'ar' }"
        >
          <path
            d="M8.07107 1.29921L0.999997 8.37028M3.42048 1.00005L8.07107 1.29921L8.37023 5.9498"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>
    </div>
  </div>
</template>
