<template>
  <v-container>
    <p-d-jsonld-layout>
      <template v-for="(o, p) in objectjson" >

        <template v-if="p==='dce:title'" slot="dce:title">
          <p-d-title :o="t" v-for="(t, j) in o" :key="'title'+j"></p-d-title>
        </template>

        <template v-else-if="p.startsWith('role:')" slot="role">
          <p-d-entity :role="p" :entity="e" v-for="(e, j) in o" :key="'entity'+j" ></p-d-entity>
        </template>

        <template v-else-if="p==='bf:note'" slot="bf:note">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'text'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='dce:subject'" slot="dce:subject">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'subject'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='opaque:ethnographic'" slot="dce:subject">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'et'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='dcterms:language'" slot="dcterms:language">
          <p-d-uri :p="p" :o="item" v-for="(item, j) in o" :key="'lan'+j" ></p-d-uri>
        </template>

        <template v-else-if="p==='dcterms:type'" slot="dcterms:type">
          <p-d-uri :p="p" :o="item" v-for="(item, j) in o" :key="'type'+j" ></p-d-uri>
        </template>

        <template v-else-if="p==='dcterms:issued'" slot="dcterms:issued">
          <p-d-value :p="p" :o="item" v-for="(item, j) in o" :key="'issued'+j" ></p-d-value>
        </template>

        <template v-else-if="p==='edm:rights'" slot="edm:type">
          <p-d-license :dclicense="item" :key="p"></p-d-license>
        </template>

        <template v-else-if="p==='dce:rights'" slot="dce:rights">
          <p-d-lang-value :p="p" :o="item" v-for="(item, j) in o" :key="'type'+j" ></p-d-lang-value>
        </template>

        <template v-else-if="p==='frapo:isOutputOf'" slot="frapo:isOutputOf">
          <p-d-project :p="p" :o="item" v-for="(item, j) in o" :key="'project'+j" ></p-d-project>
        </template>

        <template v-else-if="p==='frapo:hasFundingAgency'" slot="frapo:hasFundingAgency">
          <p-d-funder :p="p" :o="item" v-for="(item, j) in o" :key="'funder'+j" ></p-d-funder>
        </template>

        <template v-else-if="p==='opaque:ethnographic'" slot="dce:subject">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'et'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='bf:physicalLocation'" slot="bf:physicalLocation">
          <p-d-lang-value :p="p" :o="item" v-for="(item, j) in o" :key="'physloc'+j" ></p-d-lang-value>
        </template>

        <template v-else-if="p==='bf:shelfMark'" slot="bf:shelfMark">
          <p-d-value :p="p" :o="item" v-for="(item, j) in o" :key="'callnr'+j" ></p-d-value>
        </template>

        <template v-else-if="p==='schema:temporalCoverage'" slot="schema:temporalCoverage">
          <p-d-lang-value :p="p" :o="item" v-for="(item, j) in o" :key="'temporal'+j" ></p-d-lang-value>
        </template>

        <template v-else-if="p==='dcterms:spatial'" slot="dcterms:spatial">
          <p-d-georeference :p="p" :o="item" v-for="(item, j) in o" :key="'geo'+j" ></p-d-georeference>
        </template>

        <template v-else-if="p==='dcterms:provenance'" slot="dcterms:provenance">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'prov'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='opaque:cco_accessionNumber'" slot="opaque:cco_accessionNumber">
          <p-d-value :p="p" :o="item" v-for="(item, j) in o" :key="'accnr'+j" ></p-d-value>
        </template>

        <template v-else-if="p==='vra:hasInscription'" slot="vra:hasInscription">
          <p-d-rdfs-label v-if="item['skos:prefLabel']" :p="p" :o="item" v-for="(item, j) in o" :key="'inscr'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='vra:material'" slot="vra:material">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'material'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='vra:hasTechnique'" slot="vra:hasTechnique">
          <p-d-rdfs-label :p="p" :o="item" v-for="(item, j) in o" :key="'techn'+j" ></p-d-rdfs-label>
        </template>

        <template v-else-if="p==='schema:width'" slot="schema:width">
          <p-d-dimension :p="p" :o="item" v-for="(item, j) in o" :key="'width'+j" ></p-d-dimension>
        </template>

        <template v-else-if="p==='schema:height'" slot="schema:height">
          <p-d-dimension :p="p" :o="item" v-for="(item, j) in o" :key="'height'+j" ></p-d-dimension>
        </template>

        <template v-else-if="p==='schema:depth'" slot="schema:depth">
          <p-d-dimension :p="p" :o="item" v-for="(item, j) in o" :key="'depth'+j" ></p-d-dimension>
        </template>

        <template v-else-if="p==='schema:weight'" slot="schema:weight">
          <p-d-dimension :p="p" :o="item" v-for="(item, j) in o" :key="'weight'+j" ></p-d-dimension>
        </template>

        <template v-else-if="p==='ebucore:filename'" slot="ebucore:filename">
          <p-d-value :p="p" :o="o" :key="p" ></p-d-value>
        </template>

        <template v-else-if="p==='ebucore:hasMimeType'" slot="ebucore:hasMimeType">
          <p-d-value :p="p" :o="o" :key="p"></p-d-value>
        </template>

        <template v-else-if="p==='dcterms:subject'" slot="phaidra:Subject">
          
          <template v-for="(subject, j) in o">
            <v-card flat v-if="subject['@type']==='phaidra:Subject'" :key="'psubject'+j" class="ma-3">
              <h3 class="display-2 grey--text">Subject</h3>
              <v-card-text class="ma-2"><p-d-jsonld  :jsonld="subject" ></p-d-jsonld></v-card-text>
            </v-card>
            <p-d-rdfs-label v-else :p="p" :o="subject" :key="'subject'+j" ></p-d-rdfs-label>
          </template>
            
        </template>

        <template v-else-if="p==='prov:wasDerivedFrom'" slot="prov:wasDerivedFrom">
          <v-card flat :key="p" class="ma-3">
            <h3 class="display-2 grey--text">Digitized object</h3>
            <v-card-text class="ma-2"><p-d-jsonld :jsonld="o" :key="p"></p-d-jsonld></v-card-text>
          </v-card>
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
import PDRdfsLabel from '@/components/display/PDRdfsLabel'
import PDLangValue from '@/components/display/PDLangValue'
import PDValue from '@/components/display/PDValue'
import PDDimension from '@/components/display/PDDimension'
import PDGeoreference from '@/components/display/PDGeoreference'
import PDEntity from '@/components/display/PDEntity'
import PDUri from '@/components/display/PDUri'
import PDExactMatch from '@/components/display/PDExactMatch'
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
    PDRdfsLabel,
    PDLangValue,
    PDValue,
    PDDimension,
    PDGeoreference,
    PDUri,
    PDExactMatch,
    PDFunder,
    PDProject
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
    },
    loadMetadata: function (pid) {
      var self = this
      var url = self.$store.state.settings.instance.api + '/object/' + pid + '/metadata?mode=resolved'
      var promise = fetch(url, {
        method: 'GET',
        mode: 'cors'
      })
      .then(function (response) { return response.json() })
      .then(function (json) {
        self.metadata = json.metadata
      })
      .catch(function (error) {
        console.log(error)
      })

      return promise
    }
  },
  data () {
    return {
      metadata: []
    }
  },
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    },
    objectjson: function () {
      if (this.pid) {
        if (this.metadata) {
          return this.metadata['JSON-LD']
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
      this.loadMetadata(this.pid)
    }
  }
}
</script>
