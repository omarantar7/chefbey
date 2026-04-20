<script setup lang="ts">
import whiteLogo from "@/assets/images/logo2.png";

const { error } = defineProps<{
  error: {
    statusCode: number;
    message: string;
  };
}>();

const route = useRoute();
const router = useRouter();

const is404 = computed(() => error.statusCode === 404);

const handleGoHome = () =>
  clearError({ redirect: `/${route.params.lang || "en"}` });
const handleGoBack = () => router.back();
const t = useT();
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-7 py-12"
    style="background: #0d1f2d"
  >
    <div
      aria-hidden="true"
      class="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-[460px] pointer-events-none"
      style="
        background: linear-gradient(
          to bottom,
          rgba(25, 176, 199, 0.12) 0%,
          transparent 100%
        );
        clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
      "
    />

    <div class="relative z-10 flex items-center gap-2.5 mb-9">
      <img :src="whiteLogo" alt="ChefBey logo" class="max-w-40" />
    </div>

    <h1
      class="relative z-10 text-[clamp(22px,5vw,30px)] font-bold text-center leading-tight mb-3"
      style="color: #f5f0e8"
    >
      {{ t("Page Not") }}
      <span style="color: #19b0c7">{{ t("Found.") }}</span>
    </h1>

    <p
      class="relative z-10 text-sm text-center leading-relaxed max-w-[290px] mb-2"
      style="color: #8aa4b8"
    >
      {{
        is404
          ? t("This page wandered off into the dark. We couldn't find it.")
          : error.message
      }}
    </p>

    <p
      class="relative z-10 text-xs italic text-center mb-8"
      style="color: #3a5568"
      aria-label="Error code"
    >
      Error {{ error.statusCode }}
    </p>

    <!-- Actions -->
    <div class="relative z-10 w-full max-w-[300px] flex flex-col gap-2.5">
      <button
        class="flex items-center justify-center gap-2 w-full py-3.5 px-5 text-white text-sm font-semibold rounded-[14px] border-none cursor-pointer transition-[transform,box-shadow] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19b0c7]"
        style="
          background: #19b0c7;
          box-shadow: 0 4px 20px rgba(25, 176, 199, 0.35);
          font-family: inherit;
        "
        @click="handleGoHome"
        @mouseenter="
          ($el as HTMLElement).style.boxShadow =
            '0 8px 24px rgba(25,176,199,.45)'
        "
        @mouseleave="
          ($el as HTMLElement).style.boxShadow =
            '0 4px 20px rgba(25,176,199,.35)'
        "
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        {{ t("Chefbey Home") }}
      </button>

      <!-- <button
        class="flex items-center justify-center gap-1.5 w-full py-3 px-5 bg-transparent text-sm font-medium rounded-[14px] cursor-pointer border border-[#1e3547] transition-[background,border-color,color] duration-150 hover:border-[#19b0c7] active:scale-[.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#19b0c7]"
        style="color: #8aa4b8; font-family: inherit"
        @click="handleGoBack"
        @mouseenter="
          (e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = '#1a2f40';
            el.style.color = '#f5f0e8';
          }
        "
        @mouseleave="
          (e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'transparent';
            el.style.color = '#8aa4b8';
          }
        "
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        {{ t("Go back") }}
      </button> -->
    </div>
  </div>
</template>

<style scoped>
.chef-wobble {
  animation: wobble 4s ease-in-out infinite;
  transform-origin: 130px 200px;
}
@keyframes wobble {
  0%,
  100% {
    transform: rotate(-2.5deg) translateY(0);
  }
  50% {
    transform: rotate(2.5deg) translateY(-8px);
  }
}

.question-mark {
  animation: pop 2.2s ease-in-out infinite;
  transform-origin: 200px 95px;
}
@keyframes pop {
  0%,
  100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.2) translateY(-5px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .chef-wobble,
  .question-mark {
    animation: none;
  }
}
</style>
