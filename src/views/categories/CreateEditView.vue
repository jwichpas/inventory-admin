<template>
  <div class="py-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría' }}
        </h1>
        <p class="text-sm text-gray-500 mt-1">Complete todos los campos requeridos</p>
      </div>

      <router-link to="/categories"
        class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        <ArrowLeftIcon class="mr-2 h-5 w-5" />
        Volver
      </router-link>
    </div>

    <!-- Formulario -->
    <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
      <form @submit.prevent="submitForm">
        <div class="p-6 border-b border-gray-200">
          <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <!-- Nombre -->
            <div class="sm:col-span-4">
              <label for="name" class="block text-sm font-medium text-gray-700">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input type="text" id="name" v-model="form.name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :class="{ 'border-red-300': errors.name }" />
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Código -->
            <div class="sm:col-span-2">
              <label for="code" class="block text-sm font-medium text-gray-700">
                Código
              </label>
              <input type="text" id="code" v-model="form.codigo" @blur="validateCode"
                :class="{ 'border-red-500': codeError }"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              <div v-if="isCheckingCode" class="text-blue-500 text-sm">
                Validando código...
              </div>
              <div v-if="codeError" class="text-red-500 text-sm">
                {{ codeError }}
              </div>
            </div>

            <!-- Imagen -->
            <div class="sm:col-span-6 ">
              <label class="block text-sm font-medium text-gray-700 mb-2">Imagen</label>

              <ImageUploader v-model="form.image" />
              <!-- <div class="mt-4">
                <label class="block text-sm text-gray-500 mb-1">Vista previa:</label>
                <img v-lazy="getImageUrl(form.image)" alt="Vista previa de la categoría"
                  class="w-32 h-32 object-cover rounded border border-gray-200" />
              </div> -->

            </div>
          </div>
        </div>

        <!-- Acciones del formulario -->
        <div class="px-6 py-4 bg-gray-50 text-right">
          <button type="button" @click="cancel"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancelar
          </button>
          <button type="submit" :disabled="loading"
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="!loading">{{ isEditing ? 'Actualizar' : 'Guardar' }}</span>
            <span v-else class="flex items-center ">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Procesando...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import ImageUploader from '@/components/ImageUploader.vue'
/* import { useImageUrl } from '@/composables/useImageUrl'; */
import { useCategories } from '@/composables/useCategories';
import Api from '@/services/api'
import { debounce } from 'lodash-es';

const { validateCodeHybrid, isCheckingCode, currentEnterprise } = useCategories();




currentEnterprise.value = (localStorage.getItem('empresa_id') || '1');

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const errors = ref<FormErrors>({})

interface CategoryForm {
  id: number | null;
  id_empresa: number | null;
  name: string;
  codigo: string;
  image: File | string | null;
}
interface FormErrors {
  name?: string;
  codigo?: string;
}
const form = ref<CategoryForm>({
  id: null,
  id_empresa: null,
  name: '',
  codigo: '',
  image: null
})



const isEditing = computed(() => route.name === 'categories.edit')
const codeError = ref('');
const isSubmitting = ref(false);

// Cargar datos si estamos editando
onMounted(async () => {
  if (isEditing.value) {
    try {
      // Simular carga de la categoría a editar
      const response = await fetch(`http://localhost:8000/api/categories/${route.params.id}`);
      form.value = await response.json();
    } catch (error) {
      console.error('Error cargando categoría:', error)
      showNotification('Error al cargar la categoría', 'error')
      router.push('/categories')
    }
  } else {
    // Establecer empresa_id por defecto (podría venir de un store o localStorage)
    form.value.id_empresa = +(localStorage.getItem('empresa_id') || '1');
  }
})

// Validación del formulario
const validateForm = () => {
  let valid = true
  errors.value = {}

  if (!form.value.name) {
    errors.value.name = 'El nombre es requerido'
    valid = false
  }

  return valid
}

// Enviar formulario
const submitForm = async () => {
  if (!validateForm()) return;
  const validation = await validateCodeHybrid(form.value.codigo);
  if (!validation.isValid) {
    codeError.value = validation.message;
    return;
  }

  isSubmitting.value = true;
  loading.value = true;
  errors.value = {};

  try {
    const formData = new FormData();
    /* formData.append('id_empresa', localStorage.getItem('empresa_id')); */
    formData.append('id_empresa', String(form.value.id_empresa));
    formData.append('name', form.value.name);
    formData.append('codigo', form.value.codigo);

    // Manejo mejorado de la imagen
    if (form.value.image) {
      if (form.value.image instanceof File) {
        formData.append('image', form.value.image); // Archivo binario
      } else if (typeof form.value.image === 'string' && form.value.image.startsWith('http')) {
        // Si es una URL existente (para edición)
        formData.append('image_url', form.value.image);
      } else if (typeof form.value.image === 'string' && form.value.image.startsWith('data:')) {
        // Si es base64 (convertir a Blob)
        const blob = dataURLtoBlob(form.value.image);
        formData.append('image', blob, 'image.png');
      }
    }

    // Configuración de headers para FormData
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
      }
    };

    if (isEditing.value) {
      formData.append('_method', 'PUT');
      await Api.post(`/categories/${form.value.id}`, formData, config);
      showNotification('Categoría actualizada correctamente', 'success');
    } else {
      await Api.post('/categories', formData, config);
      showNotification('Categoría creada correctamente', 'success');
    }

    router.push('/categories');
  } catch (error) {
    console.error('Error guardando categoría:', error);

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors;
    } else {
      showNotification(
        error.response?.data?.message || 'Error al guardar la categoría',
        'error'
      );
    }
  } finally {
    loading.value = false;
    isSubmitting.value = false;
  }
};



const validateCode = debounce(async () => {
  if (!form.value.codigo) {
    codeError.value = 'El código es requerido';
    return;
  }

  const validation = await validateCodeHybrid(form.value.codigo);
  if (!validation.isValid) {
    codeError.value = validation.message;
  } else {
    codeError.value = '';
  }
}, 500);

// Función auxiliar para convertir base64 a Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

// Cancelar
const cancel = () => {
  router.push('/categories')
}

// Helper para mostrar notificaciones
const showNotification = (message, type = 'success') => {
  console.log(`${type}: ${message}`)
}
</script>
