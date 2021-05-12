// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js'

import Vue from 'vue'

import Vuetify from 'vuetify/lib'
import VueI18n from 'vue-i18n'
import App from './App'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import * as svgicon from 'vue-svgicon'
import eng from './i18n/ext/eng'
import deu from './i18n/ext/deu'
import ita from './i18n/ext/ita'
import moment from 'moment'
import axios from 'axios'
import PhaidraVueComponents from 'phaidra-vue-components/src/components'
import vuetify from './plugins/vuetify'
import config from './config/phaidra-ui'
import qs from 'qs'

export async function createApp ({
  beforeApp = () => {},
  afterApp = () => {}
} = {}, context) {
  Vue.config.productionTip = false

  Vue.use(Vuetify)
  Vue.use(VueI18n)
  Vue.use(PhaidraVueComponents)

  Vue.prototype.$http = axios

  Vue.use(svgicon, {
    tagName: 'icon',
    defaultWidth: '1em',
    defaultHeight: '1em'
  })

  const messages = { eng: eng, deu: deu, ita: ita }
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

  Vue.filter('datetime', function (value) {
    if (value) {
      return moment(String(value)).format('DD.MM.YYYY hh:mm:ss')
    }
  })

  Vue.filter('datetimeutc', function (value) {
    if (value) {
      return moment.utc(String(value)).format('DD.MM.YYYY hh:mm:ss')
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

  let token
  if (context) {
    let value = '; ' + context.req.headers.cookie
    let parts = value.split('; X-XSRF-TOKEN=')
    if (parts.length === 2) {
      let val = parts.pop().split(';').shift()
      token = val === ' ' ? null : val
    }
  }
  const store = createStore(token)

  router.beforeEach(async function (to, from, next) {
    if (to.name === 'notfound') {
      if (/^\/o:\d+$/.test(to.fullPath)) {
        let pid = to.fullPath
        pid = pid.replace('/', '')
        if (process.browser) {
          // on client-side, find out if we want to redirect
          let params = { q: '*:*', defType: 'edismax', wt: 'json', start: 0, rows: 1, fq: 'pid:"' + pid + '"' }
          try {
            let response = await axios.request({
              method: 'POST',
              url: config.instances[config.defaultinstance].solr + '/select',
              data: qs.stringify(params, { arrayFormat: 'repeat' }),
              headers: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              params: params
            })
            let docs = response.data.response.docs
            console.log(docs)
            if (docs.length < 1) {
              next()
            } else {
              let doc = docs[0]
              if (doc['cmodel']) {
                if (doc['cmodel'] === 'Book') {
                  window.location = config.instances[config.defaultinstance].fedora + '/objects/' + pid + '/methods/bdef:Book/view'
                }
              }
              if (doc['isinadminset']) {
                for (let adminset of doc['isinadminset']) {
                  if (adminset === 'phaidra:ir.univie.ac.at') {
                    window.location = 'https://' + config.instances[config.defaultinstance].irbaseurl + '/' + pid
                  }
                }
              }
              next({ name: 'detail', params: { pid: pid } })
            }
          } catch (error) {
            console.log(error)
            next()
          } finally {
            next()
          }
        } else {
          // on server-side, render object detail
          next({ name: 'detail', params: { pid: pid } })
        }
      } else {
        next()
      }
    } else {
      next()
    }
  })

  router.afterEach((to, from) => {
    store.commit('updateBreadcrumbs', { to, from })
  })

  // sync so that route state is available as part of the store
  sync(store, router)

  await beforeApp({
    router,
    store,
    i18n,
    vuetify
  })

  const app = new Vue({
    router,
    store,
    i18n,
    vuetify,
    render: h => h(App)
  })

  const result = {
    app,
    router,
    store,
    i18n,
    vuetify
  }

  await afterApp(result)

  return result
}
