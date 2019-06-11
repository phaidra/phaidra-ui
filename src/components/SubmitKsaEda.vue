<template>
  <v-container grid-list-lg class="ksa-submit" >
    <v-flex>
      <v-breadcrumbs :items="breadcrumbs" divider="/"></v-breadcrumbs>
    </v-flex>
    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Submit</v-toolbar-title>
        <v-divider class="mx-3" inset vertical></v-divider>
        <v-select
          :items="contentmodels"
          v-model="contentmodel"
          label="Object type"
          single-line
          v-on:change="resetForm($event)"
        ></v-select>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <p-i-form
          :form="form"
          v-on:load-form="form = $event"
          v-on:object-created="objectCreated($event)"
          v-on:form-input-p-select="handleSelect($event)"
          v-on:add-phaidrasubject-section="addPhaidrasubjectSection($event)"
        ></p-i-form>
      </v-card-text>
    </v-card>

  </v-container>

</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'

export default {
  name: 'submit-ksa-eda',
  computed: {
    breadcrumbs: function () {
      let bc = [
        {
          text: this.$t('Submit'),
          to: { name: 'submit', path: '/' }
        },
        {
          text: this.$t('Submit - KSA EDA'),
          disabled: true,
          to: { name: 'submit-ksa-eda', path: 'submit/ksa-eda' }
        }
      ]
      return bc
    },
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  data () {
    return {
      contentmodel: 'https://pid.phaidra.org/vocabulary/8MY0-BQDQ',
      contentmodels: [
        {
          text: 'Data',
          value: 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
        },
        {
          text: 'Picture',
          value: 'https://pid.phaidra.org/vocabulary/44TN-P1S0'
        },
        {
          text: 'Audio',
          value: 'https://pid.phaidra.org/vocabulary/8YB5-1M0J'
        },
        {
          text: 'Video',
          value: 'https://pid.phaidra.org/vocabulary/B0Y6-GYT8'
        },
        {
          text: 'Document',
          value: 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'
        },
        {
          text: 'Container',
          value: 'https://pid.phaidra.org/vocabulary/8MY0-BQDQ'
        }
      ],
      form: { sections: [] }
    }
  },
  watch: {
    contentmodel: function (val) {
      for (var i = 0; i < this.form.sections.length; i++) {
        for (var j = 0; j < this.form.sections[i].fields.length; j++) {
          if (this.form.sections[i].fields[j].predicate === 'dcterms:type') {
            this.form.sections[i].fields[j].value = this.contentmodel
            return
          }
        }
      }
    }
  },
  methods: {
    getResourceTypeFromMimeType: function (mime) {
      switch (mime) {
        case 'image/jpeg':
        case 'image/tiff':
        case 'image/gif':
        case 'image/png':
        case 'image/x-ms-bmp':
          // picture
          return 'https://pid.phaidra.org/vocabulary/44TN-P1S0'

        case 'audio/wav':
        case 'audio/mpeg':
        case 'audio/flac':
        case 'audio/ogg':
          // audio
          return 'https://pid.phaidra.org/vocabulary/8YB5-1M0J'

        case 'application/pdf':
          // document
          return 'https://pid.phaidra.org/vocabulary/69ZZ-2KGX'

        case 'video/mpeg':
        case 'video/avi':
        case 'video/mp4':
        case 'video/quicktime':
        case 'video/x-matroska':
          // video
          return 'https://pid.phaidra.org/vocabulary/B0Y6-GYT8'

        // should currently not happen, nothing else is in the selectbox
        default:
          // data
          return 'https://pid.phaidra.org/vocabulary/7AVS-Y482'
      }
    },
    handleSelect: function (val) {
      var i
      var j
      var k
      if (val.predicate === 'ebucore:hasMimeType') {
        for (i = 0; i < this.form.sections.length; i++) {
          if (this.form.sections[i].type === 'member') {
            var mime
            for (j = 0; j < this.form.sections[i].fields.length; j++) {
              if (this.form.sections[i].fields[j].predicate === 'ebucore:hasMimeType') {
                mime = this.form.sections[i].fields[j].value
              }
            }
            var resourcetype = this.getResourceTypeFromMimeType(mime)
            for (j = 0; j < this.form.sections[i].fields.length; j++) {
              if (this.form.sections[i].fields[j].predicate === 'dcterms:type') {
                var rt = this.form.sections[i].fields[j]
                rt.value = resourcetype
                var preflabels
                for (k = 0; k < this.vocabularies['resourcetype'].terms.length; k++) {
                  if (this.vocabularies['resourcetype'].terms[k]['@id'] === rt.value) {
                    preflabels = this.vocabularies['resourcetype'].terms[k]['skos:prefLabel']
                  }
                }
                rt['skos:prefLabel'] = []
                Object.entries(preflabels).forEach(([key, value]) => {
                  rt['skos:prefLabel'].push({ '@value': value, '@language': key })
                })
              }
            }
            this.form.sections.splice(i, 1, this.form.sections[i])
          }
        }
      }
    },
    objectCreated: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    resetForm: function (cm) {
      if (cm === 'https://pid.phaidra.org/vocabulary/8MY0-BQDQ') {
        this.createContainerForm()
        this.setLangGerman()
      } else {
        this.createSimpleForm()
        this.setLangGerman()
      }
    },
    setLangGerman: function () {
      for (var i = 0; i < this.form.sections.length; i++) {
        for (var j = 0; j < this.form.sections[i].fields.length; j++) {
          if (this.form.sections[i].fields[j].language === 'eng') {
            this.form.sections[i].fields[j].language = 'deu'
          }
          if (this.form.sections[i].fields[j].nameLanguage === 'eng') {
            this.form.sections[i].fields[j].nameLanguage = 'deu'
          }
          if (this.form.sections[i].fields[j].descriptionLanguage === 'eng') {
            this.form.sections[i].fields[j].descriptionLanguage = 'deu'
          }
        }
      }
    },
    createSimpleForm: function (index) {
      this.form = {
        sections: [
          {
            title: 'General metadata',
            type: 'digitalobject',
            id: 1,
            fields: []
          },
          {
            title: 'Digitized object',
            type: 'phaidra:Subject',
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
      var rt = fields.getField('resource-type')
      rt.value = this.contentmodel
      this.form.sections[0].fields.push(rt)
      this.form.sections[0].fields.push(fields.getField('title'))
      this.form.sections[0].fields.push(fields.getField('description'))
      var gnd = fields.getField('gnd-subject')
      gnd.exactvoc = 'EthnographicName'
      gnd.label = 'Soziokulturelle Kategorie (GND)'
      this.form.sections[0].fields.push(gnd)
      this.form.sections[0].fields.push(fields.getField('keyword'))
      var lang = fields.getField('language')
      lang.value = 'deu'
      this.form.sections[0].fields.push(lang)
      this.form.sections[0].fields.push(fields.getField('role'))
      this.form.sections[0].fields.push(fields.getField('note'))
      this.form.sections[0].fields.push(fields.getField('project'))
      this.form.sections[0].fields.push(fields.getField('funder'))

      this.form.sections[1].fields.push(fields.getField('title'))
      this.form.sections[1].fields.push(fields.getField('role'))
      this.form.sections[1].fields.push(fields.getField('shelf-mark'))
      this.form.sections[1].fields.push(fields.getField('temporal-coverage'))
      this.form.sections[1].fields.push(fields.getField('provenance'))
      this.form.sections[1].fields.push(fields.getField('physical-location'))
      // eingangsdatum
      var accessiondate = fields.getField('date-edtf')
      accessiondate.type = 'phaidra:dateAccessioned'
      this.form.sections[1].fields.push(accessiondate)
      this.form.sections[1].fields.push(fields.getField('accession-number'))
      this.form.sections[1].fields.push(fields.getField('condition-note'))
      this.form.sections[1].fields.push(fields.getField('reproduction-note'))
      this.form.sections[1].fields.push(fields.getField('technique-vocab'))
      this.form.sections[1].fields.push(fields.getField('technique-text'))
      this.form.sections[1].fields.push(fields.getField('material-text'))
      this.form.sections[1].fields.push(fields.getField('height'))
      this.form.sections[1].fields.push(fields.getField('width'))
      this.form.sections[1].fields.push(fields.getField('inscription'))
      this.form.sections[1].fields.push(fields.getField('spatial-getty'))
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
      // eingangsdatum
      var accessiondate2 = fields.getField('date-edtf')
      accessiondate2.type = 'phaidra:dateAccessioned'
      this.form.sections[2].fields.push(accessiondate2)
      this.form.sections[2].fields.push(fields.getField('accession-number'))
      this.form.sections[2].fields.push(fields.getField('technique-text'))
      this.form.sections[2].fields.push(fields.getField('material-text'))
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
      var rt = fields.getField('resource-type')
      rt.value = this.contentmodel
      this.form.sections[3].fields.push(rt)
      this.form.sections[3].fields.push(fields.getField('file'))
      this.form.sections[3].fields.push(fields.getField('title'))
      this.form.sections[3].fields.push(fields.getField('description'))
      var mt = fields.getField('mime-type')
      mt.required = true
      this.form.sections[3].fields.push(mt)
      this.form.sections[3].fields.push(fields.getField('digitization-note'))
      this.form.sections[3].fields.push(fields.getField('role'))
      this.form.sections[3].fields.push(fields.getField('license'))
      this.form.sections[3].fields.push(fields.getField('rights'))
    },
    addPhaidrasubjectSection: function (afterSection) {
      let s = {
        title: 'Subject',
        type: 'phaidra:Subject',
        id: this.form.sections.length + 1,
        removable: true,
        multiplicable: true,
        fields: []
      }
      this.form.sections.splice(this.form.sections.indexOf(afterSection) + 1, 0, s)
    }
  },
  mounted: function () {
    this.createContainerForm()
    this.setLangGerman()
  }
}
</script>

<style>

</style>
