// Tipo base para categorías
export interface Category {
  id: string // Identificador único (UUID o similar)
  codigo: string // Código de categoría (único por empresa)
  name: string // Nombre de la categoría
  enterpriseId: string // ID de la empresa a la que pertenece
  createdAt: Date | string // Fecha de creación
  updatedAt?: Date | string // Fecha de última actualización
  // ...otros campos según necesites
}

// Tipo para la creación de marcas (sin ID ni fechas)
export interface BrandCreateDTO {
  codigo: string
  name: string
  enterpriseId: string
}

// Tipo para actualización (todos los campos opcionales excepto ID)
export interface BrandUpdateDTO {
  id: string
  codigo?: string
  name?: string
}
