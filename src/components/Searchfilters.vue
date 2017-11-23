<template>

  <v-container fluid grid-list-md>
    <ul class="main-ul">
      <li v-for="(f, i) in facetQueries" :key="i">
        <icon @click.native="showFacet(f)" v-if="f.show" name="univie-stop2" color="#1A74B0"></icon>
        <icon @click.native="showFacet(f)" v-if="!f.show" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
        <span @click="showFacet(f)" class="facet-label" :class="{ active: f.show }">{{ $t(f.label) }}</span>
        <ul v-if="f.show">
          <li v-for="(q, j) in f.queries" :key="j">
            <span @click="toggleFacet(q,f)">
              <icon v-if="q.active" name="univie-stop2" color="#1A74B0"></icon>
              <icon v-if="!q.active" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
              <span :class="{ active: q.active }" class="facet-label">{{ $t(q.label) }}</span>
              <span class="facet-count" v-if="q.count > 0">({{q.count}})</span>
            </span>
            <ul v-if="q.active && q.childFacet" >
              <li v-for="(q1, k) in q.childFacet.queries" :key="k">
                <span @click="toggleFacet(q1,q.childFacet)">
                  <icon v-if="q1.active" name="univie-stop2" color="#1A74B0"></icon>
                  <icon v-if="!q1.active" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
                  <span :class="{ active: q1.active }" class="facet-label">{{ $t(q1.label) }}</span>
                  <span class="facet-count" v-if="q1.count > 0">({{q1.count}})</span>
                </span>
                <ul v-if="q1.active && q1.childFacet" >
                  <li v-for="(q2, l) in q1.childFacet.queries" :key="l">
                    <span @click="toggleFacet(q2,q1.childFacet)">
                      <icon v-if="q2.active" name="univie-stop2" color="#1A74B0"></icon>
                      <icon v-if="!q2.active" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
                      <span :class="{ active: q2.active }" class="facet-label">{{ $t(q2.label) }}</span>
                      <span class="facet-count" v-if="q2.count>0">({{q2.count}})</span>
                    </span>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <v-layout column>
          <v-flex>
            <v-layout row>
              <v-flex>
                <icon @click.native="toggleOwnerFilter()" v-if="showOwnerFilter" name="univie-stop2" color="#1A74B0"></icon>
                <icon @click.native="toggleOwnerFilter()" v-if="!showOwnerFilter" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
                <span @click="toggleOwnerFilter()" class="facet-label" :class="{ active: showOwnerFilter }">Owner</span>
              </v-flex>
            </v-layout>
            <autocomplete
              v-if="showOwnerFilter"
              searchaction="search"
              placeholder="Search..."
              name="autocomplete"
              :suggester="'ownersuggester'"
              :customParams="{ token: 'dev' }"
              :classes="{ input: 'form-control', wrapper: 'input-wrapper'}"
              :onSelect="handleOwnerSelect"
            ></autocomplete>
          </v-flex>
        </v-layout>
      </li>
      <li>
        <v-layout column>
          <v-flex>
            <v-layout row>
              <v-flex>
                <icon @click.native="toggleAuthorFilter()" v-if="showAuthorFilter" name="univie-stop2" color="#1A74B0"></icon>
                <icon @click.native="toggleAuthorFilter()" v-if="!showAuthorFilter" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
                <span @click="toggleAuthorFilter()" class="facet-label" :class="{ active: showAuthorFilter }">{{ $t('Authors') }}</span>
              </v-flex>
            </v-layout>
            <v-layout row v-if="showAuthorFilter">
              <v-flex xs2>
                <icon name="material-social-person" color="#1A74B0" height="100%"></icon>
              </v-flex>
              <v-flex xs10>
                <v-select
                  :placeholder="$t('ADD_PREFIX') + ' '  + $t(persAuthors[0].label) + ' ' + $t('ADD_SUFFIX') + '...'"
                  chips
                  tags
                  clearable
                  v-model="persAuthorsValues"
                >
                </v-select>
              </v-flex>
            </v-layout>
            <v-layout row v-if="showAuthorFilter">
              <v-flex xs2>
                <icon name="material-action-account-balance" color="#1A74B0" height="100%"></icon>
              </v-flex>
              <v-flex xs10>
                <v-select
                  :placeholder="$t('ADD_PREFIX') + ' '  + $t(corpAuthors[0].label) + ' ' + $t('ADD_SUFFIX') + '...'"
                  chips
                  tags
                  clearable
                  v-model="corpAuthorsValues"
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </li>
      <li>
        <v-layout column>
          <v-flex>
            <v-layout row>
              <v-flex>
                <icon @click.native="toggleRoleFilter()" v-if="showRoleFilter" name="univie-stop2" color="#1A74B0"></icon>
                <icon @click.native="toggleRoleFilter()" v-if="!showRoleFilter" name="univie-checkbox-unchecked" color="#1A74B0"></icon>
                <span @click="toggleRoleFilter()" class="facet-label" :class="{ active: showRoleFilter }">{{ $t('Roles') }}</span>
              </v-flex>
            </v-layout>
            <v-layout column v-if="showRoleFilter">
              <v-select
                :placeholder="$t('Add role') + '...'"
                :hint="$t('Personal')"
                :items="marcRolesArray"
                v-model="selectedRole.pers"
                @input="addRoleFilter('pers')"
                max-height="400"
                persistent-hint
              ></v-select>
              <v-select
                :placeholder="$t('Add role') + '...'"
                :hint="$t('Corporate')"
                :items="marcRolesArray"
                v-model="selectedRole.corp"
                @input="addRoleFilter('corp')"
                max-height="400"
                persistent-hint
              ></v-select>
              <div v-for="(role, i) in roles" :key="i" v-if="roles.length > 0" >
                <v-layout row>
                  <v-flex xs2>
                    <icon v-if="role.type==='pers'" name="material-social-person" color="#1A74B0" height="100%"></icon>
                    <icon v-if="role.type==='corp'" name="material-action-account-balance" color="#1A74B0" height="100%"></icon>
                  </v-flex>
                  <v-flex xs8>
                    <v-select
                      :placeholder="$t('ADD_PREFIX') + ' '  + $t(role.label) + ' ' + $t('ADD_SUFFIX') + '...'"
                      chips
                      tags
                      clearable
                      :items="role.values"
                      v-model="role.values"
                      @input="setRoleFilterValues(role)"
                    >
                    </v-select>
                  </v-flex>
                  <v-flex xs2>
                    <icon name="material-navigation-close" color="#1A74B0" height="100%" @click.native="removeRoleFilter(role)"></icon>
                  </v-flex>
                </v-layout>
              </div>
            </v-layout>

          </v-flex>
        </v-layout>
      </li>
    </ul>
  </v-container>

</template>

<script>
import Autocomplete from '@/components/Autocomplete'
import '@/compiled-icons/univie-stop2'
import '@/compiled-icons/univie-checkbox-unchecked'
import '@/compiled-icons/material-action-account-balance'
import '@/compiled-icons/material-navigation-close'

export default {
  name: 'searchfilters',
  components: {
    Autocomplete
  },
  computed: {
    facetQueries () {
      return this.$store.state.search.facetQueries
    },
    persAuthors () {
      return this.$store.state.search.pers_authors
    },
    persAuthorsValues: {
      get () {
        return this.$store.state.search.pers_authors.values
      },
      set (value) {
        // it seems chips are manipulating the array directly anyways
        // maybe should provide own filtering function
        this.$store.dispatch('setPersAuthors', value)
      }
    },
    corpAuthors () {
      return this.$store.state.search.corp_authors
    },
    corpAuthorsValues: {
      get () {
        return this.$store.state.search.corp_authors.values
      },
      set (value) {
        // it seems chips are manipulating the array directly anyways
        // maybe should provide own filtering function
        this.$store.dispatch('setCorpAuthors', value)
      }
    },
    marcRoles () {
      return this.$store.state.search.marcRoles
    },
    roles () {
      return this.$store.state.search.roles
    }
  },
  data () {
    return {
      showOwnerFilter: false,
      showAuthorFilter: false,
      showRoleFilter: false,
      selectedRole: { pers: '', corp: '' },
      marcRolesArray: []
    }
  },
  methods: {
    showFacet: function (f) {
      this.$store.dispatch('showFacet', f)
    },
    toggleFacet: function (q, f) {
      this.$store.dispatch('toggleFacet', { q: q, f: f })
    },
    toggleOwnerFilter: function () {
      this.showOwnerFilter = !this.showOwnerFilter
      if (!this.showOwnerFilter) {
        this.$store.dispatch('clearOwnerFilter')
      }
    },
    handleOwnerSelect: function (query) {
      this.$store.dispatch('setOwnerFilter', query.term)
    },
    toggleAuthorFilter: function () {
      this.showAuthorFilter = !this.showAuthorFilter
      if (!this.showAuthorFilter) {
        this.$store.dispatch('clearAuthorFilter')
      }
    },
    toggleRoleFilter: function () {
      this.showRoleFilter = !this.showRoleFilter
      if (!this.showRoleFilter) {
        this.$store.dispatch('clearRoleFilter')
      }
    },
    addRoleFilter: function (type) {
      if (this.selectedRole[type]) {
        this.$store.dispatch('addRoleFilter', {
          field: 'bib_roles_' + type + '_' + this.selectedRole[type],
          label: this.$t(this.marcRoles[this.selectedRole[type]]),
          values: [],
          type: type
        })
      }
    },
    removeRoleFilter: function (role) {
      this.$store.dispatch('removeRoleFilter', role)
    },
    setRoleFilterValues: function (role) {
      this.$store.dispatch('setRoleFilterValues', role)
    },
    removeRoleFilterValue: function (role, value) {
      this.$store.dispatch('removeRoleFilterValue', {role: role, value: value})
    }
  },
  mounted () {
    for (var role in this.marcRoles) {
      this.marcRolesArray.push({ value: role, text: this.$t(this.marcRoles[role]) })
    }
  }
}
</script>

<style lang="stylus" scoped>

@require '../stylus/main'

ul
  list-style: none
  padding-left: 1em

.facet-label
  color: $theme.primary
  cursor: pointer

.facet-count
  color: #1a1a1a
  margin-left: 5px

svg
  margin-bottom: 3px
  cursor: pointer

svg-icon
  color: $theme.primary

</style>

<style scoped>


</style>
