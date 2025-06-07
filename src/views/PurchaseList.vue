<template>
  <div :class="['p-6 rounded-lg shadow', isDark ? 'bg-gray-800' : 'bg-white']">
    <h2 class="text-xl font-semibold mb-4">Lista de Compras</h2>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y" :class="[isDark ? 'divide-gray-700' : 'divide-gray-200']">
        <thead :class="[isDark ? 'bg-gray-700' : 'bg-gray-50']">
          <tr>
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
              Factura
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
              Peso (kg)
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
              Flete
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
              :class="[isDark ? 'text-gray-300' : 'text-gray-500']">
              Estado
            </th>
          </tr>
        </thead>
        <tbody class="divide-y" :class="[isDark ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white']">
          <tr v-for="purchase in store.purchases" :key="purchase.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="font-medium">#{{ purchase.id }}</span>
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
              {{ purchase.invoice.number }}
              <p class="text-sm" :class="[isDark ? 'text-gray-400' : 'text-gray-500']">
                S/ {{ purchase.invoice.total.toFixed(2) }}
              </p>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ calculateTotalWeight(purchase).toFixed(2) }} kg
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="purchase.freightCost">
                S/ {{ purchase.freightCost.toFixed(2) }}
              </span>
              <span v-else :class="[isDark ? 'text-yellow-400' : 'text-yellow-600']">
                Pendiente
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(purchase.status)">
                {{ getStatusText(purchase.status) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePurchaseStore } from '@/stores/purchaseStore'

const store = usePurchaseStore();

// Detectar modo dark usando clases del body (Tailwind)
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches ||
  document.documentElement.classList.contains('dark');

const calculateTotalWeight = (purchase: any) => {
  return purchase.items.reduce((sum: number, item: any) => sum + (item.weight * item.quantity), 0);
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-PE', options);
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': 'Pendiente',
    'partial': 'Parcial',
    'completed': 'Completado'
  };
  return statusMap[status] || status;
};

const getStatusClass = (status: string) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

  if (isDark) {
    return {
      'pending': `${baseClasses} bg-yellow-900 text-yellow-200`,
      'partial': `${baseClasses} bg-blue-900 text-blue-200`,
      'completed': `${baseClasses} bg-green-900 text-green-200`
    }[status];
  } else {
    return {
      'pending': `${baseClasses} bg-yellow-100 text-yellow-800`,
      'partial': `${baseClasses} bg-blue-100 text-blue-800`,
      'completed': `${baseClasses} bg-green-100 text-green-800`
    }[status];
  }
};
</script>
