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
          component: CategoryCreateEditView,
          meta: { title: 'Nueva Categoría', requiresAuth: true },
        },
        {
          path: '/categories/edit/:id',
          name: 'categories.edit',
          component: CategoryCreateEditView,
          meta: { title: 'Editar Categoría', requiresAuth: true },
        },
        {
          path: '/brands',
          name: 'brands',
          component: BrandsView,
          meta: { title: 'Marcas', requiresAuth: true },
        },
        {
          path: '/brands/create',
          name: 'brands.create',
          component: BrandsCreateView,
          meta: { title: 'Nueva Marca', requiresAuth: true },
        },
        {
          path: '/brands/edit/:id',
          name: 'brands.edit',
          component: BrandsCreateView,
          meta: { title: 'Editar Marca', requiresAuth: true },
        },
        {
          path: '/sire/compras',
          name: 'sire.compras',
          component: SireComprasView,
          meta: { title: 'Compras SIRE', requiresAuth: true },
        },
        {
          path: '/sire/compras/:id',
          name: 'sire.compras.show',
          component: SireComprasView,
          meta: { title: 'Compras SIRE', requiresAuth: true },
        },
        {
          path: '/sire/compras/edit/:id',
          name: 'sire.compras.edit',
          component: SireComprasView,
          meta: { title: 'Editar Compra', requiresAuth: true },
        },
      ],
    },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
  ],
})

export default router
