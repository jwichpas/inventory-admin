<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Tabs para navegar entre atributos y tipos -->
    <div class="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav class="-mb-px flex space-x-8">
        <button v-for="tab in tabs" :key="tab.name" @click="currentTab = tab.name" :class="[
          currentTab === tab.name
            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
          'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
        ]">
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Listado de Tipos de Atributos -->
    <div v-if="currentTab === 'types'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Tipos de Atributos</h2>
        <button @click="openTypeModal(null)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nuevo Tipo
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre</th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <template v-if="attributeTypes.length > 0">
              <tr v-for="types in attributeTypes" :key="types.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ types.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button @click="openTypeModal(types)"
                    class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Editar
                  </button>
                  <button @click="deleteAttributeType(types.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    Eliminar
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="2" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No hay tipos de atributos disponibles
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Listado de Atributos -->
    <div v-if="currentTab === 'attributes'" class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Atributos</h2>
        <button @click="openAttributeModal(null)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600">
          <PlusIcon class="h-5 w-5 mr-2" />
          Nuevo Atributo
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Tipo</th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Valor</th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <template v-if="attributes.length > 0">
              <tr v-for="attribute in attributes" :key="attribute.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ getTypeName(attribute.id_tipo) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                  {{ attribute.valor }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <button @click="openAttributeModal(attribute)"
                    class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Editar
                  </button>
                  <button @click="deleteAttribute(attribute.id)"
                    class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                    Eliminar
                  </button>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="2" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No hay atributos disponibles
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Tipos de Atributos -->
    <ModalBase :isOpen="showTypeModal" @close="closeTypeModal">
      <template #title>
        {{ editingType ? 'Editar Tipo de Atributo' : 'Nuevo Tipo de Atributo' }}
      </template>

      <form @submit.prevent="saveAttributeType">
        <div class="space-y-4">
          <div>
            <label for="type-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
            <input type="text" id="type-name" v-model="typeForm.name"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button type="button" @click="closeTypeModal"
            class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button type="submit" :disabled="savingType"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            <span v-if="!savingType">Guardar</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Guardando...
            </span>
          </button>
        </div>
      </form>
    </ModalBase>

    <!-- Modal para Atributos -->
    <ModalBase :isOpen="showAttributeModal" @close="closeAttributeModal">
      <template #title>
        {{ editingAttribute ? 'Editar Atributo' : 'Nuevo Atributo' }}
      </template>

      <form @submit.prevent="saveAttribute">
        <div class="space-y-4">
          <div>
            <label for="attribute-type" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
            <select id="attribute-type" v-model="attributeForm.id_tipo"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required>
              <option value="">Seleccione un tipo</option>
              <option v-for="type in attributeTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="attribute-value"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
            <input type="text" id="attribute-value" v-model="attributeForm.valor"
              class="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              required />
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button type="button" @click="closeAttributeModal"
            class="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button type="submit" :disabled="savingAttribute"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            <span v-if="!savingAttribute">Guardar</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Guardando...
            </span>
          </button>
        </div>
      </form>
    </ModalBase>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import ModalBase from '@/components/inventario/ModalBase.vue'
/* import axios from 'axios' */
import api from '@/api/axios'

interface AttributeType {
  id: number
  id_empresa: number
  name: string
}

interface Attribute {
  id: number
  id_empresa: number
  id_tipo: number
  valor: string
}

// Tabs
const tabs = [
  { name: 'types', label: 'Tipos de Atributos' },
  { name: 'attributes', label: 'Atributos' }
]
const currentTab = ref('types')

// Datos
const attributeTypes = ref<AttributeType[]>([])
const attributes = ref<Attribute[]>([])

// Modales y formularios
const showTypeModal = ref(false)
const showAttributeModal = ref(false)
const editingType = ref<AttributeType | null>(null)
const editingAttribute = ref<Attribute | null>(null)
const savingType = ref(false)
const savingAttribute = ref(false)

const typeForm = ref({
  name: ''
})

const attributeForm = ref({
  id_tipo: '',
  valor: ''
})

// Obtener empresaId del localStorage
const empresaId = ref<number>(parseInt(localStorage.getItem('empresaId') || '0'))

// Métodos
const fetchAttributeTypes = async () => {
  try {
    const response = await api.get(`/tipo-atributo?id_empresa=${empresaId.value}`)
    attributeTypes.value = response.data.data.data
  } catch (error) {
    console.error('Error fetching attribute types:', error)
  }
}

const fetchAttributes = async () => {
  try {
    const response = await api.get(`/lista-atributo?id_empresa=${empresaId.value}`)
    attributes.value = response.data.data.data
  } catch (error) {
    console.error('Error fetching attributes:', error)
  }
}

const openTypeModal = (type: AttributeType | null) => {
  editingType.value = type
  typeForm.value = {
    name: type?.name || ''
  }
  showTypeModal.value = true
}

const closeTypeModal = () => {
  showTypeModal.value = false
  editingType.value = null
}

const openAttributeModal = (attribute: Attribute | null) => {
  editingAttribute.value = attribute
  attributeForm.value = {
    id_tipo: attribute?.id_tipo.toString() || '',
    valor: attribute?.valor || ''
  }
  showAttributeModal.value = true
}

const closeAttributeModal = () => {
  showAttributeModal.value = false
  editingAttribute.value = null
}

const saveAttributeType = async () => {
  savingType.value = true
  try {
    const data = {
      id_empresa: empresaId.value,
      name: typeForm.value.name
    }

    if (editingType.value) {
      await api.put(`/tipo-atributo/${editingType.value.id}`, data)
    } else {
      await api.post('/tipo-atributo', data)
    }

    await fetchAttributeTypes()
    closeTypeModal()
  } catch (error) {
    console.error('Error saving attribute type:', error)
  } finally {
    savingType.value = false
  }
}

const saveAttribute = async () => {
  savingAttribute.value = true
  try {
    const data = {
      id_empresa: empresaId.value,
      id_tipo: parseInt(attributeForm.value.id_tipo),
      valor: attributeForm.value.valor
    }

    if (editingAttribute.value) {
      await api.put(`/lista-atributo/${editingAttribute.value.id}`, data)
    } else {
      await api.post('/lista-atributo', data)
    }

    await fetchAttributes()
    closeAttributeModal()
  } catch (error) {
    console.error('Error saving attribute:', error)
  } finally {
    savingAttribute.value = false
  }
}

const deleteAttributeType = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este tipo de atributo?')) {
    try {
      await api.delete(`/tipo-atributo/${id}`)
      await fetchAttributeTypes()
    } catch (error) {
      console.error('Error deleting attribute type:', error)
    }
  }
}

const deleteAttribute = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este atributo?')) {
    try {
      await api.delete(`/lista-atributo/${id}`)
      await fetchAttributes()
    } catch (error) {
      console.error('Error deleting attribute:', error)
    }
  }
}

const getTypeName = (typeId: number) => {
  const type = attributeTypes.value.find(t => t.id === typeId)
  return type ? type.name : 'Desconocido'
}

// Inicialización
onMounted(() => {
  fetchAttributeTypes()
  fetchAttributes()
})
</script>
