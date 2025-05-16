<template>
  <div class="h-screen flex overflow-hidden bg-gray-100 dark:bg-slate-500">
    <!-- Sidebar -->
    <Sidebar ref="sidebar" />

    <!-- Contenido principal -->
    <div class="flex-1 overflow-auto focus:outline-none" :class="{
      'lg:ml-64': !$refs.sidebar?.minimized,
      'lg:ml-20': $refs.sidebar?.minimized
    }">
      <!-- Header -->
      <header class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 class="text-lg font-semibold leading-tight text-gray-900">
            {{ $route.meta.title || 'Dashboard' }}
          </h1>

          <!-- Botón para mobile -->
          <button @click="$refs.sidebar.toggleMinimize()"
            class="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none">
            <Bars3Icon class="h-5 w-5" />
          </button>
        </div>
      </header>


      <!-- Contenido -->
      <!-- Contenido -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <!-- Aquí va el contenido dinámico -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/SidebarView.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'

</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
