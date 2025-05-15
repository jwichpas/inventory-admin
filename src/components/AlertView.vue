<template>
  <div class="flex items-center p-4 mb-4 text-sm border rounded-lg cursor-pointer" :class="alertClasses" role="alert"
    @click="$emit('close')">
    <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
      viewBox="0 0 20 20">
      <path
        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
    </svg>
    <span class="sr-only">{{ type }}</span>
    <div>
      <span v-if="title" class="font-medium">{{ title }}</span>
      <slot>{{ message }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String as () => 'info' | 'danger' | 'success' | 'warning' | 'dark',
    default: 'info',
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    default: '',
  },
});

defineEmits(['close']);

const alertClasses = computed(() => {
  const classes = {
    info: 'text-blue-800 border-blue-300 bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800',
    danger: 'text-red-800 border-red-300 bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800',
    success: 'text-green-800 border-green-300 bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800',
    warning: 'text-yellow-800 border-yellow-300 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800',
    dark: 'text-gray-800 border-gray-300 bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
  };
  return classes[props.type];
});
</script>
