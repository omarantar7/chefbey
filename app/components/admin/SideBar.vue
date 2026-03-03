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

const contentsItems: any = [
  ...menuItems,
  ...Object.keys(contentsTypeRegistry).map((el) => {
    const name = el.split(":")[1];
    return { name: name?.toUpperCase(), path: `/admin/contents/${name}` };
  }),
  {
    name: "SEO",
    path: "/admin/seo",
    icon: "i-heroicons-chart-bar",
  },
];

const isActive = (path: string) => {
  if (path === "/admin") {
    return route.path === "/admin";
  }
  return route.path === path || route.path.startsWith(path + "/");
};
</script>

<template>
  <aside class="w-64 shadow-lg min-h-screen h-full">
    <div class="p-6 ">
      <img :src="logo" alt="logo" class="size-15.5 bg-white rounded-full object-cover" />
    </div>

    <nav class="p-4">
      <ul class="space-y-2">
        <ClientOnly>
          <li v-for="item in contentsItems" :key="item?.path">
            <NuxtLink
              :to="item?.path"
              :class="[
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive(item?.path)
                  ? 'bg-primary '
                  : 'text-gray-700 hover:bg-gray-100',
              ]"
            >
              <UIcon v-if="item?.icon" :name="item?.icon" class="w-5 h-5" />
              <span class="font-medium">{{ item?.name }}</span>
            </NuxtLink>
          </li>
        </ClientOnly>
      </ul>
    </nav>

    <div class="absolute bottom-0 w-64 p-4">
      <div class="text-xs text-center">
        @ {{ new Date().getFullYear() }} Admin Panel
      </div>
    </div>
  </aside>
</template>
