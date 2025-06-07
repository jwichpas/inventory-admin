// interfaces.ts
export interface Montos {
  mto_bi_gravada_dg: number
  mto_igv_ipm_dg: number
  totalGravadas: number
  totalInafectas: number
  totalExoneradas: number
  totalGratuitas: number
  // Agrega otros campos de montos si existen
}

export interface Archivo {
  compra_id: BigInteger
  xml: string
}

export interface ClasificacionCompra {
  tipo_proveedor: string
  estado: string
}

export interface Invoice {
  id: string
  nom_razon_social_proveedor: string
  num_doc_identidad_proveedor: string
  fec_emision: string
  fec_venc_pag: string
  cod_tipo_cdp: string
  des_tipo_cdp: string
  num_serie_cdp: string
  num_cdp: string
  cod_moneda: 'PEN' | 'USD' | string
  des_estado_comprobante: string
  mto_total_cp: number
  montos: Montos
  archivo: Archivo
  clasificaciones?: ClasificacionCompra[]
  // Agrega otros campos que puedan existir
}

export interface Pagination {
  currentPage: number
  total: number
  from: number
  to: number
  totalPages: number
}

export interface TableHeader {
  key: string
  label: string
  sortable?: boolean
  textRight?: boolean
  nowrap?: boolean
  class?: string
  customRender?: any
}
