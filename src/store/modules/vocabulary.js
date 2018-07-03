const state = {
  vocabularies: {
    'lang': {
      terms: [
        { value: 'deu', text: 'German' },
        { value: 'eng', text: 'English' }
      ],
      loaded: false
    },
    'http://id.loc.gov/vocabulary/iso639-2': {
      terms: [
        { value: 'http://id.loc.gov/vocabulary/iso639-2/deu', text: 'German' },
        { value: 'http://id.loc.gov/vocabulary/iso639-2/eng', text: 'English' }
      ],
      loaded: false
    },
    'https://phaidra.org/vocabulary/roles': {
      terms: [],
      loaded: false
    },
    'getty-aat-photo': {
      terms: [
        { value: 'http://vocab.getty.edu/aat/300162056', text: 'black-and-white photography' },
        { value: 'http://vocab.getty.edu/aat/300134530', text: 'color photography' }
      ],
      loaded: false
    },
    'un-cefact': {
      terms: [
        { value: 'MTR', text: 'm' },
        { value: 'CMT', text: 'cm' },
        { value: 'MMT', text: 'mm' }
      ],
      loaded: false
    },
    'mime-types': {
      terms: [
        { value: 'image/jpeg', text: 'JPG/JPEG' },
        { value: 'image/tiff', text: 'TIFF' },
        { value: 'image/gif', text: 'GIF' },
        { value: 'image/png', text: 'PNG' },
        { value: 'image/x-ms-bmp', text: 'BMP' },
        { value: 'audio/wav', text: 'WAVE' },
        { value: 'audio/mpeg', text: 'MP3' },
        { value: 'audio/flac', text: 'FLAC' },
        { value: 'audio/ogg', text: 'Ogg' },
        { value: 'application/pdf', text: 'PDF' },
        { value: 'video/mpeg', text: 'MPEG' },
        { value: 'video/avi', text: 'AVI' },
        { value: 'video/mp4', text: 'MPEG-4' },
        { value: 'video/quicktime', text: 'Quicktime' },
        { value: 'video/x-matroska', text: 'MKV' }
      ],
      loaded: false
    },
    'licenses': {
      terms: [
        { value: 'http://rightsstatements.org/vocab/InC/1.0/', text: 'All rights reserved' },
        { value: 'http://creativecommons.org/licenses/by/4.0/', text: 'CC BY 4.0 International' },
        { value: 'http://creativecommons.org/licenses/by-nc/4.0/', text: 'CC BY-NC 4.0 International' },
        { value: 'http://creativecommons.org/licenses/by-nc-nd/4.0/', text: 'CC BY-NC-ND 4.0 International' },
        { value: 'http://creativecommons.org/licenses/by-nc-sa/4.0/', text: 'CC BY-NC-SA 4.0 International' },
        { value: 'http://creativecommons.org/licenses/by-nd/4.0/', text: 'CC BY-ND 4.0 International' },
        { value: 'http://creativecommons.org/licenses/by-sa/4.0/', text: 'CC BY-SA 4.0 International' }
      ],
      loaded: false
    },
    'original-copy': {
      terms: [
        { value: 'original', text: 'original' },
        { value: 'copy', text: 'copy' }
      ],
      loaded: false
    },
    'digital-origin': {
      terms: [
        { value: 'born digital', text: 'born digital' },
        { value: 'reformatted digital', text: 'reformatted digital' },
        { value: 'digitized microfilm', text: 'digitized microfilm' },
        { value: 'digitized other analog', text: 'digitized other analog' }
      ],
      loaded: false
    },
    'stamp': {
      terms: [
        { value: 'Dr. F. Dörbeck [blau, Stempel]', text: 'Dr. F. Dörbeck [blau, Stempel]' }
      ],
      loaded: false
    }
  }
}

const mutations = {
  setIso6392Terms (state, data) {
    var i, j
    for (i = 0; i < data.length; i++) {
      if (data[i]['http://www.w3.org/2004/02/skos/core#prefLabel']) {
        state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms = []
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
  setRolesTerms (state, marcRoles) {
    for (var role in marcRoles) {
      state.vocabularies['https://phaidra.org/vocabulary/roles'].terms.push({ value: role, text: marcRoles[role] })
    }
    state.vocabularies['https://phaidra.org/vocabulary/roles'].loaded = true
  },
  initStore (state) {
    /*
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'] = {
      terms: [],
      loaded: false
    }
    */
    state.vocabularies['https://phaidra.org/vocabulary/roles'] = {
      terms: [],
      loaded: false
    }
  }
}

const actions = {
  loadIso6392 ({ commit, state, rootState }) {
    if (!state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded) {
      state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'] = {
        terms: [],
        loaded: false
      }
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
  loadRoles ({ commit, state, rootState }) {
    if (!state.vocabularies['https://phaidra.org/vocabulary/roles'].loaded) {
      commit('setRolesTerms', rootState.search.marcRoles)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
