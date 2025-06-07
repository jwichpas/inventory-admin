<template>
  <div class="max-w mx-auto">
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-blue-400  mb-2">
          INVOICE: {{ compra?.num_serie_cdp }}-{{ compra?.num_cdp }}
        </h1>
        <div v-if="compra" class="mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-500 dark:text-zinc-400">Proveedor</div>
              <div class="font-medium text-gray-900 dark:text-zinc-100">{{ compra.nom_razon_social_proveedor }}</div>
              <div class="text-xs text-gray-500 dark:text-zinc-400">RUC: {{ compra.num_doc_identidad_proveedor }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-zinc-400">Fecha</div>
              <div class="font-medium text-gray-900 dark:text-zinc-100">{{ formatDate(compra.fec_emision) }}</div>
              <div class="text-sm text-gray-500 dark:text-zinc-400">Moneda: {{ compra.cod_moneda }}</div>
              <div v-if="compra.cod_moneda !== 'PEN'" class="mt-2">
                <label class="block text-xs font-medium text-gray-700 dark:text-zinc-300 mb-1">Tipo de Cambio</label>
                <input v-model.number="exchangeRate" type="number" min="0" step="0.0001"
                  class="w-28 px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded text-xs bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
                  placeholder="Tipo de cambio" />
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-sm text-gray-500 dark:text-zinc-400">Total Original</div>
            <div class="font-bold text-lg text-blue-700 dark:text-blue-400">{{ compra.cod_moneda }} {{ formatNumber(compra.mto_total_cp) }}</div>
          </div>
        </div>
      </div>

      <div class="bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow-sm p-4 mb-4 border border-zinc-100 dark:border-zinc-800">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Flete Manual (S/)
            </label>
            <input v-model.number="manualFreight" type="number" min="0" step="0.01"
              class="w-32 px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded text-sm bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
              placeholder="S/ 0.00" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
              Tipo de Flete
            </label>
            <select v-model="selectedFreightType"
              class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-950 dark:text-zinc-100">
              <option value="">Seleccionar tipo</option>
              <option v-for="tipo in availableFreightTypes" :key="tipo" :value="tipo">
                {{ tipo }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="freightStore.activeFletes.length > 0" class="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Tarifas de Flete Disponibles:</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <div v-for="rate in currentFreightRates" :key="rate.id" class="bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-100 dark:border-zinc-800">
              <div class="font-medium text-gray-900 dark:text-zinc-100">{{
                freightStore.getWeightRangeDescription(rate.description) }}</div>
              <div class="text-blue-600 dark:text-blue-400">S/ {{ formatNumber(rate.priceAmount) }} por kg</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="compra" class="bg-white dark:bg-zinc-950 rounded-lg shadow-sm p-4 border border-zinc-100 dark:border-zinc-800">
        <h2 class="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-4">Items</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead class="bg-gray-100 dark:bg-zinc-900">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Descripción</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Cantidad</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Precio Unit.</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Base</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Peso (kg)</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Costo Flete</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Total + Flete</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Total USD</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-zinc-800">
              <tr v-for="item in compra.items" :key="item.id">
                <td class="px-3 py-3">
                  <div class="text-sm text-gray-900 dark:text-zinc-100">{{ item.description }}</div>
                  <div class="text-xs text-gray-500 dark:text-zinc-400">ID: {{ item.sellersId }}</div>
                </td>
                <td class="px-3 py-3 text-sm text-gray-900 dark:text-zinc-100">
                  {{ formatNumber(item.invoicedQuantity) }}
                </td>
                <td class="px-3 py-3 text-sm text-gray-900 dark:text-zinc-100">
                  {{ formatNumber(item.priceAmount) }}
                </td>
                <td class="px-3 py-3 text-sm font-medium text-gray-900 dark:text-zinc-100">
                  {{ formatNumber(getItemBase(item)) }}
                </td>
                <td class="px-3 py-3">
                  <input v-model.number="itemWeights[item.id]" @input="calculateFreight(item.id)"
                    type="number" step="0.01" min="0"
                    class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100"
                    placeholder="0.00" />
                  <div class="text-xs text-gray-500 dark:text-zinc-400">
                    {{ getFreightRateInfo(itemWeights[item.id]) }}
                  </div>
                </td>
                <td class="px-3 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                  {{ formatNumber(getItemFreightCost(item)) }}
                </td>
                <td class="px-3 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ formatNumber(getItemBase(item) + getItemFreightCost(item)) }}
                </td>
                <td class="px-3 py-3 text-sm font-bold text-amber-600 dark:text-amber-400">
                  {{ formatNumber(((getItemBase(item) + getItemFreightCost(item)) / exchangeRateValue()).toFixed(2)) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50 dark:bg-zinc-900">
              <tr>
                <td colspan="4" class="px-3 py-3 text-sm font-medium text-gray-700 dark:text-zinc-300 text-right">
                  Totales:
                </td>
                <td class="px-3 py-3 text-sm font-bold text-gray-900 dark:text-zinc-100">
                  {{ formatNumber(getTotalWeight()) }} kg
                </td>
                <td class="px-3 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                  {{ formatNumber(getTotalFreight()) }}
                </td>
                <td class="px-3 py-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ formatNumber(getTotalWithFreight()) }}
                </td>
                <td class="px-3 py-3 text-sm font-bold text-amber-600 dark:text-amber-400">
                  {{ formatNumber((getTotalWithFreight() / exchangeRateValue()).toFixed(2)) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFreightStore } from '@/stores/freight'
import api from '@/api/axios'

// Estado
const route = useRoute()
const compra = ref<any>(null)
const itemWeights = ref<Record<number, number>>({})
const itemFreightCosts = ref<Record<number, number>>({})
const manualFreight = ref<number | null>(null)
const selectedFreightType = ref('PESO')
const exchangeRate = ref(1)

// Store
const freightStore = useFreightStore()

// Computed
const availableFreightTypes = computed(() => freightStore.getAvailableFreightTypes())
const currentFreightRates = computed(() => freightStore.getFreightRatesByType(selectedFreightType.value))

// Métodos
const calculateFreight = (itemId: number) => {
  const weight = itemWeights.value[itemId] || 0
  itemFreightCosts.value[itemId] = freightStore.calculateFreightCost(weight)
}

const getFreightRateInfo = (weight: number): string => {
  if (!weight) return 'Ingrese peso'
  const rate = freightStore.getFreightRateForWeight(weight)
  return rate ? freightStore.getWeightRangeDescription(rate.description) : 'Sin tarifa'
}

const getItemBase = (item: any): number => {
  // Base = priceAmount * invoicedQuantity
  return parseFloat(item.priceAmount) * parseFloat(item.invoicedQuantity)
}

const exchangeRateValue = (): number => {
  if (compra.value?.cod_moneda === 'PEN') return 1
  return exchangeRate.value > 0 ? exchangeRate.value : 1
}

const getItemFreightCost = (item: any): number => {
  const pesoItem = itemWeights.value[item.id] || 0
  if (manualFreight.value !== null && !isNaN(manualFreight.value)) {
    const pesoTotal = getTotalWeight()
    if (pesoTotal > 0) {
      return (pesoItem / pesoTotal) * manualFreight.value
    }
    return 0
  }
  return itemFreightCosts.value[item.id] || 0
}

const calculateTotalWithFreight = (item: any): number => {
  const subtotal = parseFloat(item.taxableAmount)
  const freight = getItemFreightCost(item)
  return subtotal + freight
}

const getTotalWeight = (): number => {
  if (!compra.value) return 0
  return compra.value.items.reduce((total: number, item: any) => {
    return total + (itemWeights.value[item.id] || 0)
  }, 0)
}

const getTotalFreight = (): number => {
  if (manualFreight.value !== null && !isNaN(manualFreight.value)) {
    return manualFreight.value
  }
  if (!compra.value) return 0
  return compra.value.items.reduce((total: number, item: any) => {
    return total + (itemFreightCosts.value[item.id] || 0)
  }, 0)
}

const getTotalWithFreight = (): number => {
  if (!compra.value) return 0
  // Suma base + flete de todos los items
  return compra.value.items.reduce((total: number, item: any) => {
    return total + getItemBase(item) + getItemFreightCost(item)
  }, 0)
}

const formatNumber = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-PE')
}

const loadCompra = async () => {
  try {
    const response = await api.get(`/compras-items/${route.params.id}`)
    compra.value = response.data
    // Inicializar pesos si hay datos previos
    compra.value.items.forEach((item: any) => {
      if (!(item.id in itemWeights.value)) {
        itemWeights.value[item.id] = 0
      }
    })
  } catch (error) {
    console.error('Error cargando compra:', error)
  }
}

onMounted(async () => {
  await freightStore.loadFletes(compra.value?.num_ruc || localStorage.getItem('empresaRuc') || '')
  await loadCompra()
})
</script>
