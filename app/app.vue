<script setup lang="ts">
import PageLoader from "./components/PageLoader.vue";
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#19b0c7"/>
    <NuxtLayout>
      <PageLoader />
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>