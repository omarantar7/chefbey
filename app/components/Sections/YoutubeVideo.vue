<script setup lang="ts">
import { ref, onMounted } from "vue";

type Props = {
  videoId: string;
};

const { videoId = undefined } = defineProps<Props>();

const isLoading = ref(true);

const handleIframeLoad = () => {
  isLoading.value = false;
};

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 1500);
});
</script>

<template>
  <div class="w-full max-w-4xl mx-auto p-4">
    <div
      class="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden"
    >
      <div v-if="isLoading" class="absolute inset-0 bg-gray-300 animate-pulse">
        <div class="flex items-center justify-center h-full">
          <div
            class="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
              />
            </svg>
          </div>
        </div>
        <div class="absolute bottom-4 left-4 right-4 space-y-2">
          <div class="h-4 bg-gray-400 rounded w-3/4"></div>
          <div class="h-3 bg-gray-400 rounded w-1/2"></div>
        </div>
      </div>

      <iframe
        :src="`https://www.youtube.com/embed/${videoId}`"
        class="absolute inset-0 w-full h-full"
        :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
        "
        allowfullscreen
        @load="handleIframeLoad"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
iframe {
  transition: opacity 0.3s ease-in-out;
}
</style>
