<template>
  <div
    class="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
        Iniciar sesión
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        class="bg-white dark:bg-zinc-900/80 py-10 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-zinc-200 dark:border-zinc-800">
        <form class="space-y-6 flex flex-col gap-4" @submit.prevent="handleLogin">
          <!-- Social Login -->
          <div class="flex flex-col gap-3">
            <div class="flex justify-center gap-3">
              <button type="button"
                class="flex-1 flex items-center justify-center gap-2 border border-zinc-700 dark:border-zinc-600 bg-transparent dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 rounded-md py-2 px-3 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="h-5 w-5" />
                <span>Use Google</span>
              </button>
              <button type="button"
                class="flex-1 flex items-center justify-center gap-2 border border-zinc-700 dark:border-zinc-600 bg-transparent dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 rounded-md py-2 px-3 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-1.14 0-2.07-.93-2.07-2.07C12.225.29 13.155-.64 14.295-.64c1.14 0 2.07.93 2.07 2.07zm-4.14 2.07c-1.14 0-2.07-.93-2.07-2.07C10.155.29 11.085-.64 12.225-.64c1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07zm-4.14 2.07c-1.14 0-2.07-.93-2.07-2.07C6.015.29 6.945-.64 8.085-.64c1.14 0 2.07.93 2.07 2.07 0 1.14-.93 2.07-2.07 2.07z" />
                </svg>
                <span>Use Apple</span>
              </button>
            </div>
            <div class="flex items-center gap-2 my-2">
              <div class="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
              <span class="text-xs text-zinc-400">OR</span>
              <div class="flex-1 h-px bg-zinc-300 dark:bg-zinc-700"></div>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input id="email" v-model="form.email" name="email" type="email" autocomplete="email" required
                class="appearance-none block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-950 dark:text-zinc-100 sm:text-sm" />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Contraseña
            </label>
            <div class="mt-1">
              <input id="password" v-model="form.password" name="password" type="password"
                autocomplete="current-password" required
                class="appearance-none block w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-950 dark:text-zinc-100 sm:text-sm" />
            </div>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" v-model="form.remember" name="remember-me" type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950" />
              <label for="remember-me" class="ml-2 block text-sm text-zinc-900 dark:text-zinc-200">
                Recordar sesión
              </label>
            </div>

            <div class="text-sm">
              <a href="#"
                class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="authStore.isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
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
        <div v-if="authStore.error" class="mt-4 bg-red-50 dark:bg-red-900/60 border-l-4 border-red-400 p-4">
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
              <p class="text-sm text-red-700 dark:text-red-200">
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
