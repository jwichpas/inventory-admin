import { ref, watchEffect } from 'vue'

export function useDarkMode() {
  const isDark = ref<boolean>(false)

  // Verificar preferencias del sistema y localStorage al inicializar
  if (typeof window !== 'undefined') {
    isDark.value =
      localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }

  // Aplicar el tema cuando cambia
  watchEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    }
  })

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggleDarkMode }
}
