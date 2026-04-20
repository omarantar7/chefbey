<script setup lang="ts">
import Title from "../UI/Title.vue";
import birdBg from "@/assets/images/bird-bg.png";
import birdBg2 from "@/assets/images/bird-bg2.png";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

const { data = {}, isServices = false } = defineProps<{
  data: any;
  isServices?: boolean;
}>();

const modules = [Pagination];
</script>

<template>
  <section
    class="h-fit relative bg-white"
    :id="isServices ? 'Services' : 'Awards'"
  >
    <!-- Background with opacity -->
    <div
      class="absolute inset-0 bg-cover"
      :class="isServices ? 'opacity-25' : 'opacity-50'"
      :style="{ backgroundImage: `url(${isServices ? birdBg2 : birdBg})` }"
    ></div>

    <!-- Content -->
    <div class="container mx-auto py-12 md:py-30 px-4 relative z-10">
      <div class="flex items-center justify-center text-center pb-8">
        <Title :title="data?.awardsTitle" :sub-title="data?.awardsDescr">
          <template #icon>
            <span
              class="icon-[fluent--service-bell-16-filled] text-primary"
            ></span>
          </template>
        </Title>
      </div>

      <!-- Mobile Swiper (below md breakpoint) -->
      <div class="block md:hidden">
        <Swiper
          :modules="modules"
          :slides-per-view="1.25"
          :space-between="12"
          :pagination="{ clickable: true }"
          :centered-slides="false"
          class="awards-swiper"
        >
          <SwiperSlide
            v-for="(slide, index) in data?.awards"
            :key="index"
            class="h-auto!"
          >
            <div
              class="rounded-xl border border-[#8080804d] bg-white py-7 px-6 h-full"
            >
              <div class="flex flex-col items-center justify-center">
                <img
                  :src="slide?.image"
                  alt=""
                  class="size-42"
                  :class="
                    isServices ? 'rounded-full object-cover' : 'object-contain'
                  "
                />
                <h1
                  class="text-lg font-semibold text-black mb-1 mt-6 w-full text-center"
                >
                  {{ slide?.title }}
                </h1>
                <p class="text-[#667583] w-full text-center">
                  {{ slide?.description }}
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- Desktop Grid (md breakpoint and above) -->
      <div
        class="hidden md:flex flex-wrap justify-center items-stretch"
        :class="isServices ? 'gap-6' : 'gap-3'"
      >
        <div
          v-for="(slide, index) in data?.awards"
          :key="index"
          class="rounded-xl bg-white py-7 px-6 w-full md:w-auto shadow-md flex flex-col"
          :class="isServices ? 'max-w-65' : 'max-w-56'"
        >
          <div class="flex flex-col items-center justify-center flex-1">
            <img
              :src="slide?.image"
              alt=""
              class="object-contain"
              :class="isServices ? 'size-25 rounded-full' : 'size-42'"
            />
            <h1
              class="text-lg font-semibold text-black mb-1 mt-6 w-full text-center"
            >
              {{ slide?.title }}
            </h1>
            <p class="text-[#667583] w-full text-center">
              {{ slide?.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.awards-swiper {
  padding-bottom: 40px;
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
