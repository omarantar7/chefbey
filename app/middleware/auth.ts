export default defineNuxtRouteMiddleware(async (to) => {
  const { isAuthenticated, loading } = useAuth();

  // On server, auth is already loaded, no need to wait
  if (process.server) {
    if (!isAuthenticated.value) {
      return navigateTo("/admin/Login");
    }
    return;
  }

  // On client, wait for loading to finish
  let waitCount = 0;
  while (loading.value && waitCount < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    waitCount++;
  }

  if (!isAuthenticated.value) {
    return navigateTo("/admin/Login");
  }
});