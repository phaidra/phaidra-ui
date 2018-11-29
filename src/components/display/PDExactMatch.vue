<template>
  <v-flex>
    <v-layout>
      <v-flex class="primary--text" xs3>{{ $t(p) }}</v-flex>
      <v-flex xs9>{{ resolve(p, o['skos:exactMatch']) }}</v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'p-d-exact-match',
  props: {
    o: {
      type: Object,
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

        case 'vra:hasInscription':
          vocabulary = 'https://phaidra.org/vocabulary/stamp'
          break

        default:
          console.error('p-d-exact-match resolve: unrecognized predicate ', p, v)
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

