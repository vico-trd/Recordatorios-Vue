import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'

import HomeView from './components/HomeView.vue'
import AboutView from './components/AboutView.vue'
import Administracion from './components/Administracion.vue'
import Login from './components/Login.vue'
import Landing from './components/Landing.vue'
import SupabaseStorage from './components/SupabaseStorage.vue'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/about', component: AboutView, meta: { requiresAuth: true } },
  { path: '/admin', component: Administracion, meta: { requiresAuth: true } },
  { path: '/storage', component: SupabaseStorage, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const usuario = auth.currentUser
  if (to.meta.requiresAuth && !usuario) return '/login'
  if ((to.path == '/login' || to.path == '/') && usuario) return '/home'
})

let aplicacionLista
onAuthStateChanged(auth, () => {
  if (!aplicacionLista) {
    aplicacionLista = createApp(App).use(router).mount('#app')
  }
})