<script setup lang="ts">
import { RouterView } from 'vue-router'
import AlertContainer from '@/components/AlertContainer.vue';
import { iniciarCicloPrincipal } from './services/sire';
import { onMounted } from 'vue';
onMounted(() => {
  // Iniciar el ciclo principal al cargar la aplicación
  iniciarCicloPrincipal();
});
</script>

<template>
  <RouterView />
  <AlertContainer />
</template>

<style scoped></style>
