<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import bgImage from "@/assets/images/banner-bg.png";
import YoutubeVideo from "./YoutubeVideo.vue";

const chefData = ref({
  name: "Chef Bey",
  title: "The Art Of Culinary Innovation",
  fullName: "Abed Alrahman Antar",
  nickname: "Chefbey",
  description:
    "is a Lebanese chef and consultant celebrated for his award-winning Turkish and Lebanese cuisine. His greatest achievement is putting smiles on faces through food.",
  experience: "10+",
  experienceLabel: "Years Experience",
  dishes: "12+",
  dishesLabel: "Signature Dishes",
  buttons: {
    contact: "Contact me",
    video: "A day in my life",
  },
});

const carouselImages = ref([
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
]);

const carouselRef = ref<HTMLElement | null>(null);
let intervalId: number | null | any = null;

onMounted(() => {
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
</script>

<template>
  <div
    class="relative min-h-screen bg-cover bg-top overflow-hidden"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <div class="container mx-auto px-4 py-12 lg:py-20 lg:pt-32">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 lg:space-y-8">
          <div>
            <h1 class="text-5xl lg:text-7xl font-bold text-white mb-4">
              <span class="font-allura italic font-normal text-primary">{{
                chefData.name
              }}</span>
              <span class="block mt-2">{{ chefData.title }}</span>
            </h1>

            <p class="text-lg text-[#fafafa] leading-relaxed mt-6">
              <span class="font-semibold">{{ chefData.fullName }}</span
              >, known as "{{ chefData.nickname }}", {{ chefData.description }}
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex flex-wrap gap-4">
            <button
              class="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform"
            >
              {{ chefData.buttons.contact }}
            </button>

            <label
              for="my_modal_7"
              class="cursor-pointer px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform flex items-center gap-3 border border-gray-200"
            >
              <svg
                class="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              {{ chefData.buttons.video }}
            </label>

            <input type="checkbox" id="my_modal_7" class="modal-toggle" />
            <div class="modal" role="dialog">
              <div class="modal-box">
                <h3 class="text-lg font-bold w-full text-center">
                  A day of my life
                </h3>
                <YoutubeVideo videoId="Kd_SNlMuaqU" v-once />
              </div>
              <label class="modal-backdrop" for="my_modal_7">Close</label>
            </div>
          </div>

          <!-- Stats -->
          <div class="flex justify-center md:justify-start gap-8 pt-8">
            <div class="relative">
              <div
                class="absolute -left-4 top-0 w-20 h-20 bg-yellow-300 rounded-full opacity-30 blur-xl"
              ></div>
              <h3 class="text-5xl font-bold text-[#fafafa] relative z-10">
                {{ chefData.experience }}
              </h3>
              <p class="text-gray-300 font-medium mt-1 relative z-10">
                {{ chefData.experienceLabel }}
              </p>
            </div>

            <div class="relative">
              <div
                class="absolute -left-4 top-0 w-20 h-20 bg-orange-300 rounded-full opacity-30 blur-xl"
              ></div>
              <h3 class="text-5xl font-bold text-[#fafafa] relative z-10">
                {{ chefData.dishes }}
              </h3>
              <p class="text-gray-300 font-medium mt-1 relative z-10">
                {{ chefData.dishesLabel }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right Side - Vertical Carousel -->
        <div class="relative flex justify-center lg:justify-end">
          <div
            ref="carouselRef"
            class="w-80 h-[600px] overflow-hidden rounded-3xl shadow-2xl relative"
            style="scroll-behavior: auto"
          >
            <div class="space-y-4">
              <!-- Duplicate images for infinite scroll effect -->
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

          <!-- Decorative elements around carousel -->
          <div
            class="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 blur-2xl"
          ></div>
          <div
            class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full opacity-20 blur-2xl"
          ></div>
        </div>
      </div>
    </div>
    <div
      class="absolute bottom-0 w-full h-20 bg-gradient-to-t from-white to-transparent"
    ></div>
  </div>
</template>
