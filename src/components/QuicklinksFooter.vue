<template>
  <v-container fluid >

    <v-layout column class="grey lighten-4 quicklinksfooter">

      <v-flex xs12 md8 offset-md2>

        <h2 class="underline md-headline footer-headline">{{ $t('Information about') }} ...</h2>

        <v-layout row>

          <v-flex xs12 md3>
            <v-layout column>
              <div class="footer-quicklinks-list">
                <a href="http://datamanagement.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>Datenmanagement</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="https://uscholar.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>u:scholar</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div >
              <div class="footer-quicklinks-list">
                <a href="http://unidam.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>unidam</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
            </v-layout>
          </v-flex>

          <v-flex xs12 md3>
            <v-layout column >
              <div class="footer-quicklinks-list">
                <a href="http://datamanagement.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>Open Access Office</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://datamanagement.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>u:cris</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
            </v-layout>
          </v-flex>

        </v-layout>

      </v-flex>

      <v-flex xs12 md8 offset-md2 >

        <h2 class="underline md-headline footer-headline">{{ $t('Most searched-for services') }} ...</h2>

        <v-layout row>

          <v-flex xs12 md3>
            <v-layout column>
              <div class="footer-quicklinks-list">
                <a href="http://studentpoint.univie.ac.at" target="_blank">
                  <v-layout row>
                    <span>Student Point</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://ufind.univie.ac.at/de/search.html" target="_blank">
                  <v-layout row>
                    <span>u:find Vorlesungs-/ Personenverzeichnis</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
            </v-layout>
          </v-flex>

          <v-flex xs12 md3>
            <v-layout column>
              <div class="footer-quicklinks-list">
                <a href="http://uspace.univie.ac.at" target="_blank">
                  <v-layout row>
                    <span>u:space</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://univis.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>UNIVISonline</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://bibliothek.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>Bibliotheksservices</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
            </v-layout>
          </v-flex>

          <v-flex xs12 md3>
            <v-layout column>
              <div class="footer-quicklinks-list">
                <a href="http://moodle.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>Moodle (E-Learning)</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://www.univie.ac.at/ueber-uns/leitung-organisation/fakultaeten-zentren/" target="_blank">
                  <v-layout row>
                    <span>Fakultäten &amp; Zentren</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://webmail.univie.ac.at" target="_blank">
                  <v-layout row>
                    <span>Webmail</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
            </v-layout>
          </v-flex>

          <v-flex xs12 md3>
            <v-layout column>
              <div class="footer-quicklinks-list">
                <a href="http://intra.univie.ac.at/" target="_blank">
                  <v-layout row>
                    <span>Intranet für MitarbeiterInnen</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
              <div class="footer-quicklinks-list">
                <a href="http://www.univie.ac.at/ueber-uns/weitere-informationen/kontakt-services-von-a-z/" target="_blank">
                  <v-layout row>
                    <span>Kontakt &amp; Services von A-Z</span>
                    <v-spacer></v-spacer>
                    <icon name="univie-right"></icon>
                  </v-layout>
                </a>
              </div>
            </v-layout>
          </v-flex>

        </v-layout>

      </v-flex>

    </v-layout>

  </v-container>

</template>

<script>

import '@/compiled-icons/univie-right'

export default {
  name: 'quicklinks'
}
</script>

<style scoped>

.quicklinksfooter {
  margin-top: 40px;
  padding-bottom: 30px;
}

.svg-icon
{
  margin: 3px 0 0 3px;
  color: #a4a4a4;
}

.footer-quicklinks-list {
  background-color: #ffffff;
  font-size: 11pt;
  margin: 4px 20px 0 0;
  padding-left: 10px;
  position: relative;
}

.footer-quicklinks-list a {
    display: block;
    padding-right: 5px;
}

.footer-quicklinks-list:hover {
    background-color: #a4a4a4;
}

.footer-quicklinks-list:hover a {
    color: white;
}

.footer-quicklinks-list:hover .svg-icon {
    color: white;
}

h2.footer-headline {
  margin-top: 16pt;
  margin-bottom: 8pt;
}

.underline {
    padding-bottom: 2px;
    border-bottom: solid 1px #bdbdbd;
}

h2.md-headline {
  font-size: 21pt;
  border-bottom: solid 1px #bdbdbd;
  color: #0063a6;
  font-weight: 300;
}

</style>
