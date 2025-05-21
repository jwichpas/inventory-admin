<template>
  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-neutral-200 border-dashed rounded-lg dark:border-neutral-700 mt-14">
      <!-- Actualizacion Sire -->
      <div id="toast-interactive"
        class="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-neutral-500 bg-white divide-x rtl:divide-x-reverse divide-neutral-200 rounded-lg shadow-sm top-15 right-5 dark:text-neutral-400 dark:divide-neutral-700 dark:bg-neutral-950"
        role="alert">
        <div class="flex">
          <div
            class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
            <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97" />
            </svg>
            <span class="sr-only">Refresh icon</span>
          </div>

          <div class="ms-3 text-sm font-normal">
            <span class="mb-1 text-sm font-semibold text-neutral-900 dark:text-white">Actualizacion disponible</span>
            <div class="mb-2 text-sm font-normal">Actualizar base del SIRE.</div>
            <div class="grid grid-cols-2 gap-2">
              <div>

                <button @click="cargarCompras" :disabled="loading"
                  class="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800">Actualizar</button>
              </div>
              <div>
                <button type="button" aria-label="Close" data-dismiss-target="#toast-interactive"
                  class="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 focus:ring-4 focus:outline-none focus:ring-neutral-200 dark:bg-neutral-600 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-700 dark:focus:ring-neutral-700">Ahora
                  no</button>

              </div>
            </div>
          </div>
          <button type="button"
            class="ms-auto -mx-1.5 -my-1.5 bg-white items-center justify-center shrink-0 text-neutral-400 hover:text-neutral-900 rounded-lg focus:ring-2 focus:ring-neutral-300 p-1.5 hover:bg-neutral-100 inline-flex h-8 w-8 dark:text-neutral-500 dark:hover:text-white dark:bg-neutral-800 dark:hover:bg-neutral-700"
            data-dismiss-target="#toast-interactive" aria-label="Close">
            <span class="sr-only">Close</span>
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Inicio -> Tabla de Filtro -->
      <div
        class="p-4 bg-white block sm:flex items-center justify-between border-b border-neutral-200 lg:mt-1.5 dark:bg-neutral-800 dark:border-neutral-700">
        <div class="w-full mb-1">
          <div class="mb-4">
            <nav class="flex mb-5" aria-label="Breadcrumb">
              <ol class="inline-flex items-center space-x-1 text-sm font-medium md:space-x-2">
                <li class="inline-flex items-center">
                  <a href="#"
                    class="inline-flex items-center text-neutral-700 hover:text-blue-600 dark:text-neutral-300 dark:hover:text-white">
                    <svg class="w-5 h-5 mr-2.5" fill="currentColor" viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z">
                      </path>
                    </svg>
                    Inicio
                  </a>
                </li>
                <li>
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <span class="ml-1 text-neutral-400 md:ml-2 dark:text-neutral-500"
                      aria-current="page">Proveedores</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 class="text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-white">Lista de
              Proveedores</h1>
          </div>
          <div
            class="items-center justify-between block sm:flex md:divide-x md:divide-neutral-100 dark:divide-neutral-700">
            <div class="flex items-center mb-4 sm:mb-0">
              <form class="sm:pr-3" action="#" method="GET">
                <label for="filterproveedores" class="sr-only">Buscar</label>
                <div class="relative w-48 mt-1 sm:w-64 xl:w-96">
                  <input v-model="searchQuery" type="text" name="filterproveedores" id="filterproveedores"
                    @input="filterProveedores"
                    class="bg-neutral-50 border border-neutral-300 text-neutral-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Proveedor" />
                </div>

              </form>
              <div class="flex items-center w-full sm:justify-end">
                <div class="flex pl-2 space-x-1">
                  <a href="#"
                    class="inline-flex justify-center p-1 text-neutral-500 rounded cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#"
                    class="inline-flex justify-center p-1 text-neutral-500 rounded cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#"
                    class="inline-flex justify-center p-1 text-neutral-500 rounded cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </a>
                  <a href="#"
                    class="inline-flex justify-center p-1 text-neutral-500 rounded cursor-pointer hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z">
                      </path>
                    </svg>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      <!-- Tabla de compras -->
      <div class="flex flex-col">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden shadow">
              <table v-if="paginatedProveedores.length > 0"
                class="display min-w-full divide-y divide-blue-200 table-fixed dark:divide-blue-600">
                <thead class="bg-coolneutral-200  dark:bg-indigo-600 dark:text-white">
                  <tr>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Proveedor
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Total Compras
                    </th>

                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Estado
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Condicion
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Departamento
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Provincia
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Direccion
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-blue-300 dark:bg-neutral-800 dark:divide-neutral-700">
                  <tr v-for="proveedor in paginatedProveedores" :key="proveedor.id"
                    class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-neutral-200 hover:bg-blue-100 dark:hover:bg-neutral-600">

                    <td class="p-4 text-xs font-normal truncate max-w-xs text-neutral-500 dark:text-neutral-400">
                      <!-- text-wrap -->
                      <div class=" font-semibold text-neutral-900 dark:text-white">{{
                        proveedor.nombre_o_razon_social }}</div>
                      <div class="text-xs font-normal text-neutral-500 dark:text-neutral-400">{{
                        proveedor.tipo_contribuyente }}</div>
                      <div class="text-sm font-normal text-neutral-500 dark:text-neutral-400">{{
                        proveedor.numero }}</div>
                    </td>
                    <td class="px-6 py-4  text-sm text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(proveedor.compras_sum_mto_total_cp) }}
                    </td>

                    <td v-if="proveedor.estado == 'ACTIVO'"
                      class="px-6 py-4  text-sm font-bold  text-green-600 whitespace-nowrap dark:text-white">
                      {{ proveedor.estado }}</td>
                    <td v-if="proveedor.estado !== 'ACTIVO'"
                      class="px-6 py-4  text-sm font-bold  text-red-600 whitespace-nowrap dark:text-white">
                      {{ proveedor.estado }}</td>

                    <td v-if="proveedor.condicion === 'HABIDO'"
                      class="px-6 py-4  text-sm font-bold  text-green-600 whitespace-nowrap dark:text-white">
                      {{
                        proveedor.condicion }}
                    </td>
                    <td v-if="proveedor.condicion !== 'HABIDO'"
                      class="px-6 py-4  text-sm  text-red-600 whitespace-nowrap dark:text-white">
                      {{
                        proveedor.condicion }}
                    </td>
                    <td
                      class="max-w-xs text-sm px-6 py-4  overflow-hidden text-neutral-700 truncate xl:max-w-xs dark:text-neutral-400">
                      {{ proveedor.departamento }} </td>
                    <td class="px-6 py-4  text-sm  text-neutral-600 text-left  whitespace-nowrap dark:text-white">
                      {{
                        proveedor.provincia }}
                    </td>
                    <td
                      class="px-6 py-4 max-w-xs truncate text-sm  text-neutral-600 text-left  whitespace-nowrap dark:text-white">
                      {{
                        proveedor.direccion }}
                    </td>

                    <td class="px-6 py-4  space-x-2 whitespace-nowrap">
                      <button data-drawer-placement="right" @click="verDetalle(proveedor.numero)"
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 rounded-lg me-2 mb-2">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z">
                          </path>
                          <path fill-rule="evenodd"
                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                            clip-rule="evenodd"></path>
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>

                </tbody>
                <tfoot>
                  <tr class="font-semibold text-neutral-900 dark:text-white">
                    <th scope="row" class="px-6 py-3 text-base">Total</th>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4 text-right"></td>
                    <td class="px-6 py-4 text-right"></td>
                    <td class="px-6 py-4 text-sm text-right text-neutral-900 whitespace-nowrap dark:text-white"></td>
                  </tr>
                </tfoot>
              </table>
              <!-- Mensaje si no hay datos -->
              <div v-else-if="!loading && !error" class="no-data">
                No hay facturas disponibles.
              </div>
              <!-- Paginación -->
              <nav v-if="totalPages > 1"
                class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4"
                aria-label="Table navigation">
                <span
                  class="text-sm font-normal text-neutral-500 dark:text-neutral-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">En
                  vista
                  <span class="font-semibold text-neutral-900 dark:text-white">Página {{ currentPage }} </span> de <span
                    class="font-semibold text-neutral-900 dark:text-white">{{ totalPages
                    }}</span></span>
                <ul class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                  <li>
                    <a href="#" :disabled="currentPage === 1" @click="prevPage"
                      class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-neutral-500 bg-white border border-neutral-300 rounded-s-lg hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                      Anterior
                    </a>
                  </li>
                  <!-- <li>
                    <a href="#"
                      class="flex items-center justify-center px-3 h-8 leading-tight text-neutral-500 bg-white border border-neutral-300 hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">1</a>
                  </li> -->

                  <li>
                    <a href="#" :disabled="currentPage === totalPages" @click="nextPage"
                      class="flex items-center justify-center px-3 h-8 leading-tight text-neutral-500 bg-white border border-neutral-300 rounded-e-lg hover:bg-neutral-100 hover:text-neutral-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white">
                      Siguiente
                    </a>
                  </li>
                </ul>
              </nav>
              <!-- Mensaje de carga -->
              <div v-if="loading" class="loading">Cargando...</div>

              <div v-if="loading"
                class="flex items-center justify-center rounded-lg bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700">
                <div role="status">
                  <svg aria-hidden="true"
                    class="w-8 h-8 text-neutral-200 animate-spin dark:text-neutral-600 fill-blue-600"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor" />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>

              <div v-if="error" class="error">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Estado para almacenar las facturas
const proveedores = ref([]);
const filteredProveedores = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const error = ref(null);

// Configuración de paginación
const itemsPerPage = 10; // Número de filas por página
const currentPage = ref(1);

// Función para cargar los datos de la API
async function fetchProveedores() {
  try {
    const rucString = localStorage.getItem('selected_empresa_ruc');
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/proveedores/ruc?num_ruc=${rucString}`);
    console.log('Datos recibidos:', response.data); // Log para verificar los datos

    // Extraer el array "comprobantes" de la respuesta
    const data = response.data;

    // Actualizar las variables reactivas
    proveedores.value = data;
    filteredProveedores.value = data; // Inicialmente, todos los datos están filtrados

  } catch (err) {

    console.error('Error al cargar los datos:', err); // Log para capturar errores
    // Limpiar las variables reactivas en caso de error
    proveedores.value = [];
    filteredProveedores.value = [];
    error.value = err.response?.data?.message || 'No se encontraron datos para el período seleccionado.';
  } finally {
    loading.value = false;
  }
}

// Filtrar facturas según la búsqueda
function filterProveedores() {
  filteredProveedores.value = proveedores.value.filter((proveedor) => {
    const query = searchQuery.value.toLowerCase();
    return (
      proveedor.nombre_o_razon_social?.toLowerCase().includes(query)
    );
  });
  currentPage.value = 1; // Reiniciar la página al filtrar

}

// Calcular las facturas paginadas
const paginatedProveedores = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProveedores.value.slice(start, end);
});

// Calcular el número total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredProveedores.value.length / itemsPerPage);
});
// Cambiar de página
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// Función para formatear números con el formato ###,##0.00
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const router = useRouter();
function verDetalle(id) {
  router.push({ name: 'ProveedorView', params: { id } });
}
onMounted(() => {
  fetchProveedores();
});
</script>
