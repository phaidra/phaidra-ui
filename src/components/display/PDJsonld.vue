<template>

  <v-layout v-if="metadata" column>

    <v-flex v-for="(o, p, i) in jsonld" :key="'obj'+i" class="mt-3">
      <v-flex>{{p}}</v-flex>
      <p-d-title :o="t" v-for="(t, j) in o" :key="'obj'+j" v-if="p==='dce:title'"></p-d-title>

      <p-d-entity :role="p" :entity="e" v-for="(e, j) in o" :key="'obj'+j" v-if="p.startsWith('role:')"></p-d-entity>

    </v-flex>

  </v-layout>

</template>

<script>
import PDLicense from '@/components/display/PDLicense'
import PDTitle from '@/components/display/PDTitle'
import PDEntity from '@/components/display/PDEntity'

export default {

  name: 'p-d-jsonld',
  props: {
    pid: String,
    required: true
  },
  components: {
    PDTitle,
    PDLicense,
    PDEntity
  },
  methods: {
    getRoleLabel: function (role) {
      var id = role.substring(role.indexOf(':') + 1)
      var roleTerms = this.vocabularies['https://phaidra.org/vocabulary/role'].terms
      for (var i = 0; i < roleTerms.length; i++) {
        if (roleTerms[i]['@id'] === id) {
          return roleTerms[i]['rdfs:label'][0]['@value']
        }
      }
    }
  },
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    },
    metadata: function () {
      return this.$store.state.object.metadata
    },
    jsonld: function () {
      return this.$store.state.object.metadata['JSON-LD']
    },
    instance () {
      return this.$store.state.settings.instance
    }
  },
  mounted: function () {
    this.$store.dispatch('loadRoles')
    this.$store.dispatch('loadMetadata', this.pid)
  }
}
</script>
