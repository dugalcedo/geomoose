import { createApp } from 'vue'
import App from './App.vue'

import './assets/style.css'

import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/layout/Home.vue'
import Country from './components/layout/Country.vue'
import Quiz from './components/layout/Quiz.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/country/:name', component: Country},
    {path: '/quiz', component: Quiz}
  ]
})

router.afterEach((to, from)=>{
  if (to.fullPath.includes('country')) {
    window.prevScroll = window.scrollY
    window.scrollTo(0,0)
  } else {
    if (window.prevScroll) {
      setTimeout(() => {
        window.scrollTo(0, window.prevScroll)
      }, 500);
    }
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
