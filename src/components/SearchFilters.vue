<template>

  <v-container fluid grid-list-md>
    <ul class="main-ul">
      <li v-for="(f, i) in facetQueries" :key="i">
        <icon @click.native="showFacet(f)" v-if="f.show" name="univie-stop2" class="primary--text"></icon>
        <icon @click.native="showFacet(f)" v-if="!f.show" name="univie-checkbox-unchecked" class="primary--text"></icon>
        <span @click="showFacet(f)" class="facet-label primary--text" :class="{ active: f.show }">{{ $t(f.label) }}</span>
        <ul v-if="f.show">
          <li v-for="(q, j) in f.queries" :key="j">
            <span @click="toggleFacet(q,f)">
              <icon v-if="q.active" name="univie-stop2" class="primary--text"></icon>
              <icon v-if="!q.active" name="univie-checkbox-unchecked" class="primary--text"></icon>
              <span :class="{ active: q.active }" class="facet-label primary--text">{{ $t(q.label) }}</span>
              <span class="facet-count grey--text" v-if="q.count > 0">({{q.count}})</span>
            </span>
            <ul v-if="q.active && q.childFacet" >
              <li v-for="(q1, k) in q.childFacet.queries" :key="k">
                <span @click="toggleFacet(q1,q.childFacet)">
                  <icon v-if="q1.active" name="univie-stop2" class="primary--text"></icon>
                  <icon v-if="!q1.active" name="univie-checkbox-unchecked" class="primary--text"></icon>
                  <span :class="{ active: q1.active }" class="facet-label primary--text">{{ $t(q1.label) }}</span>
                  <span class="facet-count grey--text" v-if="q1.count > 0">({{q1.count}})</span>
                </span>
                <ul v-if="q1.active && q1.childFacet" >
                  <li v-for="(q2, l) in q1.childFacet.queries" :key="l">
                    <span @click="toggleFacet(q2,q1.childFacet)">
                      <icon v-if="q2.active" name="univie-stop2" class="primary--text"></icon>
                      <icon v-if="!q2.active" name="univie-checkbox-unchecked" class="primary--text"></icon>
                      <span :class="{ active: q2.active }" class="facet-label primary--text">{{ $t(q2.label) }}</span>
                      <span class="facet-count grey--text" v-if="q2.count>0">({{q2.count}})</span>
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
                <icon @click.native="toggleOwnerFilter()" v-if="showOwnerFilter" name="univie-stop2" class="primary--text"></icon>
                <icon @click.native="toggleOwnerFilter()" v-if="!showOwnerFilter" name="univie-checkbox-unchecked" class="primary--text"></icon>
                <span @click="toggleOwnerFilter()" class="facet-label primary--text" :class="{ active: showOwnerFilter }">Owner</span>
              </v-flex>
            </v-layout>
            <autocomplete
              v-if="showOwnerFilter"
              searchaction="search"
              placeholder="Search..."
              name="autocomplete"
              :initValue="owner"
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
                <icon @click.native="toggleAuthorFilter()" v-if="showAuthorFilter" name="univie-stop2" class="primary--text"></icon>
                <icon @click.native="toggleAuthorFilter()" v-if="!showAuthorFilter" name="univie-checkbox-unchecked" class="primary--text"></icon>
                <span @click="toggleAuthorFilter()" class="facet-label primary--text" :class="{ active: showAuthorFilter }">{{ $t('Authors') }}</span>
              </v-flex>
            </v-layout>
            <v-layout row v-if="showAuthorFilter">
              <v-flex xs2>
                <icon name="material-social-person" class="primary--text" height="100%"></icon>
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
                <icon name="material-action-account-balance" class="primary--text" height="100%"></icon>
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
                <icon @click.native="toggleRoleFilter()" v-if="showRoleFilter" name="univie-stop2" class="primary--text"></icon>
                <icon @click.native="toggleRoleFilter()" v-if="!showRoleFilter" name="univie-checkbox-unchecked" class="primary--text"></icon>
                <span @click="toggleRoleFilter()" class="facet-label primary--text" :class="{ active: showRoleFilter }">{{ $t('Roles') }}</span>
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
                    <icon v-if="role.type==='pers'" name="material-social-person" class="primary--text" height="100%"></icon>
                    <icon v-if="role.type==='corp'" name="material-action-account-balance" class="primary--text" height="100%"></icon>
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
                    <icon name="material-navigation-close" class="primary--text" height="100%" @click.native="removeRoleFilter(role)"></icon>
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
  name: 'search-filters',
  components: {
    Autocomplete
  },
  computed: {
    owner () {
      return this.$store.state.search.owner
    },
    showRoleFilter () {
      return this.$store.state.search.showRoleFilter
    },
    showAuthorFilter () {
      return this.$store.state.search.showAuthorFilter
    },
    showOwnerFilter () {
      return this.$store.state.search.showOwnerFilter
    },
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
    handleOwnerSelect: function (query) {
      this.$store.dispatch('setOwnerFilter', query.term)
    },
    toggleOwnerFilter: function () {
      this.$store.dispatch('toggleOwnerFilter')
    },
    toggleAuthorFilter: function () {
      this.$store.dispatch('toggleAuthorFilter')
    },
    toggleRoleFilter: function () {
      this.$store.dispatch('toggleRoleFilter')
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
      this.$store.dispatch('removeRoleFilterValue', { role: role, value: value })
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
  cursor: pointer

.facet-count
  margin-left: 5px

svg
  margin-bottom: 3px
  cursor: pointer

</style>

<style scoped>

</style>
