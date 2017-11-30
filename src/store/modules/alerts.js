const state = {
  alerts: []
}

const mutations = {
  setAlerts (state, alerts) {
    state.alerts = alerts
  },
  clearAlert (state, alert) {
    state.alerts = state.alerts.filter(e => e !== alert)
  },
  initStore (state) {
    state.alerts = []
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions
}
