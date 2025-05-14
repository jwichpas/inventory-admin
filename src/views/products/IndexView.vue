<template>
  <div class="py-6">
    <!-- Header y botones -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ filteredProducts.length }} productos encontrados
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Buscar productos..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <router-link to="/products/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Nuevo Producto
        </router-link>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select id="category" v-model="selectedCategory"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select id="status" v-model="selectedStatus"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="low-stock">Bajo stock</option>
          </select>
        </div>

        <button @click="resetFilters" class="self-end text-sm text-indigo-600 hover:text-indigo-800">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in headers" :key="header.key" scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div class="flex items-center">
                  {{ header.label }}
                  <button v-if="header.sortable" @click="sortBy(header.key)" class="ml-1">
                    <ArrowsUpDownIcon class="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredProducts.length === 0">
              <td :colspan="headers.length + 1" class="px-6 py-4 text-center text-sm text-gray-500">
                No se encontraron productos
              </td>
            </tr>

            <tr v-for="product in paginatedProducts" :key="product.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img :src="product.image || '/images/default-product.png'" :alt="product.name"
                      class="h-10 w-10 rounded-md object-cover">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ product.sku }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ product.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'bg-green-100 text-green-800': product.stock_status === 'in_stock',
                  'bg-yellow-100 text-yellow-800': product.stock_status === 'low_stock',
                  'bg-red-100 text-red-800': product.stock_status === 'out_of_stock'
                }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ stockStatusText(product.stock_status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.stock }} unidades
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <router-link :to="`/products/${product.id}`" class="text-indigo-600 hover:text-indigo-900"
                    title="Ver detalle">
                    <EyeIcon class="h-5 w-5" />
                  </router-link>
                  <router-link :to="`/products/edit/${product.id}`" class="text-yellow-600 hover:text-yellow-900"
                    title="Editar">
                    <PencilSquareIcon class="h-5 w-5" />
                  </router-link>
                  <button @click="confirmDelete(product)" class="text-red-600 hover:text-red-900" title="Eliminar">
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
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando
              <span class="font-medium">{{ pagination.from }}</span>
              a
              <span class="font-medium">{{ pagination.to }}</span>
              de
              <span class="font-medium">{{ pagination.total }}</span>
              resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="prevPage" :disabled="pagination.currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Anterior</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
              </button>

              <button v-for="page in pagination.totalPages" :key="page" @click="goToPage(page)" :class="{
                'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': pagination.currentPage === page,
                'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': pagination.currentPage !== page
              }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ page }}
              </button>

              <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Siguiente</span>
                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <ConfirmationModal :show="showDeleteModal" @close="showDeleteModal = false" @confirm="deleteProduct"
      title="Eliminar producto">
      ¿Estás seguro que deseas eliminar el producto "{{ productToDelete?.name }}"? Esta acción no se puede deshacer.
    </ConfirmationModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'
import ConfirmationModal from '@/components/ConfirmationModal.vue'

// Datos de ejemplo (en un caso real estos vendrían de una API)
const products = ref([
  {
    id: 1,
    name: 'Laptop HP Pavilion',
    sku: 'LP-HP-001',
    category: 'Tecnología',
    stock: 15,
    stock_status: 'in_stock',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    name: 'Laptop Dell XPS 13',
    sku: 'LP-DX-002',
    category: 'Tecnología',
    stock: 10,
    stock_status: 'in_stock',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  // ... más productos
])

const categories = ref([
  { id: 1, name: 'Tecnología' },
  { id: 2, name: 'Oficina' },
  { id: 3, name: 'Suministros' }
])

// Filtros y búsqueda
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortField = ref('name')
const sortDirection = ref('asc')

// Paginación
const itemsPerPage = 10
const pagination = ref({
  currentPage: 1,
  total: 0,
  from: 0,
  to: 0,
  totalPages: 0
})

// Modal de confirmación
const showDeleteModal = ref(false)
const productToDelete = ref(null)

// Headers de la tabla
const headers = ref([
  { key: 'name', label: 'Producto', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'stock_status', label: 'Estado', sortable: false },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'price', label: 'Precio', sortable: true }
])

// Productos filtrados
const filteredProducts = computed(() => {
  let result = products.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    )
  }

  // Filtrar por categoría
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  // Filtrar por estado
  if (selectedStatus.value) {
    if (selectedStatus.value === 'active') {
      result = result.filter(p => p.stock_status === 'in_stock')
    } else if (selectedStatus.value === 'inactive') {
      result = result.filter(p => p.stock_status === 'out_of_stock')
    } else if (selectedStatus.value === 'low-stock') {
      result = result.filter(p => p.stock_status === 'low_stock')
    }
  }

  // Ordenar
  result.sort((a, b) => {
    let modifier = 1
    if (sortDirection.value === 'desc') modifier = -1

    if (a[sortField.value] < b[sortField.value]) return -1 * modifier
    if (a[sortField.value] > b[sortField.value]) return 1 * modifier
    return 0
  })

  return result
})

// Productos paginados
const paginatedProducts = computed(() => {
  const start = (pagination.value.currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Actualizar paginación
const updatePagination = () => {
  pagination.value.total = filteredProducts.value.length
  pagination.value.totalPages = Math.ceil(filteredProducts.value.length / itemsPerPage)
  pagination.value.from = (pagination.value.currentPage - 1) * itemsPerPage + 1
  pagination.value.to = Math.min(
    pagination.value.currentPage * itemsPerPage,
    filteredProducts.value.length
  )
}

// Cambiar página
const goToPage = (page) => {
  pagination.value.currentPage = page
}

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++
  }
}

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}

// Ordenar tabla
const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Resetear filtros
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
}

// Confirmar eliminación
const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

// Eliminar producto
const deleteProduct = () => {
  products.value = products.value.filter(p => p.id !== productToDelete.value.id)
  showDeleteModal.value = false
}

// Helpers
const stockStatusText = (status) => {
  const statusMap = {
    'in_stock': 'En stock',
    'low_stock': 'Stock bajo',
    'out_of_stock': 'Sin stock'
  }
  return statusMap[status] || status
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value)
}

// Watchers y lifecycle hooks
onMounted(() => {
  updatePagination()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
