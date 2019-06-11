<template>

  <v-container>
    <v-layout column>
      <v-flex>
        <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      </v-flex>
      <v-flex >
        <p-i-form
          :form="editform"
          :targetpid="pid"
          :templating="false"
          v-on:object-saved="objectSaved($event)"
        ></p-i-form>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
import jsonLd from 'phaidra-vue-components/src/utils/json-ld'

export default {
  name: 'metadata-editor',
  data () {
    return {
      editform: {},
      parentpid: ''
    }
  },
  computed: {
    breadcrumbs: function () {
      let bc = [
        {
          text: this.$t('Search'),
          to: { name: 'search', path: '/' }
        },
        {
          text: this.$t('Detailpage') + ' ' + this.parentpid,
          to: { name: 'detail', params: { pid: this.parentpid } }
        },
        {
          text: this.$t('Edit metadata') + ' ' + this.$route.params.pid,
          disabled: true,
          to: { name: 'manage', params: { pid: this.$route.params.pid } }
        }
      ]
      return bc
    },
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
      var url = self.$store.state.settings.instance.api + '/object/' + pid + '/metadata?mode=resolved'
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
