<template>
  <div class="image-uploader">
    <!-- Preview o imagen por defecto -->
    <div v-if="modelValue" class="image-preview group">
      <img :src="imageSrc" :alt="altText"
        class="preview-image max-w-[180px] max-h-[180px] object-contain border rounded"
        :class="{ 'opacity-40': uploading }" />

      <!-- Botones de acción -->
      <div class="image-actions mt-1 flex gap-2">
        <label class="action-button change-button cursor-pointer">
          <PencilIcon class="h-4 w-4" />
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
        </label>

        <button type="button" @click="removeImage" class="action-button remove-button text-red-600"
          :disabled="uploading">
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>

      <!-- Barra de progreso -->
      <div v-if="uploading" class="upload-progress mt-1 bg-gray-200 h-1 rounded overflow-hidden">
        <div class="bg-blue-500 h-full" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <label class="upload-label cursor-pointer inline-flex flex-col items-center text-gray-500 text-sm">
        <PhotoIcon class=" mb-2 max-w-xs" />
        <span>{{ placeholderText }}</span>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
      </label>
    </div>

    <!-- Mensaje de error -->
    <p v-if="error" class="text-red-500 text-sm mt-1 flex items-center gap-1">
      <ExclamationCircleIcon class="h-4 w-4" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import {
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  modelValue: [String, File, null],
  altText: {
    type: String,
    default: 'Imagen subida'
  },
  placeholderText: {
    type: String,
    default: 'Haz clic para subir una imagen'
  },
  maxSize: {
    type: Number,
    default: 2 // MB
  },
  allowedTypes: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/webp']
  },
  defaultImage: {
    type: String,
    default: '/images/default-category.png'
  }
})

const emit = defineEmits(['update:modelValue', 'upload-progress'])

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

// Muestra la imagen según el tipo de modelValue
const imageSrc = computed(() => {
  if (props.modelValue instanceof File) {
    return previewUrl.value || URL.createObjectURL(props.modelValue)
  }
  //http://127.0.0.1:8000/storage/categories/aGnalkE0nYP7p9JdLGVt.webp

  if (typeof props.modelValue === 'string' && props.modelValue !== '') {
    return props.modelValue.startsWith('http') ?
      props.modelValue :
      `http://127.0.0.1:8000/storage/${props.modelValue}`
  }

  return props.defaultImage
})

// Manejo del cambio de archivo
const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validar tipo
  if (!props.allowedTypes.includes(file.type)) {
    error.value = `Formato no soportado. Usa: ${props.allowedTypes.join(', ')}`
    resetInput()
    return
  }

  // Validar tamaño
  if (file.size > props.maxSize * 1024 * 1024) {
    error.value = `El archivo no debe exceder ${props.maxSize}MB`
    resetInput()
    return
  }

  error.value = ''

  // Crear vista previa
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  emit('update:modelValue', file)

  simulateUpload()
}

// Eliminar imagen
const removeImage = () => {
  previewUrl.value = ''
  emit('update:modelValue', null)
  resetInput()
}

// Limpiar input file para poder volver a seleccionar la misma imagen
const resetInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Simular progreso de subida
const simulateUpload = () => {
  uploading.value = true
  uploadProgress.value = 0

  const interval = setInterval(() => {
    uploadProgress.value += 15
    emit('upload-progress', uploadProgress.value)
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploading.value = false
    }
  }, 100)
}

// Limpiar recursos
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

// Limpiar preview cuando se borra imagen
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    previewUrl.value = ''
  }
})
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
}
</style>
