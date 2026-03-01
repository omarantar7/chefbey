<script setup lang="ts">
type Props = {
  multiple?: boolean;
  modelValue: string | string[] | null;
};

const { multiple = false, modelValue } = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string | string[] | null];
}>();

const isUploading = ref(false);
const toast = useToast();

const images = computed<string[]>(() => {
  if (!modelValue) return [];
  return Array.isArray(modelValue) ? modelValue : [modelValue];
});

const handleChange = async (event: any) => {
  const fileList: FileList = event?.target?.files ?? event?.files;
  const fileArray: File[] = fileList ? Array.from(fileList) : [];
  if (!fileArray.length) return;

  isUploading.value = true;

  try {
    const uploaded: any[] = [];

    for (const file of fileArray) {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await $fetch<{ name: string; url: string }>(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      uploaded.push(url);
    }

    if (multiple) {
      // Append to existing images
      emit("update:modelValue", [...images.value, ...uploaded]);
    } else {
      emit("update:modelValue", uploaded[0]);
    }

    // Reset input
    event.target.value = "";
  } catch (e: any) {
    console.error("Upload error:", e);
    toast.add({
      title: "Upload failed.",
      description: e?.data?.message ?? e?.message ?? "Unknown error",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  } finally {
    isUploading.value = false;
  }
};

const removeImage = (index: number) => {
  if (multiple) {
    const updated = [...images.value];
    updated.splice(index, 1);
    emit("update:modelValue", updated.length ? updated : null);
  } else {
    emit("update:modelValue", null);
  }
};
</script>

<template>
  <div class="space-y-3">
    <label
      v-if="multiple || !images.length"
      class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <div class="flex flex-col items-center gap-1 text-gray-400">
        <UIcon name="i-heroicons-arrow-up-tray" class="w-6 h-6" />
        <span class="text-sm font-medium">
          {{
            isUploading
              ? "Uploading..."
              : multiple
                ? "Upload images"
                : "Upload image"
          }}
        </span>
        <span class="text-xs">PNG, JPG, WEBP</span>
      </div>
      <input
        type="file"
        accept="image/*"
        :multiple="multiple"
        class="hidden"
        :disabled="isUploading"
        @change="handleChange"
      />
    </label>

    <div
      v-if="isUploading"
      class="flex items-center gap-2 text-sm text-gray-500"
    >
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-4 h-4" />
      Uploading...
    </div>

    <!-- Preview grid -->
    <div v-if="images.length" class="flex flex-wrap gap-3">
      <div v-for="(url, i) in images" :key="i" class="relative group w-24 h-24">
        <img
          :src="url"
          class="w-full h-full object-cover rounded-lg border border-gray-200"
        />
        <!-- Delete button -->
        <button
          class="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          @click="removeImage(i)"
        >
          <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
        </button>
      </div>
    </div>
  </div>
</template>
