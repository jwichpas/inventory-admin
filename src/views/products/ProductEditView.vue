<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import ProductForm from '@/components/inventario/ProductForm.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()

const product = ref<any>(null)

onMounted(async () => {
  await productStore.fetchProducts()
  const foundProduct = productStore.products.find(p => p.id === parseInt(route.params.id as string))
  if (foundProduct) {
    product.value = foundProduct
  } else {
    router.push({ name: 'product-list' })
  }
})

const handleSubmit = async (productData: any) => {
  try {
    await productStore.updateProduct(parseInt(route.params.id as string), productData)
    router.push({ name: 'product-list' })
  } catch (error) {
    console.error('Error updating product:', error)
  }
}
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-xl font-semibold text-gray-900">Edit Product</h1>
      </div>
    </div>
    <div class="mt-8 bg-white shadow rounded-lg p-6">
      <ProductForm v-if="product" :product="product" @submit="handleSubmit" />
    </div>
  </div>
</template>
