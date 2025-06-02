import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import api from '@/api/axios'

interface Empresa {
  id: string
  ruc: string
  cliente_id: string
  cliente_secret: string
  usuario_sol: string
  clave_sol: string
  [key: string]: any
}

interface Paginacion {
  totalRegistros: number
  [key: string]: any
}

interface DatosComprasVentas {
  paginacion: Paginacion
  [key: string]: any
}

interface TokenResponse {
  access_token: string
  expires_in: number
  [key: string]: any
}

interface Consulta {
  funcion: (periodo?: string) => Promise<any>
  nombre: string
}

function obtenerPerPeriodo(): string {
  // Ejemplo: "202310" para octubre de 2023 // return moment().format('YYYYMM')
  /* return '202504' // Ejemplo: "202310" para octubre de 2023 */
  return dayjs().format('YYYYMM') // Usando dayjs para formatear la fecha actual
}

// Configuración de Axios para la API de seguridad de SUNAT
const authApi: AxiosInstance = axios.create({
  baseURL: '/sunat-auth/v1/clientessol',
})

const sunatApi: AxiosInstance = axios.create({
  baseURL: '/sunat-api/v1/contribuyente/migeigv/libros', // URL base de la API de seguridad
})

// Función para obtener los datos de la empresa
async function obtenerDatosEmpresa(): Promise<Empresa> {
  try {
    const idString: string | null = localStorage.getItem('empresaId')
    console.log('ID:', idString)

    if (!idString) {
      throw new Error('No se encontró el ID de la empresa en localStorage')
    }

    const response: AxiosResponse<Empresa> = await api.get(`/empresas-datos/${idString}`)
    /* console.log(response.data) */

    if (response.data && response.data.data.ruc) {
      return response.data.data // Retorna la primera empresa del array
    }
    throw new Error('No se encontraron datos de la empresa')
  } catch (error) {
    console.error('Error al obtener los datos de la empresa:', error)
    throw error
  }
}

// Función para guardar el token en localStorage
function guardarToken(token: string, duracionSegundos: number): void {
  const ahora: number = Date.now()
  const expiracion: number = ahora + duracionSegundos * 1000 // Convertir segundos a milisegundos

  localStorage.setItem('authToken', token)
  localStorage.setItem('tokenExpiracion', expiracion.toString())
}

// Función para obtener el token desde localStorage
function obtenerTokenAlmacenado(): string | null {
  const token: string | null = localStorage.getItem('authToken')
  const expiracion: string | null = localStorage.getItem('tokenExpiracion')

  if (!token || !expiracion) {
    return null // No hay token almacenado
  }

  const ahora: number = Date.now()
  if (ahora < parseInt(expiracion)) {
    return token // Token aún es válido
  }

  // Token ha expirado
  localStorage.removeItem('authToken')
  localStorage.removeItem('tokenExpiracion')
  return null
}

// Función para obtener el token de autenticación
async function obtenerToken(): Promise<string> {
  const tokenAlmacenado: string | null = obtenerTokenAlmacenado()
  if (tokenAlmacenado) {
    console.log('Reutilizando token almacenado.')
    return tokenAlmacenado
  }

  try {
    // Obtener los datos de la empresa
    const empresa: Empresa = await obtenerDatosEmpresa()

    // Construir la URL de autenticación
    const authUrl: string = `/${empresa.cliente_id}/oauth2/token/`

    // Datos para el cuerpo de la solicitud
    const body: URLSearchParams = new URLSearchParams()
    body.append('grant_type', 'password')
    body.append('scope', 'https://api-sire.sunat.gob.pe')
    body.append('client_id', empresa.cliente_id)
    body.append('client_secret', empresa.cliente_secret)
    body.append('username', `${empresa.ruc}${empresa.usuario_sol}`)
    body.append('password', empresa.clave_sol)

    // Hacer la solicitud POST para obtener el token
    const response: AxiosResponse<TokenResponse> = await authApi.post(authUrl, body, {
      headers: {
        Referer: 'sunat.gob.pe',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
      },
    })

    const token: string = response.data.access_token
    const duracionSegundos: number = response.data.expires_in || 28800 // Duración por defecto: 28800 segundos (8 horas)
    guardarToken(token, duracionSegundos)

    return token // Retorna el token de acceso
  } catch (error) {
    console.error('Error al obtener el token:', error)
    throw error
  }
}

// Función para obtener datos de compras
export async function obtenerCompras(periodo?: string): Promise<void> {
  try {
    // Validar el formato de strMes
    function esFormatoValido(valor: any): valor is string {
      return typeof valor === 'string' && /^\d{6}$/.test(valor)
    }

    console.log('Periodo:', periodo)
    let strMes: string = periodo || ''
    if (!esFormatoValido(periodo)) {
      strMes = obtenerPerPeriodo()
    }
    console.log('Periodo:', strMes)

    const token: string = await obtenerToken()
    const { data: datosCompras }: { data: DatosComprasVentas } = await sunatApi.get(
      `/rce/propuesta/web/propuesta/${strMes}/busqueda`,
      {
        params: {
          codTipoOpe: 1,
          page: 1,
          perPage: 100,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    )

    // Enviar los datos al backend
    const totalRegistro: number = datosCompras.paginacion.totalRegistros
    console.log('Total de registros:', totalRegistro)
    await api.post('/compras', datosCompras)

    const totalRegistros: number = datosCompras.paginacion.totalRegistros
    const registrosPorPagina: number = 100
    const totalPaginas: number = Math.ceil(totalRegistros / registrosPorPagina)

    // Si hay más de una página, obtener las páginas restantes
    if (totalPaginas > 1) {
      for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        console.log(`Obteniendo página ${pagina} de ${totalPaginas}...`)

        const { data: datosPagina } = await sunatApi.get(
          `/rce/propuesta/web/propuesta/${strMes}/busqueda`,
          {
            params: {
              codTipoOpe: 1,
              page: pagina, // Página actual
              perPage: registrosPorPagina, // Registros por página
            },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        )
        const response = await api.post('/compras', datosPagina)
        console.log('Datos guardados en el backend:', response.data)
      }
    }
  } catch (error) {
    console.error('Error al obtener las compras:', error)
    throw error
  }
}

export async function obtenerVentas(periodo?: string): Promise<void> {
  try {
    const token: string = await obtenerToken() // Obtener el token (reutilizado o nuevo)
    // Obtener el periodo actual
    // Validar el formato de strMes
    function esFormatoValido(valor: any): valor is string {
      return typeof valor === 'string' && /^\d{6}$/.test(valor)
    }

    console.log('Periodo:', periodo)
    let strMes: string = periodo || ''
    if (!esFormatoValido(periodo)) {
      strMes = obtenerPerPeriodo()
    }

    const { data: datosVentas }: { data: DatosComprasVentas } = await sunatApi.get(
      `/rvie/propuesta/web/propuesta/${strMes}/comprobantes?codTipoOpe=1&mtoDesde=&mtoHasta=&fecEmisionIni=&fecEmisionFin=&numDocAdquiriente=&codCar=&codTipoCDP=&codInconsistencia=`,
      {
        params: {
          page: 1,
          perPage: 100,
        },
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      },
    )

    // Enviar los datos al backend
    const totalRegistros: number = datosVentas.paginacion.totalRegistros
    const registrosPorPagina: number = 100
    const totalPaginas: number = Math.ceil(totalRegistros / registrosPorPagina)

    const response = await api.post('/ventas', datosVentas)
    const resumenVentas = await api.get('/resumen-ventas/calcular')
    console.log('Datos guardados en el backend:', response.data)
    console.log('Datos guardados en el backend:', resumenVentas.data)

    // Si hay más de una página, obtener las páginas restantes
    if (totalPaginas > 1) {
      for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        console.log(`Obteniendo página ${pagina} de ${totalPaginas}...`)

        const { data: datosPagina } = await sunatApi.get(
          `/rvie/propuesta/web/propuesta/${strMes}/comprobantes?codTipoOpe=1&mtoDesde=&mtoHasta=&fecEmisionIni=&fecEmisionFin=&numDocAdquiriente=&codCar=&codTipoCDP=&codInconsistencia=`,
          {
            params: {
              page: pagina, // Página actual
              perPage: registrosPorPagina, // Registros por página
            },
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          },
        )
        const response = await api.post('/ventas', datosPagina)
        console.log('Datos guardados en el backend:', response.data)
        const resumenVentas = await api.get('/resumen-ventas/calcular')
        console.log('Datos guardados en el backend:', resumenVentas.data)
      }
    }
  } catch (error) {
    console.error('Error al obtener las compras:', error)
    throw error
  }
}

// Función para obtener los periodos
export async function fetchPeriodos(): Promise<any> {
  try {
    const token: string = await obtenerToken() // Obtener el token (reutilizado o nuevo)
    const { data: datosPeriodos } = await sunatApi.get(
      '/rvierce/padron/web/omisos/140000/periodos',
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          Accept: 'application/json', // Aceptar JSON como respuesta
          'Content-Type': 'application/json', // Aceptar JSON como cuerpo de la solicitud
        },
      },
    )

    // Enviar los datos al backend
    const totalRegistro = datosPeriodos
    console.log('Total de registros:', totalRegistro)

    const id: string | null = localStorage.getItem('empresaId')
    if (!id) {
      throw new Error('No se encontró el ID de la empresa en localStorage')
    }

    const response = await api.post(`/guardarperiodos/${id}`, datosPeriodos)
    console.log('Datos guardados en el backend:', response.data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`)
    } else {
      throw new Error('Ocurrió un error inesperado.')
    }
  }
}

export async function getReporteCumpRVE(): Promise<any> {
  try {
    const strMes: string = obtenerPerPeriodo()
    const token: string = await obtenerToken() // Obtener el token (reutilizado o nuevo)
    const { data: datosRepCumple } = await sunatApi.get(
      `/rvierce/cumplimiento/web/omisos/${strMes}/140000/consultaReporteCumplimiento`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          Accept: 'application/json', // Aceptar JSON como respuesta
          'Content-Type': 'application/json', // Aceptar JSON como cuerpo de la solicitud
        },
      },
    )

    // Enviar los datos al backend
    const totalRegistro = datosRepCumple
    console.log('Total de registros:', totalRegistro)

    /* Resumen */
    const response = await api.post(`/reportecumplimiento/resumen`, datosRepCumple)
    /* Detalle */
    await api.post(`/reportecumplimiento/detalleresumen`, datosRepCumple)

    console.log('Datos guardados en el backend:', response.data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`)
    } else {
      throw new Error('Ocurrió un error inesperado.')
    }
  }
}

export async function getReporteCumpRCE(): Promise<void> {
  try {
    const strMes: string = obtenerPerPeriodo()
    const token: string = await obtenerToken() // Obtener el token (reutilizado o nuevo)
    const { data: datosRepCumple } = await sunatApi.get(
      `/rvierce/cumplimiento/web/omisos/${strMes}/080000/consultaReporteCumplimiento`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Agregar el token al encabezado
          Accept: 'application/json', // Aceptar JSON como respuesta
          'Content-Type': 'application/json', // Aceptar JSON como cuerpo de la solicitud
        },
      },
    )

    // Enviar los datos al backend
    const totalRegistro = datosRepCumple
    console.log('Total de registros:', totalRegistro)

    /* Detalle Resumen */
    await api.post(`/reportecumplimiento/detalleresumen`, datosRepCumple)
    /* Resumen */
    await api.post(`/reportecumplimiento/resumen`, datosRepCumple)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`)
    } else {
      throw new Error('Ocurrió un error inesperado.')
    }
  }
}

export async function contribuyentesSunat(): Promise<void> {
  try {
    //const strMes: string = obtenerPerPeriodo()
    const token: string = await obtenerToken() // Obtener el token (reutilizado o nuevo)
    const { data: datosRepCumple } = await sunatApi.get(`/rvierce/padron/web/contribuyentes`, {
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado
        Accept: 'application/json', // Aceptar JSON como respuesta
        'Content-Type': 'application/json', // Aceptar JSON como cuerpo de la solicitud
      },
    })

    // Enviar los datos al backend
    const totalRegistro = datosRepCumple
    console.log('Total de registros:', totalRegistro)

    const id: string | null = localStorage.getItem('empresaId')
    if (!id) {
      throw new Error('No se encontró el ID de la empresa en localStorage')
    }
    /* Contribuyentes */
    await api.put(`empresas/${id}/datos`, datosRepCumple)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Error ${error.response?.status}: ${error.response?.data.message}`)
    } else {
      throw new Error('Ocurrió un error inesperado.')
    }
  }
}

// Función para manejar el ciclo de consultas
async function iniciarCicloConsultas(): Promise<void> {
  try {
    // Definir las funciones de consulta
    const consultas: Consulta[] = [
      { funcion: obtenerCompras, nombre: 'obtenerCompras' },
      { funcion: fetchPeriodos, nombre: 'fetchPeriodos' },
      { funcion: obtenerVentas, nombre: 'obtenerVentas' },
      { funcion: getReporteCumpRVE, nombre: 'getReporteCumpRVE' },
      { funcion: getReporteCumpRCE, nombre: 'getReporteCumpRCE' },
      { funcion: contribuyentesSunat, nombre: 'contribuyentesSunat' },
    ]

    const token: string = await obtenerToken()
    // Realizar 3 ciclos de consultas cada 20 minutos
    for (let i = 0; i < 3; i++) {
      setTimeout(
        async () => {
          console.log(`Iniciando ciclo ${i + 1} en:`, new Date())

          // Ejecutar todas las consultas en paralelo
          await Promise.all(
            consultas.map(async ({ funcion, nombre }) => {
              try {
                console.log(`Ejecutando ${nombre}...`)
                await funcion()
                console.log(`${nombre} completada.`)
              } catch (error) {
                console.error(
                  `Error en ${nombre}:`,
                  error instanceof Error ? error.message : 'Error desconocido',
                )
              }
            }),
          )

          console.log(`Ciclo ${i + 1} completado.`)
        },
        i * 20 * 60 * 1000,
      ) // 20 minutos en milisegundos
    }
  } catch (error) {
    console.error(
      'Error en el ciclo de consultas:',
      error instanceof Error ? error.message : 'Error desconocido',
    )
  }
}

// Función para iniciar el ciclo principal
export function iniciarCicloPrincipal(): void {
  // Calcular la hora de inicio (12:30 PM)
  const ahora: Date = new Date()
  const horaInicio: Date = new Date(ahora)
  horaInicio.setHours(9, 0, 0, 0) // Fijar la hora de inicio a las 09:00 AM

  // Si ya pasaron las 10:25 AM, ajustar al siguiente ciclo (3 horas después)
  if (ahora > horaInicio) {
    horaInicio.setHours(
      horaInicio.getHours() +
        Math.ceil((ahora.getTime() - horaInicio.getTime()) / (3 * 60 * 60 * 1000)) * 3,
    )
  }

  // Calcular el tiempo restante hasta el próximo ciclo
  const tiempoRestante: number = horaInicio.getTime() - ahora.getTime()

  // Iniciar el primer ciclo después del tiempo restante
  setTimeout(() => {
    // Ejecutar el ciclo de consultas inmediatamente
    iniciarCicloConsultas()

    // Repetir el ciclo cada 3 horas
    setInterval(
      () => {
        iniciarCicloConsultas()
      },
      3 * 60 * 60 * 1000,
    ) // 3 horas en milisegundos
  }, tiempoRestante)
}

// Iniciar el ciclo principal cuando se carga el script
/* iniciarCicloPrincipal() */
// Ejecutar la función principal
