<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Lista de Productos</h1>
      <router-link to="/products/create"
        class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
        <PlusIcon class="w-5 h-5 mr-2" />
        Nuevo Producto
      </router-link>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input type="text" v-model="searchQuery" placeholder="Nombre o código..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="selectedCategory"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Todas las categorías</option>
            <option v-for="category in uniqueCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select v-model="selectedBrand"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Todas las marcas</option>
            <option v-for="brand in uniqueBrands" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categorías
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variantes
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex-shrink-0 h-10 w-10">
                  <img v-if="product.imagen" :src="product.imagen" :alt="product.name"
                    class="h-10 w-10 rounded-full object-cover">
                  <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <PhotoIcon class="h-6 w-6 text-gray-400" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.codigo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                <div class="text-sm text-gray-500">{{ product.description || 'Sin descripción' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <span v-for="category in product.categorias" :key="category.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ category.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex flex-col gap-1">
                  <div v-for="variant in product.variantes" :key="variant.id" class="flex items-center">
                    <span class="font-medium">{{ variant.sku }}</span>
                    <span class="mx-1">-</span>
                    <span>S/ {{ variant.precio }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                S/ {{ minPrice(product.variantes) }} - S/ {{ maxPrice(product.variantes) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button @click="editProduct(product.id)" class="text-indigo-600 hover:text-indigo-900">
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900">
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Anterior
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredProducts.length) }}</span> de
              <span class="font-medium">{{ filteredProducts.length }}</span> resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="currentPage--" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Anterior</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page" :class="{
                'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': currentPage === page,
                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': currentPage !== page
              }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ page }}
              </button>
              <button @click="currentPage++" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Siguiente</span>
                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para eliminar -->
    <ConfirmationModal :isOpen="showDeleteModal" @close="showDeleteModal = false" @confirm="deleteProduct"
      title="Eliminar Producto"
      message="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
      confirmText="Eliminar" cancelText="Cancelar" />
  </div>


</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'
import api from '@/api/axios'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

interface Category {
  id: number
  name: string
  pivot: {
    id_producto: number
    id_categoria: number
  }
}

interface Variant {
  id: number
  id_producto: number
  sku: string
  codigo_sunat: string
  precio: string
  id_unidad_medida: number
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
  empresa: Record<string, unknown>
  brand: Record<string, unknown>
  categorias: Category[]
  variantes: Variant[]
}

const router = useRouter()
const products = ref<Product[]>([])
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedBrand = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)

// Obtener productos de la API
const fetchProducts = async () => {
  try {
    const response = await api.get('/products')
    products.value = response.data
  } catch (error) {
    console.error('Error al obtener productos:', error)
  }
}

onMounted(() => {
  fetchProducts()
})

// Filtros y búsqueda
const filteredProducts = computed(() => {
  let filtered = products.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.codigo.toLowerCase().includes(query)
    )
  }

  // Filtrar por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(product =>
      product.categorias.some(cat => cat.id.toString() === selectedCategory.value))
  }

  // Filtrar por marca
  if (selectedBrand.value) {
    filtered = filtered.filter(product =>
      product.id_brand.toString() === selectedBrand.value)
  }

  return filtered
})

// Paginación
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const totalPages = computed(() =>
  Math.ceil(filteredProducts.value.length / itemsPerPage)
)

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Categorías únicas para el filtro
const uniqueCategories = computed(() => {
  const categories = new Map<number, Category>()
  products.value.forEach(product => {
    product.categorias.forEach(category => {
      if (!categories.has(category.id)) {
        categories.set(category.id, category)
      }
    })
  })
  return Array.from(categories.values())
})

// Marcas únicas para el filtro
const uniqueBrands = computed(() => {
  const brands = new Map<number, { id: number, name: string }>()
  products.value.forEach(product => {
    if (product.brand && !brands.has(product.id_brand)) {
      brands.set(product.id_brand, {
        id: product.id_brand,
        name: product.brand.name || `Marca ${product.id_brand}`
      })
    }
  })
  return Array.from(brands.values())
})

// Precios mínimo y máximo
const minPrice = (variants: Variant[]) => {
  return Math.min(...variants.map(v => parseFloat(v.precio)))
}

const maxPrice = (variants: Variant[]) => {
  return Math.max(...variants.map(v => parseFloat(v.precio)))
}

// Acciones
const editProduct = (id: number) => {
  router.push(`/products/edit/${id}`)
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  try {
    await api.delete(`/products/${productToDelete.value.id}`)
    await fetchProducts()
    showDeleteModal.value = false
  } catch (error) {
    console.error('Error al eliminar producto:', error)
  }
}
</script>
