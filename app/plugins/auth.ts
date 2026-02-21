export default defineNuxtPlugin(async () => {
  const { autoLogin } = useAuth();
  
  // Automatically call auto-login when app loads
  await autoLogin();
});