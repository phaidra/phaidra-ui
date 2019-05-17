import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Search from '@/components/Search'
import Detail from '@/components/Detail'
import Manage from '@/components/Manage'
import Metadata from '@/components/Metadata'
import MetadataEditor from '@/components/MetadataEditor'
import Submit from '@/components/Submit'
import SubmitKsaEda from '@/components/SubmitKsaEda'
import SubmitEmpty from '@/components/SubmitEmpty'
import AddMember from '@/components/AddMember'

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
      path: '/manage/:pid',
      name: 'manage',
      component: Manage
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
      path: '/submit/ksa-eda',
      name: 'submit-ksa-eda',
      component: SubmitKsaEda
    },
    {
      path: '/submit/empty',
      name: 'submit-empty',
      component: SubmitEmpty
    },
    {
      path: '/addmember/:pid',
      name: 'addmember',
      component: AddMember
    }
  ]
})
