<template>
  <v-container>
    <v-row>
      <v-col>
        <p-i-form
          :form="form"
          :rights="rights"
          :enablerights="true"
          :addbutton="true"
          :templating="true"
          :validate="validate"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:input-rights="rights = $event"
        ></p-i-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'submit-custom',
  mixins: [ context, config ],
  data () {
    return {
      form: {},
      rights: {},
      templateid: null
    }
  },
  methods: {
    validate: function () {
      return true
    },
    objectCreated: function (event) {
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    loadTemplate: async function (self) {
      self.loading = true
      try {
        let response = await self.$http.request({
          method: 'GET',
          url: self.instanceconfig.api + '/jsonld/template/' + self.templateid,
          headers: {
            'X-XSRF-TOKEN': self.user.token
          }
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          self.$store.commit('setAlerts', response.data.alerts)
        }
        self.form = response.data.template.form
      } catch (error) {
        console.log(error)
        self.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
      } finally {
        self.loading = false
      }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.templateid = to.params.templateid
      vm.loadTemplate(vm).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.templateid = to.params.templateid
    this.loadTemplate(this).then(() => {
      next()
    })
  }
}
</script>
