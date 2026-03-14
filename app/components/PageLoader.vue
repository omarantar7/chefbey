<script setup lang="ts">
const loading = ref(false);
const router = useRouter();

router.beforeEach(() => {
  loading.value = true;
});

router.afterEach(() => {
  loading.value = false;
});
</script>
<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="loading"
      class="fixed inset-0 z-9999 bg-white flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <img
          src="@/assets/images/logo.png"
          alt="logo"
          class="size-24 object-contain animate-pulse"
        />
        <div class="flex gap-1.5">
          <span
            class="size-2 rounded-full bg-primary animate-bounce"
            style="animation-delay: 0ms"
          />
          <span
            class="size-2 rounded-full bg-primary animate-bounce"
            style="animation-delay: 150ms"
          />
          <span
            class="size-2 rounded-full bg-primary animate-bounce"
            style="animation-delay: 300ms"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>
