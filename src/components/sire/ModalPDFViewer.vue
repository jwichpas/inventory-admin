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
              class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3"
                class="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                <span>Visualizador de PDF - {{ fileName }}</span>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
                  <span class="sr-only">Cerrar</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </DialogTitle>

              <div class="mt-4">
                <!-- Contenedor del PDF -->
                <div class="border border-gray-200 rounded-lg overflow-hidden">
                  <div v-if="loading" class="h-96 flex items-center justify-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <span class="ml-3 text-gray-700">Cargando PDF...</span>
                  </div>

                  <div v-else-if="error" class="h-96 flex flex-col items-center justify-center p-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 class="mt-2 text-lg font-medium text-gray-900">Error al cargar el PDF</h3>
                    <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
                    <button @click="loadPDF"
                      class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Reintentar
                    </button>
                  </div>

                  <iframe v-else :src="pdfUrl" class="w-full h-[calc(100vh-200px)] min-h-[500px]"
                    frameborder="0"></iframe>
                </div>
              </div>

              <div class="mt-4 flex justify-end space-x-3">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  @click="downloadPDF">
                  Descargar PDF
                </button>
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
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import api from '@/api/axios'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  pdfEndpoint: {
    type: String,
    required: true
  },
  params: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const error = ref('')
const pdfBlob = ref<Blob | null>(null)

const fileName = computed(() => {
  if (!props.params) return 'documento.pdf'
  return `factura_${props.params.numSerieComprobante}-${props.params.numDocumentoComprobante}.pdf`
})

const pdfUrl = computed(() => {
  if (!pdfBlob.value) return ''
  return URL.createObjectURL(pdfBlob.value)
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    loadPDF()
  } else {
    // Limpiar el objeto URL cuando el modal se cierra
    if (pdfUrl.value) {
      URL.revokeObjectURL(pdfUrl.value)
    }
  }
})

async function loadPDF() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get(props.pdfEndpoint, {
      params: props.params,
      responseType: 'blob'
    })

    if (response.data && response.data.type === 'application/pdf') {
      pdfBlob.value = response.data
    } else {
      throw new Error('El archivo recibido no es un PDF válido')
    }
  } catch (err) {
    console.error('Error al cargar PDF:', err)
    error.value = err.message || 'No se pudo cargar el documento PDF'
    pdfBlob.value = null
  } finally {
    loading.value = false
  }
}

function closeModal() {
  emit('close')
}

function downloadPDF() {
  if (!pdfBlob.value) return

  const url = URL.createObjectURL(pdfBlob.value)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.value
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
