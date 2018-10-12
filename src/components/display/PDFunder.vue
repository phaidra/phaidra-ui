<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="caption grey--text" xs2>{{ $t('Funder') }} ({{ o['rdfs:label']['@language'] }})</v-flex>
      <v-flex xs9>{{ o['rdfs:label']['@value'] }} <template v-if="o['skos:exactMatch']">[<template v-for="id in o['skos:exactMatch']">{{ id }}</template>]</template></v-flex>
    </v-layout>
    <v-layout v-if="o['bf:subtitle']" row>
      <v-flex class="caption grey--text" xs2>{{ $t('Subtitle') }} ({{ o['bf:subtitle']['@language'] }})</v-flex>
      <v-flex xs9>{{ o['bf:subtitle']['@value'] }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'p-d-funder',
  props: {
    o: {
      type: Object,
      required: true
    }
  }
}
</script>

