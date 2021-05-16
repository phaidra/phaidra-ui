<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <v-card tile>
          <v-card-title class="title font-weight-light grey white--text">{{ $t('Terms of use') }}</v-card-title>
          <v-card-text style="white-space: pre-wrap;">{{ tou }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { config } from '../mixins/config'

export default {
  name: 'terms-of-use',
  mixins: [ config ],
  data () {
    return {
      loading: false,
      tou: ''
    }
  },
  created: async function () {
    let toures = await this.$http.get(this.instanceconfig.api + '/termsofuse')
    if (toures.data.alerts && toures.data.alerts.length > 0) {
      this.$store.commit('setAlerts', toures.data.alerts)
    }
    this.tou = toures.data.terms
  }
}
</script>
