<template>
  <p-i-form-uwm
    :form="editform"
    :targetpid="this.pid"
    v-on:object-saved="objectSaved($event)"
    v-on:load-form="editform = $event"
  ></p-i-form-uwm>
</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'metadata-editor',
  mixins: [ context, config ],
  data () {
    return {
      loading: false,
      editform: [],
      parentpid: ''
    }
  },
  computed: {
    pid: function () {
      return this.$route.params.pid
    }
  },
  methods: {
    objectSaved: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Metadata for object ' + event + ' saved' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    loadUwmetadata: async function (self, pid) {
      self.loading = true
      try {
        let response = await self.$http.request({
          method: 'GET',
          url: self.$store.state.instanceconfig.api + '/object/' + pid + '/metadata',
          params: {
            mode: 'full'
          }
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          self.$store.commit('setAlerts', response.data.alerts)
        }
        if (response.data.metadata['uwmetadata']) {
          self.editform = response.data.metadata['uwmetadata']
        }
      } catch (error) {
        console.log(error)
      } finally {
        self.loading = false
      }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.parentpid = from.params.pid
      vm.loadUwmetadata(vm, to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.parentpid = from.params.pid
    this.loadUwmetadata(this, to.params.pid).then(() => {
      next()
    })
  }
}
</script>
