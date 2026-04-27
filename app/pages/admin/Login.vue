<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "guest",
});

const { login, isAuthenticated } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const errors = reactive({
  email: "",
  password: "",
});

const validateEmail = (val: string) => {
  if (!val) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Enter a valid email.";
  return "";
};

const validatePassword = (val: string) => {
  if (!val) return "Password is required.";
  if (val.length < 6) return "Password must be at least 6 characters.";
  return "";
};

const validateAll = () => {
  errors.email = validateEmail(email.value);
  errors.password = validatePassword(password.value);
  return !errors.email && !errors.password;
};

const handleLogin = async () => {
  error.value = "";
  if (!validateAll()) return;

  isLoading.value = true;
  try {
    await login(email.value, password.value);
    await router.push("/admin");
  } catch (err: any) {
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
              placeholder="Enter your email"
              autocomplete="email"
              @blur="errors.email = validateEmail(email)"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-black outline-none transition',
                errors.email
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-primary',
              ]"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">
              {{ errors.email }}
            </p>
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
              placeholder="Enter your password"
              autocomplete="current-password"
              @blur="errors.password = validatePassword(password)"
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent text-black outline-none transition',
                errors.password
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-primary',
              ]"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">
              {{ errors.password }}
            </p>
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
