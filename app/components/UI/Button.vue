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
    class="flex items-center justify-center py-2.5 px-6 rounded-full bg-primary hover:bg-[#128597] transition-all duration-300 ease-out"
  >
    <slot></slot>
  </button>
</template>
