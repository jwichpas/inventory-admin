<template>
  <div
    class="container mx-auto px-2 py-6 bg-white dark:bg-zinc-950 min-h-screen rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-950">
    <!-- Encabezado -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
      <h1 class="text-xl md:text-2xl font-bold text-zinc-800 dark:text-rose-500 tracking-tight">Reporte de Compras</h1>
      <div
        class="bg-blue-100 text-blue-800 dark:bg-zinc-800 dark:text-zinc-100 px-4 py-2 rounded-lg shadow font-semibold text-base md:text-lg">
        <span class="font-medium">Total Compras:</span>
        <span class="ml-2">{{ formatCurrency(totalGeneral) }}</span>
      </div>
    </div>

    <!-- Filtros -->
    <div
      class="mb-6 bg-white dark:bg-zinc-900 p-4 md:p-6 rounded-xl shadow flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
        <FiltroPeriodo @filter="handleFilter" />
        <div class="col-span-2">
          <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1">Buscar
            (Proveedor/Doc)</label>
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="N° documento o proveedor"
              class="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500" />
            <MagnifyingGlassIcon class="h-5 w-5 absolute right-3 top-2.5 text-zinc-400 dark:text-zinc-500" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-semibold text-zinc-700 dark:text-zinc-200 mb-1">Estado</label>
          <select v-model="selectedStatus"
            class="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100">
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="low-stock">Bajo stock</option>
          </select>
        </div>
        <div>
          <button @click="resetFilters"
            class="text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de Compras -->
    <div v-if="!loading && !error"
      class="overflow-x-auto rounded-2xl shadow bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
      <div v-if="invoices.length === 0" class="p-8 text-center text-zinc-500 dark:text-zinc-400">
        No se encontraron compras con los filtros seleccionados
      </div>
      <table v-else class="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-xs md:text-sm">
        <thead class="bg-zinc-100 dark:bg-zinc-950">
          <tr>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Proveedor</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Emisión</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Vencimiento</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">Tipo
              Doc.</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Número</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Moneda</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Tipo de Compra</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Tipo de Proveedor</th>
            <th class="px-3 py-2 text-left font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Estado</th>
            <th class="px-3 py-2 text-right font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Total S/</th>
            <th class="px-3 py-2 text-right font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(invoice, index) in invoices" :key="invoice.id"
            class="even:bg-zinc-50 hover:bg-zinc-100/80 transition-colors group border-b border-zinc-200 last:border-b-0 dark:even:bg-zinc-900/70 dark:hover:bg-zinc-800/80 dark:border-zinc-800">
            <td
              class="px-3 py-1 whitespace-nowrap truncate max-w-md font-semibold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
              <span class="flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center font-bold text-xs">
                  {{ invoice.nom_razon_social_proveedor?.charAt(0) || 'P' }}
                </span>
                <span>{{ invoice.nom_razon_social_proveedor || 'Proveedor no especificado' }}</span>
              </span>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-600 dark:text-zinc-400">{{ formatDate(invoice.fec_emision)
            }}</td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-600 dark:text-zinc-400">{{ formatDate(invoice.fec_venc_pag)
            }}</td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-600 dark:text-zinc-400">{{ invoice.cod_tipo_cdp }}</td>
            <td class="px-3 py-1 whitespace-nowrap">
              <span
                class="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {{ invoice.num_serie_cdp }}-{{ invoice.num_cdp }}
              </span>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-400">
              <span :class="{
                'text-green-600 dark:text-green-400': invoice.cod_moneda === 'PEN',
                'text-blue-600 dark:text-blue-400': invoice.cod_moneda === 'USD'
              }" class="font-medium">
                {{ invoice.cod_moneda }}
              </span>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-600 dark:text-zinc-400">{{ invoice.des_tipo_cdp || '-' }}
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
              <template v-if="invoice.clasificaciones && invoice.clasificaciones.length > 0">
                {{ invoice.clasificaciones[0].tipo_proveedor }}
              </template>
              <template v-else>
                <Listbox v-model="tipoProveedorSeleccionado[invoice.id]"
                  @update:modelValue="(val) => guardarTipoProveedor(invoice.id, val, index)">
                  <div class="relative">
                    <ListboxButton
                      class="w-36 px-2 py-1 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-xs flex items-center justify-between">
                      <span>{{tipoProveedorSeleccionado[invoice.id] ? tipoProveedorOptions.find(opt => opt.value ===
                        tipoProveedorSeleccionado[invoice.id])?.label : 'Seleccionar'}}</span>
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </ListboxButton>
                    <ListboxOptions
                      class="absolute z-50 mt-1 w-36 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded shadow-lg">
                      <ListboxOption v-for="option in tipoProveedorOptions" :key="option.value" :value="option.value"
                        class="cursor-pointer select-none px-3 py-2 hover:bg-blue-100 dark:hover:bg-zinc-800">
                        {{ option.label }}
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
                <span v-if="savingTipoProveedor[invoice.id]" class="ml-2 text-xs text-blue-500">Guardando...</span>
              </template>
            </td>

            <td class="px-3 py-1 whitespace-nowrap">
              <span
                :class="getStatusColor(invoice.clasificaciones && invoice.clasificaciones.length > 0 ? invoice.clasificaciones[0].estado : invoice.des_estado_comprobante)"
                class="px-2 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full">
                {{ invoice.clasificaciones && invoice.clasificaciones.length > 0 ? invoice.clasificaciones[0].estado :
                  invoice.des_estado_comprobante }}
              </span>
            </td>
            <td class="px-3 py-1 whitespace-nowrap text-right font-bold text-zinc-800 dark:text-zinc-100">{{
              formatCurrency(invoice.mto_total_cp) }}</td>
            <td class="px-3 py-1 whitespace-nowrap text-right">
              <div class="flex items-center gap-2 justify-end">
                <button @click="openModal(invoice)"
                  class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition flex items-center gap-1 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200">
                  <EyeIcon class="h-4 w-4" />
                  <span class="hidden md:inline">Ver</span>
                </button>
                <button @click="showXML(invoice)" title="Ver XML"
                  class="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1 rounded transition flex items-center dark:bg-zinc-800 dark:hover:bg-yellow-700 dark:text-zinc-200">
                  <img src="../../assets/images/icons/xml.svg" alt="ver XML" class="h-5 w-5 object-contain" />
                </button>
                <button @click="showPDF(invoice)" title="Ver PDF"
                  class="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded transition flex items-center dark:bg-zinc-800 dark:hover:bg-red-700 dark:text-zinc-200">
                  <img src="../../assets/images/icons/pdf.svg" alt="ver PDF" class="h-5 w-5 object-contain" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-zinc-100 dark:bg-zinc-900">
          <tr>
            <td colspan="7" class="px-3 py-2 text-right font-semibold text-zinc-600 dark:text-zinc-400">Total:</td>
            <td colspan="2"></td>
            <td class="px-3 py-2 text-right font-extrabold text-zinc-800 dark:text-zinc-100">{{
              formatCurrency(totalGeneral) }}</td>
            <td colspan="1"></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Paginación -->
    <div v-if="invoices.length > 0"
      class="mt-4 flex items-center justify-between sm:rounded-lg bg-white px-2 py-2 border-t border-zinc-200 sm:px-4 dark:bg-zinc-950 dark:border-rose-500">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="pagination.currentPage === 1"
          class="relative inline-flex items-center px-3 py-1 border border-zinc-300 text-xs font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          Anterior
        </button>
        <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
          class="ml-3 relative inline-flex items-center px-3 py-1 border border-zinc-300 text-xs font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          Siguiente
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-xs text-zinc-700 dark:text-zinc-300">
            Mostrando
            <span class="font-medium">{{ pagination.from }}</span>
            a
            <span class="font-medium">{{ pagination.to }}</span>
            de
            <span class="font-medium">{{ pagination.total }}</span>
            resultados
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="pagination.currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-zinc-300 bg-white text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 dark:border-zinc-950 dark:bg-zinc-950 dark:text-zinc-300"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === 1 }">
              <span class="sr-only">Anterior</span>
              <ChevronLeftIcon class="h-4 w-4" aria-hidden="true" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="{
              'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-zinc-200 dark:border-zinc-950 dark:text-zinc-600': pagination.currentPage === page,
              'bg-white border-zinc-300 text-blue-500 hover:bg-blue-400 dark:hover:text-zinc-950 dark:bg-zinc-900 dark:border-zinc-950 dark:text-zinc-400': pagination.currentPage !== page
            }" class="relative inline-flex items-center px-3 py-1 border text-xs font-medium">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="pagination.currentPage === pagination.lastPage"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-zinc-300 bg-white text-xs font-medium text-zinc-500 hover:bg-zinc-50 dark:border-zinc-950 dark:hover:bg-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              :class="{ 'cursor-not-allowed opacity-50': pagination.currentPage === pagination.lastPage }">
              <span class="sr-only">Siguiente</span>
              <ChevronRightIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modales -->
    <DetailModal :isOpen="modalIsOpen" :compra="(selectedCompra as any)" @close="closeModal" />
    <ModalXMLViewer :isOpen="showModal" :xmlContent="xmlContent" @close="closeModalXml" />
    <ModalPDFViewer :isOpen="showPdfModal" :pdfEndpoint="pdfEndpoint" :params="pdfParams || {}"
      @close="closePdfModal" />
    <ConfirmationModal :show="showDeleteModal" @close="showDeleteModal = false" @confirm="deleteInvoice"
      title="Eliminar producto">
      ¿Estás seguro que deseas eliminar el producto "{{ invoiceDelete?.nom_razon_social_proveedor }}"? Esta acción
      no se puede deshacer.
    </ConfirmationModal>

    <template v-if="toast.visible">
      <div
        class="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 animate-fade-in">
        <span>Tipo de proveedor guardado correctamente</span>
        <button @click="toast.visible = false" class="ml-2 text-white hover:text-zinc-200">&times;</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import FiltroPeriodo from '@/components/FiltroPeriodo.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import api from '@/api/axios';
import type { Invoice } from '@/types/sireCompras';
import DetailModal from '@/components/sire/ComprasItems.vue'
import ModalXMLViewer from '@/components/sire/ModalXMLViewer.vue'
import ModalPDFViewer from '@/components/sire/ModalPDFViewer.vue'
import { ref as vueRef } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'

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

async function showXML(compra: Invoice) {
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
      xmlContent.value = 'No se encontró un XML válido para esta compra.'
      showModal.value = true
    }
  } catch {
    xmlContent.value = 'Error al obtener el XML.'
    showModal.value = true
  }
}

const showPdfModal = ref(false)
const pdfEndpoint = 'http://192.168.18.21:8000/api/factiliza/pdf'
const pdfParams = ref<Record<string, string> | null>(null)

function showPDF(compra: Invoice) {
  pdfParams.value = {
    numRuc: compra.num_doc_identidad_proveedor,
    tipoDocumento: compra.cod_tipo_cdp,
    numSerieComprobante: compra.num_serie_cdp,
    numDocumentoComprobante: compra.num_cdp
  }
  showPdfModal.value = true
}

const loading = ref(true)
const error = ref<string | null>(null)
const invoices = ref<Invoice[]>([]);
const searchQuery = ref('')
const totalGeneral = ref(0);
const totalIgv = ref(0);
const totalGravadas = ref(0);
const perTributario = ref('')
const showDeleteModal = ref(false)
const invoiceDelete = ref<Invoice | null>(null)
const selectedStatus = ref('')

const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  lastPage: 1,
  from: 0,
  to: 0
})

const tipoProveedorOptions = [
  { value: 'mercaderia', label: 'Mercadería' },
  { value: 'flete', label: 'Flete' },
  { value: 'gastos_ventas', label: 'Gastos de Ventas' },
  { value: 'gastos_administracion', label: 'Gastos de Administración' }
]

// Estado de loading por fila
const savingTipoProveedor = vueRef<{ [key: string]: boolean }>({})

// En el script setup, agregar estado temporal para selección por fila:
const tipoProveedorSeleccionado = vueRef<{ [key: string]: string }>({})

const toast = vueRef({ visible: false })

function showToast() {
  toast.value.visible = true
  setTimeout(() => { toast.value.visible = false }, 2500)
}

async function guardarTipoProveedor(compraId: string, tipo: string, idx: number) {
  savingTipoProveedor.value[compraId] = true
  try {
    await api.post(`/compras/${compraId}/clasificaciones`, {
      compra_id: compraId,
      tipo_proveedor: tipo
    })
    // Actualizar localmente la fila
    invoices.value[idx].clasificaciones = [{ tipo_proveedor: tipo, estado: 'pendiente' }]
    showToast()
  } catch {
    alert('Error al guardar el tipo de proveedor')
  } finally {
    savingTipoProveedor.value[compraId] = false
  }
}

const fetchInvoices = async () => {
  try {
    loading.value = true
    error.value = null
    const rucString = localStorage.getItem('empresaRuc');
    if (!rucString) {
      throw new Error('RUC no encontrado en el almacenamiento local');
    }
    const empresaRuc = localStorage.getItem('empresaRuc');
    const params = {
      page: pagination.value.currentPage,
      perPage: pagination.value.perPage,
      search: searchQuery.value,
      estado: selectedStatus.value,
      periodo: perTributario.value
    };
    const response = await api.get(`/compras-sire/por-periodo?per_periodo=${perTributario.value}&per_ruc=${empresaRuc}`, { params });
    invoices.value = response.data.data.data;
    // Actualizar paginación con los datos de la API
    pagination.value.currentPage = response.data.data.current_page;
    pagination.value.perPage = Number(response.data.data.per_page);
    pagination.value.total = response.data.data.total;
    pagination.value.lastPage = response.data.data.last_page;
    pagination.value.from = response.data.data.from;
    pagination.value.to = response.data.data.to;
    const totals = invoices.value.reduce(
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
  } catch (err) {
    let message = 'No se encontraron datos para el período seleccionado.';
    if (typeof err === 'object' && err && 'response' in err && (err as { response?: { data?: { message?: string } } }).response?.data?.message) {
      message = (err as { response: { data: { message: string } } }).response.data.message;
    }
    error.value = message;
    invoices.value = [];
    totalGeneral.value = 0;
    totalGravadas.value = 0;
    totalIgv.value = 0;
  } finally {
    loading.value = false;
  }
}

const handleFilter = async (filtro?: { periodo: string }) => {
  try {
    loading.value = true;
    error.value = null;
    if (filtro && filtro.periodo) {
      perTributario.value = filtro.periodo;
    }
    pagination.value.currentPage = 1; // Reiniciar a la primera página
    await fetchInvoices();
    calculateTotals();
  } catch (err) {
    let message = 'Error al cargar las facturas';
    if (typeof err === 'object' && err && 'response' in err && (err as { response?: { data?: { message?: string } } }).response?.data?.message) {
      message = (err as { response: { data: { message: string } } }).response.data.message;
    } else if (typeof err === 'object' && err && 'message' in err && typeof (err as { message: string }).message === 'string') {
      message = (err as { message: string }).message;
    }
    error.value = message;
    invoices.value = [];
    resetTotals();
  } finally {
    loading.value = false;
  }
};
const calculateTotals = () => {
  const totals = invoices.value.reduce(
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
const visiblePages = computed(() => {
  const pages = []
  const current = pagination.value.currentPage
  const last = pagination.value.lastPage
  const maxVisible = 5
  if (last <= maxVisible) {
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    let left = Math.max(1, current - Math.floor(maxVisible / 2))
    const right = Math.min(last, left + maxVisible - 1)
    if (right - left < maxVisible - 1) {
      left = Math.max(1, right - maxVisible + 1)
    }
    for (let i = left; i <= right; i++) {
      pages.push(i)
    }
  }
  return pages
})
const goToPage = (page: number) => {
  if (page >= 1 && page <= pagination.value.lastPage) {
    pagination.value.currentPage = page
    fetchInvoices()
  }
}
const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.lastPage) {
    pagination.value.currentPage++
    fetchInvoices()
  }
}
const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
    fetchInvoices()
  }
}
const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
}
const deleteInvoice = (): void => {
  invoices.value = invoices.value.filter(i => i.id !== invoiceDelete.value?.id)
  showDeleteModal.value = false
}
const formatCurrency = (value: number | undefined | null): string => {
  const numValue = Number(value);
  if (isNaN(numValue)) {
    return '0.00';
  }
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}
function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'ACTIVO': 'bg-green-600/20 text-green-400 border border-green-700',
    'PENDIENTE': 'bg-yellow-600/20 text-yellow-400 border border-yellow-700',
    'ANULADO': 'bg-red-600/20 text-red-400 border border-red-700',
    'default': 'bg-zinc-700 text-zinc-300'
  }
  return statusColors[status?.toUpperCase()] || statusColors.default
}

// Función para obtener el periodo tributario actual
function obtPerTributario() {
  return new Date().toISOString().slice(0, 7).replace('-', '')
}

onMounted(async () => {
  perTributario.value = obtPerTributario();
  await fetchInvoices();
})
function closeModalXml() {
  showModal.value = false
  xmlContent.value = ''
}
function closePdfModal() {
  showPdfModal.value = false
  pdfParams.value = null
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}

/* Estilos adicionales si son necesarios */
</style>
