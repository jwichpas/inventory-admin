<template>
  <div
    class="container mx-auto px-2 py-6 bg-white dark:bg-zinc-950 min-h-screen rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-950">
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
      <h1 class="text-xl md:text-2xl font-bold text-zinc-800 dark:text-rose-500 tracking-tight">Reporte de Ventas
      </h1>
      <div
        class="bg-blue-100 text-blue-800 dark:bg-zinc-800 dark:text-zinc-100 px-4 py-2 rounded-lg shadow font-semibold text-base md:text-lg">
        <span class="font-medium">Total Ventas:</span>
        <span class="ml-2">{{ totalVentas }}</span>
      </div>
    </div>

    <!-- Filtros -->
    <div
      class="mb-6 bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-xl shadow flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
        <!-- Componente de Periodos -->
        <PeriodoFilter @filter="handlePeriodoFilter" />

        <!-- Búsqueda por documento/cliente -->
        <div class="col-span-2">
          <label class="block text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-1">Buscar
            (Doc/Cliente)</label>
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="N° documento o nombre cliente"
              class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
              @input="handleSearch" />
            <MagnifyingGlassIcon class="h-5 w-5 absolute right-3 top-2.5 text-gray-400 dark:text-zinc-500" />
          </div>
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-zinc-200 mb-1">Estado</label>
          <select v-model="selectedEstado" @change="fetchVentas"
            class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100">
            <option value="">Todos</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
        <!-- Filtro por tipo de comprobante -->
        <div>
          <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1">Tipo
            Comprobante</label>
          <select v-model="selectedTipoComprobante" @change="fetchVentas"
            class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100">
            <option value="">Todos</option>
            <option value="01">Factura</option>
            <option value="03">Boleta</option>
            <option value="07">Nota de Crédito</option>
            <option value="08">Nota de Débito</option>
          </select>
        </div>
        <!-- Filtro por moneda -->
        <div>
          <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1">Moneda</label>
          <select v-model="selectedMoneda" @change="fetchVentas"
            class="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-100">
            <option value="">Todas</option>
            <option value="PEN">PEN</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="error"
      class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 mb-6 rounded-lg">
      <p>{{ error }}</p>
    </div>

    <!-- Tabla de Ventas -->
    <div v-if="!loading && !error"
      class="overflow-x-auto rounded-2xl shadow bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
      <div v-if="ventas.length === 0" class="p-8 text-center text-zinc-500 dark:text-zinc-400">
        No se encontraron ventas con los filtros seleccionados
      </div>

      <table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-xs md:text-sm">
        <thead class="bg-gray-100 dark:bg-zinc-950">
          <tr>
            <th class="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Comprobante</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Fecha</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Cliente</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Documento</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Moneda</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Estado</th>
            <th class="px-3 py-2 text-right font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Total</th>
            <th class="px-3 py-2 text-right font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider">
              Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-800">
          <tr v-for="venta in ventas" :key="venta.id"
            class="even:bg-zinc-50 dark:even:bg-zinc-900/70 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors group border-b border-zinc-200 dark:border-zinc-800 last:border-b-0">
            <td
              class="px-3 py-1 whitespace-nowrap font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <span class="flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 flex items-center justify-center font-bold text-xs">
                  {{ getInitials(venta.nom_razon_social_cliente) }}
                </span>
                <span>{{ getTipoComprobante(venta.cod_tipo_cdp) }} {{ venta.num_serie_cdp }}-{{ venta.num_cdp }}</span>
              </span>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-700 dark:text-zinc-400">{{ formatDate(venta.fec_emision) }}
            </td>
            <td class="px-3 py-1 whitespace-nowrap truncate max-w-xs">
              <div class="text-zinc-800 dark:text-zinc-200">{{ venta.nom_razon_social_cliente || '-' }}</div>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-700 dark:text-zinc-400">{{ venta.num_doc_identidad || '-'
              }}</td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-700 dark:text-zinc-400">{{ venta.cod_moneda }}</td>
            <td class="px-3 py-1 whitespace-nowrap">
              <span :class="{
                'bg-green-100 text-green-800 border border-green-300 dark:bg-green-600/20 dark:text-green-400 dark:border-green-700': venta.cod_estado_comprobante === '1',
                'bg-red-100 text-red-800 border border-red-300 dark:bg-red-600/20 dark:text-red-400 dark:border-red-700': venta.cod_estado_comprobante !== '1'
              }" class="px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full">
                {{ venta.des_estado_comprobante }}
              </span>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-right font-bold text-zinc-900 dark:text-zinc-100">
              {{ venta.cod_moneda }} {{ venta.mto_total_cp }}
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-right">
              <button @click="viewDetails(venta)"
                class="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2 py-1 rounded transition flex items-center gap-1">
                <MagnifyingGlassIcon class="h-4 w-4" />
                <span class="hidden md:inline">Ver</span>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-100 dark:bg-zinc-900">
          <tr>
            <td colspan="6" class="px-3 py-2 text-right font-semibold text-zinc-700 dark:text-zinc-400">Total:</td>
            <td class="px-3 py-2 text-right font-extrabold text-zinc-900 dark:text-zinc-100">{{ monedaPredeterminada }}
              {{ totalVentas }}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="ventas.length > 0"
      class="mt-4 flex items-center justify-between sm:rounded-lg bg-white px-2 py-2 border-t border-zinc-200 sm:px-4 dark:bg-zinc-950 dark:border-rose-500">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="pagination.currentPage === 1"
          class="relative inline-flex items-center px-3 py-1 border border-zinc-300 text-xs font-medium rounded-md text-zinc-700 bg-white hover:bg-gray-50">
          Anterior
        </button>
        <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
          class="ml-3 relative inline-flex items-center px-3 py-1 border border-zinc-300 text-xs font-medium rounded-md text-zinc-700 bg-white hover:bg-gray-50">
          Siguiente
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-xs text-zinc-700 dark:text-zinc-300">
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
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-300 bg-white text-xs font-medium text-zinc-500 dark:border-rose-400 hover:bg-gray-50 dark:bg-rose-700"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <ChevronLeftIcon class="h-4 w-4" aria-hidden="true" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="{
              'z-10 bg-rose-50 dark:bg-rose-200 border-rose-500 text-rose-600': pagination.currentPage === page,
              'bg-white dark:bg-rose-900 border-zinc-300 dark:border-rose-400 text-zinc-500 dark:text-zinc-400 hover:bg-gray-50': pagination.currentPage !== page
            }" class="relative inline-flex items-center px-3 py-1 border text-xs font-medium">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-300 dark:border-rose-400 bg-white text-xs font-medium text-zinc-500 hover:bg-gray-50 dark:bg-rose-700"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === pagination.lastPage }">
              <span class="sr-only">Siguiente</span>
              <ChevronRightIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle -->
    <VentaModal :isOpen="isModalOpen" :venta="selectedVenta || undefined" @close="closeModal" />
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

// Tipos
interface Venta {
  id: number
  cod_tipo_cdp: string
  num_serie_cdp: string
  num_cdp: string
  fec_emision: string
  nom_razon_social_cliente: string
  num_doc_identidad: string
  cod_moneda: string
  cod_estado_comprobante: string
  des_estado_comprobante: string
  mto_total_cp: number
  // ...agrega otros campos relevantes si es necesario
}

// Datos
const ventas = ref<Venta[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const searchQuery = ref('')
const selectedEstado = ref('')
const selectedPeriodo = ref('')
const isModalOpen = ref(false)
const selectedVenta = ref<Venta | null>(null)
const selectedTipoComprobante = ref('')
const selectedMoneda = ref('')

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
      periodo: selectedPeriodo.value,
      cod_tipo_cdp: selectedTipoComprobante.value,
      cod_moneda: selectedMoneda.value
    }
    const response = await api.get(`/ventasmensual/por-periodo?per_periodo=${periodo}&per_ruc=${empresaRuc}`, { params })
    ventas.value = response.data.data.data
    pagination.value = {
      currentPage: response.data.data.current_page,
      perPage: response.data.data.per_page,
      total: response.data.data.total,
      lastPage: response.data.data.last_page,
      from: response.data.data.from,
      to: response.data.data.to
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
const viewDetails = (venta: Venta) => {
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

const getInitials = (name: string) => {
  if (!name) return '?'
  const words = name.split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}

// Totales
const monedaPredeterminada = computed(() => {
  return ventas.value.length > 0 ? ventas.value[0].cod_moneda : 'PEN'
})

const totalVentas = computed(() => {
  const total = ventas.value.reduce((sum, venta) => sum + (Number(venta.mto_total_cp) || 0), 0)
  return total.toFixed(2)
})

// Cargar datos iniciales
onMounted(() => {
  fetchVentas()
})
</script>
