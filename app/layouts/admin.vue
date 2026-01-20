<!-- <script setup lang="ts">
  onMounted(()=>{
    console.log(process.env);
  })
</script> -->
<script setup lang="ts">
const { $fireAuth, $fireFirestore } = useNuxtApp();

async function login(email: string, password: string) {
  await $fireAuth.signInWithEmailAndPassword(email, password);
}

async function getUsers() {
  const snapshot = await $fireFirestore.collection("users").get();
  snapshot.forEach((doc) => console.log(doc.id, doc.data()));
}

onMounted(() => {
  getUsers();
});
</script>
<template>
  <div class="flex">
    <!-- <Sidebar /> -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
