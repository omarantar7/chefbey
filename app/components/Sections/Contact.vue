<script setup lang="ts">
import Title from "../UI/Title.vue";
import birdBg from "@/assets/images/bird-bg.webp";

const { data = [] } = defineProps<{ data: any }>();
</script>

<template>
  <section class="h-fit relative bg-white" id="contactus">
    <div
      class="absolute inset-0 bg-cover opacity-30"
      :style="{ backgroundImage: `url(${birdBg})` }"
    ></div>
    <div class="container mx-auto py-12 md:py-20 px-4 relative z-10">
      <div class="flex items-center justify-center text-center pb-12">
        <Title :title="data?.contactTitle" :sub-title="data?.contactDescr">
          <template #icon>
            <span
              class="icon-[fluent--service-bell-16-filled] text-primary"
            ></span>
          </template>
        </Title>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <LazyContactForm />

        <!-- Image Section -->
        <div class="w-full h-full">
          <div
            class="relative w-full rounded-2xl overflow-hidden shadow-2xl h-full"
          >
            <img
              :src="data?.contactImage"
              :alt="`${data?.contactDescr} Image`"
              class="w-full object-top object-cover h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>