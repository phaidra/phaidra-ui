const state = {
  vocabularies: {
    'http://id.loc.gov/vocabulary/iso639-2': {
      terms: [],
      loaded: false
    }
  }
}

const mutations = {
  setLanguagesTerms (state, data) {
    var i, j
    for (i = 0; i < data.length; i++) {
      for (j = 0; j < data[i]['http://www.w3.org/2004/02/skos/core#prefLabel'].length; j++) {
        // TODO: add variants to i18n
        var label
        var l = data[i]['http://www.w3.org/2004/02/skos/core#prefLabel'][j]       
        if(l['@language'] === 'en'){
          label = l['@value']
        }
      }
      state.languages.terms.push({ uri: data[i]['@id'], label: label })
    }
  },
  initStore (state) {
    state.languages = {
      uri: 'http://id.loc.gov/vocabulary/iso639-2',
      terms: []
    }
  }
}

const actions = {
  loadLanguages ({ commit, state, rootState }) {
    commit('clearAlerts')

    fetch(rootState.settings.api + '/vocabulary?uri=http://id.loc.gov/vocabulary/iso639-2', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'X-XSRF-TOKEN': rootState.user.token
      }
    })
    .then(function (response) { return response.json() })
    .then(function (json) {
      commit('setLanguagesTerms', json.vocabulary)
    })
    .catch(function (error) { console.log(error) })
  }
}

export default {
  state,
  mutations,
  actions
}
