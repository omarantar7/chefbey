<script setup lang="ts">
import PageLoader from "./components/PageLoader.vue";
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <PageLoader />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>