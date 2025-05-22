<template>
  <div class="space-y-6">
    <!-- Estadísticas Rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Ventas Totales" :value="formatCurrency(totalSales)" change="+12.5%" :isPositive="true"
        icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <StatCard title="Órdenes" :value="totalOrders.toString()" change="+8.2%" :isPositive="true"
        icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      <StatCard title="Clientes" :value="totalCustomers.toString()" change="-2.4%" :isPositive="false"
        icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      <StatCard title="Tasa de Conversión" value="3.2%" change="+0.8%" :isPositive="true"
        icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </div>

    <!-- Gráficos Principales -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Gráfico de Ventas Mensuales -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Ventas Mensuales</h2>
          <select
            class="text-sm border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white rounded-md focus:ring-indigo-500 focus:border-indigo-500">
            <option>Últimos 12 meses</option>
            <option>Este año</option>
            <option>Últimos 6 meses</option>
          </select>
        </div>
        <div class="h-80">
          <apexchart type="area" height="100%" :options="salesChartOptions" :series="salesChartSeries" />
        </div>
      </div>

      <!-- Tipo de Cambio -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Tipo de Cambio</h2>
        <div class="space-y-3">
          <ExchangeRate currency="USD" :buyRate="3.725" :sellRate="3.735" trend="up" :change="0.012" />
          <ExchangeRate currency="EUR" :buyRate="4.125" :sellRate="4.145" trend="down" :change="0.008" />
          <ExchangeRate currency="GBP" :buyRate="4.825" :sellRate="4.855" trend="up" :change="0.015" />
        </div>
      </div>
    </div>

    <!-- Sección Inferior -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Productos más vendidos -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 lg:col-span-2">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Productos Más Vendidos</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead class="bg-neutral-50 dark:bg-neutral-700">
              <tr>
                <th scope="col"
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Producto</th>
                <th scope="col"
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Ventas</th>
                <th scope="col"
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Ingresos</th>
                <th scope="col"
                  class="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">
                  Stock</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              <tr v-for="product in topProducts" :key="product.id">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <img class="h-8 w-8 rounded" :src="product.image" :alt="product.name">
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-neutral-900 dark:text-white">{{ product.name }}</div>
                      <div class="text-xs text-neutral-500 dark:text-neutral-400">{{ product.category }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{{ product.sales }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-neutral-900 dark:text-white">{{
                  formatCurrency(product.revenue) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': product.stock > 10,
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': product.stock <= 10 && product.stock > 0,
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200': product.stock === 0
                  }">
                    {{ product.stock }} en stock
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Métricas de Tráfico -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Origen del Tráfico</h2>
        <div class="h-64 mb-4">
          <apexchart type="donut" height="100%" :options="trafficChartOptions" :series="trafficChartSeries" />
        </div>
        <div class="space-y-2">
          <div v-for="source in trafficSources" :key="source.name" class="flex items-center justify-between">
            <div class="flex items-center">
              <span class="h-2.5 w-2.5 rounded-full mr-2" :class="`bg-${source.color}-500`"></span>
              <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">{{ source.name }}</span>
            </div>
            <span class="text-sm text-neutral-500 dark:text-neutral-400">{{ source.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import apexchart from 'vue3-apexcharts'
import StatCard from '@/components/StatCard.vue'
import ExchangeRate from '@/components/ExchangeRate.vue'

// Dark mode state
const darkMode = ref(false)

// Toggle dark mode
/* const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
  if (darkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'enabled')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'disabled')
  }
}
 */
// Initialize dark mode from localStorage
onMounted(() => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    darkMode.value = true
    document.documentElement.classList.add('dark')
  }
})

// Datos de ejemplo
const totalSales = ref(125430.75)
const totalOrders = ref(1245)
const totalCustomers = ref(843)

// Productos más vendidos
const topProducts = ref([
  {
    id: 1,
    name: 'Smartphone X Pro',
    category: 'Electrónicos',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
    sales: 342,
    revenue: 85600.50,
    stock: 15
  },
  {
    id: 2,
    name: 'Zapatillas Running Elite',
    category: 'Deportes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
    sales: 278,
    revenue: 41700.00,
    stock: 8
  },
  {
    id: 3,
    name: 'Auriculares Inalámbricos',
    category: 'Electrónicos',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
    sales: 195,
    revenue: 29250.00,
    stock: 0
  },
  {
    id: 4,
    name: 'Reloj Inteligente',
    category: 'Electrónicos',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
    sales: 168,
    revenue: 50400.00,
    stock: 22
  },
  {
    id: 5,
    name: 'Mochila Resistente',
    category: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80',
    sales: 142,
    revenue: 14200.00,
    stock: 5
  }
])

// Origen del tráfico
const trafficSources = ref([
  { name: 'Búsqueda Orgánica', percentage: 45, color: 'indigo' },
  { name: 'Redes Sociales', percentage: 28, color: 'blue' },
  { name: 'Directo', percentage: 15, color: 'green' },
  { name: 'Email', percentage: 8, color: 'yellow' },
  { name: 'Referidos', percentage: 4, color: 'red' }
])

// Opciones del gráfico de ventas
const salesChartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: '100%',
    foreColor: darkMode.value ? '#E5E7EB' : '#6B7280',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    }
  },
  colors: ['#4F46E5'],
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      formatter: (value: number) => `$${value.toLocaleString()}`
    }
  },
  tooltip: {
    theme: darkMode.value ? 'dark' : 'light',
    y: {
      formatter: (value: number) => `$${value.toLocaleString()}`
    }
  },
  grid: {
    borderColor: darkMode.value ? '#374151' : '#E5E7EB',
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  }
}))

const salesChartSeries = ref([{
  name: 'Ventas',
  data: [15000, 18000, 21000, 19000, 22000, 25000, 28000, 27000, 30000, 32000, 35000, 38000]
}])

// Opciones del gráfico de tráfico
const trafficChartOptions = computed(() => ({
  chart: {
    type: 'donut',
    foreColor: darkMode.value ? '#E5E7EB' : '#6B7280',
  },
  colors: ['#4F46E5', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
  labels: ['Búsqueda Orgánica', 'Redes Sociales', 'Directo', 'Email', 'Referidos'],
  legend: {
    position: 'bottom',
    labels: {
      colors: darkMode.value ? '#E5E7EB' : '#6B7280'
    }
  },
  dataLabels: {
    enabled: false
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: darkMode.value ? '#E5E7EB' : '#6B7280',
            formatter: () => '100%'
          }
        }
      }
    }
  },
  tooltip: {
    theme: darkMode.value ? 'dark' : 'light'
  }
}))

const trafficChartSeries = ref([45, 28, 15, 8, 4])

// Formatear moneda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value)
}
</script>

<style></style>
