import axios from 'axios'
import qs from 'qs'

export default {
  async fetchObjectInfo ({ commit, state }, pid) {
    console.log('[' + pid + '] fetching object info')
    let response = await axios.get(state.instanceconfig.api + '/object/' + pid + '/info')
    try {
      console.log('[' + pid + '] fetching object info done')
      commit('setObjectInfo', response.data.info)
    } catch (error) {
      console.log(error)
    }
  },
  async fetchObjectMembers ({ dispatch, commit, state }, pid) {
    console.log('[' + pid + '] fetching object members')
    commit('setMembers', [])
    let params = {
      q: 'ismemberof:"' + pid + '"',
      defType: 'edismax',
      wt: 'json',
      qf: 'ismemberof^5',
      fl: 'pid',
      sort: 'pos_in_' + pid.replace(':', '_') + ' asc'
    }
    let query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
    let response = await axios.get(state.instanceconfig.solr + '/select?' + query)
    try {
      console.log('[' + pid + '] fetching object members done')
      if (response.data.response.numFound > 0) {
        let members = []
        for (let doc of response.data.response.docs) {
          console.log('[' + pid + '] fetching object info of member ' + doc.pid)
          let memresponse = await axios.get(state.instanceconfig.api + '/object/' + doc.pid + '/info')
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
  async login ({ commit, dispatch, state }, credentials) {
    console.log('[' + credentials.username + '] logging in')
    commit('clearStore')
    commit('setUsername', credentials.username)
    try {
      let response = await axios.get(state.instanceconfig.api + '/signin', {
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
        // document.cookie = 'X-XSRF-TOKEN=' + response.data['XSRF-TOKEN']
        let userdatares = await axios.get(state.instanceconfig.api + '/directory/user/' + state.user.username + '/data', {
          headers: {
            'X-XSRF-TOKEN': state.user.token
          }
        })
        if (userdatares.data.alerts && userdatares.data.alerts.length > 0) {
          commit('setAlerts', userdatares.data.alerts)
        }
        console.log('[' + state.user.username + '] got user data firstname[' + userdatares.data.user_data.firstname + '] lastname[' + userdatares.data.user_data.lastname + '] email[' + userdatares.data.user_data.email + ']')
        commit('setLoginData', userdatares.data.user_data)
      }
    } catch (error) {
      console.log(error)
    }
  },
  async logout ({ commit, dispatch, state }) {
    // document.cookie = 'X-XSRF-TOKEN='
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
  switchInstance ({ commit }, instance) {
    commit('switchInstance', instance)
  }
}
