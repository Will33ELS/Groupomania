import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store' // VueX

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MyProfile from '../views/MyProfile.vue'
import Profile from "../views/Profile";

Vue.use(VueRouter)


const ifNotAuthenticated = (to, from, next) => { // L'utilisateur ne doit pas être connecté
  if (store.state.token == null) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => { // L'utilisateur doit être connecté
  if (store.state.token != null) {
    next()
    return
  }
  next('/login')
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/myprofile',
    name: 'MyProfile',
    component: MyProfile,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/profile/:id',
    name: "Profile",
    component: Profile,
    beforeEnter: ifAuthenticated
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
