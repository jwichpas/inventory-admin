<template>
  <div>
    <div class="p-2 border-2 border-neutral-200 border-dashed rounded-lg dark:border-neutral-950 mt-14">
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
      <!-- Carga de compras -->
      <div
        class="p-4 bg-white block sm:flex items-center justify-between border-b border-neutral-200 lg:mt-1.5 dark:bg-neutral-950 dark:border-neutral-950">
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
              Compras</h1>
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
      <!-- Tabla de compras -->
      <div class="flex flex-col">
        <div class="overflow-x-auto rounded-xl shadow-lg dark:shadow-neutral-900/50">
          <div class="inline-block min-w-full align-middle">
            <div
              class="overflow-hidden rounded-lg overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-100 dark:scrollbar-thumb-blue-500 dark:scrollbar-track-neutral-800 scroll-smooth touch-pan-y overscroll-contain max-h-[70vh]">
              <table v-if="paginatedInvoices.length > 0"
                class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                <!-- Encabezado mejorado -->
                <thead
                  class="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-neutral-800 dark:to-neutral-900 sticky top-0 z-10">
                  <tr>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Proveedor
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Emisión
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Vencimiento
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Tipo Doc.
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Número
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Moneda
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Gravada S/
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-semibold text-white/90 uppercase tracking-wider">
                      IGV S/
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Total S/
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-left text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col"
                      class="px-6 py-3 text-right text-xs font-semibold text-white/90 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <!-- Cuerpo de la tabla con hover y zebra striping -->
                <tbody class="bg-white divide-y divide-neutral-200 dark:bg-neutral-900 dark:divide-neutral-700">
                  <tr v-for="(invoice, index) in paginatedInvoices" :key="invoice.id" :class="{
                    'bg-neutral-50 dark:bg-neutral-800/50': index % 2 === 0,
                    'bg-white dark:bg-neutral-900': index % 2 !== 0,
                    'hover:bg-blue-50 dark:hover:bg-neutral-700': true
                  }">
                    <!-- Celda de Proveedor con diseño mejorado -->
                    <td class="p-4 text-xs font-normal truncate max-w-xs text-neutral-500 dark:text-neutral-400">
                      <div class="flex items-center">
                        <div
                          class="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                          <span class="text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {{ invoice.nom_razon_social_proveedor.charAt(0) }}
                          </span>
                        </div>
                        <div>
                          <div class="font-medium text-neutral-900 dark:text-white">
                            {{ invoice.nom_razon_social_proveedor }}
                          </div>
                          <div class="text-xs text-neutral-500 dark:text-neutral-400">
                            {{ invoice.num_doc_identidad_proveedor }}
                          </div>
                        </div>
                      </div>

                    </td>
                    <td class="px-6 py-4 text-sm font-normal text-neutral-700 dark:text-white whitespace-nowrap">
                      <div class="flex items-center">
                        <svg class="w-4 h-4 mr-1 text-neutral-500 dark:text-neutral-400" fill="currentColor"
                          viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clip-rule="evenodd"></path>
                        </svg>
                        {{ formatDate(invoice.fec_emision) }}
                      </div>
                    </td>
                    <td class="px-6 py-4  text-sm text-neutral-700 dark:text-white">
                      <div class="flex items-center " :class="{
                        'text-red-600 dark:text-red-400': isDateExpired(invoice.fec_venc_pag),
                        'text-neutral-700 dark:text-neutral-300': !isDateExpired(invoice.fec_venc_pag)
                      }">
                        <svg class="w-4 h-4 mr-1 text-neutral-500 dark:text-neutral-400" fill="currentColor"
                          viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clip-rule="evenodd"></path>
                        </svg>
                        {{ formatDate(invoice.fec_venc_pag) }}
                      </div>
                    </td>

                    <td class="px-6 py-4 max-w-xs">
                      <div class="text-sm text-neutral-700 dark:text-neutral-300 truncate">
                        {{ invoice.cod_tipo_cdp }} {{ invoice.des_tipo_cdp }}
                      </div>
                    </td>
                    <!-- Número con estilo destacado -->
                    <td class="px-6 py-4  text-sm font-bold  text-neutral-700 whitespace-nowrap dark:text-white">
                      <span
                        class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        #{{ invoice.num_serie_cdp }}-{{ invoice.num_cdp }}
                      </span>
                    </td>
                    <!-- Moneda con color diferenciado -->
                    <td class="px-6 py-4  text-xs  text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      <span :class="{
                        'text-green-600 dark:text-green-400': invoice.cod_moneda === 'PEN',
                        'text-blue-600 dark:text-blue-400': invoice.cod_moneda === 'USD'
                      }" class="font-medium">
                        {{ invoice.cod_moneda }}
                      </span>
                    </td>


                    <td class="px-6 py-4  text-sm text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(invoice.montos.mto_bi_gravada_dg) }}
                    </td>
                    <td class="px-6 py-4  text-sm text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(invoice.montos.mto_igv_ipm_dg) }}
                    </td>
                    <td v-if="invoice.montos.mto_igv_ipm_dg >= 0"
                      class="px-6 py-4  text-sm text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(invoice.mto_total_cp) }}
                    </td>
                    <td v-if="invoice.mto_total_cp < 0"
                      class="px-6 py-4 text-sm text-right text-red-600 whitespace-nowrap dark:text-white">
                      {{
                        formatCurrency(invoice.mto_total_cp) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-right text-neutral-700 whitespace-nowrap dark:text-white">
                      <span :class="getStatusColor(invoice.des_estado_comprobante)"
                        class="px-3 py-1 text-xs font-medium rounded-full">
                        {{ invoice.des_estado_comprobante }}
                      </span>
                    </td>
                    <!-- Acciones con botones mejorados -->
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex space-x-2 justify-end">
                        <button @click="verDetalle(invoice.id)"
                          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z">
                            </path>
                            <path fill-rule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clip-rule="evenodd"></path>
                          </svg>
                          Editar
                        </button>

                        <button
                          class="inline-flex items-center px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 text-xs font-medium rounded-full shadow-sm text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clip-rule="evenodd"></path>
                          </svg>
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>

                </tbody>
                <tfoot>
                  <tr class="font-semibold text-neutral-900 dark:text-white">
                    <th scope="row" class="px-6 py-3 text-base">Total</th>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>
                    <td class="px-6 py-4"></td>

                    <td class="px-6 py-4 text-right">{{
                      formatCurrency(totalGravadas) }}</td>
                    <td class="px-6 py-4 text-right">{{
                      formatCurrency(totalIgv) }}</td>
                    <td class="px-6 py-4 text-sm text-right text-neutral-900 whitespace-nowrap dark:text-white">{{
                      formatCurrency(totalGeneral) }}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Mensaje cuando no hay datos -->
              <div v-else-if="!loading && !error" class="text-center py-12 bg-white dark:bg-neutral-900 rounded-b-lg">
                <svg class="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-600" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                  </path>
                </svg>
                <h3 class="mt-2 text-sm font-medium text-neutral-900 dark:text-white">No hay facturas disponibles</h3>
                <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">No se encontraron compras registradas en
                  el sistema.</p>
              </div>

              <!-- Efectos de desvanecimiento -->
              <div
                class="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent dark:from-neutral-900">
              </div>

              <!-- Paginación -->

              <!-- Mensaje de carga -->

            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- Paginación mejorada -->
    <div v-if="totalPages > 1"
      class="px-4 py-3 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 sm:px-6 bg-white dark:bg-neutral-900 rounded-b-lg">
      <div class="flex-1 flex justify-between sm:hidden">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700">
          Anterior
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700">
          Siguiente
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-neutral-700 dark:text-neutral-300">
            Mostrando página <span class="font-medium">{{ currentPage }}</span> de <span class="font-medium">{{
              totalPages }}</span>
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button @click="prevPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Anterior</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>

            <template v-for="page in visiblePages" :key="page">
              <button @click="goToPage(page)" :class="{
                'z-10 bg-blue-50 dark:bg-blue-900/50 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-300': currentPage === page,
                'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700': currentPage !== page
              }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ page }}
              </button>
            </template>

            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <span class="sr-only">Siguiente</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
    <!-- Estado de carga mejorado -->
    <div v-if="loading" class="mt-8 text-center">
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-blue-400">
      </div>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Cargando compras...</p>
    </div>

    <!-- Mensaje de error mejorado -->
    <div v-if="error" class="rounded-md bg-red-50 dark:bg-red-900/30 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
            fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error al cargar las compras</h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        </div>
      </div>
    </div>
    <!-- Componente del Drawer -->
    <!-- Componente del Drawer -->
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

  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-10" @close="setIsOpen">
      <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-neutral-500/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full" enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0"
              leave-to="translate-x-full">
              <DialogPanel class="pointer-events-auto relative w-screen max-w-md">
                <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                  enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
                  <div class="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                    <button type="button"
                      class="relative rounded-md text-neutral-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      @click="open = false">
                      <span class="absolute -inset-2.5" />
                      <span class="sr-only">Close panel</span>
                      <XMarkIcon class="size-6" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div class="px-4 sm:px-6">
                    <DialogTitle class="text-base font-semibold text-neutral-900">Panel title</DialogTitle>
                  </div>
                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <!-- Your content -->
                    <div class="ceu9r c91aq clu2m">

                      <div class="text-neutral-800 dark:text-neutral-100 cgulq cydwr cu6vl">Bank Transfer</div>
                      <div class="text-sm cydwr caf78">22/01/2024, 8:56 PM</div>

                      <!-- Details -->
                      <div class="c079l chlvh">
                        <!-- Top -->
                        <div class="bg-white c2vpa cbtrn cydwr cwuak cx3hp">
                          <div class="cydwr cxg65">
                            <img class="inline-flex rounded-full cz4lh cutow ct03h"
                              src="../../images/proveedor/plantilla.avif" width="96" height="96" alt="Transaction 04">
                          </div>
                          <div class="c612e cgulq cbtcb cu6vl">+$2,179.36</div>
                          <div class="text-sm text-neutral-800 dark:text-neutral-100 c1k3n cxg65">Acme LTD UK</div>
                          <div
                            class="inline-flex text-neutral-500 dark:text-neutral-400 rounded-full clksd cydwr c1k3n ch4gv c1iho cwn3v">
                            Pending</div>
                        </div>
                        <!-- Divider -->
                        <div class="flex items-center cm3rx" aria-hidden="true">
                          <svg class="cuxxq caoao" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z"></path>
                          </svg>
                          <div class="bg-white flex justify-center c2vpa cetff c6btv cbw8w cf3id">
                            <div class="border-neutral-200 dark:border-neutral-700 cxxjf cr4kg c6btv cfwuq"></div>
                          </div>
                          <svg class="cuxxq cbjxm caoao" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 20c5.523 0 10-4.477 10-10S5.523 0 0 0h20v20H0Z"></path>
                          </svg>
                        </div>
                        <!-- Bottom -->
                        <div class="bg-white text-sm c2vpa ce8hz cjav5 cfxh8 csusu">
                          <div class="flex cm3rx cqkjy">
                            <span class="caf78">IBAN:</span>
                            <span class="dark:text-neutral-100 cf8dr c1k3n chvik">IT17 2207 1010 0504 0006 88</span>
                          </div>
                          <div class="flex cm3rx cqkjy">
                            <span class="caf78">BIC:</span>
                            <span class="dark:text-neutral-100 cf8dr c1k3n chvik">BARIT22</span>
                          </div>
                          <div class="flex cm3rx cqkjy">
                            <span class="caf78">Reference:</span>
                            <span class="dark:text-neutral-100 cf8dr c1k3n chvik">Freelance Work</span>
                          </div>
                          <div class="flex cm3rx cqkjy">
                            <span class="caf78">Emitter:</span>
                            <span class="dark:text-neutral-100 cf8dr c1k3n chvik">Acme LTD UK</span>
                          </div>
                        </div>
                      </div>

                      <!-- Receipts -->
                      <div class="cgndh">
                        <div class="text-sm text-neutral-800 dark:text-neutral-100 cgulq c6f83">Receipts</div>
                        <form class="rounded border cghq3 c993f c4ppg cxxjf cyhlg cydwr cx3hp cxsfz">
                          <svg class="inline-flex ca2tk cyq9w cxg65" width="16" height="16" viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8 4c-.3 0-.5.1-.7.3L1.6 10 3 11.4l4-4V16h2V7.4l4 4 1.4-1.4-5.7-5.7C8.5 4.1 8.3 4 8 4ZM1 2h14V0H1v2Z">
                            </path>
                          </svg>
                          <label for="upload" class="block text-sm text-neutral-500 dark:text-neutral-400 caf78">We
                            accept
                            PNG, JPEG, and PDF files.</label>
                          <input class="cn8jz" id="upload" type="file">
                        </form>
                      </div>

                      <!-- Notes -->
                      <div class="cgndh">
                        <div class="text-sm text-neutral-800 dark:text-neutral-100 cgulq c6f83">Notes</div>
                        <form>
                          <label class="cn8jz" for="notes">Write a note</label>
                          <textarea id="notes" class="cn9r8 c071z c6btv" rows="4"
                            placeholder="Write a note…"></textarea>
                        </form>
                      </div>

                      <!-- Download / Report -->
                      <div class="flex items-center cp3jk cgndh">
                        <div class="c539s">
                          <button class="btn border-neutral-200 text-neutral-800 cc0oq cghq3 cspbm c0zkc c6btv">
                            <svg class="cmpw7 cdqku cbm9w cbjxm coqgc" width="16" height="16" viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M8 4c-.3 0-.5.1-.7.3L1.6 10 3 11.4l4-4V16h2V7.4l4 4 1.4-1.4-5.7-5.7C8.5 4.1 8.3 4 8 4ZM1 2h14V0H1v2Z">
                              </path>
                            </svg>
                            <span class="c8bkw">Download</span>
                          </button>
                        </div>
                        <div class="c539s">
                          <button class="btn border-neutral-200 cc0oq cghq3 cspbm czr3n c6btv">
                            <svg class="cbm9w coqgc" width="16" height="16" viewBox="0 0 16 16">
                              <path
                                d="M7.001 3h2v4h-2V3Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2ZM15 16a1 1 0 0 1-.6-.2L10.667 13H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1ZM2 11h9a1 1 0 0 1 .6.2L14 13V2H2v9Z">
                              </path>
                            </svg>
                            <span class="c8bkw">Report</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import axios from 'axios';
import dayjs from 'dayjs';
import PeriodoSelector from '@/components/PeriodoSelector.vue';
import api from '@/services/api';


import { obtenerCompras } from '@/services/sire';

const loading = ref(true);
const error = ref(null);
const perTributario = ref('');


const isOpen = ref(false)
function setIsOpen(value) {
  isOpen.value = value
}

const compras = ref([]);

const cargarCompras = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await obtenerCompras(perTributario.value);
    console.log("El periodo tributario que se esta tomando para actualizar es: " + perTributario.value)
    compras.value = data;
    fetchInvoices();
  } catch (error) {
    error.value = 'No se pudieron cargar las compras.';
  } finally {
    loading.value = false;
  }
};

// Función para obtener la fecha formateada usando day.js
function obtPerTributario() {
  return dayjs().format('YYYYMM'); // Formato YYYYMM
}

const router = useRouter();
// initialize components based on data attribute selectors
// Referencia al componente del modal
// Variable reactiva para la empresa seleccionada
const selectedEmpresa = ref(null);

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


// Configuración de paginación
const itemsPerPage = 10; // Número de filas por página
const currentPage = ref(1);

// Total de la tabla
const totalGeneral = ref(0);
const totalIgv = ref(0);
const totalGravadas = ref(0);

// Función para cargar los datos de la API
async function fetchInvoices() {
  try {
    const rucString = localStorage.getItem('selected_empresa_ruc');

    /* const response = await axios.get(`http://127.0.0.1:8000/api/compras/ruc/${rucString}`); */
    const response = await api.get(`/compras-sire/por-periodo?per_periodo=${perTributario.value}&per_ruc=${rucString}`);
    console.log('Datos recibidos:', response.data.data); // Log para verificar los datos

    // Extraer el array "comprobantes" de la respuesta
    const data = response.data.data;

    // Actualizar las variables reactivas
    invoices.value = data;
    filteredInvoices.value = data; // Inicialmente, todos los datos están filtrados

    const totals = filteredInvoices.value.reduce(
      (acc, invoice) => {
        const mtoBiGravadaDg = parseFloat(invoice.montos?.mto_bi_gravada_dg) || 0;
        const mtoTotalCp = parseFloat(invoice.mto_total_cp) || 0;
        const mtoIgvDg = parseFloat(invoice.montos?.mto_igv_ipm_dg) || 0;

        acc.totalGravadas += mtoBiGravadaDg;
        acc.totalGeneral += mtoTotalCp;
        acc.totalIgv += mtoIgvDg;

        return acc;
      },
      { totalGravadas: 0, totalGeneral: 0, totalIgv: 0 }
    );

    totalGravadas.value = totals.totalGravadas;
    totalGeneral.value = totals.totalGeneral;
    totalIgv.value = totals.totalIgv;

    // Calcular ventas Gravadas
    /* totalGravadas.value = filteredInvoices.value.reduce((sum, invoice) => {
      const amount = parseFloat(invoice.montos.mto_bi_gravada_dg) || 0;
      return sum + amount;
    }, 0);
    // Calcular el total filtrado
    totalFilteredAmount.value = filteredInvoices.value.reduce((sum, invoice) => {
      const amount = parseFloat(invoice.mto_total_cp) || 0;
      return sum + amount;
    }, 0); */

  } catch (err) {

    console.error('Error al cargar los datos:', err); // Log para capturar errores
    // Limpiar las variables reactivas en caso de error
    invoices.value = [];
    filteredInvoices.value = [];
    totalGeneral.value = 0;
    totalGravadas.value = 0;
    totalIgv.value = 0;
    error.value = err.response?.data?.message || 'No se encontraron datos para el período seleccionado.';
  } finally {
    loading.value = false;
  }
}

// Filtrar facturas según la búsqueda
function filterInvoices() {
  filteredInvoices.value = invoices.value.filter((invoice) => {
    const query = searchQuery.value.toLowerCase();
    return (
      invoice.nom_razon_social_proveedor?.toLowerCase().includes(query) ||
      invoice.num_doc_identidad_proveedor?.toLowerCase().includes(query)
    );
  });
  currentPage.value = 1; // Reiniciar la página al filtrar


  const totals = filteredInvoices.value.reduce(
    (acc, invoice) => {
      const mtoBiGravadaDg = parseFloat(invoice.montos?.mto_bi_gravada_dg) || 0;
      const mtoTotalCp = parseFloat(invoice.mto_total_cp) || 0;
      const mtoIgvDg = parseFloat(invoice.montos?.mto_igv_ipm_dg) || 0;

      acc.totalGravadas += mtoBiGravadaDg;
      acc.totalGeneral += mtoTotalCp;
      acc.totalIgv += mtoIgvDg;

      return acc;
    },
    { totalGravadas: 0, totalGeneral: 0, totalIgv: 0 }
  );

  totalGravadas.value = totals.totalGravadas;
  totalGeneral.value = totals.totalGeneral;
  totalIgv.value = totals.totalIgv;
}

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

// Redirigir al detalle de la factura
// Función para redirigir a la vista detallada
function verDetalle(id) {
  router.push({ name: 'CompraDetalle', params: { id } });
}


// Función para verificar si una fecha está vencida
const isDateExpired = (dateString) => {
  if (!dateString) return false

  // Convierte la fecha del formato DD/MM/YYYY a YYYY-MM-DD
  const [day, month, year] = dateString.split('/')
  const fechaVencimiento = new Date(`${year}-${month}-${day}`)
  const fechaActual = new Date()

  // Compara las fechas sin horas/minutos/segundos
  return fechaVencimiento < fechaActual
}
// Función para determinar el color basado en el estado
const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

  const statusLower = status.toLowerCase()

  // Estados positivos (verdes)
  if (['activo', 'aprobado', 'completado', 'pagado'].some(s => statusLower.includes(s))) {
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  }

  // Estados en proceso (amarillos)
  if (['pendiente', 'en proceso', 'por aprobar', 'en revisión'].some(s => statusLower.includes(s))) {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  }

  // Estados negativos (rojos)
  if (['rechazado', 'cancelado', 'vencido', 'anulado'].some(s => statusLower.includes(s))) {
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  // Estado por defecto (gris)
  return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

// Opcional: Si necesitas exponer esta función a otros componentes
defineExpose({
  getStatusColor
})



// Calcula las páginas visibles
const visiblePages = computed(() => {
  const range = 2 // Cuántas páginas mostrar alrededor de la actual
  const pages = []

  // Siempre mostrar primera página
  if (currentPage.value > range + 1) {
    pages.push(1)
    if (currentPage.value > range + 2) {
      pages.push('...')
    }
  }

  // Páginas alrededor de la actual
  const start = Math.max(1, currentPage.value - range)
  const end = Math.min(totalPages.value, currentPage.value + range)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  // Siempre mostrar última página
  if (currentPage.value < totalPages.value - range) {
    if (currentPage.value < totalPages.value - range - 1) {
      pages.push('...')
    }
    pages.push(totalPages.value)
  }

  return pages
})
// Cargar los datos cuando el componente se monta
onMounted(() => {
  perTributario.value = obtPerTributario();
  loadSelectedEmpresa();
  fetchInvoices();
});

</script>

<style scoped></style>
