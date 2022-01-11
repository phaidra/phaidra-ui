<template>
  <v-app>
    <v-container fluid>
      <v-row no-gutters>
        <v-col>
          <quicklinks
            v-if="isUnivie"
            :showquicklinks="quicklinksenabled"
          ></quicklinks>

          <v-row no-gutters>
            <v-col cols="12" md="8" offset-md="2" class="header">
              <v-row no-gutters class="mt-2" style="min-height: 125px">
                <v-col class="text-left" cols="12" md="3">
                  <logo></logo>
                </v-col>

                <v-col cols="9">
                  <v-row justify="start" justify-md="end" class="pl-3">
                    <icon
                      v-if="signedin"
                      class="personicon mr-2 univie-grey"
                      name="material-social-person"
                      width="24px"
                      height="24px"
                    ></icon>
                    <span
                      v-if="signedin"
                      class="mr-2 subheading displayname univie-grey"
                      >{{ user.firstname }} {{ user.lastname }}</span
                    >

                    <v-menu
                      bottom
                      transition="slide-y-transition"
                      class="v-align-top"
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn text v-on="on" class="top-margin-lang">
                          <span class="grey--text text--darken-1">{{
                            localeLabel
                          }}</span>
                          <icon
                            name="univie-sprache"
                            class="lang-icon grey--text text--darken-1"
                          ></icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item
                          v-if="useLocale('eng')"
                          @click="changeLocale('eng')"
                        >
                          <v-list-item-title>English</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-if="useLocale('deu')"
                          @click="changeLocale('deu')"
                        >
                          <v-list-item-title>Deutsch</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>

                    <a
                      id="quicklinks-button"
                      v-if="isUnivie"
                      class="ph-button mt-1"
                      v-on:click="quicklinksenabled = !quicklinksenabled"
                      >Quicklinks</a
                    >
                  </v-row>

                  <v-row>
                    <v-col
                      v-if="appconfig.showinstanceswitch"
                      cols="4"
                      class="select-instance text-left"
                    >
                      <v-select
                        :items="instances"
                        @input="switchInstance"
                        :value="instanceconfig.baseurl"
                        item-text="baseurl"
                        single-line
                      ></v-select>
                    </v-col>
                    <v-col
                      class="text-left"
                      cols="10"
                      offset="1"
                      v-else-if="instanceconfig.title"
                    >
                      <icon
                        left
                        dark
                        name="univie-right"
                        color="#a4a4a4"
                        width="14px"
                        height="14px"
                        class="mb-1"
                      ></icon>
                      <nuxt-link
                        class="subheading primary--text mx-3"
                        :to="localePath('/')"
                        >{{ instanceconfig.title }}</nuxt-link
                      >
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-toolbar flat color="white" dense>
                      <client-only placeholder="loading" placeholder-tag="span">
                        <v-app-bar-nav-icon class="hidden-md-and-up">
                          <v-menu offset-y>
                            <template v-slot:activator="{ on }">
                              <v-btn text icon color="grey lighten-1" v-on="on"
                                ><icon
                                  name="material-navigation-menu"
                                  width="24px"
                                  height="24px"
                                ></icon
                              ></v-btn>
                            </template>
                            <v-list>
                              <v-list-item
                                @click="
                                  $router.push(localeLocation({
                                    path: '/search',
                                    query: { reset: 1 },
                                  }))
                                "
                                ><v-list-item-title>{{
                                  $t("Search")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item
                                v-if="signedin"
                                @click="$router.push(localeLocation({path: '/submit'}))"
                                ><v-list-item-title>{{
                                  $t("Submit")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item
                                v-if="signedin"
                                @click="
                                  $router.push(localeLocation({
                                    path: '/search',
                                    query: { reset: 1, owner: user.username },
                                  }))
                                "
                                ><v-list-item-title>{{
                                  $t("My objects")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item
                                v-if="signedin"
                                @click="$router.push(localeLocation({path:'/lists'}))"
                                ><v-list-item-title>{{
                                  $t("Object lists")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item
                                v-if="signedin"
                                @click="$router.push(localeLocation({path: '/groups'}))"
                                ><v-list-item-title>{{
                                  $t("Groups")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item
                                v-if="signedin"
                                @click="$router.push(localeLocation({path: '/statistics'}))"
                                ><v-list-item-title>{{
                                  $t("Statistics")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item
                                v-if="!signedin && appconfig.enablelogin"
                                @click="$router.push(localeLocation({path: '/login'}))"
                                ><v-list-item-title>{{
                                  $t("Login")
                                }}</v-list-item-title></v-list-item
                              >
                              <v-list-item v-if="signedin" @click="logout"
                                ><v-list-item-title>{{
                                  $t("Logout")
                                }}</v-list-item-title></v-list-item
                              >
                            </v-list>
                          </v-menu>
                        </v-app-bar-nav-icon>
                      </client-only>
                      <v-spacer></v-spacer>
                      <v-toolbar-items
                        class="hidden-sm-and-down no-height-inherit"
                      >
                        <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            :to="localePath(`/search?reset=1`)"
                            >{{ $t("Search") }}</nuxt-link
                          >
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            v-show="signedin"
                            :to="localePath('/submit')"
                            >{{ $t("Upload") }}</nuxt-link
                          >
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            v-show="signedin"
                            :to="localePath({
                              path: '/search',
                              query: { reset: 1, owner: user.username },
                            })"
                            >{{ $t("My objects") }}</nuxt-link
                          >
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            v-show="signedin"
                            :to="localePath('/lists')"
                            >{{ $t("Object lists") }}</nuxt-link
                          >
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            v-show="signedin"
                            :to="localePath('/groups')"
                            >{{ $t("Groups") }}</nuxt-link
                          >
                        </v-hover>
                          <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            v-show="signedin"
                            :to="localePath('/statistics')"
                            >{{ $t("Statistics") }}</nuxt-link
                          >
                        </v-hover>
                        <v-hover v-slot:default="{ hover }">
                          <nuxt-link
                            :class="
                              hover ? 'ph-button primary' : 'ph-button grey'
                            "
                            v-show="!signedin && appconfig.enablelogin"
                            :to="localePath('/login')"
                            >{{ $t("Login") }}</nuxt-link
                          >
                        </v-hover>
                        <v-hover>
                          <a
                            class="flat dark ph-button grey"
                            v-show="signedin"
                            @click="logout"
                            >{{ $t("Logout") }}</a
                          >
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
                <v-snackbar
                  :key="'altsnack' + i"
                  class="font-weight-regular"
                  top
                  color="success"
                  v-if="alert.type === 'success'"
                  v-model="showSnackbar"
                >
                  {{ $t(alert.msg) }}
                  <v-btn dark text @click.native="dismiss(alert)">OK</v-btn>
                </v-snackbar>
              </template>

              <template v-if="showAlerts">
                <v-row
                  justify="center"
                  v-for="(alert, i) in alerts"
                  :key="'alert' + i"
                >
                  <v-col cols="12">
                    <v-alert
                      v-if="alert.type !== 'success'"
                      :type="alert.type === 'danger' ? 'error' : alert.type"
                      :value="true"
                      transition="slide-y-transition"
                    >
                      <v-row align="center">
                        <v-col class="grow">{{ alert.msg }}</v-col>
                        <v-col class="shrink">
                          <v-btn icon @click.native="dismiss(alert)"
                            ><v-icon>mdi-close</v-icon></v-btn
                          >
                        </v-col>
                      </v-row>
                    </v-alert>
                  </v-col>
                </v-row>
              </template>

              <transition name="fade" mode="out-in">
                <keep-alive>
                  <!-- <router-view class="mb-3"></router-view> -->
                  <Nuxt />
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
import "@/compiled-icons/material-social-person";
import "@/compiled-icons/univie-right";
import "@/compiled-icons/univie-sprache";
import { config } from "../mixins/config";
import { context } from "../mixins/context";
import Vue from 'vue'
import moment from 'moment'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import '@/assets/css/material-icons.css'

export default {
  mixins: [config, context],
   metaInfo() {
    let metaInfo = {
      title: config.title,
      meta: [
        {
          hid: "og:description",
          name: "og:description",
          content: "Description",
        },
        {
          hid: "og:title",
          name: "og:title",
          content: "The Essential Meta Tags for Facebook",
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "Description",
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          content: "The Essential Meta Tags for Twitter",
        },
        {
          hid: "twitter:card",
          name: "twitter:card",
          content: "summary_large_image",
        }
      ],
    };
    return metaInfo;
  },
  data() {
    return {
      quicklinksenabled: 0,
    };
  },
  methods: {
    logout: function () {
      this.$store.dispatch("logout");
    },
    useLocale: function (lang) {
      if (this.instanceconfig.ui) {
        if (this.instanceconfig.ui.languages) {
          return this.instanceconfig.ui.languages.includes(lang);
        }
      }
      return false;
    },
    changeLocale: function (lang) {
      this.$i18n.locale = lang;
      this.$router.push(this.switchLocalePath(lang))
      this.$store.dispatch('vocabulary/sortRoles', this.$i18n.locale)
    },
    dismiss: function (alert) {
      this.$store.commit("clearAlert", alert);
    },
  },
  computed: {
    localeLabel: function () {
      if (this.instanceconfig.ui) {
        if (this.instanceconfig.ui.twoletterlang === 1) {
          switch (this.$i18n.locale) {
            case "eng":
              return "eng";
            case "deu":
              return "deu";
            default:
              return "";
          }
        }
      }
      return this.$i18n.locale;
    },
    isUnivie() {
      switch (this.instanceconfig.baseurl) {
        case "phaidra.univie.ac.at":
        case "phaidra-sandbox.univie.ac.at":
        case "phaidra-entw.univie.ac.at":
          return true;
        default:
          return false;
      }
    },
    showAlerts: function () {
      if (this.$store.state.alerts.length > 0) {
        let onlySuccess = true;
        for (let a of this.$store.state.alerts) {
          if (a.type !== "success") {
            onlySuccess = false;
          }
        }
        return !onlySuccess;
      }
      return false;
    },
    breadcrumbs() {
      return this.$store.state.breadcrumbs;
    },
    alerts() {
      return this.$store.state.alerts;
    },
  },
  created: function () {
    this.$vuetify.theme.themes.light.primary = this.instanceconfig.primary;

    Vue.filter('datetime', function (value) {
      if (value) {
        return moment(String(value)).format('DD.MM.YYYY hh:mm:ss')
      }
    })
    Vue.filter('date', function (value) {
      if (value) {
        return moment(String(value)).format('DD.MM.YYYY')
      }
    })
    Vue.filter('unixtime', function (value) {
      if (value) {
        return moment.unix(String(value)).format('DD.MM.YYYY hh:mm:ss')
      }
    })

    Vue.filter('datetime', function (value) {
      if (value) {
        return moment(String(value)).format('DD.MM.YYYY hh:mm:ss')
      }
    })

    Vue.filter('bytes', function (bytes, precision) {
      if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-'
      if (typeof precision === 'undefined') precision = 1
      var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB']
      var number = Math.floor(Math.log(bytes) / Math.log(1024))
      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number]
    })

    Vue.filter('truncate', function (text, length, clamp) {
    clamp = clamp || '...'
    length = length || 30

    if (text.length <= length) return text

    var tcText = text.slice(0, length - clamp.length)
    var last = tcText.length - 1

    while (last > 0 && tcText[last] !== ' ' && tcText[last] !== clamp[0]) last -= 1

    // Fix for case when text does not have any space
    last = last || length - clamp.length

    tcText = tcText.slice(0, last)

    return tcText + clamp
  })
  },
  mounted () {
    let token = localStorage.getItem('token')
    let user = localStorage.getItem('user')
    if (user && user !== undefined) {
      user = JSON.parse(user)
    }
    this.$store.commit('setUserData', user)
    this.$store.commit('setUserToken', token)


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

  }
};
</script>
<style lang="sass">
@require '../stylus/main'
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
  display: flex;
}

html,
body {
  height: 100%;
}

section {
  overflow: auto;
}

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
  -webkit-box-shadow: 48px 0 0 0 white, -48px 0 0 0 white,
    0 8px 40px -6px rgba(70, 70, 70, 0.4);
  box-shadow: 48px 0 0 0 white, -48px 0 0 0 white,
    0 8px 40px -6px rgba(70, 70, 70, 0.4);
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

.ph-button {
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
  letter-spacing: 0.01em;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
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
  color: #7b7b7b;
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
