<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h1>
        <p class="text-sm text-gray-500 mt-1">Complete todos los campos requeridos</p>
      </div>

      <router-link to="/products"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        <ArrowLeftIcon class="mr-2 h-5 w-5" />
        Volver
      </router-link>
    </div>

    <!-- Formulario -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <form @submit.prevent="submitForm">
        <!-- Sección básica del producto -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Información Básica</h2>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Nombre -->
            <div class="sm:col-span-4">
              <label for="name" class="block text-sm font-medium text-gray-700">
                Nombre del Producto <span class="text-red-500">*</span>
              </label>
              <input type="text" id="name" v-model="product.name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.name }" />
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Código -->
            <div class="sm:col-span-2">
              <label for="code" class="block text-sm font-medium text-gray-700">
                Código <span class="text-red-500">*</span>
              </label>
              <input type="text" id="code" v-model="product.code"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.code }" />
              <p v-if="errors.code" class="mt-2 text-sm text-red-600">{{ errors.code }}</p>
            </div>

            <!-- Descripción -->
            <div class="sm:col-span-6">
              <label for="description" class="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea id="description" v-model="product.description" rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div>

            <!-- Categoría -->
            <div class="sm:col-span-3">
              <label for="category" class="block text-sm font-medium text-gray-700">
                Categoría <span class="text-red-500">*</span>
              </label>
              <select id="category" v-model="product.category_id"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.category_id }">
                <option value="">Seleccione una categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <p v-if="errors.category_id" class="mt-2 text-sm text-red-600">{{ errors.category_id }}</p>
            </div>


            <!-- Marca -->
            <div class="sm:col-span-3">
              <label for="brand" class="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <select id="brand" v-model="product.brand_id"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">Seleccione una marca</option>
                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                  {{ brand.name }}
                </option>
              </select>
            </div>

            <!-- Tipo de producto -->
            <div class="sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">Tipo de Producto</label>
              <div class="mt-1 space-y-2">
                <div class="flex items-center">
                  <input id="simple-product" v-model="product.product_type" type="radio" value="simple"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                  <label for="simple-product" class="ml-2 block text-sm text-gray-700">
                    Producto Simple
                  </label>
                </div>
                <div class="flex items-center">
                  <input id="variable-product" v-model="product.product_type" type="radio" value="variable"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                  <label for="variable-product" class="ml-2 block text-sm text-gray-700">
                    Producto con Variantes
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de variantes (solo para producto variable) -->
        <div v-if="product.product_type === 'variable'" class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Variantes del Producto</h2>
            <button type="button" @click="addVariant"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <PlusIcon class="-ml-1 mr-1 h-4 w-4" />
              Agregar Variante
            </button>
          </div>

          <!-- Lista de variantes -->
          <div v-if="variants.length > 0" class="space-y-6">
            <div v-for="(variant, index) in variants" :key="index" class="bg-gray-50 p-4 rounded-md">
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-sm font-medium text-gray-700">Variante #{{ index + 1 }}</h3>
                <button type="button" @click="removeVariant(index)" class="text-red-600 hover:text-red-800">
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>

              <div class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <!-- SKU -->
                <div class="sm:col-span-2">
                  <label :for="`variant-sku-${index}`" class="block text-xs font-medium text-gray-700">
                    SKU <span class="text-red-500">*</span>
                  </label>
                  <input type="text" :id="`variant-sku-${index}`" v-model="variant.sku"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                    :class="{ 'border-red-300': variantErrors[index]?.sku }" />
                  <p v-if="variantErrors[index]?.sku" class="mt-1 text-xs text-red-600">
                    {{ variantErrors[index].sku }}
                  </p>
                </div>

                <!-- Código SUNAT -->
                <div class="sm:col-span-2">
                  <label :for="`variant-sunat-${index}`" class="block text-xs font-medium text-gray-700">
                    Código SUNAT
                  </label>
                  <input type="text" :id="`variant-sunat-${index}`" v-model="variant.sunat_code"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs" />
                </div>

                <!-- Precio -->
                <div class="sm:col-span-2">
                  <label :for="`variant-price-${index}`" class="block text-xs font-medium text-gray-700">
                    Precio <span class="text-red-500">*</span>
                  </label>
                  <input type="number" step="0.01" :id="`variant-price-${index}`" v-model="variant.price"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                    :class="{ 'border-red-300': variantErrors[index]?.price }" />
                  <p v-if="variantErrors[index]?.price" class="mt-1 text-xs text-red-600">
                    {{ variantErrors[index].price }}
                  </p>
                </div>

                <!-- Stock -->
                <div class="sm:col-span-2">
                  <label :for="`variant-stock-${index}`" class="block text-xs font-medium text-gray-700">
                    Stock Inicial
                  </label>
                  <input type="number" :id="`variant-stock-${index}`" v-model="variant.stock"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs" />
                </div>

                <!-- Unidad de Medida -->
                <div class="sm:col-span-2">
                  <label :for="`variant-unit-${index}`" class="block text-xs font-medium text-gray-700">
                    Unidad de Medida <span class="text-red-500">*</span>
                  </label>
                  <select :id="`variant-unit-${index}`" v-model="variant.unit_id"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                    :class="{ 'border-red-300': variantErrors[index]?.unit_id }">
                    <option value="">Seleccione unidad</option>
                    <option v-for="unit in units" :key="unit.id" :value="unit.id">
                      {{ unit.nombre_sunat }} ({{ unit.simbolo }})
                    </option>
                  </select>
                  <p v-if="variantErrors[index]?.unit_id" class="mt-1 text-xs text-red-600">
                    {{ variantErrors[index].unit_id }}
                  </p>
                </div>

                <!-- Atributos de la variante -->
                <div class="sm:col-span-6">
                  <label class="block text-xs font-medium text-gray-700 mb-1">Atributos</label>
                  <div class="space-y-2">
                    <div v-for="(attribute, attrIndex) in variant.attributes" :key="attrIndex"
                      class="flex items-center space-x-2">
                      <select v-model="attribute.attribute_id"
                        class="flex-1 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs">
                        <option value="">Seleccione atributo</option>
                        <option v-for="attr in availableAttributes" :key="attr.id" :value="attr.id">
                          {{ attr.name }}
                        </option>
                      </select>

                      <select v-model="attribute.value_id"
                        class="flex-1 border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs"
                        :disabled="!attribute.attribute_id">
                        <option value="">Seleccione valor</option>
                        <option v-for="value in getAttributeValues(attribute.attribute_id)" :key="value.id"
                          :value="value.id">
                          {{ value.valor }}
                        </option>
                      </select>
                      <button type="button" @click="removeVariantAttribute(index, attrIndex)"
                        class="text-red-600 hover:text-red-800 p-1">
                        <TrashIcon class="h-3 w-3" />
                      </button>
                    </div>

                    <button type="button" @click="addVariantAttribute(index)"
                      class="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <PlusIcon class="mr-1 h-3 w-3" />
                      Agregar Atributo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4 bg-gray-50 rounded-md">
            <p class="text-sm text-gray-500">No hay variantes agregadas</p>
          </div>
        </div>

        <!-- Sección de producto simple (solo para producto simple) -->
        <div v-else class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Detalles del Producto Simple</h2>

          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- SKU -->
            <div class="sm:col-span-2">
              <label for="simple-sku" class="block text-sm font-medium text-gray-700">
                SKU <span class="text-red-500">*</span>
              </label>
              <input type="text" id="simple-sku" v-model="product.sku"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.sku }" />
              <p v-if="errors.sku" class="mt-2 text-sm text-red-600">{{ errors.sku }}</p>
            </div>

            <!-- Precio -->
            <div class="sm:col-span-2">
              <label for="simple-price" class="block text-sm font-medium text-gray-700">
                Precio <span class="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" id="simple-price" v-model="product.price"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.price }" />
              <p v-if="errors.price" class="mt-2 text-sm text-red-600">{{ errors.price }}</p>
            </div>

            <!-- Stock -->
            <div class="sm:col-span-2">
              <label for="simple-stock" class="block text-sm font-medium text-gray-700">
                Stock Inicial
              </label>
              <input type="number" id="simple-stock" v-model="product.stock"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            <!-- Unidad de Medida -->
            <div class="sm:col-span-3">
              <label for="simple-unit" class="block text-sm font-medium text-gray-700">
                Unidad de Medida <span class="text-red-500">*</span>
              </label>
              <select id="simple-unit" v-model="product.unit_id"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.unit_id }">
                <option value="">Seleccione unidad</option>
                <option v-for="unit in units" :key="unit.id" :value="unit.id">
                  {{ unit.nombre_sunat }} ({{ unit.simbolo }})
                </option>
              </select>
              <button type="button" @click="openUnidadMedidaModal"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva
              </button>
              <p v-if="errors.unit_id" class="mt-2 text-sm text-red-600">{{ errors.unit_id }}</p>
            </div>
          </div>
        </div>

        <!-- Sección de imágenes -->
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Imágenes del Producto</h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            <!-- Imagen principal -->
            <div class="col-span-full">
              <label class="block text-sm font-medium text-gray-700 mb-2">Imagen Principal</label>
              <ImageUploader v-model="product.main_image" />
            </div>

            <!-- Imágenes adicionales -->
            <div v-for="(image, index) in product.images" :key="index" class="relative">
              <ImageUploader v-model="product.images[index]" />
              <button type="button" @click="removeImage(index)"
                class="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <XMarkIcon class="h-3 w-3" />
              </button>
            </div>

            <button type="button" @click="addImage"
              class="h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center hover:border-gray-400">
              <PlusIcon class="h-6 w-6 text-gray-400" />
              <span class="text-xs text-gray-500 mt-1">Agregar imagen</span>
            </button>
          </div>
        </div>

        <!-- Acciones del formulario -->
        <div class="px-6 py-4 bg-gray-50 text-right">
          <button type="button" @click="cancel"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button type="submit" :disabled="loading"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">Guardar Producto</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Guardando...
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Modal para crear unidad de medida -->
    <ModalCrearUnidadMedida :isOpen="showUnidadMedidaModal" @close="closeUnidadMedidaModal"
      @created="handleUnidadMedidaCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import ImageUploader from '@/components/ImageUploader.vue'
import type {
  Product,
  Variant,
  Category,
  Brand,
  Unit,
  Attribute,
  AttributeValue,
  FormErrors,
  VariantErrors
} from '@/types/product'
import ModalCrearUnidadMedida from '@/components/inventario/ModalCrearUnidadMedida.vue'

const router = useRouter()

// INICIO::UNIDAD DE MEDIDA
const unidadesMedida = ref<any[]>([])
const showUnidadMedidaModal = ref(false)
// Manejar modal de unidad de medida
function openUnidadMedidaModal() {
  showUnidadMedidaModal.value = true
}
function closeUnidadMedidaModal() {
  showUnidadMedidaModal.value = false
  fetchUnits()
}
function handleUnidadMedidaCreated(newUnidad: any) {
  unidadesMedida.value.push(newUnidad)
  product.value.id_unidad_medida = newUnidad.id
}

// Estado del formulario
const loading = ref<boolean>(false)
const errors = ref<FormErrors>({})
const variantErrors = ref<VariantErrors>([])

// Datos del producto con tipo Product
const product = ref<Product>({
  name: '',
  code: '',
  description: '',
  category_id: '',
  brand_id: '',
  product_type: 'simple',
  sku: '',
  price: '',
  stock: 0,
  unit_id: '',
  main_image: null,
  images: [],
  id_unidad_medida: 0,
  category_ids: []
})

// Variantes con tipo Variant[]
const variants = ref<Variant[]>([
  {
    sku: '',
    sunat_code: '',
    price: '',
    stock: 0,
    unit_id: '',
    attributes: []
  }
])

// Datos de selección con tipos
const categories = ref<Category[]>([])
const brands = ref<Brand[]>([])
const units = ref<Unit[]>([])
const availableAttributes = ref<Attribute[]>([])
const attributeValues = ref<AttributeValue[]>([])

// Cargar datos iniciales
onMounted(async () => {
  try {
    // Simular carga de datos desde API
    categories.value = await fetchCategories()
    brands.value = await fetchBrands()
    units.value = await fetchUnits()
    availableAttributes.value = await fetchAttributes()
    attributeValues.value = await fetchAttributeValues()
  } catch (error) {
    console.error('Error cargando datos:', error)
  }
})
const id_empresa = localStorage.getItem('empresaId')
// Modifica las funciones para incluir tipos de retorno
const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get(`/lista-categorias/${id_empresa}`)
  return response.data
}

const fetchBrands = async (): Promise<Brand[]> => {
  const response = await api.get(`/lista-marcas/${id_empresa}`)
  return response.data
}

const fetchUnits = async (): Promise<Unit[]> => {
  const response = await api.get(`/unidad-medida`)
  return response.data
}

const fetchAttributes = async (): Promise<Attribute[]> => {
  const response = await api.get(`/tipo-atributo?id_empresa=${id_empresa}`)
  console.log(response.data.data.data)
  return response.data.data.data

}

const fetchAttributeValues = async (): Promise<AttributeValue[]> => {
  const response = await api.get(`/lista-atributo?id_empresa=${id_empresa}`)
  return response.data.data.data
}

// Añade tipos a los métodos
const addVariant = (): void => {
  variants.value.push({
    sku: '',
    sunat_code: '',
    price: '',
    stock: 0,
    unit_id: '',
    attributes: []
  })
  variantErrors.value.push({})
}


const removeVariant = (index: number): void => {
  if (variants.value.length > 1) {
    variants.value.splice(index, 1)
    variantErrors.value.splice(index, 1)
  }
}

const addVariantAttribute = (variantIndex: number): void => {
  variants.value[variantIndex].attributes.push({
    attribute_id: '',
    value_id: ''
  })
}

const removeVariantAttribute = (variantIndex: number, attrIndex: number): void => {
  variants.value[variantIndex].attributes.splice(attrIndex, 1)
}

// Métodos para manejar imágenes
const addImage = (): void => {
  product.value.images.push(null)
}

const removeImage = (index: number): void => {
  product.value.images.splice(index, 1)
}

const getAttributeValues = (attributeId: number): AttributeValue[] => {
  if (!attributeId) return []
  return attributeValues.value.filter(v => v.id_tipo === attributeId)
}

// Validación del formulario
const validateForm = (): boolean => {
  let valid = true
  errors.value = {}
  variantErrors.value = []

  // Validar campos básicos
  if (!product.value.name) {
    errors.value.name = 'El nombre del producto es requerido'
    valid = false
  }

  if (!product.value.code) {
    errors.value.code = 'El código del producto es requerido'
    valid = false
  }

  if (!product.value.category_id) {
    errors.value.category_id = 'La categoría es requerida'
    valid = false
  }

  // Validar según tipo de producto
  if (product.value.product_type === 'simple') {
    if (!product.value.sku) {
      errors.value.sku = 'El SKU es requerido'
      valid = false
    }

    if (!product.value.price) {
      errors.value.price = 'El precio es requerido'
      valid = false
    }

    if (!product.value.unit_id) {
      errors.value.unit_id = 'La unidad de medida es requerida'
      valid = false
    }
  } else {
    // Validar variantes
    variants.value.forEach((variant, index) => {
      const variantError = {}

      if (!variant.sku) {
        variantError.sku = 'El SKU es requerido'
        valid = false
      }

      if (!variant.price) {
        variantError.price = 'El precio es requerido'
        valid = false
      }

      if (!variant.unit_id) {
        variantError.unit_id = 'La unidad de medida es requerida'
        valid = false
      }

      if (Object.keys(variantError).length > 0) {
        variantErrors.value[index] = variantError
      }
    })
  }

  return valid
}

// Enviar formulario
const submitForm = async (): Promise<void> => {
  if (!validateForm()) return;
  const uploadProgress = ref(0);
  loading.value = true;
  errors.value = {};
  variantErrors.value = [];

  try {
    // Obtener el token de autenticación y el ID de la empresa
    const token = localStorage.getItem('token');
    const empresaId = localStorage.getItem('empresaId') || router.currentRoute.value.params.id_empresa;

    if (!empresaId) {
      throw new Error('No se ha seleccionado una empresa');
    }

    // Preparar los datos del formulario
    const formData = new FormData();

    // Datos básicos del producto
    formData.append('id_empresa', empresaId);
    formData.append('name', product.value.name);
    formData.append('codigo', product.value.code);
    formData.append('description', product.value.description);
    formData.append('category_id', product.value.category_id);
    formData.append('id_brand', product.value.brand_id);
    formData.append('product_type', product.value.product_type);

    // Si es producto simple
    if (product.value.product_type === 'simple') {
      formData.append('sku', product.value.sku);
      formData.append('price', product.value.price);
      formData.append('stock', product.value.stock);
      formData.append('unit_id', product.value.unit_id);

      // Imagen principal
      if (product.value.main_image instanceof File) {
        formData.append('main_image', product.value.main_image);
      }

      // Imágenes adicionales
      product.value.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image);
        }
      });
    }
    // Si es producto con variantes
    else {
      variants.value.forEach((variant, index) => {
        formData.append(`variants[${index}][sku]`, variant.sku);
        formData.append(`variants[${index}][sunat_code]`, variant.sunat_code);
        formData.append(`variants[${index}][price]`, variant.price);
        formData.append(`variants[${index}][stock]`, variant.stock);
        formData.append(`variants[${index}][unit_id]`, variant.unit_id);

        // Atributos de la variante
        variant.attributes.forEach((attr, attrIndex) => {
          if (attr.attribute_id && attr.value_id) {
            formData.append(`variants[${index}][attributes][${attrIndex}][attribute_id]`, attr.attribute_id);
            formData.append(`variants[${index}][attributes][${attrIndex}][value_id]`, attr.value_id);
          }
        });
      });
    }

    // Configuración de la petición
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        'X-Empresa-ID': empresaId
      },
      onUploadProgress: progressEvent => {
        uploadProgress.value = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      }
    };

    // Enviar a la API
    const response = await api.post('/nuevo-producto', formData, config);

    // Mostrar mensaje de éxito y redirigir
    if (response.data.success) {
      // Puedes usar un store (Pinia) o evento global para mostrar notificación
      showNotification('Producto creado exitosamente', 'success');

      // Redirigir a la lista de productos
      router.push({
        name: 'products',
        params: { empresa_id: empresaId }
      });
    } else {
      throw new Error(response.data.message || 'Error al crear el producto');
    }
  } catch (error) {
    console.error('Error al guardar el producto:', error);

    // Manejar errores de validación del backend
    if (error.response?.status === 422) {
      const apiErrors = error.response.data.errors;

      // Convertir errores de Laravel a nuestro formato
      for (const [field, messages] of Object.entries(apiErrors)) {
        // Manejar errores de variantes (ej: variants.0.sku)
        if (field.startsWith('variants.')) {
          const match = field.match(/variants\.(\d+)\.(.+)/);
          if (match) {
            const variantIndex = match[1];
            const variantField = match[2];

            if (!variantErrors.value[variantIndex]) {
              variantErrors.value[variantIndex] = {};
            }

            variantErrors.value[variantIndex][variantField] = messages[0];
          }
        }
        // Errores normales del producto
        else {
          errors.value[field] = messages[0];
        }
      }
    } else {
      // Error genérico
      showNotification(
        error.response?.data?.message || 'Error al guardar el producto',
        'error'
      );
    }
  } finally {
    loading.value = false;
  }
};
const generateSku = (): void => {
  if (product.value.name && product.value.code) {
    const initials = product.value.name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);

    product.value.sku = `${initials}-${product.value.code.substring(0, 3)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }
};



// Llamar cuando cambie el nombre o código
watch([() => product.value.name, () => product.value.code], () => {
  if (!product.value.sku) {
    generateSku();
  }
});

// Helper para mostrar notificaciones
const showNotification = (message, type = 'success') => {
  // Implementación depende de tu sistema de notificaciones
  // Ejemplo con Toastify, SweetAlert, o un store de Pinia
  console.log(`${type}: ${message}`);
  // Ejemplo con alerta nativa:
  alert(`${type.toUpperCase()}: ${message}`);
};
</script>
