import { createApp } from 'vue'
import App from './App.vue'

import './assets/style.css'

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/layout/Home.vue'
import Country from './components/layout/Country.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/country/:name', component: Country}
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
