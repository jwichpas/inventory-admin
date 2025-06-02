<template>
  <div>
    <!-- Mobile menu button -->
    <div class="lg:hidden fixed top-4 left-4 z-50">
      <button @click="mobileMenuOpen = !mobileMenuOpen"
        class="p-2 rounded-md text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none transition-colors">
        <Bars3Icon class="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
      </button>
    </div>

    <!-- Sidebar Overlay -->
    <transition enter-active-class="transition-opacity ease-linear duration-200"
      leave-active-class="transition-opacity ease-linear duration-200" enter-from-class="opacity-0"
      leave-to-class="opacity-0">
      <div v-show="mobileMenuOpen" @click="mobileMenuOpen = false"
        class="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"></div>
    </transition>

    <!-- Sidebar -->
    <aside ref="sidebar" :class="{
      'translate-x-0': mobileMenuOpen || !isMobile,
      '-translate-x-full': !mobileMenuOpen && isMobile,
      'w-20': minimized,
      'w-64': !minimized
    }"
      class="fixed inset-y-0 left-0 z-40 bg-white dark:text-zinc-500 dark:bg-zinc-950 shadow-xl transform transition-all duration-300 ease-in-out flex flex-col border-r border-zinc-200 dark:border-zinc-700">

      <!-- Logo/Sidebar Header -->
      <div
        class="flex items-center justify-between h-16 px-4 dark:text-zinc-500 bg-indigo-600 dark:bg-zinc-950 shrink-0">
        <transition name="fade" mode="out-in">
          <router-link to="/" v-if="!minimized" class="flex items-center space-x-2">
            <span class="text-white font-bold text-xl whitespace-nowrap">
              Contabilidad IA
            </span>
          </router-link>
          <router-link to="/" v-else class="flex items-center justify-center w-full">
            <span class="text-white font-bold text-xl">IA</span>
          </router-link>
        </transition>

        <!-- Minimize Button (Desktop) -->
        <button @click="toggleMinimize"
          class="hidden lg:block p-1 rounded-md text-white hover:bg-indigo-500 focus:outline-none transition-colors"
          :title="minimized ? 'Expandir' : 'Minimizar'">
          <ChevronDoubleLeftIcon v-if="!minimized" class="h-5 w-5" />
          <ChevronDoubleRightIcon v-else class="h-5 w-5" />
        </button>

        <!-- Close Button (Mobile) -->
        <button @click="mobileMenuOpen = false"
          class="lg:hidden p-1 rounded-md text-white hover:bg-indigo-500 focus:outline-none transition-colors">
          <XMarkIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4 space-y-1 px-2 dark:text-zinc-500">
        <div v-for="item in navigation" :key="item.name">
          <button v-if="item.children" @click="toggleSubmenu(item.name)"
            class="group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors"
            :class="{
              'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-700': openSubmenus[item.name],
              'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700': !openSubmenus[item.name]
            }">
            <div class="flex items-center">
              <component :is="item.icon" class="flex-shrink-0 h-5 w-5 mr-3 transition-colors" :class="{
                'text-indigo-600 dark:text-indigo-400': openSubmenus[item.name],
                'text-zinc-500 group-hover:text-indigo-600 dark:text-zinc-400 dark:group-hover:text-indigo-400': !openSubmenus[item.name]
              }" />
              <transition name="slide-fade">
                <span v-if="!minimized">{{ item.name }}</span>
              </transition>
            </div>
            <ChevronDownIcon class="h-4 w-4 transform transition-transform"
              :class="{ 'rotate-180': openSubmenus[item.name], 'text-zinc-400': true }" />
          </button>

          <router-link v-else :to="item.to" custom v-slot="{ href, navigate, isActive }">
            <a :href="href" @click="navigate"
              class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors" :class="{
                'bg-indigo-50 text-indigo-600 dark:bg-zinc-700 dark:text-indigo-400': isActive,
                'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700': !isActive,
                'justify-center': minimized
              }">
              <component :is="item.icon" class="flex-shrink-0 h-5 w-5" :class="{
                'mr-3': !minimized,
                'text-indigo-600 dark:text-indigo-400': isActive,
                'text-zinc-500 group-hover:text-indigo-600 dark:text-zinc-400 dark:group-hover:text-indigo-400': !isActive
              }" />
              <transition name="slide-fade">
                <span v-if="!minimized">{{ item.name }}</span>
              </transition>
              <span v-if="minimized" class="sr-only">{{ item.name }}</span>
            </a>
          </router-link>

          <transition enter-active-class="transition-all duration-200 ease-out"
            leave-active-class="transition-all duration-150 ease-in" enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100" leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0">
            <div v-show="item.children && openSubmenus[item.name]" class="ml-8 mt-1 space-y-1">
              <router-link v-for="child in item.children" :key="child.name" :to="child.to" custom
                v-slot="{ href, navigate, isActive }">
                <a :href="href" @click="navigate" class="block px-3 py-2 text-sm rounded-lg transition-colors" :class="{
                  'bg-indigo-50 text-indigo-600 dark:bg-zinc-700 dark:text-indigo-400': isActive,
                  'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700': !isActive
                }">
                  {{ child.name }}
                </a>
              </router-link>
            </div>
          </transition>
        </div>

        <!-- Admin Section -->
        <div class="mt-8 px-1">
          <transition name="fade">
            <h3 v-if="!minimized"
              class="px-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Administración
            </h3>
          </transition>
          <div class="mt-1 space-y-1">
            <router-link v-for="item in adminNavigation" :key="item.name" :to="item.to" custom
              v-slot="{ href, navigate, isActive }">
              <a :href="href" @click="navigate"
                class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors" :class="{
                  'bg-indigo-50 text-indigo-600 dark:bg-zinc-700 dark:text-indigo-400': isActive,
                  'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700': !isActive,
                  'justify-center': minimized
                }">
                <component :is="item.icon" class="flex-shrink-0 h-5 w-5" :class="{
                  'mr-3': !minimized,
                  'text-indigo-600 dark:text-indigo-400': isActive,
                  'text-zinc-500 group-hover:text-indigo-600 dark:text-zinc-400 dark:group-hover:text-indigo-400': !isActive
                }" />
                <transition name="slide-fade">
                  <span v-if="!minimized">{{ item.name }}</span>
                </transition>
                <span v-if="minimized" class="sr-only">{{ item.name }}</span>
              </a>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Dark Mode Toggle -->
      <div class="mt-auto p-4 border-t border-zinc-200 dark:border-zinc-700">
        <button @click="toggleDarkMode"
          class="flex items-center justify-between w-full p-2 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700">
          <div class="flex items-center">
            <MoonIcon v-if="isDark" class="h-5 w-5 text-indigo-400 mr-2" />
            <SunIcon v-else class="h-5 w-5 text-indigo-600 mr-2" />
            <transition name="slide-fade">
              <span v-if="!minimized" class="text-sm text-zinc-700 dark:text-zinc-300">
                {{ isDark ? 'Modo oscuro' : 'Modo claro' }}
              </span>
            </transition>
          </div>
          <div v-if="!minimized"
            class="relative inline-flex items-center h-5 rounded-full w-10 transition-colors duration-200 ease-in-out"
            :class="{
              'bg-indigo-600': !isDark,
              'bg-zinc-600': isDark
            }">
            <span :class="{
              'translate-x-5': isDark,
              'translate-x-0': !isDark
            }"
              class="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out" />
          </div>
        </button>
      </div>

      <!-- User Profile -->
      <div class="p-4 border-t border-zinc-200 dark:border-zinc-700 shrink-0">
        <div class="flex items-center" :class="{ 'justify-center': minimized }">
          <div class="relative">
            <img class="h-8 w-8 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="User profile">
            <span
              class="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white dark:ring-zinc-800"></span>
          </div>
          <transition name="slide-fade">
            <div v-if="!minimized" class="ml-3 overflow-hidden">
              <p class="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">John Doe</p>
              <p class="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">Admin</p>
            </div>
          </transition>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  // Iconos básicos
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MoonIcon,
  SunIcon,
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
  CubeIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline'
import { useDarkMode } from '@/composables/useDarkMode'

const { isDark, toggleDarkMode } = useDarkMode()

// Estado del sidebar
const minimized = ref(localStorage.getItem('sidebarMinimized') === 'true')
const mobileMenuOpen = ref(false)
const isMobile = ref(window.innerWidth < 1024)
const sidebar = ref(null)
const openSubmenus = ref({})

const toggleSubmenu = (name) => {
  openSubmenus.value = {
    ...openSubmenus.value,
    [name]: !openSubmenus.value[name]
  }
}

// Navegación mejorada con iconos más apropiados
const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  {
    name: 'Catálogo', icon: ShoppingCartIcon,
    children: [
      { name: 'Productos', to: '/products' },
      { name: 'Categorías', to: '/categories' },
      { name: 'Atributos', to: '/atributos' },
      { name: 'Subcategorías', to: '/products/subcategory' },
      /* { name: 'Unidades', to: '/products/measure-unit' },
      { name: 'Tipos', to: '/products/product-type' }, */
      { name: 'Marcas', to: '/brands' }
    ]
  },
  {
    name: 'Sire SUNAT', icon: DocumentDuplicateIcon,
    children: [
      { name: 'Compras', to: '/sire/compras' },
      { name: 'Compras Detalle', to: '/sire/compras-detalles' },
      { name: 'Ventas', to: '/sire/ventas' },

      /* { name: 'Resumen', to: '/sire/resumens' } */
    ]
  },
  /* { name: 'Ventas', to: '/sales', icon: UsersIcon },
  { name: 'Compras', to: '/purchases', icon: ShoppingCartIcon },
  { name: 'Movimientos', to: '/movements', icon: CubeIcon },
  { name: 'Reportes', to: '/reports', icon: ChartBarIcon },
  { name: 'Inventario', to: '/inventory', icon: FolderIcon }, */
]

const adminNavigation = [
  { name: 'Usuarios', to: '/admin/users', icon: UserGroupIcon },
  { name: 'Empresas', to: '/admin/companies', icon: ShieldCheckIcon },
  /* { name: 'Configuración', to: '/settings', icon: CogIcon }, */
]

// Minimizar/expandir sidebar
const toggleMinimize = () => {
  minimized.value = !minimized.value
  localStorage.setItem('sidebarMinimized', minimized.value.toString())
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
/* Transiciones mejoradas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(8px);
  opacity: 0;
}

/* Scrollbar personalizada */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.dark nav::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark nav::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Animación para el toggle de dark mode */
.toggle-enter-active,
.toggle-leave-active {
  transition: all 0.2s ease;
}

.toggle-enter-from,
.toggle-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
