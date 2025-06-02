<template>
  <main class="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900 px-6">
    <div class="text-center max-w-md space-y-6">
      <div class="animate-spin-slow inline-block">
        <WrenchIcon class="mx-auto h-16 w-16 text-indigo-600 dark:text-indigo-400" />
      </div>

      <h1 class="text-3xl font-bold text-gray-900 dark:text-white animate-fade-in-scale">
        Página en Construcción
      </h1>

      <p class="text-gray-600 dark:text-gray-400 text-lg animate-slide-up">
        Estamos trabajando para traerte algo increíble. ¡Vuelve pronto!
      </p>

      <button
        class="animate-pulse-custom inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition"
        @click="goHome">
        <ArrowLeftIcon class="h-5 w-5" />
        Volver al inicio
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WrenchIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const goHome = () => router.push({ name: 'dashboard' })
</script>

<style scoped>
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 5s linear infinite;
}

@keyframes fade-in-scale {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-scale {
  animation: fade-in-scale 0.8s ease-out forwards;
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(12px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out forwards;
}

@keyframes pulse-custom {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

.animate-pulse-custom {
  animation: pulse-custom 2s infinite;
}
</style>
