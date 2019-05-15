<template>
  <v-container grid-list-lg>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Submit</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <p-i-form 
          :form="form"
          v-on:load-form="form = $event" 
          v-on:object-created="objectCreated($event)"
          v-on:form-input-p-select="handleSelect($event)"
        ></p-i-form>
      </v-card-text>
    </v-card>

  </v-container>
 
</template>

<script>
import fields from 'phaidra-vue-components/src/utils/fields'

export default {
  name: 'submit-empty',
  computed: {
    vocabularies: function () {
      return this.$store.state.vocabulary.vocabularies
    }
  },
  data () {
    return {
      contentmodel: 'https://pid.phaidra.org/vocabulary/44TN-P1S0',
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
          var mime
          if (this.form.sections[i].fields) {
            for (j = 0; j < this.form.sections[i].fields.length; j++) {
              if (this.form.sections[i].fields[j].predicate === 'ebucore:hasMimeType') {
                mime = this.form.sections[i].fields[j].value
              }
            }
          }
          var resourcetype = this.getResourceTypeFromMimeType(mime)
          if (this.form.sections[i].fields) {
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
          }
          this.form.sections.splice(i, 1, this.form.sections[i])
        }
        if (this.$store.state.settings.global.upload) {
          if (this.$store.state.settings.global.upload.accessrights) {
            if (this.$store.state.settings.global.upload.accessrights[resourcetype]) {
              for (k = 0; k < this.form.sections.length; k++) {
                if (typeof this.form.sections[k].id === 'string') {
                  if (this.form.sections[k].id.startsWith('autoaccessrights_')) {
                    this.form.sections.splice(k, 1)
                  }
                }
              }
              this.form.sections.push(
                {
                  title: 'Access rights',
                  type: 'accessrights',
                  id: 'autoaccessrights_' + resourcetype,
                  rights: this.$store.state.settings.global.upload.accessrights[resourcetype]
                }
              )
            } else {
              for (k = 0; k < this.form.sections.length; k++) {
                if (typeof this.form.sections[k].id === 'string') {
                  if (this.form.sections[k].id.startsWith('autoaccessrights_')) {
                    this.form.sections.splice(k, 1)
                  }
                }
              }
            }
          }
        }
      }
    },
    objectCreated: function (event) {
      this.$store.commit('setAlerts', [{ type: 'success', msg: 'Object ' + event + ' created' }])
      this.$router.push({ name: 'detail', params: { pid: event } })
      this.$vuetify.goTo(0)
    },
    createSimpleForm: function (index) {
      this.form = {
        sections: [
          {
            title: 'File',
            id: 1,
            type: '',
            multiplicable: false,
            fields: []
          },
          {
            title: 'General metadata',
            id: 2,
            fields: []
          },
          {
            title: 'Subject',
            type: 'phaidra:Subject',
            id: 3,
            multiplicable: true,
            fields: []
          }
        ]
      }

      this.form.sections[0].fields.push(fields.getField('file'))
      let mt = fields.getField('mime-type')
      mt.required = true
      this.form.sections[0].fields.push(mt)
      let lic = fields.getField('license')
      lic.value = 'http://rightsstatements.org/vocab/InC/1.0/'
      this.form.sections[0].fields.push(lic)

      var rt = fields.getField('resource-type')
      rt.value = this.contentmodel
      this.form.sections[1].fields.push(rt)
    }
  },
  mounted: function () {
    this.createSimpleForm()
  }
}
</script>

