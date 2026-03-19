<script setup lang="ts">
const props = defineProps<{
  title?: string;
}>();

const { user, logout } = useAuth();
const router = useRouter();

const isLoggingOut = ref(false);
const showUserMenu = ref(false);

const handleLogout = async () => {
  try {
    isLoggingOut.value = true;
    await logout();
    await router.push("/admin/login");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    isLoggingOut.value = false;
  }
};

// Close dropdown when clicking outside
const userMenuRef = ref<HTMLElement | null>(null);
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
      showUserMenu.value = false;
    }
  });
});
</script>

<template>
  <nav class="shadow-sm sticky top-0 z-10">
    <div class="px-6 py-4">
      <div class="flex justify-between items-center">
        <!-- Page Title -->
        <div>
          <ClientOnly>
            <!-- <h2 class="text-2xl font-semibold">
              {{ title || "Dashboard" }}
            </h2> -->
          </ClientOnly>
        </div>
        <ClientOnly>
          <div class="flex items-center space-x-4">
            <!-- User Dropdown -->
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-3 p-2 rounded-lg transition"
              >
                <!-- User Avatar -->
                <div class="relative">
                  <img
                    v-if="user?.image"
                    :src="user.image"
                    :alt="user.name"
                    class="w-10 h-10 rounded-full object-cover border-2"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold text-lg border-2"
                  >
                    {{ user?.name?.charAt(0).toUpperCase() }}
                  </div>
                  <!-- Online indicator -->
                  <span
                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full"
                  ></span>
                </div>

                <!-- User Info -->
                <div class="text-left hidden md:block">
                  <div class="text-sm font-semibold">
                    {{ user?.name }}
                  </div>
                  <div class="text-xs">
                    {{ user?.email }}
                  </div>
                </div>

                <!-- Dropdown Arrow -->
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': showUserMenu }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div
                  v-if="showUserMenu"
                  class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg border py-2 bg-gray-800"
                >
                  <!-- User Info in Dropdown -->
                  <div class="px-4 py-3 border-b">
                    <div class="text-sm font-semibold">
                      {{ user?.name }}
                    </div>
                    <div class="text-xs truncate">
                      {{ user?.email }}
                    </div>
                  </div>

                  <!-- Menu Items -->
                  <!-- <NuxtLink
                    to="/admin/profile"
                    class="flex items-center space-x-3 px-4 py-2 transition"
                    @click="showUserMenu = false"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span class="text-sm">My Profile</span>
                  </NuxtLink>

                  <NuxtLink
                    to="/admin/settings"
                    class="flex items-center space-x-3 px-4 py-2 transition"
                    @click="showUserMenu = false"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="text-sm">Settings</span>
                  </NuxtLink> -->

                  <div class="border-t my-2"></div>

                  <!-- Logout Button -->
                  <button
                    @click="handleLogout"
                    :disabled="isLoggingOut"
                    class="w-full flex items-center space-x-3 px-4 py-2 text-red-600 transition disabled:opacity-50"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span class="text-sm font-medium">
                      {{ isLoggingOut ? "Logging out..." : "Logout" }}
                    </span>
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </ClientOnly>
      </div>
    </div>
  </nav>
</template>
