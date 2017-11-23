<template>
  <v-app>
    <v-container fluid>
      <v-layout column>

        <v-flex xs12>
          <quicklinks :showquicklinks="quicklinksenabled"></quicklinks>
        </v-flex>

        <v-flex xs12 md8 offset-md2 class="header">
          <v-layout row wrap>
            <v-flex text-xs-left>
              <img src="./assets/Uni_Logo_2016.png" class="logo" alt="uni-logo" />
            </v-flex>
            <v-flex text-xs-right>
              <router-link :to="'login'"><v-btn flat icon color="grey lighten-1" class="v-align-top top-margin-3"><icon name="material-social-person" width="24px" height="24px"></icon></v-btn></router-link>
              <span class="subheading displayname grey--text text--lighten-1">{{user.firstname}} {{user.lastname}}</span>
              <v-menu bottom transition="slide-y-transition" class="v-align-top">
                <v-btn flat icon slot="activator" color="grey lighten-1" class="top-margin-3">
                  {{$i18n.locale}}
                  <icon name="univie-sprache" class="lang-icon"></icon>
                </v-btn>
                <v-list>
                  <v-list-tile @click="$i18n.locale='en'">
                    <v-list-tile-title>English</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="$i18n.locale='de'">
                    <v-list-tile-title>Deutsch</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="$i18n.locale='it'">
                    <v-list-tile-title>Italiano</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>
              <a id="quicklinks-button" class="ph-button" v-on:click="quicklinksenabled = !quicklinksenabled">Quicklinks</a>
              <v-toolbar flat color="white">
                <v-spacer></v-spacer>
                <v-toolbar-side-icon class="hidden-md-and-up">
                  <v-menu offset-y>
                    <v-btn flat icon color="grey lighten-1" slot="activator"><icon name="material-navigation-menu" width="24px" height="24px"></icon></v-btn>
                    <v-list>
                      <v-list-tile @click="$router.push('search')"><v-list-tile-title>{{ $t("Search") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="signedin" @click="$router.push('submit')"><v-list-tile-title>{{ $t("Submit") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="signedin" @click="$router.push('myobjects')"><v-list-tile-title>{{ $t("My objects") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="signedin" @click="$router.push('bookmarks')"><v-list-tile-title>{{ $t("Bookmarks") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="signedin" @click="$router.push('groups')"><v-list-tile-title>{{ $t("Groups") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="signedin" @click="$router.push('templates')"><v-list-tile-title>{{ $t("Templates") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="!signedin" @click="$router.push('login')"><v-list-tile-title>{{ $t("Login") }}</v-list-tile-title></v-list-tile>
                      <v-list-tile v-if="signedin" @click="$router.push('/')"><v-list-tile-title>{{ $t("Logout") }}</v-list-tile-title></v-list-tile>
                    </v-list>
                  </v-menu>
                </v-toolbar-side-icon>
                <v-toolbar-items class="hidden-sm-and-down">
                  <router-link :to="{ name: 'search', params: { a: 123 }}"><v-btn flat>{{ $t("Search") }}</v-btn></router-link>
                  <router-link v-if="signedin" :to="'submit'"><v-btn flat>{{ $t("Submit") }}</v-btn></router-link>
                  <router-link v-if="signedin" :to="'myobjects'"><v-btn flat>{{ $t("My objects") }}</v-btn></router-link>
                  <router-link v-if="signedin" :to="'bookmarks'"><v-btn flat>{{ $t("Bookmarks") }}</v-btn></router-link>
                  <router-link v-if="signedin" :to="'groups'"><v-btn flat>{{ $t("Groups") }}</v-btn></router-link>
                  <router-link v-if="signedin" :to="'templates'"><v-btn flat>{{ $t("Templates") }}</v-btn></router-link>
                  <router-link v-if="!signedin" :to="'login'"><v-btn flat>{{ $t("Login") }}</v-btn></router-link>
                  <router-link v-if="signedin" :to="'/'"><v-btn @click="logout" flat>{{ $t("Logout") }}</v-btn></router-link>
                </v-toolbar-items>
              </v-toolbar>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 md8 offset-md2>

          <v-alert v-for="alert in alerts" :color="alert.type" :value="true" v-if="alert.msg" transition="slide-y-transition" :key="alert.msg">
            <v-layout>{{$t(alert.msg)}}<v-spacer></v-spacer><icon name="univie-sprache" color="grey lighten-1" @click.native="dismiss(alert)"></icon></v-layout>
          </v-alert>
          <router-view class="mt-5 mb-3"></router-view>

        </v-flex>

        <v-flex xs12>
          <quicklinksfooter></quicklinksfooter>
        </v-flex>

        <v-flex xs12 md8 offset-md2>
          <v-layout row wrap class="footer-margin">
            <v-flex text-xs-left>
              <span class="grey--text text--darken-2"><address>Universität Wien | Universitätsring 1 | 1010 Wien | <abbr title="Telefon">T</abbr> +43-1-4277-0</address></span>
            </v-flex>
            <v-flex text-xs-right>
              <a href="http://datamanagement.univie.ac.at/" target="_blank">Servicepage</a> | <router-link :to="'impressum'">Impressum</router-link>
            </v-flex>
          </v-layout>
        </v-flex>


      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  import '@/assets/css/material-icons.css'
  import Quicklinks from '@/components/Quicklinks'
  import Quicklinksfooter from '@/components/Quicklinksfooter'
  import '@/compiled-icons/material-social-person'
  import '@/compiled-icons/material-navigation-menu'
  import '@/compiled-icons/univie-sprache'

  export default {
    name: 'app',
    components: {
      Quicklinks,
      Quicklinksfooter
    },
    data () {
      return {
        quicklinksenabled: 0
      }
    },
    computed: {
      signedin () {
        return this.$store.state.user.token ? 1 : 0
      },
      user () {
        return this.$store.state.user
      },
      alerts () {
        return this.$store.state.alerts.alerts
      }
    },
    methods: {
      logout: function () {
        this.$store.dispatch('logout')
      },
      dismiss: function (alert) {
        this.$store.commit('clearAlert', alert)
      }
    }
  }
</script>

<style lang="stylus">

  @require './stylus/main'

</style>

<style>

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

.container {
  padding: 0px;
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

.footer-margin {
  margin: 30px 0 30px 0;
}

address {
  font-style: normal;
}

.v-align-top {
  vertical-align: top;
}

.top-margin-3 {
  margin-top: 3px;
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
  background-color: #909090;
  color: white;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  position: relative;
  outline: 0;
  border: 0;
  display: inline-block;
  -ms-flex-align: center;
  align-items: center;
  padding: 0 6px;
  margin: 6px 1px 6px 0px;
  line-height: 36px;
  min-height: 36px;
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

</style>
