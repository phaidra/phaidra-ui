<template>
  <v-layout row>
    <v-flex xs4>
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
      >
        <template slot="item" slot-scope="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-tile-content v-text="data.item"></v-list-tile-content>
          </template>
          <template v-else>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.text"></v-list-tile-title>
              <v-list-tile-sub-title v-html="data.item.value"></v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>
    </v-flex>
    <v-flex xs4>
      <v-text-field :value="prefLabel" :hint="value" disabled persistent-hint></v-text-field>
    </v-flex>
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
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
import qs from 'qs'
import '@/compiled-icons/material-content-add'
import '@/compiled-icons/material-content-remove'

export default {
  name: 'p-gbv-suggest-getty',
  props: {
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    voc: {
      type: String,
      required: true
    },
    required: {
      type: Boolean
    },
    multiplicable: {
      type: Boolean
    },
    debounce: {
      type: Number,
      default: 500
    }
  },
  watch: {
    search (val) {
      val && this.querySuggestionsDebounce(val)
    },
    value (val) {
      val && this.resolve(val)
    }
  },
  data () {
    return {
      loading: false,
      items: [],
      search: null,
      select: [],
      debounceTask: undefined,
      prefLabel: ''
    }
  },
  methods: {
    resolve: function (uri) {
      var self = this

      if (uri) {
        self.loading = true

        var params = {
          uri: uri
        }

        var query = qs.stringify(params)

        fetch(self.$store.state.settings.instance.api + '/resolve/?' + query, {
          method: 'GET',
          mode: 'cors'
        })
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          self.loading = false
          self.prefLabel = json.term
        })
        .catch(function (error) {
          console.log(error)
          self.loading = false
        })
      }
    },
    querySuggestionsDebounce (q) {
      if (this.debounce) {
        if (this.debounceTask !== undefined) clearTimeout(this.debounceTask)
        this.debounceTask = setTimeout(() => {
          return this.querySuggestions(q)
        }, this.debounce)
      } else {
        return this.querySuggestions(q)
      }
    },
    querySuggestions (q) {
      var self = this

      self.loading = true

      var params = {
        voc: self.voc,
        count: 20,
        searchstring: q
      }

      var query = qs.stringify(params)

      fetch(self.$store.state.settings.global.suggesters.getty + '?' + query, {
        method: 'GET',
        mode: 'cors'
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        for (var i = 0; i < json[1].length; i++) {
          self.items.push({ text: json[1][i], value: json[3][i] })
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
.btn {
  margin: 0;
}
</style>
