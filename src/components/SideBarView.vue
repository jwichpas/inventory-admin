<template>
  <div>
    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button @click="mobileMenuOpen = !mobileMenuOpen"
        class="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none">
        <Bars3Icon class="h-6 w-6" />
      </button>
    </div>

    <!-- Sidebar Overlay -->
    <div v-show="mobileMenuOpen" @click="mobileMenuOpen = false"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-200"></div>

    <!-- Sidebar -->
    <aside ref="sidebar" :class="{
      'translate-x-0': mobileMenuOpen || !isMobile,
      '-translate-x-full': !mobileMenuOpen && isMobile,
      'w-20': minimized,
      'w-64': !minimized
    }"
      class="fixed inset-y-0 left-0 z-40 bg-white shadow-lg transform transition-all duration-200 ease-in-out flex flex-col">
      <!-- Logo/Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-4 bg-rose-600 shrink-0">
        <transition name="fade" mode="out-in">
          <span v-if="!minimized" class="text-white font-bold text-xl whitespace-nowrap">
            InventoryApp
          </span>
          <span v-else class="text-white font-bold text-xl">IA</span>
        </transition>

        <!-- Minimize Button (Desktop) -->
        <button @click="toggleMinimize"
          class="hidden lg:block p-1 rounded-md text-white hover:bg-rose-500 focus:outline-none"
          :title="minimized ? 'Expandir' : 'Minimizar'">
          <ChevronDoubleLeftIcon v-if="!minimized" class="h-5 w-5" />
          <ChevronDoubleRightIcon v-else class="h-5 w-5" />
        </button>

        <!-- Close Button (Mobile) -->
        <button @click="mobileMenuOpen = false"
          class="lg:hidden p-1 rounded-md text-white hover:bg-rose-500 focus:outline-none">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <div v-for="item in navigation" :key="item.name">
          <button v-if="item.children" @click="toggleSubmenu(item.name)"
            class="group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-rose-600">
            <div class="flex items-center">
              <component :is="item.icon" class="flex-shrink-0 h-5 w-5 mr-3 text-gray-400 group-hover:text-rose-500" />
              {{ item.name }}
            </div>
            <ChevronDownIcon class="h-4 w-4 transform transition-transform"
              :class="{ 'rotate-180': openSubmenus[item.name] }" />
          </button>

          <router-link v-else :to="item.to" active-class="bg-gray-100 text-rose-600"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-rose-50 hover:text-rose-600">
            <component :is="item.icon"
              class="flex-shrink-0 h-5 w-5 mr-3 text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-500" />
            {{ item.name }}
          </router-link>

          <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-show="item.children && openSubmenus[item.name]" class="ml-8 mt-1 space-y-1">
              <router-link v-for="child in item.children" :key="child.name" :to="child.to"
                active-class="bg-gray-100 text-rose-600"
                class="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-rose-50 hover:text-rose-600">
                {{ child.name }}
              </router-link>
            </div>
          </transition>
        </div>

        <!-- Admin Section -->
        <div class="mt-8 px-3">
          <transition name="fade">
            <h3 v-if="!minimized" class="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administración
            </h3>
          </transition>
          <div class="mt-1 space-y-1">
            <router-link v-for="item in adminNavigation" :key="item.name" :to="item.to"
              active-class="bg-gray-100 text-rose-600"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md" :class="{
                'text-gray-700 hover:bg-gray-50 hover:text-rose-600': !minimized,
                'justify-center': minimized
              }">
              <component :is="item.icon" class="flex-shrink-0 h-5 w-5" :class="{
                'mr-3': !minimized,
                'text-gray-400 group-hover:text-rose-500': true
              }" />
              <transition name="slide-fade">
                <span v-if="!minimized" class="whitespace-nowrap">
                  {{ item.name }}
                </span>
              </transition>
              <span v-if="minimized" class="sr-only">{{ item.name }}</span>
            </router-link>

          </div>
        </div>

      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-200 shrink-0">
        <div class="flex items-center" :class="{ 'justify-center': minimized }">
          <img class="h-8 w-8 rounded-full"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User profile">
          <transition name="slide-fade">
            <div v-if="!minimized" class="ml-3">
              <p class="text-sm font-medium text-gray-700">John Doe</p>
              <button class="text-xs font-medium text-gray-500 hover:text-gray-700">Ver perfil</button>
            </div>
          </transition>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import {
  // Iconos básicos
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  // Iconos de navegación
  HomeIcon,
  UsersIcon,
  FolderIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  // Iconos de administración
  CogIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

// Estado del sidebar
const minimized = ref(localStorage.getItem('sidebarMinimized') === 'true')
const mobileMenuOpen = ref(false)
const isMobile = ref(window.innerWidth < 1024)
const sidebar = ref(null)

const isOpen = ref(localStorage.getItem('sidebarOpen') !== 'false')

watch(isOpen, (newVal) => {
  localStorage.setItem('sidebarOpen', newVal)
})

const openSubmenus = ref({})

const toggleSubmenu = (name) => {
  openSubmenus.value = {
    ...openSubmenus.value,
    [name]: !openSubmenus.value[name]
  }
}
// Navegación
const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  {
    name: 'Catalogo', icon: FolderIcon,
    children: [
      { name: 'Productos', to: '/products' },
      { name: 'Categoria', to: '/categories' },
      { name: 'Subcategoria', to: '/products/subcategory' },
      { name: 'Unidad de medida', to: '/products/measure-unit' },
      { name: 'Tipo de producto', to: '/products/product-type' },
      { name: 'Marca', to: '/brands' }
    ]
  },
  { name: 'Movimientos', to: '/movements', icon: DocumentDuplicateIcon },
  { name: 'Reportes', to: '/reports', icon: ChartBarIcon },
  { name: 'Inventario', to: '/inventory', icon: CubeIcon },

]

const adminNavigation = [
  { name: 'Usuarios', to: '/admin/users', icon: UserGroupIcon },
  { name: 'Empresas', to: '/admin/companies', icon: ShieldCheckIcon },
  { name: 'Configuración', to: '/settings', icon: CogIcon },
]

// Minimizar/expandir sidebar
const toggleMinimize = () => {
  minimized.value = !minimized.value
  localStorage.setItem('sidebarMinimized', minimized.value)
}

// Manejar responsive
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    mobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)
  checkScreenSize()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.15s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

/* Scrollbar personalizada */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
