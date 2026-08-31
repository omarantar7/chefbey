<script setup lang="ts">
const { execute: executeRecaptcha, init: initRecaptcha } = useRecaptcha();

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
});

const t = useT();

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
  //   phoneNumber:
  //     touched.value.phoneNumber && !formData.value.phoneNumber.trim()
  //       ? t("Phone number is required")
  //       : touched.value.phoneNumber &&
  //           !/^\+?[\d\s\-().]{7,}$/.test(formData.value.phoneNumber)
  //         ? t("Enter a valid phone number")
  //         : "",
}));

const isFormValid = computed(
  () =>
    formData.value.firstName.trim() &&
    formData.value.lastName.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email) &&
    /^\+?[\d\s\-().]{7,}$/.test(formData.value.phoneNumber),
);

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
    const recaptchaToken = await executeRecaptcha("contact_form");

    await $fetch("/api/contact", {
      method: "POST",
      body: {
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phoneNumber: formData.value.phoneNumber,
        message: formData.value.message,
        recaptchaToken,
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
onMounted(() => {
  initRecaptcha().catch((err) => {
    console.error("reCAPTCHA init failed:", err);
  });
});
</script>

<template>
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
              'w-full px-4 py-3 border bg-[#F8F8F8] text-black rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
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
              'w-full px-4 py-3 border text-black bg-[#F8F8F8] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
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
        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("Email") + " *" }}
        </label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          :placeholder="t('mail@example.com')"
          @blur="touched.email = true"
          :class="[
            'w-full px-4 py-3 border text-black bg-[#F8F8F8] rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
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
        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
          {{ t("Phone number") + "" }}
        </label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phoneNumber"
          :placeholder="t('+1 (555) 000-0000')"
          :class="[
            'flex-1 w-full px-4 py-3 border bg-[#F8F8F8] text-black rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all',
            (errors as any)?.phoneNumber
              ? 'border-red-500 focus:ring-red-400'
              : 'border-gray-300 focus:ring-primary',
          ]"
        />
        <!-- <p
          v-if="errors.phoneNumber"
          class="mt-1 text-sm text-red-500 flex items-center gap-1"
        >
          <UIcon name="i-heroicons-exclamation-circle" class="size-4" />
          {{ errors.phoneNumber }}
        </p> -->
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
          class="w-full px-4 py-3 border text-black bg-[#F8F8F8] border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
        ></textarea>
      </div>

      <Recaptcha />

      <!-- Submit Button -->
      <UButton
        :label="t('Send Your Message')"
        color="primary"
        class="bg-gradient-primary w-full hover:bg-primary/90 font-medium py-4 rounded-lg transition-all duration-300 transform flex items-center justify-center gap-2"
        :disabled="isLoading"
        :loading="isLoading"
        @click="handleSubmit"
      />
    </form>
  </div>
</template>
