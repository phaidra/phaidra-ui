<template>

  <v-container fluid grid-list-lg>
    <v-layout column>
      <v-flex xs12>
        <v-expansion-panel popout expand>
          <v-expansion-panel-content v-for="(doc, i) in this.docs" :key="doc.pid" v-model="doc.showMore">
            <div slot="header">
              <v-card flat>
                <v-container fluid grid-list-lg>
                  <v-layout column>
                    <v-layout row>
                      <v-flex xs2>
                         <img :src="'https://' + config.instance + '/preview/' + doc.pid + '///120'" style="max-width:120px" class="elevation-1"></img>
                      </v-flex>
                      <v-flex xs10>
                        <v-layout column>
                          <v-card-title primary-title>
                            <v-container fluid>
                              <v-layout row>
                                <v-flex xs10>
                                  <h3 @click.stop><router-link :to="{ name: 'detail', params: { pid: doc.pid } }">{{ doc.dc_title[0] }}</router-link></h3>
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
                            </v-layout>
                          </v-card-text>
                          <v-spacer></v-spacer>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-layout>
                </v-container>
              </v-card>
            </div><!--header -->
            <v-container fluid grid-list-lg>
              <v-layout column>
                <v-flex v-if="doc.dc_description" class="search-description pb-3">{{ doc.dc_description[0] }}</v-flex>
                <v-layout row>
                  <router-link :to="{ name: 'detail', params: { pid: doc.pid } }"><v-btn flat>{{ $t('Details') }}</v-btn></router-link>
                  <v-btn :href="config.api + '/object/' + doc.pid + '/diss/Content/get'" flat>{{ $t('View') }}</v-btn>
                  <v-btn :href="config.api + '/object/' + doc.pid + '/diss/Content/download'" flat>{{ $t('Download') }}</v-btn>
                </v-layout>
                <v-divider></v-divider>
                <v-flex class="pt-3">
                  <v-layout row>
                    <v-flex>
                      <licenseview class="pa-0" v-if="doc.dc_license" :dclicense="doc.dc_license[0]"></licenseview>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex class="text-xs-right">
                      <span class="grey--text">https://{{ config.instance}}/{{ doc.pid }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-expansion-panel-content>
          <!--<v-divider></v-divider>-->
        </v-expansion-panel>
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
