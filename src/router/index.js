import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Search from '@/components/Search'
import Detail from '@/components/Detail'
import Metadata from '@/components/Metadata'
import MetadataEditor from '@/components/MetadataEditor'
import Submit from '@/components/Submit'
import SubmitKsaPhoto from '@/components/SubmitKsaPhoto'

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
    },
    {
      path: '/metadata/:pid/edit',
      name: 'metadataeditor',
      component: MetadataEditor
    },
    {
      path: '/submit',
      name: 'submit',
      component: Submit
    },
    {
      path: '/submit/ksa-photo',
      name: 'submit-ksa-photo',
      component: SubmitKsaPhoto
    }
  ]
})
