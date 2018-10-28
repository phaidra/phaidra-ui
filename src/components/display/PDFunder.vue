<template>
  <v-flex>
    <v-layout row>
      <v-flex class="primary--text" xs3>{{ $t('Funder') }} ({{ o['rdfs:label']['@language'] }})</v-flex>
      <v-flex xs9>{{ o['rdfs:label']['@value'] }} <template v-if="o['skos:exactMatch']">[<template v-for="id in o['skos:exactMatch']">{{ id }}</template>]</template></v-flex>
    </v-layout>
  </v-flex>
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

