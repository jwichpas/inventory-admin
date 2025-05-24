<script setup lang="ts">
import { ref, reactive } from 'vue';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';

// Estado del modal
const showLogin = ref(false);

// Formulario reactivo
const loginForm = reactive({
  email: '',
  password: '',
  remember: false
});

// Método para manejar el login
const handleLogin = () => {
  console.log('Intento de login con:', loginForm);
  // Aquí iría la lógica de autenticación
  // showLogin.value = false; // Cerrar modal después de login exitoso
};

// Método para abrir el modal
const openLogin = () => {
  showLogin.value = true;
};

// Método para cerrar el modal
const closeLogin = () => {
  showLogin.value = false;
};
</script>

<template>
  <!-- Botón para abrir el modal (puedes ponerlo donde necesites) -->
  <button @click="openLogin"
    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
    Iniciar sesión
  </button>

  <!-- Modal de Login -->
  <transition name="fade">
    <div v-if="showLogin" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Fondo oscuro -->
      <div class="absolute inset-0 bg-black/50" @click="closeLogin"></div>

      <!-- Contenido del modal -->
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <!-- Header -->
        <div class="bg-indigo-600 p-6 text-white">
          <h2 class="text-2xl font-bold">Bienvenido de nuevo</h2>
          <p class="text-indigo-100">Ingresa tus credenciales para continuar</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="p-6 space-y-6">
          <!-- Campo Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input id="email" v-model="loginForm.email" type="email" required
                class="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tu@email.com">
            </div>
          </div>

          <!-- Campo Contraseña -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" v-model="loginForm.password" type="password" required
                class="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••">
            </div>
          </div>

          <!-- Opciones adicionales -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember" v-model="loginForm.remember" type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
              <label for="remember" class="ml-2 block text-sm text-gray-700">Recordarme</label>
            </div>
            <a href="#" class="text-sm text-indigo-600 hover:text-indigo-500">¿Olvidaste tu contraseña?</a>
          </div>

          <!-- Botón de submit -->
          <button type="submit"
            class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Ingresar
            <ArrowRightIcon class="ml-2 h-4 w-4" />
          </button>
        </form>

        <!-- Footer del modal -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p class="text-center text-sm text-gray-500">
            ¿No tienes una cuenta?
            <a href="#" class="text-indigo-600 hover:text-indigo-500 font-medium">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
