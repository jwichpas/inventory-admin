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
              class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Detalles del Comprobante: {{ xmlData?.bc?.ID }}
              </DialogTitle>

              <div class="mt-4">
                <!-- Tabs para diferentes secciones -->
                <nav class="flex space-x-4 border-b border-gray-200">
                  <button v-for="tab in tabs" :key="tab.name" @click="currentTab = tab.name" :class="[
                    currentTab === tab.name
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  ]">
                    {{ tab.label }}
                  </button>
                </nav>

                <!-- Contenido de los tabs -->
                <div class="py-4">
                  <!-- Información General -->
                  <div v-if="currentTab === 'general'" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 class="font-semibold text-gray-900">Información del Comprobante</h4>
                        <dl class="mt-2 space-y-2">
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Serie y Número</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{ xmlData?.bc?.ID }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Fecha Emisión</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{ formatDate(xmlData?.bc?.IssueDate) }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Tipo de Documento</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              getDocumentType(xmlData?.bc?.InvoiceTypeCode) }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Moneda</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              getCurrency(xmlData?.bc?.DocumentCurrencyCode) }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Monto Total</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              formatCurrency(xmlData?.legalMonetaryTotal?.PayableAmount) }}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 class="font-semibold text-gray-900">Totales</h4>
                        <dl class="mt-2 space-y-2">
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Gravado</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              formatCurrency(xmlData?.legalMonetaryTotal?.TaxInclusiveAmount) }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">IGV</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{ formatCurrency(xmlData?.taxTotal?.TaxAmount)
                            }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Importe Total</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              formatCurrency(xmlData?.legalMonetaryTotal?.PayableAmount) }}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <!-- Datos del Proveedor -->
                  <div v-if="currentTab === 'supplier'" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                      <div>
                        <h4 class="font-semibold text-gray-900">Datos del Proveedor</h4>
                        <dl class="mt-2 space-y-2">
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">RUC</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              xmlData?.accountingSupplierParty?.PartyIdentification?.ID }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Razón Social</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              xmlData?.accountingSupplierParty?.PartyName?.Name }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Dirección</dt>
                            <dd class="col-span-2 text-sm text-gray-900">
                              {{ xmlData?.accountingSupplierParty?.PostalAddress?.StreetName }}<br>
                              {{ xmlData?.accountingSupplierParty?.PostalAddress?.CityName }} -
                              {{ xmlData?.accountingSupplierParty?.PostalAddress?.CountrySubentity }}<br>
                              {{ xmlData?.accountingSupplierParty?.PostalAddress?.District }}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <!-- Datos del Cliente -->
                  <div v-if="currentTab === 'customer'" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                      <div>
                        <h4 class="font-semibold text-gray-900">Datos del Cliente</h4>
                        <dl class="mt-2 space-y-2">
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">RUC</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              xmlData?.accountingCustomerParty?.PartyIdentification?.ID }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Razón Social</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              xmlData?.accountingCustomerParty?.PartyLegalEntity?.RegistrationName }}</dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Dirección</dt>
                            <dd class="col-span-2 text-sm text-gray-900">
                              {{ xmlData?.accountingCustomerParty?.PhysicalLocation?.Description }}
                            </dd>
                          </div>
                          <div class="grid grid-cols-3 gap-4">
                            <dt class="text-sm font-medium text-gray-500">Correo</dt>
                            <dd class="col-span-2 text-sm text-gray-900">{{
                              xmlData?.accountingCustomerParty?.Contact?.ElectronicMail }}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <!-- Items -->
                  <div v-if="currentTab === 'items'" class="space-y-4">
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Item</th>
                            <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Descripción</th>
                            <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cantidad</th>
                            <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P.
                              Unitario</th>
                            <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="item in xmlData?.invoiceLines" :key="item.ID">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.ID }}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">
                              {{ item.Item?.Description }}<br>
                              <span class="text-gray-500">Código: {{ item.Item?.SellersItemIdentification?.ID }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.InvoicedQuantity }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                              formatCurrency(item.Price?.PriceAmount) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                              formatCurrency(item.LineExtensionAmount) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-end space-x-3">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  @click="downloadXML">
                  Descargar XML
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
import { ref, computed, defineProps, defineEmits } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

interface XMLData {
  bc?: {
    ID?: string
    IssueDate?: string
    InvoiceTypeCode?: string
    DocumentCurrencyCode?: string
    Note?: string
  }
  accountingSupplierParty?: {
    PartyIdentification?: {
      ID?: string
    }
    PartyName?: {
      Name?: string
    }
    PostalAddress?: {
      StreetName?: string
      CityName?: string
      CountrySubentity?: string
      District?: string
    }
  }
  accountingCustomerParty?: {
    PartyIdentification?: {
      ID?: string
    }
    PartyLegalEntity?: {
      RegistrationName?: string
    }
    PhysicalLocation?: {
      Description?: string
    }
    Contact?: {
      ElectronicMail?: string
    }
  }
  taxTotal?: {
    TaxAmount?: number | string
  }
  legalMonetaryTotal?: {
    TaxInclusiveAmount?: number | string
    PayableAmount?: number | string
  }
  invoiceLines?: Array<{
    ID?: string
    InvoicedQuantity?: number | string
    LineExtensionAmount?: number | string
    Item?: {
      Description?: string
      SellersItemIdentification?: {
        ID?: string
      }
    }
    Price?: {
      PriceAmount?: number | string
    }
  }>
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  xmlContent: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const currentTab = ref('general')
const tabs = [
  { name: 'general', label: 'General' },
  { name: 'supplier', label: 'Proveedor' },
  { name: 'customer', label: 'Cliente' },
  { name: 'items', label: 'Items' }
]

const xmlData = computed<XMLData>(() => {
  if (!props.xmlContent) return {}

  try {
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(props.xmlContent, 'text/xml')

    // Extraer datos básicos
    const bc = {
      ID: xmlDoc.querySelector('cbc\\:ID, ID')?.textContent,
      IssueDate: xmlDoc.querySelector('cbc\\:IssueDate, IssueDate')?.textContent,
      InvoiceTypeCode: xmlDoc.querySelector('cbc\\:InvoiceTypeCode, InvoiceTypeCode')?.textContent,
      DocumentCurrencyCode: xmlDoc.querySelector('cbc\\:DocumentCurrencyCode, DocumentCurrencyCode')?.textContent,
      Note: xmlDoc.querySelector('cbc\\:Note, Note')?.textContent
    }

    // Extraer datos del proveedor
    const accountingSupplierParty = {
      PartyIdentification: {
        ID: xmlDoc.querySelector('AccountingSupplierParty PartyIdentification cbc\\:ID, AccountingSupplierParty PartyIdentification ID')?.textContent
      },
      PartyName: {
        Name: xmlDoc.querySelector('AccountingSupplierParty PartyName cbc\\:Name, AccountingSupplierParty PartyName Name')?.textContent
      },
      PostalAddress: {
        StreetName: xmlDoc.querySelector('AccountingSupplierParty PostalAddress cbc\\:StreetName, AccountingSupplierParty PostalAddress StreetName')?.textContent,
        CityName: xmlDoc.querySelector('AccountingSupplierParty PostalAddress cbc\\:CityName, AccountingSupplierParty PostalAddress CityName')?.textContent,
        CountrySubentity: xmlDoc.querySelector('AccountingSupplierParty PostalAddress cbc\\:CountrySubentity, AccountingSupplierParty PostalAddress CountrySubentity')?.textContent,
        District: xmlDoc.querySelector('AccountingSupplierParty PostalAddress cbc\\:District, AccountingSupplierParty PostalAddress District')?.textContent
      }
    }

    // Extraer datos del cliente
    const accountingCustomerParty = {
      PartyIdentification: {
        ID: xmlDoc.querySelector('AccountingCustomerParty PartyIdentification cbc\\:ID, AccountingCustomerParty PartyIdentification ID')?.textContent
      },
      PartyLegalEntity: {
        RegistrationName: xmlDoc.querySelector('AccountingCustomerParty PartyLegalEntity cbc\\:RegistrationName, AccountingCustomerParty PartyLegalEntity RegistrationName')?.textContent
      },
      PhysicalLocation: {
        Description: xmlDoc.querySelector('AccountingCustomerParty PhysicalLocation cbc\\:Description, AccountingCustomerParty PhysicalLocation Description')?.textContent
      },
      Contact: {
        ElectronicMail: xmlDoc.querySelector('AccountingCustomerParty Contact cbc\\:ElectronicMail, AccountingCustomerParty Contact ElectronicMail')?.textContent
      }
    }

    // Extraer totales
    const taxTotal = {
      TaxAmount: xmlDoc.querySelector('TaxTotal cbc\\:TaxAmount, TaxTotal TaxAmount')?.textContent
    }

    const legalMonetaryTotal = {
      TaxInclusiveAmount: xmlDoc.querySelector('LegalMonetaryTotal cbc\\:TaxInclusiveAmount, LegalMonetaryTotal TaxInclusiveAmount')?.textContent,
      PayableAmount: xmlDoc.querySelector('LegalMonetaryTotal cbc\\:PayableAmount, LegalMonetaryTotal PayableAmount')?.textContent
    }

    // Extraer items
    const invoiceLines = Array.from(xmlDoc.querySelectorAll('InvoiceLine')).map(line => ({
      ID: line.querySelector('cbc\\:ID, ID')?.textContent,
      InvoicedQuantity: line.querySelector('cbc\\:InvoicedQuantity, InvoicedQuantity')?.textContent,
      LineExtensionAmount: line.querySelector('cbc\\:LineExtensionAmount, LineExtensionAmount')?.textContent,
      Item: {
        Description: line.querySelector('Item cbc\\:Description, Item Description')?.textContent,
        SellersItemIdentification: {
          ID: line.querySelector('Item SellersItemIdentification cbc\\:ID, Item SellersItemIdentification ID')?.textContent
        }
      },
      Price: {
        PriceAmount: line.querySelector('Price cbc\\:PriceAmount, Price PriceAmount')?.textContent
      }
    }))

    return {
      bc,
      accountingSupplierParty,
      accountingCustomerParty,
      taxTotal,
      legalMonetaryTotal,
      invoiceLines
    }
  } catch (error) {
    console.error('Error parsing XML:', error)
    return {}
  }
})

function closeModal() {
  emit('close')
}

function downloadXML() {
  const blob = new Blob([props.xmlContent], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `factura_${xmlData.value.bc?.ID || 'sin_numero'}.xml`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatDate(dateString?: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-PE')
}

function formatCurrency(amount?: string | number) {
  if (!amount) return ''
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: xmlData.value.bc?.DocumentCurrencyCode || 'PEN'
  }).format(value)
}

function getDocumentType(code?: string) {
  if (!code) return 'Desconocido'
  const types: Record<string, string> = {
    '01': 'Factura',
    '03': 'Boleta',
    '07': 'Nota de Crédito',
    '08': 'Nota de Débito'
  }
  return types[code] || `Tipo ${code}`
}

function getCurrency(code?: string) {
  if (!code) return 'Desconocido'
  const currencies: Record<string, string> = {
    'PEN': 'Soles (PEN)',
    'USD': 'Dólares (USD)'
  }
  return currencies[code] || `Moneda ${code}`
}
</script>
