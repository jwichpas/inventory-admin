import { ref } from 'vue'
import type { AxiosResponse } from 'axios'
import api from '@/api/axios'
import type { Brand } from '@/types/brand'

interface CodeValidation {
  isValid: boolean
  message: string
}

export function useBrands() {
  const currentEnterprise = ref<string>('')
  const brands = ref<Brand[]>([])
  const isCheckingCode = ref(false)

  // Cache local inicial (opcional para mejor UX)
  const isCodeUniqueLocally = (codigo: string): boolean => {
    return !brands.value.some(
      (brand) => brand.codigo === codigo && brand.enterpriseId === currentEnterprise.value,
    )
  }

  // Validación en backend (Laravel)
  const validateCodeOnServer = async (codigo: string): Promise<CodeValidation> => {
    try {
      isCheckingCode.value = true
      const response: AxiosResponse<{
        is_valid: boolean
        message: string
      }> = await api.post('/brands/validate-code-brand', {
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
    brands,
    isCheckingCode,
    validateCodeHybrid,
    loadBrands: async (enterpriseId: string) => {
      currentEnterprise.value = enterpriseId
      const response = await api.get(`/brands?enterprise_id=${enterpriseId}`)
      brands.value = response.data
    },
  }
}
