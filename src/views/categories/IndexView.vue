<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ filteredCategories.length }} categorías encontradas
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Buscar categorías..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <router-link to="/categories/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Nueva Categoría
        </router-link>
      </div>
    </div>

    <!-- Tabla de categorías -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Imagen
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button @click="sortBy('name')" class="flex items-center">
                  Nombre
                  <ArrowsUpDownIcon class="ml-1 h-4 w-4 text-gray-400" />
                </button>
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button @click="sortBy('codigo')" class="flex items-center">
                  Código
                  <ArrowsUpDownIcon class="ml-1 h-4 w-4 text-gray-400" />
                </button>
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredCategories.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                No se encontraron categorías
              </td>
            </tr>

            <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex-shrink-0 h-10 w-10">
                  <img v-lazy="getImageUrl(category.image) || '/images/default-category.png'" :alt="category.name"
                    class="h-10 w-10 rounded-full object-cover">
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ category.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ category.codigo || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <router-link :to="`/categories/edit/${category.id}`" class="text-indigo-600 hover:text-indigo-900"
                    title="Editar">
                    <PencilIcon class="h-5 w-5" />
                  </router-link>
                  <button @click="confirmDelete(category)" class="text-red-600 hover:text-red-900" title="Eliminar">
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
    <ConfirmationModal :show="showDeleteModal" @close="showDeleteModal = false" @confirm="deleteCategory"
      title="Eliminar categoría">
      ¿Estás seguro que deseas eliminar la categoría "{{ categoryToDelete?.name }}"?
      Esta acción no se puede deshacer.
    </ConfirmationModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import api from '@/services/api'
/* import Swal from 'sweetalert2' */
import { useAlert } from '@/composables/useAlert';
import { useImageUrl } from '@/composables/useImageUrl';


interface Empresa {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  created_at: string;
  updated_at: string;
}
interface Category {
  id: number;
  id_empresa: number;
  codigo: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  empresa: Empresa;
}

const getImageUrl = (imagePath: string) => {
  return imagePath ? useImageUrl(imagePath) : '/images/default-category.png';
};

const { showNotificationes } = useAlert();
const categories = ref<Category[]>([]);
/* const categories = ref([]); */
const loading = ref(true);
const error = ref(null);

const router = useRouter();

// Función para cargar categorías
const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await api.get('/categories'); // Ajusta el endpoint según tu API
    categories.value = response.data; // Asume que la respuesta es un array
  } catch (err) {
    error.value = 'Error al cargar categorías: ' + (err.message || 'Inténtalo de nuevo más tarde.');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Datos de ejemplo (en un caso real estos vendrían de una API)
/* const categories = ref([
  {
    id: 1,
    id_empresa: 1,
    codigo: 'CAT-001',
    name: 'Electrónicos',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 2,
    id_empresa: 1,
    codigo: 'CAT-002',
    name: 'Ropa',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  // ... más categorías
]) */

// Filtros y búsqueda
const searchQuery = ref('')
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
const categoryToDelete = ref(null)

// Categorías filtradas
const filteredCategories = computed(() => {
  let result = categories.value

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.codigo && c.codigo.toLowerCase().includes(query))
    )
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

// Categorías paginadas
const paginatedCategories = computed(() => {
  const start = (pagination.value.currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCategories.value.slice(start, end)
})

// Actualizar paginación
const updatePagination = () => {
  pagination.value.total = filteredCategories.value.length
  pagination.value.totalPages = Math.ceil(filteredCategories.value.length / itemsPerPage)
  pagination.value.from = (pagination.value.currentPage - 1) * itemsPerPage + 1
  pagination.value.to = Math.min(
    pagination.value.currentPage * itemsPerPage,
    filteredCategories.value.length
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

// Confirmar eliminación
const confirmDelete = (category) => {
  categoryToDelete.value = category
  console.log('Categoría a eliminar:', categoryToDelete.value)
  showDeleteModal.value = true
}

// Eliminar categoría
const deleteCategory = async () => {
  try {
    // Aquí iría la llamada a la API para eliminar
    await api.delete(`/categories/${categoryToDelete.value.id}`);

    const index = categories.value.findIndex(c => c.id === categoryToDelete.value.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }

    showNotification('Categoría eliminada correctamente', 'success')
  } catch (error) {
    console.error('Error eliminando categoría:', error)
    showNotification('Error al eliminar la categoría', 'error')
  } finally {
    showDeleteModal.value = false
  }
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    // Simular carga desde API
    await fetchCategories();
    updatePagination();
  } catch (error) {
    console.error('Error cargando categorías:', error)
    showNotification('Error al cargar las categorías', 'error')
  }
})

// Helper para mostrar notificaciones
const showNotification = (message, type = 'success') => {
  // Implementación depende de tu sistema de notificaciones
  console.log(`${type}: ${message}`)
  showNotificationes('Operación exitosa', 'success', 'Éxito', 13000);
  /* Swal.fire({
    icon: type,
    title: message,
    timer: 1000,
    showConfirmButton: false
  }) */
}
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>
