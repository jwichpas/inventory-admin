<template>
  <div class="container mx-auto p-4">
    <EmpresaForm :empresa-id="empresaId" @success="handleSuccess" @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmpresaForm from '@/components/empresa/FormEmpresa.vue'

const empresaId = ref<string | null>(null) // Para edición, o null para creación

const handleSuccess = () => {
  // Redirigir o mostrar mensaje de éxito
  console.log('Empresa guardada con éxito')
}

const handleCancel = () => {
  // Redirigir o cerrar el formulario
  console.log('Operación cancelada')
}
</script>
