const state = {
  alerts: []
}

const mutations = {
  setAlerts (state, alerts) {
    state.alerts = alerts
  },
  clearAlerts (state) {
    state.alerts = []
  }
}

export default {
  state,
  mutations
}
