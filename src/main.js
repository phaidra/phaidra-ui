// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import store from './store'
import * as svgicon from 'vue-svgicon'
import en from './i18n/en'
import de from './i18n/de'
import it from './i18n/it'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueI18n)

Vue.use(svgicon, {
  tagName: 'icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

const messages = { en, de, it }
const i18n = new VueI18n({
  locale: 'de',
  messages
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

