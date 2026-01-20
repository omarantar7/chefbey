// import { useAuthStore } from "~/stores/auth";

// // middleware/auth.ts
// export default defineNuxtRouteMiddleware((to) => {
//   const authStore = useAuthStore();
//   if (authStore.loading) {
//     return;
//   }
//   if (!authStore.isAuthenticated && to.path !== "/admin/login") {
//     return navigateTo("/admin/login");
//   }

//   if (authStore.isAuthenticated && to.path === "/admin/login") {
//     return navigateTo("/admin");
//   }
// });
