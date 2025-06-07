import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Supplier {
  id: number
  name: string
  ruc: string
  address: string
}

interface PurchaseItem {
  id: number
  description: string
  quantity: number
  unit: string
  weight: number // en kg
  unitPrice: number
  totalPrice: number
  purchaseId: number
}

interface Invoice {
  id: number
  number: string
  date: string
  subtotal: number
  tax: number
  total: number
}

interface ShippingGuide {
  id: number
  number: string
  date: string
  carrier: string
}

interface Purchase {
  id: number
  supplier: Supplier
  invoice: Invoice
  shippingGuide?: ShippingGuide
  items: PurchaseItem[]
  freightCost?: number
  status: 'pending' | 'partial' | 'completed'
  date: string
}

interface Freight {
  id: number
  supplier: Supplier
  invoice: Invoice
  shippingGuide?: ShippingGuide
  amount: number
  weight: number // peso total transportado
  purchaseIds?: number[] // compras asociadas
  status: 'pending' | 'assigned'
  date: string
}

export const usePurchaseStore = defineStore('purchase', () => {
  const purchases = ref<Purchase[]>([
    {
      id: 1,
      supplier: {
        id: 1,
        name: 'Distribuidora Alimentos S.A.',
        ruc: '20123456789',
        address: 'Av. Principal 123, Lima',
      },
      invoice: {
        id: 1,
        number: 'F001-123',
        date: '2023-10-15',
        subtotal: 1800,
        tax: 324,
        total: 2124,
      },
      shippingGuide: {
        id: 1,
        number: 'GR001-456',
        date: '2023-10-16',
        carrier: 'Transportes Rápidos SAC',
      },
      items: [
        {
          id: 1,
          description: 'Arroz Extra 50kg',
          quantity: 20,
          unit: 'saco',
          weight: 50,
          unitPrice: 90,
          totalPrice: 1800,
          purchaseId: 1,
        },
      ],
      status: 'pending',
      date: '2023-10-15',
    },
    {
      id: 2,
      supplier: {
        id: 2,
        name: 'Importadora de Granos EIRL',
        ruc: '20234567890',
        address: 'Calle Comercio 456, Arequipa',
      },
      invoice: {
        id: 2,
        number: 'F002-789',
        date: '2023-10-18',
        subtotal: 3200,
        tax: 576,
        total: 3776,
      },
      items: [
        {
          id: 2,
          description: 'Azúcar Rubia 25kg',
          quantity: 40,
          unit: 'saco',
          weight: 25,
          unitPrice: 60,
          totalPrice: 2400,
          purchaseId: 2,
        },
        {
          id: 3,
          description: 'Harina de Trigo 50kg',
          quantity: 16,
          unit: 'saco',
          weight: 50,
          unitPrice: 50,
          totalPrice: 800,
          purchaseId: 2,
        },
      ],
      status: 'pending',
      date: '2023-10-18',
    },
  ])

  const freights = ref<Freight[]>([
    {
      id: 1,
      supplier: {
        id: 3,
        name: 'Transportes Cargas SAC',
        ruc: '20345678901',
        address: 'Av. Industrial 789, Callao',
      },
      invoice: {
        id: 3,
        number: 'F003-101',
        date: '2023-10-16',
        subtotal: 300,
        tax: 54,
        total: 354,
      },
      shippingGuide: {
        id: 2,
        number: 'GR002-112',
        date: '2023-10-16',
        carrier: 'Transportes Cargas SAC',
      },
      amount: 354,
      weight: 1000, // 20 sacos de 50kg
      purchaseIds: [1],
      status: 'assigned',
      date: '2023-10-16',
    },
    {
      id: 2,
      supplier: {
        id: 4,
        name: 'Logística Nacional EIRL',
        ruc: '20456789012',
        address: 'Calle Transporte 321, Trujillo',
      },
      invoice: {
        id: 4,
        number: 'F004-131',
        date: '2023-10-19',
        subtotal: 500,
        tax: 90,
        total: 590,
      },
      amount: 590,
      weight: 1800, // 40 sacos de 25kg + 16 sacos de 50kg
      status: 'pending',
      date: '2023-10-19',
    },
  ])

  const pendingFreights = computed(() => freights.value.filter((f) => f.status === 'pending'))
  const purchasesWithoutFreight = computed(() => purchases.value.filter((p) => !p.freightCost))

  const assignFreightToPurchase = (freightId: number, purchaseIds: number[]) => {
    const freight = freights.value.find((f) => f.id === freightId)
    if (!freight) return

    // Calcular el peso total de las compras seleccionadas
    const selectedPurchases = purchases.value.filter((p) => purchaseIds.includes(p.id))
    const totalWeight = selectedPurchases.reduce((sum, purchase) => {
      return (
        sum + purchase.items.reduce((itemSum, item) => itemSum + item.weight * item.quantity, 0)
      )
    }, 0)

    // Asignar el costo proporcional a cada compra
    selectedPurchases.forEach((purchase) => {
      const purchaseWeight = purchase.items.reduce(
        (sum, item) => sum + item.weight * item.quantity,
        0,
      )
      const freightCost = (purchaseWeight / totalWeight) * freight.amount

      // Actualizar la compra con el costo de flete
      const index = purchases.value.findIndex((p) => p.id === purchase.id)
      if (index !== -1) {
        purchases.value[index].freightCost = parseFloat(freightCost.toFixed(2))
        purchases.value[index].status = freightCost > 0 ? 'partial' : 'pending'
      }
    })

    // Actualizar el flete
    freight.purchaseIds = purchaseIds
    freight.status = 'assigned'
    freight.weight = totalWeight
  }

  return {
    purchases,
    freights,
    pendingFreights,
    purchasesWithoutFreight,
    assignFreightToPurchase,
  }
})
