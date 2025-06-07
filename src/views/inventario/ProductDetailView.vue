<template>
  <div class="max-w-4xl mx-auto p-6">
    <router-link to="/inventario/lista-productos"
      class="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">&larr;
      Volver a productos</router-link>
    <div
      class="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 p-6 flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <img :src="selectedImage" :alt="product.name" class="w-full h-64 object-cover rounded mb-4" />
        <div class="flex gap-2 mb-2">
          <img v-for="color in product.colors" :key="color.name" :src="color.image" :alt="color.name"
            class="w-12 h-12 object-cover rounded border-2 cursor-pointer"
            :class="selectedColor === color.name ? 'border-blue-500' : 'border-transparent'"
            @click="selectColor(color)" />
        </div>
        <div class="text-xs text-gray-500 dark:text-zinc-400 mb-2">
          <span class="font-semibold">EAN:</span> {{ currentColor?.ean }}
        </div>
      </div>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">{{ product.name }}</h1>
        <div class="mb-2 text-gray-700 dark:text-zinc-300">{{ product.brand }} | {{ product.category }}</div>
        <div class="mb-4 text-gray-600 dark:text-zinc-400">{{ product.description }}</div>
        <div class="mb-4 text-sm text-gray-500 dark:text-zinc-400">{{ product.details }}</div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">Tamaño</label>
          <select v-model="selectedSize"
            class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <option v-for="size in currentColor?.sizes" :key="size.name" :value="size.name">
              {{ size.name }} - S/ {{ size.price }} (Stock: {{ size.stock }})
            </option>
          </select>
        </div>
        <div v-if="currentSize && currentSize.conversion" class="mb-4">
          <div class="text-xs text-gray-500 dark:text-zinc-400">
            <span v-if="currentSize.conversion.to">
              {{ currentSize.conversion.qty }} {{ currentSize.name }} = 1 {{ currentSize.conversion.to }} (S/ {{
                currentSize.conversion.price }})
            </span>
            <span v-else-if="currentSize.conversion.from">
              1 {{ currentSize.name }} = {{ currentSize.conversion.qty }} {{ currentSize.conversion.from }}
            </span>
          </div>
        </div>
        <div class="mb-4 flex items-center gap-4">
          <span class="text-lg font-bold text-green-700 dark:text-green-400">S/ {{ currentSize ? currentSize.price :
            '--' }}</span>
          <span class="text-sm text-gray-500 dark:text-zinc-400">Stock: {{ currentSize ? currentSize.stock : '--'
          }}</span>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-zinc-300">Cantidad</label>
          <input type="number" min="1" :max="currentSize ? currentSize.stock : 1" v-model.number="cantidad" :class="['w-32 px-3 py-2 border rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100',
            cantidadInvalida ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-zinc-700']" />
        </div>
        <div class="mb-4">
          <span class="text-base font-semibold text-gray-700 dark:text-zinc-200">Total: S/ {{ total }}</span>
        </div>
        <button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-medium"
          :disabled="cantidadInvalida || !currentSize">
          Agregar al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Add type definitions at the top
interface Size {
  name: string
  price: number
  stock: number
  conversion?: {
    to?: string
    from?: string
    qty: number
    price?: number
  }
}

interface Color {
  name: string
  hex: string
  ean: string
  image: string
  sizes: Size[]
}

interface Product {
  id: number
  name: string
  mainImage: string
  colors: Color[]
  sku: string
  description: string
  details: string
  brand: string
  category: string
}

// Simulación de datos, cada color tiene EAN y sus propios tamaños, precios y stock
const products: Product[] = [
  {
    id: 1,
    name: 'Pintura Premium',
    mainImage: 'https://www.cpp.com.pe/public/images/productos/PATOPLUS_FRONTcomp4.png',
    colors: [
      {
        name: 'Rojo',
        hex: '#e53e3e',
        ean: '7751234567890',
        image: 'https://www.cpp.com.pe/public/images/productos/PATOPLUS_FRONTcomp4.png',
        sizes: [
          { name: 'Galón', price: 80, stock: 12, conversion: { to: 'Caja', qty: 4, price: 300 } },
          { name: 'Balde', price: 350, stock: 5 },
          { name: 'Caja', price: 300, stock: 2, conversion: { from: 'Galón', qty: 4 } }
        ]
      },
      {
        name: 'Azul',
        hex: '#3182ce',
        ean: '7751234567891',
        image: 'https://www.cpp.com.pe/public/images/productos/pinturas-cpp-latex-satinado-duralatex-pato-1.png',
        sizes: [
          { name: 'Galón', price: 85, stock: 8, conversion: { to: 'Caja', qty: 4, price: 320 } },
          { name: 'Balde', price: 355, stock: 3 },
          { name: 'Caja', price: 320, stock: 1, conversion: { from: 'Galón', qty: 4 } }
        ]
      },
      {
        name: 'Verde',
        hex: '#38a169',
        ean: '7751234567892',
        image: '/img/pintura-verde.jpg',
        sizes: [
          { name: 'Galón', price: 82, stock: 10, conversion: { to: 'Caja', qty: 4, price: 310 } },
          { name: 'Balde', price: 340, stock: 2 },
          { name: 'Caja', price: 310, stock: 1, conversion: { from: 'Galón', qty: 4 } }
        ]
      },
      // ...otros colores
    ],
    sku: 'PNT-001',
    description: 'Pintura de alta calidad para interiores y exteriores.',
    details: 'Lavable, bajo olor, secado rápido.',
    brand: 'ColorPlus',
    category: 'Pinturas',
  },
  // ...otros productos
]

const route = useRoute()
const product = ref<Product>(products.find(p => p.id === Number(route.params.id)) || products[0])
const selectedColor = ref(product.value.colors[0].name)
const selectedSize = ref(product.value.colors[0].sizes[0].name)
const selectedImage = ref(product.value.colors[0].image || product.value.mainImage)
const cantidad = ref(1)

const total = computed((): number => {
  if (!currentSize.value) return 0
  return cantidad.value * currentSize.value.price
})

const cantidadInvalida = computed((): boolean => {
  if (!currentSize.value) return true
  return cantidad.value < 1 || cantidad.value > currentSize.value.stock
})

const currentColor = computed(() =>
  product.value.colors.find((c: Color) => c.name === selectedColor.value)
)

const currentSize = computed(() =>
  currentColor.value?.sizes.find((s: Size) => s.name === selectedSize.value)
)

const selectColor = (color: Color) => {
  selectedColor.value = color.name
  selectedImage.value = color.image || product.value.mainImage
  // Cambia el tamaño seleccionado al primero disponible del color
  selectedSize.value = color.sizes[0].name
  cantidad.value = 1
}
</script>
