<template>
  <footer class="bg-gray-100 border-t pt-10">
    <div
      class="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center"
    >
      <p class="text-gray-600 w-full text-center">
        &copy; {{ new Date().getFullYear() }} ChefBey. All rights reserved.
      </p>

      <!-- <div class="flex space-x-4 mt-4 md:mt-0">
         <NuxtLink to="/privacy" class="hover:text-priamry">Privacy</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-priamry">Terms</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-priamry">Contact</NuxtLink>
      </div> -->
    </div>
  </footer>
</template>
