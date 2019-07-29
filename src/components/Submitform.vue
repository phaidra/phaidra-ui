<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
      </v-flex>
      <v-flex>
        <p-i-form
          :form="form"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:form-input-p-select="handleSelect($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
        ></p-i-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'submitform',
  computed: {
    breadcrumbs: function () {
      let bc = [
        {
          text: this.$t('Submit'),
          to: { name: 'submit', path: '/' }
        },
        {
          text: this.$t(this.cmodel.text),
          disabled: true
        }
      ]
      return bc
    },
    cmodelparam: function () {
      return this.$route.params.cmodel
    },
    cmodel: function () {
      for (let cm of this.contentmodels) {
        if (cm.cmodelparam === this.cmodelparam) {
          return cm
        }
      }
      return { text: '' }
    }
  },
  data () {
    return {
      contentmodels: [
        {
          text: 'Data',
          cmodelparam: 'data',
          value: 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
        },
        {
          text: 'Picture',
          cmodelparam: 'image',
          value: 'https://pid.phaidra.org/vocabulary/44TN-P1S0'
        },
        {
          text: 'Audio',
          cmodelparam: 'audio',
          value: 'https://pid.phaidra.org/vocabulary/8YB5-1M0J'
        },
        {
          text: 'Video',
          cmodelparam: 'video',
          value: 'https://pid.phaidra.org/vocabulary/B0Y6-GYT8'
        },
        {
          text: 'Document',
          cmodelparam: 'document',
          value: 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'
        },
        {
          text: 'Resource',
          cmodelparam: 'resource',
          value: 'https://pid.phaidra.org/vocabulary/8MY0-BQDQ'
        }
      ],
      form: { sections: [] }
    }
  },
  methods: {
    objectCreated: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    }
  }
}
</script>

<style scoped>

</style>
