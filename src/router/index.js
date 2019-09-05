import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import PSearch from 'phaidra-vue-components/src/components/search/PSearch'
import PLists from 'phaidra-vue-components/src/components/lists/PLists'
import Detail from '@/components/Detail'
import Manage from '@/components/Manage'
import Metadata from '@/components/Metadata'
import MetadataEditor from '@/components/MetadataEditor'
import SubmitResource from '@/components/SubmitResource'
import SubmitKsaEda from '@/components/SubmitKsaEda'
import SubmitEmpty from '@/components/SubmitEmpty'
import SubmitIr from '@/components/SubmitIr'
import Submitform from '@/components/Submitform'
import Submit from '@/components/Submit'
import AddMember from '@/components/AddMember'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
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
        component: PSearch
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
        path: '/submit/:cmodel',
        name: 'submitresource',
        component: SubmitResource
      },
      {
        path: '/submit/:cmodel/:submitform',
        name: 'submitform',
        component: Submitform
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
        path: '/submit/ir',
        name: 'submit-ir',
        component: SubmitIr
      },
      {
        path: '/addmember/:pid',
        name: 'addmember',
        component: AddMember
      },
      {
        path: '/lists',
        name: 'lists',
        component: PLists
      }
    ]
  })
}
