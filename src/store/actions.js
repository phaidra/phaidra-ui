import axios from 'axios'
import qs from 'qs'

export default {
  async fetchObjectInfo ({ commit, state }, pid) {
    console.log('[' + pid + '] fetching object info')
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
      console.log('[' + pid + '] fetching object info done')
      commit('setObjectInfo', response.data.info)
    } catch (error) {
      console.log(error)
    }
  },
  async fetchObjectMembers ({ dispatch, commit, state }, pid) {
    console.log('[' + pid + '] fetching object members')
    commit('setObjectMembers', [])
    let params = {
      q: 'ismemberof:"' + pid + '"',
      defType: 'edismax',
      wt: 'json',
      qf: 'ismemberof^5',
      fl: 'pid',
      sort: 'pos_in_' + pid.replace(':', '_') + ' asc'
    }
    let query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
    try {
      let response = await axios.get(state.instanceconfig.solr + '/select?' + query)
      console.log('[' + pid + '] fetching object members done')
      if (response.data.response.numFound > 0) {
        let members = []
        for (let doc of response.data.response.docs) {
          console.log('[' + pid + '] fetching object info of member ' + doc.pid)
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
          console.log('[' + pid + '] fetching object info of member ' + doc.pid + ' done')
          members.push(memresponse.data.info)
        }
        commit('setObjectMembers', members)
      } else {
        commit('setObjectMembers', [])
      }
    } catch (error) {
      console.log(error)
    }
  },
  async getLoginData ({ commit, dispatch, state }) {
    try {
      let response = await axios.get(state.config.api + '/directory/user/data', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      console.log('[' + state.user.username + '] got user data firstname[' + response.data.user_data.firstname + '] lastname[' + response.data.user_data.lastname + '] email[' + response.data.user_data.email + ']')
      commit('setLoginData', response.data.user_data)
    } catch (error) {
      console.log(error)
    }
  },
  async login ({ commit, dispatch, state }, credentials) {
    console.log('[' + credentials.username + '] logging in')
    commit('clearStore')
    commit('setUsername', credentials.username)
    try {
      let response = await axios.get(state.config.api + '/signin', {
        headers: {
          'Authorization': 'Basic ' + btoa(credentials.username + ':' + credentials.password)
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      if (response.status === 200) {
        console.log('[' + state.user.username + '] login successful token[' + response.data['XSRF-TOKEN'] + '], fetching user data')
        commit('setToken', response.data['XSRF-TOKEN'])
        document.cookie = 'X-XSRF-TOKEN=' + response.data['XSRF-TOKEN']
        dispatch('getLoginData')
      }
    } catch (error) {
      console.log(error)
    }
  },
  async logout ({ commit, dispatch, state }) {
    document.cookie = 'X-XSRF-TOKEN='
    try {
      let response = await axios.get(state.instanceconfig.api + '/signout', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      commit('clearStore')
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
    } catch (error) {
      commit('clearStore')
      console.log(error)
    }
  },
  async getUserGroups ({ commit, state }) {
    commit('clearAlerts')
    try {
      let response = await axios.get(state.instanceconfig.api + '/groups', {
        headers: {
          'X-XSRF-TOKEN': state.user.token
        }
      })
      if (response.data.alerts && response.data.alerts.length > 0) {
        commit('setAlerts', response.data.alerts)
      }
      commit('setGroups', response.data.groups)
    } catch (error) {
      console.log(error)
    }
  },
  switchInstance ({ commit }, instance) {
    commit('switchInstance', instance)
  }
}
