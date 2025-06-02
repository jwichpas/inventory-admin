<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Detalle de Compras</h1>
      <div class="bg-blue-100 px-4 py-2 rounded-md">
        <span class="font-medium">RUC:</span>
        <span class="ml-2">{{ empresaRuc }}</span>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="flex flex-wrap gap-4">
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
          <input type="date" v-model="filters.fechaDesde"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
          <input type="date" v-model="filters.fechaHasta"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full md:w-auto flex items-end">
          <button @click="fetchCompras"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span class="flex items-center">
              <ArrowPathIcon class="h-5 w-5 mr-2" />
              Buscar
            </span>
          </button>
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

    <!-- Tabla de Compras -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8" v-for="compra in compras" :key="compra.id">
      <!-- Encabezado de Compra -->
      <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div class="flex flex-wrap justify-between items-center">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              {{ compra.des_tipo_cdp }} {{ compra.num_serie_cdp }}-{{ compra.num_cdp }}
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Proveedor: {{ compra.nom_razon_social_proveedor }} ({{ compra.num_doc_identidad_proveedor }})
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">
              <span class="font-medium">Fecha:</span> {{ formatDate(compra.fec_emision) }}
            </p>
            <p class="text-lg font-bold">
              Total: {{ compra.cod_moneda }} {{ compra.mto_total_cp }}
            </p>
          </div>
        </div>
      </div>

      <!-- Tabla de Items -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unitario
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IGV
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in compra.items" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ item.invoicedQuantity }} {{ item.unitCode }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ compra.cod_moneda }} {{ item.priceAmount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ compra.cod_moneda }} {{ item.taxableAmount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ compra.cod_moneda }} {{ item.taxAmount }} ({{ item.percent }}%)
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ compra.cod_moneda }} {{ (parseFloat(item.taxableAmount) + parseFloat(item.taxAmount)).toFixed(2) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="5" class="px-6 py-3 text-right text-sm font-medium text-gray-500">
                Total Compra:
              </td>
              <td class="px-6 py-3 text-sm font-bold text-gray-900">
                {{ compra.cod_moneda }} {{ compra.mto_total_cp }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Paginación -->
    <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
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
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button @click="prevPage" :disabled="pagination.currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button v-for="page in pagination.lastPage" :key="page" @click="goToPage(page)" :class="{
              'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600': pagination.currentPage === page,
              'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0': pagination.currentPage !== page
            }" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === pagination.lastPage }">
              <span class="sr-only">Siguiente</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import api from '@/api/axios'

interface Item {
  id: number
  compra_id: number
  invoicedQuantity: string
  unitCode: string
  priceAmount: string
  priceTypeCode: string
  sellersId: string | null
  description: string
  itemClassCode: string | null
  taxAmount: string
  taxableAmount: string
  taxExemptionReasonCode: string
  percent: string
  created_at: string
  updated_at: string
}

interface Compra {
  id: number
  id_registro: string
  num_ruc: string
  nom_razon_social: string
  cod_car: string
  cod_tipo_cdp: string
  des_tipo_cdp: string
  num_serie_cdp: string
  num_cdp: string
  fec_emision: string
  fec_venc_pag: string
  num_cdp_rango_final: string | null
  cod_tipo_doc_identidad_proveedor: string
  num_doc_identidad_proveedor: string
  nom_razon_social_proveedor: string
  cod_tipo_carga: string
  cod_situacion: string
  cod_moneda: string
  mto_total_cp: string
  cod_estado_comprobante: string
  des_estado_comprobante: string
  ind_oper_gratuita: string | null
  cod_tipo_motivo_nota: string | null
  des_tipo_motivo_nota: string | null
  ind_editable: string | null
  per_tributario: string
  num_inconsistencias: string | null
  ind_inf_incompleta: string | null
  ind_modificado_contribuyente: string | null
  plazo_visualizacion: string | null
  ind_detraccion: string | null
  ind_inclu_exclu_car: number
  por_participacion: string | null
  cod_bbss: string | null
  cod_id_proyecto: string | null
  ann_cdp: string | null
  cod_dep_aduanera: string | null
  ind_fuente_cp: string
  lis_cod_inconsistencia: string
  lis_num_casilla: string
  por_tasa_retencion: string | null
  des_msj_original: string | null
  num_car_ind_ie: string | null
  num_correlativo: number
  por_tasa_igv: string
  archivo_carga: string
  campos_libres: string
  created_at: string
  updated_at: string
  items: Item[]
}

// Estado reactivo
const empresaRuc = ref(localStorage.getItem('empresaRuc') || '')
const compras = ref<Compra[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Filtros
const filters = ref({
  fechaDesde: '',
  fechaHasta: ''
})

// Paginación
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0
})

// Formatear fecha
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-PE', options)
}

// Obtener compras
const fetchCompras = async () => {
  try {
    loading.value = true
    error.value = null

    const params = {
      page: pagination.value.currentPage,
      perPage: pagination.value.perPage,
      fechaDesde: filters.value.fechaDesde,
      fechaHasta: filters.value.fechaHasta
    }

    const response = await api.get(`/compras-detalles/${empresaRuc.value}`, { params })
    compras.value = response.data.data
    console.log(response.data.data)
    pagination.value = {
      currentPage: response.data.current_page,
      perPage: response.data.per_page,
      total: response.data.total,
      lastPage: response.data.last_page,
      from: response.data.from,
      to: response.data.to
    }
  } catch (err) {
    error.value = 'Error al cargar las compras'
    console.error('Error fetching compras:', err)
  } finally {
    loading.value = false
  }
}

// Navegación de paginación
const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.lastPage) {
    pagination.value.currentPage++
    fetchCompras()
  }
}

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
    fetchCompras()
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page
    fetchCompras()
  }
}

// Cargar datos iniciales
onMounted(() => {
  // Establecer fechas por defecto (últimos 30 días)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  filters.value.fechaDesde = startDate.toISOString().split('T')[0]
  filters.value.fechaHasta = endDate.toISOString().split('T')[0]

  fetchCompras()
})
</script>
