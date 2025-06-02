<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import ProductForm from '@/components/inventario/ProductForm.vue'

const router = useRouter()
const productStore = useProductStore()

const handleSubmit = async (productData: any) => {
  try {
    await productStore.createProduct(productData)
    router.push({ name: 'product-list' })
  } catch (error) {
    console.error('Error creating product:', error)
  }
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Create Product</h1>
      </div>
    </div>
    <div class="mt-8 bg-white shadow rounded-lg p-6">
      <ProductForm @submit="handleSubmit" />
    </div>
  </div>
</template>
