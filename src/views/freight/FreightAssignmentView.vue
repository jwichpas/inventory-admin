<template>

  <div class="max-w mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-zinc-100">Asignación de Fletes a Compras</h1>



    <!-- Lista de Fletes Pendientes -->
    <div v-for="freight in pendingFreights" :key="freight.id" class="mb-10">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 shadow mb-4">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div class="text-indigo-700 dark:text-indigo-400 font-semibold">Flete #{{ freight.id }}</div>
            <div class="text-xs text-gray-500 dark:text-zinc-400">Factura: {{ freight.invoice.number }} | Proveedor:
              {{ freight.supplier.name }}</div>
            <div class="text-xs text-gray-500 dark:text-zinc-400">Monto: S/ {{ freight.amount.toFixed(2) }} | Fecha:
              {{ formatDate(freight.date) }}</div>
          </div>
          <div class="mt-2 md:mt-0">
            <span
              class="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded text-xs font-medium">
              {{ freight.guide ? `Guía: ${freight.guide}` : 'Sin Guía de Remisión' }}
            </span>
          </div>
        </div>
      </div>
      <!-- Filtro de búsqueda para compras -->
      <div class="mb-4 flex items-center gap-2">
        <input v-model="comprasFilters.fechaDesde" type="date"
          class="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
          @change="onDateFilterChange" @input="onDateFilterChange" />
        <input v-model="comprasFilters.fechaHasta" type="date"
          class="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
          @change="onDateFilterChange" @input="onDateFilterChange" />
        <input v-model="searchQuery" type="text" placeholder="Buscar compra, factura, proveedor, guía..."
          class="w-full md:w-96 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
          @input="onSearchInput" />
        <!-- Nuevo: Select de proveedores únicos -->
        <select v-model="comprasFilters.supplierId" @change="onSupplierSelect"
          class="px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
          <option value="">Todos los proveedores</option>
          <option v-for="supplier in uniqueSuppliers" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }} ({{ supplier.ruc }})
          </option>
        </select>
      </div>
      <!-- Compras Relacionadas -->
      <div class="mb-2 text-sm font-medium text-gray-700 dark:text-zinc-300">Compras para asignar flete:</div>
      <div class="overflow-x-auto">
        <div style="max-height: 320px; overflow-y: auto;">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950 rounded-lg">
            <thead class="bg-gray-100 dark:bg-zinc-900">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase w-10">
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Compra
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Factura
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Proveedor
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Guía
                  Remisión</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Total
                  Peso (kg)</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Total S/
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="purchase in getFilteredAndSortedPurchases(freight)" :key="purchase.id"
                class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="px-3 py-2">
                  <input type="checkbox" :value="purchase.id"
                    v-model="freightAssignmentStore.selectedPurchases[freight.id]"
                    class="rounded border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950"
                    @change="ensureSelectedPurchases(freight.id)" />
                </td>
                <td class="px-3 py-2 text-gray-900 dark:text-zinc-100 font-medium">
                  #{{ purchase.id }}
                  <div class="text-xs text-gray-500 dark:text-zinc-400">Fecha: {{ formatDate(purchase.date) }}</div>
                  <div class="text-xs text-gray-500 dark:text-zinc-400">Tipo: {{ purchase.type }}</div>
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">
                  {{ purchase.invoice.number }}
                  <div class="text-xs text-gray-500 dark:text-zinc-400">S/ {{ purchase.invoice.total.toFixed(2) }}</div>
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">
                  {{ purchase.supplier.name }}
                  <div class="text-xs text-gray-500 dark:text-zinc-400">{{ purchase.supplier.ruc }}</div>
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">
                  {{ purchase.guide || 'Sin Guía' }}
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">
                  <!-- Campo editable para el peso total si no viene de BD -->
                  {{ getTotalWeight(purchase) > 0 ? getTotalWeight(purchase).toFixed(2) : '-' }}
                  <span v-if="purchase.grossWeightMeasure && !isNaN(Number(purchase.grossWeightMeasure))"
                    class="ml-2 text-xs text-blue-600 dark:text-blue-300 font-semibold">(Guía)</span>
                  <span v-else-if="manualWeights[purchase.id] && manualWeights[purchase.id] > 0"
                    class="ml-2 text-xs text-amber-600 dark:text-amber-300">(Manual)</span>
                  <span v-else class="ml-2 text-xs text-gray-500 dark:text-zinc-400">(Auto)</span>
                </td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">
                  S/ {{ purchase.invoice.total.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Tabla de compras seleccionadas -->
      <div v-if="freightAssignmentStore.selectedPurchases[freight.id]?.length" class="mt-6">
        <div class="mb-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">Compras seleccionadas:</div>
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-indigo-200 dark:divide-indigo-800 bg-indigo-50 dark:bg-zinc-900 rounded-lg">
            <thead class="bg-indigo-100 dark:bg-zinc-900">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">
                  Compra</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">
                  Factura</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">
                  Proveedor</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">Guía
                  Remisión</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">Total
                  Peso (kg)</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase">Total
                  S/</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="purchase in getSelectedPurchases(freight)" :key="purchase.id"
                class="border-b border-indigo-100 dark:border-indigo-800">
                <td class="px-3 py-2 text-indigo-900 dark:text-indigo-100 font-medium">
                  #{{ purchase.id }}
                  <div class="text-xs text-indigo-700 dark:text-indigo-300">Fecha: {{ formatDate(purchase.date) }}</div>
                  <div class="text-xs text-indigo-700 dark:text-indigo-300">Tipo: {{ purchase.type }}</div>
                </td>
                <td class="px-3 py-2 text-indigo-800 dark:text-indigo-200">
                  {{ purchase.invoice.number }}
                  <div class="text-xs text-indigo-700 dark:text-indigo-300">S/ {{ purchase.invoice.total.toFixed(2) }}
                  </div>
                </td>
                <td class="px-3 py-2 text-indigo-800 dark:text-indigo-200">
                  {{ purchase.supplier.name }}
                  <div class="text-xs text-indigo-700 dark:text-indigo-300">{{ purchase.supplier.ruc }}</div>
                </td>
                <td class="px-3 py-2 text-indigo-800 dark:text-indigo-200">
                  {{ purchase.guide || 'Sin Guía' }}
                </td>
                <td class="px-3 py-2 text-indigo-800 dark:text-indigo-200">
                  {{ getTotalWeight(purchase) }}
                </td>
                <td class="px-3 py-2 text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                  S/ {{ purchase.invoice.total.toFixed(2) }}
                  <button @click="removeSelectedPurchase(freight.id, purchase.id)" title="Eliminar"
                    class="ml-2 text-red-600 hover:text-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Distribución del flete -->
      <div v-if="freightAssignmentStore.selectedPurchases[freight.id]?.length" class="mt-4">
        <div class="mb-2 text-sm font-medium text-gray-700 dark:text-zinc-300">Distribución del flete por peso:</div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950 rounded-lg">
            <thead class="bg-gray-100 dark:bg-zinc-900">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Item</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Compra
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Cantidad
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">P.
                  Unitario</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">P. Total
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Peso (kg)
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Flete S/
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Total +
                  Flete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in getFreightDistributionRowsFromSelected(freight)" :key="row.itemId">
                <td class="px-3 py-2 text-gray-900 dark:text-zinc-100">{{ row.itemDescription }}</td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">#{{ row.purchaseId }}</td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">{{ row.quantity }}</td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">S/ {{ row.unitPrice.toFixed(2) }}</td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">S/ {{ row.totalPrice.toFixed(2) }}</td>
                <td class="px-3 py-2 text-gray-700 dark:text-zinc-300">
                  <input v-model.number="manualItemWeights[row.itemId]" type="number" min="0" step="0.01"
                    class="w-20 px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
                    placeholder="Peso ítem" @input="updateManualItemWeight(row)" />
                  <span v-if="row.originalWeight > 0" class="ml-2 text-xs text-gray-500 dark:text-zinc-400">
                    (Auto: {{ row.originalWeight.toFixed(2) }})
                  </span>
                </td>
                <td class="px-3 py-2 text-green-700 dark:text-green-400 font-semibold">
                  S/ {{ row.freightCost.toFixed(2) }}
                </td>
                <td class="px-3 py-2 text-indigo-700 dark:text-indigo-300 font-bold">
                  S/ {{ (row.totalPrice + row.freightCost).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="assignFreight(freight.id)"
            class="px-4 py-2 rounded-md font-medium bg-indigo-600 hover:bg-indigo-700 text-white">
            Asignar Flete a Compras Seleccionadas
          </button>
        </div>
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
// filepath: c:\Docker\inventory-admin\src\views\freight\FreightAssignmentView.vue
import { ref, watchEffect, onMounted, computed, reactive } from 'vue'
import axios from '@/api/axios'
import { useFreightAssignmentStore } from '@/stores/freightAssignment'

// Datos de ejemplo
interface Supplier { id: number; name: string; ruc: string }
interface Invoice { number: string; total: number }
interface Item { id: number; description: string; weight: number }
interface Purchase {
  id: number
  date: string
  type: 'Mercadería' | 'Gasto' | 'Flete'
  supplier: Supplier
  invoice: Invoice
  guide?: string
  items: Item[]
  grossWeightMeasure?: number | null
  apiItems?: ApiCompraItem[] // NUEVO: items originales de la API
}
interface Freight {
  id: number
  date: string
  supplier: Supplier
  invoice: Invoice
  amount: number
  guide?: string
  purchases: Purchase[]
}

// Estado reactivo
const pendingFreights = ref([
  {
    id: 1,
    date: '2024-06-01',
    supplier: { id: 1, name: 'Transporte Rápido SAC', ruc: '20123456789' },
    invoice: { number: 'F001-12345', total: 100 },
    amount: 100,
    guide: 'GR-001-2024',
    // Ahora las compras reales:
    get purchases() { return compras.value }
  }
])

const manualWeights = ref<Record<number, number>>({})
// Nuevo: pesos manuales por ítem
const manualItemWeights = ref<Record<number, number>>({})
const searchQuery = ref('')

// NUEVO: Estado para compras reales y paginación
const compras = ref([])
const comprasLoading = ref(false)
const comprasPagination = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1
})
// Inicializa fechas por defecto: fechaHasta = hoy, fechaDesde = hoy - 7 días
function getTodayStr() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}
function get7DaysAgoStr() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString().slice(0, 10)
}
const comprasFilters = reactive({
  fechaDesde: get7DaysAgoStr(),
  fechaHasta: getTodayStr(),
  search: '',
  searchItem: '',
  supplierId: ''
})

// Cambia aquí el RUC si es necesario
const RUC = localStorage.getItem('empresaRuc')

// Inicializa el store de Pinia
const freightAssignmentStore = useFreightAssignmentStore()

async function fetchCompras(page = 1) {
  comprasLoading.value = true
  try {
    const params = {
      page,
      perPage: comprasPagination.value.per_page,
      fechaDesde: comprasFilters.fechaDesde,
      fechaHasta: comprasFilters.fechaHasta,
      search: comprasFilters.search,
      searchItem: comprasFilters.searchItem,
      numero_guia: comprasFilters.search,
      supplierId: comprasFilters.supplierId || undefined
    }
    const { data } = await axios.get(`/compras-detalles/${RUC}`, { params })
    compras.value = data.data.map(mapApiCompraToUi)
    comprasPagination.value.current_page = data.current_page
    comprasPagination.value.per_page = Number(data.per_page)
    comprasPagination.value.total = data.total
    comprasPagination.value.last_page = data.last_page
  } catch {
    compras.value = []
  } finally {
    comprasLoading.value = false
  }
}

// Defino un tipo explícito para el parámetro de mapApiCompraToUi y para los items
interface ApiCompraItem {
  id: number;
  description: string;
  invoicedQuantity?: string | number;
  priceAmount?: string | number;
  // ...otros campos si se requieren
}
interface ApiCompra {
  id: number
  fec_emision: string
  des_tipo_cdp?: string
  num_doc_identidad_proveedor: number | string
  nom_razon_social_proveedor: string
  num_serie_cdp: string
  num_cdp: string
  mto_total_cp: string | number
  despatch_advice?: { numero_guia: string, GrossWeightMeasure?: string | number }[]
  items?: ApiCompraItem[]
}

function mapApiCompraToUi(apiCompra: ApiCompra): Purchase {
  // Determinar el tipo permitido
  let tipo: 'Mercadería' | 'Gasto' | 'Flete' = 'Mercadería';
  if (apiCompra.des_tipo_cdp === 'Gasto') tipo = 'Gasto';
  else if (apiCompra.des_tipo_cdp === 'Flete') tipo = 'Flete';
  // Extraer GrossWeightMeasure de la primera guía (si existe y es numérico)
  let grossWeightMeasure: number | null = null;
  if (apiCompra.despatch_advice && apiCompra.despatch_advice.length > 0) {
    const gwm = apiCompra.despatch_advice[0].GrossWeightMeasure;
    if (gwm !== undefined && gwm !== null && !isNaN(Number(gwm))) {
      grossWeightMeasure = Number(gwm);
    }
  }
  const items = (apiCompra.items || []).map((item) => ({
    id: item.id,
    description: item.description,
    weight: 0
  }))
  return {
    id: Number(apiCompra.id),
    date: apiCompra.fec_emision,
    type: tipo,
    supplier: {
      id: Number(apiCompra.num_doc_identidad_proveedor),
      name: apiCompra.nom_razon_social_proveedor,
      ruc: String(apiCompra.num_doc_identidad_proveedor)
    },
    invoice: {
      number: `${apiCompra.num_serie_cdp}-${apiCompra.num_cdp}`,
      total: Number(apiCompra.mto_total_cp)
    },
    guide: apiCompra.despatch_advice && apiCompra.despatch_advice.length > 0 ? apiCompra.despatch_advice[0].numero_guia : '',
    items,
    grossWeightMeasure,
    apiItems: apiCompra.items || [] // Guardar los items originales
  }
}

// Cargar compras reales al montar
onMounted(() => {
  fetchCompras()
})

// Manejar búsqueda y paginación
function onSearchInput() {
  comprasFilters.search = searchQuery.value
  fetchCompras(1)
}
function goToPage(page: number) {
  fetchCompras(page)
}

// --- Pinia: almacena datos completos de compras seleccionadas ---
// Extiende el store para guardar los datos completos de las compras seleccionadas
// (esto requiere que el store tenga un objeto selectedPurchasesData: Record<freightId, Record<purchaseId, Purchase>>)
// Si no existe, lo inicializamos aquí para evitar errores
if (!freightAssignmentStore.selectedPurchasesData) {
  freightAssignmentStore.selectedPurchasesData = {}
}
// ---

// Modifica ensureSelectedPurchases para usar el store extendido
const ensureSelectedPurchases = (freightId: number) => {
  if (!freightAssignmentStore.selectedPurchases[freightId]) {
    freightAssignmentStore.selectedPurchases[freightId] = []
  }
  if (!freightAssignmentStore.selectedPurchasesData[freightId]) {
    freightAssignmentStore.selectedPurchasesData[freightId] = {}
  }
  // Sincroniza los datos completos de las compras seleccionadas
  const selectedIds = freightAssignmentStore.selectedPurchases[freightId]
  // Busca en todas las compras cargadas
  compras.value.forEach((purchase: Purchase) => {
    if (selectedIds.includes(purchase.id)) {
      freightAssignmentStore.saveSelectedPurchaseData(freightId, purchase)
    } else {
      freightAssignmentStore.removeSelectedPurchaseData(freightId, purchase.id)
    }
  })
}

// Inicializa todos los arrays de seleccionados al montar (para evitar errores de acceso undefined)
watchEffect(() => {
  pendingFreights.value.forEach(freight => {
    if (!freightAssignmentStore.selectedPurchases[freight.id]) {
      freightAssignmentStore.selectedPurchases[freight.id] = []
    }
  })
})

// Actualiza el peso manual si el usuario lo edita en la compra
const updateManualWeight = (purchase: Purchase) => {
  // Si el usuario borra el campo, lo quitamos del objeto
  if (!manualWeights.value[purchase.id]) {
    delete manualWeights.value[purchase.id]
  }
}

// Actualiza el peso manual si el usuario lo edita en la distribución
const updateManualItemWeight = (row: { itemId: number }) => {
  // Si el usuario borra el campo, lo quitamos del objeto
  if (!manualItemWeights.value[row.itemId]) {
    delete manualItemWeights.value[row.itemId]
  }
}

// Utilidades
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-PE', options)
}

// Devuelve el peso total: primero GrossWeightMeasure, luego manual, luego suma de items
const getTotalWeight = (purchase: Purchase) => {
  if (purchase.grossWeightMeasure && !isNaN(Number(purchase.grossWeightMeasure))) {
    return Number(purchase.grossWeightMeasure)
  }
  if (manualWeights.value[purchase.id] && manualWeights.value[purchase.id] > 0) {
    return manualWeights.value[purchase.id]
  }
  return purchase.items.reduce((sum, item) => sum + item.weight, 0)
}

// Distribución del flete por peso, permitiendo modificar el peso de cada ítem
const getFreightDistributionRows = (freight: Freight) => {
  const selectedIds = freightAssignmentStore.selectedPurchases[freight.id] || []
  const selectedPurchasesList = freight.purchases.filter(p => selectedIds.includes(p.id))
  // Suma de pesos (manual si existe, si no suma de items)
  let totalWeight = 0
  // Calcula el peso real de cada ítem (manual o automático)
  const itemRows: Array<{ itemId: number, itemDescription: string, purchaseId: number, weight: number, originalWeight: number, freightCost: number }> = []
  selectedPurchasesList.forEach(purchase => {
    // Peso total de la compra (manual o auto)
    const purchaseWeight = getTotalWeight(purchase)
    purchase.items.forEach(item => {
      // Peso original del ítem
      const originalWeight = item.weight
      // Peso editable del ítem (manual o proporcional)
      let itemWeight = manualItemWeights.value[item.id]
      if (itemWeight === undefined || itemWeight === null) {
        // Si hay peso manual en la compra, distribuye proporcionalmente
        if (manualWeights.value[purchase.id] && purchaseWeight > 0) {
          itemWeight = (item.weight / purchaseWeight) * manualWeights.value[purchase.id]
        } else {
          itemWeight = item.weight
        }
      }
      itemRows.push({
        itemId: item.id,
        itemDescription: item.description,
        purchaseId: purchase.id,
        weight: itemWeight,
        originalWeight,
        freightCost: 0 // se calcula después
      })
      totalWeight += itemWeight
    })
  })
  // Calcula el costo de flete para cada ítem según el peso editable
  return itemRows.map(row => ({
    ...row,
    freightCost: totalWeight > 0 ? (row.weight / totalWeight) * freight.amount : 0
  }))
}

// Corrijo el tipo de getFilteredAndSortedPurchases
function getFilteredAndSortedPurchases(freight: Freight) {
  const selectedIds = freightAssignmentStore.selectedPurchases[freight.id] || []
  const selectedPurchasesObjs = selectedIds
    .map(id => freight.purchases.find(p => p.id === id))
    .filter((p): p is Purchase => !!p)
  let filtered = freight.purchases.filter(p => !selectedIds.includes(p.id))
  // Filtro de proveedor
  if (comprasFilters.supplierId) {
    filtered = filtered.filter(p => String(p.supplier.id) === String(comprasFilters.supplierId))
  }
  // Filtro de búsqueda
  if (comprasFilters.search) {
    const search = comprasFilters.search.toLowerCase()
    filtered = filtered.filter(purchase => {
      const guide = (purchase.guide ?? '').toString().toLowerCase()
      const invoice = (purchase.invoice.number ?? '').toString().toLowerCase()
      const supplierName = (purchase.supplier.name ?? '').toString().toLowerCase()
      const supplierRuc = (purchase.supplier.ruc ?? '').toString().toLowerCase()
      const isSinGuia = search.replace('í', 'i').includes('sin guia')
      const noGuide = !guide || guide === ''
      return (
        (isSinGuia && noGuide) ||
        guide.includes(search) ||
        invoice.includes(search) ||
        supplierName.includes(search) ||
        supplierRuc.includes(search)
      )
    })
  }
  // Devuelve los seleccionados (de cualquier página) arriba, luego los de la página actual
  return [...selectedPurchasesObjs, ...filtered]
}

const assignFreight = (freightId: number) => {
  // Aquí iría la lógica para guardar la asignación en backend
  alert('Flete asignado correctamente (simulado)')
  freightAssignmentStore.clearSelected(freightId)
}

// Computed para proveedores únicos de las compras actuales
const uniqueSuppliers = computed(() => {
  const seen = new Set()
  return compras.value
    .map((p: Purchase) => p.supplier)
    .filter(supplier => {
      if (seen.has(supplier.id)) return false
      seen.add(supplier.id)
      return true
    })
})

function onSupplierSelect() {
  fetchCompras(1)
}

// Nueva función para obtener las compras seleccionadas desde Pinia (independiente de filtros)
function getSelectedPurchases(freight: Freight): Purchase[] {
  const data = freightAssignmentStore.selectedPurchasesData[freight.id] || {}
  return Object.values(data)
}
// Nueva función para la distribución usando solo las seleccionadas
function getFreightDistributionRowsFromSelected(freight: Freight) {
  const selectedPurchasesList = getSelectedPurchases(freight)
  let totalWeight = 0
  const itemRows: Array<{
    itemId: number,
    itemDescription: string,
    purchaseId: number,
    quantity: number,
    unitPrice: number,
    totalPrice: number,
    weight: number,
    originalWeight: number,
    freightCost: number
  }> = []
  selectedPurchasesList.forEach(purchase => {
    const purchaseWeight = getTotalWeight(purchase)
    purchase.items.forEach(item => {
      // Buscar datos originales del ítem si existen
      const originalItem = purchase.apiItems?.find(i => i.id === item.id)
      const quantity = originalItem?.invoicedQuantity ? Number(originalItem.invoicedQuantity) : 1
      const unitPrice = originalItem?.priceAmount ? Number(originalItem.priceAmount) : 0
      const totalPrice = quantity * unitPrice
      const originalWeight = item.weight
      let itemWeight = manualItemWeights.value[item.id]
      if (itemWeight === undefined || itemWeight === null) {
        if (manualWeights.value[purchase.id] && purchaseWeight > 0) {
          itemWeight = (item.weight / purchaseWeight) * manualWeights.value[purchase.id]
        } else {
          itemWeight = item.weight
        }
      }
      itemRows.push({
        itemId: item.id,
        itemDescription: item.description,
        purchaseId: purchase.id,
        quantity,
        unitPrice,
        totalPrice,
        weight: itemWeight,
        originalWeight,
        freightCost: 0
      })
      totalWeight += itemWeight
    })
  })
  return itemRows.map(row => ({
    ...row,
    freightCost: totalWeight > 0 ? (row.weight / totalWeight) * freight.amount : 0
  }))
}

// Nueva función onDateFilterChange
function onDateFilterChange() {
  fetchCompras(1)
}

// Nueva función para eliminar una compra seleccionada
function removeSelectedPurchase(freightId: number, purchaseId: number) {
  freightAssignmentStore.unselectPurchase(freightId, purchaseId)
  freightAssignmentStore.removeSelectedPurchaseData(freightId, purchaseId)
}
</script>
