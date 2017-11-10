<template>

    <v-layout row >

      <v-flex xs9 class="border-right">

        <v-layout column>

          <v-flex xs9 offset-xs2>
            <autocomplete
              searchaction="search"
              placeholder="Search..."
              label="geometry.location.lat"
              name="autocomplete"
              :suggester="'titlesuggester'"
              :customParams="{ token: 'dev' }"
              :classes="{ input: 'form-control', wrapper: 'input-wrapper'}"
              :onSelect="handleSelect"
            >
            </autocomplete>
          </v-flex>

          <v-flex xs12 class="pt-5">
            <searchresults></searchresults>
          </v-flex>

        </v-layout>

      </v-flex>
      <v-flex xs3 class="pa-2">
        <h2 class="border-bottom">Filters</h2>
        <searchfilters></searchfilters>
      </v-flex>
    </v-layout>

</template>

<script>
import Autocomplete from '@/components/Autocomplete'
import Searchresults from '@/components/Searchresults'
import Searchfilters from '@/components/Searchfilters'

export default {
  name: 'search',
  components: {
    Autocomplete,
    Searchresults,
    Searchfilters
  },
  methods: {
    handleSelect: function (query) {
      this.$store.commit('setQuery', query.term)
      this.$store.dispatch('search').then(() => {
        // state.searchdef.query = searchdefarr.join('&')
        // state.searchdef.link = $location.protocol() + '://' + $location.host() + '/search#?' + state.searchdef.query
        // $location.search(state.searchdef.query).replace()
        // window.history.replaceState('Search', 'Search results', searchdef.link);
      })
    }
  },
  created: function () {
    this.$store.commit('initDateFacet')
  }
}
</script>

<style scoped>

.border-right {
  border-right: 1px solid #bdbdbd;
}

.border-bottom {
  border-bottom: 1px solid #bdbdbd;
}

</style>
