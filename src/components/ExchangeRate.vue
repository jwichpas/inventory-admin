<template>
  <div class="bg-zinc-50 dark:bg-zinc-700 rounded-lg p-4">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="text-lg font-semibold text-zinc-900 dark:text-white mr-2">{{ currency }}</span>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">Dólar Americano</span>
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Compra</p>
          <p class="text-base font-medium text-zinc-900 dark:text-white">{{ buyRate.toFixed(3) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-zinc-500 dark:text-zinc-400">Venta</p>
          <p class="text-base font-medium text-zinc-900 dark:text-white">{{ sellRate.toFixed(3) }}</p>
        </div>
      </div>
    </div>
    <div class="mt-2 flex justify-between items-center">
      <span class="text-xs text-zinc-500 dark:text-zinc-400">Actualizado hoy</span>
      <div class="flex items-center">
        <span class="text-xs font-medium"
          :class="trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
          {{ trend === 'up' ? '+' : '' }}{{ (change * 100).toFixed(1) }}%
        </span>
        <svg class="h-4 w-4 ml-1"
          :class="trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            :d="trend === 'up' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  currency: {
    type: String,
    required: true
  },
  buyRate: {
    type: Number,
    required: true
  },
  sellRate: {
    type: Number,
    required: true
  },
  trend: {
    type: String,
    validator: (value: string) => ['up', 'down'].includes(value),
    required: true
  },
  change: {
    type: Number,
    required: true
  }
})
</script>
