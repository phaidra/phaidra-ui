const state = {
  groups: []
}

const mutations = {
  setGroups (state, groups) {
    state.groups = groups
  },
  initStore (state) {
    state.groups = []
  }
}

const actions = {
  getUserGroups ({ commit, state, rootState }) {
    commit('clearAlerts')

    fetch(rootState.settings.api + '/groups', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-XSRF-TOKEN': rootState.user.token
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

export default {
  state,
  mutations,
  actions
}
