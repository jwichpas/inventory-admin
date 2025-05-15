<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2 w-80">
    <Alert v-for="alert in alerts" :key="alert.id" :type="alert.type" :title="alert.title" :message="alert.message"
      @close="removeAlert(alert.id)" />
  </div>
</template>

<script setup lang="ts">
import Alert from '@/components/AlertView.vue';
import { useAlert } from '@/composables/useAlert';

const { alerts, removeAlert } = useAlert();
</script>
