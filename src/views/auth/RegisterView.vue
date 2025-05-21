<!-- src/pages/Register.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Registro de Empresa</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label class="block mb-1 font-medium">RUC de Empresa</label>
          <input v-model="ruc_empresa" type="text" required class="w-full px-4 py-2 border rounded-xl" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Nombre de Empresa</label>
          <input v-model="nombre_empresa" type="text" required class="w-full px-4 py-2 border rounded-xl" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Nombre Usuario</label>
          <input v-model="nombre_usuario" type="text" required class="w-full px-4 py-2 border rounded-xl" />
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Email</label>
          <input v-model="email" type="email" required class="w-full px-4 py-2 border rounded-xl" />
        </div>
        <div class="mb-6">
          <label class="block mb-1 font-medium">Contraseña</label>
          <input v-model="password" type="password" required class="w-full px-4 py-2 border rounded-xl" />
        </div>
        <button type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">Registrar</button>
        <p class="mt-4 text-sm text-center">Ya tienes cuenta? <router-link class="text-blue-500 hover:underline"
            to="/login">Inicia sesión</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const ruc_empresa = ref('')
const nombre_empresa = ref('')
const nombre_usuario = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    await api.post('/registrar-empresa', {
      ruc_empresa: ruc_empresa.value,
      nombre_empresa: nombre_empresa.value,
      nombre_usuario: nombre_usuario.value,
      email: email.value,
      password: password.value,
    })
    router.push('/login')
  } catch (error) {
    alert('Error al registrar')
  }
}
</script>
