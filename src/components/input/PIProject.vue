<template>

    <v-layout row>

      <v-flex xs10>

        <v-layout column>

          <v-layout row>
            <v-flex xs6>
              <v-text-field
                :value="name"
                :label="$t('Project name')"
                v-on:input="$emit('input-name', $event)"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-select 
                v-on:input="$emit('input-name-language', $event)" 
                :label="$t('Language')"
                :items="vocabularies['lang'].terms" 
                :value="getLangTerm(nameLanguage)"
                box
                return-object
              >
                <template slot="item" slot-scope="{ item }">
                  <v-list-tile-content two-line>
                    <v-list-tile-title inset v-html="`${item['skos:prefLabel'][$i18n.locale] ? item['skos:prefLabel'][$i18n.locale] : item['skos:prefLabel']['eng']}`"></v-list-tile-title>
                    <v-list-tile-sub-title inset v-html="`${item['@id']}`"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
                <template slot="selection" slot-scope="{ item }">
                  <v-list-tile-content>
                    <v-list-tile-title inset v-html="`${item['skos:prefLabel'][$i18n.locale] ? item['skos:prefLabel'][$i18n.locale] : item['skos:prefLabel']['eng']}`"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </v-select>                      
            </v-flex>
                
          </v-layout>

          <v-layout row>
            <v-flex xs6>
              <v-text-field
                :value="description"
                :label="'Project description'"
                v-on:input="$emit('input-description', $event)"
                box
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-select 
                v-on:input="$emit('input-description-language', $event)" 
                :label="'Language'"
                :items="vocabularies['lang'].terms" 
                :value="getLangTerm(descriptionLanguage)"
                box
              >
                <template slot="item" slot-scope="{ item }">
                  <v-list-tile-content two-line>
                    <v-list-tile-title inset v-html="`${item['skos:prefLabel'][$i18n.locale]}`"></v-list-tile-title>
                    <v-list-tile-sub-title inset v-html="`${item['@id']}`"></v-list-tile-sub-title>
                  </v-list-tile-content>
                </template>
                <template slot="selection" slot-scope="{ item }">
                  <v-list-tile-content>
                    <v-list-tile-title inset v-html="`${item['skos:prefLabel'][$i18n.locale]}`"></v-list-tile-title>
                  </v-list-tile-content>
                </template>
              </v-select>                      
            </v-flex>
               
          </v-layout>

          <v-layout row>

            <v-flex xs6>
              <v-text-field
                :value="identifier"
                :label="'Project identifier'"
                v-on:input="$emit('input-identifier', $event)"
                box
              ></v-text-field>
            </v-flex>

            <v-flex xs6>
              <v-text-field
                :value="homepage"
                :label="'Project homepage'"
                v-on:input="$emit('input-homepage', $event)"
                box
              ></v-text-field>
            </v-flex>
          </v-layout>
          
        </v-layout>
      </v-flex>
      
      <v-flex xs1 style="border-right: 2px">
        <v-container fill-height>
          <v-layout class="vertical-center" row>
            <v-flex>
              <v-btn v-if="multiplicable" flat icon slot="activator" v-on:click.native="$emit('add', $event)">
                <icon name="material-content-add" width="24px" height="24px"></icon>
              </v-btn>
              <v-btn v-if="multiplicable" flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
                <icon name="material-content-remove" width="24px" height="24px"></icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>

    </v-layout>

</template>

<script>
import '@/compiled-icons/material-content-add'
import '@/compiled-icons/material-content-remove'

export default {
  name: 'p-i-project',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    name: {
      type: String
    },
    nameLanguage: {
      type: String
    },
    identifier: {
      type: String
    },
    description: {
      type: String
    },
    descriptionLanguage: {
      type: String
    },
    homepage: {
      type: String
    },
    multiplicable: {
      type: Boolean
    }
  },
  methods: {
    getLangTerm: function (value) {
      for (var i = 0; i < this.vocabularies['lang'].terms.length; i++) {
        if (this.vocabularies['lang'].terms[i]['@id'] === value) {
          return this.vocabularies['lang'].terms[i]
        }
      }
    }
  }
}
</script>

<style scoped>
.v-btn {
  margin: 0;
}
.vertical-center {
 align-items: center;
}
</style>
