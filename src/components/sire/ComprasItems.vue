<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-50" @close="closeModal">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/75" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3"
                class="text-lg font-medium leading-6 text-zinc-900 dark:text-zinc-100 border-b border-zinc-300 pb-2">
                Detalle de Compra #{{ compra?.id || 'N/A' }}
              </DialogTitle>

              <div class="mt-4 space-y-4">
                <!-- Información general -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="bg-white dark:bg-zinc-950 border border-zinc-300 p-4 rounded-lg">
                    <h4 class="font-semibold text-zinc-700 dark:text-zinc-200">Información General</h4>
                    <div class="mt-2 space-y-1 text-sm">
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Proveedor:</span>
                        {{ compra?.nom_razon_social_proveedor || 'No especificado' }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">RUC:</span>
                        {{ compra?.num_doc_identidad_proveedor || 'No especificado' }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Fecha Emisión:</span>
                        {{ formatDate(compra?.fec_emision) }}
                      </p>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-zinc-950 border border-zinc-300 p-4 rounded-lg">
                    <h4 class="font-semibold text-zinc-700 dark:text-zinc-200">Documento</h4>
                    <div class="mt-2 space-y-1 text-sm">
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Tipo:</span>
                        {{ compra?.cod_tipo_cdp || 'No especificado' }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Número:</span>
                        {{ compra?.num_serie_cdp }}-{{ compra?.num_cdp }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Moneda:</span>
                        <span
                          :class="compra?.cod_moneda === 'PEN' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'">
                          {{ compra?.cod_moneda }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Montos -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-white dark:bg-zinc-950 border border-zinc-300 p-4 rounded-lg">
                    <h4 class="font-semibold text-zinc-700 dark:text-zinc-200">Totales</h4>
                    <div class="mt-2 space-y-1 text-sm">
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Gravado:</span>
                        {{ formatCurrency(compra?.montos?.mto_bi_gravada_dg) }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">IGV:</span>
                        {{ formatCurrency(compra?.montos?.mto_igv_ipm_dg) }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Total:</span>
                        {{ formatCurrency(compra?.mto_total_cp) }}
                      </p>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-zinc-950 border border-zinc-300 p-4 rounded-lg">
                    <h4 class="font-semibold text-zinc-700 dark:text-zinc-200">Estado</h4>
                    <div class="mt-2">
                      <span :class="getStatusClasses(compra?.des_estado_comprobante)"
                        class="px-3 py-1 rounded-full text-sm">
                        {{ compra?.des_estado_comprobante || 'No especificado' }}
                      </span>
                    </div>
                  </div>

                  <div class="bg-white dark:bg-zinc-950 border border-zinc-300 p-4 rounded-lg">
                    <h4 class="font-semibold text-zinc-700 dark:text-zinc-200">Fechas</h4>
                    <div class="mt-2 space-y-1 text-sm">
                      <p class="text-zinc-600 dark:text-zinc-300">
                        <span class="font-medium">Vencimiento:</span>
                        {{ formatDate(compra?.fec_venc_pag) }}
                      </p>
                      <p class="text-zinc-600 dark:text-zinc-300"
                        :class="{ 'text-red-500': isDateExpired(compra?.fec_venc_pag) }">
                        <span class="font-medium">Estado:</span>
                        {{ isDateExpired(compra?.fec_venc_pag) ? 'Vencido' : 'Vigente' }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Items de compra -->
                <div v-if="compra?.items?.length" class="mt-6 ">
                  <h4 class="font-semibold text-zinc-700 dark:text-zinc-200 mb-3">Items</h4>
                  <div class="overflow-x-auto table-fixed rounded-2xl border  border-zinc-300">
                    <table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
                      <thead class="bg-zinc-50 dark:bg-zinc-900 ">
                        <tr>
                          <th
                            class="px-4 py-3 text-left text-xs text-ellipsis font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                            Descripción</th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                            Cantidad</th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                            P. Unitario</th>
                          <th
                            class="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                            Total</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white dark:bg-zinc-950 divide-y divide-zinc-200 dark:divide-zinc-700">
                        <tr v-for="(item, index) in compra.items" :key="index">
                          <td class="px-4 py-4 text-sm max-w-xs text-zinc-900 dark:text-zinc-200">
                            {{ item.description }}
                            <div v-if="item.itemClassCode"
                              class="text-xs text-ellipsis text-zinc-500 dark:text-zinc-400 mt-1">
                              Código: {{ item.itemClassCode }}
                            </div>
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                            {{ item.invoicedQuantity }} {{ item.unitCode }}
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                            {{ formatCurrency(item.priceAmount) }}
                          </td>
                          <td class="px-4 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                            {{ formatCurrency(Number(item.priceAmount) * Number(item.invoicedQuantity)) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="mt-6 text-center text-zinc-500 dark:text-zinc-400">
                  No hay items registrados para esta compra
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-900/50 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
/* import { ref, computed } from 'vue' */
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface CompraItem {
  compra_id: number
  invoicedQuantity: string | number
  unitCode: string
  priceAmount: string | number
  description: string
  itemClassCode?: string
}

interface Compra {
  id?: number
  nom_razon_social_proveedor?: string
  num_doc_identidad_proveedor?: string
  fec_emision?: string
  fec_venc_pag?: string
  cod_tipo_cdp?: string
  num_serie_cdp?: string
  num_cdp?: string
  cod_moneda?: string
  des_estado_comprobante?: string
  mto_total_cp?: number
  montos?: {
    mto_bi_gravada_dg?: number
    mto_igv_ipm_dg?: number
  }
  items?: CompraItem[]
}

const props = defineProps<{
  isOpen: boolean
  compra: Compra | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const closeModal = () => {
  emit('close')
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'No especificado'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const formatCurrency = (value?: number | string) => {
  if (value === undefined || value === null) return 'S/ 0.00'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(num)
}

const isDateExpired = (dateString?: string) => {
  if (!dateString) return false
  const [year, month, day] = dateString.split('-')
  const fechaVencimiento = new Date(`${year}-${month}-${day}`)
  return fechaVencimiento < new Date()
}

const getStatusClasses = (status?: string) => {
  switch (status?.toUpperCase()) {
    case 'PAGADO':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
    case 'PENDIENTE':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
    case 'ANULADO':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
    default:
      return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
  }
}
</script>
