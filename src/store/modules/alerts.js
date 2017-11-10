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
  clearAlerts (state) {
    state.alerts = []
  }
}

export default {
  state,
  mutations
}
