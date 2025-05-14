<!-- views/products/Index.vue -->
<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
      <router-link to="/products/create" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        Nuevo Producto
      </router-link>
    </div>

    <!-- Tabla de productos -->
    <ProductsTable />
  </div>
</template>

<script setup lang="ts">

</script>
