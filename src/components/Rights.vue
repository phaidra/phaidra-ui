<template>
  <v-row>
    <v-col v-if="signedin && pid">
      <p-m-rights :pid="pid" :rights="rights" v-on:load-rights="loadRights()"></p-m-rights>
    </v-col>
  </v-row>
</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'rights',
  mixins: [ context, config ],
  computed: {
    pid () {
      return this.$route.params.pid
    }
  },
  data () {
    return {
      loading: false,
      rights: {}
    }
  },
  methods: {
    loadRights: async function (self) {
      if (!self) {
        self = this
      }
      self.loading = true
      try {
        let response = await self.$http.request({
          method: 'GET',
          url: self.instanceconfig.api + '/object/' + self.pid + '/rights',
          headers: {
            'X-XSRF-TOKEN': this.$store.state.user.token
          }
        })
        if (response.data.metadata.status === 200) {
          self.rights = response.data.metadata.rights
        } else {
          if (response.data.alerts && response.data.alerts.length > 0) {
            self.$store.commit('setAlerts', response.data.alerts)
          }
        }
      } catch (error) {
        console.log(error)
        // this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
      } finally {
        self.loading = false
      }
    }
  },
  beforeRouteEnter: async function (to, from, next) {
    next(async function (vm) {
      await vm.loadRights(vm)
    })
  },
  beforeRouteUpdate: async function (to, from, next) {
    await this.loadRights(this)
    next()
  }
}
</script>
