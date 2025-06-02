<script setup lang="ts">
import { computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  size: {
    type: String as () => 'sm' | 'md' | 'lg' | 'xl',
    default: 'md'
  },
  closeOnOutsideClick: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['close'])

// Clases dinámicas para el tamaño del modal
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-sm'
    case 'md':
      return 'max-w-md'
    case 'lg':
      return 'max-w-lg'
    case 'xl':
      return 'max-w-xl'
    default:
      return 'max-w-md'
  }
})

// Manejar cierre del modal
const handleClose = () => {
  if (props.closeOnOutsideClick) {
    emit('close')
  }
}
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25 dark:bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel :class="[
              sizeClasses,
              'w-full transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all'
            ]">
              <DialogTitle as="h3"
                class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex justify-between items-center">
                <slot name="title"></slot>
                <button @click="emit('close')" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Cerrar modal">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </DialogTitle>

              <div class="mt-4">
                <slot></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
