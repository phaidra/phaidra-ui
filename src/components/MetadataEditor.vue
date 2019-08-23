<template>

  <p-i-form
    :form="editform"
    :targetpid="pid"
    :templating="false"
    v-on:object-saved="objectSaved($event)"
  ></p-i-form>

</template>

<script>
import jsonLd from 'phaidra-vue-components/src/utils/json-ld'
import { context } from '../mixins/context'
import { config } from '../mixins/config'

export default {
  name: 'metadata-editor',
  mixins: [ context, config ],
  data () {
    return {
      editform: {},
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
    loadJsonld (self, pid) {
      var url = self.instanceconfig.api + '/object/' + pid + '/metadata?mode=resolved'
      var promise = fetch(url, {
        method: 'GET',
        mode: 'cors'
      })
        .then(function (response) { return response.json() })
        .then(function (json) {
          self.editform = self.json2form(json.metadata['JSON-LD'])
        })
        .catch(function (error) {
          console.log(error)
        })

      return promise
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
