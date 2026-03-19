<script setup lang="ts">
import type { FieldDefinition } from "~~/config/index";

type Props = {
  fields: Record<string, FieldDefinition> | any;
  modelValue: Record<string, Record<string, any>>;
  languages: string[];
  withName?: boolean;
  localNames?: Record<string, string>;
};

const {
  fields,
  languages,
  modelValue,
  withName = false,
  localNames,
} = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: Record<string, Record<string, any>>];
  "update:localNames": [value: Record<string, string>];
}>();

const activeLanguage = ref<any>(languages[0]);

const handleChange = (key: string, value: any) => {
  emit("update:modelValue", {
    ...modelValue,
    [activeLanguage.value]: {
      ...modelValue[activeLanguage.value],
      [key]: value,
    },
  });
};

const handleNameChange = (value: string) => {
  emit("update:localNames", {
    ...localNames,
    [activeLanguage.value]: value,
  });
};
</script>

<template>
  <div class="space-y-6">
    <!-- Language Switcher -->
    <div class="flex items-center justify-end gap-2">
      <UButton
        v-for="lang in languages"
        :key="lang"
        :label="lang.toUpperCase()"
        size="sm"
        :variant="activeLanguage === lang ? 'solid' : 'outline'"
        color="primary"
        @click="activeLanguage = lang"
      />
    </div>

    <!-- Name field (only for contents) -->
    <UFormField v-if="withName" label="Name" required>
      <UInput
        :modelValue="localNames?.[activeLanguage] ?? ''"
        placeholder="Enter name"
        class="w-full"
        @update:modelValue="handleNameChange"
      />
    </UFormField>

    <!-- Fields for active language -->
    <div v-for="(field, key) in fields" :key="key">
      <UFormField :label="field.label" v-if="field.type === 'string'">
        <UInput
          :modelValue="modelValue[activeLanguage]?.[key]"
          :placeholder="field.label"
          class="w-full"
          @update:modelValue="handleChange(key as string, $event)"
        />
      </UFormField>

      <UFormField :label="field.label" v-else-if="field.type === 'text'">
        <UTextarea
          :modelValue="modelValue[activeLanguage]?.[key]"
          :placeholder="field.label"
          class="w-full"
          @update:modelValue="handleChange(key as string, $event)"
        />
      </UFormField>

      <UFormField :label="field.label" v-else-if="field.type === 'number'">
        <UInput
          :modelValue="modelValue[activeLanguage]?.[key]"
          type="number"
          :placeholder="field.label"
          class="w-full"
          @update:modelValue="handleChange(key as string, $event)"
        />
      </UFormField>

      <UFormField :label="field.label" v-else-if="field.type === 'boolean'">
        <USwitch
          :modelValue="modelValue[activeLanguage]?.[key]"
          @update:modelValue="handleChange(key as string, $event)"
        />
      </UFormField>

      <UFormField :label="field.label" v-else-if="field.type === 'date'">
        <UInput
          :modelValue="modelValue[activeLanguage]?.[key]"
          type="date"
          class="w-full"
          @update:modelValue="handleChange(key as string, $event)"
        />
      </UFormField>

      <UFormField :label="field.label" v-else-if="field.type === 'repeater'">
        <AdminRepeater
          :fields="field.fields!"
          :modelValue="modelValue[activeLanguage]?.[key] ?? []"
          @update:modelValue="handleChange(key as string, $event)"
          :key="`repeater-${activeLanguage}`"
        />
      </UFormField>
    </div>
  </div>
</template>
