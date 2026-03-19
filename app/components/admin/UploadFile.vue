<script setup lang="ts">
import imageCompression from "browser-image-compression";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

type Props = {
  multiple?: boolean;
  modelValue: string | string[] | null;
  aspectRatio?: number; // e.g. 16/9, 1/1, 4/3
};

const { multiple = false, modelValue, aspectRatio } = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string | string[] | null];
}>();

const isUploading = ref(false);
const isCropperOpen = ref(false);
const cropperRef = ref<any>(null);
const currentFile = ref<File | any>(null);
const previewSrc = ref<string | any>(null);
const pendingFiles = ref<File[]>([]);
const toast = useToast();

const images = computed<string[]>(() => {
  if (!modelValue) return [];
  return Array.isArray(modelValue) ? modelValue : [modelValue];
});

const stencilProps = computed(() => (aspectRatio ? { aspectRatio } : {}));

const compressAndUpload = async (file: File) => {
  const compressed = await imageCompression(file, {
    maxSizeMB: 5,
    useWebWorker: true,
    fileType: "image/webp",
  });

  const formData = new FormData();
  formData.append("file", compressed, compressed.name);

  const { url } = await $fetch<{ name: string; url: string }>("/api/upload", {
    method: "POST",
    body: formData,
  });

  return url;
};

const handleChange = async (event: any) => {
  const fileList: FileList = event?.target?.files ?? event?.files;
  const fileArray: File[] | any = fileList ? Array.from(fileList) : [];
  if (!fileArray.length) return;

  event.target.value = "";

  // Open cropper for first file
  pendingFiles.value = fileArray.slice(1); // rest of files if multiple
  currentFile.value = fileArray[0];
  previewSrc.value = URL.createObjectURL(fileArray[0]);
  isCropperOpen.value = true;
};

const confirmCrop = async () => {
  if (!cropperRef.value) return;

  const { canvas } = cropperRef.value.getResult();
  if (!canvas) return;

  isCropperOpen.value = false;
  isUploading.value = true;

  try {
    const uploaded: string[] | any = [];

    // Upload cropped image
    const croppedBlob: Blob = await new Promise((resolve) =>
      canvas.toBlob((blob: Blob) => resolve(blob), "image/webp", 0.9),
    );
    const croppedFile = new File(
      [croppedBlob],
      currentFile.value?.name ?? "image.webp",
      { type: "image/webp" },
    );
    const url = await compressAndUpload(croppedFile);
    uploaded.push(url);

    // Upload remaining files without cropping (if multiple)
    for (const file of pendingFiles.value) {
      const url = await compressAndUpload(file);
      uploaded.push(url);
    }

    if (multiple) {
      emit("update:modelValue", [...images.value, ...uploaded]);
    } else {
      emit("update:modelValue", uploaded[0]);
    }
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
    previewSrc.value = null;
    currentFile.value = null;
    pendingFiles.value = [];
  }
};

const cancelCrop = () => {
  isCropperOpen.value = false;
  previewSrc.value = null;
  currentFile.value = null;
  pendingFiles.value = [];
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
        <button
          class="absolute cursor-pointer -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
          @click="removeImage(i)"
        >
          <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
        </button>
      </div>

      <!-- Replace button for single -->
      <label
        v-if="!multiple && images.length"
        class="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-gray-400"
      >
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5" />
        <span class="text-xs mt-1">Replace</span>
        <input
          type="file"
          accept="image/*"
          class="hidden"
          :disabled="isUploading"
          @change="handleChange"
        />
      </label>
    </div>

    <!-- Cropper Modal -->
    <UModal
      v-model:open="isCropperOpen"
      title="Crop Image"
    >
      <template #content>
        <UCard>
          <template #header>
            <h3 class="font-semibold">Crop Image</h3>
          </template>

          <div class="h-96">
            <Cropper
              v-if="previewSrc"
              ref="cropperRef"
              :src="previewSrc"
              :stencil-props="stencilProps"
              class="w-full h-full"
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                label="Cancel"
                color="neutral"
                variant="ghost"
                @click="cancelCrop"
              />
              <UButton
                label="Crop & Upload"
                color="primary"
                @click="confirmCrop"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
