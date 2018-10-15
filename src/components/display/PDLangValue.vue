<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="caption grey--text" xs2>{{ $t(p) }}<template v-if="o['@language']"> ({{ o['@language'] }})</template></v-flex>
      <v-flex xs9>{{ o['@value'] }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'p-d-lang-value',
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

