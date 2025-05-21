<template>
  <div class="p-4 py-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
      <div v-if="invoice" class="card">
        <!-- Page Title Starts -->
        <div class="mb-6 flex flex-col justify-between gap-y-1 sm:flex-row sm:gap-y-0">
          <h5>Detalle de Factura#1001</h5>
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#">Invoice</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#">Details</a>
            </li>
          </ol>
        </div>
        <!-- Page Title Ends -->

        <!-- Invoice Details Starts -->
        <div class="grid grid-cols-1 gap-y-3 md:gap-x-5 xl:grid-cols-4 ">
          <div class="col-span-1 xl:col-span-2 col-start-1 xl:col-start-1 xl:row-start-1 xl:row-span-5">
            <div class="card">
              <div class="bg-white p-4 border border-gray-100 rounded-lg card-body space-y-6">
                <!-- Invoice Header Starts -->
                <div class="flex flex-col justify-between space-y-4 p-1 md:flex-row">
                  <div class="flex items-center justify-center md:justify-start">
                    <!-- Logo Starts -->
                    <div class="flex h-16 w-full items-center gap-4 pr-4">
                      <span class="inline-block flex-shrink-0">
                        <img src="../../images/svg/SmallBusiness.gif" alt="logo" class="h-[80px]">
                      </span>
                      <div class="flex flex-col">
                        <h1 class="flex text-xl">
                          <span class="font-bold text-gray-700 dark:text-slate-200"> {{
                            invoice.nom_razon_social_proveedor }}
                          </span>
                          <span class="font-semibold text-red-600"> </span>
                        </h1>

                        <p v-if="facturaXMLParseados" class="whitespace-nowrap text-sm font-semibold text-slate-600">{{
                          facturaXMLParseados.AddressLine.Direccion
                        }}</p>
                        <p v-if="facturaXMLParseados" class="whitespace-nowrap text-xs font-semibold text-slate-600">{{
                          facturaXMLParseados.AddressLine.CityName
                        }} - {{
                            facturaXMLParseados.AddressLine.CountrySubentity
                          }} - {{
                            facturaXMLParseados.AddressLine.District
                          }}</p>
                        <p v-if="facturaXMLParseados" class="whitespace-nowrap text-sm font-semibold text-slate-600">{{
                          facturaXMLParseados.AddressLine.AddressTypeCode
                        }}</p>
                        <p class="whitespace-nowrap text-xs text-slate-400">Simple &amp; Customizable</p>
                      </div>
                    </div>
                    <!-- Logo Ends -->
                  </div>
                  <div class="flex flex-col items-start justify-start md:items-center">
                    <h1 class="flex text-xl">
                      <span class="font-xs font-bold text-gray-700">R.U.C.: {{ invoice.num_doc_identidad_proveedor }}
                      </span>
                    </h1>
                    <h4 class="text-xl font-bold text-gray-700 text-center dark:text-white">{{ invoice.des_tipo_cdp }}
                    </h4>
                    <h4 class="text-xl font-bold text-gray-700 dark:text-white">{{
                      invoice.num_serie_cdp }}-{{ invoice.num_cdp }}
                    </h4>

                  </div>
                </div>

                <!-- Invoice Info Starts -->
                <div class="flex flex-col justify-between space-y-6 p-1 md:flex-row md:space-y-0">
                  <div class="flex w-full flex-col items-start justify-center md:mb-0 md:w-2/3 md:justify-center">
                    <p class="text-xs font-medium uppercase text-slate-500">Facturado a:</p>
                    <h6 class="text-slate-800 font-bold">{{ invoice.nom_razon_social }}</h6>
                    <p class="whitespace-nowrap text-sm font-normal text-slate-600 dark:text-slate-300">
                      {{ invoice.num_ruc }}
                    </p>
                    <p v-if="facturaXMLParseados"
                      class="whitespace-normal text-xs font-normal text-slate-600 dark:text-slate-300">
                      {{ facturaXMLParseados.PartyLegalEntity.Direccion }}
                    </p>
                    <br>
                    <p v-if="facturaXMLParseados"
                      class="my-0 py-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Forma de Pago
                      <span class="font-normal text-slate-600 dark:text-slate-300"> {{
                        facturaXMLParseados.PaymentTerms.paymentMeansID
                        }} </span>
                    </p>
                    <p v-if="invoice.fec_venc_pag"
                      class="my-0 py-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Moneda:
                      <span class="font-normal text-slate-600 dark:text-slate-300"> {{ invoice.cod_moneda }} </span>
                    </p>
                  </div>

                  <div class="flex w-full flex-col items-start justify-center md:w-1/3 md:items-end">
                    <p class="text-xs font-medium uppercase text-slate-400"> </p>
                    <p v-if="invoice.fec_venc_pag"
                      class="my-0 py-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Estado:
                      <span class="font-normal text-slate-600 dark:text-slate-300"> {{ invoice.des_estado_comprobante }}
                      </span>
                    </p>
                    <p class="my-0 py-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Periodo:
                      <span class="font-normal text-slate-600 dark:text-slate-300"> {{ invoice.per_tributario }} </span>
                    </p>
                    <p class="my-0 py-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Emision:
                      <span class="font-semibold text-blue-700 dark:text-slate-300"> {{ invoice.fec_emision }} </span>
                    </p>
                    <p v-if="invoice.fec_venc_pag"
                      class="my-0 py-0 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Vencimiento:
                      <span class="font-normal text-slate-600 dark:text-slate-300"> {{ invoice.fec_venc_pag }} </span>
                    </p>



                  </div>
                </div>
                <!-- Invoice Info Ends -->

                <!-- Product Table Starts -->
                <div class="w-full overflow-auto p-1">
                  <div class="min-w-[38rem]">
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg scroll-smooth">
                      <!-- Product Table Starts -->
                      <table
                        class="w-full border-collapse text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" class="px-6 py-3">ID</th>
                            <th scope="col" class="px-6 py-3">Codigo</th>
                            <th scope="col" class="px-6 py-3 w-1.5">Nombre</th>
                            <th scope="col" class="px-6 py-3">Cantidad</th>
                            <th scope="col" class="px-6 py-3">Precio</th>
                            <th scope="col" class="px-6 py-3">Total</th>
                          </tr>
                        </thead>
                        <tbody v-if="facturaXMLParseados">
                          <tr v-for="(producto, index) in facturaXMLParseados.ProdFac" :key="index"
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <td class="px-6 py-4 whitespace-nowrap text-xs">{{ index + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-xs">{{ producto.Ideide }}</td>
                            <td class="px-6 py-4 whitespace-normal w-3/4  text-xs ">{{ producto.Nombre }}</td>
                            <td class="px-6 py-4 text-right whitespace-nowrap text-xs">{{ (producto.Cantidad *
                              1).toFixed(2) }}</td>
                            <td class="px-6 py-4 text-right whitespace-nowrap text-xs">{{ (producto.ValorTotal /
                              producto.Cantidad).toFixed(3) }}</td>
                            <td class="px-6 py-4 text-right whitespace-nowrap text-xs">{{ producto.ValorTotal
                              }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div class="mt-4 flex items-stretch justify-between">
                      <div class="w-2/5">
                        <p class="my-2 py-0 text-sm font-semibold">
                          Son:
                          <span v-if="facturaXMLParseados" class="font-normal text-nowrap"> {{
                            facturaXMLParseados.NoteMoneda }} </span>
                        </p>
                        <p class="my-2 py-0 text-sm font-semibold">
                          Metodo de Pago:
                          <span class="font-normal"> Transferencia Bancaria </span>
                        </p>
                        <p class="m-0 p-0 text-sm font-semibold">Note:</p>
                        <blockquote class="text-sm font-normal text-slate-600 dark:text-slate-400">
                          It was a pleasure working with you and your team.
                          <br>
                          We hope you will keep us in mind for future freelance
                          <br>
                          projects. Thank You!
                        </blockquote>
                      </div>

                      <div>
                        <ul class="space-y-3">
                          <li class="flex items-center gap-x-2">
                            <span
                              class="inline-block w-1/2 text-right text-sm font-medium text-slate-400">Subtotal:</span>
                            <span
                              class="inline-block w-1/2 pr-6 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {{ invoice.montos.mto_bi_gravada_dg }}
                            </span>
                          </li>
                          <li class="flex items-center gap-x-2">
                            <span class="inline-block w-1/2 text-right text-sm font-medium text-slate-400">IGV:</span>
                            <span
                              class="inline-block w-1/2 pr-6 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {{ invoice.montos.mto_igv_ipm_dg }}
                            </span>
                          </li>
                          <li class="flex items-center gap-x-2">
                            <span class="inline-block w-1/2 text-right text-sm font-medium text-slate-400">Otros
                              :</span>
                            <span
                              class="inline-block w-1/2 pr-6 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {{ invoice.montos.mto_otros_trib }}
                            </span>
                          </li>
                          <li class="flex items-center gap-x-2">
                            <span class="inline-block w-1/2 text-right text-sm font-medium text-slate-400">ISC:</span>
                            <span
                              class="inline-block w-1/2 pr-6 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                              {{ invoice.montos.mto_isc }}
                            </span>
                          </li>
                        </ul>
                        <hr class="mb-1 mt-5 border-slate-200 dark:border-slate-600">
                        <div class="flex items-center gap-x-2">
                          <span class="inline-block w-1/2 text-right text-sm font-medium text-slate-400">Total:</span>
                          <span
                            class="inline-block w-1/2 pr-6 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {{ invoice.montos.mto_total_cp }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Product Table Ends -->

                <p class="py-2 text-center text-sm">Gracias por su compra</p>
              </div>
            </div>
            <!-- Sección: Auditoría -->
            <div class="bg-white rounded-lg col-start-3 xl:col-start-3 shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Auditoría</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Usuario de Registro:</p>
                  <p class="text-gray-800">{{ invoice.auditoria.cod_usu_regis }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Fecha de Registro:</p>
                  <p class="text-gray-800">{{ invoice.auditoria.fec_regis }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Usuario de Modificación:</p>
                  <p class="text-gray-800">{{ invoice.auditoria.cod_usu_modif }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Fecha de Modificación:</p>
                  <p class="text-gray-800">{{ invoice.auditoria.fec_modif }}</p>
                </div>
              </div>
            </div>

          </div>
          <!-- Sección: Tipo de Cambio -->
          <div class="bg-white rounded-lg col-span-1 xl:row-span-1 xl:row-start-1 xl:col-start-3 shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Tipo de Cambio</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Moneda Extranjera:</p>
                <p class="text-gray-800">{{ invoice.tipo_cambio.mto_cambio_moneda_extranjera }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Dólares:</p>
                <p class="text-gray-800">{{ invoice.tipo_cambio.mto_cambio_moneda_dolares }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Tipo de Cambio:</p>
                <p class="text-gray-800">{{ invoice.tipo_cambio.mto_tipo_cambio }}</p>
              </div>
            </div>
            <br>
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Montos</h2>
            <div class="grid grid-cols-1 xl:grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-700">Base Imponible:</p>
              </div>
              <div class="text-right">
                <p class="text-gray-800">{{ invoice.montos.mto_bi_gravada_dg }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">IGV:</p>
              </div>
              <div class="text-right">
                <p class="text-gray-800">{{ invoice.montos.mto_igv_ipm_dg }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Total:</p>
              </div>
              <div class="text-right">
                <p class="text-gray-800">{{ invoice.montos.mto_total_cp }}</p>
              </div>

            </div>
            <br>
            <!-- Sección: Documento de Referencia -->
            <div v-if="invoice.documentos_modificados[0]">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Documento de Referencia</h2>
              <div class="grid grid-cols-1 xl:grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Tipo de documento:</p>
                </div>
                <div>
                  <p class="text-gray-800">{{ invoice.documentos_modificados[0].cod_documento }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Seriey Numero:</p>
                </div>
                <div>
                  <p class="text-gray-800">{{ invoice.documentos_modificados[0].num_serie }} - {{
                    invoice.documentos_modificados[0].num_documento }}</p>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-500">Fecha de documento:</p>
                </div>
                <div>
                  <p class="text-gray-800">{{ invoice.documentos_modificados[0].fec_emision_mod }}</p>
                </div>
              </div>
            </div>


          </div>
          <!-- Sección: Imprimir -->
          <div class="sticky top-20 col-span-1 h-max">
            <div class="bg-white p-4 border border-gray-100 rounded-lg card-body  flex flex-col gap-4">
              <div class="bg-white p-4 border border-gray-100 rounded-lg card-body  flex flex-col gap-4">
                <button
                  class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
                  focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex me-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.125rem" height="1.125rem" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="w-3.5 h-3.5 me-2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send Invoice
                </button>
                <button
                  class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none
                focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex me-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.125rem" height="1.125rem" viewBox="0 0 18 21"
                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="w-3.5 h-3.5 me-2">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Add Payment
                </button>
                <div class="flex items-center gap-4 xl:flex-col 2xl:flex-row">
                  <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center
                    me-2 dark:bg-blue-600 dark:hover:bg-blue-700 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.125rem" height="1.125rem" viewBox="0 0 18 21"
                      fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" stroke-linecap="round"
                      stroke-linejoin="round" class="w-3.5 h-3.5 me-2">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Imprimir
                  </button>
                  <button
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.125rem" height="1.125rem" viewBox="0 0 18 21"
                      fill="none" stroke="currentColor" aria-hidden="true" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" class="w-3.5 h-3.5 me-2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>Descargar</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <div
                class="flex flex-col w-full max-w-[326px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                  <span class="text-sm font-semibold text-gray-900 dark:text-white">Factura Electronica</span>
                  <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                </div>
                <div v-if="rutasArchivos" class="flex items-start my-2.5 bg-gray-50 dark:bg-gray-600 rounded-xl p-2">
                  <div class="me-2">
                    <span class="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white pb-2">
                      <img src="../../images/svg/formato-de-archivo-zip.png" class="w-8 h-8 shrink-0" alt="">
                      <!-- <svg fill="none" aria-hidden="true" class="w-5 h-5 shrink-0" viewBox="0 0 20 21">
                        <g clip-path="url(#clip0_3173_1381)">
                          <path fill="#E2E5E7"
                            d="M5.024.5c-.688 0-1.25.563-1.25 1.25v17.5c0 .688.562 1.25 1.25 1.25h12.5c.687 0 1.25-.563 1.25-1.25V5.5l-5-5h-8.75z" />
                          <path fill="#B0B7BD" d="M15.024 5.5h3.75l-5-5v3.75c0 .688.562 1.25 1.25 1.25z" />
                          <path fill="#CAD1D8" d="M18.774 9.25l-3.75-3.75h3.75v3.75z" />
                          <path fill="#F15642"
                            d="M16.274 16.75a.627.627 0 01-.625.625H1.899a.627.627 0 01-.625-.625V10.5c0-.344.281-.625.625-.625h13.75c.344 0 .625.281.625.625v6.25z" />
                          <path fill="#fff"
                            d="M3.998 12.342c0-.165.13-.345.34-.345h1.154c.65 0 1.235.435 1.235 1.269 0 .79-.585 1.23-1.235 1.23h-.834v.66c0 .22-.14.344-.32.344a.337.337 0 01-.34-.344v-2.814zm.66.284v1.245h.834c.335 0 .6-.295.6-.605 0-.35-.265-.64-.6-.64h-.834zM7.706 15.5c-.165 0-.345-.09-.345-.31v-2.838c0-.18.18-.31.345-.31H8.85c2.284 0 2.234 3.458.045 3.458h-1.19zm.315-2.848v2.239h.83c1.349 0 1.409-2.24 0-2.24h-.83zM11.894 13.486h1.274c.18 0 .36.18.36.355 0 .165-.18.3-.36.3h-1.274v1.049c0 .175-.124.31-.3.31-.22 0-.354-.135-.354-.31v-2.839c0-.18.135-.31.355-.31h1.754c.22 0 .35.13.35.31 0 .16-.13.34-.35.34h-1.455v.795z" />
                          <path fill="#CAD1D8"
                            d="M15.649 17.375H3.774V18h11.875a.627.627 0 00.625-.625v-.625a.627.627 0 01-.625.625z" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3173_1381">
                            <path fill="#fff" d="M0 0h20v20H0z" transform="translate(0 .5)" />
                          </clipPath>
                        </defs>
                      </svg> -->
                      {{ rutasArchivos.nombre_archivo }}
                    </span>
                    <span class="flex text-xs font-normal text-gray-500 dark:text-gray-400 gap-2">
                      1 Archivo
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="self-center" width="3"
                        height="4" viewBox="0 0 3 4" fill="none">
                        <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                      </svg>
                      {{ (Number(rutasArchivos.peso_archivo) / 1024).toFixed(2) }} KB
                      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="self-center" width="3"
                        height="4" viewBox="0 0 3 4" fill="none">
                        <circle cx="1.5" cy="2" r="1.5" fill="#6B7280" />
                      </svg>
                      {{ dataZip }}
                    </span>
                  </div>
                  <div class="inline-flex self-center items-center">
                    <button
                      class="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500 dark:focus:ring-gray-600"
                      type="button">
                      <svg class="w-4 h-4 text-gray-900 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M14.707 7.793a1 1 0 0 0-1.414 0L11 10.086V1.5a1 1 0 0 0-2 0v8.586L6.707 7.793a1 1 0 1 0-1.414 1.414l4 4a1 1 0 0 0 1.416 0l4-4a1 1 0 0 0-.002-1.414Z" />
                        <path
                          d="M18 12h-2.55l-2.975 2.975a3.5 3.5 0 0 1-4.95 0L4.55 12H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Zm-3 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Guardado</span>
              </div>
            </div>
            <GuiaRemisionZip v-if="!isLoading" :compraId="compraId" :defaultNumRuc="invoiceRuc.num_ruc"
              :codcar="invoice.cod_car" />

          </div>


          <!-- Mostrar los datos del XML -->
          <div v-if="datosXMLParseados"
            class="bg-white rounded-lg shadow-md p-6 mb-6 col-span-1 xl:col-span-2 col-start-1 xl:col-start-1 row-start-6 xl:row-start-6 row-span-2">
            <h2 class="text-xl font-semibold mb-4">Guia de Remision</h2>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-600">ID:</span>
              <span class="text-green-600 font-bold">{{ datosXMLParseados.TypeCode || 'N/A' }} - {{ datosXMLParseados.ID
                || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-600">Fecha y hora de emisión:</span>
              <span class="text-blue-600 font-bold">{{ datosXMLParseados.IssueDate || 'N/A' }} {{
                datosXMLParseados.IssueTime || 'N/A' }}</span>
            </div>
            <span class="font-bold text-gray-900">Motivo de traslado: </span>
            <span v-if="datosXMLParseados.Shipment.handlingCode === '01'" class="font-medium text-gray-600">Venta</span>
            <span v-if="datosXMLParseados.Shipment.handlingCode === '02'"
              class="font-medium text-gray-600">Compra</span>
            <span v-if="datosXMLParseados.Shipment.handlingCode === '14'" class="font-medium text-gray-600">VENTA SUJETA
              A CONFIRMACION DEL COMPRADOR</span>
            <span v-if="datosXMLParseados.Shipment.handlingCode === '08'"
              class="font-medium text-gray-600">Importacion</span>
            <span v-if="datosXMLParseados.Shipment.handlingCode === '09'"
              class="font-medium text-gray-600">Exportacion</span>
            <span v-if="datosXMLParseados.Shipment.handlingCode === '13'" class="font-medium text-gray-600">Otros</span>

            <div class="flex items-center justify-between">
              <span class="font-bold text-gray-900">Fecha de entrega de bienes al transportista: </span>
              <span class="font-bold text-gray-900">{{
                datosXMLParseados.ShipmentStage.StartDate || 'N/A' }}</span>
            </div>
            <br>
            <span class="font-bold text-gray-900">Punto de partida: </span>
            <span class="font-medium text-sm text-gray-600">{{ datosXMLParseados.Delivery.DespatchAddressU }} {{
              datosXMLParseados.Delivery.DespatchAddressD }}</span>
            <div class="flex items-center justify-between">
            </div>
            <br>
            <span class="font-bold text-gray-900">Punto de llegada: </span>
            <span class="font-medium text-sm text-gray-600">{{ datosXMLParseados.Delivery.DeliveryAddressU }} {{
              datosXMLParseados.Delivery.DeliveryAddressD }}</span>
            <br>
            <span class="font-bold text-gray-900">Bienes por transportar: </span>
            <br>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg scroll-smooth">
              <table class="w-full border-collapse text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" class="px-6 py-3">ID</th>
                    <th scope="col" class="px-6 py-3">Codigo</th>
                    <th scope="col" class="px-6 py-3 w-1.5">Nombre</th>
                    <th scope="col" class="px-6 py-3">Cantidad</th>
                    <th scope="col" class="px-6 py-3">Unidad Medida</th>

                  </tr>
                </thead>
                <tbody v-if="facturaXMLParseados">
                  <tr v-for="(producto, index) in datosXMLParseados.Productos" :key="index"
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                    <td class="px-6 py-4 whitespace-nowrap text-xs">{{ index + 1 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-xs">{{ producto.Ideide }}</td>
                    <td class="px-6 py-4 whitespace-normal w-3/4  text-xs ">{{ producto.Nombre }}</td>
                    <td class="px-6 py-4 text-right whitespace-nowrap text-xs">{{ (producto.Cantidad *
                      1).toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap text-xs">{{ producto.unitCode }} </td>

                  </tr>
                </tbody>
              </table>
            </div>

            <br>
            <div className="grid grid-cols-3 grid-rows-5 gap-4">
              <div class="col-span-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-800">Unidad de medida del peso bruto: </span>
                  <span class="font-medium text-gray-600">{{
                    datosXMLParseados.Shipment.unitCode }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-800">Peso bruto total de la carga: </span>
                  <span class="font-medium text-right text-gray-600">{{ datosXMLParseados.Shipment.grossWeightMeasure
                  }}</span>
                </div>
              </div>
              <div></div>
              <div>
                <span class="font-bold text-gray-900">Datos del traslado:</span>
                <div class="flex items-center justify-between">
                  <span v-if="datosXMLParseados.ShipmentStage.TransportModeCode === '01'"
                    class="text-red-600 font-medium">Modalidad de traslado: <strong>Publico</strong> </span>
                  <span v-if="datosXMLParseados.ShipmentStage.TransportModeCode === '02'"
                    class="text-green-700 font-medium">Modalidad de traslado: <strong>Privado</strong> </span>
                </div>
              </div>
              <div></div>
              <div></div>
              <div class="col-span-2">
                <!-- Datos de los vehiculos -->
                <span class="font-bold text-gray-900">Datos de los vehiculos:</span>
                <div v-if="datosXMLParseados.TransportHandlingUnit.TransportEquipment !== 'N/A'"
                  class="flex items-center justify-between">
                  <span class="font-medium text-gray-600">Principal: </span>
                  <span v-if="datosXMLParseados.TransportHandlingUnit.TransportEquipment !== 'N/A'"
                    class="text-gray-600 font-medium">Numero de placa: {{
                      datosXMLParseados.TransportHandlingUnit.TransportEquipment ||
                      'N/A' }}</span>
                </div>
                <div v-if="datosXMLParseados.TransportHandlingUnit.RegistrationNationalityID !== 'N/A'"
                  class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Numero de TUCE o CHV: {{
                    datosXMLParseados.TransportHandlingUnit.RegistrationNationalityID
                    || 'N/A' }}</span>
                </div>
              </div>
              <div></div>
              <div class="col-span-2">
                <span class="font-bold text-gray-900">Datos de
                  los Conductores:</span>
                <div v-if="datosXMLParseados.ShipmentStage.DriverJobTitle !== 'N/A'"
                  class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">{{ datosXMLParseados.ShipmentStage.DriverJobTitle || 'N/A'
                    }}:
                  </span>
                  <span class="text-gray-600 font-medium">{{ datosXMLParseados.ShipmentStage.DriverFirstName
                    || 'N/A'
                    }} {{ datosXMLParseados.ShipmentStage.DriverPerson || 'N/A' }}
                  </span>
                </div>
                <div v-if="datosXMLParseados.ShipmentStage.Driverid !== 'N/A'"
                  class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">Número de licencia de conducir: </span>
                  <span class="text-gray-600 font-medium">{{
                    datosXMLParseados.ShipmentStage.Driverid || 'N/A' }}</span>
                </div>
              </div>
              <div v-if="datosXMLParseados.ShipmentStage.CarrierPartyName !== 'N/A'" class="col-span-2">
                <span class="font-bold text-gray-900">Datos
                  del
                  Transportista:</span>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 font-medium">{{
                    datosXMLParseados.ShipmentStage.CarrierPartyName ||
                    'N/A' }} {{
                      datosXMLParseados.ShipmentStage.CarrierPartyCod ||
                      'N/A' }}</span>
                </div>
              </div>

            </div>

            <!-- Contenedor para los datos del TRANSPORTISTA -->


            <div class="flex items-center justify-between">
            </div>
            <span class="font-bold text-gray-900">Observaciones: </span>
            <div class="flex items-center justify-between">
              <span class="text-gray-600 font-medium">{{
                datosXMLParseados.NoteData ||
                'N/A' }}</span>
            </div>
          </div>

        </div>
        <!-- Invoice Details Ends -->
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import GuiaRemisionZip from '../Forms/GuiaRemision.vue';
import JSZip from 'jszip';
// Supongamos que tienes el ID de la compra y los detalles de la factura disponibles en este componente
// Variables reactivas
// Obtener el ID de la compra desde los parámetros de la ruta
const route = useRoute();
const rutasArchivos = ref([]); // Rutas de los archivos ZIP
const datosXMLParseados = ref(null); // Datos parseados del XML
const facturaXMLParseados = ref(null); // Factura parseados del XML
const compraId = ref(null); // ID de la compra
const invoiceRuc = ref({
  num_ruc: '', // RUC de la factura
});
const isLoading = ref(true); // Estado de carga
const invoice = ref(null);
const rutaXml = ref(null); // Ruta del archivo XML
const dataZip = ref(null); //
// Función para cargar los datos de la compra desde la API
async function cargarCompra() {
  try {
    isLoading.value = true;

    const id = route.params.id; // Obtener el ID de la ruta
    if (!id) throw new Error('ID de compra no proporcionado');

    const response = await axios.get(`http://127.0.0.1:8000/compras/${id}`);
    // Validar respuesta
    if (!response.data) throw new Error('Datos de compra no recibidos');
    console.log('Detalles de la compra:', response.data); // Imprimir los detalles de la compra en consola

    invoice.value = response.data; // Asignar los datos de la compra
    // Asignar los datos obtenidos a las variables reactivas
    compraId.value = response.data.id; // ID de la compra
    invoiceRuc.value.num_ruc = response.data.num_doc_identidad_proveedor; // RUC de la factura
  } catch (error) {
    console.error('Error al cargar los detalles de la compra:', error.message);
    invoice.value = null; // Limpiar los datos en caso de error
  } finally {
    isLoading.value = false; // Finalizar la carga
  }
}

// Función para obtener las rutas de los archivos ZIP
async function obtenerRutasArchivos() {
  try {
    const compraId = route.params.id; // ID de la compra (ajusta según tu lógica)

    // Realizar la solicitud GET para obtener las rutas de los archivos
    const response = await axios.get(`http://127.0.0.1:8000/api/guia-remision/porcompra/${compraId}/rutas`);

    // Guardar las rutas de los archivos
    rutasArchivos.value = response.data.rutas_archivos;


    console.log('Rutas de los archivos:', rutasArchivos.value);
    console.log(response.data.rutas_archivos.length);
    for (let i = 0; i < response.data.rutas_archivos.length; i++) {
      console.log(response.data.rutas_archivos[0]);
      rutaXml.value = response.data.rutas_archivos[0];

      rutaXml.value = rutaXml.value.replace("http://localhost", "")
      console.log("Ruta actual " + rutaXml.value);
      leerContenidoArchivo(rutaXml.value);

      /* parsearXML(rutaXml.value); */
    }
  } catch (error) {
    console.error('Error al obtener las rutas de los archivos:', error.response?.data || error.message);
    alert('Ocurrió un error al obtener las rutas de los archivos de Guias de Remision.');
  }
}
// Función para leer el contenido de un archivo ZIP y extraer el XML
async function leerContenidoArchivo(url) {
  try {
    // Realizar una solicitud GET para leer el archivo ZIP
    const response = await axios.get(url, { responseType: 'text' });
    // Leer el contenido del archivo XML
    const xmlContent = response.data;

    // Parsear el XML usando DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');
    // Obtener el namespace URI para los prefijos "cac" y "cbc"
    const cacNamespace = 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2';
    const cbcNamespace = 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2';
    // Acceder al elemento cac:Shipment
    const shipment = xmlDoc.getElementsByTagNameNS(cacNamespace, 'Shipment')[0];
    if (!shipment) {
      throw new Error('No se encontró el elemento cac:Shipment en el XML.');
    }
    // Extraer los datos principales de cac:Shipment
    const shipmentData = {
      id: shipment.querySelector(`ID`)?.textContent || 'N/A',
      handlingCode: shipment.querySelector(`HandlingCode`)?.textContent || 'N/A',
      handlingInstructions: shipment.querySelector(`HandlingInstructions`)?.textContent || 'N/A',
      grossWeightMeasure: shipment.querySelector(`GrossWeightMeasure`)?.textContent || 'N/A',
      unitCode: shipment.querySelector(`GrossWeightMeasure`)?.getAttribute(`unitCode`) || 'N/A',
      specialInstructions: shipment.querySelector(`SpecialInstructions`)?.textContent || 'N/A',
    };
    // Extraer datos de los conductores
    const shipmentStage = shipment.getElementsByTagNameNS(cacNamespace, 'ShipmentStage')[0];
    const transportModeCodes = shipmentStage?.querySelector('TransportModeCode')?.textContent || 'N/A';
    const transportModeCode = transportModeCodes.trim();
    console.log(transportModeCode);
    const startDate = shipmentStage?.querySelector(`TransitPeriod > StartDate`)?.textContent || 'N/A';
    const driverPerson = shipmentStage?.querySelector(`DriverPerson > ID`)?.textContent || 'N/A';
    const driverFirstName = shipmentStage?.querySelector(`DriverPerson > FirstName`)?.textContent || 'N/A';
    const driverJobTitle = shipmentStage?.querySelector(`DriverPerson > JobTitle`)?.textContent || 'N/A';
    const driverid = shipmentStage?.querySelector(`DriverPerson > IdentityDocumentReference > ID`)?.textContent || 'N/A';

    // Extraer datos de Direccion de Traslado
    const Delivery = shipment.getElementsByTagNameNS(cacNamespace, 'Delivery')[0];
    const deliveryAddressU = Delivery?.querySelector('DeliveryAddress > ID')?.textContent || 'N/A';
    const deliveryAddressD = Delivery?.querySelector('DeliveryAddress > AddressLine > Line')?.textContent || 'N/A';
    const despatchAddressU = Delivery?.querySelector('Despatch > DespatchAddress > ID')?.textContent || 'N/A';
    const despatchAddressD = Delivery?.querySelector('Despatch > DespatchAddress > AddressLine > Line')?.textContent || 'N/A';

    //Extraer datos del Transportista
    const carrierPartyCod = shipmentStage?.querySelector(`CarrierParty > PartyIdentification > ID`)?.textContent || 'N/A';
    const carrierPartyName = shipmentStage?.querySelector(`CarrierParty > PartyLegalEntity > RegistrationName`)?.textContent || 'N/A';

    // Extraer datos de cac:TransportHandlingUnit
    const TransportHandlingUnit = shipment.getElementsByTagNameNS(cacNamespace, 'TransportHandlingUnit')[0];
    const transportEquipment = TransportHandlingUnit?.querySelector('TransportEquipment > ID')?.textContent || 'N/A';
    const registrationNationalityID = TransportHandlingUnit?.querySelector('TransportEquipment > ApplicableTransportMeans > RegistrationNationalityID')?.textContent || 'N/A';

    // Extraer los datos del XML
    const id = xmlDoc.querySelector('ID')?.textContent || 'N/A';
    const issueDate = xmlDoc.querySelector('IssueDate')?.textContent || 'N/A';
    const issueTime = xmlDoc.querySelector('IssueTime')?.textContent || 'N/A';
    const noteData = xmlDoc.querySelector('Note')?.textContent || 'N/A';
    const typeCode = xmlDoc.querySelector('DespatchAdviceTypeCode')?.textContent || 'N/A';

    console.log(typeCode)
    // Extraer los productos
    const despatchLines = xmlDoc.getElementsByTagNameNS(cacNamespace, 'DespatchLine');
    const productos = Array.from(despatchLines).map((line) => {
      const item = line.getElementsByTagNameNS(cacNamespace, 'Item')[0];
      const Nombre = item?.getElementsByTagNameNS(cbcNamespace, 'Description')[0].textContent || 'Sin descripción';
      const Identification = item?.getElementsByTagNameNS(cacNamespace, 'SellersItemIdentification')[0];
      const Ideide = Identification?.getElementsByTagNameNS(cbcNamespace, 'ID')[0].textContent || 'Sin descripción';;
      const Cantidad = line.getElementsByTagNameNS(cbcNamespace, 'DeliveredQuantity')[0].textContent;
      // Obtener el elemento cbc:DeliveredQuantity
      const deliveredQuantityElement = line.getElementsByTagNameNS(cbcNamespace, 'DeliveredQuantity')[0];
      // Obtener los atributos de cbc:DeliveredQuantity
      const unitCode = deliveredQuantityElement?.getAttribute('unitCode') || 'N/A';
      console.log(unitCode)

      return { Nombre, Ideide, Cantidad, unitCode };
    });


    // Acceder al elemento cbc:DeliveredQuantity usando getElementsByTagNameNS
    const deliveredQuantities = xmlDoc.getElementsByTagNameNS(cbcNamespace, 'DeliveredQuantity');
    const datosDeliveredQuantity = Array.from(deliveredQuantities).map((element) => {
      // Obtener los atributos del elemento
      const unitCode = element.getAttribute('unitCode') || 'N/A';
      const unitCodeListAgencyName = element.getAttribute('unitCodeListAgencyName') || 'N/A';
      const unitCodeListID = element.getAttribute('unitCodeListID') || 'N/A';
      const quantityValue = element.textContent || '0';

      return {
        unitCode,
        unitCodeListAgencyName,
        unitCodeListID,
        quantityValue,
      };
    });
    // Guardar los datos parseados
    datosXMLParseados.value = {
      ID: id,
      TypeCode: typeCode,
      IssueDate: issueDate,
      IssueTime: issueTime,
      NoteData: noteData,
      Productos: productos,
      DatosDeliveredQuantity: datosDeliveredQuantity,
      Shipment: shipmentData,
      ShipmentStage: {
        TransportModeCode: transportModeCode,
        StartDate: startDate,
        DriverPerson: driverPerson,
        DriverFirstName: driverFirstName,
        DriverJobTitle: driverJobTitle,
        Driverid: driverid,
        CarrierPartyCod: carrierPartyCod,
        CarrierPartyName: carrierPartyName,
      },
      TransportHandlingUnit: {
        TransportEquipment: transportEquipment,
        RegistrationNationalityID: registrationNationalityID,
      },
      Delivery: {
        DespatchAddressU: despatchAddressU,
        DespatchAddressD: despatchAddressD,
        DeliveryAddressU: deliveryAddressU,
        DeliveryAddressD: deliveryAddressD,
      }
    };
  } catch (error) {
    console.error('Error al leer el contenido del archivo:', error.message);
    alert('Ocurrió un error al leer el contenido del archivo.');
  }
}

async function obtenerRutasArchivosXml() {
  try {
    const compraId = route.params.id; // ID de la compra (ajusta según tu lógica)

    // Realizar la solicitud GET para obtener las rutas de los archivos
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/facturas-zips/porcompra/${compraId}/ruta`);

    // Guardar las rutas de los archivos
    rutasArchivos.value = response.data;
    console.log('Rutas de los archivos:', rutasArchivos.value);
    dataZip.value = computed(() => response.data.extension.toUpperCase());


    rutaXml.value = response.data.ruta_archivo;
    rutaXml.value = rutaXml.value.replace("http://localhost", "")
    console.log("Ruta actual " + rutaXml.value);
    leerContenidoArchivoXml(rutaXml.value);


    /* for (let i = 0; i < response.data.length; i++) {
    } */
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error('El archivo no existe en la URL proporcionada.');
      throw new Error('El archivo no existe.');
    } else {
      console.error('Error en RUTAS XML de facturas.:', error.response?.data || error.message);
      alert('Ocurrió un error al obtener las RUTAS de los archivos XML de facturas.');
    }

  }
}
async function leerContenidoArchivoXml(urlxml) {
  console.log("Ruta XML" & urlxml);
  try {
    // Realizar una solicitud GET para leer el archivo ZIP
    const response = await axios.get(urlxml, { responseType: 'arraybuffer' });

    // Usar JSZip para extraer el contenido del archivo ZIP
    const zip = new JSZip();
    const zipData = await zip.loadAsync(response.data);
    // Extraer el archivo XML del ZIP
    /* const xmlFile = Object.keys(zipData.files).find((fileName) => fileName.endsWith('.xml'));
    if (!xmlFile) {
      throw new Error('No se encontró un archivo XML en el ZIP.');
    } */
    // Filtrar XMLs que NO empiecen con "r" (case-insensitive)
    const xmlFiles = Object.keys(zipData.files).filter(fileName =>
      fileName.toLowerCase().endsWith('.xml') &&
      !fileName.toLowerCase().startsWith('r') // Ignorar mayúsculas
    );
    if (xmlFiles.length === 0) {
      throw new Error('No se encontró un XML válido (sin comenzar con "r")');
    }
    // Seleccionar el primer XML válido
    const xmlFile = xmlFiles[0];

    // Leer el contenido del archivo XML
    const xmlContent = await zipData.file(xmlFile).async('text');

    // Parsear el XML usando DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'application/xml');

    // Obtener el namespace URI para los prefijos "cac" y "cbc"
    const cacNamespace = 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2';
    const cbcNamespace = 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2';

    const id = xmlDoc.querySelector('ID')?.textContent || 'N/A';
    const noteMoneda = xmlDoc.querySelector('Note')?.textContent || 'N/A';

    console.log(xmlDoc);
    // Acceder al elemento cac:Shipment
    const paymentTerms = xmlDoc.getElementsByTagNameNS(cacNamespace, 'PaymentTerms')[0];
    if (!paymentTerms) {
      throw new Error('No se encontró el elemento cac:paymentTerms en el XML.' + paymentTerms);
    }
    // Extraer los datos principales de cac:paymentTerms
    const paymentTermsData = {
      id: paymentTerms.querySelector(`ID`)?.textContent || 'N/A',
      paymentMeansID: paymentTerms.querySelector(`PaymentMeansID`)?.textContent || 'N/A',
    };

    const accountingSupplierParty = xmlDoc.getElementsByTagNameNS(cacNamespace, 'AccountingSupplierParty')[0];
    const addressLine = {
      CityName: accountingSupplierParty.querySelector(`Party > PartyLegalEntity > RegistrationAddress > CityName`)?.textContent || 'N/A',
      CountrySubentity: accountingSupplierParty.querySelector(`Party > PartyLegalEntity > RegistrationAddress > CountrySubentity`)?.textContent || 'N/A',
      District: accountingSupplierParty.querySelector(`Party > PartyLegalEntity > RegistrationAddress > District`)?.textContent || 'N/A',
      Direccion: accountingSupplierParty.querySelector(`Party > PartyLegalEntity > RegistrationAddress > AddressLine > Line`)?.textContent || 'N/A',
      AddressTypeCode: accountingSupplierParty.querySelector(`Party > PartyLegalEntity > RegistrationAddress > AddressTypeCode`)?.textContent || 'N/A',

    }

    const accountingCustomerParty = xmlDoc.getElementsByTagNameNS(cacNamespace, 'AccountingCustomerParty')[0];
    const partyLegalEntity = {
      Direccion: accountingCustomerParty.querySelector(`Party > PartyLegalEntity > RegistrationAddress > AddressLine > Line`)?.textContent || 'N/A',
    }

    console.log(addressLine)

    // Extraer los datos principales de cac:paymentTerms
    const invoiceLine = xmlDoc.getElementsByTagNameNS(cacNamespace, 'InvoiceLine');
    const prodFac = Array.from(invoiceLine).map((line) => {
      const item = line.getElementsByTagNameNS(cacNamespace, 'Item')[0];
      const Nombre = item?.getElementsByTagNameNS(cbcNamespace, 'Description')[0].textContent || 'Sin descripción';
      const Identification = item?.getElementsByTagNameNS(cacNamespace, 'SellersItemIdentification')[0];
      const Ideide = Identification?.getElementsByTagNameNS(cbcNamespace, 'ID')[0].textContent || '-';;

      const Precio = line.getElementsByTagNameNS(cacNamespace, 'Price')[0];
      const PriceAmount = Precio?.getElementsByTagNameNS(cbcNamespace, 'PriceAmount')[0].textContent || 'Sin descripción';

      const Cantidad = line.getElementsByTagNameNS(cbcNamespace, 'InvoicedQuantity')[0].textContent;

      const ValorTotal = line.getElementsByTagNameNS(cbcNamespace, 'LineExtensionAmount')[0].textContent;
      // Obtener elemetnot de Unidades
      const deliveredQuantityElement = line.getElementsByTagNameNS(cbcNamespace, 'InvoicedQuantity')[0];
      const unitCode = deliveredQuantityElement?.getAttribute('unitCode') || 'N/A';
      console.log(unitCode)

      return { Nombre, Ideide, Cantidad, unitCode, PriceAmount, ValorTotal };
    });


    // Guardar los datos parseados
    facturaXMLParseados.value = {
      Id: id,
      NoteMoneda: noteMoneda,
      AddressLine: addressLine,
      PaymentTerms: paymentTermsData,
      PartyLegalEntity: partyLegalEntity,
      ProdFac: prodFac
    };
    console.log(facturaXMLParseados.value);
  } catch (error) {
    console.error('Error al LEER el contenido del archivo XML:', error.message);
    alert('Ocurrió un error al LEER el contenido del archivo XML.');
  }
}
// Cargar los datos cuando el componente se monta
onMounted(() => {
  cargarCompra();
  obtenerRutasArchivos();
  obtenerRutasArchivosXml();

});

// Función para volver a la lista de compras

</script>
