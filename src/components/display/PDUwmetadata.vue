<template>
  <v-flex v-if="this.indexdata">
    <v-flex v-for="(title,i) in getTitles()" :key="'title'+i" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Title') }} ({{ title.lang }})</v-flex>
          <v-flex xs9>{{ title.value }}</v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-for="(role,i) in parsedRolesUwm()" :key="'role'+i" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ role.label }}</v-flex>
          <v-flex xs9>
            <v-layout column>
              <v-flex v-for="(entity,j) in role.entities" :key="j">
                {{ entity.firstname }} {{ entity.lastname }} <span class="grey--text">{{ entity.institution }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-if="indexdata.bib_journal" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Journal') }}</v-flex>
          <v-flex xs9>
            <v-layout column>
              <v-flex v-for="(v,i) in indexdata.bib_journal" :key="i">{{v}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-if="indexdata.bib_volume" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Volume') }}</v-flex>
          <v-flex xs9>
            <v-layout column>
              <v-flex v-for="(v,i) in indexdata.bib_volume" :key="i">{{v}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-if="indexdata.bib_publisher" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Publisher') }}</v-flex>
          <v-flex xs9>
            <v-layout column>
              <v-flex v-for="(v,i) in indexdata.bib_publisher" :key="i">{{v}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-if="indexdata.bib_published" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Published') }}</v-flex>
          <v-flex xs9>
            <v-layout column>
              <v-flex v-for="(v,i) in indexdata.bib_published" :key="i">{{v}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-if="indexdata.bib_publisherlocation" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Publisher location') }}</v-flex>
          <v-flex xs9>
            <v-layout column>
              <v-flex v-for="(v,i) in indexdata.bib_publisherlocation" :key="i">{{v}}</v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex v-for="(desc,i) in getDescriptions()" :key="'desc'+i" class="mt-3">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('Description') }} ({{ desc.lang }})</v-flex>
          <v-flex xs9>{{ desc.value }}</v-flex>
        </v-layout>
      </v-container>
    </v-flex>

    <v-flex class="mt-3" v-if="indexdata.dc_license">
      <v-container fluid>
        <v-layout row>
          <v-flex class="caption grey--text" xs2>{{ $t('License') }}</v-flex>
          <v-flex xs9>
            <p-d-license v-if="indexdata.dc_license" :dclicense="indexdata.dc_license[0]"></p-d-license>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-flex>
</template>

<script>
import PDLicense from '@/components/display/PDLicense'

export default {

  name: 'p-d-uwmetadata',
  props: {
    pid: {
      type: String
    },
    indexdata: {
      type: Object,
      default: null
    }
  },
  components: {
    PDLicense
  },
  methods: {
    getTitles: function () {
      var titles = []
      var doc = this.indexdata
      Object.keys(doc).forEach(function (field) {
        if (field.startsWith('dc_title_')) {
          for (var i = 0; i < doc[field].length; i++) {
            titles.push({ value: doc[field][i], lang: field.substr(field.length - 3) })
          }
        }
      })
      return titles
    },
    getDescriptions: function () {
      var descriptions = []
      var doc = this.indexdata
      Object.keys(doc).forEach(function (field) {
        if (field.startsWith('dc_description_')) {
          for (var i = 0; i < doc[field].length; i++) {
            descriptions.push({ value: doc[field][i], lang: field.substr(field.length - 3) })
          }
        }
      })
      return descriptions
    },
    parsedRolesUwm: function () {
      var rolesHash = {}
      if (this.indexdata.uwm_roles_json) {
        var sortedContr = JSON.parse(this.indexdata.uwm_roles_json).sort(function (a, b) {
          return a.data_order - b.data_order
        })
        for (var i = 0; i < sortedContr.length; i++) {
          sortedContr[i].entities = sortedContr[i].entities.sort(function (a, b) {
            return a.data_order - b.data_order
          })
          // merge multiple entities and multiple contributions if they have the same role
          if (!rolesHash[sortedContr[i].role]) {
            rolesHash[sortedContr[i].role] = {
              role: sortedContr[i].role,
              label: sortedContr[i].role === 'aut' ? this.$t('Author') : this.$t(this.$store.state.search.marcRoles[sortedContr[i].role]),
              entities: []
            }
          }
          for (var j = 0; j < sortedContr[i].entities.length; j++) {
            rolesHash[sortedContr[i].role]['entities'].push(sortedContr[i].entities[j])
          }
        }
      }
      var roles = []
      Object.keys(rolesHash).forEach(function (r) {
        roles.push(rolesHash[r])
      })
      return roles
    }
  }
}
</script>
