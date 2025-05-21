<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
    <!-- Sidebar -->
    <Sidebar ref="sidebar" class="fixed inset-y-0 z-20" />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col transition-all duration-300 ease-in-out" :class="{
      'lg:pl-64': !$refs.sidebar?.minimized,
      'lg:pl-20': $refs.sidebar?.minimized
    }">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Título y breadcrumbs -->
            <div class="flex items-center space-x-4">
              <!-- Botón para mobile -->
              <button @click="$refs.sidebar.toggleMinimize()"
                class="lg:hidden p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none transition-colors">
                <Bars3Icon class="h-5 w-5" />
              </button>

              <h1 class="text-xl font-bold text-neutral-900 dark:text-white">
                {{ $route.meta.title || 'Dashboard' }}
              </h1>

              <nav class="hidden md:flex items-center space-x-1 text-sm">
                <router-link v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.path"
                  class="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                  {{ crumb.meta.title }}
                  <span v-if="index < breadcrumbs.length - 1" class="mx-1">/</span>
                </router-link>
              </nav>
            </div>

            <!-- User menu y notificaciones -->
            <div class="flex items-center space-x-4">
              <button
                class="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 relative">
                <BellIcon class="h-5 w-5" />
                <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div class="relative">
                <button @click="toggleUserMenu" class="flex items-center space-x-2 focus:outline-none">
                  <div
                    class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                    {{ userInitials }}
                  </div>
                  <span class="hidden md:inline text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {{ userName }}
                  </span>
                  <ChevronDownIcon class="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </button>

                <!-- Menú desplegable usuario -->
                <transition enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <div v-if="showUserMenu"
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                    <div class="py-1">
                      <router-link to="/profile"
                        class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                        Mi perfil
                      </router-link>
                      <router-link to="/settings"
                        class="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                        Configuración
                      </router-link>
                      <button @click="logout"
                        class="w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="flex-1 overflow-y-auto focus:outline-none">
        <div class="py-6 px-4 sm:px-6 lg:px-8">
          <!-- Aquí va el contenido dinámico -->
          <div class="max-w-full mx-auto">
            <div
              class="bg-white dark:bg-neutral-950 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
              <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in" enter-active-class="transition-opacity duration-300 ease-out"
                  enter-from-class="opacity-0" enter-to-class="opacity-100"
                  leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
                  <component :is="Component" />
                </transition>
              </router-view>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import Sidebar from '@/components/SideBarView.vue'
const sidebar = ref(null)
const showUserMenu = ref(false)
const route = useRoute()

// Datos de ejemplo del usuario
const userName = 'John Doe'
const userInitials = computed(() => {
  return userName.split(' ').map(n => n[0]).join('')
})

const breadcrumbs = computed(() => {
  // Lógica para generar breadcrumbs basada en la ruta actual
  return []
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  // Lógica para cerrar sesión
  console.log('Cerrando sesión...')
}

</script>
<style>
/* Efecto de transición suave para el contenido */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
