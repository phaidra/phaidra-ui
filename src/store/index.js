import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import alerts from './modules/alerts'
import search from './modules/search'
import groups from './modules/groups'
import object from './modules/object'
import vocabulary from './modules/vocabulary'
import settings from './modules/settings'
import config from '../config/phaidra-ui'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    config: config
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
