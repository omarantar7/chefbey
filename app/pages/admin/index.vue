<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { user, loading } = useAuth();
</script>

<template>
  <div class="w-full">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
        ></div>
        <p class="">Loading dashboard...</p>
      </div>
    </div>

    <div v-else>
      <ClientOnly>
        <div class="mb-8">
          <h3 class="text-2xl font-bold mb-2">
            Welcome back, {{ user?.name }}! 👋
          </h3>
          <p class="">Here's what's happening with your admin panel today.</p>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
