// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js'

import Vue from 'vue'

// import only required Vuetify components
import Vuetify, {
  VAlert,
  VAutocomplete,
  VApp, // VApp is required
  VBreadcrumbs,
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCheckbox,
  VChip,
  VContainer,
  VCombobox,
  VDataTable,
  VDialog,
  VDivider,
  VExpansionPanel,
  VExpansionPanelContent,
  VFlex,
  VFooter,
  VForm,
  VIcon,
  VImg,
  VItem,
  VLayout,
  VList,
  VListTile,
  VListTileContent,
  VListTileSubTitle,
  VListTileTitle,
  VMenu,
  VNavigationDrawer,
  VPagination,
  VProgressCircular,
  VSelect,
  VSpacer,
  VTab,
  VTabItem,
  VTabs,
  VTabsItems,
  VTextarea,
  VTextField,
  VToolbar,
  VToolbarItems,
  VToolbarSideIcon,
  VToolbarTitle,
  VTooltip,
  VWindow
} from 'vuetify/lib'
import VueI18n from 'vue-i18n'
import App from './App'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import * as svgicon from 'vue-svgicon'
import eng from './i18n/eng'
import deu from './i18n/deu'
import ita from './i18n/ita'
import moment from 'moment'
import axios from 'axios'
import PhaidraVueComponents from 'phaidra-vue-components/src/components'

export function createApp () {
  Vue.config.productionTip = false

  Vue.use(Vuetify, {
    components: {
      VAlert,
      VAutocomplete,
      VApp, // VApp is required
      VBreadcrumbs,
      VBtn,
      VCard,
      VCardActions,
      VCardText,
      VCardTitle,
      VCombobox,
      VCheckbox,
      VChip,
      VContainer,
      VDataTable,
      VDialog,
      VDivider,
      VExpansionPanel,
      VExpansionPanelContent,
      VFlex,
      VFooter,
      VForm,
      VIcon,
      VImg,
      VItem,
      VLayout,
      VList,
      VListTile,
      VListTileContent,
      VListTileSubTitle,
      VListTileTitle,
      VMenu,
      VNavigationDrawer,
      VPagination,
      VProgressCircular,
      VSelect,
      VSpacer,
      VTab,
      VTabItem,
      VTabs,
      VTabsItems,
      VTextarea,
      VTextField,
      VToolbar,
      VToolbarItems,
      VToolbarSideIcon,
      VToolbarTitle,
      VTooltip,
      VWindow
    }
  })
  Vue.use(VueI18n)
  Vue.use(PhaidraVueComponents)

  Vue.prototype.$http = axios

  Vue.use(svgicon, {
    tagName: 'icon',
    defaultWidth: '1em',
    defaultHeight: '1em'
  })

  const messages = { eng, deu, ita }
  const i18n = new VueI18n({
    locale: 'deu',
    fallbackLocale: 'eng',
    silentTranslationWarn: true,
    messages
  })

  Vue.filter('date', function (value) {
    if (value) {
      return moment(String(value)).format('DD.MM.YYYY')
    }
  })

  Vue.filter('time', function (value) {
    if (value) {
      return moment(String(value)).format('DD.MM.YYYY hh:mm:ss')
    }
  })

  Vue.filter('unixtime', function (value) {
    if (value) {
      return moment.unix(String(value)).format('DD.MM.YYYY hh:mm:ss')
    }
  })

  Vue.filter('capitalize', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  })

  Vue.filter('bytes', function (bytes, precision) {
    if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-'
    if (typeof precision === 'undefined') precision = 1
    var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
    var number = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number]
  })

  Vue.filter('truncate', function (text, length, clamp) {
    clamp = clamp || '...'
    length = length || 30

    if (text.length <= length) return text

    var tcText = text.slice(0, length - clamp.length)
    var last = tcText.length - 1

    while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1

    // Fix for case when text does not have any space
    last = last || length - clamp.length

    tcText = tcText.slice(0, last)

    return tcText + clamp
  })

  // create router and store instances
  const router = createRouter()
  const store = createStore()

  // sync so that route state is available as part of the store
  sync(store, router)

  /* eslint-disable no-new */
  const app = new Vue({
    el: '#app',
    router,
    store,
    i18n,
    template: '<App/>',
    render: h => h(App),
    components: { App }
  })

  // expose the app, the router and the store.
  return { app, router, store }
}
