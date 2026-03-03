<script setup lang="ts">
const { isAuthenticated } = useAuth();
const route = useRoute();
// const router = userRouter()
// Dynamic page title based on route
const pageTitle = computed(() => {
  const path = route.path;

  if (path === "/admin") return "Dashboard";
  if (path.startsWith("/admin/users")) return "Users Management";
  if (path.startsWith("/admin/settings")) return "Settings";
  if (path.startsWith("/admin/profile")) return "My Profile";

  // Fallback: capitalize the last segment
  const segments: any = path.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
});
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <ClientOnly>
      <AdminSideBar v-if="isAuthenticated" />
    </ClientOnly>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <ClientOnly>
        <AdminNavbar :title="pageTitle" v-if="isAuthenticated" />
      </ClientOnly>
      <!-- Page Content -->
      <main class="flex-1 p-6">
        <ClientOnly>
          <slot />
        </ClientOnly>
      </main>
    </div>
  </div>
</template>
