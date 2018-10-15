<template>
  <v-container fluid>
    <template v-if="o['rdfs:label']">
      <v-layout row v-if="Array.isArray(o['rdfs:label'])">
        <template v-for="(l, i) in o['rdfs:label']">
          <v-flex class="caption grey--text" xs2 :key="'l'+i">{{ $t(p) }}<template v-if="l['@language']"> ({{ l['@language'] }})</template></v-flex>
          <v-flex xs9 :key="'t'+i">{{ l['@value'] }}</v-flex>
        </template>
      </v-layout>
      <v-layout v-else row>
        <v-flex class="caption grey--text" xs2>{{ $t(p) }}<template v-if="o['rdfs:label']['@language']"> ({{ o['rdfs:label']['@language'] }})</template></v-flex>
        <v-flex xs9>{{ o['rdfs:label']['@value'] }}</v-flex>
      </v-layout>
    </template>
    <template v-if="o['skos:prefLabel']">
      <v-layout row v-if="Array.isArray(o['skos:prefLabel'])">
        <template v-for="(l, i) in o['skos:prefLabel']">
          <v-flex class="caption grey--text" xs2 :key="'l'+i">{{ $t(p) }}<template v-if="l['@language']"> ({{ l['@language'] }})</template></v-flex>
          <v-flex xs9 :key="'t'+i">{{ l['@value'] }}</v-flex>
        </template>
      </v-layout>
      <v-layout v-else row>
        <v-flex class="caption grey--text" xs2>{{ $t(p) }}<template v-if="o['skos:prefLabel']['@language']"> ({{ o['skos:prefLabel']['@language'] }})</template></v-flex>
        <v-flex xs9>{{ o['skos:prefLabel']['@value'] }}</v-flex>
      </v-layout>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'p-d-georeference',
  props: {
    o: {
      type: Object,
      required: true
    },
    p: {
      type: String
    }
  }
}
</script>

