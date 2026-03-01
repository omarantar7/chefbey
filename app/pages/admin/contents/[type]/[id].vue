<script setup lang="ts">
import contentsTypeRegistry from "~~/config/contents-type-registry";
import { useDataset } from "~~/lib/dataset";
definePageMeta({ layout: "admin", props: true });

type Props = { type: string; id: string };
const { type, id } = defineProps<Props>();
const isNew = computed(() => id == "new");
const router = useRouter();
const dataset = useDataset();
const languages = dataset?.contentLanguages;

const allFields = computed(
  () => contentsTypeRegistry[`contents:${type}`].fields,
);

const settingsFields = computed(() =>
  Object.fromEntries(
    Object.entries(allFields.value).filter(([, f]: any) =>
      ["image", "gallery"].includes(f.type),
    ),
  ),
);

const localFields = computed(() =>
  Object.fromEntries(
    Object.entries(allFields.value).filter(
      ([, f]: any) => !["image", "gallery"].includes(f.type),
    ),
  ),
);

const name = ref("");

const settingsData = reactive<Record<string, any>>(
  Object.fromEntries(Object.keys(settingsFields.value).map((k) => [k, null])),
);

const localData: any = reactive<Record<string, Record<string, any>>>(
  Object.fromEntries(
    languages.map((lang: any) => [
      lang,
      Object.fromEntries(Object.keys(localFields.value).map((k) => [k, null])),
    ]),
  ),
);

if (!isNew.value) {
  const { data }: any = await useFetch(`/api/contents/${type}/${id}`);
  watchEffect(() => {
    if (!data.value) return;
    name.value = data.value.name ?? "";
    Object.assign(settingsData, data.value.settings);
    for (const lang of languages) {
      if (data.value.local[lang]) {
        Object.assign(localData[lang], data.value.local[lang]);
      }
    }
  });
}

const toast = useToast();
const isSaving = ref(false);

const save = async () => {
  if (!name.value.trim()) {
    toast.add({
      title: "Name is required.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
    return;
  }

  isSaving.value = true;
  try {
    if (isNew.value) {
      const res: any = await $fetch(`/api/contents/${type}/${id}`, {
        method: "POST",
        body: {
          name: name.value,
          languages,
          settings: settingsData,
          local: localData,
        },
      });
      router.replace(`/admin/contents/${type}/${res.id}`);
    } else {
      await Promise.all([
        $fetch(`/api/contents/${type}/${id}`, {
          method: "PUT",
          body: { type: "settings", name: name.value, attrs: settingsData },
        }),
        ...languages.map((lang: string) =>
          $fetch(`/api/contents/${type}/${id}`, {
            method: "PUT",
            body: {
              type: "local",
              language: lang,
              name: name.value,
              attrs: localData[lang],
            },
          }),
        ),
      ]);
    }

    toast.add({
      title: "Saved successfully.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } catch (e: any) {
    toast.add({
      title: "Failed to save.",
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
  <div class="p-8 space-y-4">
    <!-- Name field -->
    <UCard>
      <UFormField label="Name" required>
        <UInput v-model="name" placeholder="Enter name" class="w-full" />
      </UFormField>
    </UCard>

    <div class="flex gap-4 items-start w-full">
      <UCard class="w-full">
        <template #header>
          <h2 class="font-semibold text-gray-400">Content</h2>
        </template>
        <AdminCmsContentLocal
          :fields="localFields"
          :modelValue="localData"
          :languages="languages"
          @update:modelValue="
            (val) => {
              for (const lang in val) Object.assign(localData[lang], val[lang]);
            }
          "
        />
      </UCard>

      <UCard class="w-full">
        <template #header>
          <h2 class="font-semibold text-gray-400">Settings</h2>
        </template>
        <AdminCmsContentSettings
          :fields="settingsFields"
          :modelValue="settingsData"
          @update:modelValue="Object.assign(settingsData, $event)"
        />
      </UCard>
    </div>

    <UCard class="sticky bottom-0 mt-4 flex justify-end">
      <UButton
        label="Save Changes"
        color="primary"
        :loading="isSaving"
        @click="save"
      />
    </UCard>
  </div>
</template>
