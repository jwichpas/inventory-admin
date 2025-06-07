<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestión de Compras</h1>

      <!-- Filtros y controles -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Buscar por Proveedor
            </label>
            <input v-model="searchProveedor" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del proveedor..." />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha desde
            </label>
            <input v-model="fechaDesde" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha hasta
            </label>
            <input v-model="fechaHasta" type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Flete
            </label>
            <select v-model="selectedFreightType"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar tipo</option>
              <option v-for="tipo in availableFreightTypes" :key="tipo" :value="tipo">
                {{ tipo }}
              </option>
            </select>
          </div>
        </div>

        <!-- Información de tarifas de flete -->
        <div v-if="freightStore.activeFletes.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 mb-2">Tarifas de Flete Disponibles:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div v-for="rate in currentFreightRates" :key="rate.id" class="bg-white p-2 rounded border">
              <div class="font-medium text-gray-900">{{
                freightStore.getWeightRangeDescription(rate.description) }}</div>
              <div class="text-blue-600">S/ {{ formatNumber(rate.priceAmount) }} por kg</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de compras -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Factura
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="compra in comprasFiltradas" :key="compra.id">
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ compra.num_serie_cdp }}-{{ compra.num_cdp }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ compra.des_tipo_cdp }}
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ compra.nom_razon_social_proveedor }}
                    </div>
                    <div class="text-sm text-gray-500">
                      RUC: {{ compra.num_doc_identidad_proveedor }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(compra.fec_emision) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ compra.cod_moneda }} {{ formatNumber(compra.mto_total_cp) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <router-link :to="`/inventario/invoice/${compra.id}`"
                      class="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      Ver Detalle
                    </router-link>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="comprasData?.total > comprasData?.per_page" class="bg-white px-4 py-3 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Mostrando {{ comprasData?.from }} a {{ comprasData?.to }} de {{ comprasData?.total }}
              resultados
            </div>
            <div class="flex space-x-2">
              <button
                v-for="link in comprasData?.links?.filter(l => l.label !== '&laquo; Previous' && l.label !== 'Next &raquo;')"
                :key="link.label" @click="changePage(link.url)" :disabled="!link.url" :class="[
                  'px-3 py-2 text-sm rounded-md',
                  link.active
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                ]">
                {{ link.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFreightStore } from '@/stores/freight'
import api from '@/api/axios'

// Tipos
interface CompraItem {
  id: number
  compra_id: number
  invoicedQuantity: string
  unitCode: string
  priceAmount: string
  priceTypeCode: string
  sellersId: string
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
  nom_razon_social_proveedor: string
  num_doc_identidad_proveedor: string
  cod_moneda: string
  mto_total_cp: string
  items: CompraItem[]
}

interface ComprasResponse {
  current_page: number
  data: Compra[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

// Store
const freightStore = useFreightStore()

// Estado reactivo
const comprasData = ref<ComprasResponse | null>(null)

// Filtros
const searchProveedor = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')
const selectedFreightType = ref('PESO')

// Computed
const comprasFiltradas = computed(() => {
  if (!comprasData.value?.data) return []

  return comprasData.value.data.filter(compra => {
    const matchProveedor = !searchProveedor.value ||
      compra.nom_razon_social_proveedor.toLowerCase().includes(searchProveedor.value.toLowerCase())

    const matchFechaDesde = !fechaDesde.value ||
      compra.fec_emision >= fechaDesde.value

    const matchFechaHasta = !fechaHasta.value ||
      compra.fec_emision <= fechaHasta.value

    return matchProveedor && matchFechaDesde && matchFechaHasta
  })
})

const availableFreightTypes = computed(() => {
  return freightStore.getAvailableFreightTypes()
})

const currentFreightRates = computed(() => {
  return freightStore.getFreightRatesByType(selectedFreightType.value)
})

// Métodos
const changePage = (url: string | null) => {
  if (url) {
    // Implementar lógica para cambiar de página
    loadCompras(url)
  }
}
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0,
})
const params = {
  page: pagination.value.currentPage,
  perPage: pagination.value.perPage,
  fechaDesde: fechaDesde.value,
  fechaHasta: fechaHasta.value,
  search: searchProveedor.value,
  // searchItem: ... // si tienes búsqueda por ítem
}
const empresaRuc = ref(localStorage.getItem('empresaRuc') || '')
const loadCompras = async (url?: string) => {
  try {
    // Aquí harías la llamada a tu API
    const response = await api.get(`/compras-detalles/${empresaRuc.value}`, { params })
    comprasData.value = await response.data

    pagination.value = {
      currentPage: response.data.current_page,
      perPage: response.data.per_page,
      total: response.data.total,
      lastPage: response.data.last_page,
      from: response.data.from,
      to: response.data.to,
    }
  } catch (error) {
    console.error('Error cargando compras:', error)
  }
}

// Ciclo de vida
onMounted(async () => {
  await freightStore.loadFletes('20611576324') // Cargar fletes primero
  await loadCompras() // Luego cargar compras
})
</script>
