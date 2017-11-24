<template>

  <v-container fluid>

    <v-layout column >

      <v-flex>
        {{ doc.dc_title[0] }}
      </v-flex>
      <v-btn :href="config.api + '/object/' + doc.pid + '/diss/Content/get'" flat>{{ $t('View') }}</v-btn>
      <v-btn :href="config.api + '/object/' + doc.pid + '/diss/Content/download'" flat>{{ $t('Download') }}</v-btn>
      <v-flex>
        <router-link :to="{ name: 'search' }">{{ $t('Back') }}</router-link>
      </v-flex>

    </v-layout>

  </v-container>

</template>

<script>

export default {
  name: 'detail',
  computed: {
    doc: function () {
      return this.$store.state.object.doc
    },
    config () {
      return this.$store.state.config
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.$store.dispatch('loadDoc', to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.$store.dispatch('loadDoc', to.params.pid).then(() => {
      next()
    })
  },
  created: function () {
    this.$store.commit('setDoc', null)
    this.$store.dispatch('loadDoc', this.$route.params.pid)
  }
}
</script>

<style scoped>


</style>
