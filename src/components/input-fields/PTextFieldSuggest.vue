<template>
  <v-layout row>
    <v-flex xs8>
      <div :class="`${getClassName('wrapper')} autocomplete-wrapper`">
        <v-text-field         
          :value="value" 
          v-on:input="$emit('input', $event)" 
          :label="label" 
          :required="required"
          :rules="required ? [ v => !!v || 'Required'] : []"
          @input="handleInput"
          @blur="handleBlur"
          @keydown.native="handleKeyDown"
          @focus="handleFocus"
        ></v-text-field>
        <div :class="`${getClassName('list')} autocomplete autocomplete-list elevation-2`" v-show="showList && suggestions.length">
          <v-list>
            <v-list-tile v-for="(data, i) in suggestions" :class="activeClass(i)" :key="i" @click.prevent="selectList(data)">
              <v-list-tile-content>
                <v-list-tile-title v-text="data.term"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
      </div>
    </v-flex>
    <v-flex xs2 v-if="multilingual">
      <v-select 
        v-on:input="$emit('input-language', $event)" 
        :label="'Language'"
        :required="required"
        :rules="required ? [ v => !!v || 'Required'] : []"
        :items="vocabularies['lang'].terms" 
        :value="language"
      ></v-select>                      
    </v-flex>
    <v-flex xs2>
      <v-container fill-height>
        <v-layout row>
          <v-flex class="pt-4">
            <v-btn flat icon slot="activator" v-on:click.native="$emit('add', $event)">
              <icon v-if="multiplicable" name="material-content-add" width="24px" height="24px"></icon>
            </v-btn>
            <v-btn flat icon slot="activator" v-on:click.native="$emit('remove', $event)">
              <icon v-if="multiplicable" name="material-content-remove" width="24px" height="24px"></icon>
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
      className: String,
      classes: {
        type: Object,
        default: () => ({
          wrapper: false,
          input: false,
          list: false,
          item: false
        })
      },
      debounce: Number,
      min: {
        type: Number,
        default: 0
      }
    },

    data () {
      return {
        showList: false,
        focusList: '',
        debounceTask: undefined,
        loading: false,
        suggestions: []
      }
    },

    computed: {
      vocabularies: function () {
        return this.$store.state.vocabulary.vocabularies
      }
    },

    methods: {

      getClassName (part) {
        const { classes, className } = this
        if (classes[part]) return `${classes[part]}`
        return className ? `${className}-${part}` : ''
      },

      handleInput (value) {
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

      handleKeyDown (e) {
        let key = e.keyCode

        if (!this.showList) return

        const DOWN = 40
        const UP = 38
        const ENTER = 13
        const ESC = 27

        // Prevent Default for Prevent Cursor Move & Form Submit
        switch (key) {
          case DOWN:
            e.preventDefault()
            this.focusList++
            break
          case UP:
            e.preventDefault()
            this.focusList--
            break
          case ENTER:
            e.preventDefault()
            if (this.focusList === 0) {
              this.onSelect ? this.onSelect({ term: this.value }) : null
            } else {
              this.selectList(this.suggestions[this.focusList])
            }
            this.showList = false
            break
          case ESC:
            this.showList = false
            break
        }

        const listLength = this.suggestions.length - 1
        const outOfRangeBottom = this.focusList > listLength
        const outOfRangeTop = this.focusList < 0
        const topItemIndex = 0
        const bottomItemIndex = listLength

        let nextFocusList = this.focusList
        if (outOfRangeBottom) nextFocusList = topItemIndex
        if (outOfRangeTop) nextFocusList = bottomItemIndex
        this.focusList = nextFocusList
      },

      handleBlur (e) {
        setTimeout(() => {
          this.showList = false
        }, 250)
      },

      handleFocus (e) {
        this.focusList = 0
      },

      mousemove (i) {
        this.focusList = i
      },

      activeClass (i) {
        const focusClass = i === this.focusList ? 'grey lighten-4' : ''
        return `${focusClass}`
      },

      selectList (data) {
        this.showList = false
        this.$emit('input', data['term'])
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
          self.suggestions = json.suggest[self.suggester][q].suggestions
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
.btn {
  margin: 0;
}
</style>

