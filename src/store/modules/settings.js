const state = {
  instance: null
}

const mutations = {
  initSettings (state, rootState) {
    state.instance = rootState.config.instances[rootState.config.defaultinstance]
  },
  switchInstance (state, payload) {
    state.instance = payload.rootState.config.instances[payload.instance]
  }
}

const actions = {
  switchInstance ({ commit, rootState }, instance) {
    // this commits initStore in every store module which has it
    commit('initStore', rootState)
    commit('switchInstance', { rootState: rootState, instance: instance })
  },
  initStore ({ commit, rootState }) {
    commit('initSettings', rootState)
  }
}

export default {
  state,
  mutations,
  actions
}
