<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col>

          <quicklinks v-if="isUnivie" :showquicklinks="quicklinksenabled"></quicklinks>

          <v-row no-gutters>
            <v-col cols="12" md="8" offset-md="2" class="header">

              <v-row no-gutters class="mt-2" style="min-height:125px;">
                <v-col class="text-left" cols="12" md="3" >
                  <logo></logo>
                </v-col>

                <v-col cols="9">

                  <v-row justify="start" justify-md="end" class="pl-3">
                    <icon v-if="signedin" class="personicon mr-2 univie-grey" name="material-social-person" width="24px" height="24px"></icon>
                    <span v-if="signedin" class="subheading displayname univie-grey">{{ user.firstname }} {{ user.lastname }}</span>

                    <v-menu bottom transition="slide-y-transition" class="v-align-top">
                      <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" class="top-margin-lang">
                          <span class="grey--text text--darken-1">{{ localeLabel }}</span>
                          <icon name="univie-sprache" class="lang-icon grey--text text--darken-1"></icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item v-if="useLocale('eng')" @click="changeLocale('eng')">
                          <v-list-item-title>English</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="useLocale('deu')" @click="changeLocale('deu')">
                          <v-list-item-title>Deutsch</v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="useLocale('ita')" @click="changeLocale('ita')">
                          <v-list-item-title>Italiano</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <a id="quicklinks-button" v-if="isUnivie" class="ph-button" v-on:click="quicklinksenabled = !quicklinksenabled">Quicklinks</a>

                  </v-row>

                  <v-row>
                    <v-col v-if="appconfig.showinstanceswitch" cols="4" class="select-instance text-left">
                      <v-select :items="instances" @input="switchInstance" :value="instanceconfig.baseurl" item-text="baseurl" single-line></v-select>
                    </v-col>
                    <v-col class="text-left" cols="10" offset="1" v-else-if="instanceconfig.title">
                      <icon left dark name="univie-right" color="#a4a4a4" width="14px" height="14px" class="mb-1"></icon>
                      <router-link class="subheading primary--text mx-3" :to="'/'">{{ instanceconfig.title }}</router-link>
                    </v-col>
                  </v-row>

                  <v-row>

                    <v-toolbar flat color="white" dense>
                      <client-only placeholder="loading" placeholder-tag="span">
                        <v-app-bar-nav-icon class="hidden-md-and-up">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn text icon color="grey lighten-1" v-on="on"><icon name="material-navigation-menu" width="24px" height="24px"></icon></v-btn>
                            </template>
                            <v-list>
                              <v-list-item @click="$router.push({ path: '/search', query: { reset: 1 } })"><v-list-item-title>{{ $t("Search") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('submit')"><v-list-item-title>{{ $t("Submit") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push({ path: '/search', query: { reset: 1, owner: user.username } })"><v-list-item-title>{{ $t("My objects") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('lists')"><v-list-item-title>{{ $t("Object lists") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('groups')"><v-list-item-title>{{ $t("Groups") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="!signedin && appconfig.enablelogin" @click="$router.push('login')"><v-list-item-title>{{ $t("Login") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="logout"><v-list-item-title>{{ $t("Logout") }}</v-list-item-title></v-list-item>
                            </v-list>
                          </v-menu>
                        </v-app-bar-nav-icon>
                      </client-only>
                      <v-spacer></v-spacer>
                      <v-toolbar-items class="hidden-sm-and-down no-height-inherit">
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" :to="{ path: '/search', query: { reset: 1 } }">{{ $t("Search") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/submit'">{{ $t("Submit") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="{ path: '/search', query: { reset: 1, owner: user.username } }">{{ $t("My objects") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/lists'">{{ $t("Object lists") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/groups'">{{ $t("Groups") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="!signedin && appconfig.enablelogin" :to="'/login'">{{ $t("Login") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <a class="flat dark ph-button grey" v-if="signedin" @click="logout" >{{ $t("Logout") }}</a>
                        </v-hover>
                      </v-toolbar-items>
                    </v-toolbar>

                  </v-row>

                </v-col>
              </v-row>

            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="8" offset-md="2" class="content">
              <p-breadcrumbs :items="breadcrumbs"></p-breadcrumbs>

              <template v-for="(alert, i) in alerts">
                <v-snackbar :key="'altsnack'+i" class="font-weight-regular" top color="success" v-if="alert.type === 'success'" v-model="showSnackbar">
                  {{alert.msg}}
                  <v-btn dark text @click.native="dismiss(alert)">OK</v-btn>
                </v-snackbar>
              </template>
              <template v-if="showAlerts">
                <v-row justify="center" v-for="(alert, i) in alerts" :key="'alert'+i">
                  <v-col cols="12">
                    <v-alert v-if="alert.type !== 'success'" :type="(alert.type === 'danger' ? 'error' : alert.type)" :value="true" transition="slide-y-transition">
                      <v-row align="center">
                        <v-col class="grow">{{alert.msg}}</v-col>
                        <v-col class="shrink">
                          <v-btn icon @click.native="dismiss(alert)"><v-icon>mdi-close</v-icon></v-btn>
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>
                </v-row>
              </template>

              <transition name="fade" mode="out-in">
                <keep-alive>
                  <router-view class="mb-3"></router-view>
                </keep-alive>
              </transition>

            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" v-if="isUnivie">
              <quicklinks-footer></quicklinks-footer>
            </v-col>
          </v-row>

          <p-footer></p-footer>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import Vue from 'vue'
import '@/assets/css/material-icons.css'
import Quicklinks from '@/components/Quicklinks'
import QuicklinksFooter from '@/components/QuicklinksFooter'
import '@/compiled-icons/material-social-person'
import '@/compiled-icons/material-navigation-menu'
import '@/compiled-icons/univie-sprache'
import ClientOnly from 'vue-client-only'
import Logo from '@/components/ext/Logo'
import PFooter from '@/components/ext/PFooter'
import { context } from '@/mixins/context'
import { config } from '@/mixins/config'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

export default {
  name: 'app',
  mixins: [ context, config ],
  components: {
    Quicklinks,
    QuicklinksFooter,
    ClientOnly,
    Logo,
    PFooter
  },
  data () {
    return {
      quicklinksenabled: 0
    }
  },
  computed: {
    localeLabel: function () {
      if (this.instanceconfig.ui) {
        if (this.instanceconfig.ui.twoletterlang === 1) {
          switch (this.$i18n.locale) {
            case 'eng':
              return 'en'
            case 'deu':
              return 'de'
            case 'ita':
              return 'it'
            default:
              return ''
          }
        }
      }
      return this.$i18n.locale
    },
    showAlerts: function () {
      if (this.$store.state.alerts.length > 0) {
        let onlySuccess = true
        for (let a of this.$store.state.alerts) {
          if (a.type !== 'success') {
            onlySuccess = false
          }
        }
        return !onlySuccess
      }
      return false
    },
    showSnackbar: {
      get: function () {
        return this.$store.state.snackbar
      },
      set: function (newValue) {
        if (!newValue) {
          this.$store.commit('hideSnackbar')
        }
      }
    },
    breadcrumbs () {
      return this.$store.state.breadcrumbs
    },
    alerts () {
      return this.$store.state.alerts
    },
    instances () {
      return Object.keys(this.$store.state.config.instances)
    },
    isUnivie () {
      switch (this.instanceconfig.baseurl) {
        case 'phaidra.univie.ac.at':
        case 'phaidra-sandbox.univie.ac.at':
        case 'phaidra-entw.univie.ac.at':
          return true
        default:
          return false
      }
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
    },
    getCookie: function (name) {
      let value = '; ' + document.cookie
      let parts = value.split('; ' + name + '=')
      if (parts.length === 2) {
        let val = parts.pop().split(';').shift()
        return val === ' ' ? null : val
      }
    },
    useLocale: function (lang) {
      if (this.instanceconfig.ui) {
        if (this.instanceconfig.ui.languages) {
          return this.instanceconfig.ui.languages.includes(lang)
        }
      }
      return false
    },
    changeLocale: function (lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('localeChange', lang)
    },
    dismiss: function (alert) {
      this.$store.commit('clearAlert', alert)
    },
    switchInstance: function (e) {
      this.$store.dispatch('switchInstance', e).then(() => {
        this.$store.commit('clearStore')
        this.$router.push('/search')
        this.$store.dispatch('search')
        this.$vuetify.theme.primary = this.instanceconfig.primary
      })
    },
    loadTracking: async function () {
      const scriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.async = true
        script.defer = true
        script.src = '//' + this.instanceconfig.stats.trackerbaseurl + '/matomo.js'

        const head = document.head || document.getElementsByTagName('head')[0]
        head.appendChild(script)

        script.onload = resolve
        script.onerror = reject
      })

      scriptPromise.catch((error) => {
        console.error('An error occurred trying to load ' + error.target.src + '. If the file exists you may have an ad- or trackingblocker enabled.')
      })

      return scriptPromise
    }
  },
  serverPrefetch: async function () {
    if (this.$store.state.user.token) {
      await this.$store.dispatch('getLoginData')
      console.log('fetched login: firstname[' + this.$store.state.user.firstname + '] lastname[' + this.$store.state.user.lastname + '] username[' + this.$store.state.user.username + ']')
    }
    await this.$store.dispatch('loadLanguages', this.$i18n.locale)
    await this.$store.dispatch('loadOrgUnits', this.$i18n.locale)
  },
  mounted: async function () {
    if (this.$store.state.route.query.lang === 'deu') {
      this.$i18n.locale = 'deu'
    }
    if (this.$store.state.route.query.lang === 'eng') {
      this.$i18n.locale = 'eng'
    }
    if (!this.user.token) {
      var token = this.getCookie('X-XSRF-TOKEN')
      if (token) {
        this.$store.commit('setToken', token)
        await this.$store.dispatch('getLoginData')
      }
    }
    await this.loadTracking()
    let Matomo
    if (process.browser) {
      Matomo = window.Piwik.getTracker('https://' + this.instanceconfig.stats.trackerbaseurl + '/matomo.php', this.instanceconfig.stats.siteid)
    }
    Matomo.trackPageView()
    Matomo.enableLinkTracking()
    Vue.prototype.$matomo = Matomo
    this.$router.afterEach((to, from) => {
      this.$matomo.setCustomUrl('https://' + this.$store.state.instanceconfig.baseurl + to.path)
      this.$matomo.setDocumentTitle(this.$store.state.pagetitle)
      this.$matomo.trackPageView()
    })

    if (this.appconfig.monitor) {
      if (this.appconfig.monitor.sentry) {
        if (this.appconfig.monitor.sentry.dsn) {
          Sentry.init({
            dsn: this.appconfig.monitor.sentry.dsn,
            integrations: [
              new Integrations.Vue({ Vue, attachProps: true, logErrors: true }),
              new Integrations.CaptureConsole({
                levels: ['error']
              })
            ]
          })
        }
      }
    }
  },
  created: function () {
    this.$vuetify.theme.themes.light.primary = this.instanceconfig.primary
  }
}
</script>

<style lang="sass">
  @require './stylus/main'
</style>

<style>

.no-padding {
  padding: 0px;
}

.svg-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  color: inherit;
  vertical-align: middle;
  fill: none;
  stroke: currentColor;
}

.svg-fill {
  fill: currentColor;
  stroke: none;
}

.svg-up {
  transform: rotate(0deg);
}

.svg-right {
  transform: rotate(90deg);
}

.svg-down {
  transform: rotate(180deg);
}

.svg-left {
  transform: rotate(-90deg);
}

.ie-fixMinHeight {
    display:flex;
}

html, body{
    height:100%;
}

section { overflow: auto; }

#app {
  font-family: "Roboto", sans-serif, Arial, Helvetica, sans-serif;
  font-size: 11.5pt;
  line-height: 1.42857143;
  color: black;
  background-color: white;
  font-weight: 300;
  text-rendering: optimizeLegibility;
}

a {
  text-decoration: none;
}

.logo {
  height: auto;
  width: auto;
  max-width: 250px;
  max-height: 150px;
}

.header {
  -webkit-box-shadow: 48px 0 0 0 white, -48px 0 0 0 white, 0 8px 40px -6px rgba(70, 70, 70, 0.4);
  box-shadow: 48px 0 0 0 white, -48px 0 0 0 white, 0 8px 40px -6px rgba(70, 70, 70, 0.4);
  background-color: white;
  z-index: 1;
}

address {
  font-style: normal;
}

.v-align-top {
  vertical-align: top;
}

.theme--light.v-card > .v-card__text {
  color: black;
}

.lang-icon {
  margin-left: 5px;
}

.displayname {
  vertical-align: top;
  display: inline-block;
  margin-top: 10px;
}

.ph-button  {
  color: white !important;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  outline: 0;
  border: 0;
  border-radius: 0px;
  display: inline-block;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 6px;
  margin: 6px 1px 6px 0px;
  height: 30px;
  line-height: 30px;
  min-height: 30px;
  white-space: nowrap;
  min-width: 88px;
  text-align: center;
  font-weight: 300;
  font-size: 14px;
  font-style: inherit;
  font-variant: inherit;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  overflow: hidden;
  letter-spacing: .010em;
  font-weight: 400;
}

.ph-button:hover {
  background-color: #267ab3;
  text-decoration: none;
  color: white;
  font-weight: 400;
}

#quicklinks-button {
  background-color: #1a74b0;
  text-decoration: none;
  color: white;
  margin-top: 0px;
  width: 263px;
}

#quicklinks-button:hover {
  color: white;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

.select-instance {
  max-width: 300px;
}

.border-bottom {
  border-bottom: 1px solid #bdbdbd;
}

.border-top {
  border-top: 1px solid #bdbdbd;
}

.border-left {
  border-left: 1px solid;
  border-color: rgba(0, 0, 0, 0.12);
}

#app .v-btn {
  text-transform: none;
}
#app .v-tabs__div {
  text-transform: none;
  font-weight: 300;
}

.univie-grey {
  color: #7b7b7b
}
</style>

<style scoped>
.top-margin-lang {
  margin-top: 0px;
}

.content {
  min-height: 800px;
}

.container {
  padding: 0px;
}

.no-height-inherit {
  height: unset;
}

.personicon {
  align-self: center;
}

.float-right {
  float: right;
}

</style>
