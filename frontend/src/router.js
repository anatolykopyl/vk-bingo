import { createRouter, createWebHistory } from 'vue-router'
import Game from './views/Game/Index.vue'
import Login from './views/Login/Index.vue'
import Screen from './views/Screen/Index.vue'

const routes = [
  { path: '/game', component: Game },
  { path: '/', component: Login },
  { path: '/screen', component: Screen }
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
