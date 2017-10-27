<template>

  <transition name="slide">

    <v-container v-if="showquicklinks" fluid class="quicklinks-content" id="quicklinks">

      <v-layout row>

        <v-flex md2 offset-md4 >

          <v-layout column >

            <h3 class="top-row-header">{{ 'Information about' | translate }} ...</h3>

            <a href="http://datamanagement.univie.ac.at/" target="_blank">
              <v-layout row>
                <span>Datenmanagement</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="https://uscholar.univie.ac.at/" target="_blank">
              <v-layout row>
                <span>u:scholar</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://unidam.univie.ac.at/" target="_blank">
              <v-layout row>
                <span>unidam</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://datamanagement.univie.ac.at/" target="_blank">
              <v-layout row>
                <span>Open Access Office</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://datamanagement.univie.ac.at/" target="_blank">
              <v-layout row>
                <span>u:cris</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

        </v-layout>

        </v-flex>

        <v-flex md1></v-flex>

        <v-flex md3>

          <v-layout column grid-list-md>

            <h3 class="top-row-header">{{ 'Most searched-for services' | translate }} ...</h3>

            <a href="http://studentpoint.univie.ac.at" target="_blank">
              <v-layout row>
                <icon name="univie-quick-studienpoint"></icon>
                <span>Student Point</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://ufind.univie.ac.at/de/search.html" target="_blank">
              <v-layout row>
                <icon name="univie-quick-lesung"></icon>
                <span>u:find Vorlesungs-/ Personenverzeichnis</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://uspace.univie.ac.at" target="_blank">
              <v-layout row>
                <icon name="univie-quick-univis"></icon>
                <span>u:space</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://univis.univie.ac.at/" target="_blank">
              <v-layout row>
                <icon name="univie-quick-univis"></icon>
                <span>UNIVISonline</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://bibliothek.univie.ac.at/" target="_blank">
              <v-layout row>
                <icon name="univie-quick-biblio"></icon>
                <span>Bibliotheksservices</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://moodle.univie.ac.at/" target="_blank">
              <v-layout row>
                <icon name="univie-quick-lesung"></icon>
                <span>Moodle (E-Learning)</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://www.univie.ac.at/ueber-uns/leitung-organisation/fakultaeten-zentren/" target="_blank">
              <v-layout row>
                <icon name="univie-quick-fakultaeten"></icon>
                <span>Fakultäten &amp; Zentren</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://webmail.univie.ac.at" target="_blank">
              <v-layout row>
                <icon name="univie-quick-webmail"></icon>
                <span>Webmail</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://intra.univie.ac.at/" target="_blank">
              <v-layout row>
                <icon name="univie-quick-intranet"></icon>
                <span>Intranet für MitarbeiterInnen</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

            <a href="http://www.univie.ac.at/ueber-uns/weitere-informationen/kontakt-services-von-a-z/" target="_blank">
              <v-layout row>
                <icon name="univie-quick-kontakt"></icon>
                <span>Kontakt &amp; Services von A-Z</span>
                <icon name="univie-extern"></icon>
              </v-layout>
            </a>

          </v-layout>

        </v-flex>

        <v-flex md2></v-flex>

      </v-layout>

    </v-container>

  </transition>

</template>

<script>

import '@/compiled-icons/univie-extern'
import '@/compiled-icons/univie-quick-biblio'
import '@/compiled-icons/univie-quick-fakultaeten'
import '@/compiled-icons/univie-quick-intranet'
import '@/compiled-icons/univie-quick-kontakt'
import '@/compiled-icons/univie-quick-lesung'
import '@/compiled-icons/univie-quick-studienpoint'
import '@/compiled-icons/univie-quick-univis'
import '@/compiled-icons/univie-quick-webmail'

export default {
  name: 'quicklinks',
  props: ['showquicklinks']
}
</script>

<style scoped>

.svg-icon {
  margin: 3px 6px 0 3px;
}

.quicklinks-content {
  background: #1a74b0 url(../assets/quicklinksbackground.png) no-repeat;
  font-size: 12pt;
  color: white;
  padding-bottom: 30px;
  width:100%;
}

h3.top-row-header {
    margin-top: 0px;
    font-size: 19pt;
    color: white;
    background: url(../assets/verlauf-weiss.png) no-repeat left bottom;
    font-weight: 300;
    margin-bottom: 8pt;
}

.slide-enter-active, .slide-leave-active {
  transition: all .8s cubic-bezier(0, 1, 0.5, 1);
  overflow-y: hidden;
  max-height: 310px;
}
.slide-enter, .slide-leave-to {
  max-height: 0px;
}

#quicklinks ul {
    list-style-type: none;
    padding: 0px;
    margin-left: -5px;
}

#quicklinks ul li {
    padding-left: 5px;
}

#quicklinks a {
    color: white;
    text-decoration: none;
}

#quicklinks a:hover {
    color: #909090;
    background-color: white;
}

#quicklinks a:hover md-icon{
    color: #909090;
}

.quicklinks-button {
  background-color: #0063a6;
  text-decoration: none;
  color: white;
  margin-top: 0px;
  width: 263px;
}

.quicklinks-button:hover {
  background-color: #1a74b0;
}

.quicklinks-button-open {
  background-color: #1a74b0;
}

</style>
