import Vue from 'vue'
import axios from 'axios'
import config from '../config/phaidra-ui'

export const state = () => ({
  config,
  appconfig: config.global,
  instanceconfig: config.instances[config.defaultinstance],
  snackbar: false,
  alerts: [],
  objectInfo: null,
  objectMembers: [],
  user: {
    token: null
  },
  groups: [],
  breadcrumbs: [],
  loading: false,
  chartsUrl: []
})

export const mutations = {
  updateBreadcrumbs (state, transition) {
    state.breadcrumbs = [
      {
        text: state.instanceconfig.institution,
        external: true,
        to: state.instanceconfig.institutionurl
      },
      {
        text: state.instanceconfig.title,
        to: transition.localePath('/')
      }
    ]
    if (transition.to.path.includes('/repostats')) {
      state.breadcrumbs.push(
        {
          text: 'Repository statistics',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/metadata-fields-help')) {
      state.breadcrumbs.push(
        {
          text: 'Metadata fields overview',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/impressum')) {
      state.breadcrumbs.push(
        {
          text: 'Impressum',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/statistics')) {
      state.breadcrumbs.push(
        {
          text: 'Statistics',
          to: transition.to.name,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/search')) {
      state.breadcrumbs.push(
        {
          text: 'Search',
          to: transition.to.path,
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('detail')) {
      if (transition.from.path.includes('/search')) {
        state.breadcrumbs.push(
          {
            text: 'Search',
            to: transition.from.path
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Detail ' + transition.to.params.pid,
          to: { name: transition.to.path, params: { pid: transition.to.params.pid } },
          disabled: true
        }
      )
    }
    if (transition.to.name.includes('uwmetadataeditor')) {
      if (transition.from.name.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata editor ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('/metadata') && !transition.to.path.includes('edit') && !transition.to.path.includes('help')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('metadata') && transition.to.path.includes('edit') && !transition.to.path.includes('help')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Metadata editor ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('rights')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Access rights ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'sort') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Sort ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('relationships')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Relationships of ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('delete')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Delete of ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('upload-webversion')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Upload web version of ' + transition.to.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.name === 'submit-related') {
      if (transition.from.name === 'detail') {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Submit of an object related to ' + transition.from.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }
    if (transition.to.path.includes('stats')) {
      if (transition.from.path.includes('detail')) {
        state.breadcrumbs.push(
          {
            text: 'Detail ' + transition.from.params.pid,
            to: { path: transition.from.path }
          }
        )
      }
      state.breadcrumbs.push(
        {
          text: 'Usage statistics for ' + transition.from.params.pid,
          to: { path: transition.to.path },
          disabled: true
        }
      )
    }

    if (transition.to.path.includes('submit') && transition.to.params && transition.to.params.cmodel && !transition.to.params.submitform) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Submit ' + transition.to.params.cmodel,
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit') && transition.to.params && transition.to.params.cmodel && transition.to.params.submitform) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      if (transition.to.params.cmodel !== 'resource') {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel,
            to: { path: transition.from.path }
          }
        )
      }
      if (transition.to.params.submitform !== 'general') {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel + ' ' + transition.to.params.submitform,
            disabled: true
          }
        )
      } else {
        state.breadcrumbs.push(
          {
            text: 'Submit ' + transition.to.params.cmodel,
            disabled: true
          }
        )
      }
    } else if (transition.to.path.includes('submit/simple')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Simple submit',
          disabled: true
        }
      )
    } else if (transition.to.name === 'submit-custom') {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Submit template ' + transition.to.params.templateid,
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit/uwm')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Legacy submit (UWMetadata)',
          disabled: true
        }
      )
    } else if (transition.to.path.includes('/submit/empty')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'New template',
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit/ksa-eda')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'KSA EDA',
          disabled: true
        }
      )
    } else if (transition.to.path.includes('submit/bruckneruni')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          to: transition.from.path
        }
      )
      state.breadcrumbs.push(
        {
          text: 'Bruckneruni',
          disabled: true
        }
      )
    } else if (transition.to.name.includes('submit')) {
      state.breadcrumbs.push(
        {
          text: 'Submit',
          disabled: true
        }
      )
    }
  },
  setLoading (state, loading) {
    state.loading = loading
  },
  setGroups (state, groups) {
    state.groups = groups
  },
  setObjectInfo (state, objectInfo) {
    state.objectInfo = objectInfo
  },
  setObjectMembers (state, objectMembers) {
    state.objectMembers = objectMembers
  },
  switchInstance (state, instance) {
    state.instance = state.config.instances[instance]
  },
  hideSnackbar (state) {
    state.snackbar = false
  },
  setAlerts (state, alerts) {
    for (const a of alerts) {
      if (a.type === 'success') {
        state.snackbar = true
      }
    }
    state.alerts = alerts
  },
  clearAlert (state, alert) {
    state.alerts = state.alerts.filter(e => e !== alert)
  },
  setUserData (state, user) {
    const data = {
      ...state.user,
      ...user
    }
    state.user = data
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  setUserToken (state, token) {
    const data = {
      ...state.user,
      token
    }
    state.user = data
    if (token) {
      localStorage.setItem('token', token)
    }
  },
  setUsername (state, username) {
    Vue.set(state.user, 'username', username)
  },
  setToken (state, token) {
    localStorage.setItem('token', token)
    Vue.set(state.user, 'token', token)
  },
  setLoginData (state, logindata) {
    const user = {
      username: logindata.username,
      firstname: logindata.firstname,
      lastname: logindata.lastname,
      email: logindata.email,
      org_units_l1: logindata.org_units_l1,
      org_units_l2: logindata.org_units_l2
    }
    const data = {
      ...state.user,
      ...user
    }
    state.user = data
    localStorage.setItem('user', JSON.stringify(user))
  },
  clearUser (state) {
    state.user = {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  clearStore (state) {
    state.alerts = []
    state.objectInfo = null
    state.objectMembers = []
    state.user = {}
    state.groups = []
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // document.cookie = 'X-XSRF-TOKEN='
  },
  setCharts (state, url) {
    state.chartsUrl.push(url)
  },
  clearCharts (state) {
    state.chartsUrl = []
  }
}

export const actions = {

  async fetchObjectInfo ({ commit, state }, pid) {
    try {
      let response
      if (state.user.token) {
        response = await axios.get(state.instanceconfig.api + '/object/' + pid + '/info',
          {
            headers: {
              'X-XSRF-TOKEN': state.user.token
            }
          }
        )
      } else {
        response = await axios.get(state.instanceconfig.api + '/object/' + pid + '/info')
      }
      commit('setObjectInfo', response.data.info)
    } catch (error) {
    }
  },
  async fetchObjectMembers ({ dispatch, commit, state }, parent) {
    commit('setObjectMembers', [])
    try {
      if (parent.members.length > 0) {
        const members = []
        for (const doc of parent.members) {
          let memresponse
          if (state.user.token) {
            memresponse = await axios.get(state.instanceconfig.api + '/object/' + doc.pid + '/info',
              {
                headers: {
                  'X-XSRF-TOKEN': state.user.token
                }
              }
            )
          } else {
            memresponse = await axios.get(state.instanceconfig.api + '/object/' + doc.pid + '/info')
          }
          members.push(memresponse.data.info)
        }
        commit('setObjectMembers', members)
      } else {
        commit('setObjectMembers', [])
      }
    } catch (error) {
    }
  },
  async getLoginData ({ commit, dispatch, state }) {
    try {
      const response = await axios.get(state.instanceconfig.api + '/directory/user/data', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      commit('setLoginData', response.data.user_data)
    } catch (error) {
      if (error.response.status === 401) {
        commit('setAlerts', [{ type: 'danger', msg: 'You have been logged out' }])
        commit('setToken', null)
        commit('setLoginData', { username: null, firstname: null, lastname: null, email: null, org_units_l1: null, org_units_l2: null })
        if (process.browser) {
          document.cookie = 'X-XSRF-TOKEN=; domain=' + window.location.hostname + '; path=/; secure; samesite=strict; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        }
      }
    }
  },
  async login ({ commit, dispatch, state }, credentials) {
    commit('clearStore')
    commit('setUsername', credentials.username)
    try {
      const response = await axios.get(state.instanceconfig.api + '/signin', {
        headers: {
          Authorization: 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      if (response.status === 200) {
        if (process.browser) {
          document.cookie = 'X-XSRF-TOKEN=' + response.data['XSRF-TOKEN'] + '; domain=' + window.location.hostname + '; path=/; secure; samesite=strict'
        }
        commit('setToken', response.data['XSRF-TOKEN'])
        dispatch('getLoginData')
      }
    } catch (error) {
    }
  },
  async logout ({ commit, dispatch, state }) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    commit('clearStore')
    if (process.browser) {
      document.cookie = 'X-XSRF-TOKEN=; domain=' + window.location.hostname + '; path=/; secure; samesite=strict; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
    try {
      const response = await axios.get(state.instanceconfig.api + '/signout', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      commit('clearStore')
      if (response.data.alerts && response.data.alerts.length > 0) {
        // commit('setAlerts', response.data.alerts)
      }
    } catch (error) {
      commit('clearStore')
    }
  },
  async getUserGroups ({ commit, state }) {
    commit('clearAlerts')
    try {
      const response = await axios.get(state.instanceconfig.api + '/groups', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      commit('setGroups', response.data.groups)
    } catch (error) {
    }
  },
  switchInstance ({ commit }, instance) {
    commit('switchInstance', instance)
  },

  setCharts ({ commit, dispatch, state }, chartUrl) {
    commit('setCharts', chartUrl)
  },

  clearCharts ({ commit, dispatch, state }) {
    commit('clearCharts')
  }
}
