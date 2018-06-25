const state = {
  vocabularies: {
    'lang': {
      terms: [],
      loaded: false
    },
    'http://id.loc.gov/vocabulary/iso639-2': {
      terms: [],
      loaded: false
    },
    'https://phaidra.org/vocabulary/roles': {
      terms: [],
      loaded: false
    }
  }
}

const mutations = {
  setIso6392Terms (state, data) {
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
  setIso6392TermsStatic (state) {
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms = [
      { value: 'http://id.loc.gov/vocabulary/iso639-2/deu', text: 'German' },
      { value: 'http://id.loc.gov/vocabulary/iso639-2/eng', text: 'English' }
    ]
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded = true
  },
  setLangTermsStatic (state) {
    state.vocabularies['lang'].terms = [
      { value: 'deu', text: 'German' },
      { value: 'eng', text: 'English' }
    ]
    state.vocabularies['lang'].loaded = true
  },
  setRolesTerms (state, rootState) {
    // todo
  },
  setRolesTermsStatic (state, rootState) {
    for (var role in rootState.search.marcRoles) {
      state.vocabularies['https://phaidra.org/vocabulary/roles'].terms.push({ value: role, text: rootState.search.marcRoles[role] })
    }
    state.vocabularies['https://phaidra.org/vocabulary/roles'].loaded = true
  },
  initStore (state) {
    state.vocabularies = {
      'lang': {
        terms: [],
        loaded: false
      },
      'http://id.loc.gov/vocabulary/iso639-2': {
        terms: [],
        loaded: false
      },
      'https://phaidra.org/vocabulary/roles': {
        terms: [],
        loaded: false
      }
    }
  }
}

const actions = {
  loadIso6392 ({ commit, state, rootState }) {
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
        commit('setIso6392Terms', json.vocabulary)
      })
      .catch(function (error) { console.log(error) })
    }
  },
  loadIso6392Static ({ commit, state }) {
    if (!state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded) {
      commit('setIso6392TermsStatic')
    }
  },
  loadLangStatic ({ commit, state }) {
    if (!state.vocabularies['lang'].loaded) {
      commit('setLangTermsStatic')
    }
  },
  loadRoles ({ commit, state, rootState }) {
    if (!state.vocabularies['https://phaidra.org/vocabulary/roles'].loaded) {
      fetch(rootState.settings.instance.api + '/vocabulary?uri=https://phaidra.org/vocabulary/roles', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'X-XSRF-TOKEN': rootState.user.token
        }
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        commit('setRolesTerms', json.vocabulary)
      })
      .catch(function (error) { console.log(error) })
    }
  },
  loadRolesStatic ({ commit, state, rootState }) {
    if (!state.vocabularies['https://phaidra.org/vocabulary/roles'].loaded) {
      commit('setRolesTermsStatic', rootState)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
