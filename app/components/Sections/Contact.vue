<script setup lang="ts">
import { ref } from "vue";
import Title from "../UI/Title.vue";
import birdBg from "@/assets/images/bird-bg.png";

const { data = [] } = defineProps<{ data: any }>();

const formData = ref({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  message: "",
});

const selectedCountry = ref("US");

const isLoading = shallowRef<boolean>(false);

const mail = useMail();
const toast = useToast();

const handleSubmit = async () => {
  console.log(formData.value);
  isLoading.value = true;

  try {
    mail.send({
      from: formData?.value?.firstName,
      subject: `New contact from ${formData.value.firstName} ${formData.value.lastName}`,
      text: `Name: ${formData.value.firstName} ${formData.value.lastName}
      Email: ${formData.value.email}
      Phone: ${selectedCountry.value} ${formData.value.phoneNumber}
      Message: ${formData.value.message}
      `,
    });
  } catch (error: any) {
    console.error(error);
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

      <!-- Form and Image Grid -->
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
                  {{ t("First name") }}
                </label>
                <input
                  type="text"
                  id="firstName"
                  v-model="formData.firstName"
                  :placeholder="t('First name')"
                  class="w-full px-4 py-3 border bg-white border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label
                  for="lastName"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  {{ t("Last name") }}
                </label>
                <input
                  type="text"
                  id="lastName"
                  v-model="formData.lastName"
                  :placeholder="t('Last name')"
                  class="w-full px-4 py-3 border text-black bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ t("Email") }}
              </label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                :placeholder="t('mail@example.com')"
                class="w-full px-4 py-3 border text-black bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label
                for="phone"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                {{ t("Phone number") }}
              </label>
              <div class="flex gap-2">
                <!-- <select
                  v-model="selectedCountry"
                  class="px-3 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                >
                  <option value="US">US</option>
                  <option value="UK">UK</option>
                  <option value="CA">CA</option>
                  <option value="LB">LB</option>
                </select> -->
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phoneNumber"
                  :placeholder="t('+1 (555) 000-0000')"
                  class="flex-1 px-4 py-3 border bg-white text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <!-- Message -->
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
                required
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {{
                isLoading ? `${t("Send your message")}` : t("Send your message")
              }}
            </button>
          </form>
        </div>

        <!-- Image Section -->
        <div class="w-full h-full min-h-[400px] lg:min-h-[600px]">
          <div
            class="relative w-full h-fit rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              :src="data?.contactImage"
              alt="Chef cooking with fire"
              class="w-full object-top object-cover max-h-[600px]"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
