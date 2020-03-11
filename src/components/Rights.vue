<template>
  <v-row>
    <v-col v-if="signedin">
      <p-m-rights :pid="pid"></p-m-rights>
    </v-col>
  </v-row>
</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'rights',
  mixins: [ context ],
  computed: {
    pid () {
      return this.$route.params.pid
    }
  }
}
</script>
