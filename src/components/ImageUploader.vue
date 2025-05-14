<template>
  <div class="image-uploader">
    <!-- Preview de la imagen existente o placeholder -->
    <div v-if="modelValue" class="image-preview group">
      <img :src="imageSrc" :alt="altText" class="preview-image preview-image max-w-[180px] max-h-[180px] object-contain"
        :class="{ 'opacity-40': uploading }" />

      <!-- Overlay con acciones -->
      <div class="image-actions">
        <label class="action-button change-button">
          <PencilIcon class="h-4 w-4" />
          <span class="sr-only">Cambiar imagen</span>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
        </label>
        <button type="button" @click="removeImage" class="action-button remove-button" :disabled="uploading">
          <TrashIcon class="h-4 w-4" />
          <span class="sr-only">Eliminar imagen</span>
        </button>
      </div>

      <!-- Barra de progreso -->
      <div v-if="uploading" class="upload-progress">
        <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <label class="upload-label">
        <PhotoIcon class="icon" />
        <span class="text">{{ placeholderText }}</span>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
      </label>
    </div>

    <!-- Mensaje de error -->
    <p v-if="error" class="error-message">
      <ExclamationCircleIcon class="h-4 w-4 inline mr-1" />
      {{ error }}
    </p>

    <!-- Previsualización antes de subir -->
    <div v-if="previewUrl && !modelValue" class="mt-2">
      <p class="text-xs text-gray-500 mb-1">Vista previa:</p>
      <img :src="previewUrl" class="preview-thumbnail max-w-[180px] max-h-[180px]"
        :class="{ 'opacity-40': uploading }" />
    </div>
  </div>
</template>

<script setup>
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
    default: 2 // 2MB
  },
  allowedTypes: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/webp']
  }
})

const emit = defineEmits(['update:modelValue', 'upload-progress'])

const fileInput = ref(null)
const previewUrl = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const error = ref('')

// Generar URL para la imagen actual
const imageSrc = computed(() => {
  if (!props.modelValue) return ''
  if (typeof props.modelValue === 'string') {
    // Si es un string, asumimos que es una URL o path
    return props.modelValue.startsWith('http') ?
      props.modelValue :
      `/storage/${props.modelValue}`
  }
  return previewUrl.value
})

// Manejar cambio de archivo
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validar tipo de archivo
  if (!props.allowedTypes.includes(file.type)) {
    error.value = `Formato no soportado. Use: ${props.allowedTypes.join(', ')}`
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

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target.result
  }
  reader.readAsDataURL(file)

  // Emitir el archivo al padre
  emit('update:modelValue', file)
}

// Eliminar imagen
const removeImage = () => {
  previewUrl.value = ''
  emit('update:modelValue', null)
  resetInput()
}

// Resetear input file
const resetInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Simular progreso de subida (en un caso real, usaría axios onUploadProgress)
const simulateUpload = () => {
  uploading.value = true
  uploadProgress.value = 0

  const interval = setInterval(() => {
    uploadProgress.value += 10
    emit('upload-progress', uploadProgress.value)

    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploading.value = false
    }
  }, 200)
}

// Limpiar URL de preview al desmontar
onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

// Si el padre cambia el modelValue, limpiar preview
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    previewUrl.value = ''
  }
})
</script>

<style scoped></style>
