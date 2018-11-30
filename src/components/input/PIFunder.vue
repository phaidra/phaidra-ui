<template>

  <v-layout row>
    <v-flex xs4>
      <v-text-field
        :value="name"
        :label="$t('Funder name')"
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
    <v-flex xs4>
      <v-text-field
        :value="identifier"
        :label="'Funder identifier'"
        v-on:input="$emit('input-identifier', $event)"
        box
      ></v-text-field>
    </v-flex>  
    <v-flex xs2 v-if="multiplicable" >
      <v-container fill-height>
        <v-layout row>
          <v-flex>
            <v-btn flat icon slot="activator" v-on:click.native="$emit('add', $event)">
              <icon name="material-content-add" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
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
  name: 'p-i-funder',
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
