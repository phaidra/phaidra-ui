<template>
  <v-flex>
    <v-layout row>
      <v-flex class="primary--text" xs3>{{ $t(p) }}<template v-if="o['@language']"> ({{ o['@language'] }})</template></v-flex>
      <v-flex xs9>{{ o['@value'] }}</v-flex>
    </v-layout>
  </v-flex>
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

