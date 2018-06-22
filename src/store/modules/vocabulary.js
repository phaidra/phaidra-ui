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
      if (data[i]['http://www.w3.org/2004/02/skos/core#prefLabel']) {
        for (j = 0; j < data[i]['http://www.w3.org/2004/02/skos/core#prefLabel'].length; j++) {
          // TODO: add variants to i18n
          var label
          var l = data[i]['http://www.w3.org/2004/02/skos/core#prefLabel'][j]
          if (l['@language'] === 'en') {
            label = l['@value']
          }
        }
        state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms.push({ value: data[i]['@id'], text: label })
      }
    }
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded = true
  },
  setLanguagesTermsStatic (state) {
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms = [
      { value: 'deu', text: 'German' },
      { value: 'eng', text: 'English' }
    ]
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded = true
  },
  initStore (state) {
    state.vocabularies = {
      'http://id.loc.gov/vocabulary/iso639-2': {
        terms: [],
        loaded: false
      }
    }
  }
}

const actions = {
  loadLanguages ({ commit, state, rootState }) {
    if (!state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded) {
      fetch(rootState.settings.instance.api + '/vocabulary?uri=http://id.loc.gov/vocabulary/iso639-2', {
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
  },
  loadLanguagesStatic ({ commit, state, rootState }) {
    if (!state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded) {
      commit('setLanguagesTermsStatic')
    }
  }
}

export default {
  state,
  mutations,
  actions
}
