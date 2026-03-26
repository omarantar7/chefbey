<script lang="ts" setup>
type Props = {};
const { ...props } = defineProps<Props>();

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <button
    v-bind="props"
    class="bg-gradient-primary flex items-center justify-center py-2.5 px-6 rounded-full transition-all duration-300 ease-out"
  >
    <slot></slot>
  </button>
</template>
