<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Detalle de Compras</h1>
      <div class="flex items-center space-x-4">
        <div class="bg-blue-100 px-4 py-2 rounded-md">
          <span class="font-medium">RUC:</span>
          <span class="ml-2">{{ empresaRuc }}</span>
        </div>
        <button @click="exportToExcel"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
          <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
          Excel
        </button>
        <button @click="exportToPDF"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
          <DocumentArrowDownIcon class="h-5 w-5 mr-2" />
          PDF
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="flex flex-wrap gap-4">
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
          <input type="date" v-model="compraStore.filters.fechaDesde"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full md:w-auto">
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
          <input type="date" v-model="compraStore.filters.fechaHasta"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full md:w-64">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar (Doc/Proveedor)</label>
          <input type="text" v-model="compraStore.filters.searchQuery" placeholder="N° documento o proveedor"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full md:w-64">
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar por ítem</label>
          <input type="text" v-model="compraStore.filters.searchItem" placeholder="Nombre del ítem"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div class="w-full md:w-auto flex items-end space-x-2">
          <button @click="fetchCompras"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
            <MagnifyingGlassIcon class="h-5 w-5 mr-2" />
            Buscar
          </button>
          <button @click="resetFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center">
            <ArrowPathIcon class="h-5 w-5 mr-2" />
            Limpiar
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="compraStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="compraStore.error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
      <p>{{ compraStore.error }}</p>
    </div>

    <!-- Tabla de Compras -->
    <div v-if="!compraStore.loading && !compraStore.error">
      <div v-if="compraStore.compras.length === 0" class="bg-white p-8 rounded-lg shadow text-center">
        <p class="text-gray-500">No se encontraron compras con los filtros seleccionados</p>
      </div>

      <div v-for="compra in compraStore.compras" :key="compra.id" class="mb-8">
        <!-- Encabezado de Compra -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 cursor-pointer" @click="openModal(compra)">
            <div class="flex flex-wrap justify-between items-center">
              <div>
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  {{ compra.des_tipo_cdp }} {{ compra.num_serie_cdp }}-{{ compra.num_cdp }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  Proveedor: {{ compra.nom_razon_social_proveedor }} ({{ compra.num_doc_identidad_proveedor }})
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-500">
                  <span class="font-medium">Fecha:</span> {{ formatDate(compra.fec_emision) }}
                </p>
                <p class="text-lg font-bold">
                  Total: {{ compra.cod_moneda }} {{ compra.mto_total_cp }}
                </p>
              </div>
            </div>
          </div>

          <!-- Tabla de Items -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IGV
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in compra.items" :key="item.id">
                  <td class="px-6 py-4  w-xl ellipsis text-sm text-gray-900">
                    {{ item.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.invoicedQuantity }} {{ item.unitCode }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ compra.cod_moneda }} {{ item.priceAmount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ compra.cod_moneda }} {{ item.taxableAmount }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ compra.cod_moneda }} {{ item.taxAmount }} ({{ item.percent }}%)
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ compra.cod_moneda }} {{ (parseFloat(item.taxableAmount) + parseFloat(item.taxAmount)).toFixed(2)
                    }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-gray-50">
                <tr>
                  <td colspan="5" class="px-6 py-3 text-right text-sm font-medium text-gray-500">
                    Total Compra:
                  </td>
                  <td class="px-6 py-3 text-sm font-bold text-gray-900">
                    {{ compra.cod_moneda }} {{ compra.mto_total_cp }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="compraStore.compras.length > 0"
      class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Mostrando
            <span class="font-medium">{{ compraStore.pagination.from }}</span>
            a
            <span class="font-medium">{{ compraStore.pagination.to }}</span>
            de
            <span class="font-medium">{{ compraStore.pagination.total }}</span>
            resultados
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button @click="prevPage" :disabled="compraStore.pagination.currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{ 'cursor-not-allowed opacity-50': compraStore.pagination.currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="{
              'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600': compraStore.pagination.currentPage === page,
              'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0': compraStore.pagination.currentPage !== page
            }" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="compraStore.pagination.currentPage === compraStore.pagination.lastPage"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              :class="{ 'cursor-not-allowed opacity-50': compraStore.pagination.currentPage === compraStore.pagination.lastPage }">
              <span class="sr-only">Siguiente</span>
              <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle -->
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
                class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Detalle de Compra: {{ selectedCompra?.des_tipo_cdp }} {{ selectedCompra?.num_serie_cdp }}-{{
                    selectedCompra?.num_cdp }}
                </DialogTitle>

                <div class="mt-4 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 class="font-medium text-gray-900">Información del Comprobante</h4>
                      <div class="mt-2 space-y-1 text-sm text-gray-500">
                        <p><span class="font-medium">Tipo:</span> {{ selectedCompra?.des_tipo_cdp }}</p>
                        <p><span class="font-medium">Serie-Número:</span> {{ selectedCompra?.num_serie_cdp }}-{{
                          selectedCompra?.num_cdp }}</p>
                        <p><span class="font-medium">Fecha Emisión:</span> {{ formatDate(selectedCompra?.fec_emision ||
                          '') }}</p>
                        <p><span class="font-medium">Moneda:</span> {{ selectedCompra?.cod_moneda }}</p>
                        <p><span class="font-medium">Total:</span> {{ selectedCompra?.cod_moneda }} {{
                          selectedCompra?.mto_total_cp }}</p>
                      </div>
                    </div>

                    <div>
                      <h4 class="font-medium text-gray-900">Información del Proveedor</h4>
                      <div class="mt-2 space-y-1 text-sm text-gray-500">
                        <p><span class="font-medium">Razón Social:</span> {{ selectedCompra?.nom_razon_social_proveedor
                        }}</p>
                        <p><span class="font-medium">Documento:</span> {{ selectedCompra?.num_doc_identidad_proveedor }}
                        </p>
                        <p><span class="font-medium">Tipo Doc:</span> {{
                          getTipoDocumento(selectedCompra?.cod_tipo_doc_identidad_proveedor) }}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 class="font-medium text-gray-900">Items</h4>
                    <div class="mt-2 overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Descripción</th>
                            <th scope="col"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cantidad</th>
                            <th scope="col"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Precio Unit.</th>
                            <th scope="col"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subtotal</th>
                            <th scope="col"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IGV
                            </th>
                            <th scope="col"
                              class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="item in selectedCompra?.items" :key="item.id">
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.description }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ item.invoicedQuantity }} {{
                              item.unitCode }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ selectedCompra?.cod_moneda
                            }} {{ item.priceAmount }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ selectedCompra?.cod_moneda
                            }} {{ item.taxableAmount }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ selectedCompra?.cod_moneda
                            }} {{ item.taxAmount }}</td>
                            <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {{ selectedCompra?.cod_moneda }} {{ (parseFloat(item.taxableAmount) +
                                parseFloat(item.taxAmount)).toFixed(2) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 class="font-medium text-gray-900">Información Adicional</h4>
                      <div class="mt-2 space-y-1 text-sm text-gray-500">
                        <p><span class="font-medium">Estado:</span> {{ selectedCompra?.des_estado_comprobante }}</p>
                        <p><span class="font-medium">Tasa IGV:</span> {{ selectedCompra?.por_tasa_igv }}%</p>
                        <p><span class="font-medium">Período Tributario:</span> {{ selectedCompra?.per_tributario }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex justify-end">
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCompraStore } from '@/stores/comprasItemsStore'
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Compra } from '@/types/compras'

// Store
const compraStore = useCompraStore()

// Estado reactivo
const empresaRuc = ref(localStorage.getItem('empresaRuc') || '')
const isOpen = ref(false)
const selectedCompra = ref<Compra | null>(null)

// Paginación visible (máximo 5 páginas)
const visiblePages = computed(() => {
  const pages = []
  const current = compraStore.pagination.currentPage
  const last = compraStore.pagination.lastPage
  const maxVisible = 5

  if (last <= maxVisible) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    const left = Math.max(1, current - Math.floor(maxVisible / 2))
    const right = Math.min(last, left + maxVisible - 1)

    for (let i = left; i <= right; i++) {
      pages.push(i)
    }
  }

  return pages
})

// Formatear fecha
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-PE', options)
}

// Obtener tipo de documento
const getTipoDocumento = (codigo: string | undefined) => {
  if (!codigo) return ''
  const tipos: Record<string, string> = {
    '1': 'DNI',
    '6': 'RUC',
    '4': 'Carnet de Extranjería',
    '7': 'Pasaporte'
  }
  return tipos[codigo] || codigo
}

// Obtener compras
const fetchCompras = async () => {
  await compraStore.fetchCompras(empresaRuc.value)
}

// Navegación de paginación
const nextPage = () => {
  if (compraStore.pagination.currentPage < compraStore.pagination.lastPage) {
    compraStore.pagination.currentPage++
    fetchCompras()
  }
}

const prevPage = () => {
  if (compraStore.pagination.currentPage > 1) {
    compraStore.pagination.currentPage--
    fetchCompras()
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= compraStore.pagination.lastPage) {
    compraStore.pagination.currentPage = page
    fetchCompras()
  }
}

// Resetear filtros
const resetFilters = () => {
  compraStore.resetFilters()
  fetchCompras()
}

// Modal
const openModal = (compra: Compra) => {
  selectedCompra.value = compra
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

// Exportar a Excel
const exportToExcel = () => {
  const data = compraStore.compras.map(compra => ({
    'Tipo': compra.des_tipo_cdp,
    'Serie-Número': `${compra.num_serie_cdp}-${compra.num_cdp}`,
    'Fecha': formatDate(compra.fec_emision),
    'Proveedor': compra.nom_razon_social_proveedor,
    'Documento': compra.num_doc_identidad_proveedor,
    'Moneda': compra.cod_moneda,
    'Total': compra.mto_total_cp,
    'IGV': compra.por_tasa_igv,
    'Estado': compra.des_estado_comprobante
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Compras')
  XLSX.writeFile(workbook, `compras_${empresaRuc.value}.xlsx`)
}

// Exportar a PDF
const exportToPDF = () => {
  const doc = new jsPDF()

  // Título
  doc.setFontSize(18)
  doc.text(`Reporte de Compras - RUC: ${empresaRuc.value}`, 14, 20)

  // Fecha generación
  doc.setFontSize(10)
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28)

  // Datos
  const headers = [
    'Tipo',
    'Serie-Número',
    'Fecha',
    'Proveedor',
    'Documento',
    'Moneda',
    'Total',
    'IGV',
    'Estado'
  ]

  const data = compraStore.compras.map(compra => [
    compra.des_tipo_cdp,
    `${compra.num_serie_cdp}-${compra.num_cdp}`,
    formatDate(compra.fec_emision),
    compra.nom_razon_social_proveedor,
    compra.num_doc_identidad_proveedor,
    compra.cod_moneda,
    compra.mto_total_cp,
    `${compra.por_tasa_igv}%`,
    compra.des_estado_comprobante
  ])

  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 40 },
      4: { cellWidth: 20 },
      5: { cellWidth: 10 },
      6: { cellWidth: 15 },
      7: { cellWidth: 10 },
      8: { cellWidth: 15 }
    }
  })

  doc.save(`compras_${empresaRuc.value}.pdf`)
}

// Cargar datos iniciales
onMounted(() => {
  // Establecer fechas por defecto (últimos 30 días)
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  compraStore.filters.fechaDesde = startDate.toISOString().split('T')[0]
  compraStore.filters.fechaHasta = endDate.toISOString().split('T')[0]

  fetchCompras()
})
</script>

<style>
/* Estilos adicionales si son necesarios */
</style>
