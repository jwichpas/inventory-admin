<template>
  <div class=" bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center rounded-xl transition-colors duration-300">
    <div
      class="max bg-white dark:bg-zinc-800 rounded-xl shadow-md overflow-hidden p-4 sm:p-6 transition-colors duration-300">


      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8 sm:py-12">
        <div
          class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400 mb-3 sm:mb-4">
        </div>
        <p class="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg">Cargando empresas...</p>
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-8 sm:py-12 space-y-3 sm:space-y-4">
        <div
          class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-100 p-3 sm:p-4 w-full max-w-md">
          <p class="font-medium text-sm sm:text-base">{{ error }}</p>
        </div>
        <button @click="fetchEmpresas"
          class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 text-sm sm:text-base">
          Reintentar
        </button>
      </div>

      <!-- Sin empresas -->
      <div v-else-if="empresas.length === 0" class="flex flex-col items-center justify-center py-8 sm:py-12">
        <svg xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 sm:h-12 sm:w-12 text-zinc-400 dark:text-zinc-500 mb-3 sm:mb-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <p class="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg">No tienes empresas asignadas</p>
      </div>

      <!-- Lista de empresas -->
      <div v-else class="space-y-4 sm:space-y-6">
        <div class="text-center">
          <h2 class="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">Bienvenido, {{ userEmail }}</h2>
          <h3 class="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 mt-1 sm:mt-2">Seleccione una empresa</h3>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <!-- Tarjeta para crear nueva empresa -->
          <div
            class="border-2 border-dashed rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 border-zinc-300 dark:border-zinc-600 flex flex-col items-center justify-center min-h-[120px]"
            @click="nuevaEmpresa">
            <div class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto text-blue-500 dark:text-blue-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h4 class="font-semibold text-blue-600 dark:text-blue-400 text-sm sm:text-base mt-2">Crear nueva
                empresa</h4>
              <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Registre una nueva organización</p>
            </div>
          </div>

          <!-- Tarjetas de empresas existentes -->
          <div v-for="empresa in empresas" :key="empresa.empresa_id"
            class="border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200" :class="{
              'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30': empresaSeleccionada?.empresa_id === empresa.empresa_id,
              'border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-500': empresaSeleccionada?.empresa_id !== empresa.empresa_id
            }" @click="seleccionarEmpresa(empresa)">
            <div class="space-y-1 sm:space-y-2">
              <h4 class="font-semibold text-zinc-800 dark:text-zinc-100 text-sm sm:text-base">{{ empresa.empresa_nombre
              }}</h4>
              <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">RUC: {{ empresa.ruc }}</p>
              <p class="text-xs text-zinc-500 dark:text-zinc-500">
                Registrada el: {{ formatDate(empresa.created_at) }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-center pt-4 sm:pt-6">
          <button @click="continuarDashboard"
            class="px-5 py-2 sm:px-6 sm:py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm sm:text-base"
            :disabled="!empresaSeleccionada">
            Continuar al Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 inline-block ml-1" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Botón flotante -->
      <button @click="nuevaEmpresa"
        class="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="Crear nueva empresa">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmpresaStore } from '@/stores/empresaStore'
import { useAuthStore } from '@/stores/authStore'

// Para el uso en otros componentes
/* import { useEmpresaStore } from '@/stores/empresaStore' */
/* const empresaStore = useEmpresaStore() */
/* const empresaId = empresaStore.empresaSeleccionada?.empresa_id */
const nuevaEmpresa = () => {
  // Usando router para navegar
  router.push('/admin/companies');

  // O si prefieres abrir en nueva pestaña:
  // window.open('/admin/companies', '_blank');
};

const router = useRouter()
const empresaStore = useEmpresaStore()
const authStore = useAuthStore()

const empresaSeleccionada = computed(() => empresaStore.empresaSeleccionada)
const empresas = computed(() => empresaStore.empresas)
const isLoading = computed(() => empresaStore.isLoading)
const error = computed(() => empresaStore.error)
const userEmail = computed(() => authStore.user?.email || '')

onMounted(async () => {
  await empresaStore.fetchEmpresas()
})

const seleccionarEmpresa = (empresa: any) => {
  empresaStore.selectEmpresa(empresa)
}

const continuarDashboard = () => {
  if (empresaSeleccionada.value) {
    router.push('/dashboard')
  }
}

const fetchEmpresas = () => {
  empresaStore.fetchEmpresas()
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('es-ES', options)
}
</script>

<style scoped>
.empresa-selection-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.welcome-message {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.selection-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #444;
}

.empresas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.empresa-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
}

.empresa-card:hover {
  border-color: #646cff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empresa-card.selected {
  border-color: #646cff;
  background-color: #f0f4ff;
}

.empresa-info h4 {
  margin: 0 0 0.5rem 0;
  color: #222;
}

.empresa-info p {
  margin: 0;
  color: #666;
}

.continue-button {
  display: block;
  width: 100%;
  max-width: 300px;
  margin: 2rem auto 0;
  padding: 0.75rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.continue-button:hover {
  background-color: #535bf2;
}

.continue-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-container {
  text-align: center;
  padding: 2rem;
}

.error-container {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #ff3333;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
