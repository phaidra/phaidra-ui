// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import * as svgicon from 'vue-svgicon'
import en from './i18n/en'
import de from './i18n/de'
import it from './i18n/it'
import config from './config/phaidra-ui.js'

Vue.config.productionTip = false

Vue.use(Vuex)
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

const store = new Vuex.Store({
  state: {
    config: config,
    currentUser: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      token: '',
      groups: []
    },
    alerts: []
  },
  mutations: {
    setLoginData (state, logindata) {
      state.currentUser.firstname = logindata.firstname
      state.currentUser.lastname = logindata.lastname
      state.currentUser.email = logindata.email
    },
    setUsername (state, username) {
      state.currentUser.username = username
    },
    clearToken (state) {
      state.currentUser.token = ''
    },
    setToken (state, token) {
      state.currentUser.token = token
    },
    setGroups (state, groups) {
      state.currentUser.groups = groups
    },
    setAlerts (state, alerts) {
      state.alerts = alerts
    },
    clearAlerts (state) {
      state.alerts = []
    }
  },
  actions: {
    login ({ commit, state }, credentials) {
      commit('clearAlerts')
      commit('clearToken')

      commit('setUsername', credentials.username)

      fetch(state.config.api + '/signin', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        }
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        commit('setAlerts', json.alerts)
        if (json.status === 200) {
          commit('setToken', json['XSRF-TOKEN'])

          // if sign in was successful, get user's data (name, email, etc)
          fetch(state.config.api + '/directory/user/' + state.currentUser.username + '/data', {
            method: 'GET',
            mode: 'cors',
            headers: {
              'X-XSRF-TOKEN': state.currentUser.token
            }
          })
          .then(function (response) { return response.json() })
          .then(function (json) {
            commit('setAlerts', json.alerts)
            if (json.status === 200) {
              commit('setLoginData', {
                firstname: json.user_data.firstname,
                lastname: json.user_data.lastname,
                email: json.user_data.email
              })

              router.push('/')
            }
          })
          .catch(function (error) { console.log(error) })
        }
      })
      .catch(function (error) { console.log(error) })
    },
    getUserGroups ({ commit, state }) {
      commit('clearAlert')

      fetch(state.config.api + '/groups', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'X-XSRF-TOKEN': state.currentUser.token
        }
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        commit('setAlerts', json.alerts)
        commit('setGroups', json.groups)
      })
      .catch(function (error) { console.log(error) })
    }
  }
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

