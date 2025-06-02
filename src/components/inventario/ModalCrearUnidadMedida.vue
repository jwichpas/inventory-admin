<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25 dark:bg-black/50" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                Crear Nueva Unidad de Medida
              </DialogTitle>

              <form @submit.prevent="submitForm" class="mt-4 space-y-4">
                <div>
                  <label for="codigo_sunat" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Código SUNAT
                  </label>
                  <input type="text" id="codigo_sunat" v-model="form.codigo_sunat"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required />
                  <p v-if="errors.codigo_sunat" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors.codigo_sunat }}
                  </p>
                </div>

                <div>
                  <label for="nombre_sunat" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre SUNAT
                  </label>
                  <input type="text" id="nombre_sunat" v-model="form.nombre_sunat"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required />
                  <p v-if="errors.nombre_sunat" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors.nombre_sunat }}
                  </p>
                </div>

                <div>
                  <label for="simbolo" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Símbolo
                  </label>
                  <input type="text" id="simbolo" v-model="form.simbolo"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    required />
                  <p v-if="errors.simbolo" class="mt-1 text-sm text-red-600 dark:text-red-400">
                    {{ errors.simbolo }}
                  </p>
                </div>

                <div class="flex justify-end space-x-3 pt-4">
                  <button type="button" @click="closeModal"
                    class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                    Cancelar
                  </button>
                  <button type="submit" :disabled="loading"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span v-if="!loading">Guardar</span>
                    <span v-else class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Guardando...
                    </span>
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from 'axios'
import api from '@/api/axios'

interface UnidadMedidaForm {
  codigo_sunat: string
  nombre_sunat: string
  simbolo: string
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'created'])

const form = ref<UnidadMedidaForm>({
  codigo_sunat: '',
  nombre_sunat: '',
  simbolo: ''
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

function closeModal() {
  resetForm()
  emit('close')
}

function resetForm() {
  form.value = {
    codigo_sunat: '',
    nombre_sunat: '',
    simbolo: ''
  }
  errors.value = {}
}

async function submitForm() {
  loading.value = true
  errors.value = {}

  try {
    const response = await api.post('/unidad-medida', form.value)

    if (response.status === 201) {
      emit('created', response.data)
      closeModal()
    }
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      // Manejar errores de validación
      errors.value = error.response.data.errors || {}
    } else {
      // Error general
      console.error('Error al crear unidad de medida:', error)
      errors.value.general = 'Ocurrió un error al intentar guardar. Por favor intente nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
