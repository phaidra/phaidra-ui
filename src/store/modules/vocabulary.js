import languages from '@/utils/lang'

const state = {
  vocabularies: {
    'lang': {
      terms: [
        { '@id': 'deu', 'skos:prefLabel': { 'eng': 'German', 'deu': 'Deutsch' } },
        { '@id': 'eng', 'skos:prefLabel': { 'eng': 'English', 'deu': 'English' } }
      ],
      loaded: true
    },
    'iso639-2': {
      terms: [
        { '@id': 'deu', 'skos:prefLabel': { 'eng': 'German', 'deu': 'Deutsch' } },
        { '@id': 'eng', 'skos:prefLabel': { 'eng': 'English', 'deu': 'English' } }
      ],
      loaded: true
    },
    'https://phaidra.org/vocabulary/role': {
      terms: [],
      loaded: false
    },
    'http://purl.org/coar/resource_type': {
      terms: [
        { '@id': 'http://purl.org/coar/resource_type/c_ecc8', 'skos:prefLabel': {'eng': 'still image'} },
        { '@id': 'http://purl.org/coar/resource_type/c_18cc', 'skos:prefLabel': {'eng': 'sound'} }
      ],
      loaded: true
    },
    'getty-aat-photo': {
      terms: [
        { '@id': 'http://vocab.getty.edu/aat/300162056', 'skos:prefLabel': {'eng': 'black-and-white photography'} },
        { '@id': 'http://vocab.getty.edu/aat/300134530', 'skos:prefLabel': {'eng': 'color photography'} }
      ],
      loaded: true
    },
    'un-cefact': {
      terms: [
        { '@id': 'MTR', 'skos:prefLabel': {'eng': 'm'} },
        { '@id': 'CMT', 'skos:prefLabel': {'eng': 'cm'} },
        { '@id': 'MMT', 'skos:prefLabel': {'eng': 'mm'} }
      ],
      loaded: true
    },
    'mime-types': {
      terms: [
        { '@id': 'image/jpeg', 'skos:prefLabel': {'eng': 'JPG/JPEG'} },
        { '@id': 'image/tiff', 'skos:prefLabel': {'eng': 'TIFF'} },
        { '@id': 'image/gif', 'skos:prefLabel': {'eng': 'GIF'} },
        { '@id': 'image/png', 'skos:prefLabel': {'eng': 'PNG'} },
        { '@id': 'image/x-ms-bmp', 'skos:prefLabel': {'eng': 'BMP'} },
        { '@id': 'audio/wav', 'skos:prefLabel': {'eng': 'WAVE'} },
        { '@id': 'audio/mpeg', 'skos:prefLabel': {'eng': 'MP3'} },
        { '@id': 'audio/flac', 'skos:prefLabel': {'eng': 'FLAC'} },
        { '@id': 'audio/ogg', 'skos:prefLabel': {'eng': 'Ogg'} },
        { '@id': 'application/pdf', 'skos:prefLabel': {'eng': 'PDF'} },
        { '@id': 'video/mpeg', 'skos:prefLabel': {'eng': 'MPEG'} },
        { '@id': 'video/avi', 'skos:prefLabel': {'eng': 'AVI'} },
        { '@id': 'video/mp4', 'skos:prefLabel': {'eng': 'MPEG-4'} },
        { '@id': 'video/quicktime', 'skos:prefLabel': {'eng': 'Quicktime'} },
        { '@id': 'video/x-matroska', 'skos:prefLabel': {'eng': 'MKV'} }
      ],
      loaded: true
    },
    'licenses': {
      terms: [
        { '@id': 'http://rightsstatements.org/vocab/InC/1.0/', 'skos:prefLabel': {'eng': 'All rights reserved', '@language': 'eng'} },
        { '@id': 'http://creativecommons.org/licenses/by/4.0/', 'skos:prefLabel': {'eng': 'CC BY 4.0 International', '@language': 'eng'} },
        { '@id': 'http://creativecommons.org/licenses/by-nc/4.0/', 'skos:prefLabel': {'eng': 'CC BY-NC 4.0 International', '@language': 'eng'} },
        { '@id': 'http://creativecommons.org/licenses/by-nc-nd/4.0/', 'skos:prefLabel': {'eng': 'CC BY-NC-ND 4.0 International', '@language': 'eng'} },
        { '@id': 'http://creativecommons.org/licenses/by-nc-sa/4.0/', 'skos:prefLabel': {'eng': 'CC BY-NC-SA 4.0 International', '@language': 'eng'} },
        { '@id': 'http://creativecommons.org/licenses/by-nd/4.0/', 'skos:prefLabel': {'eng': 'CC BY-ND 4.0 International', '@language': 'eng'} },
        { '@id': 'http://creativecommons.org/licenses/by-sa/4.0/', 'skos:prefLabel': {'eng': 'CC BY-SA 4.0 International', '@language': 'eng'} }
      ],
      loaded: true
    },
    'original-copy': {
      terms: [
        { '@id': 'original', 'skos:prefLabel': {'eng': 'original'} },
        { '@id': 'copy', 'skos:prefLabel': {'eng': 'copy'} }
      ],
      loaded: true
    }
  }
}

const mutations = {
  setIso6392Terms (state, data) {
    state.vocabularies['iso639-2']['terms'] = data
  },
  setRolesTerms (state, marcRoles) {
    for (var role in marcRoles) {
      state.vocabularies['https://phaidra.org/vocabulary/role'].terms.push({ '@id': role, 'skos:prefLabel': {'eng': marcRoles[role]} })
    }
    state.vocabularies['https://phaidra.org/vocabulary/role'].loaded = true
  },
  initStore (state) {
    state.vocabularies['https://phaidra.org/vocabulary/role'] = {
      terms: [],
      loaded: false
    }
  }
}

const actions = {
  loadIso6392 ({ commit }) {
    commit('setIso6392Terms', languages.get_lang())
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
