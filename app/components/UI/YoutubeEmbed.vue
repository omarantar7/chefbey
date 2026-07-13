<script setup lang="ts">
import { useToggle } from "@vueuse/core";

const {
  url,
  title = "",
  attrs = {},
} = defineProps<{
  url?: string | null;
  title?: string;
  attrs?: Record<string, string | number | boolean>;
}>();

defineOptions({ inheritAttrs: false });

const embedUrl = computed(() => {
  if (!url) return "";
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/,
  );
  const videoId = match?.[1] ?? url;
  return `https://www.youtube.com/embed/${videoId}`;
});

const [isLoaded, toggleLoaded] = useToggle(false);

watch(embedUrl, () => {
  toggleLoaded(false);
});
</script>

<template>
  <div class="relative w-full h-full" v-bind="$attrs">
    <div
      v-if="embedUrl && !isLoaded"
      class="absolute inset-0 bg-gray-200 animate-pulse rounded-[inherit] flex items-center justify-center"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-12 h-12"
      >
        <path
          d="M10 15L15.19 12L10 9V15ZM21.56 7.17C21.69 7.64 21.78 8.27 21.84 9.07C21.91 9.87 21.94 10.56 21.94 11.16L22 12C22 14.19 21.84 15.8 21.56 16.83C21.31 17.73 20.73 18.31 19.83 18.56C19.36 18.69 18.5 18.78 17.18 18.84C15.88 18.91 14.69 18.94 13.59 18.94L12 19C7.81 19 5.2 18.84 4.17 18.56C3.27 18.31 2.69 17.73 2.44 16.83C2.31 16.36 2.22 15.73 2.16 14.93C2.09 14.13 2.06 13.44 2.06 12.84L2 12C2 9.81 2.16 8.2 2.44 7.17C2.69 6.27 3.27 5.69 4.17 5.44C4.64 5.31 5.5 5.22 6.82 5.16C8.12 5.09 9.31 5.06 10.41 5.06L12 5C16.19 5 18.8 5.16 19.83 5.44C20.73 5.69 21.31 6.27 21.56 7.17Z"
          fill="#d1d5dc "
        />
      </svg>
    </div>
    <ClientOnly>
      <iframe
        v-if="embedUrl"
        :src="embedUrl"
        :title="title"
        class="w-full h-full transition-opacity duration-300"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        frameborder="0"
        allow="
          accelerometer;
          autoplay;
          clipboard-write;
          encrypted-media;
          gyroscope;
          picture-in-picture;
          web-share;
        "
        allowfullscreen
        v-bind="{ ...$attrs, ...attrs }"
        @load="toggleLoaded(true)"
      ></iframe>
    </ClientOnly>
  </div>
</template>
