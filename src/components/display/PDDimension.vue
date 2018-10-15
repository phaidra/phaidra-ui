<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="caption grey--text" xs2>{{ $t(p) }}</v-flex>
      <v-flex xs9>{{ o['schema:value'] }} {{ getTerm(o['schema:unitCode']) }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'p-d-dimension',
  props: {
    o: {
      type: Object,
      required: true
    },
    p: {
      type: String
    }
  },
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  methods: {
    getTerm: function (value) {
      for (var i = 0; i < this.vocabularies['un-cefact'].terms.length; i++) {
        if (this.vocabularies['un-cefact'].terms[i]['@id'] === value) {
          return this.vocabularies['un-cefact'].terms[i]['rdfs:label'][0]['@value']
        }
      }
    }
  }
}
</script>

