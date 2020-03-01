import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import PostsManager from "../components/PostsManager";
import GMap from "../components/GMap";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/postsmanager',
    name: 'Posts Manager',
    component: PostsManager
  },
  {
    path: '/gmap',
    name: 'GMap',
    component: GMap
  }
]

const router = new VueRouter({
  routes
})

export default router
