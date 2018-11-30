<template>
  <v-layout row>
    <v-flex xs2 v-if="type === 'schema:Person'">
      <v-text-field
        :value="firstname"
        :label="$t('Firstname')"
        v-on:input="$emit('input-firstname', $event)"
        box
      ></v-text-field>
    </v-flex>
    <v-flex xs2 v-if="type === 'schema:Person'">
      <v-text-field
        :value="lastname"
        :label="$t('Lastname')"
        v-on:input="$emit('input-lastname', $event)"
        box
      ></v-text-field>
    </v-flex>
    <v-flex xs4 v-if="type === 'schema:Organisation'">
      <v-text-field
        :value="institution"
        :label="'Institution'"
        v-on:input="$emit('input-institution', $event)"
        box
      ></v-text-field>
    </v-flex>
    <v-flex xs2 v-if="showidentifier">
      <v-text-field
        :value="identifier"
        :label="$t('Identifier')"
        v-on:input="$emit('input-identifier', $event)"
        box
      ></v-text-field>                    
    </v-flex>
    <v-flex xs2>
      <v-autocomplete
        :disabled="disablerole" 
        v-on:input="$emit('input-role', $event)" 
        :label="$t('Role')" 
        :items="vocabularies['https://phaidra.org/vocabulary/role'].terms" 
        :value="getTerm(role)"
        :filter="autocompleteFilter"
        box
        return-object
        clearable
      >
        <template slot="item" slot-scope="{ item }">
          <v-list-tile-content two-line>
            <v-list-tile-title  v-html="`${item['skos:prefLabel'][$i18n.locale] ? item['skos:prefLabel'][$i18n.locale] : item['skos:prefLabel']['eng']}`"></v-list-tile-title>
            <v-list-tile-sub-title  v-html="`${item['@id']}`"></v-list-tile-sub-title>
          </v-list-tile-content>
        </template>
        <template slot="selection" slot-scope="{ item }">
          <v-list-tile-content>
            <v-list-tile-title v-html="`${item['skos:prefLabel'][$i18n.locale] ? item['skos:prefLabel'][$i18n.locale] : item['skos:prefLabel']['eng']}`"></v-list-tile-title>
          </v-list-tile-content>
        </template>
      </v-autocomplete>                      
    </v-flex>
    <v-flex xs2 v-if="showdate">
      <v-menu
        ref="datepicker"
        v-model="datepicker"
        :return-value.sync="datemodel"
        lazy
        transition="fade-transition"
        offset-y
        full-width
        min-width="290px"
        box
      >
        <v-text-field
          slot="activator"
          v-model="selectedDate"
          :label="$t('Date')"
          append-icon="event"
          box
        ></v-text-field>
        <v-date-picker v-model="selectedDate" :value="date" v-on:input="$emit('input-date', $event)" :reactive="true"></v-date-picker>
      </v-menu>
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
  name: 'p-i-entity',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    institution: {
      type: String
    },
    identifier: {
      type: String
    },
    role: {
      type: String
    },
    date: {
      type: String
    },
    type: {
      type: String
    },
    required: {
      type: Boolean
    },
    multiplicable: {
      type: Boolean
    },
    ordered: {
      type: Boolean
    },
    disablerole: {
      type: Boolean,
      default: false
    },
    showdate: {
      type: Boolean,
      default: true
    },
    showidentifier: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    getTerm: function (value) {
      for (var i = 0; i < this.vocabularies[this.vocabulary].terms.length; i++) {
        if (this.vocabularies[this.vocabulary].terms[i]['@id'] === value) {
          return this.vocabularies[this.vocabulary].terms[i]
        }
      }
    },
    autocompleteFilter: function (item, queryText, itemText) {
      const lab = item['skos:prefLabel'][this.$i18n.locale] ? item['skos:prefLabel'][this.$i18n.locale].toLowerCase() : item['skos:prefLabel']['eng'].toLowerCase()
      const query = queryText.toLowerCase()
      return lab.indexOf(query) > -1
    }
  },
  data () {
    return {
      datepicker: false,
      selectedDate: '',
      datemodel: '',
      vocabulary: 'https://phaidra.org/vocabulary/role'
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.loading = !this.vocabularies[this.vocabulary].loaded
      // emit input to set skos:prefLabel in parent
      if (this.role) {
        for (var i = 0; i < this.vocabularies[this.vocabulary].terms.length; i++) {
          if (this.vocabularies[this.vocabulary].terms[i]['@id'] === this.role) {
            this.$emit('input', this.vocabularies[this.vocabulary].terms[i])
          }
        }
      }
    })
  }
}
</script>

<style scoped>
.v-btn {
  margin: 0;
}
</style>
