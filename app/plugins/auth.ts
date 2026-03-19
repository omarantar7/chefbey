export default defineNuxtPlugin(async () => {
  const { autoLogin } = useAuth();
  const route = useRoute();

  if (route.path.startsWith("/admin")) {
    await autoLogin();
  }
});
