<template>
  <div class="bg-white dark:bg-zinc-800 shadow rounded-lg p-6">
    <div class="flex items-center">
      <div class="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon" />
        </svg>
      </div>
      <div class="ml-5">
        <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400 truncate">{{ title }}</p>
        <div class="flex items-baseline">
          <p class="text-2xl font-semibold text-zinc-900 dark:text-white">{{ value }}</p>
          <span class="ml-2 text-sm font-medium"
            :class="isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ change }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  isPositive: {
    type: Boolean,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>
