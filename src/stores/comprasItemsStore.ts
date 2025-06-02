import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'
import type { Compra } from '@/types/compras'

export const useCompraStore = defineStore('compras', () => {
  const compras = ref<Compra[]>([])
  const selectedCompra = ref<Compra | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
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

  const fetchCompras = async (ruc: string) => {
    try {
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

      const response = await api.get(`/compras-detalles/${ruc}`, { params })
      compras.value = response.data.data
      pagination.value = {
        currentPage: response.data.current_page,
        perPage: response.data.per_page,
        total: response.data.total,
        lastPage: response.data.last_page,
        from: response.data.from,
        to: response.data.to,
      }
    } catch (err) {
      error.value = 'Error al cargar las compras'
      console.error('Error fetching compras:', err)
    } finally {
      loading.value = false
    }
  }

  const selectCompra = (compra: Compra) => {
    selectedCompra.value = compra
  }

  const resetFilters = () => {
    filters.value = {
      fechaDesde: '',
      fechaHasta: '',
      searchQuery: '',
      searchItem: '',
    }
  }

  return {
    compras,
    selectedCompra,
    loading,
    error,
    filters,
    pagination,
    fetchCompras,
    selectCompra,
    resetFilters,
  }
})
