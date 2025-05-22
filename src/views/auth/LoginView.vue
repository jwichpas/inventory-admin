<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Iniciar sesión
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Empresa Selector -->
          <!--           <div v-if="companies.length > 0">
            <label for="empresa_id" class="block text-sm font-medium text-gray-700">
              Empresa
            </label>
            <div class="mt-1">
              <select id="empresa_id" v-model="form.empresa_id" name="empresa_id" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="" disabled selected>Seleccione una empresa</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
          </div> -->

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input id="email" v-model="form.email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1">
              <input id="password" v-model="form.password" name="password" type="password"
                autocomplete="current-password" required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.remember" name="remember-me" type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordar sesión
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="authStore.isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!authStore.isLoading">Iniciar sesión</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Procesando...
              </span>
            </button>
          </div>
        </form>

        <!-- Error Message -->
        <div v-if="authStore.error" class="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-700">
                {{ authStore.error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import api from '@/api/axios'
import type { AxiosError } from 'axios'

const router = useRouter()
const authStore = useAuthStore()

// Definición de tipos
interface Company {
  id: number
  name: string
}

interface LoginForm {
  email: string
  password: string
  remember: boolean
  empresa_id?: string | number
}


// Variables reactivas con tipos
const companies = ref<Company[]>([])
const form = ref<LoginForm>({
  email: '',
  password: '',
  remember: false,
  empresa_id: ''
})

// Carga inicial de empresas
onMounted(async () => {
  await loadCompanies()
})

/**
 * Carga la lista de empresas desde la API
 */
async function loadCompanies(): Promise<void> {
  try {
    const response = await api.get<Company[]>('/empresas')
    companies.value = response.data
  } catch (error) {
    handleApiError(error as AxiosError, 'Error al cargar empresas')
  }
}

/**
 * Maneja el proceso de login
 */
const handleLogin = async (): Promise<void> => {
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember,
      empresa_id: form.value.empresa_id
    })

    redirectAfterLogin()
  } catch (error) {
    // El error ya está manejado en el store
    console.error('Error en el componente de login:', error)
  }
}

/**
 * Redirige al usuario según su companyId
 */
function redirectAfterLogin(): void {
  const redirectPath = authStore.companyId === 1
    ? '/admin/dashboard'
    : '/select-empresa'
  router.push(redirectPath)
}

/**
 * Maneja errores de API de forma consistente
 */
function handleApiError(error: AxiosError, defaultMessage: string): void {
  if (error.response) {
    console.error(`${defaultMessage}:`, error.response.data)
  } else {
    console.error(defaultMessage, error.message)
  }
}
</script>
