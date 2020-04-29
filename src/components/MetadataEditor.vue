<template>

  <p-i-form
    :form="form"
    :targetpid="pid"
    :enablerights="false"
    :enablerelationships="false"
    :templating="false"
    :importing="false"
    :addbutton="true"
    :help="true"
    :debug="false"
    :feedback="false"
    :guidelines-url="'https://static.phaidra-sandbox.univie.ac.at/guidelines/3.5.5Guidelinespicture_borndigital_'"
    :validate="validate"
    v-on:object-saved="objectSaved($event)"
  ></p-i-form>

</template>

<script>
import jsonLd from 'phaidra-vue-components/src/utils/json-ld'
// import { formvalidation } from '../mixins/formvalidation'
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'metadata-editor',
  mixins: [ context, config ],
  data () {
    return {
      loading: false,
      form: {},
      parentpid: ''
    }
  },
  computed: {
    pid: function () {
      return this.$route.params.pid
    }
  },
  methods: {
    validate: function () {
      return true
    },
    objectSaved: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Metadata for object ' + event + ' saved' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    loadJsonld: async function (self, pid) {
      self.loading = true
      try {
        let response = await self.$http.request({
          method: 'GET',
          url: self.$store.state.instanceconfig.api + '/object/' + pid + '/metadata',
          params: {
            mode: 'resolved'
          }
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          self.$store.commit('setAlerts', response.data.alerts)
        }
        if (response.data.metadata['JSON-LD']) {
          self.form = this.json2form(response.data.metadata['JSON-LD'])
        }
      } catch (error) {
        console.log(error)
      } finally {
        self.loading = false
      }
    },
    json2form: function (jsonld) {
      return jsonLd.json2form(jsonld)
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.parentpid = from.params.pid
      vm.loadJsonld(vm, to.params.pid).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.parentpid = from.params.pid
    this.loadJsonld(this, to.params.pid).then(() => {
      next()
    })
  }
}
</script>
