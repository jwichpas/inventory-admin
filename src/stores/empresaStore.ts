// stores/empresaStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/authStore'

interface Empresa {
  empresa_id: number
  ruc: string
  empresa_nombre: string
  created_at: string
  updated_at: string
}

interface UserEmpresas {
  user_id: number
  user_name: string
  empresas: Empresa[]
}

export const useEmpresaStore = defineStore('empresa', () => {
  const authStore = useAuthStore()
  const empresas: Ref<Empresa[]> = ref([])
  const empresaSeleccionada: Ref<Empresa | null> = ref(null)
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const userId = computed(() => authStore.user?.id)

  const fetchEmpresas = async (): Promise<void> => {
    if (!userId.value) {
      error.value = 'No se pudo obtener el ID del usuario'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<{ message: string; data: UserEmpresas }>(
        `/empresayusuario/${userId.value}`,
      )
      empresas.value = response.data.data.empresas
    } catch (err) {
      error.value = 'Error al cargar las empresas'
      console.error('Error fetching empresas:', err)
    } finally {
      isLoading.value = false
    }
  }

  const selectEmpresa = (empresa: Empresa): void => {
    empresaSeleccionada.value = empresa
    localStorage.setItem('empresaSeleccionada', JSON.stringify(empresa))
    localStorage.setItem('empresaRuc', empresa.ruc)
    localStorage.setItem('empresaId', String(empresa.empresa_id))
  }

  return {
    empresas,
    empresaSeleccionada,
    isLoading,
    error,
    fetchEmpresas,
    selectEmpresa,
    userId,
  }
})
