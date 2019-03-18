<template>

  <v-container fluid grid-list-lg>
    <v-layout column>
      <v-flex xs12>
        <v-expansion-panel popout expand>
          <v-expansion-panel-content v-for="(doc) in this.docs" :key="doc.pid" v-model="doc.showMore">
            <div slot="header">
              <v-card flat>
                <v-container fluid grid-list-lg pa-3>
                  <v-layout column>
                    <v-layout row>
                      <v-flex xs2>
                        <v-img :src="'https://' + instance.baseurl + '/preview/' + doc.pid + '///120'"  class="elevation-1">
                          <v-layout
                            slot="placeholder"
                            fill-height
                            align-center
                            justify-center
                            ma-0
                          >
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                          </v-layout>
                        </v-img>
                      </v-flex>
                      <v-flex xs10>
                        <v-layout column>
                          <v-card-title primary-title>
                            <v-container fluid>
                              <v-layout row>
                                <v-flex xs10>
                                  <h3 class="display-2" @click.stop v-if="doc.dc_title"><router-link :to="{ name: 'detail', params: { pid: doc.pid } }">{{ doc.dc_title[0] }}</router-link></h3>
                                  <v-spacer></v-spacer>
                                </v-flex>
                                <v-flex xs2 class="text-xs-right"><span v-if="doc.created" class="grey--text">{{ doc.created | date }}</span></v-flex>
                              </v-layout>
                            </v-container>
                          </v-card-title>
                          <v-card-text>
                            <v-layout column>
                              <v-flex>
                                <span>
                                  <span v-for="(aut,i) in doc.bib_roles_pers_aut" :key="'pers'+i">
                                    {{aut}}<span v-if="(i+1) < doc.bib_roles_pers_aut.length">; </span>
                                  </span>
                                  <span v-for="(aut,i) in doc.bib_roles_corp_aut" :key="'corp'+i">
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
            <v-container fluid grid-list-lg pa-3>
              <v-layout column>
                <v-flex v-if="doc.dc_description" class="search-description pb-3">{{ doc.dc_description[0] }}</v-flex>
                <v-flex class="text-xs-right">
                  <v-btn :to="{ name: 'detail', params: { pid: doc.pid } }" raised>{{ $t('Details') }}</v-btn>
                  <v-btn :href="instance.api + '/object/' + doc.pid + '/diss/Content/get'" primary>{{ $t('View') }}</v-btn>
                  <v-btn :href="instance.api + '/object/' + doc.pid + '/diss/Content/download'" primary>{{ $t('Download') }}</v-btn>
                </v-flex>
                <v-flex class="pt-3">
                  <v-layout row>
                    <v-flex>
                      <p-d-license class="pa-0" v-if="doc.dc_license" :o="doc.dc_license[0]"></p-d-license>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-flex class="text-xs-right">
                      <span class="grey--text">https://{{ instance.baseurl }}/{{ doc.pid }}</span>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
export default {
  name: 'search-results',
  data () {
    return {
      docstoggle: {}
    }
  },
  computed: {
    docs () {
      return this.$store.state.search.docs
    },
    instance () {
      return this.$store.state.settings.instance
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
