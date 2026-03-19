export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith("/admin") || to.path === "/admin/Login") return;

  const { isAuthenticated, loading } = useAuth();

  if (process.server) {
    if (!isAuthenticated.value) {
      return navigateTo("/admin/Login");
    }
    return;
  }

  let waitCount = 0;
  while (loading.value && waitCount < 50) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    waitCount++;
  }

  if (!isAuthenticated.value) {
    return navigateTo("/admin/Login");
  }
});
