<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "auth" });

const router = useRouter();
const toast = useToast();

const search = ref("");
const page = ref(1);
const pageSize = 10;

const { data, refresh } = await useFetch("/api/seo");

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "language", header: "Language" },
  { accessorKey: "robots", header: "Robots" },
  { accessorKey: "createdAt", header: "Created At" },
  { accessorKey: "actions", header: "Actions" },
];

const allRows = computed(() =>
  ((data.value as any[]) ?? []).map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  })),
);

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return allRows.value;
  return allRows.value.filter(
    (row) =>
      row.title?.toLowerCase().includes(q) ||
      row.language?.toLowerCase().includes(q) ||
      row.robots?.toLowerCase().includes(q),
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredRows.value.length / pageSize),
);

const paginatedRows = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredRows.value.slice(start, start + pageSize);
});

// Reset to page 1 on search
watch(search, () => {
  page.value = 1;
});
</script>

<template>
  <ClientOnly>
    <div class="p-8">
      <div class="mb-6">
        <h1 class="text-2xl font-semibold">SEO</h1>
        <p class="text-sm mt-1">Manage SEO entries</p>
      </div>
      <UCard>
        <template #header>
          <UInput
            v-model="search"
            icon="i-heroicons-magnifying-glass"
            placeholder="Search by title, language or robots..."
            class="max-w-sm flex justify-self-end"
          />
        </template>

        <UTable
          :loading="!data"
          loading-color="primary"
          loading-animation="carousel"
          :data="paginatedRows"
          :columns="columns"
        >
          <template #title-cell="{ row }">
            <span>{{ row.original?.title }}</span>
            <br />
            <br />
            <span
              v-if="row.original?.contentName"
              class="bg-primary rounded-sm text-white p-1 "
            >
              {{ row.original?.contentName }}
            </span>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center gap-2">
              <UButton
                icon="i-heroicons-pencil-square"
                color="neutral"
                variant="ghost"
                class="cursor-pointer"
                @click="router.push(`/admin/seo/${row.original?.id}`)"
              >
                Edit
              </UButton>
            </div>
          </template>
        </UTable>

        <template #footer>
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-500">
              Showing {{ (page - 1) * pageSize + 1 }}–{{
                Math.min(page * pageSize, filteredRows.length)
              }}
              of {{ filteredRows.length }} entries
            </p>
            <UPagination
              v-model:page="page"
              :total="filteredRows.length"
              :items-per-page="pageSize"
            />
          </div>
        </template>
      </UCard>
    </div>
  </ClientOnly>
</template>
