<template>
  <v-container>
    <v-row>
      <v-col>
        <h5>{{ $t("PHAIDRA_IS") }}</h5>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { context } from '../mixins/context'

export default {
  name: 'home',
  mixins: [ context ]
}
</script>

<style scoped>

</style>
