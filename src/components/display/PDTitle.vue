<template>
  <v-container fluid>
    <v-layout row>
      <v-flex class="caption grey--text" xs2>{{ $t('Title') }} ({{ o['bf:mainTitle']['@language'] }})</v-flex>
      <v-flex xs9>{{ o['bf:mainTitle']['@value'] }}</v-flex>
    </v-layout>
    <v-layout v-if="o['bf:subtitle']" row>
      <v-flex class="caption grey--text" xs2>{{ $t('Subtitle') }} ({{ o['bf:subtitle']['@language'] }})</v-flex>
      <v-flex xs9>{{ o['bf:subtitle']['@value'] }}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'p-d-title',
  props: {
    o: {
      type: Object,
      required: true
    }
  }
}
</script>

