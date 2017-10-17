<!--
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view></router-view>
  </div>
</template>
-->
<template>
  <v-app>
    <v-container fluid>
      <v-layout row wrap>

        <v-flex xs12>
          <quicklinks :showquicklinks="quicklinksenabled"></quicklinks>
        </v-flex>

        <v-flex xs12 md8 offset-md2 class="header">
          <v-layout row wrap>
            <v-flex text-xs-left>
              <img src="./assets/Uni_Logo_2016.png" class="logo" alt="uni-logo" />
            </v-flex>
            <v-flex text-xs-right>
              <a id="quicklinks-button" class="ph-button" v-on:click="quicklinksenabled = !quicklinksenabled">Quicklinks</a>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 md8 offset-md2>
          <router-view></router-view>
        </v-flex>

        <v-flex xs12>
          <div>footer</div>
        </v-flex>


      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  /* import '@/assets/css/material-icons.css' */
  import Quicklinks from '@/components/Quicklinks'

  export default {
    components: {
      Quicklinks
    },
    name: 'app',
    data () {
      return {
        quicklinksenabled: 0
      }
    }
  }
</script>

<style lang="stylus">

  @require '../node_modules/vuetify/src/stylus/settings/_colors'

  $theme := {
    primary: white
    accent: $red.accent-2
    secondary: $grey.lighten-1
    info: $blue.lighten-1
    warning: $amber.darken-2
    error: $red.accent-4
    success: $green.lighten-2
  }

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
