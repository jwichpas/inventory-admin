<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/productStore'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import type { Product } from '@/types/product'
import { useEmpresaStore } from '@/stores/empresaStore'

const empresaStore = useEmpresaStore()

const props = defineProps<{
  product?: Product
}>()

const loading = ref(false)

const emit = defineEmits(['submit'])

const productStore = useProductStore()



const form = ref<Omit<Product, 'id' | 'created_at' | 'updated_at'> | Product>({
  id_empresa: localStorage.getItem('empresaId') || empresaStore.empresaSeleccionada?.empresa_id || '',
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  image: null,
  id_category: 0,
  id_brand: 0,
  active: true
})

const errors = ref<Record<string, string[]>>({})

onMounted(async () => {
  await productStore.fetchCategories()
  await productStore.fetchBrands()
  if (!empresaStore.empresaSeleccionada) {
    await empresaStore.fetchEmpresas()
  }
  // Prioriza el valor del store sobre el localStorage
  form.value.id_empresa = empresaStore.empresaSeleccionada?.empresa_id || localStorage.getItem('empresaId') || ''

  if (props.product) {
    form.value = {
      ...props.product,
      id_category: props.product.id_category,
      id_brand: props.product.id_brand
    }
  }
})

watch(
  () => form.value.name,
  (newName) => {
    if (newName) {
      form.value.slug = newName
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
    }
  }
)

const handleSubmit = async () => {
  try {
    errors.value = {}
    await emit('submit', form.value)
  } catch (error: any) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      class="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <!-- Sección de Información Básica -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Información del Producto</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Detalles básicos del producto</p>

        <div class="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-6 gap-x-4">
          <div class="sm:col-span-4">
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre del Producto
              <span class="text-red-500">*</span>
            </label>
            <div
              class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <input type="text" id="name" v-model="form.name"
                class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                :class="{
                  'border-red-300 dark:border-red-500 text-red-900 dark:text-red-300 placeholder-red-300 focus:border-red-500 focus:ring-red-500': errors.name
                }" placeholder="Ej: Laptop HP EliteBook" />
              <div v-if="errors.name" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p v-if="errors.name" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.name[0] }}</p>
          </div>

          <div class="sm:col-span-2">
            <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="text" id="slug" v-model="form.slug"
                class="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                :class="{
                  'border-red-300 dark:border-red-500 text-red-900 dark:text-red-300 placeholder-red-300 focus:border-red-500 focus:ring-red-500': errors.slug
                }" placeholder="Ej: laptop-hp-elitebook" />
              <div v-if="errors.slug" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p v-if="errors.slug" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.slug[0] }}</p>
          </div>

          <div class="sm:col-span-6">
            <label for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <div class="mt-1">
              <textarea id="description" v-model="form.description" rows="3"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Descripción detallada del producto..." />
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Precio e Inventario -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Precio e Inventario</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Información sobre precios y disponibilidad</p>

        <div class="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-6 gap-x-4">
          <div class="sm:col-span-3">
            <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Precio
              <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
              </div>
              <input type="number" id="price" v-model="form.price" step="0.01" min="0"
                class="block w-full pl-7 pr-12 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                :class="{
                  'border-red-300 dark:border-red-500 text-red-900 dark:text-red-300 placeholder-red-300 focus:border-red-500 focus:ring-red-500': errors.price
                }" placeholder="0.00" />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span class="text-gray-500 dark:text-gray-400 sm:text-sm">USD</span>
              </div>
              <div v-if="errors.price" class="absolute inset-y-0 right-10 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p v-if="errors.price" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.price[0] }}</p>
          </div>

          <div class="sm:col-span-3">
            <label for="stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Stock Disponible
              <span class="text-red-500">*</span>
            </label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="number" id="stock" v-model="form.stock" min="0"
                class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                :class="{
                  'border-red-300 dark:border-red-500 text-red-900 dark:text-red-300 placeholder-red-300 focus:border-red-500 focus:ring-red-500': errors.stock
                }" placeholder="0" />
              <div v-if="errors.stock" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon class="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p v-if="errors.stock" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.stock[0] }}</p>
          </div>
        </div>
      </div>

      <!-- Sección de Categorización -->
      <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Categorización</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Clasificación del producto</p>

        <div class="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-6 gap-x-4">
          <div class="sm:col-span-3">
            <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoría
              <span class="text-red-500">*</span>
            </label>
            <select id="category_id" v-model="form.id_category"
              class="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{
                'border-red-300 dark:border-red-500 text-red-900 dark:text-red-300 placeholder-red-300 focus:border-red-500 focus:ring-red-500': errors.category_id
              }">
              <option value="0">Seleccione una categoría</option>
              <option v-for="category in productStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="errors.category_id" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.category_id[0] }}
            </p>
          </div>

          <div class="sm:col-span-3">
            <label for="brand_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Marca
              <span class="text-red-500">*</span>
            </label>
            <select id="brand_id" v-model="form.id_brand"
              class="col-start-1 row-start-1 w-full appearance-none rounded-md py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              :class="{
                'border-red-300 dark:border-red-500 text-red-900 dark:text-red-300 placeholder-red-300 focus:border-red-500 focus:ring-red-500': errors.brand_id
              }">
              <option value="0">Seleccione una marca</option>
              <option v-for="brand in productStore.brands" :key="brand.id" :value="brand.id">
                {{ brand.name }}
              </option>
            </select>
            <p v-if="errors.brand_id" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ errors.brand_id[0] }}</p>
          </div>
        </div>
      </div>

      <!-- Sección de Imagen y Estado -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Imagen y Estado</h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Configuración adicional del producto</p>

        <div class="mt-6 grid grid-cols-1 gap-y-4 sm:grid-cols-6 gap-x-4">
          <div class="sm:col-span-4">
            <label for="image" class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL de la
              Imagen</label>
            <div class="mt-1 flex rounded-md shadow-sm">
              <span
                class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 px-3 text-gray-500 dark:text-gray-300 sm:text-sm">
                https://
              </span>
              <input type="text" id="image" v-model="form.image"
                class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="ejemplo.com/imagen.jpg" />
            </div>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
            <div class="mt-1 flex items-center h-10">
              <input id="active" v-model="form.active" type="checkbox"
                class="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-700" />
              <label for="active" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Producto activo
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Acciones del Formulario -->
    <div class="flex justify-end gap-3 px-6">
      <button type="button"
        class="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
        Cancelar
      </button>
      <button type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        {{ loading ? 'Guardando...' : 'Guardar Producto' }}
      </button>
    </div>
  </form>
</template>
