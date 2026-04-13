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
</script>

<template>
  <div class="error-page">
    <div class="spotlight" aria-hidden="true" />

    <div class="logo-row">
      <img
        :src="whiteLogo"
        alt="ChefBey logo mark"
        class="max-w-40"
        aria-hidden="true"
      />
    </div>
    <h1 class="headline">Page Not <span class="accent">found.</span></h1>
    <p class="sub">
      {{
        is404
          ? "This page wandered off into the dark. We couldn't find it."
          : error.message
      }}
    </p>
    <p class="recipe-note" aria-label="Error code">
      Error {{ error.statusCode }}
    </p>

    <!-- Actions -->
    <div class="actions">
      <button class="btn-primary" @click="handleGoHome">
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
        Back to the kitchen
      </button>

      <button class="btn-secondary" @click="handleGoBack">
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
        Go back
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-page {
  min-height: 100vh;
  background: #0d1f2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 28px 48px;
  position: relative;
  overflow: hidden;
  font-family: "Open Sans", ui-sans-serif, system-ui;
}

.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.star {
  position: absolute;
  border-radius: 50%;
  background: white;
  animation: twinkle 3s ease-in-out infinite;
}
@keyframes twinkle {
  0%,
  100% {
    opacity: var(--base-opacity, 0.15);
  }
  50% {
    opacity: 0.04;
  }
}
@media (prefers-reduced-motion: reduce) {
  .star {
    animation: none;
  }
}

.spotlight {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 460px;
  background: linear-gradient(
    to bottom,
    rgba(25, 176, 199, 0.12) 0%,
    transparent 100%
  );
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  pointer-events: none;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 36px;
  z-index: 1;
}
.logo-mark {
  width: 36px;
  height: 36px;
  background: #19b0c7;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-text {
  font-family: "Allura", cursive;
  font-size: 28px;
  color: #19b0c7;
  line-height: 1;
}

.chef-scene {
  z-index: 1;
  margin-bottom: 24px;
}
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
@media (prefers-reduced-motion: reduce) {
  .chef-wobble {
    animation: none;
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
  .question-mark {
    animation: none;
  }
}

.headline {
  font-size: clamp(22px, 5vw, 30px);
  font-weight: 700;
  color: #f5f0e8;
  text-align: center;
  line-height: 1.2;
  margin-bottom: 12px;
  z-index: 1;
}
.accent {
  color: #19b0c7;
}

.sub {
  font-size: 14px;
  color: #8aa4b8;
  line-height: 1.75;
  text-align: center;
  max-width: 290px;
  margin-bottom: 8px;
  z-index: 1;
}

.recipe-note {
  font-size: 12px;
  color: #3a5568;
  font-style: italic;
  text-align: center;
  margin-bottom: 32px;
  z-index: 1;
}

.actions {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 20px;
  background: #19b0c7;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(25, 176, 199, 0.35);
  transition:
    transform 0.15s ease-out,
    box-shadow 0.15s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(25, 176, 199, 0.45);
}
.btn-primary:active {
  transform: scale(0.97);
}
.btn-primary:focus-visible {
  outline: 2px solid #19b0c7;
  outline-offset: 3px;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  color: #8aa4b8;
  border: 1px solid #1e3547;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}
.btn-secondary:hover {
  background: #1a2f40;
  border-color: #19b0c7;
  color: #f5f0e8;
}
.btn-secondary:focus-visible {
  outline: 2px solid #19b0c7;
  outline-offset: 3px;
}

.tag-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 28px;
  z-index: 1;
}
.tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  color: #8aa4b8;
  border: 1px solid #1e3547;
  background: transparent;
  text-decoration: none;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;
  cursor: pointer;
}
.tag:hover {
  border-color: #19b0c7;
  color: #19b0c7;
  background: rgba(25, 176, 199, 0.08);
}
.tag:focus-visible {
  outline: 2px solid #19b0c7;
  outline-offset: 3px;
}
</style>
