<template>
  <!-- Selector de Ejercicios Fiscales -->
  <div class="grid grid-rows-1 items-center w-full sm:justify-end">
    <div class="grid grid-cols-3 gap-4">
      <!-- Selector de Ejercicio -->
      <div class="col-auto sm:col-span-1">
        <label for="ejercicio"
          class="inline-flex text-sm font-medium text-neutral-700 dark:text-neutral-300">Periodo:</label>
        <select id="ejercicio" v-model="selectedEjercicio" @change="filterPeriodos"
          class="mt-1 inline-flex w-full pl-3 pr-10 py-2 text-base text-neutral-950 border-neutral-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md
                 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="" disabled>Selecciona un ejercicio</option>
          <option v-for="ejercicio in ejercicios" :key="ejercicio.numEjercicio" :value="ejercicio.numEjercicio">
            {{ ejercicio.numEjercicio }} {{ ejercicio.desEstado }}
          </option>
        </select>
      </div>

      <!-- Selector de Períodos -->
      <div class="col-auto sm:col-span-1">
        <label for="periodo" class="inline-flex text-sm font-medium text-neutral-700 dark:text-neutral-300">Mes:</label>
        <select id="periodo" v-model="selectedPeriodo"
          class="mt-1 inline-flex w-full pl-3 pr-10 py-2 text-base text-neutral-950 border-neutral-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md
                 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option value="" disabled>Selecciona un período</option>
          <option v-for="periodo in filteredPeriodos" :key="periodo.perTributario" :value="periodo.perTributario">
            {{ periodo.perTributario }}
            - {{ periodo.desEstado }}
          </option>
        </select>
      </div>

      <!-- Botón de Buscar -->
      <div v-if="selectedEjercicio && selectedPeriodo" class="col-auto sm:col-span-1">
        <label for="submit" class="inline-flex text-sm font-medium text-white dark:text-neutral-800">_</label>
        <button @click="handleFilterClick" id="submit" class="mt-1 w-full inline-flex justify-center pl-3 pr-10 py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white
                 bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300
                 dark:focus:ring-blue-800 text-center me-2 mb-2">
          Buscar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'
import api from '@/api/axios'
import { useEmpresaStore } from '@/stores/empresaStore'
const empresaStore = useEmpresaStore()
const empresaId = empresaStore.empresaSeleccionada?.empresa_id

// Definición de tipos
interface Periodo {
  numPeriodo: string
  desPeriodo: string
  fecInicio: string
  fecFin: string
  desEstado: string
  numEjercicio: string
  perTributario: string
}

interface Ejercicio {
  numEjercicio: string
  desEstado: string
  lisPeriodos: Periodo[]
}

// Variables reactivas con tipos
const ejercicios = ref<Ejercicio[]>([])
const periodos = ref<Periodo[]>([])
const filteredPeriodos = ref<Periodo[]>([])
const selectedEjercicio = ref<string>('')
const selectedPeriodo = ref<string>('')

// Emits con tipo
const emit = defineEmits<{
  (e: 'filter', payload: { periodo: string }): void
}>()

const handleFilterClick = (): void => {
  console.log('Emitiendo evento "filter"' + selectedPeriodo.value)
  emit('filter', { periodo: selectedPeriodo.value })
}

// Función para cargar los datos de la API
async function fetchData(): Promise<void> {
  try {
    /* const empresaId = localStorage.getItem('empresaId') */
    if (!empresaId) {
      console.error('No se encontró el ID de la empresa en el localStorage.')
      return
    }

    const response = await api.get<{ data?: Ejercicio[] } | Ejercicio[]>('/periodosporruc', {
      params: { empresa_id: empresaId },
    })

    console.log(response.data)
    const data = response.data

    // Procesamiento seguro de datos con TypeScript
    if (Array.isArray(data)) {
      processData(data)
    } else if (data?.data && Array.isArray(data.data)) {
      processData(data.data)
    } else {
      console.error('La respuesta de la API no tiene la estructura esperada:', data)
    }
  } catch (error) {
    console.error('Error al cargar los datos:', error)
    // Considera manejar el error de manera más específica
  }
}

// Función auxiliar para procesar datos
function processData(data: Ejercicio[]): void {
  ejercicios.value = data.map((item) => ({
    numEjercicio: item.numEjercicio,
    desEstado: item.desEstado,
    lisPeriodos: item.lisPeriodos,
  }))

  periodos.value = data.flatMap((item) =>
    item.lisPeriodos.map((periodo) => ({
      ...periodo,
      numEjercicio: item.numEjercicio,
    }))
  )
}

// Función para filtrar los períodos
function filterPeriodos(): void {
  filteredPeriodos.value = selectedEjercicio.value
    ? periodos.value.filter(
      (periodo) => periodo.numEjercicio === selectedEjercicio.value
    )
    : []

  selectedPeriodo.value = ''
}

// Cargar los datos al montar el componente
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
