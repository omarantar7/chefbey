<script setup lang="ts">
import { z } from "zod";

definePageMeta({
  layout: "admin",
  middleware: "guest",
});

const { login, isAuthenticated } = useAuth();
const { execute: executeRecaptcha, init: initRecaptcha } = useRecaptcha();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

const errors = reactive({
  email: "",
  password: "",
});

const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Enter a valid email.");

const passwordSchema = z.string().min(1, "Password is required.");

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const fieldSchemas = {
  email: emailSchema,
  password: passwordSchema,
} as const;

const validateField = (field: "email" | "password") => {
  const schema = fieldSchemas[field];
  const result: any = schema.safeParse(
    field === "email" ? email.value : password.value,
  );
  errors[field] = result.success ? "" : result?.error?.issues[0]?.message;
};

const validateAll = () => {
  const result = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  });

  errors.email = "";
  errors.password = "";

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as "email" | "password";
      if (!errors[field]) errors[field] = issue.message;
    }
    return false;
  }
  return true;
};

const handleLogin = async () => {
  error.value = "";
  if (!validateAll()) return;

  isLoading.value = true;
  try {
    const recaptchaToken = await executeRecaptcha("admin_login");

    await login(email.value, password.value, recaptchaToken);
    await router.push("/admin");
  } catch (err: any) {
    error.value =
      err?.data?.message || err.message || "Invalid email or password.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  initRecaptcha().catch((err) => {
    console.error("reCAPTCHA init failed:", err);
  });
});
</script>

<template>
  <ClientOnly>
    <div class="min-h-screen flex items-center justify-center px-6">
      <div
        class="w-full max-w-95 bg-white rounded-xl shadow-lg border border-gray-100 p-8"
      >
        <h1 class="text-xl font-medium text-gray-900 mb-1">Admin sign in</h1>
        <p class="text-sm text-gray-500 mb-8">
          Enter your credentials to continue.
        </p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label for="email" class="block text-sm text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@chefbey.org"
              autocomplete="email"
              @blur="validateField('email')"
              :class="[
                'w-full px-3.5 py-2.5 bg-white border rounded-md text-gray-900 text-[15px] outline-none transition placeholder:text-gray-400',
                errors.email
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10',
              ]"
            />
            <p v-if="errors.email" class="text-red-600 text-xs mt-1.5">
              {{ errors.email }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              @blur="validateField('password')"
              :class="[
                'w-full px-3.5 py-2.5 bg-white border rounded-md text-gray-900 text-[15px] outline-none transition placeholder:text-gray-400',
                errors.password
                  ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/10',
              ]"
            />
            <p v-if="errors.password" class="text-red-600 text-xs mt-1.5">
              {{ errors.password }}
            </p>
          </div>

          <p
            v-if="error"
            class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3.5 py-2.5"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary text-white text-[15px] py-2.5 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>{{ isLoading ? "Signing in…" : "Sign in" }}</span>
          </button>
        </form>
      </div>
    </div>
  </ClientOnly>
</template>
