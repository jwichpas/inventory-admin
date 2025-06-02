export interface Item {
  id: number
  compra_id: number
  invoicedQuantity: string
  unitCode: string
  priceAmount: string
  priceTypeCode: string
  sellersId: string | null
  description: string
  itemClassCode: string | null
  taxAmount: string
  taxableAmount: string
  taxExemptionReasonCode: string
  percent: string
  created_at: string
  updated_at: string
}

export interface Compra {
  id: number
  id_registro: string
  num_ruc: string
  nom_razon_social: string
  cod_car: string
  cod_tipo_cdp: string
  des_tipo_cdp: string
  num_serie_cdp: string
  num_cdp: string
  fec_emision: string
  fec_venc_pag: string
  num_cdp_rango_final: string | null
  cod_tipo_doc_identidad_proveedor: string
  num_doc_identidad_proveedor: string
  nom_razon_social_proveedor: string
  cod_tipo_carga: string
  cod_situacion: string
  cod_moneda: string
  mto_total_cp: string
  cod_estado_comprobante: string
  des_estado_comprobante: string
  ind_oper_gratuita: string | null
  cod_tipo_motivo_nota: string | null
  des_tipo_motivo_nota: string | null
  ind_editable: string | null
  per_tributario: string
  num_inconsistencias: string | null
  ind_inf_incompleta: string | null
  ind_modificado_contribuyente: string | null
  plazo_visualizacion: string | null
  ind_detraccion: string | null
  ind_inclu_exclu_car: number
  por_participacion: string | null
  cod_bbss: string | null
  cod_id_proyecto: string | null
  ann_cdp: string | null
  cod_dep_aduanera: string | null
  ind_fuente_cp: string
  lis_cod_inconsistencia: string
  lis_num_casilla: string
  por_tasa_retencion: string | null
  des_msj_original: string | null
  num_car_ind_ie: string | null
  num_correlativo: number
  por_tasa_igv: string
  archivo_carga: string
  campos_libres: string
  created_at: string
  updated_at: string
  items: Item[]
}
