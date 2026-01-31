<script setup lang="ts">
import { ref } from "vue";
import Title from "../UI/Title.vue";
import vector from "@/assets/images/vector1.png";
import vector2 from "@/assets/images/bottom-wave.png";
import serviceBg from "@/assets/images/services-bg.png";

const cards = shallowRef([
  {
    id: Math.random(),
    title: "Consulting",
    description:
      "Explore a crafted menu of fresh, flavorful dishes designed to satisfy every taste.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    id: Math.random(),
    title: "Consulting",
    description:
      "Explore a crafted menu of fresh, flavorful dishes designed to satisfy every taste.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    id: Math.random(),
    title: "Consulting",
    description:
      "Explore a crafted menu of fresh, flavorful dishes designed to satisfy every taste.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
  {
    id: Math.random(),
    title: "Consulting",
    description:
      "Explore a crafted menu of fresh, flavorful dishes designed to satisfy every taste.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },
]);
</script>

<template>
  <section
    class="relative min-h-screen h-fit bg-cover bg-top"
    :style="{ backgroundImage: `url(${serviceBg})` }"
    id="Services"
  >
    <!-- top -->
    <div
      class="flex items-center justify-center w-full h-52 bg-cover bg-top"
      :style="{ backgroundImage: `url(${vector})` }"
    >
      <Title title="Services" sub-title="Our Services">
        <template #icon>
          <span
            class="icon-[fluent--service-bell-16-filled] text-primary"
          ></span>
        </template>
      </Title>
    </div>

    <div
      class="flex flex-col md:flex-row justify-center items-center gap-3 container mx-auto py-60"
    >
      <div class="max-w-[600px] flex flex-wrap flex-none gap-10 justify-center">
        <div
          class="flex flex-wrap gap-10 border-2 border-primary rounded-xl bg-white w-44 md:w-64"
          v-for="card in cards"
          :key="card.id"
        >
          <div class="flex flex-col place-items-center py-8 px-2">
            <img
              :src="card?.image"
              alt=""
              class="size-16 object-cover object-center rounded-sm"
            />
            <h1 class="text-black text-xl pt-6.5 pb-2 text-center w-full">
              {{ card?.title }}
            </h1>
            <p class="text-[#545454] text-center w-full">
              {{ card?.description }}
            </p>
          </div>
        </div>
      </div>
      <p
        class="text-white text-4xl font-bold text-center md:text-left md:max-w-[50%]"
      >
        {{
          `Abed Alrahman Antar, known as "Chefbey", is a Lebanese chef and
        consultant celebrated for his award-winning Turkish and Lebanese
        cuisine. His greatest achievement is putting smiles on faces through
        food.`
        }}
      </p>
    </div>
    <!-- bottom -->
    <div
      class="w-[101%] h-24 bg-cover bg-top absolute -left-1 bottom-0"
      :style="{ backgroundImage: `url(${vector2})` }"
    ></div>
  </section>
</template>
