<script setup lang="ts">
import Title from "../UI/Title.vue";
import vector from "@/assets/images/vector1.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const { recipesData = [] } = defineProps<{ recipesData: any }>();

const modules = [Pagination];

const { data } = await useFetch("/api/page/contents/recipes");

console.log("recipe", data.value);

const recipes = shallowRef([
  {
    id: Math.random(),
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    title: "Red Hot BBQ Chicken Wings",
    description:
      "Juicy chicken wings grilled to perfection, coated in a smoky BBQ glaze.",
    freeText: "120 calories",
  },
  {
    id: Math.random(),
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    title: "Red Hot BBQ Chicken Wings",
    description:
      "Juicy chicken wings grilled to perfection, coated in a smoky BBQ glaze.",
    freeText: "120 calories",
  },
  {
    id: Math.random(),
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    title: "Red Hot BBQ Chicken Wings",
    description:
      "Juicy chicken wings grilled to perfection, coated in a smoky BBQ glaze.",
    freeText: "120 calories",
  },
  {
    id: Math.random(),
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    title: "Red Hot BBQ Chicken Wings",
    description:
      "Juicy chicken wings grilled to perfection, coated in a smoky BBQ glaze.",
    freeText: "120 calories",
  },
  {
    id: Math.random(),
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    title: "Red Hot BBQ Chicken Wings",
    description:
      "Juicy chicken wings grilled to perfection, coated in a smoky BBQ glaze.",
    freeText: "120 calories",
  },
]);
</script>

<template>
  <section
    class="relative min-h-screen h-fit bg-cover bg-top"
    :style="{ backgroundImage: `url(${recipesData?.recipesBg})` }"
    id="Recipes"
  >
    <div class="absolute inset-0 bg-black/40 z-0" />
    <!-- top -->
    <div
      class="relative z-10 flex items-center justify-center w-full h-72 bg-cover bg-top"
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
          class="w-auto! max-w-55.5 flex items-stretch"
        >
          <!-- card -->
          <div class="rounded-xl bg-white py-5 px-4 w-55.5 flex flex-col">
            <div class="flex flex-col items-center justify-between flex-1">
              <img
                :src="slide?.image"
                alt=""
                class="size-41 object-cover rounded-full -mt-28 shadow-[0_9px_76px_0_rgba(0,0,0,0.65)]"
              />
              <h1
                class="text-lg font-semibold text-black mb-1 w-full text-center pt-6"
              >
                {{ slide?.title }}
              </h1>
              <p class="text-[#667583] w-full text-center">
                {{ slide?.description }}
              </p>
              <hr class="h-0.5 bg-[#DCDFE2] w-full my-3" />
              <p class="text-[#667583] w-full text-center">
                {{ slide?.freeText }}
              </p>
              <button
                class="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform mt-3"
              >
                Ingredients
              </button>
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

.awards-swiper :deep(.swiper-pagination-bullet) {
  background-color: #667583;
  opacity: 0.5;
}

.awards-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
}
</style>
