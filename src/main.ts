import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyload from 'vue3-lazyload'
import clickOutside from '@/directives/clickOutside'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('click-outside', clickOutside)
app.use(VueLazyload, {
  preLoad: 1.3,
  error: '/src/assets/images/error.png',
  loading: '/src/assets/images/loading.gif',
  attempt: 1,
})

app.mount('#app')
