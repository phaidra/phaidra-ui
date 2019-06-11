// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import store from './store'
import * as svgicon from 'vue-svgicon'
import eng from './i18n/eng'
import deu from './i18n/deu'
import ita from './i18n/ita'
import moment from 'moment'
import PhaidraVueComponents from 'phaidra-vue-components'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueI18n)
Vue.use(PhaidraVueComponents)

Vue.use(svgicon, {
  tagName: 'icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

const messages = { eng, deu, ita }
const i18n = new VueI18n({
  locale: 'deu',
  fallbackLocale: 'eng',
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  render: h => h(App),
  components: { App }
})
