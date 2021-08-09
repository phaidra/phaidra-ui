import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/ext/Home'
import Impressum from '@/components/ext/Impressum'
import TermsOfUse from '@/components/TermsOfUse'
import Login from '@/components/Login'
import PSearch from 'phaidra-vue-components/src/components/search/PSearch'
import PLists from 'phaidra-vue-components/src/components/lists/PLists'
import PGroups from 'phaidra-vue-components/src/components/groups/PGroups'
import PMetadataFieldsHelp from 'phaidra-vue-components/src/components/info/PMetadataFieldsHelp'
import Detail from '@/components/Detail'
import Stats from '@/components/Stats'
import Rights from '@/components/Rights'
import Sort from '@/components/Sort'
import Relationships from '@/components/Relationships'
import Delete from '@/components/Delete'
import Metadata from '@/components/Metadata'
import MetadataEditor from '@/components/MetadataEditor'
import UwmetadataEditor from '@/components/UwmetadataEditor'
import SubmitResource from '@/components/SubmitResource'
import SubmitKsaEda from '@/components/SubmitKsaEda'
import SubmitFbPsychologie from '@/components/SubmitFbPsychologie'
import SubmitBruckneruni from '@/components/SubmitBruckneruni'
import SubmitEmpty from '@/components/SubmitEmpty'
import SubmitCustom from '@/components/SubmitCustom'
import Submitform from '@/components/Submitform'
import Submit from '@/components/Submit'
import SubmitSimple from '@/components/SubmitSimple'
import SubmitUwm from '@/components/SubmitUwm'
import UploadWebVersion from '@/components/UploadWebVersion'
import SubmitRelated from '@/components/SubmitRelated'
import NotFound from '@/components/NotFound'
import Repostats from '@/components/ext/Repostats'
import config from '../config/phaidra-ui'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    base: config.instances[config.defaultinstance].basepath ? '/' + config.instances[config.defaultinstance].basepath + '/' : null,
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
        path: '/terms-of-use',
        name: 'termsofuse',
        component: TermsOfUse
      },
      {
        path: '/impressum',
        name: 'impressum',
        component: Impressum
      },
      {
        path: '/repostats',
        name: 'repostats',
        component: Repostats
      },
      {
        path: '/metadata-fields-help',
        name: 'metadatafieldshelp',
        component: PMetadataFieldsHelp
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
        path: '/stats/:pid',
        name: 'stats',
        component: Stats
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
        path: '/submit/uwm/:cmodel',
        name: 'submit-uwm',
        component: SubmitUwm
      },
      {
        path: '/submit/ksa-eda',
        name: 'submit-ksa-eda',
        component: SubmitKsaEda
      },
      {
        path: '/submit/fb-psychologie',
        name: 'submit-fb-psychologie',
        component: SubmitFbPsychologie
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
        path: '/submit/custom',
        name: 'submit-custom',
        component: SubmitCustom
      },
      {
        path: '/upload-webversion/:pid',
        name: 'upload-webversion',
        component: UploadWebVersion
      },
      {
        path: '/submit-related/:relatedpid/:relation',
        name: 'submit-related',
        component: SubmitRelated
      },
      {
        path: '/lists',
        name: 'lists',
        component: PLists
      },
      {
        path: '/groups',
        name: 'groups',
        component: PGroups
      },
      {
        path: '*',
        name: 'notfound',
        component: NotFound
      }
    ],
    scrollBehavior () {
      return { x: 0, y: 0 }
    }
  })
}
