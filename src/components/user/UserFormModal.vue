<template>
  <div v-if="isOpen" class="fixed inset-0 overflow-y-auto z-50">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Dark background -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <!-- Modal content -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <!-- Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <slot name="header"></slot>
        </div>

        <!-- Body -->
        <div class="px-4 py-2 sm:p-6">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
