// stores/authStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

interface User {
  id: number
  name: string
  email: string
  id_empresa: number
  // Agrega más campos según tu modelo User
}

interface LoginData {
  email: string
  password: string
  empresa_id?: number | string
  remember?: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  empresa_id: number | string
  // Agrega más campos según tu formulario
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // State
  /* const user: Ref<User | null> = ref(null) */
  /* const token: Ref<string | null> = ref(null) */
  const isLoading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  /* const empresaId: Ref<number | null> = ref(null) */

  // Getters
  const isAuthenticated = ref(() => !!token.value)
  const currentUser = computed(() => user.value)
  const currentEmpresaId = computed(() => empresaId.value)

  // Estado inicial desde localStorage
  const user: Ref<User | null> = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const token: Ref<string | null> = ref(localStorage.getItem('token') || null)
  const empresaId: Ref<number | null> = ref(Number(localStorage.getItem('empresaId')) || null)

  const companyId = computed(() => user.value?.id_empresa ?? null)
  // Actions
  const login = async (credentials: LoginData) => {
    isLoading.value = true
    error.value = null

    try {
      // 1. Obtener cookie CSRF
      await axios.get('/sanctum/csrf-cookie')

      // 2. Hacer login
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        empresa_id: credentials.empresa_id,
      })

      // 3. Guardar datos
      token.value = response.data.token
      user.value = response.data.user
      empresaId.value = response.data.user.id_empresa

      // Guardar en localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('empresaId', String(response.data.user.id_empresa))

      // 4. Configurar axios para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      // 5. Redirigir
      router.push(empresaId.value === 1 ? '/admin/dashboard' : '/dashboard')
    } catch (err: any) {
      error.value =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        'Error al iniciar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  // Action para registro
  const register = async (userData: RegisterData) => {
    isLoading.value = true
    error.value = null

    try {
      // 1. Obtener cookie CSRF
      await axios.get('/sanctum/csrf-cookie')

      // 2. Enviar datos de registro
      const response = await axios.post('/auth/register', userData)

      // 3. Autologin después del registro (opcional)
      await login({
        email: userData.email,
        password: userData.password,
        empresa_id: userData.empresa_id,
      })

      return response.data
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.response?.data?.errors || 'Error en el registro'
      throw err
    } finally {
      isLoading.value = false
    }
  }
  const logout = async () => {
    try {
      await axios.post('/api/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('empresaId')
      resetAuthState()
      router.push('/login')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await api.get('/user')
      user.value = response.data
      empresaId.value = response.data.id_empresa
      isAuthenticated.value = true
    } catch (err) {
      resetAuthState()
    }
  }

  const resetAuthState = () => {
    user.value = null
    token.value = null
    empresaId.value = null
    delete axios.defaults.headers.common['Authorization']
  }

  const initialize = async () => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      try {
        await fetchUser() // Usamos el método fetchUser que ya tienes
      } catch (err) {
        logout() // Usamos el método logout existente
      }
    }
  }

  // Inicializar al cargar el store
  initialize()

  return {
    register,
    user,
    token,
    isLoading,
    error,
    empresaId,
    isAuthenticated,
    currentUser,
    currentEmpresaId,
    login,
    logout,
    fetchUser,
    initialize,
    companyId,
  }
})
