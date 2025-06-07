<template>
  <div :class="['p-6 rounded-lg shadow', isDark ? 'bg-gray-800' : 'bg-white']">
    <h2 class="text-xl font-semibold mb-4">Asignación de Fletes Pendientes</h2>

    <div v-if="pendingFreights.length === 0" class="text-center py-8">
      <p :class="[isDark ? 'text-gray-400' : 'text-gray-500']">No hay fletes pendientes por asignar</p>
    </div>

    <div v-for="freight in pendingFreights" :key="freight.id" class="mb-8">
      <div :class="['p-4 rounded-lg mb-4', isDark ? 'bg-gray-700' : 'bg-gray-100']">
        <h3 class="font-medium">Flete #{{ freight.id }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <p class="text-sm" :class="[isDark ? 'text-gray-300' : 'text-gray-600']">Proveedor</p>
            <p>{{ freight.supplier.name }}</p>
          </div>
          <div>
            <p class="text-sm" :class="[isDark ? 'text-gray-300' : 'text-gray-600']">Factura</p>
            <p>{{ freight.invoice.number }} - S/ {{ freight.amount.toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-sm" :class="[isDark ? 'text-gray-300' : 'text-gray-600']">Fecha</p>
            <p>{{ formatDate(freight.date) }}</p>
          </div>
        </div>
      </div>

      <h4 class="font-medium mb-2">Compras sin flete asignado</h4>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y" :class="[isDark ? 'divide-gray-700' : 'divide-gray-200']">
          <thead :class="[isDark ? 'bg-gray-700' : 'bg-gray-50']">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
                Seleccionar
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
                Compra
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
                Proveedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
                Peso Total (kg)
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
                Factura
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" :class="[isDark ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white']">
            <tr v-for="purchase in availablePurchases" :key="purchase.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox" v-model="selectedPurchases[freight.id]" :value="purchase.id" class="rounded"
                  :class="[isDark ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300']">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="font-medium">Compra #{{ purchase.id }}</span>
                <p class="text-sm" :class="[isDark ? 'text-gray-400' : 'text-gray-500']">
                  {{ formatDate(purchase.date) }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ purchase.supplier.name }}
                <p class="text-sm" :class="[isDark ? 'text-gray-400' : 'text-gray-500']">
                  {{ purchase.supplier.ruc }}
                </p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ calculateTotalWeight(purchase).toFixed(2) }} kg
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ purchase.invoice.number }}
                <p class="text-sm" :class="[isDark ? 'text-gray-400' : 'text-gray-500']">
                  S/ {{ purchase.invoice.total.toFixed(2) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="assignFreight(freight.id)"
          :disabled="!selectedPurchases[freight.id] || selectedPurchases[freight.id].length === 0"
          class="px-4 py-2 rounded-md font-medium" :class="[
            (!selectedPurchases[freight.id] || selectedPurchases[freight.id].length === 0)
              ? (isDark ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
              : (isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white')
          ]">
          Asignar Flete a Compras Seleccionadas
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// filepath: c:\Docker\inventory-admin\src\views\FreightAssignment.vue
import { usePurchaseStore } from '@/stores/purchaseStore'
import { computed, ref } from 'vue'

const store = usePurchaseStore()
const selectedPurchases = ref<Record<number, number[]>>({})

const pendingFreights = computed(() => store.pendingFreights)
const availablePurchases = computed(() => store.purchasesWithoutFreight)

// Detectar modo dark usando clases del body (Tailwind)
const isDark =
  window.matchMedia('(prefers-color-scheme: dark)').matches ||
  document.documentElement.classList.contains('dark')

const calculateTotalWeight = (purchase: any) => {
  return purchase.items.reduce((sum: number, item: any) => sum + (item.weight * item.quantity), 0)
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-PE', options)
}

const assignFreight = (freightId: number) => {
  if (selectedPurchases.value[freightId] && selectedPurchases.value[freightId].length > 0) {
    store.assignFreightToPurchase(freightId, selectedPurchases.value[freightId])
    selectedPurchases.value[freightId] = []
  }
}
</script>
