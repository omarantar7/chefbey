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
    <section class="h-fit relative bg-white py-16">
      <div
        class="absolute inset-0 bg-cover"
        :style="{ backgroundImage: `url(${data?.image})` }"
      ></div>
      <div class="md:max-w-400 mx-auto">
        <div
          class="max-w-152.75 rounded-[20px] bg-[rgba(6,33,36,0.75)] py-8.5 px-9 relative ml-auto md:mr-10"
        >
          <img
            :src="quotation"
            class="absolute -top-14 -left-14"
            alt="quotation"
          />
          <p class="text-white md:text-[26px]">{{ data?.description }}</p>
          <img
            :src="quotation2"
            class="absolute -bottom-14 -right-14"
            alt="quotation"
          />
        </div>
      </div>
    </section>
  </div>
</template>
