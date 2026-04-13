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

const t = useT();
</script>

<template>
  <section
    class="relative h-fit bg-cover bg-top"
    :style="{ backgroundImage: `url(${recipesData?.recipesBg})` }"
    id="Recipes"
  >
    <div class="absolute inset-0 bg-black/40 z-0" />
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

    <div class="relative z-10 block container mx-auto">
      <Swiper
        :modules="modules"
        :slides-per-view="'auto'"
        :space-between="24"
        :pagination="{ clickable: true }"
        :centered-slides="false"
        :breakpoints="{
          0: { slidesPerView: 'auto' },
          1280: { slidesPerView: 5 },
        }"
        class="awards-swiper"
      >
        <SwiperSlide
          v-for="slide in recipes"
          :key="slide.id"
          class="w-auto! max-w-55.5 h-auto! flex items-stretch"
        >
          <!-- card -->
          <div
            class="rounded-xl bg-white py-5 px-4 w-55.5 flex flex-col h-full"
          >
            <div class="flex flex-col items-center justify-between flex-1">
              <img
                :src="slide?.settings?.cardImage ?? slide?.settings?.image"
                alt=""
                class="size-41 object-cover rounded-full -mt-28 shadow-[0_9px_76px_0_rgba(0,0,0,0.65)] backdrop-blur-[330px]"
              />
              <h1
                class="text-lg font-semibold text-black mb-1 w-full text-center pt-6 line-clamp-1"
              >
                {{ slide?.name }}
              </h1>
              <p class="text-[#667583] w-full text-center line-clamp-5">
                {{ slide?.local?.description }}
              </p>
              <hr class="h-0.5 bg-[#DCDFE2] w-full my-3" />
              <p class="text-[#667583] w-full text-center">
                {{ slide?.local?.calories }}
              </p>
              <NuxtLink :to="`/${route?.params?.lang}/recipes/${slide?.id}`">
                <button
                   class="bg-gradient-primary border-none px-5.5 py-3 rounded-full font-semibold tracking-[0.3px] shadow-[0_6px_14px_rgba(14,165,183,0.25)] transition-all duration-200 ease-in-out cursor-pointer mt-3"
                >
                  {{ t("Ingredients") }}
                </button>
              </NuxtLink>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <!-- bottom -->
    <div
      class="absolute z-10 bottom-0 w-full h-20 bg-linear-to-t from-white to-transparent"
    ></div>
  </section>
</template>

<style scoped>
.awards-swiper {
  padding-top: 14rem;
  padding-bottom: 7rem;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 81%;
  display: flex;
  align-items: stretch;
}

.awards-swiper :deep(.swiper-pagination) {
  bottom: 0;
}

.awards-swiper :deep(.swiper-wrapper) {
  align-items: stretch;
}

.awards-swiper :deep(.swiper-slide) {
  height: auto;
}

.awards-swiper :deep(.swiper-pagination-bullet) {
  background-color: #667583;
  opacity: 0.5;
}

.awards-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}
</style>
