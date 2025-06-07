<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950  dark:text-zinc-500 flex overflow-x-hidden">
    <!-- Sidebar y overlay para mobile -->
    <div v-if="mobileSidebarOpen" class="fixed inset-0 z-10 bg-black/50 lg:hidden" @click="mobileSidebarOpen = false">
    </div>

    <!-- Sidebar -->
    <Sidebar ref="sidebar" class="fixed inset-y-0 z-20"
      :class="{ 'translate-x-0': mobileSidebarOpen, '-translate-x-full lg:translate-x-0': !mobileSidebarOpen }" />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0" :class="{
      'lg:pl-64': !$refs.sidebar?.minimized,
      'lg:pl-20': $refs.sidebar?.minimized
    }">
      <!-- Header -->
      <header
        class="sticky top-0 z-10 bg-white dark:bg-zinc-950 shadow-sm border-b border-zinc-200 dark:border-zinc-700">
        <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <!-- Título y breadcrumbs -->
            <div class="flex items-center space-x-4">
              <!-- Botón para mobile -->
              <button @click="mobileSidebarOpen = !mobileSidebarOpen"
                class="lg:hidden p-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none transition-colors">
                <Bars3Icon class="h-5 w-5 hidden" />
              </button>

              <h1 class="text-xl font-bold text-zinc-900 dark:text-white truncate">
                {{ route.meta.title || 'Dashboard' }}
              </h1>

              <nav class="hidden md:flex items-center space-x-1 text-sm">
                <router-link v-for="(crumb, index) in breadcrumbs" :key="index" :to="crumb.path"
                  class="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors truncate">
                  {{ crumb.meta.title }}
                  <span v-if="index < breadcrumbs.length - 1" class="mx-1">/</span>
                </router-link>
              </nav>
            </div>

            <!-- User menu y notificaciones -->
            <div class="flex items-center space-x-4">
              <!-- Botón de toggle para modo oscuro -->
              <button @click="toggleDarkMode"
                class="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700">
                <MoonIcon v-if="isDark" class="h-5 w-5" />
                <SunIcon v-else class="h-5 w-5" />
              </button>

              <button
                class="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 relative">
                <BellIcon class="h-5 w-5" />
                <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div class="relative">
                <button @click.stop="toggleUserMenu"
                  class="flex items-center space-x-2 focus:outline-none text-xs md:text-sm h-8 md:h-10">
                  <div
                    class="h-7 w-7 md:h-8 md:w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium text-xs md:text-sm">
                    {{ userInitials }}
                  </div>
                  <span
                    class="hidden md:inline text-xs md:text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-xs">
                    {{ userName }}
                  </span>
                  <ChevronDownIcon class="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </button>
                <transition enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <div v-if="showUserMenu" v-click-outside="closeUserMenu" @mousedown.stop
                    class="origin-top-right absolute right-0 mt-2 w-64 md:w-80 rounded-xl shadow-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-30 p-0 overflow-hidden transition-all text-xs md:text-sm">
                    <!-- Perfil -->
                    <div
                      class="flex items-center gap-2 md:gap-3 px-3 md:px-5 pt-3 md:pt-5 pb-2 md:pb-3 border-b border-zinc-200 dark:border-zinc-800">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg"
                        class="h-9 w-9 md:h-12 md:w-12 rounded-full border-2 border-green-400 object-cover"
                        alt="Avatar" />
                      <div class="flex-1 min-w-0">
                        <div class="font-semibold text-zinc-900 dark:text-zinc-100 text-xs md:text-sm leading-tight">{{
                          userName }}</div>
                        <div class="text-xs text-zinc-500 dark:text-zinc-400 truncate">{{ user?.email }}</div>
                      </div>
                      <span
                        class="ml-2 px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700">Pro
                      </span>
                    </div>
                    <!-- Opciones -->
                    <div class="py-1 md:py-2 px-1 md:px-2 divide-y divide-zinc-200 dark:divide-zinc-800">
                      <a href="#"
                        class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs md:text-sm font-medium">
                        <svg class="h-4 w-4 md:h-5 md:w-5 text-zinc-400" fill="none" stroke="currentColor"
                          stroke-width="2" viewBox="0 0 24 24">
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Public Profile
                      </a>
                      <a href="#"
                        class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs md:text-sm font-medium">
                        <svg class="h-4 w-4 md:h-5 md:w-5 text-zinc-400" fill="none" stroke="currentColor"
                          stroke-width="2" viewBox="0 0 24 24">
                          <path
                            d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        My Profile
                      </a>
                      <a href="#"
                        class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs md:text-sm font-medium">
                        <svg class="h-4 w-4 md:h-5 md:w-5 text-zinc-400" fill="none" stroke="currentColor"
                          stroke-width="2" viewBox="0 0 24 24">
                          <path d="M12 4v16m8-8H4" />
                        </svg>
                        My Account
                        <ChevronDownIcon class="h-3 w-3 md:h-4 md:w-4 ml-auto text-zinc-400" />
                      </a>
                      <a href="#"
                        class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs md:text-sm font-medium">
                        <svg class="h-4 w-4 md:h-5 md:w-5 text-zinc-400" fill="none" stroke="currentColor"
                          stroke-width="2" viewBox="0 0 24 24">
                          <path d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5" />
                        </svg>
                        Dev Forum
                      </a>
                      <div
                        class="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-zinc-700 dark:text-zinc-200 text-xs md:text-sm font-medium">
                        <svg class="h-4 w-4 md:h-5 md:w-5 text-zinc-400" fill="none" stroke="currentColor"
                          stroke-width="2" viewBox="0 0 24 24">
                          <path d="M12 6v6l4 2" />
                        </svg>
                        Language
                        <span
                          class="ml-auto flex items-center gap-1 bg-zinc-100 border border-zinc-200 px-1.5 md:px-2 py-0.5 rounded text-2xs md:text-xs dark:bg-zinc-800 dark:border-zinc-700">
                          English <img src="https://hatscripts.github.io/circle-flags/flags/us.svg"
                            class="h-3 w-3 md:h-4 md:w-4 rounded-full" alt="US" />
                        </span>
                      </div>
                    </div>
                    <div class="py-1 md:py-2 px-1 md:px-2 border-t border-zinc-200 dark:border-zinc-800">
                      <div class="flex items-center justify-between px-2 md:px-3 py-1.5 md:py-2">
                        <div
                          class="flex items-center gap-1.5 md:gap-2 text-zinc-700 dark:text-zinc-200 text-xs md:text-sm font-medium">
                          <svg class="h-4 w-4 md:h-5 md:w-5 text-zinc-400" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path d="M21 12.79A9 9 0 1111.21 3h.01" />
                          </svg>
                          Dark Mode
                        </div>
                        <button @click="toggleDarkMode"
                          class="relative inline-flex items-center h-5 md:h-6 rounded-full w-9 md:w-11 transition-colors duration-200 focus:outline-none"
                          :class="{ 'bg-blue-600': darkMode, 'bg-zinc-700': !darkMode }">
                          <span :class="{ 'translate-x-5': darkMode, 'translate-x-1': !darkMode }"
                            class="inline-block w-3.5 md:w-4 h-3.5 md:h-4 transform bg-white rounded-full transition-transform duration-200" />
                        </button>
                      </div>
                      <button @click="logout"
                        class="w-full mt-1 md:mt-2 text-center px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                        Log out
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
              class="bg-white dark:bg-zinc-950 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
              <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in" enter-active-class="transition-opacity duration-300 ease-out"
                  enter-from-class="opacity-0" enter-to-class="opacity-100"
                  leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100"
                  leave-to-class="opacity-0">
                  <div class="space-y-6">
                    <component :is="Component" />
                  </div>
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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDarkMode } from '@/composables/useDarkMode'
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/vue/24/outline'
import Sidebar from '@/components/SideBarView.vue'

interface Breadcrumb {
  path: string
  meta: {
    title: string
  }
}

const sidebar = ref<InstanceType<typeof Sidebar> | null>(null)
const showUserMenu = ref(false)
const mobileSidebarOpen = ref(false)

// Modo oscuro (puedes ajustar según tu lógica)
const darkMode = ref(false)
const { isDark, toggleDarkMode } = useDarkMode()

// Usuario
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const user = computed(() => authStore.user)
const userName = computed(() => user.value?.name || '')
const userInitials = computed(() => user.value?.name ? user.value.name.split(' ').map(n => n[0]).join('') : '')

// Breadcrumbs (a implementar si lo necesitas)
const breadcrumbs = computed<Breadcrumb[]>(() => {
  return []
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
