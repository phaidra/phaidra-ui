import Vue from 'vue'
import VueI18n from 'vue-i18n'
import eng from './ext/eng'
import deu from './ext/deu'
import ita from './ext/ita'
import config from '../config/phaidra-ui'

let locale = 'deu'
const instConfig = config.instances[config.defaultinstance]
if (instConfig.ui) {
  if (instConfig.ui.languages) {
    locale = instConfig.ui.languages[0]
  }
}

// fallbackLocale must contain every key that should be translated
Object.entries(deu).forEach(([key, value]) => {
  if (!eng[key]) {
    eng[key] = key
  }
})

Vue.use(VueI18n)
const messages = { eng: eng, deu: deu, ita: ita }
export default new VueI18n({
  locale,
  fallbackLocale: 'eng',
  silentTranslationWarn: true,
  messages
})
