<script setup lang="ts">
import type { FieldDefinition } from "~~/config/index";

type Props = {
  fields: Record<string, FieldDefinition> | any;
  modelValue: Record<string, any>;
};

defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: Record<string, any>];
}>();

const handleChange = (
  key: string,
  value: any,
  current: Record<string, any>,
) => {
  emit("update:modelValue", { ...current, [key]: value });
};
</script>

<template>
  <div class="space-y-6">
    <div v-for="(field, key) in fields" :key="key">
      <UFormField :label="field.label" v-if="field.type === 'image'">
        <AdminUploadFile
          :modelValue="modelValue[key]"
          @update:modelValue="handleChange(key as string, $event, modelValue)"
        />
      </UFormField>

      <UFormField :label="field.label" v-else-if="field.type === 'gallery'">
        <AdminUploadFile
          :modelValue="modelValue[key]"
          multiple
          @update:modelValue="handleChange(key as string, $event, modelValue)"
        />
      </UFormField>
    </div>
  </div>
</template>
