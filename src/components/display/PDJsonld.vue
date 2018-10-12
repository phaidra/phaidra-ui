<template>
  <v-container>
    <p-d-jsonld-layout>
      <template v-for="(o, p) in objectjson" class="mt-3">

        <template v-if="p==='dce:title'" slot="dce:title">
          <p-d-title :o="t" v-for="(t, j) in o" :key="'title'+j"></p-d-title>
        </template>

        <template v-else-if="p.startsWith('role:')" slot="role">
          <p-d-entity :role="p" :entity="e" v-for="(e, j) in o" :key="'entity'+j" ></p-d-entity>
        </template>

        <template v-else-if="p==='bf:note'" slot="bf:note">
          <p-d-text-field :p="p" :o="item" v-for="(item, j) in o" :key="'text'+j" ></p-d-text-field>
        </template>

        <template v-else-if="p==='dce:subject'" slot="dce:subject">
          <p-d-text-field :p="p" :o="item" v-for="(item, j) in o" :key="'subject'+j" ></p-d-text-field>
        </template>

        <template v-else-if="p==='opaque:ethnographic'" slot="dce:subject">
          <p-d-text-field :p="p" :o="item" v-for="(item, j) in o" :key="'et'+j" ></p-d-text-field>
        </template>

        <template v-else-if="p==='dcterms:language'" slot="dcterms:language">
          <p-d-uri :p="p" :o="item" v-for="(item, j) in o" :key="'lan'+j" ></p-d-uri>
        </template>

        <template v-else-if="p==='dcterms:type'" slot="dcterms:type">
          <p-d-uri :p="p" :o="item" v-for="(item, j) in o" :key="'type'+j" ></p-d-uri>
        </template>

        <template v-else-if="p==='frapo:hasFundingAgency'" slot="frapo:hasFundingAgency">
          <p-d-funder :p="p" :o="item" v-for="(item, j) in o" :key="'funder'+j" ></p-d-funder>
        </template>

        <template v-else-if="p==='frapo:isOutputOf'" slot="frapo:isOutputOf">
          <p-d-project :p="p" :o="item" v-for="(item, j) in o" :key="'project'+j" ></p-d-project>
        </template>

        <template v-else-if="p==='dcterms:subject'" slot="phaidra:Subject">
          <template v-for="(subject, j) in o">
            <p-d-jsonld v-if="subject['@type']==='phaidra:Subject'" :jsonld="subject" :key="'psubject'+j"></p-d-jsonld>
            <p-d-text-field v-else :p="p" :o="subject" :key="'subject'+j" ></p-d-text-field>
          </template>
        </template>

        <template v-else-if="p==='phaidra:digitizedObject'" slot="phaidra:digitizedObject">
          <p-d-jsonld :jsonld="o" :key="p"></p-d-jsonld>
        </template>

        <template v-else-if="p==='@type'"></template>

        <template v-else slot="unknown-predicate">
          <v-container :key="p">
            <v-alert :type="'error'" :value="true" transition="fade-transition">Uknown predicate <b>{{p}}</b></v-alert>
          </v-container>
        </template>
      </template>
    </p-d-jsonld-layout>
  </v-container>
</template>

<script>
import PDLicense from '@/components/display/PDLicense'
import PDTitle from '@/components/display/PDTitle'
import PDTextField from '@/components/display/PDTextField'
import PDEntity from '@/components/display/PDEntity'
import PDUri from '@/components/display/PDUri'
import PDFunder from '@/components/display/PDFunder'
import PDProject from '@/components/display/PDProject'
import PDJsonldLayout from '@/components/display/PDJsonldLayout'

export default {

  name: 'p-d-jsonld',
  props: {
    pid: {
      type: String
    },
    jsonld: {
      type: Object,
      default: null
    }
  },
  components: {
    PDTitle,
    PDLicense,
    PDEntity,
    PDJsonldLayout,
    PDTextField,
    PDUri,
    PDFunder,
    PDProject
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
    objectjson: function () {
      if (this.pid) {
        if (this.$store.state.object.metadata) {
          return this.$store.state.object.metadata['JSON-LD']
        }
      } else {
        return this.jsonld
      }
    },
    instance () {
      return this.$store.state.settings.instance
    }
  },
  mounted: function () {
    this.$store.dispatch('loadRoles')
    if (this.pid) {
      this.$store.dispatch('loadMetadata', this.pid)
    }
  }
}
</script>
