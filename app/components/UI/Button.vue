<script lang="ts" setup>
type Props = {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const { type = "button", ...props } = defineProps<Props>();

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <button
    v-bind="props"
    :type="type"
    class="bg-gradient-primary flex items-center justify-center py-2.5 px-6 rounded-full transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
  >
    <slot></slot>
  </button>
</template>
