<template>
  <v-container grid-list-lg class="ksa-submit" >

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Submit</v-toolbar-title>
        <v-divider class="mx-3" inset vertical></v-divider>
        <v-select
          :items="contentmodels"
          v-model="contentmodel"
          label="Object type"
          single-line
          v-on:change="resetForm()"
        ></v-select>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <p-i-form :mode="'submit'" :submitform="form" :contentmodel="contentmodel" v-on:object-created="objectCreated($event)"></p-i-form>
      </v-card-text>
    </v-card>

  </v-container>
 
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'

export default {
  name: 'submit-ksa-container',
  data () {
    return {
      contentmodel: 'picture',
      contentmodels: [
        { text: 'Data', value: 'unknown' },
        { text: 'Picture', value: 'picture' },
        { text: 'Audio', value: 'audio' },
        { text: 'Viedo', value: 'video' },
        { text: 'PDF', value: 'document' },
        { text: 'Container', value: 'container' }
      ],
      form: { sections: [] }
    }
  },
  methods: {
    objectCreated: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    resetForm: function () {
      if (this.contentmodel === 'container') {
        this.createContainerForm()
      } else {
        this.createSimpleForm()
      }
    },
    createSimpleForm: function (index) {
      this.form = {
        sections: [
          {
            title: 'General metadata',
            id: 1,
            fields: []
          },
          {
            title: 'Digitized object',
            type: 'phaidra:DigitizedObject',
            id: 2,
            fields: []
          },
          {
            title: 'Subject',
            type: 'phaidra:Subject',
            id: 3,
            multiplicable: true,
            fields: []
          },
          {
            title: 'File',
            id: 4,
            type: '',
            multiplicable: false,
            fields: []
          }
        ]
      }
      this.form.sections[0].fields.push(fields.getField('resource-type'))
      this.form.sections[0].fields.push(fields.getField('title'))
      this.form.sections[0].fields.push(fields.getField('description'))
      var ethno = fields.getField('keyword')
      ethno.suggester = 'ethnographicsuggester'
      ethno.label = 'Sociocultural category'
      this.form.sections[0].fields.push(ethno)
      this.form.sections[0].fields.push(fields.getField('language'))
      this.form.sections[0].fields.push(fields.getField('role'))
      this.form.sections[0].fields.push(fields.getField('note'))
      this.form.sections[0].fields.push(fields.getField('keyword'))
      this.form.sections[0].fields.push(fields.getField('project'))
      this.form.sections[0].fields.push(fields.getField('funder'))

      this.form.sections[1].fields.push(fields.getField('shelf-mark'))
      this.form.sections[1].fields.push(fields.getField('temporal-coverage'))
      this.form.sections[1].fields.push(fields.getField('provenance'))
      this.form.sections[1].fields.push(fields.getField('physical-location'))
      this.form.sections[1].fields.push(fields.getField('accession-number'))
      this.form.sections[1].fields.push(fields.getField('condition-note'))
      this.form.sections[1].fields.push(fields.getField('reproduction-note'))
      this.form.sections[1].fields.push(fields.getField('technique-getty-aat-select'))
      this.form.sections[1].fields.push(fields.getField('technique-text'))
      this.form.sections[1].fields.push(fields.getField('material'))
      this.form.sections[1].fields.push(fields.getField('height'))
      this.form.sections[1].fields.push(fields.getField('width'))
      this.form.sections[1].fields.push(fields.getField('inscription'))
      this.form.sections[1].fields.push(fields.getField('spatial-getty-tgn'))
      var localname = fields.getField('spatial-text')
      localname.label = 'Place (native name)'
      this.form.sections[1].fields.push(localname)

      this.form.sections[2].fields.push(fields.getField('title'))
      this.form.sections[2].fields.push(fields.getField('description'))
      this.form.sections[2].fields.push(fields.getField('shelf-mark'))
      this.form.sections[2].fields.push(fields.getField('temporal-coverage'))
      this.form.sections[2].fields.push(fields.getField('provenance'))
      this.form.sections[2].fields.push(fields.getField('physical-location'))
      this.form.sections[2].fields.push(fields.getField('role'))
      this.form.sections[2].fields.push(fields.getField('accession-number'))
      this.form.sections[2].fields.push(fields.getField('technique-text'))
      this.form.sections[2].fields.push(fields.getField('material'))
      this.form.sections[2].fields.push(fields.getField('height'))
      this.form.sections[2].fields.push(fields.getField('width'))
      this.form.sections[2].fields.push(fields.getField('depth'))

      this.form.sections[3].fields.push(fields.getField('file'))
      this.form.sections[3].fields.push(fields.getField('license'))
      this.form.sections[3].fields.push(fields.getField('rights'))
    },
    createContainerForm: function (index) {
      this.createSimpleForm()
      this.form.sections[3] = {
        title: 'File',
        id: 4,
        type: 'member',
        multiplicable: true,
        fields: []
      }
      this.form.sections[3].fields.push(fields.getField('file'))
      this.form.sections[3].fields.push(fields.getField('title'))
      this.form.sections[3].fields.push(fields.getField('description'))
      this.form.sections[3].fields.push(fields.getField('mime-type'))
      this.form.sections[3].fields.push(fields.getField('digitization-note'))
      this.form.sections[3].fields.push(fields.getField('role'))
      this.form.sections[3].fields.push(fields.getField('license'))
      this.form.sections[3].fields.push(fields.getField('rights'))
    }
  },
  mounted: function () {
    this.createSimpleForm()
  }
}
</script>

<style>
.ksa-submit .v-label {
  color: rgba(0, 0, 0, 0.8) !important;
}
</style>
