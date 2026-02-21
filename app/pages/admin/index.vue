<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "auth",
});

const { user, loading } = useAuth();

// Stats data
const stats = [
  {
    name: "Total Users",
    value: "1,234",
    change: "+12%",
    changeType: "positive",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Active Sessions",
    value: "89",
    change: "+4%",
    changeType: "positive",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    name: "Revenue",
    value: "$12,345",
    change: "+23%",
    changeType: "positive",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    name: "Pending Tasks",
    value: "24",
    change: "-5%",
    changeType: "negative",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  },
];
</script>

<template>
  <div class="w-full">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Loading dashboard...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Welcome Message -->
       <ClientOnly>
      <div class="mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {{ user?.name }}! 👋
        </h3>
        <p class="text-gray-600">
          Here's what's happening with your admin panel today.
        </p>
      </div>
      </ClientOnly>
    </div>
  </div>
</template>
