export const useAuth = () => {
  const user = useState<any>("auth-user", () => null);
  const session = useState<any>("auth-session", () => null);
  const loading = useState("auth-loading", () => false);

  // Server-side initialization
  const initFromServer = (serverData: any) => {
    if (serverData) {
      user.value = serverData.user;
      session.value = serverData.session;
    }
  };

  const autoLogin = async () => {
    // Skip if already loaded (e.g., from SSR)
    if (user.value) {
      return { user: user.value, session: session.value };
    }

    try {
      loading.value = true;
      const response = await $fetch("/api/auth/auto-login", {
        method: "POST",
      });

      user.value = response.user;
      session.value = response.session;

      return response;
    } catch (error) {
      console.error("Auto-login failed:", error);
      user.value = null;
      session.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    const response = await $fetch("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    user.value = response.user;
    session.value = response.session;

    return response;
  };

  const logout = async () => {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/admin/login";
  };

  const isAuthenticated = computed(() => !!user.value);

  return {
    user,
    session,
    loading,
    isAuthenticated,
    initFromServer,
    autoLogin,
    login,
    logout,
  };
};
