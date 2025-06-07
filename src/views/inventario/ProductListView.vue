<!-- ProductListView.vue -->
<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-zinc-100">Lista de Productos</h1>
    <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
      <input v-model="searchQuery" type="text" placeholder="Buscar por nombre, SKU, marca..."
        class="w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100" />
    </div>
    <div class="overflow-x-auto z-0 rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200 z-20 dark:divide-zinc-700">
        <thead class="bg-gray-50 dark:bg-zinc-800">
          <tr>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
              Imagen</th>
            <th v-for="col in columns" :key="col.key" @click="sortBy(col.key)"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider cursor-pointer select-none">
              {{ col.label }}
              <span v-if="sortKey === col.key">
                <svg v-if="sortOrder === 'asc'" class="inline h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                <svg v-else class="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </th>
            <th
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase tracking-wider">
              Acciones</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
          <tr v-for="product in filteredAndSortedProducts" :key="product.id"
            class="hover:bg-gray-50 dark:hover:bg-zinc-800 group">
            <td class="px-4 py-2 relative" style="z-index:30">
              <img :src="product.mainImage" :alt="product.name"
                class="w-16 h-16 object-cover rounded shadow cursor-pointer border border-gray-200 dark:border-zinc-700"
                @mouseenter="event => onImgEnter(product.id, event)" @mouseleave="onImgLeave" />
              <div v-if="hoveredProductId === product.id && hoverPosition"
                class="absolute left-full z-40 top-1/2 -translate-y-1/2 ml-4 w-80 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl shadow-md text-left animate-fade-in"
                @mouseenter="onImgEnter(product.id)" @mouseleave="onImgLeave">
                <!-- El usuario puede interactuar dentro del hover -->
                <div class="p-5 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <img :src="product.mainImage" :alt="product.name" class="w-12 h-12 rounded-full " />
                    <div class="block">
                      <h5 class="text-sm text-gray-900 dark:text-zinc-100 font-medium mb-0">{{ product.name }}</h5>
                      <span class="text-sm text-gray-500 font-normal">{{ product.sku }}</span>
                    </div>
                  </div>
                </div>
                <div class="py-5 px-5">
                  <div class="block space-y-2">
                    <div v-for="size in product.sizes" :key="size.name"
                      class="flex items-center gap-3 text-sm text-gray-900 dark:text-zinc-100">
                      <svg class="transition-none" width="20" height="20" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="9" stroke="#9CA3AF" stroke-width="1.2" />
                      </svg>
                      <span>{{ size.name }}: S/ {{ size.price }} (Stock: {{ size.stock }})</span>
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-2 mt-4">
                    <div v-for="color in product.colors" :key="color.name" class="flex flex-col items-center">
                      <img :src="color.image" :alt="color.name"
                        class="w-10 h-10 object-cover rounded border border-gray-200 dark:border-zinc-700" />
                      <span class="text-xs mt-1" :style="{ color: color.hex }">{{ color.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-2">{{ product.name }}</td>
            <td class="px-4 py-2">{{ product.sku }}</td>
            <td class="px-4 py-2">{{ product.brand }}</td>
            <td class="px-4 py-2">{{ product.category }}</td>
            <td class="px-4 py-2">{{ product.description }}</td>
            <td class="px-4 py-2 text-center">
              <router-link :to="`/inventario/lista-productos/${product.id}`"
                class="inline-flex items-center justify-center p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="w-6 h-6 text-indigo-600 dark:text-indigo-400">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
// Tipos para sizes y colors
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
  image: string
}

interface Product {
  id: number
  name: string
  mainImage: string
  colors: Color[]
  sizes: Size[]
  sku: string
  description: string
  details: string
  brand: string
  category: string
}

const products = ref<Product[]>([
  {
    id: 1,
    name: 'Pintura Premium',
    mainImage: 'https://www.cpp.com.pe/public/images/productos/PATOPLUS_FRONTcomp4.png',
    colors: [
      { name: 'Rojo', hex: '#e53e3e', image: '/img/pintura-rojo.jpg' },
      { name: 'Azul', hex: '#3182ce', image: '/img/pintura-azul.jpg' },
      { name: 'Verde', hex: '#38a169', image: '/img/pintura-verde.jpg' },
      { name: 'Amarillo', hex: '#ecc94b', image: '/img/pintura-amarillo.jpg' },
      { name: 'Negro', hex: '#2d3748', image: '/img/pintura-negro.jpg' },
      { name: 'Blanco', hex: '#f7fafc', image: '/img/pintura-blanco.jpg' },
    ],
    sizes: [
      { name: 'Galón', price: 80, stock: 12, conversion: { to: 'Caja', qty: 4, price: 300 } },
      { name: 'Balde', price: 350, stock: 5 },
      { name: 'Caja', price: 300, stock: 2, conversion: { from: 'Galón', qty: 4 } }
    ],
    sku: 'PNT-001',
    description: 'Pintura de alta calidad para interiores y exteriores.',
    details: 'Lavable, bajo olor, secado rápido.',
    brand: 'ColorPlus',
    category: 'Pinturas',
  },
  {
    id: 2,
    name: 'Pintura Premium',
    mainImage: 'https://www.cpp.com.pe/public/images/productos/PATOPLUS_FRONTcomp4.png',
    colors: [
      { name: 'Capuccino', hex: '#e53e3e', image: 'https://promart.vteximg.com.br/arquivos/ids/7884909-275-275/135890.jpg?v=638459732512230000' },
      { name: 'Azul', hex: '#3182ce', image: 'https://promart.vteximg.com.br/arquivos/ids/7980963-275-275/135899.jpg?v=638518324686130000' },
      { name: 'Verde', hex: '#38a169', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJ8XO7dWPFYLq14smzAgTuZXa4q9d6MdfN8qiPQ_HYhYBbT4A48kbURieE3Tl9dena20&usqp=CAU' },
      { name: 'Amarillo', hex: '#ecc94b', image: 'https://promart.vteximg.com.br/arquivos/ids/7980973-190-190/135868.webp?v=638518324779700000' },
      { name: 'Negro', hex: '#2d3748', image: '/img/pintura-negro.jpg' },
      { name: 'Blanco', hex: '#f7fafc', image: '/img/pintura-blanco.jpg' },
    ],
    sizes: [
      { name: 'Galón', price: 80, stock: 12, conversion: { to: 'Caja', qty: 4, price: 300 } },
      { name: 'Balde', price: 350, stock: 5 },
      { name: 'Caja', price: 300, stock: 2, conversion: { from: 'Galón', qty: 4 } }
    ],
    sku: 'PNT-001',
    description: 'Pintura de alta calidad para interiores y exteriores.',
    details: 'Lavable, bajo olor, secado rápido.',
    brand: 'ColorPlus',
    category: 'Pinturas',
  },
  {
    id: 3,
    name: 'Pintura Premium',
    mainImage: 'https://www.cpp.com.pe/public/images/productos/PATOPLUS_FRONTcomp4.png',
    colors: [
      { name: 'Capuccino', hex: '#e53e3e', image: 'https://promart.vteximg.com.br/arquivos/ids/7884909-275-275/135890.jpg?v=638459732512230000' },
      { name: 'Azul', hex: '#3182ce', image: 'https://promart.vteximg.com.br/arquivos/ids/7980963-275-275/135899.jpg?v=638518324686130000' },
      { name: 'Verde', hex: '#38a169', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJ8XO7dWPFYLq14smzAgTuZXa4q9d6MdfN8qiPQ_HYhYBbT4A48kbURieE3Tl9dena20&usqp=CAU' },
      { name: 'Amarillo', hex: '#ecc94b', image: 'https://promart.vteximg.com.br/arquivos/ids/7980973-190-190/135868.webp?v=638518324779700000' },
      { name: 'Negro', hex: '#2d3748', image: '/img/pintura-negro.jpg' },
      { name: 'Blanco', hex: '#f7fafc', image: '/img/pintura-blanco.jpg' },
    ],
    sizes: [
      { name: 'Galón', price: 80, stock: 12, conversion: { to: 'Caja', qty: 4, price: 300 } },
      { name: 'Balde', price: 350, stock: 5 },
      { name: 'Caja', price: 300, stock: 2, conversion: { from: 'Galón', qty: 4 } }
    ],
    sku: 'PNT-001',
    description: 'Pintura de alta calidad para interiores y exteriores.',
    details: 'Lavable, bajo olor, secado rápido.',
    brand: 'ColorPlus',
    category: 'Pinturas',
  },
  {
    id: 4,
    name: 'Pintura Premium',
    mainImage: 'https://www.cpp.com.pe/public/images/productos/PATOPLUS_FRONTcomp4.png',
    colors: [
      { name: 'Capuccino', hex: '#e53e3e', image: 'https://promart.vteximg.com.br/arquivos/ids/7884909-275-275/135890.jpg?v=638459732512230000' },
      { name: 'Azul', hex: '#3182ce', image: 'https://promart.vteximg.com.br/arquivos/ids/7980963-275-275/135899.jpg?v=638518324686130000' },
      { name: 'Verde', hex: '#38a169', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJ8XO7dWPFYLq14smzAgTuZXa4q9d6MdfN8qiPQ_HYhYBbT4A48kbURieE3Tl9dena20&usqp=CAU' },
      { name: 'Amarillo', hex: '#ecc94b', image: 'https://promart.vteximg.com.br/arquivos/ids/7980973-190-190/135868.webp?v=638518324779700000' },
      { name: 'Negro', hex: '#2d3748', image: '/img/pintura-negro.jpg' },
      { name: 'Blanco', hex: '#f7fafc', image: '/img/pintura-blanco.jpg' },
    ],
    sizes: [
      { name: 'Galón', price: 80, stock: 12, conversion: { to: 'Caja', qty: 4, price: 300 } },
      { name: 'Balde', price: 350, stock: 5 },
      { name: 'Caja', price: 300, stock: 2, conversion: { from: 'Galón', qty: 4 } }
    ],
    sku: 'PNT-001',
    description: 'Pintura de alta calidad para interiores y exteriores.',
    details: 'Lavable, bajo olor, secado rápido.',
    brand: 'ColorPlus',
    category: 'Pinturas',
  },
  // ...otros productos
])

const searchQuery = ref('')
const sortKey = ref('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const hoveredProductId = ref<number | null>(null)
const hoverPosition = ref<{ x: number; y: number } | null>(null)

const columns = [
  { key: 'name', label: 'Nombre' },
  { key: 'sku', label: 'SKU' },
  { key: 'brand', label: 'Marca' },
  { key: 'category', label: 'Categoría' },
  { key: 'description', label: 'Descripción' },
]

const filteredAndSortedProducts = computed(() => {
  let filtered = products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
  filtered = filtered.sort((a, b) => {
    const aVal = a[sortKey.value as keyof Product]
    const bVal = b[sortKey.value as keyof Product]
    // Solo comparar si ambos son string o number
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    }
    // Si no es string ni number, no ordenar
    return 0
  })
  return filtered
})

function sortBy(key: string) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Hover logic for card
function onImgEnter(id: number, event?: MouseEvent) {
  hoveredProductId.value = id
  if (event) {
    hoverPosition.value = { x: event.clientX, y: event.clientY }
  }
}
function onImgLeave() {
  hoveredProductId.value = null
  hoverPosition.value = null
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
