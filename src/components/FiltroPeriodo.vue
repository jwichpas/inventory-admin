<template>
  <!-- Selector de Ejercicios Fiscales -->

  <!-- Selector de Ejercicio -->
  <div>
    <label for="ejercicio" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Ejercicio</label>
    <select id="ejercicio" v-model="selectedEjercicio" @change="filterPeriodos"
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none dark:bg-neutral-700 dark:placeholder-neutral-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:border-indigo-600 dark:focus:ring-blue-100 ">
      <option value="" disabled>Todas los periodos</option>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { defineEmits } from 'vue';
import api from '@/api/axios'; // Importa tu instancia de axios
/* import { useEmpresaStore } from '@/stores/empresaStore' */
/* const empresaStore = useEmpresaStore() */
/* const empresaId = empresaStore.empresaSeleccionada?.empresa_id */

// Variables reactivas
const ejercicios = ref([]); // Lista de ejercicios fiscales
const periodos = ref([]); // Lista completa de períodos
const filteredPeriodos = ref([]); // Períodos filtrados por ejercicio
const selectedEjercicio = ref(''); // Ejercicio seleccionado
const selectedPeriodo = ref(''); // Período seleccionado

const emit = defineEmits(['filter']);

const handleFilterClick = () => {
  console.log('Emitiendo evento "filter"' + selectedPeriodo.value);
  emit('filter', { periodo: selectedPeriodo.value });
};
// Función para cargar los datos de la API
async function fetchData() {
  try {
    const empresaId = localStorage.getItem('empresaId');

    console.log('ID de la empresa:', empresaId); // Inspecciona el ID de la empresa
    // Obtener el ID de la empresa
    if (!empresaId) {
      console.error('No se encontró el ID de la empresa en el localStorage.');
      return;
    }
    const response = await api.get('/periodosporruc', {
      params: { empresa_id: empresaId }, // Envía el empresa_id como query string
    });
    console.log(response.data); // Inspecciona la estructura de la respuesta
    const data = response.data;

    // Procesar los datos recibidos
    if (Array.isArray(data)) {
      ejercicios.value = data.map((item) => ({
        numEjercicio: item.numEjercicio,
        desEstado: item.desEstado,
        lisPeriodos: item.lisPeriodos,
      }));

      periodos.value = data.flatMap((item) =>
        item.lisPeriodos.map((periodo) => ({
          ...periodo,
          numEjercicio: item.numEjercicio,
        }))
      );
    } else if (data && data.data && Array.isArray(data.data)) {
      // Si la respuesta tiene un campo "data"
      ejercicios.value = data.data.map((item) => ({
        numEjercicio: item.numEjercicio,
        desEstado: item.desEstado,
        lisPeriodos: item.lisPeriodos,
      }));

      periodos.value = data.data.flatMap((item) =>
        item.lisPeriodos.map((periodo) => ({
          ...periodo,
          numEjercicio: item.numEjercicio,
        }))
      );
    } else {
      console.error('La respuesta de la API no es un array:', data);
    }
  } catch (error) {
    console.error('Error al cargar los datos:', error);
  }
}

// Función para filtrar los períodos según el ejercicio seleccionado
function filterPeriodos() {
  if (selectedEjercicio.value) {
    filteredPeriodos.value = periodos.value.filter(
      (periodo) => periodo.numEjercicio === selectedEjercicio.value
    );
  } else {
    filteredPeriodos.value = [];
  }

  // Reiniciar el período seleccionado
  selectedPeriodo.value = '';
}

// Cargar los datos cuando el componente se monta
onMounted(() => {
  fetchData();
  /* handleFilterClick(); */
});
</script>

<style scoped></style>
