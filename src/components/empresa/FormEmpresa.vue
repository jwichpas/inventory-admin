<template>
  <div class="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">
      {{ empresaId ? 'Editar Empresa' : 'Nueva Empresa' }}
    </h2>

    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Sección 1: Información Básica -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border-b pb-4 md:border-b-0 md:pb-0">
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Información Básica</h3>

          <div class="space-y-4">
            <div>
              <label for="nombre" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre de la Empresa <span class="text-red-500">*</span>
              </label>
              <input id="nombre" v-model="formData.nombre" type="text" required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="ruc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RUC <span class="text-red-500">*</span>
              </label>
              <input id="ruc" v-model="formData.ruc" type="text" required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="direccion" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección
              </label>
              <input id="direccion" v-model="formData.direccion" type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="telefono" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Teléfono
              </label>
              <input id="telefono" v-model="formData.telefono" type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="correo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Correo Electrónico
              </label>
              <input id="correo" v-model="formData.correo" type="email"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>

        <!-- Sección 2: Credenciales SOL -->
        <div>
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Credenciales SUNAT</h3>

          <div class="space-y-4">
            <div>
              <label for="usuario_sol" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Usuario SOL
              </label>
              <input id="usuario_sol" v-model="formData.usuario_sol" type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="clave_sol" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Clave SOL
              </label>
              <input id="clave_sol" v-model="formData.clave_sol" type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="cliente_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente ID
              </label>
              <input id="cliente_id" v-model="formData.cliente_id" type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="cliente_secret" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente Secret
              </label>
              <input id="cliente_secret" v-model="formData.cliente_secret" type="password"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 3: Régimen Tributario y Laboral -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Régimen Tributario</h3>

          <div class="space-y-4">
            <div>
              <label for="regimen_tributario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Régimen Tributario
              </label>
              <input id="regimen_tributario" v-model="formData.regimen_tributario" type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="regimen_t_desde" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vigente desde
              </label>
              <input id="regimen_t_desde" v-model="formData.regimen_t_desde" type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Régimen Laboral</h3>

          <div class="space-y-4">
            <div>
              <label for="regimen_laboral" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Régimen Laboral
              </label>
              <input id="regimen_laboral" v-model="formData.regimen_laboral" type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>

            <div>
              <label for="regimen_l_desde" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vigente desde
              </label>
              <input id="regimen_l_desde" v-model="formData.regimen_l_desde" type="date"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>
      </div>

      <!-- Sección 4: SUNARP -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Datos SUNARP</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="sunarp_oficina" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Oficina Registral
            </label>
            <input id="sunarp_oficina" v-model="formData.sunarp_oficina" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label for="sunarp_partida" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              N° Partida
            </label>
            <input id="sunarp_partida" v-model="formData.sunarp_partida" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label for="sunarp_dni_representante"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              DNI Representante
            </label>
            <input id="sunarp_dni_representante" v-model="formData.sunarp_dni_representante" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label for="sunarp_nombre_representante"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre Representante
            </label>
            <input id="sunarp_nombre_representante" v-model="formData.sunarp_nombre_representante" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label for="sunarp_cargo_representante"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cargo Representante
            </label>
            <input id="sunarp_cargo_representante" v-model="formData.sunarp_cargo_representante" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>
        </div>
      </div>

      <!-- Sección 5: AFP -->
      <div>
        <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Credenciales AFP</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="usuario_afp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Usuario AFP
            </label>
            <input id="usuario_afp" v-model="formData.usuario_afp" type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>

          <div>
            <label for="clave_afp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Clave AFP
            </label>
            <input id="clave_afp" v-model="formData.clave_afp" type="password"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white">
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button type="button" @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancelar
        </button>
        <button type="submit" :disabled="loading"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading">Guardando...</span>
          <span v-else>Guardar Empresa</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
/* import axios from 'axios' */
import api from '@/api/axios'

interface Empresa {
  nombre: string
  ruc: string
  direccion?: string | null
  telefono?: string | null
  correo?: string | null
  usuario_sol?: string | null
  clave_sol?: string | null
  cliente_id?: string | null
  cliente_secret?: string | null
  token?: string | null
  usuario_afp?: string | null
  clave_afp?: string | null
  imagen?: string | null
  estado?: string
  regimen_tributario?: string | null
  regimen_t_desde?: string | null
  regimen_laboral?: string | null
  regimen_l_desde?: string | null
  sunarp_oficina?: string | null
  sunarp_partida?: string | null
  sunarp_dni_representante?: string | null
  sunarp_nombre_representante?: string | null
  sunarp_cargo_representante?: string | null
}

const props = defineProps<{
  empresaId?: string | number | null
}>()

const emit = defineEmits<{
  (e: 'success'): void
  (e: 'cancel'): void
}>()

const loading = ref(false)
const formData = ref<Empresa>({
  nombre: '',
  ruc: '',
  estado: '1',
  direccion: null,
  telefono: null,
  correo: null,
  usuario_sol: null,
  clave_sol: null,
  cliente_id: null,
  cliente_secret: null,
  token: null,
  usuario_afp: null,
  clave_afp: null,
  imagen: null,
  regimen_tributario: null,
  regimen_t_desde: null,
  regimen_laboral: null,
  regimen_l_desde: null,
  sunarp_oficina: null,
  sunarp_partida: null,
  sunarp_dni_representante: null,
  sunarp_nombre_representante: null,
  sunarp_cargo_representante: null
})

// Cargar datos si estamos editando
onMounted(async () => {
  if (props.empresaId) {
    try {
      loading.value = true
      const response = await api.get(`/empresas/${props.empresaId}`)
      formData.value = response.data
    } catch (error) {
      console.error('Error al cargar la empresa:', error)
    } finally {
      loading.value = false
    }
  }
})

const submitForm = async () => {
  try {
    loading.value = true

    if (props.empresaId) {
      // Actualizar empresa existente
      await api.put(`/empresas/${props.empresaId}`, formData.value)
    } else {
      // Crear nueva empresa
      await api.post('/empresas', formData.value)
    }

    emit('success')
  } catch (error) {
    console.error('Error al guardar la empresa:', error)
    alert('Ocurrió un error al guardar los datos')
  } finally {
    loading.value = false
  }
}
</script>
