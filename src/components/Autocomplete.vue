<template>
  <div :class="`${getClassName('wrapper')} autocomplete-wrapper`">
    <input
      class="searchbox elevation-1"
      ref="input"
      type="text"
      :id="id"
      :class="`${getClassName('input')} autocomplete-input`"
      :placeholder="placeholder"
      :name="name"
      v-model="type"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeyDown"
      @focus="handleFocus"
      autocomplete="off"
    />
    <div :class="`${getClassName('list')} autocomplete autocomplete-list elevation-2`" v-show="showList && suggestions.length">
      <v-list>
        <v-list-tile v-for="(data, i) in suggestions" :class="activeClass(i)" :key="i" @click.prevent="selectList(data)">
          <v-list-tile-content>
            <v-list-tile-title v-html="data.term"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>

  </div>
</template>


<script>
  export default {

    props: {
      id: String,
      name: String,
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
      placeholder: String,
      required: Boolean,

      // Intial Value
      initValue: {
        type: String,
        default: ''
      },

      // Debounce time
      debounce: Number,

      suggester: {
        type: String,
        required: true
      },

      // minimum length
      min: {
        type: Number,
        default: 0
      },

      onSelect: Function
    },

    data () {
      return {
        showList: false,
        type: '',
        focusList: '',
        debounceTask: undefined
      }
    },

    computed: {
      suggestions () {
        return this.$store.state.search.suggestions[this.suggester]
      }
    },

    methods: {

      getClassName (part) {
        const { classes, className } = this
        if (classes[part]) return `${classes[part]}`
        return className ? `${className}-${part}` : ''
      },

      // Netralize Autocomplete
      clearInput () {
        this.showList = false
        this.type = ''
        this.$store.commit('setSuggestions', { suggester: this.suggester, suggestions: [] })
        this.focusList = ''
      },

      // Get the original data
      cleanUp (data) {
        return JSON.parse(JSON.stringify(data))
      },

      handleInput (e) {
        const { value } = e.target
        this.showList = true

        // If Debounce
        if (this.debounce) {
          if (this.debounceTask !== undefined) clearTimeout(this.debounceTask)
          this.debounceTask = setTimeout(() => {
            return this.getData(value)
          }, this.debounce)
        } else {
          return this.getData(value)
        }
      },

      handleKeyDown (e) {
        let key = e.keyCode

        // Disable when list isn't showing up
        if (!this.showList) return

        // Key List
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
              this.onSelect ? this.onSelect({ term: this.type }) : null
            } else {
              this.selectList(this.$store.state.search.suggestions[this.suggester][this.focusList])
            }
            this.showList = false
            break
          case ESC:
            this.showList = false
            break
        }

        const listLength = this.$store.state.search.suggestions[this.suggester].length - 1
        const outOfRangeBottom = this.focusList > listLength
        const outOfRangeTop = this.focusList < 0
        const topItemIndex = 0
        const bottomItemIndex = listLength

        let nextFocusList = this.focusList
        if (outOfRangeBottom) nextFocusList = topItemIndex
        if (outOfRangeTop) nextFocusList = bottomItemIndex
        this.focusList = nextFocusList
      },

      setValue (val) {
        this.type = val
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
        // Deep clone of the original object
        const clean = this.cleanUp(data)
        // Put the selected data to type (model)
        this.type = clean['payload']
        // Hide List
        this.showList = false

        this.onSelect ? this.onSelect(clean) : null
      },

      getData (value) {
        if (value.length < this.min || !this.suggester) return
        this.$store.dispatch('suggest', { suggester: this.suggester, value: value })
      }
    },

    created () {
      // Sync parent model with initValue Props
      this.type = this.initValue ? this.initValue : null
      this.$store.commit('setSuggestions', { suggester: this.suggester, suggestions: [] })
    },

    mounted () {
      if (this.required) this.$refs.input.setAttribute('required', this.required)
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

</style>
