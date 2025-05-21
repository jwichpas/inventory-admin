<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Marcas</h1>
        <p class="text-sm text-gray-500 mt-1">
          {{ filteredBrands.length }} marcas encontradas
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Buscar marcas..."
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <router-link to="/brands/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Nueva Marca
        </router-link>
      </div>
    </div>

    <!-- Tabla de marcas -->
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
            <tr v-if="filteredBrands.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                No se encontraron marcas
              </td>
            </tr>

            <tr v-for="brand in paginatedBrands" :key="brand.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex-shrink-0 h-10 w-10">
                  <img v-lazy="getImageUrl(brand.image) || '/images/default-brand.png'" :alt="brand.name"
                    class="h-10 w-10 rounded-full object-cover">
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ brand.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ brand.codigo || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <router-link :to="`/brands/edit/${brand.id}`" class="text-indigo-600 hover:text-indigo-900"
                    title="Editar">
                    <PencilIcon class="h-5 w-5" />
                  </router-link>
                  <button @click="confirmDelete(brand)" class="text-red-600 hover:text-red-900" title="Eliminar">
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
    <ConfirmationModal :show="showDeleteModal" @close="showDeleteModal = false" @confirm="deleteBrand"
      title="Eliminar marca">
      ¿Estás seguro que deseas eliminar la marca "{{ brandToDelete?.nombre }}"?
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
import api from '@/api/axios'
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
interface Brand {
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
  return imagePath ? useImageUrl(imagePath) : '/images/default-brand.png';
};

const { showNotificationes } = useAlert();
const brands = ref<Brand[]>([]);
const loading = ref(true);
const error = ref(null);

const router = useRouter();

// Función para cargar marcas
const fetchBrands = async () => {
  try {
    loading.value = true;
    const response = await api.get('/brands'); // Ajusta el endpoint según tu API
    brands.value = response.data; // Asume que la respuesta es un array
  } catch (err) {
    error.value = 'Error al cargar marcas: ' + (err.message || 'Inténtalo de nuevo más tarde.');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

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
const brandToDelete = ref(null)

// Marcas filtradas
const filteredBrands = computed(() => {
  let result = brands.value

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

// Marcas paginadas
const paginatedBrands = computed(() => {
  const start = (pagination.value.currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredBrands.value.slice(start, end)
})

// Actualizar paginación
const updatePagination = () => {
  pagination.value.total = filteredBrands.value.length
  pagination.value.totalPages = Math.ceil(filteredBrands.value.length / itemsPerPage)
  pagination.value.from = (pagination.value.currentPage - 1) * itemsPerPage + 1
  pagination.value.to = Math.min(
    pagination.value.currentPage * itemsPerPage,
    filteredBrands.value.length
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
const confirmDelete = (brand) => {
  brandToDelete.value = brand
  console.log('Marca a eliminar:', brandToDelete.value)
  showDeleteModal.value = true
}

// Eliminar marca
const deleteBrand = async () => {
  try {
    // Aquí iría la llamada a la API para eliminar
    await api.delete(`/brands/${brandToDelete.value.id}`);

    const index = brands.value.findIndex(b => b.id === brandToDelete.value.id)
    if (index !== -1) {
      brands.value.splice(index, 1)
    }

    showNotification('Marca eliminada correctamente', 'success')
  } catch (error) {
    console.error('Error eliminando marca:', error)
    showNotification('Error al eliminar la marca', 'error')
  } finally {
    showDeleteModal.value = false
  }
}

// Cargar datos iniciales
onMounted(async () => {
  try {
    // Simular carga desde API
    await fetchBrands();
    updatePagination();
  } catch (error) {
    console.error('Error cargando marcas:', error)
    showNotification('Error al cargar las marcas', 'error')
  }
})

// Helper para mostrar notificaciones
const showNotification = (message, type = 'success') => {
  // Implementación depende de tu sistema de notificaciones
  console.log(`${type}: ${message}`)
  showNotificationes(message, 'succes', 'Éxito', 13000);
  console.log('Notificación mostrada:', message)
}
</script>

<style scoped>
/* Estilos personalizados si son necesarios */
</style>
