<script setup lang="ts">
import PageLoader from "./components/PageLoader.vue";
</script>

<template>
  <div>
    <UApp>
      <NuxtLayout>
        <PageLoader />
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
