<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Productos</h1>
      <div class="flex space-x-4">
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" @click="refreshProducts">
          Refrescar
        </button>
        <router-link to="/products/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Nuevo Producto
        </router-link>3
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" v-model="searchQuery" placeholder="Nombre o código"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select v-model="selectedBrand"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas</option>
            <option v-for="brand in brands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="selectedCategory"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Product Grid -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else>
      <div v-if="products.data.length === 0" class="text-center py-12">
        <p class="text-gray-500">No se encontraron productos</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="product in products.data" :key="product.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
          <!-- Product Image Placeholder -->
          <div class="bg-gray-200 h-48 flex items-center justify-center">
            <span v-if="!product.imagen" class="text-gray-400">Sin imagen</span>
            <img v-else :src="product.imagen" :alt="product.name" class="h-full w-full object-cover">
          </div>

          <!-- Product Info -->
          <div class="p-4">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-800">{{ product.name }}</h3>
              <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {{ product.codigo }}
              </span>
            </div>

            <p v-if="product.description" class="text-gray-600 mt-2 text-sm line-clamp-2">
              {{ product.description }}
            </p>

            <div class="mt-3">
              <span class="text-sm text-gray-500">Marca:</span>
              <span class="text-sm font-medium ml-1">{{ product.brand?.name || 'N/A' }}</span>
            </div>

            <div class="mt-2">
              <span class="text-sm text-gray-500">Categorías:</span>
              <div class="flex flex-wrap gap-1 mt-1">
                <span v-for="category in product.categorias" :key="category.id"
                  class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  {{ category.name }}
                </span>
              </div>
            </div>

            <!-- Variants Section -->
            <div class="mt-4 border-t pt-3">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Variantes:</h4>
              <div class="space-y-2">
                <div v-for="variant in product.variantes" :key="variant.id" class="border rounded p-2 text-sm">
                  <div class="flex justify-between">
                    <span class="font-medium">SKU: {{ variant.sku }}</span>
                    <span class="text-green-600 font-semibold">S/ {{ variant.precio }}</span>
                  </div>
                  <div v-if="variant.color" class="mt-1 flex items-center">
                    <span class="text-gray-500 mr-2">Color:</span>
                    <div class="w-4 h-4 rounded-full border border-gray-300"
                      :style="{ backgroundColor: getColorCode(variant.color) }"></div>
                    <span class="ml-1">{{ variant.color }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="products.meta.last_page > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-1">
          <button v-for="link in products.meta.links" :key="link.label" @click="fetchPage(link.url)"
            :disabled="!link.url || link.active" class="px-3 py-1 rounded-md text-sm font-medium" :class="{
              'bg-blue-600 text-white': link.active,
              'text-gray-500 hover:text-gray-700': !link.active && link.url,
              'text-gray-300 cursor-not-allowed': !link.url,
              'hover:bg-gray-100': !link.active && link.url
            }" v-html="link.label"></button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import api from '@/api/axios'

interface Empresa {
  id: number
  name: string | null
}

interface Brand {
  id: number
  name: string
}

interface Categoria {
  id: number
  name: string
  pivot: {
    id_producto: number
    id_categoria: number
  }
}

interface Atributo {
  id: number
  id_empresa: number
  id_tipo: number
  valor: string
  pivot: {
    id_variante: number
    id_atributo: number
  }
  tipo_atributo: {
    id: number
    name: string
  }
}

interface Variante {
  id: number
  id_producto: number
  sku: string
  codigo_sunat: string
  ean13: string | null
  ean14: string | null
  precio: string
  id_unidad_medida: number
  atributos: Atributo[]
  color?: string
}

interface Product {
  id: number
  id_empresa: number
  id_brand: number
  codigo: string
  name: string
  description: string | null
  imagen: string | null
  created_at: string
  updated_at: string
  empresa: Empresa
  brand: Brand
  categorias: Categoria[]
  variantes: Variante[]
}

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface Meta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number
  total: number
  filters: any[]
  sort: {
    by: string
    direction: string
  }
}

interface ApiResponse {
  data: Product[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: Meta
}

// Reactive state
const products = ref<ApiResponse>({
  data: [],
  links: {
    first: '',
    last: '',
    prev: null,
    next: null
  },
  meta: {
    current_page: 1,
    from: 1,
    last_page: 1,
    links: [],
    path: '',
    per_page: 15,
    to: 1,
    total: 1,
    filters: [],
    sort: {
      by: 'name',
      direction: 'asc'
    }
  }
})
const loading = ref(false)
const searchQuery = ref('')
const selectedBrand = ref('')
const selectedCategory = ref('')
const brands = ref<Brand[]>([])
const categories = ref<Categoria[]>([])

// Color mapping for visual representation
const colorMap: Record<string, string> = {
  'rojo': '#ef4444',
  'azul': '#3b82f6',
  'verde': '#10b981',
  'amarillo': '#f59e0b',
  'negro': '#000000',
  'blanco': '#ffffff',
  // Add more colors as needed
}

// Methods
const getColorCode = (colorName: string): string => {
  return colorMap[colorName.toLowerCase()] || '#cccccc'
}

const fetchProducts = async (url?: string) => {
  loading.value = true
  try {
    const endpoint = url || '/products'
    const params = {

    }

    const response = await api.get<ApiResponse>(endpoint, { params })
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchBrands = async () => {
  try {
    const response = await api.get<Brand[]>('/brands')
    brands.value = response.data
  } catch (error) {
    console.error('Error fetching brands:', error)
  }
}

const empresaId = localStorage.getItem('empresaId') || '';

const fetchCategories = async () => {
  try {
    const response = await api.get<Categoria[]>(`/lista-categorias/${empresaId}`)
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const refreshProducts = () => {
  fetchProducts()
}

const fetchPage = (url: string | null) => {
  if (url) {
    fetchProducts(url)
  }
}

// Watchers
watch([searchQuery, selectedBrand, selectedCategory], () => {
  fetchProducts()
}, { deep: true })

// Lifecycle hooks
onMounted(() => {
  fetchProducts()
  fetchBrands()
  fetchCategories()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
