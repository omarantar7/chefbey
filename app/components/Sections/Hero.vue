<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import YoutubeVideo from "./YoutubeVideo.vue";

const { data = [] } = defineProps<{ data: any }>();

const carouselImages = computed(() => {
  return data?.heroImages ?? [];
});

const carouselRef = ref<HTMLElement | null>(null);
const isModalOpen = ref(false);
let intervalId: number | null | any = null;

onMounted(async () => {
  const carousel = carouselRef.value;
  if (!carousel) return;

  const scrollHeight = carousel.scrollHeight / 2;

  intervalId = setInterval(() => {
    if (carousel.scrollTop >= scrollHeight) {
      carousel.scrollTop = 0;
    } else {
      carousel.scrollTop += 1;
    }
  }, 30);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const route = useRoute();
const t = useT();
</script>

<template>
  <div
    class="relative bg-cover bg-top py-8 md:py-12 overflow-hidden"
    :style="{ backgroundImage: `url(${data?.bgHeroImage})` }"
  >
    <div class="absolute inset-0 bg-black/30 z-0" />

    <div
      class="container mx-auto pt-40 md:pt-0 px-4 py-12 lg:py-20 lg:pt-32 relative z-10"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 lg:space-y-8">
          <div>
            <h1 class="text-5xl lg:text-7xl font-bold text-white mb-4">
              <span class="font-allura italic font-normal text-primary">{{
                data?.heroName ?? `Chef Bey`
              }}</span>
              <span class="block mt-2">{{ data?.title }}</span>
            </h1>

            <p class="text-lg text-[#fafafa] leading-relaxed mt-6">
              {{ data?.description }}
            </p>
          </div>

          <div class="flex flex-wrap gap-4">
            <NuxtLink
              :to="`/${route.params?.lang}/#contactus`"
              :aria-label="t('Contact me - go to contact section')"
              class="bg-gradient-primary flex items-center justify-center py-4.5 md:py-2.5 px-9 rounded-full text-white hover:bg-[#128597] transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              {{ t("Contact me") }}
            </NuxtLink>

            <button
              type="button"
              :aria-label="t('Watch a day in my life video')"
              @click="isModalOpen = true"
              class="bg-transparent backdrop-blur-sm text-white cursor-pointer p-4.5 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 border border-white/30 hover:bg-white/10 hover:text-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              {{ t("A day in my life") }}
            </button>

            <UModal v-model:open="isModalOpen">
              <template #content>
                <ClientOnly>
                  <YoutubeVideo
                    :videoId="data?.youtubeLink"
                    v-if="data?.youtubeLink"
                    v-once
                  />
                </ClientOnly>
              </template>
            </UModal>
          </div>

          <div class="flex justify-center md:justify-start gap-8 pt-8">
            <div class="relative">
              <div
                class="absolute -left-4 top-0 w-20 h-20 bg-yellow-300 rounded-full opacity-30 blur-xl"
              ></div>
              <!-- Wrap number + label together so context is clear -->
              <div
                role="img"
                :aria-label="`${data?.experienceNumber} ${t('years of experience')}`"
              >
                <h3 class="text-5xl font-bold text-[#fafafa] relative z-10">
                  {{ data?.experienceNumber ?? "—" }}+
                </h3>
              </div>
              <p class="text-gray-300 font-medium mt-1 relative z-10">
                {{ data?.experienceLabel ?? "—" }}
              </p>
            </div>

            <div class="relative">
              <div
                class="absolute -left-4 top-0 w-20 h-20 bg-orange-300 rounded-full opacity-30 blur-xl"
              ></div>
              <h3 class="text-5xl font-bold text-[#fafafa] relative z-10">
                {{ data?.dishesNumber ?? "—" }}+
              </h3>
              <p class="text-gray-300 font-medium mt-1 relative z-10">
                {{ data.dishesLabel }}
              </p>
            </div>
          </div>
        </div>

        <div class="relative flex justify-center lg:justify-end">
          <div
            ref="carouselRef"
            class="w-80 h-150 overflow-hidden rounded-3xl shadow-2xl relative"
            style="scroll-behavior: auto"
          >
            <div class="space-y-4">
              <div
                v-for="(img, index) in [...carouselImages, ...carouselImages]"
                :key="index"
                class="w-full h-48 rounded-2xl overflow-hidden shadow-lg"
              >
                <img
                  :src="img"
                  :alt="`Dish ${index + 1}`"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          <div
            class="absolute -top-6 -right-6 w-24 h-24 linear-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl"
          ></div>
          <div
            class="absolute -bottom-6 -left-6 w-32 h-32 linear-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-20 blur-2xl"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="absolute z-10 bottom-0 w-full h-20 bg-linear-to-t from-white to-transparent"
    ></div>
  </div>
</template>
