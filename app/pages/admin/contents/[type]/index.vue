<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth", props: true });

type Props = { type: string };
const { type } = defineProps<Props>();

const route = useRoute();
const router = useRouter();
const toast = useToast();

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "actions", header: "Actions" },
];

const { data, refresh } = await useFetch(`/api/contents/${type}`);

const rows = computed(() =>
  ((data as any).value ?? []).map((row: any) => ({
    ...row,
    createdAt: new Date(row.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  })),
);

const deleteTarget = ref<number | null>(null);
const isDeleteOpen = ref(false);

const confirmDelete = (id: number | string) => {
  deleteTarget.value = Number(id);
  isDeleteOpen.value = true;
};

const handleDelete = async () => {
  if (!deleteTarget.value) return;
  try {
    await $fetch(`/api/contents/${type}/${deleteTarget.value}`, {
      method: "DELETE",
    });
    toast.add({
      title: "Deleted successfully.",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    isDeleteOpen.value = false;
    deleteTarget.value = null;
    await refresh();
  } catch {
    toast.add({
      title: "Failed to delete.",
      color: "error",
      icon: "i-heroicons-x-circle",
    });
  }
};
</script>
<template>
  <ClientOnly>
    <div class="p-8">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold">
            {{ type.toUpperCase() }}
          </h1>
          <p class="text-sm mt-1">Manage your {{ type }}s</p>
        </div>
        <UButton
          label="Add New"
          color="primary"
          icon="i-heroicons-plus"
          @click="router.push(`${route.fullPath}/new`)"
        />
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
                color="neutral"
                variant="ghost"
                class="cursor-pointer"
                @click="router.push(`${route.fullPath}/${row.original?.id}`)"
              >
                Edit
              </UButton>
              <UButton
                icon="i-heroicons-trash"
                color="error"
                variant="ghost"
                class="cursor-pointer"
                @click="confirmDelete((row as any).original?.id)"
              >
                Delete
              </UButton>
            </div>
          </template>
        </UTable>
      </UCard>

      <UModal v-model:open="isDeleteOpen" title="Delete Recipe">
        <template #content>
          <UCard>
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon
                  name="i-heroicons-exclamation-triangle"
                  class="text-red-500 w-5 h-5"
                />
                <h3 class="font-semibold">Delete Recipe</h3>
              </div>
            </template>

            <p class="text-sm">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </p>

            <template #footer>
              <div class="flex justify-end gap-2">
                <UButton
                  label="Cancel"
                  color="neutral"
                  variant="ghost"
                  @click="isDeleteOpen = false"
                />
                <UButton label="Delete" color="error" @click="handleDelete" />
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </div>
  </ClientOnly>
</template>
