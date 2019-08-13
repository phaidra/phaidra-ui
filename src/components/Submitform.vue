<template>
  <v-container>
    <v-layout column>
      <v-flex>
        <p-i-form
          :form="form"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
        ></p-i-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'
import { context } from '../mixins/context'
import { cmodels } from '../utils/cmodels'

export default {
  name: 'submitform',
  mixins: [ context ],
  computed: {
    cmodelparam: function () {
      return this.$route.params.cmodel
    },
    submitformparam: function () {
      return this.$route.params.submitform
    },
    cmodel: function () {
      for (let cm of this.cmodels) {
        if (cm.cmodelparam === this.cmodelparam) {
          return cm
        }
      }
      return { text: '' }
    }
  },
  data () {
    return {
      form: { sections: [] },
      cmodels
    }
  },
  methods: {
    objectCreated: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    initForm: function () {
      this.form = { sections: [] }
      switch (this.cmodelparam) {
        case 'picture':
          switch (this.submitformparam) {
            case 'digital':
              let arr = []

              let rtf = fields.getField('resource-type')
              rtf.value = this.cmodel.value
              arr.push(rtf)

              let otf = fields.getField('object-type')
              // TODO: filter
              arr.push(otf)

              arr.push(fields.getField('title'))

              arr.push(fields.getField('role'))

              arr.push(fields.getField('description'))

              arr.push(fields.getField('note'))

              let crdate = fields.getField('date-edtf')
              crdate.type = 'dcterms:created'
              arr.push(crdate)

              let crplace = fields.getField('spatial-getty')
              crplace.type = 'vra:placeOfCreation'
              arr.push(crplace)

              arr.push(fields.getField('keyword'))

              arr.push(fields.getField('gnd-subject'))

              arr.push(fields.getField('temporal-coverage'))

              let tcdate = fields.getField('date-edtf')
              tcdate.type = 'dcterms:temporal'
              arr.push(tcdate)

              let spplace = fields.getField('spatial-getty')
              spplace.type = 'dcterms:spatial'
              arr.push(spplace)

              this.form.sections.push({
                title: 'General',
                type: 'digitalobject',
                disablemenu: true,
                id: 1,
                fields: arr
              })

              let filearr = []

              filearr.push(fields.getField('file'))

              let mime = fields.getField('mime-type')
              // TODO: filter
              filearr.push(mime)

              filearr.push(fields.getField('license'))

              filearr.push(fields.getField('rights'))

              this.form.sections.push({
                title: 'File',
                type: 'file',
                disablemenu: true,
                id: 2,
                fields: filearr
              })
              break
            default:
              console.error('bad submitform param: [' + this.submitformparam + ']')
              break
          }
          break

        default:
          console.error('bad cmodel param: [' + this.cmodelparam + ']')
          break
      }
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.initForm()
      next()
    })
  },
  beforeRouteUpdate: function (to, from, next) {
    this.initForm()
    next()
  }
}
</script>

<style scoped>

</style>
