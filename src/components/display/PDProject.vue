<template>
  <v-flex>
    <v-layout row>
      <v-flex class="primary--text" xs3>{{ $t('Project') }} ({{ o['skos:prefLabel']['@language'] }})</v-flex>
      <v-flex v-if="o['skos:prefLabel']" xs9>{{ o['skos:prefLabel']['@value'] }} <template v-if="o['skos:exactMatch']">[<template v-for="id in o['skos:exactMatch']">{{ id }}</template>]</template></v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="primary--text" xs3>{{ $t('Project description') }} ({{ o['rdfs:comment']['@language'] }})</v-flex>
      <v-flex xs9>{{o['rdfs:comment']['@value']}}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex class="primary--text" xs3>{{ $t('Project homepage') }}</v-flex>
      <v-flex xs9>{{ o['foaf:homepage'] }}</v-flex>
    </v-layout>
  </v-flex>
</template>

<script>
export default {
  name: 'p-d-project',
  props: {
    o: {
      type: Object,
      required: true
    }
  }
}
</script>

