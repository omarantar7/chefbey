<script setup lang="ts">
definePageMeta({ layout: "admin", props: true });

const { id } = defineProps<{ id: string }>();
const toast = useToast();
const router = useRouter();

const { data } = await useFetch(`/api/seo/${id}`);

const form = reactive({
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  canonicalUrl: "",
  robots: "index, follow",
});

watchEffect(() => {
  if (!data.value) return;
  Object.assign(form, data.value);
});

const isSaving = ref(false);

const save = async () => {
  isSaving.value = true;
  try {
    await $fetch(`/api/seo/${id}`, { method: "PUT", body: form });
    toast.add({
      title: "SEO updated successfully.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (e: any) {
    toast.add({
      title: "Failed to update SEO.",
      description: e?.data?.message ?? e?.message,
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div class="p-8 max-w-3xl space-y-4">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-semibold">Edit SEO</h1>
        <p class="text-sm mt-1">
          Update SEO metadata for this entry
        </p>
      </div>
      <UButton
        label="Back"
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="ghost"
        @click="router.back()"
      />
    </div>

    <UCard>
      <template #header>
        <h2 class="font-semibold">General</h2>
      </template>
      <div class="space-y-4">
        <UFormField label="Title">
          <UInput
            v-model="form.title"
            placeholder="Page title"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Description">
          <UTextarea
            v-model="form.description"
            placeholder="Meta description"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Keywords">
          <UInput
            v-model="form.keywords"
            placeholder="keyword1, keyword2, keyword3"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Canonical URL">
          <UInput
            v-model="form.canonicalUrl"
            placeholder="https://example.com/page"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Robots">
          <USelect
            v-model="form.robots"
            :items="[
              'index, follow',
              'noindex, follow',
              'index, nofollow',
              'noindex, nofollow',
            ]"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-gray-600">Open Graph</h2>
      </template>
      <div class="space-y-4">
        <UFormField label="OG Title">
          <UInput
            v-model="form.ogTitle"
            placeholder="Open Graph title"
            class="w-full"
          />
        </UFormField>
        <UFormField label="OG Description">
          <UTextarea
            v-model="form.ogDescription"
            placeholder="Open Graph description"
            class="w-full"
          />
        </UFormField>
        <UFormField label="OG Image URL">
          <UInput
            v-model="form.ogImage"
            placeholder="https://example.com/image.jpg"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="font-semibold text-gray-600">Twitter Card</h2>
      </template>
      <div class="space-y-4">
        <UFormField label="Twitter Title">
          <UInput
            v-model="form.twitterTitle"
            placeholder="Twitter card title"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Twitter Description">
          <UTextarea
            v-model="form.twitterDescription"
            placeholder="Twitter card description"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Twitter Image URL">
          <UInput
            v-model="form.twitterImage"
            placeholder="https://example.com/image.jpg"
            class="w-full"
          />
        </UFormField>
      </div>
    </UCard>

    <UCard class="sticky bottom-0">
      <div class="flex justify-end">
        <UButton
          label="Save Changes"
          color="primary"
          :loading="isSaving"
          @click="save"
        />
      </div>
    </UCard>
  </div>
</template>
