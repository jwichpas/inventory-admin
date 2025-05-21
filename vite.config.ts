import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  content: ['./resources/**/*.blade.php', './resources/**/*.js', './resources/**/*.vue'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        dark: {
          800: '#1e293b',
          700: '#334155',
        },
      },
    },
  },
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    /* host: 'misfacturas.test', */
    port: 5173,
    open: true,

    proxy: {
      '/sunat-auth': {
        target: 'https://api-seguridad.sunat.gob.pe', // URL base de la API de SUNAT
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sunat-auth/, ''),
      },
      '/sunat-api': {
        target: 'https://api-sire.sunat.gob.pe', // URL base de la API de SUNAT
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sunat-api/, ''),
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        /* rewrite: (path) => path.replace(/^\/storage/, ''), */
      },
    },
  },
  devServer: {
    proxy: {
      '/sunat-api': {
        /* target: 'http://localhost:3000', */
        target: 'https://eladmin-production.up.railway.app',
        changeOrigin: true,
      },
      '/api': {
        /* target: 'http://127.0.0.1:8000', */
        target: 'https://mi-api-laravel-production.up.railway.app/',
        changeOrigin: true,
      },
      '/storage': {
        target: 'https://mi-api-laravel-production.up.railway.app/',
        changeOrigin: true,
      },
    },
  },
})
