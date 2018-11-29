<template>
  <v-flex>
    <v-layout>
      <v-flex class="primary--text" xs3>{{ $t(p) }}</v-flex>
      <v-flex xs9>{{ resolve(p, o) }}</v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'p-d-uri',
  props: {
    o: {
      type: String,
      required: true
    },
    p: {
      type: String
    }
  },
  data () {
    return {
      langCode2to3: {
        'en': 'eng',
        'de': 'deu',
        'it': 'ita'
      }
    }
  },
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  methods: {
    resolve: function (p, v) {
      var vocabulary = ''
      switch (p) {

        case 'dcterms:language':
          vocabulary = 'http://id.loc.gov/vocabulary/iso639-2'
          break

        case 'dcterms:type':
          vocabulary = 'http://purl.org/coar/resource_type'
          break

        case 'edm:rights':
          vocabulary = 'licenses'
          break

        case 'ebucore:hasMimeType':
          vocabulary = 'mime-types'
          break

        default:
          console.error('p-d-uri resolve: unrecognized predicate ', p, v)
      }

      return this.getTerm(vocabulary, v)
    },
    getTerm: function (vocabulary, value) {
      for (var i = 0; i < this.vocabularies[vocabulary].terms.length; i++) {
        if (this.vocabularies[vocabulary].terms[i]['@id'] === value) {
          var termLabels = this.vocabularies[vocabulary].terms[i]['skos:prefLabel']
          for (var j = 0; j < termLabels.length; j++) {
            if (termLabels[j]['@language'] === this.langCode2to3[this.$i18n.locale]) {
              return termLabels[j]['@value']
            }
          }
          return termLabels[0]['@value']
        }
      }
    }
  }
}
</script>

