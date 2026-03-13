<script setup lang="ts">
type Props = {
  title: string;
  subTitle: string;
};

const { title, subTitle } = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col items-center justify-center w-fit gap-3">
    <div class="flex items-center justify-center gap-2">
      <slot name="icon"></slot>
      <h1 class="text-lg text-primary font-normal">{{ title }}</h1>
    </div>
    <p class="text-3xl text-black text-center">{{ subTitle }}</p>
  </div>
</template>
