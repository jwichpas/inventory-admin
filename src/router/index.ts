import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import AdminLayoutView from '@/layouts/MainLayoutView.vue'
import IndexUsers from '@/views/admin/users/IndexView.vue'
import IndexSettings from '@/views/admin/settings/IndexView.vue'
import IndexCompanies from '@/views/admin/companies/IndexView.vue'
import ProductIndexView from '@/views/products/IndexView.vue'
import ProductCreateView from '@/views/products/CreateView.vue'
import CategoryIndexView from '@/views/categories/IndexView.vue'
import CategoryCreateEditView from '@/views/categories/CreateEditView.vue'
import BrandsView from '@/views/brands/BrandsView.vue'
import BrandsCreateView from '@/views/brands/BrandsCreateView.vue'
import SireComprasView from '@/views/sire/ListComprasView.vue'
import SelectEmpresa from '@/components/SelectEmpresa.vue'

import DashboardView from '@/views/DashboardView.vue'
import { useAuthStore } from '@/stores/authStore'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayoutView,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'users',
          name: 'admin.users',
          component: IndexUsers,
          meta: { title: 'Administrar Usuarios' },
        },
        {
          path: 'companies',
          name: 'admin.companies',
          component: IndexCompanies,
          meta: { title: 'Administrar Empresas' },
        },
        {
          path: 'settings',
          name: 'admin.settings',
          component: IndexSettings,
          meta: { title: 'Configuración del Sistema' },
        },
        {
          path: 'products',
          name: 'products',
          component: ProductIndexView,
          meta: { title: 'Productos' },
        },
        {
          path: '/products/create',
          name: 'products.create',
          component: ProductCreateView,
          meta: { title: 'Nuevo Producto' },
        },
        {
          path: '/categories',
          name: 'categories',
          component: CategoryIndexView,
          meta: { title: 'Categorías' },
        },
        {
          path: '/categories/create',
          name: 'categories.create',
          component: CategoryCreateEditView,
          meta: { title: 'Nueva Categoría' },
        },
        {
          path: '/categories/edit/:id',
          name: 'categories.edit',
          component: CategoryCreateEditView,
          meta: { title: 'Editar Categoría' },
        },
        {
          path: '/brands',
          name: 'brands',
          component: BrandsView,
          meta: { title: 'Marcas' },
        },
        {
          path: '/brands/create',
          name: 'brands.create',
          component: BrandsCreateView,
          meta: { title: 'Nueva Marca' },
        },
        {
          path: '/brands/edit/:id',
          name: 'brands.edit',
          component: BrandsCreateView,
          meta: { title: 'Editar Marca' },
        },
        {
          path: '/sire/compras',
          name: 'sire.compras',
          component: SireComprasView,
          meta: { title: 'Compras SIRE' },
        },
        {
          path: '/sire/compras/:id',
          name: 'sire.compras.show',
          component: SireComprasView,
          meta: { title: 'Compras SIRE' },
        },
        {
          path: '/sire/compras/edit/:id',
          name: 'sire.compras.edit',
          component: SireComprasView,
          meta: { title: 'Editar Compra' },
        },
        {
          path: '/select-empresa',
          name: 'select-empresa',
          component: SelectEmpresa,
          meta: { requiresAuth: true },
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardView,
          meta: { requiresAuth: true },
        },
      ],
    },
    { path: '/login', component: LoginView, name: 'login', meta: { guestOnly: true } },
    { path: '/register', component: RegisterView },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Intentar recuperar sesión si hay token
    if (localStorage.getItem('token')) {
      try {
        await authStore.initialize()
        if (authStore.isAuthenticated) return next()
      } catch (err) {
        authStore.logout()
      }
    }
    return next('/login')
  }

  // Si la ruta es solo para invitados y está autenticado
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next('/')
  }

  next()
})
export default router
