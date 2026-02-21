<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "guest", // Add guest middleware
});

const { login, isAuthenticated } = useAuth(); // Use the composable
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  error.value = "";
  isLoading.value = true;

  try {
    // Use the login method from useAuth composable
    await login(email.value, password.value);

    // Login success → navigate to admin dashboard
    await router.push("/admin");
  } catch (err: any) {
    // Handle errors
    error.value =
      err?.data?.message || err.message || "Invalid email or password.";
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <ClientOnly>
    <div
      class="min-h-screen flex items-center justify-center bg-cover bg-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h1>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              autocomplete="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
              autocomplete="current-password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>

          <div
            v-if="error"
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm"
          >
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary text-white py-3 rounded-lg font-semibold focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
        </form>
      </div>
    </div>
  </ClientOnly>
</template>
