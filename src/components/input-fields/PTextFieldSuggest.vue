<template>
  <v-layout row>
    <v-flex xs8>
      <v-combobox
        v-model="model"
        v-on:input="$emit('input', $event)"
        v-on:change="$emit('input', $event)"
        :items="items"
        :loading="loading"
        :search-input.sync="search"
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
        cache-items
        hide-no-data
        hide-selected
        item-text="text"
        item-value="value"
        :label="label"
        box
      ></v-combobox>
    </v-flex>
    <v-flex xs2 v-if="multilingual">
      <v-select 
        v-on:input="$emit('input-language', $event)" 
        :label="'Language'"
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
        :items="vocabularies['lang'].terms" 
        :value="language"
        box
      ></v-select>                      
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
  import qs from 'qs'
  import '@/compiled-icons/material-content-add'
  import '@/compiled-icons/material-content-remove'

  export default {
    name: 'p-text-field-suggest',
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
      },
      debounce: {
        type: Number,
        default: 500
      }
    },
    data () {
      return {
        items: [],
        loading: false,
        model: null,
        search: null
      }
    },
    computed: {
      vocabularies: function () {
        return this.$store.state.vocabulary.vocabularies
      }
    },
    watch: {
      search (val) {
        val && this.querySuggestionsDebounce(val)
      }
    },
    methods: {
      querySuggestionsDebounce (value) {
        this.showList = true

        if (this.debounce) {
          if (this.debounceTask !== undefined) clearTimeout(this.debounceTask)
          this.debounceTask = setTimeout(() => {
            return this.querySuggestions(value)
          }, this.debounce)
        } else {
          return this.querySuggestions(value)
        }
      },
      querySuggestions (q) {
        var self = this

        if (q.length < this.min || !this.suggester) return

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
          self.items = []
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
.searchbox{
  font-size: 14px;
  box-sizing: border-box;
  border: none;
  box-shadow: none;
  outline: 0;
  background: 0 0;
  width: 100%;
  padding: 0 15px;
  line-height: 40px;
  height: 40px;
}

.autocomplete {
  position: absolute;
  z-index: 999;
  margin-top: 2px;
}
.v-btn {
  margin: 0;
}
</style>

