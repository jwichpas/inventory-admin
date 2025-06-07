<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 dark:text-zinc-100">
                Detalle de Venta: {{ venta?.cod_tipo_cdp }} {{ venta?.num_serie_cdp }}-{{ venta?.num_cdp }}
              </DialogTitle>

              <div class="mt-4 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-zinc-100">Información del Comprobante</h4>
                    <div class="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                      <p><span class="font-medium">Tipo:</span> {{ getTipoComprobante(venta?.cod_tipo_cdp) }}</p>
                      <p><span class="font-medium">Serie-Número:</span> {{ venta?.num_serie_cdp }}-{{ venta?.num_cdp }}
                      </p>
                      <p><span class="font-medium">Fecha Emisión:</span> {{ formatDate(venta?.fec_emision) }}</p>
                      <p><span class="font-medium">Moneda:</span> {{ venta?.cod_moneda }}</p>
                      <p><span class="font-medium">Total:</span> {{ venta?.cod_moneda }} {{ venta?.mto_total_cp }}</p>
                    </div>
                  </div>

                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-zinc-100">Información del Cliente</h4>
                    <div class="mt-2 space-y-1 text-sm text-gray-500 dark:text-zinc-400">
                      <p><span class="font-medium">Razón Social:</span> {{ venta?.nom_razon_social_cliente || '-' }}</p>
                      <p><span class="font-medium">Documento:</span> {{ venta?.num_doc_identidad || '-' }}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="font-medium text-gray-900 dark:text-zinc-100">Estado</h4>
                  <div class="mt-2">
                    <span :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': venta?.cod_estado_comprobante === '1',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': venta?.cod_estado_comprobante !== '1'
                    }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ venta?.des_estado_comprobante }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-blue-900 dark:text-zinc-100 hover:bg-blue-200 dark:hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  @click="closeModal">
                  Cerrar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  venta: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-PE', options)
}

const getTipoComprobante = (codigo: string) => {
  const tipos: Record<string, string> = {
    '01': 'Factura',
    '03': 'Boleta',
    '07': 'Nota de Crédito',
    '08': 'Nota de Débito'
  }
  return tipos[codigo] || codigo
}
</script>
