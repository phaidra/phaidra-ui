<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="caption grey--text" xs2>{{ $t('Project') }} ({{ o['rdfs:label']['@language'] }})</v-flex>
      <v-flex v-if="o['rdfs:label']" xs9>{{ o['rdfs:label']['@value'] }} <template v-if="o['skos:exactMatch']">[<template v-for="id in o['skos:exactMatch']">{{ id }}</template>]</template></v-flex>
    </v-layout>
    <v-layout row>
      <v-flex offset-xs2 xs9>{{ $t('Description')}} ({{ o['rdfs:comment']['@language'] }}): {{o['rdfs:comment']['@value']}}</v-flex>
    </v-layout>
    <v-layout row>
      <v-flex offset-xs2 xs9>{{ $t('Homepage') }}: {{ o['foaf:homepage'] }}</v-flex>
    </v-layout>
  </v-container>
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

