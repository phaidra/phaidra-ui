const state = {
  vocabularies: {
    'lang': {
      terms: [
        { '@id': 'deu', 'rdfs:label': [{'@value': 'German', '@language': 'eng'}] },
        { '@id': 'eng', 'rdfs:label': [{'@value': 'English', '@language': 'eng'}] }
      ],
      loaded: true
    },
    'http://id.loc.gov/vocabulary/iso639-2': {
      terms: [
        { '@id': 'http://id.loc.gov/vocabulary/iso639-2/deu', 'rdfs:label': [{'@value': 'German', '@language': 'eng'}] },
        { '@id': 'http://id.loc.gov/vocabulary/iso639-2/eng', 'rdfs:label': [{'@value': 'English', '@language': 'eng'}] }
      ],
      loaded: true
    },
    'https://phaidra.org/vocabulary/role': {
      terms: [],
      loaded: false
    },
    'http://purl.org/coar/resource_type': {
      terms: [
        { '@id': 'http://purl.org/coar/resource_type/c_ecc8', 'rdfs:label': [{'@value': 'still image', '@language': 'eng'}] },
        { '@id': 'http://purl.org/coar/resource_type/c_18cc', 'rdfs:label': [{'@value': 'sound', '@language': 'eng'}] }
      ],
      loaded: true
    },
    'getty-aat-photo': {
      terms: [
        { '@id': 'http://vocab.getty.edu/aat/300162056', 'rdfs:label': [{'@value': 'black-and-white photography', '@language': 'eng'}] },
        { '@id': 'http://vocab.getty.edu/aat/300134530', 'rdfs:label': [{'@value': 'color photography', '@language': 'eng'}] }
      ],
      loaded: true
    },
    'un-cefact': {
      terms: [
        { '@id': 'MTR', 'rdfs:label': [{'@value': 'm'}] },
        { '@id': 'CMT', 'rdfs:label': [{'@value': 'cm'}] },
        { '@id': 'MMT', 'rdfs:label': [{'@value': 'mm'}] }
      ],
      loaded: true
    },
    'mime-types': {
      terms: [
        { '@id': 'image/jpeg', 'rdfs:label': [{'@value': 'JPG/JPEG'}] },
        { '@id': 'image/tiff', 'rdfs:label': [{'@value': 'TIFF'}] },
        { '@id': 'image/gif', 'rdfs:label': [{'@value': 'GIF'}] },
        { '@id': 'image/png', 'rdfs:label': [{'@value': 'PNG'}] },
        { '@id': 'image/x-ms-bmp', 'rdfs:label': [{'@value': 'BMP'}] },
        { '@id': 'audio/wav', 'rdfs:label': [{'@value': 'WAVE'}] },
        { '@id': 'audio/mpeg', 'rdfs:label': [{'@value': 'MP3'}] },
        { '@id': 'audio/flac', 'rdfs:label': [{'@value': 'FLAC'}] },
        { '@id': 'audio/ogg', 'rdfs:label': [{'@value': 'Ogg'}] },
        { '@id': 'application/pdf', 'rdfs:label': [{'@value': 'PDF'}] },
        { '@id': 'video/mpeg', 'rdfs:label': [{'@value': 'MPEG'}] },
        { '@id': 'video/avi', 'rdfs:label': [{'@value': 'AVI'}] },
        { '@id': 'video/mp4', 'rdfs:label': [{'@value': 'MPEG-4'}] },
        { '@id': 'video/quicktime', 'rdfs:label': [{'@value': 'Quicktime'}] },
        { '@id': 'video/x-matroska', 'rdfs:label': [{'@value': 'MKV'}] }
      ],
      loaded: true
    },
    'licenses': {
      terms: [
        { '@id': 'http://rightsstatements.org/vocab/InC/1.0/', 'rdfs:label': [{'@value': 'All rights reserved', '@language': 'eng'}] },
        { '@id': 'http://creativecommons.org/licenses/by/4.0/', 'rdfs:label': [{'@value': 'CC BY 4.0 International', '@language': 'eng'}] },
        { '@id': 'http://creativecommons.org/licenses/by-nc/4.0/', 'rdfs:label': [{'@value': 'CC BY-NC 4.0 International', '@language': 'eng'}] },
        { '@id': 'http://creativecommons.org/licenses/by-nc-nd/4.0/', 'rdfs:label': [{'@value': 'CC BY-NC-ND 4.0 International', '@language': 'eng'}] },
        { '@id': 'http://creativecommons.org/licenses/by-nc-sa/4.0/', 'rdfs:label': [{'@value': 'CC BY-NC-SA 4.0 International', '@language': 'eng'}] },
        { '@id': 'http://creativecommons.org/licenses/by-nd/4.0/', 'rdfs:label': [{'@value': 'CC BY-ND 4.0 International', '@language': 'eng'}] },
        { '@id': 'http://creativecommons.org/licenses/by-sa/4.0/', 'rdfs:label': [{'@value': 'CC BY-SA 4.0 International', '@language': 'eng'}] }
      ],
      loaded: true
    },
    'original-copy': {
      terms: [
        { '@id': 'original', 'rdfs:label': [{'@value': 'original', '@language': 'eng'}] },
        { '@id': 'copy', 'rdfs:label': [{'@value': 'copy', '@language': 'eng'}] }
      ],
      loaded: true
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
          var label = []
          var l = data[i]['http://www.w3.org/2004/02/skos/core#prefLabel'][j]
          if (l['@language'] === 'en') {
            label.push({ '@value': l['@value'], '@language': 'eng' })
          }
          if (l['@language'] === 'de') {
            label.push({ '@value': l['@value'], '@language': 'deu' })
          }
        }
        state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms.push({ '@id': data[i]['@id'], 'rdfs:label': label })
      }
    }
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'].loaded = true
  },
  setRolesTerms (state, marcRoles) {
    for (var role in marcRoles) {
      state.vocabularies['https://phaidra.org/vocabulary/role'].terms.push({ '@id': role, 'rdfs:label': [{'@value': marcRoles[role], '@language': 'eng'}] })
    }
    state.vocabularies['https://phaidra.org/vocabulary/role'].loaded = true
  },
  initStore (state) {
    /*
    state.vocabularies['http://id.loc.gov/vocabulary/iso639-2'] = {
      terms: [],
      loaded: false
    }
    */
    state.vocabularies['https://phaidra.org/vocabulary/role'] = {
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
    if (!state.vocabularies['https://phaidra.org/vocabulary/role'].loaded) {
      commit('setRolesTerms', rootState.search.marcRoles)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
