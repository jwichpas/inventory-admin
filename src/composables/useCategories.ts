import { ref } from 'vue'
import type { AxiosResponse } from 'axios'
import api from '@/services/api'
import type { Category } from '@/types/category'

interface CodeValidation {
  isValid: boolean
  message: string
}

export function useCategories() {
  const currentEnterprise = ref<string>('')
  const categories = ref<Category[]>([])
  const isCheckingCode = ref(false)

  // Cache local inicial (opcional para mejor UX)
  const isCodeUniqueLocally = (codigo: string): boolean => {
    return !categories.value.some(
      (cat) => cat.codigo === codigo && cat.enterpriseId === currentEnterprise.value,
    )
  }

  // Validación en backend (Laravel)
  const validateCodeOnServer = async (codigo: string): Promise<CodeValidation> => {
    try {
      isCheckingCode.value = true
      console.log('Validando código en el servidor:', codigo)
      console.log('Enterprise ID:', currentEnterprise.value)
      const response: AxiosResponse<{
        is_valid: boolean
        message: string
      }> = await api.post('/categories/validate-code', {
        codigo,
        enterprise_id: currentEnterprise.value,
      })

      return {
        isValid: response.data.is_valid,
        message: response.data.message,
      }
    } catch (error) {
      console.error('Error validating code:', error)
      return {
        isValid: false,
        message: 'Error al validar el código',
      }
    } finally {
      isCheckingCode.value = false
    }
  }

  // Validación híbrida (óptima)
  const validateCodeHybrid = async (codigo: string): Promise<CodeValidation> => {
    // 1. Validación local rápida
    const localValidation = isCodeUniqueLocally(codigo)
    if (!localValidation) {
      return {
        isValid: false,
        message: 'Código duplicado (validación local)',
      }
    }

    // 2. Validación remota segura
    return await validateCodeOnServer(codigo)
  }

  return {
    currentEnterprise,
    categories,
    isCheckingCode,
    validateCodeHybrid,
    loadCategories: async (enterpriseId: string) => {
      currentEnterprise.value = enterpriseId
      const response = await api.get(`/categories?enterprise_id=${enterpriseId}`)
      categories.value = response.data
    },
  }
}
