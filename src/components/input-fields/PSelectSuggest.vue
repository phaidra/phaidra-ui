<template>
  <v-layout row>
    <v-flex xs8>
      <v-select
        :value="value" 
        :loading="loading"
        :items="items"
        :required="required"
        :rules="required ? [() => select.length > 0 || 'Required'] : []"
        :search-input.sync="search"
        v-on:input="$emit('input', $event)"
        :label="label" 
        autocomplete
        cache-items
      ></v-select>
    </v-flex>
    <v-flex xs2 v-if="multilingual">
      <v-select 
        v-on:input="$emit('input-language', $event)" 
        :label="'Language'" 
        :items="vocabularies['http://id.loc.gov/vocabulary/iso639-2'].terms" 
        :value="language"
      ></v-select>                      
    </v-flex>
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
            <icon v-if="multiplicable" name="material-content-add" width="24px" height="24px" v-on:click.native="$emit('add', $event)"></icon>
            <icon v-if="multiplicable" name="material-content-remove" width="24px" height="24px" v-on:click.native="$emit('remove', $event)"></icon>           
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import qs from 'qs'
import '@/compiled-icons/material-content-add'
import '@/compiled-icons/material-content-remove'

export default {
  name: 'p-select-suggest',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  props: {
    value: {
      type: String,
      required: true
    },
    language: {
      type: String
    },
    label: {
      type: String,
      required: true
    },
    required: {
      type: Boolean
    },
    multilingual: {
      type: Boolean
    },
    multiplicable: {
      type: Boolean
    },
    suggester: {
      type: String,
      required: true
    }
  },
  watch: {
    search (val) {
      val && this.querySuggestions(val)
    }
  },
  data () {
    return {
      loading: false,
      items: [],
      search: null,
      select: []
    }
  },
  methods: {
    querySuggestions (q) {
      var self = this

      self.loading = true

      var params = {
        suggest: true,
        'suggest.dictionary': self.suggester,
        wt: 'json',
        'suggest.q': q
      }

      var query = qs.stringify(params)

      fetch(self.$store.state.settings.instance.solr + '/suggest?' + query, {
        method: 'GET',
        mode: 'cors'
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        for (var i = 0; i < json.suggest[self.suggester][q].suggestions.length; i++) {
          self.items.push(json.suggest[self.suggester][q].suggestions[i].term)
        }
        self.loading = false
      })
      .catch(function (error) {
        console.log(error)
        self.loading = false
      })
    }
  }
}
</script>

<style scoped>
/*
.form-background {
  background-color: #f3f3f3;
}
*/
</style>
