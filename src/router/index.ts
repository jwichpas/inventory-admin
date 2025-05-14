import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AdminLayoutView,
      meta: { requiresAuth: true, requiresAdmin: true },
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
          meta: { title: 'Nuevo Producto', requiresAuth: true },
        },
        {
          path: '/categories',
          name: 'categories',
          component: CategoryIndexView,
          meta: { title: 'Categorías', requiresAuth: true },
        },
        {
          path: '/categories/create',
          name: 'categories.create',
          component: () => CategoryCreateEditView,
          meta: { title: 'Nueva Categoría', requiresAuth: true },
        },
        {
          path: '/categories/edit/:id',
          name: 'categories.edit',
          component: () => CategoryCreateEditView,
          meta: { title: 'Editar Categoría', requiresAuth: true },
        },
      ],
    },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
  ],
})

export default router
