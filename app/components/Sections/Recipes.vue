<script setup lang="ts">
import Title from "../UI/Title.vue";
import vector from "@/assets/images/vector1.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const { recipesData = [] } = defineProps<{ recipesData: any }>();

const modules = [Pagination];

const route = useRoute();

const { data: recipes }: any = await useFetch("/api/page/contents/recipes", {
  params: { lang: route?.params?.lang },
});

</script>

<template>
  <section
    class="relative h-fit bg-cover bg-top pb-10"
    :style="{ backgroundImage: `url(${recipesData?.recipesBg})` }"
    id="Recipes"
  >
    <div class="absolute inset-0 bg-black/40 z-0 backdrop-blur-[3px]" />

    <!-- top -->
    <div
      class="relative z-10 flex items-center justify-center w-full h-72 md:py-12 bg-cover bg-top"
      :style="{ backgroundImage: `url(${vector})` }"
    >
      <Title
        :title="recipesData?.recipesTitle"
        :sub-title="recipesData?.recipesDescr"
      >
        <template #icon>
          <span
            class="icon-[fluent--service-bell-16-filled] text-primary"
          ></span>
        </template>
      </Title>
    </div>

    <div class="relative z-10 container mx-auto px-4 pt-44 pb-8">
      <Swiper
        :modules="modules"
        :slides-per-view="1"
        :slides-per-group="1"
        :space-between="24"
        :pagination="{ el: '.recipes-pagination', clickable: true }"
        :centered-slides="false"
        :breakpoints="{
          640: { slidesPerView: 2, slidesPerGroup: 2 },
          1024: { slidesPerView: 3, slidesPerGroup: 3 },
          1440: { slidesPerView: 4, slidesPerGroup: 4 },
        }"
        class="recipes-swiper"
      >
        <SwiperSlide
          v-for="slide in recipes"
          :key="slide.id"
          class="h-auto! flex items-stretch"
        >
          <LazyCard :data="slide" :isNews="false" />
        </SwiperSlide>
      </Swiper>

      <div
        v-if="recipes?.length > 1"
        class="recipes-pagination flex justify-center gap-0.5 mt-10"
      ></div>
    </div>

    <div
      class="absolute z-10 bottom-0 w-full h-20 bg-linear-to-t from-white to-transparent"
    ></div>
  </section>
</template>

<style scoped>
@reference "~/assets/css/tailwind.css";

.recipes-swiper {
  width: 100%;
}

.recipes-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
}

.recipes-swiper :deep(.swiper-slide) {
  height: auto;
}

.recipes-pagination :deep(.swiper-pagination-bullet) {
  @apply bg-primary/30 opacity-100;
}

.recipes-pagination :deep(.swiper-pagination-bullet-active) {
  @apply bg-primary opacity-100;
}
</style>