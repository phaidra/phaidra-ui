<template>
  <v-card flat>
    <v-card-text>
      <v-col cols="12">
        <v-container>
          <p-i-file
            v-bind.sync="fileField"
            v-on:input-file="file = $event"
            v-on:input-mimetype="mimetype = $event"
            input-style="outlined"
          ></p-i-file>
        </v-container>
        <p-i-form-uwm
          :form="form"
          v-on:object-saved="objectSaved($event)"
          v-on:load-form="editform = $event"
        ></p-i-form-uwm>
      </v-col>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="primary mr-8" @click="save()">{{ $t('Submit') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '../mixins/context'
import { config } from '../mixins/config'
import { vocabulary } from 'phaidra-vue-components/src/mixins/vocabulary'

export default {
  name: 'submit-uwm',
  mixins: [ config, context, vocabulary ],
  data () {
    return {
      loading: false,
      form: [],
      cmodel: 'unknown',
      file: null,
      mimetype: 'application/octet-stream',
      fileField: fields.getField('file')
    }
  },
  methods: {
    objectSaved: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    loadUwmetadata: async function (self) {
      self.loading = true
      try {
        let response = await self.$http.request({
          method: 'GET',
          url: self.instanceconfig.api + '/uwmetadata/tree',
          params: {
            mode: 'full'
          }
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          self.$store.commit('setAlerts', response.data.alerts)
        }
        if (response.data.tree) {
          self.form = response.data.tree
        }
      } catch (error) {
        console.log(error)
      } finally {
        self.loading = false
      }
    },
    getMetadata: function () {
      let md = { metadata: { 'uwmetadata': this.form } }
      return md
    },
    save: async function () {
      this.loading = true
      var httpFormData = new FormData()
      httpFormData.append('metadata', JSON.stringify(this.getMetadata()))
      httpFormData.append('file', this.file)
      try {
        let response = await this.$http.request({
          method: 'POST',
          url: this.instanceconfig.api + '/' + this.cmodel + '/create',
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-XSRF-TOKEN': this.user.token
          },
          data: httpFormData
        })
        if (response.data.alerts && response.data.alerts.length > 0) {
          if (response.data.status === 401) {
            response.data.alerts.push({ type: 'danger', msg: 'Please log in' })
          }
          this.$store.commit('setAlerts', response.data.alerts)
        }
        if (response.data.status === 200) {
          if (response.data.pid) {
            this.$emit('object-saved', this.targetpid)
          }
        }
      } catch (error) {
        console.log(error)
        this.$store.commit('setAlerts', [{ type: 'danger', msg: error }])
      } finally {
        this.$vuetify.goTo(0)
        this.loading = false
      }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.loadUwmetadata(vm).then(() => {
        next()
      })
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.loadUwmetadata(this).then(() => {
      next()
    })
  }
}
</script>
