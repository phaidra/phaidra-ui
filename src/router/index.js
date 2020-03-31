import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import PSearch from 'phaidra-vue-components/src/components/search/PSearch'
import PLists from 'phaidra-vue-components/src/components/lists/PLists'
import Detail from '@/components/Detail'
import Rights from '@/components/Rights'
import Sort from '@/components/Sort'
import Relationships from '@/components/Relationships'
import Delete from '@/components/Delete'
import Metadata from '@/components/Metadata'
import MetadataEditor from '@/components/MetadataEditor'
import UwmetadataEditor from '@/components/UwmetadataEditor'
import SubmitResource from '@/components/SubmitResource'
import SubmitKsaEda from '@/components/SubmitKsaEda'
import SubmitBruckneruni from '@/components/SubmitBruckneruni'
import SubmitEmpty from '@/components/SubmitEmpty'
import Submitform from '@/components/Submitform'
import Submit from '@/components/Submit'
import SubmitSimple from '@/components/SubmitSimple'
import AddMember from '@/components/AddMember'
import UploadWebVersion from '@/components/UploadWebVersion'

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
        path: '/rights/:pid',
        name: 'rights',
        component: Rights
      },
      {
        path: '/sort/:pid',
        name: 'sort',
        component: Sort
      },
      {
        path: '/relationships/:pid',
        name: 'relationships',
        component: Relationships
      },
      {
        path: '/delete/:pid',
        name: 'delete',
        component: Delete
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
        path: '/uwmetadata/:pid/edit',
        name: 'uwmetadataeditor',
        component: UwmetadataEditor
      },
      {
        path: '/submit',
        name: 'submit',
        component: Submit
      },
      {
        path: '/submit/simple',
        name: 'submit-simple',
        component: SubmitSimple
      },
      {
        path: '/submit/ksa-eda',
        name: 'submit-ksa-eda',
        component: SubmitKsaEda
      },
      {
        path: '/submit/bruckneruni',
        name: 'submit-bruckneruni',
        component: SubmitBruckneruni
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
        path: '/submit/empty',
        name: 'submit-empty',
        component: SubmitEmpty
      },
      {
        path: '/addmember/:pid',
        name: 'addmember',
        component: AddMember
      },
      {
        path: '/uploadwebversion/:pid',
        name: 'uploadwebversion',
        component: UploadWebVersion
      },
      {
        path: '/lists',
        name: 'lists',
        component: PLists
      }
    ]
  })
}
