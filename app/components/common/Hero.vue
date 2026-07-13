<script lang="ts" setup>
import { parseTitle } from "~/helper/filters/WordColors";

const { data = [], btnContent } = defineProps<{
  data: any;
  btnContent?: string;
}>();

// const route = useRoute();
const t = useT();

const titleHtml = computed(() => parseTitle(data?.title));
</script>
<template>
  <div
    class="relative bg-cover bg-top py-8 md:py-12 overflow-hidden"
    :style="{ backgroundImage: `url(${data?.bgHeroImage})` }"
  >
    <div class="absolute inset-0 bg-black/30 z-0" />

    <div
      class="container mx-auto pt-40 md:pt-0 px-4 py-12 lg:py-20 relative z-10"
    >
      <div class="grid lg:grid-cols-2 gap-12 items-center md:min-h-145">
        <div class="space-y-6 lg:space-y-8">
          <div>
            <h1
              class="text-5xl lg:text-7xl font-bold text-white mb-4"
              v-html="titleHtml"
            ></h1>

            <p class="text-lg text-[#fafafa] leading-relaxed mt-6">
              {{ data?.description }}
            </p>
            <!-- <NuxtLink
              class="bg-gradient-primary text-white flex w-fit mt-8 items-center justify-center py-2.5 px-6 rounded-full transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              :aria-label="t('Go to contact section')"
              :to="`/${route.path}/#ContactForm`"
              v-if="btnContent"
            >
              {{ t(`${btnContent}`) }} &nbsp;
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.07107 1.29921L0.999997 8.37028M3.42048 1.00005L8.07107 1.29921L8.37023 5.9498"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </NuxtLink> -->
          </div>
        </div>

        <div class="relative flex justify-center lg:justify-end"></div>
      </div>
    </div>
    <div
      class="absolute z-10 bottom-0 w-full h-20 bg-linear-to-t from-white to-transparent"
    ></div>
  </div>
</template>
