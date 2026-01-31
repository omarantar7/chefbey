<script setup lang="ts">
import { ref } from "vue";
import Title from "../UI/Title.vue";
import vector from "@/assets/images/vector1.png";
import serviceBg from "@/assets/images/services-bg.png";

// Dynamic services data
const services = ref([
  {
    id: 2,
    icon: "👨‍🍳",
    title: "Culinary Consulting",
    description:
      "Expert guidance for restaurants and food businesses on menu development, kitchen operations, and culinary excellence.",
  },
  {
    id: 3,
    icon: "🎓",
    title: "Cooking Classes",
    description:
      "Learn authentic Turkish and Lebanese cooking techniques through hands-on masterclasses and workshops.",
  },
  {
    id: 4,
    icon: "🎉",
    title: "Event Catering",
    description:
      "Elevate your special occasions with award-winning cuisine and impeccable service for any event size.",
  },
  {
    id: 5,
    icon: "📋",
    title: "Menu Development",
    description:
      "Create innovative and profitable menus that blend traditional flavors with modern culinary trends.",
  },
]);

const chefInfo = ref({
  name: "Abed Alrahman Antar",
  nickname: "Chefbey",
  description:
    "is a Lebanese chef and consultant celebrated for his award-winning Turkish and Lebanese cuisine. His greatest achievement is putting smiles on faces through food.",
  image:
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&fit=crop",
});
</script>

<template>
  <section
    class="min-h-screen bg-cover bg-top"
    :style="{ backgroundImage: `url(${serviceBg})` }"
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

    <!-- bottom -->
  </section>
</template>
