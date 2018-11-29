<template>
  <v-flex>
    <v-layout v-if="entity" row>
      <v-flex class="primary--text" xs3>{{ getRoleLabel(this.role) }}</v-flex>
      <v-flex xs9>
        <v-layout column>
          <v-flex>
            {{ entity['schema:givenName']['@value'] }} {{ entity['schema:familyName']['@value'] }} <span v-if="entity['schema:affiliation']" class="grey--text">{{ entity['schema:affiliation']['schema:name']['@value'] }}</span>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'p-d-entity',
  props: {
    entity: {
      type: Object,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  methods: {
    getRoleLabel: function (role) {
      var id = role.substring(role.indexOf(':') + 1)
      var roleTerms = this.vocabularies['https://phaidra.org/vocabulary/role'].terms
      for (var i = 0; i < roleTerms.length; i++) {
        if (roleTerms[i]['@id'] === id) {
          return roleTerms[i]['skos:prefLabel'][0]['@value']
        }
      }
    }
  },
  mounted: function () {
    this.$store.dispatch('loadRoles')
  }
}
</script>

