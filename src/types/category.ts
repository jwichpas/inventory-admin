// Tipo base para categorías
export interface Category {
  id: string // Identificador único (UUID o similar)
  codigo: string // Código de categoría (único por empresa)
  name: string // Nombre de la categoría
  description?: string // Descripción opcional
  enterpriseId: string // ID de la empresa a la que pertenece
  isActive: boolean // Estado activo/inactivo
  createdAt: Date | string // Fecha de creación
  updatedAt?: Date | string // Fecha de última actualización
  // ...otros campos según necesites
}

// Tipo para la creación de categorías (sin ID ni fechas)
export interface CategoryCreateDTO {
  codigo: string
  name: string
  description?: string
  enterpriseId: string
  isActive?: boolean
}

// Tipo para actualización (todos los campos opcionales excepto ID)
export interface CategoryUpdateDTO {
  id: string
  codigo?: string
  name?: string
  description?: string
  isActive?: boolean
}

// Tipo para respuesta de validación de código
export interface CodeValidationResult {
  isValid: boolean
  message?: string
}

// Tipo para filtros de búsqueda
export interface CategoryFilters {
  searchTerm?: string
  enterpriseId?: string
  isActive?: boolean
  // ...otros filtros
}
