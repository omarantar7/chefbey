<script setup lang="ts">
import type { FieldDefinition } from "~~/config/index";

type Props = {
  fields: Record<string, FieldDefinition>;
  label?: string;
  modelValue: Record<string, any>[];
};

const { fields, modelValue } = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: Record<string, any>[]];
}>();

const items = ref<Record<string, any>[]>(modelValue ?? []);

const createEmptyItem = () =>
  Object.fromEntries(Object.keys(fields).map((key) => [key, null]));

const addItem = () => {
  items.value.push(createEmptyItem());
  emit("update:modelValue", items.value);
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
  emit("update:modelValue", items.value);
};

const handleFieldChange = (index: number, key: string, value: any) => {
  (items as any).value[index][key] = value;
  emit("update:modelValue", items.value);
};

onMounted(() => {
  if (modelValue.length === 0) {
    items.value.push(createEmptyItem());
  }
});
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border rounded-lg p-4 space-y-4 relative"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-600"
          >Item {{ index + 1 }}</span
        >
        <UButton
          icon="i-heroicons-trash"
          size="sm"
          color="error"
          variant="ghost"
          @click="removeItem(index)"
        />
      </div>

      <div v-for="(field, key) in fields" :key="key">
        <!-- String -->
        <UFormField :label="field.label" v-if="field.type === 'string'">
          <UInput
            :modelValue="item[key]"
            :placeholder="field.label"
            class="w-full"
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>

        <!-- Text -->
        <UFormField :label="field.label" v-else-if="field.type === 'text'">
          <UTextarea
            :modelValue="item[key]"
            :placeholder="field.label"
            class="w-full"
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>

        <!-- Number -->
        <UFormField :label="field.label" v-else-if="field.type === 'number'">
          <UInput
            :modelValue="item[key]"
            type="number"
            :placeholder="field.label"
            class="w-full"
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>

        <!-- Boolean -->
        <UFormField :label="field.label" v-else-if="field.type === 'boolean'">
          <USwitch
            :modelValue="item[key]"
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>

        <!-- Date -->
        <UFormField :label="field.label" v-else-if="field.type === 'date'">
          <UInput
            :modelValue="item[key]"
            type="date"
            class="w-full"
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>

        <!-- Image -->
        <UFormField :label="field.label" v-else-if="field.type === 'image'">
          <AdminUploadFile
            :modelValue="item[key]"
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>

        <!-- Gallery -->
        <UFormField :label="field.label" v-else-if="field.type === 'gallery'">
          <AdminUploadFile
            :modelValue="item[key]"
            multiple
            @update:modelValue="handleFieldChange(index, key as string, $event)"
          />
        </UFormField>
      </div>
    </div>

    <UButton
      icon="i-heroicons-plus"
      label="Add Item"
      color="primary"
      class="text-white"
      @click="addItem"
    />
  </div>
</template>
