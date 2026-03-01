<script setup lang="ts">
import logo from "@/assets/images/logo.png";
import contentsTypeRegistry from "~~/config/contents-type-registry";

const route = useRoute();

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: "i-heroicons-home",
  },
  {
    name: "Content",
    path: "/admin/content",
    icon: "i-heroicons-document-text",
  },
];

const contentsItems = Object.keys(contentsTypeRegistry).map((el) => {
  const name = el.split(":")[1];
  return { name: name?.toUpperCase(), path: `/admin/contents/${name}` };
});

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }
  return route.path.startsWith(path);
};
</script>

<template>
  <aside class="w-64 bg-white shadow-lg min-h-screen h-full">
    <div class="p-6 border-b">
      <img :src="logo" alt="logo" class="size-15.5 object-cover" />
    </div>

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
              <UIcon :name="item.icon" class="w-5 h-5" />
              <span class="font-medium">{{ item.name }}</span>
            </NuxtLink>
          </li>
          <li>Contents:</li>
          <li v-for="item in contentsItems">
            <NuxtLink
              :to="item.path"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
              ]"
            >
              <span class="font-medium">{{ item.name }}</span>
            </NuxtLink>
          </li>
        </ClientOnly>
      </ul>
    </nav>

    <div class="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
      <div class="text-xs text-gray-500 text-center">
        @ {{ new Date().getFullYear() }} Admin Panel
      </div>
    </div>
  </aside>
</template>
