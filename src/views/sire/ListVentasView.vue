<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Reporte de Ventas</h1>
      <div class="bg-blue-100 px-4 py-2 rounded-md">
        <span class="font-medium">Total Ventas:</span>
        <span class="ml-2">{{ totalVentas }}</span>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Componente de Periodos -->
        <PeriodoFilter @filter="handlePeriodoFilter" />

        <!-- Búsqueda por documento/cliente -->
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar (Doc/Cliente)</label>
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="N° documento o nombre cliente"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              @input="handleSearch" />
            <MagnifyingGlassIcon class="h-5 w-5 absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="selectedEstado" @change="fetchVentas"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Todos</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <p>{{ error }}</p>
    </div>

    <!-- Tabla de Ventas -->
    <div v-if="!loading && !error" class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div v-if="ventas.length === 0" class="p-8 text-center text-gray-500">
        No se encontraron ventas con los filtros seleccionados
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comprobante
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Moneda
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="venta in ventas" :key="venta.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ getTipoComprobante(venta.cod_tipo_cdp) }} {{ venta.num_serie_cdp }}-{{ venta.num_cdp }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(venta.fec_emision) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ venta.nom_razon_social_cliente || '-' }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ venta.num_doc_identidad || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ venta.cod_moneda }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="{
                'bg-green-100 text-green-800': venta.cod_estado_comprobante === '1',
                'bg-red-100 text-red-800': venta.cod_estado_comprobante !== '1'
              }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ venta.des_estado_comprobante }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
              {{ venta.cod_moneda }} {{ venta.mto_total_cp }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button @click="viewDetails(venta)" class="text-blue-600 hover:text-blue-900 mr-3">
                Ver
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <td colspan="6" class="px-6 py-3 text-right text-sm font-medium text-gray-500">
              Total:
            </td>
            <td class="px-6 py-3 text-right text-sm font-bold text-gray-900">
              {{ monedaPredeterminada }} {{ totalVentas }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="ventas.length > 0"
      class="mt-4 flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="pagination.currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Anterior
        </button>
        <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          Siguiente
        </button>
      </div>
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
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="{
              'z-10 bg-blue-50 border-blue-500 text-blue-600': pagination.currentPage === page,
              'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': pagination.currentPage !== page
            }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === pagination.lastPage }">
              <span class="sr-only">Siguiente</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle -->
    <VentaModal :isOpen="isModalOpen" :venta="selectedVenta" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import PeriodoFilter from '@/components/FiltroPeriodo.vue'
import VentaModal from '@/components/sire/VentaModal.vue'
import api from '@/api/axios'
import { debounce } from 'lodash'
import dayjs from 'dayjs'

// Datos
const ventas = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedEstado = ref('')
const selectedPeriodo = ref('')
const isModalOpen = ref(false)
const selectedVenta = ref<any>(null)

// Paginación
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0
})

// Obtener ventas
const fetchVentas = async () => {
  try {
    loading.value = true
    error.value = null
    const periodo = dayjs().format('YYYYMM')

    const empresaRuc = localStorage.getItem('empresaRuc')
    if (!empresaRuc) {
      throw new Error('No se encontró el RUC de la empresa')
    }

    const params = {
      page: pagination.value.currentPage,
      perPage: pagination.value.perPage,
      search: searchQuery.value,
      estado: selectedEstado.value,
      periodo: selectedPeriodo.value
    }

    const response = await api.get(`/ventasmensual/por-periodo?per_periodo=${periodo}&per_ruc=${empresaRuc}`, { params })
    ventas.value = response.data.data.data
    pagination.value = {
      currentPage: response.data.current_page,
      perPage: response.data.per_page,
      total: response.data.total,
      lastPage: response.data.last_page,
      from: response.data.from,
      to: response.data.to
    }
  } catch (err) {
    error.value = 'Error al cargar las ventas'
    console.error('Error fetching ventas:', err)
  } finally {
    loading.value = false
  }
}

// Filtros
const handlePeriodoFilter = (filter: { periodo: string }) => {
  selectedPeriodo.value = filter.periodo
  fetchVentas()
}

const handleSearch = debounce(() => {
  pagination.value.currentPage = 1
  fetchVentas()
}, 500)

// Paginación
const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.lastPage) {
    pagination.value.currentPage++
    fetchVentas()
  }
}

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
    fetchVentas()
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page
    fetchVentas()
  }
}

const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.currentPage
  const last = pagination.value.lastPage
  const maxVisible = 5

  if (last <= maxVisible) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    const left = Math.max(1, current - Math.floor(maxVisible / 2))
    const right = Math.min(last, left + maxVisible - 1)

    for (let i = left; i <= right; i++) {
      pages.push(i)
    }
  }

  return pages
})

// Modal
const viewDetails = (venta: any) => {
  selectedVenta.value = venta
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

// Helpers
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-PE', options)
}

const getTipoComprobante = (codigo: string) => {
  const tipos: Record<string, string> = {
    '01': 'Factura',
    '03': 'Boleta',
    '07': 'Nota de Crédito',
    '08': 'Nota de Débito'
  }
  return tipos[codigo] || codigo
}

// Totales
const monedaPredeterminada = computed(() => {
  return ventas.value.length > 0 ? ventas.value[0].cod_moneda : 'PEN'
})

const totalVentas = computed(() => {
  return ventas.value.reduce((sum, venta) => sum + parseFloat(venta.mto_total_cp || '0'), 0).toFixed(2)
})

// Cargar datos iniciales
onMounted(() => {
  fetchVentas()
})
</script>
