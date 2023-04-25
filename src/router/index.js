import Vue from 'vue'
import VueRouter from 'vue-router'
import ShopView from '../views/ShopMenu.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: "/shop"
  },
  {
    path:'/shop',
    name:'shop',
    component:ShopView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
