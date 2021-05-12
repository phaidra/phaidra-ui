import Vue from 'vue'
import VueI18n from 'vue-i18n'
import eng from './ext/eng'
import deu from './ext/deu'
import ita from './ext/ita'

Vue.use(VueI18n)
const messages = { eng: eng, deu: deu, ita: ita }
export default new VueI18n({
  locale: 'deu',
  fallbackLocale: 'eng',
  silentTranslationWarn: true,
  messages
})
