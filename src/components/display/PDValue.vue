<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="caption grey--text" xs2>{{ $t(p) }}</v-flex>
      <v-flex xs9>{{ o }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'p-d-value',
  props: {
    o: {
      type: String,
      required: true
    },
    p: {
      type: String
    }
  }
}
</script>

