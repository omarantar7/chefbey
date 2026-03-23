<script setup lang="ts">
import { ref } from "vue";
import Title from "../UI/Title.vue";
import birdBg from "@/assets/images/bird-bg.png";

const { data = [] } = defineProps<{ data: any }>();
const config = useRuntimeConfig();

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  message: "",
});

const touched = ref({
  firstName: false,
  lastName: false,
  email: false,
  phoneNumber: false,
});

const errors = computed(() => ({
  firstName:
    touched.value.firstName && !formData.value.firstName.trim()
      ? t("First name is required")
      : "",
  lastName:
    touched.value.lastName && !formData.value.lastName.trim()
      ? t("Last name is required")
      : "",
  email:
    touched.value.email && !formData.value.email.trim()
      ? t("Email is required")
      : touched.value.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)
        ? t("Enter a valid email")
        : "",
  phoneNumber:
    touched.value.phoneNumber && !formData.value.phoneNumber.trim()
      ? t("Phone number is required")
      : touched.value.phoneNumber &&
          !/^\+?[\d\s\-().]{7,}$/.test(formData.value.phoneNumber)
        ? t("Enter a valid phone number")
        : "",
}));

const isFormValid = computed(
  () =>
    formData.value.firstName.trim() &&
    formData.value.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) &&
    /^\+?[\d\s\-().]{7,}$/.test(formData.value.phoneNumber),
);

const selectedCountry = ref("US");
const isLoading = shallowRef<boolean>(false);
const toast = useToast();

const touchAll = () => {
  Object.keys(touched.value).forEach((key) => {
    touched.value[key as keyof typeof touched.value] = true;
  });
};

const handleSubmit = async () => {
  touchAll();
  if (!isFormValid.value) return;

  isLoading.value = true;
  try {
    await $fetch("/api/contact", {
      method: "POST",
      body: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber,
        message: formData.value.message,
      },
    });

    toast.add({
      title: "Message sent!",
      description: "We'll get back to you soon.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });

    formData.value = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      message: "",
    };
    Object.keys(touched.value).forEach((key) => {
      touched.value[key as keyof typeof touched.value] = false;
    });
  } catch (error: any) {
    toast.add({
      title: "Failed",
      description: error?.data?.message ?? error?.message,
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isLoading.value = false;
  }
};
const t = useT();
</script>

<template>
  <section class="h-fit relative bg-white" id="contactus">
    <div
      class="absolute inset-0 bg-cover opacity-30"
      :style="{ backgroundImage: `url(${birdBg})` }"
    ></div>
    <div class="container mx-auto py-12 md:py-20 px-4 relative z-10">
      <div class="flex items-center justify-center text-center pb-12">
        <Title :title="data?.contactTitle" :sub-title="data?.contactDescr">
          <template #icon>
            <span
              class="icon-[fluent--service-bell-16-filled] text-primary"
            ></span>
          </template>
        </Title>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <!-- Form Section -->
        <div class="w-full">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- First Name and Last Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  for="firstName"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ t("First name") + " *" }}
                </label>
                <input
                  type="text"
                  id="firstName"
                  v-model="formData.firstName"
                  :placeholder="t('First name')"
                  @blur="touched.firstName = true"
                  :class="[
                    'w-full px-4 py-3 border bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
                    errors.firstName
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-primary',
                  ]"
                />
                <p
                  v-if="errors.firstName"
                  class="mt-1 text-sm text-red-500 flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-exclamation-circle" class="size-4" />
                  {{ errors.firstName }}
                </p>
              </div>

              <div>
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ t("Last name") + " *" }}
                </label>
                <input
                  type="text"
                  id="lastName"
                  v-model="formData.lastName"
                  :placeholder="t('Last name')"
                  @blur="touched.lastName = true"
                  :class="[
                    'w-full px-4 py-3 border text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
                    errors.lastName
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-primary',
                  ]"
                />
                <p
                  v-if="errors.lastName"
                  class="mt-1 text-sm text-red-500 flex items-center gap-1"
                >
                  <UIcon name="i-heroicons-exclamation-circle" class="size-4" />
                  {{ errors.lastName }}
                </p>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ t("Email") + " *" }}
              </label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                :placeholder="t('mail@example.com')"
                @blur="touched.email = true"
                :class="[
                  'w-full px-4 py-3 border text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
                  errors.email
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary',
                ]"
              />
              <p
                v-if="errors.email"
                class="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <UIcon name="i-heroicons-exclamation-circle" class="size-4" />
                {{ errors.email }}
              </p>
            </div>

            <!-- Phone Number -->
            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ t("Phone number") + " *" }}
              </label>
              <input
                type="tel"
                id="phone"
                v-model="formData.phoneNumber"
                :placeholder="t('+1 (555) 000-0000')"
                @blur="touched.phoneNumber = true"
                :class="[
                  'flex-1 w-full px-4 py-3 border bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
                  errors.phoneNumber
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-primary',
                ]"
              />
              <p
                v-if="errors.phoneNumber"
                class="mt-1 text-sm text-red-500 flex items-center gap-1"
              >
                <UIcon name="i-heroicons-exclamation-circle" class="size-4" />
                {{ errors.phoneNumber }}
              </p>
            </div>

            <!-- Message (no validation) -->
            <div>
              <label
                for="message"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ t("Message") }}
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                :placeholder="t('Leave us a message...')"
                rows="5"
                class="w-full px-4 py-3 border text-black bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <UButton
              :label="t('Send your message')"
              color="primary"
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              :disabled="isLoading"
              :loading="isLoading"
              @click="handleSubmit"
            />
          </form>
        </div>

        <!-- Image Section -->
        <div class="w-full h-full">
          <div
            class="relative w-full rounded-2xl overflow-hidden shadow-2xl h-full"
          >
            <img
              :src="data?.contactImage"
              :alt="`${data?.contactDescr} Image`"
              class="w-full object-top object-cover h-full"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
