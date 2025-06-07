<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="close" class="relative z-50">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
                Descargar Guía de Remisión
              </DialogTitle>
              <form @submit.prevent="handleSubmit">
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">RUC</label>
                  <input v-model="form.ruc" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Serie</label>
                  <input v-model="form.serie" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input v-model="form.numero" required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
                <div v-if="success" class="text-green-600 text-sm mb-2">{{ success }}</div>
                <div class="flex justify-end gap-2">
                  <button type="button" @click="close"
                    class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancelar</button>
                  <button type="submit" :disabled="loading"
                    class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center">
                    <span v-if="loading"
                      class="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Descargar y Guardar
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
import { ref, reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import axios from '@/api/axios'
import { XMLParser } from 'fast-xml-parser'

const props = defineProps<{
  isOpen: boolean,
  compraId: number | null
}>()

const emit = defineEmits(['close'])

const form = reactive({
  ruc: '',
  serie: '',
  numero: ''
})
const loading = ref(false)
const error = ref('')
const success = ref('')

watch(() => props.isOpen, (val) => {
  if (val) {
    error.value = ''
    success.value = ''
    form.ruc = ''
    form.serie = ''
    form.numero = ''
  }
})

const close = () => {
  emit('close')
}

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    // Descargar XML directamente
    const xmlUrl = `http://192.168.18.21:8000/api/factiliza/guia/xml?numRuc=${form.ruc}&numSerieComprobante=${form.serie}&numDocumentoComprobante=${form.numero}`
    const xmlResponse = await axios.get(xmlUrl, { responseType: 'text' })
    if (xmlResponse.status !== 200) throw new Error('No se pudo descargar el XML')
    const xmlText = xmlResponse.data
    // Parsear XML
    const parser = new XMLParser({ ignoreAttributes: false, ignoreDeclaration: true })
    const xmlObj = parser.parse(xmlText)
    // --- Mapear los campos requeridos del XML ---
    // Ajuste para namespaces: cbc:, cac:
    const root = xmlObj['DespatchAdvice'] || xmlObj['DespatchAdviceType'] || xmlObj
    // DespatchLine puede ser array o único
    const despatchLines = root['cac:DespatchLine']
      ? Array.isArray(root['cac:DespatchLine'])
        ? root['cac:DespatchLine']
        : [root['cac:DespatchLine']]
      : []
    const mappedDetails = despatchLines.map((item) => ({
      ItemIdentification: getText(item['cac:Item']?.['cac:SellersItemIdentification']?.['cbc:ID']).toString(),
      ItemDescription: getText(item['cac:Item']?.['cbc:Description']),
      DespatchLine: getText(item['cbc:ID']).toString(),
      DeliveredQuantity: Number(item['cbc:DeliveredQuantity']?.['#text'] || item['cbc:DeliveredQuantity'] || 0),
      unitCode: (item['cbc:DeliveredQuantity']?.['@_unitCode'] || item['cbc:DeliveredQuantity']?.['@unitCode'] || '').toString(),
      GrossWeightMeasure: item['cbc:GrossWeightMeasure'] ? Number(item['cbc:GrossWeightMeasure']?.['#text'] || item['cbc:GrossWeightMeasure'] || 0) : undefined
    }))
    const shipment = root['cac:Shipment'] || {}
    const shipmentStage = shipment['cac:ShipmentStage'] || {}
    const carrierParty = shipmentStage['cac:CarrierParty'] || {}
    const delivery = shipment['cac:Delivery'] || {}
    const deliveryAddress = delivery['cac:DeliveryAddress'] || {}
    const despatch = delivery['cac:Despatch'] || {}
    const despatchAddress = despatch['cac:DespatchAddress'] || {}
    const despatchSupplierParty = root['cac:DespatchSupplierParty']?.['cac:Party'] || {}
    const deliveryCustomerParty = root['cac:DeliveryCustomerParty']?.['cac:Party'] || {}
    // Helper para extraer solo el texto de un campo (si es objeto con #text, si no el valor directo)
    function getText(val: unknown): string {
      if (typeof val === 'object' && val !== null && Object.prototype.hasOwnProperty.call(val, '#text')) {
        // @ts-expect-error: El parser puede devolver un objeto con #text, ignoramos el error de tipo aquí.
        return val['#text']
      }
      return (val ?? '').toString()
    }
    // Construir jsonData sin details ni xml_file
    const jsonData = {
      DespatchAdviceTypeCode: getText(root['cbc:DespatchAdviceTypeCode']).toString(),
      numero_guia: getText(root['cbc:ID']),
      IssueDate: getText(root['cbc:IssueDate']),
      IssueTime: getText(root['cbc:IssueTime']),
      HandlingCode: getText(shipment['cbc:HandlingCode']).toString(),
      HandlingInstructions: getText(shipment['cbc:HandlingInstructions']),
      unitCode: (shipment['cbc:GrossWeightMeasure']?.['@_unitCode'] || shipment['cbc:GrossWeightMeasure']?.['@unitCode'] || '').toString(),
      GrossWeightMeasure: shipment['cbc:GrossWeightMeasure']?.['#text'] ? Number(shipment['cbc:GrossWeightMeasure']?.['#text']) : Number(shipment['cbc:GrossWeightMeasure'] || 0),
      TransportModeCode: getText(shipmentStage['cbc:TransportModeCode']).toString(),
      StartDate: getText(shipmentStage['cac:TransitPeriod']?.['cbc:StartDate']),
      DespatchSupplierPartyId: getText(despatchSupplierParty['cac:PartyIdentification']?.['cbc:ID']).toString(),
      DespatchSupplierPartyName: getText(despatchSupplierParty['cac:PartyLegalEntity']?.['cbc:RegistrationName']),
      DeliveryCustomerPartyId: getText(deliveryCustomerParty['cac:PartyIdentification']?.['cbc:ID']).toString(),
      DeliveryCustomerPartyName: getText(deliveryCustomerParty['cac:PartyLegalEntity']?.['cbc:RegistrationName']),
      CarrierPartyId: getText(carrierParty['cac:PartyIdentification']?.['cbc:ID']).toString(),
      CarrierPartyName: getText(carrierParty['cac:PartyLegalEntity']?.['cbc:RegistrationName']),
      DeliveryAddressId: getText(deliveryAddress['cbc:ID']).toString(),
      DeliveryAddressLine: getText(deliveryAddress['cac:AddressLine']?.['cbc:Line']),
      DespatchAddressId: getText(despatchAddress['cbc:ID']).toString(),
      DespatchAddressLine: getText(despatchAddress['cac:AddressLine']?.['cbc:Line'])
    }
    // Armar FormData para enviar el XML y el JSON (como en el ejemplo del usuario)
    const formData = new FormData()
    formData.append('id_compra', String(props.compraId || ''))
    formData.append('data', JSON.stringify(jsonData))
    formData.append('details', JSON.stringify(mappedDetails))
    formData.append('xml_file', new Blob([xmlText], { type: 'application/xml' }), `guia_${form.serie}-${form.numero}.xml`)
    // Enviar a la API
    await axios.post('http://192.168.18.21:8000/api/despatch-advices', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Descargar XML al usuario
    // (Eliminado: ya no se descarga el XML automáticamente para el usuario)
    success.value = 'Guía leída y guardada correctamente.'
  } catch (e) {
    error.value = (e instanceof Error && e.message) ? e.message : 'Error al procesar la guía.'
  } finally {
    loading.value = false
  }
}
</script>
