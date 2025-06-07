<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-900 dark:text-zinc-100">Gestión de Tipos de Documento</h1>
    <div>
      <!-- Tabs -->
      <div class="border-b border-gray-200 dark:border-zinc-700 mb-4">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button :class="[
            tab === 'documento'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-indigo-600 hover:border-indigo-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none'
          ]" @click="tab = 'documento'">
            Tipos de Documento
          </button>
          <button :class="[
            tab === 'identidad'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-indigo-600 hover:border-indigo-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none'
          ]" @click="tab = 'identidad'">
            Tipos de Documento Identidad
          </button>
        </nav>
      </div>

      <!-- TAB: Tipos de Documento -->
      <div v-if="tab === 'documento'">
        <div class="flex justify-end mb-4">
          <button @click="openModal('documento')"
            class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
            + Nuevo
          </button>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead class="bg-gray-100 dark:bg-zinc-900">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Código
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">
                  Descripción
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Símbolo
                </th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in tipoDocumentos" :key="doc.id" class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="px-4 py-2 text-gray-900 dark:text-zinc-100">{{ doc.codigo }}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-zinc-300">{{ doc.descripcion }}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-zinc-300">{{ doc.simbolo }}</td>
                <td class="px-4 py-2 flex gap-2">
                  <button @click="openModal('documento', doc)"
                    class="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium">Editar</button>
                  <button @click="deleteTipoDocumento(doc.id)"
                    class="px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB: Tipos de Documento Identidad -->
      <div v-if="tab === 'identidad'">
        <div class="flex justify-end mb-4">
          <button @click="openModal('identidad')"
            class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
            + Nuevo
          </button>
        </div>
        <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead class="bg-gray-100 dark:bg-zinc-900">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Código
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-zinc-400 uppercase">Nombre
                </th>
                <th class="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in tipoDocumentoIdentidad" :key="doc.id"
                class="border-b border-zinc-100 dark:border-zinc-800">
                <td class="px-4 py-2 text-gray-900 dark:text-zinc-100">{{ doc.codigo }}</td>
                <td class="px-4 py-2 text-gray-700 dark:text-zinc-300">{{ doc.name }}</td>
                <td class="px-4 py-2 flex gap-2">
                  <button @click="openModal('identidad', doc)"
                    class="px-2 py-1 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium">Editar</button>
                  <button @click="deleteTipoDocumentoIdentidad(doc.id)"
                    class="px-2 py-1 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MODAL CREAR/EDITAR usando HeadlessUI Dialog -->
      <TransitionRoot appear :show="showModal" as="template">
        <Dialog as="div" class="relative z-50" @close="closeModal">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
            leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-black bg-opacity-40" />
          </TransitionChild>
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95">
                <DialogPanel
                  class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all border border-zinc-200 dark:border-zinc-700">
                  <DialogTitle as="h2" class="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-4">
                    {{ modalType === 'documento'
                      ? (editId ? 'Editar Tipo de Documento' : 'Nuevo Tipo de Documento')
                      : (editIdIdentidad ? 'Editar Tipo de Documento Identidad' : 'Nuevo Tipo de Documento Identidad')
                    }}
                  </DialogTitle>
                  <form
                    @submit.prevent="modalType === 'documento' ? saveTipoDocumento() : saveTipoDocumentoIdentidad()">
                    <div v-if="modalType === 'documento'" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Código</label>
                        <input v-model="form.codigo" required maxlength="10"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100" />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Descripción</label>
                        <input v-model="form.descripcion" required maxlength="100"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Símbolo</label>
                        <input v-model="form.simbolo" required maxlength="10"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100" />
                      </div>
                    </div>
                    <div v-if="modalType === 'identidad'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Código</label>
                        <input v-model="formIdentidad.codigo" required maxlength="10"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Nombre</label>
                        <input v-model="formIdentidad.name" required maxlength="100"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100" />
                      </div>
                    </div>
                    <div class="mt-6 flex gap-2 justify-end">
                      <button type="submit"
                        class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 font-medium">
                        {{ (modalType === 'documento' ? editId : editIdIdentidad) ? 'Actualizar' : 'Crear' }}
                      </button>
                      <button type="button" @click="closeModal"
                        class="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-300 dark:hover:bg-zinc-700 font-medium">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// --- Tipo Documento ---
const tipoDocumentos = ref<any[]>([])
const form = ref({ codigo: '', descripcion: '', simbolo: '' })
const editId = ref<number | null>(null)

const fetchTipoDocumentos = async () => {
  const { data } = await api.get('/tipo-documento')
  tipoDocumentos.value = data
}
const saveTipoDocumento = async () => {
  if (editId.value) {
    await api.put(`/tipo-documento/${editId.value}`, form.value)
  } else {
    await api.post('/tipo-documento', form.value)
  }
  resetForm()
  fetchTipoDocumentos()
}
const editTipoDocumento = (doc: any) => {
  editId.value = doc.id
  form.value = { codigo: doc.codigo, descripcion: doc.descripcion, simbolo: doc.simbolo }
}
const deleteTipoDocumento = async (id: number) => {
  if (confirm('¿Eliminar este tipo de documento?')) {
    await api.delete(`/tipo-documento/${id}`)
    fetchTipoDocumentos()
  }
}
const resetForm = () => {
  editId.value = null
  form.value = { codigo: '', descripcion: '', simbolo: '' }
}

// --- Tipo Documento Identidad ---
const tipoDocumentoIdentidad = ref<any[]>([])
const formIdentidad = ref({ codigo: '', name: '' })
const editIdIdentidad = ref<number | null>(null)

const fetchTipoDocumentoIdentidad = async () => {
  const { data } = await api.get('/tipo-doc-identidad')
  tipoDocumentoIdentidad.value = data
}
const saveTipoDocumentoIdentidad = async () => {
  if (editIdIdentidad.value) {
    await api.put(`/tipo-doc-identidad/${editIdIdentidad.value}`, formIdentidad.value)
  } else {
    await api.post('/tipo-doc-identidad', formIdentidad.value)
  }
  resetFormIdentidad()
  fetchTipoDocumentoIdentidad()
}
const editTipoDocumentoIdentidad = (doc: any) => {
  editIdIdentidad.value = doc.id
  formIdentidad.value = { codigo: doc.codigo, name: doc.name }
}
const deleteTipoDocumentoIdentidad = async (id: number) => {
  if (confirm('¿Eliminar este tipo de documento identidad?')) {
    await api.delete(`/tipo-doc-identidad/${id}`)
    fetchTipoDocumentoIdentidad()
  }
}
const resetFormIdentidad = () => {
  editIdIdentidad.value = null
  formIdentidad.value = { codigo: '', name: '' }
}

const tab = ref<'documento' | 'identidad'>('documento')

// Modal state
const showModal = ref(false)
const modalType = ref<'documento' | 'identidad'>('documento')

onMounted(() => {
  fetchTipoDocumentos()
  fetchTipoDocumentoIdentidad()
})

// Abrir modal para crear o editar
function openModal(type: 'documento' | 'identidad', doc?: any) {
  modalType.value = type
  showModal.value = true
  if (type === 'documento') {
    if (doc) {
      editId.value = doc.id
      form.value = { codigo: doc.codigo, descripcion: doc.descripcion, simbolo: doc.simbolo }
    } else {
      resetForm()
    }
  } else {
    if (doc) {
      editIdIdentidad.value = doc.id
      formIdentidad.value = { codigo: doc.codigo, name: doc.name }
    } else {
      resetFormIdentidad()
    }
  }
}
function closeModal() {
  showModal.value = false
  resetForm()
  resetFormIdentidad()
}
</script>
