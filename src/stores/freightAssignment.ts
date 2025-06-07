import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFreightAssignmentStore = defineStore('freightAssignment', () => {
  // Mapea freightId -> array de purchaseId seleccionados
  const selectedPurchases = ref<Record<number, number[]>>({})

  // Persistencia en localStorage
  const STORAGE_KEY = 'freightAssignmentSelectedPurchases'

  // Cargar del storage al iniciar
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      selectedPurchases.value = JSON.parse(saved)
    } catch {}
  }

  // Guardar automáticamente al cambiar
  watch(
    selectedPurchases,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  // Métodos para manipular la selección
  function selectPurchase(freightId: number, purchaseId: number) {
    if (!selectedPurchases.value[freightId]) selectedPurchases.value[freightId] = []
    if (!selectedPurchases.value[freightId].includes(purchaseId)) {
      selectedPurchases.value[freightId].push(purchaseId)
    }
  }
  function unselectPurchase(freightId: number, purchaseId: number) {
    if (!selectedPurchases.value[freightId]) return
    selectedPurchases.value[freightId] = selectedPurchases.value[freightId].filter(
      (id) => id !== purchaseId,
    )
  }
  function setSelectedPurchases(freightId: number, ids: number[]) {
    selectedPurchases.value[freightId] = ids
  }
  function clearSelected(freightId: number) {
    selectedPurchases.value[freightId] = []
  }

  // Tipado para los datos completos de la compra
  interface Supplier {
    id: number
    name: string
    ruc: string
  }
  interface Invoice {
    number: string
    total: number
  }
  interface Item {
    id: number
    description: string
    weight: number
  }
  interface Purchase {
    id: number
    date: string
    type: 'Mercadería' | 'Gasto' | 'Flete'
    supplier: Supplier
    invoice: Invoice
    guide?: string
    items: Item[]
  }

  // Nuevo: almacena los datos completos de las compras seleccionadas
  const selectedPurchasesData = ref<Record<number, Record<number, Purchase>>>({})

  // Métodos para manipular los datos completos
  function saveSelectedPurchaseData(freightId: number, purchase: Purchase) {
    if (!selectedPurchasesData.value[freightId]) selectedPurchasesData.value[freightId] = {}
    selectedPurchasesData.value[freightId][purchase.id] = { ...purchase }
  }
  function removeSelectedPurchaseData(freightId: number, purchaseId: number) {
    if (selectedPurchasesData.value[freightId]) {
      delete selectedPurchasesData.value[freightId][purchaseId]
    }
  }
  function clearSelectedPurchasesData(freightId: number) {
    selectedPurchasesData.value[freightId] = {}
  }

  return {
    selectedPurchases,
    selectedPurchasesData,
    selectPurchase,
    unselectPurchase,
    setSelectedPurchases,
    saveSelectedPurchaseData,
    removeSelectedPurchaseData,
    clearSelectedPurchasesData,
  }
})
