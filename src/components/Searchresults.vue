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
                         <img v-if="instance.baseurl === 'e-book.fwf.ac.at'" :src="'https://fedora.e-book.fwf.ac.at/fedora/get/' + doc.pid + '/bdef:Asset/getThumbnail'" style="max-width:120px" class="elevation-1"></img>
                         <img v-else :src="'https://' + instance.baseurl + '/preview/' + doc.pid + '///120'" style="max-width:120px" class="elevation-1"></img>
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
                <v-flex class="text-xs-right">
                  <v-btn :to="{ name: 'detail', params: { pid: doc.pid } }" raised>{{ $t('Details') }}</v-btn>
                  <v-btn :href="instance.api + '/object/' + doc.pid + '/diss/Content/get'" primary>{{ $t('View') }}</v-btn>
                  <v-btn :href="instance.api + '/object/' + doc.pid + '/diss/Content/download'" primary>{{ $t('Download') }}</v-btn>
                </v-flex>
                <v-flex class="pt-3">
                  <v-layout row>
                    <v-flex>
                      <licenseview class="pa-0" v-if="doc.dc_license" :dclicense="doc.dc_license[0]"></licenseview>
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
    instance () {
      return this.$store.state.settings.instance
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
