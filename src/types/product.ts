export interface Product {
  id: number
  name: string
  code: string
  description: string | null
  id_category: string | number
  id_empresa: string | number | null
  id_brand: string | number | null
  product_type: 'simple' | 'variable'
  sku: string
  price: string | number
  active: boolean
  slug: string
  stock: number
  unit_id: string | number
  main_image: File | null
  image: string | null
  images: (File | null)[]
  id_unidad_medida: number
  category_ids: number[]
  category?: Category
  brand?: Brand
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}
export interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  website: string | null
  created_at: string
  updated_at: string
}

export interface Variant {
  sku: string
  sunat_code: string
  price: string | number
  stock: number
  unit_id: string | number
  attributes: VariantAttribute[]
}

export interface VariantAttribute {
  attribute_id: string | number
  value_id: string | number
}

export interface Category {
  id: number
  name: string
  // otras propiedades...
}

export interface Brand {
  id: number
  name: string
  // otras propiedades...
}

export interface Unit {
  id: number
  codigo_sunat: string
  simbolo: string
  nombre_sunat: string
}

export interface Attribute {
  id: number
  name: string
}

export interface AttributeValue {
  id: number
  id_tipo: number
  attribute_id: number
  value: string
}

export type FormErrors = Record<string, string>
export type VariantErrors = Record<string, FormErrors>[]
