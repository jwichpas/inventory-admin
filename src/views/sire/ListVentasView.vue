<template>
  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-neutral-200 border-dashed rounded-lg dark:border-neutral-700 mt-14">
      <div
        class="p-4 bg-white block sm:flex items-center justify-between border-b border-neutral-200 lg:mt-1.5 dark:bg-neutral-800 dark:border-neutral-700">
        <!-- Actualizacion Sire -->
        <div id="toast-interactive"
          class="fixed flex items-center w-full max-w-xs p-4 space-x-4 text-neutral-500 bg-white divide-x rtl:divide-x-reverse divide-neutral-200 rounded-lg shadow-sm top-15 right-5 dark:text-neutral-400 dark:divide-neutral-700 dark:bg-neutral-800"
          role="alert">
          <div class="flex">
            <div
              class="inline-flex items-center justify-center shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 18 20">
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

                  <button @click="cargarVentas" :disabled="loading"
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
              <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
            </button>
          </div>
        </div>
        <!-- Fin Actualizacion Sire -->
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
                    <a href="#"
                      class="ml-1 text-neutral-700 hover:text-blue-600 md:ml-2 dark:text-neutral-300 dark:hover:text-white">Sire</a>
                  </div>
                </li>
                <li>
                  <div class="flex items-center">
                    <svg class="w-6 h-6 text-neutral-400" fill="currentColor" viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                    <span class="ml-1 text-neutral-400 md:ml-2 dark:text-neutral-500" aria-current="page">Compras</span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 class="text-xl font-semibold text-neutral-900 sm:text-2xl dark:text-white">Lista de
              Ventas</h1>
          </div>
          <div
            class="items-center justify-between block sm:flex md:divide-x md:divide-neutral-100 dark:divide-neutral-700">
            <div class="flex items-center mb-4 sm:mb-0">
              <form class="sm:pr-3" action="#" method="GET">
                <label for="filterinvoice" class="sr-only">Buscar</label>
                <div class="relative w-48 mt-1 sm:w-64 xl:w-96">
                  <input v-model="searchQuery" type="text" name="filterinvoice" id="filterinvoice"
                    @input="filterInvoices"
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
            <PeriodoSelector @filter="handleFilter" />
            <!-- <button data-modal-target="add-user-modal" data-modal-toggle="add-user-modal"
              class="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button">
              Buscar Facturas
            </button> -->
          </div>
        </div>
      </div>

      <div class="flex flex-col">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden shadow">
              <table v-if="paginatedInvoices.length > 0"
                class="display min-w-full divide-y divide-blue-200 table-fixed dark:divide-blue-600">
                <thead class="bg-coolneutral-200  dark:bg-indigo-600 dark:text-white">
                  <tr>
                    <th scope="col" class="p-4">
                      <div class="flex items-center">
                        <input id="checkbox-all" aria-describedby="checkbox-1" type="checkbox"
                          class="w-4 h-4 border-neutral-300 rounded bg-neutral-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-neutral-800 dark:bg-neutral-700 dark:border-neutral-600">
                        <label for="checkbox-all" class="sr-only">checkbox</label>
                      </div>
                    </th>
                    <th scope="col"
                      class="w-96 truncate p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Proveedor
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Emision
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Vencimento
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Tipo de Doc.
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Numero
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Moneda
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Total S/
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Estado
                    </th>
                    <th scope="col"
                      class="p-4 text-xs font-medium text-left text-neutral-500 uppercase dark:text-neutral-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-blue-100 dark:bg-neutral-800 dark:divide-neutral-700">
                  <tr v-for="invoice in paginatedInvoices" :key="invoice.id"
                    class="bg-white border-b dark:bg-neutral-800 dark:border-neutral-700 border-neutral-200 hover:bg-blue-100 dark:hover:bg-neutral-600">
                    <td class="w-4 p-4 ">
                      <div class="flex items-center">
                        <input id="checkbox-{{ invoice.id }}" aria-describedby="checkbox-1" type="checkbox"
                          class="w-4 h-4 border-neutral-300 rounded bg-neutral-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-500 dark:ring-offset-neutral-800 dark:bg-neutral-700 dark:border-neutral-600">
                        <label for="checkbox-{{ invoice.id }}" class="sr-only">checkbox</label>
                      </div>
                    </td>
                    <td
                      class="p-4 truncate text-ellipsis	 text-sm font-normal text-neutral-500 whitespace-nowrap dark:text-neutral-400 ">
                      <div class="text-wrap font-semibold text-neutral-900 dark:text-white truncate text-ellipsis">
                        {{
                          invoice.nom_razon_social_cliente }}
                      </div>
                      <div class="text-sm font-normal truncate text-neutral-500 dark:text-neutral-400">{{
                        invoice.num_doc_identidad }}</div>
                    </td>
                    <td class="px-6 py-4 text-sm font-normal text-neutral-700 dark:text-white">
                      {{
                        formatDate(invoice.fec_emision) }}</td>
                    <td class="px-6 py-4  text-sm text-neutral-700 dark:text-white">
                      {{
                        formatDate(invoice.fec_venc_pag) }}
                    </td>
                    <td
                      class="max-w-sm px-6 py-4  overflow-hidden text-neutral-700 truncate xl:max-w-xs dark:text-neutral-400">
                      {{ invoice.cod_tipo_cdp }} {{ invoice.des_tipo_cdp }}</td>
                    <td class="px-6 py-4  text-sm  text-neutral-700 whitespace-nowrap dark:text-white">
                      # {{ invoice.num_serie_cdp }}-{{ invoice.num_cdp }}</td>
                    <td class="px-6 py-4  text-sm  text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      {{
                        invoice.cod_moneda }}
                    </td>
                    <td v-if="invoice.mto_total_cp > 0"
                      class="px-6 py-4  font-semibold text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(invoice.mto_total_cp) }}
                    </td>
                    <td v-if="invoice.mto_total_cp < 0"
                      class="px-6 py-4  font-semibold text-right text-red-600 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(invoice.mto_total_cp) }}
                    </td>
                    <td class="px-6 py-4  text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      <div class="flex items-center">
                        <div v-if="invoice.des_estado_comprobante = 'activo'"
                          class="h-2.5 w-2.5 rounded-full bg-green-500 me-2">
                        </div>
                        <div v-else class="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                        {{
                          invoice.des_estado_comprobante }}
                      </div>
                    </td>
                    <td class="px-6 py-4  space-x-2 whitespace-nowrap">
                      <button type="button" id="updateProductButton" data-drawer-placement="right"
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
                    <td class="px-6 py-3"></td>
                    <td class="px-6 py-3"></td>
                    <td class="px-6 py-3"></td>
                    <td class="px-6 py-3"></td>
                    <td class="px-6 py-3"></td>
                    <td class="px-6 py-3"></td>
                    <td class="p-4 text-base font-normal text-right text-neutral-900 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(totalFilteredAmount) }}</td>
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
              <div v-if="error" class="error">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal para agregar un usuario -->
  <!-- Main modal -->
  <div id="add-user-modal" tabindex="-1" aria-hidden="true"
    class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative p-4 w-full max-w-md max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-neutral-700">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-neutral-600 border-neutral-200">
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
            Buscar nuevas Facturas
          </h3>
          <!-- data-modal-toggle="add-user-modal" -->
          <button type="button"
            class="text-neutral-400 bg-transparent hover:bg-neutral-200 hover:text-neutral-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-neutral-600 dark:hover:text-white">
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <form class="p-4 md:p-5" @submit.prevent="handleSubmit">
          <div class="grid gap-4 mb-4 grid-cols-2">
            <div class="col-span-2">
              <label for="numRuc" class="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Numero
                RUC</label>
              <input v-model="formData.numRuc" type="text" name="numRuc" id="numRuc"
                class="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="RUC" required="">
            </div>
            <div class="col-span-2">
              <label for="numSerieComprobante"
                class="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Serie
              </label>
              <input v-model="formData.numSerieComprobante" type="text" name="numSerieComprobante"
                id="numSerieComprobante"
                class="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="F001" required="">
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label for="price" class="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Desde</label>
              <input v-model="formData.numDocumentoInicio" type="text" name="price" id="price"
                class="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="1" required="">
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label for="numDocumentoFin"
                class="block mb-2 text-sm font-medium text-neutral-900 dark:text-white">Hasta</label>
              <input v-model="formData.numDocumentoFin" type="text" name="numDocumentoFin" id="numDocumentoFin"
                class="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-neutral-600 dark:border-neutral-500 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="99999" required="">
            </div>



          </div>
          <button type="submit"
            class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"></path>
            </svg>
            Buscar
          </button>
        </form>
        <div v-if="loading" class="loading">Cargando...</div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="response" class="response">
          <h3>Respuesta:</h3>
          <pre>{{ response }}</pre>
        </div>

      </div>
    </div>
  </div>



</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import PeriodoSelector from '@/components/PeriodoSelector.vue';
import dayjs from 'dayjs';

/* import { obtenerVentas } from '@/services/api'; */
// initialize components based on data attribute selectors
// Referencia al componente del modal
// Variable reactiva para la empresa seleccionada
const selectedEmpresa = ref(null);

// Función para obtener la fecha formateada usando day.js
function obtPerTributario() {
  return dayjs().format('YYYYMM'); // Formato YYYYMM
}
// Función para cargar la empresa seleccionada desde el localStorage
function loadSelectedEmpresa() {
  const selectedEmpresaId = localStorage.getItem('selected_empresa_id');
  const selectedEmpresaRuc = localStorage.getItem('selected_empresa_ruc');
  if (selectedEmpresaId) {
    // Aquí puedes hacer una solicitud a la API para obtener los detalles completos de la empresa
    // Por ahora, solo simulamos los datos
    selectedEmpresa.value = {
      id: selectedEmpresaId,
      ruc: selectedEmpresaRuc,
      nombre: `Empresa ${selectedEmpresaId}`,
    };
  }
}
// Estado para almacenar las facturas
const invoices = ref([]);
const filteredInvoices = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const error = ref(null);

// Configuración de paginación
const itemsPerPage = 10; // Número de filas por página
const currentPage = ref(1);
const totalFilteredAmount = ref(0);

const perTributario = ref('');
// Propiedad computada para calcular el total del monto
/* const totalFilteredAmount = computed(() => {
  return invoices.value.reduce((suma, compra) => {
    const monto = parseFloat(compra.mto_total_cp) || 0; // Convertir a número o usar 0 si es inválido
    return suma + monto;
  }, 0);
}); */
// Función para cargar los datos de la API

// Función para obtener la fecha formateada usando day.js
const ventas = ref([]);

const cargarVentas = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await obtenerVentas(perTributario.value);
    console.log("El periodo tributario que se esta tomando para actualizar es: " + perTributario.value)
    ventas.value = data;
    fetchInvoices();
  } catch (error) {
    error.value = 'No se pudieron cargar las ventas.';
  } finally {
    loading.value = false;
  }
};

async function fetchInvoices() {
  try {
    const rucString = localStorage.getItem('selected_empresa_ruc');

    /* const response = await axios.get(`http://127.0.0.1:8000/api/ventas/ruc/${rucString}`); */
    const response = await axios.get(`http://127.0.0.1:8000/api/ventasmensual/por-periodo?per_periodo=${perTributario.value}&per_ruc=${rucString}`);
    console.log('Datos recibidos:', response.data.data); // Log para verificar los datos

    // Extraer el array "comprobantes" de la respuesta
    const data = response.data.data;
    invoices.value = response.data.data;
    filteredInvoices.value = data; // Inicialmente, todos los datos están filtrados
    totalFilteredAmount.value = filteredInvoices.value.reduce((sum, invoice) => {
      const amount = parseFloat(invoice.mto_total_cp) || 0;
      return sum + amount;
    }, 0);
  } catch (err) {
    console.error('Error al cargar los datos:', err); // Log para capturar errores
    error.value = err.message || 'Ocurrió un error al cargar los datos.';
  } finally {
    loading.value = false;
  }
}

// Filtrar facturas según la búsqueda
function filterInvoices() {
  filteredInvoices.value = invoices.value.filter((invoice) => {
    const query = searchQuery.value.toLowerCase();
    return (
      invoice.nom_razon_social.toLowerCase().includes(query) ||
      invoice.nom_razon_social_proveedor?.toLowerCase().includes(query)
    );
  });
  currentPage.value = 1; // Reiniciar la página al filtrar
  totalFilteredAmount.value = filteredInvoices.value.reduce((sum, invoice) => {
    const amount = parseFloat(invoice.mto_total_cp) || 0;
    return sum + amount;
  }, 0);
}

// Función para manejar el filtrado

// Función para manejar el filtrado
const handleFilter = (filtro) => {
  console.log(filtro.periodo);
  perTributario.value = filtro.periodo
  console.log(perTributario.value);
  // Filtrar los datos según el período
  if (filtro.periodo) {
    fetchInvoices(filtro.periodo); // Llama a la función con el período seleccionado
  } else {
    console.warn('No se ha seleccionado ningún período.');
  }

};


// Calcular las facturas paginadas
const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredInvoices.value.slice(start, end);
});

// Calcular el número total de páginas
const totalPages = computed(() => {
  return Math.ceil(filteredInvoices.value.length / itemsPerPage);
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

// Datos del formulario
const formData = ref({
  numRuc: '',
  numSerieComprobante: '',
  numDocumentoInicio: '',
  numDocumentoFin: '',
});

// Estado de la aplicación

const response = ref(null);

// Función para formatear la fecha (YYYY-MM-DD a DD/MM/YYYY)
function formatDate(dateString) {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
// Función para formatear números con el formato ###,##0.00
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-PE', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
// Cargar los datos cuando el componente se monta
onMounted(() => {
  perTributario.value = obtPerTributario();
  loadSelectedEmpresa();
  fetchInvoices();

});

</script>

<style scoped></style>
