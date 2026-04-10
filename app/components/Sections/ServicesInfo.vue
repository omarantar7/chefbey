<script setup lang="ts">
import quotation from "@/assets/images/quotation.png";
import quotation2 from "@/assets/images/quotation2.png";

type Props = {
  data: {
    image: string;
    description: string;
  };
};
const { data = { image: "", description: "" } } = defineProps<Props>();
</script>

<template>
  <div class="bg-white py-16 overflow-hidden">
    <section class="relative md:min-h-150">
      <!-- Background Image -->
      <div
        class="absolute inset-0"
        :style="{
          backgroundImage: `url(${data?.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }"
      ></div>

      <!-- Content -->
      <div class="relative z-10 md:max-w-400 mx-auto px-4 py-12 md:py-40">
        <div
          class="w-full max-w-sm mx-auto md:max-w-152.75 md:ml-auto md:mr-10 md:mx-0 rounded-[20px] bg-[rgba(6,33,36,0.75)] py-6 px-5 md:py-8.5 md:px-9 relative"
        >
          <!-- Quotation marks - smaller on mobile -->
          <img
            :src="quotation"
            class="absolute w-8 h-8 -top-4 -left-4 md:w-auto md:h-auto md:-top-14 md:-left-14"
            alt="quotation"
          />

          <p class="text-white text-[18px] md:text-[24px] leading-relaxed">
            {{ data?.description }}
          </p>

          <img
            :src="quotation2"
            class="absolute w-8 h-8 -bottom-4 -right-4 md:w-auto md:h-auto md:-bottom-14 md:-right-14"
            alt="quotation"
          />
        </div>
      </div>
    </section>
  </div>
</template>
