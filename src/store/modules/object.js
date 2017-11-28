import qs from 'qs'

const state = {
  pid: '',
  doc: null,
  metadata: null
}

const mutations = {
  setPid (state, pid) {
    state.pid = pid
  },
  setDoc (state, doc) {
    state.doc = doc
  },
  setMetadata (state, data) {
    state.metadata = data
  }
}

const actions = {
  loadDoc ({ dispatch, commit, state, rootState }, pid) {
    commit('setPid', pid)

    var params = {
      q: 'pid:"' + pid + '"',
      defType: 'edismax',
      wt: 'json',
      qf: 'pid^5'
    }

    var query = qs.stringify(params, { encodeValuesOnly: true, indices: false })
    var url = rootState.config.solr + '/select?' + query
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
    .then(function (response) { return response.json() })
    .then(function (json) {
      if (json.response.numFound > 0) {
        commit('setDoc', json.response.docs[0])
        dispatch('loadOwner')
      } else {
        commit('setDoc', null)
      }
    })
    .catch(function (error) {
      console.log(error)
    })

    return promise
  },
  loadMetadata ({ commit, state, rootState }, pid) {
    var url = rootState.config.api + '/object/' + pid + '/metadata?mode=resolved'
    var promise = fetch(url, {
      method: 'GET',
      mode: 'cors'
    })
    .then(function (response) { return response.json() })
    .then(function (json) {
      commit('setMetadata', json.metadata)
    })
    .catch(function (error) {
      console.log(error)
    })

    return promise
  }
}

export default {
  state,
  mutations,
  actions
}
