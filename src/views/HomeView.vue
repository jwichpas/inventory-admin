<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Navbar Fijo -->
    <nav class="fixed w-full bg-white shadow-sm z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <svg class="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                <path fill-rule="evenodd"
                  d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
                  clip-rule="evenodd" />
              </svg>
              <span class="ml-2 text-xl font-bold text-gray-900">InventPro</span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="goToLogin"
              class="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
              Iniciar Sesión
            </button>
            <button @click="goToRegister"
              class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm">
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Text Content -->
        <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
          <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block animate-fade-in-down">Control Total de tu</span>
            <span class="block text-indigo-600 animate-fade-in-down animate-delay-100">Inventario y Ventas</span>
          </h1>
          <p
            class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 animate-fade-in-down animate-delay-200">
            Gestiona múltiples empresas, productos con variaciones, lotes, almacenes y fechas de vencimiento desde una
            sola plataforma.
          </p>
          <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div class="rounded-md shadow animate-fade-in-up animate-delay-300">
                <button @click="goToRegister"
                  class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Comenzar ahora
                </button>
              </div>
              <div class="mt-3 sm:mt-0 sm:ml-3 animate-fade-in-up animate-delay-400">
                <button @click="showDemo"
                  class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Ver demostración
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Carousel -->
        <div
          class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
          <div class="relative mx-auto w-full rounded-lg shadow-xl lg:max-w-2xl overflow-hidden">
            <!-- Carrusel de imágenes -->
            <div class="relative h-96 w-full overflow-hidden">
              <transition-group name="fade-slide" tag="div" class="h-full w-full">
                <div v-for="(image, index) in carouselImages" :key="image.id" v-show="currentImage === index"
                  class="absolute inset-0 h-full w-full flex items-center justify-center transition-all duration-1000"
                  :class="{ 'opacity-100': currentImage === index, 'opacity-0': currentImage !== index }">
                  <img :src="image.src" :alt="image.alt"
                    class="h-full w-full object-cover object-center transform transition-all duration-1000 ease-in-out"
                    :class="{ 'scale-105': currentImage === index }">
                  <div class="absolute inset-0 bg-indigo-600 bg-opacity-20 mix-blend-multiply"></div>
                </div>
              </transition-group>
            </div>

            <!-- Controles del carrusel -->
            <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              <button v-for="(_, index) in carouselImages" :key="index" @click="currentImage = index"
                class="h-2 w-2 rounded-full transition-all duration-300"
                :class="{ 'bg-indigo-600 w-6': currentImage === index, 'bg-indigo-300 w-2': currentImage !== index }">
                <span class="sr-only">Ir a imagen {{ index + 1 }}</span>
              </button>
            </div>

            <!-- Flechas de navegación -->
            <button @click="prevImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 focus:outline-none">
              <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-all transform hover:scale-110 focus:outline-none">
              <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">Características</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesitas para gestionar tu negocio
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Un sistema completo diseñado para simplificar la gestión de inventario y ventas.
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(feature, index) in features" :key="index"
              class="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-indigo-500 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div>
                <span class="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                  <component :is="feature.icon" class="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div class="mt-8">
                <h3 class="text-lg font-medium">
                  <span class="absolute inset-0" aria-hidden="true" />
                  {{ feature.title }}
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  {{ feature.description }}
                </p>
              </div>
              <span class="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-indigo-400"
                aria-hidden="true">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-indigo-700">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          <span class="block">¿Listo para transformar tu negocio?</span>
        </h2>
        <p class="mt-4 text-lg leading-6 text-indigo-200">
          Empieza a gestionar tu inventario de manera profesional y lleva tu negocio al siguiente nivel.
        </p>
        <button @click="goToRegister"
          class="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto transition-all transform hover:scale-105">
          Crear cuenta gratis
        </button>
        <button @click="goToLogin"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Iniciar sesión
        </button>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="xl:grid xl:grid-cols-3 xl:gap-8">
          <div class="space-y-8 xl:col-span-1">
            <div class="flex items-center">
              <svg class="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                <path fill-rule="evenodd"
                  d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
                  clip-rule="evenodd" />
              </svg>
              <span class="ml-2 text-xl font-bold text-white">InventPro</span>
            </div>
            <p class="text-gray-300 text-base">
              La solución todo en uno para la gestión de inventario y ventas de tu negocio.
            </p>
          </div>
          <div class="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">Producto</h3>
                <ul class="mt-4 space-y-4">
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Características</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Precios</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">API</a>
                  </li>
                </ul>
              </div>
              <div class="mt-12 md:mt-0">
                <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">Soporte</h3>
                <ul class="mt-4 space-y-4">
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Documentación</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Guías</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Foro</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">Legal</h3>
                <ul class="mt-4 space-y-4">
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Privacidad</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Términos</a>
                  </li>
                </ul>
              </div>
              <div class="mt-12 md:mt-0">
                <h3 class="text-sm font-semibold text-gray-300 tracking-wider uppercase">Empresa</h3>
                <ul class="mt-4 space-y-4">
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Nosotros</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Blog</a>
                  </li>
                  <li>
                    <a href="#" class="text-base text-gray-400 hover:text-white transition-colors">Contacto</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-12 border-t border-gray-700 pt-8">
          <p class="text-base text-gray-400 text-center">
            &copy; 2023 InventPro. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  CubeIcon,
  CircleStackIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  AdjustmentsHorizontalIcon,
  ShoppingCartIcon
} from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push({ name: 'login' });
};
const goToRegister = () => {
  router.push({ name: 'register' });
};

const features = [
  {
    title: 'Gestión de Productos',
    description: 'Registra productos con variaciones como color, talla y más. Organiza por categorías y marcas.',
    icon: CubeIcon
  },
  {
    title: 'Control de Inventario',
    description: 'Gestiona stock por lotes, almacenes y fechas de vencimiento con alertas automáticas.',
    icon: CircleStackIcon
  },
  {
    title: 'Multiempresa',
    description: 'Administra múltiples empresas desde una sola cuenta con permisos diferenciados.',
    icon: UsersIcon
  },
  {
    title: 'Reportes Avanzados',
    description: 'Genera informes de ventas, inventario y rentabilidad con gráficos interactivos.',
    icon: ChartBarIcon
  },
  {
    title: 'Gestión de Lotes',
    description: 'Controla productos por lotes con fechas de vencimiento y ubicación en almacenes.',
    icon: ClockIcon
  },
  {
    title: 'Ventas y Compras',
    description: 'Registra transacciones de compra y venta con múltiples métodos de pago.',
    icon: CurrencyDollarIcon
  },
  {
    title: 'Configuraciones Flexibles',
    description: 'Personaliza atributos, impuestos, monedas y más según las necesidades de tu negocio.',
    icon: AdjustmentsHorizontalIcon
  },
  {
    title: 'Pedidos y Facturación',
    description: 'Emite facturas, boletas y otros documentos electrónicos según normativa local.',
    icon: ShoppingCartIcon
  }
];

// Carrusel de imágenes
const carouselImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    alt: 'Dashboard de Inventario'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    alt: 'Reportes de Ventas'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    alt: 'Gestión de Productos'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    alt: 'Análisis de Datos'
  }
];

const currentImage = ref(0);
let carouselInterval: number;

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % carouselImages.length;
};

const prevImage = () => {
  currentImage.value = (currentImage.value - 1 + carouselImages.length) % carouselImages.length;
};

// Auto-avance del carrusel
onMounted(() => {
  carouselInterval = window.setInterval(nextImage, 5000);
});

onBeforeUnmount(() => {
  clearInterval(carouselInterval);
});
const showDemo = () => {
  // Lógica para mostrar demostración
  alert('Aquí se mostraría una demostración interactiva del sistema');
};

defineExpose({
  showDemo,
  goToLogin,
  goToRegister
}
)


</script>

<style>
/* Animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}



/* Animación para los feature cards */
@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.group:hover {
  animation: float 2s ease-in-out infinite;
}

/* Efecto hover para botones */
.button-hover-effect {
  transition: all 0.3s ease;
}

.button-hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Animaciones personalizadas */
.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-fade-in-down.animate-delay-100 {
  animation-delay: 0.1s;
}

.animate-fade-in-down.animate-delay-200 {
  animation-delay: 0.2s;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in-up.animate-delay-300 {
  animation-delay: 0.3s;
}

.animate-fade-in-up.animate-delay-400 {
  animation-delay: 0.4s;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transiciones para el carrusel */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 1s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(50px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
