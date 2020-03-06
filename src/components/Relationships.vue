<template>
  <v-row>
    <v-col v-if="signedin">
      <p-m-relationships :pid="pid"></p-m-relationships>
    </v-col>
  </v-row>
</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'relationships',
  mixins: [ context ],
  computed: {
    pid () {
      return this.$route.params.pid
    }
  }
}
</script>
