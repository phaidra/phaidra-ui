import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import config from '../config/phaidra-ui'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    themes: {
      light: {
        primary: config.instances[config.defaultinstance].primary
      },
      dark: {
        primary: config.instances[config.defaultinstance].primary
      }
    }
  }
})
