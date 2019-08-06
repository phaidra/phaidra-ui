import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import alerts from './modules/alerts'
import search from './modules/search'
import groups from './modules/groups'
import object from './modules/object'
import settings from './modules/settings'
import vocabulary from 'phaidra-vue-components/src/store/modules/vocabulary'
import config from '../config/phaidra-ui'
import axios from 'axios'
// import qs from 'qs'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export function createStore () {
  return new Vuex.Store({
    state: () => ({
      config: config,
      currentOwner: '',
      objectInfo: null
    }),
    actions: {
      async fetchOwner ({ commit }, username) {
        var url = 'https://services.phaidra-sandbox.univie.ac.at/api/directory/user/' + username + '/data'
        try {
          let response = await axios.get(url)
          // self.owner = response.data.user_data
          commit('setOwner', response.data.user_data)
          console.log('username[' + username + '] loaded owner[' + response.data.user_data.firstname + ' ' + response.data.user_data.lastname + ']')
        } catch (error) {
          console.log(error)
        }
      },
      async fetchObjectInfo ({ commit }, pid) {
        let url = 'https://services.phaidra-sandbox.univie.ac.at/api/object/' + pid + '/info'
        let response = await axios.get(url)
        try {
          console.log('[' + pid + '] loaded data')
          commit('setObjectInfo', response.data.info)
        } catch (error) {
          console.log(error)
        }
      }
    },
    mutations: {
      setOwner (state, owner) {
        state.currentOwner = owner
      },
      setObjectInfo (state, objectInfo) {
        state.objectInfo = objectInfo
      }
    },
    modules: {
      settings,
      user,
      alerts,
      search,
      groups,
      object,
      vocabulary
    },
    strict: debug
  })
}
