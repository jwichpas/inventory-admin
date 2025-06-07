// stores/freight.ts
import api from '@/api/axios'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Reutilizamos los mismos tipos que las compras
interface FleteItem {
  id: number
  compra_id: number
  invoicedQuantity: string
  unitCode: string
  priceAmount: string
  priceTypeCode: string
  sellersId: string
  description: string
  itemClassCode: string | null
  taxAmount: string
  taxableAmount: string
  taxExemptionReasonCode: string
  percent: string
  created_at: string
  updated_at: string
}

interface Flete {
  id: number
  id_registro: string
  num_ruc: string
  nom_razon_social: string
  cod_car: string
  cod_tipo_cdp: string
  des_tipo_cdp: string
  num_serie_cdp: string
  num_cdp: string
  fec_emision: string
  nom_razon_social_proveedor: string
  num_doc_identidad_proveedor: string
  cod_moneda: string
  mto_total_cp: string
  items: FleteItem[]
}

interface FletesResponse {
  current_page: number
  data: Flete[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export const useFreightStore = defineStore('freight', () => {
  // Estado
  const fletesData = ref<FletesResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedFreightType = ref<string>('peso') // 'peso', 'volumen', 'valor', etc.
  const filters = ref({
    fechaDesde: '',
    fechaHasta: '',
    searchQuery: '',
    searchItem: '',
  })
  const pagination = ref({
    currentPage: 1,
    perPage: 10,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  })

  // Computed
  const fletesList = computed(() => {
    return fletesData.value?.data || []
  })

  const activeFletes = computed(() => {
    return fletesList.value.filter((flete) => flete.des_estado_comprobante === 'Activo')
  })

  // Acciones
  const loadFletes = async (ruc?: string, page: number = 1) => {
    loading.value = true
    error.value = null

    const params = {
      page: pagination.value.currentPage,
      perPage: pagination.value.perPage,
      fechaDesde: filters.value.fechaDesde,
      fechaHasta: filters.value.fechaHasta,
      search: filters.value.searchQuery,
      searchItem: filters.value.searchItem,
    }

    try {
      // Aquí harías la llamada a tu API de fletes
      const response = await api.get(`/compras-detalles/${ruc}`, { params })
      fletesData.value = await response.data.data
      pagination.value = {
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
        lastPage: response.data.last_page,
        from: response.data.from,
        to: response.data.to,
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error cargando fletes'
      console.error('Error loading fletes:', err)
    } finally {
      loading.value = false
    }
  }

  const calculateFreightCost = (weight: number): number => {
    if (weight <= 0) return 0

    // Buscar en todos los fletes activos las tarifas por peso
    const weightRates = activeFletes.value.flatMap((flete) =>
      flete.items.filter(
        (item) => item.itemClassCode === 'PESO' || item.description.toLowerCase().includes('peso'),
      ),
    )

    // Determinar qué tarifa aplicar según el peso
    let applicableRate: FleteItem | null = null

    for (const rate of weightRates) {
      const description = rate.description.toLowerCase()

      if (description.includes('hasta') && description.includes('5')) {
        if (weight <= 5) {
          applicableRate = rate
          break
        }
      } else if (description.includes('5.01') && description.includes('20')) {
        if (weight > 5 && weight <= 20) {
          applicableRate = rate
          break
        }
      } else if (description.includes('20.01') && description.includes('50')) {
        if (weight > 20 && weight <= 50) {
          applicableRate = rate
          break
        }
      } else if (description.includes('mas de 50') || description.includes('más de 50')) {
        if (weight > 50) {
          applicableRate = rate
          break
        }
      }
    }

    if (!applicableRate) {
      // Si no se encuentra una tarifa específica, usar la tarifa base más alta
      const defaultRate = weightRates.find(
        (rate) =>
          rate.description.toLowerCase().includes('mas de') ||
          rate.description.toLowerCase().includes('más de'),
      )
      if (defaultRate) {
        return weight * parseFloat(defaultRate.priceAmount)
      }
      return weight * 2.0 // Tarifa por defecto
    }

    return weight * parseFloat(applicableRate.priceAmount)
  }

  const getFreightRateForWeight = (weight: number): FleteItem | null => {
    const weightRates = activeFletes.value.flatMap((flete) =>
      flete.items.filter(
        (item) => item.itemClassCode === 'PESO' || item.description.toLowerCase().includes('peso'),
      ),
    )

    for (const rate of weightRates) {
      const description = rate.description.toLowerCase()

      if (description.includes('hasta') && description.includes('5') && weight <= 5) {
        return rate
      } else if (
        description.includes('5.01') &&
        description.includes('20') &&
        weight > 5 &&
        weight <= 20
      ) {
        return rate
      } else if (
        description.includes('20.01') &&
        description.includes('50') &&
        weight > 20 &&
        weight <= 50
      ) {
        return rate
      } else if (
        (description.includes('mas de 50') || description.includes('más de 50')) &&
        weight > 50
      ) {
        return rate
      }
    }

    return null
  }

  const getAvailableFreightTypes = (): string[] => {
    const types = new Set<string>()

    activeFletes.value.forEach((flete) => {
      flete.items.forEach((item) => {
        if (item.itemClassCode) {
          types.add(item.itemClassCode)
        }
      })
    })

    return Array.from(types)
  }

  const getFreightRatesByType = (type: string): FleteItem[] => {
    return activeFletes.value.flatMap((flete) =>
      flete.items.filter((item) => item.itemClassCode === type),
    )
  }

  const setSelectedFreightType = (type: string) => {
    selectedFreightType.value = type
  }

  // Función de utilidad para formatear precios
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(price)
  }

  // Función para obtener descripción amigable del rango de peso
  const getWeightRangeDescription = (description: string): string => {
    const desc = description.toLowerCase()
    if (desc.includes('hasta') && desc.includes('5')) return '0 - 5 kg'
    if (desc.includes('5.01') && desc.includes('20')) return '5.01 - 20 kg'
    if (desc.includes('20.01') && desc.includes('50')) return '20.01 - 50 kg'
    if (desc.includes('mas de 50') || desc.includes('más de 50')) return '50+ kg'
    return description
  }

  return {
    // Estado
    fletesData,
    loading,
    error,
    selectedFreightType,

    // Computed
    fletesList,
    activeFletes,

    // Acciones
    loadFletes,
    calculateFreightCost,
    getFreightRateForWeight,
    getAvailableFreightTypes,
    getFreightRatesByType,
    setSelectedFreightType,

    // Utilidades
    formatPrice,
    getWeightRangeDescription,
  }
})
