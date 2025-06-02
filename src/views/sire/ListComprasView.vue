<template>

  <div class="py-6 ">
    <!-- Header y botones -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-zinc-200">Gestión de Compras</h1>
        <p class="text-sm text-zinc-500 mt-1 dark:text-zinc-400">
          {{ filteredInvoices.length }} compras encontradas
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative">
          <input v-model="searchQuery" type="text" placeholder="Buscar compras..."
            class="pl-10 pr-4 py-2 border border-zinc-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64">
          <MagnifyingGlassIcon class="h-5 w-5 text-zinc-400 absolute left-3 top-2.5" />
        </div>

        <router-link to="/products/create"
          class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Nueva Compra
        </router-link>
      </div>
    </div>

    <!-- Filtros -->
    <div
      class="mb-6 bg-white  p-4 rounded-lg shadow-sm border border-indigo-200 dark:border-indigo-700 dark:bg-zinc-900">
      <div class="flex flex-wrap items-center gap-4">
        <div>
          <label for="category"
            class="block text-sm font-medium text-zinc-700 mb-1 dark:text-zinc-200">Categoría</label>
          <select id="category" v-model="selectedCategory"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base
            border-zinc-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400">
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="status" class="block text-sm font-medium text-zinc-700 mb-1 dark:text-zinc-200">Estado</label>
          <select id="status" v-model="selectedStatus"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-zinc-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-zinc-800 dark:border-zinc-600 dark:placeholder-zinc-400">
            <option value="">Todos los estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="low-stock">Bajo stock</option>
          </select>
        </div>
        <FiltroPeriodo @filter="handleFilter" />
        <button @click="resetFilters"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Tabla de Compras -->
    <div
      class="bg-white dark:bg-zinc-950 shadow-sm rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
          <thead class="bg-zinc-50 dark:bg-zinc-950">
            <tr>
              <th v-for="header in headers" :key="header.key" scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                <div class="flex items-center">
                  {{ header.label }}
                  <button v-if="header.sortable" @click="sortBy(header.key)" class="ml-1">
                    <ArrowsUpDownIcon class="h-4 w-4 text-zinc-400 dark:text-zinc-400" />
                  </button>
                </div>
              </th>
              <th scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
            <tr v-if="filteredInvoices.length === 0">
              <td :colspan="headers.length + 1" class="px-6 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                No se encontraron compras
              </td>
            </tr>

            <tr v-for="invoice in paginatedInvoices" :key="invoice.id"
              class="hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
              <td class="px-6 py-4 whitespace-nowrap truncate max-w-xs">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center truncate justify-center mr-3">
                    <span class="text-blue-600 dark:text-blue-300 font-medium text-sm truncate">
                      {{ invoice.nom_razon_social_proveedor?.charAt(0) || 'P' }}
                    </span>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-zinc-900 dark:text-white">
                      {{ invoice.nom_razon_social_proveedor || 'Proveedor no especificado' }}
                    </div>
                    <div class="text-xs text-zinc-500 dark:text-zinc-400">
                      {{ invoice.num_doc_identidad_proveedor || 'Sin RUC' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm text-zinc-900 dark:text-zinc-200">
                  <svg class="w-4 h-4 mr-1 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"></path>
                  </svg>
                  {{ formatDate(invoice.fec_emision) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center text-sm" :class="{
                  'text-red-600 dark:text-red-400': isDateExpired(invoice.fec_venc_pag),
                  'text-zinc-900 dark:text-zinc-200': !isDateExpired(invoice.fec_venc_pag)
                }">
                  <svg class="w-4 h-4 mr-1 text-zinc-500 dark:text-zinc-400" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"></path>
                  </svg>
                  {{ formatDate(invoice.fec_venc_pag) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-zinc-900 dark:text-zinc-200">
                {{ invoice.cod_tipo_cdp }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {{ invoice.num_serie_cdp }}-{{ invoice.num_cdp }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <span :class="{
                  'text-green-600 dark:text-green-400': invoice.cod_moneda === 'PEN',
                  'text-blue-600 dark:text-blue-400': invoice.cod_moneda === 'USD'
                }">
                  {{ invoice.cod_moneda }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-900 dark:text-zinc-200">
                {{ formatCurrency(invoice.montos.mto_bi_gravada_dg) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm text-zinc-900 dark:text-zinc-200">
                {{ formatCurrency(invoice.montos.mto_igv_ipm_dg) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm" :class="{
                'text-zinc-900 dark:text-zinc-200': invoice.montos.mto_igv_ipm_dg >= 0,
                'text-red-600 dark:text-red-400': invoice.mto_total_cp < 0
              }">
                {{ formatCurrency(invoice.mto_total_cp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span :class="getStatusColor(invoice.des_estado_comprobante, true)"
                  class="px-3 py-1 text-xs font-medium rounded-full">
                  {{ invoice.des_estado_comprobante }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-3">
                  <button @click="openModal(invoice)"
                    class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <EyeIcon class="h-5 w-5" />
                  </button>

                  <img src="../../assets/images/icons/xml.svg" @click="showXML(invoice)" alt="ver XML"
                    class="h-5 w-5 object-contain">
                  <img src="../../assets/images/icons/pdf.svg" @click="showPDF(invoice)" alt="ver XML"
                    class="h-5 w-5 object-contain">

                  <router-link :to="`/sire/compras/edit/${invoice.id}`"
                    class="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    title="Editar">
                    <PencilSquareIcon class="h-5 w-5" />
                  </router-link>
                  <button @click="confirmDelete(invoice)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Eliminar">
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-zinc-50 dark:bg-zinc-700">
            <tr class="font-semibold text-zinc-900 dark:text-white">
              <th scope="row" class="px-6 py-3 text-base">Total</th>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4"></td>
              <td class="px-6 py-4 text-right text-zinc-900 dark:text-zinc-200">{{ formatCurrency(totalGravadas) }}</td>
              <td class="px-6 py-4 text-right text-zinc-900 dark:text-zinc-200">{{ formatCurrency(totalIgv) }}</td>
              <td class="px-6 py-4 text-right text-zinc-900 dark:text-zinc-200">{{ formatCurrency(totalGeneral) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Paginación -->
      <div
        class="bg-white dark:bg-zinc-800 px-4 py-3 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-zinc-700 dark:text-zinc-300">
              Mostrando
              <span class="font-medium text-zinc-900 dark:text-white">{{ pagination.from }}</span>
              a
              <span class="font-medium text-zinc-900 dark:text-white">{{ pagination.to }}</span>
              de
              <span class="font-medium text-zinc-900 dark:text-white">{{ pagination.total }}</span>
              resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">

              <button @click="prevPage" :disabled="pagination.currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm font-medium text-zinc-500 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Anterior</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
              </button>

              <button v-for="page in pagination.totalPages" :key="page" @click="goToPage(page)" :class="{
                'z-10 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-600 dark:text-indigo-300': pagination.currentPage === page,
                'bg-white dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-600': pagination.currentPage !== page
              }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ page }}
              </button>

              <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-sm font-medium text-zinc-500 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="sr-only">Siguiente</span>
                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
      <!-- Modal de detalle -->

    </div>
    <DetailModal :isOpen="modalIsOpen" :compra="selectedCompra" @close="closeModal" />
    <!-- Modal -->
    <ModalXMLViewer :isOpen="showModal" :xmlContent="xmlContent" @close="closeModalXml" />
    <ModalPDFViewer :isOpen="showPdfModal" :pdfEndpoint="pdfEndpoint" :params="pdfParams" @close="closePdfModal" />
    <!-- Modal de confirmación -->
    <ConfirmationModal :show="showDeleteModal" @close="showDeleteModal = false" @confirm="deleteInvoice"
      title="Eliminar producto">
      ¿Estás seguro que deseas eliminar el producto "{{ invoiceDelete?.nom_razon_social_proveedor }}"? Esta acción
      no se
      puede deshacer.
    </ConfirmationModal>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import dayjs from 'dayjs'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'
import FiltroPeriodo from '@/components/FiltroPeriodo.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import api from '@/api/axios';
import type { Invoice, Pagination, TableHeader } from '@/types/sireCompras'; // Asegúrate de que la ruta sea correcta
import DetailModal from '@/components/sire/ComprasItems.vue'
import ModalXMLViewer from '@/components/sire/ModalXMLViewer.vue'
import ModalPDFViewer from '@/components/sire/ModalPDFViewer.vue'

// Para el uso en otros componentes
/* import { useEmpresaStore } from '@/stores/empresaStore' */
/* const empresaStore = useEmpresaStore() */
/* const empresaRuc = empresaStore.empresaSeleccionada?.ruc */


const modalIsOpen = ref(false)
const selectedCompra = ref<Invoice | null>(null)

const openModal = (compra: Invoice) => {
  selectedCompra.value = compra
  modalIsOpen.value = true
}
const closeModal = () => {
  modalIsOpen.value = false
  selectedCompra.value = null
}

// Modal para XML
const showModal = ref(false)
const xmlContent = ref('')
const currentCompra = ref<any>(null)

const showPdfModal = ref(false)
const pdfEndpoint = 'http://192.168.18.21:8000/api/factiliza/pdf'
const pdfParams = ref<any>(null)

async function showXML(compra: any) {
  currentCompra.value = compra
  try {
    const params = {
      numRuc: compra.num_doc_identidad_proveedor,
      tipoDocumento: compra.cod_tipo_cdp,
      numSerieComprobante: compra.num_serie_cdp,
      numDocumentoComprobante: compra.num_cdp,
    }

    const response = await api.get('http://192.168.18.21:8000/api/factiliza/xml', {
      params,
      responseType: 'text'
    })

    if (response.data && response.data.startsWith('<?xml')) {
      xmlContent.value = response.data
      showModal.value = true
    } else {
      alert('No se encontró un XML válido para esta compra')
    }
  } catch (error) {
    console.error('Error al obtener XML:', error)
    alert('Error al obtener el XML')
  }
}
function closeModalXml() {
  showModal.value = false
  xmlContent.value = ''
}
// Para el PDF
async function showPDF(compra: any) {
  pdfParams.value = {
    numRuc: compra.num_doc_identidad_proveedor,
    tipoDocumento: compra.cod_tipo_cdp,
    numSerieComprobante: compra.num_serie_cdp,
    numDocumentoComprobante: compra.num_cdp
  }
  showPdfModal.value = true
}
function closePdfModal() {
  showPdfModal.value = false
  pdfParams.value = null
}
// Función para obtener la fecha formateada usando day.js
function obtPerTributario() {
  return dayjs().format('YYYYMM'); // Formato YYYYMM
}
// Estado para almacenar las facturas
const loading: Ref<boolean> = ref(true)
const error: Ref<string | null> = ref(null)
const invoices = ref<Invoice[]>([]);
const searchQuery: Ref<string> = ref('')
const totalGeneral: Ref<number> = ref(0);
const totalIgv: Ref<number> = ref(0);
const totalGravadas: Ref<number> = ref(0);
const perTributario: Ref<string> = ref('')
const showDeleteModal: Ref<boolean> = ref(false)
const invoiceDelete: Ref<Invoice | null> = ref(null)
/* const archivo: Ref<string> = ref('') */
const selectedCategory: Ref<string> = ref('')
const selectedStatus: Ref<string> = ref('')
const sortField: Ref<string> = ref('nom_razon_social_proveedor')
const sortDirection: Ref<'asc' | 'desc'> = ref('asc')

async function fetchInvoices() {
  try {
    loading.value = true
    error.value = null
    const rucString = localStorage.getItem('empresaRuc');
    if (!rucString) {
      throw new Error('RUC no encontrado en el almacenamiento local');
    }
    const empresaRuc = localStorage.getItem('empresaRuc');
    console.log('RUC de la empresa seleccionada:', empresaRuc);
    const response = await api.get<{ data: Invoice[] }>(`/compras-sire/por-periodo?per_periodo=${perTributario.value}&per_ruc=${empresaRuc}`);

    // Actualizar las variables reactivas
    invoices.value = response.data.data;

    const totals = filteredInvoices.value.reduce(
      (acc, invoice: Invoice) => {
        const mtoBiGravadaDg = Number(invoice.montos?.mto_bi_gravada_dg) || 0;
        const mtoTotalCp = Number(invoice.mto_total_cp) || 0;
        const mtoIgvDg = Number(invoice.montos?.mto_igv_ipm_dg) || 0;

        acc.totalGravadas += mtoBiGravadaDg;
        acc.totalGeneral += mtoTotalCp;
        acc.totalIgv += mtoIgvDg;

        return acc;
      },
      { totalGravadas: 0, totalGeneral: 0, totalIgv: 0 }
    );

    totalGravadas.value = totals.totalGravadas;
    totalGeneral.value = totals.totalGeneral;
    totalIgv.value = totals.totalIgv;


  } catch (err: any) {
    // Limpiar las variables reactivas en caso de error
    invoices.value = [];
    totalGeneral.value = 0;
    totalGravadas.value = 0;
    totalIgv.value = 0;
    error.value = err.response?.data?.message || 'No se encontraron datos para el período seleccionado.';
  } finally {
    loading.value = false;
  }
}

const categories = ref([
  { id: 1, name: 'Tecnología' },
  { id: 2, name: 'Oficina' },
  { id: 3, name: 'Suministros' }
])



// Paginación
const itemsPerPage = 10
const pagination: Ref<Pagination> = ref({
  currentPage: 1,
  total: 0,
  from: 0,
  to: 0,
  totalPages: 0
})

interface PeriodoFilter {
  periodo: string;
  filtro: string;
}

// Función para manejar el filtrado
const handleFilter = async (filtro?: PeriodoFilter): Promise<void> => {
  try {
    loading.value = true;
    error.value = null;
    perTributario.value = filtro.periodo
    // Usar el período proporcionado o el valor por defecto
    fetchInvoices(filtro.periodo);
    calculateTotals();
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Error al cargar las facturas';
    invoices.value = [];
    resetTotals();
  } finally {
    loading.value = false;
  }

};
const calculateTotals = () => {
  const totals = filteredInvoices.value.reduce(
    (acc, invoice) => {
      const mtoBiGravadaDg = Number(invoice.montos?.mto_bi_gravada_dg) || 0;
      const mtoTotalCp = Number(invoice.mto_total_cp) || 0;
      const mtoIgvDg = Number(invoice.montos?.mto_igv_ipm_dg) || 0;

      acc.totalGravadas += mtoBiGravadaDg;
      acc.totalGeneral += mtoTotalCp;
      acc.totalIgv += mtoIgvDg;

      return acc;
    },
    { totalGravadas: 0, totalGeneral: 0, totalIgv: 0 }
  );

  totalGravadas.value = totals.totalGravadas;
  totalGeneral.value = totals.totalGeneral;
  totalIgv.value = totals.totalIgv;
};

const resetTotals = () => {
  totalGravadas.value = 0;
  totalGeneral.value = 0;
  totalIgv.value = 0;
};

// Headers de la tabla para reflejar datos de compras
const headers: Ref<TableHeader[]> = ref([
  { key: 'nom_razon_social_proveedor', label: 'Proveedor', sortable: true },
  { key: 'fec_emision', label: 'Emisión', sortable: true },
  { key: 'fec_venc_pag', label: 'Vencimiento', sortable: true },
  { key: 'des_tipo_cdp', label: 'Tipo Doc.', sortable: true },
  { key: 'num_cdp', label: 'Número', sortable: true },
  { key: 'cod_moneda', label: 'Moneda', sortable: false },
  { key: 'montos.mto_bi_gravada_dg', label: 'Gravada S/', sortable: true, textRight: true },
  { key: 'montos.mto_igv_ipm_dg', label: 'IGV S/', sortable: true, textRight: true },
  { key: 'mto_total_cp', label: 'Total S/', sortable: true, textRight: true },
  { key: 'des_estado_comprobante', label: 'Estado', sortable: false }
])

// Modificar el filtrado para trabajar con datos de compras
const filteredInvoices = computed<Invoice[]>(() => {
  let result = invoices.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(invoice =>
      invoice.nom_razon_social_proveedor?.toLowerCase().includes(query) ||
      invoice.num_doc_identidad_proveedor?.includes(query) ||
      invoice.num_cdp?.toString().includes(query)
    )
  }

  // Ordenar
  /* result.sort((a: Invoice, b: Invoice) => {
    const modifier = sortDirection.value === 'desc' ? -1 : 1
    const getNestedValue = (obj: any, path: string) =>
      path.split('.').reduce((o, i) => o?.[i], obj)

    const aValue = sortField.value.includes('.')
      ? getNestedValue(a, sortField.value)
      : a[sortField.value as keyof Invoice]

    const bValue = sortField.value.includes('.')
      ? getNestedValue(b, sortField.value)
      : b[sortField.value as keyof Invoice]

    if (aValue < bValue) return -1 * modifier
    if (aValue > bValue) return 1 * modifier
    return 0
  }) */

  return result
})
// Compras paginados
const paginatedInvoices = computed(() => {
  const start = (pagination.value.currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredInvoices.value.slice(start, end)
})

// Actualizar paginación
const updatePagination = () => {
  pagination.value.total = filteredInvoices.value.length
  pagination.value.totalPages = Math.ceil(filteredInvoices.value.length / itemsPerPage)
  pagination.value.from = (pagination.value.currentPage - 1) * itemsPerPage + 1
  pagination.value.to = Math.min(
    pagination.value.currentPage * itemsPerPage,
    filteredInvoices.value.length
  )
}

// Cambiar página
const goToPage = (page: number) => {
  pagination.value.currentPage = page
}

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++
  }
}

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}

// Ordenar tabla
const sortBy = (field: string): void => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Resetear filtros
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
}

// Confirmar eliminación
const confirmDelete = (invoice: Invoice): void => {
  invoiceDelete.value = invoice
  showDeleteModal.value = true
}

// Eliminar compra
const deleteInvoice = (): void => {
  invoices.value = invoices.value.filter(i => i.id !== invoiceDelete.value?.id)
  showDeleteModal.value = false
}

const formatCurrency = (value: number | undefined | null): string => {
  // Convertir a número y verificar si es válido
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return '0.00'; // O cualquier valor por defecto que prefieras
  }
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}
// Función para formatear la fecha (YYYY-MM-DD a DD/MM/YYYY)
function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Función para verificar si una fecha está vencida
const isDateExpired = (dateString: string) => {
  if (!dateString) return false

  // Convierte la fecha del formato DD/MM/YYYY a YYYY-MM-DD
  const [day, month, year] = dateString.split('/')
  const fechaVencimiento = new Date(`${year}-${month}-${day}`)
  const fechaActual = new Date()

  // Compara las fechas sin horas/minutos/segundos
  return fechaVencimiento < fechaActual
}

const getStatusColor = (status: string, darkMode: boolean = false): string => {
  const statusColors: Record<string, string> = {
    'ACTIVO': darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800',
    'PENDIENTE': darkMode ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
    'ANULADO': darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800',
    'default': darkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-800'
  }
  return statusColors[status?.toUpperCase()] || statusColors.default
}

// Watchers y lifecycle hooks
onMounted(async () => {
  perTributario.value = obtPerTributario();
  await fetchInvoices();
  updatePagination()
})
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
