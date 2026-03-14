<script setup lang="ts">
import Title from "../UI/Title.vue";
import vector from "@/assets/images/vector1.png";
import vector2 from "@/assets/images/bottom-wave.png";

const { data = [] } = defineProps<{ data: any }>();
</script>

<template>
  <section
    class="relative min-h-screen h-fit bg-cover bg-top"
    :style="{ backgroundImage: `url(${data?.servicesBg})` }"
    id="Services"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/40 z-0" />

    <!-- top -->
    <div
      class="relative z-10 flex items-center justify-center w-full h-52 bg-cover bg-top"
      :style="{ backgroundImage: `url(${vector})` }"
    >
      <Title :title="data?.servicesTitle" :sub-title="data?.servicesDescr">
        <template #icon>
          <span class="icon-[fluent--service-bell-16-filled] text-primary"></span>
        </template>
      </Title>
    </div>

    <div class="relative z-10 flex flex-col md:flex-row justify-center items-center gap-8 container mx-auto py-20 md:py-60 px-4">
      
      <!-- Cards grid -->
      <div class="w-full md:max-w-[600px] grid grid-cols-2 md:flex md:flex-wrap gap-4 md:gap-10 justify-center">
        <div
          class="flex flex-wrap gap-10 border-2 border-primary rounded-xl bg-white w-full md:w-64"
          v-for="(card, index) in data?.services"
          :key="index"
        >
          <div class="flex flex-col place-items-center py-6 px-3 w-full">
            <img
              :src="card?.image"
              alt=""
              class="size-12 md:size-16 object-cover object-center rounded-full"
            />
            <h1 class="text-black text-base md:text-xl pt-4 pb-1 text-center w-full font-semibold">
              {{ card?.title }}
            </h1>
            <p class="text-[#545454] text-center w-full text-sm md:text-base">
              {{ card?.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Sub description -->
      <p class="text-white text-2xl md:text-4xl font-bold text-center md:text-left md:max-w-[50%] px-4">
        {{ data?.servicesSubDescr }}
      </p>
    </div>

    <!-- bottom -->
    <div
      class="relative z-10 w-[101%] h-24 bg-cover bg-top absolute bottom-0"
      :class="$route?.params?.lang === 'ar' ? '-right-1' : '-left-1'"
      :style="{ backgroundImage: `url(${vector2})` }"
    ></div>
  </section>
</template>
