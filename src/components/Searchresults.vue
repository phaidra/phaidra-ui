<template>

  <v-container fluid grid-list-lg>
    <v-layout column>
      <v-flex xs12 v-for="(doc, i) in this.docs" :key="doc.pid">
        <v-card flat>
          <v-container fluid grid-list-lg>
            <v-layout column>
              <v-layout row>
                <v-flex xs2>
                   <img :src="'https://' + config.instance + '/preview/'+doc.pid+'///120'" style="max-width:120px" class="elevation-1"></img>
                </v-flex>
                <v-flex xs10>
                  <v-layout column>
                    <v-card-title primary-title>
                      <v-container fluid>
                        <v-layout row>
                          <v-flex xs10>
                            <h3>{{ doc.dc_title[0] }}</h3>
                            <v-spacer></v-spacer>
                          </v-flex>
                          <v-flex xs2 class="text-xs-right"><span class="grey--text">{{ doc.created | date }}</span></v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-title>
                    <v-card-text>
                      <v-layout column>
                        <v-flex>
                          <span>
                            <span v-for="(aut,i) in doc.bib_roles_pers_aut" :key="i">
                              {{aut}}<span v-if="(i+1) < doc.bib_roles_pers_aut.length">; </span>
                            </span>
                            <span v-for="(aut,i) in doc.bib_roles_corp_aut" :key="i">
                              {{aut}}<span v-if="(i+1) < doc.bib_roles_corp_aut.length">; </span>
                            </span>
                          </span>
                        </v-flex>
                        <v-flex>
                          <licenseview :dclicense="doc.dc_license[0]"></licenseview>
                        </v-flex>
                        <v-flex>
                          <span class="grey--text">https://{{ config.instance}}/{{ doc.pid }}</span>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                    <v-spacer></v-spacer>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn icon @click.native="toggleShowMore(i)">
                        <v-icon>{{ doc.showMore ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-layout>
                </v-flex>
              </v-layout>
              <carousel-transition>
                <v-card-text v-show="doc.showMore" class="search-description">{{ doc.dc_description[0] }}</v-card-text>
              </carousel-transition>
              <carousel-reverse-transition>
                <v-card-text v-show="!doc.showMore" class="search-description">{{ doc.dc_description[0] | truncate(300) }}</v-card-text>
              </carousel-reverse-transition>
            </v-layout>
          </v-container>
        </v-card>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import Licenseview from '@/components/Licenseview'

export default {
  name: 'searchresults',
  components: {
    Licenseview
  },
  computed: {
    docs () {
      return this.$store.state.search.docs
    },
    config () {
      return this.$store.state.config
    }
  },
  methods: {
    toggleShowMore: function (index) {
      this.$store.commit('toggleShowMore', index)
    }
  }
}
</script>

<style scoped>

.card__title--primary {
  padding-top: 10px;
}

.search-description {
  white-space: pre-wrap;
}

.card__text {
  padding-top: 0px;
}

</style>
