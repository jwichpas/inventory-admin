import { defineStore } from 'pinia'
import api from '@/api/axios'
import type { Product, Category, Brand } from '@/types/product'

interface ProductState {
  products: Product[]
  categories: Category[]
  brands: Brand[]
  loading: boolean
  error: string | null
}

const empresaId = localStorage.getItem('empresaId') || '1'

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    products: [],
    categories: [],
    brands: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        const response = await api.get('/products')
        this.products = response.data.data
        console.log(response.data.data)
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get(`/lista-categorias/${empresaId}`)
        this.categories = response.data
      } catch (error: any) {
        this.error = error.message
      }
    },
    async fetchBrands() {
      try {
        const response = await api.get(`/lista-marcas/${empresaId}`)
        this.brands = response.data
      } catch (error: any) {
        this.error = error.message
      }
    },
    async createProduct(productData: Omit<Product, 'id'>) {
      this.loading = true
      try {
        const response = await api.post('/nuevo-producto', productData)
        this.products.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async updateProduct(id: number, productData: Partial<Product>) {
      this.loading = true
      try {
        const response = await api.put(`/products/${id}`, productData)
        const index = this.products.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
    async deleteProduct(id: number) {
      this.loading = true
      try {
        await api.delete(`/products/${id}`)
        this.products = this.products.filter((p) => p.id !== id)
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
}) /*  */
