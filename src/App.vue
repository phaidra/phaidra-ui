<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col>

          <quicklinks v-if="isUnivie" :showquicklinks="quicklinksenabled"></quicklinks>

          <v-row no-gutters>
            <v-col cols="12" md="10" offset-md="1" class="header">

              <v-row no-gutters>
                <v-col class="text-left" cols="3" >
                  <router-link :to="'/'">
                    <img v-if="isUnivie" src="./assets/Uni_Logo_2016.png" class="logo" alt="logo" />
                    <img v-if="instanceconfig.baseurl === 'volare.vorarlberg.at'" src="./assets/logo_vorarlberg_land.png" class="logo" alt="logo" />
                    <img v-if="instanceconfig.baseurl === 'phaidra.kug.ac.at'" src="./assets/kug_logo.gif" class="logo" alt="logo" />
                    <img v-if="instanceconfig.baseurl === 'phaidra.bibliothek.uni-ak.ac.at'" src="./assets/uniak_logo.png" class="logo pt-5" alt="logo" />
                    <img v-if="instanceconfig.baseurl === 'phaidra.ufg.at'" src="./assets/logo_ufg.gif" class="logo pt-5" alt="logo" />
                    <img v-if="instanceconfig.baseurl === 'e-book.fwf.ac.at'" src="./assets/fwf_logo.png" class="logo pt-5 pb-4" alt="logo" />
                    <img v-if="instanceconfig.baseurl === 'phaidra.fhstp.ac.at'" src="./assets/fhstp_logo.svg" class="logo" alt="logo" />
                    <v-col v-if="instanceconfig.baseurl === 'phaidra.cab.unipd.it'" style="width: 165px; height: 54px; background-color: #EB001E; margin-top: 50px;"><img src="./assets/unipd_logo.png" class="logo" alt="logo" /></v-col>
                  </router-link>
                </v-col>

                <v-col cols="9">

                  <v-row justify="end">
                    <icon v-if="signedin" class="personicon mr-2 univie-grey" name="material-social-person" width="24px" height="24px"></icon>
                    <span v-if="signedin" class="subheading displayname univie-grey">{{ user.firstname }} {{ user.lastname }}</span>

                    <v-menu bottom transition="slide-y-transition" class="v-align-top">
                      <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" class="top-margin-lang">
                          <span class="grey--text text--darken-1">{{$i18n.locale}}</span>
                          <icon name="univie-sprache" class="lang-icon grey--text text--darken-1"></icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="$i18n.locale='eng'">
                          <v-list-item-title>English</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$i18n.locale='deu'">
                          <v-list-item-title>Deutsch</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="$i18n.locale='ita'">
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
                              <v-list-item @click="$router.push('search')"><v-list-item-title>{{ $t("Search") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('submit')"><v-list-item-title>{{ $t("Submit") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('myobjects')"><v-list-item-title>{{ $t("My objects") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('lists')"><v-list-item-title>{{ $t("Object lists") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('groups')"><v-list-item-title>{{ $t("Groups") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="$router.push('templates')"><v-list-item-title>{{ $t("Templates") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="!signedin && appconfig.enablelogin" @click="$router.push('login')"><v-list-item-title>{{ $t("Login") }}</v-list-item-title></v-list-item>
                              <v-list-item v-if="signedin" @click="logout"><v-list-item-title>{{ $t("Logout") }}</v-list-item-title></v-list-item>
                            </v-list>
                          </v-menu>
                        </v-app-bar-nav-icon>
                      </client-only>
                      <v-spacer></v-spacer>
                      <v-toolbar-items class="hidden-sm-and-down no-height-inherit">
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" :to="{ path: '/search' }">{{ $t("Search") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/submit'">{{ $t("Submit") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                              <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="{ path: '/search', query: { owner: user.username } }">{{ $t("My objects") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/lists'">{{ $t("Object lists") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/groups'">{{ $t("Groups") }}</router-link>
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <router-link :class="hover ? 'ph-button primary' : 'ph-button grey'" v-if="signedin" :to="'/templates'">{{ $t("Templates") }}</router-link>
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
            <v-col cols="12" md="10" offset-md="1" class="content">
              <p-breadcrumbs :items="breadcrumbs"></p-breadcrumbs>

              <v-row justify="center" v-for="(alert, i) in alerts" :key="i">
                <v-col cols="12">
                  <v-snackbar class="font-weight-regular" top color="success" v-if="alert.type === 'success'" v-model="showSnackbar">
                    {{alert.msg}}
                    <v-btn dark text @click.native="dismiss(alert)">OK</v-btn>
                  </v-snackbar>
                  <v-alert v-else prominent dense :type="(alert.type === 'danger' ? 'error' : alert.type)" :value="true" transition="slide-y-transition">
                    <v-row align="center">
                      <v-col class="grow">{{alert.msg}}</v-col>
                      <v-col class="shrink">
                        <v-btn icon @click.native="dismiss(alert)"><v-icon>mdi-close</v-icon></v-btn>
                      </v-col>
                    </v-row>
                  </v-alert>
                </v-col>
              </v-row>

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

          <v-row>
            <v-col cols="12" md="10" offset-md="1">
              <v-row   class="my-5">
                <v-col class="text-left" >
                  <span class="grey--text text--darken-2"><address>{{ instanceconfig.address }} | <abbr title="Telefon">T</abbr> {{ instanceconfig.phone }}</address></span>
                </v-col>
                <v-col class="text-right" >
                  <a href="http://datamanagement.univie.ac.at/" target="_blank">{{ $t('Servicepage') }}</a> | <router-link :to="'impressum'">{{ $t('Impressum') }}</router-link>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import '@/assets/css/material-icons.css'
import Quicklinks from '@/components/Quicklinks'
import QuicklinksFooter from '@/components/QuicklinksFooter'
import '@/compiled-icons/material-social-person'
import '@/compiled-icons/material-navigation-menu'
import '@/compiled-icons/univie-sprache'
import ClientOnly from 'vue-client-only'
import { context } from '@/mixins/context'
import { config } from '@/mixins/config'

export default {
  name: 'app',
  mixins: [ context, config ],
  components: {
    Quicklinks,
    QuicklinksFooter,
    ClientOnly
  },
  data () {
    return {
      quicklinksenabled: 0
    }
  },
  computed: {
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
      var value = '; ' + document.cookie
      var parts = value.split('; ' + name + '=')
      if (parts.length === 2) {
        var val = parts.pop().split(';').shift()
        return val === ' ' ? null : val
      }
    },
    dismiss: function (alert) {
      this.$store.commit('clearAlert', alert)
    },
    switchInstance: function (e) {
      this.$store.dispatch('switchInstance', e).then(() => {
        this.$store.commit('clearStore')
        this.$router.push('/search')
        this.$store.dispatch('search')
        this.$vuetify.theme.primary = this.$store.state.instanceconfig.primary
      })
    }
  },
  mounted: function () {
    var token = this.getCookie('X-XSRF-TOKEN')
    if (token) {
      this.$store.commit('setToken', token)
      if (!this.user.username) {
        // TODO get user from token
      }
    }
  },
  created: function () {
    this.$vuetify.theme.themes.light.primary = this.$store.state.instanceconfig.primary
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
