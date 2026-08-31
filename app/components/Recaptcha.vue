<script setup lang="ts">
const { isReady, init, execute } = useRecaptcha();

onMounted(() => {
  init().catch((err) => {
    console.error("reCAPTCHA init failed:", err);
  });
});

defineExpose({
  execute,
  isReady,
});
</script>

<template>
  <!-- v3 is invisible — badge is injected by Google's script automatically -->
  <div class="recaptcha-v3" />
</template>

<style scoped>
/* Google auto-injects a floating badge (bottom-right) via the script.
   If you hide it with CSS, you're required by Google's ToS to show
   the reCAPTCHA branding text somewhere near your form instead. */
</style>
