<script setup lang="ts">
definePageMeta({ layout: "admin" });
const { data, refresh } = await useFetch("/api/content");

const columns: any = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "actions", header: "Actions" },
];

const rows = computed(() =>
  (data.value ?? []).map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  })),
);

const toast = useToast();
const deleteTarget = ref<number | null>(null);
const isDeleteOpen = ref(false);

const confirmDelete = (id: number | string) => {
  deleteTarget.value = Number(id);
  isDeleteOpen.value = true;
};

const handleDelete = async () => {
  if (!deleteTarget.value) return;
  try {
    await $fetch(`/api/content/delete/${deleteTarget.value}`, {
      method: "DELETE",
    });
    toast.add({
      title: "Content type deleted successfully.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    isDeleteOpen.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch (e) {
    toast.add({
      title: "Failed to delete content type.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  }
};
</script>

<template>
  <ClientOnly>
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold text-gray-800">Content Types</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your content types</p>
      </div>
      <UCard>
        <UTable
          :loading="!data"
          loading-color="primary"
          loading-animation="carousel"
          :data="rows"
          :columns="columns"
        >
          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-pencil-square"
                size="xl"
                color="neutral"
                variant="ghost"
                class="cursor-pointer"
                @click="
                  $router.push(
                    `/admin/content/${row.original.type.split(':')[1]}`,
                  )
                "
              >
                Edit
              </UButton>
              <UButton
                icon="i-heroicons-trash"
                size="xl"
                color="error"
                variant="ghost"
                class="cursor-pointer"
                @click="confirmDelete(row.original?.id)"
                >Delete</UButton
              >
            </div>
          </template>
        </UTable>
      </UCard>

      <UModal
        v-model:open="isDeleteOpen"
        title="Delete Content Type"
        description="."
      >
        <template #content>
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="text-red-500 w-5 h-5"
                />
                <h3 class="font-semibold">Delete Content Type</h3>
              </div>
            </template>

            <p class="text-sm">
              Are you sure you want to delete this content type? This action
              cannot be undone.
            </p>

            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  class="cursor-pointer"
                  @click="isDeleteOpen = false"
                />
                <UButton
                  label="Delete"
                  color="error"
                  class="cursor-pointer"
                  @click="handleDelete"
                />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </div>
  </ClientOnly>
</template>
