<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo y menú izquierdo -->
          <div class="flex items-center">
            <router-link to="/app/dashboard" class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="@/assets/logo.svg" alt="Logo">
            </router-link>
            <!-- Menú de navegación -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link v-for="item in navigation" :key="item.name" :to="item.to"
                class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                {{ item.name }}
              </router-link>
            </div>
          </div>

          <!-- Menú derecho -->
          <div class="flex items-center">
            <!-- Perfil del usuario -->
            <div class="ml-3 relative">
              <div>
                <button
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span class="sr-only">Abrir menú de usuario</span>
                  <img class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                    alt="">
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenido principal -->
    <main class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppLayout',
  setup() {
    const navigation = [
      { name: 'Dashboard', to: '/app/dashboard' },
      { name: 'Inventario', to: '/app/inventory' },
      { name: 'Ventas', to: '/app/sales' }
    ]

    return {
      navigation
    }
  }
})
</script>
