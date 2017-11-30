<template>

    <v-layout row >

      <v-flex xs9 class="border-right">

        <v-layout column>

          <v-flex xs9 offset-xs2>
            <autocomplete
              placeholder="Search..."
              name="autocomplete"
              :initValue="query"
              :suggester="'titlesuggester'"
              :customParams="{ token: 'dev' }"
              :classes="{ input: 'form-control', wrapper: 'input-wrapper'}"
              :onSelect="handleSelect"
            ></autocomplete>
          </v-flex>

          <v-flex xs12 class="pt-5">
            <v-layout row>
              <v-flex xs2><span>{{ total }} {{ $t('objects') }}</span></v-flex>
              <v-flex xs6>
                <v-pagination v-if="total>pagesize" v-bind:length.number="totalPages" total-visible="9" v-model="page" class="mb-3" flat></v-pagination>
              </v-flex>
              <v-flex xs4>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <v-flex>
                      <v-tooltip bottom>
                        <icon @click.native="setSort('title asc')" name="fontello-sort-name-up" :color="sortIsActive('title asc') ? '#1A74B0' : '#777777'" slot="activator"></icon>
                        <span>{{ $t('Title ascending')}}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex>
                      <v-tooltip bottom>
                        <icon @click.native="setSort('title desc')" name="fontello-sort-name-down" :color="sortIsActive('title desc') ? '#1A74B0' : '#777777'" slot="activator"></icon>
                        <span>{{ $t('Title descending')}}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex>
                      <v-tooltip bottom>
                        <icon @click.native="setSort('created asc')" name="fontello-sort-number-up" :color="sortIsActive('created asc') ? '#1A74B0' : '#777777'" slot="activator"></icon>
                        <span>{{ $t('Upload date ascending')}}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex>
                      <v-tooltip bottom>
                        <icon @click.native="setSort('created desc')" name="fontello-sort-number-down" :color="sortIsActive('created desc') ? '#1A74B0' : '#777777'" slot="activator"></icon>
                        <span>{{ $t('Upload date descending')}}</span>
                      </v-tooltip>
                    </v-flex>
                    <v-flex>
                      <v-dialog v-model="linkdialog" max-width="800px">
                        <v-card>
                          <v-card-title>
                            <h3>{{ $t('Link to search results') }}</h3>
                          </v-card-title>
                          <v-card-text>{{ searchDef.link }}</v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" flat @click.stop="linkdialog=false">Close</v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <v-tooltip bottom>
                        <icon @click.native="linkdialog=true" name="material-content-link" slot="activator"></icon>
                        <span>{{ $t('Link to search results')}}</span>
                      </v-tooltip>
                    </v-flex>
                    <!--
                    <v-flex>
                      <v-tooltip bottom>
                        <icon name="material-action-bookmark" color="#1A74B0" slot="activator" v-if="signedin" ></icon>
                        <span>{{ $t('Bookmarks')}}</span>
                      </v-tooltip>
                    </v-flex>
                  -->
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
            <searchresults></searchresults>
            <v-pagination v-if="total>pagesize" v-bind:length.number="totalPages" total-visible="13" v-model="page" class="mb-3"></v-pagination>
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
import '@/compiled-icons/fontello-sort-name-up'
import '@/compiled-icons/fontello-sort-name-down'
import '@/compiled-icons/fontello-sort-number-up'
import '@/compiled-icons/fontello-sort-number-down'
import '@/compiled-icons/material-content-link'
import '@/compiled-icons/material-action-bookmark'

export default {
  name: 'search',
  components: {
    Autocomplete,
    Searchresults,
    Searchfilters
  },
  data () {
    return {
      linkdialog: false
    }
  },
  computed: {
    query: function () {
      return this.$store.state.search.q
    },
    page: {
      get () {
        return this.$store.state.search.page
      },
      set (value) {
        this.$store.dispatch('setPage', value)
      }
    },
    totalPages: function () {
      return Math.ceil(this.$store.state.search.total / this.$store.state.search.pagesize)
    },
    total: function () {
      return this.$store.state.search.total
    },
    pagesize: function () {
      return this.$store.state.search.pagesize
    },
    signedin () {
      return this.$store.state.user.token ? 1 : 0
    },
    searchDef: function () {
      return this.$store.state.search.searchDef
    }
  },
  methods: {
    handleSelect: function (query) {
      this.$store.commit('setQuery', query.term)
      this.$store.dispatch('search').then(() => {
        // this.$store.commit('setSearchDefLink', location.protocol + '//' + location.host + '/#/search?' + this.$store.state.search.searchDef.query)
        // var query = this.$route.query.stringify({a: 'blaba'}, { encodeValuesOnly: true, indices: false })
        // $location.search(state.searchdef.query).replace()
        window.history.replaceState('Search', 'Search results', this.searchDef.link)
      })
    },
    setSort: function (sort) {
      this.$store.dispatch('setSort', sort)
    },
    sortIsActive: function (sort) {
      for (var i = 0; i < this.$store.state.search.sortdef.length; i++) {
        if (this.$store.state.search.sortdef[i].id === sort) {
          return this.$store.state.search.sortdef[i].active
        }
      }
    }
  },
  beforeCreate: function () {
    this.$store.commit('setSearchParams', this.$route.query)
    this.$store.dispatch('search')
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

svg {
  cursor: pointer
}

</style>
