<script setup lang="ts">
import logo from "@/assets/images/logo.png";

const route = useRoute();

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }
  return route.path.startsWith(path);
};
</script>

<template>
  <aside class="w-64 bg-white shadow-lg min-h-screen">
    <!-- Logo/Brand -->
    <div class="p-6 border-b">
      <img :src="logo" alt="logo" class="w-[62px] h-[52px] object-cover" />
    </div>

    <!-- Navigation -->
    <nav class="p-4">
      <ul class="space-y-2">
        <ClientOnly>
          <li v-for="item in menuItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="item.icon"
                />
              </svg>
              <span class="font-medium">{{ item.name }}</span>
            </NuxtLink>
          </li>
        </ClientOnly>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
      <div class="text-xs text-gray-500 text-center">© 2024 Admin Panel</div>
    </div>
  </aside>
</template>
