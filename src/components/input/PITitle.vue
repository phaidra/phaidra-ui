<template>
  <v-layout row>
    <v-flex xs4>
      <v-text-field
        :value="title"
        :label="$t('Title')"
        v-on:input="$emit('input-title', $event)"
        box
      ></v-text-field>
    </v-flex>
    <v-flex xs4>
      <v-text-field
        :value="subtitle"
        :label="$t('Subtitle')"
        v-on:input="$emit('input-subtitle', $event)"
        box
      ></v-text-field>
    </v-flex>
    <v-flex xs2 v-if="multilingual">
      <v-select 
        v-on:input="$emit('input-language', $event)" 
        :label="$t('Language')"
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
        :items="vocabularies['lang'].terms" 
        :value="getLangTerm(language)"
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
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex>
            <v-btn v-if="multiplicable" flat icon slot="activator" v-on:click.native="$emit('add', $event)">
              <icon name="material-content-add" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn v-if="multiplicable" flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
              <icon name="material-content-remove" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn v-if="ordered" flat icon slot="activator" v-on:click.native="$emit('down', $event)">
              <icon name="material-hardware-arrow-down" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn v-if="ordered" flat icon slot="activator" v-on:click.native="$emit('up', $event)">
              <icon name="material-hardware-arrow-up" width="24px" height="24px"></icon>
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
import '@/compiled-icons/material-hardware-arrow-down'
import '@/compiled-icons/material-hardware-arrow-up'

export default {
  name: 'p-i-title',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    title: {
      type: String
    },
    subtitle: {
      type: String
    },
    language: {
      type: String
    },
    required: {
      type: Boolean
    },
    multiplicable: {
      type: Boolean
    },
    multilingual: {
      type: Boolean
    },
    ordered: {
      type: Boolean
    }
  },
  data () {
    return {
      datepicker: false,
      selectedDate: ''
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
</style>
