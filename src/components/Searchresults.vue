<template>

  <v-container fluid grid-list-lg>
    <v-layout column>
      <v-flex xs12 v-for="(doc, i) in this.docs" :key="doc.pid">
        <v-card flat>
          <v-container fluid grid-list-lg>
            <v-layout column>
              <v-layout row>
                <v-flex xs2>
                   <img :src="'https://phaidra.univie.ac.at/preview/'+doc.pid+'///120'" style="max-width:120px" class="elevation-1"></img>
                </v-flex>
                <v-flex xs10>
                  <v-layout column>
                    <v-card-title primary-title>
                      <div>
                        <h3>{{ doc.dc_title[0] }}</h3>
                        <span class="grey--text">
                          <span v-for="(aut,i) in doc.bib_roles_pers_aut" :key="i">
                            {{aut}}<span v-if="(i+1) < doc.bib_roles_pers_aut.length">; </span>
                          </span>
                          <span v-for="(aut,i) in doc.bib_roles_corp_aut" :key="i">
                            {{aut}}<span v-if="(i+1) < doc.bib_roles_corp_aut.length">; </span>
                          </span>
                        </span>
                      </div>
                    </v-card-title>
                    <v-spacer></v-spacer>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn icon @click.native="toggleDocDescription(i)">
                        <v-icon>{{ doc.showDescription ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-layout>
                </v-flex>
              </v-layout>
              <v-slide-y-transition>
                <v-card-text v-show="doc.showDescription" class="search-description">{{ doc.dc_description[0] }}
                </v-card-text>
              </v-slide-y-transition>
            </v-layout>
          </v-container>
        </v-card>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>

export default {
  name: 'searchresults',
  computed: {
    docs () {
      return this.$store.state.search.docs
    }
  },
  methods: {
    toggleDocDescription: function (index) {
      this.$store.commit('toggleDocDescription', index)
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

</style>
