const state = {
  groups: []
}

const actions = {
  getUserGroups ({ commit, state }) {
    commit('alerts/clearAlert')

    fetch(state.config.api + '/groups', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-XSRF-TOKEN': state.currentUser.token
      }
    })
    .then(function (response) { return response.json() })
    .then(function (json) {
      commit('alerts/setAlerts', json.alerts)
      commit('setGroups', json.groups)
    })
    .catch(function (error) { console.log(error) })
  }
}

const mutations = {
  setGroups (state, groups) {
    state.currentUser.groups = groups
  }
}

export default {
  state,
  actions,
  mutations
}
