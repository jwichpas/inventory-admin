<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
    <!-- Header -->
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Listado completo de usuarios registrados</p>
        </div>

        <div class="flex gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:w-64">
            <input v-model="searchQuery" type="text" placeholder="Buscar usuarios..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <button @click="openCreateModal"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <PlusIcon class="h-5 w-5" />
            <span class="hidden sm:inline">Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">+{{ stats.newLastMonth }} este mes</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Activos</p>
          <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{{ stats.active }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ stats.activePercentage }}% del total</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Administradores</p>
          <p class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{{ stats.admins }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ stats.adminsPercentage }}% del total</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Último registro</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.lastRegistered }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Hace {{ stats.lastRegisteredTime }}</p>
        </div>
      </div>

      <!-- Users Table -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th v-for="header in headers" :key="header.key" scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <div class="flex items-center">
                    {{ header.label }}
                    <button v-if="header.sortable" @click="sortBy(header.key)" class="ml-1 focus:outline-none">
                      <ArrowsUpDownIcon class="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </th>
                <th scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="filteredUsers.length === 0">
                <td :colspan="headers.length + 1"
                  class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No se encontraron usuarios
                </td>
              </tr>

              <tr v-for="user in paginatedUsers" :key="user.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img :src="user.avatar || 'https://ui-avatars.com/api/?name=' + user.name + '&background=random'"
                        :alt="user.name" class="h-10 w-10 rounded-full">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.name }}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400': user.active,
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': !user.active
                  }" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ user.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ user.role }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ user.last_login ? formatDateTime(user.last_login) : 'Nunca' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-3">
                    <button @click="editUser(user)"
                      class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      title="Editar">
                      <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button @click="confirmDelete(user)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar">
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                Mostrando
                <span class="font-medium">{{ pagination.from }}</span>
                a
                <span class="font-medium">{{ pagination.to }}</span>
                de
                <span class="font-medium">{{ pagination.total }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click="prevPage" :disabled="pagination.currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="sr-only">Anterior</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>

                <button v-for="page in pagination.totalPages" :key="page" @click="goToPage(page)" :class="{
                  'z-10 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-600 dark:text-indigo-300': pagination.currentPage === page,
                  'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600': pagination.currentPage !== page
                }" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  {{ page }}
                </button>

                <button @click="nextPage" :disabled="pagination.currentPage === pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="sr-only">Siguiente</span>
                  <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Form Modal -->
    <UserFormModal :isOpen="isModalOpen" :user="selectedUser" @close="closeModal" @saved="handleUserSaved" />

    <!-- Delete Confirmation Modal -->
    <ConfirmationModal :isOpen="isDeleteModalOpen" title="Confirmar eliminación"
      message="¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer." confirmText="Eliminar"
      cancelText="Cancelar" @confirm="deleteUser" @cancel="cancelDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/outline'
import UserFormModal from '@/components/user/UserFormModal.vue'
import ConfirmationModal from '@/components/ConfirmationModal.vue'
import api from '@/api/axios' // Asegúrate de tener configurado axios o tu cliente API

interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: string
  active: boolean
  created_at: string
  last_login?: string
}

interface Header {
  key: string
  label: string
  sortable: boolean
}

interface Stats {
  total: number
  active: number
  activePercentage: number
  admins: number
  adminsPercentage: number
  newLastMonth: number
  lastRegistered: string
  lastRegisteredTime: string
}

interface Pagination {
  currentPage: number
  total: number
  totalPages: number
  from: number
  to: number
  perPage: number
}

// Data
const users = ref<User[]>([])
const searchQuery = ref('')
const sortField = ref('name')
const sortDirection = ref<'asc' | 'desc'>('asc')
const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)

// Stats
const stats = ref<Stats>({
  total: 0,
  active: 0,
  activePercentage: 0,
  admins: 0,
  adminsPercentage: 0,
  newLastMonth: 0,
  lastRegistered: '',
  lastRegisteredTime: ''
})

// Pagination
const pagination = ref<Pagination>({
  currentPage: 1,
  total: 0,
  totalPages: 0,
  from: 0,
  to: 0,
  perPage: 10
})

// Table headers
const headers = ref<Header[]>([
  { key: 'name', label: 'Usuario', sortable: true },
  { key: 'active', label: 'Estado', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'created_at', label: 'Fecha Registro', sortable: true },
  { key: 'last_login', label: 'Último Acceso', sortable: true }
])

// Computed
const filteredUsers = computed(() => {
  let result = users.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }

  // Sorting
  result.sort((a, b) => {
    const modifier = sortDirection.value === 'desc' ? -1 : 1
    const aValue = a[sortField.value as keyof User]
    const bValue = b[sortField.value as keyof User]

    if (aValue < bValue) return -1 * modifier
    if (aValue > bValue) return 1 * modifier
    return 0
  })

  return result
})

const paginatedUsers = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.perPage
  const end = start + pagination.value.perPage
  return filteredUsers.value.slice(start, end)
})

// Methods
const fetchUsers = async () => {
  try {
    const response = await api.get('/usuarios')
    const data = response.data.data

    users.value = data.users
    stats.value = data.stats

    updatePagination()
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const updatePagination = () => {
  pagination.value.total = filteredUsers.value.length
  pagination.value.totalPages = Math.ceil(filteredUsers.value.length / pagination.value.perPage)
  pagination.value.from = (pagination.value.currentPage - 1) * pagination.value.perPage + 1
  pagination.value.to = Math.min(
    pagination.value.currentPage * pagination.value.perPage,
    filteredUsers.value.length
  )
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const goToPage = (page: number) => {
  pagination.value.currentPage = page
}

const nextPage = () => {
  if (pagination.value.currentPage < pagination.value.totalPages) {
    pagination.value.currentPage++
  }
}

const prevPage = () => {
  if (pagination.value.currentPage > 1) {
    pagination.value.currentPage--
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('es-ES')
}

const openCreateModal = () => {
  selectedUser.value = null
  isModalOpen.value = true
}

const editUser = (user: User) => {
  selectedUser.value = { ...user }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedUser.value = null
}

const handleUserSaved = (user: User) => {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index >= 0) {
    users.value[index] = user
  } else {
    users.value.unshift(user)
  }
  closeModal()
  fetchUsers() // Refresh stats
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  isDeleteModalOpen.value = true
}

const cancelDelete = () => {
  userToDelete.value = null
  isDeleteModalOpen.value = false
}

const deleteUser = async () => {
  if (!userToDelete.value) return

  try {
    // Simulación de API
    // En producción, reemplazar con llamada real a tu API
    await fetch(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    })

    users.value = users.value.filter(user => user.id !== userToDelete.value?.id)
    updatePagination()
    fetchUsers() // Refresh stats
  } catch (error) {
    console.error('Error deleting user:', error)
  } finally {
    cancelDelete()
  }
}

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>
