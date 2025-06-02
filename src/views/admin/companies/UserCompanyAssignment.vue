<template>
  <div class="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      Asignación de Empresas a Usuarios
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Selección de Usuario -->
      <div>
        <label for="usuario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Seleccionar Usuario <span class="text-red-500">*</span>
        </label>
        <select id="usuario" v-model="selectedUserId" @change="loadUserCompanies"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          <option value="">Seleccione un usuario</option>
          <option v-for="user in usuariosActivos" :key="user.id" :value="user.id">
            {{ user.name }} ({{ user.email }})
          </option>
        </select>
      </div>

      <!-- Empresas asignadas -->
      <div v-if="selectedUserId">
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          Empresas Asignadas
        </h3>
        <div v-if="empresasAsignadas.length > 0" class="space-y-2">
          <div v-for="empresa in empresasAsignadas" :key="empresa.id"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <span>{{ empresa.nombre }} ({{ empresa.ruc }})</span>
            <button @click="removeAssignment(empresa.id)"
              class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Quitar asignación">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <p v-else class="text-gray-500 dark:text-gray-400">
          Este usuario no tiene empresas asignadas
        </p>
      </div>
    </div>

    <!-- Selección de Empresas -->
    <div v-if="selectedUserId" class="mt-6">
      <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
        Asignar Nuevas Empresas
      </h3>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="empresa in empresasDisponibles" :key="empresa.id"
            class="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
            <input :id="`empresa-${empresa.id}`" v-model="selectedEmpresas" :value="empresa.id" type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded">
            <label :for="`empresa-${empresa.id}`"
              class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ empresa.nombre }} <span class="text-gray-500">({{ empresa.ruc }})</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="button" @click="assignCompanies" :disabled="loading || selectedEmpresas.length === 0"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">Guardando...</span>
            <span v-else>Asignar Empresas Seleccionadas</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
/* import axios from 'axios' */
import api from '@/api/axios' // Asegúrate de tener configurado axios o tu cliente API

interface User {
  id: number
  name: string
  email: string
  active: boolean
}

interface Empresa {
  id: number
  nombre: string
  ruc: string
  estado: boolean
}

const loading = ref(false)
const usuariosActivos = ref<User[]>([])
const empresasActivas = ref<Empresa[]>([])
const selectedUserId = ref<number | null>(null)
const empresasAsignadas = ref<Empresa[]>([])
const selectedEmpresas = ref<number[]>([])

// Obtener usuarios activos
const fetchActiveUsers = async () => {
  try {
    const response = await api.get('/usuarios/activos')
    /* const response = await api.get('/user') */
    usuariosActivos.value = response.data.data
    console.log('Usuarios activos:', usuariosActivos.value)
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

// Obtener empresas activas
const fetchActiveCompanies = async () => {
  try {
    const response = await api.get('/lista-empresas/activas')
    /* const response = await api.get('/empresas') */
    empresasActivas.value = response.data.data
  } catch (error) {
    console.error('Error al cargar empresas:', error)
  }
}

// Cargar empresas asignadas a un usuario
const loadUserCompanies = async () => {
  if (!selectedUserId.value) return

  try {
    loading.value = true
    const response = await api.get(`/empresas-usuario/${selectedUserId.value}`)
    empresasAsignadas.value = response.data.data
    // Pre-seleccionar las empresas ya asignadas
    selectedEmpresas.value = empresasAsignadas.value.map(e => e.id)
  } catch (error) {
    console.error('Error al cargar empresas asignadas:', error)
  } finally {
    loading.value = false
  }
}

// Asignar empresas a usuario
const assignCompanies = async () => {
  if (!selectedUserId.value || selectedEmpresas.value.length === 0) return

  try {
    loading.value = true
    await api.post('/user-companies/assign', {
      user_id: selectedUserId.value,
      empresas: selectedEmpresas.value
    })
    await loadUserCompanies()
  } catch (error) {
    console.error('Error al asignar empresas:', error)
  } finally {
    loading.value = false
  }
}

// Eliminar asignación
const removeAssignment = async (empresaId: number) => {
  if (!selectedUserId.value) return

  try {
    loading.value = true
    await api.delete('/user-companies/remove', {
      data: {
        user_id: selectedUserId.value,
        empresa_id: empresaId
      }
    })
    await loadUserCompanies()
    // Remover de selección si está ahí
    selectedEmpresas.value = selectedEmpresas.value.filter(id => id !== empresaId)
  } catch (error) {
    console.error('Error al eliminar asignación:', error)
  } finally {
    loading.value = false
  }
}

// Inicializar datos
onMounted(async () => {
  await Promise.all([fetchActiveUsers(), fetchActiveCompanies()])
})

// Computed para empresas disponibles (no asignadas)
const empresasDisponibles = computed(() => {
  return empresasActivas.value.filter(empresa =>
    !empresasAsignadas.value.some(asignada => asignada.id === empresa.id)
  )
})
</script>
