import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Search from '@/components/Search'
import Detail from '@/components/Detail'
import Metadata from '@/components/Metadata'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/detail/:pid',
      name: 'detail',
      component: Detail
    },
    {
      path: '/metadata/:pid',
      name: 'metadata',
      component: Metadata
    }
  ]
})
